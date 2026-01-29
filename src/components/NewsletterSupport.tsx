"use client";

import localFont from "next/font/local";
import FadeIn from "./FadeIn";
import Link from "next/link";
import Image from "next/image";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });

export default function CommunityPartner() {
  return (
    <section className="w-full bg-black pt-3">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Community Partner Card */}
        <div className="flex-1 bg-[#E9D5FF] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[400px] group/partner">
          <div className="z-10">
            <div className="flex justify-between items-start">
              <FadeIn>
                <h2 className={`text-5xl sm:text-6xl text-black leading-[0.9] tracking-tight mb-4 uppercase ${gilton.className}`}>
                  OUR OFFICIAL
                  <br />
                  <span className="italic">COMMUNITY</span> PARTNER
                </h2>
              </FadeIn>

              {/* Partner Icon */}
              <div className="w-20 h-20 bg-[#FCD34D] rounded-full border-2 border-black items-center justify-center relative overflow-hidden shrink-0 ml-4 hidden sm:flex transition-transform group-hover/partner:scale-105 group-hover/partner:rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover/partner:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover/partner:translate-x-[2px] group-hover/partner:translate-y-[2px]">
          
                  <Image src="/cerkle.png" alt="Cerkle Logo" fill
                    className="object-cover" />
           
              </div>
            </div>

            <FadeIn delay={200}>
              <p className="text-black font-medium text-lg mt-6 max-w-md">
                Join our community partner Cerkle to connect with fellow attendees and stay updated!
              </p>
            </FadeIn>
          </div>

          <div className="z-10">
            <FadeIn delay={400}>
              <Link href="https://vybecerkle.com/" target="_blank">
                <button className="bg-black text-white px-8 py-4 mt-2 rounded-full uppercase font-bold text-sm tracking-wide border-2 border-black hover:bg-[#E9D5FF] hover:text-black transition-colors flex items-center gap-2 group">
                  JOIN CERKLE
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
            </FadeIn>
          </div>

          {/* Mobile Logo - Bottom Right */}
          <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full border-2 border-black overflow-hidden sm:hidden z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Image src="/cerkle.png" alt="Cerkle Logo" fill className="object-cover" />
          </div>

          {/* Background decorative shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Support Card */}
        <div className="flex-1 bg-[#3B82F6] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[400px] group/support">
          <div className="z-10">
            <div className="flex justify-between items-start">
              <FadeIn>
                <h2 className={`text-5xl sm:text-6xl text-black leading-[0.9] tracking-tight mb-4 uppercase ${gilton.className}`}>
                    ALWAYS HERE
                    <br />
                    TO <span className="italic">HELP</span>
                </h2>
              </FadeIn>

              {/* Support Icon/Avatar */}
              <div className="w-20 h-20 bg-[#FCD34D] rounded-full border-2 border-black items-center justify-center relative overflow-hidden shrink-0 ml-4 hidden sm:flex transition-transform group-hover/support:scale-105 group-hover/support:rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover/support:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover/support:translate-x-[2px] group-hover/support:translate-y-[2px]">
                 <div className="absolute bottom-0 w-12 h-6 bg-black rounded-t-full transition-all duration-300 group-hover/support:h-7"></div>
                 <div className="absolute top-4 w-8 h-8 bg-black rounded-full transition-all duration-300 group-hover/support:top-3"></div>
                 {/* Simple smiley face representation */}
                 <div className="w-12 h-12 bg-[#FCD34D] rounded-full border-2 border-black relative z-10 flex items-center justify-center transition-transform duration-300 group-hover/support:scale-110">
                    <div className="flex gap-2">
                        <div className="w-1 h-1 bg-black rounded-full transition-all duration-300 group-hover/support:h-2 group-hover/support:w-1.5"></div>
                        <div className="w-1 h-1 bg-black rounded-full transition-all duration-300 group-hover/support:h-2 group-hover/support:w-1.5"></div>
                    </div>
                    <div className="absolute bottom-3 w-4 h-2 border-b-2 border-black rounded-b-full transition-all duration-300 group-hover/support:w-6 group-hover/support:h-4 group-hover/support:border-b-4 group-hover/support:bottom-2"></div>
                 </div>
              </div>
            </div>

            <FadeIn delay={200}>
                <p className="text-black font-medium text-lg mt-6 max-w-md">
                Got questions? Our Support Team is here to help 24*7!
                </p>
            </FadeIn>
          </div>

          <div className="z-10">
            <FadeIn delay={400}>
              <Link href="/contact">
                <button className="bg-black text-white px-8 py-4 rounded-full uppercase font-bold text-sm tracking-wide border-2 border-black hover:bg-[#3B82F6] hover:text-black transition-colors flex items-center gap-2 group">
                GET SUPPORT
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </button>
              </Link>
            </FadeIn>
          </div>

          {/* Background decorative shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
