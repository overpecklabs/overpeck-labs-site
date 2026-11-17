import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PortalFile, PortalMe } from "./types";

const SIGNED_URL_SECONDS = 60 * 60; // 1 hour

/** The signed-in user, verified with the Auth server (never getSession()). */
export const getPortalUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** The caller's portal (null when they have no client_portal_members row). One call per request. */
export const getPortalMe = cache(async (): Promise<PortalMe | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("portal_me");
  if (error || !data) return null;
  return data as PortalMe;
});

/** The client's onboarding uploads with 1-hour signed URLs. RLS limits this to their own clients/{id}/onboarding/ files. */
export async function loadPortalFiles(): Promise<PortalFile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("client_files")
    .select("id, storage_path, label, mime_type, size_bytes, created_at")
    .like("label", "Onboarding:%")
    .order("created_at", { ascending: true })
    .overrideTypes<Omit<PortalFile, "url">[], { merge: false }>();
  const rows = data ?? [];
  if (!rows.length) return [];
  const { data: signed } = await supabase.storage.from("client-files").createSignedUrls(
    rows.map((r) => r.storage_path),
    SIGNED_URL_SECONDS,
  );
  const urls = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
  return rows.map((r) => ({ ...r, url: urls.get(r.storage_path) ?? null }));
}
