// Hand-written row types for the admin back end (public schema). Statuses match the DB CHECK constraints.

/** Pipeline stages, in board order. These are the only statuses the admin writes. */
export const CLIENT_STATUSES = ["prospect", "lead", "hot_lead", "client", "archived"] as const;
/** Old values the DB still allows (until the migration runs). Read-only: mapped via normalizeStage(). */
export const LEGACY_CLIENT_STATUSES = ["active", "paused", "past"] as const;
export const PROJECT_TYPES = ["website", "workflow", "tracking", "ai", "marketing", "other"] as const;
export const PROJECT_STATUSES = ["discovery", "mockup", "design", "build", "review", "launched", "maintenance", "on_hold"] as const;
export const DELIVERABLE_STATUSES = ["todo", "in_progress", "waiting_client", "done"] as const;
export const CHANNELS = ["call", "sms", "email", "meeting", "note"] as const;
export const DIRECTIONS = ["in", "out"] as const;

export type ClientStage = (typeof CLIENT_STATUSES)[number];
export type ClientStatus = ClientStage | (typeof LEGACY_CLIENT_STATUSES)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type DeliverableStatus = (typeof DELIVERABLE_STATUSES)[number];
export type Channel = (typeof CHANNELS)[number];
export type Direction = (typeof DIRECTIONS)[number];

export type Client = {
  id: string;
  business_name: string;
  contact_name: string | null;
  phone: string | null;
  phone_digits: string | null; // generated column: read-only, never written
  email: string | null;
  industry: string | null;
  town: string | null;
  website: string | null;
  google_profile: string | null;
  /** Slug of their private demo page (/demo/{slug}); demo_views link to the client through it. */
  demo_slug: string | null;
  board_position: number | null;
  status_changed_at: string | null;
  status: ClientStatus;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  client_id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  start_date: string | null;
  due_date: string | null;
  launch_date: string | null;
  price: number | string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Deliverable = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: DeliverableStatus;
  due_date: string | null;
  completed_at: string | null; // maintained by a DB trigger
  url: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type Communication = {
  id: string;
  client_id: string;
  project_id: string | null;
  channel: Channel;
  direction: Direction | null;
  summary: string | null;
  body: string | null;
  occurred_at: string;
  external_ref: string | null;
  created_by: string | null;
  created_at: string;
};

export type ClientFile = {
  id: string;
  client_id: string;
  project_id: string | null;
  storage_path: string;
  label: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
};

/** Known questionnaire columns. Any other columns are shown generically on the detail view. */
export type MockupRequest = {
  id: string;
  client_id: string | null;
  business_name: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  industry: string | null;
  town: string | null;
  goals: string[] | null;
  extras: string[] | null;
  timeline: string | null;
  style: string | null;
  brand_colors: string | null;
  logo_url: string | null;
  source_page: string | null;
  retell_call_id: string | null;
  status: string | null;
  created_at: string;
  [column: string]: unknown;
};

export type DemoDevice = "mobile" | "tablet" | "desktop";

/** One page view of a private demo (anon INSERT only; admins read). client_id is set by a DB trigger from clients.demo_slug. */
export type DemoView = {
  slug: string;
  client_id: string | null;
  session_id: string | null;
  referrer: string | null;
  user_agent: string | null;
  device: DemoDevice | null;
  viewed_at: string;
};

export type CallLog = {
  id: string;
  client_id: string | null;
  call_id: string;
  direction: string | null;
  from_number: string | null;
  to_number: string | null;
  start_timestamp: string | number | null;
  duration_seconds: number | null;
  caller_name: string | null;
  business_name: string | null;
  call_summary: string | null;
  next_step: string | null;
  message_for_mark: string | null;
  user_sentiment: string | null;
  transcript: string | null;
  recording_url: string | null;
  retell_call_url: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  client_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  business_name: string | null;
  services: string[] | null;
  message: string | null;
  created_at: string;
};

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };
