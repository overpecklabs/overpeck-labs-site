import type { Metadata } from "next";
import Link from "next/link";
import { Panel, ProgressBar } from "@/components/portal/Shell";
import { getPortalMe, loadPortalUploadLabels } from "@/lib/portal/server";
import { computeProgress, countUploads } from "@/lib/portal/schema";
import { getWizard } from "@/lib/portal/wizards";
import { STATUS_LABEL } from "@/lib/portal/types";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

export const metadata: Metadata = { title: "Your portal" };

export default async function PortalHome() {
  const me = await getPortalMe();
  if (!me) return null; // the layout already showed "No portal found"
  const wizard = getWizard(me.plan);
  const uploads = countUploads(wizard ? await loadPortalUploadLabels() : []);
  const locked = me.onboarding_status === "submitted" || me.onboarding_status === "complete";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">Your portal</p>
        <h1 className="font-display mt-1 text-3xl font-bold">{me.business_name ?? "Welcome"}</h1>
      </div>

      {!wizard ? (
        <Panel>
          <h2 className="font-display text-xl font-bold">We&apos;re setting up your portal</h2>
          <p className="mt-2 text-sm text-ink/75">
            Your plan isn&apos;t showing up here yet. Call{" "}
            <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-ink underline">
              {PHONE_DISPLAY}
            </a>{" "}
            and we&apos;ll sort it out with you.
          </p>
        </Panel>
      ) : (
        <>
          <Panel>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">Plan</dt>
                <dd className="mt-0.5 font-semibold">{wizard.planName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">Onboarding</dt>
                <dd className="mt-0.5 font-semibold">{STATUS_LABEL[me.onboarding_status]}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">Office</dt>
                <dd className="mt-0.5 font-semibold">
                  <a href={`tel:${PHONE_TEL}`} className="text-teal-ink hover:underline">
                    {PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel>
            <h2 className="font-display text-xl font-bold">{wizard.introTitle}</h2>
            <p className="mt-2 text-sm text-ink/75">{wizard.intro}</p>
            <div className="mt-5">
              <ProgressBar percent={computeProgress(wizard, me.answers, uploads).percent} label="Onboarding progress" />
            </div>
            {locked && (
              <p className="mt-4 text-sm text-ink/75">
                {me.onboarding_status === "complete" ? "Your onboarding is complete." : "Thank you, we have your answers."} Want to change something? Call{" "}
                <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-ink underline">
                  {PHONE_DISPLAY}
                </a>{" "}
                and we can reopen it for you.
              </p>
            )}
            <div className="mt-5">
              <Link href="/portal/wizard" className="btn-primary">
                {locked ? "Review your answers" : me.onboarding_status === "not_started" ? "Start onboarding" : "Continue onboarding"}
              </Link>
            </div>
            <h3 className="mt-7 text-sm font-bold">When you&apos;re done we&apos;ll have</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
              {wizard.checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </div>
  );
}
