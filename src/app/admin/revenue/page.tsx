import { getRevenueBreakdown, getVisitorRegistrations, getParticipantTeamsForRevenue } from "../actions";
import { RevenueStatusButtons } from "./RevenueStatusButtons";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";
import { APP_CONFIG } from "@/config/app.config";

const PASS_TYPE_LABELS: Record<string, string> = {
  single: APP_CONFIG.passTypeLabels.single,
  dual: APP_CONFIG.passTypeLabels.dual,
  full: APP_CONFIG.passTypeLabels.full,
};

type SearchParams = Promise<{ p?: string; t?: string }> | { p?: string; t?: string };

export default async function AdminRevenuePage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = await Promise.resolve(searchParams ?? {});
  const passPage = Math.max(1, parseInt(resolved?.p ?? "1", 10) || 1);
  const teamPage = Math.max(1, parseInt(resolved?.t ?? "1", 10) || 1);
  const passOffset = (passPage - 1) * PAGE_SIZE;
  const teamOffset = (teamPage - 1) * PAGE_SIZE;

  const [data, { list: passes, total: passTotal }, { teams, total: teamTotal }] = await Promise.all([
    getRevenueBreakdown(),
    getVisitorRegistrations({ limit: PAGE_SIZE, offset: passOffset }),
    getParticipantTeamsForRevenue({ limit: PAGE_SIZE, offset: teamOffset }),
  ]);

  function buildPassHref(p: number) {
    const sp = new URLSearchParams();
    if (p > 1) sp.set("p", String(p));
    if (teamPage > 1) sp.set("t", String(teamPage));
    const q = sp.toString();
    return `/admin/revenue${q ? `?${q}` : ""}`;
  }
  function buildTeamHref(t: number) {
    const sp = new URLSearchParams();
    if (passPage > 1) sp.set("p", String(passPage));
    if (t > 1) sp.set("t", String(t));
    const q = sp.toString();
    return `/admin/revenue${q ? `?${q}` : ""}`;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">Revenue</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-5">
          <p className="text-xs font-bold uppercase text-emerald-400/80">Pass revenue</p>
          <p className="text-2xl font-black text-emerald-400">₹{(data.visitor.total).toLocaleString("en-IN")}</p>
          <p className="text-xs text-zinc-500 mt-1">{data.visitor.count} verified</p>
        </div>
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-5">
          <p className="text-xs font-bold uppercase text-amber-400/80">Event teams</p>
          <p className="text-2xl font-black text-amber-400">₹{(data.team.total).toLocaleString("en-IN")}</p>
          <p className="text-xs text-zinc-500 mt-1">{data.team.count} verified</p>
        </div>
        <div className="rounded-xl border border-green-500/50 bg-green-500/10 p-5">
          <p className="text-xs font-bold uppercase text-green-400/80">Total revenue</p>
          <p className="text-2xl font-black text-green-400">₹{(data.grandTotal).toLocaleString("en-IN")}</p>
        </div>
      </div>

      <section>
        <h2 className="font-bold text-white mb-3">Passes sold</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-800/95">
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 font-bold text-zinc-300">Booking ID</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Name</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Email</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Pass</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Amount</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Status</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Date</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passes.map((v) => (
                  <tr key={v.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="px-4 py-3 font-mono text-zinc-300 text-xs">{v.userBookingId || v.bookingId || "—"}</td>
                    <td className="px-4 py-3 text-white">{v.name}</td>
                    <td className="px-4 py-3 text-zinc-400">{v.email}</td>
                    <td className="px-4 py-3 text-zinc-400">{PASS_TYPE_LABELS[v.passType] || v.passType}</td>
                    <td className="px-4 py-3 font-mono text-zinc-300">₹{v.amount}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${v.status === "verified" ? "bg-green-500/20 text-green-400" : v.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{v.status}</span></td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(v.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3"><RevenueStatusButtons type="visitor" id={v.id} status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {passes.length === 0 && <div className="py-12 text-center text-zinc-500">No passes sold yet.</div>}
          <div className="px-4 pb-3">
            <AdminPagination total={passTotal} page={passPage} buildHref={buildPassHref} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-white mb-3">Event team registrations</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-800/95">
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 font-bold text-zinc-300">Team</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Leader email</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Amount</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Status</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Date</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="px-4 py-3 text-white font-medium">{t.teamName}</td>
                    <td className="px-4 py-3 text-zinc-400">{t.leaderEmail}</td>
                    <td className="px-4 py-3 font-mono text-zinc-300">₹{t.totalAmount}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${t.status === "verified" ? "bg-green-500/20 text-green-400" : t.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{t.status}</span></td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3"><RevenueStatusButtons type="team" id={t.id} status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {teams.length === 0 && <div className="py-12 text-center text-zinc-500">No event team registrations yet.</div>}
          <div className="px-4 pb-3">
            <AdminPagination total={teamTotal} page={teamPage} buildHref={buildTeamHref} />
          </div>
        </div>
      </section>
    </div>
  );
}
