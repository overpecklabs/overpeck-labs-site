"use client";

import { useEffect, useMemo, useRef } from "react";
import { journey, subscribe } from "@/lib/journey";

// ALL FIGURES ARE SAMPLE DATA for illustration, not client results.
const KPIS = [
  { label: "New Leads", value: 128 },
  { label: "Calls Answered by AI", value: 46 },
  { label: "Quotes Sent", value: 39 },
  { label: "Booked Jobs", value: 31 },
  { label: "Cost per Lead", value: 18, prefix: "$" },
];
const SOURCES = [
  { label: "Google", value: 52, color: "#1f6feb" },
  { label: "Website", value: 34, color: "#12b5a6" },
  { label: "AI Chat", value: 27, color: "#f2a93b" },
  { label: "Referrals", value: 15, color: "#4caf6e" },
];
const FEED = [
  { text: "New quote request · Hackensack", time: "2m", color: "#1f6feb" },
  { text: "AI answered missed call", time: "9m", color: "#f2a93b" },
  { text: "Review request sent", time: "21m", color: "#4caf6e" },
  { text: "Job booked · Thu 10 AM", time: "34m", color: "#12b5a6" },
];
const CONVERSION = 24; // % lead -> booked (sample)

const CH = 3; // journey slot for the Track & Optimize chapter

// Scroll windows (chapter progress 0..1). Each widget: marker sketch first, then real UI.
const WIN: Record<string, [number, number]> = {
  panel: [0.02, 0.2],
  kpi: [0.16, 0.32],
  line: [0.28, 0.46],
  bars: [0.42, 0.56],
  donut: [0.5, 0.62],
  feed: [0.58, 0.74],
  alert: [0.72, 0.82],
};
const DEPTH: Record<string, number> = { kpi: 26, line: 0, bars: 10, donut: 18, feed: 36 };

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const seg = (p: number, [a, b]: [number, number]) => clamp((p - a) / (b - a));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 30 days of sample leads, smoothed into an SVG path (viewBox 300 x 110). */
function useLineChart() {
  return useMemo(() => {
    const pts = Array.from({ length: 30 }, (_, i) => {
      const v = 3 + i * 0.32 + Math.sin(i * 0.9) * 1.3 + (i % 6 === 0 ? 1 : 0);
      return [6 + (i / 29) * 288, 100 - v * 6.4] as const;
    });
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    const area = `${d} L294 106 L6 106 Z`;
    return { d, area };
  }, []);
}

/** Marker outline that draws before a widget fills in. */
const Sketch = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
    <rect data-sketch x="0" y="0" width="100%" height="100%" rx="12" pathLength={1} fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" style={{ strokeDasharray: 1, strokeDashoffset: 0 }} />
  </svg>
);

