import { NextRequest, NextResponse } from "next/server";
import { decodeToken, getDashboardRoute } from "./lib/manage_token/decode_token";

const AUTH_PAGES = ["/auth", "/login", "/register", "/signup", "/sign-in"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (pathname === "/") {
    return redirectTo("/auth", req);
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  
  if (!accessToken && !refreshToken) {
    if (isProtectedRoute(pathname)) {
      return redirectTo("/auth/sign-in", req);
    }
    return NextResponse.next();
  }

  
  const decoded = accessToken ? decodeToken(accessToken) : null;

  if (accessToken && !decoded) {
    return logoutAndRedirect(req);
  }

  
  if (accessToken && AUTH_PAGES.some((r) => pathname.startsWith(r))) {
    return redirectTo(getDashboardRoute(accessToken), req);
  }

  
  if (
    pathname.startsWith("/employer-dashboard") &&
    decoded?.user_type !== "employer"
  ) {
    return redirectTo(getDashboardRoute(accessToken!), req);
  }

  if (
    pathname.startsWith("/training-provider-dashboard") &&
    decoded?.user_type !== "training_provider"
  ) {
    return redirectTo(getDashboardRoute(accessToken!), req);
  }

  if (
    pathname.startsWith("/agency-dashboard") &&
    decoded?.user_type !== "agency"
  ) {
    return redirectTo(getDashboardRoute(accessToken!), req);
  }

  return NextResponse.next();
}


function isProtectedRoute(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/employer-dashboard") ||
    pathname.startsWith("/training-provider-dashboard") ||
    pathname.startsWith("/agency-dashboard")
  );
}


function redirectTo(path: string, req: NextRequest) {
  return NextResponse.redirect(new URL(path, req.url));
}

function logoutAndRedirect(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete("access_token");
  res.cookies.delete("refresh_token");
  return res;
}


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
