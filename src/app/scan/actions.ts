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
  if (!qrValue.startsWith("EP-")) {
    await createScanLog({
      qrValue,
      status: "invalid_qr",
      message: "Only event team QR codes are allowed",
      scannerUserId,
    });
    throw new Error("Only event team QR codes are allowed here");
  }

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
  revalidatePath("/admin/verify");
  revalidatePath("/admin/attendees");

  return {
    row: toScanTeamRow(scanLog),
    message: "Team marked successfully",
    markedNow: true,
  };
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

  const passes = await prisma.pass.findMany({
    where: {
      OR: [
        { verifiedDay1At: { not: null } },
        { verifiedDay2At: { not: null } },
        { verifiedAt: { not: null } },
      ],
    },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  return passes.map((p) => {
    const day1 = p.verifiedDay1At;
    const day2 = p.verifiedDay2At;
    const legacy = p.verifiedAt;

    const lastScannedAt = [day1, day2, legacy]
      .filter((v): v is Date => Boolean(v))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    const scanCount = [day1, day2, legacy].filter(Boolean).length;

    return {
      id: p.id,
      name: p.user.name,
      email: p.user.email,
      bookingId: p.userBookingId || "-",
      passType: p.type,
      day1At: day1,
      day2At: day2,
      legacyVerifiedAt: legacy,
      lastScannedAt: lastScannedAt ?? p.updatedAt,
      scanCount,
    };
  });
}
