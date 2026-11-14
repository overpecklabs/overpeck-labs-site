"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "@/lib/journey";

/* ============================================================
   How It Works: a pinned, scroll-scrubbed sequence of five colored
   lab beakers. Desktop: 3D carousel with liquid fills, marker doodles,
   a filling progress pipe and a hue-shifting wash. Phones / reduced
   motion: a static, fully filled vertical list.
   ============================================================ */

const STEPS = [
  { sym: "Fm", title: "Free Mockup", line: "We design a free homepage mockup, so you see it before you pay.", liquid: "#f7c948", tile: "#fff3a3", ink: "#7a5b00", rgb: [247, 201, 72], doodle: "M8 10 h44 v32 h-44 z M8 18 h44 M14 26 h18 M14 33 h12 M38 26 h8 v10 h-8 z" },
  { sym: "Ln", title: "Launch Your Site", line: "We build and launch a fast, mobile-friendly site that brings in calls.", liquid: "#19f0d2", tile: "#c8f5ec", ink: "#0f766e", rgb: [25, 240, 210], doodle: "M30 6 C40 14 42 28 36 40 H24 C18 28 20 14 30 6 Z M24 40 L18 48 M36 40 L42 48 M30 18 a4 4 0 1 0 0.1 0" },
  { sym: "Au", title: "Automate & Follow Up", line: "Follow-ups, booking and review requests start running on their own.", liquid: "#5b9cf5", tile: "#dbe8ff", ink: "#1f6feb", rgb: [91, 156, 245], doodle: "M14 24 a16 16 0 0 1 30 -6 M44 10 v8 h-8 M46 30 a16 16 0 0 1 -30 6 M16 44 v-8 h8" },
  { sym: "Op", title: "Track & Optimize", line: "We watch calls, forms and rankings, and keep improving what works.", liquid: "#4caf6e", tile: "#dcf3df", ink: "#237a34", rgb: [76, 175, 110], doodle: "M8 44 V8 M8 44 H54 M12 38 L24 28 L32 32 L48 14 M42 14 h6 v6" },
  { sym: "Ai", title: "AI Fills the Gaps", line: "AI answers after hours, handles overflow and catches missed calls.", liquid: "#ff8a65", tile: "#ffe1d6", ink: "#c2410c", rgb: [255, 138, 101], doodle: "M8 12 h44 v24 h-26 l-10 8 v-8 h-8 z M18 22 h24 M18 28 h14" },
];
const N = STEPS.length;
// Progress p (0..1) -> active index a in [-0.5, N-1]; snap points rest on whole steps.
const toA = (p: number) => -0.5 + p * (N - 0.5);
const SNAPS = [0, ...STEPS.map((_, k) => (k + 0.5) / (N - 0.5))];
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/** Beaker with a clipped liquid fill (level 0..1 set via CSS var on the wrapper). */
function Beaker({ i, size = 200 }: { i: number; size?: number }) {
  const s = STEPS[i];
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 200 224" className="overflow-visible" aria-hidden>
      <defs>
        <clipPath id={`bk-clip-${i}-${size}`}>
          <path d="M34 30 V196 Q34 214 52 214 H148 Q166 214 166 196 V30 Z" />
        </clipPath>
        <linearGradient id={`bk-liq-${i}-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.liquid} stopOpacity="0.95" />
          <stop offset="1" stopColor={s.liquid} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* glass */}
      <path d="M34 30 V196 Q34 214 52 214 H148 Q166 214 166 196 V30 Z" fill="#ffffff" fillOpacity="0.75" />
      <g clipPath={`url(#bk-clip-${i}-${size})`}>
        <g className="bk-liquid" style={{ transform: "translateY(calc((1 - var(--fill, 1)) * 188px))", transition: "none" }}>
          <path d="M0 40 Q50 30 100 40 T200 40 V240 H0 Z" fill={`url(#bk-liq-${i}-${size})`} />
          <circle cx="70" cy="110" r="6" fill="#fff" opacity="0.5" />
          <circle cx="120" cy="150" r="4" fill="#fff" opacity="0.45" />
          <circle cx="96" cy="80" r="3" fill="#fff" opacity="0.5" />
        </g>
      </g>
      {/* outline + graduations */}
      <path d="M34 30 V196 Q34 214 52 214 H148 Q166 214 166 196 V30 M24 30 H44 M156 30 H176 M40 70 H58 M40 110 H58 M40 150 H58" fill="none" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* element tile printed on the glass */}
      <g transform="translate(86 112)">
        <rect x="0" y="0" width="64" height="64" rx="5" fill={s.tile} stroke="#1a1a1a" strokeWidth="2.5" />
        <text x="6" y="14" fontSize="10" fontWeight="700" fill="#1a1a1a">{String(i + 1).padStart(2, "0")}</text>
        <text x="32" y="46" fontSize="28" fontWeight="700" textAnchor="middle" fill="#1a1a1a" style={{ fontFamily: "var(--font-grotesk), sans-serif" }}>
          {s.sym}
        </text>
      </g>
    </svg>
  );
}

