import { NextRequest } from "next/server";
import {
  apiBadRequest,
  apiError,
  apiSuccess,
} from "@/lib/api/responses";
import { readAuthCookies, setWorkspaceCookie } from "@/lib/auth/cookies";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";
import {
  createSupabaseAuthClient,
  resolveSupabaseAuthSession,
} from "@/lib/auth/session";
import { fetchWorkspaceMembership } from "@/lib/auth/workspace";
import type { WorkspaceId } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) {
    return apiError("Authentication is not enabled.", 503);
  }

  const { accessToken } = readAuthCookies(request);

  if (!accessToken) {
    return apiError("Unauthorized", 401);
  }

  let body: { workspaceId?: string };

  try {
    body = (await request.json()) as { workspaceId?: string };
  } catch {
    return apiBadRequest("Invalid request body.");
  }

  const workspaceId = body.workspaceId?.trim() as WorkspaceId | undefined;

  if (!workspaceId) {
    return apiBadRequest("workspaceId is required.");
  }

  const client = createSupabaseAuthClient();

  if (!client) {
    return apiError("Authentication is not configured.", 503);
  }

  const { data, error } = await client.auth.getUser(accessToken);

  if (error || !data.user) {
    return apiError("Unauthorized", 401);
  }

  const membership = await fetchWorkspaceMembership(
    data.user.id,
    workspaceId,
    accessToken
  );

  if (!membership) {
    return apiError("Workspace not found or access denied.", 403);
  }

  const session = await resolveSupabaseAuthSession(accessToken, workspaceId);

  if (!session) {
    return apiError("Unable to resolve workspace session.", 500);
  }

  const response = apiSuccess({ session });
  setWorkspaceCookie(response, workspaceId);

  return response;
}
