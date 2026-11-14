import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICE_PAGES, servicePage } from "@/lib/service-pages";
import { SERVICE_SLUGS, industryBySlug, areaBySlug, serviceBySlug } from "@/lib/slugs";
import { INDUSTRIES } from "@/lib/industries";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";
import { pageMeta } from "@/lib/site";
import { Breadcrumbs, ChipLinks, Divider, FaqBlock, HeroBoard, IndexCards, PageShell, Section, SectionHead, ServiceCards, Steps } from "@/components/pages/blocks";
import ServiceDoodle from "@/components/pages/ServiceDoodle";
import WorkflowDemo from "@/components/pages/WorkflowDemo";
import LeadForm from "@/components/LeadForm";
import MockSite from "@/components/MockSite";
import TrackingDashboard from "@/components/TrackingDashboard";
import ChatDemo from "@/components/ChatDemo";
import ReceptionistDemo from "@/components/ReceptionistDemo";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const s = servicePage(slug);
  return s ? pageMeta({ title: s.title, description: s.description, path: `/services/${slug}` }) : {};
}

const PALETTE = ["#fff8d6", "#e6faf5", "#eaf1ff", "#e9f7ec", "#fff1e6", "#f4f0ff"];

export default async function ServicePageRoute({ params }: Params) {
  const { slug } = await params;
  const s = servicePage(slug);
  const meta = serviceBySlug(slug);
  if (!s || !meta) notFound();
  const idx = SERVICE_SLUGS.findIndex((x) => x.slug === slug);
  const num = String(idx + 1).padStart(2, "0");

  return (
    <PageShell>
      <HeroBoard
        kicker={<Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }, { label: meta.name }]} />}
        h1={s.h1}
        sub={s.sub}
        art={<ServiceDoodle slug={slug} num={num} sym={meta.sym} name={meta.name.split(" ")[0]} bg={meta.color} />}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={s.cta.href} className="btn-primary">
            {s.cta.label}
          </Link>
          <a href={`tel:${PHONE_TEL}`} className="btn-ghost">
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </HeroBoard>

      <Section>
        <SectionHead kicker="The problem" title="What Bergen County businesses tell us" />
        <IndexCards items={s.problems} colors={["#fffefb"]} />
      </Section>

      <Divider />

      <Section>
        <SectionHead kicker="What's included" title={`What you get with ${meta.name}`} />
        <IndexCards items={s.included} colors={PALETTE} />
      </Section>

      {s.subServices && (
        <Section className="pt-0">
          <SectionHead kicker="Three ways AI helps" title="AI Chatbot, AI Call Receptionist and AI Agents" />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {s.subServices.map((sub, i) => (
              <article key={sub.name} id={sub.name.toLowerCase().replace(/\s+/g, "-")} className={`paper scroll-mt-24 rounded-md p-6 ${i % 2 ? "tilt-r" : "tilt-l"}`}>
                <h3 className="font-display text-xl font-bold text-ink">{sub.name}</h3>
                <p className="mt-2 text-[15px] text-ink/85">{sub.d}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink/90">
                  {sub.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden className="text-teal-ink">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>
      )}

      <Divider />

      <Section className="graph-paper">
        <SectionHead kicker="How it works" title={`${meta.name}: how it works`} />
        <Steps steps={s.steps} />
      </Section>

      <Section>
        <SectionHead kicker="See it in action" title="A quick look" sub="Everything below is a sample or demo for illustration, not a real client." />
        <div className="mt-10">
          {s.demo === "sites" && (
            <div className="flex flex-wrap justify-center gap-10">
              {["Plumbing", "Landscaping"].map((ind, i) => {
                const d = INDUSTRIES.find((x) => x.industry === ind)!;
                return (
                  <div key={ind} className="relative" style={{ rotate: i ? "1.5deg" : "-1.5deg" }}>
                    <span className="tape" />
                    <MockSite d={d} />
                  </div>
                );
              })}
            </div>
          )}
          {s.demo === "workflow" && (
            <div className="mx-auto max-w-3xl">
              <WorkflowDemo />
            </div>
          )}
          {s.demo === "dashboard" && (
            <div className="mx-auto max-w-3xl">
              <TrackingDashboard standalone />
            </div>
          )}
          {s.demo === "ai" && (
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-stretch">
              <div className="h-[460px] w-full max-w-sm">
                <ChatDemo standalone className="h-full" />
              </div>
              <div className="h-[460px]">
                <ReceptionistDemo standalone className="h-full" />
              </div>
            </div>
          )}
        </div>
      </Section>

      <Divider />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead kicker="Best for" title="Trades we build this for" />
            <ChipLinks items={s.bestFor.map((i) => ({ href: `/industries/${i}`, label: industryBySlug(i)!.name }))} />
            <p className="mt-6 text-sm text-ink/80">
              Serving businesses across Bergen County, including{" "}
              {s.topAreas.map((a, i) => (
                <span key={a}>
                  <Link href={`/areas/${a}`} className="font-semibold text-teal-ink underline">
                    {areaBySlug(a)!.name}
                  </Link>
                  {i < s.topAreas.length - 1 ? ", " : ""}
                </span>
              ))}{" "}
              and <Link href="/areas" className="font-semibold text-teal-ink underline">more towns</Link>.
            </p>
          </div>
          <div>
            <SectionHead kicker="Pricing" title={s.pricing === "website" ? "Start free, then launch" : "Custom quote"} />
            {s.pricing === "website" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[4px] border border-ink/10 bg-[#fff6b8] p-5 shadow-[0_10px_22px_rgba(26,26,26,0.08)]">
                  <div className="text-xs font-bold uppercase tracking-widest text-ink/80">Free Mockup</div>
                  <div className="font-display mt-1 text-3xl font-bold text-ink">Free</div>
                  <p className="mt-1 text-sm text-ink/85">A custom homepage design, no obligation.</p>
                  <Link href="/free-mockup" className="btn-primary mt-4 !py-2.5 text-sm">
                    Get My Free Mockup
                  </Link>
                </div>
                <div className="rounded-[4px] border-[3px] border-[#0f766e] bg-[#c8f5ec] p-5 shadow-[0_10px_22px_rgba(26,26,26,0.08)]">
                  <div className="text-xs font-bold uppercase tracking-widest text-ink/80">Launch</div>
                  <div className="font-display mt-1 text-3xl font-bold text-ink">$500</div>
                  <div className="text-sm font-semibold text-ink/85">+ $50/month</div>
                  <p className="mt-1 text-sm text-ink/85">Site, hosting, SSL, basic SEO, lead form and small monthly edits.</p>
                  <Link href="/#pricing" className="mt-3 inline-block text-sm font-semibold text-teal-ink underline">
                    See all plans
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[4px] border border-ink/10 bg-[#dbe8ff] p-5 shadow-[0_10px_22px_rgba(26,26,26,0.08)]">
                <p className="text-ink/90">
                  {meta.name} is part of our <strong>Growth</strong> and <strong>Operator</strong> plans, quoted to fit your business.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="#lead-form" className="btn-primary !py-2.5 text-sm">
                    Book a call
                  </a>
                  <Link href="/#pricing" className="btn-ghost !py-2.5 text-sm">
                    See all plans
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section className="hex-paper">
        <SectionHead kicker="How it fits The Formula" title="Even better together" sub="Each element builds on the others. Here's how this one connects." />
        <ServiceCards exclude={slug} lines={Object.fromEntries(s.connects.map((c) => [c.slug, c.why]))} />
      </Section>

      <Section>
        <SectionHead kicker="FAQ" title={`${meta.name}: common questions`} />
        <FaqBlock faqs={s.faqs} />
      </Section>

      <Divider />

      <Section id="contact-form">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead kicker="Get started" title={slug === "websites" ? "Ready for a site that brings in calls?" : "Let's talk about your business"} sub="Tell us a bit about your business and we'll follow up with next steps. No obligation." />
            <a href={`tel:${PHONE_TEL}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-ink hover:text-teal-ink">
              Prefer to talk? Call {PHONE_DISPLAY}
            </a>
          </div>
          <LeadForm source={`/services/${slug}`} service={meta.name} questions={s.questions} title={`${meta.name} request`} />
        </div>
      </Section>
    </PageShell>
  );
}
