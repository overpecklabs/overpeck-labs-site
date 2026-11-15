import { createBrowserClient } from "@supabase/ssr";

/**
 * Cookie-based browser client for the admin area (keeps the session readable by the server).
 * Uses the PUBLIC publishable key only. The public site forms keep using lib/supabase.ts.
 */
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
