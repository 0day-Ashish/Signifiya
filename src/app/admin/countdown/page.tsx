import { getAllCountdownDates } from "../actions";
import { CountdownForm } from "./CountdownForm";

export default async function AdminCountdownPage() {
  const countdowns = await getAllCountdownDates();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">
        Countdown Timer
      </h1>

      <section>
        <h2 className="font-bold text-white mb-3">Set Countdown Date</h2>
        <p className="text-zinc-400 text-sm mb-4">
          Set the target date for the countdown timer displayed on the homepage hero section.
        </p>
        <CountdownForm />
      </section>

      <section>
        <h2 className="font-bold text-white mb-3">
          Countdown History ({countdowns.length})
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="px-4 py-3 font-bold text-zinc-300">Label</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Target Date</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Status</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Created</th>
                  <th className="px-4 py-3 font-bold text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {countdowns.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3 text-white">
                      {c.label || <span className="text-zinc-500">No label</span>}
                    </td>
                    <td className="px-4 py-3 text-zinc-300 font-mono">
                      {new Date(c.targetDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          c.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-500/20 text-zinc-400"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </td>
                    <td className="px-4 py-3">
                      <CountdownForm edit={c} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {countdowns.length === 0 && (
            <div className="py-12 text-center text-zinc-500">
              No countdown dates set yet. Create one above.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
