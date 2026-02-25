import { NextResponse } from "next/server";
import { getScheduleEvents } from "@/app/schedule/actions";

// GET /api/schedule
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const nocache = url.searchParams.get("nocache") === "true";

    // Call the server-side helper to fetch events (uses cache internally)
    const data = await getScheduleEvents(nocache);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("/api/schedule error:", err);
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}
