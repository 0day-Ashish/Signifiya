"use client";

import { useState, useRef, useEffect } from "react";
import localFont from "next/font/local";
import Image from "next/image";
import FadeIn from "./FadeIn";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rampart = localFont({ src: "../../public/fonts/RampartOne-Regular.ttf" });
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Ashish R. Das",
    role: "Lead Developer",
    image: "/avatar1.jpg", 
    bio: "19, full stack dev, community lead @0DAY",
    color: "#deb3fa"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Product Designer",
    image: "/avatar2.jpg",
    bio: "Crafting intuitive experiences for the decentralized web.",
    color: "#FCD34D"
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Community Manager",
    image: "/avatar3.jpg",
    bio: "Connecting people and ideas in the Signifiya ecosystem.",
    color: "#3B82F6"
  },
  {
    id: 4,
    name: "Sarah Williams",
    role: "Marketing Head",
    image: "/avatar4.jpg",
    bio: "Spreading the word and growing our vibrant community.",
    color: "#E9D5FF"
  },
  { id: 5, name: "David Brown", role: "Frontend Dev", image: "/avatar1.jpg", bio: "Creating seamless user interfaces.", color: "#FF6B6B" },
  { id: 6, name: "Emily Davis", role: "Backend Dev", image: "/avatar2.jpg", bio: "Optimizing server performance.", color: "#4ECDC4" },
  { id: 7, name: "Chris Wilson", role: "Data Scientist", image: "/avatar3.jpg", bio: "Analyzing trends and metrics.", color: "#45B7D1" },
  { id: 8, name: "Jessica Taylor", role: "UX Researcher", image: "/avatar4.jpg", bio: "Understanding user needs.", color: "#96CEB4" },
  { id: 9, name: "Daniel Martinez", role: "DevOps", image: "/avatar1.jpg", bio: "Ensuring smooth deployments.", color: "#D4A5A5" },
  { id: 10, name: "Laura Anderson", role: "Content Writer", image: "/avatar2.jpg", bio: "Telling our story.", color: "#9B59B6" },
  { id: 11, name: "Kevin Thomas", role: "QA Engineer", image: "/avatar3.jpg", bio: "Maintaining high quality.", color: "#3498DB" },
  { id: 12, name: "Megan Jackson", role: "Events Lead", image: "/avatar4.jpg", bio: "Organizing memorable events.", color: "#E67E22" },
  { id: 13, name: "Brian White", role: "Security Analyst", image: "/avatar1.jpg", bio: "Protecting our infrastructure.", color: "#2ECC71" },
  { id: 14, name: "Amanda Harris", role: "Legal Advisor", image: "/avatar2.jpg", bio: "Navigating regulations.", color: "#F1C40F" },
  { id: 15, name: "Jason Martin", role: "Support Lead", image: "/avatar3.jpg", bio: "Helping our users succeed.", color: "#1ABC9C" },
  { id: 16, name: "Olivia Thompson", role: "Growth Hacker", image: "/avatar4.jpg", bio: "Accelerating our reach.", color: "#E74C3C" },
  { id: 17, name: "Ryan Garcia", role: "Blockchain Dev", image: "/avatar1.jpg", bio: "Developing smart contracts.", color: "#8E44AD" }
];

