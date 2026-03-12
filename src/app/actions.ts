"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { r2Client, getR2PublicUrl, R2_BUCKET } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { optimizeImage, buildStorageKey } from "@/lib/image-optimizer";
import { APP_CONFIG, PassType } from "@/config/app.config";
import { getSession } from "@/lib/auth-server";
import {
  getCache,
  setCache,
  deleteCache,
  CacheKeys,
  CACHE_TTL,
} from "@/lib/cache";

const PASS_AMOUNTS = APP_CONFIG.passPrices;
const PASS_TYPE_LABELS = APP_CONFIG.passTypeLabels;

export async function uploadAvatar(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // Optimise: resize to 200×200, convert to WebP, 80% quality, strip EXIF
    const { buffer, contentType } = await optimizeImage(
      rawBuffer,
      file.type,
      "avatar",
    );

    const key = buildStorageKey("avatar", file.name);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const url = getR2PublicUrl(key);
    return { success: true, url };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}

export async function invalidateUserProfileCache(userId: string) {
  await deleteCache(CacheKeys.userProfile(userId));
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    image?: string;
    gender?: string;
    collegeName?: string;
    mobileNo?: string;
  },
) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.image && { image: data.image }),
        ...(data.gender && { gender: data.gender }),
        ...(data.collegeName && { collegeName: data.collegeName }),
        ...(data.mobileNo && { mobileNo: data.mobileNo }),
      },
    });

    // Invalidate user profile cache for real-time updates
    await invalidateUserProfileCache(userId);

    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }
}

