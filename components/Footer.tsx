import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";
import { AREA_SLUGS, INDUSTRY_SLUGS } from "@/lib/slugs";

/*
  Site footer: a slim pre-footer CTA band on the board, then a deep-graphite footer.
  Desktop: 5 columns. Phones: brand block + native <details> accordions (no JS needed).
*/

type LinkItem = { label: string; href: string; sub?: string };

const SERVICES: LinkItem[] = [
  { label: "Services overview", href: "/services" },
  { label: "Websites", href: "/services/websites" },
  { label: "Workflows & Automation", href: "/services/workflows-automation" },
  { label: "Track & Optimize", href: "/services/track-optimize" },
  { label: "AI Implementation", href: "/services/ai", sub: "AI Chatbot · AI Call Receptionist · AI Agents" },
];
const COMPANY: LinkItem[] = [
  { label: "How It Works", href: "/#process" },
  { label: "Industries", href: "/#industries" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Free Mockup", href: "/free-mockup" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];
const FOOTER_INDUSTRIES = ["plumbing", "hvac", "electricians", "roofing", "landscaping", "contractors"];
const INDUSTRIES: LinkItem[] = [
  ...FOOTER_INDUSTRIES.map((slug) => {
    const i = INDUSTRY_SLUGS.find((x) => x.slug === slug)!;
    return { label: slug === "contractors" ? "Contractors" : i.name, href: `/industries/${slug}` };
  }),
  { label: "See all →", href: "/industries" },
];
const AREAS: LinkItem[] = [...AREA_SLUGS.map((a) => ({ label: a.name, href: `/areas/${a.slug}` })), { label: "See all →", href: "/areas" }];

// Social accounts: add real profile URLs here when they exist. Nothing renders while this is empty.
const SOCIAL: { label: string; href: string }[] = [];

const HEX = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='56' height='97' viewBox='0 0 56 97'><path d='M28 0 l28 16 v32 l-28 16 l-28 -16 v-32 z M28 64 v33' fill='none' stroke='#ffffff' stroke-width='1' opacity='0.045'/></svg>"
)}")`;

const linkCls = "text-sm text-[#c9d1d9] transition-colors hover:text-[#19f0d2] focus-visible:text-[#19f0d2]";

const PhoneIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

function LinkList({ items }: { items: LinkItem[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it.label}>
          <Link href={it.href} className={linkCls}>
            {it.label}
          </Link>
          {it.sub && <div className="mt-0.5 text-xs text-[#9aa4ae]">{it.sub}</div>}
        </li>
      ))}
    </ul>
  );
}

const COLUMNS: { title: string; body: React.ReactNode }[] = [
  { title: "Services", body: <LinkList items={SERVICES} /> },
  { title: "Company", body: <LinkList items={COMPANY} /> },
  { title: "Industries we serve", body: <LinkList items={INDUSTRIES} /> },
  { title: "Areas served", body: <LinkList items={AREAS} /> },
];

export default function Footer({ hideCta = false }: { hideCta?: boolean }) {
  return (
    <footer style={{ ["--cv-h" as string]: "1005px" }} className="cv-m relative z-10">
      {/* pre-footer CTA band */}
      {!hideCta && (
        <div className="px-5 pb-12 pt-6">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-lg border border-ink/10 bg-[linear-gradient(100deg,#e6fbf6,#eef4ff)] px-6 py-6 shadow-[0_10px_28px_rgba(26,26,26,0.08)] sm:px-8 md:flex-row md:items-center">
            <p className="font-display text-xl font-bold text-ink sm:text-2xl">
              Ready to see your new site? <span className="font-sans text-base font-normal text-ink/85 sm:text-lg">Get a free mockup, no obligation.</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/free-mockup" className="btn-primary">
                Get My Free Mockup
              </Link>
              <a href={`tel:${PHONE_TEL}`} className="btn-ghost">
                <PhoneIcon />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* main footer */}
      <div className="bg-[#1f2328] text-[#c9d1d9]" style={{ backgroundImage: HEX, backgroundSize: "56px 97px" }}>
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1.15fr_1fr_1fr_0.9fr] lg:gap-8">
            {/* brand */}
            <div>
              <Link href="/" className="font-display text-2xl font-bold text-white">
                Overpeck<span className="text-[#19f0d2]"> Labs</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#c9d1d9]">Websites, automation, tracking and AI for Bergen County businesses.</p>
              <Link href="/free-mockup" className="btn-primary mt-5 !px-5 !py-2.5 text-sm">
                Get My Free Mockup
              </Link>
              <a href={`tel:${PHONE_TEL}`} className="mt-5 flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#19f0d2]">
                <PhoneIcon />
                {PHONE_DISPLAY}
              </a>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#9aa4ae]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                Serving Bergen County, NJ
              </p>
              {SOCIAL.length > 0 && (
                <ul className="mt-5 flex gap-3">
                  {SOCIAL.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} className={linkCls} rel="noopener noreferrer" target="_blank">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* desktop columns */}
            {COLUMNS.map((c) => (
              <nav key={c.title} aria-label={c.title} className="hidden lg:block">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">{c.title}</h2>
                {c.body}
              </nav>
            ))}

            {/* phone accordions */}
            <div className="divide-y divide-white/10 border-y border-white/10 lg:hidden">
              {COLUMNS.map((c) => (
                <details key={c.title} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-bold uppercase tracking-widest text-white [&::-webkit-details-marker]:hidden">
                    {c.title}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-open:rotate-180" aria-hidden>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="pb-5">{c.body}</div>
                </details>
              ))}
            </div>
          </div>

          {/* bottom bar */}
          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-[#9aa4ae] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Overpeck Labs. All rights reserved.</p>
            <ul className="flex gap-6">
              <li>
                <Link href="/privacy" className={linkCls}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={linkCls}>
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
