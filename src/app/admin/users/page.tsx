import { getUsers } from "../actions";
import { UserSearchBox } from "./UserSearchBox";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";
import { AdminToggleButton } from "./AdminToggleButton";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

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
      <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight text-white ${gilton.className}`}>Users</h1>

      <UserSearchBox initialSearch={search} />

      <p className={`text-zinc-400 text-sm ${softura.className}`}>
        Total: <span className="text-[#deb3fa] font-bold">{total}</span>
        {search ? ` (matching "${search}")` : ""}
      </p>

      <div className="rounded-xl border-2 border-black bg-zinc-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-zinc-800 bg-[#deb3fa]">
                <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Name</th>
                <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Booking ID</th>
                <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Email</th>
                <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>College</th>
                <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Mobile</th>
                <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Role</th>
                <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Joined</th>
                <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                  <td className={`px-4 py-3 text-white font-medium ${softura.className}`}>{u.name}</td>
                  <td className={`px-4 py-3 text-zinc-300 font-mono text-xs ${softura.className}`}>{u.bookingId || "—"}</td>
                  <td className={`px-4 py-3 text-zinc-300 ${softura.className}`}>{u.email}</td>
                  <td className={`px-4 py-3 text-zinc-400 ${softura.className}`}>{u.collegeName || "—"}</td>
                  <td className={`px-4 py-3 text-zinc-400 ${softura.className}`}>{u.mobileNo || "—"}</td>
                  <td className="px-4 py-3">
                    {u.role === "admin" ? (
                      <span className={`px-2 py-1 bg-[#4caf50] text-white text-xs font-bold rounded-lg border-2 border-black ${softura.className}`}>
                        Admin
                      </span>
                    ) : (
                      <span className={`px-2 py-1 bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg ${softura.className}`}>User</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-zinc-500 ${softura.className}`}>{new Date(u.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                  <td className="px-4 py-3">
                    <AdminToggleButton userId={u.id} isAdmin={u.role === "admin"} userEmail={u.email} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className={`py-12 text-center text-zinc-500 ${softura.className}`}>No users found.</div>
        )}
        <div className="px-4 pb-3">
          <AdminPagination total={total} page={page} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
