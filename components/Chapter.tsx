"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp, ease, journey, setProgress } from "@/lib/journey";

type Props = {
  index: number;
  id?: string;
  /** scroll length of the chapter, in viewport heights */
  length?: number;
  fadeIn?: boolean;
  fadeOutAt?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * A pinned chapter: a tall section with a sticky 100vh stage inside.
 * Its scroll progress drives the shared 3D scene (see lib/journey.ts).
 */
export default function Chapter({ index, id, length = 3, fadeIn = true, fadeOutAt = 0.8, className = "", children }: Props) {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(index, p);
        const el = content.current;
        if (!el) return;
        const a = fadeIn ? ease(clamp(p / 0.12)) : 1;
        const b = 1 - ease(clamp((p - fadeOutAt) / (1 - fadeOutAt)));
        el.style.opacity = String(a * b);
        if (!journey.reduced) el.style.transform = `translate3d(0, ${(1 - a) * 30 - (1 - b) * 30}px, 0)`;
      },
    });
    return () => st.kill();
  }, [index, fadeIn, fadeOutAt]);

  return (
    <section ref={root} id={id} data-chapter={index} style={{ height: `${length * 100}vh` }} className="relative">
      <div className={`sticky top-0 flex h-screen items-center overflow-hidden ${className}`}>
        <div ref={content} className="w-full will-change-[opacity,transform]">
          {children}
        </div>
      </div>
    </section>
  );
}
