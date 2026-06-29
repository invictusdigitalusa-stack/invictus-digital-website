import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";
import { fetchGmailInbox } from "@/lib/integrations/gmail/inbox";
import { requireAuthenticatedSession } from "@/lib/integrations/requireSession";

export async function GET(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) {
    return apiError("Authentication is not enabled.", 401);
  }

  const authResult = await requireAuthenticatedSession(request);

  if (!authResult.ok) {
    return authResult.response;
  }

  const inbox = await fetchGmailInbox({
    workspaceId: authResult.session.workspace.id,
    maxResults: 10,
  });

  if (inbox.error) {
    return apiError(inbox.error, 400);
  }

  return apiSuccess({
    messages: inbox.messages,
  });
}