import type { Metadata } from "next";
import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";
import { DbError, Empty, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const clientId = typeof sp.client === "string" ? sp.client : undefined;
  const { data, error } = await supabase.from("clients").select("id, business_name").order("business_name").overrideTypes<{ id: string; business_name: string }[], { merge: false }>();
  if (error) return <DbError error={error} />;
  const clients = data ?? [];
  const backTo = clientId && clients.find((c) => c.id === clientId);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New project" back={backTo ? { href: `/admin/clients/${backTo.id}`, label: backTo.business_name } : { href: "/admin/projects", label: "Projects" }} />
      {clients.length === 0 ? (
        <Empty>
          Add a client first.{" "}
          <Link href="/admin/clients/new" className="font-semibold text-teal-ink underline">
            Add client
          </Link>
        </Empty>
      ) : (
        <div className="adm-card p-5 sm:p-6">
          <ProjectForm clients={clients} defaultClientId={backTo ? backTo.id : undefined} />
        </div>
      )}
    </div>
  );
}
