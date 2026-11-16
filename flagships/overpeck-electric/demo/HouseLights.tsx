"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LeadJump } from "@/components/demos/lead";
import { SampleMark } from "@/components/demos/sample";

/**
 * Signature scroll effect: a house outline at night. As you scroll through a pinned stage (~190vh), wires trace
 * out from the panel with a glowing current at the tip, and each room lights up when its wire arrives.
 * - SVG for the house and the lit rooms (opacity only), canvas for the energized wiring (redrawn per frame).
 * - Nothing runs until the section is near the viewport and the browser is idle; canvas resolution is capped.
 * - prefers-reduced-motion: CSS makes the stage a normal block and the house is shown fully lit, wires drawn.
 * - The --demo-offset fallbacks (111 / 128 / 120px) match what the sticky header sets after hydration, so the
 *   stage doesn't resize at load (this section is already on the first screen on desktop).
 */

type Pt = [number, number];
type Room = { id: string; label: string; rect: [number, number, number, number]; wire: Pt[]; round?: boolean };

/* House geometry in a 400x300 viewBox. Each wire starts where the previous branch is already energized. */
const PANEL: Pt = [78, 236];
const ROOMS: Room[] = [
  { id: "living", label: "Living room", rect: [95, 212, 62, 44], wire: [PANEL, [78, 206], [126, 206], [126, 212]] },
  { id: "porch", label: "Front door", rect: [180, 218, 40, 62], wire: [[126, 206], [200, 206], [200, 218]] },
  { id: "kitchen", label: "Kitchen", rect: [243, 212, 62, 44], wire: [[200, 206], [274, 206], [274, 212]] },
  { id: "bed1", label: "Bedroom", rect: [95, 138, 62, 44], wire: [[78, 206], [78, 130], [126, 130], [126, 138]] },
  { id: "bath", label: "Bathroom", rect: [169, 138, 62, 44], wire: [[126, 130], [200, 130], [200, 138]] },
  { id: "bed2", label: "Bedroom", rect: [243, 138, 62, 44], wire: [[200, 130], [274, 130], [274, 138]] },
  { id: "attic", label: "Attic", rect: [188, 84, 24, 24], wire: [[200, 130], [200, 108]], round: true },
];

const segLen = (w: Pt[]) => w.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - w[i][0], p[1] - w[i][1]), 0);
const LENS = ROOMS.map((r) => segLen(r.wire));

type Step = { title: string; body: string; sample?: boolean };
const STEPS: Step[] = [
  { title: "Lights out", body: "An old panel and tired wiring mean dark rooms, tripping breakers and outlets you can't trust." },
  { title: "Wired room by room", body: "We trace every circuit from the panel, fix what's unsafe and label everything as we go." },
  { title: "Every room powered, safely", body: "Tested, labeled and inspection-ready before we leave, with a clean panel you can actually read.", sample: true },
];

