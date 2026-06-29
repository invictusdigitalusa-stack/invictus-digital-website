"use client";

import { useEffect, useMemo, useState } from "react";

type GmailInboxMessage = {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  labelIds: string[];
};

type InboxApiResponse = {
  messages?: GmailInboxMessage[];
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

function getMessageStatus(message: GmailInboxMessage) {
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

function getStatusClassName(status: string) {
  if (status === "Unread") {
    return "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]";
  }

  if (status === "Sent") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  }

  return "border-white/[0.10] bg-white/[0.04] text-zinc-300";
}

export function InboxClient() {
  const [messages, setMessages] = useState<GmailInboxMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadInbox() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/integrations/gmail/inbox", {
        method: "GET",
      });

      const data = (await response.json()) as InboxApiResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load inbox.");
      }

      const nextMessages = data.messages ?? [];

      setMessages(nextMessages);
      setSelectedMessageId((current) => current ?? nextMessages[0]?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load inbox.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadInbox();
  }, []);

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) ?? null,
    [messages, selectedMessageId]
  );

  const unreadCount = messages.filter((message) =>
    message.labelIds.includes("UNREAD")
  ).length;

  const sentCount = messages.filter((message) =>
    message.labelIds.includes("SENT")
  ).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03]">
        <div className="border-b border-white/[0.08] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Gmail Messages
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {messages.length} messages · {unreadCount} unread · {sentCount} sent
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadInbox()}
              disabled={isLoading}
              className="rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="p-5 text-sm text-red-300">{error}</div>
        ) : null}

        <div className="max-h-[680px] overflow-y-auto p-3">
          {isLoading ? (
            <div className="p-5 text-sm text-zinc-500">Loading inbox...</div>
          ) : null}

          {!isLoading && messages.length === 0 ? (
            <div className="p-5 text-sm text-zinc-500">
              No Gmail messages found.
            </div>
          ) : null}

          {!isLoading
            ? messages.map((message) => {
                const status = getMessageStatus(message);
                const selected = message.id === selectedMessageId;

                return (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => setSelectedMessageId(message.id)}
                    className={`mb-3 w-full rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-[#22C55E]/40 bg-[#22C55E]/10"
                        : "border-white/[0.08] bg-black/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-1 text-sm font-semibold text-white">
                        {message.subject}
                      </p>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClassName(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-1 text-xs text-zinc-500">
                      {message.from}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                      {message.snippet}
                    </p>

                    <p className="mt-3 text-xs text-zinc-600">
                      {formatDate(message.date)}
                    </p>
                  </button>
                );
              })
            : null}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 md:p-8">
        {selectedMessage ? (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
                  Conversation
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {selectedMessage.subject}
                </h2>

                <p className="mt-3 text-sm text-zinc-500">
                  {formatDate(selectedMessage.date)}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClassName(
                  getMessageStatus(selectedMessage)
                )}`}
              >
                {getMessageStatus(selectedMessage)}
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-600">
                  From
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  {selectedMessage.from || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-600">
                  To
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  {selectedMessage.to || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-600">
                  Preview
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {selectedMessage.snippet || "No preview available."}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-600">
                  Gmail Metadata
                </p>
                <div className="mt-3 space-y-2 text-xs text-zinc-500">
                  <p>Message ID: {selectedMessage.id}</p>
                  <p>Thread ID: {selectedMessage.threadId}</p>
                  <p>Labels: {selectedMessage.labelIds.join(", ") || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Select a message.</p>
        )}
      </section>
    </div>
  );
}