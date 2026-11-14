import Link from "next/link";
import { INDUSTRY_PAGES } from "@/lib/industries-pages";
import { pageMeta } from "@/lib/site";
import { Breadcrumbs, HeroBoard, PageShell, Section, SectionHead } from "@/components/pages/blocks";

export const metadata = pageMeta({
  title: "Industries We Serve in Bergen County, NJ | Overpeck Labs",
  description: "Websites, automation, tracking and AI built for Bergen County, NJ plumbers, HVAC companies, electricians, roofers, landscapers, contractors, cleaners, auto shops, salons, restaurants, dentists and real estate agents.",
  path: "/industries",
});

const COLORS = ["#fff8d6", "#e6faf5", "#eaf1ff", "#e9f7ec", "#fff1e6", "#f4f0ff"];

export default function IndustriesHub() {
  return (
    <PageShell>
      <HeroBoard
        kicker={<Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Industries" }]} />}
        h1="Built for the trades and local businesses of Bergen County."
        sub="Every industry wins customers differently. Pick yours to see the problems we solve, the features that matter and how The Formula fits."
      >
        <div className="mt-8">
          <Link href="/free-mockup" className="btn-primary">
            Get My Free Mockup
          </Link>
        </div>
      </HeroBoard>
      <Section>
        <SectionHead kicker="Industries" title="Choose your industry" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRY_PAGES.map((i, n) => (
            <li key={i.slug}>
              <Link
                href={`/industries/${i.slug}`}
                className={`relative flex h-full flex-col rounded-[4px] border border-ink/10 p-5 shadow-[0_2px_3px_rgba(26,26,26,0.05),0_12px_26px_rgba(26,26,26,0.08)] transition hover:-translate-y-1 ${n % 2 ? "tilt-r" : "tilt-l"}`}
                style={{ background: COLORS[n % COLORS.length] }}
              >
                <h2 className="font-display text-xl font-bold text-ink">{i.name}</h2>
                <p className="mt-2 flex-1 text-[15px] text-ink/85">{i.intro}</p>
                <span className="mt-4 text-sm font-semibold text-teal-ink">See how we help {i.pros} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
