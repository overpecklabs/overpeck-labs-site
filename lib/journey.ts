// Shared, mutable scroll state. Read inside r3f useFrame loops (no React re-renders).
import type Lenis from "lenis";

type Listener = () => void;

export const journey = {
  /** local progress (0..1) of [hero, websites, workflows, tracking, ai] chapters.
   *  The hero is a 2D whiteboard now (not part of the 3D journey), so slot 0 is fixed at 1:
   *  the camera starts at the first 3D set-piece (the laptop). */
  p: [1, 0, 0, 0, 0] as number[],
  reduced: false,
  lenis: null as Lenis | null,
  listeners: new Set<Listener>(),
};

export function setProgress(i: number, v: number) {
  journey.p[i] = v;
  journey.listeners.forEach((l) => l());
}

export function subscribe(fn: Listener) {
  journey.listeners.add(fn);
  return () => {
    journey.listeners.delete(fn);
  };
}

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ease = (x: number) => x * x * (3 - 2 * x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (journey.lenis) journey.lenis.scrollTo(el, { offset: -20, duration: 1.6 });
  else el.scrollIntoView({ behavior: "auto", block: "start" });
}
export const SPACING = 22; // distance between chapter set-pieces along -z
