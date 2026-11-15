"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { friendlyError } from "@/lib/admin/errors";
import { nyLocalToIso } from "@/lib/admin/format";
import { PROJECT_STATUS_LABEL } from "@/lib/admin/labels";
import {
  CHANNELS,
  CLIENT_STATUSES,
  DELIVERABLE_STATUSES,
  DIRECTIONS,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  type ActionResult,
  type ProjectStatus,
} from "@/lib/admin/types";

// Every action re-checks the admin session (server actions are public endpoints) and runs as the
// signed-in user, so RLS enforces access. No service_role key anywhere.

const MAX_FILE_BYTES = 50 * 1024 * 1024;

const nullify = (v: string) => (v === "" ? null : v);
const text = (max: number) => z.string().trim().max(max, `Keep it under ${max} characters`).transform(nullify);
const day = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use a valid date")
  .transform(nullify);
const email = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email")
  .transform(nullify);
const idSchema = z.string().trim().min(1).max(64).regex(/^[A-Za-z0-9-]+$/, "Invalid id");
const optionalId = z
  .string()
  .trim()
  .max(64)
  .refine((v) => v === "" || /^[A-Za-z0-9-]+$/.test(v), "Invalid id")
  .transform(nullify);

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

function firstIssue(e: z.ZodError): string {
  return e.issues[0]?.message ?? "Please check the form.";
}

function done(): void {
  revalidatePath("/admin", "layout");
}

const fail = (error: string): ActionResult => ({ ok: false, error });
const NOT_FOUND = "Not authorized, or this record no longer exists.";

// ---------- clients ----------

const clientSchema = z.object({
  business_name: z.string().trim().min(1, "Business name is required").max(200),
  contact_name: text(200),
  phone: text(40),
  email,
  industry: text(100),
  town: text(100),
  website: text(300),
  google_profile: text(500),
  status: z.enum(CLIENT_STATUSES, { message: "Pick a status" }),
  source: text(100),
  notes: text(20000),
});

function readClient(fd: FormData) {
  return clientSchema.safeParse({
    business_name: str(fd, "business_name"),
    contact_name: str(fd, "contact_name"),
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    industry: str(fd, "industry"),
    town: str(fd, "town"),
    website: str(fd, "website"),
    google_profile: str(fd, "google_profile"),
    status: str(fd, "status") || "lead",
    source: str(fd, "source"),
    notes: str(fd, "notes"),
  });
}

export async function createClientAction(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = readClient(fd);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { data, error } = await supabase.from("clients").insert(parsed.data).select("id").single<{ id: string }>();
  if (error || !data) return fail(friendlyError(error, "Couldn't add the client."));
  done();
  redirect(`/admin/clients/${data.id}`);
}

export async function updateClientAction(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const id = idSchema.safeParse(str(fd, "id"));
  if (!id.success) return fail("Invalid client.");
  const parsed = readClient(fd);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { error, count } = await supabase.from("clients").update(parsed.data, { count: "exact" }).eq("id", id.data);
  if (error) return fail(friendlyError(error, "Couldn't save the client."));
  if (!count) return fail(NOT_FOUND);
  done();
  redirect(`/admin/clients/${id.data}`);
}

export async function setClientStatus(id: string, status: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  const ps = z.enum(CLIENT_STATUSES).safeParse(status);
  if (!pid.success || !ps.success) return fail("Invalid status.");
  const { error, count } = await supabase.from("clients").update({ status: ps.data }, { count: "exact" }).eq("id", pid.data);
  if (error) return fail(friendlyError(error, "Couldn't update the status."));
  if (!count) return fail(NOT_FOUND);
  done();
  return { ok: true };
}

export async function deleteClient(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  if (!pid.success) return fail("Invalid client.");
  // The DB cascades rows; storage objects are removed here so no orphaned files remain.
  const { data: files } = await supabase.from("client_files").select("storage_path").eq("client_id", pid.data).overrideTypes<{ storage_path: string }[], { merge: false }>();
  const paths = (files ?? []).map((f) => f.storage_path);
  if (paths.length) await supabase.storage.from("client-files").remove(paths);
  const { error, count } = await supabase.from("clients").delete({ count: "exact" }).eq("id", pid.data);
  if (error) return fail(friendlyError(error, "Couldn't delete the client."));
  if (!count) return fail(NOT_FOUND);
  done();
  redirect("/admin/clients");
}

