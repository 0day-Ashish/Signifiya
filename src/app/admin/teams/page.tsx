import { getParticipantTeams, getOrganizingMembers } from "../actions";
import { OrganizingMemberForm } from "./OrganizingMemberForm";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";

type SearchParams = Promise<{ page?: string }> | { page?: string };

export default async function AdminTeamsPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = await Promise.resolve(searchParams ?? {});
  const page = Math.max(1, parseInt(resolved?.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [{ teams, total }, organizing] = await Promise.all([
    getParticipantTeams({ limit: PAGE_SIZE, offset }),
    getOrganizingMembers(),
  ]);

  function buildHref(p: number) {
    return p > 1 ? `/admin/teams?page=${p}` : "/admin/teams";
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">Teams</h1>

      <section>
        <h2 className="font-bold text-white mb-3">Participant teams (event registrations) — {total}</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="px-4 py-3 font-bold text-zinc-300">Team</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Leader</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Booking ID</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">College</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Events</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Amount</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr id={`team-${t.id}`} key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="px-4 py-3">
                      <span className="font-medium text-white">{t.teamName}</span>
                      <p className="text-xs text-zinc-500">{t.members.map((m) => `${m.name || ""}${m.college ? ` (${m.college})` : ""}`).join(", ")}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{t.leaderName}<br /><span className="text-xs">{t.leaderEmail}</span><br /><span className="text-xs">{t.leaderPhone}</span></td>
                    <td className="px-4 py-3 font-mono text-zinc-400 text-xs">{t.leaderBookingId || "—"}</td>
                    <td className="px-4 py-3 text-zinc-400">{t.college}</td>
                    <td className="px-4 py-3 text-zinc-400">{t.events.map((e) => e.event.name).join(", ")}</td>
                    <td className="px-4 py-3 font-mono text-zinc-300">₹{t.totalAmount}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${t.status === "verified" ? "bg-green-500/20 text-green-400" : t.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {teams.length === 0 && <div className="py-12 text-center text-zinc-500">No participant teams yet.</div>}
          <div className="px-4 pb-3">
            <AdminPagination total={total} page={page} buildHref={buildHref} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-white mb-3">Organizing committee (/teams page)</h2>
        <OrganizingMemberForm />
        <ul className="mt-4 space-y-2">
          {organizing.map((m) => (
            <li key={m.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
              <OrganizingMemberForm edit={m} />
            </li>
          ))}
        </ul>
        {organizing.length === 0 && <p className="text-zinc-500 text-sm mt-2">No organizing members. Add one above.</p>}
      </section>
    </div>
  );
}
