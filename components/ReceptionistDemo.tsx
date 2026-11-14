"use client";

import { useEffect, useRef } from "react";
import { useScriptPlayer } from "@/lib/useScriptPlayer";

type Step = { kind: "event" | "ai" | "caller" | "booked"; text: string; tone?: "warn" | "ai" | "ok"; typing?: boolean };

// Entirely scripted. No AI model, phone call or real customer is involved.
const STEPS: Step[] = [
  { kind: "event", text: "Incoming call · (201) 555-0148" },
  { kind: "event", tone: "warn", text: "You're on a job. Call not answered." },
  { kind: "event", tone: "ai", text: "AI Receptionist picked up" },
  { kind: "ai", typing: true, text: "Thanks for calling Sample Plumbing! How can I help?" },
  { kind: "caller", text: "My water heater stopped working." },
  { kind: "ai", typing: true, text: "I can get a tech out. Does tomorrow at 10 AM work?" },
  { kind: "caller", text: "Yes, that works." },
  { kind: "booked", text: "Job booked · Tomorrow 10 AM · Water heater" },
  { kind: "event", tone: "ok", text: "Owner notified by text" },
];

const tone = {
  warn: "border-amber-400/40 bg-amber-400/10 text-amber-800",
  ai: "border-violet/50 bg-violet/15 text-violet",
  ok: "border-teal/40 bg-teal/10 text-teal-ink",
};

export default function ReceptionistDemo({ className = "", standalone = false }: { className?: string; standalone?: boolean }) {
  const { shown, typing, play } = useScriptPlayer(STEPS, standalone ? -1 : 4, 0.2, 0.9);
  const rootRef = useRef<HTMLDivElement>(null);
  // standalone pages: start playing once the demo scrolls into view
  useEffect(() => {
    if (!standalone || !rootRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        play();
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [standalone, play]);
  const ringing = shown < 2;

  return (
    <div ref={rootRef} className={`mx-auto flex w-full max-w-[250px] flex-col rounded-[2.2rem] border border-ink/30 bg-ink p-2.5 shadow-[0_8px_24px_rgba(26,26,26,0.10)] ${className}`}>
      <div className="flex min-h-0 flex-1 flex-col rounded-[1.8rem] border border-ink/10 bg-gradient-to-b from-white to-[#f3f6fb] px-3 pb-3 pt-2">
        <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-ink/15" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-semibold">AI Call Receptionist</div>
            <div className="text-[10px] text-ink/70">Sample Plumbing Co.</div>
          </div>
          <button onClick={play} className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[10px] hover:bg-ink/5">
            Replay
          </button>
        </div>

        <div className="my-3 grid place-items-center">
          <div className={`grid h-12 w-12 place-items-center rounded-full ${ringing ? "bg-amber-400/20 text-amber-800" : "bg-teal/20 text-teal-ink"}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden text-[11.5px] leading-snug" aria-live="polite">
          {STEPS.slice(0, shown).map((s, i) =>
            s.kind === "event" ? (
              <div key={i} className={`rounded-lg border px-2 py-1 text-center text-[10.5px] font-semibold ${s.tone ? tone[s.tone] : "border-ink/10 bg-ink/5 text-ink/80"}`}>
                {s.text}
              </div>
            ) : s.kind === "booked" ? (
              <div key={i} className="rounded-lg border border-teal/50 bg-teal/15 px-2 py-1.5 text-center text-[11px] font-bold text-teal-ink">
                ✓ {s.text}
              </div>
            ) : (
              <div key={i} className={`flex ${s.kind === "caller" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-xl px-2.5 py-1.5 ${s.kind === "caller" ? "bg-ink/5 text-ink/90" : "bg-mk-blue text-white"}`}>
                  {s.kind === "ai" ? "AI: " : "Caller: "}
                  {s.text}
                </div>
              </div>
            )
          )}
          {typing && <div className="text-[10.5px] italic text-violet">AI is speaking…</div>}
        </div>
        <p className="mt-2 text-center text-[9.5px] uppercase tracking-wider text-ink/70">Demo · scripted · not a real customer</p>
      </div>
    </div>
  );
}
