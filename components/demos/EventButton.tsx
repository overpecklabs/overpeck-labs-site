"use client";

import type { ReactNode } from "react";

/** A button that dispatches a window event (e.g. "open the chat"), so server-rendered demo pages can use it. */
export default function EventButton({ event, className, style, children }: { event: string; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  return (
    <button type="button" className={className} style={style} onClick={() => window.dispatchEvent(new Event(event))}>
      {children}
    </button>
  );
}
