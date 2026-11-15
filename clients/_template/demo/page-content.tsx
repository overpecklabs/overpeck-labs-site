"use client";

import { useState } from "react";
import { data } from "./data";
import { CountUp, DemoImage, HeroImage, HeroIntro, HeroItem, MotionRoot, Reveal, Stagger, StaggerItem, StickyHeader } from "@/components/demos/motion";

/*
 * TEMPLATE homepage. Copy this folder to clients/{slug}/ and make it this client's own:
 * restyle it, add sections, swap the placeholders. Forms stay display-only (no network calls).
 * The /demo route already adds the "Free homepage mockup" banner, noindex and the view tracker.
 *
 * Photos: every image goes through <DemoImage> (next/image + "Placeholder photo" tag). Fill data.photos
 * with stock photos downloaded via `npm run demo-photos` (credits land in assets/CREDITS.md).
 * Motion: use the shared components from @/components/demos/motion (see that file's header).
 */

const DEMO_MSG = "Demo only, this form isn't connected yet.";

export default function DemoHomepage() {
  const [sent, setSent] = useState(false);
  const c = data.colors;
  const ph = data.photos;
  return (
    <MotionRoot className="bg-white text-slate-900 antialiased">
      <StickyHeader barClassName="bg-white/90 border-b border-slate-100">
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
        <section className="relative overflow-hidden px-4 py-20 text-white sm:px-6 md:py-28" style={{ background: c.dark }}>
          {ph.hero && (
            <HeroImage>
              <DemoImage photo={ph.hero} priority sizes="100vw" className="absolute inset-0" />
            </HeroImage>
          )}
          <div className="pointer-events-none absolute inset-0 bg-black/55" aria-hidden />
          <HeroIntro className="relative mx-auto max-w-3xl text-center">
            <HeroItem>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{data.headline}</h1>
            </HeroItem>
            <HeroItem>
              <p className="mt-4 text-lg text-white/80">{data.subhead}</p>
            </HeroItem>
            <HeroItem>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                {data.phone && (
                  <a href={data.phone.tel} className="demo-lift rounded-full px-7 py-4 font-extrabold text-slate-900" style={{ background: c.accent }}>
                    Call {data.phone.display}
                  </a>
                )}
                <a href="#quote" className="demo-lift rounded-full border-2 border-white/30 px-7 py-4 font-bold">
                  Get a free quote
                </a>
              </div>
            </HeroItem>
          </HeroIntro>
        </section>

        {/* Count-up stats: TRUE numbers only (e.g. number of services). Never invent stats. */}
        <section aria-label="Highlights" className="border-b border-slate-100 bg-slate-50">
          <Stagger as="ul" className="mx-auto grid max-w-4xl grid-cols-2 gap-px px-4 py-4 text-center sm:px-6">
            <StaggerItem as="li" className="py-2">
              <span className="block text-2xl font-extrabold" style={{ color: c.primary }}>
                <CountUp to={data.services.length} />
              </span>
              <span className="text-sm text-slate-600">services</span>
            </StaggerItem>
            <StaggerItem as="li" className="py-2">
              <span className="block text-2xl font-extrabold" style={{ color: c.primary }}>
                {data.town}
              </span>
              <span className="text-sm text-slate-600">based</span>
            </StaggerItem>
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

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-2">
            <Reveal>
              <DemoImage photo={ph.about} className="aspect-[4/3] rounded-3xl" sizes="(min-width: 768px) 50vw, 100vw" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl font-extrabold">Why choose us</h2>
              <p className="mt-3 text-slate-600">[PLACEHOLDER] What really sets this business apart (true details only).</p>
            </Reveal>
          </div>
        </section>

        <section id="gallery" className="bg-slate-50 px-4 py-16 sm:px-6">
          <Reveal as="h2" className="text-center text-3xl font-extrabold">
            Gallery
          </Reveal>
          <Stagger className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
            {ph.gallery.map((g, i) => (
              <StaggerItem key={i}>
                <DemoImage photo={g} className="demo-lift aspect-square rounded-2xl" sizes="(min-width: 768px) 25vw, 50vw" />
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <Reveal as="h2" className="text-center text-3xl font-extrabold">
            Sample reviews (placeholder)
          </Reveal>
          <p className="mt-2 text-center text-slate-500">[PLACEHOLDER] These are placeholders, not real reviews.</p>
        </section>

        <section id="quote" className="px-4 py-16 sm:px-6">
          <Reveal>
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
              <button type="submit" className="demo-lift rounded-full px-6 py-4 font-bold text-white" style={{ background: c.primary }}>
                Request my quote
              </button>
              {sent && (
                <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                  {DEMO_MSG}
                </p>
              )}
            </form>
          </Reveal>
        </section>
      </main>

      <footer className="px-4 py-10 text-sm text-white/70 sm:px-6" style={{ background: c.dark }}>
        <div className="mx-auto max-w-6xl">
          <p className="text-lg font-bold text-white">{data.businessName}</p>
          {data.phone && <p className="mt-1">{data.phone.display}</p>}
          <p className="mt-1">{data.serviceArea}</p>
        </div>
      </footer>
    </MotionRoot>
  );
}
