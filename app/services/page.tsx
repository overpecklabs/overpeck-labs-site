import Link from "next/link";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { SERVICE_SLUGS } from "@/lib/slugs";
import { pageMeta } from "@/lib/site";
import { Breadcrumbs, HeroBoard, PageShell, Section, SectionHead } from "@/components/pages/blocks";
import ElementBadge from "@/components/ElementBadge";

export const metadata = pageMeta({
  title: "Services: Websites, Automation, Tracking & AI in Bergen County, NJ | Overpeck Labs",
  description: "The Formula: custom websites, workflow automation, lead tracking and AI receptionists for Bergen County, NJ small businesses. Use one, or combine all four.",
  path: "/services",
});

export default function ServicesHub() {
  return (
    <PageShell>
      <HeroBoard
        kicker={<Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Services" }]} />}
        h1="The Formula: four elements that grow a local business."
        sub="Start with a website that brings in calls, then automate the follow-up, measure what works and let AI catch what you miss. Use one, or combine all four."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/free-mockup" className="btn-primary">
            Get My Free Mockup
          </Link>
          <a href="#services-list" className="btn-ghost">
            Explore the services
          </a>
        </div>
      </HeroBoard>

      <Section id="services-list">
        <SectionHead kicker="The elements" title="Pick an element to learn more" />
        <ul className="mt-10 grid gap-7 md:grid-cols-2">
          {SERVICE_PAGES.map((s, i) => {
            const m = SERVICE_SLUGS.find((x) => x.slug === s.slug)!;
            return (
              <li key={s.slug}>
                <article className={`element-tile flex h-full flex-col p-6 shadow-[0_12px_28px_rgba(26,26,26,0.09)] ${i % 2 ? "tilt-r" : "tilt-l"}`} style={{ background: `linear-gradient(180deg, ${m.color} 0 120px, #fffefb 120px)` }}>
                  <div className="flex items-center gap-4">
                    <ElementBadge num={String(i + 1).padStart(2, "0")} symbol={m.sym} name={m.name.split(" ")[0]} bg="#fffefb" size="lg" />
                    <div>
                      <h2 className="font-display text-2xl font-bold text-ink">{m.name}</h2>
                      <p className="text-sm font-semibold text-ink/80">{m.full}</p>
                    </div>
                  </div>
                  <p className="font-display mt-8 text-lg font-bold text-ink">{s.promise}</p>
                  <ul className="mt-3 flex-1 space-y-1.5 text-[15px] text-ink/85">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span aria-hidden className="text-teal-ink">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${s.slug}`} className="btn-ghost mt-6 self-start !py-2.5 text-sm">
                    Learn more about {m.name}
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>

        <p className="paper mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-md px-5 py-5 text-center text-lg font-semibold text-ink">
          <span>Website</span>
          <span aria-hidden className="text-ink/70">+</span>
          <span>Workflows</span>
          <span aria-hidden className="text-ink/70">+</span>
          <span>Tracking</span>
          <span aria-hidden className="text-ink/70">+</span>
          <span>AI</span>
          <span className="sr-only">equals</span>
          <span aria-hidden>→</span>
          <span className="marker-underline font-display text-xl font-bold">More booked jobs</span>
        </p>
      </Section>
    </PageShell>
  );
}
