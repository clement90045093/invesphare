import { type NextRequest } from "next/server";
import { updateSession } from "./utils/superbase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Exclude Telegram webhook and any public API routes
  if (
    pathname.startsWith("/api/telegram/webhook") || 
    pathname.startsWith("/api/deposit/notify") ||
    pathname.startsWith("/")
  ) {
    return; // do not run auth middleware
  }

  // Run your normal session update for other routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match everything except static files, images, favicon, and excluded APIs
    "/((?!_next/static|_next/image|favicon.ico|api/telegram/webhook|api/deposit/notify|api/transfers|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
