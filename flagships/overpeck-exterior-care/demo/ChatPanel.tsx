"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { data } from "./data";

/**
 * Chat panel: AI SDK useChat -> /api/demo/overpeck-exterior-care/chat (Vercel AI Gateway).
 * If the AI isn't configured (or errors), it switches to a scripted demo conversation. Capped per session.
 */

const API = "/api/demo/overpeck-exterior-care/chat";
const transport = new DefaultChatTransport({ api: API });
const MAX_USER_MESSAGES = 8;
const COUNT_KEY = "oe-chat-count";
const GREETING = "Hi! I'm the Overpeck Exterior Care assistant. Ask me about windows, soft washing, power washing or gutters, or let's set up your free estimate.";
const SUGGESTIONS = ["Is soft washing safe for vinyl?", "Black streaks on my roof", "Book a free estimate"];

type Line = { id: string; role: "user" | "assistant"; text: string };

function scriptedReply(text: string): string {
  const t = text.toLowerCase();
  const call = data.phone.display;
  if (/price|cost|how much|quote|estimate/.test(t))
    return `Every home is different, so we don't quote prices in chat. The fastest way to a free estimate: tap "Get my free quote" at the top, then add your address, stories and a few photos. Or call ${call}.`;
  if (/soft ?wash|siding|mildew|mold|green|vinyl|stucco/.test(t))
    return "Soft washing is the safe way to clean siding: low pressure, about like a garden hose, plus a gentle cleaning solution that lifts the grime. It's safe for vinyl, stucco and painted wood. Want a free estimate? Tell me your town and roughly how many stories.";
  if (/roof|streak|shingle|black/.test(t))
    return "Those black streaks are algae. We soft wash roofs with gentle, low pressure (never high pressure), so they come clean without loosening shingle granules. Is it the whole roof or one side? I can help you request a free estimate.";
  if (/window|screen|glass|track/.test(t))
    return "We clean windows inside and out, wash the screens and wipe the tracks and sills. Most homes book spring and fall. How many windows, roughly, and is it a one- or two-story home?";
  if (/driveway|patio|paver|walk|oil|concrete|power ?wash|pressure/.test(t))
    return "Power washing is great for driveways, walkways, patios and pavers, and we pre-treat oil and rust spots. Very old stains can leave a shadow, and we'll tell you honestly up front. What surface do you want cleaned?";
  if (/gutter|leaves|downspout/.test(t))
    return "We clear gutters by hand, flush the downspouts and brighten the gutter faces. Fall is the busiest time, so it's worth booking early. What town are you in?";
  if (/deck|fence|wood/.test(t))
    return "We can bring gray, weathered wood back and leave it ready for stain or sealer. Is it a wood or composite deck, and about how big?";
  if (/plant|pet|dog|cat|garden|lawn/.test(t))
    return "We wet down plants and lawns before and after, rinse thoroughly and cover delicate plants when needed. Keep pets inside while we work; once everything's rinsed and dry, the yard is fine for them.";
  if (/home|there|present|rain|weather/.test(t))
    return "You don't need to be home for exterior work, just yard access and an outdoor spigot. Light rain doesn't stop soft or power washing; for storms or high wind we reschedule.";
  return "Happy to help! What would you like cleaned (windows, house, roof, driveway, deck, gutters or a storefront), and which town are you in? I can get your free estimate started.";
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
      id="oe-chat"
      role="dialog"
      aria-label="Overpeck Exterior Care AI assistant (demo)"
      hidden={!open}
      className="w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/15 bg-[#06232a]/85 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0e7490]/45 to-[#34d399]/20 px-4 py-3">
        <div>
          <p className="text-sm font-bold">Overpeck Exterior Care</p>
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
          <p key={m.id} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "assistant" ? "rounded-bl-md bg-white/10" : "ml-auto rounded-br-md bg-gradient-to-br from-[#0e7490] to-[#0ea5a4]"}`}>
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
            or tap &quot;Get my free quote&quot; at the top.
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
        <label htmlFor="oe-chat-input" className="sr-only">
          Message
        </label>
        <input
          ref={inputRef}
          id="oe-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          disabled={capped}
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-[#34d399] focus:outline-none disabled:opacity-50"
          placeholder={capped ? "Message limit reached" : "Ask about a cleaning job…"}
        />
        <button type="submit" disabled={busy || capped || !input.trim()} className="rounded-full bg-[#34d399] px-4 text-sm font-extrabold text-slate-950 disabled:opacity-50">
          Send
        </button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-white/45">Demo website assistant. It answers questions and points you to the free quote form; it can&apos;t book or send anything itself.</p>
    </div>
  );
}
