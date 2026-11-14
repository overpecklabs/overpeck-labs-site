"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { journey } from "@/lib/journey";
import { anchorRect, setAnchorVar, smooth } from "@/lib/handoff";
import StreamTube from "./StreamTube";
import { anchorPoint, anchorYFrac, bowed, CAM_Z, FOV, headFill, motion, px2w, toWorld } from "./mapping";
import Label from "../three/Label";

/* ------------------------------------------------------------------
   Shared link state: each piece publishes where the stream leaves it,
   the next stream reads it. (One frame of lag is invisible.)
------------------------------------------------------------------- */
const link = {
  mouth: new THREE.Vector3(),
  mouthOk: false,
  pour: 0,
  screenTop: new THREE.Vector3(),
  cta: new THREE.Vector3(),
  laptopOk: false,
  graphIn: new THREE.Vector3(),
  graphOut: new THREE.Vector3(),
  graphOk: false,
  dropAtChat: false,
  helixTop: new THREE.Vector3(),
  helixBottom: new THREE.Vector3(),
  helixOk: false,
  s1: { fill: 0 },
  s2: { fill: 0 },
};

const TEAL = "#19f0d2";
const DEEP = "#0b8f82";

/* ---------------- motion + gentle camera drift ---------------- */
function MotionRig() {
  const { camera } = useThree();
  const last = useRef(0);
  useFrame((state, dt) => {
    const y = window.scrollY;
    const v = Math.abs(y - last.current) / Math.max(dt, 0.001) / window.innerHeight; // viewports per second
    last.current = y;
    motion.speed += (Math.min(v, 3) - motion.speed) * 0.15;
    const t = motion.reduced ? 0 : state.clock.elapsedTime;
    camera.position.set(Math.sin(t * 0.12) * 0.04, Math.cos(t * 0.1) * 0.03, CAM_Z);
  });
  return null;
}

/* ---------------- 1. hero flask that tips and pours ---------------- */
function Flask() {
  const root = useRef<THREE.Group>(null);
  const liq = useRef<THREE.Mesh>(null);
  const glass = useMemo(() => new THREE.LatheGeometry([[0.001, 0], [0.36, 0], [0.4, 0.05], [0.14, 0.72], [0.14, 1.0], [0.18, 1.04]].map(([x, y]) => new THREE.Vector2(x, y)), 36), []);
  const fluid = useMemo(() => new THREE.LatheGeometry([[0.001, 0.02], [0.35, 0.02], [0.38, 0.06], [0.24, 0.36], [0.001, 0.36]].map(([x, y]) => new THREE.Vector2(x, y)), 36), []);
  const mouthLocal = useMemo(() => new THREE.Vector3(0, 1.04 - 0.52, 0), []);

  useFrame((state) => {
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
    const pour = motion.reduced ? 1 : smooth(window.scrollY / (window.innerHeight * 0.45));
    link.pour = pour;
    const t = motion.reduced ? 0 : state.clock.elapsedTime;
    g.rotation.set(0.18 * pour, -0.25, -pour * 1.7 + Math.sin(t * 1.2) * 0.015);
    if (liq.current) liq.current.scale.set(1, Math.max(0.15, 1 - pour * 0.7), 1);
    g.updateMatrixWorld();
    g.localToWorld(link.mouth.copy(mouthLocal));
    link.mouthOk = true;
  });

  return (
    <group ref={root}>
      <group position={[0, -0.52, 0]}>
        <mesh geometry={glass}>
          {motion.low ? (
            <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={0.15} side={THREE.DoubleSide} depthWrite={false} />
          ) : (
            <meshPhysicalMaterial color="#ffffff" transmission={1} thickness={0.35} roughness={0.06} ior={1.35} transparent opacity={0.9} side={THREE.DoubleSide} />
          )}
          <Edges color="#1a1a1a" threshold={25} />
        </mesh>
        <mesh ref={liq} geometry={fluid}>
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.35} transparent opacity={0.88} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------------- 2. laptop whose screen fills and "brews" into a mockup ---------------- */
const screenMat = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uLevel: { value: 0 }, uMock: { value: 0 }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uLevel; uniform float uMock; uniform float uTime; varying vec2 vUv;
      void main(){
        vec3 bg = vec3(0.97, 0.98, 0.99);
        float wave = 0.018 * sin(vUv.x * 18.0 + uTime * 3.0) + 0.01 * sin(vUv.x * 41.0 - uTime * 2.0);
        float inLiq = step(vUv.y, uLevel * 1.04 + wave - 0.02);
        vec3 liq = mix(vec3(0.04, 0.56, 0.51), vec3(0.1, 0.94, 0.82), 0.5 + 0.5 * sin(vUv.y * 20.0 - uTime * 2.0));
        vec3 col = mix(bg, liq, inLiq * (1.0 - uMock * 0.9));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });

