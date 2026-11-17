import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser client using the PUBLIC publishable (anon) key. Never put a service_role/secret key here.
// The anon role is INSERT-only on the form tables, so callers must use .insert(row) without .select().
let client: SupabaseClient | null = null;

/** Created lazily so the static export build (prerendering) never needs a network client. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      // own storage key, so it never collides with the admin session client if both load on one page
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: "ol-public-forms" },
    });
  }
  return client;
}

export const CALL_US = "Please call (201) 949-7695.";
