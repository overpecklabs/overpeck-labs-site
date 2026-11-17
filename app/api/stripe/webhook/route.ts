import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { PLAN_NAMES, planKey, sendMail, SUPPORT_EMAIL, welcomeEmail } from "@/lib/mailer";

/**
 * Stripe webhook: records new subscriptions, marks the CRM client as a client, and sends the welcome email.
 * Register in Stripe for https://overpecklabs.com/api/stripe/webhook with the events
 * checkout.session.completed and customer.subscription.deleted.
 *
 * No service role key. Database writes go through secret-checked SECURITY DEFINER functions
 * (supabase/migrations/20261117130000_client_subscriptions.sql), called with the public anon key plus
 * BILLING_RPC_SECRET. anon can't touch the billing tables directly; the functions refuse a wrong secret.
 *
 * Env (server only): STRIPE_WEBHOOK_SECRET, BILLING_RPC_SECRET, ZOHO_SMTP_USER, ZOHO_SMTP_PASS
 *   (+ optional ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, NOTIFY_EMAIL, NEXT_PUBLIC_INTAKE_URL).
 * Public: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Never logs the request body or any secret.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => Response.json(body, { status });

function rpcClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
type Db = ReturnType<typeof rpcClient>;

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rpcSecret = process.env.BILLING_RPC_SECRET;
  if (!webhookSecret || !rpcSecret || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("[stripe-webhook] not configured (STRIPE_WEBHOOK_SECRET, BILLING_RPC_SECRET or Supabase URL/key missing)");
    return json({ error: "Webhook not configured" }, 500);
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) return json({ error: "Missing signature" }, 400);

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch {
    return json({ error: "Invalid signature" }, 400);
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(rpcClient(), rpcSecret, event.data.object);
    } else if (event.type === "customer.subscription.deleted") {
      const { error } = await rpcClient().rpc("billing_subscription_deleted", { p_secret: rpcSecret, p_subscription_id: event.data.object.id });
      if (error) throw new Error(`billing_subscription_deleted: ${error.message}`);
    }
    return json({ received: true });
  } catch (err) {
    // A 500 makes Stripe retry. The database side is idempotent and the welcome email is claimed, so retries are safe.
    console.error("[stripe-webhook] failed handling", event.type, event.id, err instanceof Error ? err.message : "unknown error");
    return json({ error: "Processing failed" }, 500);
  }
}

const idOf = (v: string | { id: string } | null | undefined) => (typeof v === "string" ? v : v?.id ?? null);

async function handleCheckoutCompleted(db: Db, secret: string, session: Stripe.Checkout.Session) {
  const subscriptionId = idOf(session.subscription);
  if (session.mode !== "subscription" || !subscriptionId) return;

  const email = session.customer_details?.email?.trim() || null;
  const name = session.customer_details?.name?.trim() || null;
  const phone = session.customer_details?.phone?.trim() || null;
  const plan = planKey(session.metadata?.plan) ?? (session.metadata?.plan?.trim() || "unknown");

  if (!email) {
    // Payment Links always collect an email; without one there is nothing to record or send.
    console.error("[stripe-webhook] checkout session without email", session.id);
    return;
  }

  // Records the subscription, links or creates the CRM client, and claims the welcome email (one sender wins).
  const { data, error } = await db.rpc("billing_checkout_completed", {
    p_secret: secret,
    p_subscription_id: subscriptionId,
    p_customer_id: idOf(session.customer),
    p_email: email,
    p_name: name,
    p_phone: phone,
    p_plan: plan,
  });
  if (error) throw new Error(`billing_checkout_completed: ${error.message}`);
  const result = data as { id: string; send_welcome: boolean } | null;
  if (!result?.send_welcome) return;

  try {
    await sendMail({ to: email, ...welcomeEmail({ name, plan }) });
  } catch (err) {
    // Release the claim so Stripe's retry sends it.
    await db.rpc("billing_welcome_result", { p_secret: secret, p_id: result.id, p_sent: false });
    throw err;
  }
  const { error: sentErr } = await db.rpc("billing_welcome_result", { p_secret: secret, p_id: result.id, p_sent: true });
  // The email went out; if only the bookkeeping failed, the claim still blocks a resend for 10 minutes. Log, don't retry.
  if (sentErr) console.error("[stripe-webhook] could not mark welcome sent", result.id, sentErr.message);

  // Internal heads-up. Best effort.
  try {
    const key = planKey(plan);
    const planName = key ? PLAN_NAMES[key] : plan;
    const who = name ?? email;
    await sendMail({
      to: process.env.NOTIFY_EMAIL?.trim() || SUPPORT_EMAIL,
      subject: `New client: ${who} (${planName})`,
      text: `New client: ${who} (${email}, ${phone ?? "no phone"}) bought ${planName}.`,
    });
  } catch {
    console.error("[stripe-webhook] internal notification failed");
  }
}
