"use client";

import { useState } from "react";
import localFont from "next/font/local";
import { motion, AnimatePresence } from "motion/react";
import FadeIn from "./FadeIn";

const rampart = localFont({ src: "../../public/fonts/RampartOne-Regular.ttf" });
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

const FAQs = [
  {
    question: "What is Signifiya?",
    answer: "Signifiya is a decentralized platform designed to empower users with secure and transparent financial tools. We leverage blockchain technology to provide a seamless experience for managing your digital assets."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply download our app from the Google Play Store (App Store coming soon), create an account, and verify your identity. You'll be ready to explore our features in minutes."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We prioritize your privacy and security. Your data is encrypted and stored securely, and we never share your personal information with third parties without your consent."
  },
  {
    question: "Are there any fees?",
    answer: "We strive to keep our fees competitive and transparent. You can view a detailed breakdown of our fee structure on our pricing page or within the app settings."
  },
  {
    question: "How can I contact support?",
    answer: "Our support team is available 24/7 to assist you. You can reach out to us via the 'Get Support' button in the section below, or join our Discord community for real-time assistance."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-black pb-3">
      <div className="bg-[#f3e5f5] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <FadeIn>
            <div className="flex flex-col gap-4 text-center">
                <h2 className={`text-3xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}>
                    Frequently<span className="italic">Asked </span><br/> Questions
                </h2>
                <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${gilton.className}`}>
                    Got questions? We've got answers. Here are some of the most common questions we get from our community.
                </p>
            </div>
        </FadeIn>

        <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
            {FAQs.map((faq, index) => (
                <FadeIn key={index} delay={index * 100}>
                    <div 
                        onClick={() => toggleFAQ(index)}
                        className={`bg-white border-4 border-black rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'}`}
                    >
                        <div className="p-6 flex justify-between items-center gap-4">
                            <h3 className={`text-xl sm:text-2xl text-black font-bold uppercase ${softura.className} tracking-wide`}>
                                {faq.question}
                            </h3>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-black transition-all duration-300 ${activeIndex === index ? 'bg-black text-white rotate-45' : 'bg-[#deb3fa] text-black rotate-0'}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </div>
                        </div>
                        
                        <AnimatePresence>
                            {activeIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-6 pb-6 text-lg text-gray-700 font-medium leading-relaxed border-t-2 border-dashed border-gray-300 pt-4">
                                        <p className={gilton.className}>{faq.answer}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </FadeIn>
            ))}
        </div>

      </div>
    </section>
  );
}
