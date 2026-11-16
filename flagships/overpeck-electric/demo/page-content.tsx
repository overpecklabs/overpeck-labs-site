import { preload } from "react-dom";
import "./electric.css";
import { data } from "./data";
import { RECEPTIONIST_PHONE } from "../phone";
import ChatAssistant, { OPEN_CHAT } from "./ChatAssistant";
import EvEstimate from "./EvEstimate";
import HeroLeadForm from "./HeroLeadForm";
import CircuitStory from "./CircuitStory";
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
 * islands ship JS. One continuous scroll story (CircuitStory) powers each section as the current reaches it.
 * Single lead flow: the hero form is the only form; every other CTA is a <LeadJump> back to it
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

function Logo({ nameClass = "text-white" }: { nameClass?: string }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={data.businessName}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#121826] text-[#facc15] ring-1 ring-[#facc15]/40 shadow-[0_0_20px_-6px_rgba(250,204,21,0.7)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d={BOLT_D} />
        </svg>
      </span>
      <span className={`text-[17px] font-extrabold leading-tight tracking-tight ${nameClass}`}>
        Overpeck <span className="text-[color:var(--accent-text,#facc15)]">Electric</span>
      </span>
    </a>
  );
}

function Head({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--accent-text)]">{eyebrow}</p>
      <h2 className="el-h2 mt-3 text-[color:var(--fg)]">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-[color:var(--fg2)]">{sub}</p>}
      {children}
    </Reveal>
  );
}

/** Glass card with a thin hairline border that turns amber and glows when its section is powered (electric.css). */
const card = "el-card rounded-3xl";

/**
 * Below the hero, every section is themed by two CSS variables (electric.css):
 *  --lift: how far down the page it sits (0 = charcoal ... 1 = cream), set here from its order;
 *  --power: 0 (unpowered) -> 1 (powered), animated when CircuitStory's current reaches the section.
 * data-tone picks light or dark text for the powered state so both states keep AA contrast.
 */
