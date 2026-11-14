"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Annotation from "./Annotation";

const STEPS = [
  {
    phase: "Hypothesis",
    tag: "Audit",
    color: "#0f766e",
    body: "We review your site, your Google presence and how leads reach you today, then design a free homepage mockup.",
  },
  {
    phase: "Experiment",
    tag: "Build",
    color: "#1f6feb",
    body: "We build your site and the systems behind it: forms, booking, follow-ups and tracking.",
  },
  {
    phase: "Results",
    tag: "Track & optimize",
    color: "#237a34",
    body: "We watch calls, forms and rankings, fix what breaks and keep improving what works.",
  },
];

// Glass apparatus (desktop): test tube -> Erlenmeyer flask -> beaker, joined by tubing.
const TUBE =
  "M24 196 C90 198 140 192 170 168 L170 72 C172 26 252 18 302 40 C366 66 420 160 478 170 C492 172 500 150 500 128 L500 70 C502 26 602 18 654 40 C724 70 760 160 806 170 C822 172 830 150 830 132 L830 86";

const LIQUID = ["#19f0d2", "#5b9cf5", "#4caf6e"];

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const bubble = useRef<SVGGElement>(null);
  const fills = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const path = trail.current;
    const dot = bubble.current;
    if (!path || !dot) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;

    const render = (p: number) => {
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      const pt = path.getPointAtLength(len * p);
      dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      fills.current.forEach((f, i) => {
        if (!f) return;
        const local = Math.min(1, Math.max(0, p * 3 - i));
        f.style.transform = `scaleY(${local})`;
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(1);
      return;
    }
    render(0);
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 65%",
      end: "bottom 75%",
      scrub: 0.6,
      onUpdate: (self) => render(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <section id="process" ref={root} className="board-bg relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">How it works</p>
        <h2 className="font-display mt-3 max-w-3xl text-4xl font-bold text-ink sm:text-5xl">
          Our Process: Hypothesis, Experiment, Results.
        </h2>

        <div className="notebook tilt-r relative mt-12 rounded-sm px-6 pb-8 pt-10 sm:pl-20 sm:pr-10">
          <span className="tape" style={{ left: "12%" }} />
          <div className="mb-6 flex items-baseline justify-between gap-4 text-xs text-ink/75">
            <span className="font-semibold uppercase tracking-widest">Lab notebook · p. 01</span>
            <Annotation color="#1f6feb" size="text-lg" showFrom="sm" className="rotate-[-2deg]">
              follow the lead
            </Annotation>
          </div>

          {/* apparatus: desktop, animated */}
          <div className="relative hidden md:block" aria-hidden>
            <svg viewBox="0 0 1000 220" className="w-full overflow-visible">
              {/* vessels */}
              <g fill="none" stroke="#1a1a1a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M150 40 V170 a20 20 0 0 0 40 0 V40 M143 40 h54" />
                <path d="M484 40 V92 L440 180 Q436 192 448 192 H552 Q564 192 560 180 L516 92 V40 M477 40 h46" />
                <path d="M780 50 V182 Q780 192 790 192 H870 Q880 192 880 182 V50 M772 50 h16 M872 50 h16 M788 86 h12 M788 116 h12 M788 146 h12" />
              </g>
              {/* liquids (scaleY from the bottom) */}
              {[
                "M153 118 V170 a17 17 0 0 0 34 0 V118 Z",
                "M462 144 L442 182 Q440 189 448 189 H552 Q560 189 558 182 L538 144 Z",
                "M783 120 V182 Q783 189 790 189 H870 Q877 189 877 182 V120 Z",
              ].map((d, i) => (
                <path
                  key={i}
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  d={d}
                  fill={LIQUID[i]}
                  opacity="0.55"
                  style={{ transformBox: "fill-box", transformOrigin: "50% 100%", transform: "scaleY(1)" }}
                />
              ))}
              {/* tubing + the lead's marker trail */}
              <path d={TUBE} fill="none" stroke="#1a1a1a" strokeOpacity="0.16" strokeWidth="9" strokeLinecap="round" />
              <path d={TUBE} fill="none" stroke="#fffefb" strokeWidth="5" strokeLinecap="round" />
              <path ref={trail} d={TUBE} fill="none" stroke="#19c9b0" strokeWidth="3.5" strokeLinecap="round" />
              {/* the lead bubble */}
              <g ref={bubble}>
                <circle r="10" fill="#19f0d2" stroke="#0f766e" strokeWidth="2" />
                <circle r="3" cx="-3" cy="-3" fill="#fff" opacity="0.9" />
                <text x="14" y="-12" fill="#0f766e" fontSize="15" style={{ fontFamily: "var(--font-marker), cursive" }}>
                  lead
                </text>
              </g>
            </svg>
            <p className="mt-1 text-center text-xs italic text-ink/75">Fig. 1: a new lead, from first visit to booked job.</p>
          </div>

          {/* entries */}
          <ol className="mt-6 grid gap-8 md:grid-cols-3 md:gap-10">
            {STEPS.map((s, i) => (
              <li key={s.phase} className="relative">
                <div className="flex items-center gap-3">
                  {/* small static vessel for phones */}
                  <svg width="30" height="38" viewBox="0 0 30 38" className="shrink-0 md:hidden" aria-hidden>
                    <path d="M10 2 V14 L2 32 Q1 36 5 36 H25 Q29 36 28 32 L20 14 V2" fill={LIQUID[i]} fillOpacity="0.45" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-ink/75">Step {i + 1}</div>
                    <h3 className="font-display text-2xl font-bold" style={{ color: s.color }}>
                      {s.phase}
                    </h3>
                  </div>
                </div>
                <div className="mt-1 text-sm font-semibold text-ink">{s.tag}</div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
