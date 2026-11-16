"use client";

import Image from "next/image";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LeadJump } from "@/components/demos/lead";
import { SampleMark } from "@/components/demos/sample";

/**
 * Signature scroll-scrubbed "window gets cleaned" section.
 *
 * - A tall section (about 190vh) with a sticky stage: a framed window with a bright photo behind the glass.
 * - A canvas "dirty glass" layer (haze, water spots, pollen, drip streaks) is generated once, procedurally, at a
 *   capped resolution. Each frame redraws it and erases the squeegee's path (overlapping S-strokes) up to the
 *   current scroll progress with destination-out, so scrolling back up makes the glass dirty again.
 * - The squeegee, droplets, bubbles, glint and progress bar move with transform/opacity only; React state only
 *   changes when the copy step changes. Nothing is set up until the section is near the viewport.
 * - prefers-reduced-motion: CSS makes the section a normal (non-sticky) block, and the grime simply crossfades
 *   away when the window comes into view. No scrubbing.
 */

type Step = { title: string; body: string; sample?: boolean };
const STEPS: Step[] = [
  { title: "Grime builds up", body: "Pollen, hard-water spots and road haze dull the view a little more every week, until the whole house looks tired." },
  { title: "We wash it the right way", body: "Glass scrubbed with a soft applicator, then cleared with a squeegee in overlapping S-strokes, frame to frame." },
  { title: "Streak-free, guaranteed", body: "Crystal-clear glass, clean screens and wiped sills. If you spot a streak, we come back and fix it.", sample: true },
];

/** Deterministic random so the grime looks the same on every visit. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeGrime(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const r = rng(7);
  const area = w * h;
  // base haze: dusty, heavier toward the bottom
  const base = g.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "rgba(168,156,120,0.62)");
  base.addColorStop(1, "rgba(132,118,84,0.80)");
  g.fillStyle = base;
  g.fillRect(0, 0, w, h);
  // blotchy film
  for (let i = 0; i < area / 2600; i++) {
    const x = r() * w, y = r() * h, rad = (0.03 + r() * 0.09) * Math.max(w, h);
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    const dark = r() > 0.5;
    grd.addColorStop(0, dark ? `rgba(96,86,60,${0.08 + r() * 0.12})` : `rgba(225,218,190,${0.08 + r() * 0.12})`);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // drip streaks
  for (let i = 0; i < 26; i++) {
    const x = r() * w, y0 = r() * h * 0.5, len = h * (0.2 + r() * 0.5), lw = 1 + r() * 3;
    const grd = g.createLinearGradient(0, y0, 0, y0 + len);
    grd.addColorStop(0, "rgba(110,98,70,0)");
    grd.addColorStop(0.3, `rgba(110,98,70,${0.2 + r() * 0.2})`);
    grd.addColorStop(1, "rgba(110,98,70,0)");
    g.strokeStyle = grd;
    g.lineWidth = lw;
    g.beginPath();
    g.moveTo(x, y0);
    g.bezierCurveTo(x + (r() - 0.5) * 8, y0 + len * 0.33, x + (r() - 0.5) * 8, y0 + len * 0.66, x + (r() - 0.5) * 6, y0 + len);
    g.stroke();
  }
  // hard-water spots
  const unit = Math.max(1, w / 900);
  for (let i = 0; i < area / 1800; i++) {
    const x = r() * w, y = r() * h, rad = (1.5 + r() * 5) * unit;
    g.fillStyle = `rgba(120,108,80,${0.12 + r() * 0.15})`;
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = `rgba(255,255,250,${0.25 + r() * 0.3})`;
    g.lineWidth = 0.8 * unit;
    g.stroke();
  }
  // pollen specks
  for (let i = 0; i < area / 500; i++) {
    g.fillStyle = r() > 0.6 ? `rgba(214,180,60,${0.35 + r() * 0.4})` : `rgba(90,80,60,${0.25 + r() * 0.3})`;
    const s = (0.6 + r() * 1.4) * unit;
    g.fillRect(r() * w, r() * h, s, s);
  }
  return c;
}

/** S-stroke path (in canvas pixels) and blade size for a w x h pane. */
function makePath(w: number, h: number, rows: number) {
  const gap = h / rows;
  const blade = gap * 1.45; // overlap so nothing is missed
  const pts: { x: number; y: number }[] = [];
  const x0 = -blade * 0.15, x1 = w + blade * 0.15;
  for (let i = 0; i < rows; i++) {
    const y = gap * (i + 0.5);
    const ltr = i % 2 === 0;
    const [a, b] = ltr ? [x0, x1] : [x1, x0];
    for (let k = 0; k <= 24; k++) pts.push({ x: a + ((b - a) * k) / 24, y });
    if (i < rows - 1) {
      // half-turn to the next row, bulging past the frame edge
      const cx = b, cy = y + gap / 2, rad = gap / 2;
      for (let k = 1; k < 12; k++) {
        const t = -Math.PI / 2 + (Math.PI * k) / 12;
        pts.push({ x: cx + (ltr ? 1 : -1) * Math.cos(t) * rad * 0.9, y: cy + Math.sin(t) * rad });
      }
    }
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, cum, total: cum[cum.length - 1], blade };
}

