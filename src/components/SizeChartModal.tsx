"use client";

import { motion, AnimatePresence } from "motion/react";
import localFont from "next/font/local";
import { useState } from "react";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const [activeTab, setActiveTab] = useState<"male" | "female">("male");

  const maleSizeData = [
    { size: "XS", chest: "36" },
    { size: "S", chest: "38" },
    { size: "M", chest: "40" },
    { size: "L", chest: "42" },
    { size: "XL", chest: "44" },
    { size: "XXL", chest: "46" },
  ];

  const femaleSizeData = [
    { size: "XS", chest: "32" },
    { size: "S", chest: "34" },
    { size: "M", chest: "36" },
    { size: "L", chest: "38" },
    { size: "XL", chest: "40" },
    { size: "XXL", chest: "42" },
  ];

  const currentData = activeTab === "male" ? maleSizeData : femaleSizeData;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[10000] p-4"
          >
            <div className="bg-white border-4 border-black rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="bg-orange-500 p-6 border-b-4 border-black flex justify-between items-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
                <h2 className={`text-2xl font-black text-black uppercase tracking-tighter relative z-10 ${gilton.className}`}>
                  Size Chart
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 border-2 border-black bg-white rounded-lg flex items-center justify-center font-bold text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all relative z-10"
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div className="flex p-2 gap-2 bg-zinc-100 border-b-4 border-black">
                <button
                  onClick={() => setActiveTab("male")}
                  className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-xs tracking-wider transition-all ${activeTab === "male"
                      ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                      : "bg-white text-black border-transparent hover:border-black/20"
                    } ${softura.className}`}
                >
                  Male
                </button>
                <button
                  onClick={() => setActiveTab("female")}
                  className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-xs tracking-wider transition-all ${activeTab === "female"
                      ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                      : "bg-white text-black border-transparent hover:border-black/20"
                    } ${softura.className}`}
                >
                  Female
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className={`text-black font-bold uppercase text-[10px] tracking-[0.2em] mb-6 opacity-60 ${softura.className}`}>
                  {activeTab === "male" ? "Male" : "Female"} T-Shirt Sizes (Inches)
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="contents"
                    >
                      {currentData.map((item) => (
                        <div
                          key={item.size}
                          className="flex items-center justify-between p-4 bg-zinc-50 border-2 border-black rounded-xl hover:bg-orange-50 transition-colors"
                        >
                          <span className="font-black text-lg">{item.size}</span>
                          <span className="font-mono text-black font-bold border-l-2 border-black/10 pl-4">{item.chest}&quot;</span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 p-4 bg-yellow-100 border-2 border-black border-dashed rounded-xl relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)",
                    }}
                  ></div>
                  <p className="text-[10px] font-black uppercase text-center leading-tight relative z-10">
                    * CHEST MEASUREMENTS ARE TAKEN <br /> FROM PIT-TO-PIT CIRCUMFERENCE
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className={`mt-8 w-full bg-black text-white font-black py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#f97316] hover:translate-y-0.5 hover:shadow-none transition-all uppercase text-sm tracking-widest ${softura.className}`}
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
