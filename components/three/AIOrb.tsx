"use client";

import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { journey } from "@/lib/journey";

const BUBBLES = [
  { a: 0.0, y: 1.6, c: "#19f0d2", w: 1.6 },
  { a: 1.1, y: 0.6, c: "#9b6bff", w: 1.2 },
  { a: 2.2, y: -0.5, c: "#19f0d2", w: 1.8 },
  { a: 3.3, y: 1.1, c: "#9b6bff", w: 1.4 },
  { a: 4.4, y: -1.4, c: "#19f0d2", w: 1.2 },
  { a: 5.4, y: 0.1, c: "#9b6bff", w: 1.6 },
];

/** An AI "brain" orb with message bubbles orbiting it. */
export default function AIOrb({ low }: { low: boolean }) {
  const orb = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const p = journey.p[4];
    const t = journey.reduced ? 0 : clock.elapsedTime;
    if (orb.current) {
      orb.current.rotation.y = t * 0.3 + p * 3;
      orb.current.rotation.x = t * 0.15;
      orb.current.scale.setScalar(1.7 + Math.sin(t * 1.5) * 0.04);
    }
    if (orbit.current) orbit.current.rotation.y = t * 0.25 + p * 2;
  });

  return (
    <group scale={0.5} position={[0, 0.3, -9]}>
      <mesh ref={orb}>
        <icosahedronGeometry args={[1, low ? 1 : 2]} />
        <meshStandardMaterial color="#0d1b2a" emissive="#9b6bff" emissiveIntensity={0.7} metalness={0.8} roughness={0.25} flatShading />
      </mesh>
      <mesh scale={2.6}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#19f0d2" wireframe transparent opacity={0.25} toneMapped={false} />
      </mesh>
      <group ref={orbit}>
        {BUBBLES.map((b, i) => (
          <group key={i} position={[Math.cos(b.a) * 4.2, b.y, Math.sin(b.a) * 4.2]} rotation={[0, -b.a + Math.PI / 2, 0]}>
            <RoundedBox args={[b.w, 0.5, 0.06]} radius={0.12} smoothness={low ? 2 : 4}>
              <meshBasicMaterial color={b.c} transparent opacity={0.55} toneMapped={false} />
            </RoundedBox>
          </group>
        ))}
      </group>
    </group>
  );
}