export default function Team() {
  const [activeMember, setActiveMember] = useState(TEAM_MEMBERS[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !listRef.current) return;

    // Pin the section while scrolling through the list; list advances with page scroll.
    // On mobile: section stays pinned until all names are scrolled, then section scrolls away.
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "center center",
      end: `+=${TEAM_MEMBERS.length * 50}`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        if (listRef.current) {
          const progress = self.progress;
          const maxScroll = Math.max(0, listRef.current.scrollHeight - listRef.current.clientHeight);
          gsap.to(listRef.current, {
            scrollTop: progress * maxScroll,
            duration: 0.1,
            overwrite: true
          });
          // On mobile/touch: update active member from scroll progress (no hover)
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            const idx = Math.min(Math.floor(progress * TEAM_MEMBERS.length), TEAM_MEMBERS.length - 1);
            setActiveMember(TEAM_MEMBERS[idx]);
          }
        }
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-black py-3 h-screen overflow-hidden flex items-center justify-center">
        <div className="bg-[#f3e5f5] rounded-[2.5rem] p-4 sm:p-8 md:p-12 w-full h-full flex flex-col md:flex-row gap-4 md:gap-12 relative overflow-hidden">
            
            {/* Left Side: Scrollable Member List — on mobile: below card (order-2) */}
            <div className="flex-1 min-h-0 z-10 flex flex-col order-2 md:order-1 md:h-full">
                <FadeIn>
                    <h2 className={`text-3xl sm:text-5xl text-black uppercase mb-4 mt-5 sm:mt-0 md:mb-8 shrink-0 ${gilton.className}`}>
                        Meet The <span></span>Team
                    </h2>
                </FadeIn>
                
                <div 
                    ref={listRef} 
                    className="flex-1 flex flex-col gap-3 sm:gap-6 min-h-0 pr-2 md:pr-4 overflow-hidden"
                >
                    {TEAM_MEMBERS.map((member, index) => (
                        <div key={member.id}>
                            <div 
                                onMouseEnter={() => setActiveMember(member)}
                                onClick={() => setActiveMember(member)}
                                className={`group flex items-center transition-all duration-300 py-1.5 sm:py-2 cursor-none ${activeMember.id === member.id ? 'translate-x-1 sm:translate-x-2' : 'hover:translate-x-2'}`}
                            >
                                <h3 className={`text-lg sm:text-3xl md:text-[5vw] tracking-tighter leading-tight font-bold uppercase transition-colors duration-300 ${activeMember.id === member.id ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>
                                    {member.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Right Side: Sticky Profile Card Display */}
            <div className="flex-1 flex items-center justify-center z-10 relative h-full mt-5 mb-5 sm:mt-0 sm:mb-0">
                <div ref={cardRef} className="relative w-full max-w-sm h-full flex items-center justify-center">
                    {/* Background Shape for Active Card */}
                    <div 
                        className="absolute inset-0 bg-white/50 rounded-full blur-3xl transition-all duration-500 z-0"
                        style={{ backgroundColor: `${activeMember.color}40` }} 
                    />

                    {/* The Card */}
                    {TEAM_MEMBERS.map((member) => (
                        <div 
                            key={member.id}
                            className={`absolute transition-all duration-500 ease-out transform ${
                                activeMember.id === member.id 
                                ? 'opacity-100 translate-y-0 scale-100 rotate-0 z-10' 
                                : 'opacity-0 translate-y-8 scale-95 rotate-6 pointer-events-none z-0'
                            }`}
                        >
                            <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 text-center w-[320px]">
                                <div 
                                    className="w-32 h-32 rounded-full border-4 border-black overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    style={{ backgroundColor: member.color }}
                                >
                                    <Image 
                                        src={member.image} 
                                        alt={member.name} 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                
                                <div>
                                    <h3 className={`text-2xl text-black ${rampart.className}`}>
                                        {member.name}
                                    </h3>
                                    <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mt-1">
                                        {member.role}
                                    </p>
                                </div>

                                <p className={`text-lg text-black font-medium leading-tight ${gilton.className}`}>
                                    {member.bio}
                                </p>

                                <div className="flex gap-2 mt-2">
                                    {[
                                        { 
                                            name: 'Instagram', 
                                            color: '#E4405F',
                                            path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                                            fillRule: "evenodd"
                                        },
                                        { 
                                            name: 'LinkedIn', 
                                            color: '#0077B5',
                                            path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' 
                                        },
                                        { 
                                            name: 'Github', 
                                            color: '#000000',
                                            path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' 
                                        }
                                    ].map((social) => (
                                        <button 
                                            key={social.name} 
                                            className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center transition-all cursor-none"
                                            style={{ color: social.color }}
                                        >
                                            <span className="sr-only">{social.name}</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                                <path d={social.path} fillRule={social.fillRule as any} clipRule={social.fillRule as any} />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
}
