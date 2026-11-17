import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdminEmail } from "@/lib/admin/emails";
import { OTP_TYPES, readParams } from "@/lib/auth-callback-params";

export const dynamic = "force-dynamic";

/**
 * Signs the user in from an emailed link, without relying on the PKCE verifier cookie:
 *  - token_hash (the email templates link here with &token_hash=…&type=email): verifyOtp works in any browser.
 *    A first sign-in is a signup confirmation, so other email types are tried if the given one is rejected.
 *  - code (Supabase's default ?code= redirect): exchanged when the verifier cookie is present (same browser).
 * If verification fails but the browser already has a valid session (link opened twice), carry on.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { next, tokenHash, type, code } = readParams(url);
  const toPortal = next.startsWith("/portal");
  const login = (error: string) => {
    // A failed first-sign-in link goes back to the invite page, where a fresh link is one tap away.
    const claim = next.match(/^\/portal\/onboarding\/claim\/([A-Za-z0-9_-]{20,100})$/);
    if (claim) return NextResponse.redirect(new URL(`/portal/onboarding?token=${claim[1]}&error=${error}`, url.origin));
    return NextResponse.redirect(new URL(`${toPortal ? "/portal/login" : "/admin/login"}?error=${error}`, url.origin));
  };

  const supabase = await createClient();
  let ok = false;
  if (tokenHash) {
    const tries = [...new Set<EmailOtpType>([...(type && OTP_TYPES.includes(type) ? [type] : []), "email", "magiclink", "signup"])];
    for (const t of tries) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: t });
      if (!error) {
        ok = true;
        break;
      }
    }
  }
  if (!ok && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!ok && !user) return login("link_invalid");

  if (!toPortal) {
    // Admins only: in ADMIN_EMAILS, and RLS returns the caller's own admin_users row (or nothing).
    const { data, error } = await supabase.from("admin_users").select("email").limit(1);
    if (!isAllowedAdminEmail(user?.email) || error || !data || data.length === 0) {
      await supabase.auth.signOut();
      return login("not_authorized");
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
