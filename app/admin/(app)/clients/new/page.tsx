import type { Metadata } from "next";
import ClientForm from "@/components/admin/ClientForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Add client" };

export default async function NewClientPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add client" back={{ href: "/admin/clients", label: "Clients" }} />
      <ClientForm />
    </div>
  );
}
