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
  // ─── DAY 1 EVENTS ────────────────────────────────────────
  {
    id: 1,
    title: "Coding Premier League",
    eventTitle: "CODING PREMIERE LEAGUE",
    category: "CSE",
    department: "CSE",
    description:
      "Teams battle through algorithmic challenges to prove their speed, logic, and coding mastery.",
    scheduleDescription:
      "An exhilarating coding competition where participants showcase their programming skills, problem-solving abilities, and creativity.",
    date: "March 13th - 14th",
    image: "/cse2.jpg",
    prizePool: "\u20B925,000",
    day: 1,
    time: "10:00 AM - 1:00 PM",
    venue: "Computer Lab A",
    coordinators: "Aviroop Pal, Sourish Samanta",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
    color: "bg-purple-100",
  },
  {
    id: 2,
    title: "Electrifying Circuit",
    category: "EEE",
    department: "EEE",
    description:
      "Students race against the clock to design, build, and troubleshoot complex circuits.",
    scheduleDescription:
      "Test your knowledge of circuits and electronics in this electrifying showdown designed for the brightest minds in EEE.",
    date: "March 13th - 14th",
    image: "/eee.jpg",
    prizePool: "TBA",
    day: 1,
    time: "11:00 AM - 2:00 PM",
    venue: "Electrical Workshop",
    coordinators: "",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/d4daf38b-2ffb-483d-b524-967a221f540e/okSpmUrCF7.lottie",
    color: "bg-yellow-100",
  },
  {
    id: 3,
    title: "Tower Making",
    category: "CIVIL",
    department: "Civil",
    description:
      "Build the tallest, strongest tower using creativity, strategy, and skill.",
    scheduleDescription:
      "Construct the tallest and most stable tower using limited resources. A test of structural engineering and patience.",
    date: "March 13th - 14th",
    image: "/civil1.jpg",
    prizePool: "TBA",
    day: 1,
    time: "2:00 PM - 4:00 PM",
    venue: "Civil Block Lawn",
    coordinators: "Ashish Yadav",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/02005934-206e-445a-b62d-045339304381/Construction.lottie",
    color: "bg-blue-100",
  },
  {
    id: 4,
    title: "Waste to Wealth",
    eventTitle: "RE-FAB",
    category: "MECHANICAL",
    department: "Mechanical",
    description:
      "Participants transform scrap materials into innovative, functional prototypes with suitable design.",
    scheduleDescription:
      "Innovate and create useful products from waste materials. Show how mechanical engineering can drive sustainability.",
    date: "March 13th - 14th",
    image: "/mechanical1.jpg",
    prizePool: "TBA",
    day: 1,
    time: "10:00 AM - 12:00 PM",
    venue: "Workshop Hall",
    coordinators: "Aritro Chakrabarty",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/85932f49-c3cd-4483-ae12-6ddcc8e7cc34/b0nR37lbph.lottie",
    color: "bg-green-100",
  },
  {
    id: 5,
    title: "Path Follower",
    category: "ROBOTICS",
    department: "Robotics",
    description:
      "Autonomous bots must navigate a complex, winding track with speed and pinpoint accuracy.",
    scheduleDescription:
      "Design an autonomous bot capable of following a complex black line path in the shortest time possible.",
    date: "March 13th - 14th",
    image: "/robotics2.jpg",
    prizePool: "TBA",
    day: 1,
    time: "3:00 PM - 5:00 PM",
    venue: "Main Audi",
    coordinators: "Sumanto",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/927b9dd7-f2e5-471e-b14e-6d7402af9a9e/wzqLaYST4c.lottie",
    color: "bg-red-100",
  },

  // ─── DAY 2 EVENTS ────────────────────────────────────────
  {
    id: 6,
    title: "Dil Se Design",
    category: "CSE",
    department: "CSE",
    description:
      "A UI/UX challenge to craft intuitive, beautiful, and user-centered digital experiences.",
    scheduleDescription:
      "Unleash your UI/UX creativity. Design interfaces that speak to the user's heart.",
    date: "March 13th - 14th",
    image: "/cse1.jpg",
    prizePool: "TBA",
    day: 2,
    time: "10:00 AM - 1:00 PM",
    venue: "Mac Lab",
    coordinators: "Baibhab Adhikary",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/a593ed4c-830c-414a-a362-aa96c695fa40/xrcW0oe0cK.lottie",
    color: "bg-pink-100",
  },
  {
    id: 7,
    title: "Bridge Making",
    category: "CIVIL",
    department: "Civil",
    description:
      "Electrifying performances by the best college bands from across the region.",
    scheduleDescription:
      "Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.",
    date: "March 13th - 14th",
    image: "/civil2.jpg",
    prizePool: "TBA",
    day: 2,
    time: "11:00 AM - 1:00 PM",
    venue: "Civil Courtyard",
    coordinators: "Aniruddha Biswas",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
    color: "bg-orange-100",
  },
  {
    id: 8,
    title: "Lathe War",
    category: "MECHANICAL",
    department: "Mechanical",
    description:
      "Participants face off to machine raw materials into perfect components with speed and surgical accuracy.",
    scheduleDescription:
      "A battle of precision turning. Machine the perfect component on the lathe within the given tolerance.",
    date: "March 13th - 14th",
    image: "/lathe-war.jpg",
    prizePool: "TBA",
    day: 2,
    time: "12:00 PM - 2:00 PM",
    venue: "Machine Shop",
    coordinators: "Suman Jana, Soumen Samanta",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
    color: "bg-indigo-100",
  },
  {
    id: 9,
    title: "Robo Soccer",
    eventTitle: "ROBO TERRAIN",
    category: "ROBOTICS",
    department: "Robotics",
    description:
      "Custom built bots must navigate a grueling obstacle course of mud, sand, and steep inclines.",
    scheduleDescription:
      "Navigate your bot through rough and uneven terrains without getting stuck or toppling over.",
    date: "March 13th - 14th",
    image: "/robotics1.jpg",
    prizePool: "TBA",
    day: 2,
    time: "2:00 PM - 5:00 PM",
    venue: "Open Ground",
    coordinators: "Student Coordinators",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
    color: "bg-teal-100",
  },
  {
    id: 10,
    title: "Dance Battle",
    category: "NON-TECH",
    department: "Non-Tech",
    description:
      "Rhythm, style, and attitude collide, bring your best moves, own the stage, and outshine the competition.",
    scheduleDescription:
      "End the fest on a high note with electrifying performances. Treasure hunt and arm wrestling included!",
    date: "March 13th - 14th",
    image: "/dance-battle.jpg",
    prizePool: "TBA",
    day: 2,
    time: "5:00 PM Onwards",
    venue: "Main Stage",
    coordinators: "Saheb Sir",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
    color: "bg-fuchsia-100",
  },
  {
    id: 11,
    title: "Rap Battle",
    category: "NON-TECH",
    department: "Non-Tech",
    description:
      "Rhythm & wordplay collide, drop sharp bars, own the mic, and outflow your opponent.",
    scheduleDescription:
      "Rhythm & wordplay collide in this electrifying rap battle. Drop sharp bars, own the mic, and outflow your opponent with clever lyrics and flow.",
    date: "March 13th - 14th",
    image: "/rap-battle.jpg",
    scheduleImage: "/rap-battle.jpg",
    prizePool: "TBA",
    day: 2,
    time: "5:00 PM Onwards",
    venue: "Main Stage",
    coordinators: "Saheb Sir",
    facultyCoordinators: "",
    lottie:
      "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
    color: "bg-fuchsia-100",
  },

    {
    id: 12,
      title: "Valorant Tournament",
      category: "ESPORTS",
      description:
      "Precise gunplay with agent abilities with smart strategy and perfect coordination to secure victory.",
      date: "March 13th - 14th",
      image: "/valorant.jpg",
      prizePool: "TBA",
      day: 2,
      scheduleDescription: "",
      time: "March 13th - 14th",
      venue: "Online",
      coordinators: "Student Coordinators",
      facultyCoordinators: "",
      lottie:
        "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
      color: "bg-gray-100",
  },
  {
    id: 13,
    title: "BGMI",
    category: "ESPORTS",
    description:
      "Drop in, gear up, and fight through intense combat zones to be the last team standing.",
    date: "March 13th - 14th",
    image: "/bgmi.jpg",
    prizePool: "TBA",
    day: 2,
          scheduleDescription: "",
      time: "March 13th - 14th",
      venue: "Online",
      coordinators: "Student Coordinators",
      facultyCoordinators: "",
      lottie:
        "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
      color: "bg-gray-100",
  },
  {
    id: 14,
    title: "Treasure Hunt",
    category: "NON-TECH",
    description:
      "Solve puzzles, race against time, and uncover the hidden prize.",
    date: "March 13th - 14th",
    image: "/treasure-hunt.jpg",
    prizePool: "TBA",
    day: 2,
          scheduleDescription: "",
      time: "March 13th - 14th",
      venue: "Online",
      coordinators: "Student Coordinators",
      facultyCoordinators: "",
      lottie:
        "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
      color: "bg-gray-100",
  },
  {
    id: 15,
    title: "Arm Wrestling",
    category: "NON-TECH",
    description:
      "Lock hands, hold your ground, and power through to pin your opponent down.",
    date: "March 13th - 14th",
    image: "/non-tech1.jpg",
    prizePool: "TBA",
    day: 2,
          scheduleDescription: "",
      time: "March 13th - 14th",
      venue: "Online",
      coordinators: "Student Coordinators",
      facultyCoordinators: "",
      lottie:
        "https://lottie.host/5d55c618-6fa5-489d-82bf-a9e561c64414/w57drvo4fH.lottie",
      color: "bg-gray-100",
  },

  // ─── EVENTS-ONLY (not in schedule) ───────────────────────
  {
    id: 16,
    title: "Valorant Tournament",
    category: "ESPORTS",
    description:
      "Precise gunplay with agent abilities with smart strategy and perfect coordination to secure victory.",
    date: "March 13th - 14th",
    image: "/valorant.jpg",
    prizePool: "TBA",
  },
  {
    id: 17,
    title: "BGMI",
    category: "ESPORTS",
    description:
      "Drop in, gear up, and fight through intense combat zones to be the last team standing.",
    date: "March 13th - 14th",
    image: "/bgmi.jpg",
    prizePool: "TBA",
  },
  {
    id: 18,
    title: "Treasure Hunt",
    category: "NON-TECH",
    description:
      "Solve puzzles, race against time, and uncover the hidden prize.",
    date: "March 13th - 14th",
    image: "/treasure-hunt.jpg",
    prizePool: "TBA",
  },
  {
    id: 19,
    title: "Arm Wrestling",
    category: "NON-TECH",
    description:
      "Lock hands, hold your ground, and power through to pin your opponent down.",
    date: "March 13th - 14th",
    image: "/non-tech1.jpg",
    prizePool: "TBA",
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
};

/** Derive events listing data from master events */
export function getEventsListingData(): EventListingItem[] {
  return ALL_EVENTS.map((e) => ({
    id: e.id,
    category: e.category,
    title: (e.eventTitle || e.title).toUpperCase(),
    date: e.date,
    description: e.description,
    image: e.image,
    prizePool: e.prizePool,
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
    ])
  );
}