const PANELS: { p: [number, number]; s: [number, number]; c: string }[] = [
  { p: [0, 0.235], s: [0.86, 0.045], c: "#19c9b0" },
  { p: [-0.18, 0.13], s: [0.44, 0.05], c: "#1a1a1a" },
  { p: [-0.22, 0.07], s: [0.36, 0.035], c: "#6b7280" },
  { p: [0.24, 0.09], s: [0.3, 0.2], c: "#8ab4f8" },
  { p: [-0.28, -0.01], s: [0.2, 0.055], c: "#19c9b0" }, // CTA (stream leaves from here)
  { p: [-0.29, -0.16], s: [0.26, 0.13], c: "#e5e9f0" },
  { p: [0, -0.16], s: [0.26, 0.13], c: "#e5e9f0" },
  { p: [0.29, -0.16], s: [0.26, 0.13], c: "#e5e9f0" },
];

function Laptop() {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const cta = useRef<THREE.Mesh>(null);
  const panels = useRef<(THREE.Mesh | null)[]>([]);
  const mat = useMemo(screenMat, []);
  const top = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const g = root.current;
    const r = anchorRect("laptop");
    if (!g || !lid.current) return;
    if (!r) {
      g.visible = false;
      link.laptopOk = false;
      return;
    }
    g.visible = true;
    toWorld(r.left + r.width / 2, r.top + r.height / 2, g.position);
    g.scale.setScalar(px2w(Math.min(r.width, r.height * 1.35)) * 0.8);
    g.rotation.set(0.22, -0.22, 0);
    const arrived = link.s1.fill > 0.97;
    const pw = journey.p[1];
    const level = motion.reduced ? 1 : arrived ? smooth((pw - 0.04) / 0.32) : 0;
    const mock = motion.reduced ? 1 : smooth((pw - 0.36) / 0.22);
    mat.uniforms.uLevel.value = level;
    mat.uniforms.uMock.value = mock;
    mat.uniforms.uTime.value = motion.reduced ? 0 : state.clock.elapsedTime;
    panels.current.forEach((m, i) => {
      if (!m) return;
      const k = smooth(mock * 1.6 - i * 0.08);
      (m.material as THREE.MeshBasicMaterial).opacity = k;
      m.scale.setScalar(0.85 + 0.15 * k);
    });
    g.updateMatrixWorld();
    lid.current.localToWorld(link.screenTop.copy(top.set(0, 0.29, 0.03)));
    if (cta.current) cta.current.getWorldPosition(link.cta);
    link.laptopOk = true;
  });

  return (
    <group ref={root}>
      <group ref={lid} position={[0, 0.12, 0]} rotation={[-0.12, 0, 0]}>
        <mesh>
          <boxGeometry args={[1, 0.64, 0.028]} />
          <meshStandardMaterial color="#fbfaf6" roughness={0.9} />
          <Edges color="#1a1a1a" threshold={20} />
        </mesh>
        <mesh position={[0, 0, 0.015]} material={mat}>
          <planeGeometry args={[0.94, 0.58]} />
        </mesh>
        {PANELS.map((pn, i) => (
          <mesh
            key={i}
            ref={(m) => {
              panels.current[i] = m;
              if (i === 4) cta.current = m;
            }}
            position={[pn.p[0], pn.p[1], 0.018]}
          >
            <planeGeometry args={pn.s} />
            <meshBasicMaterial color={pn.c} transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -0.21, 0.3]}>
        <boxGeometry args={[1.02, 0.035, 0.62]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.9} />
        <Edges color="#1a1a1a" threshold={20} />
      </mesh>
    </group>
  );
}

