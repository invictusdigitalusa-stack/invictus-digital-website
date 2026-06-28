export {
  AUTH_REQUEST_HEADERS,
  AUTH_REQUIRED_PAGE_PREFIXES,
  AUTH_API_PREFIX,
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_REFRESH,
  AUTH_COOKIE_WORKSPACE,
  INTERNAL_PAGE_PREFIXES,
  INTERNAL_API_PREFIX,
  LOGIN_PATH,
  getDefaultWorkspaceId,
  getDefaultWorkspaceName,
  getDefaultWorkspaceSlug,
  isAuthEnforcementEnabled,
  isSupabaseAuthEnabled,
} from "./config";

export type {
  AuthStatus,
  Permission,
  RequestAuthContext,
  Role,
  Session,
  User,
  Workspace,
  WorkspaceId,
} from "./types";

export {
  ALL_PERMISSIONS,
  canAccessWorkspace,
  getPermissionsForRole,
  hasPermission,
  hasRole,
  isAuthenticated,
} from "./permissions";

export {
  createAnonymousSession,
  createAuthenticatedSession,
  createDefaultWorkspace,
} from "./sessionFactory";

export {
  buildRequestAuthContext,
  createSupabaseAuthClient,
  getAuthStatus,
  resolveRequestSession,
  resolveSupabaseAuthSession,
} from "./session";

export {
  fetchCurrentWorkspace,
  fetchUserWorkspaces,
  fetchWorkspaceMembership,
  normalizeWorkspaceRole,
  resolveUserWorkspaceSession,
} from "./workspace";

export type {
  WorkspaceMemberRecord,
  WorkspaceMembership,
  WorkspaceRecord,
  UserWorkspaceSession,
} from "./types";

export { logout } from "./logout";

export {
  clearAuthCookies,
  getAccessTokenFromRequest,
  readAuthCookies,
  readWorkspaceCookie,
  setAuthCookies,
  setWorkspaceCookie,
} from "./cookies";

export {
  isAuthApiPath,
  isAuthRequiredPagePath,
  isInternalApiPath,
  isInternalPagePath,
  isLoginPath,
  isProtectedInternalPath,
  runAuthMiddleware,
  runLoginMiddleware,
  INTERNAL_ROUTE_MATCHER,
} from "./middleware";
