"use client";

/**
 * Lead capture shared by every client demo.
 *
 *   <LeadForm>        short form (name, phone, one industry question as tap chips) + big CTA, inline success
 *                     state labeled as a demo, and an optional "Add details" multi-step form (<DetailsSteps>)
 *   <LeadJump>        link that scrolls to the hero form, or opens its "Add details" steps if it was
 *                     already submitted (used by <CtaBand> and <MobileLeadBar>)
 *   <CtaBand>         short call-to-action band (after services, and wherever a long form used to be)
 *   <MobileLeadBar>   sticky Call / Get quote bar on phones; appears once the hero form scrolls out of view
 *   <ExitIntent>      desktop-only "Before you go" modal with the same short form, once per session
 *
 * Demos never send anything: submitLead() is the single place a real site would save to Supabase.
 */

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/* ---------- data model (ready for Supabase later) ---------- */

export type LeadSource = "hero" | "final" | "exit";

/** What the short form collected; handed to a custom "Add details" flow so it can submit everything together. */
export type LeadBasics = { slug: string; source: LeadSource; name: string; phone: string; need: string | null };

/** Shape a real site would insert into a `leads` table. */
export type Lead = {
  slug: string;
  source: LeadSource;
  name: string;
  phone: string;
  need: string | null;
  details?: Record<string, string>;
  page_url: string;
  created_at: string;
};

export type LeadResult = { ok: true; demo: boolean } | { ok: false; error: string };

/**
 * Demo: nothing is sent. A live site would replace the body with e.g.
 *   await supabase.from("leads").insert(lead)   (anon INSERT-only, no .select())
 */
export async function submitLead(lead: Lead): Promise<LeadResult> {
  void lead;
  return { ok: true, demo: true };
}

const LEAD_EVENT = "demo-lead-submitted";
const JUMP_EVENT = "demo-lead-jump";

/**
 * Scrolls to the hero form (targetId) and focuses it; if that form was already submitted, opens its
 * "Add details" steps instead. Plain #anchor fallback without JS.
 */