/* ---------------- 3. workflow: channels split through nodes ---------------- */
const IN_LABELS = ["New call", "Web form", "Booking"];
const OUT_LABELS = [
  ["Text sent", "✓ Text sent"],
  ["Invoice sent", "✓ Invoice sent"],
  ["Review sent", "✓ Review sent"],
];

function Graph() {
  const hub = useRef<THREE.Group>(null);
  const inG = useRef<(THREE.Group | null)[]>([]);
  const outG = useRef<(THREE.Group | null)[]>([]);
  const P = useMemo(() => ({ ok: false, entry: new THREE.Vector3(), hub: new THREE.Vector3(), ins: [0, 1, 2].map(() => new THREE.Vector3()), outs: [0, 1, 2].map(() => new THREE.Vector3()) }), []);
  const outsFill = useMemo(() => [0, 1, 2].map(() => ({ fill: 0 })), []);
  const [lh] = useState(() => (typeof window !== "undefined" ? px2w(26) : 0.3));

  useFrame((state) => {
    const r = anchorRect("graph");
    if (!r) {
      P.ok = link.graphOk = false;
      if (hub.current) hub.current.visible = false;
      return;
    }
    const w = px2w(r.width), h = px2w(r.height);
    toWorld(r.left + r.width / 2, r.top + r.height / 2, P.hub);
    P.entry.set(P.hub.x - w * 0.5, P.hub.y + h * 0.48, 0);
    [0.32, 0, -0.32].forEach((fy, i) => {
      P.ins[i].set(P.hub.x - w * 0.36, P.hub.y + fy * h, 0);
      P.outs[i].set(P.hub.x + w * 0.36, P.hub.y + fy * h, 0);
    });
    link.graphIn.copy(P.entry);
    link.graphOut.set(P.hub.x + w * 0.5, P.hub.y - h * 0.48, 0);
    P.ok = link.graphOk = true;
    if (hub.current) {
      hub.current.visible = true;
      hub.current.position.copy(P.hub);
      hub.current.scale.setScalar(Math.min(w, h) * 0.16);
      hub.current.rotation.y = motion.reduced ? 0.4 : state.clock.elapsedTime * 0.6;
    }
    inG.current.forEach((g, i) => g && (g.position.copy(P.ins[i]), (g.position.x -= w * 0.06)));
    outG.current.forEach((g, i) => g && (g.position.copy(P.outs[i]), (g.position.x += w * 0.07)));
  });

  const pw = () => journey.p[2];
  const gate = () => link.s2.fill > 0.97;
  const tube = (from: () => THREE.Vector3, to: () => THREE.Vector3, fill: () => number, out?: { fill: number }, key?: string) => (
    <StreamTube key={key} radius={0.045} segs={40} radial={8} bubbles={motion.low ? 0 : 2} splash={false} out={out} points={() => (P.ok ? bowed(from().clone(), to().clone(), 0.25) : null)} fill={() => (motion.reduced ? 1 : fill())} />
  );

  return (
    <group>
      {[0, 1, 2].map((i) => tube(() => P.entry, () => P.ins[i], () => (gate() ? smooth((pw() - 0.04 - i * 0.03) / 0.16) : 0), undefined, `a${i}`))}
      {[0, 1, 2].map((i) => tube(() => P.ins[i], () => P.hub, () => smooth((pw() - 0.22 - i * 0.03) / 0.16), undefined, `b${i}`))}
      {[0, 1, 2].map((i) => tube(() => P.hub, () => P.outs[i], () => smooth((pw() - 0.4 - i * 0.05) / 0.18), outsFill[i], `c${i}`))}
      <group ref={hub}>
        <mesh>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#fffefb" roughness={0.9} flatShading />
          <Edges color="#1a1a1a" />
        </mesh>
      </group>
      {IN_LABELS.map((t, i) => (
        <group key={t} ref={(g) => { inG.current[i] = g; }}>
          <Label text={t} height={lh} style={{ border: "rgba(31,111,235,0.7)" }} />
        </group>
      ))}
      {OUT_LABELS.map(([t, done], i) => (
        <group key={t} ref={(g) => { outG.current[i] = g; }}>
          <Label text={t} altText={done} height={lh} style={{ border: "rgba(47,158,68,0.35)", color: "#4a4a4a" }} altStyle={{ border: "#2f9e44", bg: "#dcf3df", color: "#1a1a1a" }} alt={() => motion.reduced || outsFill[i].fill > 0.95} />
        </group>
      ))}
    </group>
  );
}

