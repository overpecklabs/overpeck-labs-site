"use client";

import { useId, useRef, useState } from "react";
import { submitLead, type LeadBasics } from "@/components/demos/lead";

/**
 * "Add details" after the hero form: address/town + property type, stories + preferred timing, then optional
 * photos and notes. Two questions per screen, progress bar, no prices. Submits through submitLead() (display-only).
 */

const PROPERTY = ["Single-family home", "Townhouse", "Multi-family", "Commercial"];
const STORIES = ["1 story", "2 stories", "3+ stories"];
const TIMING = ["As soon as possible", "Within 2 weeks", "This month", "I'm flexible"];
const STEPS = ["Property", "Size & timing", "Photos (optional)"];

type Answers = { address: string; property: string; stories: string; timing: string; photos: string; notes: string };

export default function DetailsWizard({ basics, accent }: { basics: LeadBasics; accent: string }) {
  const uid = useId();
  const [i, setI] = useState(0);
  const [a, setA] = useState<Answers>({ address: "", property: "", stories: "", timing: "", photos: "", notes: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const set = (k: keyof Answers, v: string) => setA((x) => ({ ...x, [k]: v }));

  const missing = () => {
    if (i === 0 && (!a.address.trim() || !a.property)) return "Add your address or town and pick a property type.";
    if (i === 1 && (!a.stories || !a.timing)) return "Choose the number of stories and your timing.";
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
    const res = await submitLead({ ...basics, details: { ...a }, page_url: window.location.href, created_at: new Date().toISOString() });
    if (res.ok) setDone(true);
  }

  if (done)
    return (
      <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-white" role="status">
        <p className="text-sm font-extrabold">Details added. Thank you!</p>
        <p className="mt-1 text-sm text-white/80">
          On the live site we&apos;d review your {a.property.toLowerCase()} in {a.address.trim()} ({a.stories}) and confirm a time for your free estimate ({a.timing.toLowerCase()}).
        </p>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">Demo only, nothing was sent.</p>
      </div>
    );

  const label = "mb-1.5 block text-xs font-semibold text-white/85";
  const field = "w-full rounded-xl border border-white/20 bg-white/90 px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/40";
  const chip = (on: boolean) =>
    `cursor-pointer rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-300 ${on ? "border-transparent text-slate-950" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}`;
  const choices = (name: keyof Answers, legend: string, options: string[]) => (
    <fieldset>
      <legend className={label}>{legend}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <label key={o} className={chip(a[name] === o)} style={a[name] === o ? { background: accent } : undefined}>
            <input type="radio" className="sr-only" name={`${uid}-${name}`} value={o} checked={a[name] === o} onChange={() => set(name, o)} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form onSubmit={next} noValidate className="mt-3 rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-white" aria-label="Add details">
      <div ref={top} tabIndex={-1} className="flex items-center justify-between gap-2 outline-none">
        <p className="text-sm font-extrabold">{STEPS[i]}</p>
        <p className="text-xs font-semibold text-white/60">
          Step {i + 1} of {STEPS.length}
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Details progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={i + 1}>
        <div className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((i + 1) / STEPS.length) * 100}%`, background: `linear-gradient(90deg, #0e7490, ${accent})` }} />
      </div>

      <div className="mt-4 grid gap-4">
        {i === 0 && (
          <>
            <div>
              <label htmlFor={`${uid}-addr`} className={label}>
                Address or town
              </label>
              <input id={`${uid}-addr`} className={field} autoComplete="street-address" placeholder="e.g. 24 Oak St, Teaneck" value={a.address} onChange={(e) => set("address", e.target.value)} />
            </div>
            {choices("property", "Property type", PROPERTY)}
          </>
        )}
        {i === 1 && (
          <>
            {choices("stories", "How many stories?", STORIES)}
            {choices("timing", "Preferred timing", TIMING)}
          </>
        )}
        {i === 2 && (
          <>
            <div>
              <label htmlFor={`${uid}-photos`} className={label}>
                Photos <span className="font-normal opacity-70">(optional, helps us quote without a visit)</span>
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
            <div>
              <label htmlFor={`${uid}-notes`} className={label}>
                Anything else? <span className="font-normal opacity-70">(optional)</span>
              </label>
              <textarea id={`${uid}-notes`} rows={3} className={field} placeholder="Gate code, problem areas, best time to reach you…" value={a.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
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
          {i === STEPS.length - 1 ? "Send details" : "Next"}
        </button>
      </div>
    </form>
  );
}
