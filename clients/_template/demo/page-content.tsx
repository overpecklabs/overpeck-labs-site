"use client";

import { useState } from "react";
import { data } from "./data";

/*
 * TEMPLATE homepage. Copy this folder to clients/{slug}/ and make it this client's own:
 * restyle it, add sections, swap the placeholders. Forms stay display-only (no network calls).
 * The /demo route already adds the "Free homepage mockup" banner, noindex and the view tracker.
 */

const DEMO_MSG = "Demo only, this form isn't connected yet.";

export default function DemoHomepage() {
  const [sent, setSent] = useState(false);
  const c = data.colors;
  return (
    <div className="bg-white text-slate-900 antialiased">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {data.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logo} alt={data.businessName} className="h-9 w-auto" />
          ) : (
            <span className="text-xl font-extrabold">{data.businessName}</span>
          )}
          {data.phone && (
            <a href={data.phone.tel} className="rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: c.dark }}>
              Call {data.phone.display}
            </a>
          )}
        </div>
      </header>

      <section className="px-4 py-16 text-white sm:px-6 md:py-24" style={{ background: c.dark }}>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{data.headline}</h1>
          <p className="mt-4 text-lg text-white/75">{data.subhead}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {data.phone && (
              <a href={data.phone.tel} className="rounded-full px-7 py-4 font-extrabold text-slate-900" style={{ background: c.accent }}>
                Call {data.phone.display}
              </a>
            )}
            <a href="#quote" className="rounded-full border-2 border-white/30 px-7 py-4 font-bold">
              Get a free quote
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold">Services</h2>
        <div className="mx-auto mt-8 grid max-w-6xl gap-4 sm:grid-cols-3">
          {data.services.map((s) => (
            <article key={s.title} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold" style={{ color: c.primary }}>
                {s.title}
              </h3>
              <p className="mt-2 text-slate-600">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold">Sample reviews (placeholder)</h2>
        <p className="mt-2 text-center text-slate-500">[PLACEHOLDER] These are placeholders, not real reviews.</p>
      </section>

      <section id="quote" className="px-4 py-16 sm:px-6">
        <form
          className="mx-auto grid max-w-xl gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <h2 className="text-3xl font-extrabold">Get a free quote</h2>
          <label className="block text-sm font-semibold">
            Name
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" autoComplete="name" />
          </label>
          <label className="block text-sm font-semibold">
            Phone or email
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </label>
          <button type="submit" className="rounded-full px-6 py-4 font-bold text-white" style={{ background: c.primary }}>
            Request my quote
          </button>
          {sent && (
            <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
              {DEMO_MSG}
            </p>
          )}
        </form>
      </section>

      <footer className="px-4 py-10 text-sm text-white/70 sm:px-6" style={{ background: c.dark }}>
        <div className="mx-auto max-w-6xl">
          <p className="text-lg font-bold text-white">{data.businessName}</p>
          {data.phone && <p className="mt-1">{data.phone.display}</p>}
          <p className="mt-1">{data.serviceArea}</p>
        </div>
      </footer>
    </div>
  );
}
