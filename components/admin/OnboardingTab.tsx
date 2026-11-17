import OnboardingControls from "./OnboardingControls";
import OnboardingProfile from "./OnboardingProfile";
import { Badge, Card, Empty, Field } from "./ui";
import { fmtDateTime, fmtRelative } from "@/lib/admin/format";
import type { ClientOnboardingDetail } from "@/lib/admin/onboarding";
import { computeProgress } from "@/lib/portal/schema";
import { getWizard } from "@/lib/portal/wizards";
import { STATUS_LABEL } from "@/lib/portal/types";

/** The client page's Onboarding tab. */
export default function OnboardingTab({ clientId, detail }: { clientId: string; detail: ClientOnboardingDetail }) {
  const { onboarding: ob, files, members, invite, subscription } = detail;
  const wizard = getWizard(ob?.plan);
  const status = ob?.status ?? "not_started";
  const percent = ob && wizard ? computeProgress(wizard, ob.answers, ob.status).percent : 0;
  const inviteState = !invite ? "No link sent" : invite.used_at ? `Used ${fmtDateTime(invite.used_at)}` : new Date(invite.expires_at) < new Date() ? `Expired ${fmtDateTime(invite.expires_at)}` : `Valid until ${fmtDateTime(invite.expires_at)}`;

  return (
    <div className="space-y-6">
      <Card title="Onboarding" actions={<OnboardingControls clientId={clientId} status={status} hasOnboarding={!!ob} />}>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Status">
            <Badge value={status} label={STATUS_LABEL[status]} />
          </Field>
          <Field label="Plan">{wizard?.planName ?? subscription?.plan ?? null}</Field>
          <Field label="Progress">{ob ? `${percent}% complete` : null}</Field>
          <Field label="Last activity">{ob ? `${fmtRelative(ob.updated_at)} (${fmtDateTime(ob.updated_at)})` : null}</Field>
          <Field label="Payment">{subscription ? `${subscription.status} · since ${fmtDateTime(subscription.created_at)}` : null}</Field>
          <Field label="Submitted">{ob?.submitted_at ? fmtDateTime(ob.submitted_at) : null}</Field>
          <Field label="Latest link">{inviteState}</Field>
          <Field label="Portal sign-in">{members.length ? members.map((m) => m.email).join(", ") : "Not claimed yet"}</Field>
        </dl>
      </Card>

      {!ob ? (
        <Empty>No onboarding yet. It starts when the client opens their personal link and signs in.</Empty>
      ) : !wizard ? (
        <Empty>This client&apos;s plan isn&apos;t one of Starter, Growth or Pro, so there&apos;s no wizard to show.</Empty>
      ) : (
        <OnboardingProfile wizard={wizard} answers={ob.answers} files={files} />
      )}
    </div>
  );
}
