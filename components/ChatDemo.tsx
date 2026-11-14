"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/lib/journey";
import { useScriptPlayer } from "@/lib/useScriptPlayer";

type Msg = { from: "customer" | "ai"; text: string; typing?: boolean };

// Entirely scripted. No AI model or real customer is involved.
const SCRIPT: Msg[] = [
  { from: "customer", text: "Hi, my kitchen sink is leaking under the cabinet. Can someone come today?" },
  { from: "ai", typing: true, text: "Sorry about that! I can get a plumber out. Is water running right now, or is it a slow drip?" },
  { from: "customer", text: "Slow drip, but the cabinet is getting wet." },
  { from: "ai", typing: true, text: "Got it. I have openings today at 3:30 PM or 5:00 PM, or tomorrow at 9:00 AM. Which works?" },
  { from: "customer", text: "3:30 today please." },
  { from: "ai", typing: true, text: "Booked! A tech will arrive 3:30 to 4:30 PM today. What's the service address and best phone number?" },
  { from: "customer", text: "12 Example St, Hackensack. 201-555-0123" },
  { from: "ai", typing: true, text: "Thanks! A confirmation text is on its way. We'll also send a quick review request after the job." },
];

export default function ChatDemo({ className = "" }: { className?: string }) {
  const { shown, typing, play } = useScriptPlayer(SCRIPT, 4);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: journey.reduced ? "auto" : "smooth" });
  }, [shown, typing]);

  const booked = shown >= 6;

  return (
    <div className={`glass flex w-full flex-col rounded-3xl !bg-[#0a0d1c]/85 p-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-teal to-violet text-xs font-bold text-black">AI</span>
          <div>
            <div className="text-sm font-semibold">AI Chat Bot</div>
            <div className="text-[11px] text-teal">Sample Plumbing Co. · website chat</div>
          </div>
        </div>
        <button onClick={play} className="rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/10">
          Replay
        </button>
      </div>

      <div ref={box} className="my-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-sm" aria-live="polite">
        {SCRIPT.slice(0, shown).map((m, i) => (
          <div key={i} className={`flex ${m.from === "customer" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-snug ${
                m.from === "customer" ? "rounded-br-sm bg-violet/80 text-white" : "rounded-bl-sm bg-white/10 text-white/90"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 rounded-full bg-white/80" style={{ animation: `blink 1s ${d * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`rounded-xl border border-teal/40 bg-teal/10 px-3 py-2 text-xs font-semibold text-teal transition-opacity ${booked ? "opacity-100" : "opacity-0"}`}>
        ✓ Job booked · today 3:30 PM · Leaking sink
      </div>
      <p className="mt-2 text-center text-[10px] uppercase tracking-wider text-white/45">Demo · scripted · not a real customer</p>
    </div>
  );
}
