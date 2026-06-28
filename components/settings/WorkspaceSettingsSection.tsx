import { Card } from "@/components/ui/Card";
import type { Session } from "@/lib/auth/types";

type WorkspaceStats = {
  memberCount: number;
  createdAt: string | null;
};

type WorkspaceSettingsSectionProps = {
  session: Session | null;
  workspaceStats: WorkspaceStats | null;
  supabaseAuthEnabled: boolean;
};

function SettingsField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm text-zinc-100">{value}</p>
    </div>
  );
}

function formatRole(role: string | undefined) {
  if (!role) {
    return "—";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatCreatedDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function WorkspaceSettingsSection({
  session,
  workspaceStats,
  supabaseAuthEnabled,
}: WorkspaceSettingsSectionProps) {
  const authStatus = session?.user ? "Authenticated" : "Anonymous";
  const authenticationLabel = supabaseAuthEnabled
    ? "Supabase Auth ✓"
    : "Supabase Auth ✗";

  return (
    <Card className="p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsField
          label="Workspace Name"
          value={session?.workspace?.name ?? "—"}
        />
        <SettingsField
          label="Workspace Slug"
          value={session?.workspace?.slug ?? "—"}
        />
        <SettingsField
          label="Workspace ID"
          value={session?.workspace?.id ?? "—"}
        />
        <SettingsField
          label="Current Role"
          value={formatRole(session?.role)}
        />
        <SettingsField
          label="Members"
          value={
            workspaceStats ? workspaceStats.memberCount.toString() : "—"
          }
        />
        <SettingsField
          label="Permissions"
          value={session?.permissions?.length?.toString() ?? "—"}
        />
        <SettingsField
          label="Created"
          value={formatCreatedDate(workspaceStats?.createdAt)}
        />
      </div>

      <div className="mt-6 grid gap-4 border-t border-white/[0.08] pt-6 sm:grid-cols-2">
        <SettingsField label="Authentication" value={authenticationLabel} />
        <SettingsField label="Status" value={authStatus} />
      </div>
    </Card>
  );
}
