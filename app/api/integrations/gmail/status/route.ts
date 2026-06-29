import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/responses";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";
import {
  getGmailIntegrationStatus,
  toPublicGmailIntegrationStatus,
} from "@/lib/integrations/gmail/repository";
import { requireAuthenticatedSession } from "@/lib/integrations/requireSession";

export async function GET(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) {
    return apiSuccess({
      integration: toPublicGmailIntegrationStatus({
        status: "connection_error",
        email: null,
        lastConnected: null,
        errorMessage: "Authentication is not enabled.",
      }),
    });
  }

  const authResult = await requireAuthenticatedSession(request);

  if (!authResult.ok) {
    return authResult.response;
  }

  const integration = await getGmailIntegrationStatus(
    authResult.session.workspace.id
  );

  return apiSuccess({
    integration: toPublicGmailIntegrationStatus(integration),
  });
}
