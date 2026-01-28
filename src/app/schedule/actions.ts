"use server";

import { getCache, setCache, deleteCache, CacheKeys, CACHE_TTL } from "@/lib/cache";
import { getScheduleData, type DayData, type ScheduleEventItem } from "@/data/events";

// Re-export types so existing imports still work
export type { DayData, ScheduleEventItem as EventItem };

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

  // If not cached, derive from shared event data
  const eventsData = getScheduleData();

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
