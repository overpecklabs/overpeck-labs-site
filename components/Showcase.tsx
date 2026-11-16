"use client";

import Image from "next/image";
import Link from "next/link";
import { PLUMBING_PHONE } from "@/flagships/overpeck-plumbing/phone";
import { RECEPTIONIST_PHONE as EXTERIOR_RECEPTIONIST } from "@/flagships/overpeck-exterior-care/phone";
import { RECEPTIONIST_PHONE as ELECTRIC_RECEPTIONIST } from "@/flagships/overpeck-electric/phone";
import { Parallax } from "@/components/demos/motion";

/**
 * Homepage "See what we build": our three flagship sample businesses (fictional), as showcase blocks that
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
  shots: { desktop: string; phone: string; desktopAlt: string; phoneAlt: string; bg: string };
};

const FLAGSHIPS: Flagship[] = [
  {
    key: "plumbing",
    name: "Overpeck Plumbing",
    href: "/demo/overpeck-plumbing",
    url: "overpecklabs.com/demo/overpeck-plumbing",
    pitch: "A full lead-generation site for a Bergen County plumber, with a 24/7 AI receptionist you can call right now.",
    features: ["Lead capture above the fold: quote form plus tap-to-call", "AI receptionist answers every call 24/7", "Handles emergencies and books the job", "Fast, mobile-first, built to rank locally"],
    receptionist: PLUMBING_PHONE,
    shots: {
      desktop: "/showcase/overpeck-plumbing-desktop.webp",
      phone: "/showcase/overpeck-plumbing-phone.webp",
      desktopAlt: "Overpeck Plumbing sample site on desktop: an emergency call bar, the headline “Burst pipe? Flooding? We're on the way.”, a call button and a short quote form.",
      phoneAlt: "The plumbing sample site on a phone: headline, quote form and call button all on the first screen.",
      bg: "#050d1f",
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
      EXTERIOR_RECEPTIONIST ? "AI receptionist that answers every call 24/7" : "AI receptionist (demo line coming soon)",
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
  {
    key: "electric",
    name: "Overpeck Electric",
    href: "/demo/overpeck-electric",
    url: "overpecklabs.com/demo/overpeck-electric",
    pitch: "An on-call Bergen County electrician site with a night-time house that lights up room by room as you scroll.",
    features: [
      "A single estimate form with “What do you need?” chips, including emergencies",
      "Scroll-driven “house lights up” effect plus a sample EV-charging estimate",
      "AI chat that puts safety first for sparks, burning smells and outages",
      ELECTRIC_RECEPTIONIST ? "AI receptionist that answers every call 24/7" : "AI receptionist (demo line coming soon)",
    ],
    receptionist: ELECTRIC_RECEPTIONIST,
    shots: {
      desktop: "/showcase/overpeck-electric-desktop.webp",
      phone: "/showcase/overpeck-electric-phone.webp",
      desktopAlt: "Overpeck Electric sample site on desktop: the headline “Bergen County's on-call electricians.” over an evening living room, with a short estimate form.",
      phoneAlt: "The electrician sample site on a phone: headline, estimate form with service chips and a call button on the first screen.",
      bg: "#0b0f17",
    },
  },
];

function Preview({ f }: { f: Flagship }) {
  return (
    <div className="relative min-w-0 pb-10 pr-8 sm:pb-14 sm:pr-10 lg:pr-12">
      <Link href={f.href} className="group block rounded-xl" aria-label={`Open the live ${f.name} demo`}>
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
      <div className="absolute bottom-0 right-0 w-[30%] min-w-[104px] max-w-[190px] rotate-[3deg] rounded-[1.6rem] border-[6px] border-ink bg-ink shadow-[0_24px_50px_-18px_rgba(26,26,26,0.55)] sm:rounded-[2rem] sm:border-8">
        <span className="absolute left-1/2 top-1.5 z-10 h-1.5 w-1/3 -translate-x-1/2 rounded-full bg-ink" aria-hidden />
        <Parallax className="aspect-[390/844] rounded-[1.1rem] sm:rounded-[1.5rem]" amount={10}>
          <Image src={f.shots.phone} width={540} height={1169} loading="lazy" sizes="190px" alt={f.shots.phoneAlt} className="h-full w-full object-cover object-top" style={{ background: f.shots.bg }} />
        </Parallax>
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
          <p className="mt-4 text-lg text-ink/85">Three sample Bergen County businesses we built: an emergency plumber, an exterior cleaning company and an on-call electrician, each with lead capture and a 24/7 AI receptionist.</p>
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
