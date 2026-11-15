import AdminHeader from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/** Every page in this group renders only after the server confirms an admin session. */
export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();
  return (
    <>
      <AdminHeader email={email} />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">{children}</main>
    </>
  );
}
