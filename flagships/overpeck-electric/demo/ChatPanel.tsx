"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { data } from "./data";

/**
 * Chat panel: AI SDK useChat -> /api/demo/overpeck-electric/chat (Vercel AI Gateway).
 * If the AI isn't configured (or errors), it switches to a scripted demo conversation. Capped per session.
 */

const API = "/api/demo/overpeck-electric/chat";
const transport = new DefaultChatTransport({ api: API });
const MAX_USER_MESSAGES = 8;
const COUNT_KEY = "el-chat-count";
const GREETING = "Hi! I'm the Overpeck Electric assistant. Is anything sparking, smelling hot or without power? If not, ask me about panels, EV chargers, lighting or generators.";
const SUGGESTIONS = ["My breaker keeps tripping", "Do I need a panel upgrade for an EV charger?", "Book a free estimate"];

type Line = { id: string; role: "user" | "assistant"; text: string };

function scriptedReply(text: string): string {
  const t = text.toLowerCase();
  const call = data.phone.display;
  if (/power line|line down|downed|wire down|wires down/.test(t))
    return "Stay at least 30 feet away from the downed line and keep everyone back. Call 911 and your utility (PSE&G in most of Bergen County) right now. Never touch the line or anything it's touching.";
  if (/spark|burn|smoke|smell|hot outlet|melt|buzz|shock|no power|power out|outage|lost power/.test(t))
    return `Safety first: if you see sparks or smell burning, turn off the breaker for that area if you can do it safely, unplug nearby devices and stay away from it. If there's smoke or fire, get out and call 911. Then call us at ${call} so an electrician can help right away.`;
  if (/price|cost|how much|quote|estimate/.test(t))
    return `Every job is different, so we don't quote prices in chat. The fastest way to a free estimate: tap "Get my free estimate" at the top, then add your address and a photo of your panel. Or call ${call}.`;
  if (/ev|charger|tesla|electric car|level 2/.test(t))
    return "For a Level 2 EV charger we start with a quick load calculation. Many 200-amp panels can add one; older 100-amp panels may need an upgrade or load management. Where would the charger go, garage or driveway, and how far from your panel?";
  if (/panel|breaker|fuse|amp|tripping|trip/.test(t))
    return "Repeated tripping is a warning sign, so it's worth having it checked rather than resetting it. Is it one breaker or several, and do you know your panel size (100, 150 or 200 amps)? I can help you request a free estimate.";
  if (/light|recessed|dimmer|fixture|led/.test(t))
    return "We install recessed lights, under-cabinet LEDs, dimmers and outdoor lighting, usually with minimal patching. Which rooms, and roughly how many lights are you thinking?";
  if (/generator|storm|transfer switch/.test(t))
    return "A standby generator with a transfer switch keeps the essentials on in an outage. Do you want whole-home backup or just key circuits like the fridge, sump pump and heat?";
  if (/inspect|sale|buyer|gfci|afci|code/.test(t))
    return "Our safety inspection covers the panel, wiring, grounding and GFCI/AFCI protection, with a written report. Is this for a home sale or your own peace of mind?";
  return "Happy to help! What do you need (panel upgrade, EV charger, lighting, generator, troubleshooting or an inspection), and which town are you in? I can get your free estimate started.";
}

