"use client";
import { useParams } from "next/navigation";
import { eventDetails } from "@/data/event-details";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import localFont from "next/font/local";

const bicubik = localFont({ src: "../../../../public/fonts/Bicubik.otf" });
const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const event = eventDetails[eventId];

  const [showNavLinks, setShowNavLinks] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        if (isAtTop) {
          setShowNavLinks(false);
        } else if (isScrollingUp) {
          setShowNavLinks(true);
        } else {
          setShowNavLinks(false);
        }
      } else {
        setShowNavLinks(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!event) {
    return (
      <div className="bg-zinc-950 min-h-screen p-4">
        <Navbar
          showNavLinks={showNavLinks}
          session={session}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          hideLogo={false}
        />
        <div className="max-w-4xl mx-auto mt-32 text-center">
          <h1 className="text-4xl font-black text-white mb-4">
            Event Not Found
          </h1>
          <p className="text-zinc-400 mb-8">
            The event details you're looking for don't exist or have been
            removed.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen p-4">
      <Navbar
        showNavLinks={showNavLinks}
        session={session}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        hideLogo={false}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-950 via-purple-700 to-purple-500 min-h-[40vh] p-8 lg:p-12 w-full rounded-[2rem] flex flex-col justify-end items-start relative overflow-hidden mb-8 mt-2">
        <div className="z-10 w-full">
          <span
            className={`inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider text-black border-2 border-black bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg mb-4`}
          >
            {event.category}
          </span>

          <h1
            className={`text-5xl lg:text-7xl tracking-tight text-white leading-none font-black mb-4 ${bicubik.className}`}
          >
            {event.name}
          </h1>
          <p
            className={`text-white/90 text-lg lg:text-xl max-w-3xl ${softura.className}`}
          >
            {event.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mb-12">
        <div className="bg-[#fff1f2] rounded-[2rem] p-8 lg:p-12">
          {/* Schedule Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-2">
                📅 Date
              </h3>
              <p className="text-black font-bold text-lg">
                {event.schedule.date}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-2">
                🕒 Time
              </h3>
              <p className="text-black font-bold text-lg">
                {event.schedule.time}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-2">
                📍 Venue
              </h3>
              <p className="text-black font-bold text-lg">
                {event.schedule.venue}
              </p>
            </div>
          </div>

          {/* Objective */}
          <section className="mb-12">
            <h2
              className={`text-3xl lg:text-4xl font-black text-black mb-6 ${bicubik.className}`}
            >
              🎯 Objectives
            </h2>
            <ul className="space-y-3">
              {event.objective.map((obj, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 bg-white p-4 rounded-lg border-2 border-black"
                >
                  <span className="text-purple-600 font-black text-lg mt-0.5">
                    •
                  </span>
                  <span className="text-black font-medium text-lg">{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Participation Details */}
          <section className="mb-12">
            <h2
              className={`text-3xl lg:text-4xl font-black text-black mb-6 ${bicubik.className}`}
            >
              👥 Participation Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-100 p-6 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-black text-zinc-700 uppercase tracking-widest mb-2">
                  Team Size
                </h3>
                <p className="text-black font-bold text-xl">
                  {event.participation.teamSize}
                </p>
              </div>
              <div className="bg-green-100 p-6 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-black text-zinc-700 uppercase tracking-widest mb-2">
                  Registration Fee
                </h3>
                <p className="text-black font-bold text-xl">
                  {event.participation.registrationFee}
                </p>
              </div>
              <div className="bg-blue-100 p-6 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-black text-zinc-700 uppercase tracking-widest mb-2">
                  Eligibility
                </h3>
                <p className="text-black font-bold text-lg">
                  {event.participation.eligibility}
                </p>
              </div>
            </div>
          </section>

          {/* Event Format */}
          <section className="mb-12">
            <h2
              className={`text-3xl lg:text-4xl font-black text-black mb-6 ${bicubik.className}`}
            >
              📋 Event Format
            </h2>
            <div className="space-y-3">
              {event.format.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <p className="text-black font-medium text-lg">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Judging Criteria */}
          <section className="mb-12">
            <h2
              className={`text-3xl lg:text-4xl font-black text-black mb-6 ${bicubik.className}`}
            >
              ⚖️ Judging Criteria
            </h2>
            <ul className="space-y-3">
              {event.judgingCriteria.map((criteria, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg border-2 border-black"
                >
                  <span className="bg-purple-600 text-white font-black text-sm px-2 py-1 rounded">
                    {index + 1}
                  </span>
                  <span className="text-black font-medium text-lg flex-1">
                    {criteria}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements */}
          <section className="mb-12">
            <h2
              className={`text-3xl lg:text-4xl font-black text-black mb-6 ${bicubik.className}`}
            >
              🔧 Requirements & Setup
            </h2>
            <div className="bg-zinc-100 p-6 rounded-xl border-2 border-black">
              <ul className="space-y-2">
                {event.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-black font-black text-lg mt-0.5">
                      ✓
                    </span>
                    <span className="text-zinc-800 font-medium text-lg">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Prize Structure */}
          <section className="mb-8">
            <h2
              className={`text-3xl lg:text-4xl font-black text-black mb-6 ${bicubik.className}`}
            >
              🏆 Prize Structure
            </h2>
            <div className="bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 p-8 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-4xl font-black text-black mb-6 text-center">
                {event.prizeStructure.prizePool}
              </p>
              {event.prizeStructure.details && (
                <ul className="space-y-2">
                  {event.prizeStructure.details.map((detail, index) => (
                    <li
                      key={index}
                      className="text-black font-bold text-lg flex items-center gap-2 justify-center"
                    >
                      <span>🎁</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t-4 border-dashed border-zinc-300">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              ← Back to Schedule
            </Link>
            {event.closed ? (
              <span
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] cursor-not-allowed uppercase"
              >
                REGISTRATIONS CLOSED
              </span>
            ) : (
              <Link
                href={`/events?event=${eventId}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Register Now →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Rules (if available) - Full Width */}
      {event.rules && event.rules.length > 0 && (
        <section className="mb-12 w-full">
          <div className="bg-[#fff1f2] rounded-[2rem] p-8 lg:p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2
              className={`text-3xl lg:text-4xl font-black text-black mb-6 ${bicubik.className}`}
            >
              📜 Rules & Regulations
            </h2>
            <div className="bg-red-50 p-6 rounded-xl border-2 border-red-600">
              <ul className="space-y-3">
                {event.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-600 font-black text-lg mt-0.5">
                      ⚠
                    </span>
                    <span className="text-black font-medium text-lg">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
