"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const PASS_AMOUNTS: Record<string, number> = { day1: 49, day2: 49, dual: 79, full: 499 };
const PASS_TYPE_LABELS: Record<string, string> = { day1: "Single day pass", dual: "Dual day pass", full: "Visitor Pass" };

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

     return { ...user, registeredEventTeams };
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

export async function purchaseVisitorPass(data: {
  bookingId: string;   // User.bookingId from form; pass is assigned to the user who owns it
  name: string;
  email: string;
  phone: string;
  college: string;
  passType: string;
  sessionUserId: string; // logged-in user id, must own the bookingId
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

    const amount = PASS_AMOUNTS[passType];
    const typeLabel = PASS_TYPE_LABELS[passType];
    if (amount == null || !typeLabel) return { success: false, error: "Invalid pass type" };

    const validUntil = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const qrCode = `SP-${randomUUID()}`;
    const userBookingId = owner.bookingId!;

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

    revalidatePath("/admin");
    revalidatePath("/admin/revenue");
    revalidatePath("/profile");

    return {
      success: true,
      pass: { id: pass.id, type: pass.type, qrCode: pass.qrCode, userBookingId: pass.userBookingId ?? userBookingId },
      visitorRegistration: reg,
    };
  } catch (error: any) {
    console.error("purchaseVisitorPass error:", error);
    return { success: false, error: error?.message || "Purchase failed" };
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

// --- Event team registration (/events) ---
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
  try {
    const { teamName, leaderName, leaderEmail, leaderPhone, college, bookingId, eventName, eventPrice, members, totalAmount, paymentProofUrl } = data;
    if (!teamName?.trim() || !leaderName?.trim() || !leaderEmail?.trim() || !leaderPhone?.trim() || !college?.trim() || !bookingId?.trim() || !eventName?.trim()) {
      return { success: false, error: "Team leader details, booking ID and event are required" };
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
        status: "pending",
        paymentProofUrl: paymentProofUrl || null,
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
    console.error("registerEventTeam error:", error);
    return { success: false, error: error?.message || "Registration failed" };
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
