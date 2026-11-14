"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";
import { INDUSTRY_SLUGS, SERVICE_SLUGS } from "@/lib/slugs";
import { TIMELINES } from "@/lib/submitMockupRequest";
import type { FormQuestion } from "@/lib/service-pages";
import HoneypotField from "./HoneypotField";

type Props = {
  /** route the form lives on, saved as source_page */
  source: string;
  /** fixed service for service pages; otherwise visitors pick one */
  service?: string;
  questions?: FormQuestion[];
  defaults?: { industry?: string; town?: string };
  title?: string;
  intro?: string;
};

const field = "w-full rounded-md border-2 border-ink/20 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/55 focus:border-teal-ink focus:outline-none";
const label = "mb-1.5 block text-sm font-medium text-ink/85";
const SERVICE_CHOICES = [...SERVICE_SLUGS.map((s) => s.name), "AI workflow", "Not sure yet"];

/**
 * Lead form used on service, industry and area pages.
 * Saves to Supabase `contact_messages` with a plain .insert() (anon is INSERT-only):
 * services = [service], source_page = route, timeline + extra answers in raw.
 */
export default function LeadForm({ source, service, questions = [], defaults = {}, title = "Tell us about your business", intro }: Props) {
  const uid = useId();
  const honeypot = useRef<HTMLInputElement>(null);
  const [timeline, setTimeline] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doneName, setDoneName] = useState("");
  const [svc, setSvc] = useState("");
  const [workflowNote, setWorkflowNote] = useState("");

  // "Get this workflow" buttons preselect a service (and remember which workflow).
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ service: string; note?: string }>).detail;
      setSvc(d.service);
      setWorkflowNote(d.note ?? "");
    };
    window.addEventListener("leadform-preselect", on);
    return () => window.removeEventListener("leadform-preselect", on);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const str = (k: string) => String(fd.get(k) ?? "").trim();
    const data = {
      name: str("name"),
      phone: str("phone"),
      email: str("email"),
      business: str("business"),
      town: str("town"),
      industry: str("industry"),
      service: service ?? str("service"),
      message: str("message"),
      consent: fd.get("consent") === "on",
    };
    const answers = Object.fromEntries(questions.map((q) => [q.key, str(q.key)]));

    const errs: Record<string, string> = {};
    if (!data.name) errs.name = "Please enter your name.";
    const digits = data.phone.replace(/\D/g, "");
    if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))) errs.phone = "Please enter a 10-digit phone number.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "That email doesn't look right. Fix it, or leave it blank.";
    if (!data.business) errs.business = "Please enter your business name.";
    if (!timeline) errs.timeline = "Please choose when you'd like to get started.";
    if (!data.consent) errs.consent = "Please check this so we can contact you.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    const finish = () => {
      setDoneName(data.name);
      setStatus("done");
    };
    // Honeypot filled: a bot. Skip the insert but look normal.
    if (honeypot.current?.value.trim()) return finish();

    setStatus("sending");
    try {
      const { error } = await getSupabase()
        .from("contact_messages")
        .insert({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          business_name: data.business,
          services: data.service ? [data.service] : [],
          message: data.message || null,
          source_page: source,
          raw: { ...data, timeline, answers, workflow: workflowNote || undefined, form: "lead_form", submitted_at: new Date().toISOString() },
        });
      if (error) throw error;
      finish();
    } catch (err) {
      console.error("[lead form] insert failed", err);
      setStatus("error");
    }
  };

  if (status === "done")
    return (
      <div id="lead-form" className="paper scroll-mt-28 rounded-md p-6 sm:p-8" role="status">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-note-green text-xl text-ink" aria-hidden>
          ✓
        </div>
        <h3 className="font-display mt-4 text-2xl font-bold text-ink">Thanks, {doneName}! We got your request.</h3>
        <p className="mt-2 text-ink/85">
          {timeline === "asap" ? "We'll prioritize it and reach out within 1 business day." : "We'll reach out soon to talk through next steps."} Questions in the meantime? Call{" "}
          <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-ink underline">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
        <Link href="/free-mockup" className="btn-primary mt-6">
          Want a free mockup too? →
        </Link>
      </div>
    );

  const id = (k: string) => `${uid}-${k}`;
  const err = (k: string) =>
    errors[k] ? (
      <p id={`${id(k)}-err`} className="mt-1 text-xs font-medium text-red-700" role="alert">
        {errors[k]}
      </p>
    ) : null;
  const inv = (k: string) => ({ "aria-invalid": errors[k] ? (true as const) : undefined, "aria-describedby": errors[k] ? `${id(k)}-err` : undefined });

  return (
    <form id="lead-form" onSubmit={onSubmit} noValidate className="paper relative scroll-mt-28 space-y-4 rounded-md p-6 sm:p-8">
      <HoneypotField ref={honeypot} />
      <div>
        <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
        {intro && <p className="mt-1 text-ink/80">{intro}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className={label}>
            Name
          </label>
          <input id={id("name")} name="name" autoComplete="name" className={field} {...inv("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={id("phone")} className={label}>
            Phone
          </label>
          <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(201) 555-0123" className={field} {...inv("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor={id("email")} className={label}>
            Email <span className="font-normal text-ink/70">(optional)</span>
          </label>
          <input id={id("email")} name="email" type="email" autoComplete="email" className={field} {...inv("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor={id("business")} className={label}>
            Business name
          </label>
          <input id={id("business")} name="business" autoComplete="organization" className={field} {...inv("business")} />
          {err("business")}
        </div>
        <div>
          <label htmlFor={id("town")} className={label}>
            Town <span className="font-normal text-ink/70">(optional)</span>
          </label>
          <input id={id("town")} name="town" defaultValue={defaults.town} placeholder="e.g. Hackensack" className={field} />
        </div>
        <div>
          <label htmlFor={id("industry")} className={label}>
            Industry <span className="font-normal text-ink/70">(optional)</span>
          </label>
          <select id={id("industry")} name="industry" defaultValue={defaults.industry ?? ""} className={field}>
            <option value="">Choose one…</option>
            {INDUSTRY_SLUGS.map((i) => (
              <option key={i.slug} value={i.name}>
                {i.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {!service && (
        <div>
          <label htmlFor={id("service")} className={label}>
            What are you interested in? <span className="font-normal text-ink/70">(optional)</span>
          </label>
          <select id={id("service")} name="service" className={field} value={svc} onChange={(e) => setSvc(e.target.value)}>
            <option value="">Choose one…</option>
            {SERVICE_CHOICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {svc === "AI workflow" && workflowNote && <p className="mt-1.5 text-sm text-teal-ink">Selected: {workflowNote}</p>}
        </div>
      )}

      <fieldset aria-describedby={errors.timeline ? `${id("timeline")}-err` : undefined}>
        <legend className={label}>How soon do you want to get started?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIMELINES.map((t, i) => {
            const on = timeline === t.value;
            return (
              <label
                key={t.value}
                className={`cursor-pointer rounded-md border-2 px-3 py-2.5 text-center text-sm font-semibold transition focus-within:ring-2 focus-within:ring-teal-ink/60 ${
                  on ? "border-teal-ink bg-note-teal text-ink" : "border-ink/15 bg-white text-ink/85 hover:border-ink/35"
                }`}
              >
                <input type="radio" name="timeline" value={t.value} checked={on} onChange={() => setTimeline(t.value)} aria-invalid={i === 0 && errors.timeline ? true : undefined} className="sr-only" />
                {t.label}
              </label>
            );
          })}
        </div>
        {err("timeline")}
      </fieldset>

      {questions.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {questions.map((q) => (
            <div key={q.key} className={q.type === "text" && questions.length % 2 === 1 ? "sm:col-span-2" : ""}>
              <label htmlFor={id(q.key)} className={label}>
                {q.label} <span className="font-normal text-ink/70">(optional)</span>
              </label>
              {q.type === "select" ? (
                <select id={id(q.key)} name={q.key} className={field} defaultValue="">
                  <option value="">Choose one…</option>
                  {q.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input id={id(q.key)} name={q.key} className={field} />
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <label htmlFor={id("message")} className={label}>
          Message <span className="font-normal text-ink/70">(optional)</span>
        </label>
        <textarea id={id("message")} name="message" rows={3} className={field} placeholder="Anything else we should know?" />
      </div>

      <div>
        <label className={`flex cursor-pointer items-start gap-3 rounded-md border-2 px-4 py-3 ${errors.consent ? "border-red-400" : "border-ink/15"} bg-white`}>
          <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 shrink-0 accent-[#0f766e]" {...inv("consent")} />
          <span className="text-sm text-ink/85">Yes, Overpeck Labs can contact me about my request by phone, text or email. No spam, no obligation.</span>
        </label>
        {err("consent")}
      </div>

      <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send my request"}
      </button>
      {status === "error" && (
        <p role="alert" className="rounded-md border border-red-400/60 bg-red-50 p-3 text-sm text-red-700">
          We couldn&apos;t send your request. Please call{" "}
          <a href={`tel:${PHONE_TEL}`} className="font-semibold underline">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
      )}
    </form>
  );
}
