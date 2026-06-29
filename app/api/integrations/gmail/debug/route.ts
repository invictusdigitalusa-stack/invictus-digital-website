import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/responses";
import {
  getGmailOAuthRedirectUri,
  getGoogleClientId,
  getGoogleClientSecret,
} from "@/lib/integrations/gmail/oauth";

export async function GET(request: NextRequest) {
  const googleClientId = getGoogleClientId();
  const googleClientSecret = getGoogleClientSecret();

  return apiSuccess({
    hasGoogleClientId: Boolean(googleClientId),
    googleClientIdEndsCorrectly: googleClientId.endsWith(
      ".apps.googleusercontent.com"
    ),
    googleClientIdLength: googleClientId.length,
    googleClientIdLast30Chars: googleClientId.slice(-30),
    googleClientIdLastCharCode: googleClientId.charCodeAt(
      googleClientId.length - 1
    ),
    hasGoogleClientSecret: Boolean(googleClientSecret),
    googleClientSecretLength: googleClientSecret.length,
    redirectUri: googleClientId
      ? getGmailOAuthRedirectUri(request)
      : null,
  });
}