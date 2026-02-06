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
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // Fetch the countdown target date from API
  useEffect(() => {
    const fetchTargetDate = async () => {
      try {
        const res = await fetch("/api/countdown");
        const data = await res.json();
        if (data.targetDate) {
          setTargetDate(new Date(data.targetDate));
        }
      } catch (error) {
        // Fallback to 30 days from now if API fails
        const fallback = new Date();
        fallback.setDate(fallback.getDate() + 30);
        setTargetDate(fallback);
      }
    };
    fetchTargetDate();
  }, []);

  // Calculate and update the countdown
  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={`flex flex-col items-center gap-2 ${bartle.className}`}>
      <div className="flex items-center gap-1 sm:gap-4 md:gap-8">
        {[
          { label: "DAYS", value: timeLeft.days },
          { label: "HOURS", value: timeLeft.hours },
          { label: "MINS", value: timeLeft.minutes },
          { label: "SEC", value: timeLeft.seconds },
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
