import { requireAdmin } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    { href: "/admin/issues", label: "Issues" },
  ];

  return (
    <div className="admin-panel min-h-screen flex bg-zinc-950">
      <aside className="w-56 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <Link href="/admin" className="font-black text-lg uppercase tracking-tight text-white">
            Signifiya Admin
          </Link>
          <p className="text-xs text-zinc-500 mt-1 truncate">{session.user?.email}</p>
        </div>
        <nav className="flex-1 p-2">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-zinc-800">
          <Link
            href="/"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
