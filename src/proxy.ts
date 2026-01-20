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

const authLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
    })
  : null;

const registerLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
    })
  : null;

const contactLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "60 s"),
      analytics: true,
    })
  : null;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "127.0.0.1"
  );
}

export async function proxy(request: NextRequest) {
  // Only rate limit POST for these paths
  if (request.method !== "POST") return NextResponse.next();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/auth")) {
    if (authLimit) {
      const { success } = await authLimit.limit(getIp(request));
      if (!success)
        return NextResponse.json(
          { error: "Too many requests. Try again in a minute." },
          { status: 429 }
        );
    }
  } else if (pathname === "/register" || pathname === "/events") {
    if (registerLimit) {
      const { success } = await registerLimit.limit(getIp(request));
      if (!success)
        return NextResponse.json(
          { error: "Too many requests. Try again in a minute." },
          { status: 429 }
        );
    }
  } else if (pathname === "/contact") {
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
