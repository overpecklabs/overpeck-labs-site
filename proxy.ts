import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isAllowedAdminEmail } from "@/lib/admin/emails";

/**
 * Guards /admin and /portal: refresh the session, verify the user with getUser() (never getSession()), and send
 * anyone signed out to the matching login page.
 *  - /admin also needs the email to be in ADMIN_EMAILS (the layout then checks admin_users).
 *  - /portal needs a signed-in user; the layout checks they belong to a client. Login and the invite landing page are public.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const redirectTo = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };
  const under = (base: string) => pathname === base || pathname.startsWith(`${base}/`);

  if (under("/portal")) {
    if (under("/portal/login") || under("/portal/onboarding")) return response;
    return user ? response : redirectTo("/portal/login");
  }

  if (under("/admin/login")) return response;
  if (!user) return redirectTo("/admin/login");
  if (!isAllowedAdminEmail(user.email)) return redirectTo("/admin/login", "?error=not_authorized");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
