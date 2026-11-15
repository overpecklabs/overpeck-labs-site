import Link from "next/link";
import { TONE } from "@/lib/admin/labels";
import { friendlyError, isNotAuthorized } from "@/lib/admin/errors";
import type { Channel } from "@/lib/admin/types";
import { SignOutButton } from "./AdminHeader";

export function Badge({ value, label }: { value: string; label: string }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border border-ink/10 px-2.5 py-0.5 text-xs font-semibold text-ink ${TONE[value] ?? "bg-ink/5"}`}>
      {label}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions, back }: { title: React.ReactNode; subtitle?: React.ReactNode; actions?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-ink/60 hover:text-ink">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
          {subtitle && <div className="mt-1 text-sm text-ink/65">{subtitle}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ title, actions, children, className = "" }: { title?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`adm-card ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/[0.07] px-4 py-3 sm:px-5">
          {title && <h2 className="font-display text-base font-bold">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-ink/15 px-4 py-6 text-center text-sm text-ink/55">{children}</p>;
}

/** Friendly data error; RLS failures show "Not authorized" with a sign-out button. */
export function DbError({ error }: { error: { message: string; code?: string } }) {
  const denied = isNotAuthorized(error);
  return (
    <div role="alert" className="adm-card mx-auto max-w-lg p-6 text-center">
      <p className="font-display text-xl font-bold">{denied ? "Not authorized" : "Couldn't load this page"}</p>
      <p className="mt-2 text-sm text-ink/70">
        {denied ? "Your account doesn't have access to this data. Sign out and sign in with an admin account." : friendlyError(error, "Please refresh and try again.")}
      </p>
      {denied && (
        <div className="mt-4 flex justify-center">
          <SignOutButton className="adm-btn" />
        </div>
      )}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</dt>
      <dd className="mt-0.5 break-words text-sm">{children ?? <span className="text-ink/40">—</span>}</dd>
    </div>
  );
}

export function ChannelIcon({ channel, className = "" }: { channel: Channel; className?: string }) {
  const paths: Record<Channel, React.ReactNode> = {
    call: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    sms: <path d="M4 5h16v11H9l-5 4z" />,
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    meeting: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
    note: <path d="M5 3h10l4 4v14H5zM14 3v5h5M8 13h8M8 17h6" />,
  };
  const tone: Record<Channel, string> = {
    call: "bg-note-teal",
    sms: "bg-note-blue",
    email: "bg-note-yellow",
    meeting: "bg-note-green",
    note: "bg-ink/5",
  };
  return (
    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/10 ${tone[channel]} ${className}`} aria-hidden>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {paths[channel]}
      </svg>
    </span>
  );
}

export function Progress({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tabular-nums text-ink/70">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-ink/10">
        <span className="block h-full rounded-full bg-teal-ink" style={{ width: `${pct}%` }} />
      </span>
      {done}/{total}
    </span>
  );
}
