"use client";

import { useState } from "react";

export default function TeamTableClient({ teams }: { teams: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);

  return (
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
            <tr
              key={t.id}
              onClick={() => setSelected(t)}
              className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer"
            >
              <td className="px-4 py-3">
                <span className="font-medium text-white">{t.teamName}</span>
                <p className="text-xs text-zinc-500">
                  {t.members.map((m: any) => {
                    const parts = [m.name];
                    const maybeGameId = (m as { gameId?: string }).gameId;
                    if (maybeGameId) parts.push(`[${maybeGameId}]`);
                    if (m.college) parts.push(`(${m.college})`);
                    return parts.join(" ");
                  }).join(" | ")}
                </p>
              </td>
              <td className="px-4 py-3 text-zinc-300">
                {t.leaderName}
                <br />
                <span className="text-xs">{t.leaderEmail}</span>
                <br />
                <span className="text-xs">{t.leaderPhone}</span>
              </td>
              <td className="px-4 py-3 font-mono text-zinc-400 text-xs">{t.leaderBookingId || "—"}</td>
              <td className="px-4 py-3 text-zinc-400">{t.college}</td>
              <td className="px-4 py-3 text-zinc-400">{t.events.map((e: any) => e.event.name).join(", ")}</td>
              <td className="px-4 py-3 font-mono text-zinc-300">₹{t.totalAmount}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    t.status === "verified"
                      ? "bg-green-500/20 text-green-400"
                      : t.status === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative bg-zinc-900 rounded-xl p-6 w-full max-w-3xl mx-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-white">{selected.teamName}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-zinc-400 hover:text-white text-sm"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-400">Leader</p>
                <p className="text-white font-medium">{selected.leaderName}</p>
                <p className="text-xs text-zinc-500">{selected.leaderEmail}</p>
                <p className="text-xs text-zinc-500">{selected.leaderPhone}</p>
                <p className="text-xs text-zinc-500">Booking ID: {selected.leaderBookingId || "—"}</p>
                <p className="text-xs text-zinc-500">College: {selected.college || "—"}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Events</p>
                <p className="text-white">{selected.events.map((e: any) => e.event.name).join(", ")}</p>
                <p className="mt-3 text-sm text-zinc-400">Amount</p>
                <p className="text-white font-medium">₹{selected.totalAmount}</p>
                <p className="mt-2 text-sm text-zinc-400">Status</p>
                <p className="text-white font-medium">{selected.status}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-zinc-400">Members</p>
              <ul className="mt-2 space-y-2">
                {selected.members.map((m: any) => (
                  <li key={m.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{m.name}</p>
                        <p className="text-xs text-zinc-500">{m.email || "—"} · {m.phone || "—"}</p>
                        <p className="text-xs text-zinc-500">{m.college || "—"}</p>
                      </div>
                      <div className="text-xs text-zinc-400">
                        {m.gameId ? <span className="text-amber-400">{m.gameId}</span> : <span>—</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