function PinnedSequence() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const section = el?.closest("section");
    if (!el || !section) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const doodles = Array.from(el.querySelectorAll<SVGPathElement>("[data-doodle]"));
    const pipe = el.querySelector<SVGPathElement>("[data-pipe]")!;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
    const wash = el.querySelector<HTMLElement>("[data-wash]")!;

    const render = (p: number) => {
      const a = toA(p);
      const ac = clamp(a, 0, N - 1);
      steps.forEach((s, i) => {
        const d = i - ac;
        const ad = Math.abs(d);
        const past = d < 0;
        s.style.transform = `translate3d(${d * 360}px, ${ad * 18}px, ${-ad * 420}px) rotateY(${-d * 28}deg) scale(${1 - Math.min(ad, 2) * 0.12})`;
        s.style.opacity = String(1 - Math.min(ad, 2.2) * (past ? 0.32 : 0.24));
        s.style.zIndex = String(100 - Math.round(ad * 10));
        const fill = clamp((a - (i - 0.5)) / 0.5);
        s.style.setProperty("--fill", fill.toFixed(3));
        s.style.filter = fill > 0.98 && ad < 0.5 ? `drop-shadow(0 18px 34px rgba(${STEPS[i].rgb.join(",")},0.45))` : "none";
        const dd = doodles[i];
        if (dd) dd.style.strokeDashoffset = String(1 - clamp((a - i + 0.6) / 0.6));
        s.setAttribute("aria-current", ad < 0.5 ? "step" : "false");
      });
      pipe.style.strokeDashoffset = String(1 - clamp(a / (N - 1)));
      nodes.forEach((n, i) => (n.dataset.on = a >= i - 0.05 ? "1" : "0"));
      // hue-shifting wash between neighbouring steps
      const lo = Math.floor(ac), hi = Math.min(N - 1, lo + 1), t = ac - lo;
      const mix = STEPS[lo].rgb.map((c, k) => Math.round(c + (STEPS[hi].rgb[k] - c) * t));
      wash.style.background = `radial-gradient(70% 60% at 50% 45%, rgba(${mix.join(",")},0.22), rgba(${mix.join(",")},0.06) 60%, transparent 85%)`;
    };

    render(0);
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({ trigger: section, start: "top top", end: "bottom bottom", scrub: 0.5, onUpdate: (self) => render(self.progress) });

    // Gentle snap to the nearest step after scrolling stops (Lenis-driven, never traps:
    // only inside the pinned range, and any new scroll input cancels it).
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const lenis = journey.lenis;
        if (!lenis || !st.isActive) return;
        const p = st.progress;
        if (p <= 0.001 || p >= 0.999) return;
        const target = SNAPS.reduce((best, s) => (Math.abs(s - p) < Math.abs(best - p) ? s : best), SNAPS[0]);
        if (Math.abs(target - p) < 0.004) return;
        lenis.scrollTo(st.start + (st.end - st.start) * target, { duration: 0.6 });
      }, 180);
    };
    journey.lenis?.on("scroll", onScroll);

    // node buttons jump to a step
    const jumpers = nodes.map((n, i) => {
      const go = () => {
        const y = st.start + (st.end - st.start) * SNAPS[i + 1];
        if (journey.lenis) journey.lenis.scrollTo(y, { duration: 1 });
        else window.scrollTo({ top: y });
      };
      n.addEventListener("click", go);
      return () => n.removeEventListener("click", go);
    });

    return () => {
      st.kill();
      clearTimeout(timer);
      journey.lenis?.off("scroll", onScroll);
      jumpers.forEach((off) => off());
    };
  }, []);

  return (
    <div ref={root} className="sticky top-0 h-screen overflow-hidden">
      <div data-wash className="pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col px-5 pb-8 pt-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">How it works</p>
          <h2 className="font-display mt-2 text-4xl font-bold text-ink sm:text-5xl">The formula, step by step.</h2>
        </div>

        {/* 3D carousel of beakers */}
        <div className="relative flex-1 [perspective:1600px]">
          <ol className="absolute inset-0 [transform-style:preserve-3d]">
            {STEPS.map((s, i) => (
              <li key={s.sym} data-step className="absolute left-1/2 top-1/2 -ml-[150px] -mt-[190px] flex w-[300px] flex-col items-center text-center will-change-transform">
                <div className="relative">
                  <Beaker i={i} />
                  {/* marker doodle, drawn by scroll */}
                  <svg width="62" height="52" viewBox="0 0 62 52" className="absolute -right-12 top-2" aria-hidden>
                    <path data-doodle d={s.doodle} fill="none" stroke={s.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
                  </svg>
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest" style={{ color: s.ink }}>
                  Step {i + 1}
                </div>
                <h3 className="font-display mt-1 text-2xl font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 max-w-[17rem] text-[15px] leading-snug text-ink/85">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* liquid progress pipe */}
        <div className="relative mx-auto w-full max-w-3xl">
          <svg viewBox="0 0 800 40" className="w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="pipe-grad" x1="0" y1="0" x2="1" y2="0">
                {STEPS.map((s, i) => (
                  <stop key={s.sym} offset={i / (N - 1)} stopColor={s.liquid} />
                ))}
              </linearGradient>
            </defs>
            <path d="M20 20 C120 2 180 38 220 20 S320 2 400 20 S520 38 580 20 S700 2 780 20" fill="none" stroke="#1a1a1a" strokeOpacity="0.14" strokeWidth="12" strokeLinecap="round" />
            <path d="M20 20 C120 2 180 38 220 20 S320 2 400 20 S520 38 580 20 S700 2 780 20" fill="none" stroke="#fffefb" strokeWidth="8" strokeLinecap="round" />
            <path data-pipe d="M20 20 C120 2 180 38 220 20 S320 2 400 20 S520 38 580 20 S700 2 780 20" fill="none" stroke="url(#pipe-grad)" strokeWidth="6" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
          </svg>
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[1%]">
            {STEPS.map((s, i) => (
              <button
                key={s.sym}
                type="button"
                data-node
                aria-label={`Go to step ${i + 1}: ${s.title}`}
                className="group grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-white text-[10px] font-bold text-ink transition data-[on='1']:scale-110"
                style={{ ["--c" as string]: s.liquid }}
              >
                <span className="h-3 w-3 rounded-full bg-ink/15 transition group-data-[on='1']:bg-[var(--c)]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StaticList() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">How it works</p>
      <h2 className="font-display mt-2 text-4xl font-bold text-ink sm:text-5xl">The formula, step by step.</h2>
      <ol className="relative mt-10 space-y-6">
        <span aria-hidden className="absolute bottom-6 left-[44px] top-6 w-1.5 rounded-full bg-[linear-gradient(180deg,#f7c948,#19f0d2,#5b9cf5,#4caf6e,#ff8a65)] opacity-80" />
        {STEPS.map((s, i) => (
          <li key={s.sym} className="relative flex items-center gap-4">
            <div className="relative z-10 shrink-0 rounded-xl bg-white/70" style={{ ["--fill" as string]: 1 }}>
              <Beaker i={i} size={90} />
            </div>
            <div className="paper rounded-md p-4">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: s.ink }}>
                Step {i + 1}
              </div>
              <h3 className="font-display text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-1 text-[15px] leading-snug text-ink/85">{s.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Process() {
  return (
    <section id="process" className="relative lg:h-[520vh] motion-reduce:lg:h-auto">
      <div className="hidden h-full lg:block motion-reduce:lg:hidden">
        <PinnedSequence />
      </div>
      <div className="lg:hidden motion-reduce:lg:block">
        <StaticList />
      </div>
    </section>
  );
}
