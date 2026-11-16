"use client";

import { useId, useState } from "react";
import { LeadJump } from "@/components/demos/lead";

/**
 * Sample EV home-charging estimate. Not a form and nothing is sent: it only does arithmetic on the numbers shown.
 * Every output is labeled as an estimate; the install "from" price is a sample.
 */

const CHARGERS = [
  { id: "32", label: "32 A (7.7 kW)", kw: 7.7 },
  { id: "48", label: "48 A (11.5 kW)", kw: 11.5 },
];

export default function EvEstimate({ rate: defaultRate, milesPerKwh, installFrom, cta }: { rate: number; milesPerKwh: number; installFrom: number; cta: string }) {
  const uid = useId();
  const [miles, setMiles] = useState(35);
  const [charger, setCharger] = useState(CHARGERS[0]);
  const [rate, setRate] = useState(String(defaultRate));
  const r = Math.max(0, Number(rate.replace(/[^\d.]/g, "")) || 0);
  const dailyKwh = miles / milesPerKwh;
  const monthly = dailyKwh * 30.4 * r;
  const minutes = Math.round((dailyKwh / charger.kw) * 60);
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

  return (
    <div className="grid gap-6 rounded-3xl border border-white/10 bg-[#121826] p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
      <div className="space-y-6">
        <div>
          <label htmlFor={`${uid}-miles`} className={label}>
            Miles you drive per day: <span className="text-white">{miles}</span>
          </label>
          <input id={`${uid}-miles`} type="range" min={5} max={120} step={5} value={miles} onChange={(e) => setMiles(Number(e.target.value))} className="w-full accent-[#facc15]" />
        </div>
        <fieldset>
          <legend className={label}>Charger</legend>
          <div className="grid grid-cols-2 gap-2">
            {CHARGERS.map((c) => (
              <label key={c.id} className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-bold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#facc15] ${charger.id === c.id ? "border-transparent bg-[#facc15] text-[#0b0f17]" : "border-white/15 bg-white/5 text-white hover:bg-white/10"}`}>
                <input type="radio" className="sr-only" name={`${uid}-charger`} checked={charger.id === c.id} onChange={() => setCharger(c)} />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={`${uid}-rate`} className={label}>
            Your electricity rate ($ per kWh)
          </label>
          <input id={`${uid}-rate`} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="w-32 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base text-white focus:border-[#facc15] focus:outline-none" />
          <p className="mt-1.5 text-xs text-slate-400">Pre-filled with a sample rate. Check your utility bill for yours.</p>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#facc15]/15 to-transparent p-5 ring-1 ring-[#facc15]/25" aria-live="polite">
        <div>
          <p className="inline-flex rounded-full bg-[#facc15] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#0b0f17]">Sample estimate</p>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-slate-400">Est. monthly charging cost</dt>
              <dd className="mt-1 text-3xl font-extrabold tabular-nums text-white">${monthly.toFixed(0)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Est. time to add a day&apos;s miles</dt>
              <dd className="mt-1 text-3xl font-extrabold tabular-nums text-white">
                {minutes < 60 ? `${minutes} min` : `${(minutes / 60).toFixed(1)} h`}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-slate-300">
            Level 2 install typically from <strong className="text-white">${installFrom.toLocaleString()}</strong>
            <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">sample</span>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Estimate only, assuming {milesPerKwh} miles per kWh. Real costs depend on your car, rate plan, panel capacity and the distance from your panel.
          </p>
        </div>
        <LeadJump className="demo-lift mt-5 rounded-full px-6 py-3 text-center font-extrabold text-[#0b0f17]" style={{ background: "linear-gradient(90deg, #facc15, #f59e0b)" }}>
          {cta}
        </LeadJump>
      </div>
    </div>
  );
}
