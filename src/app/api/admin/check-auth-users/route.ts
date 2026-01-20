import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/check-auth-users
 * Admin-only. Returns a diagnostic of User and Account records to verify
 * that better-auth is creating User + Account for both OAuth and credential sign-ups.
 */
export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin =
    (adminEmails.length > 0 && session.user.email && adminEmails.includes(session.user.email.toLowerCase())) ||
    (session.user as { role?: string }).role === "admin";
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      createdAt: true,
      accounts: { select: { providerId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const userCount = users.length;
  const usersWithCredential = users.filter((u) => u.accounts.some((a) => a.providerId === "credential")).length;
  const usersWithGoogle = users.filter((u) => u.accounts.some((a) => a.providerId === "google")).length;
  const usersWithGithub = users.filter((u) => u.accounts.some((a) => a.providerId === "github")).length;
  const usersWithNoAccount = users.filter((u) => u.accounts.length === 0).length;

  const recentUsers = users.slice(0, 15).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    emailVerified: u.emailVerified,
    createdAt: u.createdAt.toISOString(),
    providers: u.accounts.map((a) => a.providerId),
  }));

  return NextResponse.json({
    userCount,
    bySignInMethod: {
      credential: usersWithCredential,
      google: usersWithGoogle,
      github: usersWithGithub,
      noAccount: usersWithNoAccount,
    },
    recentUsers,
    schemaNote:
      "User requires: name, email, emailVerified, createdAt, updatedAt. Account requires: accountId, providerId, userId, createdAt, updatedAt; password for credential.",
  });
}
