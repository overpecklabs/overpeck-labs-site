"use client";

import { useState } from "react";
import { data } from "./data";
import { CountUp, DemoImage, HeroImage, HeroIntro, HeroItem, MotionRoot, Parallax, Reveal, Stagger, StaggerItem, StickyHeader } from "@/components/demos/motion";
import { PreviewNote, RatingSummary, ReviewGrid, SampleMark, SampleTag, Stars, averageRating } from "@/components/demos/sample";
import { CtaBand, ExitIntent, LeadForm, MobileLeadBar, type LeadTheme } from "@/components/demos/lead";

/*
 * TEMPLATE homepage. Copy this folder to clients/{slug}/ and make it this client's own: restyle it, add
 * sections, and fill data.ts with finished copy. Forms stay display-only (no network calls).
 * The /demo route already adds the "Free homepage mockup" banner, noindex and the view tracker.
 *
 * Finished look: no brackets or "placeholder" text on the page. Unknown facts get <SampleMark />,
 * reviews get one <SampleTag /> on the heading, and the footer has <PreviewNote />.
 * Photos: <DemoImage> (stock photos via `npm run demo-photos`, credits in assets/CREDITS.md).
 * Motion: the shared components from @/components/demos/motion. Parallax is image-only and subtle: the hero
 * photo (<HeroImage>) plus 1-2 photo sections (<Parallax>, fixed aspect box), never reviews or FAQ.
 * Lead capture (@/components/demos/lead): short <LeadForm> above the fold (desktop: right column; mobile:
 * headline, form, call button all on the first 375x667 screen), <CtaBand> after services, the same short form
 * in the final CTA, <MobileLeadBar>, and desktop-only <ExitIntent>. One lead flow only: no long forms further
 * down; any extra CTA is a <CtaBand> / <LeadJump> back to the hero form. Demos never send anything (submitLead()).
 */

