"use client";

import { useEffect, useState } from "react";
import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";
import { clamp, ease, journey, subscribe } from "@/lib/journey";

// EXAMPLE numbers for illustration only. They are not client results.
const EXAMPLES = [
  { label: "New leads", end: 120 },
  { label: "Booked jobs", end: 34 },
  { label: "Missed calls followed up", end: 41 },
];

export default function LeadGen() {
  const [vals, setVals] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const update = () => {
      const t = journey.reduced ? 1 : ease(clamp((journey.p[2] - 0.12) / 0.55));
      const next = EXAMPLES.map((e) => Math.round(e.end * t));
      setVals((prev) => (prev.every((v, i) => v === next[i]) ? prev : next));
    };
    update();
    return subscribe(update);
  }, []);

  return (
    <Chapter index={2} id="leads" className="items-start sm:items-center">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:pt-0">
        <ChapterCopy
          kicker="02 · Lead generation"
          title={<>Turn local searches into booked jobs.</>}
          points={[
            "Local landing pages and ads aimed at people ready to hire",
            "Every call, form and text tracked back to where it came from",
            "Fast follow-up so leads don't go cold",
          ]}
        >
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            {EXAMPLES.map((e, i) => (
              <div key={e.label} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <div className="font-display text-2xl font-bold tabular-nums text-gradient sm:text-3xl">{vals[i]}</div>
                <div className="mt-1 text-[11px] leading-tight text-white/60">{e.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-violet">Example numbers · illustration only, not client results</p>
        </ChapterCopy>
      </div>
    </Chapter>
  );
}
