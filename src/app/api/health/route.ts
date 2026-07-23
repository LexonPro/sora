import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "online",
      message: "SORA Backend is active and awake.",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}
