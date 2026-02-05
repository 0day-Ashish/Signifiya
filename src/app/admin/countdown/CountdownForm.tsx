"use client";

import { useState, useTransition } from "react";
import {
  createCountdownDate,
  updateCountdownDate,
  deleteCountdownDate,
} from "../actions";

type CountdownDate = {
  id: string;
  targetDate: Date;
  label: string | null;
  isActive: boolean;
};

export function CountdownForm({ edit }: { edit?: CountdownDate }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Format date for datetime-local input
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const [targetDate, setTargetDate] = useState(
    edit ? formatDateForInput(edit.targetDate) : ""
  );
  const [label, setLabel] = useState(edit?.label || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!targetDate) {
      setError("Please select a target date");
      return;
    }

    startTransition(async () => {
      try {
        const date = new Date(targetDate);
        if (edit) {
          await updateCountdownDate(edit.id, {
            targetDate: date,
            label: label || undefined,
          });
        } else {
          await createCountdownDate({
            targetDate: date,
            label: label || undefined,
          });
          setTargetDate("");
          setLabel("");
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to save countdown date");
      }
    });
  };

  const handleSetActive = () => {
    if (!edit) return;
    startTransition(async () => {
      try {
        await updateCountdownDate(edit.id, { isActive: true });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to activate");
      }
    });
  };

  const handleDelete = () => {
    if (!edit) return;
    if (!confirm("Delete this countdown date?")) return;
    startTransition(async () => {
      try {
        await deleteCountdownDate(edit.id);
      } catch (err: any) {
        setError(err.message || "Failed to delete");
      }
    });
  };

  // Inline edit mode for existing entries
  if (edit) {
    return (
      <div className="flex items-center gap-2">
        {!edit.isActive && (
          <button
            type="button"
            onClick={handleSetActive}
            disabled={isPending}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 transition-colors"
          >
            {isPending ? "..." : "Set Active"}
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
        >
          {isPending ? "..." : "Delete"}
        </button>
      </div>
    );
  }

  // Create form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Target Date & Time
          </label>
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border-2 border-zinc-700 text-white focus:border-[#deb3fa] focus:outline-none transition-colors"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Label (optional)
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Signifiya 2026"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border-2 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#deb3fa] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      {success && (
        <p className="text-green-400 text-sm">Countdown date saved successfully!</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#deb3fa] text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 transition-all"
      >
        {isPending ? "Saving..." : "Set Countdown Date"}
      </button>
    </form>
  );
}
