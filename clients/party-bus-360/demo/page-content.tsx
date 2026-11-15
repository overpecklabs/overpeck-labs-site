"use client";

import { useState } from "react";
import { data } from "./data";

/* Party Bus 360 homepage mockup. Display-only: no form sends anything anywhere. */

const PHONE_DISPLAY = data.phone.display;
const TEL = data.phone.tel;
const SMS = data.sms;
const DEMO_MSG = "Demo only, this form isn't connected yet.";

const EVENTS = data.events;
const FAQS = data.faqs;

const SERVICE_ICONS = [
  "M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z",
  "M12 3v2M12 19v2M5 12H3M21 12h-2M7 7 5.5 5.5M18.5 18.5 17 17M7 17l-1.5 1.5M18.5 5.5 17 7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  "M4 7h16v12H4zM9 7V5h6v2M4 12h16",
  "M12 5v14M5 12h14",
];
const SERVICES = data.services.map((s, i) => ({ ...s, icon: SERVICE_ICONS[i % SERVICE_ICONS.length] }));

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <Icon className={className} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />;
}
function TextIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <Icon className={className} d="M4 5h16v11H8l-4 4z" />;
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7c3aed]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b1020] sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[17px] leading-relaxed text-slate-600">{sub}</p>}
    </div>
  );
}

function DemoNote({ show }: { show: boolean }) {
  return show ? (
    <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
      {DEMO_MSG}
    </p>
  ) : null;
}

/** Stylized party bus with a lit-up interior (pure SVG, no image download). */
function BusArt() {
  return (
    <svg viewBox="0 0 420 220" className="h-auto w-full drop-shadow-[0_30px_40px_rgba(124,58,237,0.35)]" role="img" aria-label="Illustration of a party bus">
      <defs>
        <linearGradient id="pb-body" x1="0" x2="1">
          <stop offset="0" stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="pb-glow" x1="0" x2="1">
          <stop offset="0" stopColor="#f472b6" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect x="20" y="40" width="370" height="130" rx="26" fill="url(#pb-body)" />
      <rect x="20" y="148" width="370" height="6" fill="url(#pb-glow)" opacity="0.9" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={48 + i * 62} y="64" width="50" height="48" rx="10" fill="url(#pb-glow)" opacity={0.55 + (i % 2) * 0.25} />
      ))}
      <path d="M362 64h16a12 12 0 0 1 12 12v36h-28z" fill="#a5b4fc" opacity="0.8" />
      <rect x="372" y="128" width="16" height="10" rx="3" fill="#fde68a" />
      <circle cx="100" cy="172" r="24" fill="#0b1020" />
      <circle cx="100" cy="172" r="10" fill="#94a3b8" />
      <circle cx="320" cy="172" r="24" fill="#0b1020" />
      <circle cx="320" cy="172" r="10" fill="#94a3b8" />
      <text x="48" y="137" fill="#e0e7ff" fontSize="15" fontWeight="800" letterSpacing="2" fontFamily="system-ui, sans-serif">
        PARTY BUS 360
      </text>
    </svg>
  );
}

