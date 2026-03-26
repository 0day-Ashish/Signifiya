"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getGroupedScannedTeams, scanTeamByQr } from "./actions";
import { Toaster, toast } from "sonner";

type ScanTeamRow = {
  id: string;
  qrValue: string;
  status: string;
  message: string | null;
  scannedAt: Date;
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  teamQrCode: string | null;
  eventNames: string;
  alreadyMarked: boolean;
};

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { ssr: false },
);

function toCsv(rows: ScanTeamRow[]) {
  const headers = [
    "Scanned At",
    "Status",
    "QR",
    "Team",
    "Leader",
    "Leader Email",
    "College",
    "Events",
    "Message",
  ];

  const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const body = rows.map((row) => {
    return [
      new Date(row.scannedAt).toISOString(),
      row.status,
      row.qrValue,
      row.teamName,
      row.leaderName,
      row.leaderEmail,
      row.college,
      row.eventNames,
      row.message || "",
    ]
      .map((cell) => escapeCell(String(cell)))
      .join(",");
  });

  return [headers.join(","), ...body].join("\n");
}

function downloadCsv(rows: ScanTeamRow[], filename: string) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function DataTable({ title, rows }: { title: string; rows: ScanTeamRow[] }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white" id={title.includes("New") ? "new-table" : "repeat-table"}>
      <div className="flex items-center justify-between border-b border-zinc-200 p-3">
        <h2 className="text-sm font-semibold text-zinc-800">{title}</h2>
        <button
          type="button"
          onClick={() => downloadCsv(rows, `${title.toLowerCase().replace(/\s+/g, "-")}.csv`)}
          className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Export CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="p-4 text-sm text-zinc-500">No rows yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="p-2">Time</th>
                <th className="p-2">Team</th>
                <th className="p-2">Leader</th>
                <th className="p-2">Events</th>
                <th className="p-2">QR</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-zinc-100">
                  <td className="p-2 text-zinc-600">{new Date(row.scannedAt).toLocaleString()}</td>
                  <td className="p-2 text-zinc-900">{row.teamName}</td>
                  <td className="p-2 text-zinc-700">{row.leaderName}</td>
                  <td className="p-2 text-zinc-700">{row.eventNames}</td>
                  <td className="p-2 font-mono text-zinc-600">{row.qrValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function ScanClient() {
  const [qrInput, setQrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(true);
  const [newlyMarked, setNewlyMarked] = useState<ScanTeamRow[]>([]);
  const [alreadyMarked, setAlreadyMarked] = useState<ScanTeamRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastScanValue, setLastScanValue] = useState("");

  const lockRef = useRef(false);
  const lastProcessedRef = useRef<{ qr: string; at: number } | null>(null);
  const scanRef = useRef<HTMLElement | null>(null);
  const newRef = useRef<HTMLDivElement | null>(null);
  const repeatRef = useRef<HTMLDivElement | null>(null);

  const loadTables = async () => {
    setRefreshing(true);
    try {
      const grouped = await getGroupedScannedTeams();
      setNewlyMarked(grouped.newlyMarked);
      setAlreadyMarked(grouped.alreadyMarked);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load scans";
      setError(msg);
      toast.error(msg);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadTables();
  }, []);

  const insertRow = (row: ScanTeamRow) => {
    if (row.status === "success") {
      setNewlyMarked((prev) => [row, ...prev]);
      return;
    }
    setAlreadyMarked((prev) => [row, ...prev]);
  };

  const submitScan = async (rawValue: string) => {
    const qr = rawValue.trim();
    if (!qr) return;

    setError(null);
    setLoading(true);

    try {
      const result = await scanTeamByQr(qr);
      setLastScanValue(qr);
      insertRow(result.row);
      setQrInput("");
      toast.success(result.message);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Scan failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 pb-20 text-zinc-900" ref={scanRef}>
      <Toaster richColors position="top-right" />

      <div className="mx-auto w-full max-w-md p-4">
        <h1 className="text-lg font-semibold">Scan Team QR</h1>
        <p className="mt-1 text-xs text-zinc-600">Admin-only mobile scanner. Latest scans appear first.</p>

        <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">QR Scanner</p>
            <button
              type="button"
              onClick={() => setShowScanner((v) => !v)}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
            >
              {showScanner ? "Hide" : "Show"}
            </button>
          </div>

          {showScanner && (
            <div className="relative overflow-hidden rounded-lg border border-zinc-200">
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/55">
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-zinc-800">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
                    Processing scan
                  </div>
                </div>
              )}

              <Scanner
                onScan={(detectedCodes: { rawValue: string }[]) => {
                  if (lockRef.current || detectedCodes.length === 0) return;
                  const value = detectedCodes[0]?.rawValue;
                  if (!value) return;

                  const now = Date.now();
                  const prev = lastProcessedRef.current;
                  if (prev && prev.qr === value && now - prev.at < 1800) return;

                  lastProcessedRef.current = { qr: value, at: now };
                  lockRef.current = true;

                  void submitScan(value).finally(() => {
                    setTimeout(() => {
                      lockRef.current = false;
                    }, 600);
                  });
                }}
                onError={(e) => {
                  const msg = e instanceof Error ? e.message : "Scanner failed";
                  setError(msg);
                }}
                components={{ finder: true }}
              />
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="EP-..."
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => void submitScan(qrInput)}
              disabled={loading}
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              Scan
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-zinc-500">Last: {lastScanValue || "-"}</p>
            <button
              type="button"
              onClick={() => void loadTables()}
              disabled={refreshing}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
            >
              {refreshing ? "Refreshing" : "Refresh Tables"}
            </button>
          </div>

          {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
        </section>

        <div className="mt-4 space-y-4">
          <div ref={newRef}>
            <DataTable title="Newly Marked" rows={newlyMarked} />
          </div>
          <div ref={repeatRef}>
            <DataTable title="Already Marked" rows={alreadyMarked} />
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-md grid-cols-3">
          <button
            type="button"
            className="px-2 py-3 text-xs font-medium text-zinc-700"
            onClick={() => scanRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Scanner
          </button>
          <button
            type="button"
            className="px-2 py-3 text-xs font-medium text-zinc-700"
            onClick={() => newRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            New
          </button>
          <button
            type="button"
            className="px-2 py-3 text-xs font-medium text-zinc-700"
            onClick={() => repeatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Repeat
          </button>
        </div>
      </nav>
    </main>
  );
}
