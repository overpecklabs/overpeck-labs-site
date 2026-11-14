"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { INDUSTRIES } from "@/lib/industries";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";
import { submitMockupRequest, TIMELINES, type MockupRequest } from "@/lib/submitMockupRequest";
import HoneypotField from "./HoneypotField";

/* ---------- options ---------- */

const INDUSTRY_OPTIONS = [...INDUSTRIES.map((i) => i.industry), "Other"];
const YEARS = ["Just starting", "Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"];
const JOB_VALUES = ["Under $250", "$250–$1,000", "$1,000–$5,000", "$5,000–$15,000", "$15,000+", "Not sure"];
const GOALS = ["More calls", "More quote requests", "Online booking", "Look more professional", "Show up on Google", "Stop missing calls/leads"];
const STYLES = [
  { key: "Modern / Clean", d: "Lots of white space, crisp and simple", sw: ["#f4f8ff", "#1d6fe0", "#0b2545"] },
  { key: "Bold / Strong", d: "Big type, high contrast, confident", sw: ["#111111", "#ffd60a", "#f5f5f5"] },
  { key: "Friendly / Local", d: "Warm colors, approachable, neighborly", sw: ["#fff7f0", "#e8590c", "#2f9e44"] },
  { key: "Premium / Luxury", d: "Dark, elegant, refined details", sw: ["#0f1b2d", "#d4af37", "#eef2f7"] },
];
const EXTRAS = [
  { key: "AI chatbot", d: "Answers questions and books jobs from your website, day or night." },
  { key: "AI call receptionist", d: "Picks up when you can't and books the job for you." },
  { key: "Automated follow-ups & review requests", d: "Texts and emails go out on their own after calls, quotes and jobs." },
  { key: "Lead dashboard", d: "See every call, form and booking in one place." },
  { key: "Google Ads / local SEO", d: "Show up when people nearby search for what you do." },
];
const BEST_TIMES = ["Anytime", "Morning (8–11am)", "Midday (11am–2pm)", "Afternoon (2–5pm)", "Evening (5–7pm)"];
const METHODS = ["Call", "Text", "Email"];

const STEPS = ["Your Business", "Customers & Services", "Your Goals", "Look & Feel", "Extras We Can Add", "Contact"];

const MAX_LOGO = 5 * 1024 * 1024;
const STORAGE_KEY = "overpeck-mockup-v1";

const EMPTY: MockupRequest = {
  business: { name: "", industry: "", industryOther: "", area: "", years: "", website: "", noWebsite: false, gbp: "" },
  customers: { services: ["", "", ""], ideal: "", jobValue: "", different: "" },
  goals: { timeline: "", goals: [], headache: "" },
  look: { style: "", primary: "#1d6fe0", accent: "#f08c00", pickForMe: false, logo: null, likes: ["", ""] },
  extras: [],
  contact: { name: "", phone: "", email: "", bestTime: "Anytime", method: "Call", consent: false },
};

/* ---------- validation ---------- */

