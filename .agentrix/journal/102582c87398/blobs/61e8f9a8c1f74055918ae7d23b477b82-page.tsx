import { getEventWithRegistrations } from "../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminPagination, PAGE_SIZE } from "../../components/AdminPagination";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }> | { page?: string };
};

export default async function AdminEventDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolved = await Promise.resolve(searchParams ?? {});
  const page = Math.max(1, parseInt(resolved?.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const { event, total } = await getEventWithRegistrations(id, { limit: PAGE_SIZE, offset });
  if (!event) notFound();

  function buildHref(p: number) {
    return p > 1 ? `/admin/events/${id}?page=${p}` : `/admin/events/${id}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="text-zinc-400 hover:text-white text-sm font-medium">← Events</Link>
      </div>
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">{event.name}</h1>
      <p className="text-zinc-400 text-sm">₹{event.price} · {event.type || "—"} · {new Date(event.date).toLocaleDateString()}</p>

      <h2 className="font-bold text-white">Teams registered ({total})</h2>
      <div className="space-y-4">
        {event.participantTeams.length === 0 && (
          <p className="text-zinc-500">No teams registered for this event yet.</p>
        )}
        {event.participantTeams.map((pte) => {
          const t = pte.team;
          return (
            <div key={pte.teamId + pte.eventId} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white">{t.teamName}</h3>
                  <p className="text-sm text-zinc-400">{t.leaderName} · {t.leaderEmail} · {t.college}</p>
                  <p className="text-xs text-zinc-500 mt-1">₹{t.totalAmount} · {t.status}</p>
                </div>
                <Link href={`/admin/teams#team-${t.id}`} className="text-xs text-violet-400 hover:underline">View in Teams →</Link>
              </div>
              <ul className="mt-3 pl-4 border-l-2 border-zinc-700 text-sm text-zinc-400">
                {t.members.map((m) => (
                  <li key={m.id}>{m.name}{m.college ? ` (${m.college})` : ""}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <AdminPagination total={total} page={page} buildHref={buildHref} />
    </div>
  );
}
