import Link from "next/link";
import { notFound } from "next/navigation";
import { AREAS, areaPage } from "@/lib/areas";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { areaBySlug, industryBySlug } from "@/lib/slugs";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";
import { pageMeta } from "@/lib/site";
import { Breadcrumbs, ChipLinks, Divider, FaqBlock, HeroBoard, IndexCards, PageShell, Section, SectionHead, ServiceCards } from "@/components/pages/blocks";
import TownMap from "@/components/pages/TownMap";
import LeadForm from "@/components/LeadForm";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const a = areaPage(slug);
  if (!a) return {};
  return pageMeta({
    title: `Websites, Automation & AI for ${a.name}, NJ Businesses | Overpeck Labs`,
    description: `Custom websites, workflow automation, lead tracking and AI receptionists for businesses in ${a.name}, ${a.county}, NJ. ${a.details[0]}.`,
    path: `/areas/${slug}`,
  });
}

export default async function AreaRoute({ params }: Params) {
  const { slug } = await params;
  const a = areaPage(slug);
  if (!a) notFound();
  const promises = Object.fromEntries(SERVICE_PAGES.map((s) => [s.slug, s.promise]));

  return (
    <PageShell>
      <HeroBoard
        kicker={<Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/areas", label: "Areas" }, { label: `${a.name}, NJ` }]} />}
        h1={`Websites, Automation & AI for ${a.name}, NJ Businesses`}
        sub={a.intro}
        art={
          <div className="paper tilt-r relative mx-auto max-w-md rounded-md p-3">
            <span className="tape" />
            <TownMap name={a.name} corridors={a.corridors} seed={AREAS.indexOf(a)} />
          </div>
        }
      >
        <ul className="mt-5 flex flex-wrap gap-2 text-sm text-ink/85">
          {a.details.map((d) => (
            <li key={d} className="rounded-full border border-ink/15 bg-white/80 px-3 py-1">
              {d}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/free-mockup" className="btn-primary">
            Get My Free Mockup
          </Link>
          <a href="#lead-form" className="btn-ghost">
            Get a Free Consultation
          </a>
        </div>
      </HeroBoard>

      <Section>
        <SectionHead kicker={`Doing business in ${a.name}`} title={`Why ${a.name} businesses need a strong online presence`} />
        <IndexCards items={a.points} />
        <p className="mt-8 text-sm text-ink/85">
          We also work with businesses in nearby {a.neighbors.slice(0, -1).join(", ")} and {a.neighbors[a.neighbors.length - 1]}.
        </p>
      </Section>

      <Divider />

      <Section className="hex-paper">
        <SectionHead kicker="The Formula" title={`Four ways we help ${a.name} businesses grow`} />
        <ServiceCards lines={promises} />
      </Section>

      <Section>
        <SectionHead kicker="Industries" title={`Industries we serve in ${a.name}`} sub="Every trade has its own needs. See how we help yours." />
        <ChipLinks items={[...a.industries.map((i) => ({ href: `/industries/${i}`, label: industryBySlug(i)!.name })), { href: "/industries", label: "All industries →" }]} />
      </Section>

      <Divider />

      <Section>
        <SectionHead kicker="FAQ" title={`${a.name} business owners ask`} />
        <FaqBlock faqs={a.faqs} />
      </Section>

      <Section className="graph-paper">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead kicker="Get started" title={`Work with a Bergen County team in ${a.name}`} sub="Tell us about your business and we'll follow up with next steps. No obligation." />
            <a href={`tel:${PHONE_TEL}`} className="mt-6 inline-flex font-semibold text-ink hover:text-teal-ink">
              Prefer to talk? Call {PHONE_DISPLAY}
            </a>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-ink/80">Nearby areas</h3>
            <ChipLinks items={[...a.nearby.map((n) => ({ href: `/areas/${n}`, label: areaBySlug(n)!.name })), { href: "/areas", label: "All areas →" }]} />
          </div>
          <LeadForm source={`/areas/${slug}`} defaults={{ town: a.name }} title={`Request for ${a.name} businesses`} />
        </div>
      </Section>
    </PageShell>
  );
}
