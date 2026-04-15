"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

type ScanTeamRow = {
  id: string;
  qrValue: string;
  status: string;
  message: string | null;
  scannedAt: Date;
  scanCount: number;
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  teamQrCode: string | null;
  eventNames: string;
  eventList: string[];
  alreadyMarked: boolean;
};

type VisitorPassRow = {
  id: string;
  name: string;
  email: string;
  bookingId: string;
  passType: string;
  day1At: Date | null;
  day2At: Date | null;
  legacyVerifiedAt: Date | null;
  lastScannedAt: Date;
  scanCount: number;
};

function toScanTeamRow(log: {
  id: string;
  qrValue: string;
  status: string;
  message: string | null;
  scannedAt: Date;
  team: {
    id: string;
    teamName: string;
    leaderName: string;
    leaderEmail: string;
    college: string;
    qrCode: string | null;
    leaderAttendedAt: Date | null;
    events: { event: { name: string } }[];
  } | null;
}): ScanTeamRow {
  if (!log.team) {
    throw new Error("Scan log missing team relation");
  }

  return {
    id: log.id,
    qrValue: log.qrValue,
    status: log.status,
    message: log.message,
    scannedAt: log.scannedAt,
    scanCount: 1,
    teamId: log.team.id,
    teamName: log.team.teamName,
    leaderName: log.team.leaderName,
    leaderEmail: log.team.leaderEmail,
    college: log.team.college,
    teamQrCode: log.team.qrCode,
    eventNames: log.team.events.map((entry) => entry.event.name).join(", "),
    eventList: log.team.events.map((entry) => entry.event.name),
    alreadyMarked: Boolean(log.team.leaderAttendedAt),
  };
}

function normalizeQrValue(value: string) {
  return value.trim();
}

function isDualPassType(type: string) {
  const t = type.toLowerCase();
  return t.includes("dual") || t.includes("double");
}

async function createScanLog(params: {
  qrValue: string;
  status: string;
  message?: string;
  scannerUserId?: string | null;
  teamId?: string;
}) {
  return prisma.scanLog.create({
    data: {
      qrValue: params.qrValue,
      status: params.status,
      message: params.message,
      scannerUserId: params.scannerUserId ?? null,
      teamId: params.teamId,
    },
    include: {
      team: {
        include: {
          events: { include: { event: { select: { name: true } } } },
        },
      },
    },
  });
}

export async function scanTeamByQr(value: string) {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");

  const qrValue = normalizeQrValue(value);
  const scannerUserId = session.user.id;

  if (!qrValue) throw new Error("QR value is required");

  // Team QR flow (events page)
  if (qrValue.startsWith("EP-")) {
    const existing = await prisma.participantTeam.findFirst({
      where: {
        qrCode: { equals: qrValue, mode: "insensitive" },
      },
      include: {
        events: { include: { event: { select: { name: true } } } },
      },
    });

    if (!existing) {
      await createScanLog({
        qrValue,
        status: "not_found",
        message: "No team found for this QR",
        scannerUserId,
      });
      throw new Error("No verified event team found for this QR");
    }

    if (existing.status !== "verified") {
      await createScanLog({
        qrValue,
        status: "not_verified",
        message: "Team found but registration is not verified",
        scannerUserId,
        teamId: existing.id,
      });
      throw new Error("Team registration is not verified yet");
    }

    if (existing.leaderAttendedAt) {
      const scanLog = await createScanLog({
        qrValue,
        status: "already_marked",
        message: "Team already marked",
        scannerUserId,
        teamId: existing.id,
      });

      if (!scanLog.team) {
        throw new Error("Scan log persisted without team data");
      }

      return {
        row: toScanTeamRow(scanLog),
        message: "Team already marked",
        markedNow: false,
      };
    }

    const updated = await prisma.participantTeam.update({
      where: { id: existing.id },
      data: {
        leaderAttendedAt: new Date(),
        leaderAttendedBy: scannerUserId ?? "scan-route",
      },
    });

    const scanLog = await createScanLog({
      qrValue,
      status: "success",
      message: "Team marked successfully",
      scannerUserId,
      teamId: updated.id,
    });

    if (!scanLog.team) {
      throw new Error("Scan log persisted without team data");
    }

    revalidatePath("/scan");
    revalidatePath("/scan/events");
    revalidatePath("/admin/verify");
    revalidatePath("/admin/attendees");

    return {
      row: toScanTeamRow(scanLog),
      message: "Team marked successfully",
      markedNow: true,
    };
  }

  // Visitor flow (visitors page): teamId stays null in scan_log
  const pass = await prisma.pass.findFirst({
    where: {
      OR: [
        { qrCode: { equals: qrValue, mode: "insensitive" } },
        { userBookingId: { equals: qrValue, mode: "insensitive" } },
      ],
    },
    include: { user: { select: { name: true } } },
  });

  if (!pass) {
    await createScanLog({
      qrValue,
      status: "visitor_not_found",
      message: "No visitor pass found for this scan",
      scannerUserId,
    });
    throw new Error("No visitor pass found");
  }

  const isDual = isDualPassType(pass.type);
  const hasDay1 = Boolean(pass.verifiedDay1At || pass.verifiedAt);
  const hasDay2 = Boolean(pass.verifiedDay2At);

  if (!hasDay1) {
    await prisma.pass.update({
      where: { id: pass.id },
      data: {
        verifiedDay1At: new Date(),
        verifiedDay1By: scannerUserId,
      },
    });

    await createScanLog({
      qrValue,
      status: "visitor_marked",
      message: `Visitor Day 1 marked (${pass.user.name})`,
      scannerUserId,
    });

    revalidatePath("/scan");
    revalidatePath("/scan/visitors");
    revalidatePath("/admin/verify");
    revalidatePath("/admin/attendees");

    return { message: "Visitor marked (Day 1)", markedNow: true };
  }

  if (isDual && !hasDay2) {
    await prisma.pass.update({
      where: { id: pass.id },
      data: {
        verifiedDay2At: new Date(),
        verifiedDay2By: scannerUserId,
      },
    });

    await createScanLog({
      qrValue,
      status: "visitor_marked",
      message: `Visitor Day 2 marked (${pass.user.name})`,
      scannerUserId,
    });

    revalidatePath("/scan");
    revalidatePath("/scan/visitors");
    revalidatePath("/admin/verify");
    revalidatePath("/admin/attendees");

    return { message: "Visitor marked (Day 2)", markedNow: true };
  }

  await createScanLog({
    qrValue,
    status: "visitor_already_marked",
    message: `Visitor already marked (${pass.user.name})`,
    scannerUserId,
  });

  return { message: "Visitor already marked", markedNow: false };
}

