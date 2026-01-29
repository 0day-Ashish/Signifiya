"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { APP_CONFIG, PassType } from "@/config/app.config";
import { getCache, setCache, deleteCache, CacheKeys, CACHE_TTL } from "@/lib/cache";

const PASS_AMOUNTS = APP_CONFIG.passPrices;
const PASS_TYPE_LABELS = APP_CONFIG.passTypeLabels;

export async function uploadAvatar(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const bucketName = process.env.S3_BUCKET_NAME || "avatars";
    const endpoint =
      process.env.S3_ENDPOINT ||
      (process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/storage/v1/s3`
        : "");

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);

    let publicUrl = "";
    if (endpoint && endpoint.includes("supabase.co")) {
       const baseUrl = endpoint.replace("/s3", "/object/public");
       publicUrl = `${baseUrl}/${bucketName}/${fileName}`;
    } else {
       publicUrl = `${endpoint}/${bucketName}/${fileName}`;
    }

    return { success: true, url: publicUrl };
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
  }
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
     
     // Try cache first
     const cached = await getCache<any>(cacheKey);
     if (cached) {
       return cached;
     }

     let user = await prisma.user.findUnique({
       where: { id: userId },
       include: {
         // @ts-ignore
         registeredEvents: true,
         // @ts-ignore
         generatedPasses: true
       }
     });
     if (!user) return null;

     // Assign unique bookingId on first profile load (right after account creation effect)
     if (!user.bookingId) {
       const bid = generateUserBookingId();
       try {
         await prisma.user.update({ where: { id: userId }, data: { bookingId: bid } });
         user = { ...user, bookingId: bid };
         // Invalidate cache since bookingId was just assigned
         await deleteCache(cacheKey);
       } catch (e: any) {
         if (e?.code === "P2002") {
           const u = await prisma.user.findUnique({ where: { id: userId }, select: { bookingId: true } });
           if (u?.bookingId) user = { ...user, bookingId: u.bookingId };
         }
       }
     }

     // Registered event teams (ParticipantTeam where leaderBookingId = user.bookingId)
     let registeredEventTeams: { id: string; teamName: string; eventName: string; eventDate: Date | null; status: string; qrCode: string | null; leaderBookingId: string | null; leaderName: string; members: { name: string }[] }[] = [];
     if (user.bookingId) {
       const teams = await prisma.participantTeam.findMany({
         where: { leaderBookingId: { equals: user.bookingId!, mode: "insensitive" } },
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

     const profile = { ...user, registeredEventTeams };
     
     // Cache for 5 minutes (user-specific data)
     await setCache(cacheKey, profile, CACHE_TTL.MEDIUM);

     return profile;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
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
  try {
    const { bookingId: rawBookingId, name, email, phone, college, passType, sessionUserId } = data;
    const bid = rawBookingId?.trim();
    if (!bid || !name?.trim() || !email?.trim() || !phone?.trim() || !college?.trim() || !passType || !sessionUserId) {
      return { success: false, error: "All fields including Booking ID and login are required" };
    }

    const owner = await prisma.user.findUnique({ where: { bookingId: bid } });
    if (!owner) return { success: false, error: "Invalid Booking ID" };
    if (owner.id !== sessionUserId) return { success: false, error: "This Booking ID does not belong to your account" };

    // Type guard to ensure passType is valid
    if (!(passType in PASS_AMOUNTS)) {
      return { success: false, error: "Invalid pass type" };
    }

    const amount = PASS_AMOUNTS[passType as PassType];
    const typeLabel = PASS_TYPE_LABELS[passType as PassType];
    if (amount == null || !typeLabel) return { success: false, error: "Invalid pass type" };

    // Import Razorpay dynamically
    let Razorpay: any;
    try {
      // @ts-ignore - Razorpay types will be available after npm install
      Razorpay = (await import("razorpay")).default;
    } catch (error) {
      return { success: false, error: "Razorpay package not installed. Please run: npm install razorpay" };
    }
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `SGF26-${randomUUID().slice(0, 8).toUpperCase()}`,
      notes: {
        bookingId: bid,
        passType,
        userId: sessionUserId,
        name: name.trim(),
        email: email.trim(),
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount,
      currency: "INR",
    };
  } catch (error: any) {
    console.error("createRazorpayOrder error:", error);
    return { success: false, error: error?.message || "Failed to create order" };
  }
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
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId: rawBookingId,
      name,
      email,
      phone,
      college,
      passType,
      sessionUserId,
    } = data;

    const bid = rawBookingId?.trim();
    if (!bid || !name?.trim() || !email?.trim() || !phone?.trim() || !college?.trim() || !passType || !sessionUserId) {
      return { success: false, error: "All fields are required" };
    }

    const owner = await prisma.user.findUnique({ where: { bookingId: bid } });
    if (!owner) return { success: false, error: "Invalid Booking ID" };
    if (owner.id !== sessionUserId) return { success: false, error: "This Booking ID does not belong to your account" };

    // Verify payment signature
    const crypto = await import("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "");
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return { success: false, error: "Payment verification failed" };
    }

    // Type guard to ensure passType is valid
    if (!(passType in PASS_AMOUNTS)) {
      return { success: false, error: "Invalid pass type" };
    }

    const amount = PASS_AMOUNTS[passType as PassType];
    const typeLabel = PASS_TYPE_LABELS[passType as PassType];
    if (amount == null || !typeLabel) return { success: false, error: "Invalid pass type" };

    const validUntil = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const qrCode = `SP-${randomUUID()}`;
    const userBookingId = owner.bookingId!;

    // Create visitor registration
    const reg = await prisma.visitorRegistration.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: college.trim(),
        passType,
        amount,
        status: "verified",
        userId: owner.id,
        userBookingId,
      },
    });

    // Create pass
    const pass = await prisma.pass.create({
      data: {
        userBookingId,
        type: typeLabel,
        qrCode,
        validUntil,
        userId: owner.id,
        visitorRegistrationId: reg.id,
      },
    });

    // Invalidate caches for real-time updates
    await invalidateUserProfileCache(owner.id);

    revalidatePath("/admin");
    revalidatePath("/admin/revenue");
    revalidatePath("/profile");

    return {
      success: true,
      pass: { id: pass.id, type: pass.type, qrCode: pass.qrCode, userBookingId: pass.userBookingId ?? userBookingId },
      visitorRegistration: reg,
    };
  } catch (error: any) {
    console.error("verifyRazorpayPayment error:", error);
    return { success: false, error: error?.message || "Payment verification failed" };
  }
}

/**
 * Legacy function - kept for backward compatibility
 * Now redirects to payment flow
 */
export async function purchaseVisitorPass(data: {
  bookingId: string;   
  name: string;
  email: string;
  phone: string;
  college: string;
  passType: string;
  sessionUserId: string; 
}) {
  // This function is now deprecated - use createRazorpayOrder instead
  return { success: false, error: "Please use the payment flow" };
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
  members: { name?: string; college?: string; phone?: string; email?: string }[];
  totalAmount: number;
}) {
  try {
    const { teamName, leaderName, leaderEmail, leaderPhone, college, bookingId, eventName, totalAmount } = data;
    if (!teamName?.trim() || !leaderName?.trim() || !leaderEmail?.trim() || !leaderPhone?.trim() || !college?.trim() || !bookingId?.trim() || !eventName?.trim()) {
      return { success: false, error: "Team leader details, booking ID and event are required" };
    }

    // Import Razorpay dynamically
    let Razorpay: any;
    try {
      // @ts-ignore - Razorpay types will be available after npm install
      Razorpay = (await import("razorpay")).default;
    } catch (error) {
      return { success: false, error: "Razorpay package not installed. Please run: npm install razorpay" };
    }
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `EVT-${randomUUID().slice(0, 8).toUpperCase()}`,
      notes: {
        bookingId: bookingId.trim(),
        teamName: teamName.trim(),
        eventName: eventName.trim(),
        leaderEmail: leaderEmail.trim(),
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount: totalAmount,
      currency: "INR",
    };
  } catch (error: any) {
    console.error("createEventRazorpayOrder error:", error);
    return { success: false, error: error?.message || "Failed to create order" };
  }
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
  members: { name?: string; college?: string; phone?: string; email?: string }[];
  totalAmount: number;
}) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      college,
      bookingId,
      eventName,
      eventPrice,
      members,
      totalAmount,
    } = data;

    if (!teamName?.trim() || !leaderName?.trim() || !leaderEmail?.trim() || !leaderPhone?.trim() || !college?.trim() || !bookingId?.trim() || !eventName?.trim()) {
      return { success: false, error: "Team leader details, booking ID and event are required" };
    }

    // Verify payment signature
    const crypto = await import("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "");
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return { success: false, error: "Payment verification failed" };
    }

    const qrCode = `EP-${randomUUID()}`;
    const eventTime = "10:00 AM - 5:00 PM";

    let event = await prisma.event.findFirst({ where: { name: eventName } });
    if (!event) {
      event = await prisma.event.create({
        data: { name: eventName, price: eventPrice, date: new Date() },
      });
    }

    const team = await prisma.participantTeam.create({
      data: {
        teamName: teamName.trim(),
        leaderName: leaderName.trim(),
        leaderEmail: leaderEmail.trim().toLowerCase(),
        leaderPhone: leaderPhone.trim(),
        leaderBookingId: bookingId.trim(),
        college: college.trim(),
        totalAmount: Number(totalAmount) || 0,
        status: "verified",
        paymentProofUrl: null,
        qrCode,
        eventTime,
      },
    });

    for (const m of members || []) {
      if (!m?.name?.trim()) continue;
      await prisma.participantTeamMember.create({
        data: {
          teamId: team.id,
          name: m.name.trim(),
          college: m.college?.trim() || null,
          phone: m.phone?.trim() || null,
          email: m.email?.trim() || null,
        },
      });
    }

    await prisma.participantTeamEvent.create({
      data: { teamId: team.id, eventId: event.id },
    });

    // Invalidate admin stats cache
    const { invalidateAdminStatsCache } = await import("./admin/actions");
    await invalidateAdminStatsCache();

    revalidatePath("/admin");
    revalidatePath("/admin/teams");
    revalidatePath("/admin/events");
    revalidatePath("/admin/revenue");
    revalidatePath("/events");

    const memberNames = (members || []).filter((m) => m?.name?.trim()).map((m) => ({ name: m!.name!.trim() }));

    return {
      success: true,
      pass: {
        teamLeadName: leaderName.trim(),
        eventName,
        bookingId: bookingId.trim(),
        teamName: teamName.trim(),
        eventTime,
        qrCode,
        members: memberNames,
      },
    };
  } catch (error: any) {
    console.error("verifyEventRazorpayPayment error:", error);
    return { success: false, error: error?.message || "Payment verification failed" };
  }
}

/**
 * Legacy function - kept for backward compatibility
 * Now redirects to payment flow
 */
export async function registerEventTeam(data: {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  bookingId: string;
  eventName: string;
  eventPrice: number;
  members: { name?: string; college?: string; phone?: string; email?: string }[];
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
    const hasDualDayPass = passes.some(p =>
      p.type.toLowerCase().includes("dual") ||
      p.type.toLowerCase().includes("double")
    );
    const hasSingleDayPass = passes.some(p =>
      p.type.toLowerCase().includes("single") ||
      p.type.toLowerCase().includes("day 1") ||
      p.type.toLowerCase().includes("day 2")
    );

    // Check for event registrations
    let hasEventPass = false;
    if (user.bookingId) {
      const eventTeams = await prisma.participantTeam.findFirst({
        where: { leaderBookingId: { equals: user.bookingId, mode: "insensitive" } },
      });
      hasEventPass = !!eventTeams;
    }

    return {
      hasVisitorPass,
      hasDualDayPass,
      hasSingleDayPass,
      hasEventPass,
      passCount: passes.length,
      passes: passes.map(p => ({ id: p.id, type: p.type })),
    };
  } catch (error) {
    console.error("getUserPassStatus error:", error);
    return null;
  }
}

export async function subscribeNewsletter(data: { email: string; consent: boolean }) {
  try {
    const email = data.email?.trim();
    if (!email) {
      return { success: false, error: "Email is required" };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }
    if (!data.consent) {
      return { success: false, error: "Please agree to receive communications" };
    }

    await prisma.newsletterSubscription.create({
      data: { email: email.toLowerCase(), consent: data.consent },
    });
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "This email is already subscribed" };
    }
    console.error("Subscribe newsletter error:", error);
    return { success: false, error: error?.message || "Something went wrong" };
  }
}