/* ---------------- 4/5. droplet: chart -> "new opportunity" -> AI chat ---------------- */
function Droplet() {
  const m = useRef<THREE.Mesh>(null);
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const mesh = m.current;
    if (!mesh) return;
    const chart = anchorPoint("chart", 0.95, 0.35, a);
    const alert = anchorPoint("alert", 0.08, 0.5, b);
    const chatY = anchorYFrac("chat", 0.1);
    const chat = anchorPoint("chat", 0.5, 0.06);
    link.dropAtChat = false;
    if (motion.reduced || !chart || !alert || !chat || chatY === null) {
      mesh.visible = false;
      link.dropAtChat = !!chat;
      return;
    }
    const t1 = smooth((journey.p[3] - 0.6) / 0.16);
    const t2 = smooth((0.95 - chatY) / 0.45);
    let from = chart, to = alert, t = t1, arc = px2w(90);
    if (t2 > 0) {
      from = alert;
      to = chat;
      t = t2;
      arc = px2w(160);
    }
    link.dropAtChat = t2 > 0.9;
    const visible = t1 > 0.01 && t2 < 0.97;
    mesh.visible = visible;
    if (!visible) return;
    mesh.position.lerpVectors(from, to, t);
    const bounce = t2 > 0 ? Math.abs(Math.sin(t * Math.PI * 3)) * (1 - t) * 0.5 : 0;
    mesh.position.y += Math.sin(t * Math.PI) * arc + bounce * arc;
    mesh.position.z = 0.5;
    const s = px2w(16) * (t2 > 0.8 ? Math.max(0.05, (0.97 - t2) / 0.17) : 1);
    const wob = Math.sin(state.clock.elapsedTime * 9) * 0.08;
    mesh.scale.set(s * (1 + wob), s * (1 - wob + motion.speed * 0.3), s * (1 + wob));
  });
  return (
    <mesh ref={m}>
      <icosahedronGeometry args={[1, 3]} />
      <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.45} roughness={0.2} />
    </mesh>
  );
}

/* ---------------- 6/7. DNA helix that forms, then unzips toward pricing ---------------- */
const RUNG_COLORS = ["#19f0d2", "#5b9cf5", "#4caf6e", "#f2a93b"];
const RUNGS = 12;

