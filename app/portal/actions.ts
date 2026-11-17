"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { anonRpcClient } from "@/lib/supabase/rpc";
import { SITE_URL } from "@/lib/site";
import { sendMail, SUPPORT_EMAIL, PLAN_NAMES, planKey } from "@/lib/mailer";
import { onboardingSubmittedClient, onboardingSubmittedInternal } from "@/lib/portal/emails";
import { cleanStep, computeProgress, missingRequired } from "@/lib/portal/schema";
import { STEP_LIBRARY } from "@/lib/portal/steps";
import { getWizard } from "@/lib/portal/wizards";
import { formatValue } from "@/lib/portal/format";
import type { PortalMe } from "@/lib/portal/types";

// Server actions are public endpoints: each one re-checks the session (getUser) and runs as the signed-in user,
// so RLS and the SECURITY DEFINER functions enforce access. No service role key.

export type LinkState = { sent: boolean; error?: string };

const emailSchema = z.string().trim().toLowerCase().max(200).email();

/** The site is the only place magic links may send people back to. */
const callbackUrl = (next: string) => `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`;

/** /portal/login: sends a sign-in link to existing portal users only. Always shows the same message. */
export async function requestPortalLink(_prev: LinkState, fd: FormData): Promise<LinkState> {
  const parsed = emailSchema.safeParse(fd.get("email"));
  if (parsed.success) {
    const supabase = await createClient();
    // shouldCreateUser: false, so an unknown email creates nothing. The result is ignored on purpose.
    await supabase.auth.signInWithOtp({ email: parsed.data, options: { shouldCreateUser: false, emailRedirectTo: callbackUrl("/portal") } });
  }
  return { sent: true };
}

const TOKEN = /^[A-Za-z0-9_-]{20,100}$/;

/** /portal/onboarding?token=: sends the sign-in link to the invite's own email, looked up by token on the server. */
export async function sendInviteSignIn(token: string): Promise<LinkState> {
  const secret = process.env.BILLING_RPC_SECRET;
  if (!secret || !TOKEN.test(token)) return { sent: false, error: "This link isn't valid." };
  const { data, error } = await anonRpcClient().rpc("portal_invite_email", { p_secret: secret, p_token: token });
  if (error || typeof data !== "string" || !data) return { sent: false, error: "This link has expired or was already used." };

  const supabase = await createClient();
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: data,
    // The token goes in the path, not a query string, so nothing in `next` can collide with the parameters the
    // email template appends (&token_hash=…&type=email) or that Supabase adds (?code=…).
    options: { shouldCreateUser: true, emailRedirectTo: callbackUrl(`/portal/onboarding/claim/${token}`) },
  });
  if (otpError) {
    console.error("[portal] sign-in link failed", otpError.status ?? "", otpError.code ?? "");
    return { sent: false, error: "We couldn't send the email just now. Please try again in a minute, or call the office." };
  }
  return { sent: true };
}

export type SaveResult = { ok: true } | { ok: false; error: string; locked?: boolean };

/** Autosave: validates the step's format, then portal_save_step merges it and moves the resume pointer. */
export async function saveStep(stepId: string, values: Record<string, unknown>, currentStep: string): Promise<SaveResult> {
  const step = STEP_LIBRARY[stepId];
  if (!step || step.review) return { ok: false, error: "Unknown step." };
  const clean = cleanStep(step, values);
  if (!clean.ok) return { ok: false, error: clean.error };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const { error } = await supabase.rpc("portal_save_step", { p_step: stepId, p_answers: clean.data, p_current_step: currentStep });
  if (error) {
    if (error.code === "55000") return { ok: false, error: "Your answers are submitted and can't be changed right now.", locked: true };
    return { ok: false, error: "Couldn't save. Check your connection and try again." };
  }
  return { ok: true };
}

/** Moves the resume pointer only (no answers). */
export async function setCurrentStep(stepId: string): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const { error } = await supabase.rpc("portal_save_step", { p_step: stepId, p_answers: null, p_current_step: stepId });
  return error ? { ok: false, error: "Couldn't save your place." } : { ok: true };
}

export type SubmitResult = { ok: true } | { ok: false; error: string; missing?: string[] };

export async function submitOnboarding(): Promise<SubmitResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };

  const { data: me } = await supabase.rpc("portal_me");
  const portal = me as PortalMe | null;
  const wizard = getWizard(portal?.plan);
  if (!portal || !wizard) return { ok: false, error: "Your portal isn't ready yet. Please call the office." };

  // Full check first (zod), so the client sees exactly what's missing. portal_submit then re-checks in the database.
  const missing = wizard.steps.filter((s) => !s.review).flatMap((s) => missingRequired(s, portal.answers[s.id]).map((m) => `${s.title}: ${m}`));
  if (missing.length) return { ok: false, error: "A few required answers are still empty.", missing };

  const { data, error } = await supabase.rpc("portal_submit");
  if (error) {
    if (error.code === "55000") return { ok: false, error: "This onboarding was already submitted." };
    if (error.code === "22023") return { ok: false, error: "A few required answers are still empty." };
    return { ok: false, error: "Couldn't submit. Please try again." };
  }
  const result = data as { client_id: string; business_name: string | null; plan: string | null; email: string | null } | null;

  // The submission is saved. Emails are best effort and can never undo it.
  try {
    const key = planKey(result?.plan);
    const planName = key ? PLAN_NAMES[key] : "your";
    const business = result?.business_name || (portal.answers.basics?.business_name as string | undefined) || "A client";
    const basics = STEP_LIBRARY.basics.fields;
    const val = (k: string) => formatValue(basics.find((f) => f.key === k)!, portal.answers.basics?.[k]);
    const progress = computeProgress(wizard, portal.answers);
    const lines = [
      `Contact: ${[val("contact_name"), val("phone")].filter(Boolean).join(", ") || "not given"}`,
      `Trade: ${val("trade") || "not given"}`,
      `Area: ${val("service_area").split("\n")[0] || "not given"}`,
      `${progress.done} of ${progress.total} steps complete`,
    ];
    if (result?.client_id) {
      await sendMail({
        to: process.env.NOTIFY_EMAIL?.trim() || SUPPORT_EMAIL,
        ...onboardingSubmittedInternal({ business, planName, clientId: result.client_id, lines }),
      }).catch(() => console.error("[portal] internal submit email failed"));
    }
    if (result?.email) {
      await sendMail({ to: result.email, ...onboardingSubmittedClient({ name: val("contact_name") || null, planName }) }).catch(() =>
        console.error("[portal] client confirmation email failed"),
      );
    }
  } catch {
    console.error("[portal] submit emails failed");
  }
  return { ok: true };
}
