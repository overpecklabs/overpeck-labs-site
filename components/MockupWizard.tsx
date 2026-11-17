"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { INDUSTRY_SLUGS } from "@/lib/slugs";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";
import { submitMockupRequest, TIMELINES, type MockupRequest } from "@/lib/submitMockupRequest";
import HoneypotField from "./HoneypotField";

/* ---------- options ---------- */

const INDUSTRIES: { key: string; icon: string; services: string }[] = [
  { key: "Plumbing", icon: "M12 3c3 4.5 5 7.5 5 10a5 5 0 0 1-10 0c0-2.5 2-5.5 5-10z", services: "Water heaters, drain cleaning, leak repair" },
  { key: "HVAC", icon: "M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5", services: "AC installs, furnace repair, maintenance plans" },
  { key: "Electrical", icon: "M13 2 4 14h7l-1 8 9-12h-7z", services: "Panel upgrades, EV chargers, lighting" },
  { key: "Roofing", icon: "M3 12l9-8 9 8M6 10v10h12V10M10 20v-5h4v5", services: "Roof replacement, leak repair, gutters" },
  { key: "Landscaping", icon: "M5 19C5 10 11 5 20 5c0 9-5 15-14 15M5 19l7-7", services: "Lawn care, patios, spring cleanups" },
  { key: "Cleaning", icon: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z", services: "Deep cleans, move-out cleans, offices" },
  { key: "Construction / Remodeling", icon: "M14 4l6 6-3 3-6-6zM11.5 7.5 3 16l3 3 8.5-8.5", services: "Kitchens, bathrooms, additions" },
  { key: "Painting", icon: "M4 4h13v5H4zM17 6.5h3v5h-8v3M11 14.5h2V21h-2z", services: "Interior, exterior, cabinet painting" },
  { key: "Auto", icon: "M3 16v-3l2-5h14l2 5v3zM5 16v2.5h3V16M16 16v2.5h3V16M7 12.5h.01M17 12.5h.01", services: "Brakes, oil changes, inspections" },
  { key: "Other", icon: "M12 5v14M5 12h14", services: "" },
];
/** Old industry names (industry pages, ?industry= links) -> the cards above. */
const INDUSTRY_ALIASES: Record<string, string> = {
  electrician: "Electrical",
  electricians: "Electrical",
  "auto repair": "Auto",
  "contractor / remodeling": "Construction / Remodeling",
  "contractors & remodelers": "Construction / Remodeling",
};
const YEARS = ["Less than 1 year", "1–5 years", "5–10 years", "10+ years"];
const GOALS = ["More phone calls", "More quote requests", "Look more professional", "Show off my work", "Get more reviews"];
const STYLES = [
  { key: "Clean & modern", d: "Crisp, simple, lots of space" },
  { key: "Bold", d: "Big type, high contrast" },
  { key: "Classic", d: "Timeless and trustworthy" },
  { key: "Friendly", d: "Warm, local, approachable" },
] as const;
const IDEAL = ["Homeowners", "Businesses", "Property managers", "Contractors"];
/** Shown on screen 6 as "Included with every site" (display only). */
const INCLUDED = [
  "Click-to-call buttons + sticky mobile call bar",
  "Free estimate form",
  "Services with photos",
  "“How it works” steps",
  "Service area",
  "Trust signals + reviews section",
  "FAQ",
  "Mobile-first layout",
  "SEO basics + fast loading",
];
/** Optional features (saved to mockup_requests.features). "Not sure" doesn't clear the others. */
const FEATURES: { key: string; d?: string }[] = [
  { key: "AI phone receptionist", d: "Picks up when you're on a job or after hours, books jobs, texts you a summary" },
  { key: "Website AI chat assistant", d: "Answers customer questions on your site" },
  { key: "Cost calculator", d: "e.g. EV charger, water heater or project estimate" },
  { key: "Emergency / urgent-service section" },
  { key: "“Before you go” estimate popup" },
  { key: "Automations", d: "Instant follow-up texts and emails to new leads, missed-call auto-texts, confirmation texts and emails, appointment reminders, email drip campaigns" },
  { key: "Custom animations and design touches" },
  { key: "Not sure, recommend for me" },
];
/** Smaller extras (the estimate form, reviews and emergency section are covered above). */
const EXTRAS = ["Online booking", "Photo gallery", "Financing info", "Service area map", "Spanish version"];
const DIFFERENT = ["Fast response", "Family-owned", "Licensed & insured", "Fair pricing", "Warranty"];
const JOB_VALUES = ["Under $250", "$250–$1,000", "$1,000–$5,000", "$5,000–$15,000", "$15,000+", "Not sure"];
const METHODS = ["Call", "Text", "Email"];

/** Each screen's share of the bar. Front-loaded so the quick screens feel fast (~40% after two). */
const WEIGHTS = [22, 18, 14, 12, 12, 12, 10];
const STEPS = WEIGHTS.length;
const PER_ANSWER = 0.35; // each answered question nudges the bar by this share of its screen

const MAX_LOGO = 5 * 1024 * 1024;
const STORAGE_KEY = "overpeck-mockup-v2";

const EMPTY: MockupRequest = {
  business: { name: "", industry: "", industryOther: "", area: "", years: "", website: "", noWebsite: false, gbp: "" },
  customers: { services: ["", "", ""], ideal: "", jobValue: "", different: "" },
  goals: { timeline: "", goals: [], headache: "" },
  look: { style: "", primary: "#1d6fe0", accent: "#f08c00", pickForMe: true, logo: null, likes: ["", ""] },
  features: [],
  extras: [],
  contact: { name: "", phone: "", email: "", bestTime: "Anytime", method: "", consent: false },
};

/** UI-only answers that get folded into the same MockupRequest fields on submit. */
type Ui = { hasSite: "" | "yes" | "no"; idealPicks: string[]; idealText: string; diffPicks: string[]; diffText: string; more: boolean };
const EMPTY_UI: Ui = { hasSite: "", idealPicks: [], idealText: "", diffPicks: [], diffText: "", more: false };

/* ---------- validation ---------- */

type Errors = Record<string, string>;
const phoneDigits = (v: string) => v.replace(/\D/g, "");
const isPhone = (v: string) => {
  const d = phoneDigits(v);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function validate(step: number, d: MockupRequest): Errors {
  const e: Errors = {};
  if (step === 3) {
    if (!d.business.name.trim()) e.name = "What should we put on the sign? Add your business name.";
    if (!d.business.area.trim()) e.area = "Add the town you're based in.";
  }
  if (step === 6) {
    const c = d.contact;
    if (!c.name.trim()) e.cname = "Add your name so Mark knows who to ask for.";
    if (!c.email.trim() && !c.phone.trim()) e.reach = "Add an email or a phone number (or both).";
    if (c.email.trim() && !isEmail(c.email)) e.email = "That email doesn't look quite right.";
    if (c.phone.trim() && !isPhone(c.phone)) e.phone = "Please use a 10-digit phone number.";
    if (c.method === "Email" && !c.email.trim() && !e.reach) e.email = "Add an email so we can reach you that way.";
    if ((c.method === "Call" || c.method === "Text") && !c.phone.trim() && !e.reach) e.phone = `Add a phone number so we can ${c.method.toLowerCase()} you.`;
    if (!c.consent) e.consent = "Please check this so we can send your mockup.";
  }
  return e;
}

/** [question 1 answered, question 2 answered] for each screen. */
function answered(step: number, d: MockupRequest, ui: Ui): [boolean, boolean] {
  const b = d.business;
  const c = d.contact;
  switch (step) {
    case 0:
      return [!!b.industry && (b.industry !== "Other" || !!b.industryOther.trim()), !!b.years];
    case 1:
      return [!!ui.hasSite, d.goals.goals.length > 0];
    case 2:
      return [!!d.look.style, !!d.goals.timeline];
    case 3:
      return [!!b.name.trim(), !!b.area.trim()];
    case 4:
      return [!!d.customers.services[0].trim(), ui.idealPicks.length > 0 || !!ui.idealText.trim()];
    case 5:
      return [d.features.length > 0 || d.extras.length > 0, ui.diffPicks.length > 0 || !!ui.diffText.trim()];
    default:
      return [!!c.name.trim(), (!!c.email.trim() || !!c.phone.trim()) && c.consent];
  }
}

function progress(step: number, d: MockupRequest, ui: Ui, done: boolean) {
  if (done) return 100;
  const before = WEIGHTS.slice(0, step).reduce((a, w) => a + w, 0);
  const n = answered(step, d, ui).filter(Boolean).length;
  const raw = before + WEIGHTS[step] * PER_ANSWER * n;
  return Math.round(5 + raw * 0.95);
}

function cheer(step: number, pct: number, done: boolean) {
  if (done) return "Done! Mark's starting on your design.";
  if (step === 0) return pct > 5 ? "Nice start. Tap, tap, done." : "About 2 minutes. Most of it is just tapping.";
  if (step === 1) return "Nice, that was quick.";
  if (step === 2) return "You're almost halfway there.";
  if (step <= 4) return "Halfway! Your mockup is taking shape.";
  return "Last few, you've got this.";
}

const join = (parts: string[]) => parts.map((p) => p.trim()).filter(Boolean).join(", ");

/** Fold the UI-only answers into the stored request shape. */
function finalize(d: MockupRequest, ui: Ui): MockupRequest {
  const phone = d.contact.phone.trim();
  return {
    ...d,
    business: { ...d.business, noWebsite: ui.hasSite === "no", website: ui.hasSite === "yes" ? d.business.website : "" },
    customers: { ...d.customers, ideal: join([...ui.idealPicks, ui.idealText]), different: join([...ui.diffPicks, ui.diffText]) },
    contact: { ...d.contact, method: d.contact.method || (phone ? "Call" : "Email") },
  };
}

/* ---------- small building blocks ---------- */

const inputCls =
  "w-full rounded-2xl border-2 bg-white px-4 py-3.5 text-[17px] text-ink placeholder:text-ink/45 transition focus:border-teal-ink focus:outline-none focus:ring-4 focus:ring-teal/25";
const border = (err?: string) => (err ? "border-mk-red/70" : "border-ink/12");

function Q({ id, title, hint, optional, children, as = "fieldset" }: { id: string; title: string; hint?: string; optional?: boolean; children: React.ReactNode; as?: "fieldset" | "div" }) {
  const head = (
    <>
      <span className="font-display block text-[1.45rem] font-bold leading-tight text-ink sm:text-[1.65rem]">{title}</span>
      {(hint || optional) && <span className="mt-1 block text-[15px] text-ink/60">{hint ?? "Optional"}</span>}
    </>
  );
  if (as === "div")
    return (
      <div className="space-y-4">
        <label htmlFor={id} className="block">
          {head}
        </label>
        {children}
      </div>
    );
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 block w-full">{head}</legend>
      {children}
    </fieldset>
  );
}

function Err({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={id} className="mt-2 text-[15px] font-medium text-mk-red" role="alert">
      {error}
    </p>
  ) : null;
}

/** A tap target with real radio/checkbox semantics (the input is visually hidden, the label is the card). */
function Choice({
  type,
  name,
  checked,
  onChange,
  children,
  className = "",
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer select-none items-center gap-2 rounded-2xl border-2 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-teal/40 active:scale-[0.98] motion-reduce:active:scale-100 ${
        checked ? "border-teal-ink bg-note-teal text-ink" : "border-ink/12 bg-white text-ink/85 hover:border-ink/30"
      } ${className}`}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
      {checked && type === "checkbox" && (
        <span className="ml-auto grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-ink text-[11px] font-bold text-white" aria-hidden>
          ✓
        </span>
      )}
    </label>
  );
}

const chip = "min-h-12 px-4 py-2.5 text-[15px] font-semibold";

/** A full-width checkbox row with a visible box, a title and an optional description (real input, keyboard-friendly). */
function Check({ name, checked, onChange, title, desc }: { name: string; checked: boolean; onChange: () => void; title: string; desc?: string }) {
  return (
    <label
      className={`flex cursor-pointer select-none items-start gap-3 rounded-2xl border-2 px-4 py-3.5 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-teal/40 ${
        checked ? "border-teal-ink bg-note-teal" : "border-ink/12 bg-white hover:border-ink/30"
      }`}
    >
      <input type="checkbox" name={name} value={title} checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${checked ? "border-teal-ink bg-teal-ink text-white" : "border-ink/30 bg-white"}`}
        aria-hidden
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[16px] font-semibold text-ink">{title}</span>
        {desc && <span className="mt-0.5 block text-[14px] leading-snug text-ink/65">{desc}</span>}
      </span>
    </label>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/** Tiny homepage sketch for each style card. */
function StylePreview({ k }: { k: (typeof STYLES)[number]["key"] }) {
  const p = {
    "Clean & modern": { bg: "#ffffff", bar: "#0b2545", fg: "#0b2545", acc: "#1d6fe0", r: "6px", center: false, heavy: false },
    Bold: { bg: "#111111", bar: "#ffd60a", fg: "#ffffff", acc: "#ffd60a", r: "2px", center: false, heavy: true },
    Classic: { bg: "#f6f1e7", bar: "#7a1f1f", fg: "#2b2b2b", acc: "#7a1f1f", r: "0px", center: true, heavy: false },
    Friendly: { bg: "#fff4ea", bar: "#2f9e44", fg: "#5a3214", acc: "#e8590c", r: "999px", center: false, heavy: false },
  }[k];
  return (
    <span className="block h-[4.5rem] overflow-hidden rounded-xl border border-ink/10 p-2" style={{ background: p.bg }} aria-hidden>
      <span className="flex items-center justify-between">
        <span className="h-1.5 w-6 rounded-full" style={{ background: p.bar }} />
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 w-2.5 rounded-full opacity-50" style={{ background: p.fg }} />
          ))}
        </span>
      </span>
      <span className={`mt-2 flex flex-col gap-1 ${p.center ? "items-center" : ""}`}>
        <span className="rounded-full" style={{ background: p.fg, height: p.heavy ? 7 : 4, width: p.heavy ? "80%" : "65%" }} />
        <span className="h-1 w-1/2 rounded-full opacity-40" style={{ background: p.fg }} />
        <span className="mt-1 h-2.5 w-10" style={{ background: p.acc, borderRadius: p.r }} />
      </span>
    </span>
  );
}

