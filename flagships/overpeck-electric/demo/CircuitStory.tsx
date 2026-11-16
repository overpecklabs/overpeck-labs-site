"use client";

import { useEffect, useRef } from "react";

/**
 * One continuous scroll story for the whole page: a glowing current that starts at the meter in the hero and
 * travels down the page, scrubbed to scroll, powering each section as it arrives.
 *
 * How it works
 * - One absolutely positioned SVG behind the page content (inside <main data-circuit-root>, which isolates it).
 * - The route is computed from the DOM: elements marked data-circuit="…", data-circuit-card, data-circuit-step,
 *   data-circuit-town, data-circuit-stars, data-circuit-final, data-circuit-section. Rebuilt on resize.
 * - Desktop: a winding route (branches into every service card and step, across to the EV battery and the review
 *   stars, down the service-area card, into the final switch). Phones: one lane down the left edge with short stubs.
 * - Scroll maps to path length through sync points: every anchor (a card, the battery, a step…) is reached exactly
 *   when it crosses the reading line (62% down the viewport); in between, length follows "effort" (vertical px +
 *   0.45 × horizontal px), so horizontal runs scrub smoothly instead of jumping and the head never drifts away. Drawing uses stroke-dashoffset; the spark head and particles use transform/opacity;
 *   section states toggle classes that only change opacity/transform (see electric.css).
 * - Everything is lit by default (no JS, prefers-reduced-motion). Dimming applies only once the circuit is running
 *   (main.el-circuit-ready). Reduced motion: the full circuit is drawn and lit, no scrubbing, no particles.
 * - Lazy: nothing is measured or drawn until the browser is idle after load.
 */

type P = { x: number; y: number; sharp?: boolean };
type Anchor = { key: string; idx: number; el?: Element };
type Geo = {
  total: number;
  xs: Float32Array;
  ys: Float32Array;
  effort: Float32Array;
  step: number;
  anchors: { key: string; L: number; el?: Element }[];
  corners: { L: number; x: number; y: number; parts: SVGCircleElement[] }[];
  sections: { el: Element; top: number; bottom: number }[];
  /** Sync points: scroll line y -> effort, strictly increasing in y. */
  syncY: number[];
  syncE: number[];
  towns: Element[];
  y0: number;
  y1: number;
};

const SVGNS = "http://www.w3.org/2000/svg";
const STEP = 4;

