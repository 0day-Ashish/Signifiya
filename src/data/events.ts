import { APP_CONFIG } from "@/config/app.config";

// ============================================================
// SINGLE SOURCE OF TRUTH FOR ALL EVENT DATA
// ============================================================
// Update events HERE. Both the schedule page and events section
// on the homepage will automatically stay in sync.
// ============================================================

/**
 * Master event definition containing all fields needed by
 * both the schedule page and the events listing section.
 */
export type MasterEvent = {
  id: number;
  title: string;
  /** Override title for events section (if different from schedule title) */
  eventTitle?: string;
  category: string;
  /** Department badge on schedule (defaults to category if not set) */
  department?: string;
  /** Short description for events card */
  description: string;
  /** Longer description for schedule page (falls back to description) */
  scheduleDescription?: string;
  date: string;
  image: string;
  /** Separate image for the schedule page (falls back to image) */
  scheduleImage?: string;
  prizePool: string;
  // --- Schedule-specific fields (omit to exclude from schedule) ---
  day?: 1 | 2;
  time?: string;
  venue?: string;
  coordinators?: string;
  facultyCoordinators?: string;
  lottie?: string;
  color?: string;
};

// ============================================================
// MASTER EVENT LIST
// ============================================================
// Events with a `day` field appear in the schedule page.
// ALL events appear in the events listing section.
// ============================================================

