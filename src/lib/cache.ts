/**
 * Redis Cache Utility
 * Uses the same Upstash Redis instance for caching
 */

import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  SHORT: 60 * 2, // 2 minutes (for frequently changing data)
  MEDIUM: 60 * 5, // 5 minutes (for moderately changing data)
  LONG: 60 * 30, // 30 minutes (for rarely changing data)
  VERY_LONG: 60 * 60 * 24, // 24 hours (for static data)
} as const;

/**
 * Get cached value
 */
export async function getCache<T>(key: string, debug: boolean = false): Promise<T | null> {
  if (!redis) {
    if (debug) console.log(`[CACHE] Redis not available for key: ${key}`);
    return null;
  }
  try {
    const value = await redis.get<T>(key);
    if (debug) {
      console.log(`[CACHE] ${value ? 'HIT' : 'MISS'} - Key: ${key}`);
    }
    return value;
  } catch (error) {
    console.error(`[CACHE] Get error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set cached value with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM,
  debug: boolean = false
): Promise<boolean> {
  if (!redis) {
    if (debug) console.log(`[CACHE] Redis not available - cannot set key: ${key}`);
    return false;
  }
  try {
    await redis.setex(key, ttl, value);
    if (debug) {
      console.log(`[CACHE] SET - Key: ${key}, TTL: ${ttl}s`);
    }
    return true;
  } catch (error) {
    console.error(`[CACHE] Set error for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete cached value
 */
export async function deleteCache(key: string, debug: boolean = false): Promise<boolean> {
  if (!redis) {
    if (debug) console.log(`[CACHE] Redis not available - cannot delete key: ${key}`);
    return false;
  }
  try {
    await redis.del(key);
    if (debug) {
      console.log(`[CACHE] DELETED - Key: ${key}`);
    }
    return true;
  } catch (error) {
    console.error(`[CACHE] Delete error for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple cached values by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  if (!redis) return 0;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;
    await redis.del(...keys);
    return keys.length;
  } catch (error) {
    console.error(`Cache delete pattern error for ${pattern}:`, error);
    return 0;
  }
}

/**
 * Cache key generators
 */
export const CacheKeys = {
  event: (eventId: string) => `event:${eventId}`,
  events: (filters?: string) => `events:${filters || "all"}`,
  userProfile: (userId: string) => `user:profile:${userId}`,
  schedule: () => `schedule:all`,
  config: (key: string) => `config:${key}`,
  adminStats: () => `admin:dashboard:stats`,
  adminRevenue: () => `admin:revenue:breakdown`,
  adminEvents: () => `admin:events:all`,
  adminTeams: () => `admin:teams:all`,
  adminUserSuggestions: (query: string) => `admin:users:suggestions:${query.toLowerCase()}`,
} as const;
