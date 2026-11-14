"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { scrollToId } from "@/lib/journey";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

/**
 * Hero board. The 3D flask (in the fixed handoff canvas) sits on the [data-anchor="flask"]
 * placeholder and starts pouring as you scroll; the stream flows straight into section 01.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.3 })
        .to(".hero-underline path", { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" })
        .to(".hero-annotation", { opacity: 1, y: 0, duration: 0.45 }, "+=0.3");
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative md:h-[150vh] motion-reduce:md:h-auto">
      <div className="relative overflow-hidden md:sticky md:top-0 md:h-[100svh] motion-reduce:md:static">
        {/* aluminum frame edge */}
        <div className="board-frame absolute inset-x-0 top-0 h-3" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 pb-16 pt-24 md:min-h-[100svh] md:grid-cols-[1.05fr_1fr] md:gap-10 md:pb-24 md:pt-20">
          <div className="relative z-10 text-ink">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Bergen County, NJ
            </p>
            <h1 className="font-display text-[2.45rem] font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.1rem]">
              Websites, leads &amp; AI that{" "}
              <span className="relative inline-block whitespace-nowrap">
                work while
                <svg className="hero-underline pointer-events-none absolute -bottom-2 left-0 h-3 w-full overflow-visible" viewBox="0 0 240 12" preserveAspectRatio="none" aria-hidden>
                  <path d="M3 8 Q60 2 120 7 T237 6" fill="none" stroke="#19f0d2" strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="[stroke-dashoffset:1] motion-reduce:[stroke-dashoffset:0]" />
                </svg>
              </span>{" "}
              you work.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink/85 sm:text-lg">
              We build websites that win business, automate the busywork, track what&apos;s working and add AI that never misses a lead. For local plumbers, HVAC pros, electricians and remodelers.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center gap-3">
              <Link href="/free-mockup" className="btn-primary">
                Get My Free Mockup
              </Link>
              <a href={`tel:${PHONE_TEL}`} className="btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                </svg>
                {PHONE_DISPLAY}
              </a>
            </div>
            <div className="hero-annotation pointer-events-none mt-5 flex translate-y-2 items-start gap-1 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100" aria-hidden>
              <svg width="58" height="48" viewBox="0 0 58 48" className="shrink-0" fill="none" stroke="#d93f44" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M52 44 C40 40 20 34 10 10 M4 20 L9 8 L20 14" />
              </svg>
              <span className="font-marker -rotate-3 pt-3 text-xl text-mk-red md:text-2xl">more calls, less chaos</span>
            </div>
            <p className="mt-4 text-sm text-ink/75">Free custom mockup before you pay anything. No obligation.</p>
          </div>

          {/* the 3D flask sits here (placeholder keeps layout + gives the canvas its position) */}
          <div className="relative">
            <div data-anchor="flask" className="mx-auto aspect-[4/5] w-full max-w-[220px] md:max-w-[340px]" />
            <span className="font-marker pointer-events-none absolute -bottom-2 left-1/2 hidden -translate-x-1/2 text-lg text-mk-blue md:block" aria-hidden>
              scroll to pour ↓
            </span>
          </div>
        </div>


        <button onClick={() => scrollToId("websites")} className="sr-only focus:not-sr-only focus:absolute focus:bottom-10 focus:left-1/2">
          Skip to services
        </button>
      </div>
    </section>
  );
}
