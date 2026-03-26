"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

type ScanTeamRow = {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  qrCode: string | null;
  eventNames: string;
  scannedAt: Date | null;
  alreadyMarked: boolean;
};

function ensureScanAccess(accessKey?: string) {
  const expected = process.env.REGISTRATION_BACKDOOR_TOKEN?.trim();
  if (!expected || !accessKey || accessKey.trim() !== expected) {
    throw new Error("Unauthorized scan access");
  }
}

function toScanTeamRow(team: {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  qrCode: string | null;
  leaderAttendedAt: Date | null;
  events: { event: { name: string } }[];
}): ScanTeamRow {
  return {
    id: team.id,
    teamName: team.teamName,
    leaderName: team.leaderName,
    leaderEmail: team.leaderEmail,
    college: team.college,
    qrCode: team.qrCode,
    eventNames: team.events.map((entry) => entry.event.name).join(", "),
    scannedAt: team.leaderAttendedAt,
    alreadyMarked: Boolean(team.leaderAttendedAt),
  };
}

function normalizeQrValue(value: string) {
  return value.trim();
}

export async function scanTeamByQr(value: string, accessKey: string) {
  ensureScanAccess(accessKey);
  const qrValue = normalizeQrValue(value);

  if (!qrValue) throw new Error("QR value is required");
  if (!qrValue.startsWith("EP-")) {
    throw new Error("Only event team QR codes are allowed here");
  }

  const existing = await prisma.participantTeam.findFirst({
    where: {
      qrCode: { equals: qrValue, mode: "insensitive" },
      status: "verified",
    },
    include: {
      events: { include: { event: { select: { name: true } } } },
    },
  });

  if (!existing) {
    throw new Error("No verified event team found for this QR");
  }

  if (existing.leaderAttendedAt) {
    return {
      row: toScanTeamRow(existing),
      message: "Team already marked",
      markedNow: false,
    };
  }

  const session = await getSession();

  const updated = await prisma.participantTeam.update({
    where: { id: existing.id },
    data: {
      leaderAttendedAt: new Date(),
      leaderAttendedBy: session?.user?.id ?? "scan-route",
    },
    include: {
      events: { include: { event: { select: { name: true } } } },
    },
  });

  revalidatePath("/scan");
  revalidatePath("/admin/verify");
  revalidatePath("/admin/attendees");

  return {
    row: toScanTeamRow(updated),
    message: "Team marked successfully",
    markedNow: true,
  };
}

export async function getScannedTeams(accessKey: string) {
  ensureScanAccess(accessKey);

  const teams = await prisma.participantTeam.findMany({
    where: {
      status: "verified",
      leaderAttendedAt: { not: null },
    },
    include: {
      events: { include: { event: { select: { name: true } } } },
    },
    orderBy: { leaderAttendedAt: "desc" },
    take: 100,
  });

  return teams.map(toScanTeamRow);
}

export type { ScanTeamRow };
