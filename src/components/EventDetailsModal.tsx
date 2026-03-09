"use client";

import { motion, AnimatePresence } from "motion/react";
import localFont from "next/font/local";
import { X, Trophy, Users, Calendar, MapPin, Clock, Info, CheckCircle2 } from "lucide-react";
import { EventDetail } from "@/data/event-details";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetail | null;
}

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  if (!event) return null;

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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[10000] p-4 sm:p-6"
          >
            <div className="bg-white border-4 border-black rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] pointer-events-auto overflow-hidden flex flex-col relative">
              {/* Header */}
              <div className="bg-[#d091f8] p-6 sm:p-8 border-b-4 border-black flex justify-between items-center relative overflow-hidden shrink-0">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
                <div className="relative z-10">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-black/60 mb-1 block ${softura.className}`}>
                    {event.category}
                  </span>
                  <h2 className={`text-2xl sm:text-4xl font-black text-black uppercase tracking-tighter leading-none ${gilton.className}`}>
                    {event.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-black bg-white rounded-xl flex items-center justify-center font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all relative z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar bg-[#fdf8ff]">
                
                {/* Description */}
                <div className="space-y-3">
                  <h3 className={`text-xs font-black uppercase tracking-widest text-black/40 flex items-center gap-2 ${softura.className}`}>
                     <Info className="w-3 h-3" /> About Event
                  </h3>
                  <p className={`text-base sm:text-lg text-black font-medium leading-relaxed ${softura.className}`}>
                    {event.description}
                  </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border-2 border-black p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase text-emerald-800/60 ${softura.className}`}>Prize Pool</p>
                      <p className="font-black text-lg text-emerald-900 leading-none">{event.prizeStructure.prizePool}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-black p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase text-blue-800/60 ${softura.className}`}>Participation</p>
                      <p className="font-black text-lg text-blue-900 leading-none">{event.participation.teamSize}</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border-2 border-black p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase text-orange-800/60 ${softura.className}`}>Date</p>
                      <p className="font-black text-lg text-orange-900 leading-none">{event.schedule.date}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-200 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-zinc-700" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase text-zinc-800/60 ${softura.className}`}>Venue</p>
                      <p className="font-black text-lg text-zinc-900 leading-none">{event.schedule.venue}</p>
                    </div>
                  </div>
                </div>

                {/* Rules & Guidelines */}
                {event.rules && event.rules.length > 0 && (
                  <div className="space-y-4">
                    <h3 className={`text-xs font-black uppercase tracking-widest text-black/40 flex items-center gap-2 ${softura.className}`}>
                       <CheckCircle2 className="w-3 h-3" /> Event Rules & Guidelines
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {event.rules.map((rule, i) => (
                        <div key={i} className="flex gap-3 items-start bg-white p-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
                          <div className="w-6 h-6 bg-black text-white rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className={`text-sm sm:text-base text-zinc-800 font-medium ${softura.className}`}>
                            {rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-6 sm:p-8 border-t-4 border-black bg-zinc-50 shrink-0">
                <button
                  onClick={onClose}
                  className={`w-full bg-black text-white font-black py-4 rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_#d091f8] hover:translate-y-0.5 hover:shadow-none transition-all uppercase text-sm tracking-widest ${softura.className}`}
                >
                  Confirm Details
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      <style jsx global>{`
        .custom-scrollbar {
          -webkit-overflow-scrolling: touch;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fdf8ff;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d091f8;
          border-radius: 10px;
          border: 2px solid #fdf8ff;
        }
      `}</style>
    </AnimatePresence>
  );
}
