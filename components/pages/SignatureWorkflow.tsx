"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SignatureWorkflow as Workflow } from "@/lib/industries-pages";

// Marker-style line icons for workflow steps.
const ICONS: Record<string, string> = {
  camera: "M4 8h3l2-3h6l2 3h3v11H4z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  tag: "M3 12V4h8l10 10-8 8L3 12z M7.5 8.5h.01",
  folder: "M3 6h6l2 2h10v11H3z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18",
  pen: "M4 20l4-1 11-11-3-3L5 16l-1 4z M14 7l3 3",
  share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  alert: "M12 3l10 18H2z M12 10v5 M12 18h.01",
  calendar: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4 M8 14h3",
  message: "M4 5h16v11H9l-5 4z M8 10h8",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  star: "M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z",
  list: "M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 21h4",
  repeat: "M4 12a8 8 0 0 1 14-5 M18 3v4h-4 M20 12a8 8 0 0 1-14 5 M6 21v-4h4",
  chart: "M4 20V4 M4 20h16 M8 16l4-5 3 3 5-7",
  scan: "M4 8V4h4 M16 4h4v4 M20 16v4h-4 M8 20H4v-4 M8 12h8",
  dollar: "M12 3v18 M16 7c-1-1.5-2.5-2-4-2-2 0-4 1-4 3s2 2.7 4 3.3 4 1.3 4 3.7-2 3-4 3c-1.8 0-3.3-.7-4.2-2",
  check: "M5 12l4 4 10-10",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  cloud: "M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z M10 21l2-3 M14 21l2-3",
  clipboard: "M9 3h6v3H9z M6 5h12v16H6z M9 12h6 M9 16h4",
  car: "M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v5h-3v-2H6v2H3z M3 13h18",
  chat: "M4 4h16v12H8l-4 4z M8 9h.01 M12 9h.01 M16 9h.01",
};

const STEP_COLORS = [
  ["#fff3a3", "#7a5b00"],
  ["#c8f5ec", "#0f766e"],
  ["#dbe8ff", "#1f6feb"],
  ["#dcf3df", "#237a34"],
  ["#ffe1d6", "#c2410c"],
  ["#efe6ff", "#6d3fd6"],
];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

export default function SignatureWorkflow({ workflow, industry }: { workflow: Workflow; industry: string }) {
  const flow = useRef<HTMLOListElement>(null);

  // Scroll-scrubbed: each step's marker outline draws, its icon pops into 3D, then the arrow to the next draws.
  useEffect(() => {
    const el = flow.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const n = steps.length;
    const render = (p: number) => {
      steps.forEach((s, i) => {
        const local = clamp(p * n - i);
        const outline = s.querySelector<SVGRectElement>("[data-outline]");
        if (outline) outline.style.strokeDashoffset = String(1 - clamp(local / 0.45));
        const icon = s.querySelector<HTMLElement>("[data-icon]");
        const k = ease(clamp((local - 0.35) / 0.5));
        if (icon) {
          icon.style.transform = `translateZ(${k * 34}px) rotateX(${(1 - k) * 70}deg) scale(${0.55 + 0.45 * k})`;
          icon.style.opacity = String(0.15 + 0.85 * k);
          icon.style.boxShadow = `0 ${4 + k * 14}px ${8 + k * 22}px rgba(26,26,26,${0.06 + k * 0.12})`;
        }
        const body = s.querySelector<HTMLElement>("[data-body]");
        if (body) body.style.opacity = String(0.35 + 0.65 * k);
        const arrow = s.querySelector<SVGPathElement>("[data-arrow]");
        if (arrow) arrow.style.strokeDashoffset = String(1 - clamp((local - 0.75) / 0.25));
      });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(1);
      return;
    }
    render(0);
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({ trigger: el, start: "top 78%", end: "bottom 55%", scrub: 0.5, onUpdate: (self) => render(self.progress) });
    return () => st.kill();
  }, []);

  const pickWorkflow = () => {
    window.dispatchEvent(new CustomEvent("leadform-preselect", { detail: { service: "AI workflow", note: workflow.title } }));
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      {/* summary */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <span className="inline-flex rounded-full border-2 border-mk-red/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-mk-red">Sample workflow, customized for your business</span>
        <h3 className="font-display mt-4 text-3xl font-bold text-ink sm:text-4xl">{workflow.title}</h3>
        <p className="mt-3 text-lg text-ink/85">{workflow.promise}</p>

        <h4 className="mt-7 text-xs font-bold uppercase tracking-widest text-ink/80">What you save</h4>
        <ul className="mt-3 space-y-2 text-[15px] text-ink/90">
          {workflow.saves.map((x) => (
            <li key={x} className="flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 shrink-0" fill="none" stroke="#237a34" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 13 l5 5 L20 6" />
              </svg>
              <span>No more {x.charAt(0).toLowerCase() + x.slice(1)}</span>
            </li>
          ))}
        </ul>

        <h4 className="mt-7 text-xs font-bold uppercase tracking-widest text-ink/80">Connects with</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {workflow.tools.map((t) => (
            <li key={t} className="rounded-full border border-ink/20 bg-white px-3 py-1 text-sm text-ink/90">
              {t}
            </li>
          ))}
        </ul>

        <button type="button" onClick={pickWorkflow} className="btn-primary mt-8">
          Get this workflow
        </button>
      </div>

      {/* the flow */}
      <ol ref={flow} className="relative" aria-label={`${workflow.title}: ${workflow.steps.length} steps`}>
        {workflow.steps.map((s, i) => {
          const [bg, ink] = STEP_COLORS[i % STEP_COLORS.length];
          const last = i === workflow.steps.length - 1;
          return (
            <li key={s.t} data-step className="relative">
              <div className="relative flex items-start gap-4 rounded-md bg-paper/70 p-4 [perspective:600px]">
                {/* marker outline drawn by scroll */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                  <rect data-outline x="0" y="0" width="100%" height="100%" rx="8" pathLength={1} fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" style={{ strokeDasharray: 1, strokeDashoffset: 0 }} />
                </svg>
                <div data-icon className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border-2 border-ink [transform-style:preserve-3d] will-change-transform" style={{ background: bg }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={ICONS[s.icon] ?? ICONS.check} />
                  </svg>
                </div>
                <div data-body>
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color: ink }}>
                    Step {i + 1}
                  </div>
                  <div className="font-display text-lg font-bold text-ink">{s.t}</div>
                  <p className="mt-0.5 text-[15px] text-ink/85">{s.d}</p>
                </div>
              </div>
              {!last && (
                <svg className="ml-9 block h-10 w-6 overflow-visible" viewBox="0 0 24 40" aria-hidden>
                  <path data-arrow d="M12 2 C14 14 10 24 12 34 M6 28 L12 36 L18 28" fill="none" stroke="#1f6feb" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 0 }} />
                </svg>
              )}
            </li>
          );
        })}
        <li className="sr-only">Sample workflow for {industry}, customized for each business.</li>
      </ol>
    </div>
  );
}
