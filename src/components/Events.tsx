"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import localFont from "next/font/local";
import Image from "next/image";
import FadeIn from "./FadeIn";
import { motion, AnimatePresence } from "motion/react";
import { getEventsListingData, getEventTitleToScheduleId } from "@/data/events";

const rampart = localFont({ src: "../../public/fonts/RampartOne-Regular.ttf" });
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

const CATEGORIES = ["ALL", "ESPORTS", "CSE", "CIVIL", "MECHANICAL", "EEE", "ROBOTICS", "NON-TECH"];

// Derived from shared event data (src/data/events.ts)
const EVENT_TITLE_TO_SCHEDULE_ID = getEventTitleToScheduleId();
const EVENTS_DATA = getEventsListingData();

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredEvents = activeCategory === "ALL" 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(event => event.category === activeCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth < 640;
      
      if (isMobile) {
        // On mobile: center the next/previous card
        const containerWidth = container.getBoundingClientRect().width;
        const cards = container.querySelectorAll('.event-card');
        
        if (cards.length === 0) return;
        
        // Find the currently centered card
        let currentIndex = 0;
        let minDistance = Infinity;
        
        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const containerCenter = container.getBoundingClientRect().left + containerWidth / 2;
          const distance = Math.abs(cardCenter - containerCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            currentIndex = index;
          }
        });
        
        // Calculate next/previous index
        const nextIndex = direction === 'right' 
          ? Math.min(currentIndex + 1, cards.length - 1)
          : Math.max(currentIndex - 1, 0);
        
        // Get the target card
        const targetCard = cards[nextIndex] as HTMLElement;
        if (targetCard) {
          const cardWidth = targetCard.getBoundingClientRect().width;
          const cardLeft = targetCard.offsetLeft;
          const containerCenter = containerWidth / 2;
          const targetScroll = cardLeft - containerCenter + (cardWidth / 2);
          
          container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        }
      } else {
        // On large screens: simple scroll by card width
        const scrollAmount = 400;
        const currentScroll = container.scrollLeft;
        const targetScroll = direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount;
        
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  };

  // Center first card on mount and when category changes (only on mobile)
  useEffect(() => {
    if (scrollContainerRef.current && window.innerWidth < 640) {
      const container = scrollContainerRef.current;
      // Wait for layout to settle
      setTimeout(() => {
        const firstCard = container.querySelector('.event-card') as HTMLElement;
        if (firstCard) {
          const containerWidth = container.getBoundingClientRect().width;
          const cardWidth = firstCard.getBoundingClientRect().width;
          const cardLeft = firstCard.offsetLeft;
          const containerCenter = containerWidth / 2;
          const targetScroll = cardLeft - containerCenter + (cardWidth / 2);
          
          container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // On large screens, just scroll to start
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory]);

  return (
    <section id="events" className="w-full bg-black pb-3">
        <div className="bg-[#fff3e0] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <FadeIn>
                <div className="flex flex-col gap-4 text-center">
                    <h2 className={`text-5xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}>
                        SIGNIFIYA <span className="italic">Events</span>
                    </h2>
                    <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
                        Discover the diverse range of events happening at Signifiya'26.
                    </p>
                    <p className={`text-base text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
                        *Events are not limited to any department or domain, anybody can participate in any of our events without any restrictions, read terms & conditions thoroughly.*
                    </p>
                </div>
            </FadeIn>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`
                            px-6 py-2 rounded-full border-2 border-black font-bold text-sm uppercase tracking-wider transition-all duration-200
                            ${activeCategory === category 
                                ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] translate-x-[2px] translate-y-[2px]' 
                                : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            }
                            ${softura.className}
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Events Horizontal Scroll Container */}
            <div className="relative">
                {/* Left Arrow Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
                    aria-label="Scroll left"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Right Arrow Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
                    aria-label="Scroll right"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Horizontal Scrolling Events Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide pb-4 min-h-[450px] sm:min-h-[500px] snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Left spacer to allow first card to center - only on mobile */}
                    <div className="shrink-0 w-[calc(50%-140px)] sm:hidden" />
                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((event) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                key={event.id}
                                className="event-card bg-white rounded-3xl border-4 border-black overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group shrink-0 w-[280px] sm:w-[320px] md:w-[350px] snap-center"
                            >
                                {/* Image Container */}
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
                                        <h3 className={`text-xl sm:text-2xl text-black uppercase leading-none mb-2 ${gilton.className}`}>
                                            {event.title}
                                        </h3>
                                        <p className={`text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-widest ${softura.className}`}>
                                            {event.date}
                                        </p>
                                        <span className={`inline-block mt-1.5 px-2 sm:px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold ${softura.className}`}>
                                            Prize pool: {event.prizePool}
                                        </span>
                                    </div>
                                    <p className={`text-sm sm:text-base text-gray-800 font-medium leading-snug line-clamp-3 ${softura.className}`}>
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
                                        <Link href="/events" className={`w-full bg-black text-white border-2 border-black rounded-xl py-1.5 sm:py-2 font-bold uppercase text-xs sm:text-sm transition-colors hover:bg-zinc-800 text-center ${softura.className}`}>
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {/* Right spacer to allow last card to center - only on mobile */}
                    <div className="shrink-0 w-[calc(50%-140px)] sm:hidden" />
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
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
    </section>
  );
}
