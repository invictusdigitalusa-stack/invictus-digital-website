"use client";

import { useEffect, useState } from "react";

type LeadEmailHistoryClientProps = {
  company: string | null;
  website: string | null;
  email: string | null;
  domain: string | null;
};

type EmailHistoryMessage = {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  labelIds: string[];
};

type EmailHistoryResponse = {
  messages?: EmailHistoryMessage[];
  count?: number;
  error?: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatus(message: EmailHistoryMessage) {
  if (message.labelIds.includes("UNREAD")) {
    return "Unread";
  }

  if (message.labelIds.includes("SENT")) {
    return "Sent";
  }

  if (message.labelIds.includes("INBOX")) {
    return "Inbox";
  }

  return "Email";
}

export function LeadEmailHistoryClient({
  company,
  website,
  email,
  domain,
}: LeadEmailHistoryClientProps) {
  const [messages, setMessages] = useState<EmailHistoryMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadEmailHistory() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/crm/email-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          website,
          email,
          domain,
        }),
      });

      const data = (await response.json()) as EmailHistoryResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load email history.");
      }

      setMessages(data.messages ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load email history."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadEmailHistory();
  }, [company, website, email, domain]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-sm text-zinc-500">
        Loading Gmail history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-sm text-zinc-500">
        No matching Gmail messages found for this lead yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-500">
        {messages.length} matching Gmail message
        {messages.length === 1 ? "" : "s"} found.
      </p>

      {messages.map((message) => (
        <div
          key={message.id}
          className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">
                {message.subject}
              </p>

              <p className="mt-1 text-xs text-zinc-500">{message.from}</p>
            </div>

            <span className="rounded-full border border-white/[0.10] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
              {getStatus(message)}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {message.snippet}
          </p>

          <p className="mt-3 text-xs text-zinc-600">
            {formatDate(message.date)}
          </p>
        </div>
      ))}
    </div>
  );
}