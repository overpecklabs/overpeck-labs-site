/**
 * Registry of private homepage mockups, served at /demo/[slug] by app/demo/[slug]/page.tsx.
 * Real client demos live in clients/{slug}/ (see clients/README.md); our own flagship sample companies live
 * in flagships/{slug}/ (see flagships/README.md). Both are served the same way.
 * Not linked anywhere, noindex, and kept out of the sitemap: share the URL directly.
 *
 * To add a demo: copy clients/_template to clients/{slug} (or flagships/{slug}), fill it in, then import its
 * index.ts here and add it to DEMOS. Old URLs go in LEGACY_DEMO_REDIRECTS in next.config.mjs.
 */
import partyBus360 from "@/clients/party-bus-360";
import pawsAndTailsDogSitting from "@/clients/paws-and-tails-dog-sitting";
import overpeckPlumbing from "@/flagships/overpeck-plumbing";
import type { Demo } from "./demo-types";

export type { Demo, DemoData } from "./demo-types";

export const DEMOS: Demo[] = [
  partyBus360,
  pawsAndTailsDogSitting,
  overpeckPlumbing,
];

export const demoBySlug = (slug: string) => DEMOS.find((d) => d.slug === slug);

/** Longest slug for a demo URL. */
export const MAX_DEMO_SLUG = 30;
/**
 * Longest slug that keeps the Vercel branch preview host
 * "overpeck-labs-site-git-demo-{slug}-markqsai-8173" within DNS's 63-character label limit.
 */
export const MAX_BRANCH_SLUG = 63 - "overpeck-labs-site-git-demo-".length - "-markqsai-8173".length; // 21

/** Shortens a slug to at most `max` characters, cutting at a hyphen (word boundary) when possible. */
export function capSlug(slug: string, max: number): string {
  if (slug.length <= max) return slug;
  let out = "";
  for (const word of slug.split("-")) {
    const next = out ? `${out}-${word}` : word;
    if (next.length > max) break;
    out = next;
  }
  return out || slug.slice(0, max).replace(/-+$/, "");
}

/**
 * "Mains and drains" -> "mains-and-drains"; "Paws and Tails (dog sitting)" -> "paws-and-tails".
 * Text in parentheses is dropped and the result is capped at MAX_DEMO_SLUG characters on a word boundary.
 */
export function demoSlug(businessName: string): string {
  const base = businessName.replace(/\([^)]*\)/g, " ").trim() || businessName;
  return capSlug(slugify(base), MAX_DEMO_SLUG);
}

function slugify(businessName: string): string {
  return businessName
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
