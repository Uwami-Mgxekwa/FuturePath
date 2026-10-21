import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication only
const protectedRoutes = [
  "/dashboard",
  "/courses",
  "/jobs",
  "/profile",
  "/certificates",
  "/ask-ai",
  "/cv-builder",
  "/study-further",
];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Routes only for unauthenticated users
const authRoutes = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("firebase-token")?.value ||
    request.cookies.get("__session")?.value;

  const isAdmin = request.cookies.get("is-admin")?.value === "true";

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Not logged in → redirect to auth
  if ((isProtected || isAdminRoute) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in but not admin → redirect to dashboard
  if (isAdminRoute && token && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Already logged in trying to access auth → redirect to dashboard
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
