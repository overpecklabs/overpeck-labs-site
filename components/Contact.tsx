"use client";

import { useEffect, useState } from "react";

const field =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-teal focus:outline-none";

export default function Contact() {
  const [interest, setInterest] = useState("Free website mockup");
  const [sentName, setSentName] = useState<string | null>(null);

  useEffect(() => {
    const on = (e: Event) => setInterest((e as CustomEvent<string>).detail);
    window.addEventListener("plan-select", on);
    return () => window.removeEventListener("plan-select", on);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // TODO: wire this up to Supabase (insert into a `leads` table via a server-side
    // function or RLS-protected insert) and send a notification email.
    console.log("[contact form]", data);
    setSentName(String(data.name || "there"));
    e.currentTarget.reset();
  };

  return (
    <section id="contact" className="relative bg-ink px-5 py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Contact</p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            Get your <span className="text-gradient">free website mockup.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70">Tell us about your business. We'll reply with next steps and a time to talk.</p>
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
          <label className="block text-sm">
            <span className="mb-1.5 block text-white/70">I'm interested in</span>
            <select name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className={field}>
              {["Free website mockup", "Starter Site", "Lead Engine", "AI Operator", "Not sure yet"].map((o) => (
                <option key={o} className="bg-ink">
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-white/70">Message</span>
            <textarea name="message" rows={4} className={field} placeholder="What kind of work do you do, and what would help most?" />
          </label>
          <button type="submit" className="btn-primary w-full">
            Send message
          </button>
          {sentName && (
            <p role="status" className="rounded-xl border border-teal/40 bg-teal/10 p-3 text-sm text-teal">
              Thanks, {sentName}. The form isn't connected to our inbox yet, so please also email{" "}
              <a className="underline" href="mailto:MarkQsAi@gmail.com">
                MarkQsAi@gmail.com
              </a>{" "}
              so we don't miss you.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
