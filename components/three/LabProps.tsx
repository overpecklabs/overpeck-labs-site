"use client";

import { useMemo } from "react";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

type V3 = [number, number, number];
type Props = { position?: V3; scale?: number; liquid?: string };

// Clear "lab glass": faint fill plus an ink outline so it reads as a marker sketch on the board.
const Glass = ({ children }: { children: React.ReactNode }) => (
  <mesh>
    {children}
    <meshStandardMaterial color="#ffffff" transparent opacity={0.28} roughness={0.2} side={THREE.DoubleSide} depthWrite={false} />
    <Edges color="#1a1a1a" threshold={25} />
  </mesh>
);

const lathe = (pts: [number, number][], seg = 28) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

/** Erlenmeyer flask with a liquid fill. */
export function Flask({ position = [0, 0, 0], scale = 1, liquid = "#19f0d2" }: Props) {
  const glass = useMemo(() => lathe([[0.001, 0], [0.58, 0], [0.62, 0.06], [0.22, 0.95], [0.22, 1.35], [0.27, 1.4]]), []);
  const fill = useMemo(() => lathe([[0.001, 0.02], [0.56, 0.02], [0.6, 0.07], [0.42, 0.45], [0.001, 0.45]]), []);
  return (
    <group position={position} scale={scale}>
      <Glass>
        <primitive object={glass} attach="geometry" />
      </Glass>
      <mesh geometry={fill}>
        <meshStandardMaterial color={liquid} transparent opacity={0.75} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Graduated beaker with a liquid fill. */
export function Beaker({ position = [0, 0, 0], scale = 1, liquid = "#4caf6e" }: Props) {
  return (
    <group position={position} scale={scale}>
      <Glass>
        <cylinderGeometry args={[0.6, 0.6, 1.4, 28, 1, true]} />
      </Glass>
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 28]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.57, 0.57, 0.7, 28]} />
        <meshStandardMaterial color={liquid} transparent opacity={0.72} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Three test tubes in a wooden-ish rack. */
export function TubeRack({ position = [0, 0, 0], scale = 1 }: Props) {
  const liquids = ["#1f6feb", "#f2a93b", "#4caf6e"];
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.1, 0.12, 0.6]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.95} />
        <Edges color="#1a1a1a" />
      </mesh>
      <mesh position={[0, -0.85, 0]}>
        <boxGeometry args={[2.1, 0.12, 0.6]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.95} />
        <Edges color="#1a1a1a" />
      </mesh>
      {liquids.map((c, i) => (
        <group key={c} position={[(i - 1) * 0.62, 0, 0]}>
          <Glass>
            <cylinderGeometry args={[0.15, 0.15, 1.5, 16, 1, true]} />
          </Glass>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.62 - i * 0.12, 16]} />
            <meshStandardMaterial color={c} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
