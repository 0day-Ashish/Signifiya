import { NextResponse } from "next/server";
import { getUserProfile, getUserPassStatus } from "@/app/actions";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const [profile, passStatus] = await Promise.all([
      getUserProfile(userId),
      getUserPassStatus(userId),
    ]);

    return NextResponse.json({ profile, passStatus }, { status: 200 });
  } catch (err) {
    console.error("/api/user error:", err);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}
