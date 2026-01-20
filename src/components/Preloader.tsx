"use client";

import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

const bartle = localFont({ src: "../../public/fonts/BBHBartle-Regular.ttf" });

interface PreloaderProps {
  onFinish?: () => void;
}

export default function Preloader({ onFinish }: PreloaderProps) {
  const [complete, setComplete] = useState(false);
  const [hide, setHide] = useState(false);
  
  // Use MotionValue for smooth progress
  const count = useMotionValue(0);
  const [displayCount, setDisplayCount] = useState(0);

  const text = "SIGNIFIYA'26";

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Sync state for text rendering triggers
    const unsubscribe = count.on("change", (latest) => {
        setDisplayCount(Math.round(latest));
    });

    const controls = animate(count, 100, {
        duration: 3, // Faster duration (3s)
        ease: "linear",
        onComplete: () => {
            // Ensure all letters are lit before finishing
            setDisplayCount(100);
            
            // Small delay to let user see the full text
            setTimeout(() => {
                setComplete(true);
                setTimeout(() => {
                    document.body.style.overflow = "";
                    setHide(true);
                    if (onFinish) onFinish();
                }, 1000); // Animation duration for slide up
            }, 800); 
        }
    });

    return () => {
      controls.stop();
      unsubscribe();
      document.body.style.overflow = "";
    };
  }, [onFinish, count]);

  if (hide) return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-black text-white transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        complete ? "-translate-y-full rounded-b-[50%]" : "translate-y-0 rounded-b-none"
      }`}
    >
      {/* Smooth Progress Bar */}
      <motion.div 
        className="absolute top-0 left-0 h-1 bg-white"
        style={{ width: useTransform(count, (value) => `${value}%`) }}
      />

      <div className={`flex ${bartle.className}`}>
        {text.split('').map((char, index) => {
            // Logic to light up characters based on progress
            const threshold = (index / text.length) * 100;
            // Use slightly lower threshold to ensure they light up progressively but definitely all by 100
            const isLit = displayCount > threshold;
            
            return (
                <span 
                    key={index}
                    className={`text-[5vw] leading-none inline-block transition-all duration-300 ${
                        isLit 
                        ? 'text-white opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-glitch' 
                        : 'text-gray-800 opacity-20 blur-[1px]'
                    }`}
                    style={{
                        minWidth: char === ' ' ? '1vw' : 'auto'
                    }}
                >
                    {char}
                </span>
            );
        })}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes glitch {
          0% { transform: translate(0); opacity: 1; }
          2% { transform: translate(-2px, 2px); opacity: 0.8; }
          4% { transform: translate(2px, -2px); opacity: 1; }
          6% { transform: translate(0); opacity: 1; }
          8% { transform: translate(0); opacity: 0.5; }
          10% { transform: translate(0); opacity: 1; }
          12% { transform: translate(-2px, 0); opacity: 0.8; }
          14% { transform: translate(0); opacity: 1; }
          50% { transform: translate(1px, 1px); opacity: 0.9; }
          100% { transform: translate(0); opacity: 1; }
        }
        .animate-glitch {
          animation: glitch 0.4s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}} />
    </div>
  );
}
