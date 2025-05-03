import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  if (["/signin", "/signup"].includes(url.pathname)) {
    if (token) {
      // Redirect authenticated users away from auth pages
      return NextResponse.redirect(new URL("/", url));
    }
    return NextResponse.next();
  }

  // Admin route protection
  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", url));
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/signin",
    "/signup"
  ],
};