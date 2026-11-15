"use client";

import { SignOutButton } from "@/components/admin/AdminHeader";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const denied = /row-level security|permission denied|not authorized|jwt/i.test(error.message ?? "");
  return (
    <div role="alert" className="adm-card mx-auto mt-10 max-w-lg p-6 text-center">
      <p className="font-display text-xl font-bold">{denied ? "Not authorized" : "Something went wrong"}</p>
      <p className="mt-2 text-sm text-ink/70">{denied ? "Your account doesn't have access to this. Sign out and sign in with an admin account." : "This page hit an error. Try again, or reload the page."}</p>
      <div className="mt-4 flex justify-center gap-2">
        {!denied && (
          <button type="button" className="adm-btn" onClick={reset}>
            Try again
          </button>
        )}
        <SignOutButton className={denied ? "adm-btn" : "adm-btn-ghost"} />
      </div>
    </div>
  );
}
