import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: User;
  email: string;
};

/**
 * Confirms the request belongs to a signed-in admin, or redirects. RLS lets a signed-in user read
 * only their own admin_users row: 1 row means admin, 0 rows (or an error) means not an admin.
 * Cached per request so the layout and the page share one check.
 */
export const requireAdmin = cache(async (): Promise<AdminSession> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase.from("admin_users").select("email").limit(1).overrideTypes<{ email: string }[], { merge: false }>();
  if (error || !data || data.length === 0) {
    // Cookies can only be cleared from a route handler, so the sign-out happens there.
    redirect("/auth/signout?error=not_authorized");
  }
  return { supabase, user, email: user.email ?? data[0].email };
});
