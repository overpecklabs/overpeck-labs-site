"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp, journey } from "@/lib/journey";
import Label from "./Label";
import { Edges } from "@react-three/drei";

const CH = 2;
const X = 3.3;
const Y = [1.6, 0, -1.6];

const INPUTS = ["New call", "Web form", "Booking request"];
const OUTPUTS = [
  { text: "Follow-up text", done: "✓ Follow-up sent", at: 0.3 },
  { text: "Invoice reminder", done: "✓ Reminder sent", at: 0.42 },
  { text: "Review request", done: "✓ Review requested", at: 0.54 },
];

const TEAL = "#2f9e44"; // outputs: marker green
const VIOLET = "#1f6feb"; // inputs: marker blue

/** Tasks flow from inputs through an automation hub to outputs, which check themselves off. */
export default function NodeGraph({ low }: { low: boolean }) {
  const hub = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const tokens = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const K = low ? 2 : 4; // tokens per edge

  const edges = useMemo(() => {
    const mk = (a: THREE.Vector3, b: THREE.Vector3, input: boolean) => {
      const curve = new THREE.CubicBezierCurve3(a, new THREE.Vector3(a.x + 1.7, a.y, 0.4), new THREE.Vector3(b.x - 1.7, b.y, 0.4), b);
      return { curve, input };
    };
    const hubP = new THREE.Vector3(0, 0, 0);
    return [
      ...Y.map((y) => mk(new THREE.Vector3(-X + 1.1, y, 0), hubP, true)),
      ...Y.map((y) => mk(hubP, new THREE.Vector3(X - 1.1, y, 0), false)),
    ];
  }, []);

  useFrame(({ clock }) => {
    const p = journey.p[CH];
    const t = journey.reduced ? 0.4 : clock.elapsedTime;
    if (hub.current) {
      hub.current.rotation.y = t * 0.6;
      hub.current.rotation.x = t * 0.3;
    }
    if (ring.current) {
      const s = 1 + (journey.reduced ? 0 : Math.sin(t * 3) * 0.06);
      ring.current.scale.setScalar(s);
    }
    const m = tokens.current;
    if (!m) return;
    const flow = clamp((p - 0.05) / 0.15);
    edges.forEach((e, ei) => {
      for (let k = 0; k < K; k++) {
        const i = ei * K + k;
        const u = (t * 0.28 + k / K + ei * 0.17) % 1;
        const pt = e.curve.getPointAt(u);
        dummy.position.copy(pt);
        dummy.rotation.set(u * 8, u * 5, 0);
        dummy.scale.setScalar(flow * 0.11);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      }
    });
    m.instanceMatrix.needsUpdate = true;
  });

  const colors = useMemo(() => {
    const arr = new Float32Array(edges.length * K * 3);
    const c = new THREE.Color();
    edges.forEach((e, ei) => {
      c.set(e.input ? VIOLET : TEAL);
      for (let k = 0; k < K; k++) c.toArray(arr, (ei * K + k) * 3);
    });
    return arr;
  }, [edges, K]);

  return (
    <group scale={0.62} position={[0, -0.2, 0]}>
      {edges.map((e, i) => (
        <mesh key={i}>
          <tubeGeometry args={[e.curve, 40, 0.025, 6, false]} />
          <meshBasicMaterial color={e.input ? VIOLET : TEAL} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      ))}

      <mesh ref={hub}>
        <icosahedronGeometry args={[0.65, low ? 0 : 1]} />
        <meshStandardMaterial color="#fffefb" roughness={0.9} flatShading />
        <Edges color="#1a1a1a" />
      </mesh>
      <mesh ref={ring} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.0, 0.025, 8, 64]} />
        <meshBasicMaterial color={TEAL} toneMapped={false} />
      </mesh>
      <Label text="Automation" position={[0, -1.4, 0.2]} height={0.34} style={{ border: "rgba(31,111,235,0.8)" }} />

      {INPUTS.map((txt, i) => (
        <Label
          key={txt}
          text={txt}
          position={[-X, Y[i], 0]}
          height={0.42}
          style={{ border: "rgba(31,111,235,0.35)", color: "#4a4a4a" }}
          altText={txt}
          altStyle={{ border: "#1f6feb", bg: "#dbe8ff", color: "#1a1a1a" }}
          alt={(p) => p[CH] > 0.06 + i * 0.04}
        />
      ))}
      {OUTPUTS.map((o, i) => (
        <Label
          key={o.text}
          text={o.text}
          position={[X, Y[i], 0]}
          height={0.42}
          style={{ border: "rgba(47,158,68,0.35)", color: "#4a4a4a" }}
          altText={o.done}
          altStyle={{ border: "#2f9e44", bg: "#dcf3df", color: "#1a1a1a" }}
          alt={(p) => p[CH] > o.at}
        />
      ))}

      <instancedMesh ref={tokens} args={[undefined, undefined, edges.length * K]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
        </boxGeometry>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
