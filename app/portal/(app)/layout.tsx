import { redirect } from "next/navigation";
import Shell, { Panel, SignOutForm } from "@/components/portal/Shell";
import { getPortalMe, getPortalUser } from "@/lib/portal/server";

export const dynamic = "force-dynamic";

/** Everything in the portal needs a signed-in user (verified with getUser()) who belongs to a client. */
export default async function PortalAppLayout({ children }: { children: React.ReactNode }) {
  const user = await getPortalUser();
  if (!user) redirect("/portal/login");

  const me = await getPortalMe();
  if (!me) {
    return (
      <Shell>
        <Panel>
          <h1 className="font-display text-2xl font-bold">No portal found for this email</h1>
          <p className="mt-3 text-sm text-ink/75">
            We couldn&apos;t find a client portal for <strong>{user.email}</strong>. If you signed up with a different email, sign out and try that one.
          </p>
          <div className="mt-5">
            <SignOutForm className="adm-btn" />
          </div>
        </Panel>
      </Shell>
    );
  }

  return (
    <Shell signedIn wide>
      {children}
    </Shell>
  );
}
