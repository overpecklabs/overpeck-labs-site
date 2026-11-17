import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Wizard from "@/components/portal/Wizard";
import { Panel } from "@/components/portal/Shell";
import { getPortalMe, getPortalUser, loadPortalFiles } from "@/lib/portal/server";
import { getWizard } from "@/lib/portal/wizards";
import { countUploads, firstIncompleteStep } from "@/lib/portal/schema";
import { EDITABLE_STATUSES } from "@/lib/portal/types";
import { SUPPORT_EMAIL } from "@/lib/mailer";
import { PHONE_DISPLAY } from "@/lib/services";

export const metadata: Metadata = { title: "Onboarding" };

export default async function WizardPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const me = await getPortalMe();
  if (!me) redirect("/portal");
  const wizard = getWizard(me.plan);
  if (!wizard) {
    return (
      <Panel>
        <h1 className="font-display text-xl font-bold">We&apos;re setting up your portal</h1>
        <p className="mt-2 text-sm text-ink/75">Call {PHONE_DISPLAY} and we&apos;ll get you started.</p>
        <Link href="/portal" className="mt-4 inline-block font-semibold text-teal-ink underline">
          Back to your portal
        </Link>
      </Panel>
    );
  }

  const sp = await searchParams;
  const [files, user] = await Promise.all([loadPortalFiles(), getPortalUser()]);
  // An explicit ?step= (Edit links, the stepper) wins. Otherwise resume at the first incomplete step,
  // not the last step visited, so skipped or empty steps aren't passed over.
  const wanted = typeof sp.step === "string" ? sp.step : null;
  const initialStep = wanted && wizard.steps.some((s) => s.id === wanted) ? wanted : firstIncompleteStep(wizard, me.answers, countUploads(files));

  return (
    <Wizard
      plan={wizard.plan}
      initialStep={initialStep}
      initialAnswers={me.answers}
      initialFiles={files}
      clientId={me.client_id}
      userEmail={user?.email ?? ""}
      status={me.onboarding_status}
      editable={EDITABLE_STATUSES.includes(me.onboarding_status)}
      // The address is only ever rendered here, inside the signed-in portal, never in a public page or the shared JS bundle.
      supportEmail={SUPPORT_EMAIL}
    />
  );
}
