"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  Globe,
  Pause,
  Play,
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
  website?: string;
};
const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Mr. Nisarga Chand",
    role: "Faculty Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Nisarga.jpeg",
    linkedin: "https://www.linkedin.com/in/nisarga-chand-48634667/",
    instagram: "https://www.instagram.com/nisarga_chand/",
  },
  {
    id: 2,
    name: "Ms. Soodipa Chakraborty",
    role: "Faculty Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Soodipa.jpg",
    linkedin: "https://www.linkedin.com/in/soodipachakraborty/",
    instagram: "https://www.instagram.com/soodipa_c",
  },
  {
    id: 21,
    name: " Dr. Soumitra Roy",
    role: "Faculty Lead",
    image: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/SR.jpg",
    linkedin: "https://www.linkedin.com/in/soumitra-roy-8987b91a/",
  },
  {
    id: 3,
    name: "Mr. Prabhat Das",
    role: "Tech Mentor",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Prabhat.jpg",
    linkedin: "https://www.linkedin.com/in/prabhatd/",
    github: "https://github.com/prabhatdash/",
  },
  {
    id: 4,
    name: "Mr. Ayushman Bilas Thakur",
    role: "Tech Mentor",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Ayushman.jpeg",
    linkedin: "https://www.linkedin.com/in/ayushmanbt/",
    github: "https://github.com/ayushmanbilas",
  },
  {
    id: 4,
    name: "Hrishav Dey",
    role: "Event Advisor",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/hrishav.jpeg",
    linkedin: "https://www.linkedin.com/in/hrishav-dey-60a8292aa",
    instagram: "https://www.instagram.com/hrishav_02?igsh=bHI5ZWE4OHc2YTY3",
  },
  {
    id: 5,
    name: "Digant Mishra",
    role: "Administration Head",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Digant.jpeg",
    linkedin: "https://www.linkedin.com/in/digant-m-a325b61a4",
    instagram: "https://www.instagram.com/digantt._?igsh=YTZmZTUwcTkxaXp5",
    github: "https://github.com/diggu92",
  },
  {
    id: 6,
    name: "Arijit De",
    role: "Finance & Sponsorship Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Arijit.jpg",
    linkedin: "https://www.linkedin.com/in/arijit-de-ba1594358",
    instagram: "https://instagram.com/arijit_.04",
  },
  {
    id: 7,
    name: "Siddartha Chakraborty",
    role: "Esports Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Siddharth-01.jpeg",
    linkedin: "https://linkedin.com/in/siddarthachakraborty/",
    instagram: "https://instagram.com/siddarthachk",
    github: "https://github.com/siddarthachk",
  },
  {
    id: 22,
    name: "Preyashee Saha",
    role: "PR Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/preyashee.jpeg",
    linkedin:
      "https://www.linkedin.com/in/preyashee-saha-a790ba290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    instagram:
      "https://www.instagram.com/prayaaa.06?igsh=eDFsMnNzZWc0aXU0&utm_source=qr",
  },
  {
    id: 8,
    name: "Snehasish Mondal",
    role: "Operations Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Snehasish.jpg",
    linkedin: "https://www.linkedin.com/in/snehasish-mondal",
    instagram: "https://instagram.com/sn3hasishhhhh",
    github: "https://github.com/Snehasish321",
  },
  {
    id: 9,
    name: "Samriddhi Sinha",
    role: "Decorations Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/samriddhi.jpg",
    linkedin: "https://www.linkedin.com/in/samriddhi-sinha-555768280",
    instagram:
      "https://www.instagram.com/samriddhibelike_?igsh=bGczcmY5NGFydTA2",
    github: "https://github.com/Samriddhie",
  },
  {
    id: 10,
    name: "Arnab Mandal",
    role: "Social Media Head",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Arnab.jpeg",
    linkedin: "https://www.linkedin.com/in/arnab-mandal-4b61151a1",
    instagram: "https://instagram.com/arna4b",
    github: "https://github.com/arnaabh",
  },
  {
    id: 11,
    name: "Ashish R. Das",
    role: "Tech Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Ashish.jpg",
    linkedin: "https://linkedin.com/in/arddev",
    instagram: "https://instagram.com/ashishh_rd_",
    github: "https://github.com/0day-Ashish",
    website: "https://arddev.in",
  },
  {
    id: 12,
    name: "Subham Karmakar",
    role: "Web Dev Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Subham.jpeg",
    linkedin: "https://linkedin.com/in/subham12r",
    instagram: "https://instagram.com/5ubhamkarmakar",
    github: "https://github.com/subham12r",
    website: "https://subham12r.me",
  },
  {
    id: 13,
    name: "Abhisekh Singh",
    role: "App Dev Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Abhishek.jpg",
    linkedin: "https://www.linkedin.com/in/abhi3hekk",
    instagram: "https://instagram.com/abhi3hekk",
    github: "https://github.com/AbhishekS04",
    website: "https://www.abhisheksingh.tech/",
  },
  {
    id: 14,
    name: "Garima Roy",
    role: "Documentations Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Garima.jpeg",
    linkedin: "https://www.linkedin.com/in/garima-roy-032277290/",
    instagram: "https://instagram.com/_garimaa.07_",
    github: "https://github.com/Groy416",
  },
  {
    id: 15,
    name: "Leeza Bhowal",
    role: "Design Lead",
    image: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Leeza.jpg",
    linkedin: "https://in.linkedin.com/in/leeza-bhowal",
    instagram: "https://instagram.com/leeza_bhowal",
  },
  {
    id: 16,
    name: "Srijita Bera",
    role: "Marketing Lead",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Srijita.jpeg",
    linkedin: "https://linkedin.com/in/srijita-bera-ab5578291/",
    instagram: "https://instagram.com/veilof_mist",
    github: "https://github.com/Srijiiii",
  },
  // { id: 17, name: "Keshav Maheshwari", role: "Execution Cell", image: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/keshav.jpeg", linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/keshav.maheshwari", github: "https://github.com/" },
  // { id: 18, name: "Sampad Ghosh", role: "Execution Cell", image: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/sampad.jpeg", linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/sampad.ghosh", github: "https://github.com/" },
  {
    id: 22,
    name: "Sudipto Barman",
    role: "Ex Support",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/sudipto.jpeg",
    linkedin: " https://linkedin.com/in/sudipto-barman-3b5b4b3b5/",
    instagram: " https://instagram.com/sudipto.barman",
    github: " https://github.com/sudiptobarman",
  },
  {
    id: 17,
    name: "Titas Sarkar",
    role: "Ex Support",
    image: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Titas.jpg",
    linkedin: "https://www.linkedin.com/in/titas-sarkar-7b0978343/",
    instagram: "https://instagram.com/t.i.t.a.s",
    github: "https://github.com/titas841-web",
  },
  {
    id: 18,
    name: "Sayan Mukherjee",
    role: "App Development",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Sayan.jpeg",
    linkedin: "https://www.linkedin.com/in/sayan-mukherjee-258751356",
    instagram: "https://www.instagram.com/sa.yan1047",
    github: "https://github.com/Sani05M",
  },
  {
    id: 19,
    name: "Tushar Kanti Dey",
    role: "App Development",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/Tushar.jpg",
    linkedin: "https://www.linkedin.com/in/tushardevx01",
    instagram: "https://www.instagram.com/tushardevx01",
    github: "https://github.com/Tusharxhub",
  },
  {
    id: 20,
    name: "Somnath Singha Roy",
    role: "Ex Support",
    image:
      "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/team/somnath.jpeg",
    linkedin: "https://www.linkedin.com/in/somnath-singha-roy/",
  },
];

function TeamMemberImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative mb-3 overflow-hidden rounded-xl border-4 border-black bg-zinc-200 h-52">
      {!loaded && (
        <div className="absolute inset-0 z-10 bg-zinc-300 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.4s_infinite]" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={400}
        height={280}
        className={`h-52 w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function Team() {
  const marqueeMembers = [...TEAM_MEMBERS, ...TEAM_MEMBERS];
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const directionRef = useRef(-1);
  const pausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const wasPausedBeforeDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const updateSingleSetWidth = () => {
      if (!trackRef.current) return;
      singleSetWidthRef.current = trackRef.current.scrollWidth / 2;
    };

    updateSingleSetWidth();
    window.addEventListener("resize", updateSingleSetWidth);

    const step = () => {
      if (
        trackRef.current &&
        !pausedRef.current &&
        singleSetWidthRef.current > 0
      ) {
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
    if (!singleSetWidthRef.current || !trackRef.current) return;
    const firstCard = trackRef.current.querySelector("article");
    const cardWidth =
      firstCard instanceof HTMLElement ? firstCard.offsetWidth : 260;
    const trackStyle = window.getComputedStyle(trackRef.current);
    const gap =
      parseFloat(trackStyle.columnGap || trackStyle.gap || "12") || 12;
    const step = cardWidth + gap;
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

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    // If the user clicked a link or a button, let the browser handle it normally
    const target = event.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }

    isDraggingRef.current = true;
    wasPausedBeforeDragRef.current = pausedRef.current;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    pausedRef.current = true;
    setIsPaused(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !isDraggingRef.current ||
      !trackRef.current ||
      !singleSetWidthRef.current
    )
      return;

    const deltaX = event.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current + deltaX;

    while (offsetRef.current <= -singleSetWidthRef.current) {
      offsetRef.current += singleSetWidthRef.current;
    }
    while (offsetRef.current > 0) {
      offsetRef.current -= singleSetWidthRef.current;
    }

    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    pausedRef.current = wasPausedBeforeDragRef.current;
    setIsPaused(wasPausedBeforeDragRef.current);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section className="w-full bg-black pb-3">
      <div className=" rounded-[2.5rem] border-4 border-black bg-[#f3e5f5] px-4 py-8 sm:px-8 md:px-12">
        <div className="text-center">
          <h2
            className={`${gilton.className} text-4xl font-black uppercase tracking-[0.08em] text-black sm:text-6xl`}
          >
            Signifiya Team
          </h2>
          <p className={`${softura.className} text-lg  `}>
            The people who made Signifiya possible
          </p>
        </div>

        <div className="mt-4 rounded-[2rem] p-3 sm:mt-7 sm:p-6">
          <div className="mb-3 flex justify-end gap-2 sm:mb-4">
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
              {isPaused ? (
                <Play className="h-5 w-5" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
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

          <div
            ref={marqueeRef}
            className="team-cards-marquee"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div ref={trackRef} className="team-cards-track pb-6 sm:pb-10">
              {marqueeMembers.map((member, idx) => (
                <article
                  key={`${member.id}-${idx}`}
                  className="w-[min(82vw,250px)] sm:w-[300px] shrink-0 rounded-2xl border-4 border-black bg-[#fffaf0] p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  <TeamMemberImage src={member.image} alt={member.name} />

                  <h4 className="text-xl font-black leading-tight text-black">
                    {member.name}
                  </h4>
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
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} Website`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#c7f9d8] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      >
                        <Globe className="h-4 w-4 text-black" />
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
          touch-action: pan-y;
          cursor: grab;
        }

        .team-cards-marquee:active {
          cursor: grabbing;
        }

        .team-cards-track {
          display: flex;
          gap: 0.75rem;
          width: max-content;
          will-change: transform;
          user-select: none;
        }

        @media (min-width: 640px) {
          .team-cards-track {
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
