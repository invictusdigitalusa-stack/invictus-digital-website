import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_API_PREFIX,
  AUTH_REQUIRED_PAGE_PREFIXES,
  AUTH_REQUEST_HEADERS,
  INTERNAL_API_PREFIX,
  INTERNAL_PAGE_PREFIXES,
  isAuthEnforcementEnabled,
  LOGIN_PATH,
} from "./config";
import { buildRequestAuthContext } from "./session";

export { INTERNAL_PAGE_PREFIXES, INTERNAL_API_PREFIX };

export function isLoginPath(pathname: string) {
  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
}

export function isAuthApiPath(pathname: string) {
  return pathname === AUTH_API_PREFIX || pathname.startsWith(`${AUTH_API_PREFIX}/`);
}

export function isInternalPagePath(pathname: string) {
  return INTERNAL_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuthRequiredPagePath(pathname: string) {
  return AUTH_REQUIRED_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isInternalApiPath(pathname: string) {
  return pathname === INTERNAL_API_PREFIX || pathname.startsWith(`${INTERNAL_API_PREFIX}/`);
}

export function isProtectedInternalPath(pathname: string) {
  return isInternalPagePath(pathname) || isInternalApiPath(pathname);
}

function attachAuthHeaders(
  request: NextRequest,
  authContext: Awaited<ReturnType<typeof buildRequestAuthContext>>
) {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set(
    AUTH_REQUEST_HEADERS.workspaceId,
    authContext.workspaceId
  );
  requestHeaders.set(
    AUTH_REQUEST_HEADERS.authStatus,
    authContext.status
  );

  if (authContext.session.user) {
    requestHeaders.set(
      AUTH_REQUEST_HEADERS.userId,
      authContext.session.user.id
    );
    requestHeaders.set(AUTH_REQUEST_HEADERS.role, authContext.session.role);
  }

  return requestHeaders;
}

export async function runLoginMiddleware(request: NextRequest) {
  const authContext = await buildRequestAuthContext(request);

  if (
    isAuthEnforcementEnabled() &&
    authContext.status === "authenticated"
  ) {
    return NextResponse.redirect(new URL("/os", request.url));
  }

  return NextResponse.next();
}

export async function runAuthMiddleware(request: NextRequest) {
  const authContext = await buildRequestAuthContext(request);
  const pathname = request.nextUrl.pathname;

  if (isAuthApiPath(pathname)) {
    return NextResponse.next();
  }

  if (
    isAuthEnforcementEnabled() &&
    authContext.status === "anonymous"
  ) {
    if (isAuthRequiredPagePath(pathname)) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isInternalApiPath(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const requestHeaders = attachAuthHeaders(request, authContext);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const INTERNAL_ROUTE_MATCHER = [
  "/os/:path*",
  "/crm/:path*",
  "/delivery/:path*",
  "/proposal/:path*",
  "/outreach/:path*",
  "/audit/:path*",
  "/design-system/:path*",
  "/settings/:path*",
  "/api/:path*",
] as const;
