"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { authClient } from "@/lib/auth-client";
import { APP_CONFIG } from "@/config/app.config";
import { getScheduleEvents, type DayData } from "./actions";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });
const bicubik = localFont({ src: "../../../public/fonts/Bicubik.otf" });


// --- 1. CONFIGURATION DATA ---
// Note: This is now loaded from server action with caching
// Keeping as fallback for initial render
const fallbackEventsData = [
  {
    day: "Day 1",
    date: APP_CONFIG.event.dates.day1,
    items: [
      {
        id: 1,
        title: "Coding Premier League",
        department: "CSE",
        description:
          "An exhilarating coding competition where participants showcase their programming skills, problem-solving abilities, and creativity.",
        time: "10:00 AM - 1:00 PM",
        venue: "Computer Lab A",
        coordinators: "Aviroop Pal, Sourish Samanta",
        facultyCoordinators: "",
        image1: "/cse2.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
        color: "bg-purple-100",
      },
      {
        id: 2,
        title: "Electrifying Circuit",
        department: "EEE",
        description:
          "Test your knowledge of circuits and electronics in this electrifying showdown designed for the brightest minds in EEE.",
        time: "11:00 AM - 2:00 PM",
        venue: "Electrical Workshop",
        coordinators: "",
        facultyCoordinators: "",
        image1: "/eee.jpg",
        lottie: 
          "https://lottie.host/d4daf38b-2ffb-483d-b524-967a221f540e/okSpmUrCF7.lottie",
        color: "bg-yellow-100",
      },
      {
        id: 3,
        title: "Tower Making",
        department: "Civil",
        description:
          "Construct the tallest and most stable tower using limited resources. A test of structural engineering and patience.",
        time: "2:00 PM - 4:00 PM",
        venue: "Civil Block Lawn",
        coordinators: "Ashish Yadav",
        facultyCoordinators: "",
        image1: "/civil1.jpg",
        lottie:
          "https://lottie.host/02005934-206e-445a-b62d-045339304381/Construction.lottie",
        color: "bg-blue-100",
      },
      {
        id: 4,
        title: "Waste to Wealth",
        department: "Mechanical",
        description:
          "Innovate and create useful products from waste materials. Show how mechanical engineering can drive sustainability.",
        time: "10:00 AM - 12:00 PM",
        venue: "Workshop Hall",
        coordinators: "Aritro Chakrabarty",
        facultyCoordinators: "",  
        image1: "/mechanical1.jpg",
        lottie:
          "https://lottie.host/85932f49-c3cd-4483-ae12-6ddcc8e7cc34/b0nR37lbph.lottie",
        color: "bg-green-100",
      },
      {
        id: 5,
        title: "Path Follower",
        department: "Robotics",
        description:
          "Design an autonomous bot capable of following a complex black line path in the shortest time possible.",
        time: "3:00 PM - 5:00 PM",
        venue: "Main Audi",
        coordinators: "Sumanto",
        image1: "/robotics2.jpg",
        facultyCoordinators: "",
        lottie:
          "https://lottie.host/927b9dd7-f2e5-471e-b14e-6d7402af9a9e/wzqLaYST4c.lottie",
        color: "bg-red-100",
      },
    ],
  },
  {
    day: "Day 2",
    date: APP_CONFIG.event.dates.day2,
    items: [
      {
        id: 6,
        title: "Dil Se Design",
        department: "CSE",
        description:
          "Unleash your UI/UX creativity. Design interfaces that speak to the user's heart.",
        time: "10:00 AM - 1:00 PM",
        venue: "Mac Lab",
        coordinators: "Baibhab Adhikary",
        facultyCoordinators: "",
        image1: "/cse1.jpg",
        lottie:
          "https://lottie.host/a593ed4c-830c-414a-a362-aa96c695fa40/xrcW0oe0cK.lottie",
        color: "bg-pink-100",
      },
      {
        id: 7,
        title: "Bridge Making",
        department: "Civil",
        description:
          "Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.",
        time: "11:00 AM - 1:00 PM",
        venue: "Civil Courtyard",
        coordinators: "Aniruddha Biswas",
        facultyCoordinators: "",
        image1: "/civil2.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
        color: "bg-orange-100",
      },
      {
        id: 8,
        title: "Lathe War",
        department: "Mechanical",
        description:
          "A battle of precision turning. Machine the perfect component on the lathe within the given tolerance.",
        time: "12:00 PM - 2:00 PM",
        venue: "Machine Shop",
        coordinators: "Suman Jana, Soumen Samanta",
        facultyCoordinators: "",
        image1: "/lathe-war.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
        color: "bg-indigo-100",
      },
      {
        id: 9,
        title: "Robo Soccer",
        department: "Robotics",
        description:
          "Navigate your bot through rough and uneven terrains without getting stuck or toppling over.",
        time: "2:00 PM - 5:00 PM",
        venue: "Open Ground",
        coordinators: "Student Coordinators",
        facultyCoordinators: "",
        image1: "/robotics1.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
        color: "bg-teal-100",
      },
      {
        id: 10,
        title: "Dance & Rap Battle",
        department: "Non-Tech",
        description:
          "End the fest on a high note with electrifying performances. Treasure hunt and arm wrestling included!",
        time: "5:00 PM Onwards",
        venue: "Main Stage",
        coordinators: "Saheb Sir",
        facultyCoordinators: "",
        image1: "/dance-battle.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
        color: "bg-fuchsia-100",
      },
    ],
  },
];

