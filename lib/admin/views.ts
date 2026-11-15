import "server-only";
import type { AdminSession } from "./auth";
import { fmtBytes, fmtDate, fmtDateTime, fmtDuration } from "./format";
import type { CallLog, ClientFile, Communication, DemoView } from "./types";
import type { TimelineItem } from "@/components/admin/Timeline";
import type { FileItem } from "@/components/admin/FilesPanel";

type Sb = AdminSession["supabase"];
type DbErr = { message: string; code?: string };

const SIGNED_URL_SECONDS = 60 * 60; // 1 hour

type CommRow = Communication & { projects: { id: string; name: string } | null; clients?: { id: string; business_name: string } | null };

/** Communications (newest first) joined to their Retell call via external_ref = call_logs.call_id. */
export async function loadTimeline(
  supabase: Sb,
  filter: { clientId?: string; projectId?: string; limit?: number; withClient?: boolean },
): Promise<{ items: TimelineItem[]; error: DbErr | null }> {
  let q = supabase
    .from("communications")
    .select(filter.withClient ? "*, projects(id, name), clients(id, business_name)" : "*, projects(id, name)")
    .order("occurred_at", { ascending: false })
    .limit(filter.limit ?? 300);
  if (filter.clientId) q = q.eq("client_id", filter.clientId);
  if (filter.projectId) q = q.eq("project_id", filter.projectId);
  const { data, error } = await q.overrideTypes<CommRow[], { merge: false }>();
  if (error) return { items: [], error };
  const rows = data ?? [];

  const refs = rows.filter((r) => r.channel === "call" && r.external_ref).map((r) => r.external_ref as string);
  const calls = new Map<string, CallLog>();
  if (refs.length) {
    const { data: cl } = await supabase.from("call_logs").select("*").in("call_id", refs).overrideTypes<CallLog[], { merge: false }>();
    (cl ?? []).forEach((c) => calls.set(c.call_id, c));
  }

  const items: TimelineItem[] = rows.map((r) => {
    const c = r.external_ref ? calls.get(r.external_ref) : undefined;
    return {
      id: r.id,
      channel: r.channel,
      direction: r.direction,
      summary: r.summary ?? (c?.call_summary || null),
      body: r.body,
      when: fmtDateTime(r.occurred_at),
      createdBy: r.created_by,
      project: r.projects ? { id: r.projects.id, name: r.projects.name } : null,
      client: r.clients ? { id: r.clients.id, name: r.clients.business_name } : null,
      call: c
        ? {
            retellUrl: c.retell_call_url,
            recordingUrl: c.recording_url,
            transcript: c.transcript,
            duration: fmtDuration(c.duration_seconds),
            nextStep: c.next_step,
            messageForMark: c.message_for_mark,
            sentiment: c.user_sentiment,
          }
        : null,
    };
  });
  return { items, error: null };
}

/** Files with 1-hour signed URLs (view + download). Never public URLs. */
export async function loadFiles(
  supabase: Sb,
  filter: { clientId: string; projectId?: string },
  projectNames: Map<string, string>,
): Promise<{ files: FileItem[]; error: DbErr | null }> {
  let q = supabase.from("client_files").select("*").eq("client_id", filter.clientId).order("created_at", { ascending: false });
  if (filter.projectId) q = q.eq("project_id", filter.projectId);
  const { data, error } = await q.overrideTypes<ClientFile[], { merge: false }>();
  if (error) return { files: [], error };
  const rows = data ?? [];
  if (!rows.length) return { files: [], error: null };

  const paths = rows.map((r) => r.storage_path);
  const bucket = supabase.storage.from("client-files");
  const [view, dl] = await Promise.all([
    bucket.createSignedUrls(paths, SIGNED_URL_SECONDS),
    bucket.createSignedUrls(paths, SIGNED_URL_SECONDS, { download: true }),
  ]);
  const urlFor = (res: typeof view, path: string) => res.data?.find((d) => d.path === path)?.signedUrl ?? null;

  return {
    files: rows.map((r) => ({
      id: r.id,
      label: r.label || r.storage_path.split("/").pop() || "File",
      meta: [fmtBytes(r.size_bytes), fmtDate(r.created_at), r.uploaded_by].filter(Boolean).join(" · "),
      projectName: r.project_id ? (projectNames.get(r.project_id) ?? null) : null,
      viewUrl: urlFor(view, r.storage_path),
      downloadUrl: urlFor(dl, r.storage_path),
    })),
    error: null,
  };
}