export const ALL_EVENTS: MasterEvent[] = [
  // ─── DAY 1 EVENTS (MARCH 27TH) ──────────────────────────

  {
    id: 1,
    title: "Valorant Tournament",
    category: "ESPORTS",
    department: "E-Sports",
    description:
      "Precise gunplay with agent abilities with smart strategy and perfect coordination to secure victory.",
    scheduleDescription:
      "Assemble your squad and compete in the ultimate tactical FPS showdown.",
    date: "March 27th",
    image: "/valorant.jpg",
    prizePool: "₹30,000",
    day: 1,
    time: "12:00 PM - 7:00 PM",
    venue: "Swami Vivekananda Hall",
    coordinators: "Hrittima Sen",
    facultyCoordinators: "Ayushman Bilash Thakur",
    lottie:
      "https://lottie.host/5ef860f5-4e24-4a99-aae2-37cd4f5e9c5d/bFScJO6mZd.lottie",
    color: "bg-gray-100",
  },
  {
    id: 2,
    title: "Free Fire",
    category: "ESPORTS",
    department: "E-Sports",
    description:
      "Survive till the end in this action-packed battle royale tournament.",
    scheduleDescription:
      "Survive the shrinking battlefield, outsmart opponents, and be the last squad standing.",
    date: "March 27th",
    image: "/freefire.jpg",
    prizePool: "₹20,000",
    day: 1,
    time: "1:30 PM - 7:00 PM",
    venue: "APJ Abdul Kalam Convention Hall",
    coordinators: "Anis Imtahan Nayan",
    facultyCoordinators: "Ayushman Bilash Thakur",
    lottie:
      "https://lottie.host/34b5f811-28e8-4ac1-9f7a-7857fb6cbb50/C28AMF6Pa6.lottie",
    color: "bg-gray-100",
  },
  {
    id: 3,
    title: "Coding Premier League",
    eventTitle: "CODING PREMIER LEAGUE",
    category: "CSE",
    department: "CSE (Tech)",
    description:
      "Teams battle through algorithmic challenges to prove their speed, logic, and coding mastery.",
    scheduleDescription:
      "An exhilarating coding competition where participants showcase their programming skills, problem-solving abilities, and creativity.",
    date: "March 27th",
    image: "/cse2.jpg",
    prizePool: "₹6,000",
    day: 1,
    time: "1:00 PM - 4:00 PM",
    venue: "Lab 2102 & 2103",
    coordinators: "Sourish Samantha",
    facultyCoordinators: "Bodhi Chakraborty, Debdutta Pal",
    lottie:
      "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
    color: "bg-purple-100",
  },
  {
    id: 4,
    title: "Refab",
    eventTitle: "RE-FAB (Waste to Wealth)",
    category: "MECHANICAL",
    department: "Mechanical (Tech)",
    description:
      "Participants transform scrap materials into innovative, functional prototypes with suitable design.",
    scheduleDescription:
      "Innovate and create useful products from waste materials. Show how mechanical engineering can drive sustainability.",
    date: "March 27th",
    image: "/mechanical1.jpg",
    prizePool: "₹5,000",
    day: 1,
    time: "1:00 PM - 3:00 PM",
    venue: "SOET 3304",
    coordinators: "Barun Jana",
    facultyCoordinators: "Tirupataiah Kasani, Ashish Khaira",
    lottie:
      "https://lottie.host/85932f49-c3cd-4483-ae12-6ddcc8e7cc34/b0nR37lbph.lottie",
    color: "bg-green-100",
  },
  {
    id: 5,
    title: "Path Follower",
    category: "ROBOTICS",
    department: "Robotics (Tech)",
    description:
      "Autonomous bots must navigate a complex, winding track with speed and pinpoint accuracy.",
    scheduleDescription:
      "Design an autonomous bot capable of following a complex black line path in the shortest time possible.",
    date: "March 27th",
    image: "/robotics2.jpg",
    prizePool: "₹5,000",
    day: 1,
    time: "1:00 PM - 4:00 PM",
    venue: "SOET 3103",
    coordinators: "Sumanto Roy",
    facultyCoordinators: "Rupanwita Das Mahapatra",
    lottie:
      "https://lottie.host/927b9dd7-f2e5-471e-b14e-6d7402af9a9e/wzqLaYST4c.lottie",
    color: "bg-red-100",
  },
  {
    id: 6,
    title: "Bridge Building",
    eventTitle: "BRIDGE BUILDING",
    category: "CIVIL",
    department: "Civil (Tech)",
    description:
      "Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.",
    scheduleDescription:
      "Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.",
    date: "March 27th",
    image: "/civil2.jpg",
    prizePool: "₹3,000",
    day: 1,
    time: "1:00 PM - 4:00 PM",
    venue: "SOET 5003",
    coordinators: "Toufik Islam",
    facultyCoordinators: "Hasim Sir, Apurba Pal",
    lottie: "",
    color: "bg-orange-100",
  },
  {
    id: 7,
    title: "Electrifying Circuits",
    eventTitle: "ELECTRIFYING CIRCUITS",
    category: "EEE",
    department: "EEE (Tech)",
    description:
      "Students race against the clock to design, build, and troubleshoot complex circuits.",
    scheduleDescription:
      "Test your knowledge of circuits and electronics in this electrifying showdown designed for the brightest minds in EEE.",
    date: "March 27th",
    image: "/eee.jpg",
    prizePool: "₹6,000",
    day: 1,
    time: "1:00 PM - 7:00 PM",
    venue: "SOET 5204",
    coordinators: "Suraj Rana, Somnath Singha Roy",
    facultyCoordinators: "Nihar Karmakar, Jeet Banerjee",
    lottie:
      "https://lottie.host/d4daf38b-2ffb-483d-b524-967a221f540e/okSpmUrCF7.lottie",
    color: "bg-yellow-100",
  },
  {
    id: 8,
    title: "Dance Battle",
    category: "NON-TECH",
    department: "Non-Tech",
    description:
      "Rhythm, style, and attitude collide, bring your best moves, own the stage, and outshine the competition.",
    scheduleDescription:
      "Bring your best moves and own the stage in this electrifying dance battle!",
    date: "March 27th",
    image: "/dance-battle.jpg",
    prizePool: "₹7,000",
    day: 1,
    time: "3:00 PM - 7:00 PM",
    venue: "Basketball Court",
    coordinators: "Asmita Ghosh, Aditya Vrdhan",
    facultyCoordinators: "Anusuya Bera",
    lottie:
      "https://lottie.host/8597f901-e7be-4086-9f99-317c1b123a0a/TtUunogZHF.lottie",
    color: "bg-fuchsia-100",
  },
  {
    id: 9,
    title: "Arm Wrestling",
    category: "NON-TECH",
    department: "Non-Tech",
    description:
      "Lock hands, hold your ground, and power through to pin your opponent down.",
    scheduleDescription:
      "Lock hands, hold your ground, and power through to pin your opponent down. Weight categories will lie between: 60kgs - 90kgs+.",
    date: "March 27th",
    image: "/non-tech1.jpg",
    prizePool: "₹3,000",
    day: 1,
    time: "12:30 PM - 3:00 PM",
    venue: "Canopy Area",
    coordinators: "Digant Mishra, Subhangkar Barui",
    facultyCoordinators: "Bishal Mondal",
    lottie:
      "https://lottie.host/34b5f811-28e8-4ac1-9f7a-7857fb6cbb50/C28AMF6Pa6.lottie",
    color: "bg-gray-100",
  },

  // ─── DAY 2 EVENTS (MARCH 28TH) ──────────────────────────

  {
    id: 10,
    title: "Power Deal",
    category: "NON-TECH",
    department: "Non-Tech",
    description:
      "Test your negotiating skills and business acumen in this exciting challenge.",
    scheduleDescription:
      "Negotiate, strategize, and close the best deals in this high-energy business simulation challenge.",
    date: "March 28th",
    image: "/powerdeal.jpg",
    prizePool: "₹3,000",
    day: 2,
    time: "9:30 AM - 1:00 PM",
    venue: "Rabindranath Tagore Auditorium",
    coordinators: "Preyashee Saha",
    facultyCoordinators: "Soodipa Chakraborty",
    lottie: "",
    color: "bg-cyan-100",
  },
  {
    id: 11,
    title: "Lathe War",
    category: "MECHANICAL",
    department: "Mechanical (Tech)",
    description:
      "Participants face off to machine raw materials into perfect components with speed and surgical accuracy.",
    scheduleDescription:
      "A battle of precision turning. Machine the perfect component on the lathe within the given tolerance.",
    date: "March 28th",
    image: "/lathe-war.jpg",
    prizePool: "₹5,000",
    day: 2,
    time: "10:00 AM - 3:00 PM",
    venue: "Workshop",
    coordinators: "Soumen Samanta",
    facultyCoordinators: "Dr. Nataraj Mishra, Dr. Nitesh Kumar",
    lottie:
      "https://lottie.host/84997780-9072-40eb-bf3c-b02910fa01ef/C7GW3im1LR.lottie",
    color: "bg-indigo-100",
  },
  {
    id: 12,
    title: "Dil Se Design",
    category: "CSE",
    department: "CSE (Tech)",
    description:
      "A UI/UX challenge to craft intuitive, beautiful, and user-centered digital experiences.",
    scheduleDescription:
      "Unleash your UI/UX creativity. Design interfaces that speak to the user's heart.",
    date: "March 28th",
    image: "/cse1.jpg",
    prizePool: "₹3,000",
    day: 2,
    time: "10:00 AM - 2:00 PM",
    venue: "SOET 2103",
    coordinators: "Baibhab Adhikari",
    facultyCoordinators: "Toufique Ahammad Gazi",
    lottie:
      "https://lottie.host/a593ed4c-830c-414a-a362-aa96c695fa40/xrcW0oe0cK.lottie",
    color: "bg-pink-100",
  },
  {
    id: 13,
    title: "Tower Making",
    category: "CIVIL",
    department: "Civil (Tech)",
    description:
      "Build the tallest, strongest tower using creativity, strategy, and skill.",
    scheduleDescription:
      "Construct the tallest and most stable tower using limited resources. A test of structural engineering and patience.",
    date: "March 28th",
    image: "/civil1.jpg",
    prizePool: "₹3,000",
    day: 2,
    time: "10:00 AM - 1:00 PM",
    venue: "SOET 5003",
    coordinators: "Arka Gain",
    facultyCoordinators: "Shantanu Haldar, Argha Kamal Guha",
    lottie:
      "https://lottie.host/2a0c41bc-2fb9-40e3-b13d-8b721a0abde8/20tioOZNVd.lottie",
    color: "bg-blue-100",
  },
  {
    id: 14,
    title: "Robo Terrain (Robo Soccer)",
    eventTitle: "ROBO TERRAIN (ROBO SOCCER)",
    category: "ROBOTICS",
    department: "Robotics (Tech)",
    description:
      "Custom built bots must navigate a grueling obstacle course of mud, sand, and steep inclines.",
    scheduleDescription:
      "Navigate your bot through rough and uneven terrains without getting stuck or toppling over.",
    date: "March 28th",
    image: "/robotics1.jpg",
    prizePool: "₹5,000",
    day: 2,
    time: "10:00 AM - 1:00 PM",
    venue: "SOET 3101",
    coordinators: "Anurag Biswas",
    facultyCoordinators: "Rupanwita Das Mahapatra",
    lottie:
      "https://lottie.host/8fe04dad-d3fa-4254-93b7-304f52d3c857/yxrz9HKunG.lottie",
    color: "bg-teal-100",
  },
  {
    id: 15,
    title: "BGMI",
    category: "ESPORTS",
    department: "E-Sports",
    description:
      "Drop in, gear up, and fight through intense combat zones to be the last team standing.",
    scheduleDescription:
      "Drop in, gear up, and fight through intense combat zones to be the last team standing.",
    date: "March 28th",
    image: "/bgmi-01.jpg",
    prizePool: "₹40,000",
    day: 2,
    time: "10:00 AM - 4:00 PM",
    venue: "APJ Abdul Kalam Convention Hall",
    coordinators: "Anubrata Sadukhan",
    facultyCoordinators: "Ayushman Bilash Thakur",
    lottie:
      "https://lottie.host/7f2fbfd9-2f59-458a-bd35-5aa6133f3dc7/5yLGpgvIme.lottie",
    color: "bg-gray-100",
  },
  {
    id: 16,
    title: "E-Football",
    eventTitle: "E-FOOTBALL",
    category: "ESPORTS",
    department: "E-Sports",
    description: "Compete in the ultimate virtual football tournament.",
    scheduleDescription:
      "Master the pitch, command your squad, and score your way to glory.",
    date: "March 28th",
    image: "/efootbal.jpg",
    prizePool: "₹20,000",
    day: 2,
    time: "10:00 AM - 4:00 PM",
    venue: "Vivekananda Seminar Hall",
    coordinators: "Reyansh Dalui",
    facultyCoordinators: "Ayushman Bilash Thakur",
    lottie:
      "https://lottie.host/34b5f811-28e8-4ac1-9f7a-7857fb6cbb50/C28AMF6Pa6.lottie",
    color: "bg-gray-100",
  },
  {
    id: 17,
    title: "Treasure Hunt",
    category: "NON-TECH",
    department: "Non-Tech",
    description:
      "Solve puzzles, race against time, and uncover the hidden prize.",
    scheduleDescription:
      "Solve puzzles, race against time, and uncover the hidden prize across Adamas Campus.",
    date: "March 28th",
    image: "/treasure-hunt.jpg",
    prizePool: "₹5,555",
    day: 2,
    time: "2:00 PM - 5:00 PM",
    venue: "Adamas Campus",
    coordinators: "Arijit De, Garima Roy",
    facultyCoordinators: "Koushik Mukhopadhyay",
    lottie:
      "https://lottie.host/1846995a-7c92-4f8b-b524-cf6bcccd25a0/3ZauGqPRGA.lottie",
    color: "bg-gray-100",
  },
  {
    id: 18,
    title: "Rap Battle",
    category: "NON-TECH",
    department: "Non-Tech",
    description:
      "Rhythm & wordplay collide, drop sharp bars, own the mic, and outflow your opponent.",
    scheduleDescription:
      "Rhythm & wordplay collide in this electrifying rap battle. Drop sharp bars, own the mic, and outflow your opponent with clever lyrics and flow.",
    date: "March 28th",
    image: "/rap-battle.jpg",
    scheduleImage: "/rap-battle.jpg",
    prizePool: "₹3,000",
    day: 2,
    time: "3:00 PM - 5:00 PM",
    venue: "Canopy Area",
    coordinators: "Mrinal Sahoo, Arnab Mondal",
    facultyCoordinators: "Saheb Adhikary",
    lottie:
      "https://lottie.host/ce13941b-540c-4118-9e80-ff8ceb9afa1d/bsOQBQ1ZGm.lottie",
    color: "bg-fuchsia-100",
  },
];

