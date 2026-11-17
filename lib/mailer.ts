import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Outgoing mail through Zoho SMTP, sent from support@overpecklabs.com.
 *
 * Env: ZOHO_SMTP_USER, ZOHO_SMTP_PASS, optional ZOHO_SMTP_HOST (default smtp.zoho.com),
 * optional ZOHO_SMTP_PORT (default 465), optional NEXT_PUBLIC_INTAKE_URL.
 */
export const SUPPORT_EMAIL = "support@overpecklabs.com";
export const OFFICE_PHONE = "(201) 949-7695";
const FROM = `Overpeck Labs <${SUPPORT_EMAIL}>`;

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const user = process.env.ZOHO_SMTP_USER;
    const pass = process.env.ZOHO_SMTP_PASS;
    if (!user || !pass) throw new Error("SMTP is not configured");
    transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST ?? "smtp.zoho.com",
      port: Number(process.env.ZOHO_SMTP_PORT ?? 465),
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
  await getTransporter().sendMail({ from: FROM, replyTo: FROM, to, subject, text, html });
}

export type PlanKey = "starter" | "growth" | "pro";

export const PLAN_NAMES: Record<PlanKey, string> = { starter: "Starter", growth: "Growth", pro: "Pro" };

const PLAN_LINES: Record<PlanKey, string> = {
  starter: "That covers hosting, SSL and small monthly edits.",
  growth:
    "That covers hosting, SSL, AI chat, instant lead alerts by text, Google Business Profile setup and monthly content updates.",
  pro: "That covers everything in Growth plus your AI phone receptionist that answers your calls, books jobs and texts you a summary.",
};

export function planKey(plan: string | null | undefined): PlanKey | null {
  const p = (plan ?? "").trim().toLowerCase();
  return p === "starter" || p === "growth" || p === "pro" ? p : null;
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function intakeUrl() {
  return process.env.NEXT_PUBLIC_INTAKE_URL?.trim() || "https://overpecklabs.com/welcome#intake";
}

/** The welcome email a new client gets right after paying. */
export function welcomeEmail({
  name,
  plan,
  onboardingUrl,
}: {
  name: string | null | undefined;
  plan: string | null | undefined;
  /** The client's personal onboarding link. When missing (the invite could not be created), the old intake link is used. */
  onboardingUrl?: string | null;
}) {
  const firstName = name?.trim().split(/\s+/)[0] || "there";
  const key = planKey(plan);
  const planLabel = key ? `${PLAN_NAMES[key]} plan` : "plan";
  const planLine = key ? PLAN_LINES[key] : "That covers hosting, SSL and ongoing monthly service.";
  const e0 = escapeHtml;
  const intake = intakeUrl();
  const step1Text = onboardingUrl
    ? `1. Start your onboarding: ${onboardingUrl}
   It takes about 10–15 minutes, saves as you go, and the link is just for you. Or reply to this email with your items (logo, photos, services list, service area, hours, license number, domain details and review links).`
    : `1. Send us your intake items so we can build from your real brand and details: logo, photos, services list, service area, hours, license number, domain access (if you already have a domain), and links to your reviews. Reply to this email with them, or use the intake form: ${intake}`;
  const step1Html = onboardingUrl
    ? `<li><strong>Start your onboarding:</strong> <a href="${e0(onboardingUrl)}" style="display:inline-block;background:#19f0d2;color:#06201c;font-weight:700;text-decoration:none;padding:10px 18px;border-radius:999px;margin:6px 0">Start my onboarding</a><br>It takes about 10–15 minutes, saves as you go, and the link is just for you. Or reply to this email with your items (logo, photos, services list, service area, hours, license number, domain details and review links).</li>`
    : `<li>Send us your intake items so we can build from your real brand and details: logo, photos, services list, service area, hours, license number, domain access (if you already have a domain), and links to your reviews. Reply to this email with them, or use the intake form: <a href="${e0(intake)}">${e0(intake)}</a></li>`;

  const subject = "Welcome to Overpeck Labs: here's how we get started";
  const text = `Hi ${firstName},

Thank you for choosing Overpeck Labs. We got your payment, and we're glad to be building your new website.

Here's how we get started:

${step1Text}
2. We start the build and stay in touch from this inbox. You'll get a chance to review the site before it goes live.
3. Your ${planLabel} is month to month. ${planLine}
4. No contracts. You can cancel anytime by emailing this address.

Questions? Reply to this email or call the office at ${OFFICE_PHONE}.

Thank you again.

Overpeck Labs
${SUPPORT_EMAIL}
${OFFICE_PHONE}
`;

  const e = escapeHtml;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a;max-width:560px">
<p>Hi ${e(firstName)},</p>
<p>Thank you for choosing Overpeck Labs. We got your payment, and we're glad to be building your new website.</p>
<p>Here's how we get started:</p>
<ol>
${step1Html}
<li>We start the build and stay in touch from this inbox. You'll get a chance to review the site before it goes live.</li>
<li>Your ${e(planLabel)} is month to month. ${e(planLine)}</li>
<li>No contracts. You can cancel anytime by emailing this address.</li>
</ol>
<p>Questions? Reply to this email or call the office at ${OFFICE_PHONE}.</p>
<p>Thank you again.</p>
<p>Overpeck Labs<br>${SUPPORT_EMAIL}<br>${OFFICE_PHONE}</p>
</div>`;

  return { subject, text, html };
}
