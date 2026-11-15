"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const BAD = "Email or password is incorrect.";

/** Email + password sign-in. RLS on admin_users decides who is an admin; non-admins are signed straight back out. */
export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;

      const { data, error: adminError } = await supabase.from("admin_users").select("email").limit(1);
      if (adminError || !data || data.length === 0) {
        await supabase.auth.signOut();
        window.location.replace("/admin/login?error=not_authorized");
        return;
      }
      // Full navigation so the server (proxy + layout) sees the fresh session cookies.
      window.location.assign(next);
    } catch {
      // Same message for every failure: never reveal whether an email exists or is an admin.
      setError(BAD);
      setPassword("");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-email" className="adm-label">
          Email
        </label>
        <input id="admin-email" name="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="adm-input" disabled={busy} />
      </div>
      <div>
        <label htmlFor="admin-password" className="adm-label">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="adm-input"
          disabled={busy}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "admin-login-error" : undefined}
        />
      </div>
      {error && (
        <p id="admin-login-error" role="alert" className="rounded-lg border border-mk-red/30 bg-mk-red/5 px-3 py-2 text-sm text-mk-red">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} aria-busy={busy} className="btn-primary w-full !py-3">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
