"use client";

import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas-pro";
import { useRef, useState, useEffect } from "react";
import { APP_CONFIG } from "@/config/app.config";

interface EventCardProps {
  teamLeadName: string;
  eventName: string;
  bookingId: string;
  teamName: string;
  eventTime: string;
  qrCode: string;
  members?: { name: string }[];
  embedded?: boolean;
  /** Hide download CTA when rendering inside small containers like modals */
  showDownload?: boolean;
  /** Smaller embedded layout for constrained spaces */
  compact?: boolean;
}

/** Animated QR generation placeholder */
function QrGeneratingAnimation({ size }: { size: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Grid of animated blocks */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-[3px] p-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm bg-zinc-700 animate-pulse"
            style={{
              animationDelay: `${(i % 7) * 120}ms`,
              animationDuration: "1s",
              opacity: Math.random() > 0.3 ? 1 : 0.3,
            }}
          />
        ))}
      </div>
      {/* Scanning line */}
      <div className="absolute inset-0 overflow-hidden rounded">
        <div
          className="absolute left-0 right-0 h-[2px] bg-purple-400/80"
          style={{
            animation: "qrScanLine 1.5s ease-in-out infinite",
          }}
        />
      </div>
      {/* Label */}
      <span className="relative z-10 text-[9px] font-bold text-purple-300 uppercase tracking-wider">
        Generating
      </span>
    </div>
  );
}

export default function EventCard({
  teamLeadName,
  eventName,
  bookingId,
  teamName,
  eventTime,
  qrCode,
  members,
  embedded,
  showDownload = true,
  compact = false,
}: EventCardProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [qrReady, setQrReady] = useState(false);

  // Simulate a short QR generation delay for the animation
  useEffect(() => {
    setQrReady(false);
    const timer = setTimeout(() => setQrReady(true), 1200);
    return () => clearTimeout(timer);
  }, [qrCode]);

  const handleDownload = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current, { backgroundColor: null });
      const link = document.createElement("a");
      link.download = "event-pass.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const wrapperClass = embedded
    ? `flex w-full flex-col items-center ${compact ? "p-0" : "p-4"}`
    : "flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24 bg-zinc-900";

  const qrSize = compact ? 92 : 100;

  return (
    <main className={wrapperClass}>
      {/* QR scan-line animation keyframes */}
      <style jsx>{`
        @keyframes qrScanLine {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>

      <div ref={ticketRef} className="w-full max-w-[400px] h-full bg-[#d400ff] rounded-[20px] p-1">
        <div className={`w-full ${compact ? "min-h-[400px] sm:min-h-[440px]" : "min-h-[520px] sm:min-h-[620px]"} bg-zinc-950 px-4 sm:px-8 rounded-[18px] shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl relative overflow-hidden flex flex-col`}>
          {/* Background */}
          <div className="absolute top-0 left-0 w-full h-full pb-20 z-0">
            <Image src="/logo2.png" alt="Signifiya Logo" width={50} height={50} className="absolute top-2 left-2 bg-transparent backdrop-blur-3xl outline-white/10 outline rounded-full" />
            <video src="/bg.mp4" className="w-full h-50 object-cover" autoPlay loop muted playsInline />
          </div>
          <div>
            <Image src="/robo.png" alt="" width={200} height={100} className="absolute top-5 right-0 w-32 sm:w-48 md:w-50 h-auto" />
          </div>

          {/* Header */}
          <div className="relative z-20 flex text-start justify-start gap-2 w-full h-50 items-end pb-4">
            <h1 className="text-md tracking-tighter font-bold text-zinc-400 pt-12">Signifiya</h1>
            <h1 className="text-md tracking-tighter font-bold text-zinc-400">{APP_CONFIG.event.year}</h1>
          </div>

          {/* Event label */}
          <div className="relative z-20 flex text-center pt-2 justify-start gap-2 items-end">
            <h1 className="text-lg font-bold tracking-tighter text-zinc-400">Event :</h1>
            <span className="text-lg tracking-tighter font-semibold text-zinc-400 truncate max-w-[200px]">{eventName}</span>
          </div>

          {/* Team Lead + Members */}
          <div className="relative z-20 mt-6 flex flex-col items-start text-left">
            <span className="text-white text-sm font-medium">Team Lead.</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tighter leading-tight text-white">{teamLeadName || "—"}</h1>
            {members && members.length > 0 && (
              <div className="mt-2 w-full">
                <span className="text-white text-xs font-medium">Team members</span>
                <ul className="mt-0.5 space-y-0 text-sm font-medium text-white/90">
                  {members.map((m, i) => (
                    <li key={i}>{m.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Spacer to push bottom section down */}
          <div className="flex-1" />

          {/* QR + Details — bottom section */}
          <div className="relative z-20 pb-6 sm:pb-8 flex flex-col justify-start items-start gap-2">
            <div className="flex flex-row justify-center gap-4 sm:gap-8">
              <div className="shrink-0 p-2 border bg-white border-zinc-800 rounded-md border-dashed flex items-center justify-center" style={{ minWidth: qrSize + 16, minHeight: qrSize + 16 }}>
                {qrReady ? (
                  <QRCodeCanvas value={qrCode} size={qrSize} />
                ) : (
                  <QrGeneratingAnimation size={qrSize} />
                )}
              </div>
              <div className="gap-1.5 sm:gap-2 flex flex-col min-w-0 flex-1">
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-zinc-500 font-medium tracking-tighter text-xs">Booking ID</span>
                  <h1 className="text-xs sm:text-sm md:text-base font-bold tracking-tighter font-mono text-white whitespace-nowrap overflow-hidden text-ellipsis" title={bookingId || undefined}>{bookingId || "—"}</h1>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-zinc-500 font-medium tracking-tighter text-xs">Team Name</span>
                  <h2 className="text-xs sm:text-sm font-semibold tracking-tighter text-white truncate">{teamName}</h2>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-zinc-500 font-medium tracking-tighter text-xs">Event Time</span>
                  <h2 className="text-xs sm:text-sm font-semibold tracking-tighter text-white">{eventTime || "10:00 AM - 5:00 PM"}</h2>
                </div>
                <p className="text-[10px] text-zinc-500 max-w-[140px]">Scan QR or use Booking ID at entry.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDownload && (
        <div className="w-full max-w-[400px] px-4 py-2 mt-2 flex justify-center items-center">
          <button
            onClick={handleDownload}
            className="w-full px-4 py-4 text-sm font-bold tracking-tighter text-zinc-400 rounded-[18px] bg-black cursor-pointer hover:text-white hover:bg-zinc-950 active:scale-[0.98] active:translate-y-0.5 shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl transition-all duration-300 ease-in-out flex justify-center items-center"
          >
            Download Ticket
          </button>
        </div>
      )}
    </main>
  );
}
