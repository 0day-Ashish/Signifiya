"use client";

import localFont from "next/font/local";
import Image from "next/image";
import FadeIn from "./FadeIn";
import { motion } from "motion/react";
import Link from "next/link";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

// Placeholder images - repeating existing ones for the gallery grid
const GALLERY_IMAGES = [
  { src: "/about.jpg", alt: "Gallery Image 1", span: "col-span-1 md:col-span-2 row-span-2", rotation: "rotate-2" },
  { src: "/soet-au.jpeg", alt: "Gallery Image 2", span: "col-span-1 row-span-1", rotation: "-rotate-3" },
  { src: "/about.jpg", alt: "Gallery Image 3", span: "col-span-1 row-span-1", rotation: "rotate-1" },
  { src: "/soet-au.jpeg", alt: "Gallery Image 4", span: "col-span-1 row-span-1", rotation: "-rotate-2" },
  { src: "/about.jpg", alt: "Gallery Image 5", span: "col-span-1 md:col-span-2 row-span-1", rotation: "rotate-3" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="w-full bg-black pb-3">
        <div className="bg-[#fff1f2] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <FadeIn>
                <div className="flex flex-col gap-4 text-center">
                    <h2 className={`text-5xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}>
                        Glimpses of <span className="italic">Past</span>
                    </h2>
                    <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
                        Relive the best moments from our previous events.
                    </p>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 auto-rows-[250px] min-h-[600px] p-4">
                {GALLERY_IMAGES.map((img, idx) => (
                    <FadeIn key={idx} delay={idx * 100} className={`${img.span} h-full`}>
                        <motion.div 
                            className={`relative w-full h-full bg-white p-3 pb-8 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] ${img.rotation}`}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.2 } }}
                        >
                            {/* Red Pin */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-2 border-black z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"></div>
                            
                            <div className="relative w-full h-full overflow-hidden rounded-lg border border-black/20">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    </FadeIn>
                ))}
            </div>
            
             {/* View More Button */}
              <div className="flex justify-center mt-4">
                  <Link href="/gallery" className={`bg-black text-white px-8 py-3 rounded-full border-2 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase font-bold text-lg tracking-wider inline-block ${softura.className}`}>
                    View Gallery
                </Link>
            </div>
        </div>
    </section>
  );
}
