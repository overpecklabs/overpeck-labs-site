import Link from "next/link";
import { notFound } from "next/navigation";
import { INDUSTRY_PAGES, industryPage } from "@/lib/industries-pages";
import { INDUSTRIES } from "@/lib/industries";
import { areaBySlug, industryBySlug } from "@/lib/slugs";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";
import { pageMeta } from "@/lib/site";
import { Breadcrumbs, ChipLinks, Divider, FaqBlock, HeroBoard, IndexCards, PageShell, Section, SectionHead, ServiceCards } from "@/components/pages/blocks";
import LeadForm from "@/components/LeadForm";
import MockSite from "@/components/MockSite";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return INDUSTRY_PAGES.map((i) => ({ slug: i.slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const i = industryPage(slug);
  if (!i) return {};
  return pageMeta({
    title: `${i.name} Websites & Lead Generation in Bergen County, NJ | Overpeck Labs`,
    description: `Websites, automation, tracking and AI for ${i.pros} in Bergen County, NJ. ${i.intro.split(". ")[0]}.`,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryRoute({ params }: Params) {
  const { slug } = await params;
  const i = industryPage(slug);
  if (!i) notFound();
  const card = INDUSTRIES.find((x) => x.industry === i.mockup);

  return (
    <PageShell>
      <HeroBoard
        kicker={<Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/industries", label: "Industries" }, { label: i.name }]} />}
        h1={`${i.name} Websites & Lead Generation in Bergen County, NJ`}
        sub={i.intro}
        art={
          card && (
            <div className="flex justify-center [perspective:1200px]">
              <div className="relative transition-transform duration-500 [transform:rotateY(-14deg)_rotateX(6deg)] hover:[transform:rotateY(-4deg)_rotateX(2deg)] motion-reduce:[transform:none]">
                <span className="tape" />
                <MockSite d={card} />
                <p className="mt-3 text-center text-xs text-ink/75">Sample design for a fictional business</p>
              </div>
            </div>
          )
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/free-mockup?industry=${slug}`} className="btn-primary">
            Get My Free Mockup
          </Link>
          <a href={`tel:${PHONE_TEL}`} className="btn-ghost">
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </HeroBoard>

      <Section>
        <SectionHead kicker="Sound familiar?" title={`What ${i.pros} deal with every week`} />
        <IndexCards items={i.pains} />
      </Section>

      <Divider />

      <Section className="hex-paper">
        <SectionHead kicker="The Formula, for your trade" title={`How each service helps ${i.pros}`} />
        <ServiceCards lines={{ websites: i.angles.websites, "workflows-automation": i.angles.workflows, "track-optimize": i.angles.tracking, ai: i.angles.ai }} />
      </Section>

      <Section>
        <SectionHead kicker="Built for your trade" title={`Features ${i.pros} actually use`} />
        <IndexCards items={i.features} colors={["#fff8d6", "#e6faf5", "#eaf1ff", "#e9f7ec", "#fff1e6"]} />
      </Section>

      <Divider />

      <Section>
        <SectionHead kicker="FAQ" title={`Questions from ${i.pros}`} />
        <FaqBlock faqs={i.faqs} />
      </Section>

      <Section className="graph-paper">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead kicker="Get started" title={`Let's grow your ${i.name.toLowerCase()} business`} sub="Tell us about your business and we'll follow up with next steps. No obligation." />
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink/80">Related industries</h3>
              <ChipLinks items={i.related.map((r) => ({ href: `/industries/${r}`, label: industryBySlug(r)!.name }))} />
              <h3 className="mt-6 text-sm font-bold uppercase tracking-widest text-ink/80">Areas we serve</h3>
              <ChipLinks items={[...i.areas.map((a) => ({ href: `/areas/${a}`, label: areaBySlug(a)!.name })), { href: "/areas", label: "All areas →" }]} />
            </div>
          </div>
          <LeadForm source={`/industries/${slug}`} defaults={{ industry: industryBySlug(slug)!.name }} title={`${i.name} request`} />
        </div>
      </Section>
    </PageShell>
  );
}
