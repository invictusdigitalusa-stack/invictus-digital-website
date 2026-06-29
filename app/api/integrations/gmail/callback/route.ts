import { NextRequest, NextResponse } from "next/server";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";
import {
  clearGmailOAuthCookies,
  exchangeGoogleAuthorizationCode,
  fetchGoogleUserEmail,
  getSettingsGmailUrl,
  isGoogleOAuthConfigured,
  readGmailOAuthCookies,
} from "@/lib/integrations/gmail/oauth";
import {
  getGmailIntegrationByWorkspaceId,
  saveGmailIntegration,
} from "@/lib/integrations/gmail/repository";

function redirectWithError(request: NextRequest, message: string) {
  const url = new URL(getSettingsGmailUrl({ status: "error", error: message }), request.url);
  const response = NextResponse.redirect(url);
  clearGmailOAuthCookies(response);
  return response;
}

export async function GET(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) {
    return redirectWithError(request, "Authentication is not enabled.");
  }

  if (!isGoogleOAuthConfigured()) {
    return redirectWithError(request, "Google OAuth is not configured.");
  }

  const searchParams = request.nextUrl.searchParams;
  const oauthError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (oauthError) {
    return redirectWithError(
      request,
      errorDescription?.trim() || oauthError
    );
  }

  const code = searchParams.get("code")?.trim();
  const state = searchParams.get("state")?.trim();
  const { state: cookieState, workspaceId } = readGmailOAuthCookies(request);

  if (!code || !state || !cookieState || !workspaceId) {
    return redirectWithError(request, "Missing OAuth callback parameters.");
  }

  if (state !== cookieState) {
    return redirectWithError(request, "Invalid OAuth state.");
  }

  const tokens = await exchangeGoogleAuthorizationCode({ request, code });

  if (tokens.error || !tokens.access_token) {
    return redirectWithError(
      request,
      tokens.error_description?.trim() ||
        tokens.error?.trim() ||
        "Failed to exchange authorization code."
    );
  }

  const existing = await getGmailIntegrationByWorkspaceId(workspaceId);
  const refreshToken = tokens.refresh_token ?? existing?.refresh_token;

  if (!refreshToken) {
    return redirectWithError(
      request,
      "Google did not return a refresh token. Try reconnecting with consent."
    );
  }

  const email = await fetchGoogleUserEmail(tokens.access_token);

  if (!email) {
    return redirectWithError(request, "Unable to resolve Gmail account email.");
  }

  const expiresAt =
    typeof tokens.expires_in === "number" && tokens.expires_in > 0
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

  const saveResult = await saveGmailIntegration({
    workspaceId,
    email,
    refreshToken,
    accessToken: tokens.access_token,
    expiresAt,
  });

  const response = NextResponse.redirect(
    new URL(
      getSettingsGmailUrl(
        saveResult.error
          ? { status: "error", error: saveResult.error }
          : { status: "connected" }
      ),
      request.url
    )
  );

  clearGmailOAuthCookies(response);
  return response;
}