/* ---------- wizard ---------- */

export default function MockupWizard() {
  const [data, setData] = useState<MockupRequest>(EMPTY);
  const [ui, setUi] = useState<Ui>(EMPTY_UI);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [tried, setTried] = useState(false);
  const [ready, setReady] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoErr, setLogoErr] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [logoFailed, setLogoFailed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const uid = useId();
  const fid = (k: string) => `${uid}-${k}`;

  // Restore the draft, then apply ?industry= from an industry page link.
  useEffect(() => {
    let next = EMPTY;
    let nextUi = EMPTY_UI;
    let savedStep = 0;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { step: number; data: MockupRequest; ui: Ui };
        next = {
          business: { ...EMPTY.business, ...saved.data.business },
          customers: { ...EMPTY.customers, ...saved.data.customers },
          goals: { ...EMPTY.goals, ...saved.data.goals },
          look: { ...EMPTY.look, ...saved.data.look, logo: null },
          features: Array.isArray(saved.data.features) ? saved.data.features : [],
          extras: saved.data.extras ?? [],
          contact: { ...EMPTY.contact, ...saved.data.contact },
        };
        nextUi = { ...EMPTY_UI, ...saved.ui };
        savedStep = Math.min(Math.max(0, saved.step | 0), STEPS - 1);
      }
    } catch {
      /* storage unavailable or corrupt: start fresh */
    }
    const q = new URLSearchParams(window.location.search).get("industry");
    if (q) {
      const lower = q.toLowerCase();
      const name = INDUSTRY_SLUGS.find((x) => x.slug === lower)?.mockup.toLowerCase() ?? lower;
      const match = INDUSTRIES.find((o) => o.key.toLowerCase() === name)?.key ?? INDUSTRY_ALIASES[name];
      const other = INDUSTRY_SLUGS.find((x) => x.slug === lower)?.name ?? q;
      next = { ...next, business: { ...next.business, industry: match ?? "Other", industryOther: match ? next.business.industryOther : other.slice(0, 60) } };
    }
    setData(next);
    setUi(nextUi);
    setStep(savedStep);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || status === "done") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data, ui }));
    } catch {
      /* ignore quota / private mode */
    }
  }, [data, ui, step, ready, status]);

  useEffect(
    () => () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    },
    [logoUrl],
  );

  // After a step change: bring the form into view and focus the first answer (not on first load).
  useEffect(() => {
    if (!moved.current) return;
    requestAnimationFrame(() => {
      const top = formRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) formRef.current?.scrollIntoView({ block: "start" });
      const root = screenRef.current;
      const el =
        root?.querySelector<HTMLElement>("input:checked") ??
        root?.querySelector<HTMLElement>("input:not([type=file]):not([tabindex='-1']), textarea");
      el?.focus({ preventScroll: true });
    });
  }, [step]);

  const set = <K extends keyof MockupRequest>(section: K, patch: Partial<MockupRequest[K]>) =>
    setData((d) => ({ ...d, [section]: { ...(d[section] as object), ...patch } }) as MockupRequest);
  const setU = (patch: Partial<Ui>) => setUi((u) => ({ ...u, ...patch }));
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const goTo = (n: number) => {
    moved.current = true;
    setDir(n > step ? "fwd" : "back");
    setTried(false);
    setStep(n);
  };

  const errors = tried ? validate(step, data) : {};
  const [a1, a2] = answered(step, data, ui);
  const required = step === 3 || step === 6;
  const ok = Object.keys(validate(step, data)).length === 0;
  const lit = required ? ok : a1 || a2;
  const done = status === "done";
  const pct = progress(step, data, ui, done);

  const submit = async () => {
    setStatus("sending");
    const payload = finalize(data, ui);
    let res: Awaited<ReturnType<typeof submitMockupRequest>>;
    try {
      res = await submitMockupRequest(payload, logoFile, honeypot.current?.value ?? "");
    } catch (err) {
      console.error("[mockup request] unexpected error", err);
      res = { ok: false, error: "network" };
    }
    // Only show the success screen after a real insert (or a silently dropped spam submission).
    if (res.ok) {
      setLogoFailed(res.logoFailed);
      setFirstName(payload.contact.name.trim().split(/\s+/)[0] ?? "");
      setStatus("done");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      requestAnimationFrame(() => doneRef.current?.focus());
    } else {
      setStatus("error");
    }
  };

  const onContinue = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (status === "sending") return;
    setTried(true);
    const errs = validate(step, data);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    if (step < STEPS - 1) goTo(step + 1);
    else void submit();
  };

  // Enter advances from cards too (text inputs already submit the form natively).
  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const t = e.target as HTMLElement;
    if (e.key === "Enter" && t instanceof HTMLInputElement && (t.type === "radio" || t.type === "checkbox")) {
      e.preventDefault();
      onContinue();
    }
  };

  const onLogo = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setLogoErr("Please choose an image file (PNG, JPG, SVG…).");
    if (f.size > MAX_LOGO) return setLogoErr("That file is over 5 MB. Please choose a smaller image.");
    setLogoErr(null);
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

  const b = data.business;
  const c = data.customers;
  const l = data.look;
  const ct = data.contact;
  const industry = INDUSTRIES.find((i) => i.key === b.industry);
  const describe = (k: string) => ({ id: fid(k), "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? fid(`${k}-err`) : undefined });

  /* ---------- progress header ---------- */
  const bar = (
    <div className="sticky top-[4.6rem] z-30 -mx-4 bg-[#f8f8f5] px-4 pb-3 pt-3 before:absolute before:inset-x-0 before:bottom-full before:h-[4.6rem] before:bg-[#f8f8f5] before:content-[''] sm:mx-0 sm:px-0">
      <div className="flex items-center justify-between gap-3 text-sm">
        {!done && step > 0 ? (
          <button type="button" onClick={() => goTo(step - 1)} className="-ml-1 rounded-full px-1 py-0.5 font-semibold text-ink/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-teal-ink">
            ← Back
          </button>
        ) : (
          <span />
        )}
        <span className="font-semibold tabular-nums text-ink/70">{pct}% done</span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-ink/[0.08]"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="h-full rounded-full bg-teal transition-[width] duration-500 ease-out motion-reduce:transition-none" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[15px] font-medium text-teal-ink" aria-live="polite">
        {cheer(step, pct, done)}
      </p>
    </div>
  );

  /* ---------- success ---------- */
  if (done) {
    return (
      <div className="mx-auto max-w-[560px]">
        {bar}
        <section className="mk-in-fwd pt-10 text-center" aria-labelledby={fid("done")}>
          <svg className="mk-check mx-auto" width="88" height="88" viewBox="0 0 88 88" aria-hidden>
            <circle cx="44" cy="44" r="40" fill="#c8f5ec" stroke="#0f766e" strokeWidth="3" />
            <path d="M27 45l11 11 23-24" fill="none" stroke="#0f766e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 id={fid("done")} ref={doneRef} tabIndex={-1} className="font-display mt-6 text-3xl font-bold leading-tight focus:outline-none sm:text-4xl">
            You&apos;re all set{firstName ? `, ${firstName}` : ""}!
          </h2>
          <p className="mt-3 text-lg text-ink/80">Mark will have your free homepage mockup ready soon.</p>
          {logoFailed && (
            <p role="alert" className="mt-5 rounded-2xl border border-amber-400/50 bg-amber-50 p-3 text-[15px] text-amber-900">
              Your request was saved, but your logo didn&apos;t upload. Mention it when Mark reaches out.
            </p>
          )}
          <p className="mt-5 text-[17px] text-ink/80">
            Questions? Call{" "}
            <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-ink underline">
              {PHONE_DISPLAY}
            </a>
            .
          </p>
          <Link href="/" className="btn-primary mt-8">
            Back to home
          </Link>
        </section>
      </div>
    );
  }

  /* ---------- screens ---------- */
  const screens: React.ReactNode[] = [
    // 1. industry + years
    <>
      <Q id={fid("industry")} title="What kind of business do you run?">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {INDUSTRIES.map((i) => (
            <Choice key={i.key} type="radio" name={fid("industry")} checked={b.industry === i.key} onChange={() => set("business", { industry: i.key })} className="min-h-[5.25rem] flex-col justify-center px-2 py-3 text-center text-[15px] font-semibold">
              <span className={b.industry === i.key ? "text-teal-ink" : "text-ink/70"}>
                <Icon d={i.icon} />
              </span>
              <span className="leading-tight">{i.key}</span>
            </Choice>
          ))}
        </div>
        {b.industry === "Other" && (
          <div className="mk-in-fwd">
            <label htmlFor={fid("industryOther")} className="sr-only">
              Your industry
            </label>
            <input id={fid("industryOther")} className={`${inputCls} ${border()}`} value={b.industryOther} onChange={(e) => set("business", { industryOther: e.target.value })} placeholder="What do you do? e.g. Pest control" maxLength={60} autoFocus />
          </div>
        )}
      </Q>
      <Q id={fid("years")} title="How long have you been in business?">
        <div className="grid grid-cols-2 gap-2.5">
          {YEARS.map((y) => (
            <Choice key={y} type="radio" name={fid("years")} checked={b.years === y} onChange={() => set("business", { years: y })} className={`${chip} justify-center`}>
              {y}
            </Choice>
          ))}
        </div>
      </Q>
    </>,

    // 2. website + goals
    <>
      <Q id={fid("hasSite")} title="Do you have a website now?">
        <div className="grid grid-cols-2 gap-2.5">
          {(["yes", "no"] as const).map((v) => (
            <Choice key={v} type="radio" name={fid("hasSite")} checked={ui.hasSite === v} onChange={() => setU({ hasSite: v })} className={`${chip} justify-center`}>
              {v === "yes" ? "Yes" : "No"}
            </Choice>
          ))}
        </div>
        {ui.hasSite === "yes" && (
          <div className="mk-in-fwd">
            <label htmlFor={fid("website")} className="mb-1.5 block text-[15px] text-ink/60">
              What&apos;s the address? (optional)
            </label>
            <input id={fid("website")} className={`${inputCls} ${border()}`} value={b.website} onChange={(e) => set("business", { website: e.target.value })} inputMode="url" autoComplete="url" placeholder="yoursite.com" />
          </div>
        )}
      </Q>
      <Q id={fid("goals")} title="What do you want your new site to do?" hint="Pick all that apply.">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {GOALS.map((g) => (
            <Choice key={g} type="checkbox" name={fid("goals")} checked={data.goals.goals.includes(g)} onChange={() => set("goals", { goals: toggle(data.goals.goals, g) })} className={chip}>
              {g}
            </Choice>
          ))}
        </div>
      </Q>
    </>,

    // 3. style + timeline
    <>
      <Q id={fid("style")} title="What style do you like?">
        <div className="grid grid-cols-2 gap-2.5">
          {STYLES.map((s) => (
            <Choice key={s.key} type="radio" name={fid("style")} checked={l.style === s.key} onChange={() => set("look", { style: s.key })} className="flex-col items-stretch gap-0 p-2.5 text-left">
              <StylePreview k={s.key} />
              <span className="mt-2 block px-0.5 text-[15px] font-semibold">{s.key}</span>
              <span className="block px-0.5 text-[13px] leading-snug text-ink/60">{s.d}</span>
            </Choice>
          ))}
        </div>
      </Q>
      <Q id={fid("timeline")} title="When do you want your new site?">
        <div className="grid grid-cols-2 gap-2.5">
          {TIMELINES.map((t) => (
            <Choice key={t.value} type="radio" name={fid("timeline")} checked={data.goals.timeline === t.value} onChange={() => set("goals", { timeline: t.value })} className={`${chip} justify-center`}>
              {t.label}
            </Choice>
          ))}
        </div>
      </Q>
    </>,

    // 4. name + town (required)
    <>
      <Q as="div" id={fid("name")} title="What's your business called?">
        <input {...describe("name")} className={`${inputCls} ${border(errors.name)}`} value={b.name} onChange={(e) => set("business", { name: e.target.value })} autoComplete="organization" placeholder="e.g. Bergen Flow Plumbing" maxLength={120} />
        <Err id={fid("name-err")} error={errors.name} />
      </Q>
      <Q as="div" id={fid("area")} title="Which town are you based in?">
        <input {...describe("area")} className={`${inputCls} ${border(errors.area)}`} value={b.area} onChange={(e) => set("business", { area: e.target.value })} autoComplete="address-level2" placeholder="e.g. Hackensack" maxLength={120} />
        <Err id={fid("area-err")} error={errors.area} />
      </Q>
    </>,

    // 5. services + ideal customer
    <>
      <Q as="div" id={fid("services")} title="What are your top services?" hint="A few is plenty.">
        <input
          id={fid("services")}
          className={`${inputCls} ${border()}`}
          value={c.services[0]}
          onChange={(e) => set("customers", { services: [e.target.value, "", ""] })}
          placeholder={`e.g. ${industry?.services || "Your top 2–3 services"}`}
          maxLength={300}
        />
      </Q>
      <Q id={fid("ideal")} title="Who's your ideal customer?">
        <div className="flex flex-wrap gap-2.5">
          {IDEAL.map((v) => (
            <Choice key={v} type="checkbox" name={fid("ideal")} checked={ui.idealPicks.includes(v)} onChange={() => setU({ idealPicks: toggle(ui.idealPicks, v) })} className={chip}>
              {v}
            </Choice>
          ))}
        </div>
        <label htmlFor={fid("idealText")} className="sr-only">
          Anything more about your ideal customer (optional)
        </label>
        <input id={fid("idealText")} className={`${inputCls} ${border()}`} value={ui.idealText} onChange={(e) => setU({ idealText: e.target.value })} placeholder="Anything more? (optional)" maxLength={200} />
      </Q>
    </>,

    // 6. included list + features + extras + differentiators + more details
    <>
      <section aria-labelledby={fid("included")} className="rounded-3xl border-2 border-ink/10 bg-white p-5 sm:p-6">
        <h2 id={fid("included")} className="font-display text-[1.45rem] font-bold leading-tight text-ink sm:text-[1.65rem]">
          Included with every site
        </h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {INCLUDED.map((x) => (
            <li key={x} className="flex items-start gap-2.5 text-[15px] text-ink/85">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-ink text-white" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </span>
              {x}
            </li>
          ))}
        </ul>
      </section>
      <Q id={fid("features")} title="Want any of these on your site?" hint="Pick any. All optional.">
        <div className="grid gap-2.5">
          {FEATURES.map((f) => (
            <Check key={f.key} name={fid("features")} checked={data.features.includes(f.key)} onChange={() => setData((d) => ({ ...d, features: toggle(d.features, f.key) }))} title={f.key} desc={f.d} />
          ))}
        </div>
      </Q>
      <Q id={fid("extras")} title="Anything else you'd like?" hint="Pick any. All optional.">
        <div className="flex flex-wrap gap-2.5">
          {EXTRAS.map((x) => (
            <Choice key={x} type="checkbox" name={fid("extras")} checked={data.extras.includes(x)} onChange={() => setData((d) => ({ ...d, extras: toggle(d.extras, x) }))} className={chip}>
              {x}
            </Choice>
          ))}
        </div>
      </Q>
      <Q id={fid("diff")} title="What makes you different?" optional>
        <div className="flex flex-wrap gap-2.5">
          {DIFFERENT.map((v) => (
            <Choice key={v} type="checkbox" name={fid("diff")} checked={ui.diffPicks.includes(v)} onChange={() => setU({ diffPicks: toggle(ui.diffPicks, v) })} className={chip}>
              {v}
            </Choice>
          ))}
        </div>
        <label htmlFor={fid("diffText")} className="sr-only">
          Anything else that makes you different (optional)
        </label>
        <input id={fid("diffText")} className={`${inputCls} ${border()}`} value={ui.diffText} onChange={(e) => setU({ diffText: e.target.value })} placeholder="Anything else? (optional)" maxLength={300} />
      </Q>

      <div className="border-t border-ink/10 pt-5">
        <button type="button" aria-expanded={ui.more} aria-controls={fid("more")} onClick={() => setU({ more: !ui.more })} className="text-[16px] font-semibold text-teal-ink underline-offset-4 hover:underline">
          {ui.more ? "− Hide extra details" : "+ Add more details (optional)"}
        </button>
        {ui.more && (
          <div id={fid("more")} className="mk-in-fwd mt-5 space-y-6">
            <fieldset>
              <legend className="mb-2 text-[16px] font-semibold">Brand colors</legend>
              <label className="flex w-fit cursor-pointer items-center gap-2 text-[15px]">
                <input type="checkbox" className="h-5 w-5 accent-[#0f766e]" checked={l.pickForMe} onChange={(e) => set("look", { pickForMe: e.target.checked })} />
                Pick colors for me
              </label>
              {!l.pickForMe && (
                <div className="mt-3 flex flex-wrap gap-5">
                  {(
                    [
                      ["primary", "Main color"],
                      ["accent", "Accent color"],
                    ] as const
                  ).map(([k, label]) => (
                    <label key={k} className="flex items-center gap-2 text-[15px]">
                      <input type="color" value={l[k]} onChange={(e) => set("look", { [k]: e.target.value })} className="h-11 w-12 cursor-pointer rounded-lg border border-ink/20 bg-transparent p-0.5" />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </fieldset>

            <div>
              <label htmlFor={fid("logo")} className="mb-2 block text-[16px] font-semibold">
                Logo <span className="font-normal text-ink/55">(image, up to 5 MB)</span>
              </label>
              {l.logo ? (
                <div className="flex items-center gap-3 rounded-2xl border-2 border-ink/12 bg-white p-3">
                  {logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="Your uploaded logo" className="h-12 w-12 rounded-lg object-contain" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-[15px]">{l.logo.name}</span>
                  <button type="button" onClick={removeLogo} className="rounded-full border border-ink/15 px-3 py-1.5 text-sm hover:bg-ink/5">
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  id={fid("logo")}
                  type="file"
                  accept="image/*"
                  aria-invalid={logoErr ? true : undefined}
                  aria-describedby={logoErr ? fid("logo-err") : undefined}
                  onChange={(e) => onLogo(e.target.files?.[0])}
                  className="block w-full cursor-pointer rounded-2xl border-2 border-dashed border-ink/20 bg-white p-3 text-[15px] text-ink/70 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink/5 file:px-4 file:py-2 file:font-semibold file:text-ink"
                />
              )}
              <Err id={fid("logo-err")} error={logoErr ?? undefined} />
            </div>

            <fieldset className="space-y-2">
              <legend className="mb-2 text-[16px] font-semibold">Websites you like</legend>
              {[0, 1].map((i) => (
                <div key={i}>
                  <label htmlFor={fid(`like${i}`)} className="sr-only">
                    Website you like {i + 1}
                  </label>
                  <input
                    id={fid(`like${i}`)}
                    className={`${inputCls} ${border()}`}
                    value={l.likes[i]}
                    inputMode="url"
                    onChange={(e) => {
                      const v = [...l.likes] as [string, string];
                      v[i] = e.target.value;
                      set("look", { likes: v });
                    }}
                    placeholder="https://…"
                  />
                </div>
              ))}
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-[16px] font-semibold">Average job value</legend>
              <div className="flex flex-wrap gap-2">
                {JOB_VALUES.map((v) => (
                  <Choice key={v} type="radio" name={fid("jobValue")} checked={c.jobValue === v} onChange={() => set("customers", { jobValue: v })} className="min-h-11 px-3.5 py-2 text-[14px] font-semibold">
                    {v}
                  </Choice>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={fid("gbp")} className="mb-2 block text-[16px] font-semibold">
                Google Business Profile link
              </label>
              <input id={fid("gbp")} className={`${inputCls} ${border()}`} value={b.gbp} onChange={(e) => set("business", { gbp: e.target.value })} inputMode="url" placeholder="https://maps.app.goo.gl/…" />
            </div>

            <div>
              <label htmlFor={fid("headache")} className="mb-2 block text-[16px] font-semibold">
                Biggest headache right now
              </label>
              <textarea id={fid("headache")} rows={3} maxLength={400} className={`${inputCls} ${border()}`} value={data.goals.headache} onChange={(e) => set("goals", { headache: e.target.value })} placeholder="e.g. I miss calls while I'm on jobs" />
            </div>
          </div>
        )}
      </div>
    </>,

    // 7. contact (required)
    <>
      <Q as="div" id={fid("cname")} title="What's your name?">
        <input {...describe("cname")} className={`${inputCls} ${border(errors.cname)}`} value={ct.name} onChange={(e) => set("contact", { name: e.target.value })} autoComplete="name" placeholder="First and last name" maxLength={120} />
        <Err id={fid("cname-err")} error={errors.cname} />
      </Q>
      <Q id={fid("reach")} title="Where should we send your mockup?" hint="Email, phone, or both.">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={fid("email")} className="mb-1.5 block text-[15px] font-semibold text-ink/75">
              Email
            </label>
            <input
              id={fid("email")}
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={errors.email || errors.reach ? true : undefined}
              aria-describedby={errors.email ? fid("email-err") : errors.reach ? fid("reach-err") : undefined}
              className={`${inputCls} ${border(errors.email || errors.reach)}`}
              value={ct.email}
              onChange={(e) => set("contact", { email: e.target.value })}
              placeholder="you@company.com"
            />
            <Err id={fid("email-err")} error={errors.email} />
          </div>
          <div>
            <label htmlFor={fid("phone")} className="mb-1.5 block text-[15px] font-semibold text-ink/75">
              Phone
            </label>
            <input
              id={fid("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={errors.phone || errors.reach ? true : undefined}
              aria-describedby={errors.phone ? fid("phone-err") : errors.reach ? fid("reach-err") : undefined}
              className={`${inputCls} ${border(errors.phone || errors.reach)}`}
              value={ct.phone}
              onChange={(e) => set("contact", { phone: e.target.value })}
              placeholder="(201) 555-0123"
            />
            <Err id={fid("phone-err")} error={errors.phone} />
          </div>
        </div>
        <Err id={fid("reach-err")} error={errors.reach} />
        <fieldset>
          <legend className="mb-2 text-[15px] font-semibold text-ink/75">Best way to reach you</legend>
          <div className="grid grid-cols-3 gap-2.5">
            {METHODS.map((m) => (
              <Choice key={m} type="radio" name={fid("method")} checked={ct.method === m} onChange={() => set("contact", { method: m })} className={`${chip} justify-center`}>
                {m}
              </Choice>
            ))}
          </div>
        </fieldset>
        <div>
          <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white px-4 py-3.5 ${errors.consent ? "border-mk-red/70" : "border-ink/12"}`}>
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#0f766e]"
              checked={ct.consent}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? fid("consent-err") : undefined}
              onChange={(e) => set("contact", { consent: e.target.checked })}
            />
            <span className="text-[15px] leading-snug text-ink/85">Yes, Overpeck Labs can contact me about my free mockup by phone, text or email. No spam, no obligation.</span>
          </label>
          <Err id={fid("consent-err")} error={errors.consent} />
        </div>
        {status === "error" && (
          <p role="alert" className="rounded-2xl border border-mk-red/40 bg-mk-red/5 p-3 text-[15px] text-mk-red">
            We couldn&apos;t send your request. Please try again in a moment, or call {PHONE_DISPLAY}.
          </p>
        )}
      </Q>
    </>,
  ];

  const last = step === STEPS - 1;
  const showSkip = !required && !(a1 && a2);

  return (
    <form ref={formRef} onSubmit={onContinue} onKeyDown={onKeyDown} noValidate className="mx-auto max-w-[560px] scroll-mt-20" aria-busy={!ready}>
      <HoneypotField ref={honeypot} />
      {bar}

      <div ref={screenRef} key={step} className={`${dir === "fwd" ? "mk-in-fwd" : "mk-in-back"} space-y-10 pt-6`}>
        {screens[step]}
      </div>

      {/* Continue: sticky at the bottom on mobile, inline on larger screens. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-[#f8f8f5]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:mt-10 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-[560px] items-center gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className={`min-h-14 flex-1 rounded-full border-2 px-6 text-[17px] font-bold transition sm:flex-none sm:min-w-[14rem] ${
              lit ? "border-ink/20 bg-teal text-[#06201c] shadow-[0_8px_22px_rgba(13,148,136,0.28)] hover:bg-[#3ff6dd]" : "border-ink/10 bg-ink/[0.07] text-ink/55"
            } disabled:opacity-70`}
          >
            {last ? (status === "sending" ? "Sending…" : "Get my free mockup") : "Continue"}
          </button>
          {showSkip && (
            <button type="button" onClick={() => goTo(step + 1)} className="shrink-0 px-2 py-2 text-[16px] font-semibold text-ink/55 underline-offset-4 hover:text-ink hover:underline">
              Skip
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
