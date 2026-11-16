"use client";

import { useEffect, useId, useRef, useState } from "react";
import DemoImage, { type DemoPhoto } from "@/components/demos/motion/DemoImage";

type Pair = { label: string; before: DemoPhoto; after: DemoPhoto };

/**
 * Before/after slider with tabs for several pairs (driveway, roof, siding). The handle is a squeegee; while you
 * drag, a short water-spray shimmer runs along the divider. Drag, or focus it and use the arrow keys.
 * Fixed aspect box; the divider moves with transform-free left/clip only on interaction, so there's no layout shift.
 */
export default function BeforeAfter({ pairs, accent }: { pairs: Pair[]; accent: string }) {
  const uid = useId();
  const [tab, setTab] = useState(0);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pair = pairs[tab];

  const wet = () => {
    setDragging(true);
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => setDragging(false), 450);
  };
  useEffect(() => () => void (idle.current && clearTimeout(idle.current)), []);

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
        <span className="pointer-events-none absolute left-3 top-3 z-[1] rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">Before</span>
        <span className="pointer-events-none absolute right-3 top-3 z-[1] rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-950" style={{ background: accent }}>
          After
        </span>

        <label className="sr-only" htmlFor={`${uid}-range`}>
          Compare before and after: {pair.label}
        </label>
        <input
          id={`${uid}-range`}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => {
            setPos(Number(e.target.value));
            wet();
          }}
          onPointerDown={wet}
          className="peer absolute inset-0 z-[3] h-full w-full cursor-ew-resize opacity-0"
        />

        {/* squeegee: rubber blade along the divider + a handle in the middle */}
        <div className="pointer-events-none absolute inset-y-0 z-[2] w-0 peer-focus-visible:[&_.oe-grip]:ring-4 peer-focus-visible:[&_.oe-grip]:ring-white" style={{ left: `${pos}%` }} aria-hidden>
          <div className="absolute inset-y-0 -left-[4px] w-2 bg-[#0b2f36] shadow-[0_0_14px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-y-0 left-0.5 w-[2px] bg-[#34d399]/80" />
          </div>
          <div className={`absolute inset-y-0 left-1 w-2 overflow-hidden transition-opacity duration-200 motion-reduce:hidden ${dragging ? "opacity-100" : "opacity-0"}`}>
            <div className="oe-spray absolute -top-8 bottom-0 w-full" />
          </div>
          <div className="oe-grip absolute left-1 top-1/2 flex h-7 w-16 -translate-y-1/2 items-center gap-1 rounded-r-full rounded-l-md bg-gradient-to-r from-[#0e7490] to-[#22b8a8] pl-2 shadow-lg">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-3.5 w-[3px] rounded-full bg-white/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
