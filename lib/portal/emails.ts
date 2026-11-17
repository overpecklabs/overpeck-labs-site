import "server-only";
import { OFFICE_PHONE, SUPPORT_EMAIL, escapeHtml } from "@/lib/mailer";
import { SITE_URL } from "@/lib/site";

// Portal emails. Sent only through sendMail() from support@overpecklabs.com.

const wrap = (inner: string) => `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a;max-width:560px">${inner}</div>`;
const button = (href: string, label: string) =>
  `<p><a href="${escapeHtml(href)}" style="display:inline-block;background:#19f0d2;color:#06201c;font-weight:700;text-decoration:none;padding:10px 18px;border-radius:999px">${escapeHtml(label)}</a></p>`;
const signature = `<p>Overpeck Labs<br>${SUPPORT_EMAIL}<br>${OFFICE_PHONE}</p>`;
const signatureText = `Overpeck Labs\n${SUPPORT_EMAIL}\n${OFFICE_PHONE}\n`;

export const onboardingLink = (token: string) => `${SITE_URL}/portal/onboarding?token=${encodeURIComponent(token)}`;
export const adminClientUrl = (clientId: string) => `${SITE_URL}/admin/clients/${clientId}?tab=onboarding`;

/** A fresh personal onboarding link (admin "Resend onboarding link"). */
export function onboardingInviteEmail({ name, url }: { name: string | null | undefined; url: string }) {
  const first = name?.trim().split(/\s+/)[0] || "there";
  return {
    subject: "Your Overpeck Labs onboarding link",
    text: `Hi ${first},

Here's your personal onboarding link: ${url}

It takes about 10–15 minutes, saves as you go, and the link is just for you. It works for 14 days.

Questions? Reply to this email or call ${OFFICE_PHONE}.

${signatureText}`,
    html: wrap(
      `<p>Hi ${escapeHtml(first)},</p><p>Here's your personal onboarding link:</p>${button(url, "Start my onboarding")}<p>It takes about 10–15 minutes, saves as you go, and the link is just for you. It works for 14 days.</p><p>Questions? Reply to this email or call ${OFFICE_PHONE}.</p>${signature}`,
    ),
  };
}

/** Sent when an admin reopens a submitted onboarding for edits. */
export function onboardingReopenedEmail({ name }: { name: string | null | undefined }) {
  const first = name?.trim().split(/\s+/)[0] || "there";
  const url = `${SITE_URL}/portal/login`;
  return {
    subject: "Your onboarding is open for edits",
    text: `Hi ${first},

We've reopened your onboarding so you can update your answers. Sign in to your portal here (we'll email you a sign-in link): ${url}

Submit again when you're done and we'll take it from there.

Questions? Reply to this email or call ${OFFICE_PHONE}.

${signatureText}`,
    html: wrap(
      `<p>Hi ${escapeHtml(first)},</p><p>We've reopened your onboarding so you can update your answers. Sign in to your portal (we'll email you a sign-in link):</p>${button(url, "Open my portal")}<p>Submit again when you're done and we'll take it from there.</p><p>Questions? Reply to this email or call ${OFFICE_PHONE}.</p>${signature}`,
    ),
  };
}

/** Internal heads-up when a client submits. */
export function onboardingSubmittedInternal({ business, planName, clientId, lines }: { business: string; planName: string; clientId: string; lines: string[] }) {
  const url = adminClientUrl(clientId);
  return {
    subject: `Onboarding submitted: ${business} (${planName})`,
    text: `${business} submitted their ${planName} onboarding.\n\n${lines.map((l) => `- ${l}`).join("\n")}\n\nReview it: ${url}\n`,
    html: wrap(
      `<p><strong>${escapeHtml(business)}</strong> submitted their ${escapeHtml(planName)} onboarding.</p><ul>${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul><p><a href="${escapeHtml(url)}">Review it in the admin</a></p>`,
    ),
  };
}

/** Confirmation to the client after they submit. */
export function onboardingSubmittedClient({ name, planName }: { name: string | null | undefined; planName: string }) {
  const first = name?.trim().split(/\s+/)[0] || "there";
  return {
    subject: "We got everything. Here's what happens next.",
    text: `Hi ${first},

We got everything for your ${planName} plan. Thank you.

Here's what happens next:
1. We review your answers and files. If something is missing or unclear, we'll reach out.
2. We start building from your real details and stay in touch from this inbox.
3. You review the work before anything goes live.

You can look over your answers any time in your portal: ${SITE_URL}/portal

Questions? Reply to this email or call ${OFFICE_PHONE}.

${signatureText}`,
    html: wrap(
      `<p>Hi ${escapeHtml(first)},</p><p>We got everything for your ${escapeHtml(planName)} plan. Thank you.</p><p>Here's what happens next:</p><ol><li>We review your answers and files. If something is missing or unclear, we'll reach out.</li><li>We start building from your real details and stay in touch from this inbox.</li><li>You review the work before anything goes live.</li></ol><p>You can look over your answers any time in <a href="${SITE_URL}/portal">your portal</a>.</p><p>Questions? Reply to this email or call ${OFFICE_PHONE}.</p>${signature}`,
    ),
  };
}