export async function getScannedTeams() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");

  const logs = await prisma.scanLog.findMany({
    where: {
      teamId: { not: null },
      status: { in: ["success", "already_marked"] },
    },
    include: {
      team: {
        include: {
          events: { include: { event: { select: { name: true } } } },
        },
      },
    },
    orderBy: { scannedAt: "desc" },
    take: 200,
  });

  return logs
    .filter((log) => Boolean(log.team))
    .map((log) => toScanTeamRow(log as Parameters<typeof toScanTeamRow>[0]));
}

export async function getGroupedScannedTeams() {
  const rows = await getScannedTeams();

  const aggregateByTeam = (source: ScanTeamRow[]) => {
    const byTeam = new Map<string, ScanTeamRow>();

    for (const row of source) {
      const existing = byTeam.get(row.teamId);
      if (!existing) {
        byTeam.set(row.teamId, { ...row, scanCount: 1 });
        continue;
      }

      if (row.scannedAt > existing.scannedAt) {
        byTeam.set(row.teamId, {
          ...row,
          scanCount: existing.scanCount + 1,
        });
      } else {
        byTeam.set(row.teamId, {
          ...existing,
          scanCount: existing.scanCount + 1,
        });
      }
    }

    return Array.from(byTeam.values()).sort(
      (a, b) => b.scannedAt.getTime() - a.scannedAt.getTime(),
    );
  };

  const newRows = rows.filter((row) => row.status === "success");
  const repeatRows = rows.filter((row) => row.status === "already_marked");

  return {
    newlyMarked: aggregateByTeam(newRows),
    alreadyMarked: aggregateByTeam(repeatRows),
  };
}

export async function getVisitorPassRows(): Promise<VisitorPassRow[]> {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");

  const logs = await prisma.scanLog.findMany({
    where: {
      teamId: null,
      status: { in: ["visitor_marked", "visitor_already_marked"] },
    },
    orderBy: { scannedAt: "desc" },
    take: 500,
  });

  const map = new Map<string, { last: Date; count: number }>();
  for (const log of logs) {
    const prev = map.get(log.qrValue);
    if (!prev) {
      map.set(log.qrValue, { last: log.scannedAt, count: 1 });
      continue;
    }

    map.set(log.qrValue, {
      last:
        prev.last.getTime() > log.scannedAt.getTime()
          ? prev.last
          : log.scannedAt,
      count: prev.count + 1,
    });
  }

  const rows = await Promise.all(
    Array.from(map.entries()).map(async ([qrValue, agg]) => {
      const pass = await prisma.pass.findFirst({
        where: {
          OR: [
            { qrCode: { equals: qrValue, mode: "insensitive" } },
            { userBookingId: { equals: qrValue, mode: "insensitive" } },
          ],
        },
        include: {
          user: { select: { name: true, email: true } },
        },
      });

      return {
        id: pass?.id ?? qrValue,
        name: pass?.user.name ?? "Unknown Visitor",
        email: pass?.user.email ?? "-",
        bookingId: pass?.userBookingId ?? qrValue,
        passType: pass?.type ?? "Visitor Pass",
        day1At: pass?.verifiedDay1At ?? null,
        day2At: pass?.verifiedDay2At ?? null,
        legacyVerifiedAt: pass?.verifiedAt ?? null,
        lastScannedAt: agg.last,
        scanCount: agg.count,
      };
    }),
  );

  return rows.sort(
    (a, b) => b.lastScannedAt.getTime() - a.lastScannedAt.getTime(),
  );
}
