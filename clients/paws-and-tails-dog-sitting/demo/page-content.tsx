"use client";

import { useState } from "react";
import { data } from "./data";
import { CountUp, DemoImage, HeroImage, HeroIntro, HeroItem, MotionRoot, Reveal, Stagger, StaggerItem, StickyHeader } from "@/components/demos/motion";

/* Paws and Tails (dog sitting) homepage mockup. Display-only: no form sends anything anywhere. */

const DEMO_MSG = "Demo only, this form isn't connected yet.";
const C = data.colors;
const PH = data.photos;

const SERVICE_ICONS = [
  "M5 20l2-6 4-2 2-5 3 1-1 4 3 3-2 5M9 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", // walking
  "M3 11l9-7 9 7v9H3zM10 20v-5h4v5", // home visit
  "M20 15A8 8 0 1 1 9 4a6 6 0 0 0 11 11z", // overnight (moon)
  "M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z", // care
];

function Paw({ className = "h-6 w-6", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill} aria-hidden>
      <ellipse cx="6" cy="9" rx="2.2" ry="2.8" />
      <ellipse cx="10" cy="5.5" rx="2.2" ry="2.8" />
      <ellipse cx="14.5" cy="5.5" rx="2.2" ry="2.8" />
      <ellipse cx="18.5" cy="9" rx="2.2" ry="2.8" />
      <path d="M12.2 11c-3 0-6 3.6-6 6.3 0 1.8 1.4 2.7 3 2.7 1.3 0 2-.6 3-.6s1.7.6 3 .6c1.6 0 3-.9 3-2.7 0-2.7-3-6.3-6-6.3z" />
    </svg>
  );
}

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
const PHONE_D = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z";
const TEXT_D = "M4 5h16v11H8l-4 4z";

function Head({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: C.primary }}>
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: C.dark }}>
        {title}
      </h2>
      {sub && <p className="mt-3 text-[17px] leading-relaxed text-stone-600">{sub}</p>}
    </Reveal>
  );
}

/** Friendly dog illustration for the hero (inline SVG, no image download). */
function DogArt() {
  return (
    <svg viewBox="0 0 320 280" className="h-auto w-full" role="img" aria-label="Illustration of a happy dog">
      <circle cx="160" cy="150" r="125" fill="#fde7cf" />
      <circle cx="160" cy="150" r="98" fill="#fbd3a8" opacity="0.6" />
      {/* ears */}
      <path d="M92 92c-28 6-40 52-26 78 10 18 30 6 34-14 4-22 8-52-8-64z" fill="#8a5a3b" />
      <path d="M228 92c28 6 40 52 26 78-10 18-30 6-34-14-4-22-8-52 8-64z" fill="#8a5a3b" />
      {/* head */}
      <ellipse cx="160" cy="140" rx="70" ry="66" fill="#c98b5e" />
      <ellipse cx="160" cy="172" rx="42" ry="32" fill="#f3dcc4" />
      {/* eyes */}
      <circle cx="135" cy="128" r="8" fill="#1f2a24" />
      <circle cx="185" cy="128" r="8" fill="#1f2a24" />
      <circle cx="137.5" cy="125.5" r="2.5" fill="#fff" />
      <circle cx="187.5" cy="125.5" r="2.5" fill="#fff" />
      {/* nose + mouth */}
      <ellipse cx="160" cy="158" rx="13" ry="9" fill="#1f2a24" />
      <path d="M160 167v8M148 178c6 6 18 6 24 0" stroke="#1f2a24" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M156 182c0 10 8 12 8 0z" fill="#e86a6a" />
      {/* collar + tag */}
      <path d="M112 196c30 16 66 16 96 0" stroke={C.primary} strokeWidth="11" fill="none" strokeLinecap="round" />
      <circle cx="160" cy="214" r="10" fill={C.accent} />
      {/* paws floating */}
      <g fill={C.primary} opacity="0.25">
        <ellipse cx="44" cy="70" rx="7" ry="9" />
        <ellipse cx="282" cy="236" rx="7" ry="9" />
      </g>
    </svg>
  );
}

