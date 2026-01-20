"use client";

import { useState } from "react";
import localFont from "next/font/local";
import FadeIn from "./FadeIn";
import Link from "next/link";
import { subscribeNewsletter } from "@/app/actions";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

export default function NewsletterSupport() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const res = await subscribeNewsletter({ email, consent });
    setLoading(false);
    if (res.success) {
      setMessage({ type: "success", text: "Thanks! You're subscribed." });
      setEmail("");
      setConsent(false);
    } else {
      setMessage({ type: "error", text: res.error || "Something went wrong" });
    }
  }
  return (
    <section className="w-full bg-black pt-3">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Newsletter Card */}
        <div className="flex-1 bg-[#E9D5FF] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[400px] group">
          <div className="z-10 relative">
            <FadeIn>
                <h2 className={`text-5xl sm:text-6xl text-black leading-[0.9] tracking-tight mb-4 uppercase ${gilton.className}`}>
                YOUR <span className="italic">INBOX </span> JUST
                <br />
                GOT BETTER
                </h2>
            </FadeIn>
            
            {/* Paper Airplane Icon Placeholder - positioned absolutely or inline */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 rotate-12 hidden sm:block group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
               </svg>
            </div>

            <FadeIn delay={200}>
                <p className="text-black font-medium text-lg mt-6 max-w-md">
                Subscribe to our newsletter for VIP access to news, offers, and insights!
                </p>
            </FadeIn>
          </div>

          <div className="z-10 mt-8">
            <FadeIn delay={400}>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                <input 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="flex-1 bg-white rounded-full px-6 py-4 text-black placeholder:text-gray-400 border-2 border-black focus:outline-none focus:ring-0 disabled:opacity-70"
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-black text-white px-8 py-4 rounded-full uppercase font-bold text-sm tracking-wide border-2 border-black hover:bg-[#E9D5FF] hover:text-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "..." : "SUBSCRIBE"}
                </button>
                </div>
                
                <div className="flex items-start gap-2 mt-2">
                <div className="relative flex items-center">
                    <input 
                    type="checkbox" 
                    id="consent" 
                    checked={consent} 
                    onChange={(e) => setConsent(e.target.checked)}
                    disabled={loading}
                    className="peer h-5 w-5 appearance-none border-2 border-black rounded bg-white checked:bg-black checked:border-black focus:outline-none disabled:opacity-70" 
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white hidden peer-checked:block pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <label htmlFor="consent" className="text-black text-xs font-medium cursor-pointer select-none">
                    I agree to receive communications from SIGNIFIYA'26.
                </label>
                </div>

                {message && (
                  <p className={`text-sm mt-2 font-medium ${softura.className} ${message.type === "success" ? "text-green-700" : "text-red-600"}`}>
                    {message.text}
                  </p>
                )}
                </form>
            </FadeIn>
          </div>
          
          {/* Background decorative shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
             <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
             <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Support Card */}
        <div className="flex-1 bg-[#3B82F6] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[400px] group/support">
          <div className="z-10">
            <div className="flex justify-between items-start">
              <FadeIn>
                <h2 className={`text-5xl sm:text-6xl text-black leading-[0.9] tracking-tight mb-4 uppercase ${gilton.className}`}>
                    ALWAYS HERE
                    <br />
                    TO <span className="italic">HELP</span>
                </h2>
              </FadeIn>
              
              {/* Support Icon/Avatar */}
              <div className="w-20 h-20 bg-[#FCD34D] rounded-full border-2 border-black items-center justify-center relative overflow-hidden shrink-0 ml-4 hidden sm:flex transition-transform group-hover/support:scale-105 group-hover/support:rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover/support:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover/support:translate-x-[2px] group-hover/support:translate-y-[2px]">
                 <div className="absolute bottom-0 w-12 h-6 bg-black rounded-t-full transition-all duration-300 group-hover/support:h-7"></div>
                 <div className="absolute top-4 w-8 h-8 bg-black rounded-full transition-all duration-300 group-hover/support:top-3"></div>
                 {/* Simple smiley face representation */}
                 <div className="w-12 h-12 bg-[#FCD34D] rounded-full border-2 border-black relative z-10 flex items-center justify-center transition-transform duration-300 group-hover/support:scale-110">
                    <div className="flex gap-2">
                        <div className="w-1 h-1 bg-black rounded-full transition-all duration-300 group-hover/support:h-2 group-hover/support:w-1.5"></div>
                        <div className="w-1 h-1 bg-black rounded-full transition-all duration-300 group-hover/support:h-2 group-hover/support:w-1.5"></div>
                    </div>
                    <div className="absolute bottom-3 w-4 h-2 border-b-2 border-black rounded-b-full transition-all duration-300 group-hover/support:w-6 group-hover/support:h-4 group-hover/support:border-b-4 group-hover/support:bottom-2"></div>
                 </div>
              </div>
            </div>

            <FadeIn delay={200}>
                <p className="text-black font-medium text-lg mt-6 max-w-md">
                Got questions ? Our Support Team is here to help 24*7!
                </p>
            </FadeIn>
          </div>

          <div className="z-10">
            <FadeIn delay={400}>
              <Link href="/contact">
                <button className="bg-black text-white px-8 py-4 rounded-full uppercase font-bold text-sm tracking-wide border-2 border-black hover:bg-[#3B82F6] hover:text-black transition-colors flex items-center gap-2 group">
                GET SUPPORT
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </button>
                </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
