import * as THREE from "three";
import { anchorRect } from "@/lib/handoff";

// Fixed camera; the z=0 plane maps 1:1 onto the viewport, so DOM anchors become world positions.
export const CAM_Z = 12;
export const FOV = 40;
export const HALF = Math.tan(((FOV / 2) * Math.PI) / 180) * CAM_Z;

/** Shared, per-frame motion state (scroll speed for motion blur, reduced motion, phone tier). */
export const motion = { speed: 0, reduced: false, low: false };

export function toWorld(px: number, py: number, out = new THREE.Vector3()) {
  const vw = window.innerWidth, vh = window.innerHeight;
  return out.set((px / vw * 2 - 1) * HALF * (vw / vh), (1 - (py / vh) * 2) * HALF, 0);
}
/** pixels -> world units */
export const px2w = (px: number) => (px / window.innerHeight) * 2 * HALF;

/** World point at a fractional position inside an anchor rect (fx, fy in 0..1). */
export function anchorPoint(name: string, fx = 0.5, fy = 0.5, out = new THREE.Vector3()) {
  const r = anchorRect(name);
  if (!r) return null;
  return toWorld(r.left + r.width * fx, r.top + r.height * fy, out);
}

/** Anchor's vertical position as a fraction of the viewport (0 top, 1 bottom). */
export function anchorYFrac(name: string, fy = 0.5) {
  const r = anchorRect(name);
  return r ? (r.top + r.height * fy) / window.innerHeight : null;
}

/** World y of the "liquid head" line (60% down the viewport). */
export const headY = () => (1 - 0.6 * 2) * HALF;

/**
 * Head-follow fill: the liquid has flowed to wherever the curve crosses the head line,
 * so the stream always arrives as you scroll and rewinds when you scroll back.
 */
export function headFill(curve: THREE.CatmullRomCurve3, samples = 64) {
  const y = headY();
  const p = new THREE.Vector3();
  curve.getPoint(0, p);
  if (p.y < y) return 0;
  for (let i = 1; i <= samples; i++) {
    curve.getPoint(i / samples, p);
    if (p.y < y) return (i - 0.5) / samples;
  }
  return 1;
}

/** Smooth curvy path between two points (adds two bowed control points). */
export function bowed(a: THREE.Vector3, b: THREE.Vector3, bow = 0.6) {
  const mid = a.clone().lerp(b, 0.5);
  const dx = b.x - a.x;
  const c1 = a.clone().lerp(mid, 0.6).add(new THREE.Vector3(bow * Math.sign(dx || 1), 0, 0.4));
  const c2 = mid.clone().lerp(b, 0.4).add(new THREE.Vector3(-bow * 0.6 * Math.sign(dx || 1), 0, 0.2));
  return [a, c1, c2, b];
}
