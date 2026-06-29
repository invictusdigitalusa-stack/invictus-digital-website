import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";
import { fetchGmailInbox } from "@/lib/integrations/gmail/inbox";
import { requireAuthenticatedSession } from "@/lib/integrations/requireSession";

type EmailHistoryRequest = {
  company?: string | null;
  website?: string | null;
  email?: string | null;
  domain?: string | null;
};

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function getWebsiteHost(value?: string | null) {
  const cleanValue = value?.trim();

  if (!cleanValue) {
    return "";
  }

  try {
    return new URL(cleanValue).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return cleanValue
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase();
  }
}

function buildSearchTerms(payload: EmailHistoryRequest) {
  const email = normalizeEmail(payload.email);
  const company = normalize(payload.company);
  const websiteHost = getWebsiteHost(payload.website);
  const domain = normalize(payload.domain);

  return {
    email,
    company,
    domain: domain || websiteHost,
    websiteHost,
  };
}

export async function POST(request: NextRequest) {
  if (!isSupabaseAuthEnabled()) {
    return apiError("Authentication is not enabled.", 401);
  }

  const authResult = await requireAuthenticatedSession(request);

  if (!authResult.ok) {
    return authResult.response;
  }

  let payload: EmailHistoryRequest;

  try {
    payload = (await request.json()) as EmailHistoryRequest;
  } catch {
    return apiError("Invalid JSON payload.", 400);
  }

  const search = buildSearchTerms(payload);

  if (!search.email && !search.company && !search.domain && !search.websiteHost) {
    return apiError("Missing email, company, domain, or website.", 400);
  }

  const inbox = await fetchGmailInbox({
    workspaceId: authResult.session.workspace.id,
    maxResults: 25,
  });

  if (inbox.error) {
    return apiError(inbox.error, 400);
  }

  const messages = inbox.messages.filter((message) => {
    const fromTo = [message.from, message.to].join(" ").toLowerCase();
    const haystack = [
      message.subject,
      message.from,
      message.to,
      message.snippet,
    ]
      .join(" ")
      .toLowerCase();

    if (search.email && fromTo.includes(search.email)) {
      return true;
    }

    if (search.domain && fromTo.includes(search.domain)) {
      return true;
    }

    if (search.websiteHost && fromTo.includes(search.websiteHost)) {
      return true;
    }

    if (search.company && haystack.includes(search.company)) {
      return true;
    }

    return false;
  });

  return apiSuccess({
    messages,
    count: messages.length,
    matchedBy: {
      email: search.email || null,
      domain: search.domain || null,
      websiteHost: search.websiteHost || null,
      company: search.company || null,
    },
  });
}