"use client";

import { useRef } from "react";
import { useDrawOn } from "@/lib/useDrawOn";
import ElementBadge from "../ElementBadge";

// Marker line art per service; draws itself in when it enters view (static with reduced motion).
const ART: Record<string, { color: string; paths: string[]; label: string }> = {
  websites: {
    color: "#0f766e",
    label: "your new site",
    paths: ["M30 40 H290 V220 H30 Z", "M30 70 H290", "M50 100 H150 M50 122 H130 M50 144 H110", "M180 96 H270 V170 H180 Z M180 96 L270 170 M270 96 L180 170", "M50 176 H118 V198 H50 Z"],
  },
  "workflows-automation": {
    color: "#1f6feb",
    label: "runs on its own",
    paths: ["M40 60 H120 V96 H40 Z", "M40 130 H120 V166 H40 Z", "M40 200 H120 V236 H40 Z", "M120 78 C160 78 160 148 196 148 M120 148 H196 M120 218 C160 218 160 148 196 148", "M232 148 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0", "M266 148 H300 M290 140 L302 148 L290 156"],
  },
  "track-optimize": {
    color: "#237a34",
    label: "watch it climb",
    paths: ["M40 30 V230 H300", "M50 200 L110 170 L150 182 L210 120 L280 70", "M262 66 H282 V86", "M70 230 V210 M130 230 V196 M190 230 V170 M250 230 V140", "M232 96 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0 M248 112 L268 132"],
  },
  ai: {
    color: "#a15c00",
    label: "picks up when you can't",
    paths: ["M40 50 H220 V130 H110 L80 156 V130 H40 Z", "M60 80 H200 M60 102 H160", "M200 160 H290 V230 H230 L214 246 V230 H200 Z", "M218 186 H272 M218 206 H252", "M260 40 C270 30 286 30 296 40 M266 52 C272 46 282 46 288 52"],
  },
};

export default function ServiceDoodle({ slug, num, sym, name, bg }: { slug: string; num: string; sym: string; name: string; bg: string }) {
  const root = useRef<HTMLDivElement>(null);
  useDrawOn(root, "top 95%");
  const a = ART[slug];
  return (
    <div ref={root} className="paper tilt-r relative mx-auto max-w-md rounded-md p-6">
      <span className="tape" />
      <div className="absolute -left-4 -top-6 rotate-[-6deg]">
        <ElementBadge num={num} symbol={sym} name={name} bg={bg} size="lg" />
      </div>
      <svg viewBox="0 0 320 260" className="draw-on h-auto w-full" fill="none" stroke={a.color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {a.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <p className="font-marker -mt-2 text-right text-xl" style={{ color: a.color }} aria-hidden>
        {a.label}
      </p>
    </div>
  );
}
