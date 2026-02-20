"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import { invalidateAdminStatsCache } from "../actions";

const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = async () => {
    startTransition(async () => {
      await invalidateAdminStatsCache();
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className={`shrink-0 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${softura.className}`}
    >
      <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isPending ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span className="hidden sm:inline">{isPending ? "Refreshing..." : "Refresh Data"}</span>
      <span className="sm:hidden">{isPending ? "..." : "Refresh"}</span>
    </button>
  );
}
