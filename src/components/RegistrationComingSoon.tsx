"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });

const OPEN_DATE = new Date("2026-02-23T00:00:00");

function getTimeLeft() {
  const diff = OPEN_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { hours, minutes, seconds };
}

interface Props {
  type: "visitor" | "event";
}

export default function RegistrationComingSoon({ type }: Props) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const label = type === "visitor" ? "Visitor Pass" : "Event";

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans overflow-x-hidden">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white rounded-[2rem] border-4 border-black shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] overflow-hidden">
          {/* Top accent bar */}
          <div className="h-3 w-full bg-[#FFE500]" />

          <div className="p-8 lg:p-12 flex flex-col items-center text-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl border-4 border-black bg-[#FFE500] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-4xl">
              🔒
            </div>

            {/* Heading */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                {label} Registration
              </p>
              <h1
                className={`${gilton.className} text-4xl lg:text-5xl text-black leading-tight`}
              >
                Registrations
                <br />
                <span className="text-[#FFE500] [-webkit-text-stroke:2px_black]">
                  Not Open Yet
                </span>
              </h1>
            </div>

            {/* Divider */}
            <div className="w-16 h-1 bg-black rounded-full" />

            {/* Date message */}
            <div className="bg-zinc-950 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-5">
              <p className="text-zinc-400 text-sm font-semibold uppercase tracking-widest mb-1">
                Registrations open on
              </p>
              <p className="text-white text-2xl font-black tracking-tight">
                23rd February, 2026
              </p>
              <p className="text-[#FFE500] text-base font-bold mt-1">Monday</p>
            </div>

            {/* Countdown */}
            {timeLeft ? (
              <div className="w-full">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                  Opens in
                </p>
                <div className="flex justify-center gap-3">
                  {[
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center bg-zinc-950 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3 min-w-18"
                    >
                      <span className="text-[#FFE500] text-3xl font-black tabular-nums leading-none">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 font-semibold">
                Refresh the page — registrations should be open now!
              </p>
            )}

            {/* CTA */}
            <Link
              href="/"
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-[#FFE500] border-4 border-black rounded-xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm uppercase tracking-wider"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
