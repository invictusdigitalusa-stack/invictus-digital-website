import { getDefaultWorkspaceId } from "@/lib/auth/config";
import type { WorkspaceId } from "@/lib/auth/types";
import type { NextRequest } from "next/server";
import { AUTH_REQUEST_HEADERS } from "@/lib/auth/config";

/**
 * Resolve the active workspace for Supabase-backed operations.
 * Sprint 1: always falls back to the default workspace without changing queries.
 */
export function resolveWorkspaceId(
  override?: WorkspaceId | null
): WorkspaceId {
  if (override?.trim()) {
    return override.trim();
  }

  return getDefaultWorkspaceId();
}

export function resolveWorkspaceIdFromRequest(
  request?: Pick<NextRequest, "headers"> | null
): WorkspaceId {
  const headerValue = request?.headers
    .get(AUTH_REQUEST_HEADERS.workspaceId)
    ?.trim();

  return resolveWorkspaceId(headerValue);
}
