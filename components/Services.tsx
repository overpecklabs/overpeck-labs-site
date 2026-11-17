"use client";

import { useRef } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { useDrawOn } from "@/lib/useDrawOn";
import { usePanelIn } from "@/lib/usePanelIn";
import { ServiceIcon } from "./icons";
import Annotation from "./Annotation";

const SLUG: Record<string, string> = { websites: "websites", workflows: "workflows-automation", tracking: "track-optimize", ai: "ai" };

// Periodic-table styling for each service.
const ELEMENT: Record<string, { sym: string; el: string; bg: string; ink: string; tilt: string }> = {
  websites: { sym: "Ws", el: "Websites", bg: "#c8f5ec", ink: "#0f766e", tilt: "tilt-l" },
  workflows: { sym: "Au", el: "Automation", bg: "#dbe8ff", ink: "#1f6feb", tilt: "tilt-r" },
  tracking: { sym: "Op", el: "Optimize", bg: "#dcf3df", ink: "#237a34", tilt: "tilt-l" },
  ai: { sym: "Ai", el: "AI", bg: "#fdebc8", ink: "#a15c00", tilt: "tilt-r" },
};

export default function Services() {
  const root = useRef<HTMLElement>(null);
  useDrawOn(root);
  usePanelIn(root, "left");

  return (
    <section ref={root} id="services" style={{ ["--cv-h" as string]: "1981px" }} className="cv-m hex-paper relative overflow-hidden px-5 py-24">
      <div data-panel className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">The Complete Formula</p>
        <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
          <h2 className="font-display max-w-2xl text-4xl font-bold text-ink sm:text-5xl">
            Four elements. <span className="marker-underline">One system.</span>
          </h2>
          <Annotation arrow="down" color="#1f6feb" showFrom="md" className="-rotate-2">
            use one, or combine all four
          </Annotation>
        </div>

        <p className="mt-4 max-w-2xl text-ink/85">We engineer growth: each element builds on the last, so leads get found, followed up and measured.</p>

        <div data-depth="1" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const e = ELEMENT[s.key];
            return (
              <Link
                key={s.key}
                href={`/services/${SLUG[s.key]}`}
                className={`element-tile group flex flex-col p-5 pt-8 text-left shadow-[0_10px_26px_rgba(26,26,26,0.09)] ${e.tilt}`}
                style={{ background: `linear-gradient(180deg, ${e.bg} 0 132px, #fffefb 132px)` }}
              >
                <span className="element-num text-ink/80">{s.n}</span>
                <span className="absolute right-4 top-4" style={{ color: e.ink }}>
                  <ServiceIcon name={s.key} />
                </span>
                <span className="element-symbol text-6xl text-ink">{e.sym}</span>
                <span className="mt-1 text-xs font-bold uppercase tracking-widest text-ink/80">{e.el}</span>
                <span className="font-display mt-8 text-lg font-bold leading-snug text-ink">{s.name}</span>
                <span className="mt-2 flex-1 text-sm text-ink/80">{s.line}</span>
                <span className="mt-5 text-sm font-semibold" style={{ color: e.ink }}>
                  Learn more →
                </span>
              </Link>
            );
          })}
        </div>

        {/* the equation */}
        <p className="paper mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-md px-5 py-4 text-center text-base font-semibold text-ink sm:text-lg">
          <span>Website</span>
          <span aria-hidden className="text-ink/70">+</span>
          <span>Workflows</span>
          <span aria-hidden className="text-ink/70">+</span>
          <span>Tracking</span>
          <span aria-hidden className="text-ink/70">+</span>
          <span>AI</span>
          <span className="sr-only">equals</span>
          <svg width="40" height="14" viewBox="0 0 40 14" aria-hidden className="shrink-0">
            <path d="M2 7 H35 M28 2 L36 7 L28 12" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="marker-underline font-display text-xl font-bold">More booked jobs</span>
        </p>

        {/* how it all works together */}
        <div className="mt-10">
          <h3 className="font-display text-xl font-bold text-ink">How it all works together</h3>
          <ol className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
            {["Search", "Your site", "Form or AI", "Instant alert", "Follow-ups", "Dashboard", "Optimize"].map((step, i, all) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full border-2 border-ink/80 bg-white px-3 py-1.5">{step}</span>
                {i < all.length - 1 && (
                  <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden>
                    <path d="M1 6 H18 M13 2 L19 6 L13 10" fill="none" stroke="#1f6feb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
