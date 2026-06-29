import type { NextRequest } from "next/server";
import { apiError } from "@/lib/api/responses";
import { hasPermission } from "@/lib/auth/permissions";
import { resolveRequestSession } from "@/lib/auth/session";
import type { Session } from "@/lib/auth/types";

type RequireSessionResult =
  | { ok: true; session: Session & { user: NonNullable<Session["user"]> } }
  | { ok: false; response: ReturnType<typeof apiError> };

export async function requireAuthenticatedSession(
  request: NextRequest
): Promise<RequireSessionResult> {
  const session = await resolveRequestSession(request);

  if (!session.user) {
    return { ok: false, response: apiError("Unauthorized", 401) };
  }

  return {
    ok: true,
    session: session as Session & { user: NonNullable<Session["user"]> },
  };
}

export async function requireWorkspaceManageSession(
  request: NextRequest
): Promise<RequireSessionResult> {
  const result = await requireAuthenticatedSession(request);

  if (!result.ok) {
    return result;
  }

  if (!hasPermission(result.session, "workspace:manage")) {
    return { ok: false, response: apiError("Forbidden", 403) };
  }

  return result;
}
