import type { EmailOtpType } from "@supabase/supabase-js";

/** Only same-site /admin or /portal paths are allowed as the post-login destination. */
export function safeNext(raw: string | null): string {
  if (!raw || raw.includes("\\") || raw.startsWith("//")) return "/admin";
  return /^\/(?:admin|portal)(?:[/?#]|$)/.test(raw) ? raw : "/admin";
}

export const OTP_TYPES: EmailOtpType[] = ["magiclink", "email", "signup", "invite", "recovery", "email_change"];
const TOKEN = /^[A-Za-z0-9_-]{20,100}$/;

/**
 * Reads next / token_hash / type / code even when an unencoded `next` swallowed some of them
 * (e.g. next=/portal/onboarding?token=X&token_hash=…). Links already sent in the old format
 * (next=/portal/onboarding?token=X) are rewritten to the claim route.
 */
export function readParams(url: URL) {
  const sp = url.searchParams;
  let next = sp.get("next");
  let tokenHash = sp.get("token_hash");
  let type = sp.get("type");
  let code = sp.get("code");

  if (next?.includes("?")) {
    const i = next.indexOf("?");
    const path = next.slice(0, i);
    const inner = new URLSearchParams(next.slice(i + 1));
    tokenHash ??= inner.get("token_hash");
    type ??= inner.get("type");
    code ??= inner.get("code");
    ["token_hash", "type", "code"].forEach((k) => inner.delete(k));
    const token = inner.get("token");
    if (path === "/portal/onboarding" && token && TOKEN.test(token)) next = `/portal/onboarding/claim/${token}`;
    else next = inner.size ? `${path}?${inner}` : path;
  }
  return { next: safeNext(next), tokenHash, type: type as EmailOtpType | null, code };
}
