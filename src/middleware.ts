import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/forgot-password");

    if (isAuthPage) {
      if (isAuth) {
        // Redirect to appropriate page based on role
        const redirectUrl =
          token?.role === "ADMIN" ? "/admin" : "/testimonials";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
      return null;
    }

    // Protect testimonials route
    if (req.nextUrl.pathname.startsWith("/testimonials")) {
      if (!isAuth) {
        let from = req.nextUrl.pathname;
        if (req.nextUrl.search) {
          from += req.nextUrl.search;
        }
        return NextResponse.redirect(
          new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
        );
      }
    }

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!isAuth) {
        let from = req.nextUrl.pathname;
        if (req.nextUrl.search) {
          from += req.nextUrl.search;
        }
        return NextResponse.redirect(
          new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
        );
      }

      // Check if user is admin
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/testimonials", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // We'll handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/forgot-password",
    "/testimonials/:path*",
  ],
};
