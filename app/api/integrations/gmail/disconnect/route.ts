import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";
import { deleteGmailIntegration } from "@/lib/integrations/gmail/repository";
import { requireWorkspaceManageSession } from "@/lib/integrations/requireSession";

export async function POST(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) {
    return apiError("Authentication is not enabled.", 503);
  }

  const authResult = await requireWorkspaceManageSession(request);

  if (!authResult.ok) {
    return authResult.response;
  }

  const result = await deleteGmailIntegration(authResult.session.workspace.id);

  if (!result.success) {
    return apiError(result.error ?? "Unable to disconnect Gmail.", 500);
  }

  return apiSuccess({ success: true });
}
