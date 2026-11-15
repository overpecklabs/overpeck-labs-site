import "server-only";
import type { AdminSession } from "./auth";
import { fmtBytes, fmtDate, fmtDateTime, fmtDuration } from "./format";
import type { CallLog, ClientFile, Communication } from "./types";
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
