import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { WorkspaceId } from "@/lib/auth/types";
import {
  GMAIL_INTEGRATIONS_TABLE,
  type GmailIntegrationRecord,
  type GmailIntegrationStatus,
} from "./types";

function isMissingTableError(error: { code?: string; message?: string }) {
  const message = error.message?.toLowerCase() ?? "";

  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.code === "PGRST204" ||
    message.includes("gmail_integrations") ||
    message.includes("could not find the table") ||
    message.includes("schema cache")
  );
}

export function mapGmailIntegrationStatus(
  record: GmailIntegrationRecord | null,
  errorMessage?: string | null
): GmailIntegrationStatus {
  if (errorMessage) {
    return {
      status: "connection_error",
      email: record?.email ?? null,
      lastConnected: record?.updated_at ?? record?.created_at ?? null,
      errorMessage,
    };
  }

  if (!record) {
    return {
      status: "not_connected",
      email: null,
      lastConnected: null,
      errorMessage: null,
    };
  }

  return {
    status: "connected",
    email: record.email,
    lastConnected: record.updated_at ?? record.created_at,
    errorMessage: null,
  };
}

export async function getGmailIntegrationByWorkspaceId(
  workspaceId: WorkspaceId
): Promise<GmailIntegrationRecord | null> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from(GMAIL_INTEGRATIONS_TABLE)
    .select(
      "id, workspace_id, email, refresh_token, access_token, expires_at, created_at, updated_at"
    )
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) {
      return null;
    }

    console.error("Failed to fetch Gmail integration:", error.message);
    return null;
  }

  return (data as GmailIntegrationRecord | null) ?? null;
}

export async function saveGmailIntegration(input: {
  workspaceId: WorkspaceId;
  email: string;
  refreshToken: string;
  accessToken: string;
  expiresAt: string | null;
}): Promise<{ record: GmailIntegrationRecord | null; error: string | null }> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return { record: null, error: "Database is not configured." };
  }

  const existing = await getGmailIntegrationByWorkspaceId(input.workspaceId);
  const timestamp = new Date().toISOString();

  if (existing) {
    const { data, error } = await client
      .from(GMAIL_INTEGRATIONS_TABLE)
      .update({
        email: input.email,
        refresh_token: input.refreshToken,
        access_token: input.accessToken,
        expires_at: input.expiresAt,
        updated_at: timestamp,
      })
      .eq("workspace_id", input.workspaceId)
      .select(
        "id, workspace_id, email, refresh_token, access_token, expires_at, created_at, updated_at"
      )
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return {
          record: null,
          error: "Gmail integrations table is not available.",
        };
      }

      return { record: null, error: error.message };
    }

    return { record: data as GmailIntegrationRecord, error: null };
  }

  const { data, error } = await client
    .from(GMAIL_INTEGRATIONS_TABLE)
    .insert({
      id: crypto.randomUUID(),
      workspace_id: input.workspaceId,
      email: input.email,
      refresh_token: input.refreshToken,
      access_token: input.accessToken,
      expires_at: input.expiresAt,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select(
      "id, workspace_id, email, refresh_token, access_token, expires_at, created_at, updated_at"
    )
    .single();

  if (error) {
    if (isMissingTableError(error)) {
      return {
        record: null,
        error: "Gmail integrations table is not available.",
      };
    }

    return { record: null, error: error.message };
  }

  return { record: data as GmailIntegrationRecord, error: null };
}

export async function deleteGmailIntegration(
  workspaceId: WorkspaceId
): Promise<{ success: boolean; error: string | null }> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return { success: false, error: "Database is not configured." };
  }

  const { error } = await client
    .from(GMAIL_INTEGRATIONS_TABLE)
    .delete()
    .eq("workspace_id", workspaceId);

  if (error) {
    if (isMissingTableError(error)) {
      return {
        success: false,
        error: "Gmail integrations table is not available.",
      };
    }

    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function getGmailIntegrationStatus(
  workspaceId: WorkspaceId,
  errorMessage?: string | null
): Promise<GmailIntegrationStatus> {
  const record = await getGmailIntegrationByWorkspaceId(workspaceId);
  return mapGmailIntegrationStatus(record, errorMessage);
}

export function toPublicGmailIntegrationStatus(
  status: GmailIntegrationStatus
): GmailIntegrationStatus {
  return status;
}
