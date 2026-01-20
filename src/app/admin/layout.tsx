import { requireAdmin } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import AdminShell from "./components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  if (!session) {
    redirect("/sign-in?callbackUrl=/admin");
  }

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/verify", label: "Verification" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/teams", label: "Teams" },
    { href: "/admin/revenue", label: "Revenue" },
    { href: "/admin/newsletter", label: "Newsletter" },
    { href: "/admin/issues", label: "Issues" },
  ];

  return (
    <AdminShell nav={nav} userEmail={session.user?.email}>
      {children}
    </AdminShell>
  );
}
