"use client";

import { useState } from "react";
import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";
import ChatDemo from "../ChatDemo";
import ReceptionistDemo from "../ReceptionistDemo";

const CHIPS = [
  { name: "AI Chat Bot", d: "Answers questions and books jobs from your website, even after hours." },
  { name: "AI Call Receptionist", d: "Picks up when you can't and books the job." },
  { name: "AI Agents", d: "Handle overflow: quotes, scheduling and follow-ups." },
];

export default function AIChapter() {
  const [tab, setTab] = useState<"chat" | "call">("chat");

  return (
    <Chapter index={4} id="ai" bridge="Now let’s put it all together." length={3.4} fadeOutAt={0.92} className="items-start lg:items-center">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-4 px-5 pt-[4.5rem] lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-8 lg:pt-0">
        <ChapterCopy href="/services/ai" kicker="04 · AI Implementation" title={<>AI that catches what you miss.</>}>
          {/* the reaction */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 rounded-md border border-dashed border-ink/25 bg-white/70 px-3 py-2.5 text-[12.5px] font-semibold text-ink" aria-label="Call during a job plus AI receptionist yields booked job">
            <span className="rounded border border-mk-red/50 bg-[#fde8e8] px-2 py-0.5">Call during a job</span>
            <span aria-hidden>+</span>
            <span className="rounded border border-mk-blue/50 bg-note-blue px-2 py-0.5">AI receptionist</span>
            <svg width="34" height="12" viewBox="0 0 34 12" aria-hidden className="shrink-0">
              <path d="M2 6 H30 M24 1.5 L31 6 L24 10.5" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="rounded border border-mk-green/60 bg-note-green px-2 py-0.5">Booked job</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2 lg:mt-5 lg:block lg:space-y-2.5">
            {CHIPS.map((c) => (
              <li key={c.name} className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-xs font-semibold text-violet lg:rounded-2xl lg:px-4 lg:py-2.5">
                {c.name}
                <span className="hidden font-normal text-ink/80 lg:block">{c.d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 hidden text-sm text-ink/80 sm:block lg:mt-4">AI fills the gaps, handles overflow and catches the leads that slip through after hours or while you&apos;re on a job.</p>
        </ChapterCopy>

        {/* desktop: both demos side by side */}
        <div className="hidden h-[460px] items-stretch justify-end gap-5 lg:flex">
          <ChatDemo className="max-w-[360px]" />
          <ReceptionistDemo className="shrink-0" />
        </div>

        {/* mobile/tablet: tabbed */}
        <div className="lg:hidden">
          <div role="tablist" className="mx-auto mb-2 flex w-fit rounded-full border border-ink/15 bg-white p-1 text-xs font-semibold">
            {(
              [
                ["chat", "AI Chat Bot"],
                ["call", "AI Call Receptionist"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`rounded-full px-3.5 py-1.5 ${tab === k ? "bg-gradient-to-r from-teal to-mk-sky text-black" : "text-ink/80"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mx-auto h-[min(400px,calc(100svh-340px))] min-h-[300px] max-w-md">
            {tab === "chat" ? <ChatDemo className="h-full" /> : <ReceptionistDemo className="h-full" />}
          </div>
        </div>
      </div>
    </Chapter>
  );
}