/** Signed preview URLs for logos in the private mockup-logos bucket. */
export async function signLogos(supabase: Sb, paths: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const clean = paths.filter(Boolean);
  if (!clean.length) return out;
  const { data } = await supabase.storage.from("mockup-logos").createSignedUrls(clean, SIGNED_URL_SECONDS);
  (data ?? []).forEach((d) => {
    if (d.path && d.signedUrl) out.set(d.path, d.signedUrl);
  });
  return out;
}

export type DemoViewStats = {
  total: number;
  sessions: number;
  last7: number;
  capped: boolean; // unique sessions / last-7 counted from the newest MAX_VIEW_ROWS rows only
  recent: DemoView[];
  error: { message: string; code?: string } | null;
};
const MAX_VIEW_ROWS = 2000;

/** Views for one client: rows the trigger linked by client_id, plus any for their slug from before it was set. */
export async function loadDemoViews(supabase: Sb, { clientId, slug }: { clientId: string; slug: string | null }): Promise<DemoViewStats> {
  const safeSlug = slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null;
  const filter = safeSlug ? `client_id.eq.${clientId},slug.eq.${safeSlug}` : `client_id.eq.${clientId}`;
  const { data, count, error } = await supabase
    .from("demo_views")
    .select("slug, client_id, session_id, referrer, user_agent, device, viewed_at", { count: "exact" })
    .or(filter)
    .order("viewed_at", { ascending: false })
    .limit(MAX_VIEW_ROWS)
    .overrideTypes<DemoView[], { merge: false }>();
  const rows = data ?? [];
  const weekAgo = Date.now() - 7 * 86400000;
  return {
    total: count ?? rows.length,
    sessions: new Set(rows.map((r) => r.session_id ?? `row-${r.viewed_at}`)).size,
    last7: rows.filter((r) => new Date(r.viewed_at).getTime() >= weekAgo).length,
    capped: (count ?? 0) > rows.length,
    recent: rows.slice(0, 20),
    error,
  };
}

export type DemoActivity = {
  recent: (DemoView & { clientName: string | null; hot: boolean })[];
  hot: { id: string; name: string; views: number }[];
  error: { message: string; code?: string } | null;
};

/** Dashboard feed: the 10 newest demo views, plus "hot" clients (3+ views in the last 48 hours). */
export async function loadDemoActivity(supabase: Sb): Promise<DemoActivity> {
  const since = new Date(Date.now() - 48 * 3600000).toISOString();
  const [recent, window48] = await Promise.all([
    supabase.from("demo_views").select("slug, client_id, session_id, referrer, user_agent, device, viewed_at").order("viewed_at", { ascending: false }).limit(10).overrideTypes<DemoView[], { merge: false }>(),
    supabase.from("demo_views").select("client_id").gte("viewed_at", since).not("client_id", "is", null).limit(5000).overrideTypes<{ client_id: string }[], { merge: false }>(),
  ]);
  const error = recent.error ?? window48.error;
  if (error) return { recent: [], hot: [], error };

  const counts = new Map<string, number>();
  (window48.data ?? []).forEach((r) => counts.set(r.client_id, (counts.get(r.client_id) ?? 0) + 1));
  const hotIds = new Set([...counts].filter(([, n]) => n >= 3).map(([id]) => id));

  const ids = [...new Set([...(recent.data ?? []).map((r) => r.client_id).filter((x): x is string => !!x), ...hotIds])];
  const names = new Map<string, string>();
  if (ids.length) {
    const { data } = await supabase.from("clients").select("id, business_name").in("id", ids).overrideTypes<{ id: string; business_name: string }[], { merge: false }>();
    (data ?? []).forEach((c) => names.set(c.id, c.business_name));
  }
  return {
    recent: (recent.data ?? []).map((r) => ({ ...r, clientName: r.client_id ? names.get(r.client_id) ?? null : null, hot: !!r.client_id && hotIds.has(r.client_id) })),
    hot: [...hotIds].map((id) => ({ id, name: names.get(id) ?? "Unknown client", views: counts.get(id) ?? 0 })).sort((a, b) => b.views - a.views),
    error: null,
  };
}