function BookingForm() {
  const [sent, setSent] = useState(false);
  const field = "mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4";
  const label = "block text-sm font-semibold text-stone-700";
  return (
    <form
      className="grid gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(31,42,36,0.35)] sm:grid-cols-2 sm:p-7"
      style={{ ["--tw-ring-color" as string]: `${C.primary}33` }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="sm:col-span-2">
        <label htmlFor="pt-service" className={label}>
          What do you need?
        </label>
        <select id="pt-service" className={field} defaultValue="">
          <option value="" disabled>
            Choose a service
          </option>
          {data.services.map((s) => (
            <option key={s.title}>{s.title}</option>
          ))}
          <option>Not sure yet</option>
        </select>
      </div>
      <div>
        <label htmlFor="pt-start" className={label}>
          Start date
        </label>
        <input id="pt-start" type="date" className={field} />
      </div>
      <div>
        <label htmlFor="pt-end" className={label}>
          End date <span className="font-normal text-stone-500">(optional)</span>
        </label>
        <input id="pt-end" type="date" className={field} />
      </div>
      <div>
        <label htmlFor="pt-dog" className={label}>
          Dog&apos;s name
        </label>
        <input id="pt-dog" className={field} placeholder="e.g. Biscuit" />
      </div>
      <div>
        <label htmlFor="pt-size" className={label}>
          Size
        </label>
        <select id="pt-size" className={field} defaultValue="">
          <option value="" disabled>
            Choose
          </option>
          {["Small (under 25 lb)", "Medium (25–50 lb)", "Large (50+ lb)", "Puppy"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="pt-notes" className={label}>
          Anything we should know? <span className="font-normal text-stone-500">(optional)</span>
        </label>
        <textarea id="pt-notes" rows={3} className={field} placeholder="Feeding, medications, walking quirks, favorite toys…" />
      </div>
      <div>
        <label htmlFor="pt-name" className={label}>
          Your name
        </label>
        <input id="pt-name" className={field} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="pt-contact" className={label}>
          Phone or email
        </label>
        <input id="pt-contact" className={field} autoComplete="tel" />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="w-full rounded-full px-6 py-4 text-base font-extrabold text-white transition hover:brightness-110 active:scale-[0.99]" style={{ background: C.primary }}>
          Request a meet &amp; greet
        </button>
        {sent && (
          <p role="status" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            {DEMO_MSG}
          </p>
        )}
      </div>
    </form>
  );
}

const CHECKLIST = [
  "Spare key or door code",
  "Food, treats and feeding times",
  "Leash, harness and waste bags",
  "Any medications, with instructions",
  "Your vet's name and phone number",
  "An emergency contact",
];

function Checklist() {
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="rounded-3xl p-6 text-white sm:p-8" style={{ background: C.dark }}>
      <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: C.accent }}>
        Before your first booking
      </p>
      <h3 className="mt-2 text-2xl font-extrabold">Get-ready checklist</h3>
      <p className="mt-2 text-sm text-white/70">Tick things off as you go. Nothing is saved or sent.</p>
      <ul className="mt-5 space-y-2">
        {CHECKLIST.map((item) => {
          const on = done.includes(item);
          return (
            <li key={item}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white/[0.06] px-3.5 py-3 text-[15px] hover:bg-white/10">
                <input type="checkbox" checked={on} onChange={() => setDone((d) => (on ? d.filter((x) => x !== item) : [...d, item]))} className="h-5 w-5 shrink-0" style={{ accentColor: C.accent }} />
                <span className={on ? "text-white/50 line-through" : ""}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm font-semibold" style={{ color: C.accent }} aria-live="polite">
        {done.length === CHECKLIST.length ? "All set! Your pup is ready." : `${done.length} of ${CHECKLIST.length} ready`}
      </p>
    </div>
  );
}

export default function PawsAndTails() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const phone = data.phone;
  return (
    <MotionRoot className="bg-[#fffaf3] font-sans text-stone-900 antialiased">
      {/* header: sticky under the demo banner, shrinks on scroll */}
      <StickyHeader barClassName="bg-[#fffaf3]/90 border-b border-stone-200/70">
        <a href="#top" className="flex items-center gap-2.5" aria-label={data.businessName}>
          <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: C.primary }}>
            <Paw className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight" style={{ color: C.dark }}>
              {data.logoName}
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{data.logoTagline}</span>
          </span>
        </a>
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-semibold text-stone-600 md:flex">
          <a href="#services" className="hover:text-stone-900">
            Services
          </a>
          <a href="#gallery" className="hover:text-stone-900">
            Gallery
          </a>
          <a href="#book" className="hover:text-stone-900">
            Book
          </a>
          <a href="#faq" className="hover:text-stone-900">
            FAQ
          </a>
        </nav>
        <a href={phone.tel} className="demo-lift inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: C.dark }}>
          <Icon d={PHONE_D} className="h-4 w-4" />
          <span className="hidden sm:inline">{phone.display}</span>
          <span className="sm:hidden">Call</span>
        </a>
      </StickyHeader>

      <main id="top">
        {/* hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pb-20 md:pt-16">
            <HeroIntro>
              <HeroItem>
                <p className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                  <Paw className="h-3.5 w-3.5" fill={C.primary} />
                  {data.town}, NJ
                </p>
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl" style={{ color: C.dark }}>
                  Loving dog sitting in <span style={{ color: C.primary }}>Ridgefield Park</span>
                </h1>
              </HeroItem>
              <HeroItem>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">{data.subhead}</p>
              </HeroItem>
              <HeroItem>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={phone.tel} className="demo-lift inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-extrabold text-stone-900 shadow-[0_10px_28px_-10px_rgba(244,162,89,0.9)]" style={{ background: C.accent }}>
                    <Icon d={PHONE_D} className="h-5 w-5" />
                    Call {phone.display}
                  </a>
                  <a href="#book" className="demo-lift inline-flex items-center justify-center rounded-full border-2 bg-white/60 px-7 py-4 text-base font-bold" style={{ borderColor: C.dark, color: C.dark }}>
                    Request a meet &amp; greet
                  </a>
                </div>
                <a href={data.sms} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900">
                  <Icon d={TEXT_D} className="h-4 w-4" />
                  Prefer texting? Text {phone.display}
                </a>
              </HeroItem>
            </HeroIntro>
            {PH.hero ? (
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(31,42,36,0.55)] md:max-w-none">
                <HeroImage>
                  <DemoImage photo={PH.hero} priority sizes="(min-width: 768px) 45vw, 100vw" className="absolute inset-0" />
                </HeroImage>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-sm md:max-w-md">
                <DogArt />
              </div>
            )}
          </div>
        </section>

        {/* quick facts (true details only) */}
        <section aria-label="Highlights" className="border-y border-stone-200/70 bg-white">
          <Stagger as="ul" className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-3 text-center sm:px-6 md:grid-cols-4">
            <StaggerItem as="li" className="px-2 py-3">
              <span className="block text-2xl font-extrabold" style={{ color: C.primary }}>
                <CountUp to={data.services.length} />
              </span>
              <span className="text-sm font-semibold text-stone-600">ways we care for your dog</span>
            </StaggerItem>
            <StaggerItem as="li" className="px-2 py-3">
              <span className="block text-2xl font-extrabold" style={{ color: C.primary }}>
                Local
              </span>
              <span className="text-sm font-semibold text-stone-600">based in Ridgefield Park</span>
            </StaggerItem>
            <StaggerItem as="li" className="px-2 py-3">
              <span className="block text-2xl font-extrabold" style={{ color: C.primary }}>
                Text
              </span>
              <span className="text-sm font-semibold text-stone-600">or call to book</span>
            </StaggerItem>
            <StaggerItem as="li" className="px-2 py-3">
              <span className="block text-2xl font-extrabold" style={{ color: C.primary }}>
                At home
              </span>
              <span className="text-sm font-semibold text-stone-600">care in your own home</span>
            </StaggerItem>
          </Stagger>
        </section>

        {/* services */}
        <section id="services" className="scroll-mt-16 bg-white px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Services" title="Care that fits your dog's routine" sub="Suggested services: [Placeholder: confirm which of these Paws and Tails offers]" />
          <Stagger className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.services.map((s, i) => (
              <StaggerItem key={s.title} as="article" className="demo-lift overflow-hidden rounded-3xl border border-stone-200 bg-[#fffaf3]">
                <DemoImage photo={PH.services[i] ?? null} className="aspect-[4/3]" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                <div className="p-6">
                  <span className="relative z-10 -mt-12 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-md ring-4 ring-[#fffaf3]" style={{ background: C.primary }}>
                    <Icon d={SERVICE_ICONS[i % SERVICE_ICONS.length]} />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-stone-600">{s.body}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Suggested service</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* why us (placeholder) */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Why Paws and Tails" title="Why pet parents choose us" sub="[Placeholder: replace these points with what makes Paws and Tails special.]" />
          <div className="mx-auto mt-10 grid max-w-6xl items-center gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <DemoImage photo={PH.about} className="aspect-[4/3] rounded-3xl" sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
            <Stagger className="grid gap-4">
              {["[Placeholder: your experience with dogs]", "[Placeholder: how you keep owners updated]", "[Placeholder: safety / insurance details]"].map((t) => (
                <StaggerItem key={t} className="demo-lift rounded-3xl border-2 border-dashed border-stone-300 bg-white/60 p-6">
                  <Paw className="h-6 w-6" fill={C.accent} />
                  <h3 className="mt-3 text-lg font-extrabold text-stone-700">{t}</h3>
                  <p className="mt-2 text-[15px] text-stone-500">[Placeholder: one or two sentences backing this up.]</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* gallery */}
        <section id="gallery" className="px-4 pb-16 sm:px-6 md:pb-24">
          <Head eyebrow="Gallery" title="Happy dogs, happy owners" sub="Stock photos for the mockup. Your own photos of the dogs you care for go here." />
          <Stagger className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
            {PH.gallery.map((ph, i) => (
              <StaggerItem key={i}>
                <DemoImage photo={ph} className="demo-lift aspect-square rounded-2xl" sizes="(min-width: 768px) 25vw, 50vw" />
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* booking + checklist */}
        <section id="book" className="scroll-mt-16 bg-white px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Book" title="Request a meet & greet" sub="Tell us about your dog and the dates you need. We'll get back to you to set up a time to meet." />
          <div className="mx-auto mt-10 grid max-w-6xl items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
            <BookingForm />
            <Checklist />
          </div>
        </section>

        {/* reviews (placeholder) */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Reviews" title="Sample reviews (placeholder)" sub="These are placeholders, not real reviews. Real reviews from pet parents will go here." />
          <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <figure key={n} className="rounded-3xl border-2 border-dashed border-stone-300 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Sample review {n}</p>
                <blockquote className="mt-3 text-[15px] leading-relaxed text-stone-500">[Placeholder: a real customer review will appear here.]</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-stone-400">[Customer name] &amp; [dog&apos;s name]</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* service area */}
        <section className="px-4 pb-16 sm:px-6 md:pb-24">
          <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: C.primary }}>
                Service area
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight" style={{ color: C.dark }}>
                Based in Ridgefield Park
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-stone-600">We care for dogs in Ridgefield Park, NJ and nearby Bergen County towns. Not sure if you&apos;re in range? Call or text and we&apos;ll let you know.</p>
              <a href={data.sms} className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white" style={{ background: C.primary }}>
                <Icon d={TEXT_D} className="h-4 w-4" />
                Text to check your area
              </a>
            </div>
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl" style={{ background: `radial-gradient(circle at 50% 50%, ${C.accent}33, transparent 60%), #f6efe4` }}>
              {[0, 1, 2].map((r) => (
                <span key={r} className="absolute rounded-full border-2 border-dashed" style={{ width: `${40 + r * 22}%`, aspectRatio: "1", borderColor: `${C.primary}${["66", "44", "22"][r]}` }} aria-hidden />
              ))}
              <span className="relative flex flex-col items-center">
                <span className="grid h-14 w-14 place-items-center rounded-full text-white shadow-lg" style={{ background: C.primary }}>
                  <Paw className="h-7 w-7" />
                </span>
                <span className="mt-2 rounded-full bg-white px-3 py-1 text-sm font-bold shadow">Ridgefield Park</span>
                <span className="mt-1 text-xs font-semibold text-stone-500">+ nearby Bergen County towns</span>
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16 bg-white px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="FAQ" title="Questions pet parents ask" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-stone-200 rounded-3xl border border-stone-200 bg-[#fffaf3]">
            {data.faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <h3>
                    <button type="button" aria-expanded={open} aria-controls={`pt-faq-${i}`} onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-bold sm:px-6">
                      {f.q}
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-stone-300 text-lg leading-none transition ${open ? "rotate-45" : ""}`} aria-hidden>
                        +
                      </span>
                    </button>
                  </h3>
                  {open && (
                    <p id={`pt-faq-${i}`} className="px-5 pb-5 text-[15px] leading-relaxed text-stone-600 sm:px-6">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* closing CTA */}
        <section className="px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto max-w-4xl rounded-[2rem] px-6 py-12 text-center text-white sm:px-12" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
            <Paw className="mx-auto h-10 w-10" fill={C.accent} />
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Going away soon?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">Give us a call or send a text, and let&apos;s make sure your dog is in good hands.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={phone.tel} className="rounded-full px-7 py-4 font-extrabold text-stone-900" style={{ background: C.accent }}>
                Call {phone.display}
              </a>
              <a href={data.sms} className="rounded-full border-2 border-white/40 px-7 py-4 font-bold hover:bg-white/10">
                Send a text
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="px-4 pb-28 pt-12 text-white/70 sm:px-6 sm:pb-12" style={{ background: C.dark }}>
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-2 text-lg font-extrabold text-white">
              <Paw className="h-5 w-5" fill={C.accent} />
              {data.businessName}
            </p>
            <p className="mt-2 text-sm">Dog sitting in {data.town}, NJ.</p>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Contact</p>
            <a href={phone.tel} className="mt-2 block hover:text-white">
              Call {phone.display}
            </a>
            <a href={data.sms} className="mt-1 block hover:text-white">
              Text {phone.display}
            </a>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Service area</p>
            <p className="mt-2">{data.serviceArea}</p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">© {data.businessName}. All rights reserved.</p>
      </footer>

      {/* sticky mobile call/text bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-stone-200 bg-[#fffaf3]/95 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <a href={phone.tel} className="flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-bold text-white" style={{ background: C.dark }}>
          <Icon d={PHONE_D} className="h-4 w-4" /> Call
        </a>
        <a href={data.sms} className="flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-extrabold text-stone-900" style={{ background: C.accent }}>
          <Icon d={TEXT_D} className="h-4 w-4" /> Text
        </a>
      </div>
    </MotionRoot>
  );
}
