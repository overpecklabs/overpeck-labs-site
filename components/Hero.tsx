"use client";

import Chapter from "./Chapter";
import { scrollToId } from "@/lib/journey";

export default function Hero() {
  return (
    <Chapter index={0} id="top" length={2.2} fadeIn={false} fadeOutAt={0.45}>
      <div className="mx-auto w-full max-w-6xl px-5 pt-16">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_#19f0d2]" /> Bergen County, NJ
          </p>
          <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Websites, leads &amp; AI that <span className="text-gradient">work while you work.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-white/70 sm:text-lg">
            Overpeck Labs builds custom websites, lead generation and AI assistants for local plumbers, HVAC pros, electricians and remodelers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => scrollToId("contact")}>
              Get a free website mockup
            </button>
            <button className="btn-ghost" onClick={() => scrollToId("websites")}>
              See what we build
            </button>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/40">Scroll</div>
    </Chapter>
  );
}
