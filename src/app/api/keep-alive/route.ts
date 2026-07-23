import { NextResponse } from "next/server";

// Keep-alive route triggered by self-ping or external cron services (UptimeRobot, cron-job.org)
export async function GET(request: Request) {
  const host = request.headers.get("host") || "localhost";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const currentUrl = `${protocol}://${host}/api/health`;

  return NextResponse.json({
    success: true,
    message: "Keep-alive ping acknowledged. Backend is prevented from sleeping.",
    target: currentUrl,
    timestamp: new Date().toISOString(),
  });
}
