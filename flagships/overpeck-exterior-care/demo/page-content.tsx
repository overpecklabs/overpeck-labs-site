"use client";

import { useState } from "react";
import { preload } from "react-dom";
import "./exterior.css";
import { data } from "./data";
import BeforeAfter from "./BeforeAfter";
import ChatAssistant, { OPEN_CHAT } from "./ChatAssistant";
import DetailsWizard from "./DetailsWizard";
import WindowWipe from "./WindowWipe";
import { RECEPTIONIST_PHONE } from "../phone";
import { PreviewNote, RatingSummary, ReviewGrid, SampleMark, SampleTag, Stars, averageRating } from "@/components/demos/sample";
import { CtaBand, ExitIntent, LeadForm, LeadJump, MobileLeadBar, type LeadBasics, type LeadTheme } from "@/components/demos/lead";
import { CountUp, DemoImage, HeroImage, HeroIntro, HeroItem, MotionRoot, Parallax, StickyHeader } from "@/components/demos/motion";
import { AppearObserver, Reveal, Stagger, StaggerItem } from "./Appear";

/*
 * Overpeck Exterior Care: Overpeck Labs' second flagship (a fictional brand). Single lead flow: the hero form is
 * the only form; every other CTA jumps to it (<LeadJump>) or opens its "Add details" steps. Display-only.
 */

const C = data.colors;
const PH = data.photos;
const PHONE = data.phone;
const INK = C.dark;
const RATING = averageRating(data.reviews);
const CTA_BG = `linear-gradient(90deg, ${C.accent}, #5eead4)`;
/** Responsive hero (images are unoptimized site-wide, so phones get the 828px file instead of the 1600px one). */
const HERO_SRCSET = "/demos/overpeck-exterior-care/hero-828.webp 828w, /demos/overpeck-exterior-care/hero-1200.webp 1200w, /demos/overpeck-exterior-care/hero.webp 1600w";

const GLASS: LeadTheme = { tone: "dark", primary: C.primary, accent: C.accent, ctaBg: CTA_BG, ctaText: INK };
const renderDetails = (basics: LeadBasics) => <DetailsWizard basics={basics} accent={C.accent} />;

