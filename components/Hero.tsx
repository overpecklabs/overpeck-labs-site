"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToId } from "@/lib/journey";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";
import { DesktopSketch, INK, MobileSketch } from "./HeroSketch";

// Avoid the SSR warning while still applying before paint in the browser.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const MARKERS = [INK.black, INK.blue, INK.red, INK.green];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);
  const sketch = useRef<HTMLDivElement>(null);

  // Nav switches to its light style while it sits over the whiteboard.
  useIsoLayoutEffect(() => {
    document.documentElement.setAttribute("data-hero-light", "");
    return () => document.documentElement.removeAttribute("data-hero-light");
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const html = document.documentElement;
    const setNav = (light: boolean) => (light ? html.setAttribute("data-hero-light", "") : html.removeAttribute("data-hero-light"));

    const ctx = gsap.context(() => {
      // Nav theme follows the board (light) vs the dark sections.
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top+=80",
        onUpdate: (self) => setNav(self.isActive && self.progress < 0.8),
        onLeave: () => setNav(false),
        onEnterBack: () => setNav(true),
      });

      // Reduced motion: everything stays fully drawn and still. Phones: static sketch, no pinning.
      if (reduced || !desktop) return;

      // Board zooms + fades into the dark sections below.
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.5 } })
        .to({}, { duration: 0.55 })
        .to(board.current, { scale: 1.12, ease: "power1.in", duration: 0.45 })
        .to(fade.current, { opacity: 1, ease: "none", duration: 0.45 }, "<");

      if (!sketch.current) return;

      // Draw-on: hide every stroke, then draw them in sequence.
      const paths = gsap.utils.toArray<SVGPathElement>(".draw", sketch.current);
      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });
      gsap.set(gsap.utils.toArray(".sk-text", sketch.current), { opacity: 0 });

      // ~3s total so the whole board is visible quickly.
      const tl = gsap.timeline({ delay: 0.25 });
      tl.to(".hero-underline path", { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" });
      for (let s = 1; s <= 5; s++) {
        tl.to(`.draw[data-step="${s}"]`, { strokeDashoffset: 0, duration: s === 1 ? 0.6 : 0.45, stagger: 0.03, ease: "power1.inOut" }, s === 1 ? "-=0.35" : "-=0.2");
        tl.to(`.sk-text[data-step="${s}"]`, { opacity: 1, duration: 0.3 }, "-=0.25");
      }
      tl.to(".hero-annotation", { opacity: 1, y: 0, duration: 0.35 }, "-=0.3");

      // Scroll adds extra marker flourishes.
      gsap.to(".draw[data-scroll]", {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.2,
        scrollTrigger: { trigger: el, start: "top top", end: "35% top", scrub: 0.4 },
      });

      // Mouse parallax: layers move by their depth, the stage tilts slightly.
      const layers = gsap.utils.toArray<HTMLElement>(".sketch-layer", sketch.current);
      const movers = layers.map((l) => ({ x: gsap.quickTo(l, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(l, "y", { duration: 0.6, ease: "power3" }), d: Number(l.dataset.depth) }));
      const stage = sketch.current.querySelector<HTMLElement>(".sketch-stage")!;
      const rx = gsap.quickTo(stage, "rotationX", { duration: 0.8, ease: "power3" });
      const ry = gsap.quickTo(stage, "rotationY", { duration: 0.8, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.d);
          m.y(ny * m.d * 0.7);
        });
        rx(-ny * 6);
        ry(nx * 8);
      };
      el.addEventListener("pointermove", onMove);
      return () => el.removeEventListener("pointermove", onMove);
    }, el);

    return () => {
      ctx.revert();
      setNav(false);
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative md:h-[165vh] motion-reduce:md:h-auto">
      <div className="relative overflow-hidden md:sticky md:top-0 md:h-[100svh] md:min-h-[640px] motion-reduce:md:relative">
        <div ref={board} className="board-surface relative origin-[50%_40%] will-change-transform md:absolute md:inset-0">
          {/* aluminum frame edge */}
          <div className="board-frame absolute inset-x-0 top-0 h-3" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 pb-14 pt-24 md:h-full md:grid-cols-[1.02fr_1fr] md:gap-10 md:pb-20 md:pt-20">
            {/* copy */}
            <div className="relative z-10 text-[#111]">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#0d9488]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#19f0d2]" /> Bergen County, NJ
              </p>
              <h1 className="font-display text-[2.45rem] font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.1rem]">
                Websites, leads &amp; AI that{" "}
                <span className="relative inline-block whitespace-nowrap">
                  work while
                  <svg className="hero-underline pointer-events-none absolute -bottom-2 left-0 h-3 w-full overflow-visible" viewBox="0 0 240 12" preserveAspectRatio="none" aria-hidden>
                    <path d="M3 8 Q60 2 120 7 T237 6" fill="none" stroke="#19f0d2" strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="[stroke-dashoffset:0] md:[stroke-dashoffset:1] motion-reduce:md:[stroke-dashoffset:0]" />
                  </svg>
                </span>{" "}
                you work.
              </h1>
              <p className="mt-5 max-w-md text-base text-[#3a3a3c] sm:text-lg">
                We build websites that win business, automate the busywork, track what&apos;s working and add AI that never misses a lead. For local plumbers, HVAC pros, electricians and remodelers.
              </p>

              <div className="relative mt-8 flex flex-wrap items-center gap-3">
                <Link href="/free-mockup" className="btn-board">
                  Get My Free Mockup
                </Link>
                <a href={`tel:${PHONE_TEL}`} className="btn-board-ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  </svg>
                  {PHONE_DISPLAY}
                </a>

                {/* handwritten annotation */}
                <div className="hero-annotation pointer-events-none mt-1 flex w-full items-start gap-1 md:absolute md:-bottom-24 md:left-24 md:mt-0 md:w-auto md:translate-y-2 md:opacity-0 motion-reduce:md:translate-y-0 motion-reduce:md:opacity-100" aria-hidden>
                  <svg width="58" height="48" viewBox="0 0 58 48" className="shrink-0" fill="none" stroke={INK.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M52 44 C40 40 20 34 10 10 M4 20 L9 8 L20 14" />
                  </svg>
                  <span className="font-marker -rotate-3 pt-3 text-xl text-[#e5484d] md:text-2xl">more calls, less chaos</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#5a5a5e] md:mt-28">Free custom mockup before you pay anything. No obligation.</p>
            </div>

            {/* sketches */}
            <div ref={sketch} className="relative hidden [perspective:1100px] md:block">
              <DesktopSketch />
            </div>
            <div className="-mx-1 md:hidden">
              <MobileSketch />
            </div>
          </div>

          {/* marker tray */}
          <div className="absolute inset-x-0 bottom-0 h-7">
            <div className="board-frame absolute inset-x-0 bottom-0 h-4" />
            <div className="absolute bottom-3 right-[8%] flex items-end gap-3">
              {MARKERS.map((c, i) => (
                <span key={c} className="relative block h-3 rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.25)]" style={{ width: 64 - i * 4, background: `linear-gradient(90deg, ${c} 0 22%, #f1f1f1 22% 100%)` }} />
              ))}
              <span className="block h-4 w-10 rounded-sm bg-[#3a3a3c] shadow-[0_2px_3px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>

        {/* fades the board into the dark site below */}
        <div ref={fade} className="pointer-events-none absolute inset-0 bg-ink opacity-0" />

        <button
          onClick={() => scrollToId("mockup")}
          className="font-marker absolute bottom-9 left-1/2 hidden -translate-x-1/2 text-sm text-[#6b6b70] hover:text-[#111] md:block"
        >
          scroll ↓
        </button>
      </div>
    </section>
  );
}
