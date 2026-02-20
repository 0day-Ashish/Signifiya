import localFont from "next/font/local";
import { getAttendees } from "../actions";
import { AdminPagination, PAGE_SIZE } from "../components/AdminPagination";
import { SearchBox } from "./SearchBox";
import { AttendeesClient } from "./AttendeesClient";
import { RefreshButton } from "../components/RefreshButton";

const gilton = localFont({ src: "../../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

type AttendeesPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

export default async function AdminAttendeesPage({ searchParams }: AttendeesPageProps) {
  const resolved = await searchParams;
  const search = (resolved?.search ?? "").trim();
  const page = Math.max(1, parseInt(resolved?.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const { attendees, total } = await getAttendees({ search: search || undefined, limit: PAGE_SIZE, offset });

  function buildHref(p: number) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return `/admin/attendees${q ? `?${q}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight text-white ${gilton.className}`}>Attendees</h1>
        <RefreshButton />
      </div>

      <SearchBox initialSearch={search} />

      <p className={`text-zinc-400 text-sm ${softura.className}`}>
        Total Verified: <span className="text-[#deb3fa] font-bold">{total}</span>
      </p>

      <AttendeesClient attendees={attendees} />

      <div className="px-4 pb-3">
        <AdminPagination total={total} page={page} buildHref={buildHref} />
      </div>
    </div>
  );
}
