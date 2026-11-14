import Link from "next/link";
import Nav from "../Nav";
import Footer from "../Footer";
import ElementBadge from "../ElementBadge";
import type { Faq } from "@/lib/service-pages";
import { SERVICE_SLUGS } from "@/lib/slugs";

/** Nav + main + footer for the content pages (no 3D canvas: lighter and faster). */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="relative">{children}</main>
      <Footer />
    </>
  );
}

export function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative scroll-mt-24 px-5 py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHead({ kicker, title, sub }: { kicker: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">{kicker}</p>
      <h2 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-ink/85">{sub}</p>}
    </div>
  );
}

export function Divider() {
  return (
    <div className="px-5">
      <div className="board-divider" aria-hidden />
    </div>
  );
}

const TILTS = ["tilt-l", "tilt-r"];

/** Numbered index cards (problems, features, inclusions). */
export function IndexCards({ items, colors = ["#fffefb"] }: { items: { t: string; d: string }[]; colors?: string[] }) {
  return (
    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <li key={it.t} className={`relative rounded-[4px] border border-ink/10 p-5 shadow-[0_2px_3px_rgba(26,26,26,0.05),0_12px_26px_rgba(26,26,26,0.08)] ${TILTS[i % 2]}`} style={{ background: colors[i % colors.length] }}>
          <span className="text-xs font-bold tabular-nums text-ink/70">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="font-display mt-1 text-lg font-bold text-ink">{it.t}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink/85">{it.d}</p>
        </li>
      ))}
    </ul>
  );
}

/** Colorful numbered steps (lighter take on the homepage beakers). */
export function Steps({ steps }: { steps: { t: string; d: string }[] }) {
  const C = [
    ["#fff3a3", "#7a5b00"],
    ["#c8f5ec", "#0f766e"],
    ["#dbe8ff", "#1f6feb"],
    ["#dcf3df", "#237a34"],
  ];
  return (
    <ol className="relative mt-10 grid gap-6 md:grid-cols-4">
      <span aria-hidden className="absolute left-8 right-8 top-7 hidden h-1.5 rounded-full bg-[linear-gradient(90deg,#f7c948,#19f0d2,#5b9cf5,#4caf6e)] md:block" />
      {steps.map((s, i) => (
        <li key={s.t} className="relative">
          <span className="font-display relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 border-ink text-xl font-bold text-ink shadow-[0_6px_14px_rgba(26,26,26,0.1)]" style={{ background: C[i % 4][0] }}>
            {i + 1}
          </span>
          <h3 className="font-display mt-3 text-lg font-bold" style={{ color: C[i % 4][1] }}>
            {s.t}
          </h3>
          <p className="mt-1 text-[15px] text-ink/85">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

/** The four services as linked element-tile cards, each with a context-specific line. */
export function ServiceCards({ lines, exclude }: { lines?: Partial<Record<string, string>>; exclude?: string }) {
  const items = SERVICE_SLUGS.filter((s) => s.slug !== exclude);
  return (
    <ul className={`mt-8 grid gap-5 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((s, i) => (
        <li key={s.slug}>
          <Link
            href={`/services/${s.slug}`}
            className={`element-tile group flex h-full flex-col p-5 shadow-[0_10px_24px_rgba(26,26,26,0.08)] transition hover:-translate-y-1 ${TILTS[i % 2]}`}
            style={{ background: `linear-gradient(180deg, ${s.color} 0 96px, #fffefb 96px)` }}
          >
            <div className="flex items-center gap-3">
              <ElementBadge num={String(SERVICE_SLUGS.indexOf(s) + 1).padStart(2, "0")} symbol={s.sym} name={s.name.split(" ")[0]} bg="#fffefb" />
              <span className="font-display text-lg font-bold leading-tight text-ink">{s.name}</span>
            </div>
            {lines?.[s.slug] && <p className="mt-6 flex-1 text-[15px] text-ink/85">{lines[s.slug]}</p>}
            <span className="mt-4 text-sm font-semibold" style={{ color: s.ink }}>
              Learn more →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Pill links (industries, areas). */
export function ChipLinks({ items }: { items: { href: string; label: string }[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((i) => (
        <li key={i.href}>
          <Link href={i.href} className="inline-block rounded-full border-2 border-ink/80 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:border-teal-ink hover:bg-note-teal">
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** FAQ accordion + FAQPage JSON-LD (no email anywhere). */
export function FaqBlock({ faqs }: { faqs: Faq[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <div className="mt-8 divide-y divide-ink/10 overflow-hidden rounded-md border border-ink/10 bg-paper">
        {faqs.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink/70 text-lg leading-none transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink/85">{f.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}

/** Page hero board. */
export function HeroBoard({ kicker, h1, sub, children, art }: { kicker: React.ReactNode; h1: string; sub: string; children?: React.ReactNode; art?: React.ReactNode }) {
  return (
    <section className="board-surface relative overflow-hidden px-5 pb-16 pt-28 sm:pt-32">
      <div className="board-frame absolute inset-x-0 top-0 h-3" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="mb-4">{kicker}</div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">{h1}</h1>
          <p className="mt-5 max-w-xl text-lg text-ink/85">{sub}</p>
          {children}
        </div>
        {art && <div className="relative">{art}</div>}
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink/75">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {it.href ? (
              <Link href={it.href} className="hover:text-teal-ink hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
