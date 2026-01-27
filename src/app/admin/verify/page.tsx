"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getPassesByBookingId, getEventTeamsByBookingId, markPassAttended, markEventTeamLeaderAttended, markEventTeamMemberAttended, resolveToBookingId } from "../actions";

type PassRow = {
  id: string;
  type: string;
  userBookingId: string | null;
  validUntil: Date;
  verifiedAt: Date | null;
  verifiedBy: string | null;
  verifiedDay1At: Date | null;
  verifiedDay2At: Date | null;
  qrCode: string | null;
};

type EventTeamRow = {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderAttendedAt: Date | null;
  leaderAttendedBy: string | null;
  eventNames: string;
  qrCode: string | null;
  members: { id: string; name: string; college: string | null; attendedAt: Date | null; attendedBy: string | null }[];
};

export default function AdminVerifyPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const [passes, setPasses] = useState<PassRow[]>([]);
  const [eventTeams, setEventTeams] = useState<EventTeamRow[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const handledRef = useRef(false);
  const resultsRef = useRef<HTMLElement | null>(null);
  const beepAudioRef = useRef<HTMLAudioElement | null>(null);

  const fetchBoth = useCallback(async (bid: string) => {
    const [passRes, teamRes] = await Promise.all([
      getPassesByBookingId(bid),
      getEventTeamsByBookingId(bid),
    ]);
    setPasses(passRes.passes);
    setEventTeams(teamRes.teams);
    setUserName(passRes.userName);
    setUserEmail(passRes.userEmail);
  }, []);

  // Initialize audio for beep sound
  useEffect(() => {
    beepAudioRef.current = new Audio("/qr-code-scan-beep.mp3");
    beepAudioRef.current.volume = 0.9; // Set volume to 90%
    return () => {
      if (beepAudioRef.current) {
        beepAudioRef.current.pause();
        beepAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!showScanner) return;
    handledRef.current = false;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("admin-qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { 
          facingMode: "environment",
        },
        { 
          fps: 30, // Increased from 10 to 30 for faster scanning (3x faster frame processing)
          qrbox: { width: 300, height: 300 }, // Increased scanning area from 250x250 for better detection
          aspectRatio: 1.0, // Square aspect ratio for optimized performance
          disableFlip: false, // Allow both orientations
        },
        (decodedText) => {
          if (handledRef.current) return;
          handledRef.current = true;
          void (async () => {
            try {
              const bid = await resolveToBookingId(decodedText);
              if (bid) {
                // Play beep sound on successful scan
                if (beepAudioRef.current) {
                  beepAudioRef.current.currentTime = 0; // Reset to start
                  beepAudioRef.current.play().catch(() => {
                    // Ignore audio play errors (e.g., user interaction required)
                  });
                }
                setShowScanner(false);
                setError(null);
                setQuery(bid);
                setSearched(false);
                setLoading(true);
                try {
                  await fetchBoth(bid);
                  setSearched(true);
                  setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Lookup failed");
                  setSearched(true);
                } finally {
                  setLoading(false);
                }
              } else {
                setShowScanner(false);
                setError("QR not recognized. Use a visitor or event pass QR.");
              }
            } catch (e) {
              setShowScanner(false);
              setError(e instanceof Error ? e.message : "Resolve failed");
            }
          })();
        },
        () => {}
      );
    })().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not start camera");
      setShowScanner(false);
    });

    return () => {
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [showScanner, fetchBoth]);

  const handleLookup = async () => {
    const bid = query.trim();
    if (!bid) {
      setError("Enter a Booking ID");
      return;
    }
    setError(null);
    setSearched(false);
    setLoading(true);
    try {
      await fetchBoth(bid);
      setSearched(true);
    } catch (e: unknown) {
      setPasses([]);
      setEventTeams([]);
      setUserName(null);
      setUserEmail(null);
      setSearched(true);
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttended = async (passId: string, day: "day1" | "day2") => {
    const key = `${passId}-${day}`;
    setMarking(key);
    try {
      await markPassAttended(passId, day);
      const bid = query.trim();
      if (bid) await fetchBoth(bid);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to mark attended");
    } finally {
      setMarking(null);
    }
  };

  const handleMarkLeaderAttended = async (teamId: string) => {
    const key = `leader-${teamId}`;
    setMarking(key);
    try {
      await markEventTeamLeaderAttended(teamId);
      const bid = query.trim();
      if (bid) await fetchBoth(bid);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to mark leader attended");
    } finally {
      setMarking(null);
    }
  };

  const handleMarkMemberAttended = async (memberId: string) => {
    const key = `member-${memberId}`;
    setMarking(key);
    try {
      await markEventTeamMemberAttended(memberId);
      const bid = query.trim();
      if (bid) await fetchBoth(bid);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to mark member attended");
    } finally {
      setMarking(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleLookup();
  };

  const hasVisitor = passes.length > 0;
  const hasEvent = eventTeams.length > 0;
  const hasAny = hasVisitor || hasEvent;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">Verification</h1>
      <p className="text-zinc-400 text-sm max-w-xl">
        On event day, visitors show their QR or tell their Booking ID. Enter the Booking ID to see visitor passes and event passes (teams) linked to it, and log attendance for the team lead and teammates.
      </p>

      {/* Lookup */}
      <section className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Booking ID</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. SGF26-A1B2C3D4"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLookup}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-sm disabled:opacity-50 transition-colors"
          >
            {loading ? "Looking up…" : "Look up"}
          </button>
          <button
            type="button"
            onClick={() => { setError(null); setShowScanner(true); }}
            className="md:hidden px-5 py-3 rounded-lg border-2 border-emerald-500/60 bg-emerald-500/10 text-emerald-400 font-bold uppercase text-sm hover:bg-emerald-500/20 transition-colors"
          >
            Scan QR
          </button>
        </div>
      </section>

      {/* Mobile-only QR scanner modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
          <div className="flex w-full max-w-[320px] items-center justify-between mb-3">
            <span className="text-sm font-bold uppercase text-white">Scan visitor or event pass QR</span>
            <button
              type="button"
              onClick={() => setShowScanner(false)}
              className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
            >
              Close
            </button>
          </div>
          <div id="admin-qr-reader" className="min-h-[260px] w-full max-w-[min(300px,90vw)] overflow-hidden rounded-xl bg-zinc-900" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-400 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {searched && (
        <section ref={resultsRef} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          {!hasAny ? (
            <div className="p-8 text-center text-zinc-500">
              No passes found for this Booking ID. Ask the visitor to confirm their ID or to show their QR.
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-800/50">
                <h2 className="font-bold text-white">Passes for Booking ID: {query.trim()}</h2>
                {userName && <p className="text-sm text-zinc-400">Visitor: {userName} {userEmail && `(${userEmail})`}</p>}
              </div>

              {/* Visitor passes */}
              {hasVisitor && (
                <div className="border-b border-zinc-800">
                  <div className="px-4 py-2 bg-zinc-800/30">
                    <h3 className="font-bold text-zinc-300 text-sm uppercase">Visitor passes</h3>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {passes.map((p) => {
                      const isDual = p.type === "Dual day pass" || p.type === "Dual Day Pass";
                      const isDay2Only = p.type === "Day 2 Pass";
                      const isSingleDay = p.type === "Single day pass" || p.type === "Day 1 Pass";
                      const attended1 = p.verifiedDay1At ?? (isDual ? null : (isSingleDay ? p.verifiedAt : null));
                      const attended2 = p.verifiedDay2At ?? (isDay2Only ? p.verifiedAt : null);

                      return (
                        <div key={p.id} className="px-4 py-4 flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-white">{p.type}</p>
                            <p className="text-xs text-zinc-500 font-mono">{p.userBookingId} · Valid until {new Date(p.validUntil).toLocaleDateString()}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {isDual ? (
                              <>
                                {attended1 ? (
                                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                                    ✓ Day 1 {new Date(attended1).toLocaleString()}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleMarkAttended(p.id, "day1")}
                                    disabled={!!marking}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm disabled:opacity-50 transition-colors"
                                  >
                                    {marking === `${p.id}-day1` ? "…" : "Mark Day 1"}
                                  </button>
                                )}
                                {attended2 ? (
                                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                                    ✓ Day 2 {new Date(attended2).toLocaleString()}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleMarkAttended(p.id, "day2")}
                                    disabled={!!marking}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm disabled:opacity-50 transition-colors"
                                  >
                                    {marking === `${p.id}-day2` ? "…" : "Mark Day 2"}
                                  </button>
                                )}
                              </>
                            ) : (
                              (attended1 || attended2) ? (
                                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                                  ✓ Attended {new Date(attended1 || attended2!).toLocaleString()}
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleMarkAttended(p.id, isDay2Only ? "day2" : "day1")}
                                  disabled={!!marking}
                                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm disabled:opacity-50 transition-colors"
                                >
                                  {marking === `${p.id}-day1` || marking === `${p.id}-day2` ? "…" : isSingleDay || isDay2Only ? "Mark attended" : "Mark attended"}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Event passes (teams) */}
              {hasEvent && (
                <div>
                  <div className="px-4 py-2 bg-zinc-800/30">
                    <h3 className="font-bold text-zinc-300 text-sm uppercase">Event passes (teams)</h3>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {eventTeams.map((t) => (
                      <div key={t.id} className="px-4 py-4 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-white">{t.eventNames} — {t.teamName}</p>
                            <p className="text-xs text-zinc-500 font-mono">{t.qrCode && `QR: ${t.qrCode}`}</p>
                          </div>
                        </div>
                        {/* Team lead */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pl-2 border-l-2 border-emerald-500/50">
                          <span className="text-sm text-zinc-300">Team lead: <strong className="text-white">{t.leaderName}</strong></span>
                          {t.leaderAttendedAt ? (
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                              ✓ Attended {new Date(t.leaderAttendedAt).toLocaleString()}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkLeaderAttended(t.id)}
                              disabled={!!marking}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm disabled:opacity-50 transition-colors"
                            >
                              {marking === `leader-${t.id}` ? "…" : "Mark attended"}
                            </button>
                          )}
                        </div>
                        {/* Teammates */}
                        {t.members.length > 0 && (
                          <div className="space-y-2 pl-2">
                            <p className="text-xs font-bold uppercase text-zinc-500">Teammates</p>
                            {t.members.map((m) => (
                              <div key={m.id} className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-sm text-zinc-400">{m.name}{m.college ? ` (${m.college})` : ""}</span>
                                {m.attendedAt ? (
                                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                                    ✓ Attended {new Date(m.attendedAt).toLocaleString()}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleMarkMemberAttended(m.id)}
                                    disabled={!!marking}
                                    className="px-2 py-1 rounded-lg bg-zinc-600 hover:bg-zinc-500 text-white font-bold text-xs disabled:opacity-50 transition-colors"
                                  >
                                    {marking === `member-${m.id}` ? "…" : "Mark attended"}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
