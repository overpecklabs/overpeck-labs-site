import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Shell, { Panel, SignOutForm } from "@/components/portal/Shell";
import { InviteLinkForm } from "@/components/portal/LinkForm";
import { createClient } from "@/lib/supabase/server";
import { PHONE_DISPLAY } from "@/lib/services";

export const metadata: Metadata = { title: "Start your onboarding" };

type InviteStatus = { state: "valid" | "used" | "expired" | "invalid"; masked_email?: string };

const TOKEN = /^[A-Za-z0-9_-]{20,100}$/;

function Message({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Shell>
      <Panel>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <div className="mt-3 space-y-3 text-sm text-ink/75">{children}</div>
      </Panel>
    </Shell>
  );
}

/**
 * The page behind the personal link in the welcome email.
 * Signed out + valid token: "Send my sign-in link" (to the invite's own email, never one typed here).
 * Signed in: portal_claim_invite checks the token is unused, unexpired and for this exact email, then links them to their client.
 */
export default async function OnboardingTokenPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  if (!TOKEN.test(token)) return <Invalid />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: claim } = await supabase.rpc("portal_claim_invite", { p_token: token });
    if (claim === "ok") redirect("/portal");
    if (claim === "email_mismatch" || claim === "conflict") {
      return (
        <Message title="This link is for a different email">
          <p>You&apos;re signed in as a different email address than the one this onboarding link was sent to. Sign out, then open the link again.</p>
          <SignOutForm className="adm-btn" />
        </Message>
      );
    }
    if (claim === "used") return <Used />;
    if (claim === "expired") return <Expired />;
    return <Invalid />;
  }

  const { data } = await supabase.rpc("portal_invite_status", { p_token: token });
  const status = (data ?? { state: "invalid" }) as InviteStatus;
  if (status.state === "used") return <Used />;
  if (status.state === "expired") return <Expired />;
  if (status.state !== "valid") return <Invalid />;

  return (
    <Shell>
      <Panel>
        <h1 className="font-display text-2xl font-bold">Start your onboarding</h1>
        <p className="mt-2 text-sm text-ink/70">
          We&apos;ll email a one-time sign-in link to <strong>{status.masked_email ?? "the email you signed up with"}</strong>. It takes about 10 to 15 minutes, saves as you go, and you can come back to finish.
        </p>
        <InviteLinkForm token={token} maskedEmail={status.masked_email ?? null} />
        <p className="mt-6 text-sm text-ink/60">Questions? Call {PHONE_DISPLAY}.</p>
      </Panel>
    </Shell>
  );
}

const loginLink = (
  <Link href="/portal/login" className="font-semibold text-teal-ink underline">
    Sign in to your portal
  </Link>
);

function Used() {
  return (
    <Message title="This link was already used">
      <p>Your portal is already set up. {loginLink} with your email and we&apos;ll send you a sign-in link.</p>
    </Message>
  );
}
function Expired() {
  return (
    <Message title="This link has expired">
      <p>Onboarding links work for 14 days. {loginLink} if you already have a portal, or call {PHONE_DISPLAY} and we&apos;ll send you a new one.</p>
    </Message>
  );
}
function Invalid() {
  return (
    <Message title="We couldn't use this link">
      <p>The link looks incomplete or isn&apos;t valid. Try opening it again from your email. Or {loginLink}, or call {PHONE_DISPLAY}.</p>
    </Message>
  );
}
