/**
 * Continuous-handoff scroll: shared helpers.
 * Sections mark where their 3D piece lives with data-anchor="name" placeholders; the fixed
 * canvas reads those rects every frame and maps them onto the z=0 plane, so the liquid
 * stream and set-pieces sit exactly on their sections (and stay responsive).
 */

let cache = new Map<string, HTMLElement[]>();
let cachedAt = 0;

function refresh() {
  cache = new Map();
  document.querySelectorAll<HTMLElement>("[data-anchor]").forEach((el) => {
    const k = el.dataset.anchor!;
    if (!cache.has(k)) cache.set(k, []);
    cache.get(k)!.push(el);
  });
  cachedAt = performance.now();
}

/** Rect of the first visible element with data-anchor=name (null if none on screen layout). */
export function anchorRect(name: string): DOMRect | null {
  if (performance.now() - cachedAt > 1000) refresh();
  const els = cache.get(name);
  if (!els) return null;
  for (const el of els) {
    if (!el.isConnected) {
      refresh();
      return anchorRect(name);
    }
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return r;
  }
  return null;
}

/** Set a CSS custom property on every element with data-anchor=name (DOM responders). */
export function setAnchorVar(name: string, prop: string, value: string) {
  if (performance.now() - cachedAt > 1000) refresh();
  cache.get(name)?.forEach((el) => {
    if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
  });
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
