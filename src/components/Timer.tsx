"use client";

import { useEffect, useState } from "react";
import localFont from "next/font/local";

const bartle = localFont({ src: "../../public/fonts/BBHBartle-Regular.ttf" });
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to 30 days from now (persisted if possible, but simpler for now just static 30 days from render or fixed future date)
    // To make it consistent across reloads, we should pick a fixed future date.
    // Let's set it to roughly 30 days from now: March 1st 2026? Today is Jan 16 2026.
    // 30 days from Jan 16 is Feb 15.
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); 

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center gap-2 ${bartle.className}`}>
      <div className="flex items-center gap-1 sm:gap-4 md:gap-8">
        {[
          { label: "DAYS", value: timeLeft.days },
          { label: "HOURS", value: timeLeft.hours },
          { label: "MINUTES", value: timeLeft.minutes },
          { label: "SECONDS", value: timeLeft.seconds },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xl sm:text-4xl md:text-5xl font-bold text-white leading-none drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {item.value.toString().padStart(2, "0")}
            </span>
            <span className="text-[8px] sm:text-xs md:text-sm font-bold text-black/60 tracking-widest mt-0.5 sm:mt-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
