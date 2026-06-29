import type { WorkspaceId } from "@/lib/auth/types";
import { getGoogleClientId, getGoogleClientSecret } from "./oauth";
import {
  getGmailIntegrationByWorkspaceId,
  saveGmailIntegration,
} from "./repository";
import type { GmailIntegrationRecord, GoogleTokenResponse } from "./types";

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

function isExpired(record: GmailIntegrationRecord) {
  if (!record.expires_at) {
    return false;
  }

  return new Date(record.expires_at).getTime() <= Date.now() + 60_000;
}

async function refreshAccessToken(record: GmailIntegrationRecord) {
  const body = new URLSearchParams({
    client_id: getGoogleClientId(),
    client_secret: getGoogleClientSecret(),
    refresh_token: record.refresh_token,
    grant_type: "refresh_token",
  });

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !data.access_token) {
    return {
      record: null,
      error:
        data.error_description ||
        data.error ||
        "Failed to refresh Gmail access token.",
    };
  }

  const expiresAt =
    typeof data.expires_in === "number"
      ? new Date(Date.now() + data.expires_in * 1000).toISOString()
      : record.expires_at;

  const saved = await saveGmailIntegration({
    workspaceId: record.workspace_id,
    email: record.email,
    refreshToken: record.refresh_token,
    accessToken: data.access_token,
    expiresAt,
  });

  if (saved.error || !saved.record) {
    return {
      record: null,
      error: saved.error || "Failed to save refreshed Gmail access token.",
    };
  }

  return {
    record: saved.record,
    error: null,
  };
}

export async function getValidGmailIntegration(workspaceId: WorkspaceId): Promise<{
  record: GmailIntegrationRecord | null;
  error: string | null;
}> {
  const record = await getGmailIntegrationByWorkspaceId(workspaceId);

  if (!record) {
    return {
      record: null,
      error: "Gmail is not connected for this workspace.",
    };
  }

  if (!isExpired(record)) {
    return {
      record,
      error: null,
    };
  }

  return refreshAccessToken(record);
}