import type { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_ACCESS, AUTH_COOKIE_REFRESH } from "./config";

type AuthCookieSession = {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number | null;
};

function getSecureCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function getAccessTokenFromRequest(request: NextRequest | Request) {
  return readAuthCookies(request).accessToken;
}

export function readAuthCookies(request: NextRequest | Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const accessMatch = cookieHeader.match(
    new RegExp(`(?:^|; )${AUTH_COOKIE_ACCESS}=([^;]*)`)
  );
  const refreshMatch = cookieHeader.match(
    new RegExp(`(?:^|; )${AUTH_COOKIE_REFRESH}=([^;]*)`)
  );

  return {
    accessToken: accessMatch?.[1]
      ? decodeURIComponent(accessMatch[1])
      : null,
    refreshToken: refreshMatch?.[1]
      ? decodeURIComponent(refreshMatch[1])
      : null,
  };
}

export function setAuthCookies(
  response: NextResponse,
  session: AuthCookieSession
) {
  const maxAge =
    typeof session.expiresIn === "number" && session.expiresIn > 0
      ? session.expiresIn
      : 60 * 60;

  response.cookies.set(
    AUTH_COOKIE_ACCESS,
    session.accessToken,
    getSecureCookieOptions(maxAge)
  );

  if (session.refreshToken) {
    response.cookies.set(
      AUTH_COOKIE_REFRESH,
      session.refreshToken,
      getSecureCookieOptions(60 * 60 * 24 * 30)
    );
  }
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_ACCESS, "", {
    ...getSecureCookieOptions(0),
    maxAge: 0,
  });
  response.cookies.set(AUTH_COOKIE_REFRESH, "", {
    ...getSecureCookieOptions(0),
    maxAge: 0,
  });
}
