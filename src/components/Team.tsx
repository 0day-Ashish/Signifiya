"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  Pause,
  Play,
  Star,
} from "lucide-react";
import localFont from "next/font/local";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
};
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });
const TEAM_MEMBERS: TeamMember[] = [
  { id: 1, name: "Nisarga Chand", role: "Faculty Lead", image: "/team/Nisarga.jpeg", linkedin: "https://linkedin.com/in/hrishav-dey-2b2990291/", instagram: "https://instagram.com/hrishav.dey", github: "https://github.com/" },
  { id: 2, name: "Soodipa Chakraborty", role: "Faculty Lead", image: "/team/Soodipa.jpg", linkedin: "https://linkedin.com/in/hrishav-dey-2b2990291/", instagram: "https://instagram.com/hrishav.dey", github: "https://github.com/" },
  { id: 3, name: "Prabhat Das", role: "Tech Mentor", image: "/team/Prabhat.jpg", linkedin: "https://linkedin.com/in/prabhatd/", instagram: "https://instagram.com/hrishav.dey", github: "https://github.com/" },
  { id: 4, name: "Hrishav Dey", role: "Event Advisor", image: "/avatar4.jpg", linkedin: "https://linkedin.com/in/hrishav-dey-2b2990291/", instagram: "https://instagram.com/hrishav.dey" },
  { id: 5, name: "Digant Mishra", role: "On-Ground Coordinator", image: "/team/Digant.jpeg", linkedin: "https://linkedin.com/in/digant-mishra-2b2990291/", instagram: "https://instagram.com/digantt._" },
  { id: 6, name: "Arijit De", role: "Financial & Sponsorship Lead", image: "/team/Arijit.jpg", linkedin: "https://linkedin.com/in/arijit-de-ba1594358", instagram: "https://instagram.com/arijit_.04" },
  { id: 7, name: "Siddartha Chakraborty", role: "Esports Lead", image: "/team/Siddharth-01.jpeg", linkedin: "https://linkedin.com/in/siddarthachakraborty/", instagram: "https://instagram.com/siddarthachk", github: "https://github.com/siddarthachk" },
  { id: 8, name: "Snehasish Mondal", role: "Operations Lead", image: "/team/Snehasish.jpg", linkedin: "https://linkedin.com/in/snehasish-mondal-2b2990291/", instagram: "https://instagram.com/snehasish.mondal", github: "https://github.com/" },
  { id: 9, name: "Samriddhi Sinha", role: "Decorations Lead", image: "/team/Samriddhi.jpeg", linkedin: "https://linkedin.com/in/samriddhi-sinha-2b2990291/", instagram: "https://instagram.com/samriddhi.sinha", github: "https://github.com/" },
  { id: 10, name: "Arnab Mandal", role: "Social Media Head", image: "/team/Arnab.jpeg", linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/sampad.ghosh", github: "https://github.com/" },
  { id: 11, name: "Ashish R. Das", role: "Tech Lead", image: "/team/Ashish.jpeg", linkedin: "https://linkedin.com/in/arddev", instagram: "https://instagram.com/ashishh_rd_", github: "https://github.com/0day-Ashish" },
  { id: 12, name: "Subham Karmakar", role: "Tech Support", image: "/team/Subham.jpeg", linkedin: "https://linkedin.com/in/subham12r", instagram: "https://instagram.com/5ubhamkarmakar", github: "https://github.com/subham12r" },
  { id: 13, name: "Abhisekh Singh", role: "App Development", image: "/team/Abhishek.jpg", linkedin: "https://linkedin.com/in/abhisekhsingh", instagram: "https://instagram.com/abhisekhsingh", github: "https://github.com/abhisekhsingh" },
  { id: 14, name: "Garima Roy", role: "Documentations Lead", image: "/team/Garima.jpeg", linkedin: "https://linkedin.com/in/garima-roy-032277290", instagram: "https://instagram.com/_garimaa.07_", github: "https://github.com/" },
  { id: 15, name: "Leeza Bhowal", role: "Design Lead", image: "/team/Leeza.jpg", linkedin: "https://linkedin.com/in/leeza-bhowal-2b2990291/", instagram: "https://instagram.com/leeza.bhowal", github: "https://github.com/" },
  { id: 16, name: "Srijita Bera", role: "Marketing Lead", image: "/team/Srijita.jpeg", linkedin: "https://linkedin.com/in/srijita-bera-ab5578291/", instagram: "https://instagram.com/veilof_mist", github: "https://github.com/Srijiiii" },
  { id: 17, name: "Keshav Maheshwari", role: "Execution Cell", image: "/avatar9.jpg", linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/keshav.maheshwari", github: "https://github.com/" },
  { id: 18, name: "Sampad Ghosh", role: "Execution Cell", image: "/avatar8.jpg", linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/sampad.ghosh", github: "https://github.com/" },
  // { id: 9, name: "Sudipto Barman", role: "Ex Support", image: "/team/Sudipto.jpg", linkedin:" https://linkedin.com/in/sudipto-barman-3b5b4b3b5/", instagram:" https://instagram.com/sudipto.barman" , github:" https://github.com/sudiptobarman" },
  // { id: 19, name:"Titas Sarkar" , role:"Ex Support" , image:"/team/Titas.jpg"},
  // { id: 15, name: "Somnath Singha Roy", role: "Ex Support", image: "/1.jpg" },
];

export default function Team() {
  const marqueeMembers = [...TEAM_MEMBERS, ...TEAM_MEMBERS];
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const directionRef = useRef(-1);
  const pausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const updateSingleSetWidth = () => {
      if (!trackRef.current) return;
      singleSetWidthRef.current = trackRef.current.scrollWidth / 2;
    };

    updateSingleSetWidth();
    window.addEventListener("resize", updateSingleSetWidth);

    const step = () => {
      if (trackRef.current && !pausedRef.current && singleSetWidthRef.current > 0) {
        offsetRef.current += directionRef.current * 0.8;

        if (offsetRef.current <= -singleSetWidthRef.current) {
          offsetRef.current += singleSetWidthRef.current;
        } else if (offsetRef.current > 0) {
          offsetRef.current -= singleSetWidthRef.current;
        }

        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", updateSingleSetWidth);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const nudgeByCards = (cards: number) => {
    if (!singleSetWidthRef.current) return;
    const step = 296; // card width + gap
    offsetRef.current += cards * step;

    while (offsetRef.current <= -singleSetWidthRef.current) {
      offsetRef.current += singleSetWidthRef.current;
    }
    while (offsetRef.current > 0) {
      offsetRef.current -= singleSetWidthRef.current;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setIsPaused(next);
  };

  return (
    <section className="w-full bg-black py-3">
      <div className="mx-3 rounded-[2.5rem] border-4 border-black bg-[#f3e5f5] px-5 py-8 sm:px-8 md:px-12">
        <div className="text-center">
          <h2 className={`${gilton.className} text-4xl font-black uppercase tracking-[0.08em] text-black sm:text-6xl`}>Signifiya Team</h2>
          <p className={`${softura.className} text-lg  `}>The people who made Signifiya possible</p>
        </div>

        <div className="mt-7 rounded-[2rem]  p-4 sm:p-6">
          <div className="mb-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => nudgeByCards(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#ffe45e] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label="Show previous cards"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={togglePause}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label={isPaused ? "Play marquee" : "Pause marquee"}
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => nudgeByCards(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#7dc8ff] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label="Show next cards"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="team-cards-marquee">
            <div ref={trackRef} className="team-cards-track pb-10">
              {marqueeMembers.map((member, idx) => (
                <article
                  key={`${member.id}-${idx}`}
                  className="w-[300px] shrink-0 rounded-2xl border-4 border-black bg-[#fffaf0] p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="relative mb-3 overflow-hidden rounded-xl border-4 border-black">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={400}
                      height={280}
                      className="h-52 w-full object-cover"
                    />
          
                  </div>

                  <h4 className="text-xl font-black leading-tight text-black">{member.name}</h4>
                  <p className="inline-block text-sm font-black italic font-medium tracking-tighter text-black">
                    {member.role}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} GitHub`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      >
                        <GithubIcon className="h-4 w-4 text-black" />
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} Instagram`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#ff8ecf] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      >
                        <InstagramIcon className="h-4 w-4 text-black" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#7dc8ff] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      >
                        <LinkedinIcon className="h-4 w-4 text-black" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .team-cards-marquee {
          overflow: hidden;
          width: 100%;
        }

        .team-cards-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