// ---------- projects ----------

const price = z
  .string()
  .trim()
  .transform((v) => v.replace(/[$,\s]/g, ""))
  .refine((v) => v === "" || (/^\d+(\.\d{1,2})?$/.test(v) && Number(v) < 1e9), "Enter a price like 1500 or 1500.00")
  .transform((v) => (v === "" ? null : Number(v)));

const projectSchema = z.object({
  client_id: idSchema,
  name: z.string().trim().min(1, "Project name is required").max(200),
  type: z.enum(PROJECT_TYPES, { message: "Pick a type" }),
  status: z.enum(PROJECT_STATUSES, { message: "Pick a status" }),
  start_date: day,
  due_date: day,
  launch_date: day,
  price,
  notes: text(20000),
});

function readProject(fd: FormData) {
  return projectSchema.safeParse({
    client_id: str(fd, "client_id"),
    name: str(fd, "name"),
    type: str(fd, "type") || "website",
    status: str(fd, "status") || "discovery",
    start_date: str(fd, "start_date"),
    due_date: str(fd, "due_date"),
    launch_date: str(fd, "launch_date"),
    price: str(fd, "price"),
    notes: str(fd, "notes"),
  });
}

export async function createProjectAction(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = readProject(fd);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { data, error } = await supabase.from("projects").insert(parsed.data).select("id").single<{ id: string }>();
  if (error || !data) return fail(friendlyError(error, "Couldn't add the project."));
  done();
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProjectAction(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase, email: me } = await requireAdmin();
  const id = idSchema.safeParse(str(fd, "id"));
  if (!id.success) return fail("Invalid project.");
  const parsed = readProject(fd);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { data: before } = await supabase.from("projects").select("status").eq("id", id.data).maybeSingle<{ status: ProjectStatus }>();
  const { error, count } = await supabase.from("projects").update(parsed.data, { count: "exact" }).eq("id", id.data);
  if (error) return fail(friendlyError(error, "Couldn't save the project."));
  if (!count) return fail(NOT_FOUND);
  if (before && before.status !== parsed.data.status) {
    await logStatusNote(supabase, parsed.data.client_id, id.data, before.status, parsed.data.status, me);
  }
  done();
  return { ok: true };
}

async function logStatusNote(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  clientId: string,
  projectId: string,
  from: ProjectStatus,
  to: ProjectStatus,
  me: string,
) {
  const label = (s: ProjectStatus) => PROJECT_STATUS_LABEL[s].toLowerCase();
  await supabase.from("communications").insert({
    client_id: clientId,
    project_id: projectId,
    channel: "note",
    direction: null,
    summary: `Project status: ${label(from)} → ${label(to)}`,
    occurred_at: new Date().toISOString(),
    created_by: me,
  });
}

export async function setProjectStatus(id: string, status: string): Promise<ActionResult> {
  const { supabase, email: me } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  const ps = z.enum(PROJECT_STATUSES).safeParse(status);
  if (!pid.success || !ps.success) return fail("Invalid status.");
  const { data: before, error: readErr } = await supabase
    .from("projects")
    .select("status, client_id")
    .eq("id", pid.data)
    .maybeSingle<{ status: ProjectStatus; client_id: string }>();
  if (readErr) return fail(friendlyError(readErr));
  if (!before) return fail(NOT_FOUND);
  if (before.status === ps.data) return { ok: true };
  const { error, count } = await supabase.from("projects").update({ status: ps.data }, { count: "exact" }).eq("id", pid.data);
  if (error) return fail(friendlyError(error, "Couldn't change the status."));
  if (!count) return fail(NOT_FOUND);
  await logStatusNote(supabase, before.client_id, pid.data, before.status, ps.data, me);
  done();
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  if (!pid.success) return fail("Invalid project.");
  const { data: p } = await supabase.from("projects").select("client_id").eq("id", pid.data).maybeSingle<{ client_id: string }>();
  const { error, count } = await supabase.from("projects").delete({ count: "exact" }).eq("id", pid.data);
  if (error) return fail(friendlyError(error, "Couldn't delete the project."));
  if (!count) return fail(NOT_FOUND);
  done();
  redirect(p ? `/admin/clients/${p.client_id}` : "/admin/projects");
}

