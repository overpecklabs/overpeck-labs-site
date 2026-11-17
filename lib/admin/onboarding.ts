import "server-only";
import type { AdminSession } from "./auth";
import { computeProgress } from "@/lib/portal/schema";
import { getWizard } from "@/lib/portal/wizards";
import type { Answers, OnboardingRow, OnboardingStatus, PortalFile, PortalPlan } from "@/lib/portal/types";

type Sb = AdminSession["supabase"];
type DbErr = { message: string; code?: string };

const SIGNED_URL_SECONDS = 60 * 60; // 1 hour

type SubRow = { id: string; client_id: string | null; email: string; plan: string; status: "active" | "canceled"; created_at: string; canceled_at: string | null };
type InviteRow = { client_id: string; expires_at: string; used_at: string | null; created_at: string };

export type OnboardingListRow = {
  clientId: string;
  business: string;
  email: string;
  plan: PortalPlan | null;
  planRaw: string;
  payment: "active" | "canceled";
  paidAt: string;
  status: OnboardingStatus;
  percent: number;
  lastActivity: string | null;
  /** 0 = needs attention first. */
  attention: "submitted" | "invite_expired" | null;
  hasPortal: boolean;
};

const asPlan = (p: string): PortalPlan | null => (p === "starter" || p === "growth" || p === "pro" ? p : null);

/** One row per paying client (latest subscription, an active one first), with onboarding progress and attention flags. */
export async function loadOnboardingList(supabase: Sb): Promise<{ rows: OnboardingListRow[]; error: DbErr | null }> {
  const subs = await supabase.from("client_subscriptions").select("id, client_id, email, plan, status, created_at, canceled_at").order("created_at", { ascending: false }).overrideTypes<SubRow[], { merge: false }>();
  if (subs.error) return { rows: [], error: subs.error };

  const latest = new Map<string, SubRow>();
  for (const s of subs.data ?? []) {
    if (!s.client_id) continue;
    const cur = latest.get(s.client_id);
    if (!cur || (cur.status !== "active" && s.status === "active")) latest.set(s.client_id, s);
  }
  const ids = [...latest.keys()];
  if (!ids.length) return { rows: [], error: null };

  const [clients, onboarding, invites, members] = await Promise.all([
    supabase.from("clients").select("id, business_name").in("id", ids).overrideTypes<{ id: string; business_name: string }[], { merge: false }>(),
    supabase.from("client_onboarding").select("*").in("client_id", ids).overrideTypes<OnboardingRow[], { merge: false }>(),
    supabase.from("onboarding_invites").select("client_id, expires_at, used_at, created_at").in("client_id", ids).order("created_at", { ascending: false }).overrideTypes<InviteRow[], { merge: false }>(),
    supabase.from("client_portal_members").select("client_id").in("client_id", ids).overrideTypes<{ client_id: string }[], { merge: false }>(),
  ]);
  const err = clients.error ?? onboarding.error ?? invites.error ?? members.error;
  if (err) return { rows: [], error: err };

  const names = new Map((clients.data ?? []).map((c) => [c.id, c.business_name]));
  const ob = new Map((onboarding.data ?? []).map((o) => [o.client_id, o]));
  const lastInvite = new Map<string, InviteRow>();
  for (const i of invites.data ?? []) if (!lastInvite.has(i.client_id)) lastInvite.set(i.client_id, i);
  const withPortal = new Set((members.data ?? []).map((m) => m.client_id));
  const now = Date.now();

  const rows = ids.map((id): OnboardingListRow => {
    const s = latest.get(id)!;
    const o = ob.get(id);
    const plan = o?.plan ?? asPlan(s.plan);
    const status = o?.status ?? "not_started";
    const wizard = getWizard(plan);
    const inv = lastInvite.get(id);
    const hasPortal = withPortal.has(id);
    const expired = !hasPortal && !!inv && !inv.used_at && new Date(inv.expires_at).getTime() < now;
    return {
      clientId: id,
      business: names.get(id) ?? "(unnamed)",
      email: s.email,
      plan,
      planRaw: s.plan,
      payment: s.status,
      paidAt: s.created_at,
      status,
      percent: wizard ? computeProgress(wizard, o?.answers ?? {}, status).percent : 0,
      lastActivity: o?.updated_at ?? null,
      attention: status === "submitted" ? "submitted" : expired ? "invite_expired" : null,
      hasPortal,
    };
  });
  return { rows, error: null };
}

export type ClientOnboardingDetail = {
  onboarding: OnboardingRow | null;
  files: PortalFile[];
  members: { email: string; created_at: string }[];
  invite: { expires_at: string; used_at: string | null; created_at: string } | null;
  subscription: { plan: string; status: string; created_at: string } | null;
};

/** Everything the admin Onboarding tab needs for one client. Files get 1-hour signed URLs (never public URLs). */
export async function loadClientOnboarding(supabase: Sb, clientId: string): Promise<{ detail: ClientOnboardingDetail; error: DbErr | null }> {
  const empty: ClientOnboardingDetail = { onboarding: null, files: [], members: [], invite: null, subscription: null };
  const [ob, files, members, invites, subs] = await Promise.all([
    supabase.from("client_onboarding").select("*").eq("client_id", clientId).maybeSingle<OnboardingRow>(),
    supabase.from("client_files").select("id, storage_path, label, mime_type, size_bytes, created_at").eq("client_id", clientId).like("label", "Onboarding:%").order("created_at", { ascending: true }).overrideTypes<Omit<PortalFile, "url">[], { merge: false }>(),
    supabase.from("client_portal_members").select("email, created_at").eq("client_id", clientId).overrideTypes<{ email: string; created_at: string }[], { merge: false }>(),
    supabase.from("onboarding_invites").select("expires_at, used_at, created_at").eq("client_id", clientId).order("created_at", { ascending: false }).limit(1).overrideTypes<{ expires_at: string; used_at: string | null; created_at: string }[], { merge: false }>(),
    supabase.from("client_subscriptions").select("plan, status, created_at").eq("client_id", clientId).order("created_at", { ascending: false }).limit(1).overrideTypes<{ plan: string; status: string; created_at: string }[], { merge: false }>(),
  ]);
  const err = ob.error ?? files.error ?? members.error ?? invites.error ?? subs.error;
  if (err) return { detail: empty, error: err };

  const rows = files.data ?? [];
  let urls = new Map<string, string>();
  let downloads = new Map<string, string>();
  if (rows.length) {
    const paths = rows.map((r) => r.storage_path);
    const bucket = supabase.storage.from("client-files");
    const [view, dl] = await Promise.all([bucket.createSignedUrls(paths, SIGNED_URL_SECONDS), bucket.createSignedUrls(paths, SIGNED_URL_SECONDS, { download: true })]);
    const toMap = (res: typeof view) => new Map((res.data ?? []).flatMap((s) => (s.path && s.signedUrl ? [[s.path, s.signedUrl] as const] : [])));
    urls = toMap(view);
    downloads = toMap(dl);
  }
  return {
    detail: {
      onboarding: ob.data ?? null,
      files: rows.map((r) => ({ ...r, url: urls.get(r.storage_path) ?? null, downloadUrl: downloads.get(r.storage_path) ?? null })),
      members: members.data ?? [],
      invite: invites.data?.[0] ?? null,
      subscription: subs.data?.[0] ?? null,
    },
    error: null,
  };
}

export type { Answers };
