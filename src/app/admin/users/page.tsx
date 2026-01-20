import { getUsers } from "../actions";
import { UserSearchBox } from "./UserSearchBox";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";

type SearchParams = Promise<{ search?: string; page?: string }> | { search?: string; page?: string };

export default async function AdminUsersPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = await Promise.resolve(searchParams ?? {});
  const search = (resolved?.search ?? "").trim();
  const page = Math.max(1, parseInt(resolved?.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const { users, total } = await getUsers({ search: search || undefined, limit: PAGE_SIZE, offset });

  function buildHref(p: number) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return `/admin/users${q ? `?${q}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">Users</h1>

      <UserSearchBox initialSearch={search} />

      <p className="text-zinc-400 text-sm">Total: {total}{search ? ` (matching &quot;${search}&quot;)` : ""}</p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                <th className="px-4 py-3 font-bold text-zinc-300">Name</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Email</th>
                <th className="px-4 py-3 font-bold text-zinc-300">College</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Mobile</th>
                <th className="px-4 py-3 font-bold text-zinc-300">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-zinc-300">{u.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.collegeName || "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.mobileNo || "—"}</td>
                  <td className="px-4 py-3 text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="py-12 text-center text-zinc-500">No users found.</div>
        )}
        <div className="px-4 pb-3">
          <AdminPagination total={total} page={page} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
