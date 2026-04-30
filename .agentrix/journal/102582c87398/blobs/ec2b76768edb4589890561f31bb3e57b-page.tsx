import { getEvents } from "../actions";
import Link from "next/link";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">Events</h1>
      <p className="text-zinc-400 text-sm">Per-event: click an event to see registered teams and members.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Link
            key={e.id}
            href={`/admin/events/${e.id}`}
            className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-violet-500/50 hover:bg-zinc-800/50 transition-colors"
          >
            <h2 className="font-bold text-white">{e.name}</h2>
            <p className="text-xs text-zinc-500 mt-1">{e.type || "—"} · ₹{e.price}</p>
            <p className="text-xs text-violet-400 mt-2">Teams registered: {e._count.participantTeams}</p>
            <p className="text-xs text-zinc-500 mt-1">{new Date(e.date).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 py-12 text-center text-zinc-500">
          No events. Run the seed or add events in the database.
        </div>
      )}
    </div>
  );
}
