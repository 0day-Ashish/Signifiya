"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });

export default function AssetsPage() {
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
              SIGNIFIYA <span className="italic">Assets</span>
            </h1>
            <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
              Download official Signifiya'26 assets and resources.
            </p>
          </div>

          {/* Assets content placeholder */}
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className={`text-lg text-gray-500 ${softura.className}`}>
              Assets coming soon...
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
