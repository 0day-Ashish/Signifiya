"use client";

import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { APP_CONFIG } from "@/config/app.config";

const bartle = localFont({ src: "../../public/fonts/BBHBartle-Regular.ttf" });
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });
const SocialCard = ({ social }: { social: any }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 150, mass: 0.1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    };

    return (
        <a
            href={social.href}
            className="bg-white rounded-4xl w-full aspect-square lg:w-44 lg:h-44 flex items-center justify-center hover:scale-105 transition-transform duration-300 group relative overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
             {/* Floating Label */}
             <motion.div 
                className={`absolute pointer-events-none z-20 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    left: xSpring,
                    top: ySpring,
                    transform: 'translate(-50%, -50%)' // Centered on cursor
                }}
             >
                <div className={`bg-black text-white text-xs font-bold uppercase px-3 py-1 rounded-full border border-white shadow-lg whitespace-nowrap ${softura.className}`}>
                    {social.name}
                </div>
             </motion.div>

             {/* Icon */}
             <div className="w-20 h-20 flex items-center justify-center relative z-10">
                 <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full transition-colors duration-300"
                  style={{ fill: isHovering ? social.color : 'black' }}
                >
                  <path d={social.path} />
                </svg>
             </div>
        </a>
    )
}

// FooterMainContent Component extracted to handle its own motion state
const FooterMainContent = ({ children }: { children: React.ReactNode }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 150, mass: 0.1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const [isHovering, setIsHovering] = useState(false);
    const [isHoveringLink, setIsHoveringLink] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const target = e.target as HTMLElement;
        if (target.closest('a') || target.closest('button')) {
            setIsHoveringLink(true);
        } else {
            setIsHoveringLink(false);
        }
    };

    return (
        <div 
            className={`flex-1 bg-[#4ADE80] rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden min-h-[320px] lg:min-h-auto max-w-full lg:max-w-[calc(100%-21rem)] group/footer ${softura.className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setIsHoveringLink(false);
            }}
            onMouseMove={handleMouseMove}
        >
          {/* Floating SIGNIFIYA Label */}
          <motion.div 
            className={`absolute pointer-events-none z-50 transition-opacity duration-200 ${isHovering && !isHoveringLink ? 'opacity-100' : 'opacity-0'}`}
            style={{
                left: xSpring,
                top: ySpring,
                transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`bg-black text-white text-sm font-bold uppercase px-4 py-1.5 rounded-full border border-white shadow-lg whitespace-nowrap ${gilton.className} tracking-widest`}>
                SIGNIFIYA
            </div>
          </motion.div>
          
          {children}
        </div>
    );
};

export default function Footer() {
  const socialIcons = [
    { 
      name: "discord", 
      href: "#",
      path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.3249 18.3249 0 00-7.4871 0c-.1636-.3868-.4054-.7835-.6161-1.1588a.077.077 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0743 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z",
      color: "#5865F2"
    },
    { 
      name: "twitter", 
      href: "#",
      path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      color: "#000000"
    },
    { 
      name: "instagram", 
      href: APP_CONFIG.social.instagram,
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
      color: "#E4405F"
    },
    { 
      name: "youtube", 
      href: "#",
      path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
      color: "#FF0000"
    }
  ];

  return (
    <footer className="w-full bg-black py-6 px-4">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Social Icons Grid */}
        <div className="relative grid grid-cols-2 gap-x-5 gap-y-17 w-full lg:w-auto lg:shrink-0 h-auto">
          {/* Lottie between social icons */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none z-0">
            <DotLottieReact
              src="https://lottie.host/4bacb5e7-ebb8-4432-9d0d-30a7670320cd/DNDnMBvDqd.lottie"
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
          {socialIcons.map((social, index) => (
            <SocialCard key={index} social={social} />
          ))}
        </div>

        {/* Main Footer Content */}
        <FooterMainContent>
          {/* Lottie Animation - Background/Bottom Center */}
          <div className="absolute -bottom-11 left-25 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-[300px] h-[300px] pointer-events-none z-0">
            <DotLottieReact
              src="https://lottie.host/c0e223f1-2554-4dab-bf19-7de564e95b22/XTB4aMtOIo.lottie"
              loop
              autoplay
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16 z-10 h-full relative">
            <div className="flex flex-col justify-between h-full w-full">
              
              {/* Top Section */}
              <div className="flex flex-col md:flex-row justify-between w-full">
                {/* Left Text */}
                <div className="max-w-xl">
                  <h2 className={`text-2xl sm:text-3xl md:text-3xl text-black leading-[0.9] tracking-tight ${bartle.className}`}>
                    DOWNLOAD THE
                    <br />
                    <span className="italic">
                    Signifiya App
                    </span>
                    <br />
                    Right Now.
                  </h2>
                  <div className="mt-6 flex flex-col gap-3">
                    <button className="bg-white text-black px-4 py-1.5 rounded-lg border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group/btn w-fit">
                        <Image src="/googleplay.png" alt="Google Play" width={24} height={24} className="w-6 h-6 object-contain" />
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[8px] uppercase font-bold tracking-wider">Coming Soon !</span>
                            <span className="text-sm font-bold font-sans tracking-tight">Google Play</span>
                        </div>
                    </button>
                    
                    <button className="bg-white text-black px-4 py-1.5 rounded-lg border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group/btn w-fit">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                             <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.98 1.08-3.11-1.06.05-2.31.71-3.06 1.61-.69.82-1.27 2-1.11 3.27 1.19.09 2.4-.6 3.09-1.77z" />
                        </svg>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[8px] uppercase font-bold tracking-wider">Coming Soon !</span>
                            <span className="text-sm font-bold font-sans tracking-tight">App Store</span>
                            
                        </div>
                    </button>
                  </div>
                </div>

                {/* Right Navigation */}
                <nav className="flex flex-col gap-2 min-w-[200px] mt-8 md:mt-0">
                  {[
                    { label: "HOME", href: "/" },
                    { label: "BECOME A SPONSOR", href: "/sponsors" },
                    { label: "EVENTS", href: "/schedule" },
                    { label: "CONTACT", href: "/contact" },
                    { label: "FAQ", href: "#faq" },
                    { label: "RULES & REGULATIONS", href: "#" }
                  ].map((item) => (
                    <Link 
                      key={item.label} 
                      href={item.href} 
                      className="text-black font-extrabold text-lg sm:text-xl relative w-fit group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black transition-all duration-500 ease-in-out group-hover:w-full" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Bottom Links & Copyright */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-auto pt-12 z-10 w-full">
                <div className="flex flex-col gap-2 min-w-[200px] order-1 sm:order-2">
                  {[
                    { label: "ASSETS", href: "/assets" },
                    { label: "TERMS OF SERVICE", href: "#" }
                  ].map((item) => (
                    <Link  
                      key={item.label} 
                      href={item.href} 
                      className="text-black font-bold text-sm relative w-fit group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black transition-all duration-500 ease-in-out group-hover:w-full" />
                    </Link>
                  ))}
                </div>
                <span className="text-black font-bold text-sm order-2 sm:order-1">
                  {APP_CONFIG.organization.copyright}
                </span>
              </div>

            </div>
          </div>
        </FooterMainContent>
      </div>
    </footer>
  );
}
