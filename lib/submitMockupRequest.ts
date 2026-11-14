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

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Single entry point for free-mockup requests.
 *
 * TODO: save to Supabase.
 *   1. If `logo` is present, upload it to a Storage bucket (e.g. `mockup-logos/<uuid>`).
 *   2. Insert into table `mockup_requests` (columns mirroring MockupRequest, plus
 *      `logo_path`, `created_at`, `source_url`), via an RLS-protected insert or an
 *      Edge Function so the anon key can only insert.
 *   3. Notify the team (email/SMS) on insert.
 */
export async function submitMockupRequest(payload: MockupRequest, logo: File | null): Promise<SubmitResult> {
  console.log("[mockup request]", { ...payload, submittedAt: new Date().toISOString() }, logo ? `logo file: ${logo.name} (${logo.size} bytes)` : "no logo");
  return { ok: true };
}
