import type { WorkspaceId } from "@/lib/auth/types";
import { getValidGmailIntegration } from "./refresh";

const GMAIL_MESSAGES_ENDPOINT =
  "https://gmail.googleapis.com/gmail/v1/users/me/messages";

export type GmailInboxMessage = {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  labelIds: string[];
};

type GmailListResponse = {
  messages?: Array<{
    id: string;
    threadId: string;
  }>;
  nextPageToken?: string;
  resultSizeEstimate?: number;
  error?: {
    message?: string;
  };
};

type GmailMessageResponse = {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  payload?: {
    headers?: Array<{
      name?: string;
      value?: string;
    }>;
  };
  error?: {
    message?: string;
  };
};

function getHeader(
  headers: Array<{ name?: string; value?: string }> | undefined,
  name: string
) {
  return (
    headers?.find(
      (header) => header.name?.toLowerCase() === name.toLowerCase()
    )?.value ?? ""
  );
}

function mapGmailMessage(message: GmailMessageResponse): GmailInboxMessage {
  const headers = message.payload?.headers ?? [];

  return {
    id: message.id ?? "",
    threadId: message.threadId ?? "",
    subject: getHeader(headers, "Subject") || "(No subject)",
    from: getHeader(headers, "From"),
    to: getHeader(headers, "To"),
    date: getHeader(headers, "Date"),
    snippet: message.snippet ?? "",
    labelIds: message.labelIds ?? [],
  };
}

async function fetchGmailMessage(input: {
  accessToken: string;
  messageId: string;
}) {
  const response = await fetch(
    `${GMAIL_MESSAGES_ENDPOINT}/${input.messageId}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
    {
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
      },
    }
  );

  const data = (await response.json()) as GmailMessageResponse;

  if (!response.ok) {
    return {
      message: null,
      error: data.error?.message || "Failed to fetch Gmail message.",
    };
  }

  return {
    message: mapGmailMessage(data),
    error: null,
  };
}

export async function fetchGmailInbox(input: {
  workspaceId: WorkspaceId;
  maxResults?: number;
}): Promise<{
  messages: GmailInboxMessage[];
  error: string | null;
}> {
  const integration = await getValidGmailIntegration(input.workspaceId);

  if (integration.error || !integration.record) {
    return {
      messages: [],
      error: integration.error || "Gmail is not connected for this workspace.",
    };
  }

  const accessToken = integration.record.access_token;
  const maxResults = Math.min(Math.max(input.maxResults ?? 10, 1), 25);

  const listResponse = await fetch(
    `${GMAIL_MESSAGES_ENDPOINT}?maxResults=${maxResults}&q=in:anywhere newer_than:30d`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const listData = (await listResponse.json()) as GmailListResponse;

  if (!listResponse.ok) {
    return {
      messages: [],
      error: listData.error?.message || "Failed to fetch Gmail inbox.",
    };
  }

  const messageRefs = listData.messages ?? [];

  const results = await Promise.all(
    messageRefs.map((message) =>
      fetchGmailMessage({
        accessToken,
        messageId: message.id,
      })
    )
  );

  const firstError = results.find((result) => result.error)?.error ?? null;

  return {
    messages: results
      .map((result) => result.message)
      .filter((message): message is GmailInboxMessage => Boolean(message)),
    error: firstError,
  };
}