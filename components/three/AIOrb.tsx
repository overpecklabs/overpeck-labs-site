"use client";

import { useFrame } from "@react-three/fiber";
import { Edges, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { journey } from "@/lib/journey";

// Ball-and-stick molecule: one atom per service (Websites, Automation, Optimize, AI) around a core.
const ATOMS: { pos: [number, number, number]; color: string; r: number }[] = [
  { pos: [0, 0, 0], color: "#fffefb", r: 0.62 },
  { pos: [1.7, 0.9, 0.4], color: "#19f0d2", r: 0.42 },
  { pos: [-1.6, 1.0, -0.5], color: "#5b9cf5", r: 0.42 },
  { pos: [-0.9, -1.5, 0.8], color: "#4caf6e", r: 0.42 },
  { pos: [1.1, -1.3, -0.9], color: "#f2a93b", r: 0.42 },
];

const BUBBLES = [
  { a: 0.0, y: 1.6, c: "#c8f5ec", w: 1.6 },
  { a: 1.6, y: 0.4, c: "#dbe8ff", w: 1.2 },
  { a: 3.1, y: -0.9, c: "#dcf3df", w: 1.6 },
  { a: 4.6, y: 1.0, c: "#fde9c4", w: 1.3 },
];

/** AI chapter set-piece: a slowly turning molecule with chat "message cards" orbiting it. */
export default function AIOrb({ low }: { low: boolean }) {
  const mol = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);

  const bonds = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    return ATOMS.slice(1).map((a) => {
      const end = new THREE.Vector3(...a.pos);
      const len = end.length();
      const q = new THREE.Quaternion().setFromUnitVectors(up, end.clone().normalize());
      return { mid: end.clone().multiplyScalar(0.5), len, q };
    });
  }, []);

  useFrame(({ clock }) => {
    const p = journey.p[4];
    const t = journey.reduced ? 0 : clock.elapsedTime;
    if (mol.current) {
      mol.current.rotation.y = t * 0.3 + p * 3;
      mol.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
    if (orbit.current) orbit.current.rotation.y = t * 0.2 + p * 2;
  });

  const seg = low ? 16 : 28;

  return (
    <group scale={0.55} position={[0, 0.3, -9]}>
      <group ref={mol}>
        {bonds.map((b, i) => (
          <mesh key={i} position={b.mid} quaternion={b.q}>
            <cylinderGeometry args={[0.07, 0.07, b.len, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
        ))}
        {ATOMS.map((a, i) => (
          <mesh key={i} position={a.pos}>
            <sphereGeometry args={[a.r, seg, seg]} />
            <meshStandardMaterial color={a.color} roughness={0.45} />
          </mesh>
        ))}
      </group>
      <group ref={orbit}>
        {BUBBLES.map((b, i) => (
          <group key={i} position={[Math.cos(b.a) * 4.4, b.y, Math.sin(b.a) * 4.4]} rotation={[0, -b.a + Math.PI / 2, 0]}>
            <RoundedBox args={[b.w, 0.5, 0.06]} radius={0.12} smoothness={low ? 2 : 4}>
              <meshStandardMaterial color={b.c} roughness={0.9} />
              <Edges color="#1a1a1a" threshold={30} />
            </RoundedBox>
          </group>
        ))}
      </group>
    </group>
  );
}