export function LeadJump({ targetId = "lead", className, style, tabIndex, children }: { targetId?: string; className?: string; style?: React.CSSProperties; tabIndex?: number; children: ReactNode }) {
  return (
    <a
      href={`#${targetId}`}
      className={className}
      style={style}
      tabIndex={tabIndex}
      onClick={(e) => {
        const handled = !window.dispatchEvent(new CustomEvent(JUMP_EVENT, { detail: targetId, cancelable: true }));
        if (handled) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}

/* ---------- helpers ---------- */

const digits = (v: string) => v.replace(/\D/g, "");
const validPhone = (v: string) => {
  const d = digits(v);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};

export type LeadTheme = {
  /** "dark": form sits on a dark/glass background (white labels); "light": on a light background. */
  tone: "dark" | "light";
  primary: string;
  accent: string;
  /** CTA button background + text colors. */
  ctaBg: string;
  ctaText: string;
};

export type Ask = { label: string; options: string[] };

export type DetailField =
  | { name: string; label: string; type: "text" | "email" | "date" | "number"; placeholder?: string; optional?: boolean }
  | { name: string; label: string; type: "select"; options: string[]; optional?: boolean }
  | { name: string; label: string; type: "textarea"; placeholder?: string; optional?: boolean }
  | { name: string; label: string; type: "photos"; optional?: boolean };

export type DetailStep = { title: string; fields: DetailField[] };

const inputBase = "w-full rounded-xl border bg-white px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4";

/* ---------- short form ---------- */

export function LeadForm({
  slug,
  source,
  businessName,
  ask,
  cta,
  theme,
  title,
  reassurance = "Takes 20 seconds · No spam",
  details,
  renderDetails,
  anchorId,
  phonePlaceholder = "(201) 555-0123",
}: {
  slug: string;
  source: LeadSource;
  businessName: string;
  ask: Ask;
  cta: string;
  theme: LeadTheme;
  title?: string;
  reassurance?: string;
  /** Longer multi-step form offered after the short form succeeds. */
  details?: DetailStep[];
  /** Custom "Add details" flow (e.g. a multi-step quote) instead of <DetailsSteps>; must submit via submitLead(). */
  renderDetails?: (basics: LeadBasics) => ReactNode;
  anchorId?: string;
  /** Example text in the phone field. */
  phonePlaceholder?: string;
}) {
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [need, setNeed] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [state, setState] = useState<"form" | "sending" | "done">("form");
  const [showDetails, setShowDetails] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dark = theme.tone === "dark";
  const label = `mb-1 block text-xs font-semibold ${dark ? "text-white/85" : "text-slate-700"}`;
  const ring = { ["--tw-ring-color" as string]: `${theme.primary}40` };

  // <LeadJump> links elsewhere on the page land here: focus the form, or open "Add details" once submitted.
  useEffect(() => {
    if (!anchorId) return;
    const onJump = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== anchorId) return;
      const el = state === "done" ? doneRef.current : formRef.current;
      if (!el) return;
      e.preventDefault();
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (state !== "done") {
        el.scrollIntoView({ behavior, block: "start" });
        el.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
        return;
      }
      if (details || renderDetails) setShowDetails(true);
      // wait for the steps to render, then bring them (not the success header) into view
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const target = el.querySelector<HTMLElement>("form") ?? el;
          target.scrollIntoView({ behavior, block: "center" });
          (target.querySelector<HTMLElement>("input, select, textarea") ?? el).focus({ preventScroll: true });
        }),
      );
    };
    window.addEventListener(JUMP_EVENT, onJump);
    return () => window.removeEventListener(JUMP_EVENT, onJump);
  }, [anchorId, state, details, renderDetails]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Add your name.";
    if (!validPhone(phone)) errs.phone = "Add a 10-digit phone number.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`${uid}-${errs.name ? "name" : "phone"}`)?.focus();
      return;
    }
    setState("sending");
    const res = await submitLead({ slug, source, name: name.trim(), phone: phone.trim(), need, page_url: window.location.href, created_at: new Date().toISOString() });
    if (res.ok) {
      setState("done");
      window.dispatchEvent(new CustomEvent(LEAD_EVENT));
      requestAnimationFrame(() => doneRef.current?.focus());
    } else setState("form");
  }

  // The anchor id sits on a stable wrapper, so observers (e.g. <MobileLeadBar>) keep working after the form
  // is swapped for the success state.
  let body: ReactNode;
  if (state === "done") {
    const first = name.trim().split(/\s+/)[0];
    body = (
      <div ref={doneRef} tabIndex={-1} role="status" aria-live="polite" className="scroll-mt-28 outline-none">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-bold text-white" style={{ background: theme.primary }} aria-hidden>
            ✓
          </span>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-white/60" : "text-slate-500"}`}>Request received · Demo</p>
            <p className={`mt-0.5 text-lg font-extrabold leading-snug ${dark ? "text-white" : "text-slate-900"}`}>Thanks, {first}! You&apos;re all set.</p>
            <p className={`mt-1 text-sm ${dark ? "text-white/75" : "text-slate-600"}`}>On the live site, {businessName} would get this right away and reach out to {phone.trim()}.</p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">Demo only, nothing was sent.</p>
        {(details || renderDetails) && !showDetails && (
          <button type="button" onClick={() => setShowDetails(true)} className={`mt-3 w-full rounded-full border-2 px-4 py-3 text-sm font-bold ${dark ? "border-white/30 text-white hover:bg-white/10" : "border-slate-300 text-slate-800 hover:bg-slate-50"}`}>
            Add details (optional)
          </button>
        )}
        {showDetails && renderDetails && renderDetails({ slug, source, name: name.trim(), phone: phone.trim(), need })}
        {showDetails && !renderDetails && details && <DetailsSteps steps={details} tone={theme.tone} primary={theme.primary} />}
      </div>
    );
  } else {
    body = (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="scroll-mt-28" aria-label={title ?? cta}>
      {title && <p className={`mb-3 text-base font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>{title}</p>}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label htmlFor={`${uid}-name`} className={label}>
            Your name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputBase} ${errors.name ? "border-red-400" : "border-slate-300"}`}
            style={ring}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            maxLength={80}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={label}>
            Phone
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${inputBase} ${errors.phone ? "border-red-400" : "border-slate-300"}`}
            style={ring}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
            placeholder={phonePlaceholder}
          />
        </div>
      </div>
      {(errors.name || errors.phone) && (
        <p id={errors.name ? `${uid}-name-err` : `${uid}-phone-err`} role="alert" className={`mt-1.5 text-xs font-semibold ${dark ? "text-red-200" : "text-red-600"}`}>
          {errors.name ?? errors.phone}
        </p>
      )}
      <fieldset className="mt-3">
        <legend className={label}>{ask.label}</legend>
        <div className="flex flex-wrap gap-1.5">
          {ask.options.map((o) => {
            const on = need === o;
            return (
              <label
                key={o}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13px] font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-1 ${
                  on ? "border-transparent text-white" : dark ? "border-white/30 bg-white/10 text-white hover:bg-white/20" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
                style={on ? { background: theme.primary } : undefined}
              >
                <input type="radio" name={`${uid}-need`} value={o} checked={on} onChange={() => setNeed(o)} className="sr-only" />
                {o}
              </label>
            );
          })}
        </div>
      </fieldset>
      <button
        type="submit"
        disabled={state === "sending"}
        className="demo-lift mt-4 w-full rounded-full px-6 py-3.5 text-base font-extrabold shadow-lg disabled:opacity-70"
        style={{ background: theme.ctaBg, color: theme.ctaText }}
      >
        {state === "sending" ? "Sending…" : cta}
      </button>
      <p className={`mt-2 text-center text-xs ${dark ? "text-white/70" : "text-slate-500"}`}>{reassurance}</p>
    </form>
    );
  }
  return (
    <div id={anchorId} className="scroll-mt-28">
      {body}
    </div>
  );
}

/* ---------- multi-step details ---------- */

export function DetailsSteps({ steps, tone, primary }: { steps: DetailStep[]; tone: "dark" | "light"; primary: string }) {
  const uid = useId();
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const dark = tone === "dark";
  const label = `mb-1 block text-xs font-semibold ${dark ? "text-white/85" : "text-slate-700"}`;
  const step = steps[i];
  const last = i === steps.length - 1;

  if (done)
    return (
      <p role="status" className={`mt-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${dark ? "bg-white/10 text-white" : "bg-slate-50 text-slate-800"}`}>
        Details added · Demo only, nothing was sent.
      </p>
    );

  return (
    <form
      className={`mt-3 rounded-2xl p-3.5 ${dark ? "bg-white/10" : "bg-slate-50"}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (last) setDone(true);
        else setI(i + 1);
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>{step.title}</p>
        <p className={`text-xs font-semibold ${dark ? "text-white/60" : "text-slate-500"}`}>
          Step {i + 1} of {steps.length}
        </p>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${((i + 1) / steps.length) * 100}%`, background: primary }} />
      </div>
      <div className="mt-3 grid gap-2.5">
        {step.fields.map((f) => {
          const id = `${uid}-${f.name}`;
          const lab = (
            <label htmlFor={id} className={label}>
              {f.label} {f.optional && <span className="font-normal opacity-70">(optional)</span>}
            </label>
          );
          if (f.type === "select")
            return (
              <div key={f.name}>
                {lab}
                <select id={id} name={f.name} defaultValue="" className={`${inputBase} border-slate-300 py-2.5`}>
                  <option value="" disabled>
                    Choose
                  </option>
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            );
          if (f.type === "textarea")
            return (
              <div key={f.name}>
                {lab}
                <textarea id={id} name={f.name} rows={3} placeholder={f.placeholder} className={`${inputBase} border-slate-300 py-2.5`} />
              </div>
            );
          if (f.type === "photos")
            return (
              <div key={f.name}>
                {lab}
                <input id={id} name={f.name} type="file" accept="image/*" multiple className={`block w-full text-sm ${dark ? "text-white/80" : "text-slate-600"} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-800`} />
                <p className={`mt-1 text-xs ${dark ? "text-white/60" : "text-slate-500"}`}>Photos stay on your device in this demo.</p>
              </div>
            );
          return (
            <div key={f.name}>
              {lab}
              <input id={id} name={f.name} type={f.type} inputMode={f.type === "number" ? "numeric" : undefined} placeholder={f.placeholder} className={`${inputBase} border-slate-300 py-2.5`} />
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        {i > 0 && (
          <button type="button" onClick={() => setI(i - 1)} className={`rounded-full border px-4 py-2.5 text-sm font-bold ${dark ? "border-white/30 text-white" : "border-slate-300 text-slate-700"}`}>
            Back
          </button>
        )}
        <button type="submit" className="flex-1 rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: primary }}>
          {last ? "Send details" : "Next"}
        </button>
      </div>
    </form>
  );
}

/* ---------- mid-page band ---------- */

export function CtaBand({ id, title, body, ctaLabel, targetId = "lead", phone, bg, ctaBg, ctaText, children }: { id?: string; title: string; body?: string; ctaLabel: string; targetId?: string; phone?: { display: string; tel: string } | null; bg: string; ctaBg: string; ctaText: string; children?: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 rounded-[2rem] px-6 py-8 text-center text-white sm:px-10 md:flex-row md:text-left" style={{ background: bg }}>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
          {body && <p className="mt-1.5 text-white/80">{body}</p>}
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
          <LeadJump targetId={targetId} className="demo-lift rounded-full px-6 py-3.5 text-center font-extrabold" style={{ background: ctaBg, color: ctaText }}>
            {ctaLabel}
          </LeadJump>
          {phone && (
            <a href={phone.tel} className="rounded-full border-2 border-white/40 px-6 py-3.5 text-center font-bold hover:bg-white/10">
              Call {phone.display}
            </a>
          )}
        </div>
      </div>
      {children && <div className="mx-auto max-w-6xl">{children}</div>}
    </section>
  );
}

/* ---------- sticky mobile bar ---------- */

/** Call / Get quote bar on phones. Hidden while the hero form (targetId) is on screen, so it never covers it. */
export function MobileLeadBar({ phone, ctaLabel, targetId = "lead", callBg, ctaBg, ctaText, surface = "bg-white/95 border-slate-200", emergency }: { phone: { display: string; tel: string }; ctaLabel: string; targetId?: string; callBg: string; ctaBg: string; ctaText: string; surface?: string; /** Optional third button, e.g. { label: "Emergency", tel, bg: "#dc2626" }. */ emergency?: { label: string; tel: string; bg: string } }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return setShow(true);
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 grid ${emergency ? "grid-cols-3" : "grid-cols-2"} gap-2 border-t p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 motion-reduce:transition-none sm:hidden ${surface} ${show ? "translate-y-0" : "translate-y-full"}`}
      aria-hidden={!show}
    >
      <a href={phone.tel} tabIndex={show ? 0 : -1} className="flex items-center justify-center rounded-full py-3 text-sm font-bold text-white" style={{ background: callBg }}>
        Call
      </a>
      {emergency && (
        <a href={emergency.tel} tabIndex={show ? 0 : -1} className="flex items-center justify-center rounded-full py-3 text-sm font-extrabold text-white" style={{ background: emergency.bg }}>
          {emergency.label}
        </a>
      )}
      <LeadJump targetId={targetId} tabIndex={show ? 0 : -1} className="flex items-center justify-center rounded-full py-3 text-sm font-extrabold" style={{ background: ctaBg, color: ctaText }}>
        {ctaLabel}
      </LeadJump>
    </div>
  );
}

