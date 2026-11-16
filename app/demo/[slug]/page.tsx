import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoViewTrackerLazy from "@/components/demos/DemoViewTrackerLazy";
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
  const title = showcase ? `${demo.businessName} · Sample site by Overpeck Labs` : `${demo.businessName} · Homepage mockup by Overpeck Labs`;
  const description =
    demo.description ?? (showcase ? `${demo.businessName} is a fictional sample site showing what Overpeck Labs can build.` : `Private homepage mockup for ${demo.businessName}.`);
  return {
    title: { absolute: title },
    description,
    // Don't inherit the homepage's canonical / social tags; a demo only gets a social card if it ships its own image.
    alternates: { canonical: null },
    openGraph: demo.ogImage ? { title, description, url: `/demo/${demo.slug}`, type: "website", images: [{ url: demo.ogImage, width: 1200, height: 630, alt: title }] } : null,
    twitter: demo.ogImage ? { card: "summary_large_image", title, description, images: [demo.ogImage] } : null,
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
      <DemoViewTrackerLazy slug={demo.slug} />
      <DemoBanner businessName={demo.businessName} variant={demo.banner} />
      <Site />
    </>
  );
}
