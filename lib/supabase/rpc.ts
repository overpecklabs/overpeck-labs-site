import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less client with the PUBLIC anon key, for calling secret-checked SECURITY DEFINER functions from the server
 * (the same pattern as the Stripe webhook). Pass BILLING_RPC_SECRET as the function's p_secret. No service role key.
 */
export function anonRpcClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
