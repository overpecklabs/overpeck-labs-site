"use client";

import Chapter from "./Chapter";
import { scrollToId } from "@/lib/journey";
import Link from "next/link";

export default function Hero() {
  return (
    <Chapter index={0} id="top" length={2.2} fadeIn={false} fadeOutAt={0.45}>
      <div className="mx-auto w-full max-w-6xl px-5 pt-16">
        <div className="max-w-xl max-sm:-mx-2 max-sm:rounded-3xl max-sm:bg-ink/55 max-sm:p-3 max-sm:backdrop-blur-[2px]">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_#19f0d2]" /> Bergen County, NJ
          </p>
          <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Websites, leads &amp; AI that <span className="text-gradient">work while you work.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-white/70 sm:text-lg">
            We build websites that win business, automate the busywork, track what&apos;s working and add AI that never misses a lead. Made for local plumbers, HVAC pros, electricians and remodelers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/free-mockup" className="btn-primary">
              Get My Free Mockup
            </Link>
            <button className="btn-ghost" onClick={() => scrollToId("services")}>
              See our services
            </button>
          </div>
          <p className="mt-4 text-sm text-white/50">Free custom mockup before you pay anything. No obligation.</p>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 max-sm:hidden -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/40">Scroll</div>
    </Chapter>
  );
}
