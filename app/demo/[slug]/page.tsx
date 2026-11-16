import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoViewTracker from "@/components/demos/DemoViewTracker";
import { DEMOS, demoBySlug } from "@/lib/demos";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEMOS.map((d) => ({ slug: d.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const demo = demoBySlug((await params).slug);
  if (!demo) return {};
  const showcase = demo.banner === "showcase";
  return {
    title: { absolute: showcase ? `${demo.businessName} · Sample site by Overpeck Labs` : `${demo.businessName} · Homepage mockup by Overpeck Labs` },
    description: showcase ? `${demo.businessName} is a fictional sample site showing what Overpeck Labs can build.` : `Private homepage mockup for ${demo.businessName}.`,
    // Don't inherit the homepage's canonical / social tags.
    alternates: { canonical: null },
    openGraph: null,
    twitter: null,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    ...(demo.icon ? { icons: { icon: demo.icon } } : {}),
  };
}

export default async function DemoPage({ params }: Props) {
  const demo = demoBySlug((await params).slug);
  if (!demo) notFound();
  const { default: Site } = await demo.load();
  return (
    <>
      <DemoViewTracker slug={demo.slug} />
      <DemoBanner businessName={demo.businessName} variant={demo.banner} />
      <Site />
    </>
  );
}