function readCount(): number {
  try {
    return Number(sessionStorage.getItem(COUNT_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}
function bumpCount(n: number) {
  try {
    sessionStorage.setItem(COUNT_KEY, String(n));
  } catch {}
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"checking" | "ai" | "scripted">("checking");
  const [note, setNote] = useState("");
  const [input, setInput] = useState("");
  const [scripted, setScripted] = useState<Line[]>([]);
  const [typing, setTyping] = useState(false);
  const [count, setCount] = useState(0);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCount(readCount());
    let cancelled = false;
    fetch(API, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { ai: false }))
      .then((j: { ai?: boolean }) => !cancelled && setMode(j.ai ? "ai" : "scripted"))
      .catch(() => !cancelled && setMode("scripted"));
    return () => {
      cancelled = true;
    };
  }, []);

  // Any AI error (not configured, rate limit, network): carry on with the scripted demo.
  useEffect(() => {
    if (!error || mode !== "ai") return;
    setNote(/limit|many/i.test(error.message) ? "The AI is busy right now, so this continues as a scripted demo." : "The AI isn't available right now, so this continues as a scripted demo.");
    const kept = messages.map((m): Line => ({ id: m.id, role: m.role === "user" ? "user" : "assistant", text: m.parts.map((p) => (p.type === "text" ? p.text : "")).join("") })).filter((l) => l.text);
    // answer the message the AI couldn't, so the visitor isn't left hanging
    const last = kept[kept.length - 1];
    if (last?.role === "user") kept.push({ id: `${last.id}-r`, role: "assistant", text: scriptedReply(last.text) });
    setScripted(kept);
    setMode("scripted");
  }, [error, mode, messages]);

  const lines: Line[] =
    mode === "ai"
      ? messages.map((m) => ({ id: m.id, role: m.role === "user" ? "user" : "assistant", text: m.parts.map((p) => (p.type === "text" ? p.text : "")).join("") }))
      : scripted;
  const busy = typing || status === "submitted" || status === "streaming";
  const capped = count >= MAX_USER_MESSAGES;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [lines.length, lines[lines.length - 1]?.text, busy]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  }, [open]);

  function send(text: string) {
    const t = text.trim().slice(0, 500);
    if (!t || busy || capped || mode === "checking") return;
    const n = count + 1;
    setCount(n);
    bumpCount(n);
    setInput("");
    if (mode === "ai") {
      sendMessage({ text: t });
      return;
    }
    const id = `${Date.now()}`;
    setScripted((s) => [...s, { id, role: "user", text: t }]);
    setTyping(true);
    setTimeout(() => {
      setScripted((s) => [...s, { id: `${id}-r`, role: "assistant", text: scriptedReply(t) }]);
      setTyping(false);
    }, 700);
  }

  return (
    <div
      id="el-chat"
      role="dialog"
      aria-label="Overpeck Electric AI assistant (demo)"
      hidden={!open}
      className="w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/15 bg-[#121826]/90 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#f59e0b]/30 to-[#facc15]/10 px-4 py-3">
        <div>
          <p className="text-sm font-bold">Overpeck Electric</p>
          <p className="text-xs text-white/70">
            AI assistant (demo){mode === "scripted" && " · scripted"}
          </p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full px-2 py-1 text-lg leading-none text-white/70 hover:text-white" aria-label="Close chat">
          ×
        </button>
      </div>
      <div ref={listRef} className="h-[min(22rem,50vh)] space-y-2.5 overflow-y-auto p-4" aria-live="polite">
        <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2.5 text-sm">{GREETING}</p>
        {lines.map((m) => (
          <p key={m.id} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "assistant" ? "rounded-bl-md bg-white/10" : "ml-auto rounded-br-md bg-gradient-to-br from-[#b45309] to-[#d97706]"}`}>
            {m.text}
          </p>
        ))}
        {busy && lines[lines.length - 1]?.role !== "assistant" && (
          <p className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-3" aria-label="Assistant is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </p>
        )}
        {!lines.length && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/15">
                {s}
              </button>
            ))}
          </div>
        )}
        {note && <p className="rounded-xl bg-amber-300/15 px-3 py-2 text-xs text-amber-100">{note}</p>}
        {capped && (
          <p className="rounded-xl bg-white/10 px-3 py-2 text-xs text-white/80">
            That&apos;s the message limit for this demo chat. Call{" "}
            <a href={data.phone.tel} className="font-bold underline">
              {data.phone.display}
            </a>{" "}
            or tap &quot;Get my free estimate&quot; at the top.
          </p>
        )}
      </div>
      <form
        className="flex gap-2 border-t border-white/10 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="el-chat-input" className="sr-only">
          Message
        </label>
        <input
          ref={inputRef}
          id="el-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          disabled={capped}
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-[#facc15] focus:outline-none disabled:opacity-50"
          placeholder={capped ? "Message limit reached" : "Ask an electrical question…"}
        />
        <button type="submit" disabled={busy || capped || !input.trim()} className="rounded-full bg-[#facc15] px-4 text-sm font-extrabold text-slate-950 disabled:opacity-50">
          Send
        </button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-white/45">Demo assistant. It can&apos;t book or send anything; for emergencies, call.</p>
    </div>
  );
}