function QuoteForm() {
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState<"quote" | "book">("quote");
  const field = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-[#0b1020] placeholder:text-slate-400 focus:border-[#7c3aed] focus:outline-none focus:ring-4 focus:ring-[#7c3aed]/15";
  const label = "block text-sm font-semibold text-slate-700";
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] sm:p-7">
      <div className="grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1 text-sm font-bold" role="tablist" aria-label="Quote or book">
        {(["quote", "book"] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={step === s}
            onClick={() => {
              setStep(s);
              setSent(false);
            }}
            className={`rounded-full px-3 py-2.5 transition ${step === s ? "bg-[#0b1020] text-white shadow" : "text-slate-600 hover:text-[#0b1020]"}`}
          >
            {s === "quote" ? "Instant quote" : "Book online"}
          </button>
        ))}
      </div>
      <form
        className="mt-5 grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div className="sm:col-span-2">
          <label htmlFor="pb-event" className={label}>
            What&apos;s the occasion?
          </label>
          <select id="pb-event" className={field} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {EVENTS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pb-date" className={label}>
            Date
          </label>
          <input id="pb-date" type="date" className={field} />
        </div>
        <div>
          <label htmlFor="pb-guests" className={label}>
            Number of guests
          </label>
          <input id="pb-guests" type="number" inputMode="numeric" min={1} className={field} placeholder="e.g. 20" />
        </div>
        <div>
          <label htmlFor="pb-pickup" className={label}>
            Pickup town
          </label>
          <input id="pb-pickup" className={field} placeholder="e.g. Hackensack" autoComplete="address-level2" />
        </div>
        <div>
          <label htmlFor="pb-hours" className={label}>
            Hours needed
          </label>
          <select id="pb-hours" className={field} defaultValue="">
            <option value="" disabled>
              Choose
            </option>
            {["3 hours", "4 hours", "5 hours", "6+ hours"].map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>
        {step === "book" && (
          <div className="sm:col-span-2">
            <label htmlFor="pb-vehicle" className={label}>
              Vehicle
            </label>
            <select id="pb-vehicle" className={field} defaultValue="">
              <option value="" disabled>
                Choose a vehicle
              </option>
              <option>[Placeholder: Party bus name]</option>
              <option>[Placeholder: Limo name]</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor="pb-name" className={label}>
            Your name
          </label>
          <input id="pb-name" className={field} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="pb-contact" className={label}>
            Phone or email
          </label>
          <input id="pb-contact" className={field} autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="w-full rounded-full bg-[#fbbf24] px-6 py-4 text-base font-extrabold text-[#0b1020] shadow-[0_10px_24px_-8px_rgba(251,191,36,0.8)] transition hover:bg-[#fcd34d] active:scale-[0.99]">
            {step === "quote" ? "See my instant quote" : "Request this booking"}
          </button>
          <p className="mt-2.5 text-center text-xs text-slate-500">
            {step === "quote" ? "Your quote appears instantly, then we email you the details." : "Pick your date and vehicle, and we'll confirm your booking."} No airport trips.
          </p>
        </div>
        <div className="sm:col-span-2">
          <DemoNote show={sent} />
        </div>
      </form>
    </div>
  );
}

/** Splits a quote total across the group: uses only numbers the visitor types in. */
function CostSplitter() {
  const [total, setTotal] = useState("");
  const [people, setPeople] = useState("");
  const t = Number(total.replace(/[$,]/g, ""));
  const p = Math.floor(Number(people));
  const each = t > 0 && p > 0 ? t / p : null;
  const field = "mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 text-base text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none focus:ring-4 focus:ring-[#fbbf24]/20";
  return (
    <div className="rounded-3xl bg-[#0b1020] p-6 text-white sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbbf24]">Splitting the ride?</p>
      <h3 className="mt-2 text-2xl font-extrabold">Per-person cost calculator</h3>
      <p className="mt-2 text-sm text-white/70">Enter your quote total and group size to see what everyone owes.</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="pb-total" className="block text-sm font-semibold text-white/85">
            Quote total ($)
          </label>
          <input id="pb-total" inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} className={field} placeholder="0" />
        </div>
        <div>
          <label htmlFor="pb-people" className="block text-sm font-semibold text-white/85">
            People
          </label>
          <input id="pb-people" inputMode="numeric" value={people} onChange={(e) => setPeople(e.target.value)} className={field} placeholder="0" />
        </div>
      </div>
      <p className="mt-5 rounded-2xl bg-white/[0.06] px-4 py-4 text-center" aria-live="polite">
        <span className="block text-sm text-white/70">Each person pays</span>
        <span className="mt-1 block text-3xl font-extrabold text-[#fbbf24]">{each ? `$${each.toFixed(2)}` : "—"}</span>
      </p>
    </div>
  );
}

const CHAT = [
  { from: "bot", text: "Hi! I'm the Party Bus 360 assistant. Planning a wedding, a night out or a corporate event?" },
  { from: "you", text: "A birthday night out for 18 people on a Saturday." },
  { from: "bot", text: "Fun! I can get you an instant quote. What town should we pick you up from, and for how many hours?" },
];

/** AI assistant preview. Scripted, display-only. */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6">
      {open && (
        <div id="pb-chat" role="dialog" aria-label="Party Bus 360 assistant (demo)" className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#0b1020] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">Party Bus 360 assistant</p>
              <p className="text-xs text-white/60">AI assistant preview (demo)</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full px-2 py-1 text-lg leading-none text-white/70 hover:text-white" aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="space-y-2.5 p-4">
            {CHAT.map((m, i) => (
              <p key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === "bot" ? "rounded-bl-md bg-slate-100 text-slate-800" : "ml-auto rounded-br-md bg-[#7c3aed] text-white"}`}>
                {m.text}
              </p>
            ))}
            <DemoNote show={sent} />
          </div>
          <form
            className="flex gap-2 border-t border-slate-100 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="pb-chat-input" className="sr-only">
              Message
            </label>
            <input id="pb-chat-input" className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm focus:border-[#7c3aed] focus:outline-none" placeholder="Ask about booking…" />
            <button type="submit" className="rounded-full bg-[#7c3aed] px-4 text-sm font-bold text-white hover:bg-[#6d28d9]">
              Send
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="pb-chat"
        className="flex items-center gap-2 rounded-full bg-[#7c3aed] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-8px_rgba(124,58,237,0.7)] hover:bg-[#6d28d9]"
      >
        <TextIcon className="h-5 w-5" />
        {open ? "Close" : "Ask us anything"}
      </button>
    </div>
  );
}

export default function PartyBus360() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <div className="bg-white font-sans text-[#0b1020] antialiased">
      {/* header */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <a href="#top" className="text-xl font-extrabold tracking-tight">
            Party Bus <span className="text-[#7c3aed]">360</span>
          </a>
          <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a href="#services" className="hover:text-[#0b1020]">
              Services
            </a>
            <a href="#gallery" className="hover:text-[#0b1020]">
              Gallery
            </a>
            <a href="#faq" className="hover:text-[#0b1020]">
              FAQ
            </a>
            <a href="#quote" className="hover:text-[#0b1020]">
              Quote & book
            </a>
          </nav>
          <a href={TEL} className="inline-flex items-center gap-2 rounded-full bg-[#0b1020] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1e1b4b]">
            <PhoneIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      <main id="top">
        {/* hero */}
        <section className="relative overflow-hidden bg-[#0b1020] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(124,58,237,0.45),transparent),radial-gradient(ellipse_50%_40%_at_10%_90%,rgba(56,189,248,0.25),transparent)]" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pb-24 md:pt-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#fbbf24]" aria-hidden />
                Based in Bergen County · Serving all of New Jersey
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Party buses &amp; limos for New Jersey&apos;s{" "}
                <span className="bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#38bdf8] bg-clip-text text-transparent">best nights out.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">Weddings, nightlife and corporate events. Get an instant quote online and book your ride in minutes.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={TEL} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fbbf24] px-7 py-4 text-base font-extrabold text-[#0b1020] shadow-[0_10px_30px_-8px_rgba(251,191,36,0.8)] transition hover:bg-[#fcd34d]">
                  <PhoneIcon />
                  Call {PHONE_DISPLAY}
                </a>
                <a href="#quote" className="inline-flex items-center justify-center rounded-full border-2 border-white/25 px-7 py-4 text-base font-bold text-white transition hover:border-white/60 hover:bg-white/5">
                  Get a free quote
                </a>
              </div>
              <a href={SMS} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white">
                <TextIcon className="h-4 w-4" />
                Prefer texting? Text us at {PHONE_DISPLAY}
              </a>
            </div>
            <div className="mx-auto w-full max-w-md md:max-w-none">
              <BusArt />
            </div>
          </div>
        </section>

        {/* quick facts strip (all true details) */}
        <section aria-label="Highlights" className="border-b border-slate-100 bg-slate-50">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-2 text-center text-sm font-semibold text-slate-700 sm:px-6 md:grid-cols-4">
            {["Instant online quotes", "Book online", "Text or call us", "All of New Jersey"].map((t) => (
              <li key={t} className="px-2 py-3">
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* services */}
        <section id="services" className="scroll-mt-16 px-4 py-16 sm:px-6 md:py-24">
          <SectionHead eyebrow="What we do" title="Rides for every celebration" sub="From the wedding party to the office party, we get your whole group there together." />
          <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <article key={s.title} className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.3)]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ede9fe] text-[#7c3aed]">
                  <Icon d={s.icon} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{s.body}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-6xl text-center text-sm text-slate-500">Please note: we don&apos;t offer {data.excludes}.</p>
        </section>

        {/* quote + booking */}
        <section id="quote" className="scroll-mt-16 bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <SectionHead eyebrow="Instant quote" title="Know your price in seconds" />
              <ol className="mx-auto mt-8 max-w-md space-y-5 lg:mx-0">
                {[
                  ["Tell us about your event", "Occasion, date, group size and pickup town."],
                  ["See your quote instantly", "Your price shows right away, and we email you the details."],
                  ["Book online", "Pick your vehicle and lock in your date, no phone tag needed."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0b1020] text-sm font-extrabold text-[#fbbf24]">{i + 1}</span>
                    <span>
                      <span className="block font-bold">{t}</span>
                      <span className="block text-[15px] text-slate-600">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 lg:mx-0">
                Questions before you book? Tap the chat button, call{" "}
                <a href={TEL} className="font-bold text-[#7c3aed] underline">
                  {PHONE_DISPLAY}
                </a>{" "}
                or{" "}
                <a href={SMS} className="font-bold text-[#7c3aed] underline">
                  send us a text
                </a>
                .
              </p>
            </div>
            <QuoteForm />
          </div>
        </section>

        {/* why us (placeholder) */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <SectionHead eyebrow="Why Party Bus 360" title="Why groups ride with us" sub="[Placeholder: replace these points with what really sets Party Bus 360 apart.]" />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {["[Placeholder: your fleet]", "[Placeholder: your drivers]", "[Placeholder: your service promise]"].map((t) => (
              <div key={t} className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                <h3 className="text-lg font-extrabold text-slate-700">{t}</h3>
                <p className="mt-2 text-[15px] text-slate-500">[Placeholder: one or two sentences backing this up.]</p>
              </div>
            ))}
          </div>
        </section>

        {/* gallery (placeholder tiles) */}
        <section id="gallery" className="scroll-mt-16 bg-[#0b1020] px-4 py-16 text-white sm:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbbf24]">Gallery</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Inside the ride</h2>
            <p className="mt-3 text-white/65">[Placeholder: add real photos of your buses, limos and events.]</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
            {["Interior lighting", "Wedding party", "Night out", "Corporate group", "Exterior", "Limo", "Bar area", "Sound system"].map((t, i) => (
              <div
                key={t}
                className={`grid place-items-center rounded-2xl border border-white/10 p-3 text-center text-sm font-semibold text-white/70 ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"}`}
                style={{ background: `linear-gradient(135deg, hsl(${260 + i * 14} 60% 22%), hsl(${290 + i * 10} 55% 14%))` }}
              >
                <span>
                  Photo placeholder
                  <span className="block text-xs font-normal text-white/45">{t}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* reviews (placeholder) */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <SectionHead eyebrow="Reviews" title="Sample reviews (placeholder)" sub="These are placeholders, not real reviews. Connect your Google reviews here." />
          <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <figure key={n} className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample review {n}</p>
                <blockquote className="mt-3 text-[15px] leading-relaxed text-slate-500">[Placeholder: a real customer review will appear here.]</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-slate-400">[Customer name], [event type]</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* cost splitter + service area */}
        <section className="bg-slate-50 px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2">
            <CostSplitter />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7c3aed]">Service area</p>
              <h3 className="mt-2 text-2xl font-extrabold">Bergen County based. All of New Jersey served.</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">Wherever your night starts in New Jersey, tell us your pickup town and we&apos;ll quote your ride instantly.</p>
              <div className="relative mt-6 grid aspect-[16/10] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#ede9fe] to-[#e0f2fe]">
                <svg viewBox="0 0 120 200" className="h-[85%] w-auto" aria-hidden>
                  <path
                    d="M62 6l22 10 6 18-4 14 12 10-2 16 10 14-4 22-12 20-6 22-16 22-14 20-10-8 4-18-10-14 6-16-10-12 4-18 10-10-4-14 8-16-2-20z"
                    fill="#c4b5fd"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="78" cy="34" r="6" fill="#fbbf24" stroke="#0b1020" strokeWidth="2" />
                </svg>
                <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow">● Bergen County</span>
                <span className="absolute bottom-3 left-3 rounded-full bg-[#0b1020] px-3 py-1 text-xs font-bold text-white">All of NJ</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ (booking questions) */}
        <section id="faq" className="scroll-mt-16 px-4 py-16 sm:px-6 md:py-24">
          <SectionHead eyebrow="Booking questions" title="Good to know" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`pb-faq-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-bold sm:px-6"
                    >
                      {f.q}
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-slate-300 text-lg leading-none transition ${open ? "rotate-45" : ""}`} aria-hidden>
                        +
                      </span>
                    </button>
                  </h3>
                  {open && (
                    <p id={`pb-faq-${i}`} className="px-5 pb-5 text-[15px] leading-relaxed text-slate-600 sm:px-6">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* closing CTA */}
        <section className="px-4 pb-16 sm:px-6 md:pb-24">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1e1b4b] via-[#4c1d95] to-[#0c4a6e] px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to roll?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/75">Get your instant quote now, or call or text us and we&apos;ll help plan your ride.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#quote" className="rounded-full bg-[#fbbf24] px-7 py-4 font-extrabold text-[#0b1020] hover:bg-[#fcd34d]">
                Get a free quote
              </a>
              <a href={TEL} className="rounded-full border-2 border-white/30 px-7 py-4 font-bold hover:bg-white/10">
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="bg-[#0b1020] px-4 pb-28 pt-12 text-white/70 sm:px-6 sm:pb-12">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xl font-extrabold text-white">
              Party Bus <span className="text-[#a78bfa]">360</span>
            </p>
            <p className="mt-2 text-sm">Party bus and limo service for weddings, nightlife and corporate events.</p>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Contact</p>
            <a href={TEL} className="mt-2 block hover:text-white">
              Call {PHONE_DISPLAY}
            </a>
            <a href={SMS} className="mt-1 block hover:text-white">
              Text {PHONE_DISPLAY}
            </a>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Service area</p>
            <p className="mt-2">Based in Bergen County, NJ</p>
            <p>Serving all of New Jersey</p>
            <p className="mt-2 text-white/45">[Placeholder: license / DOT number]</p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">© Party Bus 360. All rights reserved.</p>
      </footer>

      {/* sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 gap-2 border-t border-slate-200 bg-white/95 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <a href={TEL} className="flex items-center justify-center gap-1.5 rounded-full bg-[#0b1020] py-3 text-sm font-bold text-white">
          <PhoneIcon className="h-4 w-4" /> Call
        </a>
        <a href={SMS} className="flex items-center justify-center gap-1.5 rounded-full border-2 border-slate-200 py-3 text-sm font-bold">
          <TextIcon className="h-4 w-4" /> Text
        </a>
        <a href="#quote" className="flex items-center justify-center rounded-full bg-[#fbbf24] py-3 text-sm font-extrabold text-[#0b1020]">
          Quote
        </a>
      </div>

      <ChatWidget />
    </div>
  );
}
