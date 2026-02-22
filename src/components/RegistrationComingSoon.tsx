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
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const label = type === "visitor" ? "VISITOR PASS" : "EVENT";
  const accentColor = type === "visitor" ? "bg-purple-400" : "bg-yellow-300";
  const accentBorder =
    type === "visitor" ? "border-purple-400" : "border-yellow-300";
  const accentText = type === "visitor" ? "text-purple-600" : "text-yellow-400";

  return (
    <div
      className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 lg:p-10 font-sans"
      style={{
        backgroundImage:
          "radial-gradient(circle, #3f3f46 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="w-full max-w-3xl flex flex-col gap-0">
        {/* ── Top label sticker ── */}
        <div className="self-start">
          <div
            className={`${accentColor} border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs font-black uppercase tracking-widest text-black -mb-0.5 relative z-10`}
          >
            ⚠ {label} REGISTRATION
          </div>
        </div>

        {/* ── Main card ── */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Striped top bar */}
          <div
            className="h-4 w-full border-b-4 border-black"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #FFE500, #FFE500 10px, #000 10px, #000 20px)",
            }}
          />

          <div className="p-8 lg:p-12 flex flex-col lg:flex-row gap-10 items-stretch">
            {/* ── LEFT: Heading + date badge ── */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Big heading */}
              <div>
                <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-black">
                  NOT
                </h1>
                <h1
                  className={`${gilton.className} text-6xl lg:text-8xl uppercase tracking-tighter leading-none`}
                  style={{ WebkitTextStroke: "3px black", color: "#FFE500" }}
                >
                  OPEN
                </h1>
                <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-black">
                  YET.
                </h1>
              </div>

              {/* Thick divider */}
              <div className="h-2 w-full bg-black" />

              {/* Date badge */}
              <div
                className={`${accentColor} border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
              >
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-black/60 mb-1">
                  Registrations open on
                </p>
                <p className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-black leading-tight">
                  23RD FEB, 2026
                </p>
                <p className="font-mono text-sm font-black text-black/70 mt-1 uppercase tracking-widest">
                  Monday · 12:00 AM
                </p>
              </div>

              {/* Back home button */}
              <Link
                href="/"
                className="inline-flex w-fit items-center gap-2 px-5 py-3 bg-white border-4 border-black font-black text-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono"
              >
                ← RETURN HOME
              </Link>
            </div>

            {/* ── RIGHT: Countdown ── */}
            <div className="lg:w-64 flex flex-col justify-center gap-4">
              <div className="bg-black px-4 py-2 self-start shadow-[3px_3px_0px_0px_rgba(255,229,0,1)]">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300">
                  {timeLeft ? "— Opens in —" : "— Check now —"}
                </p>
              </div>

              {timeLeft ? (
                <>
                  {[
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map(({ label, value }, i) => (
                    <div
                      key={label}
                      className={`border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-5 py-4 ${
                        i === 0
                          ? "bg-yellow-300"
                          : i === 1
                            ? accentColor
                            : "bg-zinc-950"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] font-black uppercase tracking-[0.2em] ${
                          i === 2 ? "text-zinc-400" : "text-black/60"
                        }`}
                      >
                        {label}
                      </span>
                      <span
                        className={`text-5xl font-black tabular-nums leading-none tracking-tighter ${
                          i === 2 ? "text-yellow-300" : "text-black"
                        }`}
                      >
                        {String(value).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="border-4 border-black bg-yellow-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-6 text-center">
                  <p className="font-black text-black text-sm uppercase tracking-wider">
                    🎉 We&apos;re live!
                  </p>
                  <p className="font-mono text-xs text-black/60 mt-1 uppercase tracking-widest">
                    Refresh the page
                  </p>
                </div>
              )}

              {/* Decorative striped block */}
              <div
                className="h-6 w-full border-4 border-black"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #FFE500, #FFE500 8px, #000 8px, #000 16px)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom tag ── */}
        <div className="self-end">
          <div className="bg-black border-4 border-black px-4 py-1 -mt-0.5 shadow-[4px_4px_0px_0px_rgba(255,229,0,0.8)]">
            <p className="font-mono text-[10px] text-yellow-300 font-black uppercase tracking-widest">
              SIGNIFIYA &apos;26 · REGISTRATION PORTAL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
