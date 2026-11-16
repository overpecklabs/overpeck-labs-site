"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// 3D is code-split and only fetched on the first interaction (scroll, touch, key, mouse move): it only shows once
// you scroll into the pinned chapters, so the initial load never pays for three.js.
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
    const EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;
    const go = () => {
      EVENTS.forEach((e) => window.removeEventListener(e, go));
      setReady(true);
    };
    if (window.scrollY > 0) return go(); // landed mid-page (hash link / restored scroll)
    EVENTS.forEach((e) => window.addEventListener(e, go, { passive: true }));
    return () => EVENTS.forEach((e) => window.removeEventListener(e, go));
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
