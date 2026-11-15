import { CLIENT_STATUSES, type Channel, type ClientStage, type ClientStatus, type DeliverableStatus, type ProjectStatus, type ProjectType } from "./types";

/** Legacy statuses -> their pipeline stage. */
export const LEGACY_STAGE: Record<string, ClientStage> = { active: "client", paused: "client", past: "old_client" };

/** Any stored status (including legacy values) -> its pipeline stage. */
export function normalizeStage(status: string | null | undefined): ClientStage {
  const s = status ?? "";
  if (s in LEGACY_STAGE) return LEGACY_STAGE[s];
  return (CLIENT_STATUSES as readonly string[]).includes(s) ? (s as ClientStage) : "lead";
}

/** All stored values that belong to a stage (for filters/counts while legacy rows still exist). */
export function statusesForStage(stage: ClientStage): string[] {
  return [stage, ...Object.keys(LEGACY_STAGE).filter((k) => LEGACY_STAGE[k] === stage)];
}

export const STAGE_LABEL: Record<ClientStage, string> = {
  prospect: "Prospect",
  lead: "Lead",
  hot_lead: "Hot Lead",
  client: "Client",
  old_client: "Old Client",
  archived: "Archived",
};
/** Plural column titles for the pipeline board. */
export const STAGE_COLUMN: Record<ClientStage, string> = {
  prospect: "Prospects",
  lead: "Leads",
  hot_lead: "Hot Leads",
  client: "Clients",
  old_client: "Old Clients",
  archived: "Archived",
};

/** Columns collapsed by default on the pipeline board. */
export const STAGE_COLLAPSED: ClientStage[] = ["old_client", "archived"];
/** One-line meaning per stage (column header tooltip). Empty = no tooltip. */
export const STAGE_HINT: Record<ClientStage, string> = {
  prospect: "Found on Google Maps or elsewhere, not contacted yet",
  lead: "We've contacted them by text, email or call",
  hot_lead: "They replied with interest or requested a mockup",
  client: "Paying customers",
  old_client: "Were paying, no longer are",
  archived: "Bad leads",
};

/** Label for any stored status (legacy values show as their new stage). */
export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  ...STAGE_LABEL,
  active: STAGE_LABEL.client,
  paused: STAGE_LABEL.client,
  past: STAGE_LABEL.old_client,
};

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  website: "Website",
  workflow: "Workflow",
  tracking: "Tracking",
  ai: "AI",
  marketing: "Marketing",
  other: "Other",
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  discovery: "Discovery",
  mockup: "Mockup",
  design: "Design",
  build: "Build",
  review: "Review",
  launched: "Launched",
  maintenance: "Maintenance",
  on_hold: "On hold",
};

export const DELIVERABLE_STATUS_LABEL: Record<DeliverableStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  waiting_client: "Waiting on client",
  done: "Done",
};

export const CHANNEL_LABEL: Record<Channel, string> = {
  call: "Call",
  sms: "Text",
  email: "Email",
  meeting: "Meeting",
  note: "Note",
};

/** Badge tones (Tailwind classes) per status value. */
export const TONE: Record<string, string> = {
  prospect: "bg-note-blue",
  lead: "bg-note-yellow",
  hot_lead: "bg-[#ffd7c2]",
  client: "bg-note-green",
  old_client: "bg-ink/10",
  archived: "bg-ink/5 text-ink/70",
  active: "bg-note-green",
  paused: "bg-note-green",
  past: "bg-ink/10",
  discovery: "bg-note-yellow",
  mockup: "bg-note-blue",
  design: "bg-note-blue",
  build: "bg-note-teal",
  review: "bg-[#ffe2c6]",
  launched: "bg-note-green",
  maintenance: "bg-note-green",
  on_hold: "bg-ink/10",
  todo: "bg-ink/5",
  in_progress: "bg-note-teal",
  waiting_client: "bg-note-yellow",
  done: "bg-note-green",
};

/** Pipeline order for the project status stepper (on_hold sits outside it). */
export const PIPELINE: ProjectStatus[] = ["discovery", "mockup", "design", "build", "review", "launched", "maintenance"];
/** Projects in these statuses are not "open". */
export const CLOSED_PROJECT_STATUSES: ProjectStatus[] = ["launched", "maintenance"];
