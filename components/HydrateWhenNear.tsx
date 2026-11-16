"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { whenNear } from "@/lib/whenNear";

// True once the first page load has hydrated: later (client-side) mounts render their children right away.
let loaded = false;

/**
 * Lazy hydration for below-the-fold homepage sections. The server HTML is rendered as usual (same look, links
 * work as plain links), but React leaves it untouched until the section comes within half a screen of the
 * viewport, then renders it for real (identical DOM, now interactive). This keeps hydration from blocking the
 * main thread at load. The wrapper is `display: contents`, so layout is unchanged.
 */
export default function HydrateWhenNear({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(() => typeof window === "undefined" || loaded);

  useEffect(() => {
    loaded = true;
    if (on || !ref.current) return;
    // `contents` boxes don't intersect, so watch the section inside
    const target = ref.current.firstElementChild ?? ref.current;
    return whenNear(target, () => setOn(true), "50% 0px");
  }, [on]);

  if (on) return <div ref={ref} className="contents">{children}</div>;
  // keeps the server-rendered children in place without hydrating them
  return <div ref={ref} className="contents" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />;
}
