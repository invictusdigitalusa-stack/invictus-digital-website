import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  getDefaultWorkspaceId,
  isSupabaseAuthEnabled,
} from "./config";
import { getPermissionsForRole } from "./permissions";
import {
  createAuthenticatedSession,
  createDefaultWorkspace,
} from "./sessionFactory";
import type {
  Role,
  Session,
  User,
  Workspace,
  WorkspaceId,
  WorkspaceMembership,
  UserWorkspaceSession,
} from "./types";

type WorkspaceMemberRow = {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string | null;
  created_at: string | null;
  workspaces:
    | {
        id: string;
        name: string;
        slug: string;
        created_at: string | null;
      }
    | {
        id: string;
        name: string;
        slug: string;
        created_at: string | null;
      }[]
    | null;
};

function isMissingWorkspaceSchemaError(error: { code?: string; message?: string }) {
  const message = error.message?.toLowerCase() ?? "";

  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.code === "PGRST204" ||
    (message.includes("workspace") && message.includes("does not exist")) ||
    message.includes("could not find the table") ||
    message.includes("schema cache")
  );
}

export function normalizeWorkspaceRole(value: string | null | undefined): Role | null {
  if (
    value === "owner" ||
    value === "admin" ||
    value === "member" ||
    value === "viewer"
  ) {
    return value;
  }

  return null;
}

function mapWorkspaceRecord(record: {
  id: string;
  name: string;
  slug: string;
  created_at?: string | null;
}): Workspace {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
  };
}

function mapWorkspaceMembership(row: WorkspaceMemberRow): WorkspaceMembership | null {
  const workspaceRow = Array.isArray(row.workspaces)
    ? row.workspaces[0]
    : row.workspaces;
  const role = normalizeWorkspaceRole(row.role);

  if (!workspaceRow || !role) {
    return null;
  }

  return {
    membership: {
      id: row.id,
      workspace_id: row.workspace_id,
      user_id: row.user_id,
      role,
      created_at: row.created_at,
    },
    workspace: mapWorkspaceRecord(workspaceRow),
    role,
  };
}

async function fetchMembershipRows(
  userId: string,
  workspaceId?: WorkspaceId | null
): Promise<WorkspaceMemberRow[] | null> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return null;
  }

  let memberQuery = client
    .from("workspace_members")
    .select("id, workspace_id, user_id, role, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (workspaceId) {
    memberQuery = memberQuery.eq("workspace_id", workspaceId);
  }

  const { data: members, error: membersError } = await memberQuery;

  if (membersError) {
    if (isMissingWorkspaceSchemaError(membersError)) {
      return null;
    }

    console.error(
      "Failed to fetch workspace memberships:",
      membersError.message
    );
    return null;
  }

  if (!members || members.length === 0) {
    return [];
  }

  const workspaceIds = [...new Set(members.map((member) => member.workspace_id))];
  const { data: workspaces, error: workspacesError } = await client
    .from("workspaces")
    .select("id, name, slug, created_at")
    .in("id", workspaceIds);

  if (workspacesError) {
    if (isMissingWorkspaceSchemaError(workspacesError)) {
      return null;
    }

    console.error("Failed to fetch workspaces:", workspacesError.message);
    return null;
  }

  const workspaceById = new Map(
    (workspaces ?? []).map((workspace) => [workspace.id, workspace])
  );

  return members.map((member) => ({
    ...member,
    workspaces: workspaceById.get(member.workspace_id) ?? null,
  }));
}

export async function fetchWorkspaceStats(
  workspaceId: WorkspaceId
): Promise<{ memberCount: number; createdAt: string | null } | null> {
  if (!isSupabaseAuthEnabled()) {
    return {
      memberCount: 1,
      createdAt: null,
    };
  }

  const client = createSupabaseAdminClient();

  if (!client) {
    return null;
  }

  const [{ count, error: memberCountError }, { data: workspace, error: workspaceError }] =
    await Promise.all([
      client
        .from("workspace_members")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId),
      client
        .from("workspaces")
        .select("created_at")
        .eq("id", workspaceId)
        .maybeSingle(),
    ]);

  if (memberCountError || workspaceError) {
    if (
      isMissingWorkspaceSchemaError(memberCountError ?? {}) ||
      isMissingWorkspaceSchemaError(workspaceError ?? {})
    ) {
      return null;
    }

    console.error(
      "Failed to fetch workspace stats:",
      memberCountError?.message ?? workspaceError?.message
    );
    return null;
  }

  return {
    memberCount: count ?? 0,
    createdAt: workspace?.created_at ?? null,
  };
}

