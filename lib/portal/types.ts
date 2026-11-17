// Client portal: shared types. Wizard steps are declared as data (field specs); the zod schemas, the form renderer,
// the review step and the admin profile view are all generated from the same specs.

export const PLAN_KEYS = ["starter", "growth", "pro"] as const;
export type PortalPlan = (typeof PLAN_KEYS)[number];

export const ONBOARDING_STATUSES = ["not_started", "in_progress", "submitted", "reopened", "complete"] as const;
export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

export const EDITABLE_STATUSES: readonly OnboardingStatus[] = ["not_started", "in_progress", "reopened"];

export type Option = { value: string; label: string };

type FieldBase = {
  key: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Only shown (and only required) when another field in the same step has this value. */
  showIf?: { key: string; equals: string | boolean };
};

export type TextField = FieldBase & { kind: "text"; input?: "text" | "tel" | "email" | "url" | "time"; max?: number; placeholder?: string };
export type TextareaField = FieldBase & { kind: "textarea"; max?: number; placeholder?: string; rows?: number };
export type SelectField = FieldBase & { kind: "select"; options: Option[] };
export type MultiField = FieldBase & { kind: "multi"; options: Option[] };
/** Yes/no switch. Always has an answer, so it never blocks submit. */
export type ToggleField = FieldBase & { kind: "toggle" };
/** A checkbox. When required it must be ticked. */
export type ConsentField = FieldBase & { kind: "consent" };
/** Brand colors: up to four picked colors, or "not sure". */
export type ColorsField = FieldBase & { kind: "colors" };
export type RepeaterField = FieldBase & {
  kind: "repeater";
  itemLabel: string;
  addLabel: string;
  min?: number;
  max: number;
  fields: (TextField | TextareaField)[];
};
/** File upload slot (stored in the private bucket + client_files, not in the answers). */
export type UploadField = FieldBase & { kind: "upload"; slot: "logo" | "photos" };
/** Plain text block. {{support_email}} is filled in on the server, inside the signed-in portal only. */
export type NoteField = FieldBase & { kind: "note"; text: string };

export type Field = TextField | TextareaField | SelectField | MultiField | ToggleField | ConsentField | ColorsField | RepeaterField | UploadField | NoteField;

export type StepDef = {
  id: string;
  title: string;
  /** One sentence under the title. */
  description: string;
  fields: Field[];
  /** The last step: shows every answer, then Submit. */
  review?: boolean;
};

export type WizardDef = {
  plan: PortalPlan;
  planName: string;
  introTitle: string;
  intro: string;
  /** What we'll have when they're done. */
  checklist: string[];
  steps: StepDef[];
};

export type Answers = Record<string, Record<string, unknown>>;

/** Shape returned by the portal_me() database function. */
export type PortalMe = {
  client_id: string;
  business_name: string | null;
  plan: PortalPlan | null;
  subscription_status: "active" | "canceled" | null;
  onboarding_status: OnboardingStatus;
  current_step: string | null;
  answers: Answers;
  submitted_at: string | null;
};

export type OnboardingRow = {
  id: string;
  client_id: string;
  subscription_id: string | null;
  plan: PortalPlan | null;
  status: OnboardingStatus;
  current_step: string | null;
  answers: Answers;
  submitted_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PortalFile = {
  id: string;
  storage_path: string;
  label: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  /** 1-hour signed URL (never a public URL). */
  url: string | null;
  /** Admin only: 1-hour signed URL that downloads instead of opening. */
  downloadUrl?: string | null;
};

export const STATUS_LABEL: Record<OnboardingStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  reopened: "Reopened for edits",
  complete: "Complete",
};

export const UPLOAD_LIMITS = {
  logoBytes: 10 * 1024 * 1024,
  photoBytes: 15 * 1024 * 1024,
  maxPhotos: 40,
} as const;
