import type { WorkspaceId } from "@/lib/auth/types";
import { getGoogleClientId, getGoogleClientSecret } from "./oauth";
import {
  getGmailIntegrationByWorkspaceId,
  saveGmailIntegration,
} from "./repository";
import type {
  GmailIntegrationRecord,
  GmailSendEmailInput,
  GmailSendEmailResult,
  GoogleTokenResponse,
} from "./types";

const GMAIL_SEND_ENDPOINT =
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

function encodeBase64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function buildRecipientHeader(label: string, value?: string) {
  const cleanValue = value?.trim();

  if (!cleanValue) {
    return null;
  }

  return `${label}: ${cleanValue}`;
}

function buildRawEmail(input: GmailSendEmailInput) {
  const headers = [
    buildRecipientHeader("To", input.to),
    buildRecipientHeader("Cc", input.cc),
    buildRecipientHeader("Bcc", input.bcc),
    `Subject: ${input.subject.trim()}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
  ].filter(Boolean);

  return `${headers.join("\r\n")}\r\n\r\n${input.body}`;
}

function isExpired(record: GmailIntegrationRecord) {
  if (!record.expires_at) {
    return false;
  }

  const expiresAt = new Date(record.expires_at).getTime();
  const now = Date.now();

  return expiresAt <= now + 60_000;
}

async function refreshGmailAccessToken(record: GmailIntegrationRecord) {
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

async function getValidGmailIntegration(workspaceId: WorkspaceId) {
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

  return refreshGmailAccessToken(record);
}

export async function sendGmailEmail(input: {
  workspaceId: WorkspaceId;
  email: GmailSendEmailInput;
}): Promise<{
  result: GmailSendEmailResult | null;
  error: string | null;
}> {
  const to = input.email.to.trim();
  const subject = input.email.subject.trim();
  const body = input.email.body.trim();

  if (!to) {
    return { result: null, error: "Missing email recipient." };
  }

  if (!subject) {
    return { result: null, error: "Missing email subject." };
  }

  if (!body) {
    return { result: null, error: "Missing email body." };
  }

  const integration = await getValidGmailIntegration(input.workspaceId);

  if (integration.error || !integration.record) {
    return {
      result: null,
      error: integration.error || "Gmail integration is unavailable.",
    };
  }

  const raw = encodeBase64Url(
    buildRawEmail({
      to,
      subject,
      body,
      cc: input.email.cc,
      bcc: input.email.bcc,
    })
  );

  const response = await fetch(GMAIL_SEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${integration.record.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  const data = (await response.json()) as {
    id?: string;
    threadId?: string;
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    return {
      result: null,
      error: data.error?.message || "Failed to send Gmail email.",
    };
  }

  return {
    result: {
      id: data.id ?? null,
      threadId: data.threadId ?? null,
    },
    error: null,
  };
}