export async function fetchUserWorkspaces(
  userId: string,
  _accessToken: string
): Promise<Workspace[]> {
  if (!isSupabaseAuthEnabled()) {
    return [createDefaultWorkspace()];
  }

  const rows = await fetchMembershipRows(userId);

  if (!rows) {
    return [createDefaultWorkspace()];
  }

  const memberships = rows
    .map(mapWorkspaceMembership)
    .filter((membership): membership is WorkspaceMembership => membership !== null);

  if (memberships.length === 0) {
    return [createDefaultWorkspace()];
  }

  return memberships.map((membership) => membership.workspace);
}

export async function fetchWorkspaceMembership(
  userId: string,
  workspaceId: WorkspaceId,
  _accessToken: string
): Promise<WorkspaceMembership | null> {
  if (!isSupabaseAuthEnabled()) {
    return null;
  }

  const rows = await fetchMembershipRows(userId, workspaceId);
  const membership = rows
    ?.map(mapWorkspaceMembership)
    .find((entry): entry is WorkspaceMembership => entry !== null);

  return membership ?? null;
}

export async function fetchCurrentWorkspace(
  userId: string,
  _accessToken: string,
  preferredWorkspaceId?: WorkspaceId | null
): Promise<Workspace> {
  if (!isSupabaseAuthEnabled()) {
    return createDefaultWorkspace(preferredWorkspaceId ?? undefined);
  }

  if (preferredWorkspaceId && preferredWorkspaceId !== getDefaultWorkspaceId()) {
    const preferredMembership = await fetchWorkspaceMembership(
      userId,
      preferredWorkspaceId,
      _accessToken
    );

    if (preferredMembership) {
      return preferredMembership.workspace;
    }
  }

  const rows = await fetchMembershipRows(userId);
  const firstMembership = rows
    ?.map(mapWorkspaceMembership)
    .find((entry): entry is WorkspaceMembership => entry !== null);

  if (firstMembership) {
    return firstMembership.workspace;
  }

  return createDefaultWorkspace(preferredWorkspaceId ?? undefined);
}

function buildFallbackUserWorkspaceSession(input: {
  user: User;
  preferredWorkspaceId?: WorkspaceId | null;
  expiresAt?: string | null;
}): UserWorkspaceSession {
  const workspace = createDefaultWorkspace(input.preferredWorkspaceId ?? undefined);
  const role: Role = "owner";

  return {
    user: input.user,
    workspace,
    role,
    permissions: getPermissionsForRole(role),
    expiresAt: input.expiresAt ?? null,
  };
}

export async function resolveUserWorkspaceSession(input: {
  user: User;
  accessToken: string;
  preferredWorkspaceId?: WorkspaceId | null;
  expiresAt?: string | null;
}): Promise<Session> {
  if (!isSupabaseAuthEnabled()) {
    const fallback = buildFallbackUserWorkspaceSession(input);
    return createAuthenticatedSession({
      user: fallback.user,
      workspace: fallback.workspace,
      role: fallback.role,
      expiresAt: fallback.expiresAt,
    });
  }

  const preferredWorkspaceId =
    input.preferredWorkspaceId?.trim() || getDefaultWorkspaceId();

  if (preferredWorkspaceId !== getDefaultWorkspaceId()) {
    const membership = await fetchWorkspaceMembership(
      input.user.id,
      preferredWorkspaceId,
      input.accessToken
    );

    if (membership) {
      return createAuthenticatedSession({
        user: input.user,
        workspace: membership.workspace,
        role: membership.role,
        expiresAt: input.expiresAt ?? null,
      });
    }
  }

  const rows = await fetchMembershipRows(input.user.id);
  const firstMembership = rows
    ?.map(mapWorkspaceMembership)
    .find((entry): entry is WorkspaceMembership => entry !== null);

  if (firstMembership) {
    return createAuthenticatedSession({
      user: input.user,
      workspace: firstMembership.workspace,
      role: firstMembership.role,
      expiresAt: input.expiresAt ?? null,
    });
  }

  const fallback = buildFallbackUserWorkspaceSession({
    user: input.user,
    preferredWorkspaceId,
    expiresAt: input.expiresAt ?? null,
  });

  return createAuthenticatedSession({
    user: fallback.user,
    workspace: fallback.workspace,
    role: fallback.role,
    expiresAt: fallback.expiresAt,
  });
}