function Widget({ k, title, className = "", anchor, children }: { k: string; title: string; className?: string; anchor?: string; children: React.ReactNode }) {
  return (
    <div data-w={k} data-anchor={anchor} className={`relative [transform-style:preserve-3d] ${className}`}>
      <Sketch />
      <div data-fill className="h-full rounded-xl border border-ink/10 bg-white/90 p-3 shadow-[0_6px_18px_rgba(26,26,26,0.07)]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink/80">{title}</span>
          <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink/75">Sample</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function TrackingDashboard({ standalone = false }: { standalone?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { d, area } = useLineChart();

  useEffect(() => {
    const rootEl = root.current;
    const panelEl = panel.current;
    if (!rootEl || !panelEl) return;
    const desktop3d = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const widgets = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-w]"));
    const counters = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-count]"));
    const line = rootEl.querySelector<SVGPathElement>("[data-line]")!;
    const clip = rootEl.querySelector<SVGRectElement>("[data-clip]")!;
    const tip = rootEl.querySelector<SVGGElement>("[data-tip]")!;
    const bars = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-bar]"));
    const ring = rootEl.querySelector<SVGCircleElement>("[data-ring]")!;
    const ringText = rootEl.querySelector<HTMLElement>("[data-ring-text]")!;
    const feedItems = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-feed]"));
    const alert = rootEl.querySelector<HTMLElement>("[data-alert]")!;
    const lineLen = line.getTotalLength();

    let hx = 0, hy = 0, last = -1;

    const render = (p: number) => {
      // panel: slides out of the board and turns to face the viewer
      const s = ease(seg(p, WIN.panel));
      const settle = seg(p, [0.82, 1]);
      if (desktop3d) {
        const ry = lerp(-38, -8, s) + 4 * settle + hx;
        const rx = lerp(14, 5, s) - 2 * settle + hy;
        panelEl.style.transform = `translate3d(${lerp(140, 0, s)}px, 0, ${lerp(-420, 0, s)}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      } else {
        panelEl.style.transform = `translate3d(0, ${lerp(30, 0, s)}px, 0)`;
      }
      panelEl.style.opacity = String(clamp(s * 1.4));

      widgets.forEach((w) => {
        const k = w.dataset.w!;
        const ws = seg(p, WIN[k]);
        const sketch = clamp(ws / 0.45);
        const fill = ease(clamp((ws - 0.35) / 0.65));
        const sk = w.querySelector<SVGRectElement>("[data-sketch]");
        if (sk) {
          sk.style.strokeDashoffset = String(1 - sketch);
          sk.style.opacity = String(1 - fill * 0.85);
        }
        const content = w.querySelector<HTMLElement>("[data-fill]");
        if (content) {
          content.style.opacity = String(fill);
          content.style.transform = `translateY(${(1 - fill) * 10}px)`;
        }
        if (desktop3d) {
          const z = DEPTH[k] ?? 0;
          w.style.transform = `translateZ(${z * fill}px) translateY(${(0.5 - p) * z * 0.35}px)`;
        }
        w.dataset.fill = fill.toFixed(3);
      });

      const f = (k: string) => Number(rootEl.querySelector<HTMLElement>(`[data-w="${k}"]`)?.dataset.fill ?? 0);

      // KPI counters tick up
      const kf = f("kpi");
      counters.forEach((c) => {
        const v = Math.round(Number(c.dataset.count) * kf);
        c.textContent = `${c.dataset.prefix ?? ""}${v}`;
      });

      // line chart draws left to right
      const lf = f("line");
      line.style.strokeDashoffset = String(1 - lf);
      clip.setAttribute("width", String(300 * lf));
      const pt = line.getPointAtLength(lineLen * Math.max(0.001, lf));
      tip.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      tip.style.opacity = String(lf > 0.02 ? 1 : 0);

      // bars grow (staggered)
      const bf = f("bars");
      bars.forEach((b, i) => (b.style.transform = `scaleY(${clamp(bf * 1.35 - i * 0.12)})`));

      // conversion ring fills
      const df = f("donut");
      ring.style.strokeDasharray = `${CONVERSION * df} 100`;
      ringText.textContent = `${Math.round(CONVERSION * df)}%`;

      // activity feed slides in
      const ff = f("feed");
      feedItems.forEach((it, i) => {
        const l = ease(clamp(ff * 4 - i));
        it.style.opacity = String(l);
        it.style.transform = `translateX(${(1 - l) * 26}px)`;
      });

      // opportunity alert pops forward in depth
      const a = ease(seg(p, WIN.alert));
      alert.style.opacity = String(a);
      alert.style.transform = desktop3d
        ? `translateZ(${a * 90}px) scale(${lerp(0.6, 1, a)})`
        : `scale(${lerp(0.85, 1, a)})`;
      alert.dataset.on = a > 0.95 ? "1" : "0";
      last = p;
    };

    // standalone pages and reduced motion: the completed dashboard, static
    if (reduced || standalone) {
      render(1);
      return;
    }
    render(journey.p[CH]);
    const off = subscribe(() => render(journey.p[CH]));

    // subtle hover tilt (desktop, mouse only)
    const onMove = (e: PointerEvent) => {
      if (!desktop3d || e.pointerType !== "mouse") return;
      const r = panelEl.getBoundingClientRect();
      hx = ((e.clientX - r.left) / r.width - 0.5) * 6;
      hy = -((e.clientY - r.top) / r.height - 0.5) * 5;
      render(last < 0 ? journey.p[CH] : last);
    };
    const onLeave = () => {
      hx = 0;
      hy = 0;
      render(last);
    };
    panelEl.addEventListener("pointermove", onMove);
    panelEl.addEventListener("pointerleave", onLeave);
    return () => {
      off();
      panelEl.removeEventListener("pointermove", onMove);
      panelEl.removeEventListener("pointerleave", onLeave);
    };
  }, [standalone]);

  return (
    <div ref={root} className="relative [perspective:1400px]" role="img" aria-label="Sample growth dashboard: new leads, AI-answered calls, quotes sent, booked jobs, cost per lead, leads over 30 days, leads by source, conversion rate, recent activity and a new opportunity alert. All figures are sample data.">
      <div
        ref={panel}
        className="relative rounded-2xl border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.97),rgba(246,249,252,0.92))] p-3 shadow-[0_2px_4px_rgba(26,26,26,0.05),0_30px_70px_rgba(26,26,26,0.16)] [transform-style:preserve-3d] will-change-transform sm:p-4"
        aria-hidden
      >
        {/* header */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-mk-green shadow-[0_0_0_4px_rgba(47,158,68,0.15)]" />
            <span className="font-display text-sm font-bold text-ink sm:text-base">Growth Dashboard</span>
            <span className="hidden text-xs text-ink/75 sm:inline">· Last 30 days</span>
          </div>
          <span className="rounded-full border-2 border-mk-red/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mk-red">Sample data</span>
        </div>

        <div className="grid grid-cols-6 gap-2.5 [transform-style:preserve-3d] sm:gap-3">
          {/* KPI row */}
          <Widget k="kpi" title="This month" className="col-span-6">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {KPIS.map((k) => (
                <div key={k.label} className="rounded-lg bg-[#f6f8fb] px-2 py-1.5">
                  <div className="font-display text-xl font-bold tabular-nums text-ink sm:text-2xl" data-count={k.value} data-prefix={k.prefix}>
                    {k.prefix ?? ""}
                    {k.value}
                  </div>
                  <div className="text-[10px] leading-tight text-ink/80">{k.label}</div>
                </div>
              ))}
            </div>
          </Widget>

          {/* line chart */}
          <Widget k="line" title="Leads over 30 days" className="col-span-6 sm:col-span-4" anchor="chart">
            <svg viewBox="0 0 300 110" className="h-[96px] w-full overflow-visible sm:h-[118px]">
              <defs>
                <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#19f0d2" stopOpacity="0.42" />
                  <stop offset="1" stopColor="#19f0d2" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dash-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#1f6feb" />
                  <stop offset="1" stopColor="#12b5a6" />
                </linearGradient>
                <clipPath id="dash-clip">
                  <rect data-clip x="0" y="0" width="300" height="110" />
                </clipPath>
              </defs>
              {[30, 58, 86].map((y) => (
                <line key={y} x1="6" x2="294" y1={y} y2={y} stroke="#1a1a1a" strokeOpacity="0.07" />
              ))}
              <path d={area} fill="url(#dash-area)" clipPath="url(#dash-clip)" />
              <path data-line d={d} fill="none" stroke="url(#dash-line)" strokeWidth="3" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 0 }} />
              <g data-tip>
                <circle r="9" fill="#19f0d2" opacity="0.28" />
                <circle r="4.5" fill="#12b5a6" stroke="#fff" strokeWidth="2" />
              </g>
            </svg>
          </Widget>

          {/* conversion ring */}
          <Widget k="donut" title="Lead → booked" className="col-span-3 sm:col-span-2">
            <div className="flex items-center justify-center py-1">
              <div className="relative h-[86px] w-[86px] sm:h-[104px] sm:w-[104px]">
                <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#1a1a1a" strokeOpacity="0.08" strokeWidth="4.5" />
                  <circle data-ring cx="21" cy="21" r="15.9" fill="none" stroke="#2f9e44" strokeWidth="4.5" strokeLinecap="round" pathLength={100} style={{ strokeDasharray: `${CONVERSION} 100` }} />
                </svg>
                <span data-ring-text className="font-display absolute inset-0 grid place-items-center text-lg font-bold tabular-nums text-ink sm:text-xl">
                  {CONVERSION}%
                </span>
              </div>
            </div>
          </Widget>

          {/* bars by source */}
          <Widget k="bars" title="Leads by source" className="col-span-3">
            <div className="flex h-[96px] items-end justify-around gap-2 px-1 sm:h-[112px]">
              {SOURCES.map((s) => (
                <div key={s.label} className="flex h-full flex-1 flex-col items-center justify-end">
                  <span className="mb-0.5 text-[10px] font-bold tabular-nums text-ink">{s.value}</span>
                  <div data-bar className="relative w-full max-w-[30px] origin-bottom rounded-t-[3px]" style={{ height: `${(s.value / 52) * 70}%`, background: `linear-gradient(90deg, ${s.color} 0 72%, color-mix(in srgb, ${s.color} 70%, #000) 72%)` }}>
                    {/* faux 3D top cap */}
                    <span className="absolute -top-[5px] left-0 h-[6px] w-full origin-bottom skew-x-[-40deg] rounded-t-[2px]" style={{ background: `color-mix(in srgb, ${s.color} 60%, #fff)` }} />
                  </div>
                  <span className="mt-1 text-[9.5px] text-ink/80">{s.label}</span>
                </div>
              ))}
            </div>
          </Widget>

          {/* activity feed */}
          <Widget k="feed" title="Live activity" className="col-span-6 hidden sm:col-span-3 sm:block">
            <ul className="space-y-1.5">
              {FEED.map((f) => (
                <li key={f.text} data-feed className="flex items-center gap-2 rounded-lg bg-[#f6f8fb] px-2 py-1.5 text-[11.5px] text-ink">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: f.color }} />
                  <span className="min-w-0 flex-1 truncate">{f.text}</span>
                  <span className="text-[10px] text-ink/75">{f.time}</span>
                </li>
              ))}
            </ul>
          </Widget>
        </div>

        {/* opportunity alert: pops forward in depth */}
        <div data-alert data-anchor="alert" className="absolute bottom-9 right-2 z-10 rounded-xl sm:bottom-auto sm:-top-7 border-2 border-lab-amber bg-[#fff8eb] px-3 py-2 shadow-[0_14px_30px_rgba(242,169,59,0.28)] sm:-right-6">
          <span className="dash-pulse pointer-events-none absolute -left-1.5 -top-1.5 h-4 w-4 rounded-full bg-lab-amber" />
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a4b00]">New opportunity found</div>
          <div className="text-xs text-ink/85">More &ldquo;water heater repair&rdquo; searches nearby · sample</div>
        </div>

        <p className="mt-2.5 text-[10px] text-ink/75">All figures are sample data for illustration, not client results.</p>
      </div>
    </div>
  );
}