// ============================================================
// DERIVED DATA HELPERS
// ============================================================

/** Schedule event item type (used by schedule page) */
export type ScheduleEventItem = {
  id: number;
  title: string;
  department: string;
  description: string;
  time: string;
  venue: string;
  coordinators: string;
  facultyCoordinators: string;
  image1: string;
  lottie: string;
  color: string;
};

/** Day data for schedule page */
export type DayData = {
  day: string;
  date: string;
  items: ScheduleEventItem[];
};

/** Derive schedule data (Day 1 & Day 2) from master events */
export function getScheduleData(): DayData[] {
  const toScheduleItem = (e: MasterEvent): ScheduleEventItem => ({
    id: e.id,
    title: e.title,
    department: e.department || e.category,
    description: e.scheduleDescription || e.description,
    time: e.time || "",
    venue: e.venue || "",
    coordinators: e.coordinators || "",
    facultyCoordinators: e.facultyCoordinators || "",
    image1: e.scheduleImage || e.image,
    lottie: e.lottie || "",
    color: e.color || "bg-white",
  });

  const day1 = ALL_EVENTS.filter((e) => e.day === 1).map(toScheduleItem);
  const day2 = ALL_EVENTS.filter((e) => e.day === 2).map(toScheduleItem);

  return [
    { day: "Day 1", date: APP_CONFIG.event.dates.day1, items: day1 },
    { day: "Day 2", date: APP_CONFIG.event.dates.day2, items: day2 },
  ];
}

