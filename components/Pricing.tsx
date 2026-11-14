"use client";

import { scrollToId } from "@/lib/journey";

const PLANS = [
  {
    name: "Starter Site",
    tag: "Websites",
    blurb: "A fast, custom website that makes it easy to call or request a quote.",
    items: ["Custom design", "Mobile-first build", "Click-to-call + quote form", "Local SEO foundations"],
  },
  {
    name: "Lead Engine",
    tag: "Lead generation",
    blurb: "Everything in Starter, plus a system that brings in and tracks new leads.",
    items: ["Local landing pages", "Lead tracking", "Ad and search campaign setup", "Monthly reporting"],
    featured: true,
  },
  {
    name: "AI Operator",
    tag: "AI implementation",
    blurb: "An assistant that books jobs, follows up and asks for reviews.",
    items: ["AI chat + booking assistant", "Automated follow-ups", "Review requests", "Set up around your schedule"],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-ink px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">Pricing</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">Start small. Add what you need.</h2>
        <p className="mt-4 max-w-xl text-white/65">Pricing depends on your business and goals. Book a quick call and we'll scope it together.</p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`glass flex flex-col rounded-3xl p-7 ${p.featured ? "border-teal/50 shadow-[0_0_60px_rgba(25,240,210,0.15)]" : ""}`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet">{p.tag}</p>
              <h3 className="font-display mt-2 text-3xl font-bold">{p.name}</h3>
              <p className="mt-3 text-sm text-white/70">{p.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-white/80">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-teal">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <button
                className={`${p.featured ? "btn-primary" : "btn-ghost"} mt-7`}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("plan-select", { detail: p.name }));
                  scrollToId("contact");
                }}
              >
                Book a call
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
