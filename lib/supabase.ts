import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser client using the PUBLIC publishable (anon) key. Never put a service_role/secret key here.
// The anon role is INSERT-only on the form tables, so callers must use .insert(row) without .select().
let client: SupabaseClient | null = null;

/** Created lazily so the static export build (prerendering) never needs a network client. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return client;
}

export const CALL_US = "Please call (201) 800-4379.";
