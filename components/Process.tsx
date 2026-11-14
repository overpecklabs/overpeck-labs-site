"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STEPS = [
  { n: "01", title: "Free mockup", body: "Tell us about your business. We design a homepage mockup for you before you spend anything." },
  { n: "02", title: "Build", body: "We build the full site with your services, towns and contact paths, and add lead tracking." },
  { n: "03", title: "Launch", body: "We handle domain, hosting and go-live, then check that every call button and form works." },
  { n: "04", title: "Grow", body: "Add lead generation and AI assistants as you're ready: follow-ups, booking and review requests." },
];

export default function Process() {
  const root = useRef<HTMLDivElement>(null);
  const [flat, setFlat] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setFlat(true);
      return;
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".flip-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { rotationY: 0 },
          {
            rotationY: 180,
            ease: "power2.inOut",
            scrollTrigger: { trigger: card, start: `top ${78 - i * 3}%`, end: "top 35%", scrub: 0.6 },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={root} className="relative bg-ink px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">How it works</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">Four steps. You see the design first.</h2>
        <div className="flip-scene mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) =>
            flat ? (
              <div key={s.n} className="glass rounded-3xl p-6">
                <div className="font-display text-5xl font-bold text-gradient">{s.n}</div>
                <h3 className="font-display mt-3 text-2xl font-bold">{s.title}</h3>
                <p className="mt-3 text-sm text-white/70">{s.body}</p>
              </div>
            ) : (
              <div key={s.n} className="flip-card h-64">
                <div className="flip-face glass flex flex-col justify-between rounded-3xl p-6">
                  <div className="font-display text-6xl font-bold text-gradient">{s.n}</div>
                  <h3 className="font-display text-3xl font-bold">{s.title}</h3>
                </div>
                <div className="flip-face flip-back flex flex-col justify-center rounded-3xl border border-teal/40 bg-[#0b1a1d] p-6 shadow-[0_0_40px_rgba(25,240,210,0.18)]">
                  <h3 className="font-display text-xl font-bold text-teal">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{s.body}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
