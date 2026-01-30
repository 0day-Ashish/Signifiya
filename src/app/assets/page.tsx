"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });
const bicubik = localFont({ src: "../../../public/fonts/Bicubik.otf" });
const bartle = localFont({ src: "../../../public/fonts/BBHBartle-Regular.ttf" });
const rampart = localFont({ src: "../../../public/fonts/RampartOne-Regular.ttf" });

// Color palette data
const brandColors = [
  { name: "Primary Purple", hex: "#deb3fa", textDark: true },
  { name: "Deep Purple", hex: "#9c27b0", textDark: false },
  { name: "Darker Purple", hex: "#4a148c", textDark: false },
  { name: "Light Pink", hex: "#f3e5f5", textDark: true },
];

const utilityColors = [
  { name: "Black", hex: "#000000", textDark: false },
  { name: "White", hex: "#ffffff", textDark: true },
  { name: "Success Green", hex: "#4caf50", textDark: false },
  { name: "Warning Orange", hex: "#ff9800", textDark: true },
  { name: "Accent Yellow", hex: "#FCD34D", textDark: true },
];

const sectionColors = [
  { name: "Contact Page", hex: "#da8ae6", textDark: true },
  { name: "Assets Page", hex: "#fff3e0", textDark: true },
  { name: "Schedule Blue", hex: "#3B82F6", textDark: false },
];

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
        hideLogo={false}
      />

      <main className="flex-1">
        <div className="bg-[#fff3e0] rounded-[2.5rem] p-8 sm:p-12 m-4 sm:m-4 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
          {/* <Link
            href="/"
            className="inline-block fixed w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all mb-6 z-50"
          >
            ← RETURN HOME
          </Link> */}
          <div className="flex flex-col sm:mt-0 mt-15 gap-4 text-center">
            <h1 className={`text-4xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}>
              SIGNIFIYA <span className="italic">Assets</span>
            </h1>
            <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
              Download official Signifiya'26 assets and resources.
            </p>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col gap-8">
            <h2 className={`text-2xl sm:text-4xl text-black ${gilton.className}`}>
              Logo
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Logo on Dark Background */}
              <div className="flex flex-col border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-black p-8 flex items-center justify-center min-h-[200px] sm:min-h-[280px]">
                  <div className="relative w-40 h-40 sm:w-56 sm:h-56">
                    <Image
                      src="/logo2.png"
                      alt="Signifiya Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="bg-white p-4 border-t-2 border-black">
                  <p className={`text-sm font-bold text-black ${softura.className}`}>
                    Primary Logo (Dark Background)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Use on dark or colored backgrounds
                  </p>
                </div>
              </div>

              {/* Logo on Light Background */}
              <div className="flex flex-col border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-white p-8 flex items-center justify-center min-h-[200px] sm:min-h-[280px]">
                  <div className="relative w-40 h-40 sm:w-56 sm:h-56">
                    <Image
                      src="/logo2.png"
                      alt="Signifiya Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="bg-white p-4 border-t-2 border-black">
                  <p className={`text-sm font-bold text-black ${softura.className}`}>
                    Primary Logo (Light Background)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Use on white or light backgrounds
                  </p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <a
              href="/logo2.png"
              download="signifiya-logo.png"
              className={`self-start bg-black text-white px-6 py-3 rounded-xl border-2 border-black font-bold text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-[#deb3fa] hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${softura.className}`}
            >
              Download Logo PNG
            </a>
          </div>

          {/* Color Palettes Section */}
          <div className="flex flex-col gap-8">
            <h2 className={`text-2xl sm:text-4xl text-black ${gilton.className}`}>
              Color Palette
            </h2>
            
            {/* Brand Colors */}
            <div className="flex flex-col gap-4">
              <h3 className={`text-lg font-bold text-gray-700 uppercase tracking-wider ${softura.className}`}>
                Brand Colors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {brandColors.map((color) => (
                  <div
                    key={color.hex}
                    className="flex flex-col border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div
                      className="h-24 sm:h-32"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="bg-white p-3 border-t-2 border-black">
                      <p className={`text-sm font-bold text-black ${softura.className}`}>
                        {color.name}
                      </p>
                      <p className="text-xs text-gray-600 font-mono uppercase">
                        {color.hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Utility Colors */}
            <div className="flex flex-col gap-4">
              <h3 className={`text-lg font-bold text-gray-700 uppercase tracking-wider ${softura.className}`}>
                Utility Colors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {utilityColors.map((color) => (
                  <div
                    key={color.hex}
                    className="flex flex-col border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div
                      className="h-20 sm:h-24"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="bg-white p-3 border-t-2 border-black">
                      <p className={`text-sm font-bold text-black ${softura.className}`}>
                        {color.name}
                      </p>
                      <p className="text-xs text-gray-600 font-mono uppercase">
                        {color.hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Colors */}
            <div className="flex flex-col gap-4">
              <h3 className={`text-lg font-bold text-gray-700 uppercase tracking-wider ${softura.className}`}>
                Section Background Colors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {sectionColors.map((color) => (
                  <div
                    key={color.hex}
                    className="flex flex-col border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div
                      className="h-20 sm:h-24"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="bg-white p-3 border-t-2 border-black">
                      <p className={`text-sm font-bold text-black ${softura.className}`}>
                        {color.name}
                      </p>
                      <p className="text-xs text-gray-600 font-mono uppercase">
                        {color.hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fonts Section */}
          <div className="flex flex-col gap-8">
            <h2 className={`text-2xl sm:text-4xl text-black ${gilton.className}`}>
              Typography
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Bicubik */}
              <div className="bg-white border-2 border-black rounded-xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <p className={`text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${softura.className}`}>
                  Hero / Main Title
                </p>
                <p className={`text-2xl sm:text-5xl text-black mb-4 ${bicubik.className}`}>
                  SIGNIFIYA
                </p>
                <p className={`text-sm text-gray-600 ${softura.className}`}>
                  <span className="font-bold">Bicubik</span> — Used for the main hero title and year display
                </p>
              </div>

              {/* Gilton */}
              <div className="bg-white border-2 border-black rounded-xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <p className={`text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${softura.className}`}>
                  Headings / Display
                </p>
                <p className={`text-2xl sm:text-5xl text-black mb-4 ${gilton.className}`}>
                  Explore Events
                </p>
                <p className={`text-sm text-gray-600 ${softura.className}`}>
                  <span className="font-bold">Gilton Regular</span> — Primary heading font for sections and titles
                </p>
              </div>

              {/* Softura */}
              <div className="bg-white border-2 border-black rounded-xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <p className={`text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${softura.className}`}>
                  Body / UI Text
                </p>
                <p className={`text-lg sm:text-3xl text-black mb-4 ${softura.className}`}>
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className={`text-sm text-gray-600 ${softura.className}`}>
                  <span className="font-bold">Softura Demo</span> — Body text, buttons, labels, and UI elements
                </p>
              </div>

              {/* BBH Bartle */}
              <div className="bg-white border-2 border-black rounded-xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <p className={`text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${softura.className}`}>
                  Timer / Preloader
                </p>
                <p className={`text-2xl sm:text-5xl text-black mb-4 ${bartle.className}`}>
                  00:15:30
                </p>
                <p className={`text-sm text-gray-600 ${softura.className}`}>
                  <span className="font-bold">BBH Bartle</span> — Countdown timer, preloader animation, and footer branding
                </p>
              </div>

              {/* Rampart One */}
              <div className="bg-white border-2 border-black rounded-xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:col-span-2 overflow-hidden">
                <p className={`text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${softura.className}`}>
                  Card Names / Special
                </p>
                <p className={`text-2xl sm:text-5xl text-black mb-4 ${rampart.className}`}>
                  Team Member
                </p>
                <p className={`text-sm text-gray-600 ${softura.className}`}>
                  <span className="font-bold">Rampart One</span> — Contact cards, team member names, and decorative text
                </p>
              </div>
            </div>
          </div>

          {/* Design Style Note */}
          <div className="bg-black text-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <h3 className={`text-xl font-bold mb-3 ${gilton.className}`}>
              Design System Notes
            </h3>
            <ul className={`text-sm space-y-2 ${softura.className}`}>
              <li>• <span className="font-bold">Neo-brutalism</span> style with bold black borders (2-4px)</li>
              <li>• Consistent <span className="font-bold">box shadows</span>: shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]</li>
              <li>• Rounded corners using <span className="font-bold">rounded-xl</span> to <span className="font-bold">rounded-[2.5rem]</span></li>
              <li>• Interactive elements have <span className="font-bold">hover translate</span> effects</li>
              <li>• Noise texture overlay for depth on hero sections</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
