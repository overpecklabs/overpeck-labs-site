import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OnboardingProfile from "@/components/admin/OnboardingProfile";
import PrintButton from "@/components/admin/PrintButton";
import { DbError, Empty, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDate } from "@/lib/admin/format";
import { loadClientOnboarding } from "@/lib/admin/onboarding";
import { getWizard } from "@/lib/portal/wizards";
import { STATUS_LABEL } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Client profile" };

type Row = { id: string; business_name: string; contact_name: string | null; phone: string | null; email: string | null };

/** Printable client profile (use the browser's Print / Save as PDF). The admin header is hidden when printing. */
export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { data: client, error } = await supabase.from("clients").select("id, business_name, contact_name, phone, email").eq("id", id).maybeSingle<Row>();
  if (error?.code === "22P02") notFound();
  if (error) return <DbError error={error} />;
  if (!client) notFound();
  const { detail, error: loadErr } = await loadClientOnboarding(supabase, id);
  if (loadErr) return <DbError error={loadErr} />;
  const ob = detail.onboarding;
  const wizard = getWizard(ob?.plan);

  return (
    <>
      <div className="print:hidden">
        <PageHeader back={{ href: `/admin/clients/${id}?tab=onboarding`, label: "Onboarding" }} title="Client profile" actions={<PrintButton />} />
      </div>
      <header className="mb-5 border-b border-ink/15 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">Overpeck Labs · Client profile</p>
        <h1 className="font-display mt-1 text-3xl font-bold">{client.business_name}</h1>
        <p className="mt-1 text-sm text-ink/70">
          {[wizard ? `${wizard.planName} plan` : null, ob ? STATUS_LABEL[ob.status] : null, ob?.submitted_at ? `Submitted ${fmtDate(ob.submitted_at)}` : null, `Printed ${fmtDate(new Date().toISOString())}`].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1 text-sm text-ink/70">{[client.contact_name, client.phone, client.email].filter(Boolean).join(" · ")}</p>
      </header>
      {ob && wizard ? <OnboardingProfile wizard={wizard} answers={ob.answers} files={detail.files} showLinks={false} /> : <Empty>No onboarding answers yet.</Empty>}
    </>
  );
}
