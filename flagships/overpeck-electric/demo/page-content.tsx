import { preload } from "react-dom";
import "./electric.css";
import { data } from "./data";
import { RECEPTIONIST_PHONE } from "../phone";
import ChatAssistant, { OPEN_CHAT } from "./ChatAssistant";
import EvEstimate from "./EvEstimate";
import HeroLeadForm from "./HeroLeadForm";
import HouseLights from "./HouseLights";
import { Reveal, Stagger, StaggerItem } from "./Appear";
import AppearObserver from "./AppearObserver";
import EventButton from "@/components/demos/EventButton";
import CloseDialogOnClick from "@/components/demos/CloseDialogOnClick";
import { PreviewNote, RatingSummary, ReviewGrid, SampleMark, SampleTag, Stars } from "@/components/demos/sample";
import { averageRating } from "@/components/demos/rating";
import { CtaBand, ExitIntent, LeadJump, MobileLeadBar, type LeadTheme } from "@/components/demos/lead";
import { CountUp, DemoImage, HeroImage, HeroIntro, HeroItem, MotionRoot, StickyHeader } from "@/components/demos/motion";

/*
 * Overpeck Electric: Overpeck Labs' third flagship (a fictional brand). Server component: only the interactive
 * islands ship JS. Single lead flow: the hero form is the only form; every other CTA is a <LeadJump> back to it
 * (or its "Add details" steps after submit). Display-only.
 */

const PH = data.photos;
const PHONE = data.phone;
const RATING = averageRating(data.reviews);
const AMBER = "linear-gradient(90deg, #facc15, #f59e0b)";
const INK = "#0b0f17";
const GLASS: LeadTheme = { tone: "dark", primary: "#d97706", accent: "#facc15", ctaBg: AMBER, ctaText: INK };
const HERO_SRCSET = "/demos/overpeck-electric/hero-828.webp 828w, /demos/overpeck-electric/hero-1200.webp 1200w, /demos/overpeck-electric/hero.webp 1600w";

const ICONS: Record<string, string> = {
  panel: "M5 3h14v18H5zM9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2",
  ev: "M5 18V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12M3 18h14M15 9h2a2 2 0 0 1 2 2v4a1 1 0 0 0 2 0V8l-2-2M10 7l-2 4h3l-2 4",
  lighting: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  generator: "M3 8h18v10H3zM7 8V5h10v3M8 13h3l-1.5 3M15 12v4",
  troubleshooting: "M14.5 9.5l-5 5M10 6l-1-3M6 10L3 9M18 14l3 1M14 18l1 3M9 3.5a7 7 0 0 1 11.5 11.5",
  inspection: "M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
};
const PHONE_D = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z";
const BOLT_D = "M13 2 4 14h7l-1 8 9-12h-7z";
const CHECK_D = "M5 12l5 5L20 7";

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={data.businessName}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#121826] text-[#facc15] ring-1 ring-[#facc15]/40 shadow-[0_0_20px_-6px_rgba(250,204,21,0.7)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d={BOLT_D} />
        </svg>
      </span>
      <span className="text-[17px] font-extrabold leading-tight tracking-tight text-white">
        Overpeck <span className="text-[#facc15]">Electric</span>
      </span>
    </a>
  );
}

function Head({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#facc15]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[17px] leading-relaxed text-slate-300">{sub}</p>}
      {children}
    </Reveal>
  );
}

const card = "rounded-3xl border border-white/10 bg-[#121826] shadow-[0_24px_60px_-34px_rgba(0,0,0,0.9)]";

