import { NextResponse, type NextRequest } from "next/server";
import {
  isLoginPath,
  isProtectedInternalPath,
  runAuthMiddleware,
  runLoginMiddleware,
} from "@/lib/auth/middleware";

export async function middleware(request: NextRequest) {
  if (isLoginPath(request.nextUrl.pathname)) {
    return runLoginMiddleware(request);
  }

  if (!isProtectedInternalPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return runAuthMiddleware(request);
}

export const config = {
  matcher: [
    "/login",
    "/login/:path*",
    "/os/:path*",
    "/crm/:path*",
    "/delivery/:path*",
    "/proposal/:path*",
    "/outreach/:path*",
    "/audit/:path*",
    "/design-system/:path*",
    "/settings/:path*",
    "/api/:path*",
  ],
};
