import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";
import {
  buildGmailOAuthUrl,
  isGoogleOAuthConfigured,
  setGmailOAuthCookies,
} from "@/lib/integrations/gmail/oauth";
import { requireWorkspaceManageSession } from "@/lib/integrations/requireSession";

export async function GET(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) {
    return apiError("Authentication is not enabled.", 503);
  }

  if (!isGoogleOAuthConfigured()) {
    return apiError("Google OAuth is not configured.", 503);
  }

  const authResult = await requireWorkspaceManageSession(request);

  if (!authResult.ok) {
    return authResult.response;
  }

  const state = crypto.randomUUID();
  const redirectUrl = buildGmailOAuthUrl({ request, state });
  const response = NextResponse.redirect(redirectUrl);

  setGmailOAuthCookies(response, {
    state,
    workspaceId: authResult.session.workspace.id,
  });

  return response;
}
