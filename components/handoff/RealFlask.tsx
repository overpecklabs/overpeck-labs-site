"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { anchorRect, smooth } from "@/lib/handoff";
import { motion, px2w, toWorld } from "./mapping";

/* Product-render flask with gravity-correct liquid.
   - Glass: thick-walled lathe (rounded rim, heavier base) in a transmission material.
   - Liquid: the full interior volume, clipped by a WORLD-horizontal plane, so the surface
     stays level however the flask tips.
   - Surface: rebuilt each frame by intersecting that plane with the inner wall (per angle),
     then filled with rings so it can carry a meniscus at the wall and a scroll-driven wobble.
   Geometry is in "flask units" (height ~1.07); the parent scales it to its DOM anchor. */

export type FlaskLink = { mouth: THREE.Vector3; mouthOk: boolean; pour: number };

const BG = new THREE.Color("#f8f8f5");
const TOP = new THREE.Color("#3ff3d6");
const BOTTOM = new THREE.Color("#07594f");
const OFFSET_Y = -0.53; // inner group offset so the flask is centred on its anchor

// inner wall: x as a function of y (cone from the shoulder to the neck)
const innerX = (y: number) => (y < 0.09 ? 0.405 : y > 0.73 ? 0.13 : 0.405 - ((y - 0.09) * 0.275) / 0.64);

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
  P.push(...arc(0.39, 0.05, 0.05, -Math.PI / 2, 0.15));
  P.push(new THREE.Vector2(0.155, 0.72));
  P.push(new THREE.Vector2(0.15, 1.0));
  P.push(...arc(0.162, 1.042, 0.024, -Math.PI * 0.6, Math.PI * 0.55, 8));
  P.push(...arc(0.145, 1.045, 0.016, Math.PI * 0.4, Math.PI, 5));
  P.push(new THREE.Vector2(0.13, 1.0));
  P.push(new THREE.Vector2(0.13, 0.73));
  P.push(new THREE.Vector2(0.405, 0.09));
  P.push(...arc(0.375, 0.095, 0.03, 0, -Math.PI / 2, 4));
  P.push(new THREE.Vector2(0.0001, 0.065));
  return P;
}

/** Interior wall profile (just inside the glass), from the floor centre up the wall to the neck. */
function interiorProfile() {
  const P: THREE.Vector2[] = [];
  for (let i = 0; i <= 6; i++) P.push(new THREE.Vector2((0.36 * i) / 6 + 0.0001, 0.075));
  P.push(...arc(0.36, 0.1, 0.025, -Math.PI / 2, 0, 3).slice(1));
  for (let i = 1; i <= 24; i++) {
    const y = 0.1 + ((0.99 - 0.1) * i) / 24;
    P.push(new THREE.Vector2(innerX(y) - 0.01, y));
  }
  return P;
}
const PROFILE = interiorProfile();

