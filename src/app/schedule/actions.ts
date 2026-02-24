"use server";

import { createHash } from "crypto";
import {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  CacheKeys,
  CACHE_TTL,
} from "@/lib/cache";
import { getScheduleData, type DayData } from "@/data/events";

function getScheduleCacheKey(eventsData: DayData[]): string {
  const signature = createHash("sha1")
    .update(JSON.stringify(eventsData))
    .digest("hex")
    .slice(0, 12);
  return `${CacheKeys.schedule()}:${signature}`;
}

/**
 * Get schedule events data with Redis caching
 * Cache TTL: 30 minutes (schedule doesn't change frequently)
 * 
 * NOTE: In development, you can bypass cache by adding ?nocache=true to the URL
 * or by calling invalidateScheduleCache() after making changes to src/data/events.ts
 */
export async function getScheduleEvents(forceRefresh = false): Promise<DayData[]> {
  // Derive data first so cache key changes whenever schedule content changes.
  const eventsData = getScheduleData();
  const cacheKey = getScheduleCacheKey(eventsData);

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
  await deleteCachePattern(`${CacheKeys.schedule()}:*`);
}
