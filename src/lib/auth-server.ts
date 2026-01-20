import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

/** Use in server components/actions. Returns session or null. Throws if not admin. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) return null;

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  const isAdminByEmail = adminEmails.length > 0 && session.user.email && adminEmails.includes(session.user.email.toLowerCase());
  const isAdminByRole = (session.user as { role?: string }).role === "admin";

  if (isAdminByEmail || isAdminByRole) return session;
  return null;
}
