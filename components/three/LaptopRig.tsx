"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { clamp, ease, journey, lerp } from "@/lib/journey";
import FlyIn from "./FlyIn";

const CH = 1;

// Sample-site layout in laptop-lid space. Purely decorative placeholder UI.
const LAPTOP_PANELS: { to: [number, number, number]; size: [number, number]; color: string }[] = [
  { to: [0, 1.85, 0.05], size: [2.8, 0.18], color: "#19c9b0" },
  { to: [-1.25, 1.85, 0.06], size: [0.14, 0.14], color: "#d93f44" },
  { to: [-0.55, 1.5, 0.05], size: [1.6, 0.2], color: "#1a1a1a" },
  { to: [-0.75, 1.2, 0.05], size: [1.2, 0.16], color: "#6b7280" },
  { to: [-0.7, 0.98, 0.05], size: [1.3, 0.07], color: "#9ca3af" },
  { to: [-1.0, 0.72, 0.05], size: [0.75, 0.2], color: "#19c9b0" },
  { to: [0.85, 1.2, 0.05], size: [1.05, 1.0], color: "#8ab4f8" },
  { to: [-0.95, 0.28, 0.05], size: [0.85, 0.5], color: "#e5e9f0" },
  { to: [0, 0.28, 0.05], size: [0.85, 0.5], color: "#e5e9f0" },
  { to: [0.95, 0.28, 0.05], size: [0.85, 0.5], color: "#e5e9f0" },
];

const PHONE_PANELS: { to: [number, number, number]; size: [number, number]; color: string }[] = [
  { to: [0, 0.78, 0.05], size: [0.75, 0.14], color: "#19c9b0" },
  { to: [0, 0.4, 0.05], size: [0.7, 0.4], color: "#8ab4f8" },
  { to: [0, -0.02, 0.05], size: [0.7, 0.14], color: "#1a1a1a" },
  { to: [0, -0.3, 0.05], size: [0.7, 0.22], color: "#19c9b0" },
  { to: [0, -0.68, 0.05], size: [0.7, 0.3], color: "#e5e9f0" },
];

export default function LaptopRig({ low }: { low: boolean }) {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const p = journey.p[CH];
    const t = journey.reduced ? 0 : clock.elapsedTime;
    if (root.current) {
      root.current.rotation.y = lerp(-0.6, 0.25, p) + Math.sin(t * 0.4) * 0.05;
      root.current.position.y = -0.9 + Math.sin(t * 0.8) * 0.06;
    }
    if (lid.current) lid.current.rotation.x = lerp(Math.PI / 2, -0.2, ease(clamp(p / 0.12)));
    if (phone.current) {
      const s = ease(clamp((p - 0.4) / 0.2));
      phone.current.scale.setScalar(Math.max(0.0001, s));
      phone.current.rotation.y = -0.5 + Math.sin(t * 0.5) * 0.06;
    }
    if (ring.current) ring.current.rotation.z = t * 0.3;
  });

  return (
    <group ref={root} scale={0.72} position={[-0.6, 0, 0]}>
      {/* base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.12, 2.2]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.95} />
          <Edges color="#1a1a1a" threshold={20} />
      </mesh>
      <mesh position={[0, 0.065, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 1.0]} />
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.07} toneMapped={false} />
      </mesh>

      {/* lid, hinged at the back edge */}
      <group ref={lid} position={[0, 0.06, -1.05]}>
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[3.2, 2.1, 0.07]} />
          <meshStandardMaterial color="#fbfaf6" roughness={0.95} />
          <Edges color="#1a1a1a" threshold={20} />
        </mesh>
        <mesh position={[0, 1.05, 0.04]}>
          <planeGeometry args={[3.0, 1.9]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {LAPTOP_PANELS.map((pn, i) => (
          <FlyIn key={i} chapter={CH} range={[0.1 + i * 0.035, 0.3 + i * 0.035]} to={pn.to} size={pn.size} color={pn.color} seed={i} />
        ))}
      </group>

      {/* phone */}
      <group ref={phone} position={[2.9, 0.95, 0.4]}>
        <mesh>
          <boxGeometry args={[0.95, 1.9, 0.09]} />
          <meshStandardMaterial color="#fbfaf6" roughness={0.95} />
          <Edges color="#1a1a1a" threshold={20} />
        </mesh>
        <mesh position={[0, 0, 0.047]}>
          <planeGeometry args={[0.85, 1.8]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {PHONE_PANELS.map((pn, i) => (
          <FlyIn key={i} chapter={CH} range={[0.45 + i * 0.05, 0.65 + i * 0.05]} to={pn.to} size={pn.size} color={pn.color} seed={20 + i} />
        ))}
      </group>

      {/* glow ring under the device */}
      <mesh ref={ring} position={[0.9, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.04, low ? 48 : 96]} />
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.45} toneMapped={false} />
      </mesh>
    </group>
  );
}
