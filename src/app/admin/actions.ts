"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { getCache, setCache, deleteCache, CacheKeys, CACHE_TTL } from "@/lib/cache";

// --- Auth guard: all functions return null or throw if not admin ---
async function guard() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized: admin access required");
  return session;
}

// --- Dashboard stats ---
export async function getAdminDashboardStats() {
  await guard();
  const cacheKey = CacheKeys.adminStats();

  // Try cache first
  const cached = await getCache<{
    userCount: number;
    visitorCount: number;
    teamCount: number;
    issueCount: number;
    newsletterCount: number;
    totalRevenue: number;
    visitorRevenue: number;
    teamRevenue: number;
  }>(cacheKey, process.env.NODE_ENV === "development");

  if (cached) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[CACHE] Admin stats served from cache`);
    }
    return cached;
  }

  // Fetch from database
  const [userCount, visitorCount, teamCount, issueCount, newsletterCount, visitorRevenue, teamRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.visitorRegistration.count(),
    prisma.participantTeam.count(),
    prisma.issue.count(),
    prisma.newsletterSubscription.count(),
    prisma.visitorRegistration.aggregate({ where: { status: "verified" }, _sum: { amount: true } }),
    prisma.participantTeam.aggregate({ where: { status: "verified" }, _sum: { totalAmount: true } }),
  ]);
  const totalRevenue = (visitorRevenue._sum.amount || 0) + (teamRevenue._sum.totalAmount || 0);

  const stats = {
    userCount,
    visitorCount,
    teamCount,
    issueCount,
    newsletterCount,
    totalRevenue,
    visitorRevenue: visitorRevenue._sum.amount || 0,
    teamRevenue: teamRevenue._sum.totalAmount || 0,
  };

  // Cache for 15 minutes
  await setCache(cacheKey, stats, 900, process.env.NODE_ENV === "development");

  if (process.env.NODE_ENV === "development") {
    console.log(`[CACHE] Admin stats cached for 900s`);
  }

  return stats;
}

/**
 * Invalidate admin dashboard stats cache
 * Call this when stats change (new user, payment verified, etc.)
 */
export async function invalidateAdminStatsCache() {
  await deleteCache(CacheKeys.adminStats());
  await deleteCache(CacheKeys.adminRevenue());
}

// --- Users ---
const userSearchWhere = (q: string) => ({
  OR: [
    { name: { contains: q, mode: "insensitive" as const } },
    { email: { contains: q, mode: "insensitive" as const } },
    { bookingId: { contains: q, mode: "insensitive" as const } },
  ],
});

export async function getUserSuggestions(query: string) {
  await guard();
  const q = query.trim();
  if (!q || q.length < 2) return [];
  return prisma.user.findMany({
    where: userSearchWhere(q),
    select: { id: true, name: true, email: true, bookingId: true, role: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function getUsers(params?: { search?: string; limit?: number; offset?: number }) {
  await guard();
  const where = params?.search ? userSearchWhere(params.search) : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, bookingId: true, collegeName: true, mobileNo: true, image: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: params?.limit ?? 100,
      skip: params?.offset ?? 0,
    }),
    prisma.user.count({ where }),
  ]);
  return { users, total };
}

/**
 * Promote a user to admin by setting their role to "admin"
 */
export async function promoteUserToAdmin(userId: string) {
  await guard();
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: "admin" },
      select: { id: true, email: true, name: true, role: true },
    });
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error: any) {
    console.error("Promote user to admin error:", error);
    return { success: false, error: error.message || "Failed to promote user" };
  }
}

/**
 * Remove admin access from a user
 */
export async function removeAdminAccess(userId: string) {
  await guard();
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: null },
      select: { id: true, email: true, name: true, role: true },
    });
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error: any) {
    console.error("Remove admin access error:", error);
    return { success: false, error: error.message || "Failed to remove admin access" };
  }
}

// --- Events + per-event registrations ---
export async function getEvents() {
  await guard();
  return prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { participantTeams: true } } },
  });
}

export async function getEventWithRegistrations(
  eventId: string,
  params?: { limit?: number; offset?: number }
) {
  await guard();
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  const [event, total] = await Promise.all([
    prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participantTeams: {
          include: {
            team: { include: { members: true } },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        },
      },
    }),
    prisma.participantTeamEvent.count({ where: { eventId } }),
  ]);
  return { event, total };
}

// --- Teams (participant + organizing) ---
export async function getParticipantTeams(params?: { limit?: number; offset?: number }) {
  await guard();
  const [teams, total] = await Promise.all([
    prisma.participantTeam.findMany({
      include: { members: true, events: { include: { event: true } } },
      orderBy: { createdAt: "desc" },
      take: params?.limit ?? 100,
      skip: params?.offset ?? 0,
    }),
    prisma.participantTeam.count(),
  ]);
  return { teams, total };
}

export async function getOrganizingMembers() {
  await guard();
  return prisma.organizingMember.findMany({ orderBy: { order: "asc" } });
}

export async function createOrganizingMember(data: { name: string; role: string; category: string; image?: string; order?: number }) {
  await guard();
  const m = await prisma.organizingMember.create({ data });
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
  return m;
}

export async function updateOrganizingMember(id: string, data: Partial<{ name: string; role: string; category: string; image: string; order: number }>) {
  await guard();
  const m = await prisma.organizingMember.update({ where: { id }, data });
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
  return m;
}

export async function deleteOrganizingMember(id: string) {
  await guard();
  await prisma.organizingMember.delete({ where: { id } });
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
}

// --- Revenue ---
export async function getRevenueBreakdown() {
  await guard();
  const cacheKey = CacheKeys.adminRevenue();

  // Try cache first
  const cached = await getCache<{
    visitor: { total: number; count: number };
    team: { total: number; count: number };
    grandTotal: number;
  }>(cacheKey);

  if (cached) {
    return cached;
  }

  // Fetch from database
  const [visitorAgg, teamAgg] = await Promise.all([
    prisma.visitorRegistration.aggregate({
      _sum: { amount: true },
      _count: true,
      where: { status: "verified" },
    }),
    prisma.participantTeam.aggregate({
      _sum: { totalAmount: true },
      _count: true,
      where: { status: "verified" },
    }),
  ]);

  const revenue = {
    visitor: { total: visitorAgg._sum.amount || 0, count: visitorAgg._count },
    team: { total: teamAgg._sum.totalAmount || 0, count: teamAgg._count },
    grandTotal: (visitorAgg._sum.amount || 0) + (teamAgg._sum.totalAmount || 0),
  };

  // Cache for 5 minutes
  await setCache(cacheKey, revenue, CACHE_TTL.MEDIUM);

  return revenue;
}

export async function getParticipantTeamsForRevenue(params?: { limit?: number; offset?: number }) {
  await guard();
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  const [teams, total] = await Promise.all([
    prisma.participantTeam.findMany({
      select: { id: true, teamName: true, leaderEmail: true, totalAmount: true, status: true, paymentProofUrl: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.participantTeam.count(),
  ]);
  return { teams, total };
}

// --- Newsletter subscriptions ---
export async function getNewsletterSubscriptions(params?: { limit?: number; offset?: number }) {
  await guard();
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  const [subscriptions, total] = await Promise.all([
    prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: { id: true, email: true, consent: true, createdAt: true },
    }),
    prisma.newsletterSubscription.count(),
  ]);
  return { subscriptions, total };
}

// --- Issues (contact page reports) ---
export async function getIssues(params?: { resolved?: boolean; limit?: number; offset?: number }) {
  await guard();
  const where = params?.resolved !== undefined ? { resolved: params.resolved } : {};
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  const [issues, total] = await Promise.all([
    prisma.issue.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.issue.count({ where }),
  ]);
  return { issues, total };
}

export async function updateIssueResolved(id: string, resolved: boolean) {
  await guard();
  const i = await prisma.issue.update({ where: { id }, data: { resolved } });
  revalidatePath("/admin/issues");
  return i;
}

// --- Visitor registrations (for admin tables) ---
export async function getVisitorRegistrations(params?: { limit?: number; offset?: number; status?: string }) {
  await guard();
  const where = params?.status ? { status: params.status } : {};
  const [list, total] = await Promise.all([
    prisma.visitorRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params?.limit ?? 100,
      skip: params?.offset ?? 0,
    }),
    prisma.visitorRegistration.count({ where }),
  ]);
  return { list, total };
}

// --- Update status for revenue/verification ---
// --- Update status for revenue/verification ---
export async function updateVisitorStatus(id: string, status: "pending" | "verified" | "rejected") {
  await guard();

  // 1. Update status
  const registration = await prisma.visitorRegistration.update({
    where: { id },
    data: { status },
  });

  // 2. If verified, create Pass
  if (status === "verified" && registration.userId) {
    // Check if pass already exists to avoid duplicates
    const existingPass = await prisma.pass.findFirst({
      where: {
        visitorRegistrationId: id
      }
    });

    if (!existingPass) {
      const { APP_CONFIG } = await import('@/config/app.config');
      const passTypeLabel = APP_CONFIG.passTypeLabels[registration.passType as keyof typeof APP_CONFIG.passTypeLabels] || registration.passType;

      // Create Pass
      const pass = await prisma.pass.create({
        data: {
          type: passTypeLabel,
          visitorRegistrationId: id,
          userId: registration.userId,
          userBookingId: registration.userBookingId || registration.bookingId, // User's booking ID
          validUntil: new Date("2026-03-28T23:59:59.999Z"),
          qrCode: registration.userBookingId || registration.bookingId || `SP-${id}`, // QR encodes booking ID directly
        }
      });
      console.log(`[Admin] Generated Pass ${pass.id} for user ${registration.userId}`);
    }

    // Invalidate user profile cache so the new pass shows up in /profile
    await deleteCache(CacheKeys.userProfile(registration.userId));
  }

  // Invalidate cache immediately for real-time data
  await invalidateAdminStatsCache();

  revalidatePath("/admin/revenue");
  revalidatePath("/admin");
}

export async function updateParticipantTeamStatus(id: string, status: "pending" | "verified" | "rejected") {
  await guard();
  const team = await prisma.participantTeam.update({ where: { id }, data: { status } });

  // Invalidate the team leader's profile cache so the status change shows immediately
  if (team.leaderBookingId) {
    const user = await prisma.user.findFirst({
      where: { bookingId: { equals: team.leaderBookingId, mode: "insensitive" } },
      select: { id: true },
    });
    if (user) {
      await deleteCache(CacheKeys.userProfile(user.id));
    }
  }

  // Invalidate cache immediately for real-time data
  await invalidateAdminStatsCache();

  revalidatePath("/admin/revenue");
  revalidatePath("/admin/teams");
  revalidatePath("/admin");
}

// --- Verification (event-day attendance) ---
export async function getPassesByBookingId(bookingId: string) {
  await guard();
  const bid = bookingId?.trim();
  if (!bid || bid.length < 5) return { passes: [], userName: null, userEmail: null };

  const passes = await prisma.pass.findMany({
    where: { userBookingId: { equals: bid, mode: "insensitive" } },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  const user = passes[0]?.user ?? null;
  return {
    passes: passes.map((p) => ({
      id: p.id,
      type: p.type,
      userBookingId: p.userBookingId,
      validUntil: p.validUntil,
      verifiedAt: p.verifiedAt,
      verifiedBy: p.verifiedBy,
      verifiedDay1At: p.verifiedDay1At,
      verifiedDay2At: p.verifiedDay2At,
      qrCode: p.qrCode,
    })),
    userName: user?.name ?? null,
    userEmail: user?.email ?? null,
  };
}

export async function markPassAttended(passId: string, day: "day1" | "day2") {
  const session = await guard();
  const pass = await prisma.pass.findUnique({ where: { id: passId }, select: { type: true } });
  if (!pass) throw new Error("Pass not found");

  const isDual = pass.type === "Dual day pass" || pass.type === "Dual Day Pass" || pass.type === "Double Day Pass";
  const isSingleDay = pass.type === "Single day pass" || pass.type === "Single Day Pass" || pass.type === "Day 1 Pass";

  if (day === "day1" && !isDual && !isSingleDay && pass.type !== "Visitor Pass") throw new Error("Day 1 attendance not applicable for this pass");
  if (day === "day2" && !isDual) throw new Error("Day 2 attendance not applicable for this pass");

  const data = day === "day1"
    ? { verifiedDay1At: new Date(), verifiedDay1By: session.user.id }
    : { verifiedDay2At: new Date(), verifiedDay2By: session.user.id };

  await prisma.pass.update({ where: { id: passId }, data });
  await invalidateAdminStatsCache();
  revalidatePath("/admin/verify");
  revalidatePath("/admin/attendees");
}

// --- Resolve QR code (SP-xxx, EP-xxx) or plain string to booking ID for verification ---
async function resolveToBookingIdInternal(value: string): Promise<string | null> {
  const v = value?.trim();
  if (!v || v.length < 3) return null;

  if (v.startsWith("SP-")) {
    const pass = await prisma.pass.findFirst({
      where: { qrCode: v },
      include: { user: { select: { bookingId: true } } },
    });
    return pass?.userBookingId ?? pass?.user?.bookingId ?? null;
  }

  if (v.startsWith("EP-")) {
    const team = await prisma.participantTeam.findFirst({
      where: { qrCode: v },
    });
    if (!team) return null;
    if (team.leaderBookingId) return team.leaderBookingId;
    const user = await prisma.user.findFirst({
      where: { email: team.leaderEmail },
      select: { bookingId: true },
    });
    return user?.bookingId ?? null;
  }

  return v;
}

export async function resolveToBookingId(value: string): Promise<string | null> {
  await guard();
  return resolveToBookingIdInternal(value);
}

// --- Fast path for admin verify page (single roundtrip for QR/manual lookup) ---
export async function getVerificationLookup(value: string) {
  await guard();
  const bid = await resolveToBookingIdInternal(value);
  if (!bid || bid.length < 5) {
    return { bookingId: null, passes: [], teams: [], userName: null, userEmail: null };
  }

  const [passes, teams] = await Promise.all([
    prisma.pass.findMany({
      where: { userBookingId: { equals: bid, mode: "insensitive" } },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.participantTeam.findMany({
      where: { leaderBookingId: { equals: bid, mode: "insensitive" } },
      include: { members: true, events: { include: { event: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const user = passes[0]?.user ?? null;

  return {
    bookingId: bid,
    passes: passes.map((p) => ({
      id: p.id,
      type: p.type,
      userBookingId: p.userBookingId,
      validUntil: p.validUntil,
      verifiedAt: p.verifiedAt,
      verifiedBy: p.verifiedBy,
      verifiedDay1At: p.verifiedDay1At,
      verifiedDay2At: p.verifiedDay2At,
      qrCode: p.qrCode,
    })),
    teams: teams.map((t) => ({
      id: t.id,
      teamName: t.teamName,
      leaderName: t.leaderName,
      leaderEmail: t.leaderEmail,
      leaderAttendedAt: t.leaderAttendedAt,
      leaderAttendedBy: t.leaderAttendedBy,
      eventNames: t.events.map((e) => e.event.name).join(", "),
      qrCode: t.qrCode,
      members: t.members.map((m) => ({
        id: m.id,
        name: m.name,
        college: m.college,
        attendedAt: m.attendedAt,
        attendedBy: m.attendedBy,
      })),
    })),
    userName: user?.name ?? null,
    userEmail: user?.email ?? null,
  };
}

// --- Event teams by Booking ID (verification: event passes) ---
export async function getEventTeamsByBookingId(bookingId: string) {
  await guard();
  const bid = bookingId?.trim();
  if (!bid || bid.length < 5) return { teams: [] };

  const teams = await prisma.participantTeam.findMany({
    where: { leaderBookingId: { equals: bid, mode: "insensitive" } },
    include: { members: true, events: { include: { event: true } } },
    orderBy: { createdAt: "desc" },
  });
  return {
    teams: teams.map((t) => ({
      id: t.id,
      teamName: t.teamName,
      leaderName: t.leaderName,
      leaderEmail: t.leaderEmail,
      leaderAttendedAt: t.leaderAttendedAt,
      leaderAttendedBy: t.leaderAttendedBy,
      eventNames: t.events.map((e) => e.event.name).join(", "),
      qrCode: t.qrCode,
      members: t.members.map((m) => ({
        id: m.id,
        name: m.name,
        college: m.college,
        attendedAt: m.attendedAt,
        attendedBy: m.attendedBy,
      })),
    })),
  };
}

export async function markEventTeamLeaderAttended(teamId: string) {
  const session = await guard();
  await prisma.participantTeam.update({
    where: { id: teamId },
    data: { leaderAttendedAt: new Date(), leaderAttendedBy: session.user.id },
  });
  await invalidateAdminStatsCache();
  revalidatePath("/admin/verify");
  revalidatePath("/admin/attendees");
}

export async function markEventTeamMemberAttended(memberId: string) {
  const session = await guard();
  await prisma.participantTeamMember.update({
    where: { id: memberId },
    data: { attendedAt: new Date(), attendedBy: session.user.id },
  });
  await invalidateAdminStatsCache();
  revalidatePath("/admin/verify");
  revalidatePath("/admin/attendees");
}

// --- Countdown date management ---
export async function getCountdownDate() {
  await guard();
  return prisma.countdownDate.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllCountdownDates() {
  await guard();
  return prisma.countdownDate.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createCountdownDate(data: { targetDate: Date; label?: string }) {
  await guard();
  // Deactivate all existing countdown dates
  await prisma.countdownDate.updateMany({
    data: { isActive: false },
  });
  // Create new active countdown date
  const countdown = await prisma.countdownDate.create({
    data: {
      targetDate: data.targetDate,
      label: data.label,
      isActive: true,
    },
  });
  revalidatePath("/admin/countdown");
  revalidatePath("/");
  return countdown;
}

export async function updateCountdownDate(id: string, data: { targetDate?: Date; label?: string; isActive?: boolean }) {
  await guard();
  // If setting this one as active, deactivate others
  if (data.isActive) {
    await prisma.countdownDate.updateMany({
      where: { id: { not: id } },
      data: { isActive: false },
    });
  }
  const countdown = await prisma.countdownDate.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/countdown");
  revalidatePath("/");
  return countdown;
}

export async function deleteCountdownDate(id: string) {
  await guard();
  await prisma.countdownDate.delete({ where: { id } });
  revalidatePath("/admin/countdown");
  revalidatePath("/");
}

// --- Attendees (All verified people) ---
// --- Attendees (Grouped) ---
export type AttendeeItem = {
  id: string;
  name: string;
  email: string | null;
  role: "Visitor" | "Team Leader";
  detail: string; // Pass type or Team Name
  college: string | null;
  phone: string | null;
  lastAttendedAt: Date;
  isDual?: boolean;
  attendance: {
    label: string;
    date: Date;
    type: "day1" | "day2" | "event";
  }[];
  teamMembers?: {
    id: string;
    name: string;
    email: string | null;
    attendedAt: Date;
  }[];
};

export async function getAttendees(params?: { search?: string; limit?: number; offset?: number }) {
  await guard();
  const search = params?.search?.trim().toLowerCase();

  // 1. Visitor Passes
  const passes = await prisma.pass.findMany({
    where: {
      OR: [
        { verifiedAt: { not: null } },
        { verifiedDay1At: { not: null } },
        { verifiedDay2At: { not: null } },
      ],
      ...(search ? {
        user: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ]
        }
      } : {})
    },
    include: {
      user: { select: { name: true, email: true, collegeName: true, mobileNo: true } },
      visitorRegistration: { select: { college: true, phone: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  // 2. Teams (fetch leaders who attended OR teams where members attended if we want to show them under leader even if leader didn't attend? 
  // The requirement says "team leader's name... when clicked... team members show up". 
  // We'll fetch teams where leader attended OR any member attended, to be safe, but usually leader attends.
  // Let's stick to "Leaders who attended" as primary entry point for now to keep it clean, 
  // or maybe just fetch all teams that have ANY attendance.
  // Let's fetch teams where leader attended, and attach members. 
  // If leader didn't attend, we technically shouldn't show the leader as "Attendee". 
  // But if members attended, where do they go?
  // Use case implies "Attendees Section". If a member attended but leader didn't, we should probably list them?
  // The user said: "keep the team leader's name on the attendee section , when clicked on it , team members details show show up".
  // This implies the group head is the leader.

  const teams = await prisma.participantTeam.findMany({
    where: {
      OR: [
        { leaderAttendedAt: { not: null } },
        { members: { some: { attendedAt: { not: null } } } } // Include team if any member attended
      ],
      ...(search ? {
        OR: [
          { leaderName: { contains: search, mode: "insensitive" } },
          { leaderEmail: { contains: search, mode: "insensitive" } },
          { members: { some: { name: { contains: search, mode: "insensitive" } } } }
        ]
      } : {})
    },
    include: {
      members: {
        where: { attendedAt: { not: null } }, // Only verified members
        select: { id: true, name: true, email: true, attendedAt: true }
      }
    },
    take: 500,
  });

  const items: AttendeeItem[] = [];

  // Process Passes
  for (const p of passes) {
    const user = p.user;
    const reg = p.visitorRegistration;
    const attendanceRecords = [];

    if (p.verifiedDay1At) attendanceRecords.push({ label: "Day 1", date: p.verifiedDay1At, type: "day1" as const });
    if (p.verifiedDay2At) attendanceRecords.push({ label: "Day 2", date: p.verifiedDay2At, type: "day2" as const });
    if (p.verifiedAt && !p.verifiedDay1At && !p.verifiedDay2At) {
      attendanceRecords.push({ label: "Verified", date: p.verifiedAt, type: "day1" as const }); // Legacy/Single
    }

    if (attendanceRecords.length === 0) continue;

    // Sort attendance desc
    attendanceRecords.sort((a, b) => b.date.getTime() - a.date.getTime());
    const lastAttended = attendanceRecords[0].date;

    // Check if Dual
    // The check: "Dual day pass" | "Double Day Pass" etc.
    // If it has both day 1 and day 2, it's definitely dual in practice.
    // Or if type says so.
    const isDual = p.type.toLowerCase().includes("dual") || p.type.toLowerCase().includes("double");

    items.push({
      id: `pass-${p.id}`,
      name: user.name,
      email: user.email,
      role: "Visitor",
      detail: p.type,
      college: reg?.college || user.collegeName,
      phone: reg?.phone || user.mobileNo,
      lastAttendedAt: lastAttended,
      isDual: isDual,
      attendance: attendanceRecords
    });
  }

  // Process Teams
  for (const t of teams) {
    const leaderAttended = t.leaderAttendedAt;
    const memberRecords = t.members.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      attendedAt: m.attendedAt! // strict because of where clause
    }));

    // If leader didn't attend but members did, we still show the Team Leader row (as the group header)
    // effectively saying "Team X (Leader Y)"
    // But if leader didn't attend, 'lastAttendedAt' might be member's time.

    let lastAttended = leaderAttended;
    // Find latest member time if leader null or member later
    for (const m of memberRecords) {
      if (!lastAttended || m.attendedAt > lastAttended) {
        lastAttended = m.attendedAt;
      }
    }

    if (!lastAttended) continue; // Should not happen given query

    items.push({
      id: `team-${t.id}`,
      name: t.leaderName,
      email: t.leaderEmail,
      role: "Team Leader",
      detail: t.teamName,
      college: t.college,
      phone: t.leaderPhone,
      lastAttendedAt: lastAttended,
      isDual: false,
      attendance: leaderAttended ? [{ label: "Leader Verified", date: leaderAttended, type: "event" }] : [],
      teamMembers: memberRecords
    });
  }

  // Sort by lastAttendedAt desc
  items.sort((a, b) => b.lastAttendedAt.getTime() - a.lastAttendedAt.getTime());

  // Apply pagination slicing
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  const paginatedItems = items.slice(offset, offset + limit);

  return { attendees: paginatedItems, total: items.length };
}
