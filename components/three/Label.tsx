"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { journey } from "@/lib/journey";

type Style = { color?: string; bg?: string; border?: string };

/** Draws a pill label to a canvas texture: no font files are fetched, and it hides with its parent group. */
function makeLabel(text: string, { color = "#1a1a1a", bg = "rgba(255,254,251,0.97)", border = "rgba(15,118,110,0.7)" }: Style) {
  const H = 112;
  const pad = 40;
  const font = "600 46px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  c.width = w;
  c.height = H;
  ctx.font = font;
  const r = H / 2 - 4;
  ctx.beginPath();
  ctx.roundRect(3, 3, w - 6, H - 6, r);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, pad, H / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: w / H };
}

type Props = {
  text: string;
  position?: [number, number, number];
  height?: number;
  style?: Style;
  /** optional second state (e.g. checked off) chosen by scroll progress */
  altText?: string;
  altStyle?: Style;
  alt?: (p: number[]) => boolean;
};

export default function Label({ text, position = [0, 0, 0], height = 0.36, style = {}, altText, altStyle = {}, alt }: Props) {
  const sprite = useRef<THREE.Sprite>(null);
  const mat = useRef<THREE.SpriteMaterial>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const a = useMemo(() => makeLabel(text, style), [text]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const b = useMemo(() => (altText ? makeLabel(altText, altStyle) : null), [altText]);

  useEffect(
    () => () => {
      a.tex.dispose();
      b?.tex.dispose();
    },
    [a, b]
  );

  useFrame(() => {
    if (!b || !alt || !mat.current || !sprite.current) return;
    const cur = alt(journey.p) ? b : a;
    if (mat.current.map !== cur.tex) {
      mat.current.map = cur.tex;
      mat.current.needsUpdate = true;
      sprite.current.scale.set(height * cur.aspect, height, 1);
    }
  });

  return (
    <sprite ref={sprite} renderOrder={10} position={position} scale={[height * a.aspect, height, 1]}>
      <spriteMaterial ref={mat} map={a.tex} transparent depthWrite={false} toneMapped={false} fog={false} />
    </sprite>
  );
}
