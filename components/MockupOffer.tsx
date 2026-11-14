"use client";

import { scrollToId } from "@/lib/journey";
import { prefillContact } from "@/lib/services";

const STEPS = [
  { n: "1", t: "Tell us about your business", d: "Your services, your towns, what you want more of." },
  { n: "2", t: "We design your mockup", d: "A custom look at your new homepage, built for your trade." },
  { n: "3", t: "You decide", d: "Love it? We build it. If not, you owe nothing." },
];

export default function MockupOffer() {
  return (
    <section id="mockup" className="relative bg-ink px-5 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_20%,rgba(155,107,255,0.16),transparent_70%),radial-gradient(40%_50%_at_10%_90%,rgba(25,240,210,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="inline-flex rounded-full border border-teal/50 bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal">
                Free Website Mockup
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                See your new site <span className="text-gradient">before you pay anything.</span>
              </h2>
              <p className="mt-4 max-w-lg text-white/70">
                We&apos;ll design a free, custom mockup of your new website, built around your business and the towns you serve. No obligation, no credit card.
              </p>
              <button
                className="btn-primary mt-7"
                onClick={() => {
                  prefillContact(["mockup"]);
                  scrollToId("contact");
                }}
              >
                Get My Free Mockup
              </button>
            </div>
            <ol className="space-y-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                  <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal to-violet font-bold text-black">{s.n}</span>
                  <div>
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-sm text-white/60">{s.d}</div>
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
