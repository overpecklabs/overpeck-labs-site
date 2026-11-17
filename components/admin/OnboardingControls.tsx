"use client";

import Link from "next/link";
import { resendOnboardingLink, setOnboardingStatus } from "@/app/admin/onboarding-actions";
import { ActionButton, ConfirmButton } from "./controls";

/** Status controls, resend link, and export for one client's onboarding. */
export default function OnboardingControls({ clientId, status, hasOnboarding }: { clientId: string; status: string; hasOnboarding: boolean }) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {hasOnboarding && status !== "complete" && (
        <ActionButton run={() => setOnboardingStatus(clientId, "complete")} className="adm-btn" pendingLabel="Saving…">
          ✓ Mark complete
        </ActionButton>
      )}
      {hasOnboarding && (status === "submitted" || status === "complete") && (
        <ConfirmButton
          label="Reopen for client edits"
          className="adm-btn-ghost"
          confirmLabel="Reopen and email client"
          title="Reopen onboarding?"
          message="The client's answers become editable again, and we email them a link to their portal."
          onConfirm={() => setOnboardingStatus(clientId, "reopened")}
        />
      )}
      <ActionButton run={() => resendOnboardingLink(clientId)} className="adm-btn-ghost" pendingLabel="Sending…" title="Creates a new personal link (valid 14 days) and emails it from support@">
        Resend onboarding link
      </ActionButton>
      {hasOnboarding && (
        <>
          <a href={`/admin/clients/${clientId}/onboarding/export`} className="adm-btn-ghost">
            Download JSON
          </a>
          <Link href={`/admin/clients/${clientId}/profile`} className="adm-btn-ghost">
            Printable profile
          </Link>
        </>
      )}
    </div>
  );
}
