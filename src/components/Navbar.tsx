"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useAudio } from "@/components/AudioProvider";
import Image from "next/image";
import localFont from "next/font/local";

const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

export default function Navbar({ 
  showNavLinks, 
  session, 
  showProfileMenu, 
  setShowProfileMenu,
  hideLogo = false
}: any) {
  const router = useRouter();
  const { musicPlaying, audioInitialized, toggleMusic } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Use 1024px (lg breakpoint) instead of 640px so iPad (834px) is treated as mobile
      setIsDesktop(window.innerWidth >= 1024);
      // Close mobile menu when switching to desktop
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close profile menu on Escape
  useEffect(() => {
    if (!showProfileMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowProfileMenu(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showProfileMenu, setShowProfileMenu]);

  // Determine if menu should be visible: on mobile use click state, on desktop use scroll state
  const isMenuVisible = isDesktop ? showNavLinks : mobileMenuOpen;

  return (
    <div>
      {/* Fixed Logo at Right Corner */}
      {!hideLogo && (
        <div className="fixed top-16 left-8 bg-black text-black rounded-full flex items-center justify-center transition-transform duration-300  active:scale-95 active:shadow-none z-50">
          <Link href="/">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={64}
              height={64}
              className="object-cover w-10 h-10 sm:w-10 sm:h-10 lg:w-16 lg:h-16"
              priority
            />
          </Link>
        </div>
      )}

    <div className="fixed top-16 sm:top-16 right-8 sm:right-8 flex flex-col items-end gap-2 sm:gap-4 z-50">

      <div className="flex items-start gap-2 sm:gap-4">
         {/* Navigation Menu Container */}
         <div className="relative group/nav z-50">
           {/* 3D Circle Toggle Button */}
           <button 
             onClick={() => {
               if (!isDesktop) {
                 setMobileMenuOpen(!mobileMenuOpen);
               }
             }}
             className="relative w-9 h-9 sm:w-12 sm:h-12 bg-white text-black rounded-full border-2 border-black flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] z-20"
           >
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                {/* Plus Icon */}
                <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out lg:group-hover/nav:rotate-90 lg:group-hover/nav:opacity-0 ${isMenuVisible ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>
                {/* Minus Icon */}
                <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out lg:group-hover/nav:rotate-0 lg:group-hover/nav:opacity-100 ${isMenuVisible ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>
              </div>
           </button>

           {/* Menu - Vertical on Mobile/Tablet, Horizontal on Desktop (lg and above) */}
           <div className={`absolute top-full lg:top-0 right-0 lg:right-full mt-2 lg:mt-0 lg:pr-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-3 transition-all duration-300 ease-out lg:group-hover/nav:opacity-100 lg:group-hover/nav:translate-y-0 lg:group-hover/nav:visible ${isMenuVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 lg:-translate-y-4 invisible'}`}>
              {[
                { name: 'Gallery', href: '/gallery' },
                { name: 'Merchandise', href: '/merch' },
                { name: 'Schedule', href: '/schedule' },
                { name: 'Events', href: '/#events' },
                { name: 'FAQ', href: '/#faq' }
              ].map((item, index) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => {
                    if (!isDesktop) {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`bg-white text-black border-2 border-black px-3 py-1.5 sm:px-6 sm:py-3 text-center uppercase font-bold text-xs sm:text-sm rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 whitespace-nowrap ${softura.className}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </Link>
              ))}
           </div>
         </div>

         <button className="group relative bg-black px-4 py-2 sm:px-8 sm:py-3 rounded-full border-2 border-transparent hover:border-black hover:bg-[#deb3fa] hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="relative h-4 sm:h-5 overflow-hidden flex flex-col justify-center items-center">
              <span className={`block text-white uppercase font-extrabold text-xs sm:text-base transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full ${softura.className}`}>
                Launch App
              </span>
              <span className={`absolute top-0 left-0 w-full block text-black uppercase font-extrabold text-xs sm:text-base transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0 ${softura.className}`}>
                Launch App
              </span>
            </div>
         </button>
      </div>

        {/* Music Control & Profile Container */}
        <div className="flex items-center gap-2 sm:gap-4">
             {session && (
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 relative"
                    >
                        {session.user?.image ? (
                            <Image 
                                src={session.user.image} 
                                alt="Profile" 
                                fill 
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#deb3fa] flex items-center justify-center font-bold text-base sm:text-xl text-black">
                                {session.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </button>

                    {showProfileMenu && (
                      <div className="absolute top-full right-0 mt-2 sm:mt-4 bg-white border-4 border-black rounded-2xl p-3 sm:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-56 sm:w-64 flex flex-col gap-2 z-60">
                           <div className="text-center border-b-2 border-black pb-2 mb-2">
                              <p className="font-bold text-sm sm:text-base text-black truncate">{session.user?.name}</p>
                              <p className="text-xs text-gray-600 truncate">{session.user?.email}</p>
                           </div>
                           
                           <Link href="/profile" className="w-full bg-[#deb3fa] text-black font-bold py-1.5 sm:py-2 rounded-lg border-2 border-black hover:bg-[#d091f8] transition-colors text-xs sm:text-sm uppercase text-center">
                              Your Profile
                           </Link>
                           
                           <button 
                              onClick={async () => {
                                  await authClient.signOut();
                                  setShowProfileMenu(false);
                                  router.push("/");
                                  window.location.reload();
                              }}
                              className="w-full bg-gray-200 text-black font-bold py-1.5 sm:py-2 rounded-lg border-2 border-black hover:bg-gray-300 transition-colors text-xs sm:text-sm uppercase mt-2"
                           >
                              Sign Out
                           </button>
                           <p className="hidden sm:block text-[10px] text-zinc-500 text-center mt-1 pt-2 border-t border-zinc-200">
                              Press esc to close
                           </p>
                      </div>
                  )}
              </div>
          )}

          {/* Music Control Button */}
          {audioInitialized && (
          <button 
              onClick={toggleMusic}
              className="w-9 h-9 sm:w-12 sm:h-12 bg-white text-black rounded-full border-2 border-black flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
              {musicPlaying ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M5 3.868v16.264a1 1 0 001.574.832l12.198-8.132a1 1 0 000-1.664L6.574 3.036A1 1 0 005 3.868z" />
              </svg>
              )}
          </button>
          )}
      </div>
      </div>
          </div>  
  );
}
