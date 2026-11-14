import type { Metadata } from "next";

/** Absolute site URL for canonicals, Open Graph and the sitemap. Set NEXT_PUBLIC_SITE_URL per environment. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://overpeck-labs-site.vercel.app").replace(/\/+$/, "");
export const SITE_NAME = "Overpeck Labs";

/** Unique title + description + canonical + Open Graph for a page. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: "website", locale: "en_US" },
    twitter: { card: "summary", title, description },
  };
}
