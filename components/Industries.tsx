"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INDUSTRIES } from "@/lib/industries";
import { scrollToId } from "@/lib/journey";
import { prefillContact } from "@/lib/services";
import MockSite from "./MockSite";

type Mode = "marquee" | "swipe" | "grid";

const ROW_A = INDUSTRIES.slice(0, 6);
const ROW_B = INDUSTRIES.slice(6);

const MAX_TILT = 16;

/** Tilt each card by its distance from the viewport centre (writes only, no layout reads per card). */
function tiltCards(cards: HTMLElement[], offset: number, stride: number, cardW: number, vw: number) {
  for (let i = 0; i < cards.length; i++) {
    const center = offset + i * stride + cardW / 2;
    const rel = Math.max(-1, Math.min(1, (center - vw / 2) / (vw / 2)));
    cards[i].style.transform = `rotateY(${(-rel * MAX_TILT).toFixed(2)}deg) translateZ(${(-Math.abs(rel) * 30).toFixed(1)}px)`;
  }
}

function MarqueeRow({ items, dir, velocity, visible }: { items: typeof INDUSTRIES; dir: 1 | -1; velocity: React.RefObject<number>; visible: React.RefObject<boolean> }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    let half = 0;
    let stride = 0;
    let cardW = 0;
    const measure = () => {
      half = el.scrollWidth / 2;
      stride = cards[1].offsetLeft - cards[0].offsetLeft;
      cardW = cards[0].offsetWidth;
    };
    measure();
    let x = dir > 0 ? 0 : -half;
    let speed = 1;
    let hover = false;
    const enter = () => (hover = true);
    const leave = () => (hover = false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    window.addEventListener("resize", measure);

    const tick = (_t: number, dt: number) => {
      if (!visible.current) return;
      speed += ((hover ? 0 : 1) - speed) * 0.08;
      const boost = Math.min(Math.abs(velocity.current) / 350, 7);
      x -= dir * (0.045 + boost * 0.05) * speed * dt;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      tiltCards(cards, x, stride, cardW, window.innerWidth);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      window.removeEventListener("resize", measure);
    };
  }, [dir, velocity, visible]);

  // Two copies back to back so the loop is seamless.
  return (
    <div className="py-3 [perspective:1200px]">
      <div ref={track} className="flex w-max gap-6 will-change-transform [transform-style:preserve-3d]">
        {[...items, ...items].map((d, i) => (
          <div key={i} className="[transform-style:preserve-3d]" aria-hidden={i >= items.length || undefined}>
            <MockSite d={d} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SwipeRow() {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const first = cards[0];
      const stride = cards[1].offsetLeft - first.offsetLeft;
      tiltCards(cards, first.offsetLeft - el.scrollLeft, stride, first.offsetWidth, el.clientWidth);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="[perspective:1000px]">
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50vw-150px)] py-4 [scrollbar-width:none] [transform-style:preserve-3d] [&::-webkit-scrollbar]:hidden"
      >
        {INDUSTRIES.map((d) => (
          <div key={d.name} className="snap-center transition-transform duration-75">
            <MockSite d={d} />
          </div>
        ))}
      </div>
      <p className="mt-1 text-center text-xs text-white/40">Swipe to see more →</p>
    </div>
  );
}

export default function Industries() {
  const section = useRef<HTMLElement>(null);
  const velocity = useRef(0);
  const visible = useRef(false);
  const [mode, setMode] = useState<Mode>("marquee");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const pick = () => setMode(reduced.matches ? "grid" : small.matches ? "swipe" : "marquee");
    pick();
    reduced.addEventListener("change", pick);
    small.addEventListener("change", pick);
    return () => {
      reduced.removeEventListener("change", pick);
      small.removeEventListener("change", pick);
    };
  }, []);

  // Scroll speed (via GSAP ScrollTrigger) speeds the marquee up; it eases back down on its own.
  useEffect(() => {
    if (mode !== "marquee" || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (visible.current = self.isActive),
      onUpdate: (self) => (velocity.current = self.getVelocity()),
    });
    visible.current = st.isActive;
    const decay = () => {
      velocity.current *= 0.9;
    };
    gsap.ticker.add(decay);
    return () => {
      st.kill();
      gsap.ticker.remove(decay);
    };
  }, [mode]);

  return (
    <section ref={section} id="industries" className="relative overflow-hidden bg-ink py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_45%,rgba(155,107,255,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">Industries we build for</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display max-w-2xl text-4xl font-bold sm:text-5xl">Built for local businesses like yours.</h2>
          <span className="rounded-full border border-violet/50 bg-violet/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet">
            Sample designs · fictional businesses
          </span>
        </div>
        <p className="mt-4 max-w-xl text-white/65">
          Plumbers, HVAC, electricians, roofers, salons, restaurants and more. Every design is custom to the business. These are examples we made up to show the range.
        </p>
      </div>

      <div className="relative mt-12">
        {mode === "marquee" && (
          <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <MarqueeRow items={ROW_A} dir={1} velocity={velocity} visible={visible} />
            <MarqueeRow items={ROW_B} dir={-1} velocity={velocity} visible={visible} />
            <p className="mt-2 text-center text-xs text-white/35">Hover to pause</p>
          </div>
        )}
        {mode === "swipe" && <SwipeRow />}
        {mode === "grid" && (
          <div className="mx-auto grid max-w-6xl justify-items-center gap-6 px-5 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((d) => (
              <MockSite key={d.name} d={d} />
            ))}
          </div>
        )}
      </div>

      <div className="relative mt-14 flex flex-col items-center gap-3 px-5 text-center">
        <p className="font-display text-2xl font-bold sm:text-3xl">Want to see yours?</p>
        <button
          className="btn-primary"
          onClick={() => {
            prefillContact(["mockup"]);
            scrollToId("contact");
          }}
        >
          Get My Free Mockup
        </button>
      </div>
    </section>
  );
}
