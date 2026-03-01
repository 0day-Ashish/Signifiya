"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import localFont from "next/font/local";
import { APP_CONFIG } from "@/config/app.config";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

const STORAGE_KEY = "merch_popup_dismissed_v2";
const DELAY_MS = 4000;

function getActiveDiscount() {
  const now = Date.now();
  for (const d of APP_CONFIG.eventDiscounts) {
    const start = new Date(d.start).getTime();
    const end = start + d.durationHours * 3600_000;
    if (now >= start && now < end) return d;
  }
  return null;
}

export default function MerchPopup() {
  const [visible, setVisible] = useState(false);
  const activeDiscount = useMemo(getActiveDiscount, []);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const scrollToMerch = () => {
    dismiss();
    document.getElementById("merch")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="merch-popup"
          initial={{ opacity: 0, y: 80, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className="fixed bottom-5 right-5 z-9999 max-w-xs w-full"
        >
          <div className="bg-black border-2 border-zinc-700 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Discount banner — only if active */}
            {activeDiscount && (
              <div className="bg-orange-500 px-4 py-2 flex items-center gap-2">
                <span className="text-xl leading-none">🔥</span>
                <span
                  className={`text-black text-xs font-black uppercase tracking-wider ${softura.className}`}
                >
                  {activeDiscount.label}
                </span>
              </div>
            )}

            {/* Body */}
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <p
                    className={`text-white text-sm font-black uppercase tracking-wide leading-tight ${gilton.className}`}
                  >
                    Merchandise is Live!
                  </p>
                </div>
                <button
                  onClick={dismiss}
                  className="text-zinc-500 hover:text-white transition-colors text-lg leading-none -mt-0.5 shrink-0"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <p
                className={`text-zinc-400 text-xs leading-relaxed ${softura.className}`}
              >
                Grab exclusive Signifiya&apos;26 Tees &amp; Polos — limited
                stock!
              </p>

              <button
                onClick={scrollToMerch}
                className={`mt-1 w-full bg-white text-black py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors ${softura.className}`}
              >
                View Merch ↓
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
