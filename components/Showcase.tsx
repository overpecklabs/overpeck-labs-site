"use client";

import Image from "next/image";
import Link from "next/link";
import { RECEPTIONIST_PHONE as EXTERIOR_RECEPTIONIST } from "@/flagships/overpeck-exterior-care/phone";
import { RECEPTIONIST_PHONE as ELECTRIC_RECEPTIONIST } from "@/flagships/overpeck-electric/phone";
import { Parallax } from "@/components/demos/motion";

/**
 * Homepage "See what we build": our two flagship sample businesses (fictional), as showcase blocks that
 * stack on mobile and alternate left/right on desktop. Static screenshots live in /public/showcase. Image-only
 * parallax via <Parallax> (about 10% on desktop, half on phones, none with reduced motion). Demo links have no
 * ?preview=1, so visits count as real views. A receptionist call link only shows when that demo has a number.
 */

type Flagship = {
  key: string;
  name: string;
  href: string;
  url: string;
  pitch: string;
  features: string[];
  receptionist: { display: string; tel: string } | null;
  /** One-line callout above the buttons, followed by the receptionist number. */
  callout?: string;
  shots: { desktop: string; phone: string; desktopAlt: string; phoneAlt: string; bg: string };
};

const FLAGSHIPS: Flagship[] = [
  {
    key: "electric",
    name: "Overpeck Electric",
    href: "/demo/overpeck-electric",
    url: "overpecklabs.com/demo/overpeck-electric",
    pitch: "An on-call Bergen County electrician site where a glowing current powers each section up, from dark to light, as you scroll.",
    features: [
      "A single estimate form with “What do you need?” chips, including emergencies",
      "A glowing current that powers the page up as you scroll, plus a sample EV-charging estimate",
      "AI chat that puts safety first for sparks, burning smells and outages",
    ],
    receptionist: ELECTRIC_RECEPTIONIST,
    callout: "Includes a 24/7 AI receptionist, call it:",
    shots: {
      desktop: "/showcase/overpeck-electric-desktop.webp",
      phone: "/showcase/overpeck-electric-phone.webp",
      desktopAlt: "Overpeck Electric sample site on desktop: the headline “Bergen County's on-call electricians.” over an evening living room, with a short estimate form.",
      phoneAlt: "The electrician sample site on a phone: headline, estimate form with service chips and a call button on the first screen.",
      bg: "#0b0f17",
    },
  },
  {
    key: "exterior",
    name: "Overpeck Exterior Care",
    href: "/demo/overpeck-exterior-care",
    url: "overpecklabs.com/demo/overpeck-exterior-care",
    pitch: "Window washing, power washing and soft washing for Bergen County homes, with a scroll-driven site that sells the shine.",
    features: [
      "A single quote form with “What needs cleaning?” chips",
      "Scroll-driven window-cleaning effect plus a before/after slider",
      "AI chat that answers soft-wash vs. power-wash questions",
      ...(EXTERIOR_RECEPTIONIST ? ["AI receptionist that answers every call 24/7"] : []),
    ],
    receptionist: EXTERIOR_RECEPTIONIST,
    shots: {
      desktop: "/showcase/overpeck-exterior-care-desktop.webp",
      phone: "/showcase/overpeck-exterior-care-phone.webp",
      desktopAlt: "Overpeck Exterior Care sample site on desktop: the headline “Make your home look new again.” over a house photo, with a short quote form.",
      phoneAlt: "The exterior cleaning sample site on a phone: headline, quote form with service chips and a call button on the first screen.",
      bg: "#06232a",
    },
  },
];

function Preview({ f }: { f: Flagship }) {
  return (
    // grid: browser frame + phone column; the browser frame reaches ~45% under the phone, so the pair overlaps
    // without either one ever overflowing or being clipped by the section
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_var(--pw)] items-center [--pw:min(200px,46%)] lg:[--pw:min(260px,44%)]">
      <Link href={f.href} className="group relative z-0 mr-[calc(var(--pw)*-0.45)] block min-w-0 rounded-xl" aria-label={`Open the live ${f.name} demo`}>
        <div className="paper overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none">
          <div className="flex items-center gap-2 border-b border-ink/10 bg-[#f1f1ee] px-3 py-2" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-ink/70">{f.url}</span>
          </div>
          <Parallax className="aspect-[16/10]" amount={10}>
            <Image src={f.shots.desktop} width={1440} height={900} loading="lazy" sizes="(min-width: 1024px) 640px, 92vw" alt={f.shots.desktopAlt} className="h-full w-full object-cover object-top" style={{ background: f.shots.bg }} />
          </Parallax>
        </div>
      </Link>
      <PhoneFrame src={f.shots.phone} alt={f.shots.phoneAlt} bg={f.shots.bg} />
    </div>
  );
}

