import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";
import { sendGmailEmail } from "@/lib/integrations/gmail/send";
import type {
  GmailSendApiRequest,
  GmailSendApiResponse,
} from "@/lib/integrations/gmail/types";
import { requireAuthenticatedSession } from "@/lib/integrations/requireSession";

export async function POST(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) {
    return apiError("Authentication is not enabled.", 401);
  }

  const authResult = await requireAuthenticatedSession(request);

  if (!authResult.ok) {
    return authResult.response;
  }

  let payload: GmailSendApiRequest;

  try {
    payload = (await request.json()) as GmailSendApiRequest;
  } catch {
    return apiError("Invalid JSON payload.", 400);
  }

  const result = await sendGmailEmail({
    workspaceId: authResult.session.workspace.id,
    email: {
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
      cc: payload.cc,
      bcc: payload.bcc,
    },
  });

  if (result.error || !result.result) {
    return apiError(result.error || "Failed to send Gmail email.", 400);
  }

  const response: GmailSendApiResponse = {
    success: true,
    messageId: result.result.id,
    threadId: result.result.threadId,
    error: null,
  };

  return apiSuccess(response);
}