import { getSupabase } from "./supabase";

export const TIMELINES = [
  { value: "asap", label: "ASAP", d: "As soon as possible" },
  { value: "one_month", label: "Within a month", d: "In the next few weeks" },
  { value: "one_year", label: "Within a year", d: "Planning ahead" },
  { value: "just_looking", label: "Just looking", d: "Exploring options" },
] as const;
export type Timeline = (typeof TIMELINES)[number]["value"];

export type MockupRequest = {
  business: {
    name: string;
    industry: string;
    industryOther: string;
    area: string;
    years: string;
    website: string;
    noWebsite: boolean;
    gbp: string;
  };
  customers: {
    services: [string, string, string];
    ideal: string;
    jobValue: string;
    different: string;
  };
  goals: {
    timeline: Timeline | "";
    goals: string[];
    headache: string;
  };
  look: {
    style: string;
    primary: string;
    accent: string;
    pickForMe: boolean;
    /** metadata only; the file itself is passed separately */
    logo: { name: string; type: string; size: number } | null;
    likes: [string, string];
  };
  extras: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
    bestTime: string;
    method: string;
    consent: boolean;
  };
};

export type SubmitResult = { ok: true; logoFailed: boolean } | { ok: false; error: string };

const MAX_LOGO = 5 * 1024 * 1024;
const blank = (v: string) => (v.trim() ? v.trim() : null);

function safeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (cleaned || "logo").slice(-80);
}

/** Uploads to the private `mockup-logos` bucket. Returns the storage path, or null on any failure. */
async function uploadLogo(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/") || file.size > MAX_LOGO) return null;
  const path = `${crypto.randomUUID()}/${safeFileName(file.name)}`;
  const { error } = await getSupabase().storage.from("mockup-logos").upload(path, file, { upsert: false, contentType: file.type });
  if (error) {
    console.error("[mockup request] logo upload failed", error);
    return null;
  }
  return path;
}

/**
 * Saves a free-mockup request to Supabase (`mockup_requests`).
 * Anon can only INSERT: no .select()/upsert, and id/created_at/status are left to the database.
 * `honeypot` is the hidden spam field: if filled, nothing is saved but we report success.
 */
export async function submitMockupRequest(payload: MockupRequest, logo: File | null, honeypot = ""): Promise<SubmitResult> {
  if (honeypot.trim()) return { ok: true, logoFailed: false };
  if (!payload.contact.consent) return { ok: false, error: "Consent is required." };

  let logoPath: string | null = null;
  let logoFailed = false;
  if (logo) {
    logoPath = await uploadLogo(logo);
    logoFailed = logoPath === null;
  }

  const b = payload.business;
  const c = payload.customers;
  const l = payload.look;
  const ct = payload.contact;
  const sourcePage = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/free-mockup";

  const row = {
    business_name: b.name.trim(),
    industry: b.industry === "Other" ? blank(b.industryOther) ?? "Other" : blank(b.industry),
    town: blank(b.area),
    years_in_business: blank(b.years),
    current_website: b.noWebsite ? null : blank(b.website),
    no_website: b.noWebsite,
    google_profile: blank(b.gbp),
    top_services: blank(c.services.filter((s) => s.trim()).join(", ")),
    ideal_customer: blank(c.ideal),
    avg_job_value: blank(c.jobValue),
    differentiator: blank(c.different),
    timeline: payload.goals.timeline || null,
    goals: payload.goals.goals,
    biggest_headache: blank(payload.goals.headache),
    style: blank(l.style),
    brand_colors: l.pickForMe ? "Pick for me" : `${l.primary}, ${l.accent}`,
    logo_url: logoPath,
    inspiration_sites: blank(l.likes.filter((u) => u.trim()).join(", ")),
    extras: payload.extras,
    contact_name: ct.name.trim(),
    phone: ct.phone.trim(),
    email: blank(ct.email),
    best_time: blank(ct.bestTime),
    contact_method: blank(ct.method),
    consent: true,
    source_page: sourcePage,
    raw: { ...payload, logo_path: logoPath, logo_upload_failed: logoFailed, submitted_at: new Date().toISOString() },
  };

  const { error } = await getSupabase().from("mockup_requests").insert(row);
  if (error) {
    console.error("[mockup request] insert failed", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, logoFailed };
}
