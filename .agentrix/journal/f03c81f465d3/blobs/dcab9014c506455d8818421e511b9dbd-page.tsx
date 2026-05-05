"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";
import { motion, useMotionValue, useSpring } from "motion/react";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });

export default function MerchPage() {
  const [showNavLinks, setShowNavLinks] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInsideMerchBox, setIsInsideMerchBox] = useState(false);
  const merchBoxRef = useRef<HTMLDivElement>(null);
  
  // Cursor following text box
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 300 });

  // Use the authClient hook to get session data
  const { data: sessionData } = authClient.useSession();

  useEffect(() => {
    if (sessionData) {
      setSession(sessionData);
    }
  }, [sessionData]);

  useEffect(() => {
    // Check if device has pointer (mouse) and is not a touch device
    const checkIsDesktop = () => {
      const hasPointer = window.matchMedia('(pointer: fine)').matches;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsDesktop(hasPointer && !isTouchDevice && window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop || !merchBoxRef.current) return;

    const checkIfInsideBox = (e: MouseEvent) => {
      if (!merchBoxRef.current) return;
      
      const rect = merchBoxRef.current.getBoundingClientRect();
      const isInside = 
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      
      setIsInsideMerchBox(isInside);
      
      if (isInside) {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };

    window.addEventListener('mousemove', checkIfInsideBox);
    window.addEventListener('mouseleave', () => setIsInsideMerchBox(false));
    
    return () => {
      window.removeEventListener('mousemove', checkIfInsideBox);
      window.removeEventListener('mouseleave', () => setIsInsideMerchBox(false));
    };
  }, [cursorX, cursorY, isDesktop]);

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
        <div 
          ref={merchBoxRef}
          className="bg-[#fff3e0] rounded-[2.5rem] p-8 sm:p-12 m-4 sm:m-4 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <Link
            href="/"
            className="inline-block fixed w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all mb-6 z-50"
          >
            ← RETURN HOME
          </Link>
          <div className="flex flex-col sm:mt-0 mt-15 gap-4 text-center">
            <h1 className={`text-4xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}>
              SIGNIFIYA <span className="italic">Merchandise</span>
            </h1>
            <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
              Get your hands on exclusive Signifiya'26 merchandise!
            </p>
          </div>

          {/* Merchandise content placeholder */}
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className={`text-lg text-gray-500 ${softura.className}`}>
              Merchandise coming soon...
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Coming Soon Cursor Follower */}
      {isDesktop && isInsideMerchBox && (
        <motion.div
          className="fixed top-0 left-0 z-9999 pointer-events-none hidden md:block"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-120%",
          }}
        >
          <div className="bg-white text-black px-4 py-2 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            <span className={`font-bold text-sm ${softura.className}`}>
              COMING SOON
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
