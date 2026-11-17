import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdminEmail } from "@/lib/admin/emails";

export const dynamic = "force-dynamic";

/** Only same-site /admin or /portal paths are allowed as the post-login destination. */
function safeNext(raw: string | null): string {
  if (!raw || raw.includes("\\") || raw.startsWith("//")) return "/admin";
  return /^\/(?:admin|portal)(?:[/?#]|$)/.test(raw) ? raw : "/admin";
}

const OTP_TYPES: EmailOtpType[] = ["magiclink", "email", "signup", "invite", "recovery", "email_change"];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(url.searchParams.get("next"));
  const toPortal = next.startsWith("/portal");
  const login = (error: string) => NextResponse.redirect(new URL(`${toPortal ? "/portal/login" : "/admin/login"}?error=${error}`, url.origin));

  const supabase = await createClient();
  let failed = true;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = !!error;
  } else if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    failed = !!error;
  }
  if (failed) return login("link_invalid");

  if (!toPortal) {
    // Admins only: in ADMIN_EMAILS, and RLS returns the caller's own admin_users row (or nothing).
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("admin_users").select("email").limit(1);
    if (!isAllowedAdminEmail(user?.email) || error || !data || data.length === 0) {
      await supabase.auth.signOut();
      return login("not_authorized");
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