/** Events listing item type (used by events section on homepage) */
export type EventListingItem = {
  id: number;
  category: string;
  title: string;
  date: string;
  description: string;
  image: string;
  prizePool: string;
  price?: number;
};

/** Derive events listing data from master events */
export function getEventsListingData(): EventListingItem[] {
  // Prices for events by exact title (fallback to 0 if missing)
  const PRICE_BY_TITLE: Record<string, number> = {
    "Valorant Tournament": 499,
    "Free Fire": 399,
    "Coding Premier League": 280,
    "Refab": 280,
    "Path Follower": 219,
    "Bridge Building": 280,
    "Dance Battle": 200,
    "Arm Wrestling": 100,
    "BGMI": 399,
    "E-Football": 149,
    "Electrifying Circuits": 299,
    "Tower Making": 280,
    "Dil Se Design": 219,
    "Lathe War": 219,
    "Robo Terrain (Robo Soccer)": 219,
    "Rap Battle": 149,
    "Treasure Hunt": 300,
    "Power Deal": 149,
  };
  return ALL_EVENTS.map((e) => ({
    id: e.id,
    category: e.category,
    title: (e.eventTitle || e.title).toUpperCase(),
    date: e.date,
    description: e.description,
    image: e.image,
    prizePool: e.prizePool,
    price: PRICE_BY_TITLE[e.title] ?? 0,
  }));
}

/**
 * Mapping from events listing title to schedule event ID.
 * Used for "View Details" links that navigate to the schedule page.
 */
export function getEventTitleToScheduleId(): Record<string, number> {
  return Object.fromEntries(
    ALL_EVENTS.filter((e) => e.day != null).map((e) => [
      (e.eventTitle || e.title).toUpperCase(),
      e.id,
    ]),
  );
}
