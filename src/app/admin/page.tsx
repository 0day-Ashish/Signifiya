import { getAdminDashboardStats, getIssues } from "./actions";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [stats, { issues: recentIssues }] = await Promise.all([
    getAdminDashboardStats(),
    getIssues({ limit: 5, offset: 0 }),
  ]);

  const cards = [
    { label: "Total Users", value: stats.userCount, href: "/admin/users", color: "bg-violet-500/20 border-violet-500/50 text-violet-300" },
    { label: "Passes sold", value: stats.visitorCount, href: "/admin/revenue", color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" },
    { label: "Event Teams", value: stats.teamCount, href: "/admin/teams", color: "bg-amber-500/20 border-amber-500/50 text-amber-300" },
    { label: "Revenue (₹)", value: stats.totalRevenue.toLocaleString("en-IN"), href: "/admin/revenue", color: "bg-green-500/20 border-green-500/50 text-green-300" },
    { label: "Issues Reported", value: stats.issueCount, href: "/admin/issues", color: "bg-rose-500/20 border-rose-500/50 text-rose-300" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-xl border p-5 ${c.color} hover:opacity-90 transition-opacity`}
          >
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{c.label}</p>
            <p className="text-2xl font-black mt-1">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-white">Revenue breakdown</h2>
            <Link href="/admin/revenue" className="text-xs font-semibold text-violet-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Pass revenue</span>
              <span className="font-mono text-emerald-400">₹{stats.visitorRevenue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Event teams</span>
              <span className="font-mono text-amber-400">₹{stats.teamRevenue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
              <span className="font-semibold text-white">Total</span>
              <span className="font-mono font-bold text-green-400">₹{stats.totalRevenue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-white">Recent issues</h2>
            <Link href="/admin/issues" className="text-xs font-semibold text-violet-400 hover:underline">View all</Link>
          </div>
          <ul className="space-y-2">
            {recentIssues.length === 0 && <p className="text-zinc-500 text-sm">No issues yet.</p>}
            {recentIssues.map((i) => (
              <li key={i.id} className="text-sm">
                <p className="text-zinc-300 line-clamp-2">{i.text}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {i.name || i.email || "Anonymous"} · {new Date(i.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
