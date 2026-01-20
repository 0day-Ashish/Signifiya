import { getNewsletterSubscriptions } from "../actions";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";

type SearchParams = Promise<{ page?: string }> | { page?: string };

export default async function AdminNewsletterPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = await Promise.resolve(searchParams ?? {});
  const page = Math.max(1, parseInt(resolved?.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const { subscriptions, total } = await getNewsletterSubscriptions({ limit: PAGE_SIZE, offset });

  function buildHref(p: number) {
    return p > 1 ? `/admin/newsletter?page=${p}` : "/admin/newsletter";
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">Newsletter</h1>
      <p className="text-zinc-400 text-sm">Email subscriptions from the newsletter form on the site.</p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                <th className="px-4 py-3 font-bold text-zinc-300">Email</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Consent</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-4 py-3 text-zinc-300 font-medium">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${s.consent ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-400"}`}>
                      {s.consent ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {subscriptions.length === 0 && <div className="py-12 text-center text-zinc-500">No newsletter subscriptions yet.</div>}
        <div className="px-4 pb-3">
          <AdminPagination total={total} page={page} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
