import Link from "next/link";
import { AREAS } from "@/lib/areas";
import { pageMeta } from "@/lib/site";
import { Breadcrumbs, HeroBoard, PageShell, Section, SectionHead } from "@/components/pages/blocks";
import TownMap from "@/components/pages/TownMap";

export const metadata = pageMeta({
  title: "Areas We Serve in Bergen County, NJ | Overpeck Labs",
  description: "Websites, automation, tracking and AI for businesses in Hackensack, Paramus, Fort Lee, Englewood, Teaneck, Fair Lawn, Ridgewood, Mahwah and across Bergen County, NJ.",
  path: "/areas",
});

export default function AreasHub() {
  return (
    <PageShell>
      <HeroBoard
        kicker={<Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Areas" }]} />}
        h1="Serving businesses across Bergen County, NJ."
        sub="From the county seat in Hackensack to Mahwah at the New York line, we help local businesses get found, follow up and grow."
        art={
          <div className="paper tilt-r relative mx-auto max-w-md rounded-md p-3">
            <span className="tape" />
            <TownMap name="Bergen County" corridors={["Route 4", "Route 17", "I-80"]} seed={11} />
          </div>
        }
      >
        <div className="mt-8">
          <Link href="/free-mockup" className="btn-primary">
            Get My Free Mockup
          </Link>
        </div>
      </HeroBoard>
      <Section>
        <SectionHead kicker="Areas" title="Choose your town" sub="Don't see your town? We work with businesses throughout Bergen County and nearby." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a, n) => (
            <li key={a.slug}>
              <Link href={`/areas/${a.slug}`} className={`paper flex h-full flex-col rounded-md p-5 transition hover:-translate-y-1 ${n % 2 ? "tilt-r" : "tilt-l"}`}>
                <h2 className="font-display text-xl font-bold text-ink">{a.name}, NJ</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/75">{a.county}</p>
                <p className="mt-3 flex-1 text-[15px] text-ink/85">{a.details[0]}.</p>
                <span className="mt-4 text-sm font-semibold text-teal-ink">Businesses in {a.name} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
