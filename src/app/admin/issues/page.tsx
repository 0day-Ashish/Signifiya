import { getIssues } from "../actions";
import { IssueRow } from "./IssueRow";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";

type SearchParams = Promise<{ page?: string }> | { page?: string };

export default async function AdminIssuesPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = await Promise.resolve(searchParams ?? {});
  const page = Math.max(1, parseInt(resolved?.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const { issues, total } = await getIssues({ limit: PAGE_SIZE, offset });

  function buildHref(p: number) {
    return p > 1 ? `/admin/issues?page=${p}` : "/admin/issues";
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">Issues (Contact page reports)</h1>
      <p className="text-zinc-400 text-sm">Submitted via the &quot;Report an Issue&quot; form on the contact page.</p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                <th className="px-4 py-3 font-bold text-zinc-300">Report</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Name / Email</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Date</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Status</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((i) => (
                <tr key={i.id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 ${i.resolved ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 text-zinc-300 max-w-md"><p className="line-clamp-2">{i.text}</p></td>
                  <td className="px-4 py-3 text-zinc-400">{i.name || i.email || "—"}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(i.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${i.resolved ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>{i.resolved ? "Resolved" : "Open"}</span></td>
                  <td className="px-4 py-3"><IssueRow id={i.id} resolved={i.resolved} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {issues.length === 0 && <div className="py-12 text-center text-zinc-500">No issues reported yet.</div>}
        <div className="px-4 pb-3">
          <AdminPagination total={total} page={page} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
