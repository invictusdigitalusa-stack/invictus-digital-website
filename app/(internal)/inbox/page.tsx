import type { Metadata } from "next";
import { InboxClient } from "@/components/inbox/InboxClient";
import { OSNavbar } from "@/components/os/OSNavbar";

export const metadata: Metadata = {
  title: "Inbox | Invictus Digital",
  description: "Workspace inbox for Gmail conversations and replies.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function InboxPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <OSNavbar />

      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            Gmail Inbox
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Inbox
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            View Gmail conversations, sent outreach, replies, and future
            lead-linked email activity.
          </p>
        </div>

        <InboxClient />
      </section>
    </main>
  );
}