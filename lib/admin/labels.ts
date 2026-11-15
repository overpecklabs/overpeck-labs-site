import type { Channel, ClientStage, ClientStatus, DeliverableStatus, ProjectStatus, ProjectType } from "./types";

/** Legacy statuses -> their pipeline stage. */
export const LEGACY_STAGE: Record<string, ClientStage> = { active: "client", paused: "client", past: "archived" };

/** Any stored status (including legacy values) -> its pipeline stage. */
export function normalizeStage(status: string | null | undefined): ClientStage {
  const s = status ?? "";
  if (s in LEGACY_STAGE) return LEGACY_STAGE[s];
  return (["prospect", "lead", "hot_lead", "client", "archived"] as string[]).includes(s) ? (s as ClientStage) : "lead";
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
  archived: "Archived",
};
/** Plural column titles for the pipeline board. */
export const STAGE_COLUMN: Record<ClientStage, string> = {
  prospect: "Prospects",
  lead: "Leads",
  hot_lead: "Hot Leads",
  client: "Clients",
  archived: "Archived",
};

/** Columns collapsed by default on the pipeline board. */
export const STAGE_COLLAPSED: ClientStage[] = ["archived"];
/** One-line meaning per stage (column header tooltip). Empty = no tooltip. */
export const STAGE_HINT: Record<ClientStage, string> = { prospect: "", lead: "", hot_lead: "", client: "", archived: "" };

/** Label for any stored status (legacy values show as their new stage). */
export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  ...STAGE_LABEL,
  active: STAGE_LABEL.client,
  paused: STAGE_LABEL.client,
  past: STAGE_LABEL.archived,
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
  archived: "bg-ink/5 text-ink/70",
  active: "bg-note-green",
  paused: "bg-note-green",
  past: "bg-ink/5 text-ink/70",
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