function generateUserBookingId() {
  return `SGF26-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function getUserProfile(userId: string) {
  try {
    if (!userId) return null;

    const cacheKey = CacheKeys.userProfile(userId);

    // Try cache first (profile info only — events/passes are fetched separately in real-time)
    const cached = await getCache<any>(cacheKey);
    if (cached) {
      return cached;
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return null;

    // Assign unique bookingId on first profile load (right after account creation effect)
    if (!user.bookingId) {
      const bid = generateUserBookingId();
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { bookingId: bid },
        });
        user = { ...user, bookingId: bid };
        // Invalidate cache since bookingId was just assigned
        await deleteCache(cacheKey);
      } catch (e: any) {
        if (e?.code === "P2002") {
          const u = await prisma.user.findUnique({
            where: { id: userId },
            select: { bookingId: true },
          });
          if (u?.bookingId) user = { ...user, bookingId: u.bookingId };
        }
      }
    }

    const profile = { ...user };

    // Cache profile info for 5 minutes
    await setCache(cacheKey, profile, CACHE_TTL.MEDIUM);

    return profile;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

/**
 * Get user's registered event teams and passes — always fetched fresh (no cache)
 */
export async function getUserEventsAndPasses(userId: string) {
  try {
    if (!userId) return { registeredEventTeams: [], generatedPasses: [] };

    // Get user's bookingId for team lookup
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        bookingId: true,
        // @ts-ignore
        generatedPasses: {
          include: {
            visitorRegistration: true,
          },
        },
      },
    });
    if (!user) return { registeredEventTeams: [], generatedPasses: [] };

    // Registered event teams (ParticipantTeam where leaderBookingId = user.bookingId)
    let registeredEventTeams: {
      id: string;
      teamName: string;
      eventName: string;
      eventDate: Date | null;
      status: string;
      qrCode: string | null;
      leaderBookingId: string | null;
      leaderName: string;
      members: { name: string }[];
    }[] = [];
    if (user.bookingId) {
      const teams = await prisma.participantTeam.findMany({
        where: {
          leaderBookingId: { equals: user.bookingId!, mode: "insensitive" },
        },
        include: { events: { include: { event: true } }, members: true },
        orderBy: { createdAt: "desc" },
      });
      registeredEventTeams = teams.map((t) => {
        const ev = t.events[0]?.event;
        return {
          id: t.id,
          teamName: t.teamName,
          eventName: ev?.name ?? "Event",
          eventDate: ev?.date ?? null,
          status: t.status,
          qrCode: t.qrCode,
          leaderBookingId: t.leaderBookingId,
          leaderName: t.leaderName,
          members: t.members.map((m) => ({ name: m.name })),
        };
      });
    }

    return {
      registeredEventTeams,
      generatedPasses: (user as any).generatedPasses ?? [],
    };
  } catch (error) {
    console.error("Get events/passes error:", error);
    return { registeredEventTeams: [], generatedPasses: [] };
  }
}

/**
 * Create Razorpay order for visitor pass
 */
export async function createRazorpayOrder(data: {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  passType: string;
  sessionUserId: string;
}) {
  // Razorpay integration has been disabled. Use manual UTR submission flow instead.
  return {
    success: false,
    error: "Razorpay disabled. Please use manual UTR payment flow.",
  };
}

/**
 * Verify Razorpay payment and create visitor pass
 */
export async function verifyRazorpayPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  passType: string;
  sessionUserId: string;
}) {
  // Razorpay integration has been disabled. Use manual UTR submission.
  return { success: false, error: "Razorpay disabled. Use manual UTR flow." };
}

/**
 * Legacy function - kept for backward compatibility
 * Now redirects to payment flow
 */
export async function submitVisitorRegistration(data: {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  passType: string;
  sessionUserId: string;
  utrId: string;
}) {
  try {
    const {
      bookingId: rawBookingId,
      name,
      email,
      phone,
      college,
      passType,
      sessionUserId,
      utrId,
    } = data;
    const bid = rawBookingId?.trim();

    if (
      !bid ||
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !college?.trim() ||
      !passType ||
      !sessionUserId ||
      !utrId?.trim()
    ) {
      return {
        success: false,
        error: "All fields including Transaction/UTR ID are required",
      };
    }

    const owner = await prisma.user.findUnique({ where: { bookingId: bid } });
    if (!owner) return { success: false, error: "Invalid Booking ID" };
    if (owner.id !== sessionUserId)
      return {
        success: false,
        error: "This Booking ID does not belong to your account",
      };

    // Type guard to ensure passType is valid
    if (!(passType in PASS_AMOUNTS)) {
      return { success: false, error: "Invalid pass type" };
    }

    const amount = PASS_AMOUNTS[passType as PassType];
    const typeLabel = PASS_TYPE_LABELS[passType as PassType];
    if (amount == null || !typeLabel)
      return { success: false, error: "Invalid pass type" };

    const userBookingId = owner.bookingId!;

    // Create visitor registration with PENDING status
    const reg = await prisma.visitorRegistration.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: college.trim(),
        passType,
        amount,
        status: "pending", // Manual verification required
        paymentProofUrl: utrId.trim(), // Storing UTR as proof URL for now
        userId: owner.id,
        userBookingId,
      },
    });

    // Invalidate caches for real-time updates
    await invalidateUserProfileCache(owner.id);

    revalidatePath("/admin");
    revalidatePath("/admin/revenue");
    revalidatePath("/profile");

    return {
      success: true,
      visitorRegistration: reg,
    };
  } catch (error: any) {
    console.error("submitVisitorRegistration error:", error);
    // Check for unique constraint violation on bookingId if applicable, though we removed unique constraint on bookingId in VisitorRegistration in schema logic previously or it might still be there.
    // Schema says: bookingId String? @unique // legacy per-reg id.
    // We are NOT setting legacy bookingId here, so it should be fine.
    return { success: false, error: error?.message || "Registration failed" };
  }
}

export async function submitIssue(data: {
  text: string;
  email?: string;
  name?: string;
}) {
  try {
    if (!data.text || data.text.trim().length === 0) {
      return { success: false, error: "Issue text is required" };
    }

    const issue = await prisma.issue.create({
      data: {
        text: data.text.trim(),
        email: data.email?.trim() || null,
        name: data.name?.trim() || null,
      },
    });

    return { success: true, issue };
  } catch (error: any) {
    console.error("Submit issue error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create Razorpay order for event team registration
 */
export async function createEventRazorpayOrder(data: {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  bookingId: string;
  eventName: string;
  eventPrice: number;
  members: {
    name?: string;
    college?: string;
    phone?: string;
    email?: string;
  }[];
  totalAmount: number;
}) {
  // Razorpay integration disabled. Use manual UTR submission instead.
  return {
    success: false,
    error: "Razorpay disabled. Use manual UTR payment flow.",
  };
}

/**
 * Verify Razorpay payment and create event team registration
 */
export async function verifyEventRazorpayPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  bookingId: string;
  eventName: string;
  eventPrice: number;
  members: {
    name?: string;
    college?: string;
    phone?: string;
    email?: string;
  }[];
  totalAmount: number;
}) {
  // Razorpay disabled. Use manual UTR registration flow instead.
  return { success: false, error: "Razorpay disabled. Use manual UTR flow." };
}

/**
 * Manual Event Registration with UTR
 */
export async function submitEventRegistrationManual(data: {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderGameId?: string;
  college: string;
  bookingId: string;
  eventName: string;
  eventPrice: number;
  members: {
    name?: string;
    college?: string;
    phone?: string;
    email?: string;
    gameId?: string;
  }[];
  totalAmount: number;
  utrId: string;
}) {
  try {
    const {
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      leaderGameId,
      college,
      bookingId,
      eventName,
      eventPrice,
      members,
      totalAmount,
      utrId,
    } = data;

    if (
      !teamName?.trim() ||
      !leaderName?.trim() ||
      !leaderEmail?.trim() ||
      !leaderPhone?.trim() ||
      !college?.trim() ||
      !bookingId?.trim() ||
      !eventName?.trim() ||
      !utrId?.trim()
    ) {
      return {
        success: false,
        error: "All fields including UTR ID are required",
      };
    }

    const qrCode = `EP-${randomUUID()}`;
    const eventTime = "10:00 AM - 5:00 PM";

    // Find or create event (ensure event exists)
    let event = await prisma.event.findFirst({ where: { name: eventName } });
    if (!event) {
      event = await prisma.event.create({
        data: { name: eventName, price: eventPrice, date: new Date() },
      });
    }

    // Create Team with PENDING status
    const team = await prisma.participantTeam.create({
      data: {
        teamName: teamName.trim(),
        leaderName: leaderName.trim(),
        leaderEmail: leaderEmail.trim().toLowerCase(),
        leaderPhone: leaderPhone.trim(),
        leaderBookingId: bookingId.trim(),
        college: college.trim(),
        totalAmount: Number(totalAmount) || 0,
        status: "pending", // Pending manual verification
        paymentProofUrl: utrId.trim(),
        qrCode,
        eventTime,
      },
    });

    // Add Members (including leader as first member)
    if (leaderGameId?.trim()) {
      await prisma.participantTeamMember.create({
        data: {
          teamId: team.id,
          name: leaderName.trim(),
          college: college.trim(),
          phone: leaderPhone.trim(),
          email: leaderEmail.trim().toLowerCase(),
          gameId: leaderGameId.trim(),
        },
      });
    }

    for (const m of members || []) {
      if (!m?.name?.trim()) continue;
      await prisma.participantTeamMember.create({
        data: {
          teamId: team.id,
          name: m.name.trim(),
          college: m.college?.trim() || null,
          phone: m.phone?.trim() || null,
          email: m.email?.trim() || null,
          gameId: m.gameId?.trim() || null,
        },
      });
    }

    // Link Team to Event
    await prisma.participantTeamEvent.create({
      data: {
        teamId: team.id,
        eventId: event.id,
      },
    });

    // Invalidate caches
    revalidatePath("/admin/revenue");
    revalidatePath("/profile");

    return {
      success: true,
      teamId: team.id,
    };
  } catch (error: any) {
    console.error("submitEventRegistrationManual error:", error);
    return { success: false, error: error?.message || "Registration failed" };
  }
}

export async function submitReelRegistration(data: {
  teamName: string;
  leaderName: string;
  leaderPhone: string;
  leaderEmail: string;
  instagramId: string;
  institutionName: string;
  department?: string;
  reelLink?: string;
  leaderBookingId: string;
}) {
  try {
    const {
      teamName,
      leaderName,
      leaderPhone,
      leaderEmail,
      instagramId,
      institutionName,
      department,
      reelLink,
      leaderBookingId,
    } = data;

    if (
      !teamName?.trim() ||
      !leaderName?.trim() ||
      !leaderPhone?.trim() ||
      !leaderEmail?.trim() ||
      !instagramId?.trim() ||
      !institutionName?.trim() ||
      !leaderBookingId?.trim()
    ) {
      return { success: false, error: "All required fields must be filled" };
    }

    const eventName = "Reel Making Competition";
    const college = department?.trim()
      ? `${institutionName.trim()} - ${department.trim()}`
      : institutionName.trim();
    const qrCode = `EP-${randomUUID()}`;

    let event = await prisma.event.findFirst({ where: { name: eventName } });
    if (!event) {
      event = await prisma.event.create({
        data: { name: eventName, price: 0, date: new Date() },
      });
    }

    const team = await prisma.participantTeam.create({
      data: {
        teamName: teamName.trim(),
        leaderName: leaderName.trim(),
        leaderEmail: leaderEmail.trim().toLowerCase(),
        leaderPhone: leaderPhone.trim(),
        leaderBookingId: leaderBookingId.trim(),
        college,
        totalAmount: 0,
        status: "pending",
        paymentProofUrl: reelLink?.trim() || "FREE",
        qrCode,
        eventTime: "24/7 (Submission window)",
      },
    });

    // Store Instagram ID as leader member's gameId
    await prisma.participantTeamMember.create({
      data: {
        teamId: team.id,
        name: leaderName.trim(),
        college,
        phone: leaderPhone.trim(),
        email: leaderEmail.trim().toLowerCase(),
        gameId: instagramId.trim(),
      },
    });

    await prisma.participantTeamEvent.create({
      data: { teamId: team.id, eventId: event.id },
    });

    revalidatePath("/admin/revenue");
    revalidatePath("/profile");

    return { success: true, teamId: team.id };
  } catch (error: any) {
    console.error("submitReelRegistration error:", error);
    return { success: false, error: error?.message || "Registration failed" };
  }
}
export async function registerEventTeam(data: {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  bookingId: string;
  eventName: string;
  eventPrice: number;
  members: {
    name?: string;
    college?: string;
    phone?: string;
    email?: string;
  }[];
  totalAmount: number;
  paymentProofUrl?: string | null;
}) {
  // This function is now deprecated - use createEventRazorpayOrder instead
  return { success: false, error: "Please use the payment flow" };
}

/**
 * Get user's pass and event registration status
 * Used to determine what options to show on the home page
 */
export async function getUserPassStatus(userId: string) {
  try {
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        generatedPasses: true,
      },
    });

    if (!user) return null;

    // Check for visitor passes
    const passes = user.generatedPasses || [];
    const hasVisitorPass = passes.length > 0;
    const hasDualDayPass = passes.some(
      (p) =>
        p.type.toLowerCase().includes("dual") ||
        p.type.toLowerCase().includes("double"),
    );
    const hasSingleDayPass = passes.some(
      (p) =>
        p.type.toLowerCase().includes("single") ||
        p.type.toLowerCase().includes("day 1") ||
        p.type.toLowerCase().includes("day 2"),
    );

    // Check for event registrations
    let hasEventPass = false;
    if (user.bookingId) {
      const eventTeams = await prisma.participantTeam.findFirst({
        where: {
          leaderBookingId: { equals: user.bookingId, mode: "insensitive" },
        },
      });
      hasEventPass = !!eventTeams;
    }

    return {
      hasVisitorPass,
      hasDualDayPass,
      hasSingleDayPass,
      hasEventPass,
      passCount: passes.length,
      passes: passes.map((p) => ({ id: p.id, type: p.type })),
    };
  } catch (error) {
    console.error("getUserPassStatus error:", error);
    return null;
  }
}
