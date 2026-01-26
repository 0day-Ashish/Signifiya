"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });
const bicubik = localFont({ src: "../../../public/fonts/Bicubik.otf" });


// --- 1. CONFIGURATION DATA ---
const eventsData = [
  {
    day: "Day 1",
    date: "13th March, 2026",
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
        coordinators: "Faculty: Dr. Jeet Banerjee",
        image1: "/eee.jpg",
        lottie:
          "https://lottie.host/9f6d3544-7d52-4467-9614-266f44372576/TestLottie.lottie",
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
        image1: "/mechanical1.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
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
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
        color: "bg-red-100",
      },
    ],
  },
  {
    day: "Day 2",
    date: "14th March, 2026",
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
        image1: "/cse1.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
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
        image1: "/lathe-war.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
        color: "bg-indigo-100",
      },
      {
        id: 9,
        title: "Robo Terrain",
        department: "Robotics",
        description:
          "Navigate your bot through rough and uneven terrains without getting stuck or toppling over.",
        time: "2:00 PM - 5:00 PM",
        venue: "Open Ground",
        coordinators: "Student Coordinators",
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
        image1: "/dance-battle.jpg",
        lottie:
          "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
        color: "bg-fuchsia-100",
      },
    ],
  },
];

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
          <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">
            Coordinators
          </h4>
          <p className="text-black font-bold text-lg">{event.coordinators}</p>
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
  return (
    <div className="bg-zinc-950 min-h-screen p-4 font-sans">
      {/* Return Home Link - Fixed beside logo */}
      <div className="fixed top-20 lg:top-16 sm:top-12 left-[120px] sm:left-[130px] z-50">
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
              Signifiya 2026.
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
      {eventsData.map((dayData, dayIndex) => (
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
      ))}

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
