"use client";

import { useState, useRef, useEffect } from "react";
import Infobar from "@/components/Infobar";
import Preloader from "@/components/Preloader";
import Timer from "@/components/Timer";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAudio } from "@/components/AudioProvider";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";
import Footer from "@/components/Footer";
import NewsletterSupport from "@/components/NewsletterSupport";
import Team from "@/components/Team";
import About from "@/components/About";
import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import Events from "@/components/Events";
import Prizes from "@/components/Prizes";
import Gallery from "@/components/Gallery";
import Sponsors from "@/components/Sponsors";

const rampart = localFont({ src: "../../public/fonts/RampartOne-Regular.ttf" });
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const bicubik = localFont({ src: "../../public/fonts/Bicubik.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

const Marquee = () => {
  const baseVelocity = -2; // Reduced base speed
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], { // Reduced factor
    clamp: false
  });

  const x = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    // Calculate movement based on time delta (ms)
    // Convert to seconds: delta / 1000
    let moveBy = baseVelocity * (delta / 1000); 

    // Get smoothed scroll velocity factor (always positive for speed increase)
    const vel = Math.abs(velocityFactor.get());
    
    // Increase speed based on scroll
    moveBy = moveBy * (1 + vel);

    let newX = x.get() + moveBy;

    // Wrap logic: reset to 0 when we reach -50%
    if (newX <= -50) {
      newX = 0;
    } else if (newX > 0) {
        newX = -50;
    }
    
    x.set(newX);
  });

  return (
    <div className="w-full relative z-20 py-8 overflow-hidden">
      <div className="absolute inset-0 flex items-center bg-yellow-300 border-y-4 border-black transform -rotate-1 scale-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <motion.div 
          className="flex whitespace-nowrap"
          style={{ x: useTransform(x, v => `${v}%`) }}
        >
          {/* Render content twice for seamless loop */}
          {[0, 1].map((_, idx) => (
             <div key={idx} className="flex shrink-0">
               {[...Array(8)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl sm:text-3xl text-black font-black mx-4 tracking-widest ${gilton.className}`}
                  >
                    ★ EXPLORE THE BEST EVENTS ★  ★ SOET ★
                  </span>
               ))}
             </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default function Home() {
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { musicPlaying, audioInitialized, toggleMusic, initializeAudio } = useAudio();
  const [showNavLinks, setShowNavLinks] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

  // Smooth scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

      setShowScrollTop(!isAtTop);

      // Show progress bar only when infobar is scrolled out (roughly > 50px)
      if (currentScrollY > 50) {
        setShowProgressBar(true);
      } else {
        setShowProgressBar(false);
      }

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
  }, []);

  const handlePreloaderFinish = () => {
    setPreloaderFinished(true);
    if (!audioInitialized) {
    setShowModal(true);
    }
  };

  const handleMusicChoice = (withMusic: boolean) => {
    setShowModal(false);
    if (withMusic) {
      initializeAudio(true);
    } else {
      // Manually set initialized state
      sessionStorage.setItem("hasVisited", "true");
      // We might need to refresh or force update context if we want it to reflect immediately without playing
      // But for now, user chose NO music, so isPlaying remains false. 
      // We just need to ensure the "Music Control" button appears? 
      // Actually, if we don't call initializeAudio, isInitialized remains false in context until reload.
      // Let's rely on initializeAudio to handle both, or just play.
      // If user says NO, we don't play. 
      initializeAudio(false); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {!preloaderFinished && <Preloader onFinish={handlePreloaderFinish} />}

      {/* Music Choice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-4xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 items-center max-w-2xl w-full mx-4">
            <h2 className={`text-3xl text-black text-center ${gilton.className}`}>
              Welcome to Signifiya
            </h2>
            <div className="flex flex-row gap-2 sm:gap-4 w-full justify-center flex-wrap">
              <button 
                onClick={() => handleMusicChoice(true)}
                className={`bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-black hover:bg-[#deb3fa] hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase font-bold text-xs sm:text-sm ${softura.className}`}
              >
                Enter with Music
              </button>
              <button 
                onClick={() => handleMusicChoice(false)}
                className={`bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-black hover:bg-gray-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase font-bold text-xs sm:text-sm ${softura.className}`}
              >
                Enter without Music
              </button>
            </div>
            <p className={`text-lg text-extrabold text-black text-center ${rampart.className}`}>
              music&apos;s fun, dekhlee lala!
            </p>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-15 right-8 z-50 w-12 h-12 bg-white text-black rounded-full border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>

          <Infobar />
          
          {/* Progress Bar */}
          <div 
            className={`fixed top-0 left-0 w-full h-2 z-50 transition-opacity duration-300 ${showProgressBar ? 'opacity-100' : 'opacity-0'}`}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-[#deb3fa] via-[#9c27b0] to-[#f3e5f5]"
              style={{ scaleX, transformOrigin: "0%" }}
            />
          </div>
          
          {/* Top Right Controls - Moved out of main */}
      <Navbar 
        showNavLinks={showNavLinks} 
        session={session} 
        showProfileMenu={showProfileMenu} 
        setShowProfileMenu={setShowProfileMenu} 
      />

      <div className="flex-1 p-3 sm:p-3">
        <main className="w-full h-full min-h-[calc(100vh-6rem)] bg-linear-to-b from-[#4a148c] via-[#9c27b0] to-[#f3e5f5] rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay"></div>
          
          {/* Centered Background Faded Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] sm:w-[1000px] sm:h-[1000px] pointer-events-none z-1 opacity-20">
             <div className="relative w-full h-full" style={{ maskImage: 'radial-gradient(circle, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)' }}>
                <Image
                    src="/logo2.png"
                    alt=""
                    fill
                    className="object-contain"
                    priority
                />
             </div>
          </div>

          {/* Logo Top Left */}
          {/* <div className="fixed top-12 sm:top-15 left-8 z-60">
            <div className="w-20 h-20 relative">
            <Image
                src="/logo2.png"  
                alt="Signifiya Logo" 
                fill
                className="object-contain"
               />
            </div>
          </div> */}

          
          {/* Main Content - Timer */}
          <div className="z-10 mt-32 flex flex-col items-center gap-12 sm:gap-22 relative">
             {/* SIGNIFIYA Title */}
             <div className="absolute -top-50 w-full flex flex-col items-center z-30">
                <h1 className={`text-5xl sm:text-6xl md:text-9xl text-white tracking-widest ${bicubik.className}`}>
                  SIGNIFIYA
                </h1>
                <span className={`text-xl sm:text-2xl md:text-3xl text-white tracking-[0.5em] ${bicubik.className} ml-152`}>
                  2026
                </span>
             </div>

             {/* Lottie Animation Above Timer */}
             <div className="absolute -top-18 left-1/2 -translate-x-[170%] w-[220px] h-[220px] pointer-events-none z-20">
                <DotLottieReact
                  src="https://lottie.host/e28afc4a-f625-49e6-b4b6-a41b4d08a155/f7wuEZYKPl.lottie"
                  loop
                 autoplay
                />
             </div>

            <div className="-mt-26 sm:mt-0">
              <Timer />
            </div>
            
            {!session && (
            <Link 
              href="/sign-in"
              className={`bg-[#deb3fa] text-black px-6 py-2 rounded-full border-2 border-black font-bold text-base uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 ${gilton.className}`}
            >
              Sign In / Sign Up
            </Link>
            )}
          </div>
          
          {/* Lottie Animation at Bottom of Hero */}
          <div className="absolute bottom-0 w-full flex flex-col items-center justify-center z-0 pointer-events-none">
             <p className={`text-black/60 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-center max-w-lg mb-[-10px] sm:mb-[-50px] ${softura.className}`}>
                SOET&apos;s awaited fest is back with even more fun n exciting plans ! Glide down to explore our fest
             </p>
             <div className="w-[400px] h-[150px]">
                <DotLottieReact
                  src="https://lottie.host/42483186-c353-4351-93cf-a36ce4fe8333/VWAzrjHsxV.lottie"
                  loop
                  autoplay
                />
             </div>
          </div>
          
           {/* New Lottie Animation - Bottom Right of Hero */}
           <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
             <div className="w-[150px] h-[150px]">
                <DotLottieReact
                  src="https://lottie.host/aadad083-851e-46b8-8325-979c9a4a0f34/VikfqxN0JL.lottie"
                  loop
                  autoplay
                />
             </div>
          </div>
      </main>
      
      <About />
      <div className="relative z-20 bg-black">
        <Marquee />
        <Events />
        <Prizes />
        <Sponsors />
        <Gallery />
      </div>
      <div className="relative z-20 bg-black">
        <Team />
      </div>
      <FAQ />
      <NewsletterSupport />
      <Footer />
      </div>
    </div>
  );
}
