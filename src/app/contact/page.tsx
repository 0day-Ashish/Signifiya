"use client";

import { useState, useRef, useEffect } from "react";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAudio } from "@/components/AudioProvider";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { submitIssue } from "@/app/actions";

import { APP_CONFIG } from "@/config/app.config";

const CONTACT_MEMBERS = APP_CONFIG.contact.members;

const rampart = localFont({ src: "../../../public/fonts/RampartOne-Regular.ttf" });
const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const bicubik = localFont({ src: "../../../public/fonts/Bicubik.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });

interface ContactMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
  color: string;
  social: {
    instagram: string;
    linkedin: string;
    twitter: string;
  };
}

function ContactCard({ member, index }: { member: ContactMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / rect.height) * -20;
    const rotateYValue = (mouseX / rect.width) * 20;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    
    x.set(mouseX * 0.1);
    y.set(mouseY * 0.1);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const cardStyle = {
    rotateX: useTransform(rotateX, [-20, 20], [-5, 5]),
    rotateY: useTransform(rotateY, [-20, 20], [-5, 5]),
    x: useTransform(x, [-50, 50], [-5, 5]),
    y: useTransform(y, [-50, 50], [-5, 5]),
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
      className="w-full"
    >
      <motion.div
        style={{
          rotateX: cardStyle.rotateX,
          rotateY: cardStyle.rotateY,
          x: cardStyle.x,
          y: cardStyle.y,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full h-full"
      >
        <div
          className="relative bg-white border-4 border-black rounded-[2rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          style={{
            backgroundColor: member.color,
            transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
          }}
        >
          {/* Glossy overlay effect */}
          <div className="absolute inset-0 rounded-[2rem] bg-white/10 pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-32 h-32 rounded-full border-4 border-black overflow-hidden relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 bg-white"
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Name */}
            <h3 className={`text-3xl text-black mb-2 ${rampart.className}`}>
              {member.name}
            </h3>

            {/* Role */}
            <p className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-6">
              {member.role}
            </p>

            {/* Contact Info */}
            <div className="w-full space-y-4">
              <motion.a
                href={`mailto:${member.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                {member.email}
              </motion.a>

              {/* Social Icons */}
              <div className="flex justify-center gap-4 pt-2">
                <motion.a
                  href={member.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all"
                  style={{ backgroundColor: '#E4405F' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.a>

                <motion.a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all"
                  style={{ backgroundColor: '#0077B5' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </motion.a>

                <motion.a
                  href={member.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all"
                  style={{ backgroundColor: '#1DA1F2' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>

          {/* 3D depth effect */}
          <div
            className="absolute inset-0 rounded-[2rem] bg-black opacity-0 transition-opacity duration-300"
            style={{
              transform: "translateZ(-10px)",
              opacity: isHovered ? 0.1 : 0,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Contact() {
  const { musicPlaying, audioInitialized, toggleMusic, initializeAudio } = useAudio();
  const [showNavLinks, setShowNavLinks] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [issueEmail, setIssueEmail] = useState("");
  const [issueName, setIssueName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueText.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter an issue description' });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const result = await submitIssue({
        text: issueText,
        email: issueEmail || undefined,
        name: issueName || undefined,
      });

      if (result.success) {
        setSubmitMessage({ type: 'success', text: 'Issue submitted successfully! We will get back to you soon.' });
        setIssueText("");
        setIssueEmail("");
        setIssueName("");
        setTimeout(() => setSubmitMessage(null), 5000);
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to submit issue. Please try again.' });
      }
    } catch (error: any) {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-white text-black rounded-full border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
          <Navbar
            showNavLinks={showNavLinks}
            session={session}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
          />

      <div className="flex-1 p-3 sm:p-3">
        <main className="w-full h-full min-h-[calc(100vh-6rem)] bg-[#da8ae6] rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center relative">
          <div className="fixed top-12 sm:top-15 left-8 z-60 flex flex-col gap-4">
            
            
            
            {/* Back Button */}
            <Link 
              href="/"
              className="w-9 h-9 sm:w-12 ml-5 sm:ml-3 -mt-5 sm:mt-20 sm:h-12 bg-white text-black rounded-full border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95 cursor-none"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </Link>
          </div>

          {/* Contact Cards Section */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-5xl mt-25 sm:mt-0 sm:text-6xl md:text-7xl text-black text-center mb-4 ${gilton.className}`}
            >
              Contact Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-700 text-center mb-12"
            >
              Get in touch with our team
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
              {CONTACT_MEMBERS.map((member, index) => (
                <ContactCard key={member.id} member={member} index={index} />
              ))}
            </div>

            {/* Issue Report Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              <div className="bg-white rounded-[2rem] p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <h2 className={`text-3xl sm:text-4xl text-black text-center mb-6 ${gilton.className}`}>
                  Report an Issue
                </h2>
                
                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl border-2 border-black ${
                      submitMessage.type === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <p className={`font-semibold ${softura.className}`}>{submitMessage.text}</p>
                  </motion.div>
                )}

                <form onSubmit={handleIssueSubmit} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className={`font-bold text-black uppercase text-sm ${softura.className}`}>
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={issueName}
                      onChange={(e) => setIssueName(e.target.value)}
                      placeholder="Enter your name"
                      className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${softura.className}`}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={`font-bold text-black uppercase text-sm ${softura.className}`}>
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={issueEmail}
                      onChange={(e) => setIssueEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${softura.className}`}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={`font-bold text-black uppercase text-sm ${softura.className}`}>
                      Issue Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={issueText}
                      onChange={(e) => setIssueText(e.target.value)}
                      placeholder="Describe your issue or concern..."
                      rows={6}
                      required
                      className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none ${softura.className}`}
                    />
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider border-2 border-transparent hover:bg-[#deb3fa] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${softura.className}`}
                    >
                      {submitting ? "Submitting..." : "Submit Issue"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}