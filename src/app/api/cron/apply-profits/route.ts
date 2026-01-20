import { NextResponse } from "next/server";

export async function POST() {
  // Cron endpoint disabled (reverted)
  return NextResponse.json({ message: "cron apply-profits endpoint removed" }, { status: 404 });
}
