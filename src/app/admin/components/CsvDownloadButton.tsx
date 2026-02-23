"use client";

import { useState } from "react";

/**
 * Generic CSV download button.
 * `fetchCsv` should be a server-action (or async function) returning a CSV string.
 * `filename` is the .csv file name for the download.
 */
export function CsvDownloadButton({
  fetchCsv,
  filename,
  label = "Download CSV",
  className,
}: {
  fetchCsv: () => Promise<string>;
  filename: string;
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const csv = await fetchCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("CSV download failed:", e);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        className ??
        "px-4 py-2 bg-emerald-500 text-black border-2 border-black rounded-lg font-bold text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-wait"
      }
    >
      {loading ? "Exporting…" : label}
    </button>
  );
}
