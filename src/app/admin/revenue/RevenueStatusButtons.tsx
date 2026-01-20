"use client";

import { useRouter } from "next/navigation";
import { updateVisitorStatus, updateParticipantTeamStatus } from "../actions";

export function RevenueStatusButtons({ type, id, status }: { type: "visitor" | "team"; id: string; status: string }) {
  const router = useRouter();

  async function setStatus(s: "pending" | "verified" | "rejected") {
    if (type === "visitor") await updateVisitorStatus(id, s);
    else await updateParticipantTeamStatus(id, s);
    router.refresh();
  }

  return (
    <div className="flex gap-1">
      {status !== "verified" && <button onClick={() => setStatus("verified")} className="rounded bg-green-600/80 px-2 py-1 text-[10px] font-medium text-white hover:bg-green-600">Verify</button>}
      {status !== "rejected" && <button onClick={() => setStatus("rejected")} className="rounded bg-red-600/80 px-2 py-1 text-[10px] font-medium text-white hover:bg-red-600">Reject</button>}
      {status !== "pending" && <button onClick={() => setStatus("pending")} className="rounded bg-zinc-600/80 px-2 py-1 text-[10px] font-medium text-white hover:bg-zinc-600">Pending</button>}
    </div>
  );
}