const zone = (lift: number) => ({ "data-circuit-section": "", "data-tone": lift >= 0.55 ? "light" : "dark", style: { "--lift": lift } as React.CSSProperties });

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

      <main id="top" data-circuit-root className="relative isolate">
        <CircuitStory />

        {/* hero: copy + call left, glass form right (phones: headline, form, call) */}
        <section className="relative overflow-hidden">
          <HeroImage>
            {/* eslint-disable-next-line @next/next/no-img-element -- responsive srcset; next/image is unoptimized here */}
            <img src="/demos/overpeck-electric/hero-1200.webp" srcSet={HERO_SRCSET} sizes="100vw" alt={PH.hero?.alt ?? ""} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
          </HeroImage>
          <div className="pointer-events-none absolute inset-0 bg-[#0b0f17]/80 md:bg-transparent md:bg-[linear-gradient(90deg,rgba(11,15,23,0.96)_0%,rgba(11,15,23,0.86)_42%,rgba(11,15,23,0.45)_78%,rgba(11,15,23,0.3)_100%)]" aria-hidden />
          <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-[#facc15]/10 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0b0f17]" aria-hidden />
          {/* the meter where the current starts */}
          <div data-circuit="start" aria-hidden className="pointer-events-none absolute bottom-2.5 left-2 z-[1] flex items-center gap-1.5 rounded-lg border border-[#facc15]/35 bg-[#0b0f17]/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#facc15] md:bottom-6 md:left-6">
            <svg viewBox="0 0 24 24" className="el-pulse h-3 w-3" fill="currentColor">
              <path d={BOLT_D} />
            </svg>
            Meter
          </div>

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


        {/* stats (all true for this page) */}
        <section aria-label="Highlights" {...zone(0.0)} className="px-4 py-10 sm:px-6">
          <Stagger className={`mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 ${card}`}>
            {data.stats.map((s) => (
              <StaggerItem key={s.label} className="px-4 py-5 text-center">
                <p className="text-2xl font-extrabold text-[color:var(--fg)] sm:text-3xl">{"value" in s ? <CountUp to={s.value} /> : s.text}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--fg3)]">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* services */}
        <section {...zone(0.12)} id="services" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
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
                    <span data-circuit-card className="el-circ relative grid h-10 w-10 place-items-center rounded-xl bg-[#facc15]/10 text-[#facc15] ring-1 ring-[#facc15]/25">
                      <span aria-hidden className="el-glow pointer-events-none absolute -inset-3 rounded-2xl bg-[radial-gradient(circle,rgba(250,204,21,0.5),transparent_68%)]" />
                      <Icon d={ICONS[s.key]} className="el-dim relative h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-extrabold text-[color:var(--fg)]">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--fg2)]">{s.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full bg-[color:var(--tint)] px-2.5 py-1 text-xs font-semibold text-[color:var(--fg)] ring-1 ring-[color:var(--line)]">
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
              <StaggerItem key={w.title} className="el-card flex gap-3 rounded-2xl p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#facc15]/15 text-[#facc15]" aria-hidden>
                  <Icon d={CHECK_D} className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block font-bold text-[color:var(--fg)]">
                    {w.title}
                    {"sample" in w && w.sample && <SampleMark className="text-[color:var(--fg3)]" />}
                  </span>
                  <span className="mt-0.5 block text-sm text-[color:var(--fg3)]">{w.body}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <CtaBand title={data.lead.bandTitle} body={data.lead.bandBody} ctaLabel={data.lead.cta} phone={PHONE} bg="linear-gradient(120deg, #1a2234, #121826 55%, #3a2a06)" ctaBg="#facc15" ctaText={INK} />

        {/* EV estimate (sample) */}
        <section {...zone(0.25)} id="ev" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="EV charging" title="What would home charging cost you?" sub="Play with the numbers. It's a sample estimate to get you started, not a quote." />
          <div data-circuit="ev" className="el-card relative mx-auto mt-6 flex w-fit items-center gap-3 rounded-full px-4 py-2" aria-label="Car battery, charged by the current">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--fg3)]">Car battery</span>
            <span className="flex items-center">
              <span className="relative h-4 w-28 overflow-hidden rounded-[5px] border border-[color:var(--line)] p-[2px]">
                <span data-circuit-battery-fill className="block h-full w-full origin-left rounded-[3px] bg-gradient-to-r from-[#22c55e] to-[#a3e635]" />
              </span>
              <span className="ml-[2px] h-2 w-[3px] rounded-r bg-white/40" aria-hidden />
            </span>
            <span data-circuit-battery-text className="w-10 text-right text-sm font-extrabold tabular-nums text-[color:var(--fg)]">
              100%
            </span>
          </div>
          <Reveal className="mx-auto mt-8 max-w-5xl">
            <div data-circuit="ev-end">
              <EvEstimate rate={data.ev.rate} milesPerKwh={data.ev.milesPerKwh} installFrom={data.ev.installFrom} cta={data.lead.cta} />
            </div>
          </Reveal>
        </section>

        {/* how it works */}
        <section {...zone(0.37)} id="how" className="px-4 py-16 sm:px-6 md:py-20">
          <Head eyebrow="How it works" title="Three simple steps" />
          <Stagger as="ol" className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {data.process.map((st, i) => (
              <StaggerItem key={st.title} as="li" className={`demo-lift p-6 ${card}`}>
                <span data-circuit-step className="el-circ relative inline-grid h-10 w-10">
                  <span aria-hidden className="el-glow pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.55),transparent_68%)]" />
                  <span className="el-dim relative grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
                    {i + 1}
                  </span>
                </span>
                <p className="mt-4 text-lg font-extrabold text-[color:var(--fg)]">{st.title}</p>
                <p className="mt-1.5 text-[15px] text-[color:var(--fg2)]">{st.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* AI assistant + AI receptionist */}
        <section {...zone(0.5)} id="ai" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
            <Reveal className={`relative overflow-hidden p-6 sm:p-8 ${card}`}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#facc15]/10 blur-3xl" aria-hidden />
              <p className="relative text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--accent-text)]">AI assistant (demo)</p>
              <h2 className="el-h3 relative mt-2 text-[color:var(--fg)]">Safety first, any hour</h2>
              <p className="relative mt-3 text-[color:var(--fg2)]">Our AI assistant spots emergencies and tells you what to do, answers questions about panels, EV chargers and lighting, and gets your estimate started.</p>
              <div className="relative mt-5 space-y-2 text-sm">
                <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#b45309] to-[#d97706] px-3.5 py-2.5 text-white">An outlet in the kitchen smells like burning plastic.</p>
                <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-[color:var(--tint)] px-3.5 py-2.5 text-[color:var(--fg)]">Turn off that breaker if you can do it safely, unplug anything nearby and don&apos;t use the outlet. Then call us right away. If there&apos;s smoke, get out and call 911.</p>
              </div>
              <EventButton event={OPEN_CHAT} className="demo-lift relative mt-6 rounded-full px-6 py-3 font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
                Try the assistant
              </EventButton>
            </Reveal>

            <Reveal delay={0.08} className={`p-6 sm:p-8 ${card}`}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--accent-text)]">AI phone receptionist</p>
              <h2 className="el-h3 mt-2 text-[color:var(--fg)]">{data.receptionist.title}</h2>
              <p className="mt-3 text-[color:var(--fg2)]">{data.receptionist.body}</p>
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
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--tint)] px-5 py-2.5 text-sm font-bold text-[color:var(--fg)]">
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
                      <span className="block font-bold text-[color:var(--fg)]">{st.title}</span>
                      <span className="block text-sm text-[color:var(--fg3)]">{st.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* reviews (sample) */}
        <section {...zone(0.62)} id="reviews" data-circuit-stars className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head
            eyebrow="Reviews"
            title={
              <>
                Bergen County homeowners say <SampleTag className="align-middle" />
              </>
            }
          >
            <div data-circuit="stars" className="mt-4 inline-block">
              <RatingSummary reviews={data.reviews} color="#facc15" className="text-[color:var(--fg)]" />
            </div>
          </Head>
          <ReviewGrid reviews={data.reviews} color="#facc15" cardClassName="el-card el-review text-[color:var(--fg)]" />
        </section>

        {/* service area */}
        <section {...zone(0.75)} id="area" className="px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className={`mx-auto grid max-w-6xl items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] ${card}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--accent-text)]">Service area</p>
              <h2 className="el-h3 mt-2 text-[color:var(--fg)]">Electricians across Bergen County</h2>
              <p className="mt-3 text-[color:var(--fg2)]">Nearby town not listed? Call and ask. We probably cover it.</p>
            </div>
            <ul data-circuit="area" className="flex flex-wrap gap-2">
              {data.areaTowns.map((t) => (
                <li key={t} data-circuit-town className="el-town relative rounded-full border border-[#facc15]/30 bg-[#facc15]/10 px-3.5 py-1.5 text-sm font-semibold text-[color:var(--fg)]">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* FAQ (native details: no JS) */}
        <section {...zone(0.87)} id="faq" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="FAQ" title="Electrical questions, answered" />
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {data.faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="el-card group overflow-hidden rounded-2xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-bold text-[color:var(--fg)] hover:bg-[color:var(--tint)] [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#facc15]/15 text-lg leading-none text-[#facc15] transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden>
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[15px] leading-relaxed text-[color:var(--fg2)]">
                  {f.a}
                  {"sample" in f && f.sample && <SampleMark className="text-[color:var(--fg3)]" />}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* final CTA (no second form: the button goes to the hero form). The current ends in this switch. */}
        <section {...zone(1.0)} data-circuit-final className="px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className="el-card relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#facc15]/15 blur-3xl" aria-hidden />
            <div className="el-final-glow pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.28),transparent_62%)]" aria-hidden />
            <div className="relative mx-auto mb-6 flex w-fit items-center gap-3">
              <span data-circuit="switch" className="relative inline-flex h-8 w-14 items-center rounded-full border border-[color:var(--line)] bg-[#0b0f17] p-1" aria-hidden>
                <span className="el-knob block h-6 w-6 rounded-full bg-[#facc15] shadow-[0_0_16px_rgba(250,204,21,0.9)]" />
              </span>
              <span className="el-onlabel text-xs font-extrabold uppercase tracking-[0.22em] text-[color:var(--accent-text)]">Power on</span>
            </div>
            <h2 className="el-h2 relative text-[color:var(--fg)]">{data.lead.finalTitle}</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-[color:var(--fg2)]">{data.lead.finalBody}</p>
            <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <span className="relative inline-flex">
                <span aria-hidden className="el-btn-glow pointer-events-none absolute -inset-3 rounded-full bg-[#facc15]/45 blur-xl" />
                <LeadJump className="demo-lift relative rounded-full px-7 py-3.5 font-extrabold text-[#0b0f17]" style={{ background: AMBER }}>
                  {data.lead.cta}
                </LeadJump>
              </span>
              <a href={PHONE.tel} className="inline-flex items-center gap-2 rounded-full border-2 border-[color:var(--line)] px-6 py-3 font-bold text-[color:var(--fg)] hover:bg-[color:var(--tint)]">
                <Icon d={PHONE_D} className="h-4 w-4" />
                Call {PHONE.display}
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer data-circuit-footer data-tone="light" style={{ "--lift": 1 } as React.CSSProperties} className="border-t border-[color:var(--line)] px-4 pb-28 pt-12 text-[color:var(--fg3)] sm:px-6 sm:pb-12">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <div>
            <Logo nameClass="text-[color:var(--fg)]" />
            <p className="mt-3 text-sm">{data.footerBlurb}</p>
          </div>
          <div className="text-sm">
            <p className="font-bold text-[color:var(--fg)]">Contact</p>
            <a href={PHONE.tel} className="mt-2 block hover:text-[color:var(--fg)]">
              Call {PHONE.display}
            </a>
            <LeadJump className="mt-1 block hover:text-[color:var(--fg)]">Get a free estimate online</LeadJump>
          </div>
          <div className="text-sm">
            <p className="font-bold text-[color:var(--fg)]">Service area</p>
            <p className="mt-2">Bergen County, NJ</p>
            <p className="mt-2">
              Licensed &amp; insured
              <SampleMark className="text-[color:var(--fg3)]" />
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-[color:var(--line)] pt-6 text-xs text-[color:var(--fg3)]">
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
