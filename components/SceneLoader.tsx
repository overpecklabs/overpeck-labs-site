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

  // Stop rendering once the pinned journey has scrolled out of view.
  useEffect(() => {
    const el = document.getElementById("journey");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        visibility: active ? "visible" : "hidden",
        background:
          "radial-gradient(60% 50% at 70% 40%, rgba(155,107,255,0.18), transparent 70%), radial-gradient(50% 40% at 20% 70%, rgba(25,240,210,0.10), transparent 70%), #05060d",
      }}
    >
      {ready && <Scene active={active} />}
    </div>
  );
}
