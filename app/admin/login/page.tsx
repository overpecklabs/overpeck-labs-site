import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  not_authorized: "That account doesn't have admin access.",
  link_invalid: "That sign-in link is invalid or has expired.",
};

/** Only relative /admin paths (never the login page itself, never protocol-relative). */
function safeNext(raw: string | undefined): string {
  if (!raw || raw.includes("\\") || raw.startsWith("//")) return "/admin";
  if (!/^\/admin(?:[/?#]|$)/.test(raw) || /^\/admin\/login(?:[/?#]|$)/.test(raw)) return "/admin";
  return raw;
}

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const code = typeof sp.error === "string" ? sp.error : undefined;
  const error = code ? ERRORS[code] : undefined;
  const next = safeNext(typeof sp.next === "string" ? sp.next : undefined);

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        <p className="font-display text-lg font-bold">
          Overpeck Labs <span className="text-teal-ink">Admin</span>
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold">Sign in</h1>
        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-mk-red/30 bg-mk-red/5 px-3 py-2 text-sm text-mk-red">
            {error}
          </p>
        )}
        <LoginForm next={next} />
      </div>
    </main>
  );
}
