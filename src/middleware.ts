import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/forgot-password");

    if (isAuthPage) {
      if (isAuth) {
        const redirectUrl =
          req.nextauth.token?.role === "ADMIN" ? "/admin" : "/testimonials";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
      return null;
    }

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

      if (req.nextauth.token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/testimonials", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorized: ({ token }) => true,
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