const DROPS = [
  { left: "12%", delay: "0s", dur: "3.2s", size: 7 },
  { left: "28%", delay: "1.1s", dur: "4s", size: 5 },
  { left: "47%", delay: "0.4s", dur: "3.6s", size: 8 },
  { left: "63%", delay: "1.7s", dur: "4.4s", size: 6 },
  { left: "79%", delay: "0.9s", dur: "3.4s", size: 7 },
  { left: "90%", delay: "2.2s", dur: "4.1s", size: 5 },
];
const BUBBLES = [
  { left: "18%", top: "30%", size: 14, delay: "0s" },
  { left: "36%", top: "62%", size: 9, delay: "0.6s" },
  { left: "58%", top: "24%", size: 12, delay: "1.2s" },
  { left: "72%", top: "70%", size: 8, delay: "0.3s" },
  { left: "84%", top: "42%", size: 11, delay: "0.9s" },
];

export default function WindowWipe({ view, cta }: { view: { src: string; alt: string }; cta: string }) {
  const section = useRef<HTMLElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const squeegee = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const grime = useRef<HTMLCanvasElement | null>(null);
  const path = useRef<ReturnType<typeof makePath> | null>(null);
  const scale = useRef(1);
  const progress = useRef(0);
  const raf = useRef(0);
  const [armed, setArmed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"dirty" | "washing" | "clean">("dirty");
  const [seen, setSeen] = useState(false);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduce(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => () => void delete document.documentElement.dataset.oeWipe, []);

  // lazy init: only once the section is near the viewport
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let idle = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // build the grime when the browser is idle, so it never competes with the first paint
        const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
        idle = ric(() => setArmed(true), { timeout: 1200 } as IdleRequestOptions) as unknown as number;
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (idle) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);

  const draw = useCallback(() => {
    raf.current = 0;
    const c = canvas.current, g0 = grime.current, pth = path.current;
    if (!c || !g0 || !pth) return;
    const ctx = c.getContext("2d")!;
    const p = progress.current;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, c.width, c.height);
    if (p < 0.995) {
      ctx.drawImage(g0, 0, 0);
      if (p > 0) {
        const L = pth.total * p;
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = pth.blade;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(pth.pts[0].x, pth.pts[0].y);
        let i = 1;
        while (i < pth.pts.length && pth.cum[i] <= L) {
          ctx.lineTo(pth.pts[i].x, pth.pts[i].y);
          i++;
        }
        let tip = pth.pts[Math.min(i, pth.pts.length) - 1];
        let ang = 0;
        if (i < pth.pts.length) {
          const a = pth.pts[i - 1], b = pth.pts[i];
          const f = (L - pth.cum[i - 1]) / Math.max(1e-6, pth.cum[i] - pth.cum[i - 1]);
          tip = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
          ctx.lineTo(tip.x, tip.y);
          ang = Math.atan2(b.y - a.y, b.x - a.x);
        }
        ctx.stroke();
        // squeegee follows the tip (CSS pixels); blade stays perpendicular to travel
        const sq = squeegee.current;
        if (sq) {
          const s = scale.current;
          const deg = (ang * 180) / Math.PI;
          sq.style.transform = `translate3d(${tip.x / s}px, ${tip.y / s}px, 0) rotate(${deg}deg)`;
        }
      }
    }
    if (squeegee.current) squeegee.current.style.opacity = p > 0.01 && p < 0.985 ? "1" : "0";
    c.style.opacity = p > 0.94 ? String(Math.max(0, (0.995 - p) / 0.055)) : "1";
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  }, []);

  const schedule = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  }, [draw]);

  // size the canvas (capped resolution) and build the grime + path whenever the pane resizes
  useEffect(() => {
    if (!armed || !pane.current) return;
    const el = pane.current;
    const build = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const phone = window.innerWidth < 768;
      const dpr = phone ? 1 : Math.min(1.5, window.devicePixelRatio || 1);
      const maxW = phone ? 640 : 1300;
      const s = Math.min(dpr, maxW / width);
      scale.current = s;
      const c = canvas.current!;
      c.width = Math.round(width * s);
      c.height = Math.round(height * s);
      grime.current = makeGrime(c.width, c.height);
      path.current = makePath(c.width, c.height, phone ? 4 : 5);
      if (squeegee.current) squeegee.current.style.height = `${path.current.blade / s}px`;
      schedule();
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [armed, schedule]);

  useMotionValueEvent(scrollYProgress, "change", (raw) => {
    // while the window is pinned, let the page hide the floating chat bubble on phones (see exterior.css)
    const pinned = raw > 0.001 && raw < 0.999;
    if (pinned) document.documentElement.dataset.oeWipe = "1";
    else delete document.documentElement.dataset.oeWipe;
    if (!armed || reduce) return;
    const p = Math.min(1, Math.max(0, (raw - 0.06) / 0.86));
    progress.current = p;
    const st = p < 0.28 ? 0 : p < 0.9 ? 1 : 2;
    setStep((x) => (x === st ? x : st));
    const ph = p < 0.02 ? "dirty" : p < 0.985 ? "washing" : "clean";
    setPhase((x) => (x === ph ? x : ph));
    schedule();
  });

  // reduced motion: draw the grime once, then crossfade it away when the window is in view
  useEffect(() => {
    if (!armed || !reduce) return;
    progress.current = 0;
    schedule();
    const el = pane.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [armed, reduce, schedule]);

  const shownStep = reduce ? 2 : step;

  return (
    <section ref={section} aria-labelledby="oe-wipe-title" className="relative h-[190svh] motion-reduce:h-auto">
      <div className="sticky top-[calc(var(--demo-offset,112px)-12px)] flex h-[calc(100svh-var(--demo-offset,112px)+12px)] items-center overflow-hidden px-4 pb-16 sm:px-6 sm:pb-0 motion-reduce:static motion-reduce:h-auto motion-reduce:py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12">
          {/* copy: three steps stacked in one grid cell (fixed height, crossfade) */}
          <div className="order-2 md:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0e7490]">Window washing</p>
            <h2 id="oe-wipe-title" className="sr-only">
              How we clean your windows
            </h2>
            <div className="mt-2 grid">
              {STEPS.map((s, i) => (
                <div
                  key={s.title}
                  aria-hidden={shownStep !== i}
                  className={`[grid-area:1/1] transition-[opacity,transform] duration-300 motion-reduce:transition-none ${shownStep === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
                >
                  <p className="text-2xl font-extrabold tracking-tight text-[#06232a] sm:text-4xl">
                    {s.title}
                    {s.sample && <SampleMark className="text-slate-500" />}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600 sm:mt-3 sm:text-[17px]">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 motion-reduce:hidden" aria-hidden>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0e7490]/15">
                <div ref={bar} className="h-full origin-left rounded-full bg-gradient-to-r from-[#0e7490] to-[#34d399] will-change-transform" style={{ transform: "scaleX(0)" }} />
              </div>
              <span className="grid w-16 shrink-0 text-right text-xs font-bold text-slate-500">
                {["Dirty", "Washing", "Clean"].map((l, i) => (
                  <span key={l} className={`[grid-area:1/1] transition-opacity duration-200 ${step === i ? "opacity-100" : "opacity-0"}`}>
                    {l}
                  </span>
                ))}
              </span>
            </div>
            <LeadJump className="demo-lift mt-5 hidden rounded-full px-7 py-3.5 font-extrabold sm:inline-flex text-[#06232a] shadow-[0_14px_30px_-12px_rgba(52,211,153,0.9)] " style={{ background: "linear-gradient(90deg, #34d399, #5eead4)" }}>
              {cta}
            </LeadJump>
          </div>

          {/* the window */}
          <div className="order-1 md:order-2">
            <div className="rounded-[1.6rem] bg-gradient-to-b from-white to-[#e7eef0] p-2.5 shadow-[0_40px_80px_-40px_rgba(6,35,42,0.6),inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-3.5">
              <div ref={pane} className="relative aspect-[16/11] overflow-hidden rounded-[1.1rem] bg-[#cfe3e6] shadow-[inset_0_0_0_2px_rgba(6,35,42,0.15),inset_0_10px_30px_rgba(6,35,42,0.25)] md:aspect-[4/3]">
                {armed && <Image src={view.src} alt={view.alt} fill sizes="(min-width: 768px) 55vw, 92vw" className="object-cover" />}
                {/* faint permanent glass reflection */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,transparent_35%,transparent_60%,rgba(255,255,255,0.12)_75%,transparent_90%)]" aria-hidden />
                <canvas
                  ref={canvas}
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 h-full w-full ${reduce ? `transition-opacity duration-[1400ms] ${seen ? "!opacity-0" : ""}` : ""}`}
                />
                {/* soapy droplets + bubbles while washing */}
                <div className={`pointer-events-none absolute inset-0 transition-opacity duration-500 motion-reduce:hidden ${phase === "washing" ? "opacity-100" : "opacity-0"}`} aria-hidden>
                  {DROPS.map((d, i) => (
                    <span key={i} className="oe-drip absolute top-0 rounded-full bg-white/70 shadow-[inset_-1px_-2px_2px_rgba(14,116,144,0.35)]" style={{ left: d.left, width: d.size, height: d.size * 1.35, animationDelay: d.delay, animationDuration: d.dur }} />
                  ))}
                  {BUBBLES.map((b, i) => (
                    <span key={i} className="oe-bubble absolute rounded-full border border-white/80 bg-white/20" style={{ left: b.left, top: b.top, width: b.size, height: b.size, animationDelay: b.delay }} />
                  ))}
                </div>
                {/* the squeegee (positioned by transform every frame) */}
                <div ref={squeegee} className="pointer-events-none absolute left-0 top-0 origin-top-left opacity-0 will-change-transform motion-reduce:hidden" style={{ height: 80 }} aria-hidden>
                  <div className="absolute left-0 top-0 h-full -translate-x-1/2 -translate-y-1/2">
                    <div className="relative h-full w-3.5 rounded-full bg-[#0b2f36] shadow-[2px_0_6px_rgba(0,0,0,0.35)]">
                      <div className="absolute inset-y-1 left-0.5 w-1 rounded-full bg-[#34d399]/70" />
                    </div>
                    <div className="absolute left-3 top-1/2 h-4 w-14 -translate-y-1/2 rounded-r-full bg-gradient-to-r from-[#0e7490] to-[#22b8a8] shadow-md" />
                  </div>
                </div>
                {/* glint at 100% clean */}
                <div className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden`} aria-hidden>
                  <div className={`absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/70 to-transparent ${phase === "clean" ? "oe-glint" : "opacity-0"}`} />
                </div>
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">Sample photo</span>
              </div>
            </div>
            <div className="mx-6 h-3 rounded-b-xl bg-gradient-to-b from-[#dfe8ea] to-[#c9d6d9] shadow-[0_10px_20px_-12px_rgba(6,35,42,0.5)]" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
