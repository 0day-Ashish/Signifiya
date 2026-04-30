"use client";

import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas-pro";
import { useRef } from "react";
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
}

export default function EventCard({ teamLeadName, eventName, bookingId, teamName, eventTime, qrCode, members, embedded }: EventCardProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

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
    ? "flex flex-col items-center p-4"
    : "flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24 bg-zinc-900";

  return (
    <main className={wrapperClass}>
      <div ref={ticketRef} className="w-full max-w-[400px] h-full bg-[#d400ff] rounded-[20px] p-1">
        <div className="w-full h-[500px] sm:h-[600px] bg-zinc-950 px-4 sm:px-8 rounded-[18px] shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pb-20 z-0">
            <Image src="/logo2.png" alt="Signifiya Logo" width={50} height={50} className="absolute top-2 left-2 bg-transparent backdrop-blur-3xl outline-white/10 outline rounded-full" />
            <video src="/bg.mp4" className="w-full h-50 object-cover" autoPlay loop muted playsInline />
          </div>
          <div>
            <Image src="/robo.png" alt="" width={200} height={100} className="absolute top-5 right-0 w-32 sm:w-48 md:w-50 h-auto" />
          </div>

          <div className="relative z-20 flex text-start justify-start gap-2 w-full h-50 items-end pb-4">
            <h1 className="text-md tracking-tighter font-bold text-zinc-400 pt-12">Signifiya</h1>
            <h1 className="text-md tracking-tighter font-bold text-zinc-400">{APP_CONFIG.event.year}</h1>
          </div>

          <div className="relative z-20 flex text-center pt-2 justify-start gap-2 items-end">
            <h1 className="text-lg font-bold tracking-tighter text-zinc-400">Event :</h1>
            <span className="text-lg tracking-tighter font-semibold text-zinc-400 truncate max-w-[200px]">{eventName}</span>
          </div>

          {/* Team Lead (left) + Team members below */}
          <div className="relative z-20 mt-8 flex flex-col items-start text-left">
            <span className="text-zinc-500 text-sm font-medium">Team Lead.</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tighter leading-tight text-white">{teamLeadName || "—"}</h1>
            {members && members.length > 0 && (
              <div className="mt-3 w-full">
                <span className="text-zinc-500 text-xs font-medium">Team members</span>
                <ul className="mt-1 space-y-0.5 text-sm sm:text-base font-medium text-white/90">
                  {members.map((m, i) => (
                    <li key={i}>{m.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* QR, Booking ID, Event name, Event time, Team name */}
          <div className="absolute bottom-12 sm:bottom-16 left-4 right-4 sm:left-8 sm:right-8 z-20 flex flex-col justify-start items-start gap-2">
            <div className="flex flex-row justify-center gap-4 sm:gap-8">
              <div className="shrink-0 p-2 border bg-white border-zinc-800 rounded-md border-dashed">
                <QRCodeCanvas value={qrCode} size={100} />
              </div>
              <div className="gap-1.5 sm:gap-2 flex flex-col min-w-0 flex-1">
                <div className="flex flex-col leading-tight">
                  <span className="text-zinc-500 font-medium tracking-tighter text-xs">Booking ID</span>
                  <h1 className="text-sm sm:text-lg md:text-xl font-bold tracking-tighter font-mono text-white">#{bookingId || "—"}</h1>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-zinc-500 font-medium tracking-tighter text-xs">Event Name</span>
                  <h2 className="text-xs sm:text-sm font-semibold tracking-tighter text-white truncate">{eventName}</h2>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-zinc-500 font-medium tracking-tighter text-xs">Event Time</span>
                  <h2 className="text-xs sm:text-sm font-semibold tracking-tighter text-white">{eventTime || "10:00 AM - 5:00 PM"}</h2>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-zinc-500 font-medium tracking-tighter text-xs">Team Name</span>
                  <h2 className="text-xs sm:text-sm font-semibold tracking-tighter text-white truncate">{teamName}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[400px] px-4 py-2 mt-2 flex justify-center items-center">
        <button
          onClick={handleDownload}
          className="w-full px-4 py-4 text-sm font-bold tracking-tighter text-zinc-400 rounded-[18px] bg-black cursor-pointer hover:text-white hover:bg-zinc-950 active:scale-[0.98] active:translate-y-0.5 shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl transition-all duration-300 ease-in-out flex justify-center items-center"
        >
          Download Ticket
        </button>
      </div>
    </main>
  );
}
