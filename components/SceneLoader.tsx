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
    const EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;
    const go = () => {
      EVENTS.forEach((e) => window.removeEventListener(e, go));
      if (hasWebGL()) setReady(true); // probing WebGL creates a context, so it waits for the interaction too
    };
    if (window.scrollY > 0) return go(); // landed mid-page (hash link / restored scroll)
    EVENTS.forEach((e) => window.addEventListener(e, go, { passive: true }));
    return () => EVENTS.forEach((e) => window.removeEventListener(e, go));
  }, []);

  // Only render while one of the pinned 3D chapters is on screen. Chapters can hydrate later (their DOM is then
  // replaced), so each one announces itself with "chapter-mounted" and we re-observe the current elements.
  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setActive(visible.size > 0);
    });
    const observe = () => {
      io.disconnect();
      visible.clear();
      document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));
    };
    observe();
    window.addEventListener("chapter-mounted", observe);
    return () => {
      window.removeEventListener("chapter-mounted", observe);
      io.disconnect();
    };
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
