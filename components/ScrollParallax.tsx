"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lightweight image-only parallax (no animation library): same look as the demos' <Parallax>.
 * A fixed-size box whose inner layer (taller by `amount`% on each side) drifts as the box crosses the viewport,
 * -amp/2..+amp/2 of the box height; halved under 768px, off with reduced motion. Only listens to scroll while the
 * box is near the viewport, and only writes a transform.
 */
export default function ScrollParallax({ children, className = "", amount = 10 }: { children: ReactNode; className?: string; amount?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    const inner = layer.current;
    if (!el || !inner) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    let raf = 0;
    let near = false;
    const update = () => {
      raf = 0;
      if (reduce.matches) {
        inner.style.transform = "";
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))); // 0 = top at viewport bottom, 1 = bottom at viewport top
      const amp = amount * (small.matches ? 0.5 : 1);
      // (v - 0.5) * amp % of the box height (= the demos' Parallax, which moves the taller layer by a % of itself)
      inner.style.transform = `translate3d(0, ${(((v - 0.5) * amp * r.height) / 100).toFixed(2)}px, 0)`;
    };
    const queue = () => {
      if (near && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near) queue();
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    reduce.addEventListener("change", queue);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      reduce.removeEventListener("change", queue);
    };
  }, [amount]);

  return (
    <div ref={box} className={`relative overflow-hidden ${className}`}>
      <div ref={layer} className="absolute inset-x-0 will-change-transform" style={{ top: `-${amount}%`, bottom: `-${amount}%` }}>
        {children}
      </div>
    </div>
  );
}
