import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get the active countdown date
    const countdown = await prisma.countdownDate.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!countdown) {
      // Return a default date (30 days from now) if none is set
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      return NextResponse.json({ targetDate: defaultDate.toISOString() });
    }

    return NextResponse.json({ targetDate: countdown.targetDate.toISOString() });
  } catch (error) {
    console.error("Error fetching countdown date:", error);
    return NextResponse.json(
      { error: "Failed to fetch countdown date" },
      { status: 500 }
    );
  }
}
