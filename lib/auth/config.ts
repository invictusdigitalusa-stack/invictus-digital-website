import type { WorkspaceId } from "./types";

export const AUTH_REQUEST_HEADERS = {
  workspaceId: "x-invictus-workspace-id",
  authStatus: "x-invictus-auth-status",
  userId: "x-invictus-user-id",
  role: "x-invictus-role",
} as const;

export const INTERNAL_PAGE_PREFIXES = [
  "/os",
  "/crm",
  "/delivery",
  "/proposal",
  "/outreach",
  "/audit",
  "/design-system",
] as const;

export const INTERNAL_API_PREFIX = "/api";

export const LOGIN_PATH = "/login";

export const AUTH_COOKIE_ACCESS = "invictus-auth-access";
export const AUTH_COOKIE_REFRESH = "invictus-auth-refresh";

/** Internal pages that require authentication when enforcement is enabled. */
export const AUTH_REQUIRED_PAGE_PREFIXES = [
  "/os",
  "/crm",
  "/audit",
  "/outreach",
  "/proposal",
  "/delivery",
] as const;

export const AUTH_API_PREFIX = "/api/auth";

/**
 * While false, permission helpers allow access to preserve legacy behavior.
 */
export function isAuthEnforcementEnabled() {
  return process.env.INVICTUS_AUTH_ENABLED === "true";
}

export function isSupabaseAuthEnabled() {
  return process.env.INVICTUS_SUPABASE_AUTH_ENABLED === "true";
}

export function getDefaultWorkspaceId(): WorkspaceId {
  return (
    process.env.INVICTUS_DEFAULT_WORKSPACE_ID?.trim() ||
    process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID?.trim() ||
    "default"
  );
}

export function getDefaultWorkspaceName() {
  return process.env.INVICTUS_DEFAULT_WORKSPACE_NAME?.trim() || "Invictus Digital";
}

export function getDefaultWorkspaceSlug() {
  return process.env.INVICTUS_DEFAULT_WORKSPACE_SLUG?.trim() || "invictus";
}
