"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whenNear } from "./whenNear";

/**
 * Marker "draw-on" for line-art SVGs: every <svg class="draw-on"> inside `root`
 * draws its strokes once when scrolled into view. Reduced motion: left fully drawn.
 */
export function useDrawOn(
  root: RefObject<HTMLElement | null>,
  start = "top 85%",
) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    // set up (and measure strokes) only when the section is about a screen away
    return whenNear(el, () => {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.utils.toArray<SVGSVGElement>("svg.draw-on", el).forEach((svg) => {
          const shapes = Array.from(
            svg.querySelectorAll<SVGGeometryElement>(
              "path, circle, rect, line, polyline, ellipse",
            ),
          );
          shapes.forEach((s) => {
            const len = s.getTotalLength();
            s.style.strokeDasharray = `${len}`;
            s.style.strokeDashoffset = `${len}`;
          });
          gsap.to(shapes, {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: "power1.inOut",
            stagger: 0.12,
            scrollTrigger: { trigger: svg, start, once: true },
          });
        });
      }, el);
      return () => ctx.revert();
    });
  }, [root, start]);
}
