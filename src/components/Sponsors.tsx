"use client";

import localFont from "next/font/local";
import Image from "next/image";
import FadeIn from "./FadeIn";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

// Placeholder sponsors data
const SPONSORS = [
  { id: 1, name: "Sponsor 1", logo: "/.png" },
  { id: 2, name: "Sponsor 2", logo: "/.png" },
  { id: 3, name: "Sponsor 3", logo: "/.png" },
  { id: 4, name: "Sponsor 4", logo: "/.png" },
  { id: 5, name: "Sponsor 5", logo: "/.png" },
  { id: 6, name: "Sponsor 6", logo: "/.png" },
];

export default function Sponsors() {
  return (
    <section id="sponsors" className="w-full bg-black pb-3">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <FadeIn>
                <div className="flex flex-col gap-4 text-center">
                    <h2 className={`text-5xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}>
                        Past <span className="italic">Sponsors</span>
                    </h2>
                    <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
                        Powered by the best in the industry.
                    </p>
                </div>
            </FadeIn>

            <FadeIn delay={200}>
                <div className="w-full relative flex items-center justify-center -mt-18 sm:-mt-58 md:-mt-28 lg:-mt-58 overflow-visible">
                    <Image
                        src="/sponsors.png"
                        alt="Sponsors"
                        width={1200}
                        height={800}
                        className="w-[120%] sm:w-full h-auto object-contain scale-110 sm:scale-100"
                    />
                </div>
            </FadeIn>
            
            <div className="flex justify-center mt-4">
                <button className={`bg-black text-white px-8 py-3 rounded-full border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase font-bold text-lg tracking-wider ${softura.className}`}>
                    Become a Sponsor
                </button>
            </div>
        </div>
    </section>
  );
}