export default function HouseLights({ cta }: { cta: string }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const rooms = useRef<(SVGGElement | null)[]>([]);
  const scale = useRef(1);
  const progress = useRef(0);
  const raf = useRef(0);
  const [armed, setArmed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduce(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // lazy init near the viewport, on browser idle
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let idle = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
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
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const p = reduce ? 1 : progress.current;
    const k = c.width / 400;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    let tip = null as Pt | null;
    const n = ROOMS.length;
    ROOMS.forEach((room, i) => {
      const f = Math.min(1, Math.max(0, p * n - i)); // this wire's share of the progress
      const lit = f >= 1;
      const g = rooms.current[i];
      if (g) g.style.opacity = lit ? "1" : "0";
      if (f <= 0) return;
      let left = LENS[i] * f;
      ctx.beginPath();
      ctx.moveTo(room.wire[0][0] * k, room.wire[0][1] * k);
      for (let s = 1; s < room.wire.length && left > 0; s++) {
        const [ax, ay] = room.wire[s - 1], [bx, by] = room.wire[s];
        const L = Math.hypot(bx - ax, by - ay);
        const t = Math.min(1, left / L);
        const x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
        ctx.lineTo(x * k, y * k);
        left -= L;
        if (!lit) tip = [x, y];
      }
      ctx.strokeStyle = "rgba(250,204,21,0.95)";
      ctx.lineWidth = 2.2 * k;
      ctx.shadowColor = "rgba(250,204,21,0.9)";
      ctx.shadowBlur = 8 * k;
      ctx.stroke();
    });
    if (tip && p < 1) {
      const [tx, ty] = tip;
      const grd = ctx.createRadialGradient(tx * k, ty * k, 0, tx * k, ty * k, 9 * k);
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.35, "rgba(253,224,71,0.9)");
      grd.addColorStop(1, "rgba(253,224,71,0)");
      ctx.shadowBlur = 0;
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(tx * k, ty * k, 9 * k, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  }, [reduce]);

  const schedule = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  }, [draw]);

  // size the canvas (capped resolution) to the stage
  useEffect(() => {
    if (!armed || !stage.current) return;
    const el = stage.current;
    const build = () => {
      const { width } = el.getBoundingClientRect();
      if (!width) return;
      const phone = window.innerWidth < 768;
      const dpr = phone ? 1 : Math.min(1.5, window.devicePixelRatio || 1);
      const s = Math.min(dpr, (phone ? 640 : 1200) / width);
      scale.current = s;
      const c = canvas.current!;
      c.width = Math.round(width * s);
      c.height = Math.round(width * s * 0.75);
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

  useEffect(() => {
    if (armed && reduce) schedule();
  }, [armed, reduce, schedule]);

  useMotionValueEvent(scrollYProgress, "change", (raw) => {
    if (!armed || reduce) return;
    const p = Math.min(1, Math.max(0, (raw - 0.06) / 0.86));
    progress.current = p;
    const st = p < 0.12 ? 0 : p < 0.97 ? 1 : 2;
    setStep((x) => (x === st ? x : st));
    schedule();
  });

  const shown = reduce ? 2 : step;

  return (
    <section ref={section} aria-labelledby="el-house-title" className="relative h-[190svh] motion-reduce:h-auto">
      <div className="sticky top-[calc(var(--demo-offset,111px)-12px)] flex h-[calc(100svh-var(--demo-offset,111px)+12px)] items-center overflow-hidden px-4 pb-16 sm:top-[calc(var(--demo-offset,128px)-12px)] sm:h-[calc(100svh-var(--demo-offset,128px)+12px)] sm:px-6 sm:pb-0 md:top-[calc(var(--demo-offset,120px)-12px)] md:h-[calc(100svh-var(--demo-offset,120px)+12px)] motion-reduce:!static motion-reduce:!h-auto motion-reduce:py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12">
          <div className="order-2 md:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#facc15]">Whole-home electrical</p>
            <h2 id="el-house-title" className="sr-only">
              How we bring power to every room
            </h2>
            <div className="mt-2 grid">
              {STEPS.map((s, i) => (
                <div key={s.title} aria-hidden={shown !== i} className={`[grid-area:1/1] transition-[opacity,transform] duration-300 motion-reduce:transition-none ${shown === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}>
                  <p className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {s.title}
                    {s.sample && <SampleMark className="text-slate-400" />}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-slate-300 sm:mt-3 sm:text-[17px]">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 motion-reduce:hidden" aria-hidden>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div ref={bar} className="h-full origin-left rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fde047] will-change-transform" style={{ transform: "scaleX(0)" }} />
              </div>
              <span className="grid w-20 shrink-0 text-right text-xs font-bold text-slate-400">
                {["Off", "Wiring", "Powered"].map((l, i) => (
                  <span key={l} className={`[grid-area:1/1] transition-opacity duration-200 ${step === i ? "opacity-100" : "opacity-0"}`}>
                    {l}
                  </span>
                ))}
              </span>
            </div>
            <LeadJump className="demo-lift mt-5 hidden rounded-full px-7 py-3.5 font-extrabold text-[#0b0f17] shadow-[0_14px_34px_-12px_rgba(250,204,21,0.8)] sm:inline-flex" style={{ background: "linear-gradient(90deg, #facc15, #f59e0b)" }}>
              {cta}
            </LeadJump>
          </div>

          <div className="order-1 md:order-2">
            <div ref={stage} className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#070a12] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Illustration of a house at night whose rooms light up as power reaches them">
                <defs>
                  <linearGradient id="el-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#0b1222" />
                    <stop offset="1" stopColor="#111a2e" />
                  </linearGradient>
                  <linearGradient id="el-room" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fef3c7" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                  <filter id="el-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="9" />
                  </filter>
                </defs>
                <rect width="400" height="300" fill="url(#el-sky)" />
                <circle cx="342" cy="44" r="15" fill="#e2e8f0" opacity="0.85" />
                <circle cx="348" cy="40" r="13" fill="#0b1222" />
                {[[30, 30], [70, 58], [120, 22], [260, 30], [300, 70], [380, 96], [24, 96], [160, 52]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={i % 3 ? 0.9 : 1.3} fill="#cbd5e1" opacity={0.5 + (i % 3) * 0.15} />
                ))}
                {/* ground */}
                <rect x="0" y="280" width="400" height="20" fill="#0a0f1a" />
                {/* house body + roof */}
                <path d="M60 125 L60 280 L340 280 L340 125" fill="#0e1424" stroke="#334155" strokeWidth="2" />
                <path d="M40 128 L200 42 L360 128" fill="#0e1424" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="60" y1="200" x2="340" y2="200" stroke="#1e293b" strokeWidth="1.5" />
                {/* dim, unpowered wiring (static) */}
                <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {ROOMS.map((r) => (
                    <polyline key={r.id} points={r.wire.map((p) => p.join(",")).join(" ")} />
                  ))}
                </g>
                {/* dark windows */}
                {ROOMS.map((r) =>
                  r.round ? (
                    <circle key={r.id} cx={r.rect[0] + 12} cy={r.rect[1] + 12} r="12" fill="#0b1020" stroke="#475569" strokeWidth="1.5" />
                  ) : (
                    <rect key={r.id} x={r.rect[0]} y={r.rect[1]} width={r.rect[2]} height={r.rect[3]} rx="2" fill="#0b1020" stroke="#475569" strokeWidth="1.5" />
                  ),
                )}
                {/* lit rooms (opacity only) */}
                {ROOMS.map((r, i) => (
                  <g key={r.id} ref={(el) => void (rooms.current[i] = el)} className="transition-opacity duration-500 motion-reduce:!opacity-100 motion-reduce:transition-none" style={{ opacity: 0 }}>
                    {r.round ? (
                      <>
                        <circle cx={r.rect[0] + 12} cy={r.rect[1] + 12} r="16" fill="#fbbf24" opacity="0.55" filter="url(#el-glow)" />
                        <circle cx={r.rect[0] + 12} cy={r.rect[1] + 12} r="11" fill="url(#el-room)" />
                      </>
                    ) : (
                      <>
                        <rect x={r.rect[0] - 4} y={r.rect[1] - 4} width={r.rect[2] + 8} height={r.rect[3] + 8} fill="#fbbf24" opacity="0.5" filter="url(#el-glow)" />
                        <rect x={r.rect[0] + 1} y={r.rect[1] + 1} width={r.rect[2] - 2} height={r.rect[3] - 2} rx="1.5" fill="url(#el-room)" />
                        {r.id !== "porch" && <line x1={r.rect[0] + r.rect[2] / 2} y1={r.rect[1]} x2={r.rect[0] + r.rect[2] / 2} y2={r.rect[1] + r.rect[3]} stroke="#b45309" strokeWidth="1.2" opacity="0.6" />}
                      </>
                    )}
                  </g>
                ))}
                {/* panel */}
                <rect x="70" y="236" width="16" height="22" rx="2" fill="#1e293b" stroke="#facc15" strokeWidth="1.3" />
                <path d="M80 240 l-4 7 h3 l-2 6 l5 -8 h-3 l2 -5 z" fill="#facc15" />
              </svg>
              <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
              <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">Illustration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
