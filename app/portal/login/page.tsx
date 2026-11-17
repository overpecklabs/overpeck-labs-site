import type { Metadata } from "next";
import Shell, { Panel } from "@/components/portal/Shell";
import { LoginLinkForm } from "@/components/portal/LinkForm";
import { PHONE_DISPLAY } from "@/lib/services";

export const metadata: Metadata = { title: "Sign in" };

export default async function PortalLoginPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const invalid = sp.error === "link_invalid";
  return (
    <Shell>
      <Panel>
        <h1 className="font-display text-2xl font-bold">Sign in to your portal</h1>
        <p className="mt-2 text-sm text-ink/70">Enter the email you used when you signed up. We&apos;ll email you a sign-in link. No password needed.</p>
        {invalid && (
          <p role="alert" className="mt-4 rounded-lg border border-mk-red/30 bg-mk-red/5 px-3 py-2 text-sm text-mk-red">
            That sign-in link is invalid or has expired. Request a new one below.
          </p>
        )}
        <LoginLinkForm />
        <p className="mt-6 text-sm text-ink/60">Need help? Call {PHONE_DISPLAY}.</p>
      </Panel>
    </Shell>
  );
}
