"use server";

import { getCache, setCache, deleteCache, CacheKeys, CACHE_TTL } from "@/lib/cache";
import { getScheduleData, type DayData, type ScheduleEventItem } from "@/data/events";

// Re-export types so existing imports still work
export type { DayData, ScheduleEventItem as EventItem };

/**
 * Get schedule events data with Redis caching
 * Cache TTL: 30 minutes (schedule doesn't change frequently)
 * 
 * NOTE: In development, you can bypass cache by adding ?nocache=true to the URL
 * or by calling invalidateScheduleCache() after making changes to src/data/events.ts
 */
export async function getScheduleEvents(forceRefresh = false): Promise<DayData[]> {
  const cacheKey = CacheKeys.schedule();

  // In development, allow bypassing cache with forceRefresh flag
  if (!forceRefresh && process.env.NODE_ENV !== "development") {
    // Try to get from cache first
    const cached = await getCache<DayData[]>(cacheKey, false);
    if (cached) {
      return cached;
    }
  } else if (!forceRefresh) {
    // In development, still check cache but log it
    const cached = await getCache<DayData[]>(cacheKey, true);
    if (cached) {
      console.log(`[CACHE] Schedule events served from cache (use ?nocache=true or invalidateScheduleCache() to refresh)`);
      return cached;
    }
  }

  // If not cached or force refresh, derive from shared event data
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
