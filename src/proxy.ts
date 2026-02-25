import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Cache Ratelimit instances so we only create them when needed
const limiterCache = new Map<string, Ratelimit | null>();

function getLimiter(key: string, count: number, windowSeconds: number) {
  if (!redis) return null;
  if (limiterCache.has(key)) return limiterCache.get(key) as Ratelimit | null;

  const analyticsEnabled = process.env.NODE_ENV !== "production"; // reduce extra ops in prod

  const limiter = new Ratelimit({
    redis,
    // Ratelimit Duration type is a template literal type (e.g. "60 s").
    // We construct the duration string here and cast to any to satisfy the library types.
    limiter: Ratelimit.slidingWindow(count, `${windowSeconds} s` as any),
    analytics: analyticsEnabled,
  });

  limiterCache.set(key, limiter);
  return limiter;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "127.0.0.1"
  );
}

export async function proxy(request: NextRequest) {
  const response = request.method === "OPTIONS"
    ? new NextResponse(null, { status: 204 })
    : NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");
  
  if (request.method === "OPTIONS") {
    console.log("Handled preflight OPTIONS request");
    return response;
  }

  // Skip non-POST early
  if (request.method !== "POST") return NextResponse.next();

  const pathname = request.nextUrl.pathname;

  // Avoid touching middleware for static assets (in case matcher overlaps)
  const isStaticAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/fonts/") ||
    /\.(?:svg|jpg|jpeg|png|gif|ico|webp|avif|mp4|pdf|css|js|map)$/i.test(pathname);
  if (isStaticAsset) return NextResponse.next();

  // Use lazily-created, cached limiters to reduce work during module init
  if (pathname.startsWith("/api/auth")) {
    const authLimit = getLimiter("auth", 10, 60);
    if (authLimit) {
      const { success } = await authLimit.limit(getIp(request));
      if (!success)
        return NextResponse.json(
          { error: "Too many requests. Try again in a minute." },
          { status: 429 }
        );
    }
  } else if (pathname === "/register" || pathname === "/events") {
    const registerLimit = getLimiter("register", 5, 60);
    if (registerLimit) {
      const { success } = await registerLimit.limit(getIp(request));
      if (!success)
        return NextResponse.json(
          { error: "Too many requests. Try again in a minute." },
          { status: 429 }
        );
    }
  } else if (pathname === "/contact") {
    const contactLimit = getLimiter("contact", 3, 60);
    if (contactLimit) {
      const { success } = await contactLimit.limit(getIp(request));
      if (!success)
        return NextResponse.json(
          { error: "Too many requests. Try again in a minute." },
          { status: 429 }
        );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/register", "/events", "/contact"],
};
