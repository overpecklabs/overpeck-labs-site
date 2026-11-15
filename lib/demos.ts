/**
 * Registry of private homepage mockups, served at /demo/[slug] by app/demo/[slug]/page.tsx.
 * Each client lives in its own folder: clients/{slug}/ (see clients/README.md).
 * Not linked anywhere, noindex, and kept out of the sitemap: share the URL directly.
 *
 * To add a client: copy clients/_template to clients/{slug}, fill it in, then import its
 * index.ts here and add it to DEMOS. Old URLs go in LEGACY_DEMO_REDIRECTS in next.config.mjs.
 */
import type { Demo } from "./demo-types";

export type { Demo, DemoData } from "./demo-types";

export const DEMOS: Demo[] = [
  // e.g. import mainsAndDrains from "@/clients/mains-and-drains"; then list mainsAndDrains here
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