// ---------- deliverables ----------

const deliverableSchema = z.object({
  title: z.string().trim().min(1, "Give the deliverable a title").max(300),
  description: text(5000),
  status: z.enum(DELIVERABLE_STATUSES, { message: "Pick a status" }),
  due_date: day,
  url: text(1000),
});

function readDeliverable(fd: FormData) {
  return deliverableSchema.safeParse({
    title: str(fd, "title"),
    description: str(fd, "description"),
    status: str(fd, "status") || "todo",
    due_date: str(fd, "due_date"),
    url: str(fd, "url"),
  });
}

export async function createDeliverable(projectId: string, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(projectId);
  if (!pid.success) return fail("Invalid project.");
  const parsed = readDeliverable(fd);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { data: last } = await supabase
    .from("deliverables")
    .select("sort_order")
    .eq("project_id", pid.data)
    .order("sort_order", { ascending: false, nullsFirst: false })
    .limit(1)
    .overrideTypes<{ sort_order: number | null }[], { merge: false }>();
  const sort_order = (last?.[0]?.sort_order ?? -1) + 1;
  const { error } = await supabase.from("deliverables").insert({ ...parsed.data, project_id: pid.data, sort_order });
  if (error) return fail(friendlyError(error, "Couldn't add the deliverable."));
  done();
  return { ok: true };
}

export async function updateDeliverable(id: string, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  if (!pid.success) return fail("Invalid deliverable.");
  const parsed = readDeliverable(fd);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const { error, count } = await supabase.from("deliverables").update(parsed.data, { count: "exact" }).eq("id", pid.data);
  if (error) return fail(friendlyError(error, "Couldn't save the deliverable."));
  if (!count) return fail(NOT_FOUND);
  done();
  return { ok: true };
}

/** completed_at is set/cleared by a DB trigger, so only the status is written. */
export async function setDeliverableStatus(id: string, status: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  const ps = z.enum(DELIVERABLE_STATUSES).safeParse(status);
  if (!pid.success || !ps.success) return fail("Invalid status.");
  const { error, count } = await supabase.from("deliverables").update({ status: ps.data }, { count: "exact" }).eq("id", pid.data);
  if (error) return fail(friendlyError(error, "Couldn't update the deliverable."));
  if (!count) return fail(NOT_FOUND);
  done();
  return { ok: true };
}

export async function moveDeliverable(id: string, dir: "up" | "down"): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  if (!pid.success || (dir !== "up" && dir !== "down")) return fail("Invalid move.");
  const { data: me } = await supabase.from("deliverables").select("project_id").eq("id", pid.data).maybeSingle<{ project_id: string }>();
  if (!me) return fail(NOT_FOUND);
  const { data: rows, error } = await supabase
    .from("deliverables")
    .select("id, sort_order")
    .eq("project_id", me.project_id)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })
    .overrideTypes<{ id: string; sort_order: number | null }[], { merge: false }>();
  if (error || !rows) return fail(friendlyError(error));
  const ids = rows.map((r) => r.id);
  const i = ids.indexOf(pid.data);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return { ok: true };
  [ids[i], ids[j]] = [ids[j], ids[i]];
  // Renumber 0..n so the order is always stable, touching only rows whose position changed.
  const updates = ids
    .map((rid, idx) => ({ rid, idx }))
    .filter(({ rid, idx }) => rows.find((r) => r.id === rid)?.sort_order !== idx);
  for (const { rid, idx } of updates) {
    const { error: e } = await supabase.from("deliverables").update({ sort_order: idx }).eq("id", rid);
    if (e) return fail(friendlyError(e, "Couldn't reorder."));
  }
  done();
  return { ok: true };
}

