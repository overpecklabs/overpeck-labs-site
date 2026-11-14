"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONTACT_OPTIONS, PHONE_DISPLAY, PHONE_TEL, type ServiceKey } from "@/lib/services";
import { getSupabase } from "@/lib/supabase";
import HoneypotField from "./HoneypotField";

const field =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-teal focus:outline-none";

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
    <section id="contact" className="relative bg-ink px-5 py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Contact</p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            Let&apos;s <span className="text-gradient">talk.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70">Questions, or ready to grow? Send a quick message and we&apos;ll reply with next steps. No obligation.</p>
          <Link href="/free-mockup" className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-teal/40 bg-teal/10 px-4 py-3 text-sm font-semibold text-teal hover:bg-teal/20">
            Want a free mockup? Take the 3-minute questionnaire →
          </Link>
          <div className="mt-8 space-y-3 text-white/80">
            <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-3 hover:text-teal">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5">☎</span>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass relative space-y-4 rounded-3xl p-6 sm:p-8">
          <HoneypotField ref={honeypot} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-white/70">Name</span>
              <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-white/70">Business</span>
              <input name="business" required autoComplete="organization" className={field} placeholder="Business name" />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-white/70">Phone</span>
              <input name="phone" type="tel" required autoComplete="tel" className={field} placeholder="(201) 555-0123" />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-white/70">Email</span>
              <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
            </label>
          </div>

          <fieldset className="text-sm">
            <legend className="mb-2 text-white/70">I&apos;m interested in</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {CONTACT_OPTIONS.map((o) => (
                <label
                  key={o.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                    checked.has(o.key) ? "border-teal/60 bg-teal/10" : "border-white/15 bg-black/30 hover:border-white/30"
                  } ${o.key === "mockup" ? "sm:col-span-2" : ""}`}
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={o.label}
                    checked={checked.has(o.key)}
                    onChange={() => toggle(o.key)}
                    className="h-4 w-4 shrink-0 accent-[#19f0d2]"
                  />
                  <span className={o.key === "mockup" ? "font-semibold text-teal" : ""}>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm">
            <span className="mb-1.5 block text-white/70">Message</span>
            <textarea name="message" rows={4} className={field} placeholder="What kind of work do you do, and what would help most?" />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          {sentName && (
            <p role="status" className="rounded-xl border border-teal/40 bg-teal/10 p-3 text-sm text-teal">
              Thanks, {sentName}! Your message was sent. We&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="rounded-xl border border-red-400/50 bg-red-400/10 p-3 text-sm text-red-200">
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
