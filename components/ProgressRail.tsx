"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToId } from "@/lib/journey";

const STOPS = [
  { id: "top", label: "Start" },
  { id: "websites", label: "01 Get Found" },
  { id: "workflows", label: "02 Automate" },
  { id: "tracking", label: "03 Measure" },
  { id: "ai", label: "04 Amplify" },
  { id: "services", label: "The Formula" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
];

/** Thin progress rail on the left edge (desktop): fills with the journey, dots jump to each stop. */
export default function ProgressRail() {
  const [active, setActive] = useState(0);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      const tops = STOPS.map((s) => document.getElementById(s.id)?.getBoundingClientRect().top ?? Infinity);
      let i = 0;
      tops.forEach((t, k) => {
        if (t <= mid) i = k;
      });
      const next = tops[i + 1] ?? Infinity;
      const local = Number.isFinite(next) ? Math.min(1, Math.max(0, (mid - tops[i]) / Math.max(1, next - tops[i]))) : 1;
      setActive(i);
      if (fill.current) fill.current.style.height = `${((i + local) / (STOPS.length - 1)) * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav aria-label="Page progress" className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative h-[46vh] w-px bg-ink/15">
        <div ref={fill} className="absolute left-0 top-0 w-px bg-teal-ink transition-[height] duration-150" style={{ height: 0 }} />
        {STOPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToId(s.id)}
            aria-label={`Go to ${s.label}`}
            aria-current={i === active ? "step" : undefined}
            className="group absolute -left-[5px] grid h-[11px] w-[11px] place-items-center rounded-full border-2 border-ink/40 bg-board transition data-[on=true]:border-teal-ink data-[on=true]:bg-teal"
            data-on={i <= active}
            style={{ top: `calc(${(i / (STOPS.length - 1)) * 100}% - 5px)` }}
          >
            <span className="pointer-events-none absolute left-5 whitespace-nowrap rounded bg-ink px-2 py-0.5 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
