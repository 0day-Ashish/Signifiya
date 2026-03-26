"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getScannedTeams, scanTeamByQr } from "./actions";
import { Toaster, toast } from "sonner";

type ScanTeamRow = {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  qrCode: string | null;
  eventNames: string;
  scannedAt: Date | null;
  alreadyMarked: boolean;
};

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { ssr: false },
);

export default function ScanPage() {
  const [accessKey, setAccessKey] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingRows, setFetchingRows] = useState(false);
  const [rows, setRows] = useState<ScanTeamRow[]>([]);
  const [lastScanValue, setLastScanValue] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lockRef = useRef(false);

  const canUseScanner = useMemo(() => accessKey.trim().length > 0, [accessKey]);

  useEffect(() => {
    lockRef.current = false;
  }, [showScanner]);

  const mergeRow = (nextRow: ScanTeamRow) => {
    setRows((prev) => {
      const next = prev.filter((row) => row.id !== nextRow.id);
      return [nextRow, ...next];
    });
  };

  const refreshTable = async () => {
    const key = accessKey.trim();
    if (!key) {
      setError("Enter access key first");
      return;
    }
    setError(null);
    setFetchingRows(true);
    try {
      const list = await getScannedTeams(key);
      setRows(list);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load rows";
      setError(message);
      toast.error(message);
    } finally {
      setFetchingRows(false);
    }
  };

  const submitScan = async (rawValue: string) => {
    const key = accessKey.trim();
    const qr = rawValue.trim();

    if (!key) {
      setError("Enter access key first");
      return;
    }

    if (!qr) {
      setError("QR value is empty");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await scanTeamByQr(qr, key);
      setLastScanValue(qr);
      mergeRow(result.row);
      if (result.markedNow) {
        toast.success(result.message);
      } else {
        toast.message(result.message);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Scan failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Toaster richColors position="top-right" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black tracking-tight uppercase">
          Team QR Scan
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
          Scan event pass QR codes to mark teams attended. Every successful scan
          is added to the table below.
        </p>

        <section className="mt-6 grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase text-zinc-400">
              Access Key
            </label>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Enter backdoor token"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refreshTable}
              disabled={fetchingRows}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700 disabled:opacity-60"
            >
              {fetchingRows ? "Refreshing..." : "Load Scanned Teams"}
            </button>
            <button
              type="button"
              onClick={() => setShowScanner((prev) => !prev)}
              disabled={!canUseScanner}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold uppercase text-white transition hover:bg-emerald-500 disabled:opacity-60"
            >
              {showScanner ? "Hide Scanner" : "Open Scanner"}
            </button>
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase text-zinc-400">
              Manual QR Value
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="EP-..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => void submitScan(qrInput)}
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold uppercase text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {loading ? "Marking..." : "Mark Team"}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}

          {lastScanValue && (
            <p className="text-xs font-mono text-zinc-400">
              Last scan: {lastScanValue}
            </p>
          )}
        </section>

        {showScanner && canUseScanner && (
          <section className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
            <p className="mb-3 text-sm text-zinc-300">
              Point the camera at an event pass QR code.
            </p>
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-zinc-700">
              <Scanner
                onScan={(detectedCodes: { rawValue: string }[]) => {
                  if (lockRef.current || detectedCodes.length === 0) return;
                  const rawValue = detectedCodes[0]?.rawValue;
                  if (!rawValue) return;
                  lockRef.current = true;
                  void submitScan(rawValue).finally(() => {
                    setTimeout(() => {
                      lockRef.current = false;
                    }, 1000);
                  });
                }}
                onError={(e) => {
                  const message =
                    e instanceof Error ? e.message : "Scanner failed";
                  setError(message);
                }}
                components={{ finder: true }}
              />
            </div>
          </section>
        )}

        <section className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
          <div className="border-b border-zinc-800 px-4 py-3">
            <h2 className="text-base font-bold uppercase tracking-wide text-zinc-100">
              Scanned Teams
            </h2>
          </div>

          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">
              No teams scanned yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                <thead className="bg-zinc-950/80 text-xs uppercase text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Team</th>
                    <th className="px-4 py-3 font-semibold">Leader</th>
                    <th className="px-4 py-3 font-semibold">Events</th>
                    <th className="px-4 py-3 font-semibold">Scanned At</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-800/40">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-zinc-100">
                          {row.teamName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {row.qrCode || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-zinc-200">{row.leaderName}</p>
                        <p className="text-xs text-zinc-500">
                          {row.leaderEmail}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {row.eventNames || "-"}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {row.scannedAt
                          ? new Date(row.scannedAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                          {row.alreadyMarked ? "Marked" : "New"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
