"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// 3D is code-split and only fetched on the client after first paint.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function SceneLoader() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!hasWebGL()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setReady(true), { timeout: 1200 });
    else setTimeout(() => setReady(true), 200);
  }, []);

  // Only render while one of the pinned 3D chapters is on screen.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-chapter]"));
    if (!els.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setActive(visible.size > 0);
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="board-bg pointer-events-none fixed inset-0 z-0"
      style={{ visibility: active ? "visible" : "hidden" }}
    >
      {ready && <Scene active={active} />}
    </div>
  );
}
