"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { SPACING, clamp, ease, journey, lerp } from "@/lib/journey";

/**
 * Flies the camera forward through the four set-pieces.
 * Each chapter: dwell (slow drift) for the first 65%, then travel to the next.
 * Also carries two coloured lights so the scene needs no per-object lights.
 */
export default function CameraRig() {
  const { camera, size } = useThree();
  const lights = useRef<Group>(null);
  const cur = useRef({ x: 0, y: 0, z: 7 });

  useFrame((_, delta) => {
    const p = journey.p;
    const aspect = size.width / size.height;
    const portrait = aspect < 0.95;

    let z = 7;
    let sway = 0;
    for (let k = 0; k < 5; k++) {
      if (k < 4) z -= (SPACING - 1.5) * ease(clamp((p[k] - 0.65) / 0.35));
      z -= 1.5 * clamp(p[k] / 0.65);
      sway += Math.sin(p[k] * Math.PI) * 0.7 * (k % 2 ? -1 : 1);
    }

    // Layout: copy on the left, 3D on the right (desktop); 3D lower half (portrait).
    const toAI = ease(clamp((p[3] - 0.65) / 0.35));
    const ox = portrait ? 0 : 2.3 * (1 - toAI);
    // portrait: hero object sits low, under the headline; later pieces in the lower half
    const leaveHero = ease(clamp((p[0] - 0.65) / 0.35));
    const oy = portrait ? lerp(3.8, 1.5, leaveHero) : 0;
    const extra = portrait ? 3 + (1 / aspect - 1) * 2.2 : 0;

    const tx = sway - ox;
    const ty = oy;
    const tz = z + extra;

    const k = journey.reduced ? 1 : 1 - Math.exp(-delta * 5);
    const c = cur.current;
    c.x = lerp(c.x, tx, k);
    c.y = lerp(c.y, ty, k);
    c.z = lerp(c.z, tz, k);
    camera.position.set(c.x, c.y, c.z);

    if (lights.current) lights.current.position.set(c.x, c.y, c.z);
  });

  return (
    <group ref={lights}>
      <pointLight color="#ffffff" intensity={70} distance={30} position={[-4, 4, 3]} />
      <pointLight color="#fff7e8" intensity={40} distance={30} position={[4, -2, 4]} />
    </group>
  );
}
