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
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  teamQrCode: string | null;
  eventNames: string;
  alreadyMarked: boolean;
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
    teamId: log.team.id,
    teamName: log.team.teamName,
    leaderName: log.team.leaderName,
    leaderEmail: log.team.leaderEmail,
    college: log.team.college,
    teamQrCode: log.team.qrCode,
    eventNames: log.team.events.map((entry) => entry.event.name).join(", "),
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
  return {
    newlyMarked: rows.filter((row) => row.status === "success"),
    alreadyMarked: rows.filter((row) => row.status === "already_marked"),
  };
}