// EventCard component
const EventCard = ({ event, index }: { event: any; index: number }) => {
  const isTextLeft = index % 2 === 0;

  return (
    <div
      className={`flex flex-col ${
        isTextLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      } justify-between items-center w-full gap-8 lg:gap-16 py-12 lg:py-16`}
    >
      <Navbar />
      {/* Content Section */}
      <div className="flex flex-col w-full lg:w-1/2 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          {/* Blocky Badge */}
          <span
            className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-black border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg`}
          >
            {event.department}
          </span>
          <span className="px-3 py-1.5 text-sm font-mono font-bold text-black border-2 border-black bg-zinc-200 rounded-lg">
            #{index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
        </div>

        <h3 className="text-4xl lg:text-5xl font-black tracking-tighter text-black leading-[1.1] drop-shadow-sm">
          {event.title}
        </h3>
        <p className="text-zinc-800 text-lg lg:text-xl font-medium tracking-tight mt-6 text-balance leading-relaxed">
          {event.description}
        </p>

        {/* Metadata Badges (Blocky Style) */}
        <div className="flex flex-wrap gap-4 mt-8 font-mono text-sm">
          <div
            className={`flex items-center px-4 py-3 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${event.color}`}
          >
            <span className="font-bold mr-2">🕒 TIME:</span>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center px-4 py-3 border-2 border-black bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-bold mr-2">📍 VENUE:</span>
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Coordinators Section */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-zinc-300">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex-1">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">
                Student Coordinators
              </h4>
              <p className="text-black font-bold text-lg">{event.coordinators}</p>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">
                Faculty Coordinators
              </h4>
              <p className="text-black font-bold text-lg">{event.facultyCoordinators || "TBA"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual/Image Section */}
      <div className="relative w-full lg:w-1/2 flex justify-center items-center min-h-[400px]">
        <div className="relative w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]">
          {/* Back Image (Solid Block Color) */}
          <div
            className={`absolute inset-0 ${event.color} border-3 border-black transform rotate-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 rounded-2xl`}
          >
            {/* Decorative pattern or just solid color */}
          </div>

          {/* Main Image Container */}
          <div className="absolute inset-0 bg-white p-2 border-3 border-black transform -rotate-3 hover:rotate-0 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-20 rounded-2xl overflow-hidden">
            <div className="relative w-full h-full border border-black rounded-xl overflow-hidden">
              <Image
                src={event.image1}
                alt={`${event.title} main`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Floating Sticker/Lottie */}
          <div className="absolute -bottom-10 -left-10 z-30 w-32 h-32 lg:w-48 lg:h-48 pointer-events-none drop-shadow-2xl">
            <DotLottieReact src={event.lottie} loop autoplay />
          </div>

          {/* Decorative Element (Star/Circle) */}
          <div className="absolute -top-6 -right-6 z-30 bg-black text-white w-14 h-14 flex items-center justify-center rounded-full font-bold text-2xl border-2 border-white shadow-lg">
            ✦
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN PAGE COMPONENT ---
export default function Schedule() {
  const [showNavLinks, setShowNavLinks] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [eventsData, setEventsData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the authClient hook to get session data
  const { data: sessionData } = authClient.useSession();

  // Fetch schedule events with caching
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await getScheduleEvents();
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching schedule events:", error);
        // Fallback to static data if cache fails
        setEventsData(fallbackEventsData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

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
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint for large screens

      // Only show nav links on scroll up for desktop/laptop screens
      if (isDesktop) {
        if (isAtTop) {
          setShowNavLinks(false);
        } else if (isScrollingUp) {
          setShowNavLinks(true);
        } else {
          setShowNavLinks(false);
        }
      } else {
        // On mobile/tablet, keep nav links closed (controlled by button click in Navbar)
        setShowNavLinks(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen p-4 font-sans">
      <Navbar
        showNavLinks={showNavLinks}
        session={session}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        hideLogo={false}
      />
      
      {/* Return Home Link - Fixed below logo */}
      <div className="fixed top-38 lg:top-34 sm:top-30 left-10 z-50">
        <Link
          href="/"
          className="inline-block w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          ← RETURN HOME
        </Link>
      </div>
      
      {/* Hero Section - Preserved Layout, Updated "Container" Style */}
      <div className="bg-gradient-to-b from-purple-950 via-purple-600 to-purple-100 min-h-[85vh] p-6 w-full rounded-[2rem] flex flex-col justify-center items-center relative overflow-hidden mb-8">
        <div className="z-10 flex flex-col items-center">
          <h1 className={`text-[18vw] lg:text-[12vw] tracking-wider text-white leading-none text-center select-none ${gilton.className}`}>
            Events
          </h1>
          <div className="mt-4 lg:mt-0 lg:absolute lg:bottom-10 lg:right-10">
            <span className={`tracking-wider text-white font-black text-3xl lg:text-4xl text-shadow-lg ${bicubik.className}`}>
              {APP_CONFIG.event.fullName}.
            </span>
          </div>

          <p className={`text-zinc-100 text-center text-xl lg:text-3xl max-w-full tracking-tight text-balance mt-6 lg:mt-0 ${softura.className}`}>
            Get to know more about{" "}
            <span className="italic text-white underline decoration-wavy decoration-purple-400">
              Signifiya
            </span>{" "}
            and the exciting events lined up.
          </p>
        </div>
      </div>

      {/* Days Loop */}
      {isLoading ? (
        <div className="bg-[#fff1f2] min-h-screen mb-8 rounded-[2rem] p-6 lg:p-12 flex items-center justify-center">
          <p className="text-black text-xl">Loading schedule...</p>
        </div>
      ) : (
        eventsData.map((dayData, dayIndex) => (
        // The White "Block" Container
        <div
          key={dayIndex}
          className="bg-[#fff1f2] min-h-screen mb-8 rounded-[2rem] p-6 lg:p-12 relative overflow-visible"
        >
          {/* Day Header - Absolute Positioned as requested */}
          <div className="w-full h-full relative mb-24">
            <div className="absolute top-0 lg:top-0 right-0 flex flex-col items-end">
              <h1 className="text-sm lg:text-lg text-black font-mono font-bold tracking-widest bg-yellow-300 px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg mb-2 transform rotate-2">
                {dayData.date}
              </h1>
              <h2 className="text-6xl lg:text-[10vw] font-black text-end tracking-tighter text-white text-stroke-2 text-stroke-black drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] leading-[0.8]">
                {dayData.day}
              </h2>
              <h1 className="text-sm font-bold tracking-tighter text-zinc-800 bg-zinc-100 px-2 py-1 rounded border border-zinc-300 mt-4">
                Events & Guidelines
              </h1>
            </div>
          </div>

          {/* Events Grid */}
          <div className="flex flex-col gap-12 mt-32 lg:mt-40">
            {dayData.items.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      ))
      )}

      <Footer />

      {/* Custom CSS for text stroke support if Tailwind plugin isn't installed */}
      <style jsx global>{`
        .text-stroke-2 {
          -webkit-text-stroke: 2px black;
        }
        .text-stroke-black {
          -webkit-text-stroke-color: black;
        }
      `}</style>
    </div>
  );
}
