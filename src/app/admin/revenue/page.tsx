import { getRevenueBreakdown, getVisitorRegistrations, getParticipantTeamsForRevenue } from "../actions";
import { RevenueStatusButtons } from "./RevenueStatusButtons";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";
import { APP_CONFIG } from "@/config/app.config";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

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
      <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight text-white ${gilton.className}`}>Revenue</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-black bg-[#4caf50] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className={`text-xs font-bold uppercase text-white/80 ${softura.className}`}>Pass revenue</p>
          <p className={`text-3xl font-black text-white ${gilton.className}`}>₹{(data.visitor.total).toLocaleString("en-IN")}</p>
          <p className={`text-xs text-white/60 mt-1 ${softura.className}`}>{data.visitor.count} verified</p>
        </div>
        <div className="rounded-xl border-2 border-black bg-[#FCD34D] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className={`text-xs font-bold uppercase text-black/70 ${softura.className}`}>Event teams</p>
          <p className={`text-3xl font-black text-black ${gilton.className}`}>₹{(data.team.total).toLocaleString("en-IN")}</p>
          <p className={`text-xs text-black/50 mt-1 ${softura.className}`}>{data.team.count} verified</p>
        </div>
        <div className="rounded-xl border-2 border-black bg-[#9c27b0] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className={`text-xs font-bold uppercase text-white/80 ${softura.className}`}>Total revenue</p>
          <p className={`text-3xl font-black text-white ${gilton.className}`}>₹{(data.grandTotal).toLocaleString("en-IN")}</p>
        </div>
      </div>

      <section>
        <h2 className={`font-bold text-white mb-3 text-xl ${gilton.className}`}>Passes sold</h2>
        <div className="rounded-xl border-2 border-black bg-zinc-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#deb3fa]">
                <tr className="border-b-2 border-black">
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Booking ID</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Name</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Email</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Pass</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Amount</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Status</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Date</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passes.map((v) => (
                  <tr key={v.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                    <td className={`px-4 py-3 font-mono text-zinc-300 text-xs`}>{v.userBookingId || v.bookingId || "—"}</td>
                    <td className={`px-4 py-3 text-white ${softura.className}`}>{v.name}</td>
                    <td className={`px-4 py-3 text-zinc-400 ${softura.className}`}>{v.email}</td>
                    <td className={`px-4 py-3 text-zinc-400 ${softura.className}`}>{PASS_TYPE_LABELS[v.passType] || v.passType}</td>
                    <td className={`px-4 py-3 font-mono text-[#4caf50] font-bold`}>₹{v.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold border-2 border-black ${softura.className} ${
                        v.status === "verified" ? "bg-[#4caf50] text-white" : 
                        v.status === "rejected" ? "bg-red-500 text-white" : 
                        "bg-[#ff9800] text-black"
                      }`}>{v.status}</span>
                    </td>
                    <td className={`px-4 py-3 text-zinc-500 text-xs ${softura.className}`}>{new Date(v.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3"><RevenueStatusButtons type="visitor" id={v.id} status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {passes.length === 0 && <div className={`py-12 text-center text-zinc-500 ${softura.className}`}>No passes sold yet.</div>}
          <div className="px-4 pb-3">
            <AdminPagination total={passTotal} page={passPage} buildHref={buildPassHref} />
          </div>
        </div>
      </section>

      <section>
        <h2 className={`font-bold text-white mb-3 text-xl ${gilton.className}`}>Event team registrations</h2>
        <div className="rounded-xl border-2 border-black bg-zinc-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FCD34D]">
                <tr className="border-b-2 border-black">
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Team</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Leader email</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Amount</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Status</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Date</th>
                  <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                    <td className={`px-4 py-3 text-white font-medium ${softura.className}`}>{t.teamName}</td>
                    <td className={`px-4 py-3 text-zinc-400 ${softura.className}`}>{t.leaderEmail}</td>
                    <td className={`px-4 py-3 font-mono text-[#FCD34D] font-bold`}>₹{t.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold border-2 border-black ${softura.className} ${
                        t.status === "verified" ? "bg-[#4caf50] text-white" : 
                        t.status === "rejected" ? "bg-red-500 text-white" : 
                        "bg-[#ff9800] text-black"
                      }`}>{t.status}</span>
                    </td>
                    <td className={`px-4 py-3 text-zinc-500 text-xs ${softura.className}`}>{new Date(t.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3"><RevenueStatusButtons type="team" id={t.id} status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {teams.length === 0 && <div className={`py-12 text-center text-zinc-500 ${softura.className}`}>No event team registrations yet.</div>}
          <div className="px-4 pb-3">
            <AdminPagination total={teamTotal} page={teamPage} buildHref={buildTeamHref} />
          </div>
        </div>
      </section>
    </div>
  );
}
