export type SettingsSection =
  | "workspace"
  | "team"
  | "integrations"
  | "security"
  | "billing";

export const settingsSections: {
  id: SettingsSection;
  label: string;
  description: string;
}[] = [
  {
    id: "workspace",
    label: "Workspace",
    description: "Workspace identity and access context.",
  },
  {
    id: "team",
    label: "Team",
    description: "Members, roles, and invitations.",
  },
  {
    id: "integrations",
    label: "Integrations",
    description: "Connected services and API providers.",
  },
  {
    id: "security",
    label: "Security",
    description: "Authentication, roles, and permissions.",
  },
  {
    id: "billing",
    label: "Billing",
    description: "Plans, invoices, and payment methods.",
  },
];

export const integrationCards = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Send and track outreach from your workspace inbox.",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync meetings and follow-ups with your calendar.",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Connect payments and subscription billing.",
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Power AI workflows across audit, outreach, and proposals.",
  },
] as const;
