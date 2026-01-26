"use server";

import { getCache, setCache, CacheKeys, CACHE_TTL } from "@/lib/cache";
import { APP_CONFIG } from "@/config/app.config";

// Event data type
export type EventItem = {
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

export type DayData = {
  day: string;
  date: string;
  items: EventItem[];
};

// Static events data (this would ideally come from a database)
const getEventsData = (): DayData[] => [
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
        title: "Robo Terrain",
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

/**
 * Get schedule events data with Redis caching
 * Cache TTL: 30 minutes (schedule doesn't change frequently)
 */
export async function getScheduleEvents(): Promise<DayData[]> {
  const cacheKey = CacheKeys.schedule();
  
  // Try to get from cache first
  const cached = await getCache<DayData[]>(cacheKey, process.env.NODE_ENV === "development");
  if (cached) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[CACHE] Schedule events served from cache`);
    }
    return cached;
  }

  // If not cached, get the data
  const eventsData = getEventsData();

  // Cache it for 30 minutes (CACHE_TTL.LONG)
  await setCache(cacheKey, eventsData, CACHE_TTL.LONG, process.env.NODE_ENV === "development");
  
  if (process.env.NODE_ENV === "development") {
    console.log(`[CACHE] Schedule events cached for ${CACHE_TTL.LONG}s (30 minutes)`);
  }

  return eventsData;
}

/**
 * Invalidate schedule cache (call this when schedule is updated)
 */
export async function invalidateScheduleCache(): Promise<void> {
  await deleteCache(CacheKeys.schedule());
}
