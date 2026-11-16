import { data } from "./data";
import BeforeAfter from "./BeforeAfter";
import ChatAssistant, { OPEN_CHAT } from "./ChatAssistant";
import HeroLeadForm from "./HeroLeadForm";
import EventButton from "@/components/demos/EventButton";
import { PreviewNote, RatingSummary, ReviewGrid, SampleMark, SampleTag, Stars } from "@/components/demos/sample";
import { averageRating } from "@/components/demos/rating";
import { CtaBand, ExitIntent, LeadForm, LeadJump, MobileLeadBar, type LeadTheme } from "@/components/demos/lead";
import { CountUp, DemoImage, HeroImage, HeroIntro, HeroItem, MotionRoot, Parallax, Reveal, Stagger, StaggerItem, StickyHeader } from "@/components/demos/motion";

/*
 * Overpeck Plumbing: Overpeck Labs' flagship showcase (a fictional brand). Display-only: lead forms go through
 * submitLead() and never send anything. Only the AI chat talks to a server (/api/demo/overpeck-plumbing/chat).
 */

const C = data.colors;
const PH = data.photos;
const PHONE = data.phone;
const EMERGENCY_BG = `linear-gradient(90deg, ${data.emergency.from}, ${data.emergency.to})`;
const RATING = averageRating(data.reviews);

const GLASS: LeadTheme = { tone: "dark", primary: C.primary, accent: C.accent, ctaBg: `linear-gradient(90deg, ${C.accent}, #60a5fa)`, ctaText: "#04101f" };
const LIGHT: LeadTheme = { tone: "light", primary: C.primary, accent: C.accent, ctaBg: C.primary, ctaText: "#ffffff" };

const ICONS: Record<string, string> = {
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  drain: "M4 6h16M7 6v4a5 5 0 0 0 10 0V6M12 15v6",
  flame: "M12 3c1 3 4 4.5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8z",
  toilet: "M6 4h8v6H6zM4 10h14a5 5 0 0 1-5 5H9l-1 5h6",
  pipe: "M3 9h7v6H3zM10 12h11M17 8l4 4-4 4",
  bath: "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2",
  siren: "M7 18v-6a5 5 0 0 1 10 0v6M5 18h14v3H5zM12 3v2M4.5 6.5l1.4 1.4M19.5 6.5l-1.4 1.4",
};
const PHONE_D = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z";

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 text-white" aria-label={data.businessName}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#22d3ee] shadow-[0_6px_20px_-6px_rgba(34,211,238,0.7)]">
        <Icon d={ICONS.drop} className="h-5 w-5" />
      </span>
      <span className="text-[17px] font-extrabold tracking-tight">
        Overpeck <span className="text-[#67e8f9]">Plumbing</span>
      </span>
    </a>
  );
}

function Head({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#67e8f9]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[17px] leading-relaxed text-slate-300">{sub}</p>}
      {children}
    </Reveal>
  );
}

const glass = "rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]";

