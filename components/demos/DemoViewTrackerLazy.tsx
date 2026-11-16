"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Loads <DemoViewTracker> (and the Supabase client it needs) as a separate chunk once the browser is idle after
 * the first paint, instead of in every demo page's first-load bundle. Records exactly the same single view
 * (same skips: ?preview=1, signed-in admins, bots). Used by app/demo/[slug]/page.tsx for every demo.
 */
const Tracker = dynamic(() => import("./DemoViewTracker"), { ssr: false });

export default function DemoViewTrackerLazy({ slug }: { slug: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 2500);
    return () => clearTimeout(t);
  }, []);
  return ready ? <Tracker slug={slug} /> : null;
}
