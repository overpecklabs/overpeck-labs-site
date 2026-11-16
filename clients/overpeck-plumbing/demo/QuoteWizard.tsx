"use client";

import { useId, useRef, useState } from "react";
import { submitLead, type LeadBasics } from "@/components/demos/lead";
import { SAMPLE_RANGES } from "./data";

/**
 * Multi-step quote shown by "Add details" after the short hero form: a glass form with a progress bar and about
 * two questions per screen. Ends on a SAMPLE estimated-range card. Goes through submitLead() (display-only).
 */

const SERVICES: { label: string; icon: string }[] = [
  { label: "Leak repair", icon: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" },
  { label: "Drain cleaning", icon: "M4 6h16M7 6v4a5 5 0 0 0 10 0V6M12 15v6" },
  { label: "Water heater", icon: "M7 3h10v18H7zM12 8c1.5 1.5 1.5 3 0 4.5S10.5 15 12 16.5" },
  { label: "Toilet / fixture", icon: "M6 4h8v6H6zM4 10h14a5 5 0 0 1-5 5H9l-1 5h6" },
  { label: "Sewer line", icon: "M3 9h7v6H3zM10 12h11M17 8l4 4-4 4" },
  { label: "Remodel", icon: "M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6" },
  { label: "Other", icon: "M12 5v14M5 12h14" },
];
const URGENCY = ["Emergency, right now", "Today if possible", "This week", "Just planning"];
const PROPERTY = ["House", "Condo / apartment", "Multi-family", "Business"];
const DAYS = ["Today", "Tomorrow", "This week", "Next week"];
const WINDOWS = ["Morning (8–12)", "Afternoon (12–4)", "Evening (4–8)", "Any time"];

type Answers = { service: string; urgency: string; property: string; address: string; details: string; photos: string; day: string; window: string };

const STEPS = ["Service", "Urgency", "Address & details", "Preferred time"];

export default function QuoteWizard({ basics, accent = "#22d3ee" }: { basics: LeadBasics; accent?: string }) {
  const uid = useId();
  const [i, setI] = useState(0);
  const [a, setA] = useState<Answers>({ service: guessService(basics.need), urgency: "", property: "", address: "", details: "", photos: "", day: "", window: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const set = (k: keyof Answers, v: string) => setA((x) => ({ ...x, [k]: v }));

  const missing = (): string => {
    if (i === 0 && !a.service) return "Pick the closest service.";
    if (i === 1 && (!a.urgency || !a.property)) return "Choose how urgent it is and the property type.";
    if (i === 2 && !a.address.trim()) return "Add the street address or town.";
    if (i === 3 && (!a.day || !a.window)) return "Choose a day and a time window.";
    return "";
  };

  async function next(e: React.FormEvent) {
    e.preventDefault();
    const m = missing();
    setError(m);
    if (m) return;
    if (i < STEPS.length - 1) {
      setI(i + 1);
      requestAnimationFrame(() => top.current?.focus({ preventScroll: true }));
      return;
    }
    const res = await submitLead({ ...basics, need: a.service, details: { ...a }, page_url: window.location.href, created_at: new Date().toISOString() });
    if (res.ok) setDone(true);
  }

  if (done) {
    const [lo, hi] = SAMPLE_RANGES[a.service] ?? SAMPLE_RANGES.Other;
    const emergency = a.urgency.startsWith("Emergency");
    return (
      <div className="mt-3 rounded-2xl border border-white/15 bg-gradient-to-br from-white/15 to-white/5 p-4 text-white" role="status">
        <p className="inline-flex rounded-full bg-amber-300/90 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-950">Sample estimate</p>
        <p className="mt-2 text-sm text-white/75">{a.service} · {a.property}</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">
          ${lo.toLocaleString()} – ${hi.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-white/65">Sample range for illustration only. On a live site, the business sets its own pricing and confirms the exact price before work starts.</p>
        {emergency && <p className="mt-3 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-100">It&apos;s an emergency: call now and we&apos;ll talk you through shutting off the water.</p>}
        <p className="mt-3 text-sm">
          Preferred time: <strong>{a.day}, {a.window.toLowerCase()}</strong>
        </p>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">Demo only, nothing was sent.</p>
      </div>
    );
  }

  const chip = (on: boolean) => `cursor-pointer rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-300 ${on ? "border-transparent text-slate-950" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}`;
  const field = "w-full rounded-xl border border-white/20 bg-white/90 px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/40";
  const label = "mb-1.5 block text-xs font-semibold text-white/85";

  const choices = ({ name, options, value, legend, cols = "grid-cols-2" }: { name: keyof Answers; options: string[]; value: string; legend: string; cols?: string }) => (
    <fieldset>
      <legend className={label}>{legend}</legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((o) => (
          <label key={o} className={chip(value === o)} style={value === o ? { background: accent } : undefined}>
            <input type="radio" className="sr-only" name={`${uid}-${name}`} value={o} checked={value === o} onChange={() => set(name, o)} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form onSubmit={next} noValidate className="mt-3 rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-white" aria-label="Detailed quote">
      <div ref={top} tabIndex={-1} className="flex items-center justify-between gap-2 outline-none">
        <p className="text-sm font-extrabold">{STEPS[i]}</p>
        <p className="text-xs font-semibold text-white/60">
          Step {i + 1} of {STEPS.length}
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={i + 1} aria-label="Quote progress">
        <div className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((i + 1) / STEPS.length) * 100}%`, background: `linear-gradient(90deg, #2563eb, ${accent})` }} />
      </div>

      <div className="mt-4 grid gap-4">
        {i === 0 && (
          <fieldset>
            <legend className={label}>What do you need help with?</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SERVICES.map((s) => {
                const on = a.service === s.label;
                return (
                  <label key={s.label} className={`${chip(on)} flex flex-col items-start gap-1.5 py-3`} style={on ? { background: accent } : undefined}>
                    <input type="radio" className="sr-only" name={`${uid}-service`} value={s.label} checked={on} onChange={() => set("service", s.label)} />
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d={s.icon} />
                    </svg>
                    {s.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
        {i === 1 && (
          <>
            {choices({ name: "urgency", legend: "How urgent is it?", options: URGENCY, value: a.urgency })}
            {choices({ name: "property", legend: "Property type", options: PROPERTY, value: a.property })}
          </>
        )}
        {i === 2 && (
          <>
            <div>
              <label htmlFor={`${uid}-addr`} className={label}>
                Address or town
              </label>
              <input id={`${uid}-addr`} className={field} autoComplete="street-address" placeholder="e.g. 12 Main St, Hackensack" value={a.address} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div>
              <label htmlFor={`${uid}-details`} className={label}>
                What&apos;s going on? <span className="font-normal opacity-70">(optional)</span>
              </label>
              <textarea id={`${uid}-details`} rows={3} className={field} placeholder="Where is it, when did it start, anything you've tried…" value={a.details} onChange={(e) => set("details", e.target.value)} />
            </div>
            <div>
              <label htmlFor={`${uid}-photos`} className={label}>
                Photos <span className="font-normal opacity-70">(optional)</span>
              </label>
              <input
                id={`${uid}-photos`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => set("photos", `${e.target.files?.length ?? 0} photo(s)`)}
                className="block w-full text-sm text-white/80 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-800"
              />
              <p className="mt-1 text-xs text-white/55">Photos stay on your device in this demo.</p>
            </div>
          </>
        )}
        {i === 3 && (
          <>
            {choices({ name: "day", legend: "Preferred day", options: DAYS, value: a.day })}
            {choices({ name: "window", legend: "Time window", options: WINDOWS, value: a.window })}
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs font-semibold text-red-200">
          {error}
        </p>
      )}
      <div className="mt-4 flex gap-2">
        {i > 0 && (
          <button type="button" onClick={() => (setError(""), setI(i - 1))} className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10">
            Back
          </button>
        )}
        <button type="submit" className="demo-lift flex-1 rounded-full px-4 py-2.5 text-sm font-extrabold text-slate-950" style={{ background: accent }}>
          {i === STEPS.length - 1 ? "See my estimate" : "Next"}
        </button>
      </div>
    </form>
  );
}

function guessService(need: string | null): string {
  switch (need) {
    case "Leak":
      return "Leak repair";
    case "Clogged drain":
      return "Drain cleaning";
    case "No hot water":
      return "Water heater";
    case "Sewer backup":
      return "Sewer line";
    default:
      return "";
  }
}