type Errors = Record<string, string>;
const isUrl = (v: string) => /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v.trim());
const phoneDigits = (v: string) => v.replace(/\D/g, "");
const isPhone = (v: string) => {
  const d = phoneDigits(v);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function validate(step: number, d: MockupRequest): Errors {
  const e: Errors = {};
  if (step === 0) {
    const b = d.business;
    if (!b.name.trim()) e.name = "Please enter your business name.";
    if (!b.industry) e.industry = "Please choose your industry.";
    if (b.industry === "Other" && !b.industryOther.trim()) e.industryOther = "Please tell us your industry.";
    if (!b.area.trim()) e.area = "Please enter your town or service area.";
    if (!b.years) e.years = "Please choose how long you've been in business.";
    if (!b.noWebsite && b.website && !isUrl(b.website)) e.website = "That doesn't look like a web address (e.g. yoursite.com).";
    if (b.gbp && !isUrl(b.gbp)) e.gbp = "That doesn't look like a link. Paste the full Google link, or leave it blank.";
  }
  if (step === 1) {
    if (!d.customers.services[0].trim()) e.service0 = "Please list at least one service.";
    if (!d.customers.jobValue) e.jobValue = "Please choose a range (or “Not sure”).";
  }
  if (step === 2) {
    if (!d.goals.timeline) e.timeline = "Please choose when you want your site up and running.";
    if (!d.goals.goals.length) e.goals = "Pick at least one goal.";
  }
  if (step === 3) {
    if (!d.look.style) e.style = "Pick the style closest to what you like.";
    d.look.likes.forEach((u, i) => {
      if (u && !isUrl(u)) e[`like${i}`] = "That doesn't look like a web address.";
    });
  }
  if (step === 5) {
    const c = d.contact;
    if (!c.name.trim()) e.cname = "Please enter your name.";
    if (!isPhone(c.phone)) e.phone = "Please enter a 10-digit phone number.";
    if (c.email && !isEmail(c.email)) e.email = "That email doesn't look right. Fix it, or leave it blank.";
    if (c.method === "Email" && !c.email) e.email = "Add an email if you'd like us to contact you that way.";
    if (!c.consent) e.consent = "Please check this so we can contact you about your mockup.";
  }
  return e;
}

/* ---------- small field helpers ---------- */

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-ink/55 focus:outline-none focus:ring-2 focus:ring-teal/60 disabled:opacity-40";
const border = (err?: string) => (err ? "border-red-400/70" : "border-ink/15 focus:border-teal");

function Field({ id, label, error, hint, optional, children }: { id: string; label: string; error?: string; hint?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink/90">
        {label} {optional && <span className="font-normal text-ink/70">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink/70">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const describe = (id: string, err?: string, hint?: string) => ({
  id,
  "aria-invalid": err ? true : undefined,
  "aria-describedby": err ? `${id}-err` : hint ? `${id}-hint` : undefined,
});

function GroupError({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={id} className="mt-2 text-xs font-medium text-red-700" role="alert">
      {error}
    </p>
  ) : null;
}

/* ---------- wizard ---------- */

export default function MockupWizard() {
  const [data, setData] = useState<MockupRequest>(EMPTY);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [logoFailed, setLogoFailed] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState<MockupRequest | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const fid = (k: string) => `${uid}-${k}`;

  // Restore saved progress, then apply ?industry= from an industry card.
  useEffect(() => {
    let next = EMPTY;
    let savedStep = 0;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { step: number; data: MockupRequest };
        next = {
          business: { ...EMPTY.business, ...saved.data.business },
          customers: { ...EMPTY.customers, ...saved.data.customers },
          goals: { ...EMPTY.goals, ...saved.data.goals },
          look: { ...EMPTY.look, ...saved.data.look },
          extras: saved.data.extras ?? [],
          contact: { ...EMPTY.contact, ...saved.data.contact },
        };
        savedStep = Math.min(Math.max(0, saved.step | 0), STEPS.length - 1);
      }
    } catch {
      /* storage unavailable or corrupt: start fresh */
    }
    const q = new URLSearchParams(window.location.search).get("industry");
    if (q) {
      const match = INDUSTRY_OPTIONS.find((o) => o.toLowerCase() === q.toLowerCase());
      next = { ...next, business: { ...next.business, industry: match ?? "Other", industryOther: match ? next.business.industryOther : q.slice(0, 60) } };
    }
    setData(next);
    setStep(savedStep);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || status === "done") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    } catch {
      /* ignore quota / private mode */
    }
  }, [data, step, ready, status]);

  useEffect(() => () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
  }, [logoUrl]);

  // Clear each error as soon as its field becomes valid (new errors only appear on Next).
  useEffect(() => {
    setErrors((prev) => {
      const keys = Object.keys(prev);
      if (!keys.length) return prev;
      const now = validate(step, data);
      const next: Errors = {};
      for (const k of keys) if (k === "logo" || now[k]) next[k] = now[k] ?? prev[k];
      return keys.length === Object.keys(next).length && keys.every((k) => next[k] === prev[k]) ? prev : next;
    });
  }, [data, step]);

  const set = <K extends keyof MockupRequest>(section: K, patch: Partial<MockupRequest[K]>) =>
    setData((d) => ({ ...d, [section]: { ...(d[section] as object), ...patch } }) as MockupRequest);

  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const goTo = (n: number) => {
    setStep(n);
    setErrors({});
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      el?.focus();
    });

  const onNext = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(step, data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError();
      return;
    }
    if (step < STEPS.length - 1) return goTo(step + 1);

    setStatus("sending");
    let res: Awaited<ReturnType<typeof submitMockupRequest>>;
    try {
      res = await submitMockupRequest(data, logoFile, honeypot.current?.value ?? "");
    } catch (err) {
      console.error("[mockup request] unexpected error", err);
      res = { ok: false, error: "network" };
    }
    // Only show the thank-you screen after a real successful insert (or a silently dropped spam submission).
    if (res.ok) {
      setLogoFailed(res.logoFailed);
      setSubmitted(data);
      setStatus("done");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      requestAnimationFrame(() => heading.current?.focus());
    } else {
      setStatus("error");
    }
  };

  const onLogo = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErrors((x) => ({ ...x, logo: "Please choose an image file (PNG, JPG, SVG…)." }));
    if (f.size > MAX_LOGO) return setErrors((x) => ({ ...x, logo: "That file is over 5MB. Please choose a smaller image." }));
    setErrors(({ logo: _drop, ...rest }) => rest);
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoFile(f);
    setLogoUrl(URL.createObjectURL(f));
    set("look", { logo: { name: f.name, type: f.type, size: f.size } });
  };

  const removeLogo = () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoFile(null);
    setLogoUrl(null);
    set("look", { logo: null });
  };

  const startOver = () => {
    removeLogo();
    setData(EMPTY);
    setSubmitted(null);
    setLogoFailed(false);
    setStatus("idle");
    goTo(0);
  };

  /* ---------- done screen ---------- */
  if (status === "done" && submitted) {
    return (
      <section className="glass mt-8 rounded-3xl p-6 sm:p-8" aria-labelledby={fid("done")}>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-teal/15 text-2xl text-teal-ink" aria-hidden>
          ✓
        </div>
        <h2 id={fid("done")} ref={heading} tabIndex={-1} className="font-display mt-4 text-3xl font-bold focus:outline-none">
          {submitted.goals.timeline === "asap"
            ? "Thanks! We'll prioritize your mockup and reach out within 1 business day."
            : "Thanks! Your free mockup will be ready in 2–3 business days."}
        </h2>
        <p className="mt-3 text-ink/85">
          We&apos;ll reach out to <span className="font-semibold text-ink">{submitted.contact.phone}</span> by {submitted.contact.method.toLowerCase()}
          {submitted.contact.bestTime !== "Anytime" ? `, ${submitted.contact.bestTime.toLowerCase()}` : ""}.
        </p>
        {logoFailed && (
          <p role="alert" className="mt-4 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-800">
            Your request was saved, but we couldn&apos;t upload your logo. Please call {PHONE_DISPLAY} about the logo.
          </p>
        )}
        <Summary d={submitted} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <button type="button" onClick={startOver} className="btn-ghost">
            Start another request
          </button>
        </div>
        <p className="mt-5 text-sm text-ink/70">
          Questions? Call{" "}
          <a href={`tel:${PHONE_TEL}`} className="text-teal-ink underline">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
      </section>
    );
  }

  const b = data.business;
  const c = data.customers;
  const l = data.look;
  const ct = data.contact;
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <form ref={formRef} onSubmit={onNext} noValidate className="relative mt-8 scroll-mt-24" aria-busy={!ready}>
      <HoneypotField ref={honeypot} />
      {/* progress: a filling beaker + "Trial" sticky notes */}
      <div className="mb-6 flex items-end gap-4">
        <div
          role="progressbar"
          aria-label="Questionnaire progress"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-valuetext={`Trial ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}
          className="shrink-0"
        >
          <svg width="46" height="58" viewBox="0 0 46 58" aria-hidden>
            <defs>
              <clipPath id="beaker-clip">
                <path d="M7 6 V50 Q7 54 11 54 H35 Q39 54 39 50 V6 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#beaker-clip)">
              <rect x="0" y={54 - 48 * (pct / 100)} width="46" height="60" fill="#19f0d2" opacity="0.7" className="transition-[y] duration-500" />
            </g>
            <path d="M7 6 V50 Q7 54 11 54 H35 Q39 54 39 50 V6 M3 6 H11 M35 6 H43 M9 18 H15 M9 30 H15 M9 42 H15" fill="none" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <ol className="flex flex-1 flex-wrap gap-1.5">
          {STEPS.map((name, i) => {
            const done = i < step;
            const current = i === step;
            const note = (
              <>
                <span className="block text-[10px] font-bold uppercase tracking-wider">Trial {i + 1}</span>
                <span className="hidden truncate text-[11px] sm:block">{name}</span>
              </>
            );
            const cls = `block w-full rounded-[3px] px-2 py-1.5 text-left text-ink shadow-[0_1px_2px_rgba(26,26,26,0.08),0_4px_10px_rgba(26,26,26,0.06)] ${
              current ? "bg-note-yellow -rotate-2 ring-2 ring-ink/70" : done ? "bg-note-green" : "bg-white/80 text-ink/75"
            }`;
            return (
              <li key={name} className="min-w-[3.6rem] flex-1 sm:min-w-0" aria-current={current ? "step" : undefined}>
                {done ? (
                  <button type="button" onClick={() => goTo(i)} className={cls} aria-label={`Back to trial ${i + 1}: ${name}`}>
                    {note}
                  </button>
                ) : (
                  <span className={cls}>{note}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="notebook relative rounded-sm p-5 pl-7 sm:p-8 sm:pl-20">
        <span className="tape" style={{ left: "20%" }} />
        <p className="text-xs font-bold uppercase tracking-widest text-ink/75">Trial {step + 1} of {STEPS.length}</p>
        <h2 ref={heading} tabIndex={-1} className="font-display mt-1 text-2xl font-bold text-ink focus:outline-none sm:text-3xl">
          {STEPS[step]}
        </h2>

        <div className="mt-6 space-y-5">
          {/* ---------- 1. business ---------- */}
          {step === 0 && (
            <>
              <Field id={fid("name")} label="Business name" error={errors.name}>
                <input {...describe(fid("name"), errors.name)} className={`${inputCls} ${border(errors.name)}`} value={b.name} onChange={(e) => set("business", { name: e.target.value })} autoComplete="organization" placeholder="e.g. Bergen Flow Plumbing" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id={fid("industry")} label="Industry" error={errors.industry}>
                  <select {...describe(fid("industry"), errors.industry)} className={`${inputCls} ${border(errors.industry)}`} value={b.industry} onChange={(e) => set("business", { industry: e.target.value })}>
                    <option value="" className="">
                      Choose one…
                    </option>
                    {INDUSTRY_OPTIONS.map((o) => (
                      <option key={o} className="">
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id={fid("years")} label="Years in business" error={errors.years}>
                  <select {...describe(fid("years"), errors.years)} className={`${inputCls} ${border(errors.years)}`} value={b.years} onChange={(e) => set("business", { years: e.target.value })}>
                    <option value="" className="">
                      Choose one…
                    </option>
                    {YEARS.map((o) => (
                      <option key={o} className="">
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              {b.industry === "Other" && (
                <Field id={fid("industryOther")} label="What industry are you in?" error={errors.industryOther}>
                  <input {...describe(fid("industryOther"), errors.industryOther)} className={`${inputCls} ${border(errors.industryOther)}`} value={b.industryOther} onChange={(e) => set("business", { industryOther: e.target.value })} placeholder="e.g. Pest control" />
                </Field>
              )}
              <Field id={fid("area")} label="Town / service area" error={errors.area} hint="Where in Bergen County (and beyond) do you work?">
                <input {...describe(fid("area"), errors.area, "y")} className={`${inputCls} ${border(errors.area)}`} value={b.area} onChange={(e) => set("business", { area: e.target.value })} placeholder="e.g. Hackensack, Teaneck, Paramus" />
              </Field>
              <Field id={fid("website")} label="Current website" optional error={errors.website}>
                <input {...describe(fid("website"), errors.website)} className={`${inputCls} ${border(errors.website)}`} value={b.noWebsite ? "" : b.website} disabled={b.noWebsite} onChange={(e) => set("business", { website: e.target.value })} inputMode="url" placeholder="yoursite.com" />
                <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 text-sm text-ink/80">
                  <input type="checkbox" className="h-4 w-4 accent-[#0f766e]" checked={b.noWebsite} onChange={(e) => set("business", { noWebsite: e.target.checked })} />
                  I don&apos;t have one
                </label>
              </Field>
              <Field id={fid("gbp")} label="Google Business Profile link" optional error={errors.gbp} hint="Find it by searching your business on Google Maps and tapping Share.">
                <input {...describe(fid("gbp"), errors.gbp, "y")} className={`${inputCls} ${border(errors.gbp)}`} value={b.gbp} onChange={(e) => set("business", { gbp: e.target.value })} inputMode="url" placeholder="https://maps.app.goo.gl/…" />
              </Field>
            </>
          )}

          {/* ---------- 2. customers ---------- */}
          {step === 1 && (
            <>
              <fieldset className="space-y-2">
                <legend className="mb-1.5 text-sm font-medium text-ink/90">Top 3 services you want more of</legend>
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    <label htmlFor={fid(`service${i}`)} className="sr-only">
                      Service {i + 1}
                      {i > 0 ? " (optional)" : ""}
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/5 text-sm font-bold" aria-hidden>
                        {i + 1}
                      </span>
                      <input
                        {...describe(fid(`service${i}`), errors[`service${i}`])}
                        className={`${inputCls} ${border(errors[`service${i}`])}`}
                        value={c.services[i]}
                        onChange={(e) => {
                          const s = [...c.services] as [string, string, string];
                          s[i] = e.target.value;
                          set("customers", { services: s });
                        }}
                        placeholder={["e.g. Water heater installs", "e.g. Drain cleaning", "e.g. Bathroom remodels"][i]}
                      />
                    </div>
                    {errors[`service${i}`] && (
                      <p id={`${fid(`service${i}`)}-err`} className="ml-11 mt-1 text-xs font-medium text-red-700" role="alert">
                        {errors[`service${i}`]}
                      </p>
                    )}
                  </div>
                ))}
              </fieldset>
              <Field id={fid("ideal")} label="Who's your ideal customer?" optional>
                <input id={fid("ideal")} className={`${inputCls} ${border()}`} value={c.ideal} onChange={(e) => set("customers", { ideal: e.target.value })} placeholder="e.g. Homeowners in older houses, property managers" />
              </Field>
              <Field id={fid("jobValue")} label="Average job value" error={errors.jobValue}>
                <select {...describe(fid("jobValue"), errors.jobValue)} className={`${inputCls} ${border(errors.jobValue)}`} value={c.jobValue} onChange={(e) => set("customers", { jobValue: e.target.value })}>
                  <option value="" className="">
                    Choose a range…
                  </option>
                  {JOB_VALUES.map((o) => (
                    <option key={o} className="">
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={fid("different")} label="What makes you different?" optional hint="One or two sentences is perfect.">
                <textarea id={fid("different")} aria-describedby={`${fid("different")}-hint`} rows={3} maxLength={400} className={`${inputCls} ${border()}`} value={c.different} onChange={(e) => set("customers", { different: e.target.value })} placeholder="e.g. Family-owned for 20 years, upfront pricing, we clean up after every job" />
              </Field>
            </>
          )}

          {/* ---------- 3. goals ---------- */}
          {step === 2 && (
            <>
              <fieldset aria-describedby={errors.timeline ? fid("timeline-err") : undefined}>
                <legend className="mb-2 text-sm font-medium text-ink/90">How soon do you want your new site up and running?</legend>
                <div className="grid grid-cols-2 gap-3">
                  {TIMELINES.map((t, i) => {
                    const on = data.goals.timeline === t.value;
                    return (
                      <label
                        key={t.value}
                        className={`relative cursor-pointer rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-teal/70 ${on ? "border-teal bg-teal/10 shadow-[0_8px_24px_rgba(26,26,26,0.10)]" : "border-ink/15 bg-white hover:border-ink/30"}`}
                      >
                        <input
                          type="radio"
                          name={fid("timeline")}
                          value={t.value}
                          checked={on}
                          onChange={() => set("goals", { timeline: t.value })}
                          aria-invalid={i === 0 && errors.timeline ? true : undefined}
                          className="sr-only"
                        />
                        <span className="font-display block text-lg font-bold">{t.label}</span>
                        <span className="mt-0.5 block text-xs text-ink/75">{t.d}</span>
                        {on && (
                          <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-teal text-[11px] font-bold text-black" aria-hidden>
                            ✓
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                <GroupError id={fid("timeline-err")} error={errors.timeline} />
              </fieldset>
              <fieldset aria-describedby={errors.goals ? fid("goals-err") : undefined}>
                <legend className="mb-2 text-sm font-medium text-ink/90">What do you want your new website to do? Pick all that apply.</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {GOALS.map((g, i) => {
                    const on = data.goals.goals.includes(g);
                    return (
                      <label key={g} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${on ? "border-teal/60 bg-teal/10" : "border-ink/15 bg-white hover:border-ink/30"}`}>
                        <input type="checkbox" className="h-4 w-4 shrink-0 accent-[#0f766e]" checked={on} aria-invalid={i === 0 && errors.goals ? true : undefined} onChange={() => set("goals", { goals: toggleIn(data.goals.goals, g) })} />
                        <span className="text-sm">{g}</span>
                      </label>
                    );
                  })}
                </div>
                <GroupError id={fid("goals-err")} error={errors.goals} />
              </fieldset>
              <Field id={fid("headache")} label="What's your biggest headache right now?" optional>
                <textarea id={fid("headache")} rows={3} maxLength={400} className={`${inputCls} ${border()}`} value={data.goals.headache} onChange={(e) => set("goals", { headache: e.target.value })} placeholder="e.g. I miss calls while I'm on jobs, and my site looks outdated" />
              </Field>
            </>
          )}

          {/* ---------- 4. look & feel ---------- */}
          {step === 3 && (
            <>
              <fieldset aria-describedby={errors.style ? fid("style-err") : undefined}>
                <legend className="mb-2 text-sm font-medium text-ink/90">Which style feels most like you?</legend>
                <div className="grid grid-cols-2 gap-3">
                  {STYLES.map((s, i) => {
                    const on = l.style === s.key;
                    return (
                      <label key={s.key} className={`relative cursor-pointer rounded-2xl border p-3 transition focus-within:ring-2 focus-within:ring-teal/70 sm:p-4 ${on ? "border-teal bg-teal/10 shadow-[0_8px_24px_rgba(26,26,26,0.10)]" : "border-ink/15 bg-white hover:border-ink/30"}`}>
                        <input type="radio" name={fid("style")} value={s.key} checked={on} onChange={() => set("look", { style: s.key })} aria-invalid={i === 0 && errors.style ? true : undefined} className="sr-only" />
                        <span className="flex h-12 overflow-hidden rounded-lg" aria-hidden>
                          {s.sw.map((c2) => (
                            <span key={c2} className="flex-1" style={{ background: c2 }} />
                          ))}
                        </span>
                        <span className="mt-2 block text-sm font-semibold">{s.key}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-ink/75">{s.d}</span>
                        {on && (
                          <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-teal text-[11px] font-bold text-black" aria-hidden>
                            ✓
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                <GroupError id={fid("style-err")} error={errors.style} />
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-ink/90">Brand colors</legend>
                <div className="flex flex-wrap items-center gap-4">
                  {(
                    [
                      ["primary", "Main color"],
                      ["accent", "Accent color"],
                    ] as const
                  ).map(([k, label]) => (
                    <label key={k} className={`flex items-center gap-2 text-sm ${l.pickForMe ? "opacity-40" : ""}`}>
                      <input type="color" disabled={l.pickForMe} value={l[k]} onChange={(e) => set("look", { [k]: e.target.value })} className="h-10 w-12 cursor-pointer rounded-lg border border-ink/20 bg-transparent p-0.5 disabled:cursor-not-allowed" />
                      {label}
                    </label>
                  ))}
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/85">
                    <input type="checkbox" className="h-4 w-4 accent-[#0f766e]" checked={l.pickForMe} onChange={(e) => set("look", { pickForMe: e.target.checked })} />
                    Pick for me
                  </label>
                </div>
              </fieldset>

              <Field id={fid("logo")} label="Logo" optional error={errors.logo} hint="Image files only, up to 5MB.">
                {l.logo ? (
                  <div className="flex items-center gap-3 rounded-xl border border-ink/15 bg-white p-3">
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt="Your uploaded logo" className="h-12 w-12 rounded-lg bg-white object-contain p-1" />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-lg bg-ink/5 text-xs text-ink/70">IMG</span>
                    )}
                    <div className="min-w-0 flex-1 text-sm">
                      <div className="truncate">{l.logo.name}</div>
                      {!logoFile && <div className="text-xs text-amber-800">Please re-attach after a page refresh.</div>}
                    </div>
                    <button type="button" onClick={removeLogo} className="rounded-full border border-ink/15 px-3 py-1 text-xs hover:bg-ink/5">
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    {...describe(fid("logo"), errors.logo, "y")}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onLogo(e.target.files?.[0])}
                    className="block w-full cursor-pointer rounded-xl border border-dashed border-ink/20 bg-white p-3 text-sm text-ink/75 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink/5 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink hover:border-teal/50"
                  />
                )}
              </Field>

              <fieldset className="space-y-2">
                <legend className="mb-1.5 text-sm font-medium text-ink/90">
                  1–2 websites you like <span className="font-normal text-ink/70">(optional)</span>
                </legend>
                {[0, 1].map((i) => (
                  <div key={i}>
                    <label htmlFor={fid(`like${i}`)} className="sr-only">
                      Website you like {i + 1}
                    </label>
                    <input
                      {...describe(fid(`like${i}`), errors[`like${i}`])}
                      className={`${inputCls} ${border(errors[`like${i}`])}`}
                      value={l.likes[i]}
                      inputMode="url"
                      onChange={(e) => {
                        const v = [...l.likes] as [string, string];
                        v[i] = e.target.value;
                        set("look", { likes: v });
                      }}
                      placeholder="https://…"
                    />
                    {errors[`like${i}`] && (
                      <p id={`${fid(`like${i}`)}-err`} className="mt-1 text-xs font-medium text-red-700" role="alert">
                        {errors[`like${i}`]}
                      </p>
                    )}
                  </div>
                ))}
              </fieldset>
            </>
          )}

          {/* ---------- 5. extras ---------- */}
          {step === 4 && (
            <fieldset>
              <legend className="mb-3 text-sm text-ink/80">Optional add-ons. Check anything you&apos;d like us to include in your mockup or talk about.</legend>
              <div className="space-y-2">
                {EXTRAS.map((x) => {
                  const on = data.extras.includes(x.key);
                  return (
                    <label key={x.key} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${on ? "border-violet/60 bg-violet/10" : "border-ink/15 bg-white hover:border-ink/30"}`}>
                      <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#1f6feb]" checked={on} onChange={() => setData((d) => ({ ...d, extras: toggleIn(d.extras, x.key) }))} />
                      <span>
                        <span className="block text-sm font-semibold">{x.key}</span>
                        <span className="block text-xs text-ink/75">{x.d}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* ---------- 6. contact ---------- */}
          {step === 5 && (
            <>
              <Field id={fid("cname")} label="Your name" error={errors.cname}>
                <input {...describe(fid("cname"), errors.cname)} className={`${inputCls} ${border(errors.cname)}`} value={ct.name} onChange={(e) => set("contact", { name: e.target.value })} autoComplete="name" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id={fid("phone")} label="Phone" error={errors.phone}>
                  <input {...describe(fid("phone"), errors.phone)} type="tel" inputMode="tel" autoComplete="tel" className={`${inputCls} ${border(errors.phone)}`} value={ct.phone} onChange={(e) => set("contact", { phone: e.target.value })} placeholder="(201) 555-0123" />
                </Field>
                <Field id={fid("email")} label="Email" optional error={errors.email}>
                  <input {...describe(fid("email"), errors.email)} type="email" autoComplete="email" className={`${inputCls} ${border(errors.email)}`} value={ct.email} onChange={(e) => set("contact", { email: e.target.value })} placeholder="you@company.com" />
                </Field>
              </div>
              <Field id={fid("bestTime")} label="Best time to reach you">
                <select id={fid("bestTime")} className={`${inputCls} ${border()}`} value={ct.bestTime} onChange={(e) => set("contact", { bestTime: e.target.value })}>
                  {BEST_TIMES.map((o) => (
                    <option key={o} className="">
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-ink/90">How should we contact you?</legend>
                <div className="flex gap-2">
                  {METHODS.map((m) => {
                    const on = ct.method === m;
                    return (
                      <label key={m} className={`flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition focus-within:ring-2 focus-within:ring-teal/70 ${on ? "border-teal bg-teal/15 text-teal-ink" : "border-ink/15 bg-white text-ink/85 hover:border-ink/30"}`}>
                        <input type="radio" name={fid("method")} value={m} checked={on} onChange={() => set("contact", { method: m })} className="sr-only" />
                        {m}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${errors.consent ? "border-red-400/70" : "border-ink/15"} bg-white`}>
                  <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#0f766e]" checked={ct.consent} aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? fid("consent-err") : undefined} onChange={(e) => set("contact", { consent: e.target.checked })} />
                  <span className="text-sm text-ink/85">Yes, Overpeck Labs can contact me about my free mockup by phone, text or email. No spam, and no obligation.</span>
                </label>
                <GroupError id={fid("consent-err")} error={errors.consent} />
              </div>
              {status === "error" && (
                <p role="alert" className="rounded-xl border border-red-400/50 bg-red-400/10 p-3 text-sm text-red-700">
                  We couldn&apos;t send your request. Please call {PHONE_DISPLAY}. (You can also try again in a moment.)
                </p>
              )}
            </>
          )}
        </div>

        {/* nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink/10 pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="btn-ghost">
              ← Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn-primary min-w-[9rem]" disabled={status === "sending"}>
            {step < STEPS.length - 1 ? "Next →" : status === "sending" ? "Sending…" : "Get My Free Mockup"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ---------- summary ---------- */

function Summary({ d }: { d: MockupRequest }) {
  const rows: [string, [string, string][]][] = [
    [
      "Your Business",
      [
        ["Business", d.business.name],
        ["Industry", d.business.industry === "Other" ? d.business.industryOther : d.business.industry],
        ["Service area", d.business.area],
        ["Years in business", d.business.years],
        ["Current website", d.business.noWebsite ? "None yet" : d.business.website],
        ["Google profile", d.business.gbp],
      ],
    ],
    [
      "Customers & Services",
      [
        ["Top services", d.customers.services.filter(Boolean).join(", ")],
        ["Ideal customer", d.customers.ideal],
        ["Average job", d.customers.jobValue],
        ["What makes you different", d.customers.different],
      ],
    ],
    [
      "Goals",
      [
        ["Timeline", TIMELINES.find((t) => t.value === d.goals.timeline)?.label ?? ""],
        ["Goals", d.goals.goals.join(", ")],
        ["Biggest headache", d.goals.headache],
      ],
    ],
    [
      "Look & Feel",
      [
        ["Style", d.look.style],
        ["Colors", d.look.pickForMe ? "Pick for me" : `${d.look.primary} / ${d.look.accent}`],
        ["Logo", d.look.logo?.name ?? ""],
        ["Sites you like", d.look.likes.filter(Boolean).join(", ")],
      ],
    ],
    ["Extras", [["Add-ons", d.extras.join(", ") || "None"]]],
    [
      "Contact",
      [
        ["Name", d.contact.name],
        ["Phone", d.contact.phone],
        ["Email", d.contact.email],
        ["Best time", d.contact.bestTime],
        ["Preferred contact", d.contact.method],
      ],
    ],
  ];
  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-ink">Your answers</h3>
      {rows.map(([title, items]) => (
        <div key={title} className="rounded-2xl border border-ink/10 bg-white p-4">
          <h4 className="mb-2 text-sm font-semibold">{title}</h4>
          <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[10rem_1fr]">
            {items
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-ink/70">{k}</dt>
                  <dd className="break-words text-ink/90">
                    {k === "Colors" && !d.look.pickForMe ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 rounded-full border border-ink/20" style={{ background: d.look.primary }} />
                        <span className="h-3.5 w-3.5 rounded-full border border-ink/20" style={{ background: d.look.accent }} />
                        {v}
                      </span>
                    ) : (
                      v
                    )}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
