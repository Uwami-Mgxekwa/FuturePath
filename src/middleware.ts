import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/courses",
  "/jobs",
  "/profile",
  "/certificates",
  "/admin",
  "/ask-ai",
  "/cv-builder",
  "/study-further",
];

// Routes only for unauthenticated users (redirect to dashboard if already logged in)
const authRoutes = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Firebase auth session cookie
  const token =
    request.cookies.get("firebase-token")?.value ||
    request.cookies.get("__session")?.value;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Not logged in trying to access protected route → redirect to auth
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in trying to access auth page → redirect to dashboard
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.mp4|.*\\.jfif|.*\\.webp).*)",
  ],
};