function Helix() {
  const H = useMemo(() => ({ ok: false, c: new THREE.Vector3(), w: 1, h: 1, spread: 1, rot: 0 }), []);
  const rungs = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => ({ o: new THREE.Object3D(), a: new THREE.Vector3(), b: new THREE.Vector3(), col: new THREE.Color() }), []);
  const strandA = useMemo(() => ({ fill: 0 }), []);

  const strandPoint = (k: number, phase: number, out: THREE.Vector3) => {
    const R = Math.min(H.w * 0.3, H.h * 0.2) * H.spread;
    const th = (k / 24) * Math.PI * 2 * 1.6 + H.rot + phase;
    return out.set(H.c.x + Math.cos(th) * R, H.c.y + H.h / 2 - (k / 24) * H.h, Math.sin(th) * R);
  };
  const strand = (phase: number) => (H.ok ? Array.from({ length: 25 }, (_, k) => strandPoint(k, phase, new THREE.Vector3())) : null);

  useFrame((state) => {
    const r = anchorRect("helix");
    if (!r) {
      H.ok = link.helixOk = false;
      if (rungs.current) rungs.current.visible = false;
      return;
    }
    toWorld(r.left + r.width / 2, r.top + r.height / 2, H.c);
    H.w = px2w(r.width);
    H.h = px2w(r.height);
    H.rot = motion.reduced ? 0.6 : state.clock.elapsedTime * 0.5;
    const py = anchorYFrac("pricing-top");
    const unzip = motion.reduced || py === null ? 0 : smooth((0.9 - py) / 0.5);
    H.spread = 1 + unzip * 1.6;
    H.ok = link.helixOk = true;
    link.helixTop.set(H.c.x, H.c.y + H.h / 2 + px2w(10), 0);
    link.helixBottom.set(H.c.x, H.c.y - H.h / 2, 0);

    const rm = rungs.current;
    if (!rm) return;
    rm.visible = true;
    const grow = motion.reduced ? 1 : strandA.fill;
    for (let i = 0; i < RUNGS; i++) {
      const k = ((i + 0.5) / RUNGS) * 24;
      strandPoint(k, 0, tmp.a);
      strandPoint(k, Math.PI, tmp.b);
      const on = grow > (i + 0.5) / RUNGS ? 1 : 0;
      tmp.o.position.lerpVectors(tmp.a, tmp.b, 0.5);
      const len = tmp.a.distanceTo(tmp.b) * (1 - unzip);
      tmp.o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tmp.b.clone().sub(tmp.a).normalize());
      tmp.o.scale.set(px2w(5) * on, Math.max(0.0001, len) * on, px2w(5) * on);
      tmp.o.updateMatrix();
      rm.setMatrixAt(i, tmp.o.matrix);
      rm.setColorAt(i, tmp.col.set(RUNG_COLORS[i % 4]));
    }
    rm.instanceMatrix.needsUpdate = true;
    if (rm.instanceColor) rm.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <StreamTube points={() => strand(0)} fill={(c) => headFill(c)} radius={0.06} segs={120} bubbles={motion.low ? 0 : 3} splash={false} out={strandA} />
      <StreamTube points={() => strand(Math.PI)} fill={(c) => headFill(c)} radius={0.06} segs={120} bubbles={motion.low ? 0 : 3} splash={false} color="#5b9cf5" deep="#1f4fae" />
      <instancedMesh ref={rungs} args={[undefined, undefined, RUNGS]} frustumCulled={false}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial roughness={0.4} />
      </instancedMesh>
    </group>
  );
}

