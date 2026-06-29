import Link from "next/link";
import type { LeadRow } from "@/lib/supabase";
import { LeadEmailHistoryClient } from "./LeadEmailHistoryClient";

type LeadEmailHistoryProps = {
  lead: LeadRow;
};

export function LeadEmailHistory({ lead }: LeadEmailHistoryProps) {
  return (
    <section className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
            Gmail History
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            Email activity
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Messages are matched by lead email first, then company and domain.
          </p>
        </div>

        <Link
          href="/inbox"
          className="rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
        >
          Open Inbox
        </Link>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <InfoCard label="Email" value={lead.email ?? "No email saved"} />
        <InfoCard label="Contact" value={lead.contact_name ?? "No contact"} />
        <InfoCard label="Phone" value={lead.phone ?? "No phone saved"} />
        <InfoCard label="Domain" value={lead.domain ?? "No domain saved"} />
      </div>

      <LeadEmailHistoryClient
        company={lead.company}
        website={lead.website}
        email={lead.email}
        domain={lead.domain}
      />
    </section>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-zinc-600">
        {label}
      </p>
      <p className="mt-2 truncate text-sm text-zinc-300">{value}</p>
    </div>
  );
}