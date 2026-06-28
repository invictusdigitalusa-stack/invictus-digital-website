import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/responses";
import { readAuthCookies } from "@/lib/auth/cookies";
import { resolveRequestSession } from "@/lib/auth/session";
import {
  fetchUserWorkspaces,
  fetchWorkspaceStats,
} from "@/lib/auth/workspace";

export async function GET(request: NextRequest) {
  const session = await resolveRequestSession(request);
  let workspaces = session.user
    ? await fetchUserWorkspaces(
        session.user.id,
        readAuthCookies(request).accessToken ?? ""
      )
    : [];
  const workspaceStats = session.user
    ? await fetchWorkspaceStats(session.workspace.id)
    : null;

  return apiSuccess({ session, workspaces, workspaceStats });
}
