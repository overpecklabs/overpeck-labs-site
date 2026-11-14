"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The handoff scene is code-split and only fetched on the client after first paint.
const HandoffScene = dynamic(() => import("./handoff/HandoffScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * One fixed, full-screen canvas behind the homepage (pointer-events none) carrying the
 * continuous liquid stream. It stays on for the whole page and pauses when the tab is hidden.
 * The whiteboard texture lives on this backdrop so every section reads as one board.
 */
export default function SceneLoader() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!hasWebGL()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setReady(true), { timeout: 1200 });
    else setTimeout(() => setReady(true), 200);
  }, []);

  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div aria-hidden className="board-bg pointer-events-none fixed inset-0 z-0">
      {ready && <HandoffScene active={active} />}
    </div>
  );
}
