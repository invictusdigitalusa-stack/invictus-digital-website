import type { WorkspaceId } from "@/lib/auth/types";

export const GMAIL_INTEGRATIONS_TABLE = "gmail_integrations" as const;

export type GmailIntegrationRecord = {
  id: string;
  workspace_id: WorkspaceId;
  email: string;
  refresh_token: string;
  access_token: string;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type GmailConnectionStatus =
  | "not_connected"
  | "connected"
  | "connection_error";

export type GmailIntegrationStatus = {
  status: GmailConnectionStatus;
  email: string | null;
  lastConnected: string | null;
  errorMessage: string | null;
};

export type GmailOAuthState = {
  state: string;
  workspaceId: WorkspaceId;
};

export type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

export type GoogleUserInfo = {
  email?: string;
  verified_email?: boolean;
};

export type GmailSendEmailInput = {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
};

export type GmailSendEmailResult = {
  id: string | null;
  threadId: string | null;
};

export type GmailSendApiRequest = GmailSendEmailInput;

export type GmailSendApiResponse = {
  success: boolean;
  messageId: string | null;
  threadId: string | null;
  error: string | null;
};