export default function OverpeckElectric() {
  preload("/demos/overpeck-electric/hero-828.webp", { as: "image", imageSrcSet: HERO_SRCSET, imageSizes: "100vw", fetchPriority: "high" });
  return (
    <MotionRoot className="bg-[#0b0f17] font-sans text-slate-200 antialiased [color-scheme:dark]">
      <StickyHeader height={60} shrunk={52} barClassName="bg-[#0b0f17]/80 border-b border-white/10">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-semibold text-slate-300 lg:flex">
          <a href="#services" className="hover:text-white">
            Services
          </a>
          <a href="#ev" className="hover:text-white">
            EV estimate
          </a>
          <a href="#reviews" className="hover:text-white">
            Reviews
          </a>
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LeadJump className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 md:inline-flex">Free estimate</LeadJump>
          <a href={PHONE.tel} className="demo-lift inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
            <Icon d={PHONE_D} className="h-4 w-4" />
            <span className="hidden sm:inline">{PHONE.display}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </StickyHeader>

      <main id="top">
        {/* hero: copy + call left, glass form right (phones: headline, form, call) */}
        <section className="relative overflow-hidden">
          <HeroImage>
            {/* eslint-disable-next-line @next/next/no-img-element -- responsive srcset; next/image is unoptimized here */}
            <img src="/demos/overpeck-electric/hero-1200.webp" srcSet={HERO_SRCSET} sizes="100vw" alt={PH.hero?.alt ?? ""} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
          </HeroImage>
          <div className="pointer-events-none absolute inset-0 bg-[#0b0f17]/80 md:bg-transparent md:bg-[linear-gradient(90deg,rgba(11,15,23,0.96)_0%,rgba(11,15,23,0.86)_42%,rgba(11,15,23,0.45)_78%,rgba(11,15,23,0.3)_100%)]" aria-hidden />
          <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-[#facc15]/10 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0b0f17]" aria-hidden />

          <div className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-10 pt-5 sm:px-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-center md:gap-x-12 md:gap-y-5 md:pb-24 md:pt-16">
            <HeroIntro className="md:col-start-1 md:row-start-1">
              <HeroItem>
                <p className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 md:inline-flex">
                  <span className="el-pulse h-1.5 w-1.5 rounded-full bg-[#facc15]" aria-hidden />
                  Panels · EV chargers · Lighting · Generators
                </p>
                <h1 className="text-[30px] font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl md:mt-5 lg:text-6xl">
                  Bergen County&apos;s <span className="bg-gradient-to-r from-[#fde047] to-[#f59e0b] bg-clip-text text-transparent">
                    <span className="whitespace-nowrap">on-call</span> electricians.
                  </span>
                </h1>
              </HeroItem>
            </HeroIntro>

            <div className="md:col-start-2 md:row-span-3 md:row-start-1">
              <div className="rounded-3xl border border-white/15 bg-[#0b0f17]/60 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-6">
                <div className="mb-4 hidden items-center justify-between md:flex">
                  <p className="text-lg font-extrabold text-white">{data.lead.title}</p>
                  <span className="rounded-full bg-[#facc15]/15 px-2.5 py-1 text-[11px] font-bold text-[#fde047]">No obligation</span>
                </div>
                <HeroLeadForm slug={data.slug} source="hero" anchorId="lead" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={GLASS} phonePlaceholder="Mobile number" />
              </div>
            </div>

            <div className="md:col-start-1 md:row-start-3">
              <a href={PHONE.tel} className="demo-lift flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#facc15]/60 bg-[#facc15]/10 px-7 py-3.5 text-base font-extrabold text-white md:inline-flex md:w-auto md:py-4 md:text-lg">
                <Icon d={PHONE_D} className="h-5 w-5 text-[#facc15]" />
                Call {PHONE.display}
              </a>
              {RECEPTIONIST_PHONE && <p className="mt-2 text-center text-xs font-semibold text-slate-300 md:text-left">Call our AI receptionist, it&apos;s live 24/7 (demo line).</p>}
            </div>

            <div className="md:col-start-1 md:row-start-2">
              <p className="max-w-xl text-lg leading-relaxed text-slate-300">{data.subhead}</p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-200">
                <Stars rating={RATING} color="#facc15" />
                <span>
                  {RATING.toFixed(1)} rating from {data.reviews.length} reviews
                  <SampleMark className="text-slate-400" />
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* signature: the house lights up room by room */}
        <HouseLights cta={data.lead.cta} />

        {/* stats (all true for this page) */}
        <section aria-label="Highlights" className="px-4 sm:px-6">
          <Stagger className={`mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 ${card}`}>
            {data.stats.map((s) => (
              <StaggerItem key={s.label} className="px-4 py-5 text-center">
                <p className="text-2xl font-extrabold text-white sm:text-3xl">{"value" in s ? <CountUp to={s.value} /> : s.text}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* services */}
        <section id="services" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="What we do" title="Electrical work, done right the first time" sub="From a dead outlet to a 200-amp service upgrade, one call gets it handled safely and to code." />
          <Stagger className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.map((s) => (
              <StaggerItem key={s.key} className={`demo-lift relative overflow-hidden ${card}`}>
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px] overflow-hidden">
                  <span className="el-current absolute inset-0 block" />
                </span>
                <DemoImage photo={PH.services[s.key] ?? null} className="aspect-[16/10]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#facc15]/10 text-[#facc15] ring-1 ring-[#facc15]/25">
                      <Icon d={ICONS[s.key]} className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-extrabold text-white">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{s.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Stagger className="mx-auto mt-10 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.whyUs.map((w) => (
              <StaggerItem key={w.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#facc15]/15 text-[#facc15]" aria-hidden>
                  <Icon d={CHECK_D} className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block font-bold text-white">
                    {w.title}
                    {"sample" in w && w.sample && <SampleMark className="text-slate-400" />}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-400">{w.body}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <CtaBand title={data.lead.bandTitle} body={data.lead.bandBody} ctaLabel={data.lead.cta} phone={PHONE} bg="linear-gradient(120deg, #1a2234, #121826 55%, #3a2a06)" ctaBg="#facc15" ctaText={INK} />

        {/* EV estimate (sample) */}
        <section id="ev" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="EV charging" title="What would home charging cost you?" sub="Play with the numbers. It's a sample estimate to get you started, not a quote." />
          <Reveal className="mx-auto mt-10 max-w-5xl">
            <EvEstimate rate={data.ev.rate} milesPerKwh={data.ev.milesPerKwh} installFrom={data.ev.installFrom} cta={data.lead.cta} />
          </Reveal>
        </section>

        {/* how it works */}
        <section id="how" className="px-4 py-16 sm:px-6 md:py-20">
          <Head eyebrow="How it works" title="Three simple steps" />
          <Stagger as="ol" className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {data.process.map((st, i) => (
              <StaggerItem key={st.title} as="li" className={`demo-lift p-6 ${card}`}>
                <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
                  {i + 1}
                </span>
                <p className="mt-4 text-lg font-extrabold text-white">{st.title}</p>
                <p className="mt-1.5 text-[15px] text-slate-300">{st.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* AI assistant + AI receptionist */}
        <section id="ai" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
            <Reveal className={`relative overflow-hidden p-6 sm:p-8 ${card}`}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#facc15]/10 blur-3xl" aria-hidden />
              <p className="relative text-xs font-bold uppercase tracking-[0.22em] text-[#facc15]">AI assistant (demo)</p>
              <h2 className="relative mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Safety first, any hour</h2>
              <p className="relative mt-3 text-slate-300">Our AI assistant spots emergencies and tells you what to do, answers questions about panels, EV chargers and lighting, and gets your estimate started.</p>
              <div className="relative mt-5 space-y-2 text-sm">
                <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#b45309] to-[#d97706] px-3.5 py-2.5 text-white">An outlet in the kitchen smells like burning plastic.</p>
                <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2.5 text-slate-100">Turn off that breaker if you can do it safely, unplug anything nearby and don&apos;t use the outlet. Then call us right away. If there&apos;s smoke, get out and call 911.</p>
              </div>
              <EventButton event={OPEN_CHAT} className="demo-lift relative mt-6 rounded-full px-6 py-3 font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
                Try the assistant
              </EventButton>
            </Reveal>

            <Reveal delay={0.08} className={`p-6 sm:p-8 ${card}`}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#facc15]">AI phone receptionist</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{data.receptionist.title}</h2>
              <p className="mt-3 text-slate-300">{data.receptionist.body}</p>
              {RECEPTIONIST_PHONE ? (
                <a href={RECEPTIONIST_PHONE.tel} className="demo-lift mt-5 inline-flex items-center gap-4 rounded-3xl bg-white py-3 pl-3 pr-6 text-[#0b0f17]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-[#0b0f17]" style={{ background: AMBER }}>
                    <Icon d={PHONE_D} className="h-5 w-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-2xl font-extrabold tracking-tight">{RECEPTIONIST_PHONE.display}</span>
                    <span className="mt-0.5 block text-sm font-bold text-[#b45309]">Call to test it live</span>
                  </span>
                </a>
              ) : (
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200">
                  <Icon d={PHONE_D} className="h-4 w-4" />
                  Demo line coming soon
                </p>
              )}
              <ol className="mt-6 space-y-3">
                {data.receptionist.steps.map((st, i) => (
                  <li key={st.title} className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-bold text-white">{st.title}</span>
                      <span className="block text-sm text-slate-400">{st.body}</span>
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
                Bergen County homeowners say <SampleTag className="align-middle" />
              </>
            }
          >
            <RatingSummary reviews={data.reviews} color="#facc15" className="mt-4 text-white" />
          </Head>
          <ReviewGrid reviews={data.reviews} color="#facc15" cardClassName="bg-[#121826] border-white/10 text-slate-200" />
        </section>

        {/* service area */}
        <section id="area" className="px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className={`mx-auto grid max-w-6xl items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] ${card}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#facc15]">Service area</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">Electricians across Bergen County</h2>
              <p className="mt-3 text-slate-300">Nearby town not listed? Call and ask. We probably cover it.</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {data.areaTowns.map((t) => (
                <li key={t} className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-slate-200">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* FAQ (native details: no JS) */}
        <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="FAQ" title="Electrical questions, answered" />
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {data.faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#121826]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-bold text-white hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#facc15]/15 text-lg leading-none text-[#facc15] transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden>
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[15px] leading-relaxed text-slate-300">
                  {f.a}
                  {"sample" in f && f.sample && <SampleMark className="text-slate-500" />}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* final CTA (no second form: the button goes to the hero form) */}
        <section className="px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#facc15]/20 bg-gradient-to-br from-[#121826] via-[#161d2e] to-[#2a2006] px-6 py-12 text-center sm:px-12">
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#facc15]/15 blur-3xl" aria-hidden />
            <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{data.lead.finalTitle}</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-slate-300">{data.lead.finalBody}</p>
            <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LeadJump className="demo-lift rounded-full px-7 py-3.5 font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
                {data.lead.cta}
              </LeadJump>
              <a href={PHONE.tel} className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-6 py-3 font-bold text-white hover:bg-white/10">
                <Icon d={PHONE_D} className="h-4 w-4" />
                Call {PHONE.display}
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 pb-28 pt-12 text-slate-400 sm:px-6 sm:pb-12">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 text-sm">{data.footerBlurb}</p>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Contact</p>
            <a href={PHONE.tel} className="mt-2 block hover:text-white">
              Call {PHONE.display}
            </a>
            <LeadJump className="mt-1 block hover:text-white">Get a free estimate online</LeadJump>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Service area</p>
            <p className="mt-2">Bergen County, NJ</p>
            <p className="mt-2">
              Licensed &amp; insured
              <SampleMark className="text-slate-500" />
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-500">
          <p>Overpeck Electric is a fictional sample brand by Overpeck Labs.</p>
          <PreviewNote />
        </div>
      </footer>

      <MobileLeadBar phone={PHONE} ctaLabel="Free estimate" callBg="#1a2234" ctaBg="#facc15" ctaText={INK} surface="bg-[#0b0f17]/90 border-white/10" />

      <ChatAssistant />
      <AppearObserver />

      {/* desktop exit intent: no second form, the button goes to the hero form */}
      <ExitIntent slug={data.slug} title="Before you go, get your free estimate" sub="Takes 20 seconds. No pressure, no obligation.">
        <CloseDialogOnClick>
          <LeadJump className="flex w-full items-center justify-center rounded-full px-6 py-3.5 font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
            {data.lead.cta}
          </LeadJump>
        </CloseDialogOnClick>
      </ExitIntent>
    </MotionRoot>
  );
}
