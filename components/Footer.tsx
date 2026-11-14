"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

const MARKERS = ["#1a1a1a", "#1f6feb", "#d93f44", "#2f9e44", "#19c9b0"];

/** Footer as the whiteboard's marker tray. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    // desktop only: phones keep the footer static (lighter, and it can never end up hidden)
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(min-width: 1024px)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    // slides up once as it enters (not scrubbed, so it always finishes fully visible);
    // context.revert() restores inline styles on unmount/re-run
    const ctx = gsap.context(() => {
      gsap.from(el.firstElementChild, { y: 60, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 98%", once: true } });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <footer ref={root} className="relative z-10 px-4 pb-6 pt-4">
      <div className="mx-auto max-w-6xl">
        {/* aluminum tray lip */}
        <div className="board-frame h-3 rounded-t-md" />
        <div className="rounded-b-lg border border-t-0 border-ink/10 bg-[linear-gradient(180deg,#e9ebee,#dfe2e6)] px-5 py-5 shadow-[0_10px_24px_rgba(26,26,26,0.10)]">
          <div className="flex flex-col items-start justify-between gap-5 text-sm text-ink/85 sm:flex-row sm:items-center">
            <div>
              <div className="font-display text-lg font-bold text-ink">
                Overpeck<span className="text-teal-ink"> Labs</span>
              </div>
              <div>Bergen County, NJ</div>
            </div>
            <a href={`tel:${PHONE_TEL}`} className="font-semibold text-ink hover:text-teal-ink">
              {PHONE_DISPLAY}
            </a>
            {/* markers resting in the tray */}
            <div className="flex items-end gap-2" aria-hidden>
              {MARKERS.map((c, i) => (
                <span key={c} className="block h-3 rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.2)]" style={{ width: 54 - i * 3, background: `linear-gradient(90deg, ${c} 0 24%, #fafafa 24% 100%)` }} />
              ))}
              <span className="block h-4 w-9 rounded-sm bg-[#3a3a3c] shadow-[0_2px_3px_rgba(0,0,0,0.25)]" />
            </div>
          </div>
          <div className="mt-4 text-xs text-ink/75">© {new Date().getFullYear()} Overpeck Labs</div>
        </div>
      </div>
    </footer>
  );
}
