import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const email = session.user.email?.toLowerCase() || "";
  const isAdminByEmail = adminEmails.length > 0 && adminEmails.includes(email);
  const isAdminByRole = (session.user as { role?: string }).role === "admin";

  return NextResponse.json(
    {
      isAdmin: isAdminByEmail || isAdminByRole,
    },
    { status: 200 },
  );
}
