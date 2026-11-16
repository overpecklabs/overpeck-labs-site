"use client";

/* Party Bus 360: the interactive bits of the page (client islands). The rest of the page is server-rendered. */

import { useEffect, useState } from "react";

const DEMO_MSG = "Demo only, this form isn't connected yet.";

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
function TextIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <Icon className={className} d="M4 5h16v11H8l-4 4z" />;
}

function DemoNote({ show }: { show: boolean }) {
  return show ? (
    <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
      {DEMO_MSG}
    </p>
  ) : null;
}

/** Splits a quote total across the group: uses only numbers the visitor types in. */
export function CostSplitter() {
  const [total, setTotal] = useState("");
  const [people, setPeople] = useState("");
  const t = Number(total.replace(/[$,]/g, ""));
  const p = Math.floor(Number(people));
  const each = t > 0 && p > 0 ? t / p : null;
  const field = "mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 text-base text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none focus:ring-4 focus:ring-[#fbbf24]/20";
  return (
    <div className="rounded-3xl bg-[#0b1020] p-6 text-white sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbbf24]">Splitting the ride?</p>
      <h3 className="mt-2 text-2xl font-extrabold">Per-person cost calculator</h3>
      <p className="mt-2 text-sm text-white/70">Enter your quote total and group size to see what everyone owes.</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="pb-total" className="block text-sm font-semibold text-white/85">
            Quote total ($)
          </label>
          <input id="pb-total" inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} className={field} placeholder="0" />
        </div>
        <div>
          <label htmlFor="pb-people" className="block text-sm font-semibold text-white/85">
            People
          </label>
          <input id="pb-people" inputMode="numeric" value={people} onChange={(e) => setPeople(e.target.value)} className={field} placeholder="0" />
        </div>
      </div>
      <p className="mt-5 rounded-2xl bg-white/[0.06] px-4 py-4 text-center" aria-live="polite">
        <span className="block text-sm text-white/70">Each person pays</span>
        <span className="mt-1 block text-3xl font-extrabold text-[#fbbf24]">{each ? `$${each.toFixed(2)}` : "—"}</span>
      </p>
    </div>
  );
}

const CHAT = [
  { from: "bot", text: "Hi! I'm the Party Bus 360 assistant. Planning a wedding, a night out or a corporate event?" },
  { from: "you", text: "A birthday night out for 18 people on a Saturday." },
  { from: "bot", text: "Fun! I can get you an instant quote. What town should we pick you up from, and for how many hours?" },
];

/** AI assistant preview. Scripted, display-only. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 500);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const [sent, setSent] = useState(false);
  return (
    <div className={`fixed bottom-24 right-4 z-40 flex-col items-end gap-3 sm:bottom-6 sm:flex ${scrolled || open ? "flex" : "hidden"}`}>
      {open && (
        <div id="pb-chat" role="dialog" aria-label="Party Bus 360 assistant (demo)" className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#0b1020] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">Party Bus 360 assistant</p>
              <p className="text-xs text-white/60">AI assistant preview (demo)</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full px-2 py-1 text-lg leading-none text-white/70 hover:text-white" aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="space-y-2.5 p-4">
            {CHAT.map((m, i) => (
              <p key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === "bot" ? "rounded-bl-md bg-slate-100 text-slate-800" : "ml-auto rounded-br-md bg-[#7c3aed] text-white"}`}>
                {m.text}
              </p>
            ))}
            <DemoNote show={sent} />
          </div>
          <form
            className="flex gap-2 border-t border-slate-100 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="pb-chat-input" className="sr-only">
              Message
            </label>
            <input id="pb-chat-input" className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm focus:border-[#7c3aed] focus:outline-none" placeholder="Ask about booking…" />
            <button type="submit" className="rounded-full bg-[#7c3aed] px-4 text-sm font-bold text-white hover:bg-[#6d28d9]">
              Send
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="pb-chat"
        className="flex items-center gap-2 rounded-full bg-[#7c3aed] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-8px_rgba(124,58,237,0.7)] hover:bg-[#6d28d9]"
      >
        <TextIcon className="h-5 w-5" />
        {open ? "Close" : "Ask us anything"}
      </button>
    </div>
  );
}

