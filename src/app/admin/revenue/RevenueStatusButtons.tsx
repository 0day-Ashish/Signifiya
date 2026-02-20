"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateVisitorStatus, updateParticipantTeamStatus } from "../actions";

function Spinner() {
  return (
    <svg
      className="inline-block w-3 h-3 animate-spin"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const LABELS: Record<string, string> = {
  verified: "Verifying",
  rejected: "Rejecting",
  pending: "Updating",
};

export function RevenueStatusButtons({ type, id, status }: { type: "visitor" | "team"; id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function setStatus(s: "pending" | "verified" | "rejected") {
    setLoading(s);
    try {
      if (type === "visitor") await updateVisitorStatus(id, s);
      else await updateParticipantTeamStatus(id, s);
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1">
        <Spinner />
        <span className="text-[10px] font-medium text-zinc-400">{LABELS[loading] ?? "Updating"}…</span>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {status !== "verified" && <button onClick={() => setStatus("verified")} className="rounded bg-green-600/80 px-2 py-1 text-[10px] font-medium text-white hover:bg-green-600">Verify</button>}
      {status !== "rejected" && <button onClick={() => setStatus("rejected")} className="rounded bg-red-600/80 px-2 py-1 text-[10px] font-medium text-white hover:bg-red-600">Reject</button>}
      {status !== "pending" && <button onClick={() => setStatus("pending")} className="rounded bg-zinc-600/80 px-2 py-1 text-[10px] font-medium text-white hover:bg-zinc-600">Pending</button>}
    </div>
  );
}