/**
 * iPhone-style frame. Everything is sized from the frame's own width (container units), so it scales cleanly:
 * bezel 3.5%, screen corner radius 12%, a Dynamic Island that sits on the screenshot's status bar (screenshots
 * are captured at 390x844 with a 47pt status bar on top, so the island never covers the site's header).
 * The screen is locked to 9:19.5 and the screenshot fills it exactly (cover, anchored to the top).
 */
function PhoneFrame({ src, alt, bg }: { src: string; alt: string; bg: string }) {
  return (
    // the wrapper is the size container; the frame and screen measure themselves in cqw of it (an element can't
    // size its own padding/radius in its own container units)
    <div className="@container relative z-10 w-full">
      <div className="rounded-[15.5cqw] bg-[#111] p-[3.5cqw] shadow-[0_28px_60px_-22px_rgba(26,26,26,0.55),0_8px_18px_-8px_rgba(26,26,26,0.35)] ring-1 ring-black/40">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[12cqw]" style={{ background: bg }}>
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 260px, 200px" loading="lazy" className="object-cover object-top" />
          <span aria-hidden className="absolute left-1/2 top-[2.4cqw] h-[7.2cqw] w-[27cqw] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

function Copy({ f }: { f: Flagship }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">{f.name}</h3>
        <span className="rounded-full border-2 border-ink bg-[#fff3a3] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-ink">Sample business</span>
      </div>
      <p className="mt-3 max-w-xl text-ink/85">{f.pitch}</p>
      <ul className="mt-6 space-y-3">
        {f.features.map((x) => (
          <li key={x} className="flex gap-3 text-ink">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#c8f5ec] text-teal-ink" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
      {f.callout && f.receptionist && (
        <p className="mt-6 flex items-start gap-2 rounded-2xl border-2 border-ink bg-[#fff3a3] px-4 py-2 text-sm font-semibold text-ink sm:inline-flex">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
          </svg>
          <a href={f.receptionist.tel} className="underline underline-offset-4 hover:no-underline">
            {f.callout} <span className="whitespace-nowrap">{f.receptionist.display}</span>
          </a>
        </p>
      )}
      <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-start">
        <Link href={f.href} className="btn-primary text-center" aria-label={`View the live demo: ${f.name}`}>
          View the live demo
        </Link>
        {f.receptionist && (
          <div>
            <a href={f.receptionist.tel} className="btn-ghost w-full flex-wrap text-center sm:w-auto">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </svg>
              Call the AI receptionist <span className="whitespace-nowrap font-normal">{f.receptionist.display}</span>
            </a>
            <p className="mt-1.5 text-center text-xs text-ink/70 sm:pl-2 sm:text-left">Demo line, try it anytime.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Showcase() {
  return (
    <section id="showcase" aria-labelledby="showcase-title" className="board-bg relative overflow-hidden px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">See it in action</p>
          <h2 id="showcase-title" className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
            See what we build
          </h2>
          <p className="mt-4 text-lg text-ink/85">Two sample Bergen County businesses we built: an on-call electrician and an exterior cleaning company, each with lead capture, an AI chat and a mobile-first design.</p>
        </div>

        <div className="mt-14 space-y-20 lg:space-y-24">
          {FLAGSHIPS.map((f, i) => (
            <article key={f.key} aria-label={f.name} className={`grid grid-cols-1 items-center gap-10 lg:gap-14 ${i % 2 ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" : "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"}`}>
              <div className={i % 2 ? "lg:order-2" : ""}>
                <Preview f={f} />
              </div>
              <div className={i % 2 ? "lg:order-1" : ""}>
                <Copy f={f} />
              </div>
            </article>
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-ink/85">
          <Link href="/free-mockup" className="font-semibold text-teal-ink underline underline-offset-4 hover:no-underline">
            Want one like this for your business?
          </Link>
        </p>
      </div>
    </section>
  );
}
