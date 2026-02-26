import { getParticipantTeams, getOrganizingMembers, exportParticipantTeamsCsv } from "../actions";
import { OrganizingMemberForm } from "./OrganizingMemberForm";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";

type SearchParams = Promise<{ page?: string }> | { page?: string };

import { RefreshButton } from "../components/RefreshButton";
import { CsvDownloadButton } from "../components/CsvDownloadButton";
import TeamTableClient from "../components/TeamTableClient";

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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">Teams</h1>
        <div className="flex gap-2">
          <CsvDownloadButton fetchCsv={exportParticipantTeamsCsv} filename="teams.csv" label="⬇ Teams CSV" />
          <RefreshButton />
        </div>
      </div>

      <section>
        <h2 className="font-bold text-white mb-3">Participant teams (event registrations) — {total}</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <TeamTableClient teams={teams} />
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
