import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientForm from "@/components/admin/ClientForm";
import { DbError, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import type { Client } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Edit client" };

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle<Client>();
  if (error) return <DbError error={error} />;
  if (!data) notFound();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={`Edit ${data.business_name}`} back={{ href: `/admin/clients/${data.id}`, label: data.business_name }} />
      <ClientForm client={data} />
    </div>
  );
}