export default function DemoHomepage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const c = data.colors;
  const ph = data.photos;
  const glass: LeadTheme = { tone: "dark", primary: c.primary, accent: c.accent, ctaBg: c.accent, ctaText: "#0f172a" };
  const light: LeadTheme = { tone: "light", primary: c.primary, accent: c.accent, ctaBg: c.primary, ctaText: "#ffffff" };
  const rating = averageRating(data.reviews);
  return (
    <MotionRoot className="bg-white text-slate-900 antialiased">
      <StickyHeader height={64} shrunk={56} barClassName="bg-white/90 border-b border-slate-100">
        {data.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logo} alt={data.businessName} className="h-9 w-auto" />
        ) : (
          <span className="text-xl font-extrabold">{data.businessName}</span>
        )}
        {data.phone && (
          <a href={data.phone.tel} className="demo-lift rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: c.dark }}>
            Call {data.phone.display}
          </a>
        )}
      </StickyHeader>

      <main id="top">
        {/* hero: copy + call left, short lead form right (mobile: headline, form, call) */}
        <section className="relative overflow-hidden text-white" style={{ background: c.dark }}>
          {ph.hero && (
            <HeroImage>
              <DemoImage photo={ph.hero} priority sizes="100vw" className="absolute inset-0" />
            </HeroImage>
          )}
          <div className="pointer-events-none absolute inset-0 bg-black/60" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-10 pt-5 sm:px-6 md:grid-cols-[1fr_minmax(0,25rem)] md:items-center md:gap-x-12 md:gap-y-5 md:pb-20 md:pt-14">
            <HeroIntro className="md:col-start-1 md:row-start-1">
              <HeroItem>
                <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{data.headline}</h1>
              </HeroItem>
            </HeroIntro>
            <div className="md:col-start-2 md:row-span-3 md:row-start-1">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
                <LeadForm slug={data.slug} source="hero" anchorId="lead" businessName={data.businessName} title={data.lead.title} ask={data.lead.ask} cta={data.lead.cta} theme={glass} details={data.lead.details} />
              </div>
            </div>
            <div className="md:col-start-1 md:row-start-3">
              {data.phone && (
                <a href={data.phone.tel} className="demo-lift flex w-full items-center justify-center rounded-full border-2 border-white/30 px-7 py-3.5 font-bold md:inline-flex md:w-auto">
                  Call {data.phone.display}
                </a>
              )}
            </div>
            <div className="md:col-start-1 md:row-start-2">
              <p className="text-lg text-white/80">{data.subhead}</p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-white/85">
                <Stars rating={rating} color={c.accent} />
                <span>
                  {rating.toFixed(1)} rating from {data.reviews.length} reviews
                  <SampleMark className="text-white/70" />
                </span>
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Highlights" className="border-b border-slate-100 bg-slate-50">
          <Stagger as="ul" className="mx-auto grid max-w-4xl grid-cols-2 gap-px px-4 py-4 text-center sm:px-6 md:grid-cols-4">
            {data.stats.map((st) => (
              <StaggerItem key={st.label} as="li" className="py-2">
                <span className="block text-2xl font-extrabold" style={{ color: c.primary }}>
                  {st.value !== undefined ? <CountUp to={st.value} suffix={st.suffix ?? ""} /> : st.text}
                  {st.sample && <SampleMark className="text-slate-500" />}
                </span>
                <span className="text-sm text-slate-600">{st.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section id="services" className="px-4 py-16 sm:px-6">
          <Reveal as="h2" className="text-center text-3xl font-extrabold">
            Services
          </Reveal>
          <Stagger className="mx-auto mt-8 grid max-w-6xl gap-4 sm:grid-cols-3">
            {data.services.map((s, i) => (
              <StaggerItem key={s.title} as="article" className="demo-lift overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <DemoImage photo={ph.services[i] ?? null} className="aspect-[4/3]" sizes="(min-width: 640px) 33vw, 100vw" />
                <div className="p-6">
                  <h3 className="text-lg font-bold" style={{ color: c.primary }}>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <CtaBand title={data.lead.bandTitle} body={data.lead.bandBody} ctaLabel={data.lead.cta} phone={data.phone} bg={c.dark} ctaBg={c.accent} ctaText="#0f172a" />

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-6xl items-start gap-8 md:grid-cols-2">
            <Reveal>
              <Parallax className="aspect-[4/3] rounded-3xl bg-slate-100">
                <DemoImage photo={ph.about} className="absolute inset-0" sizes="(min-width: 768px) 50vw, 100vw" />
              </Parallax>
              <h2 className="mt-6 text-2xl font-extrabold">{data.about.title}</h2>
              <p className="mt-3 text-slate-600">{data.about.body}</p>
            </Reveal>
            <Stagger className="grid gap-4">
              {data.whyUs.map((w) => (
                <StaggerItem key={w.title} className="demo-lift rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-lg font-bold">
                    {w.title}
                    {w.sample && <SampleMark className="text-slate-500" />}
                  </h3>
                  <p className="mt-2 text-slate-600">{w.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Stagger as="ol" className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
            {data.process.map((st, i) => (
              <StaggerItem key={st.title} as="li" className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold text-white" style={{ background: c.primary }}>
                  {i + 1}
                </span>
                <span>
                  <span className="block font-bold">{st.title}</span>
                  <span className="block text-sm text-slate-600">{st.body}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section id="gallery" className="bg-slate-50 px-4 py-16 sm:px-6">
          <Reveal as="h2" className="text-center text-3xl font-extrabold">
            Gallery
          </Reveal>
          <Stagger className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
            {ph.gallery.map((g, i) => (
              <StaggerItem key={i}>
                <Parallax className="demo-lift aspect-square rounded-2xl bg-slate-100" amount={8}>
                  <DemoImage photo={g} className="absolute inset-0" sizes="(min-width: 768px) 25vw, 50vw" />
                </Parallax>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <Reveal as="h2" className="text-center text-3xl font-extrabold">
            What customers say <SampleTag className="ml-1 text-slate-500" />
          </Reveal>
          <div className="mt-4 text-center">
            <RatingSummary reviews={data.reviews} color={c.accent} />
          </div>
          <ReviewGrid reviews={data.reviews} color={c.accent} cardClassName="bg-white border-slate-200" />
        </section>

        <section id="faq" className="bg-slate-50 px-4 py-16 sm:px-6">
          <Reveal as="h2" className="text-center text-3xl font-extrabold">
            Frequently asked questions
          </Reveal>
          <div className="mx-auto mt-8 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {data.faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <h3>
                    <button type="button" aria-expanded={open} aria-controls={`tpl-faq-${i}`} onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold">
                      {f.q}
                      <span aria-hidden>{open ? "−" : "+"}</span>
                    </button>
                  </h3>
                  {open && (
                    <p id={`tpl-faq-${i}`} className="px-5 pb-5 text-slate-600">
                      {f.a}
                      {f.sample && <SampleMark className="text-slate-500" />}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-slate-600">{data.areaBlurb}</p>
        </section>

        {/* final CTA: same short form */}
        <section id="quote" className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[2rem] px-6 py-10 text-white sm:px-12 md:grid-cols-[1fr_minmax(0,24rem)]" style={{ background: c.dark }}>
            <Reveal>
              <h2 className="text-3xl font-extrabold">{data.lead.finalTitle}</h2>
              <p className="mt-3 text-white/80">{data.lead.finalBody}</p>
            </Reveal>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:p-6">
              <LeadForm slug={data.slug} source="final" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={glass} details={data.lead.details} />
            </div>
          </div>
        </section>
      </main>

      <footer className="px-4 py-10 text-sm text-white/70 sm:px-6" style={{ background: c.dark }}>
        <div className="mx-auto max-w-6xl">
          <p className="text-lg font-bold text-white">{data.businessName}</p>
          <p className="mt-1">{data.footerBlurb}</p>
          {data.phone && <p className="mt-1">{data.phone.display}</p>}
          <p className="mt-1">{data.serviceArea}</p>
          <div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-4 text-xs text-white/40">
            <p>© {data.businessName}. All rights reserved.</p>
            <PreviewNote />
          </div>
        </div>
      </footer>

      {data.phone && <MobileLeadBar phone={data.phone} ctaLabel="Get quote" callBg={c.dark} ctaBg={c.accent} ctaText="#0f172a" />}
      <ExitIntent slug={data.slug}>
        <LeadForm slug={data.slug} source="exit" businessName={data.businessName} ask={data.lead.ask} cta={data.lead.cta} theme={light} />
      </ExitIntent>
    </MotionRoot>
  );
}
