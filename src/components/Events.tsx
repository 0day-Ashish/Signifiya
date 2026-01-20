"use client";

import { useState } from "react";
import Link from "next/link";
import localFont from "next/font/local";
import Image from "next/image";
import FadeIn from "./FadeIn";
import { motion, AnimatePresence } from "motion/react";

const rampart = localFont({ src: "../../public/fonts/RampartOne-Regular.ttf" });
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

const CATEGORIES = ["ESPORTS", "CSE", "CIVIL", "MECHANICAL", "EEE", "ROBOTICS", "NON-TECH"];

const EVENTS_DATA = [
  { id: 0, category: "ESPORTS", title: "VALORANT TOURNAMENT", date: "March 13th - 14th", description: "des.", image: "/valorant.jpg", prizePool: "TBA" },
  { id: 14, category: "ESPORTS", title: "BGMI", date: "March 13th - 14th", description: "des.", image: "/bgmi.jpg", prizePool: "TBA" },
  { id: 1, category: "EEE", title: "ELECTRIFYING CIRCUIT", date: "March 13th - 14th", description: "des.", image: "/eee.jpg", prizePool: "TBA" },
  { id: 2, category: "CIVIL", title: "TOWER MAKING", date: "March 13th - 14th", description: "5v5 Tactical Shooter. High stakes, big rewards. Prove your aim.", image: "/civil1.jpg", prizePool: "TBA" },
  { id: 3, category: "CIVIL", title: "BRIDGE MAKING", date: "March 13th - 14th", description: "Electrifying performances by the best college bands from across the region.", image: "/civil2.jpg", prizePool: "TBA" },
  { id: 4, category: "MECHANICAL", title: "RE-FAB", date: "March 13th - 14th", description: "des.", image: "/mechanical1.jpg", prizePool: "TBA" },
  { id: 5, category: "MECHANICAL", title: "LATHE WAR", date: "March 13th - 14th", description: "des.", image: "/lathe-war.jpg", prizePool: "TBA" },
  { id: 6, category: "CSE", title: "CODING PREMIERE LEAGUE", date: "March 13th - 14th", description: "des.", image: "/cse2.jpg", prizePool: "₹25,000" },
  { id: 7, category: "CSE", title: "DIL SE DESIGN", date: "March 13th - 14th", description: "des.", image: "/cse1.jpg", prizePool: "TBA" },
  { id: 8, category: "ROBOTICS", title: "ROBO TERRAIN", date: "March 13th - 14th", description: "des.", image: "/robotics1.jpg", prizePool: "TBA" },
  { id: 9, category: "ROBOTICS", title: "PATH FOLLOWER", date: "March 13th - 14th", description: "des.", image: "/robotics2.jpg", prizePool: "TBA" },
  { id: 10, category: "NON-TECH", title: "DANCE BATTLE", date: "March 13th - 14th", description: "des.", image: "/dance-battle.jpg", prizePool: "TBA" },
  { id: 11, category: "NON-TECH", title: "TREASURE HUNT", date: "March 13th - 14th", description: "des.", image: "/treasure-hunt.jpg", prizePool: "TBA" },
  { id: 12, category: "NON-TECH", title: "ARM WRESTLING", date: "March 13th - 14th", description: "des.", image: "/non-tech1.jpg", prizePool: "TBA" },
  { id: 13, category: "NON-TECH", title: "RAP BATTLE", date: "March 13th - 14th", description: "des.", image: "/rap-battle.jpg", prizePool: "TBA" },
];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("ESPORTS");

  const filteredEvents = EVENTS_DATA.filter(event => event.category === activeCategory);

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

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            key={event.id}
                            className="bg-white rounded-3xl border-4 border-black overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
                        >
                            {/* Image Container */}
                            <div className="relative h-48 w-full border-b-4 border-black">
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
                            <div className="p-6 flex flex-col flex-1 gap-4">
                                <div>
                                    <h3 className={`text-2xl text-black uppercase leading-none mb-2 ${gilton.className}`}>
                                        {event.title}
                                    </h3>
                                    <p className={`text-sm text-gray-500 font-bold uppercase tracking-widest ${softura.className}`}>
                                        {event.date}
                                    </p>
                                    <span className={`inline-block mt-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold ${softura.className}`}>
                                        Prize pool: {event.prizePool}
                                    </span>
                                </div>
                                <p className={`text-base text-gray-800 font-medium leading-snug line-clamp-3 ${softura.className}`}>
                                    {event.description}
                                </p>
                                <div className="mt-auto pt-4 flex flex-col gap-2">
                                    <button className={`w-full bg-[#d091f8] text-black border-2 border-black rounded-xl py-2 font-bold uppercase text-sm transition-colors ${softura.className}`}>
                                        View Details
                                    </button>
                                    <Link href="/events" className={`w-full bg-black text-white border-2 border-black rounded-xl py-2 font-bold uppercase text-sm transition-colors hover:bg-zinc-800 text-center ${softura.className}`}>
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    </section>
  );
}
