"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONTACT_OPTIONS, PHONE_DISPLAY, PHONE_TEL, type ServiceKey } from "@/lib/services";
import { getSupabase } from "@/lib/supabase";
import HoneypotField from "./HoneypotField";

const field =
  "w-full rounded-md border-2 border-ink/20 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/55 focus:border-teal-ink focus:outline-none";

export default function Contact() {
  const [checked, setChecked] = useState<Set<ServiceKey>>(() => new Set());
  const [sentName, setSentName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const on = (e: Event) => setChecked(new Set((e as CustomEvent<ServiceKey[]>).detail));
    window.addEventListener("contact-prefill", on);
    return () => window.removeEventListener("contact-prefill", on);
  }, []);

  const toggle = (k: ServiceKey) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const str = (k: string) => String(fd.get(k) ?? "").trim();
    const data = {
      name: str("name"),
      business: str("business"),
      phone: str("phone"),
      email: str("email"),
      message: str("message"),
      interests: fd.getAll("interests").map(String),
    };
    const done = () => {
      setSentName(data.name || "there");
      setStatus("idle");
      form.reset();
      setChecked(new Set());
    };

    // Honeypot filled: a bot. Skip the insert but look normal.
    if (honeypot.current?.value.trim()) return done();
    if (!data.name || !(data.phone || data.email)) return setStatus("error");

    setStatus("sending");
    setSentName(null);
    try {
      // Anon is INSERT-only: plain .insert(), no .select(); id/created_at are set by the database.
      const { error } = await getSupabase()
        .from("contact_messages")
        .insert({
          name: data.name,
          phone: data.phone || null,
          email: data.email || null,
          business_name: data.business || null,
          services: data.interests,
          message: data.message || null,
          source_page: window.location.pathname + window.location.hash,
          raw: { ...data, submitted_at: new Date().toISOString() },
        });
      if (error) throw error;
      done();
    } catch (err) {
      console.error("[contact form] insert failed", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="board-bg relative overflow-hidden px-5 py-24">
      {/* Bright accent section #3: a marker-blue band behind the copy, with an arrow to the form */}
      <div className="absolute inset-x-0 top-16 bottom-16 -skew-y-2 bg-mk-blue shadow-[0_14px_40px_rgba(31,111,235,0.25)] lg:inset-y-24" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="relative py-10 text-white lg:py-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/90">Contact</p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">Let&apos;s talk.</h2>
          <p className="mt-4 max-w-md text-white/95">Questions, or ready to grow? Send a quick message and we&apos;ll reply with next steps. No obligation.</p>
          <Link href="/free-mockup" className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-4 py-2.5 text-sm font-bold text-ink hover:bg-note-yellow">
            Want a free mockup? Take the 3-minute questionnaire →
          </Link>
          <div className="mt-6">
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-3 font-semibold text-white hover:underline">
              <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                </svg>
              </span>
              {PHONE_DISPLAY}
            </a>
          </div>
          {/* hand-drawn arrow pointing at the form */}
          <svg className="pointer-events-none absolute -right-6 top-1/2 hidden h-28 w-40 lg:block" viewBox="0 0 160 110" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 86 C40 96 92 92 128 48 M112 50 L130 46 L128 66" />
          </svg>
          <span className="font-marker pointer-events-none absolute -right-2 top-[calc(50%+56px)] hidden rotate-[-4deg] text-lg text-white lg:block" aria-hidden>
            takes a minute
          </span>
        </div>

        <form onSubmit={onSubmit} className="paper tilt-r relative space-y-4 rounded-md p-6 sm:p-8">
          <span className="tape" />
          <HoneypotField ref={honeypot} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink/80">Name</span>
              <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink/80">Business</span>
              <input name="business" required autoComplete="organization" className={field} placeholder="Business name" />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink/80">Phone</span>
              <input name="phone" type="tel" required autoComplete="tel" className={field} placeholder="(201) 555-0123" />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink/80">Email</span>
              <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
            </label>
          </div>

          <fieldset className="text-sm">
            <legend className="mb-2 text-ink/80">I&apos;m interested in</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {CONTACT_OPTIONS.map((o) => (
                <label
                  key={o.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                    checked.has(o.key) ? "border-teal/60 bg-teal/10" : "border-ink/15 bg-white hover:border-ink/30"
                  } ${o.key === "mockup" ? "sm:col-span-2" : ""}`}
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={o.label}
                    checked={checked.has(o.key)}
                    onChange={() => toggle(o.key)}
                    className="h-4 w-4 shrink-0 accent-[#0f766e]"
                  />
                  <span className={o.key === "mockup" ? "font-semibold text-teal-ink" : ""}>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm">
            <span className="mb-1.5 block text-ink/80">Message</span>
            <textarea name="message" rows={4} className={field} placeholder="What kind of work do you do, and what would help most?" />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          {sentName && (
            <p role="status" className="rounded-xl border border-teal/40 bg-teal/10 p-3 text-sm text-teal-ink">
              Thanks, {sentName}! Your message was sent. We&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="rounded-xl border border-red-400/50 bg-red-400/10 p-3 text-sm text-red-700">
              We couldn&apos;t send your message. Please call{" "}
              <a className="underline" href={`tel:${PHONE_TEL}`}>
                {PHONE_DISPLAY}
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
