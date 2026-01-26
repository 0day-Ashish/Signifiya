"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Infobar from "@/components/Infobar";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });

const categories = ["ALL", "TECH", "CULTURAL", "VIBES", "BTS"];

const galleryImages = [
  {
    id: 1,
    src: "/gall13.jpg",
    caption: "The Opening Ceremony",
    category: "CULTURAL",
    size: "large",
    color: "bg-purple-200",
    rotation: "rotate-2",
  },
  {
    id: 10,
    src: "/gall12.jpg",
    caption: "The Opening Ceremony",
    category: "CULTURAL",
    size: "large",
    color: "bg-purple-200",
    rotation: "rotate-2",
  },
  {
    id: 13,
    src: "/gall4.jpg",
    caption: "SIGNIFIYA'25",
    category: "CULTURAL",
    size: "large",
    color: "bg-purple-200",
    rotation: "rotate-2",
  },
  {
    id: 2,
    src: "/gall5.jpg",
    caption: "Valorant Grind",
    category: "TECH",
    size: "small",
    color: "bg-yellow-200",
    rotation: "-rotate-1",
  },
  {
    id: 3,
    src: "/gall22.jpg",
    caption: "Drone Arena",
    category: "TECH",
    size: "tall",
    color: "bg-blue-200",
    rotation: "rotate-1",
  },
  {
    id: 4,
    src: "/gall24.jpg",
    caption: "DJ Night Madness",
    category: "VIBES",
    size: "small",
    color: "bg-pink-200",
    rotation: "-rotate-2",
  },
  {
    id: 5,
    src: "/gall21.jpg",
    caption: "Behind The Scenes",
    category: "BTS",
    size: "small",
    color: "bg-green-200",
    rotation: "rotate-3",
  },
  {
    id: 14,
    src: "/gall15.jpg",
    caption: "Behind The Scenes",
    category: "BTS",
    size: "small",
    color: "bg-green-200",
    rotation: "rotate-3",
  },
  {
    id: 11,
    src: "/gall8.jpg",
    caption: "Behind The Scenes",
    category: "BTS",
    size: "small",
    color: "bg-green-200",
    rotation: "rotate-3",
  },
  {
    id: 12,
    src: "/gall7.jpg",
    caption: "Behind The Scenes",
    category: "BTS",
    size: "small",
    color: "bg-green-200",
    rotation: "rotate-3",
  },
  {
    id: 6,
    src: "/gall9.jpg",
    caption: "Prize Distribution",
    category: "CULTURAL",
    size: "large",
    color: "bg-orange-200",
    rotation: "-rotate-1",
  },
  {
    id: 9,
    src: "/gall18.jpg",
    caption: "Core Team @2022",
    category: "CULTURAL",
    size: "large",
    color: "bg-orange-200",
    rotation: "-rotate-1",
  },
  {
    id: 15,
    src: "/gall11.jpg",
    caption: "SIGNIFIYA'22",
    category: "CULTURAL",
    size: "large",
    color: "bg-orange-200",
    rotation: "-rotate-1",
  },
  {
    id: 7,
    src: "/gall2.jpg",
    caption: "Gaming Zone",
    category: "TECH",
    size: "small",
    color: "bg-red-200",
    rotation: "rotate-2",
  },
  {
    id: 8,
    src: "/gall3.jpg",
    caption: "Stalls Squad",
    category: "VIBES",
    size: "small",
    color: "bg-teal-200",
    rotation: "-rotate-3",
  },
];

// --- 2. COMPONENTS ---

// Fixed Marquee: Added scale-105 to prevent white gaps on edges when rotated
const Marquee = () => (
  <div className="w-full relative z-20 py-10 overflow-hidden">
    <Navbar />
    <div className="absolute inset-0 flex items-center bg-yellow-300 border-y-4 border-black transform -rotate-1 scale-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-3xl font-black mx-4 tracking-tighter">
          ★ CAPTURING MOMENTS ★ MAKING MEMORIES ★ SIGNIFIYA 2026 ★
        </span>
        <span className="text-3xl font-black mx-4 tracking-tighter">
          ★ CAPTURING MOMENTS ★ MAKING MEMORIES ★ SIGNIFIYA 2026 ★
        </span>
        <span className="text-3xl font-black mx-4 tracking-tighter">
          ★ CAPTURING MOMENTS ★ MAKING MEMORIES ★ SIGNIFIYA 2026 ★
        </span>
        <span className="text-3xl font-black mx-4 tracking-tighter">
          ★ CAPTURING MOMENTS ★ MAKING MEMORIES ★ SIGNIFIYA 2026 ★
        </span>
      </div>
    </div>
  </div>
);

