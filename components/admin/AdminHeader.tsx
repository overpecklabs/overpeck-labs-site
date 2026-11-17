"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pipeline", label: "Pipeline" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/onboarding", label: "Onboarding" },
  { href: "/admin/projects", label: "Projects" },
];

export function SignOutButton({ className = "adm-btn-ghost" }: { className?: string }) {
  return (
    <form action="/auth/signout" method="post">
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}

export default function AdminHeader({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 print:hidden border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/admin" className="shrink-0 font-display text-base font-bold">
          Overpeck Labs <span className="text-teal-ink">Admin</span>
        </Link>
        <nav aria-label="Admin" className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${active(n.href) ? "bg-ink text-white" : "text-ink/75 hover:bg-ink/5"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <span className="max-w-[16rem] truncate text-xs text-ink/60" title={email}>
            {email}
          </span>
          <SignOutButton />
        </div>
        <button
          type="button"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 md:hidden"
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div id="admin-mobile-nav" className="border-t border-ink/10 bg-paper px-4 pb-4 pt-2 md:hidden">
          <nav aria-label="Admin mobile" className="flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2.5 font-semibold ${active(n.href) ? "bg-ink text-white" : "text-ink/80"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
            <span className="truncate text-xs text-ink/60">{email}</span>
            <SignOutButton />
          </div>
        </div>
      )}
    </header>
  );
}
