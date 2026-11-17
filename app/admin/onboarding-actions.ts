"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { friendlyError } from "@/lib/admin/errors";
import { sendMail } from "@/lib/mailer";
import { onboardingInviteEmail, onboardingLink, onboardingReopenedEmail } from "@/lib/portal/emails";
import type { ActionResult } from "@/lib/admin/types";

// Admin actions for the client Onboarding tab. Each re-checks the admin session and runs as the signed-in admin,
// so RLS (private.is_admin()) enforces access. No service role key.

const idSchema = z.string().trim().min(1).max(64).regex(/^[A-Za-z0-9-]+$/);
const fail = (error: string): ActionResult => ({ ok: false, error });

async function contactFor(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], clientId: string) {
  const [members, client, sub] = await Promise.all([
    supabase.from("client_portal_members").select("email").eq("client_id", clientId).limit(1).overrideTypes<{ email: string }[], { merge: false }>(),
    supabase.from("clients").select("contact_name, email").eq("id", clientId).maybeSingle<{ contact_name: string | null; email: string | null }>(),
    supabase.from("client_subscriptions").select("email, name").eq("client_id", clientId).order("created_at", { ascending: false }).limit(1).overrideTypes<{ email: string; name: string | null }[], { merge: false }>(),
  ]);
  return {
    email: members.data?.[0]?.email ?? sub.data?.[0]?.email ?? client.data?.email ?? null,
    name: client.data?.contact_name ?? sub.data?.[0]?.name ?? null,
  };
}

async function logEmail(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], clientId: string, me: string, summary: string, body: string) {
  const { error } = await supabase.from("communications").insert({ client_id: clientId, channel: "email", direction: "out", summary, body, occurred_at: new Date().toISOString(), created_by: me });
  if (error) console.error("[admin] could not log communication", error.code ?? "");
}

/** Mark complete, or reopen for client edits (which emails the client). */
export async function setOnboardingStatus(clientId: string, status: "complete" | "reopened"): Promise<ActionResult> {
  const { supabase, email: me } = await requireAdmin();
  const id = idSchema.safeParse(clientId);
  if (!id.success || (status !== "complete" && status !== "reopened")) return fail("Invalid request.");

  const patch = status === "complete" ? { status, completed_at: new Date().toISOString() } : { status, completed_at: null };
  const { data, error } = await supabase.from("client_onboarding").update(patch).eq("client_id", id.data).select("client_id").overrideTypes<{ client_id: string }[], { merge: false }>();
  if (error) return fail(friendlyError(error, "Couldn't update the status."));
  if (!data?.length) return fail("This client hasn't started onboarding yet.");

  if (status === "reopened") {
    const who = await contactFor(supabase, id.data);
    if (who.email) {
      try {
        await sendMail({ to: who.email, ...onboardingReopenedEmail({ name: who.name }) });
        await logEmail(supabase, id.data, me, "Onboarding reopened for edits", `Emailed ${who.email} a link to their portal.`);
      } catch {
        revalidatePath("/admin", "layout");
        return fail("Reopened, but the email to the client failed. Let them know another way.");
      }
    }
  } else {
    await supabase.from("communications").insert({ client_id: id.data, channel: "note", direction: null, summary: "Onboarding marked complete", occurred_at: new Date().toISOString(), created_by: me });
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/** Creates a fresh invite (portal_admin_create_invite, is_admin() checked in the database) and emails the link. */
export async function resendOnboardingLink(clientId: string): Promise<ActionResult> {
  const { supabase, email: me } = await requireAdmin();
  const id = idSchema.safeParse(clientId);
  if (!id.success) return fail("Invalid client.");
  const { data, error } = await supabase.rpc("portal_admin_create_invite", { p_client_id: id.data });
  if (error || typeof data !== "string") return fail(error?.code === "22023" ? "This client has no subscription to invite from." : friendlyError(error, "Couldn't create the link."));

  const who = await contactFor(supabase, id.data);
  if (!who.email) return fail("No email address on file for this client.");
  try {
    await sendMail({ to: who.email, ...onboardingInviteEmail({ name: who.name, url: onboardingLink(data) }) });
  } catch {
    return fail("The link was created, but the email failed to send. Try again.");
  }
  await logEmail(supabase, id.data, me, "Onboarding link sent", `Emailed ${who.email} a new personal onboarding link (valid 14 days).`);
  revalidatePath("/admin", "layout");
  return { ok: true };
}