/* ---------- exit intent ---------- */

/** Desktop only, once per session, and never after a lead was already submitted. */
export function ExitIntent({ slug, children, title = "Before you go, get a free quote", sub }: { slug: string; children: ReactNode; title?: string; sub?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const key = `ol-exit-${slug}`;
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
    } catch {}
    if (!desktop || seen) return;
    let armed = false;
    const arm = setTimeout(() => (armed = true), 3000);
    const disarm = () => (armed = false);
    const onOut = (e: MouseEvent) => {
      if (!armed || e.relatedTarget || e.clientY > 0) return;
      armed = false;
      try {
        sessionStorage.setItem(key, "1");
      } catch {}
      ref.current?.showModal();
    };
    document.addEventListener("mouseout", onOut);
    window.addEventListener(LEAD_EVENT, disarm);
    return () => {
      clearTimeout(arm);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener(LEAD_EVENT, disarm);
    };
  }, [key]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={`${slug}-exit-title`}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id={`${slug}-exit-title`} className="text-xl font-extrabold">
            {title}
          </h2>
          {sub && <p className="mt-1 text-sm text-slate-600">{sub}</p>}
        </div>
        <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="-mr-2 -mt-2 rounded-full px-2.5 py-1 text-2xl leading-none text-slate-400 hover:text-slate-700">
          ×
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </dialog>
  );
}
