import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TOKEN = /^[A-Za-z0-9_-]{20,100}$/;

/**
 * Where the first sign-in link lands after /auth/callback has created the session.
 * Claims the invite for the signed-in user (portal_claim_invite checks the token is unused, unexpired and for this
 * exact email), then opens the portal. Any other outcome goes back to /portal/onboarding?token=…, which explains it.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const origin = new URL(request.url).origin;
  if (!TOKEN.test(token)) return NextResponse.redirect(new URL("/portal/login?error=link_invalid", origin));
  const landing = new URL(`/portal/onboarding?token=${token}`, origin);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(landing);

  const { data } = await supabase.rpc("portal_claim_invite", { p_token: token });
  return NextResponse.redirect(data === "ok" ? new URL("/portal", origin) : landing);
}