/** Closed liquid volume (whole interior); the clipping plane decides how much shows. */
function liquidVolume() {
  const pts = [...PROFILE, new THREE.Vector2(0.0001, 0.99)];
  const g = new THREE.LatheGeometry(pts, 48);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    c.copy(BOTTOM).lerp(TOP, smooth((pos.getY(i) - 0.07) / 0.45));
    c.toArray(col, i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return g;
}

const ANG = 48; // angles around the axis for the surface outline
const RINGS = 7; // rings from the centre to the wall

export default function RealFlask({ link, lite }: { link: FlaskLink; lite: boolean }) {
  const { gl } = useThree();
  const root = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const surface = useRef<THREE.Mesh>(null);
  const bubbles = useRef<THREE.InstancedMesh>(null);
  const shadow = useRef<THREE.Group>(null);

  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const glass = useMemo(() => {
    const g = new THREE.LatheGeometry(glassProfile(), motion.low ? 48 : 96);
    g.computeVertexNormals();
    return g;
  }, []);
  const volume = useMemo(liquidVolume, []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);

  // surface mesh: centre vertex + RINGS rings of ANG vertices (positions written per frame, in world space)
  const surf = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 1 + RINGS * ANG;
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const idx: number[] = [];
    for (let a = 0; a < ANG; a++) idx.push(0, 1 + ((a + 1) % ANG), 1 + a);
    for (let r = 0; r < RINGS - 1; r++)
      for (let a = 0; a < ANG; a++) {
        const i0 = 1 + r * ANG + a, i1 = 1 + r * ANG + ((a + 1) % ANG);
        const j0 = i0 + ANG, j1 = i1 + ANG;
        idx.push(i0, i1, j1, i0, j1, j0);
      }
    g.setIndex(idx);
    return g;
  }, []);

  const S = useMemo(
    () => ({
      mouthLocal: new THREE.Vector3(0, 1.05 + OFFSET_Y, 0),
      o: new THREE.Object3D(),
      v: new THREE.Vector3(),
      w: new THREE.Vector3(),
      ring: Array.from({ length: ANG }, () => new THREE.Vector3()),
      ringT: new Float32Array(ANG), // fraction of the way from the floor up the wall (for meniscus)
      c: new THREE.Vector3(),
    }),
    []
  );
  const NB = motion.low ? 4 : 9;
  const seeds = useMemo(() => Array.from({ length: NB }, (_, i) => ({ a: i * 2.39, r: 0.15 + ((i * 37) % 10) / 14, s: 0.06 + ((i * 13) % 7) / 60, off: i / NB })), [NB]);

  useFrame((st) => {
    const g = root.current;
    const ig = inner.current;
    const r = anchorRect("flask");
    if (!g || !ig) return;
    if (!r) {
      g.visible = false;
      if (surface.current) surface.current.visible = false;
      link.mouthOk = false;
      return;
    }
    g.visible = true;
    toWorld(r.left + r.width / 2, r.top + r.height * 0.55, g.position);
    const scale = px2w(r.height) * 0.78;
    g.scale.setScalar(scale);
    // unchanged scroll timing: pour progresses over the first 45% of a viewport
    const pour = motion.reduced ? 1 : smooth(window.scrollY / (window.innerHeight * 0.45));
    link.pour = pour;
    const t = motion.reduced ? 0 : st.clock.elapsedTime;
    g.rotation.set(0.18 * pour, -0.25, -pour * 1.7 + Math.sin(t * 1.2) * 0.015);
    g.updateMatrixWorld(true);
    g.localToWorld(link.mouth.copy(S.mouthLocal));
    link.mouthOk = true;

    // ---- gravity: world-level liquid height ----
    // lowest interior point (world) + a fill depth that shrinks as it pours
    let minY = Infinity;
    for (let a = 0; a < ANG; a += 4) {
      const th = (a / ANG) * Math.PI * 2;
      for (let k = 0; k < PROFILE.length; k += 3) {
        const p = PROFILE[k];
        ig.localToWorld(S.v.set(p.x * Math.cos(th), p.y, p.x * Math.sin(th)));
        if (S.v.y < minY) minY = S.v.y;
      }
    }
    const depth = scale * (0.36 - 0.27 * pour) * (1 - 0.35 * Math.sin(pour * Math.PI * 0.5) * pour);
    const level = minY + depth;
    plane.constant = level; // keeps points with y <= level

    // ---- surface outline: march rays along the level plane from an inside point to the inner wall ----
    // margin > 0 means inside the liquid cavity (tested in flask-local space)
    const margin = (wx: number, wz: number) => {
      ig.worldToLocal(S.v.set(wx, level, wz));
      const y = S.v.y;
      const rr = Math.hypot(S.v.x, S.v.z);
      const m = Math.min(innerX(y) - 0.012 - rr, y - 0.08, 0.985 - y);
      return m;
    };
    // find a good centre: the most-inside point on a coarse grid around the flask
    const R = scale * 0.6;
    let best = -Infinity, bx = g.position.x, bz = g.position.z;
    for (let i = -5; i <= 5; i++)
      for (let j = -5; j <= 5; j++) {
        const x = g.position.x + (i / 5) * R, z = g.position.z + (j / 5) * R;
        const m = margin(x, z);
        if (m > best) {
          best = m;
          bx = x;
          bz = z;
        }
      }
    const hasLiquid = best > 0;
    if (hasLiquid) {
      for (let a = 0; a < ANG; a++) {
        const th = (a / ANG) * Math.PI * 2;
        const dx = Math.cos(th), dz = Math.sin(th);
        let lo = 0, hi = scale * 0.05;
        // step out until we leave the cavity, then bisect for the exact wall
        while (hi < scale * 1.4 && margin(bx + dx * hi, bz + dz * hi) > 0) {
          lo = hi;
          hi *= 1.35;
        }
        for (let k = 0; k < 10; k++) {
          const mid = (lo + hi) / 2;
          if (margin(bx + dx * mid, bz + dz * mid) > 0) lo = mid;
          else hi = mid;
        }
        S.ring[a].set(bx + dx * lo, level, bz + dz * lo);
        // meniscus only against the glass wall, not at the open mouth
        ig.worldToLocal(S.w.copy(S.ring[a]));
        S.ringT[a] = S.w.y > 0.975 ? 1 : 0;
      }
    }
    S.c.set(bx, level, bz);

    // ---- fill rings with meniscus at the wall + wobble from scroll speed and the pour ----
    const sm = surface.current;
    if (sm) {
      sm.visible = hasLiquid;
      const amp = motion.reduced ? 0 : scale * (0.004 + Math.min(0.022, motion.speed * 0.011) + Math.sin(pour * Math.PI) * 0.009);
      const men = scale * 0.022;
      const pos = surf.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, S.c.x, level + amp * 0.4 * Math.sin(-t * 5), S.c.z);
      for (let rr = 1; rr <= RINGS; rr++) {
        const s = rr / RINGS;
        for (let a = 0; a < ANG; a++) {
          const e = S.ring[a];
          const ang = (a / ANG) * Math.PI * 2;
          const x = S.c.x + (e.x - S.c.x) * s;
          const z = S.c.z + (e.z - S.c.z) * s;
          const wob = amp * s * (Math.sin(ang * 2 + t * 3.1) + 0.6 * Math.sin(ang * 3 - t * 4.3 + s * 4)) + amp * 0.4 * Math.sin(s * 9 - t * 5);
          // meniscus only where the surface meets the wall (not where it's cut off at the neck)
          const wall = S.ringT[a] < 0.5 ? 1 : 0;
          pos.setXYZ(1 + (rr - 1) * ANG + a, x, level + men * Math.pow(s, 6) * wall + wob * (1 - 0.6 * Math.pow(s, 8)), z);
        }
      }
      pos.needsUpdate = true;
      surf.computeVertexNormals();
      surf.computeBoundingSphere();
    }

    // ---- tiny bubbles rising inside the liquid (hidden above the world level) ----
    const bm = bubbles.current;
    if (bm) {
      bm.visible = !motion.reduced;
      seeds.forEach((sd, i) => {
        const u = (t * sd.s * 2 + sd.off) % 1;
        const y = 0.09 + u * 0.55;
        const rad = (innerX(y) - 0.05) * sd.r;
        S.o.position.set(Math.cos(sd.a + u * 2) * rad, y, Math.sin(sd.a + u * 2) * rad);
        ig.localToWorld(S.v.copy(S.o.position));
        const under = S.v.y < level - scale * 0.01;
        S.o.scale.setScalar(under ? 0.006 + (0.008 * ((i * 7) % 3)) / 2 : 0.00001);
        S.o.updateMatrix();
        bm.setMatrixAt(i, S.o.matrix);
      });
      bm.instanceMatrix.needsUpdate = true;
    }

    // soft shadow on the board, tracking the jar
    if (shadow.current) {
      shadow.current.position.set(g.position.x, g.position.y - scale * 0.52, g.position.z - scale * 0.35);
      shadow.current.scale.setScalar(scale);
    }
  });

  return (
    <>
      <group ref={root}>
        <group ref={inner} position={[0, OFFSET_Y, 0]}>
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
          {/* liquid volume, clipped to the world-level plane */}
          <mesh geometry={volume}>
            <meshPhysicalMaterial vertexColors roughness={0.12} clearcoat={1} clearcoatRoughness={0.08} transparent opacity={0.92} emissive="#0fb39f" emissiveIntensity={0.12} envMapIntensity={0.8} clippingPlanes={[plane]} side={THREE.DoubleSide} />
          </mesh>
          <instancedMesh ref={bubbles} args={[undefined, undefined, NB]} frustumCulled={false}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.75} roughness={0.05} clearcoat={1} />
          </instancedMesh>
        </group>
      </group>
      {/* level liquid surface (world space) */}
      <mesh ref={surface} geometry={surf} frustumCulled={false}>
        <meshPhysicalMaterial color="#5ff5dd" roughness={0.04} clearcoat={1} transparent opacity={0.92} emissive="#19f0d2" emissiveIntensity={0.18} envMapIntensity={1.3} side={THREE.DoubleSide} />
      </mesh>
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
