"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type From = "left" | "right" | "depth" | "tilt";

/**
 * Whiteboard-panel entrance for a section: the element marked [data-panel] slides in
 * (from a side, up from depth, or tilting toward the viewer) as the section scrolls into
 * view, scrubbed by scroll so it rewinds on the way up. Children marked [data-depth="n"]
 * get gentle parallax (n = 1..3). Phones: a light fade-up. Reduced motion: nothing moves.
 * Never pins or snaps, so long sections and forms scroll normally.
 */
export function usePanelIn(root: RefObject<HTMLElement | null>, from: From = "depth") {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const ctx = gsap.context(() => {
      const panel = el.querySelector<HTMLElement>("[data-panel]");
      if (panel) {
        const start: gsap.TweenVars = !desktop
          ? { y: 40, opacity: 0.4 }
          : from === "left"
            ? { x: -160, z: -240, rotationY: 14, opacity: 0.35 }
            : from === "right"
              ? { x: 160, z: -240, rotationY: -14, opacity: 0.35 }
              : from === "tilt"
                ? { y: 60, z: -160, rotationX: 16, opacity: 0.4 }
                : { y: 90, z: -380, rotationX: 10, opacity: 0.3 };
        gsap.fromTo(panel, { ...start, transformPerspective: 1400, transformOrigin: "50% 100%" }, {
          x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 30%", scrub: 0.6 },
        });
      }
      if (desktop) {
        gsap.utils.toArray<HTMLElement>("[data-depth]", el).forEach((d) => {
          const n = Number(d.dataset.depth) || 1;
          gsap.fromTo(d, { y: n * 26 }, { y: -n * 26, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
      }
    }, el);
    return () => ctx.revert();
  }, [root, from]);
}
