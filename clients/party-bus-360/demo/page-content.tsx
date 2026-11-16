"use client";

import { useEffect, useState } from "react";
import { data } from "./data";
import { PreviewNote, RatingSummary, ReviewGrid, SampleMark, SampleTag, Stars, averageRating } from "@/components/demos/sample";
import { CtaBand, ExitIntent, LeadForm, LeadJump, MobileLeadBar, type LeadTheme } from "@/components/demos/lead";
import { CountUp, DemoImage, HeroImage, HeroIntro, HeroItem, MotionRoot, Parallax, Reveal, Stagger, StaggerItem, StickyHeader } from "@/components/demos/motion";

/* Party Bus 360 homepage mockup. Display-only: no form sends anything anywhere. */

const PHONE_DISPLAY = data.phone.display;
const TEL = data.phone.tel;
const SMS = data.sms;
const DEMO_MSG = "Demo only, this form isn't connected yet.";

const FAQS = data.faqs;

const SERVICE_ICONS = [
  "M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z",
  "M12 3v2M12 19v2M5 12H3M21 12h-2M7 7 5.5 5.5M18.5 18.5 17 17M7 17l-1.5 1.5M18.5 5.5 17 7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  "M4 7h16v12H4zM9 7V5h6v2M4 12h16",
  "M12 5v14M5 12h14",
];
const PH = data.photos;
const GLASS: LeadTheme = { tone: "dark", primary: "#7c3aed", accent: "#fbbf24", ctaBg: "#fbbf24", ctaText: "#0b1020" };
const LIGHT: LeadTheme = { tone: "light", primary: "#7c3aed", accent: "#fbbf24", ctaBg: "#7c3aed", ctaText: "#ffffff" };
const RATING = averageRating(data.reviews);
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

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7c3aed]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b1020] sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[17px] leading-relaxed text-slate-600">{sub}</p>}
    </Reveal>
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 500);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const [sent, setSent] = useState(false);
  return (
    <div className={`fixed bottom-24 right-4 z-40 flex-col items-end gap-3 sm:bottom-6 sm:flex ${scrolled || open ? "flex" : "hidden"}`}>
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
    <MotionRoot className="bg-white font-sans text-[#0b1020] antialiased">
      {/* header: sticky under the demo banner, shrinks on scroll */}
      <StickyHeader height={64} shrunk={56} barClassName="bg-white/90 border-b border-slate-100">
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
          <LeadJump className="hover:text-[#0b1020]">Free quote</LeadJump>
        </nav>
        <a href={TEL} className="demo-lift inline-flex items-center gap-2 rounded-full bg-[#0b1020] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1e1b4b]">
          <PhoneIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          <span className="sm:hidden">Call</span>
        </a>
      </StickyHeader>

      <main id="top">
        {/* hero: copy + call on the left, short lead form on the right (mobile: headline, form, call) */}
        <section className="relative overflow-hidden bg-[#0b1020] text-white">
          {PH.hero ? (
            <HeroImage>
              <DemoImage photo={PH.hero} priority sizes="100vw" className="absolute inset-0" />
            </HeroImage>
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(11,16,32,0.94)_0%,rgba(11,16,32,0.8)_50%,rgba(11,16,32,0.55)_100%)]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(124,58,237,0.35),transparent)]" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-10 pt-5 sm:px-6 md:grid-cols-[1fr_minmax(0,25rem)] md:items-center md:gap-x-12 md:gap-y-5 md:pb-20 md:pt-14">
            <HeroIntro className="md:col-start-1 md:row-start-1">
              <HeroItem>
                <p className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur md:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#fbbf24]" aria-hidden />
                  Based in Bergen County · Serving all of New Jersey
                </p>
                <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:mt-5 lg:text-6xl">
                  Party buses &amp; limos for New Jersey&apos;s{" "}
                  <span className="bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#38bdf8] bg-clip-text text-transparent">best nights out.</span>
                </h1>
              </HeroItem>
            </HeroIntro>

            <div className="md:col-start-2 md:row-span-3 md:row-start-1">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
                <LeadForm slug={data.slug} source="hero" anchorId="lead" businessName={data.businessName} title={data.lead.title} ask={data.lead.ask} cta={data.lead.cta} theme={GLASS} details={data.lead.details} />
              </div>
            </div>

            <div className="md:col-start-1 md:row-start-3">
              <a href={TEL} className="demo-lift flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-7 py-3.5 text-base font-bold text-white backdrop-blur hover:border-white/60 md:inline-flex md:w-auto">
                <PhoneIcon />
                Call {PHONE_DISPLAY}
              </a>
              <a href={SMS} className="mt-3 hidden items-center gap-2 text-sm font-semibold text-white/80 hover:text-white md:flex">
                <TextIcon className="h-4 w-4" />
                Prefer texting? Text us at {PHONE_DISPLAY}
              </a>
            </div>

            <div className="md:col-start-1 md:row-start-2">
              <p className="max-w-xl text-lg leading-relaxed text-white/80">{data.heroSub}</p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-white/85">
                <Stars rating={RATING} color="#fbbf24" />
                <span>
                  {RATING.toFixed(1)} rating from {data.reviews.length} reviews
                  <SampleMark className="text-white/70" />
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* quick facts strip (all true details) */}
        <section aria-label="Highlights" className="border-b border-slate-100 bg-slate-50">
          <Stagger as="ul" className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-3 text-center sm:px-6 md:grid-cols-4">
            {data.stats.map((st) => (
              <StaggerItem key={st.label} as="li" className="px-2 py-3">
                <span className="block text-2xl font-extrabold text-[#7c3aed]">
                  {"value" in st && st.value !== undefined ? <CountUp to={st.value} suffix={"suffix" in st ? st.suffix : ""} /> : st.text}
                  {"sample" in st && st.sample && <SampleMark className="text-slate-500" />}
                </span>
                <span className="text-sm font-semibold text-slate-600">{st.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* services */}
        <section id="services" className="scroll-mt-16 px-4 py-16 sm:px-6 md:py-24">
          <SectionHead eyebrow="What we do" title="Rides for every celebration" sub="From the wedding party to the office party, we get your whole group there together." />
          <Stagger className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <StaggerItem key={s.title} as="article" className="demo-lift overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <DemoImage photo={PH.services[i] ?? null} className="aspect-[4/3]" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                <div className="p-6">
                  <span className="-mt-12 relative z-10 grid h-12 w-12 place-items-center rounded-2xl bg-[#ede9fe] text-[#7c3aed] shadow-md ring-4 ring-white">
                    <Icon d={s.icon} />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mx-auto mt-6 max-w-6xl text-center text-sm text-slate-500">Please note: we don&apos;t offer {data.excludes}.</p>
        </section>

        {/* quote band (replaces the old long quote/booking form): the button goes to the hero form */}
        <CtaBand id="quote" title={data.lead.bandTitle} body={data.lead.bandBody} ctaLabel={data.lead.cta} phone={data.phone} bg="linear-gradient(120deg,#1e1b4b,#4c1d95 55%,#0c4a6e)" ctaBg="#fbbf24" ctaText="#0b1020">
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Tell us about your event", "Occasion, date, group size and pickup town."],
              ["Get your quote", "We send your price fast, with no phone tag."],
              ["Lock in your date", "Pick your vehicle and you're booked."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0b1020] text-sm font-extrabold text-[#fbbf24]">{i + 1}</span>
                <span>
                  <span className="block font-bold">{t}</span>
                  <span className="block text-sm text-slate-600">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </CtaBand>

        {/* why us + about */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <SectionHead eyebrow="Why Party Bus 360" title="Why groups ride with us" sub="Simple booking, one ride for everyone, and a night your group will be talking about for weeks." />
          <div className="mx-auto mt-10 grid max-w-6xl items-start gap-8 lg:grid-cols-[1fr_1.15fr]">
            <Reveal>
              <Parallax className="aspect-[4/3] rounded-3xl bg-slate-100">
                <DemoImage photo={PH.about} className="absolute inset-0" sizes="(min-width: 1024px) 40vw, 100vw" />
              </Parallax>
              <h3 className="mt-6 text-2xl font-extrabold">{data.about.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-slate-600">{data.about.body}</p>
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {data.whyUs.map((w) => (
                <StaggerItem key={w.title} className="demo-lift rounded-3xl border border-slate-200 bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ede9fe] text-[#7c3aed]" aria-hidden>
                    <Icon d="M5 12l5 5L20 7" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold">
                    {w.title}
                    {"sample" in w && w.sample && <SampleMark className="text-slate-500" />}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{w.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* gallery */}
        <section id="gallery" className="scroll-mt-16 bg-[#0b1020] px-4 py-16 text-white sm:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbbf24]">Gallery</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Inside the ride</h2>
            <p className="mt-3 text-white/65">{data.gallerySub}</p>
          </div>
          <Stagger className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
            {PH.gallery.slice(0, 5).map((ph, i) => (
              <StaggerItem key={i} className={i === 0 ? "col-span-2 row-span-2" : ""}>
                {i === 0 ? (
                  <Parallax className="demo-lift aspect-square rounded-2xl bg-white/5" amount={12}>
                    <DemoImage photo={ph} className="absolute inset-0" sizes="(min-width: 768px) 50vw, 100vw" />
                  </Parallax>
                ) : (
                  <DemoImage photo={ph} className="demo-lift aspect-[4/3] rounded-2xl" sizes="(min-width: 768px) 25vw, 50vw" />
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* reviews (sample) */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <SectionHead
            eyebrow="Reviews"
            title={
              <>
                Groups love the ride <SampleTag className="ml-1 text-slate-500" />
              </>
            }
          />
          <div className="mt-4 text-center text-[#0b1020]">
            <RatingSummary reviews={data.reviews} color="#fbbf24" />
          </div>
          <ReviewGrid reviews={data.reviews} color="#fbbf24" cardClassName="bg-white border-slate-200 text-slate-700" />
        </section>

        {/* cost splitter + service area */}
        <section className="bg-slate-50 px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2">
            <CostSplitter />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7c3aed]">Service area</p>
              <h3 className="mt-2 text-2xl font-extrabold">Bergen County based. All of New Jersey served.</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{data.areaBlurb}</p>
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
                      {f.sample && <SampleMark className="text-slate-500" />}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* final CTA: same short form */}
        <section className="px-4 pb-16 sm:px-6 md:pb-24">
          <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1e1b4b] via-[#4c1d95] to-[#0c4a6e] px-6 py-10 text-white sm:px-12 md:grid-cols-[1fr_minmax(0,24rem)]">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{data.lead.finalTitle}</h2>
              <p className="mt-3 max-w-xl text-white/80">{data.lead.finalBody}</p>
              <a href={TEL} className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 font-bold hover:bg-white/10">
                <PhoneIcon className="h-4 w-4" />
                Call {PHONE_DISPLAY}
              </a>
            </Reveal>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:p-6">
              <LeadForm slug={data.slug} source="final" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={GLASS} details={data.lead.details} />
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
            <p className="mt-2 text-sm">{data.footerBlurb}</p>
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
            <p className="mt-2">
              Fully licensed &amp; insured
              <SampleMark className="text-white/60" />
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40">
          <p>© Party Bus 360. All rights reserved.</p>
          <PreviewNote />
        </div>
      </footer>

      {/* sticky mobile bar: appears once the hero form is scrolled past */}
      <MobileLeadBar phone={data.phone} ctaLabel="Get quote" callBg="#0b1020" ctaBg="#fbbf24" ctaText="#0b1020" />

      <ChatWidget />

      <ExitIntent slug={data.slug} sub="Get your instant quote now. It takes 20 seconds.">
        <LeadForm slug={data.slug} source="exit" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={LIGHT} />
      </ExitIntent>
    </MotionRoot>
  );
}