/** Flatten a rounded polyline into evenly spaced samples, and return its SVG path data. */
function flatten(pts: P[], radius: number) {
  const segs: { a: P; b: P; c?: P }[] = [];
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  let cur = pts[0];
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const next = pts[i + 1];
    if (!next || p.sharp) {
      segs.push({ a: cur, b: p });
      d += `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      cur = p;
      continue;
    }
    const inLen = Math.hypot(p.x - cur.x, p.y - cur.y), outLen = Math.hypot(next.x - p.x, next.y - p.y);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    if (r < 0.5 || !inLen || !outLen) {
      segs.push({ a: cur, b: p });
      d += `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      cur = p;
      continue;
    }
    const s = { x: p.x - ((p.x - cur.x) / inLen) * r, y: p.y - ((p.y - cur.y) / inLen) * r };
    const e = { x: p.x + ((next.x - p.x) / outLen) * r, y: p.y + ((next.y - p.y) / outLen) * r };
    segs.push({ a: cur, b: s }, { a: s, c: p, b: e });
    d += `L${s.x.toFixed(1)} ${s.y.toFixed(1)}Q${p.x.toFixed(1)} ${p.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
    cur = e;
  }
  // dense polyline, then resample at a fixed step
  const poly: { x: number; y: number }[] = [pts[0]];
  for (const g of segs) {
    if (!g.c) poly.push(g.b);
    else for (let t = 1; t <= 8; t++) {
      const u = t / 8, v = 1 - u;
      poly.push({ x: v * v * g.a.x + 2 * v * u * g.c.x + u * u * g.b.x, y: v * v * g.a.y + 2 * v * u * g.c.y + u * u * g.b.y });
    }
  }
  const cum = [0];
  for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i].x - poly[i - 1].x, poly[i].y - poly[i - 1].y));
  const total = cum[cum.length - 1];
  const n = Math.max(2, Math.floor(total / STEP) + 1);
  const xs = new Float32Array(n), ys = new Float32Array(n), effort = new Float32Array(n);
  let j = 1;
  for (let i = 0; i < n; i++) {
    const L = Math.min(total, i * STEP);
    while (j < cum.length - 1 && cum[j] < L) j++;
    const f = (L - cum[j - 1]) / Math.max(1e-6, cum[j] - cum[j - 1]);
    xs[i] = poly[j - 1].x + (poly[j].x - poly[j - 1].x) * f;
    ys[i] = poly[j - 1].y + (poly[j].y - poly[j - 1].y) * f;
    effort[i] = i ? effort[i - 1] + Math.abs(ys[i] - ys[i - 1]) + 0.45 * Math.abs(xs[i] - xs[i - 1]) : 0;
  }
  return { d, total, xs, ys, effort };
}

export default function CircuitStory() {
  const svg = useRef<SVGSVGElement>(null);
  const dim = useRef<SVGPathElement>(null);
  const lit = useRef<SVGPathElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const parts = useRef<SVGGElement>(null);
  const meter = useRef<HTMLDivElement>(null);
  const volts = useRef<HTMLSpanElement>(null);
  const voltBar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("[data-circuit-root]");
    if (!main || !svg.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let geo: Geo | null = null;
    let raf = 0;
    let lastL = -1;
    let activeSection: Element | null = null;
    let rebuildT = 0;
    let started = false;

    const build = () => {
      const mr = main.getBoundingClientRect();
      const W = main.clientWidth;
      const rel = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - mr.left, t: r.top - mr.top, r: r.right - mr.left, b: r.bottom - mr.top, cx: (r.left + r.right) / 2 - mr.left, cy: (r.top + r.bottom) / 2 - mr.top };
      };
      const q = (s: string) => main.querySelector(s);
      const qa = (s: string) => [...main.querySelectorAll(s)];
      const start = q('[data-circuit="start"]');
      const finalSw = q('[data-circuit="switch"]');
      if (!start || !finalSw) return;
      const phone = W < 768;
      const container = q("#services .max-w-6xl");
      const lane = phone ? 8 : Math.max(10, (container ? rel(container).l : 40) - 28);
      const laneR = W - lane;
      const pts: P[] = [];
      const anchors: Anchor[] = [];
      const go = (x: number, y: number, sharp = false) => pts.push({ x, y, sharp });
      const mark = (key: string, el?: Element) => anchors.push({ key, idx: pts.length - 1, el });
      const here = () => pts[pts.length - 1];
      const stubV = (key: string, el: Element, x: number, yFrom: number, yTo: number) => {
        go(x, yFrom);
        go(x, yTo, true);
        mark(key, el);
        go(x, yFrom);
      };
      const stubH = (key: string, el: Element, xFrom: number, xTo: number, y: number) => {
        go(xFrom, y);
        go(xTo, y, true);
        mark(key, el);
        go(xFrom, y);
      };
      const cardOf = (el: Element) => el.closest(".el-appear") ?? el;

      /** Branch into a group of elements laid out in rows (cards or steps). */
      const rows = (els: Element[], prefix: string) => {
        if (!els.length) return;
        const items = els.map((el) => ({ el, card: rel(cardOf(el)), icon: rel(el) }));
        if (phone) {
          for (const it of items) {
            const y = it.icon.cy;
            if (it.card.l < W / 2) stubH(prefix, it.el, lane, it.card.l + 1, y);
            else {
              go(lane, y);
              mark(prefix, it.el);
            }
          }
          return;
        }
        const grouped: (typeof items)[] = [];
        for (const it of [...items].sort((a, b) => a.card.t - b.card.t || a.card.l - b.card.l)) {
          const row = grouped.find((g) => Math.abs(g[0].card.t - it.card.t) < 6);
          if (row) row.push(it);
          else grouped.push([it]);
        }
        let x = here().x;
        let prevBottom = -1;
        grouped.forEach((row, ri) => {
          const top = Math.min(...row.map((r) => r.card.t));
          const yRun = prevBottom < 0 ? top - 22 : (prevBottom + top) / 2;
          const ltr = x < W / 2;
          go(x, yRun);
          for (const it of [...row].sort((a, b) => (ltr ? a.icon.cx - b.icon.cx : b.icon.cx - a.icon.cx))) stubV(prefix, it.el, it.icon.cx, yRun, it.card.t + 1);
          x = ltr ? laneR : lane;
          go(x, yRun);
          prevBottom = Math.max(...row.map((r) => r.card.b));
          if (ri === grouped.length - 1 && x !== lane) {
            go(x, prevBottom + 20);
            go(lane, prevBottom + 20);
          }
        });
      };

      // 1. the meter in the hero
      const s = rel(start);
      go(s.cx, s.cy, true);
      mark("start", start);
      go(lane, s.cy);
      // 2. services: plug into every card
      rows(qa("[data-circuit-card]"), "card");
      // 3. EV: across to the battery, then down the widget while it charges
      const ev = q('[data-circuit="ev"]');
      const evEnd = q('[data-circuit="ev-end"]');
      if (ev && evEnd) {
        const b = rel(ev);
        stubH("ev", ev, lane, b.l - 2, b.cy);
        go(lane, rel(evEnd).b);
        mark("ev-end", evEnd);
      }
      // 4. how it works: connect steps 1, 2, 3
      rows(qa("[data-circuit-step]"), "step");
      // 5. reviews: across to the stars
      const stars = q('[data-circuit="stars"]');
      if (stars) {
        const r = rel(stars);
        stubH("stars", stars, lane, r.l - 2, r.cy);
      }
      // 6. service area: down the card while the towns light up
      const area = q('[data-circuit="area"]');
      if (area) {
        const c = rel(cardOf(area));
        go(lane, c.t + 10);
        mark("area-start", area);
        go(lane, c.b - 10);
        mark("area-end", area);
      }
      // 7. final CTA: into the switch
      const sw = rel(finalSw);
      const finalCard = rel(finalSw.closest("[data-circuit-final]") ?? finalSw);
      go(lane, finalCard.t - 28);
      go(sw.cx, finalCard.t - 28);
      go(sw.cx, sw.t + 2, true);
      mark("final", finalSw);

      const f = flatten(pts, phone ? 10 : 18);
      const H = main.scrollHeight;
      svg.current!.setAttribute("width", String(W));
      svg.current!.setAttribute("height", String(H));
      svg.current!.setAttribute("viewBox", `0 0 ${W} ${H}`);
      for (const p of [dim, lit, glow, trail]) {
        p.current!.setAttribute("d", f.d);
        p.current!.setAttribute("pathLength", String(f.total));
      }
      lit.current!.style.strokeDasharray = glow.current!.style.strokeDasharray = `${f.total} ${f.total}`;

      const nearest = (x: number, y: number) => {
        let best = 0, bd = Infinity;
        for (let i = 0; i < f.xs.length; i++) {
          const dd = (f.xs[i] - x) ** 2 + (f.ys[i] - y) ** 2;
          if (dd < bd) { bd = dd; best = i; }
          if (dd < 1) break;
        }
        return best * STEP;
      };
      // particles at the bends (fewer on phones)
      parts.current!.replaceChildren();
      const corners: Geo["corners"] = [];
      const bends = pts.filter((p, i) => i > 0 && i < pts.length - 1 && !p.sharp && (pts[i - 1].x !== p.x || pts[i + 1].x !== p.x) && (pts[i - 1].y !== p.y || pts[i + 1].y !== p.y));
      bends.forEach((p, i) => {
        if (phone && i % 3) return;
        if (corners.length >= (phone ? 12 : 48)) return;
        const circles: SVGCircleElement[] = [];
        for (let k = 0; k < (phone ? 2 : 3); k++) {
          const c = document.createElementNS(SVGNS, "circle");
          c.setAttribute("r", "1.6");
          c.setAttribute("fill", k ? "#fde68a" : "#ffffff");
          c.style.opacity = "0";
          c.style.transform = `translate(${p.x}px, ${p.y}px)`;
          parts.current!.appendChild(c);
          circles.push(c);
        }
        corners.push({ L: nearest(p.x, p.y), x: p.x, y: p.y, parts: circles });
      });
      const anchorList = anchors.map((a) => ({ key: a.key, el: a.el, L: nearest(pts[a.idx].x, pts[a.idx].y), y: pts[a.idx].y }));
      const syncY: number[] = [f.ys[0]];
      const syncE: number[] = [0];
      for (const a of anchorList) {
        const e = f.effort[Math.min(f.effort.length - 1, Math.round(a.L / STEP))];
        if (a.y > syncY[syncY.length - 1] + 30 && e > syncE[syncE.length - 1]) {
          syncY.push(a.y);
          syncE.push(e);
        }
      }
      const endE = f.effort[f.effort.length - 1];
      if (endE > syncE[syncE.length - 1]) {
        syncY.push(Math.max(f.ys[f.ys.length - 1], syncY[syncY.length - 1] + 1));
        syncE.push(endE);
      }
      geo = {
        syncY,
        syncE,
        total: f.total,
        xs: f.xs,
        ys: f.ys,
        effort: f.effort,
        step: STEP,
        anchors: anchorList,
        corners,
        sections: qa("[data-circuit-section]").map((el) => ({ el, top: rel(el).t, bottom: rel(el).b })),
        towns: qa("[data-circuit-town]"),
        y0: f.ys[0],
        y1: f.ys[f.ys.length - 1],
      };
      lastL = -1;
    };

    const setOn = (el: Element | undefined | null, on: boolean) => {
      if (el && el.classList.contains("el-on") !== on) el.classList.toggle("el-on", on);
    };

    const apply = (L: number) => {
      const g = geo!;
      const off = Math.max(0, g.total - L);
      lit.current!.style.strokeDashoffset = glow.current!.style.strokeDashoffset = String(off);
      const tl = Math.min(L, 140);
      trail.current!.style.strokeDasharray = `${tl} ${g.total + tl}`;
      trail.current!.style.strokeDashoffset = String(-(L - tl));
      const i = Math.min(g.xs.length - 1, Math.round(L / STEP));
      head.current!.style.transform = `translate(${g.xs[i]}px, ${g.ys[i]}px)`;
      head.current!.style.opacity = L > 2 && L < g.total - 2 ? "1" : "0";
      // section states
      const at = (k: string) => g.anchors.filter((a) => a.key === k);
      for (const a of g.anchors) if (a.key === "card" || a.key === "step" || a.key === "stars" || a.key === "final") setOn(a.key === "stars" ? a.el?.closest("[data-circuit-stars]") : a.key === "final" ? a.el?.closest("[data-circuit-final]") : a.el, L >= a.L);
      const ev = at("ev")[0], evEnd = at("ev-end")[0];
      if (ev && evEnd) {
        const pct = Math.round(Math.min(1, Math.max(0, (L - ev.L) / Math.max(1, evEnd.L - ev.L))) * 100);
        const fill = main.querySelector<HTMLElement>("[data-circuit-battery-fill]");
        const txt = main.querySelector<HTMLElement>("[data-circuit-battery-text]");
        if (fill) fill.style.transform = `scaleX(${pct / 100})`;
        if (txt && txt.textContent !== `${pct}%`) txt.textContent = `${pct}%`;
        setOn(ev.el, L >= ev.L);
      }
      const a0 = at("area-start")[0], a1 = at("area-end")[0];
      if (a0 && a1) g.towns.forEach((t, k) => setOn(t, L >= a0.L + ((k + 1) / (g.towns.length + 1)) * (a1.L - a0.L)));
      // spark particles when the head passes a bend going forward
      if (lastL >= 0 && L > lastL && L - lastL < 600)
        for (const c of g.corners)
          if (c.L > lastL && c.L <= L)
            c.parts.forEach((p, k) => {
              const ang = Math.random() * Math.PI * 2, dist = 8 + Math.random() * 14;
              p.animate(
                [
                  { transform: `translate(${c.x}px, ${c.y}px) scale(1)`, opacity: 1 },
                  { transform: `translate(${c.x + Math.cos(ang) * dist}px, ${c.y + Math.sin(ang) * dist}px) scale(0.3)`, opacity: 0 },
                ],
                { duration: 520 + k * 120, easing: "cubic-bezier(.2,.7,.3,1)" },
              );
            });
      // "hum" on the active section
      const hy = g.ys[i];
      const sec = g.sections.find((s) => hy >= s.top && hy <= s.bottom)?.el ?? null;
      if (sec !== activeSection) {
        activeSection?.classList.remove("el-live");
        sec?.classList.add("el-live");
        activeSection = sec;
      }
      // voltage meter
      const v = Math.round((L / g.total) * 240);
      if (volts.current && volts.current.textContent !== `${v}V`) volts.current.textContent = `${v}V`;
      if (voltBar.current) voltBar.current.style.transform = `scaleX(${L / g.total})`;
      if (meter.current) meter.current.style.opacity = window.scrollY > 300 && L < g.total - 2 ? "1" : "0";
      lastL = L;
    };

    const frame = () => {
      raf = 0;
      if (!geo) return;
      const g = geo;
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const target = window.scrollY + window.innerHeight * 0.62 - mainTop;
      // between two sync points, interpolate effort linearly in scroll
      const n = g.syncY.length;
      let want: number;
      if (target <= g.syncY[0]) want = 0;
      else if (target >= g.syncY[n - 1]) want = g.syncE[n - 1];
      else {
        let k = 1;
        while (k < n && g.syncY[k] < target) k++;
        const fr = (target - g.syncY[k - 1]) / Math.max(1, g.syncY[k] - g.syncY[k - 1]);
        want = g.syncE[k - 1] + fr * (g.syncE[k] - g.syncE[k - 1]);
      }
      let lo = 0, hi = g.effort.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (g.effort[mid] < want) lo = mid + 1;
        else hi = mid;
      }
      apply(Math.min(g.total, lo * STEP));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const rebuild = () => {
      clearTimeout(rebuildT);
      rebuildT = window.setTimeout(() => {
        build();
        if (reduce) {
          if (geo) apply(geo.total);
        } else onScroll();
      }, 150);
    };

    const startUp = () => {
      if (started) return;
      started = true;
      build();
      if (!geo) return;
      if (reduce) {
        apply(geo.total);
        head.current!.style.opacity = "0";
        if (meter.current) meter.current.style.display = "none";
      } else {
        main.classList.add("el-circuit-ready");
        frame();
        window.addEventListener("scroll", onScroll, { passive: true });
      }
      window.addEventListener("resize", rebuild);
      ro.observe(main);
    };
    let lastH = main.scrollHeight;
    const ro = new ResizeObserver(() => {
      if (main.scrollHeight !== lastH) {
        lastH = main.scrollHeight;
        rebuild();
      }
    });
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const kick = () => (idle = ric(startUp, { timeout: 2500 } as IdleRequestOptions) as unknown as number);
    let idle = 0;
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    return () => {
      cic(idle);
      window.removeEventListener("load", kick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", rebuild);
      ro.disconnect();
      clearTimeout(rebuildT);
      if (raf) cancelAnimationFrame(raf);
      main.classList.remove("el-circuit-ready");
    };
  }, []);

  return (
    <>
      <svg ref={svg} aria-hidden className="pointer-events-none absolute left-0 top-0 -z-10" width="0" height="0">
        <path ref={dim} fill="none" stroke="rgba(148,163,184,0.13)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={glow} fill="none" stroke="rgba(250,204,21,0.22)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={lit} fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={trail} fill="none" stroke="#fffbeb" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <g ref={parts} />
        <g ref={head} style={{ opacity: 0 }}>
          <circle r="16" fill="url(#el-spark)" />
          <circle r="4" fill="#ffffff" />
        </g>
        <defs>
          <radialGradient id="el-spark">
            <stop offset="0" stopColor="#fffbeb" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#facc15" stopOpacity="0.55" />
            <stop offset="1" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      {/* voltage indicator (fixed, fixed size: no layout shift) */}
      <div ref={meter} aria-hidden className="pointer-events-none fixed bottom-[5.25rem] left-3 z-30 flex w-[7.5rem] items-center gap-2 rounded-full border border-[#facc15]/30 bg-[#0b0f17]/85 px-3 py-1.5 opacity-0 shadow-lg backdrop-blur transition-opacity duration-300 sm:bottom-5 sm:left-5">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-[#facc15]" fill="currentColor">
          <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
        </svg>
        <span ref={volts} className="w-9 text-right text-xs font-extrabold tabular-nums text-white">
          0V
        </span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <span ref={voltBar} className="block h-full origin-left rounded-full bg-[#facc15]" style={{ transform: "scaleX(0)" }} />
        </span>
      </div>
    </>
  );
}
