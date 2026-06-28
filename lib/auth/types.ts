export type WorkspaceId = string;

export type User = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type Workspace = {
  id: WorkspaceId;
  name: string;
  slug: string;
};

export type Role = "owner" | "admin" | "member" | "viewer";

export type Permission =
  | "workspace:read"
  | "workspace:manage"
  | "crm:read"
  | "crm:write"
  | "audit:run"
  | "outreach:generate"
  | "proposal:generate"
  | "delivery:manage"
  | "os:read"
  | "agent:run";

export type WorkspaceRecord = {
  id: WorkspaceId;
  name: string;
  slug: string;
  created_at: string | null;
};

export type WorkspaceMemberRecord = {
  id: string;
  workspace_id: WorkspaceId;
  user_id: string;
  role: Role;
  created_at: string | null;
};

export type WorkspaceMembership = {
  membership: WorkspaceMemberRecord;
  workspace: Workspace;
  role: Role;
};

export type UserWorkspaceSession = {
  user: User;
  workspace: Workspace;
  role: Role;
  permissions: Permission[];
  expiresAt: string | null;
};

export type Session = {
  user: User | null;
  workspace: Workspace;
  role: Role;
  permissions: Permission[];
  expiresAt: string | null;
};

export type AuthStatus = "anonymous" | "authenticated";

export type RequestAuthContext = {
  session: Session;
  status: AuthStatus;
  workspaceId: WorkspaceId;
};