const ICONS: Record<string, string> = {
  windows: "M4 4h16v16H4zM12 4v16M4 12h16",
  power: "M3 16h6l3-3h4M16 13l5-2M16 13l5 1M16 13l5 4M5 16v4M3 20h6",
  softwash: "M3 11l9-7 9 7v9H3zM9 20v-5h6v5",
  deck: "M3 14h18M3 18h18M5 10h14M7 6h10",
  gutters: "M3 7h18v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM18 13v8",
  commercial: "M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6M8 11h2M14 11h2",
};
const PHONE_D = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z";
const CHECK_D = "M5 12l5 5L20 7";
const DROP_D = "M12 2.5s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 9.5 12 2.5 12 2.5z";
const SPARKLE_D = "M12 3l1.8 4.9L19 9.7l-4.6 2.6L13 18l-1-5-5-1.8 5-1.8zM5 3v4M3 5h4M19 15v4M17 17h4";

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/** Droplet bullet icon. */
function Drop({ className = "h-4 w-4", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={light ? "oe-drop-l" : "oe-drop"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light ? "#a7f3d0" : "#38bdf8"} />
          <stop offset="1" stopColor={light ? "#34d399" : "#0e7490"} />
        </linearGradient>
      </defs>
      <path d={DROP_D} fill={`url(#${light ? "oe-drop-l" : "oe-drop"})`} />
      <path d="M9.2 13.2a3 3 0 0 0 2 2.6" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Wave-shaped section divider (fixed height, so no layout shift). `fill` is the color of the section it leads into. */
function Wave({ fill, flip = false, className = "" }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <div className={`pointer-events-none relative h-10 w-full overflow-hidden sm:h-14 ${className}`} aria-hidden>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${flip ? "rotate-180" : ""}`}>
        <path d="M0 48c120-22 240-30 360-14s240 40 360 30 240-46 360-50 240 26 360 30v36H0z" fill={fill} opacity=".55" />
        <path d="M0 58c160-20 300-12 440 6s280 18 420-4 300-26 580 4v16H0z" fill={fill} />
      </svg>
    </div>
  );
}

/** A quick "rinse" wipe across a card the first time it scrolls into view (CSS, see exterior.css). */
function Rinse() {
  return <span aria-hidden className="oe-rinse pointer-events-none absolute inset-0 z-10" />;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={data.businessName}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#0e7490] to-[#34d399] text-white shadow-[0_6px_18px_-6px_rgba(14,116,144,0.7)]">
        <Icon d={SPARKLE_D} className="h-5 w-5" />
      </span>
      <span className={`text-[17px] font-extrabold leading-tight tracking-tight ${light ? "text-white" : "text-[#06232a]"}`}>
        Overpeck <span className={light ? "text-[#6ee7b7]" : "text-[#0e7490]"}>Exterior Care</span>
      </span>
    </a>
  );
}

function Head({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0e7490]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#06232a] sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[17px] leading-relaxed text-slate-600">{sub}</p>}
      {children}
    </Reveal>
  );
}

/** Frosted light card. */
/* no backdrop-blur below the fold: on this light, near-flat background it adds little and costs a lot to paint on phones */
const glass = "rounded-3xl border border-white/90 bg-white/75 shadow-[0_20px_50px_-30px_rgba(6,35,42,0.35)]";

export default function OverpeckExteriorCare() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // high-priority preload of the right-sized hero image (emitted into <head> during SSR)
  preload("/demos/overpeck-exterior-care/hero-828.webp", { as: "image", imageSrcSet: HERO_SRCSET, imageSizes: "100vw", fetchPriority: "high" });
  return (
    <MotionRoot className="relative bg-[#eef6f7] font-sans text-slate-800 antialiased">
      {/* soft background washes (static, no animation cost) */}
      <div className="pointer-events-none absolute inset-x-0 top-[700px] -z-0 h-[1400px] bg-[radial-gradient(40rem_30rem_at_10%_20%,rgba(56,189,248,0.18),transparent),radial-gradient(36rem_28rem_at_90%_60%,rgba(52,211,153,0.16),transparent)]" aria-hidden />

      <StickyHeader height={60} shrunk={52} barClassName="bg-white/70 border-b border-white/80">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          <a href="#services" className="hover:text-[#06232a]">
            Services
          </a>
          <a href="#results" className="hover:text-[#06232a]">
            Before &amp; after
          </a>
          <a href="#packages" className="hover:text-[#06232a]">
            Packages
          </a>
          <a href="#reviews" className="hover:text-[#06232a]">
            Reviews
          </a>
          <a href="#faq" className="hover:text-[#06232a]">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LeadJump className="hidden rounded-full border border-slate-300 bg-white/60 px-4 py-2 text-sm font-bold text-[#06232a] hover:bg-white md:inline-flex">Free quote</LeadJump>
          <a href={PHONE.tel} className="demo-lift inline-flex items-center gap-2 rounded-full bg-[#06232a] px-4 py-2 text-sm font-extrabold text-white">
            <Icon d={PHONE_D} className="h-4 w-4" />
            <span className="hidden sm:inline">{PHONE.display}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </StickyHeader>

      <main id="top" className="relative">
        {/* hero: copy + call left, glass form right (phones: headline, form, call) */}
        <section className="relative overflow-hidden">
          {PH.hero && (
            <HeroImage>
              {/* eslint-disable-next-line @next/next/no-img-element -- responsive srcset; next/image is unoptimized here */}
              <img src="/demos/overpeck-exterior-care/hero-1200.webp" srcSet={HERO_SRCSET} sizes="100vw" alt={PH.hero.alt} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[60%_center]" />
            </HeroImage>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[#06232a]/75 md:bg-transparent md:bg-[linear-gradient(90deg,rgba(6,35,42,0.94)_0%,rgba(6,35,42,0.82)_42%,rgba(6,35,42,0.35)_78%,rgba(6,35,42,0.2)_100%)]" aria-hidden />
          <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#34d399]/20 blur-3xl" aria-hidden />
          <Wave fill="#eef6f7" className="!absolute inset-x-0 bottom-0 z-[1]" />

          <div className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-10 pt-5 sm:px-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-center md:gap-x-12 md:gap-y-5 md:pb-24 md:pt-16">
            <HeroIntro className="md:col-start-1 md:row-start-1">
              <HeroItem>
                <p className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur md:inline-flex">
                  <Icon d={SPARKLE_D} className="h-3.5 w-3.5 text-[#6ee7b7]" />
                  Windows · Power washing · Soft washing
                </p>
                <h1 className="text-[30px] font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl md:mt-5 lg:text-6xl">
                  Make your home <span className="bg-gradient-to-r from-[#6ee7b7] to-[#7dd3fc] bg-clip-text text-transparent">look new again.</span>
                </h1>
              </HeroItem>
            </HeroIntro>

            <div className="md:col-start-2 md:row-span-3 md:row-start-1">
              <div className="rounded-3xl border border-white/20 bg-[#06232a]/55 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-6">
                <div className="mb-4 hidden items-center justify-between md:flex">
                  <p className="text-lg font-extrabold text-white">{data.lead.title}</p>
                  <span className="rounded-full bg-emerald-400/25 px-2.5 py-1 text-[11px] font-bold text-emerald-100">No obligation</span>
                </div>
                <LeadForm slug={data.slug} source="hero" anchorId="lead" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={GLASS} renderDetails={renderDetails} phonePlaceholder="Mobile number" />
              </div>
            </div>

            <div className="md:col-start-1 md:row-start-3">
              <a href={PHONE.tel} className="demo-lift flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-white/40 bg-white/10 px-7 py-3.5 text-base font-extrabold text-white backdrop-blur md:inline-flex md:w-auto md:py-4 md:text-lg">
                <Icon d={PHONE_D} className="h-5 w-5" />
                Call {PHONE.display}
              </a>
              {RECEPTIONIST_PHONE && <p className="mt-2 text-center text-xs font-semibold text-white/75 md:text-left">Call our AI receptionist, it&apos;s live 24/7 (demo line).</p>}
            </div>

            <div className="md:col-start-1 md:row-start-2">
              <p className="max-w-xl text-lg leading-relaxed text-white/85">{data.subhead}</p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-white/90">
                <Stars rating={RATING} color="#fbbf24" />
                <span>
                  {RATING.toFixed(1)} rating from {data.reviews.length} reviews
                  <SampleMark className="text-white/60" />
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* signature: scroll-scrubbed window cleaning */}
        <WindowWipe view={PH.windowView} cta={data.lead.cta} />

        {/* stats (all true for this page; numbers count up) */}
        <section aria-label="Highlights" className="relative px-4 sm:px-6">
          <Stagger className={`mx-auto grid max-w-6xl grid-cols-2 divide-slate-200/70 md:grid-cols-4 md:divide-x ${glass}`}>
            {data.stats.map((s) => (
              <StaggerItem key={s.label} className="px-4 py-5 text-center">
                <p className="text-2xl font-extrabold text-[#06232a] sm:text-3xl">{"value" in s ? <CountUp to={s.value} /> : s.text}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* services */}
        <Wave fill="#f8fcfc" className="mt-10" />
        <section id="services" className="oe-shimmer relative scroll-mt-24 bg-[#f8fcfc] px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="What we clean" title="Every surface, cleaned the right way" sub="The right method for each surface: gentle where it matters, powerful where it counts." />
          <Stagger className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.map((s) => (
              <StaggerItem key={s.key} className={`demo-lift relative overflow-hidden ${glass}`}>
                <Rinse />
                <DemoImage photo={PH.services[s.key] ?? null} className="aspect-[16/10]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#0e7490]/15 to-[#34d399]/25 text-[#0e7490]">
                      <Icon d={ICONS[s.key]} className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-extrabold text-[#06232a]">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{s.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.points.map((p) => (
                      <li key={p} className="inline-flex items-center gap-1 rounded-full bg-[#0e7490]/8 py-1 pl-1.5 pr-2.5 text-xs font-semibold text-[#0e5566] ring-1 ring-[#0e7490]/15">
                        <Drop className="h-3.5 w-3.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <Wave fill="#f8fcfc" flip />

        <CtaBand title={data.lead.bandTitle} body={data.lead.bandBody} ctaLabel={data.lead.cta} phone={PHONE} bg="linear-gradient(120deg, #06232a, #0e7490 60%, #0f766e)" ctaBg={C.accent} ctaText={INK} />

        {/* before / after */}
        <section id="results" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Before & after" title="See the difference" sub="Drag the handle to compare. Sample photos for this preview." />
          <Reveal className="mt-8">
            <BeforeAfter pairs={PH.beforeAfter} accent={C.accent} />
          </Reveal>
        </section>

        {/* why soft wash (image-only parallax on the photo) */}
        <section id="soft-wash" className="px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <Parallax className="aspect-[4/3] rounded-3xl border border-white shadow-[0_30px_60px_-30px_rgba(6,35,42,0.55)]" amount={10}>
                <DemoImage photo={PH.services.softwash} className="absolute inset-0" sizes="(min-width: 1024px) 50vw, 100vw" />
              </Parallax>
            </Reveal>
            <div>
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0e7490]">Gentle on your home</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#06232a] sm:text-4xl">{data.softWash.title}</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-slate-600">{data.softWash.body}</p>
              </Reveal>
              <Stagger className="mt-6 grid gap-3 sm:grid-cols-2">
                {data.softWash.compare.map((c, i) => (
                  <StaggerItem key={c.title} className={`p-5 ${i === 1 ? "rounded-3xl border border-[#34d399]/50 bg-gradient-to-br from-[#ecfdf5] to-white shadow-[0_20px_50px_-30px_rgba(6,35,42,0.35)]" : glass}`}>
                    <p className="font-extrabold text-[#06232a]">{c.title}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.tone}</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {c.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <Drop className={`mt-0.5 h-4 w-4 shrink-0 ${i === 1 ? "" : "opacity-50 grayscale"}`} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal className="mt-4 flex gap-3 rounded-2xl bg-[#06232a] p-4 text-sm text-white/90">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#34d399]/25 text-[#6ee7b7]" aria-hidden>
                  <Icon d="M12 22c4-3 7-7 7-11a7 7 0 0 0-14 0c0 4 3 8 7 11zM12 22V11" className="h-3.5 w-3.5" />
                </span>
                {data.softWash.plants}
              </Reveal>
            </div>
          </div>
        </section>

        {/* how it works */}
        <section id="how" className="px-4 py-16 sm:px-6 md:py-20">
          <Head eyebrow="How it works" title="Three easy steps" />
          <Stagger as="ol" className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {data.process.map((st, i) => (
              <StaggerItem key={st.title} as="li" className={`demo-lift p-6 ${glass}`}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#0e7490] to-[#34d399] text-sm font-extrabold text-white">{i + 1}</span>
                <p className="mt-4 text-lg font-extrabold text-[#06232a]">{st.title}</p>
                <p className="mt-1.5 text-[15px] text-slate-600">{st.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-8 text-center">
            <LeadJump className="demo-lift inline-flex rounded-full px-7 py-3.5 font-extrabold text-[#06232a] shadow-[0_14px_30px_-12px_rgba(52,211,153,0.9)]" style={{ background: CTA_BG }}>
              {data.lead.cta}
            </LeadJump>
          </div>
        </section>

        {/* seasonal packages */}
        <section id="packages" className="oe-shimmer scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Seasonal packages" title="Seasonal bundles" sub="Popular combinations for each season. Every quote is free and tailored to your home." />
          <Stagger className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
            {data.packages.map((p) => (
              <StaggerItem
                key={p.name}
                className={`demo-lift relative flex flex-col p-6 ${"featured" in p && p.featured ? "rounded-3xl bg-[#06232a] text-white shadow-[0_30px_60px_-25px_rgba(6,35,42,0.7)]" : glass}`}
              >
                {"featured" in p && p.featured && <span className="absolute -top-3 left-6 rounded-full bg-[#34d399] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#06232a]">Most popular</span>}
                <h3 className={`text-xl font-extrabold ${"featured" in p && p.featured ? "text-white" : "text-[#06232a]"}`}>{p.name}</h3>
                <p className={`mt-1 text-sm ${"featured" in p && p.featured ? "text-white/75" : "text-slate-600"}`}>{p.body}</p>
                <p className="mt-5">
                  <span className={`text-sm font-semibold ${"featured" in p && p.featured ? "text-white/70" : "text-slate-500"}`}>from </span>
                  <span className="text-4xl font-extrabold tracking-tight">${p.from}</span>
                  <SampleMark className={"featured" in p && p.featured ? "text-white/60" : "text-slate-500"} />
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <Drop className="mt-0.5 h-4 w-4 shrink-0" light={"featured" in p && !!p.featured} />
                      {it}
                    </li>
                  ))}
                </ul>
                <LeadJump
                  className={`mt-6 rounded-full px-5 py-3 text-center text-sm font-extrabold ${"featured" in p && p.featured ? "text-[#06232a]" : "bg-[#06232a] text-white"}`}
                  style={"featured" in p && p.featured ? { background: CTA_BG } : undefined}
                >
                  {data.lead.cta}
                </LeadJump>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* AI assistant + AI receptionist */}
        <section id="ai" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
            <Reveal className="relative overflow-hidden rounded-3xl bg-[#06232a] p-6 text-white sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#34d399]/20 blur-3xl" aria-hidden />
              <p className="relative text-xs font-bold uppercase tracking-[0.22em] text-[#6ee7b7]">AI assistant (demo)</p>
              <h2 className="relative mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Questions? Ask anytime.</h2>
              <p className="relative mt-3 text-white/80">Our AI assistant explains soft washing vs. power washing, answers plant and pet questions, and gets your free estimate started.</p>
              <div className="relative mt-5 space-y-2 text-sm">
                <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#0e7490] to-[#0ea5a4] px-3.5 py-2.5">Is soft washing safe for vinyl siding?</p>
                <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2.5">Yes. It uses low pressure, about like a garden hose, and a solution that kills mildew at the root. Want a free estimate?</p>
              </div>
              <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CHAT))} className="demo-lift relative mt-6 rounded-full px-6 py-3 font-extrabold text-[#06232a]" style={{ background: CTA_BG }}>
                Try the assistant
              </button>
            </Reveal>

            <Reveal delay={0.08} className={`p-6 sm:p-8 ${glass}`}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0e7490]">AI phone receptionist</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#06232a] sm:text-3xl">{data.receptionist.title}</h2>
              <p className="mt-3 text-slate-600">{data.receptionist.body}</p>
              {RECEPTIONIST_PHONE ? (
                <a href={RECEPTIONIST_PHONE.tel} className="demo-lift mt-5 inline-flex items-center gap-4 rounded-3xl bg-[#06232a] py-3 pl-3 pr-6 text-white shadow-[0_14px_40px_-12px_rgba(6,35,42,0.6)]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0e7490] to-[#34d399]">
                    <Icon d={PHONE_D} className="h-5 w-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-2xl font-extrabold tracking-tight">{RECEPTIONIST_PHONE.display}</span>
                    <span className="mt-0.5 block text-sm font-bold text-[#6ee7b7]">Call to test it live</span>
                  </span>
                </a>
              ) : (
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-2.5 text-sm font-bold text-slate-700">
                  <Icon d={PHONE_D} className="h-4 w-4" />
                  Demo line coming soon
                </p>
              )}
              <ol className="mt-6 space-y-3">
                {data.receptionist.steps.map((st, i) => (
                  <li key={st.title} className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0e7490] to-[#34d399] text-sm font-extrabold text-white">{i + 1}</span>
                    <span>
                      <span className="block font-bold text-[#06232a]">{st.title}</span>
                      <span className="block text-sm text-slate-600">{st.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* reviews (sample) */}
        <section id="reviews" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head
            eyebrow="Reviews"
            title={
              <>
                Neighbors love the shine <SampleTag className="align-middle" />
              </>
            }
          >
            <RatingSummary reviews={data.reviews} color="#f59e0b" className="mt-4 text-[#06232a]" />
          </Head>
          <ReviewGrid reviews={data.reviews} color="#f59e0b" cardClassName="bg-white/80 border-white text-slate-800" />
        </section>

        {/* service area */}
        <section id="area" className="px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className={`mx-auto grid max-w-6xl items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] ${glass}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0e7490]">Service area</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#06232a]">Proudly serving Bergen County</h2>
              <p className="mt-3 text-slate-600">Nearby town not listed? Ask anyway. There&apos;s a good chance we cover it.</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {data.areaTowns.map((t) => (
                <li key={t} className="rounded-full border border-[#0e7490]/20 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#0e5566]">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="oe-shimmer scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="FAQ" title="Questions, answered" />
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {data.faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="overflow-hidden rounded-2xl border border-white bg-white/80 shadow-sm">
                  <h3>
                    <button type="button" aria-expanded={open} aria-controls={`oe-faq-${i}`} onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-[#06232a] hover:bg-white">
                      {f.q}
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0e7490]/10 text-lg leading-none text-[#0e7490] transition-transform motion-reduce:transition-none ${open ? "rotate-45" : ""}`} aria-hidden>
                        +
                      </span>
                    </button>
                  </h3>
                  <div id={`oe-faq-${i}`} hidden={!open} className="px-5 pb-5 text-[15px] leading-relaxed text-slate-600">
                    {f.a}
                    {"sample" in f && f.sample && <SampleMark className="text-slate-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* final CTA (no second form: the button goes to the hero form) */}
        <section className="px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06232a] via-[#0e5566] to-[#0f766e] px-6 py-12 text-center text-white sm:px-12">
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#34d399]/25 blur-3xl" aria-hidden />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">{data.lead.finalTitle}</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/80">{data.lead.finalBody}</p>
            <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LeadJump className="demo-lift rounded-full px-7 py-3.5 font-extrabold text-[#06232a]" style={{ background: CTA_BG }}>
                {data.lead.cta}
              </LeadJump>
              <a href={PHONE.tel} className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 font-bold hover:bg-white/10">
                <Icon d={PHONE_D} className="h-4 w-4" />
                Call {PHONE.display}
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Wave fill="#06232a" className="-mb-px" />
      <footer className="relative bg-[#06232a] px-4 pb-28 pt-12 text-white/70 sm:px-6 sm:pb-12">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <div>
            <Logo light />
            <p className="mt-3 text-sm">{data.footerBlurb}</p>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Contact</p>
            <a href={PHONE.tel} className="mt-2 block hover:text-white">
              Call {PHONE.display}
            </a>
            <LeadJump className="mt-1 block hover:text-white">Get a free quote online</LeadJump>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Service area</p>
            <p className="mt-2">Bergen County, NJ</p>
            <p className="mt-2">
              Fully insured
              <SampleMark className="text-white/50" />
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/45">
          <p>Overpeck Exterior Care is a fictional sample brand by Overpeck Labs.</p>
          <PreviewNote />
        </div>
      </footer>

      <MobileLeadBar phone={PHONE} ctaLabel="Free quote" callBg={INK} ctaBg={C.accent} ctaText={INK} surface="bg-white/90 border-slate-200" />

      <ChatAssistant />
      <AppearObserver />

      {/* desktop exit intent: no second form, the button goes to the hero form (dialog closes first so focus can land) */}
      <ExitIntent slug={data.slug} title="Before you go, get your free quote" sub="Takes 20 seconds. No pressure, no obligation.">
        <div onClickCapture={(e) => (e.currentTarget.closest("dialog") as HTMLDialogElement | null)?.close()}>
          <LeadJump className="flex w-full items-center justify-center rounded-full px-6 py-3.5 font-extrabold text-[#06232a]" style={{ background: CTA_BG }}>
            {data.lead.cta}
          </LeadJump>
        </div>
      </ExitIntent>
    </MotionRoot>
  );
}