// The Main Gallery Page
export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [hearts, setHearts] = useState<{ id: number; imageId: number; x: number; y: number; angle: number; distance: number }[]>([]);

  // Filter logic
  const filteredImages =
    activeFilter === "ALL"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter);

  // Generate hearts confetti on button click
  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>, imageId: number) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const buttonX = rect.left + rect.width / 2;
    const buttonY = rect.top + rect.height / 2;

    // Generate 12 hearts with random angles and distances
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      imageId,
      x: buttonX,
      y: buttonY,
      angle: (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5, // Spread evenly with some randomness
      distance: 80 + Math.random() * 40, // Random distance between 80-120px
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    // Remove hearts after animation completes
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 2000);
  };

  return (
    // Added overflow-x-hidden to prevent horizontal scrollbars from rotated elements
    <div className="bg-zinc-950 min-h-screen font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <div className="p-4 lg:p-6">
        <div className="bg-gradient-to-b from-purple-950 via-purple-600 to-purple-100 min-h-[70vh] lg:min-h-[90vh] w-full rounded-[2rem] flex flex-col justify-center items-center relative overflow-hidden ">
          <div className="z-10 flex flex-col items-center sm:mt-0 mt-28 px-4">
            <h1 className={`text-[15vw] lg:text-[10vw] italic tracking-widest text-white leading-none text-center select-none drop-shadow-xl ${gilton.className}`}>
              GALLERY
            </h1>

            <div className="mt-6 flex flex-col items-center">
            <span className="bg-white text-black px-4 py-1 font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                EST. 2021
              </span>
              <span className="bg-white text-black px-4 py-1 font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                EST. 2022
              </span>
              <span className="bg-white text-black px-4 py-1 font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                EST. 2023
              </span>
              <span className="bg-white text-black px-4 py-1 font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                EST. 2025
              </span>
              <p className={`text-zinc-100 text-center text-lg lg:text-2xl max-w-2xl tracking-tight mt-6 ${softura.className}`}>
                A collection of chaotic, beautiful, and{" "}
                <span className="bg-black text-white px-2 italic">
                  unforgettable
                </span>{" "}
                moments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MARQUEE SEPARATOR --- */}
      <div className="my-8">
        <Marquee />
      </div>

      {/* --- CONTENT CONTAINER --- */}
      {/* Changed margin logic: centered max-width for large screens, simple padding for mobile */}
      <div className="bg-white rounded-3xl mx-4 lg:mx-6 lg:max-w-[95%] xl:max-w-full mb-20 ">
        {/* --- FILTER BAR --- */}
        <div className="py-12 px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`
                px-6 py-2 lg:px-8 lg:py-3 font-black text-base lg:text-lg border-4 border-black rounded-xl transition-all duration-200 ${softura.className}
                ${
                  activeFilter === cat
                    ? "bg-purple-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                    : "bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                }
              `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- MASONRY GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 pb-16">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className={`
              relative group flex flex-col
              ${img.size === "large" ? "md:col-span-2" : "col-span-1"}
              ${img.size === "tall" ? "md:row-span-2" : "row-span-1"}
            `}
            >
              {/* The Image Card */}
              <div
                className={`
                    relative h-full w-full bg-white p-3 border-4 border-black rounded-2xl 
                    shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 
                    hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
                    ${img.rotation} hover:rotate-0 hover:z-10
                `}
              >
                {/* Image Container */}
                <div className="relative w-full h-[300px] sm:h-[400px] border-2 border-black rounded-xl overflow-hidden bg-zinc-200">
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Overlay Tag */}
                  <div className="absolute top-2 right-2 bg-black text-white text-xs font-mono px-2 py-1 border border-white z-10">
                    {img.category}
                  </div>
                </div>

                {/* Caption Area */}
                <div className="mt-4 px-2 pb-2 flex justify-between items-end">
                  <div>
                    <h3 className={`font-black text-xl tracking-widest text-black uppercase leading-none ${softura.className}`}>
                      {img.caption}
                    </h3>
                  </div>
                  {/* Like/Heart Button */}
                  <button 
                    onClick={(e) => handleHeartClick(e, img.id)}
                    className="bg-red-500 text-white w-10 h-10 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all hover:bg-red-600 relative z-30"
                  >
                    ♥
                  </button>
                </div>

                {/* Decorative Pin/Tape */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white/30 backdrop-blur-sm border-x-2 border-white/50 rotate-2 z-20 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
        <Footer />

      {/* Heart Confetti */}
      {hearts.map((heart) => {
        const endX = Math.cos(heart.angle) * heart.distance;
        const endY = Math.sin(heart.angle) * heart.distance - 30; // Slight upward arc
        return (
          <div
            key={heart.id}
            className="fixed pointer-events-none z-50 text-2xl heart-particle"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              '--end-x': `${endX}px`,
              '--end-y': `${endY}px`,
            } as React.CSSProperties & { '--end-x': string; '--end-y': string }}
          >
            <span className="text-red-500 drop-shadow-lg">♥</span>
          </div>
        );
      })}

      {/* Custom Styles for Animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .heart-particle {
          transform: translate(-50%, -50%);
          animation: heartConfetti 2s ease-out forwards;
        }
        
        @keyframes heartConfetti {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) translate(calc(var(--end-x, 0px)), calc(var(--end-y, 0px))) scale(0.3) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