export async function deleteDeliverable(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  if (!pid.success) return fail("Invalid deliverable.");
  const { error, count } = await supabase.from("deliverables").delete({ count: "exact" }).eq("id", pid.data);
  if (error) return fail(friendlyError(error, "Couldn't delete the deliverable."));
  if (!count) return fail(NOT_FOUND);
  done();
  return { ok: true };
}

// ---------- communications ----------

const commSchema = z.object({
  client_id: idSchema,
  project_id: optionalId,
  channel: z.enum(CHANNELS, { message: "Pick a channel" }),
  direction: z.union([z.enum(DIRECTIONS), z.literal("")]).transform((v) => (v === "" ? null : v)),
  summary: text(500),
  body: text(20000),
  occurred_at: z.string().trim(),
});

export async function logCommunication(fd: FormData): Promise<ActionResult> {
  const { supabase, email: me } = await requireAdmin();
  const parsed = commSchema.safeParse({
    client_id: str(fd, "client_id"),
    project_id: str(fd, "project_id"),
    channel: str(fd, "channel"),
    direction: str(fd, "direction"),
    summary: str(fd, "summary"),
    body: str(fd, "body"),
    occurred_at: str(fd, "occurred_at"),
  });
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const v = parsed.data;
  if (!v.summary && !v.body) return fail("Add a summary or some details.");
  const occurred_at = v.occurred_at ? nyLocalToIso(v.occurred_at) : new Date().toISOString();
  if (!occurred_at) return fail("Use a valid date and time.");
  if (v.project_id) {
    const { data: p } = await supabase.from("projects").select("client_id").eq("id", v.project_id).maybeSingle<{ client_id: string }>();
    if (!p || p.client_id !== v.client_id) return fail("That project belongs to a different client.");
  }
  const { error } = await supabase.from("communications").insert({
    client_id: v.client_id,
    project_id: v.project_id,
    channel: v.channel,
    direction: v.channel === "note" ? null : v.direction,
    summary: v.summary,
    body: v.body,
    occurred_at,
    created_by: me,
  });
  if (error) return fail(friendlyError(error, "Couldn't save the entry."));
  done();
  return { ok: true };
}

// ---------- files ----------

const fileSchema = z.object({
  client_id: idSchema,
  project_id: optionalId,
  storage_path: z.string().min(1).max(600),
  label: text(300),
  mime_type: text(200),
  size_bytes: z.number().int().min(0).max(MAX_FILE_BYTES, "Files must be 50 MB or smaller"),
});

/** Called after the browser uploads to the private client-files bucket with the admin's session. */
export async function recordClientFile(input: {
  client_id: string;
  project_id: string;
  storage_path: string;
  label: string;
  mime_type: string;
  size_bytes: number;
}): Promise<ActionResult> {
  const { supabase, email: me } = await requireAdmin();
  const parsed = fileSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const v = parsed.data;
  const prefix = `clients/${v.client_id}/${v.project_id ?? "general"}/`;
  if (!v.storage_path.startsWith(prefix) || v.storage_path.includes("..")) return fail("Invalid file path.");
  const { error } = await supabase.from("client_files").insert({ ...v, uploaded_by: me });
  if (error) {
    await supabase.storage.from("client-files").remove([v.storage_path]);
    return fail(friendlyError(error, "Couldn't save the file."));
  }
  done();
  return { ok: true };
}

export async function deleteClientFile(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const pid = idSchema.safeParse(id);
  if (!pid.success) return fail("Invalid file.");
  const { data: f } = await supabase.from("client_files").select("storage_path").eq("id", pid.data).maybeSingle<{ storage_path: string }>();
  if (!f) return fail(NOT_FOUND);
  const { error: se } = await supabase.storage.from("client-files").remove([f.storage_path]);
  if (se) return fail(friendlyError(se, "Couldn't delete the file from storage."));
  const { error } = await supabase.from("client_files").delete().eq("id", pid.data);
  if (error) return fail(friendlyError(error, "Couldn't delete the file."));
  done();
  return { ok: true };
}
