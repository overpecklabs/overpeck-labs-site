"use client";

import { useId, useState } from "react";
import DemoImage, { type DemoPhoto } from "@/components/demos/motion/DemoImage";

type Pair = { label: string; before: DemoPhoto; after: DemoPhoto };

/**
 * Before/after slider with tabs for several pairs (driveway, roof, siding). Drag the handle or use the arrow keys.
 * Fixed aspect box, clip-path only on interaction: no layout shift.
 */
export default function BeforeAfter({ pairs, accent }: { pairs: Pair[]; accent: string }) {
  const uid = useId();
  const [tab, setTab] = useState(0);
  const [pos, setPos] = useState(50);
  const pair = pairs[tab];
  return (
    <div>
      <div role="tablist" aria-label="Before and after examples" className="mx-auto flex w-fit gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur">
        {pairs.map((p, i) => (
          <button
            key={p.label}
            type="button"
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={tab === i}
            aria-controls={`${uid}-panel`}
            onClick={() => {
              setTab(i);
              setPos(50);
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === i ? "bg-[#06232a] text-white shadow" : "text-slate-600 hover:text-slate-900"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="relative mx-auto mt-6 aspect-[4/3] max-w-4xl select-none overflow-hidden rounded-3xl border border-white shadow-[0_30px_60px_-30px_rgba(6,35,42,0.55)] sm:aspect-[16/9]">
        <DemoImage key={`a-${tab}`} photo={pair.after} className="absolute inset-0" sizes="(min-width: 1024px) 896px, 100vw" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <DemoImage key={`b-${tab}`} photo={pair.before} className="absolute inset-0" sizes="(min-width: 1024px) 896px, 100vw" />
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">Before</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-950" style={{ background: accent }}>
          After
        </span>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ left: `${pos}%` }} aria-hidden>
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/30 text-white shadow-lg backdrop-blur-md">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <label className="sr-only" htmlFor={`${uid}-range`}>
          Compare before and after: {pair.label}
        </label>
        <input id={`${uid}-range`} type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
      </div>
    </div>
  );
}
