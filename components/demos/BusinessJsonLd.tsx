import { SITE_URL } from "@/lib/site";
import { averageRating, type RatedReview } from "./rating";

/**
 * LocalBusiness structured data for a FICTIONAL sample business on a demo page. The demo pages are noindex, and
 * the markup says plainly that the business and its rating are samples by Overpeck Labs.
 */
export default function BusinessJsonLd({
  type,
  slug,
  name,
  description,
  phone,
  towns,
  services,
  reviews,
  reviewCount,
}: {
  /** schema.org type, e.g. "Electrician" or "HomeAndConstructionBusiness" */
  type: string;
  slug: string;
  name: string;
  description: string;
  phone: { tel: string };
  towns: string[];
  services: string[];
  reviews: RatedReview[];
  reviewCount: number;
}) {
  const url = `${SITE_URL}/demo/${slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#business`,
    name: `${name} (sample)`,
    description: `Sample business: ${description} This is a fictional business on a sample website by Overpeck Labs; its details and rating are placeholders.`,
    url,
    telephone: phone.tel.replace(/^tel:/, ""),
    address: { "@type": "PostalAddress", addressRegion: "NJ", addressCountry: "US" },
    areaServed: towns.map((t) => ({ "@type": "City", name: `${t}, NJ` })),
    knowsAbout: services,
    aggregateRating: { "@type": "AggregateRating", ratingValue: averageRating(reviews).toFixed(1), reviewCount, bestRating: 5, worstRating: 1 },
    creator: { "@type": "Organization", name: "Overpeck Labs", url: SITE_URL },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />;
}
