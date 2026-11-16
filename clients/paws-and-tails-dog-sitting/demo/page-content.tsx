import { data } from "./data";
import Checklist from "./Checklist";
import { PreviewNote, RatingSummary, ReviewGrid, SampleMark, SampleTag, Stars } from "@/components/demos/sample";
import { averageRating } from "@/components/demos/rating";
import { CtaBand, ExitIntent, LeadForm, LeadJump, MobileLeadBar, type LeadTheme } from "@/components/demos/lead";
import { CountUp, DemoImage, HeroImage, HeroIntro, HeroItem, MotionRoot, Parallax, Reveal, Stagger, StaggerItem, StickyHeader } from "@/components/demos/motion";

/* Paws and Tails (dog sitting) homepage mockup. Display-only: no form sends anything anywhere. */

const C = data.colors;
const PH = data.photos;
const LIGHT: LeadTheme = { tone: "light", primary: C.primary, accent: C.accent, ctaBg: C.primary, ctaText: "#ffffff" };
const GLASS_DARK: LeadTheme = { tone: "dark", primary: C.primary, accent: C.accent, ctaBg: C.accent, ctaText: "#1c1917" };
const RATING = averageRating(data.reviews);

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

function Head({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode }) {
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

export default function PawsAndTails() {
  const phone = data.phone;
  return (
    <MotionRoot className="bg-[#fffaf3] font-sans text-stone-900 antialiased">
      {/* header: sticky under the demo banner, shrinks on scroll */}
      <StickyHeader height={64} shrunk={56} barClassName="bg-[#fffaf3]/90 border-b border-stone-200/70">
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
          <LeadJump className="hover:text-stone-900">Book</LeadJump>
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
        {/* hero: copy + call on the left, short lead form on the right (mobile: headline, form, call) */}
        <section className="relative overflow-hidden">
          {PH.hero && (
            <HeroImage>
              <DemoImage photo={PH.hero} priority sizes="100vw" className="absolute inset-0" imgClassName="object-cover object-[70%_center]" />
            </HeroImage>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[#fffaf3]/85 md:bg-transparent md:bg-[linear-gradient(90deg,#fffaf3_0%,rgba(255,250,243,0.92)_42%,rgba(255,250,243,0.35)_75%,rgba(255,250,243,0.1)_100%)]" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-10 pt-5 sm:px-6 md:grid-cols-[1fr_minmax(0,25rem)] md:items-center md:gap-x-12 md:gap-y-5 md:pb-20 md:pt-14">
            <HeroIntro className="md:col-start-1 md:row-start-1">
              <HeroItem>
                <p className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700 md:inline-flex">
                  <Paw className="h-3.5 w-3.5" fill={C.primary} />
                  {data.town}, NJ
                </p>
                <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:mt-5 lg:text-6xl" style={{ color: C.dark }}>
                  Loving dog sitting in <span style={{ color: C.primary }}>Ridgefield Park</span>
                </h1>
              </HeroItem>
            </HeroIntro>

            <div className="md:col-start-2 md:row-span-3 md:row-start-1">
              <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_30px_60px_-30px_rgba(31,42,36,0.5)] backdrop-blur-xl sm:p-6">
                <LeadForm slug={data.slug} source="hero" anchorId="lead" businessName={data.businessName} title={data.lead.title} ask={data.lead.ask} cta={data.lead.cta} theme={LIGHT} details={data.lead.details} />
              </div>
            </div>

            <div className="md:col-start-1 md:row-start-3">
              <a href={phone.tel} className="demo-lift flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-extrabold text-stone-900 shadow-[0_10px_28px_-10px_rgba(244,162,89,0.9)] md:inline-flex md:w-auto" style={{ background: C.accent }}>
                <Icon d={PHONE_D} className="h-5 w-5" />
                Call {phone.display}
              </a>
              <a href={data.sms} className="mt-3 hidden items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 md:flex">
                <Icon d={TEXT_D} className="h-4 w-4" />
                Prefer texting? Text {phone.display}
              </a>
            </div>

            <div className="md:col-start-1 md:row-start-2">
              <p className="max-w-xl text-lg leading-relaxed text-stone-700">{data.subhead}</p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-stone-700">
                <Stars rating={RATING} color={C.accent} />
                <span>
                  {RATING.toFixed(1)} rating from {data.reviews.length} pet parents
                  <SampleMark className="text-stone-500" />
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* quick facts */}
        <section aria-label="Highlights" className="border-y border-stone-200/70 bg-white">
          <Stagger as="ul" className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-3 text-center sm:px-6 md:grid-cols-4">
            {data.stats.map((st) => (
              <StaggerItem key={st.label} as="li" className="px-2 py-3">
                <span className="block text-2xl font-extrabold" style={{ color: C.primary }}>
                  {"value" in st && st.value !== undefined ? <CountUp to={st.value} /> : st.text}
                  {"sample" in st && st.sample && <SampleMark className="text-stone-500" />}
                </span>
                <span className="text-sm font-semibold text-stone-600">{st.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* services */}
        <section id="services" className="scroll-mt-16 bg-white px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Services" title="Care that fits your dog's routine" sub="Flexible, at-home care for busy days, weekends away and everything in between." />
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
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <CtaBand title={data.lead.bandTitle} body={data.lead.bandBody} ctaLabel={data.lead.cta} phone={data.phone} bg={`linear-gradient(120deg, ${C.primary}, ${C.dark})`} ctaBg={C.accent} ctaText="#1c1917" />

        {/* about + why us */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <Head eyebrow="Why Paws and Tails" title="Why pet parents choose us" sub="Reliable, gentle care from someone local, with your dog's routine at the center of everything." />
          <div className="mx-auto mt-10 grid max-w-6xl items-start gap-8 lg:grid-cols-[1fr_1.15fr]">
            <Reveal>
              <Parallax className="aspect-[4/3] rounded-3xl bg-stone-100">
                <DemoImage photo={PH.about} className="absolute inset-0" sizes="(min-width: 1024px) 40vw, 100vw" />
              </Parallax>
              <h3 className="mt-6 text-2xl font-extrabold" style={{ color: C.dark }}>
                {data.about.title}
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-stone-600">{data.about.body}</p>
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {data.whyUs.map((w) => (
                <StaggerItem key={w.title} className="demo-lift rounded-3xl border border-stone-200 bg-white p-6">
                  <Paw className="h-6 w-6" fill={C.accent} />
                  <h3 className="mt-3 text-lg font-extrabold" style={{ color: C.dark }}>
                    {w.title}
                    {"sample" in w && w.sample && <SampleMark className="text-stone-500" />}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-stone-600">{w.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* how it works */}
          <div className="mx-auto mt-16 max-w-5xl">
            <Reveal as="h3" className="text-center text-2xl font-extrabold" >
              How it works
            </Reveal>
            <Stagger as="ol" className="mt-8 grid gap-4 md:grid-cols-3">
              {data.process.map((st, i) => (
                <StaggerItem key={st.title} as="li" className="demo-lift flex gap-4 rounded-3xl border border-stone-200 bg-white p-6">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white" style={{ background: C.primary }}>
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-bold" style={{ color: C.dark }}>
                      {st.title}
                    </span>
                    <span className="mt-1 block text-[15px] text-stone-600">{st.body}</span>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* gallery */}
        <section id="gallery" className="px-4 pb-16 sm:px-6 md:pb-24">
          <Head eyebrow="Gallery" title="A day in the life" sub="Walks, naps, playtime and plenty of belly rubs." />
          <Stagger className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
            {PH.gallery.map((ph, i) => (
              <StaggerItem key={i}>
                <Parallax className="demo-lift aspect-square rounded-2xl bg-stone-100" amount={8}>
                  <DemoImage photo={ph} className="absolute inset-0" sizes="(min-width: 768px) 25vw, 50vw" />
                </Parallax>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* meet & greet band (replaces the old long booking form) + get-ready checklist */}
        <section id="book" className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
            <Reveal>
              <div className="rounded-3xl px-6 py-8 text-white sm:px-10" style={{ background: `linear-gradient(120deg, ${C.primary}, ${C.dark})` }}>
              <Paw className="h-9 w-9" fill={C.accent} />
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Request a meet &amp; greet</h2>
              <p className="mt-2 text-white/80">Tell us your name, number and what you need. We&apos;ll get back to you to set up a time to meet your dog.</p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <LeadJump className="demo-lift rounded-full px-6 py-3.5 text-center font-extrabold" style={{ background: C.accent, color: "#1c1917" }}>
                  {data.lead.cta}
                </LeadJump>
                <a href={phone.tel} className="rounded-full border-2 border-white/40 px-6 py-3.5 text-center font-bold hover:bg-white/10">
                  Call {phone.display}
                </a>
              </div>
              </div>
            </Reveal>
            <Checklist />
          </div>
        </section>

        {/* reviews (sample) */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <Head
            eyebrow="Reviews"
            title={
              <>
                Happy dogs, happy owners <SampleTag className="ml-1 text-stone-500" />
              </>
            }
          />
          <div className="mt-4 text-center" style={{ color: C.dark }}>
            <RatingSummary reviews={data.reviews} color={C.accent} />
          </div>
          <ReviewGrid reviews={data.reviews} color={C.accent} cardClassName="bg-white border-stone-200 text-stone-700" />
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
              <p className="mt-3 text-[16px] leading-relaxed text-stone-600">
                We care for dogs in Ridgefield Park and nearby towns like {data.areaTowns}
                <SampleMark className="text-stone-500" />. Not sure if you&apos;re in range? Call or text and we&apos;ll let you know.
              </p>
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
            {data.faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group ">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-bold sm:px-6 [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-stone-300 text-lg leading-none transition group-open:rotate-45 motion-reduce:transition-none" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-stone-600 sm:px-6">
                  {f.a}
                  {f.sample && <SampleMark className="text-stone-500" />}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* final CTA: same short form */}
        <section className="px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[2rem] px-6 py-10 text-white sm:px-12 md:grid-cols-[1fr_minmax(0,24rem)]" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
            <Reveal>
              <Paw className="h-10 w-10" fill={C.accent} />
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{data.lead.finalTitle}</h2>
              <p className="mt-3 max-w-xl text-white/80">{data.lead.finalBody}</p>
              <a href={phone.tel} className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 font-bold hover:bg-white/10">
                <Icon d={PHONE_D} className="h-4 w-4" />
                Call {phone.display}
              </a>
            </Reveal>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:p-6">
              <LeadForm slug={data.slug} source="final" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={GLASS_DARK} details={data.lead.details} />
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
            <p className="mt-2 text-sm">{data.footerBlurb}</p>
            <p className="mt-2 text-sm">
              Fully insured
              <SampleMark className="text-white/60" />
            </p>
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
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40">
          <p>© {data.businessName}. All rights reserved.</p>
          <PreviewNote />
        </div>
      </footer>

      {/* sticky mobile bar: appears once the hero form is scrolled past */}
      <MobileLeadBar phone={data.phone} ctaLabel="Check availability" callBg={C.dark} ctaBg={C.accent} ctaText="#1c1917" surface="bg-[#fffaf3]/95 border-stone-200" />

      <ExitIntent slug={data.slug} title="Before you go, check availability" sub="Takes 20 seconds. We'll get back to you to set up a meet & greet.">
        <LeadForm slug={data.slug} source="exit" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={LIGHT} />
      </ExitIntent>
    </MotionRoot>
  );
}
