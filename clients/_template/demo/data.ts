import type { DemoData } from "@/lib/demo-types";

/**
 * TEMPLATE: replace every [PLACEHOLDER]. Use only true details about the business:
 * no invented reviews, awards, licenses, years in business or stats.
 */
export const data = {
  slug: "_template", // [PLACEHOLDER] lowercase-hyphen business name, same as the folder name
  businessName: "[PLACEHOLDER Business Name]",
  industry: "[PLACEHOLDER industry, e.g. Plumbing]",
  town: "[PLACEHOLDER town]",
  serviceArea: "[PLACEHOLDER service area, e.g. Hackensack and nearby Bergen County towns]",
  phone: null as DemoData["phone"], // e.g. { display: "(201) 555-0100", tel: "tel:+12015550100" }
  colors: { primary: "#1d4ed8", accent: "#f59e0b", dark: "#0f172a" }, // [PLACEHOLDER] brand colors
  services: [
    { title: "[PLACEHOLDER Service 1]", body: "[PLACEHOLDER one-sentence description]" },
    { title: "[PLACEHOLDER Service 2]", body: "[PLACEHOLDER one-sentence description]" },
    { title: "[PLACEHOLDER Service 3]", body: "[PLACEHOLDER one-sentence description]" },
  ],
  headline: "[PLACEHOLDER hero headline: what they do and where]",
  subhead: "[PLACEHOLDER one supporting sentence]",
  logo: null as string | null, // e.g. "/demos/{slug}/logo.png" (file in assets/, copied to public/demos/{slug}/)
} satisfies DemoData & Record<string, unknown>;
