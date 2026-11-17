import { createBrowserClient } from "@supabase/ssr";

/**
 * Cookie-based browser client for the admin area (keeps the session readable by the server).
 * Uses the PUBLIC publishable key only. The public site forms keep using lib/supabase.ts.
 */
let client: ReturnType<typeof createBrowserClient> | null = null;

/** One shared instance per page (several auth clients on one page make Supabase warn and race on storage). */
export function createClient() {
  if (!client) client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return client;
}
