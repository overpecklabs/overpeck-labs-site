"use client";

import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ease, journey } from "@/lib/journey";

/** Glowing, morphing core + a low-poly "skyline" that grows as you scroll. */
export default function HeroObject({ low }: { low: boolean }) {
  const core = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const mat = useRef<{ distort: number }>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const city = useRef<THREE.InstancedMesh>(null);

  const buildings = useMemo(() => {
    const n = low ? 20 : 36;
    // deterministic pseudo-random so SSR/CSR never disagree
    const r = (i: number, s: number) => {
      const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: n }, (_, i) => ({
      x: (i / (n - 1) - 0.5) * 30,
      z: -9 - r(i, 1) * 5,
      w: 0.6 + r(i, 2) * 0.7,
      h: 1.5 + r(i, 3) * 4.5,
    }));
  }, [low]);

  useLayoutEffect(() => {
    const mesh = city.current;
    if (!mesh) return;
    const col = new THREE.Color();
    buildings.forEach((_, i) => {
      col.set(i % 3 === 0 ? "#9b6bff" : "#19f0d2").multiplyScalar(0.55);
      mesh.setColorAt(i, col);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [buildings]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const p = journey.p[0];
    const m = journey.reduced ? 0 : 1;
    const t = clock.elapsedTime * m;
    if (core.current) {
      core.current.rotation.y = t * 0.25 + p * Math.PI * 2;
      core.current.rotation.x = Math.sin(t * 0.3) * 0.2 + p * 1.2;
      const s = 1.5 - 0.35 * ease(p);
      core.current.scale.setScalar(s);
    }
    if (wire.current) {
      wire.current.rotation.y = -t * 0.18 - p * 2;
      wire.current.rotation.z = t * 0.1 + p;
      wire.current.scale.setScalar(2.15 + p * 0.5);
    }
    if (mat.current) mat.current.distort = 0.22 + ease(p) * 0.5;
    if (ringA.current) {
      ringA.current.rotation.x = Math.PI / 2.4 + t * 0.2 + p * 2;
      ringA.current.rotation.y = t * 0.15;
    }
    if (ringB.current) {
      ringB.current.rotation.x = Math.PI / 1.8 - t * 0.15;
      ringB.current.rotation.z = t * 0.1 + p * 3;
    }
    const mesh = city.current;
    if (mesh) {
      const grow = 0.25 + 1.1 * ease(Math.min(1, p * 1.4));
      buildings.forEach((b, i) => {
        const h = b.h * grow;
        dummy.position.set(b.x, -4 + h / 2, b.z);
        dummy.scale.set(b.w, h, b.w);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  const detail = low ? 2 : 4;

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1, detail]} />
        <MeshDistortMaterial
          ref={mat as never}
          color="#12304a"
          emissive="#0b7f73"
          emissiveIntensity={0.35}
          roughness={0.3}
          metalness={0.6}
          distort={0.22}
          speed={journey.reduced ? 0 : 1.6}
          flatShading
        />
      </mesh>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#9b6bff" wireframe transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[2.9, 0.014, 8, low ? 64 : 128]} />
        <meshBasicMaterial color="#19f0d2" toneMapped={false} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[3.4, 0.01, 8, low ? 64 : 128]} />
        <meshBasicMaterial color="#9b6bff" toneMapped={false} />
      </mesh>

      <instancedMesh ref={city} args={[undefined, undefined, buildings.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0a1226" emissive="#3b4aa8" emissiveIntensity={0.25} roughness={0.6} metalness={0.3} />
      </instancedMesh>
    </group>
  );
}
