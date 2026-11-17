"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Floating glass chat bubble. The panel (and the AI SDK) only loads when it's opened, so the first screen stays
 * fast. Hidden on phones until the visitor scrolls. Anything can open it with: window.dispatchEvent(new Event(OPEN_CHAT)).
 */

export const OPEN_CHAT = "oe-chat-open";

const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 500));
    };
    const openIt = () => {
      setLoaded(true);
      setOpen(true);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener(OPEN_CHAT, openIt);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener(OPEN_CHAT, openIt);
    };
  }, []);

  return (
    <div className={`oe-chat-wrap fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-3 z-40 flex-col items-end gap-3 sm:bottom-6 sm:right-4 sm:flex ${scrolled || open ? "flex" : "hidden"} ${open ? "oe-chat-open" : ""}`}>
      {loaded && <ChatPanel open={open} onClose={() => setOpen(false)} />}
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-controls="oe-chat"
        className="demo-lift flex items-center gap-2 rounded-full border border-white/20 bg-[#06232a]/75 p-2.5 text-sm sm:px-4 sm:py-3 font-bold text-white shadow-[0_12px_40px_-10px_rgba(52,211,153,0.55)] backdrop-blur-xl"
      >
        <span className="relative grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#0e7490] to-[#34d399]" aria-hidden>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5h16v11H8l-4 4z" />
          </svg>
          {!open && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#06232a]" />}
        </span>
        {/* phones: icon only (the label stays for screen readers), so it covers as little as possible */}
        <span className="sr-only sm:not-sr-only">{open ? "Close chat" : "Ask our AI assistant"}</span>
      </button>
    </div>
  );
}
