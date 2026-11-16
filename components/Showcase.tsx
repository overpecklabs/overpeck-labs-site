"use client";

import Image from "next/image";
import Link from "next/link";
import { Parallax } from "@/components/demos/motion";

/**
 * Homepage "See it in action": our flagship sample demo, Overpeck Plumbing (a fictional business).
 * Static screenshots live in /public/showcase. Image-only parallax via <Parallax> (about 10% on desktop,
 * half on phones, none with reduced motion). The demo link has no ?preview=1, so visits count as real views.
 */

const DEMO_HREF = "/demo/overpeck-plumbing";
const RECEPTIONIST = { display: "(201) 379-9138", tel: "tel:+12013799138" };

const FEATURES = [
  "Lead capture above the fold: quote form plus tap-to-call",
  "AI receptionist answers every call 24/7",
  "Handles emergencies and books the job",
  "Fast, mobile-first, built to rank locally",
];

export default function Showcase() {
  return (
    <section id="showcase" aria-labelledby="showcase-title" className="board-bg relative overflow-hidden px-5 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
        {/* preview: desktop browser frame + overlapping phone frame */}
        <div className="relative min-w-0 pb-10 pr-8 sm:pb-14 sm:pr-10 lg:pr-12">
          <Link href={DEMO_HREF} className="group block rounded-xl" aria-label="Open the live Overpeck Plumbing demo">
            <div className="paper overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none">
              <div className="flex items-center gap-2 border-b border-ink/10 bg-[#f1f1ee] px-3 py-2" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-ink/70">overpecklabs.com/demo/overpeck-plumbing</span>
              </div>
              <Parallax className="aspect-[16/10] bg-[#050d1f]" amount={10}>
                <Image
                  src="/showcase/overpeck-plumbing-desktop.webp"
                  width={1440}
                  height={900}
                  loading="lazy"
                  sizes="(min-width: 1024px) 640px, 92vw"
                  alt="Overpeck Plumbing sample site on desktop: an emergency call bar, the headline “Burst pipe? Flooding? We're on the way.”, a call button and a short quote form."
                  className="h-full w-full object-cover object-top"
                />
              </Parallax>
            </div>
          </Link>
          <div className="absolute bottom-0 right-0 w-[30%] min-w-[104px] max-w-[190px] rotate-[3deg] rounded-[1.6rem] border-[6px] border-ink bg-ink shadow-[0_24px_50px_-18px_rgba(26,26,26,0.55)] sm:rounded-[2rem] sm:border-8">
            <span className="absolute left-1/2 top-1.5 z-10 h-1.5 w-1/3 -translate-x-1/2 rounded-full bg-ink" aria-hidden />
            <Parallax className="aspect-[390/844] rounded-[1.1rem] bg-[#050d1f] sm:rounded-[1.5rem]" amount={10}>
              <Image
                src="/showcase/overpeck-plumbing-phone.webp"
                width={540}
                height={1169}
                loading="lazy"
                sizes="190px"
                alt="The same sample site on a phone: headline, quote form and call button all on the first screen."
                className="h-full w-full object-cover object-top"
              />
            </Parallax>
          </div>
        </div>

        {/* copy */}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">See it in action</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 id="showcase-title" className="font-display text-4xl font-bold text-ink sm:text-5xl">
              See what we build
            </h2>
            <span className="rounded-full border-2 border-ink bg-[#fff3a3] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-ink">Sample business</span>
          </div>
          <p className="mt-4 max-w-xl text-lg text-ink/85">A full lead-generation site for a Bergen County plumber, with a 24/7 AI receptionist you can call right now.</p>

          <ul className="mt-7 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3 text-ink">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#c8f5ec] text-teal-ink" aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-start">
            <Link href={DEMO_HREF} className="btn-primary text-center">
              View the live demo
            </Link>
            <div>
              <a href={RECEPTIONIST.tel} className="btn-ghost w-full flex-wrap text-center sm:w-auto">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                </svg>
                Call the AI receptionist <span className="whitespace-nowrap font-normal">{RECEPTIONIST.display}</span>
              </a>
              <p className="mt-1.5 text-center text-xs text-ink/70 sm:pl-2 sm:text-left">Demo line, try it anytime.</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-ink/85">
            <Link href="/free-mockup" className="font-semibold text-teal-ink underline underline-offset-4 hover:no-underline">
              Want one like this for your business?
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
