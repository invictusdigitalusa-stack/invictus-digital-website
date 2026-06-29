import type { NextRequest, NextResponse } from "next/server";
import type { GoogleTokenResponse } from "./types";

export const GMAIL_OAUTH_STATE_COOKIE = "invictus_gmail_oauth_state";
export const GMAIL_OAUTH_WORKSPACE_COOKIE = "invictus_gmail_oauth_workspace";

const GMAIL_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

function getSecureCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
}

export function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
}

export function isGoogleOAuthConfigured() {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}

export function getGmailOAuthRedirectUri(request: NextRequest) {
  return (
    process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim() ||
    `${request.nextUrl.origin}/api/integrations/gmail/callback`
  );
}

export function buildGmailOAuthUrl(input: {
  request: NextRequest;
  state: string;
}) {
  const redirectUri = getGmailOAuthRedirectUri(input.request);
  const params = new URLSearchParams({
    client_id: getGoogleClientId(),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GMAIL_OAUTH_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state: input.state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function setGmailOAuthCookies(
  response: NextResponse,
  input: { state: string; workspaceId: string }
) {
  response.cookies.set(
    GMAIL_OAUTH_STATE_COOKIE,
    input.state,
    getSecureCookieOptions(60 * 10)
  );
  response.cookies.set(
    GMAIL_OAUTH_WORKSPACE_COOKIE,
    input.workspaceId,
    getSecureCookieOptions(60 * 10)
  );
}

export function readGmailOAuthCookies(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const stateMatch = cookieHeader.match(
    new RegExp(`(?:^|; )${GMAIL_OAUTH_STATE_COOKIE}=([^;]*)`)
  );
  const workspaceMatch = cookieHeader.match(
    new RegExp(`(?:^|; )${GMAIL_OAUTH_WORKSPACE_COOKIE}=([^;]*)`)
  );

  return {
    state: stateMatch?.[1] ? decodeURIComponent(stateMatch[1]) : null,
    workspaceId: workspaceMatch?.[1]
      ? decodeURIComponent(workspaceMatch[1])
      : null,
  };
}

export function clearGmailOAuthCookies(response: NextResponse) {
  response.cookies.set(GMAIL_OAUTH_STATE_COOKIE, "", {
    ...getSecureCookieOptions(0),
    maxAge: 0,
  });
  response.cookies.set(GMAIL_OAUTH_WORKSPACE_COOKIE, "", {
    ...getSecureCookieOptions(0),
    maxAge: 0,
  });
}

export function getSettingsGmailUrl(input?: {
  status?: "connected" | "error";
  error?: string;
}) {
  const params = new URLSearchParams({
    section: "integrations",
    integration: "gmail",
  });

  if (input?.status) {
    params.set("status", input.status);
  }

  if (input?.error) {
    params.set("error", input.error);
  }

  return `/settings?${params.toString()}`;
}

export async function exchangeGoogleAuthorizationCode(input: {
  request: NextRequest;
  code: string;
}): Promise<GoogleTokenResponse> {
  const redirectUri = getGmailOAuthRedirectUri(input.request);
  const body = new URLSearchParams({
    code: input.code,
    client_id: getGoogleClientId(),
    client_secret: getGoogleClientSecret(),
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  return (await response.json()) as GoogleTokenResponse;
}

export async function fetchGoogleUserEmail(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { email?: string };
  return data.email?.trim() || null;
}