"use client";

import { useRouter } from "next/navigation";
import { updateIssueResolved } from "../actions";

export function IssueRow({ id, resolved }: { id: string; resolved: boolean }) {
  const router = useRouter();

  async function toggle() {
    await updateIssueResolved(id, !resolved);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className="rounded bg-violet-600/80 px-2 py-1 text-xs font-medium text-white hover:bg-violet-600"
    >
      {resolved ? "Reopen" : "Resolve"}
    </button>
  );
}
