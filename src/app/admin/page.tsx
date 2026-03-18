import { getAdminDashboardStats, getIssues } from "./actions";
import Link from "next/link";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });

import { RefreshButton } from "./components/RefreshButton";

export default async function AdminDashboardPage() {
  const [stats, { issues: recentIssues }] = await Promise.all([
    getAdminDashboardStats(),
    getIssues({ limit: 5, offset: 0 }),
  ]);

  const cards = [
    { label: "Total Users", value: stats.userCount, href: "/admin/users", bg: "bg-[#deb3fa]", text: "text-black" },
    { label: "Passes sold", value: stats.visitorCount, href: "/admin/revenue", bg: "bg-[#4caf50]", text: "text-white" },
    { label: "Event Teams", value: stats.teamCount, href: "/admin/teams", bg: "bg-[#FCD34D]", text: "text-black" },
    { label: "Revenue (₹)", value: stats.totalRevenue.toLocaleString("en-IN"), href: "/admin/revenue", bg: "bg-[#9c27b0]", text: "text-white" },
    { label: "Issues Reported", value: stats.issueCount, href: "/admin/issues", bg: "bg-[#ff9800]", text: "text-black" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight text-white ${gilton.className}`}>
          Dashboard
        </h1>
        <RefreshButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-xl border-2 border-black p-5 ${c.bg} ${c.text} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
          >
            <p className={`text-xs font-bold uppercase tracking-wider opacity-80 ${softura.className}`}>{c.label}</p>
            <p className={`text-3xl font-black mt-1 ${gilton.className}`}>{c.value}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/users"
        className="block rounded-xl border-2 border-black bg-[#1f2937] p-5 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
      >
        <p className={`text-xs font-bold uppercase tracking-wider text-zinc-300 ${softura.className}`}>
          Student Registration Overview
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border-2 border-black bg-zinc-800 px-4 py-3">
            <p className={`text-[11px] uppercase tracking-wider text-zinc-400 ${softura.className}`}>
              Total Registered Students
            </p>
            <p className={`mt-1 text-2xl font-black text-[#deb3fa] ${gilton.className}`}>{stats.userCount}</p>
          </div>
          <div className="rounded-lg border-2 border-black bg-zinc-800 px-4 py-3">
            <p className={`text-[11px] uppercase tracking-wider text-zinc-400 ${softura.className}`}>
              Total Verified
            </p>
            <p className={`mt-1 text-2xl font-black text-[#4caf50] ${gilton.className}`}>{stats.verifiedUserCount}</p>
          </div>
          <div className="rounded-lg border-2 border-black bg-zinc-800 px-4 py-3">
            <p className={`text-[11px] uppercase tracking-wider text-zinc-400 ${softura.className}`}>
              Total Unverified
            </p>
            <p className={`mt-1 text-2xl font-black text-[#ff9800] ${gilton.className}`}>{stats.unverifiedUserCount}</p>
          </div>
        </div>
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border-2 border-black bg-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-bold text-white text-lg ${gilton.className}`}>Revenue breakdown</h2>
            <Link href="/admin/revenue" className={`text-xs font-bold text-[#deb3fa] hover:underline ${softura.className}`}>View all →</Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className={`text-zinc-400 ${softura.className}`}>Pass revenue</span>
              <span className={`font-mono font-bold text-[#4caf50] ${softura.className}`}>₹{stats.visitorRevenue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={`text-zinc-400 ${softura.className}`}>Event teams</span>
              <span className={`font-mono font-bold text-[#FCD34D] ${softura.className}`}>₹{stats.teamRevenue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t-2 border-zinc-800">
              <span className={`font-bold text-white ${softura.className}`}>Total</span>
              <span className={`font-mono font-bold text-[#9c27b0] text-lg ${softura.className}`}>₹{stats.totalRevenue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-black bg-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-bold text-white text-lg ${gilton.className}`}>Recent issues</h2>
            <Link href="/admin/issues" className={`text-xs font-bold text-[#deb3fa] hover:underline ${softura.className}`}>View all →</Link>
          </div>
          <ul className="space-y-3">
            {recentIssues.length === 0 && <p className={`text-zinc-500 text-sm ${softura.className}`}>No issues yet.</p>}
            {recentIssues.map((i) => (
              <li key={i.id} className="text-sm border-l-2 border-[#ff9800] pl-3">
                <p className={`text-zinc-300 line-clamp-2 ${softura.className}`}>{i.text}</p>
                <p className={`text-xs text-zinc-500 mt-0.5 ${softura.className}`}>
                  {i.name || i.email || "Anonymous"} · {new Date(i.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
