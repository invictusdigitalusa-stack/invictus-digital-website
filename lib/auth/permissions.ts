import { isAuthEnforcementEnabled } from "./config";
import type { Permission, Role, Session, WorkspaceId } from "./types";

export const ALL_PERMISSIONS: Permission[] = [
  "workspace:read",
  "workspace:manage",
  "crm:read",
  "crm:write",
  "audit:run",
  "outreach:generate",
  "proposal:generate",
  "delivery:manage",
  "os:read",
  "agent:run",
];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ALL_PERMISSIONS,
  admin: ALL_PERMISSIONS,
  member: [
    "workspace:read",
    "crm:read",
    "crm:write",
    "audit:run",
    "outreach:generate",
    "proposal:generate",
    "delivery:manage",
    "os:read",
    "agent:run",
  ],
  viewer: ["workspace:read", "crm:read", "os:read"],
};

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function isAuthenticated(session: Session | null | undefined): session is Session & {
  user: NonNullable<Session["user"]>;
} {
  return Boolean(session?.user?.id);
}

export function hasPermission(
  session: Session | null | undefined,
  permission: Permission
) {
  if (!isAuthEnforcementEnabled()) {
    return true;
  }

  if (!session) {
    return false;
  }

  return session.permissions.includes(permission);
}

export function hasRole(
  session: Session | null | undefined,
  role: Role | Role[]
) {
  if (!isAuthEnforcementEnabled()) {
    return true;
  }

  if (!session) {
    return false;
  }

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(session.role);
}

export function canAccessWorkspace(
  session: Session | null | undefined,
  workspaceId: WorkspaceId
) {
  if (!isAuthEnforcementEnabled()) {
    return true;
  }

  if (!session) {
    return false;
  }

  return session.workspace.id === workspaceId;
}
