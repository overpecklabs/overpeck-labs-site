"use client";

import { useActionState } from "react";
import { requestPortalLink, sendInviteSignIn, type LinkState } from "@/app/portal/actions";

const INITIAL: LinkState = { sent: false };

/** /portal/login: email only. Always the same confirmation, whether or not the email has a portal. */
export function LoginLinkForm() {
  const [state, action, pending] = useActionState(requestPortalLink, INITIAL);
  if (state.sent) {
    return (
      <p role="status" className="mt-6 rounded-xl border border-teal-ink/25 bg-note-teal/50 px-4 py-3 text-sm">
        If you have a client portal, a sign-in link is on its way. It can take a minute, and it may land in spam.
      </p>
    );
  }
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="portal-email" className="adm-label">
          Email
        </label>
        <input id="portal-email" name="email" type="email" required autoComplete="email" inputMode="email" className="adm-input" disabled={pending} />
      </div>
      <button type="submit" disabled={pending} aria-busy={pending} className="btn-primary w-full !py-3">
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}

/** /portal/onboarding: sends the link to the invite's own email (the server looks it up from the token). */
export function InviteLinkForm({ token, maskedEmail }: { token: string; maskedEmail: string | null }) {
  const [state, action, pending] = useActionState(async () => sendInviteSignIn(token), INITIAL);
  if (state.sent) {
    return (
      <p role="status" className="mt-6 rounded-xl border border-teal-ink/25 bg-note-teal/50 px-4 py-3 text-sm">
        Check your email{maskedEmail ? ` (${maskedEmail})` : ""}. Open the sign-in link on this device or any other, and your onboarding will be ready. It may land in spam.
      </p>
    );
  }
  return (
    <form action={action} className="mt-6 space-y-3">
      {state.error && (
        <p role="alert" className="rounded-lg border border-mk-red/30 bg-mk-red/5 px-3 py-2 text-sm text-mk-red">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} aria-busy={pending} className="btn-primary w-full !py-3">
        {pending ? "Sending…" : "Send my sign-in link"}
      </button>
    </form>
  );
}
