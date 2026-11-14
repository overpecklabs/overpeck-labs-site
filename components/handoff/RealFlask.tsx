"use client";

import { useFrame } from "@react-three/fiber";
import { ContactShadows, MeshTransmissionMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { anchorRect, smooth } from "@/lib/handoff";
import { motion, px2w, toWorld } from "./mapping";

/* Product-render flask: thick-walled lathe glass (rounded rim, heavier base), an inner liquid
   body with a darker-to-lighter depth gradient, a meniscus surface that wobbles with scroll
   speed, rising bubbles and a soft shadow on the board. Geometry is in "flask units"
   (height ~1.07); the parent scales it to its DOM anchor. */

export type FlaskLink = { mouth: THREE.Vector3; mouthOk: boolean; pour: number };

const BG = new THREE.Color("#f8f8f5");
const TOP = new THREE.Color("#3ff3d6");
const BOTTOM = new THREE.Color("#07594f");

// inner wall: x as a function of y (cone from the shoulder to the neck)
const innerX = (y: number) => (y < 0.09 ? 0.405 : y > 0.73 ? 0.13 : 0.405 - ((y - 0.09) * 0.275) / 0.64);

/** Points along a quarter/half arc (for rounded corners). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number, n = 6) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  });
}

function glassProfile() {
  const P: THREE.Vector2[] = [];
  P.push(new THREE.Vector2(0.0001, 0));
  P.push(new THREE.Vector2(0.39, 0));
  P.push(...arc(0.39, 0.05, 0.05, -Math.PI / 2, 0.15)); // rounded outer foot
  P.push(new THREE.Vector2(0.155, 0.72)); // shoulder -> neck (outside)
  P.push(new THREE.Vector2(0.15, 1.0));
  P.push(...arc(0.162, 1.042, 0.024, -Math.PI * 0.6, Math.PI * 0.55, 8)); // lip rolls outward
  P.push(...arc(0.145, 1.045, 0.016, Math.PI * 0.4, Math.PI, 5)); // rounded rim top, back inside
  P.push(new THREE.Vector2(0.13, 1.0)); // neck (inside)
  P.push(new THREE.Vector2(0.13, 0.73));
  P.push(new THREE.Vector2(0.405, 0.09)); // inner cone
  P.push(...arc(0.375, 0.095, 0.03, 0, -Math.PI / 2, 4)); // rounded inner floor corner
  P.push(new THREE.Vector2(0.0001, 0.065)); // thick base
  return P;
}

function liquidBody(level: number) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0.0001, 0.073), new THREE.Vector2(0.37, 0.075)];
  pts.push(...arc(0.37, 0.1, 0.025, -Math.PI / 2, 0, 3).slice(1));
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    const y = 0.1 + ((level - 0.1) * i) / steps;
    pts.push(new THREE.Vector2(innerX(y) - 0.01, y));
  }
  const g = new THREE.LatheGeometry(pts, 48);
  // depth color: darker toward the bottom, lighter at the surface
  const pos = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    c.copy(BOTTOM).lerp(TOP, smooth((pos.getY(i) - 0.07) / Math.max(0.05, level - 0.07)));
    c.toArray(col, i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return g;
}

export default function RealFlask({ link, lite }: { link: FlaskLink; lite: boolean }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const surface = useRef<THREE.Mesh>(null);
  const bubbles = useRef<THREE.InstancedMesh>(null);
  const shadow = useRef<THREE.Group>(null);
  const glass = useMemo(() => {
    const g = new THREE.LatheGeometry(glassProfile(), motion.low ? 48 : 96);
    g.computeVertexNormals();
    return g;
  }, []);
  const surf = useMemo(() => new THREE.RingGeometry(0.0001, 1, 48, 8).rotateX(-Math.PI / 2), []);
  const base = useMemo(() => Float32Array.from(surf.attributes.position.array as Float32Array), [surf]);
  const state = useMemo(() => ({ level: -1, mouthLocal: new THREE.Vector3(0, 1.05 - 0.53, 0), o: new THREE.Object3D() }), []);
  const NB = motion.low ? 4 : 9;
  const seeds = useMemo(() => Array.from({ length: NB }, (_, i) => ({ a: i * 2.39, r: 0.15 + ((i * 37) % 10) / 14, s: 0.06 + ((i * 13) % 7) / 60, off: i / NB })), [NB]);

  useFrame((st) => {
    const g = root.current;
    const r = anchorRect("flask");
    if (!g) return;
    if (!r) {
      g.visible = false;
      link.mouthOk = false;
      return;
    }
    g.visible = true;
    toWorld(r.left + r.width / 2, r.top + r.height * 0.55, g.position);
    g.scale.setScalar(px2w(r.height) * 0.78);
    // unchanged scroll timing: pour progresses over the first 45% of a viewport
    const pour = motion.reduced ? 1 : smooth(window.scrollY / (window.innerHeight * 0.45));
    link.pour = pour;
    const t = motion.reduced ? 0 : st.clock.elapsedTime;
    g.rotation.set(0.18 * pour, -0.25, -pour * 1.7 + Math.sin(t * 1.2) * 0.015);
    g.updateMatrixWorld();
    g.localToWorld(link.mouth.copy(state.mouthLocal));
    link.mouthOk = true;

    // liquid level drops as it pours (rebuild the body only when it changes)
    const level = 0.42 - pour * 0.28;
    if (body.current && Math.abs(level - state.level) > 0.002) {
      body.current.geometry.dispose();
      body.current.geometry = liquidBody(level);
      state.level = level;
    }

    // meniscus + wobble that reacts to scroll velocity (and to the pour itself)
    const sm = surface.current;
    if (sm) {
      const rl = innerX(level) - 0.01;
      const amp = motion.reduced ? 0 : 0.004 + Math.min(0.025, motion.speed * 0.012) + Math.sin(pour * Math.PI) * 0.01;
      const pos = surf.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], z = base[i * 3 + 2];
        const rr = Math.hypot(x, z);
        const a = Math.atan2(z, x);
        const meniscus = Math.pow(rr, 6) * 0.03;
        const wob = amp * rr * (Math.sin(a * 2 + t * 3.1) + 0.6 * Math.sin(a * 3 - t * 4.3 + rr * 4)) + amp * 0.4 * Math.sin(rr * 9 - t * 5);
        pos.setXYZ(i, x * rl, level + meniscus + wob, z * rl);
      }
      pos.needsUpdate = true;
      surf.computeVertexNormals();
    }

    // tiny bubbles rising inside the liquid
    const bm = bubbles.current;
    if (bm) {
      bm.visible = !motion.reduced;
      seeds.forEach((s, i) => {
        const u = (t * s.s * 2 + s.off) % 1;
        const y = 0.09 + u * (level - 0.11);
        const rad = (innerX(y) - 0.04) * s.r;
        state.o.position.set(Math.cos(s.a + u * 2) * rad, y, Math.sin(s.a + u * 2) * rad);
        state.o.scale.setScalar(0.006 + 0.008 * ((i * 7) % 3) / 2);
        state.o.updateMatrix();
        bm.setMatrixAt(i, state.o.matrix);
      });
      bm.instanceMatrix.needsUpdate = true;
    }

    // soft shadow on the board, tracking the jar
    if (shadow.current) {
      shadow.current.position.set(g.position.x, g.position.y - g.scale.x * 0.52, g.position.z - g.scale.x * 0.35);
      shadow.current.scale.setScalar(g.scale.x);
    }
  });

  return (
    <>
      <group ref={root}>
        <group position={[0, -0.53, 0]}>
          <mesh geometry={glass} renderOrder={2}>
            {lite ? (
              <meshPhysicalMaterial color="#f4fffd" transparent opacity={0.28} roughness={0.05} metalness={0} clearcoat={1} clearcoatRoughness={0.05} ior={1.5} envMapIntensity={1.4} side={THREE.DoubleSide} depthWrite={false} />
            ) : (
              <MeshTransmissionMaterial
                background={BG}
                transmission={1}
                roughness={0.05}
                ior={1.5}
                thickness={0.5}
                clearcoat={0.4}
                clearcoatRoughness={0.05}
                chromaticAberration={0.025}
                anisotropicBlur={0.05}
                distortion={0}
                attenuationColor="#effcf9"
                attenuationDistance={2.5}
                color="#fbfffe"
                samples={motion.low ? 2 : 6}
                resolution={motion.low ? 256 : 512}
                backside={false}
                envMapIntensity={1.2}
              />
            )}
          </mesh>
          <mesh ref={body} geometry={useMemo(() => liquidBody(0.42), [])}>
            <meshPhysicalMaterial vertexColors roughness={0.12} clearcoat={1} clearcoatRoughness={0.08} transparent opacity={0.92} emissive="#0fb39f" emissiveIntensity={0.12} envMapIntensity={0.8} />
          </mesh>
          <mesh ref={surface} geometry={surf}>
            <meshPhysicalMaterial color="#5ff5dd" roughness={0.04} clearcoat={1} transparent opacity={0.9} emissive="#19f0d2" emissiveIntensity={0.18} envMapIntensity={1.3} side={THREE.DoubleSide} />
          </mesh>
          <instancedMesh ref={bubbles} args={[undefined, undefined, NB]} frustumCulled={false}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.75} roughness={0.05} clearcoat={1} />
          </instancedMesh>
        </group>
      </group>
      {/* a soft contact shadow on the whiteboard behind the jar (tilted to face the camera) */}
      {!motion.low && (
        <group ref={shadow}>
          <group rotation={[1.25, 0, 0]}>
            <ContactShadows opacity={0.35} scale={2.4} blur={2.6} far={1.6} resolution={256} color="#1a2b28" frames={Infinity} />
          </group>
        </group>
      )}
    </>
  );
}
