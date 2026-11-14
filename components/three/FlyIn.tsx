"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp, ease, journey } from "@/lib/journey";

type V3 = [number, number, number];

type Props = {
  /** chapter index whose progress drives this piece */
  chapter: number;
  /** progress window [start, end] in which the piece flies into place */
  range: [number, number];
  to: V3;
  size: [number, number];
  color: string;
  seed: number;
  opacity?: number;
};

/** A flat "page element" that flies from a scattered pose into its place in the layout. */
export default function FlyIn({ chapter, range, to, size, color, seed, opacity = 1 }: Props) {
  const ref = useRef<THREE.Mesh>(null);
  const from = useMemo(() => {
    const r = (s: number) => {
      const x = Math.sin((seed + 1) * 91.7 + s * 17.3) * 43758.5453;
      return (x - Math.floor(x)) * 2 - 1;
    };
    return {
      pos: new THREE.Vector3(r(1) * 4.5, r(2) * 3.2, 2.2 + Math.abs(r(3)) * 3),
      rot: new THREE.Euler(r(4) * 2, r(5) * 2, r(6) * 3),
    };
  }, [seed]);
  const target = useMemo(() => new THREE.Vector3(...to), [to]);

  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const t = ease(clamp((journey.p[chapter] - range[0]) / (range[1] - range[0])));
    m.position.lerpVectors(from.pos, target, t);
    m.rotation.set(from.rot.x * (1 - t), from.rot.y * (1 - t), from.rot.z * (1 - t));
    m.scale.setScalar(Math.max(0.0001, t));
    m.visible = t > 0.001;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={size} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} side={THREE.DoubleSide} fog={false} />
    </mesh>
  );
}
