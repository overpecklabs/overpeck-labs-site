"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { makeLiquidMaterial } from "./liquid";
import { motion } from "./mapping";

type Props = {
  /** control points (world, z=0 plane); return null to hide */
  points: () => THREE.Vector3[] | null;
  /** 0..1: how far along the tube the liquid has flowed */
  fill: (curve: THREE.CatmullRomCurve3) => number;
  radius?: number;
  segs?: number;
  radial?: number;
  bubbles?: number;
  splash?: boolean;
  color?: string;
  deep?: string;
  /** shared out-param: the tube's live fill, for other pieces to react to */
  out?: { fill: number };
};

const Z = new THREE.Vector3(0, 0, 1);
const X = new THREE.Vector3(1, 0, 0);
const UP = new THREE.Vector3(0, 1, 0);

/** A liquid-filled tube along a Catmull-Rom curve, rebuilt in place each frame (no allocations per vertex). */
export default function StreamTube({ points, fill, radius = 0.09, segs = 110, radial = 10, bubbles = 6, splash = true, color, deep, out }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const bub = useRef<THREE.InstancedMesh>(null);
  const spl = useRef<THREE.InstancedMesh>(null);
  const mat = useMemo(() => makeLiquidMaterial(color, deep), [color, deep]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(0, -1, 0)], false, "centripetal"), []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = (segs + 1) * (radial + 1);
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const uv = new Float32Array(n * 2);
    const idx: number[] = [];
    for (let i = 0; i <= segs; i++)
      for (let j = 0; j <= radial; j++) {
        const k = i * (radial + 1) + j;
        uv[k * 2] = i / segs;
        uv[k * 2 + 1] = j / radial;
        if (i < segs && j < radial) {
          const a = k, b = k + radial + 1;
          idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx);
    return g;
  }, [segs, radial]);
  const tmp = useMemo(() => ({ P: new THREE.Vector3(), A: new THREE.Vector3(), B: new THREE.Vector3(), T: new THREE.Vector3(), N: new THREE.Vector3(), Bn: new THREE.Vector3(), n: new THREE.Vector3(), o: new THREE.Object3D(), q: new THREE.Quaternion() }), []);
  const dirs = useMemo(() => Array.from({ length: 10 }, (_, i) => new THREE.Vector3(Math.cos(i * 2.4) * 0.8, 0.6 + (i % 3) * 0.25, Math.sin(i * 2.4) * 0.6)), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const pts = points();
    const hide = () => {
      m.visible = false;
      if (bub.current) bub.current.visible = false;
      if (spl.current) spl.current.visible = false;
      if (out) out.fill = 0;
    };
    if (!pts || pts.length < 2) return hide();
    curve.points = pts;
    const f = motion.reduced ? 1 : Math.max(0, Math.min(1, fill(curve)));
    if (out) out.fill = f;
    if (f <= 0.002) return hide();
    m.visible = true;
    const t = motion.reduced ? 0 : state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uFill.value = f;

    const { P, A, B, T, N, Bn, n } = tmp;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const nor = geo.attributes.normal as THREE.BufferAttribute;
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      curve.getPoint(u, P);
      curve.getPoint(Math.min(1, u + 0.008), A);
      curve.getPoint(Math.max(0, u - 0.008), B);
      T.subVectors(A, B).normalize();
      N.crossVectors(T, Z);
      if (N.lengthSq() < 1e-6) N.crossVectors(T, X);
      N.normalize();
      Bn.crossVectors(T, N).normalize();
      const wobble = 0.88 + 0.08 * Math.sin(u * 30 - t * 4) + 0.04 * Math.sin(u * 71 + t * 2.3);
      const head = Math.min(1, Math.max(0.12, (f - u) / 0.06 + 0.12)); // tapered tip
      const neck = 0.72 + 0.28 * Math.min(1, u / 0.06); // thinner where it leaves the source
      const r = radius * wobble * head * neck;
      for (let j = 0; j <= radial; j++) {
        const a = (j / radial) * Math.PI * 2;
        n.copy(N).multiplyScalar(Math.cos(a)).addScaledVector(Bn, Math.sin(a));
        const k = i * (radial + 1) + j;
        pos.setXYZ(k, P.x + n.x * r, P.y + n.y * r, P.z + n.z * r);
        nor.setXYZ(k, n.x, n.y, n.z);
      }
    }
    pos.needsUpdate = true;
    nor.needsUpdate = true;

    // bubbles flowing inside the stream (stretch with scroll speed = cheap motion blur)
    const bm = bub.current;
    if (bm) {
      bm.visible = !motion.reduced && bubbles > 0;
      for (let k = 0; k < bubbles; k++) {
        const u = ((t * 0.18 + k / bubbles) % 1) * f;
        curve.getPoint(u, P);
        curve.getPoint(Math.min(1, u + 0.01), A);
        T.subVectors(A, P).normalize();
        tmp.q.setFromUnitVectors(UP, T);
        tmp.o.position.set(P.x + Math.sin(k * 7 + t * 2) * radius * 0.35, P.y, P.z + radius * 0.4);
        tmp.o.quaternion.copy(tmp.q);
        const s = radius * (0.28 + 0.12 * ((k * 37) % 5) / 5);
        tmp.o.scale.set(s, s * (1 + Math.min(4, motion.speed * 3)), s);
        tmp.o.updateMatrix();
        bm.setMatrixAt(k, tmp.o.matrix);
      }
      bm.instanceMatrix.needsUpdate = true;
    }

    // splash droplets where the stream lands
    const sm = spl.current;
    if (sm) {
      const on = splash && !motion.reduced && f > 0.97;
      sm.visible = on;
      if (on) {
        curve.getPoint(1, P);
        for (let k = 0; k < dirs.length; k++) {
          const tau = (t * 1.3 + k / dirs.length) % 1;
          const d = dirs[k];
          tmp.o.position.set(P.x + d.x * tau * radius * 6, P.y + d.y * tau * radius * 5 - tau * tau * radius * 9, P.z + d.z * tau * radius * 4);
          tmp.o.quaternion.identity();
          tmp.o.scale.setScalar(Math.max(0.0001, radius * 0.32 * (1 - tau)));
          tmp.o.updateMatrix();
          sm.setMatrixAt(k, tmp.o.matrix);
        }
        sm.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      <mesh ref={mesh} geometry={geo} material={mat} frustumCulled={false} />
      {bubbles > 0 && (
        <instancedMesh ref={bub} args={[undefined, undefined, bubbles]} frustumCulled={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </instancedMesh>
      )}
      {splash && (
        <instancedMesh ref={spl} args={[undefined, undefined, dirs.length]} frustumCulled={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={color ?? "#19f0d2"} transparent opacity={0.85} />
        </instancedMesh>
      )}
    </group>
  );
}
