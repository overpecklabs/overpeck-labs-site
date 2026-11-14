"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp, ease, journey } from "@/lib/journey";

const CH = 2;
const TOP = 4;
const THROAT = -1;
const BOTTOM = -4.2;
const TEAL = new THREE.Color("#19f0d2");

/** Leads (violet) fall into a funnel and exit the throat as booked jobs (teal). */
export default function Funnel({ low }: { low: boolean }) {
  const N = low ? 140 : 380;
  const inst = useRef<THREE.InstancedMesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const slots = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const seeds = useMemo(() => {
    const r = (i: number, s: number) => {
      const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: N }, (_, i) => ({
      off: r(i, 1),
      ang: r(i, 2) * Math.PI * 2,
      rad: 0.35 + r(i, 3) * 0.65,
      spd: 0.8 + r(i, 4) * 0.5,
      spin: 1.5 + r(i, 5) * 2,
    }));
  }, [N]);

  useLayoutEffect(() => {
    const m = inst.current;
    if (!m) return;
    seeds.forEach((_, i) => m.setColorAt(i, color.set("#9b6bff")));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [seeds, color]);

  useFrame(({ clock }) => {
    const p = journey.p[CH];
    const t = journey.reduced ? 12 + p * 6 : clock.elapsedTime * 0.12;
    // lead volume ramps up as the chapter plays
    const live = Math.floor(N * clamp(0.12 + ease(clamp(p / 0.4)) * 0.88));
    const m = inst.current;
    if (!m) return;
    for (let i = 0; i < N; i++) {
      const s = seeds[i];
      if (i >= live) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        continue;
      }
      const u = (t * s.spd + s.off) % 1; // 0..1 lifecycle
      const split = 0.62;
      let x: number, y: number, z: number, scale: number;
      if (u < split) {
        const k = u / split;
        y = TOP + (THROAT - TOP) * k;
        const shellR = 3.2 + (0.45 - 3.2) * k; // funnel radius at this height
        const r = shellR * s.rad * (1 - k * 0.2);
        const a = s.ang + k * s.spin;
        x = Math.cos(a) * r;
        z = Math.sin(a) * r;
        scale = 0.07 + 0.03 * k;
        color.set("#9b6bff").lerp(TEAL, Math.pow(k, 3));
      } else {
        const k = (u - split) / (1 - split);
        y = THROAT + (BOTTOM - THROAT) * k;
        const a = s.ang + k * 4;
        x = Math.cos(a) * 0.25 * (1 - k);
        z = Math.sin(a) * 0.25 * (1 - k);
        scale = 0.13;
        color.set("#19f0d2");
      }
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(scale);
      dummy.rotation.set(u * 6, u * 4, 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    if (ringRef.current) ringRef.current.rotation.z = journey.reduced ? 0 : clock.elapsedTime * 0.8;
    if (slots.current) {
      const shown = Math.floor(clamp((p - 0.15) / 0.6) * slots.current.children.length + 0.001);
      slots.current.children.forEach((c, i) => {
        const on = i < shown;
        const target = on ? 1 : 0.0001;
        c.scale.setScalar(THREE.MathUtils.lerp(c.scale.x, target, 0.15));
      });
    }
  });

  return (
    <group scale={0.42} position={[0, 0.9, 0]}>
      {/* funnel shell */}
      <mesh position={[0, (TOP + THROAT) / 2, 0]}>
        <cylinderGeometry args={[3.3, 0.5, TOP - THROAT, low ? 20 : 36, 1, true]} />
        <meshBasicMaterial color="#19f0d2" wireframe transparent opacity={0.28} toneMapped={false} />
      </mesh>
      <mesh position={[0, (TOP + THROAT) / 2, 0]}>
        <cylinderGeometry args={[3.28, 0.48, TOP - THROAT, low ? 20 : 36, 1, true]} />
        <meshBasicMaterial color="#9b6bff" transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} position={[0, THROAT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.03, 8, 48]} />
        <meshBasicMaterial color="#19f0d2" toneMapped={false} />
      </mesh>

      {/* booked-job calendar tiles stacking up below the throat */}
      <group ref={slots} position={[0, BOTTOM - 0.45, 0]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[(i % 3 - 1) * 0.95, Math.floor(i / 3) * 0.6, 0]} scale={0.0001}>
            <boxGeometry args={[0.85, 0.45, 0.12]} />
            <meshBasicMaterial color={i % 2 ? "#19f0d2" : "#7be9ff"} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <instancedMesh ref={inst} args={[undefined, undefined, N]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
