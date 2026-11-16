"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { data } from "./data";

/**
 * Chat panel: AI SDK useChat -> /api/demo/overpeck-plumbing/chat (Google Gemini).
 * If the AI isn't configured (or errors), it switches to a scripted demo conversation. Capped per session.
 */

const API = "/api/demo/overpeck-plumbing/chat";
const transport = new DefaultChatTransport({ api: API });
const MAX_USER_MESSAGES = 8;
const COUNT_KEY = "op-chat-count";
const GREETING = "Hi! I'm the Overpeck Plumbing assistant. Is this an emergency, or can I help with a question or a quote?";
const SUGGESTIONS = ["My pipe just burst!", "Why does my drain keep clogging?", "Quote for a new water heater"];

type Line = { id: string; role: "user" | "assistant"; text: string };

function scriptedReply(text: string): string {
  const t = text.toLowerCase();
  if (/burst|flood|sewage|backing up|gas|no water|spray|pouring|ceiling/.test(t))
    return `That sounds like an emergency. Please call ${data.phone.display} right now. While you wait: shut off the main water valve (usually near the water meter where the line enters the house) and keep away from water near outlets. If you smell gas, leave the building and call the gas company or 911 from outside.`;
  if (/clog|drain|slow|backup/.test(t))
    return "Repeat clogs usually mean buildup further down the line: grease, hair or roots. A camera inspection shows the cause, and hydro-jetting clears the pipe walls. Want a plumber to take a look? Tell me your town and how soon you need someone.";
  if (/water heater|hot water|tankless/.test(t))
    return "Happy to help with that. Is it a tank or tankless heater, and roughly how old is it? Most tanks last about 8 to 12 years, so age helps decide repair vs. replace.";
  if (/price|cost|quote|estimate|how much/.test(t))
    return "You'll always get an upfront price before any work starts. To get a quote moving: what's the job, what town are you in, and when works for you? Then tap \"Get help now\" at the top to send it.";
  if (/toilet|faucet|disposal|leak|drip/.test(t))
    return "We can fix that, usually in one visit. Is water actively leaking right now? If so, turn the shut-off valve behind the fixture clockwise. Then tell me your town and a good time, and tap \"Get help now\" at the top.";
  if (/hackensack|teaneck|englewood|fort lee|paramus|ridgewood|bergen|town|area/.test(t))
    return "Yes, we cover all of Bergen County. What's going on, and when would you like a plumber to come by?";
  return "Got it. Could you tell me a bit more: what's happening, how urgent it is, and your town? For anything urgent, calling " + data.phone.display + " is fastest.";
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
      id="op-chat"
      role="dialog"
      aria-label="Overpeck Plumbing AI assistant (demo)"
      hidden={!open}
      className="w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/15 bg-[#0b1a3a]/80 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#2563eb]/40 to-[#22d3ee]/20 px-4 py-3">
        <div>
          <p className="text-sm font-bold">Overpeck Plumbing</p>
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
          <p key={m.id} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "assistant" ? "rounded-bl-md bg-white/10" : "ml-auto rounded-br-md bg-gradient-to-br from-[#2563eb] to-[#0ea5e9]"}`}>
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
            or tap &quot;Get help now&quot; at the top.
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
        <label htmlFor="op-chat-input" className="sr-only">
          Message
        </label>
        <input
          ref={inputRef}
          id="op-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          disabled={capped}
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-[#22d3ee] focus:outline-none disabled:opacity-50"
          placeholder={capped ? "Message limit reached" : "Ask a plumbing question…"}
        />
        <button type="submit" disabled={busy || capped || !input.trim()} className="rounded-full bg-[#22d3ee] px-4 text-sm font-extrabold text-slate-950 disabled:opacity-50">
          Send
        </button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-white/45">Demo assistant. It can&apos;t book or send anything; for emergencies, call.</p>
    </div>
  );
}
