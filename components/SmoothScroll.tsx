"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "@/lib/journey";

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    journey.reduced = mq.matches;
    const onMq = () => (journey.reduced = mq.matches);
    mq.addEventListener("change", onMq);

    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    if (!mq.matches) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      journey.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      journey.lenis = null;
    };
  }, []);
  return null;
}
