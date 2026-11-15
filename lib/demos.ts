import type { ComponentType } from "react";

/**
 * Private homepage mockups, served at /demo/[slug]. Not linked anywhere, noindex, and kept out of
 * the sitemap: share the URL directly with the business.
 *
 * To add a demo:
 *   1. Build the page as its own component in components/demos/<slug>.tsx (default export).
 *   2. Add an entry below. The slug is the business name, lowercase and hyphenated
 *      ("Mains and drains" -> "mains-and-drains"); demoSlug() does this for you.
 *   3. If the mockup was ever shared at another URL, add it to LEGACY_DEMO_REDIRECTS in
 *      next.config.mjs so that link permanently (308) redirects here.
 */
export type Demo = {
  slug: string;
  businessName: string;
  /** Lazy so each demo's code only loads on its own page. */
  load: () => Promise<{ default: ComponentType }>;
};

export const DEMOS: Demo[] = [
  // { slug: "mains-and-drains", businessName: "Mains and Drains", load: () => import("@/components/demos/mains-and-drains") },
];

export const demoBySlug = (slug: string) => DEMOS.find((d) => d.slug === slug);

/** "Mains and drains" -> "mains-and-drains" */
export function demoSlug(businessName: string): string {
  return businessName
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
