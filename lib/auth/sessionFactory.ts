import {
  getDefaultWorkspaceId,
  getDefaultWorkspaceName,
  getDefaultWorkspaceSlug,
} from "./config";
import { getPermissionsForRole } from "./permissions";
import type { Role, Session, User, Workspace, WorkspaceId } from "./types";

export function createDefaultWorkspace(workspaceId?: WorkspaceId): Workspace {
  const id = workspaceId ?? getDefaultWorkspaceId();

  return {
    id,
    name: getDefaultWorkspaceName(),
    slug: getDefaultWorkspaceSlug(),
  };
}

export function createAnonymousSession(workspaceId?: WorkspaceId): Session {
  const workspace = createDefaultWorkspace(workspaceId);
  const role: Role = "owner";

  return {
    user: null,
    workspace,
    role,
    permissions: getPermissionsForRole(role),
    expiresAt: null,
  };
}

export function createAuthenticatedSession(input: {
  user: User;
  workspace: Workspace;
  role: Role;
  expiresAt?: string | null;
}): Session {
  return {
    user: input.user,
    workspace: input.workspace,
    role: input.role,
    permissions: getPermissionsForRole(input.role),
    expiresAt: input.expiresAt ?? null,
  };
}
