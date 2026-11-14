"use client";

import { useEffect, useState } from "react";
import { CONTACT_OPTIONS, EMAIL, PHONE_DISPLAY, PHONE_TEL, type ServiceKey } from "@/lib/services";

const field =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-teal focus:outline-none";

export default function Contact() {
  const [checked, setChecked] = useState<Set<ServiceKey>>(() => new Set(["mockup"]));
  const [sentName, setSentName] = useState<string | null>(null);

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name"),
      business: fd.get("business"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      message: fd.get("message"),
      interests: fd.getAll("interests"),
    };
    // TODO: wire this up to Supabase (insert into a `leads` table via a server-side
    // function or RLS-protected insert) and send a notification email.
    console.log("[contact form]", data);
    setSentName(String(data.name || "there"));
    e.currentTarget.reset();
    setChecked(new Set(["mockup"]));
  };

  return (
    <section id="contact" className="relative bg-ink px-5 py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Contact</p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            Get your <span className="text-gradient">free website mockup.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70">Tell us about your business. We&apos;ll reply with next steps and a time to talk. No obligation.</p>
          <div className="mt-8 space-y-3 text-white/80">
            <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-3 hover:text-teal">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5">☎</span>
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 hover:text-teal">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5">✉</span>
              {EMAIL}
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass space-y-4 rounded-3xl p-6 sm:p-8">
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
          <button type="submit" className="btn-primary w-full">
            Send message
          </button>
          {sentName && (
            <p role="status" className="rounded-xl border border-teal/40 bg-teal/10 p-3 text-sm text-teal">
              Thanks, {sentName}. The form isn&apos;t connected to our inbox yet, so please also email{" "}
              <a className="underline" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>{" "}
              or call {PHONE_DISPLAY} so we don&apos;t miss you.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
