"use client";

import { useState } from "react";
import DemoImage, { type DemoPhoto } from "@/components/demos/motion/DemoImage";

/** Before/after comparison: drag (or use arrow keys on) the handle. Fixed aspect box, so no layout shift. */
export default function BeforeAfter({ before, after, className = "" }: { before: DemoPhoto; after: DemoPhoto; className?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className={`relative select-none overflow-hidden ${className}`}>
      <DemoImage photo={after} className="absolute inset-0" sizes="(min-width: 1024px) 55vw, 100vw" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <DemoImage photo={before} className="absolute inset-0" imgClassName="object-cover saturate-[0.85]" sizes="(min-width: 1024px) 55vw, 100vw" />
      </div>
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">Before</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#22d3ee]/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-950">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ left: `${pos}%` }} aria-hidden>
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/25 text-white shadow-lg backdrop-blur-md">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <label className="sr-only" htmlFor="op-before-after">
        Compare before and after
      </label>
      <input
        id="op-before-after"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
