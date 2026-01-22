"use client";

import localFont from "next/font/local";
import FadeIn from "./FadeIn";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const rampart = localFont({ src: "../../public/fonts/RampartOne-Regular.ttf" });
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });
const bartle = localFont({ src: "../../public/fonts/BBHBartle-Regular.ttf" });


export default function Prizes() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <section className="w-full bg-black pb-3">
        <div 
          className="bg-[#E8EDFF] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col items-center justify-center text-center gap-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Floating Text Box */}
          <motion.div 
            className={`absolute pointer-events-none z-50 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            style={{
              left: xSpring,
              top: ySpring,
              transform: 'translate(20px, -60px)'
            }}
          >
            <div className={`bg-black text-white text-sm  uppercase px-4 py-1.5 rounded-full border border-white shadow-lg whitespace-nowrap ${gilton.className} tracking-widest`}>
              paisaa hi paisaa hogaaa
            </div>
          </motion.div>
            
            {/* Lottie Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                 <div className="w-[500px] h-[500px] opacity-80">
                    <DotLottieReact
                      src="https://lottie.host/0f63fd76-3dec-4340-b124-c72eb23a19be/pmSxXvemID.lottie"
                      loop
                      autoplay
                    />
                 </div>
            </div>

            <FadeIn>
                <div className="flex flex-col gap-2 relative z-10">
                    <h2 className={`text-6xl sm:text-6xl text-black leading-none tracking-tight ${bartle.className} drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]`}>
                        120k+ INR
                    </h2>
                    <h3 className={`text-3xl sm:text-5xl text-black uppercase leading-tight ${softura.className}`}>
                        in Prize Pool
                    </h3>
                </div>
            </FadeIn>

            <FadeIn delay={200}>
                <p className={`text-xl sm:text-2xl text-gray-800 font-medium max-w-2xl mx-auto uppercase tracking-wider ${softura.className} relative z-10`}>
                    Goodies, Merches & Many More...
                </p>
            </FadeIn>
            
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-12 h-12 border-4 border-black rounded-full bg-[#FCD34D] hidden sm:block animate-bounce" style={{ animationDuration: '3s' }}></div>
            
            {/* New Lottie Animation - Right Side */}
            <div className="absolute -right-10 bottom-0 w-[300px] h-[300px] pointer-events-none z-10 hidden sm:block">
                 <DotLottieReact
                   src="https://lottie.host/63950b54-c863-4651-b3d0-cf9b30cb54d3/foQ5NaHbZg.lottie"
                   loop
                   autoplay
                 />
            </div>
        </div>
    </section>
  );
}
