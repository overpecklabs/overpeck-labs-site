"use client";

import Link from "next/link";
import { useRef } from "react";
import { usePanelIn } from "@/lib/usePanelIn";
import Annotation from "./Annotation";

const STEPS = [
  { n: "1", t: "Tell us about your business", d: "Your services, your towns, what you want more of." },
  { n: "2", t: "We design your mockup", d: "A custom look at your new homepage, built for your trade." },
  { n: "3", t: "You decide", d: "Love it? We build it. If not, you owe nothing." },
];

/** Bright accent section #1: a big yellow sticky note. */
export default function MockupOffer() {
  const root = useRef<HTMLElement>(null);
  usePanelIn(root, "right");
  return (
    <section ref={root} id="mockup" className="relative overflow-hidden px-5 py-24">
      <div data-panel className="relative mx-auto max-w-5xl">
        <div className="sticky-note tilt-l relative rounded-[4px] p-7 sm:p-12">
          <span className="tape" style={{ left: "18%" }} />
          <span className="tape" style={{ left: "82%", rotate: "4deg" }} />
          {/* folded corner */}
          <span className="absolute bottom-0 right-0 h-10 w-10 bg-[linear-gradient(135deg,#f5e37a_50%,#f8f8f5_50%)] shadow-[-2px_-2px_4px_rgba(0,0,0,0.06)]" aria-hidden />

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="inline-flex rounded-full border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink">Free Website Mockup</p>
              <h2 className="font-display mt-4 text-4xl font-bold leading-tight text-ink sm:text-5xl">
                See your new site <span className="marker-underline">before you pay anything.</span>
              </h2>
              <p className="mt-4 max-w-lg text-ink/85">
                We&apos;ll design a free, custom mockup of your new website, built around your business and the towns you serve. No obligation, no credit card.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link href="/free-mockup" className="btn-primary">
                  Get My Free Mockup
                </Link>
                <Annotation arrow="left" arrowFirst className="rotate-[-4deg]">
                  no catch
                </Annotation>
              </div>
            </div>
            <ol className="space-y-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4 rounded-md border border-ink/15 bg-white/60 p-4">
                  <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink font-bold text-ink">{s.n}</span>
                  <div>
                    <div className="font-semibold text-ink">{s.t}</div>
                    <div className="text-sm text-ink/80">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
