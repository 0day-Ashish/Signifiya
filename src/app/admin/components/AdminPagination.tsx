import Link from "next/link";

const PAGE_SIZE = 25;

export { PAGE_SIZE };

type AdminPaginationProps = {
  total: number;
  page: number;
  pageSize?: number;
  buildHref: (page: number) => string;
};

export function AdminPagination({ total, page, pageSize = PAGE_SIZE, buildHref }: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  if (totalPages <= 1 && total > 0) return null;

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 pt-2" aria-label="Pagination">
      <p className="text-xs text-zinc-500">
        {total === 0 ? "0 items" : `${from}–${to} of ${total}`}
      </p>
      <div className="flex items-center gap-1">
        {hasPrev ? (
          <Link
            href={buildHref(page - 1)}
            className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            ← Prev
          </Link>
        ) : (
          <span className="rounded border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-500 cursor-not-allowed">
            ← Prev
          </span>
        )}
        <span className="px-2 text-sm text-zinc-400">
          Page {page} of {totalPages}
        </span>
        {hasNext ? (
          <Link
            href={buildHref(page + 1)}
            className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            Next →
          </Link>
        ) : (
          <span className="rounded border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-500 cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}
