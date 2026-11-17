"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AREA_SLUGS, INDUSTRY_SLUGS, SERVICE_SLUGS } from "@/lib/slugs";
import { scrollToId } from "@/lib/journey";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

type Item = { href: string; label: string };
type Group = { key: string; label: string; hub: Item; items: Item[] };

const GROUPS: Group[] = [
  { key: "services", label: "Services", hub: { href: "/services", label: "All services" }, items: SERVICE_SLUGS.map((s) => ({ href: `/services/${s.slug}`, label: s.name })) },
  { key: "industries", label: "Industries", hub: { href: "/industries", label: "All industries" }, items: INDUSTRY_SLUGS.map((i) => ({ href: `/industries/${i.slug}`, label: i.name })) },
  { key: "areas", label: "Areas", hub: { href: "/areas", label: "All areas" }, items: AREA_SLUGS.map((a) => ({ href: `/areas/${a.slug}`, label: a.name })) },
];
const LINKS: Item[] = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState<string | null>(null); // desktop dropdown
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // close menus on route change, outside click and Escape
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // On the home page, smooth-scroll to sections; elsewhere follow the /#id link.
  const onHash = (href: string) => (e: React.MouseEvent) => {
    const id = href.split("#")[1];
    if (id && document.getElementById(id)) {
      e.preventDefault();
      setMobile(false);
      scrollToId(id);
    }
  };

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <nav aria-label="Main" className="nav-shell glass relative mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5">
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0 });
            }
          }}
          className="font-display text-lg font-bold tracking-tight"
        >
          Overpeck<span className="text-teal"> Labs</span>
        </Link>

        {/* desktop */}
        <ul className="hidden items-center gap-0.5 text-sm lg:flex">
          {GROUPS.map((g) => {
            const isOpen = open === g.key;
            return (
              <li key={g.key} className="relative" onMouseEnter={() => setOpen(g.key)} onMouseLeave={() => setOpen((o) => (o === g.key ? null : o))}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`menu-${g.key}`}
                  onClick={() => setOpen(isOpen ? null : g.key)}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[#2b2b2b] hover:bg-ink/5"
                >
                  {g.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div id={`menu-${g.key}`} hidden={!isOpen} className="absolute left-0 top-full pt-2">
                  <div className={`paper rounded-md p-3 ${g.items.length > 8 ? "grid w-[420px] grid-cols-2 gap-x-2" : "w-60"}`}>
                    <Link href={g.hub.href} className="col-span-2 mb-1 block rounded px-3 py-2 text-sm font-bold text-teal-ink hover:bg-ink/5">
                      {g.hub.label} →
                    </Link>
                    {g.items.map((it) => (
                      <Link key={it.href} href={it.href} className="block rounded px-3 py-2 text-sm text-ink hover:bg-ink/5">
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={onHash(l.href)} className="rounded-full px-3 py-1.5 text-[#2b2b2b] hover:bg-ink/5">
                {l.label}
              </a>
            </li>
          ))}
          <li className="ml-1">
            <Link href="/free-mockup" className="nav-cta rounded-full px-4 py-1.5 font-semibold">
              Free mockup
            </Link>
          </li>
        </ul>

        {/* phones / tablets */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/free-mockup" className="nav-cta rounded-full px-3.5 py-1.5 text-sm font-semibold">
            Free mockup
          </Link>
          <button
            type="button"
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            aria-label={mobile ? "Close menu" : "Open menu"}
            onClick={() => setMobile((m) => !m)}
            className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {mobile && (
        <div id="mobile-menu" className="paper mx-auto mt-2 max-h-[calc(100svh-90px)] max-w-6xl overflow-y-auto rounded-2xl p-4 lg:hidden">
          {GROUPS.map((g) => (
            <details key={g.key} className="group border-b border-ink/10 last:border-0">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {g.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-open:rotate-180" aria-hidden>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="grid grid-cols-2 gap-x-2 pb-3">
                <Link href={g.hub.href} className="col-span-2 rounded px-2 py-2 text-sm font-bold text-teal-ink">
                  {g.hub.label} →
                </Link>
                {g.items.map((it) => (
                  <Link key={it.href} href={it.href} className="rounded px-2 py-2 text-sm text-ink">
                    {it.label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={onHash(l.href)} className="block border-b border-ink/10 py-3 font-semibold text-ink">
              {l.label}
            </a>
          ))}
          <a href={`tel:${PHONE_TEL}`} className="mt-3 block py-2 font-semibold text-teal-ink">
            Call {PHONE_DISPLAY}
          </a>
        </div>
      )}
    </header>
  );
}
