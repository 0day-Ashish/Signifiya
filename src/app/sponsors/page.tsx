"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });

export default function SponsorsPage() {
  const [showNavLinks, setShowNavLinks] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Use the authClient hook to get session data
  const { data: sessionData } = authClient.useSession();

  useEffect(() => {
    if (sessionData) {
      setSession(sessionData);
    }
  }, [sessionData]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      const isAtTop = currentScrollY < 100;
      const isDesktop = window.innerWidth >= 640; // sm breakpoint

      // Only show nav links on scroll up for desktop screens
      if (isDesktop) {
        if (isAtTop) {
          setShowNavLinks(false);
        } else if (isScrollingUp) {
          setShowNavLinks(true);
        } else {
          setShowNavLinks(false);
        }
      } else {
        // On mobile, keep nav links closed (controlled by button click in Navbar)
        setShowNavLinks(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar
        showNavLinks={showNavLinks}
        session={session}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        hideLogo={true}
      />

      <main className="flex-1">
        <div className="bg-[#fff3e0] rounded-[2.5rem] p-8 sm:p-12 m-4 sm:m-4 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Link
            href="/"
            className="inline-block fixed w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all mb-6 z-50"
          >
            ← RETURN HOME
          </Link>
          <div className="flex flex-col sm:mt-0 mt-15 gap-4 text-center">
            <h1 className={`text-4xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}>
              Become a <span className="italic">Sponsor</span>
            </h1>
            <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
              Partner with Signifiya'26 and be part of something extraordinary.
            </p>
          </div>

          {/* Download Brochures Section */}
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
            <h2 className={`text-3xl sm:text-4xl text-black font-bold mb-4 ${gilton.className}`}>
              Download Our Brochures
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              {/* Tech Brochure */}
              <a
                href="/SPONSORSHIP%20BROCHURE%20SIGNIFIYA'26_TECH.pdf"
                download="SPONSORSHIP BROCHURE SIGNIFIYA'26_TECH.pdf"
                className="bg-white text-black px-8 py-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 flex flex-col items-center gap-3 min-w-[200px] sm:min-w-[250px] group"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className={`font-bold text-xl uppercase ${softura.className}`}>
                  Tech Brochure
                </span>
                <span className="text-sm text-gray-600">Click to download</span>
              </a>

              {/* Non-Tech Brochure */}
              <a
                href="/SPONSORSHIP%20BROCHURE%20SIGNIFIYA'26_NON-TECH.pdf"
                download="SPONSORSHIP BROCHURE SIGNIFIYA'26_NON-TECH.pdf"
                className="bg-white text-black px-8 py-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 flex flex-col items-center gap-3 min-w-[200px] sm:min-w-[250px] group"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className={`font-bold text-xl uppercase ${softura.className}`}>
                  Non-Tech Brochure
                </span>
                <span className="text-sm text-gray-600">Click to download</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