/* ---------------- 7. drops into each pricing tile ---------------- */
const TIER_COLORS = ["#f7c948", "#19f0d2", "#5b9cf5", "#4caf6e"];
function PricingDrops() {
  const drops = useRef<(THREE.Mesh | null)[]>([]);
  const from = useMemo(() => new THREE.Vector3(), []);
  const to = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const start = anchorPoint("pricing-top", 0.5, 0.5, from);
    for (let i = 0; i < 4; i++) {
      const m = drops.current[i];
      const yf = anchorYFrac(`price-${i}`, 0);
      const end = anchorPoint(`price-${i}`, 0.5, 0.0, to);
      const t = motion.reduced || yf === null ? 1 : smooth((0.95 - yf) / 0.35 - i * 0.07);
      setAnchorVar(`price-${i}`, "--fill", String(motion.reduced ? 1 : smooth((t - 0.7) / 0.3)));
      if (!m) continue;
      if (!start || !end || t <= 0.01 || t >= 0.99 || motion.reduced) {
        m.visible = false;
        continue;
      }
      m.visible = true;
      m.position.lerpVectors(start, end, t);
      m.position.y += Math.sin(t * Math.PI) * px2w(70);
      m.scale.setScalar(px2w(13));
    }
  });
  return (
    <group>
      {TIER_COLORS.map((c, i) => (
        <mesh key={c} ref={(m) => { drops.current[i] = m; }}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.35} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- DOM responders that aren't tied to a piece ---------------- */
function DomSync() {
  useFrame(() => {
    const by = anchorYFrac("beaker");
    setAnchorVar("beaker", "--fill", String(motion.reduced || by === null ? 1 : smooth((0.85 - by) / 0.35)));
  });
  return null;
}

/* ---------------- the stream segments that hand off between pieces ---------------- */
function Streams() {
  const low = motion.low;
  const seg = low ? 70 : 120;
  const pt = (n: string, fx: number, fy: number) => anchorPoint(n, fx, fy);
  return (
    <>
      {/* 1. flask pour -> laptop screen */}
      <StreamTube out={link.s1} segs={seg} bubbles={low ? 2 : 6} points={() => (link.mouthOk && link.laptopOk ? bowed(link.mouth.clone(), link.screenTop.clone(), 1.1) : null)} fill={(c) => (link.pour < 0.12 ? 0 : headFill(c))} />
      {/* 2. browser CTA -> workflow channels */}
      <StreamTube out={link.s2} segs={seg} bubbles={low ? 2 : 6} points={() => (link.laptopOk && link.graphOk ? bowed(link.cta.clone(), link.graphIn.clone(), 0.9) : null)} fill={(c) => (journey.p[1] < 0.55 ? 0 : headFill(c))} />
      {/* 3. merged channels -> dashboard chart */}
      <StreamTube segs={seg} bubbles={low ? 2 : 5} points={() => {
        const c = pt("chart", 0.04, 0.55);
        return link.graphOk && c ? bowed(link.graphOut.clone(), c, 0.8) : null;
      }} fill={(c) => (journey.p[2] < 0.6 ? 0 : headFill(c))} />
      {/* 4. AI chat -> DNA helix */}
      <StreamTube segs={seg} bubbles={low ? 2 : 5} points={() => {
        const c = pt("chat", 0.92, 0.04);
        return c && link.helixOk ? bowed(c, link.helixTop.clone(), 1) : null;
      }} fill={(c) => (link.dropAtChat ? headFill(c) : 0)} />
      {/* 5. helix -> down the gutter -> pricing */}
      <StreamTube segs={low ? 120 : 220} radius={0.07} bubbles={low ? 3 : 10} points={() => {
        const g1a = pt("gutter-1", 0.5, 0), g1b = pt("gutter-1", 0.5, 1), g2a = pt("gutter-2", 0.5, 0), g2b = pt("gutter-2", 0.5, 1), p = pt("pricing-top", 0.5, 0.5);
        if (!link.helixOk || !p) return null;
        return [link.helixBottom.clone(), ...[g1a, g1b, g2a, g2b].filter((x): x is THREE.Vector3 => !!x), p];
      }} fill={(c) => headFill(c, 160)} />
      {/* 6. leftover -> beaker by the form */}
      <StreamTube segs={low ? 80 : 140} radius={0.07} bubbles={low ? 2 : 6} points={() => {
        const a = pt("pricing-end", 0.5, 0.5), g3a = pt("gutter-3", 0.5, 0), g3b = pt("gutter-3", 0.5, 1), b = pt("beaker", 0.5, 0.05);
        if (!a || !b) return null;
        return [a, ...[g3a, g3b].filter((x): x is THREE.Vector3 => !!x), b];
      }} fill={(c) => headFill(c, 120)} />
    </>
  );
}

export default function HandoffScene({ active }: { active: boolean }) {
  const [dpr, setDpr] = useState(1.5);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    motion.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motion.low = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    setReady(true);
  }, []);
  if (!ready) return null;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 60 }}
      gl={{ antialias: !motion.low, alpha: true, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 6, 8]} intensity={0.9} />
      <MotionRig />
      <Flask />
      <Laptop />
      <Graph />
      <Droplet />
      <Helix />
      <PricingDrops />
      <DomSync />
      <Streams />
    </Canvas>
  );
}
