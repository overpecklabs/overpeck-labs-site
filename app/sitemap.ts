import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVICE_SLUGS, INDUSTRY_SLUGS, AREA_SLUGS } from "@/lib/slugs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "/",
    "/free-mockup",
    "/services",
    ...SERVICE_SLUGS.map((s) => `/services/${s.slug}`),
    "/industries",
    ...INDUSTRY_SLUGS.map((i) => `/industries/${i.slug}`),
    "/areas",
    ...AREA_SLUGS.map((a) => `/areas/${a.slug}`),
    "/privacy",
    "/terms",
  ];
  return paths.map((p) => ({
    url: `${SITE_URL}${p === "/" ? "" : p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : p.split("/").length === 2 ? 0.8 : 0.7,
  }));
}