export default function OverpeckPlumbing() {
  return (
    <MotionRoot className="bg-[#050d1f] font-sans text-slate-100 antialiased [color-scheme:dark]">
      {/* sticky: slim emergency strip + glass header that shrinks on scroll */}
      <StickyHeader
        height={60}
        shrunk={52}
        topBarHeight={30}
        topBar={
          <a href={PHONE.tel} className="flex h-full items-center justify-center gap-2 text-[13px] font-bold text-white backdrop-blur-md" style={{ background: `linear-gradient(90deg, ${data.emergency.from}e6, ${data.emergency.to}e6)` }}>
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            24/7 Emergency? Tap to call <span className="hidden sm:inline">{PHONE.display}</span>
          </a>
        }
        barClassName="bg-[#050d1f]/60 border-b border-white/10"
      >
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-semibold text-slate-300 lg:flex">
          <a href="#services" className="hover:text-white">
            Services
          </a>
          <a href="#ai" className="hover:text-white">
            AI assistant
          </a>
          <a href="#gallery" className="hover:text-white">
            Our work
          </a>
          <a href="#reviews" className="hover:text-white">
            Reviews
          </a>
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LeadJump className="hidden rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 md:inline-flex">Get a quote</LeadJump>
          <a href={PHONE.tel} className="demo-lift inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#050d1f]">
            <Icon d={PHONE_D} className="h-4 w-4" />
            <span className="hidden sm:inline">{PHONE.display}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </StickyHeader>

      <main id="top">
        {/* hero: emergency copy + call left, glass lead form right (phones: headline, form, call) */}
        <section className="relative overflow-hidden">
          {PH.hero && (
            <HeroImage>
              <DemoImage photo={PH.hero} priority sizes="100vw" className="absolute inset-0" imgClassName="object-cover object-center -scale-x-100" />
            </HeroImage>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[#050d1f]/80 md:bg-transparent md:bg-[linear-gradient(90deg,#050d1f_0%,rgba(5,13,31,0.9)_40%,rgba(5,13,31,0.45)_75%,rgba(5,13,31,0.3)_100%)]" aria-hidden />
          <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-[#2563eb]/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#050d1f]" aria-hidden />

          <div className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-10 pt-5 sm:px-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-center md:gap-x-12 md:gap-y-5 md:pb-24 md:pt-16">
            <HeroIntro className="md:col-start-1 md:row-start-1">
              <HeroItem>
                <p className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur md:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                  Plumbers on call across Bergen County
                </p>
                <h1 className="text-[30px] font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl md:mt-5 lg:text-6xl">
                  Burst pipe? Flooding? <span className="bg-gradient-to-r from-[#67e8f9] to-[#60a5fa] bg-clip-text text-transparent">We&apos;re on the way.</span>
                </h1>
              </HeroItem>
            </HeroIntro>

            <div className="md:col-start-2 md:row-span-3 md:row-start-1">
              <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-6">
                <div className="mb-4 hidden items-center justify-between md:flex">
                  <p className="text-lg font-extrabold text-white">{data.lead.title}</p>
                  <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300">Available 24/7</span>
                </div>
                <HeroLeadForm slug={data.slug} source="hero" anchorId="lead" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={GLASS} />
              </div>
            </div>

            <div className="md:col-start-1 md:row-start-3">
              <a href={PHONE.tel} className="demo-lift flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-base font-extrabold text-white shadow-[0_14px_36px_-12px_rgba(249,115,22,0.9)] md:inline-flex md:w-auto md:py-4 md:text-lg" style={{ background: EMERGENCY_BG }}>
                <Icon d={PHONE_D} className="h-5 w-5" />
                Call {PHONE.display}
              </a>
            </div>

            <div className="md:col-start-1 md:row-start-2">
              <p className="max-w-xl text-lg leading-relaxed text-slate-300">{data.subhead}</p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-200">
                <Stars rating={RATING} color="#fbbf24" />
                <span>
                  {RATING.toFixed(1)} rating from {data.reviews.length} reviews
                  <SampleMark className="text-slate-400" />
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* stats (true numbers count up; made-up ones are marked) */}
        <section aria-label="Highlights" className="px-4 sm:px-6">
          <Stagger className={`mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden md:grid-cols-4 ${glass}`}>
            {data.stats.map((s) => (
              <StaggerItem key={s.label} className="bg-[#050d1f]/40 px-4 py-5 text-center">
                <p className="text-2xl font-extrabold text-white sm:text-3xl">
                  {"value" in s ? <CountUp to={s.value} /> : s.text}
                  {"sample" in s && s.sample && <SampleMark className="!text-[11px] text-slate-400" />}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* 1. services */}
        <section id="services" className="relative scroll-mt-28 px-4 py-16 sm:px-6 md:py-24">
          <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-[#22d3ee]/10 blur-3xl" aria-hidden />
          <Head eyebrow="What we fix" title="Every plumbing job, start to finish" sub="From a dripping faucet to a sewer backup, one call gets it handled." />
          <Stagger className="relative mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.services.map((s) => (
              <StaggerItem key={s.title} className={`demo-lift p-6 ${glass}`}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#2563eb]/40 to-[#22d3ee]/30 text-[#a5f3fc] ring-1 ring-white/10">
                  <Icon d={ICONS[s.icon]} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-white">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{s.body}</p>
              </StaggerItem>
            ))}
            <StaggerItem className="demo-lift flex flex-col justify-between rounded-3xl border border-[#22d3ee]/30 bg-gradient-to-br from-[#2563eb]/30 to-[#22d3ee]/10 p-6">
              <div>
                <h3 className="text-lg font-extrabold text-white">Not sure what you need?</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-200">Describe the problem to our AI assistant and it&apos;ll point you the right way.</p>
              </div>
              <EventButton event={OPEN_CHAT} className="mt-5 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-[#050d1f]">
                Ask the assistant
              </EventButton>
            </StaggerItem>
          </Stagger>
          <Stagger className="relative mx-auto mt-10 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.whyUs.map((w) => (
              <StaggerItem key={w.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300" aria-hidden>
                  <Icon d="M5 12l5 5L20 7" className="h-3.5 w-3.5" />
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

        <CtaBand title={data.lead.bandTitle} body={data.lead.bandBody} ctaLabel={data.lead.cta} phone={PHONE} bg="linear-gradient(120deg, #1e3a8a, #2563eb 55%, #0e7490)" ctaBg="#ffffff" ctaText="#050d1f" />

        {/* 2. AI chat assistant */}
        <section id="ai" className="relative scroll-mt-28 overflow-hidden px-4 py-16 sm:px-6 md:py-24">
          <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-[#2563eb]/20 blur-3xl" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#67e8f9]">AI assistant (demo)</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Answers at 2 a.m., without the hold music</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-slate-300">Our AI assistant answers plumbing questions, spots emergencies and tells you to call, and gathers the details for your quote.</p>
              <ul className="mt-6 space-y-3">
                {["Answers common plumbing questions in plain English", "Triages emergencies and tells you exactly what to shut off", "Collects quote details so a plumber can call you prepared"].map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] text-slate-200">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#22d3ee]/20 text-[#67e8f9]" aria-hidden>
                      <Icon d="M5 12l5 5L20 7" className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <EventButton event={OPEN_CHAT} className="demo-lift mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-extrabold text-[#04101f]" style={{ background: `linear-gradient(90deg, ${C.accent}, #60a5fa)` }}>
                Try the assistant
              </EventButton>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className={`p-5 ${glass} backdrop-blur-xl`} aria-label="Example conversation with the AI assistant">
                <figcaption className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm font-bold text-white">Overpeck Plumbing assistant</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-300">Example</span>
                </figcaption>
                <div className="mt-4 space-y-2.5 text-sm">
                  <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] px-3.5 py-2.5 text-white">Water is pouring from the ceiling under our bathroom!</p>
                  <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2.5 text-slate-100">
                    That&apos;s an emergency. Call {PHONE.display} now. While you wait, shut off the main water valve near your meter and keep away from any outlets near the water.
                  </p>
                  <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] px-3.5 py-2.5 text-white">Done. Calling now, thanks!</p>
                </div>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* 4. gallery: before/after + grid (image-only parallax on the grid) */}
        <section id="gallery" className="scroll-mt-28 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Our work" title="Before and after" sub="Drag the handle to compare. Sample photos for this preview." />
          <div className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-[1.35fr_1fr]">
            <Reveal>
              <BeforeAfter before={PH.before} after={PH.after} className="aspect-[4/3] rounded-3xl border border-white/10" />
            </Reveal>
            <Stagger className="grid grid-cols-2 gap-3">
              {PH.gallery.slice(0, 4).map((ph, i) => (
                <StaggerItem key={i}>
                  <Parallax className="demo-lift aspect-square rounded-2xl border border-white/10 bg-white/5" amount={10}>
                    <DemoImage photo={ph} className="absolute inset-0" sizes="(min-width: 1024px) 20vw, 50vw" />
                  </Parallax>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Stagger className="mx-auto mt-3 grid max-w-6xl grid-cols-2 gap-3">
            {PH.gallery.slice(4).map((ph, i) => (
              <StaggerItem key={i}>
                <Parallax className="demo-lift aspect-[16/9] rounded-2xl border border-white/10 bg-white/5" amount={12}>
                  <DemoImage photo={ph} className="absolute inset-0" sizes="(min-width: 1024px) 50vw, 50vw" />
                </Parallax>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* reviews (sample) */}
        <section id="reviews" className="scroll-mt-28 px-4 py-16 sm:px-6 md:py-24">
          <Head
            eyebrow="Reviews"
            title={
              <>
                What Bergen County says <SampleTag className="align-middle" />
              </>
            }
          >
            <RatingSummary reviews={data.reviews} color="#fbbf24" className="mt-4 text-white" />
          </Head>
          <ReviewGrid reviews={data.reviews} color="#fbbf24" cardClassName="bg-white/[0.05] border-white/10 text-slate-100" />
        </section>

        {/* service area */}
        <section id="area" className="px-4 pb-16 sm:px-6 md:pb-24">
          <Reveal className={`mx-auto grid max-w-6xl items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] ${glass}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#67e8f9]">Service area</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">Plumbers across Bergen County</h2>
              <p className="mt-3 text-slate-300">Don&apos;t see your town? We probably cover it. Call and ask.</p>
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

        {/* FAQ */}
        <section id="faq" className="scroll-mt-28 px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="FAQ" title="Plumbing questions, answered" />
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {data.faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-bold text-white hover:bg-white/[0.04] [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-lg leading-none transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden>
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

        {/* final CTA: same short form + quote flow */}
        <section className="px-4 pb-16 sm:px-6 md:pb-24">
          <div className="relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#0e7490] px-6 py-10 sm:px-12 md:grid-cols-[1fr_minmax(0,25rem)]">
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[#22d3ee]/25 blur-3xl" aria-hidden />
            <Reveal className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{data.lead.finalTitle}</h2>
              <p className="mt-3 max-w-xl text-white/85">{data.lead.finalBody}</p>
              <a href={PHONE.tel} className="demo-lift mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-extrabold text-white" style={{ background: EMERGENCY_BG }}>
                <Icon d={PHONE_D} className="h-4 w-4" />
                Call {PHONE.display}
              </a>
            </Reveal>
            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:p-6">
              <HeroLeadForm slug={data.slug} source="final" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={GLASS} />
            </div>
          </div>
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
              Call {PHONE.display} (24/7)
            </a>
            <LeadJump className="mt-1 block hover:text-white">Request service online</LeadJump>
          </div>
          <div className="text-sm">
            <p className="font-bold text-white">Service area</p>
            <p className="mt-2">All of Bergen County, NJ</p>
            <p className="mt-2">
              Licensed &amp; insured
              <SampleMark className="text-slate-500" />
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-500">
          <p>Overpeck Plumbing is a fictional sample brand by Overpeck Labs.</p>
          <PreviewNote />
        </div>
      </footer>

      <MobileLeadBar phone={PHONE} ctaLabel="Quote" callBg="#1e3a8a" ctaBg={C.accent} ctaText="#04101f" surface="bg-[#050d1f]/85 border-white/10" emergency={{ label: "Emergency", tel: PHONE.tel, bg: EMERGENCY_BG }} />

      <ChatAssistant />

      <ExitIntent slug={data.slug} title="Before you go, get a free quote" sub="Takes 20 seconds. A plumber calls you right back.">
        <LeadForm slug={data.slug} source="exit" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={LIGHT} />
      </ExitIntent>
    </MotionRoot>
  );
}
