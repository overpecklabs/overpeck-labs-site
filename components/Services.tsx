"use client";

import { scrollToId } from "@/lib/journey";
import { SERVICES } from "@/lib/services";
import { ServiceIcon } from "./icons";

export default function Services() {
  return (
    <section id="services" className="relative bg-ink px-5 pb-28 pt-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">What we do</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">Four ways we grow your business.</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <button
              key={s.key}
              onClick={() => scrollToId(s.anchor)}
              className="glass group flex flex-col rounded-3xl p-6 text-left transition hover:border-teal/50"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-teal/30 bg-teal/10 text-teal shadow-[0_0_24px_rgba(25,240,210,0.15)]">
                <ServiceIcon name={s.key} />
              </span>
              <span className="mt-5 text-xs font-semibold tracking-widest text-violet">{s.n}</span>
              <span className="font-display mt-1 text-xl font-bold leading-snug">{s.name}</span>
              <span className="mt-2 flex-1 text-sm text-white/65">{s.line}</span>
              <span className="mt-5 text-sm font-semibold text-teal opacity-70 transition group-hover:opacity-100">See it in action ↓</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
