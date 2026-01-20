"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

// --- Auth guard: all functions return null or throw if not admin ---
async function guard() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized: admin access required");
  return session;
}

// --- Dashboard stats ---
export async function getAdminDashboardStats() {
  await guard();
  const [userCount, visitorCount, teamCount, issueCount, visitorRevenue, teamRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.visitorRegistration.count(),
    prisma.participantTeam.count(),
    prisma.issue.count(),
    prisma.visitorRegistration.aggregate({ where: { status: "verified" }, _sum: { amount: true } }),
    prisma.participantTeam.aggregate({ where: { status: "verified" }, _sum: { totalAmount: true } }),
  ]);
  const totalRevenue = (visitorRevenue._sum.amount || 0) + (teamRevenue._sum.totalAmount || 0);
  return {
    userCount,
    visitorCount,
    teamCount,
    issueCount,
    totalRevenue,
    visitorRevenue: visitorRevenue._sum.amount || 0,
    teamRevenue: teamRevenue._sum.totalAmount || 0,
  };
}

// --- Users ---
const userSearchWhere = (q: string) => ({
  OR: [
    { name: { contains: q, mode: "insensitive" as const } },
    { email: { contains: q, mode: "insensitive" as const } },
  ],
});

export async function getUserSuggestions(query: string) {
  await guard();
  const q = query.trim();
  if (!q || q.length < 2) return [];
  return prisma.user.findMany({
    where: userSearchWhere(q),
    select: { id: true, name: true, email: true },
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
      select: { id: true, name: true, email: true, collegeName: true, mobileNo: true, image: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: params?.limit ?? 100,
      skip: params?.offset ?? 0,
    }),
    prisma.user.count({ where }),
  ]);
  return { users, total };
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
  return {
    visitor: { total: visitorAgg._sum.amount || 0, count: visitorAgg._count },
    team: { total: teamAgg._sum.totalAmount || 0, count: teamAgg._count },
    grandTotal: (visitorAgg._sum.amount || 0) + (teamAgg._sum.totalAmount || 0),
  };
}

export async function getParticipantTeamsForRevenue(params?: { limit?: number; offset?: number }) {
  await guard();
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  const [teams, total] = await Promise.all([
    prisma.participantTeam.findMany({
      select: { id: true, teamName: true, leaderEmail: true, totalAmount: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.participantTeam.count(),
  ]);
  return { teams, total };
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
export async function updateVisitorStatus(id: string, status: "pending" | "verified" | "rejected") {
  await guard();
  await prisma.visitorRegistration.update({ where: { id }, data: { status } });
  revalidatePath("/admin/revenue");
  revalidatePath("/admin");
}

export async function updateParticipantTeamStatus(id: string, status: "pending" | "verified" | "rejected") {
  await guard();
  await prisma.participantTeam.update({ where: { id }, data: { status } });
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

  const isDual = pass.type === "Dual Day Pass";
  const isDay1Only = pass.type === "Day 1 Pass";
  const isDay2Only = pass.type === "Day 2 Pass";

  if (day === "day1" && !isDual && !isDay1Only && pass.type !== "Visitor Pass") throw new Error("Day 1 attendance not applicable for this pass");
  if (day === "day2" && !isDual && !isDay2Only) throw new Error("Day 2 attendance not applicable for this pass");

  const data = day === "day1"
    ? { verifiedDay1At: new Date(), verifiedDay1By: session.user.id }
    : { verifiedDay2At: new Date(), verifiedDay2By: session.user.id };

  await prisma.pass.update({ where: { id: passId }, data });
  revalidatePath("/admin/verify");
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
  revalidatePath("/admin/verify");
}

export async function markEventTeamMemberAttended(memberId: string) {
  const session = await guard();
  await prisma.participantTeamMember.update({
    where: { id: memberId },
    data: { attendedAt: new Date(), attendedBy: session.user.id },
  });
  revalidatePath("/admin/verify");
}
