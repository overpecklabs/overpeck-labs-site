"use client";

import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp, ease, journey } from "@/lib/journey";
import Label from "./Label";

const CH = 3;
const BARS = 7;
const LINE_PTS = 40;

function makeLine(n: number, color: string) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  return new THREE.Line(g, new THREE.LineBasicMaterial({ color, toneMapped: false }));
}

/** A floating monitoring dashboard with live-moving EXAMPLE charts. */
export default function Dashboard({ low }: { low: boolean }) {
  const root = useRef<THREE.Group>(null);
  const bars = useRef<(THREE.Mesh | null)[]>([]);
  const dot = useRef<THREE.Mesh>(null);
  const alert = useRef<THREE.Group>(null);
  const rank = useMemo(() => makeLine(LINE_PTS, "#19f0d2"), []);
  const pulse = useMemo(() => makeLine(60, "#5dff9e"), []);

  useFrame(({ clock }) => {
    const p = journey.p[CH];
    const t = journey.reduced ? 2 : clock.elapsedTime;
    const grow = ease(clamp((p - 0.05) / 0.3));

    if (root.current) {
      root.current.rotation.y = -0.3 + p * 0.3 + (journey.reduced ? 0 : Math.sin(t * 0.4) * 0.04);
      root.current.rotation.x = -0.06;
      root.current.position.y = journey.reduced ? 0 : Math.sin(t * 0.7) * 0.06;
    }

    bars.current.forEach((b, i) => {
      if (!b) return;
      const h = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.1 + i * 1.3)) * (0.5 + i / BARS)) * 1.3 * grow + 0.001;
      b.scale.y = h;
      b.position.y = -1.45 + h / 2;
    });

    // rankings line: scrolling noisy upward trend
    const pos = rank.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < LINE_PTS; i++) {
      const u = i / (LINE_PTS - 1);
      const x = 0.25 + u * 2.4;
      const y = -1.4 + (0.25 + u * 0.9 + Math.sin(u * 9 + t * 1.5) * 0.12 + Math.sin(u * 23 - t * 2.2) * 0.05) * grow;
      pos.setXYZ(i, x, y, 0.06);
    }
    pos.needsUpdate = true;

    // uptime heartbeat
    const pp = pulse.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < 60; i++) {
      const u = i / 59;
      const phase = (u * 2 - t * 0.6) % 1;
      const ph = phase < 0 ? phase + 1 : phase;
      const spike = ph > 0.45 && ph < 0.55 ? Math.sin(((ph - 0.45) / 0.1) * Math.PI * 2) * 0.22 : 0;
      pp.setXYZ(i, 0.25 + u * 2.4, 0.95 + spike, 0.06);
    }
    pp.needsUpdate = true;

    if (dot.current) dot.current.scale.setScalar(1 + (journey.reduced ? 0 : Math.sin(t * 4) * 0.25));

    if (alert.current) {
      const a = ease(clamp((p - 0.45) / 0.12));
      const bob = journey.reduced ? 0 : Math.sin(t * 2) * 0.05;
      alert.current.scale.setScalar(Math.max(0.0001, a));
      alert.current.position.set(0.9, 2.0 + bob, 0.5);
    }
  });

  return (
    <group scale={0.56} position={[-0.9, -0.1, 0]}>
      <group ref={root}>
        <RoundedBox args={[6.2, 4.0, 0.12]} radius={0.15} smoothness={low ? 2 : 4} position={[0, 0, -0.08]}>
          <meshStandardMaterial color="#0b1226" transparent opacity={0.82} metalness={0.4} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[6.0, 3.8]} />
          <meshBasicMaterial color="#19f0d2" wireframe transparent opacity={0.04} toneMapped={false} />
        </mesh>

        <Label text="Example dashboard · sample data" position={[-1.45, 1.6, 0.06]} height={0.26} style={{ border: "rgba(255,255,255,0.2)" }} />

        {/* Calls & forms bar chart */}
        <Label text="Calls & forms (example)" position={[-1.6, 0.55, 0.06]} height={0.22} style={{ border: "rgba(155,107,255,0.6)" }} />
        {Array.from({ length: BARS }, (_, i) => (
          <mesh key={i} ref={(m) => { bars.current[i] = m; }} position={[-2.65 + i * 0.36, -1.45, 0.05]}>
            <boxGeometry args={[0.22, 1, 0.08]} />
            <meshBasicMaterial color={i % 2 ? "#9b6bff" : "#19f0d2"} toneMapped={false} />
          </mesh>
        ))}

        {/* Rankings line chart */}
        <Label text="Search rankings (example)" position={[1.45, 0.55, 0.06]} height={0.22} />
        <primitive object={rank} />

        {/* Uptime pulse */}
        <Label text="Site uptime (example)" position={[1.0, 1.35, 0.06]} height={0.22} style={{ border: "rgba(93,255,158,0.6)" }} />
        <primitive object={pulse} />
        <mesh ref={dot} position={[2.55, 1.35, 0.08]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#5dff9e" toneMapped={false} />
        </mesh>

        {/* opportunity alert */}
        <group ref={alert} scale={0.0001}>
          <Label text="● New opportunity found (example)" height={0.34} style={{ bg: "rgba(70,35,140,0.95)", border: "rgba(190,160,255,1)", color: "#fff" }} />
          <Label text="More “water heater repair” searches nearby" position={[0, -0.36, 0]} height={0.24} style={{ bg: "rgba(10,14,30,0.9)", border: "rgba(155,107,255,0.6)", color: "#cfd5ee" }} />
        </group>
      </group>
    </group>
  );
}
