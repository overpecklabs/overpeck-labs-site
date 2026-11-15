import type { Channel, ClientStatus, DeliverableStatus, ProjectStatus, ProjectType } from "./types";

export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  lead: "Lead",
  prospect: "Prospect",
  active: "Active",
  paused: "Paused",
  past: "Past",
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
  lead: "bg-note-yellow",
  prospect: "bg-note-blue",
  active: "bg-note-green",
  paused: "bg-ink/10",
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
