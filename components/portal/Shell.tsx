import Link from "next/link";

export function SignOutForm({ className = "adm-btn-ghost" }: { className?: string }) {
  return (
    <form action="/auth/signout?to=portal" method="post">
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}

/** Header + centered column for every portal page. */
export default function Shell({ children, signedIn = false, wide = false }: { children: React.ReactNode; signedIn?: boolean; wide?: boolean }) {
  return (
    <>
      <header className="border-b border-ink/10 bg-paper/95">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href={signedIn ? "/portal" : "/"} className="font-display text-base font-bold">
            Overpeck Labs <span className="text-teal-ink">Client portal</span>
          </Link>
          {signedIn && <SignOutForm />}
        </div>
      </header>
      <main className={`mx-auto px-4 pb-20 pt-6 sm:px-6 sm:pt-10 ${wide ? "max-w-4xl" : "max-w-xl"}`}>{children}</main>
    </>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`adm-card p-5 sm:p-7 ${className}`}>{children}</section>;
}

export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-ink/60">{percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-teal-ink transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
