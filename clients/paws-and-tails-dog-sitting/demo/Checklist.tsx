"use client";

/* Paws and Tails: the get-ready checklist (a client island; nothing is saved or sent). */

import { useState } from "react";
import { data } from "./data";

const C = data.colors;

const CHECKLIST = [
  "Spare key or door code",
  "Food, treats and feeding times",
  "Leash, harness and waste bags",
  "Any medications, with instructions",
  "Your vet's name and phone number",
  "An emergency contact",
];

export default function Checklist() {
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="rounded-3xl p-6 text-white sm:p-8" style={{ background: C.dark }}>
      <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: C.accent }}>
        Before your first booking
      </p>
      <h3 className="mt-2 text-2xl font-extrabold">Get-ready checklist</h3>
      <p className="mt-2 text-sm text-white/70">Tick things off as you go. Nothing is saved or sent.</p>
      <ul className="mt-5 space-y-2">
        {CHECKLIST.map((item) => {
          const on = done.includes(item);
          return (
            <li key={item}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white/[0.06] px-3.5 py-3 text-[15px] hover:bg-white/10">
                <input type="checkbox" checked={on} onChange={() => setDone((d) => (on ? d.filter((x) => x !== item) : [...d, item]))} className="h-5 w-5 shrink-0" style={{ accentColor: C.accent }} />
                <span className={on ? "text-white/50 line-through" : ""}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm font-semibold" style={{ color: C.accent }} aria-live="polite">
        {done.length === CHECKLIST.length ? "All set! Your pup is ready." : `${done.length} of ${CHECKLIST.length} ready`}
      </p>
    </div>
  );
}

