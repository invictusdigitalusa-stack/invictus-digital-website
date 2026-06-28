import type { NextRequest } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readAuthCookies, readWorkspaceCookie } from "./cookies";
import {
  AUTH_REQUEST_HEADERS,
  getDefaultWorkspaceId,
  isSupabaseAuthEnabled,
} from "./config";
import {
  createAnonymousSession,
  createDefaultWorkspace,
} from "./sessionFactory";
import type {
  AuthStatus,
  RequestAuthContext,
  Role,
  Session,
  User,
  WorkspaceId,
} from "./types";
import { resolveUserWorkspaceSession } from "./workspace";

export {
  createAnonymousSession,
  createAuthenticatedSession,
  createDefaultWorkspace,
} from "./sessionFactory";

function readWorkspaceIdFromRequest(request: NextRequest): WorkspaceId | null {
  const headerValue = request.headers.get(AUTH_REQUEST_HEADERS.workspaceId)?.trim();
  return headerValue || null;
}

function resolveRoleFromMetadata(
  metadata: Record<string, unknown> | undefined
): Role | null {
  const role = metadata?.role;

  if (
    role === "owner" ||
    role === "admin" ||
    role === "member" ||
    role === "viewer"
  ) {
    return role;
  }

  return null;
}

function resolveWorkspaceIdFromMetadata(
  metadata: Record<string, unknown> | undefined
): WorkspaceId | null {
  if (typeof metadata?.workspace_id === "string" && metadata.workspace_id.trim()) {
    return metadata.workspace_id.trim();
  }

  if (typeof metadata?.workspaceId === "string" && metadata.workspaceId.trim()) {
    return metadata.workspaceId.trim();
  }

  return null;
}

function mapSupabaseUser(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}): User {
  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? "",
    displayName:
      typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.name === "string"
          ? metadata.name
          : null,
    avatarUrl:
      typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
  };
}

export function createSupabaseAuthClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function resolveSupabaseAuthSession(
  accessToken?: string | null,
  preferredWorkspaceId?: WorkspaceId | null
): Promise<Session | null> {
  if (!isSupabaseAuthEnabled() || !accessToken?.trim()) {
    return null;
  }

  const client = createSupabaseAuthClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  return resolveUserWorkspaceSession({
    user: mapSupabaseUser(data.user),
    accessToken,
    preferredWorkspaceId:
      preferredWorkspaceId ??
      resolveWorkspaceIdFromMetadata(data.user.app_metadata) ??
      resolveWorkspaceIdFromMetadata(data.user.user_metadata) ??
      getDefaultWorkspaceId(),
    expiresAt: null,
  });
}

export async function resolveRequestSession(
  request: NextRequest
): Promise<Session> {
  const { accessToken } = readAuthCookies(request);
  const preferredWorkspaceId =
    readWorkspaceCookie(request) ??
    readWorkspaceIdFromRequest(request) ??
    getDefaultWorkspaceId();

  if (accessToken) {
    const authenticatedSession = await resolveSupabaseAuthSession(
      accessToken,
      preferredWorkspaceId
    );

    if (authenticatedSession) {
      return authenticatedSession;
    }
  }

  return createAnonymousSession(preferredWorkspaceId);
}

export async function buildRequestAuthContext(
  request: NextRequest
): Promise<RequestAuthContext> {
  const session = await resolveRequestSession(request);

  return {
    session,
    status: session.user ? "authenticated" : "anonymous",
    workspaceId: session.workspace.id,
  };
}

export function getAuthStatus(session: Session): AuthStatus {
  return session.user ? "authenticated" : "anonymous";
}
