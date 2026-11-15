"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const SENT = "If this email has admin access, a sign-in link is on its way.";

/**
 * Where the magic link should land. Production uses NEXT_PUBLIC_SITE_URL; previews and local dev
 * use the current origin (the PKCE verifier cookie lives on that origin).
 */
function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (env === "production" && configured) return configured.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return (configured ?? "http://localhost:3000").replace(/\/+$/, "");
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      await createClient().auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${siteUrl()}/auth/callback?next=/admin`, shouldCreateUser: false },
      });
    } catch {
      // Same message either way: never reveal who is an admin.
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="mt-6">
        <p role="status" className="rounded-lg border border-teal-ink/30 bg-note-teal/50 px-3 py-3 text-sm">
          {SENT}
        </p>
        <button type="button" onClick={() => setState("idle")} className="mt-4 text-sm font-semibold text-teal-ink underline underline-offset-2">
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label htmlFor="admin-email" className="block text-sm font-semibold">
        Email
      </label>
      <input
        id="admin-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="adm-input"
        placeholder="you@example.com"
      />
      <button type="submit" disabled={state === "sending"} className="btn-primary w-full !py-3">
        {state === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
