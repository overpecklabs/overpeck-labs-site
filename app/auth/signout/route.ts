import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ALLOWED_ERRORS = new Set(["not_authorized"]);

async function signOut(request: NextRequest, status: 302 | 303) {
  const url = new URL(request.url);
  const supabase = await createClient();
  await supabase.auth.signOut();
  // ?to=portal sends clients back to the portal login instead of the admin login.
  const dest = new URL(url.searchParams.get("to") === "portal" ? "/portal/login" : "/admin/login", url.origin);
  const err = url.searchParams.get("error");
  if (err && ALLOWED_ERRORS.has(err)) dest.searchParams.set("error", err);
  return NextResponse.redirect(dest, status);
}

/** Used by the server-side admin check to clear the session of a non-admin. */
export async function GET(request: NextRequest) {
  return signOut(request, 302);
}

/** The "Sign out" buttons post here. */
export async function POST(request: NextRequest) {
  return signOut(request, 303);
}
