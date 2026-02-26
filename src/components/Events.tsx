"use client";

import {
  useState,
  useRef,
  useEffect,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import localFont from "next/font/local";
import Image from "next/image";
import FadeIn from "./FadeIn";
import { AnimatePresence } from "motion/react";
import { getEventsListingData, getEventTitleToScheduleId } from "@/data/events";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

const CATEGORIES = [
  "ALL",
  "ESPORTS",
  "CSE",
  "CIVIL",
  "MECHANICAL",
  "EEE",
  "ROBOTICS",
  "NON-TECH",
];

const EVENTS_DATA = getEventsListingData();
const EVENT_TITLE_TO_SCHEDULE_ID = getEventTitleToScheduleId();

const EVENT_TITLE_TO_REG_ID: Record<string, string> = {
  "VALORANT": "gaming",
  "FREE FIRE": "freefire",
  "CODING PREMIER LEAGUE": "cpl",
  "RE-FAB (WASTE TO WEALTH)": "refab",
  "PATH FOLLOWER": "path",
  "BRIDGE BUILDING": "bridge",
  "CIRCUITRONIX": "circuit",
  "DANCE BATTLE": "dance",
  "ARM WRESTLING": "arm",
  "TOWER MAKING": "tower",
  "DIL SE DESIGN": "design",
  "LATHE WAR": "lathe",
  "ROBO SOCCER": "robo",
  "RAP BATTLE": "rap",
  "BGMI": "bgmi",
  "E-FOOTBALL": "efootball",
  "TREASURE HUNT": "treasure",
  "POWER DEAL": "powerdeal",
  "TECH MONOPOLY": "techmonopoly",
  "CARROM": "carrom",
  "CHESS": "chess",
  "VOLLEYBALL": "volleyball",
  "CRICKET": "cricket",
  "BADMINTON": "badminton",
  "FOOTBALL": "football",
  "BOX CRICKET": "boxcricket",
};

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredEvents =
    activeCategory === "ALL"
      ? EVENTS_DATA
      : EVENTS_DATA.filter((event) => event.category === activeCategory);

  // Double the items for seamless loop
  const marqueeEvents = [...filteredEvents, ...filteredEvents];

  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const directionRef = useRef(-1);
  const pausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const wasPausedBeforeDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset offset when category changes
  useEffect(() => {
    offsetRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(0px, 0, 0)`;
    }
  }, [activeCategory]);

  useEffect(() => {
    const updateSingleSetWidth = () => {
      if (!trackRef.current) return;
      singleSetWidthRef.current = trackRef.current.scrollWidth / 2;
    };

    updateSingleSetWidth();
    window.addEventListener("resize", updateSingleSetWidth);

    const t = setTimeout(updateSingleSetWidth, 100);

    const step = () => {
      if (
        trackRef.current &&
        !pausedRef.current &&
        singleSetWidthRef.current > 0
      ) {
        offsetRef.current += directionRef.current * 0.6;

        if (offsetRef.current <= -singleSetWidthRef.current) {
          offsetRef.current += singleSetWidthRef.current;
        } else if (offsetRef.current > 0) {
          offsetRef.current -= singleSetWidthRef.current;
        }

        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateSingleSetWidth);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [activeCategory]);

  const nudgeByCards = (cards: number) => {
    if (!singleSetWidthRef.current || !trackRef.current) return;
    const firstCard = trackRef.current.querySelector("article");
    const cardWidth =
      firstCard instanceof HTMLElement ? firstCard.offsetWidth : 320;
    const trackStyle = window.getComputedStyle(trackRef.current);
    const gap =
      parseFloat(trackStyle.columnGap || trackStyle.gap || "16") || 16;
    const stepSize = cardWidth + gap;
    offsetRef.current += cards * stepSize;

    while (offsetRef.current <= -singleSetWidthRef.current) {
      offsetRef.current += singleSetWidthRef.current;
    }
    while (offsetRef.current > 0) {
      offsetRef.current -= singleSetWidthRef.current;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setIsPaused(next);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    const target = event.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }

    isDraggingRef.current = true;
    wasPausedBeforeDragRef.current = pausedRef.current;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    pausedRef.current = true;
    setIsPaused(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !isDraggingRef.current ||
      !trackRef.current ||
      !singleSetWidthRef.current
    )
      return;

    const deltaX = event.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current + deltaX;

    while (offsetRef.current <= -singleSetWidthRef.current) {
      offsetRef.current += singleSetWidthRef.current;
    }
    while (offsetRef.current > 0) {
      offsetRef.current -= singleSetWidthRef.current;
    }

    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    pausedRef.current = wasPausedBeforeDragRef.current;
    setIsPaused(wasPausedBeforeDragRef.current);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section id="events" className="w-full bg-black pb-3">
      <div className="bg-[#fff3e0] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <FadeIn>
          <div className="flex flex-col gap-4 text-center">
            <h2
              className={`text-5xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}
            >
              SIGNIFIYA <span className="italic">Events</span>
            </h2>
            <p
              className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}
            >
              Discover the diverse range of events happening at
              Signifiya&apos;26.
            </p>
            <p
              className={`text-base text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}
            >
              *Events are not limited to any department or domain, anybody can
              participate in any of our events without any restrictions, read
              terms &amp; conditions thoroughly.*
            </p>
          </div>
        </FadeIn>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full border-2 border-black font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                activeCategory === category
                  ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] translate-x-[2px] translate-y-[2px]"
                  : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              } ${softura.className}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Marquee Controls + Track */}
        <div className="relative">
          <div className="mb-3 flex justify-end gap-2 sm:mb-4">
            <button
              type="button"
              onClick={() => nudgeByCards(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#ffe45e] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label="Show previous cards"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={togglePause}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label={isPaused ? "Play marquee" : "Pause marquee"}
            >
              {isPaused ? (
                <Play className="h-5 w-5" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => nudgeByCards(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#7dc8ff] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label="Show next cards"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Marquee Container */}
          <div
            ref={marqueeRef}
            className="events-marquee"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div ref={trackRef} className="events-track pb-6 sm:pb-10">
              <AnimatePresence mode="popLayout">
                {marqueeEvents.map((event, idx) => (
                  <article
                    key={`${event.id}-${idx}`}
                    className="w-[250px] sm:w-[320px] md:w-[350px] shrink-0 bg-white rounded-2xl border-4 border-black overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group"
                  >
                    {/* Image */}
                    <div className="relative h-40 sm:h-48 w-full border-b-4 border-black">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full border border-white">
                        {event.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 flex flex-col flex-1 gap-3 sm:gap-4">
                      <div>
                        <h3
                          className={`text-xl sm:text-2xl text-black uppercase leading-none mb-2 ${gilton.className}`}
                        >
                          {event.title}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-widest ${softura.className}`}
                        >
                          {event.date}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span
                            className={`inline-block px-2 sm:px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold ${softura.className}`}
                          >
                            Prize pool: {event.prizePool}
                          </span>
                          {typeof event.price === "number" && event.price > 0 && (
                            <span
                              className={`inline-block px-2 sm:px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-bold ${softura.className}`}
                            >
                              Fee: ₹{event.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <p
                        className={`text-sm sm:text-base text-gray-800 font-medium leading-snug line-clamp-3 ${softura.className}`}
                      >
                        {event.description}
                      </p>
                      <div className="mt-auto pt-2 sm:pt-4 flex flex-col gap-2">
                        {EVENT_TITLE_TO_SCHEDULE_ID[event.title] ? (
                          <Link
                            href={`/schedule#event-${EVENT_TITLE_TO_SCHEDULE_ID[event.title]}`}
                            className={`w-full bg-[#d091f8] text-black border-2 border-black rounded-xl py-1.5 sm:py-2 font-bold uppercase text-xs sm:text-sm transition-colors hover:bg-[#c080e8] text-center ${softura.className}`}
                          >
                            View Details
                          </Link>
                        ) : (
                          <Link
                            href="/schedule"
                            className={`w-full bg-[#d091f8] text-black border-2 border-black rounded-xl py-1.5 sm:py-2 font-bold uppercase text-xs sm:text-sm transition-colors hover:bg-[#c080e8] text-center ${softura.className}`}
                          >
                            View Details
                          </Link>
                        )}
                        <Link
                          href={EVENT_TITLE_TO_REG_ID[event.title.toUpperCase()] 
                            ? `/events?event=${EVENT_TITLE_TO_REG_ID[event.title.toUpperCase()]}` 
                            : "/events"}
                          className={`w-full bg-black text-white border-2 border-black rounded-xl py-1.5 sm:py-2 font-bold uppercase text-xs sm:text-sm transition-colors hover:bg-zinc-800 text-center ${softura.className}`}
                        >
                          Register
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* View Schedule Button */}
          <div className="flex justify-center mt-8">
            <Link
              href="/schedule"
              className={`bg-black text-white px-8 py-3 rounded-full border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase font-bold text-lg tracking-wider ${softura.className}`}
            >
              View Schedule
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .events-marquee {
          overflow: hidden;
          width: 100%;
          touch-action: pan-y;
          cursor: grab;
        }

        .events-marquee:active {
          cursor: grabbing;
        }

        .events-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          will-change: transform;
          user-select: none;
        }

        @media (min-width: 640px) {
          .events-track {
            gap: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
