import type { DemoPhoto } from "@/components/demos/motion/DemoImage";
import type { DetailStep } from "@/components/demos/lead";
import type { Faq, Review } from "@/components/demos/sample";
import type { DemoData } from "@/lib/demo-types";

/**
 * TEMPLATE: replace every [PLACEHOLDER] with finished, specific, local-sounding copy. The demo must look done:
 * no brackets, "TBD" or "placeholder" anywhere on the page.
 *  - Real facts from the client (name, town, phone, services, what they told us) are used as-is.
 *  - Anything we don't know (rates, license, insurance, years, capacity, policies, stats) is written naturally
 *    with typical wording AND flagged `sample: true` so the page shows a tiny <SampleMark />.
 *  - Reviews are sample reviews: the section heading carries one <SampleTag /> and the summary says
 *    "from N sample reviews". Never present sample content as real.
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
  /** Above-the-fold lead capture: 3 fields max (name, phone, one industry question as chips) + action CTA. */
  lead: {
    title: "[PLACEHOLDER e.g. Free quote in 20 seconds]",
    ask: { label: "[PLACEHOLDER e.g. What do you need?]", options: ["[PLACEHOLDER]", "[PLACEHOLDER]", "[PLACEHOLDER]", "Other"] },
    cta: "[PLACEHOLDER action wording, e.g. Get my free quote / Check availability]",
    finalTitle: "[PLACEHOLDER final CTA headline]",
    finalBody: "[PLACEHOLDER one line with a reason to act now]",
    bandTitle: "[PLACEHOLDER mid-page CTA headline]",
    bandBody: "[PLACEHOLDER one line]",
    /** Optional longer multi-step form shown after the short form succeeds ("Add details"). */
    details: [
      { title: "[PLACEHOLDER step]", fields: [{ name: "date", label: "[PLACEHOLDER Date]", type: "date" }] },
      { title: "[PLACEHOLDER step]", fields: [{ name: "notes", label: "[PLACEHOLDER Notes]", type: "textarea", optional: true }, { name: "photos", label: "Photos", type: "photos", optional: true }] },
    ] satisfies DetailStep[],
  },
  headline: "[PLACEHOLDER hero headline: what they do and where]",
  subhead: "[PLACEHOLDER one supporting sentence]",
  /** 3-4 points. Unknown facts get sample: true. */
  whyUs: [
    { title: "[PLACEHOLDER point]", body: "[PLACEHOLDER 1-2 sentences]" },
    { title: "[PLACEHOLDER point]", body: "[PLACEHOLDER 1-2 sentences]", sample: true },
    { title: "[PLACEHOLDER point]", body: "[PLACEHOLDER 1-2 sentences]" },
  ] as { title: string; body: string; sample?: boolean }[],
  about: { title: "[PLACEHOLDER About heading]", body: "[PLACEHOLDER 2-4 sentences about the business, true details only]" },
  /** 3 short steps: how a customer gets started. */
  process: [
    { title: "[PLACEHOLDER step]", body: "[PLACEHOLDER one line]" },
    { title: "[PLACEHOLDER step]", body: "[PLACEHOLDER one line]" },
    { title: "[PLACEHOLDER step]", body: "[PLACEHOLDER one line]" },
  ],
  /** Stats: true numbers, or believable ones flagged sample: true (e.g. "500+ jobs"). */
  stats: [
    { value: 3, label: "[PLACEHOLDER e.g. services]" },
    { value: 500, suffix: "+", label: "[PLACEHOLDER e.g. jobs done]", sample: true },
  ] as { value?: number; suffix?: string; text?: string; label: string; sample?: boolean }[],
  areaBlurb: "[PLACEHOLDER service area sentence naming real nearby towns]",
  ctaTitle: "[PLACEHOLDER closing headline]",
  ctaBody: "[PLACEHOLDER closing line]",
  footerBlurb: "[PLACEHOLDER one-line description]",
  /** 6-8 sample reviews: first name + last initial, Bergen County towns, specific details, varied length, 4-5 stars. */
  reviews: [
    { name: "[PLACEHOLDER Jessica M.]", town: "[PLACEHOLDER Paramus]", rating: 5, service: "[PLACEHOLDER service]", text: "[PLACEHOLDER specific, believable review]" },
  ] satisfies Review[],
  /** 8-10 complete answers. Unknown facts: natural typical wording + sample: true. */
  faqs: [
    { q: "[PLACEHOLDER question]", a: "[PLACEHOLDER answer from real facts]" },
    { q: "[PLACEHOLDER question about rates]", a: "[PLACEHOLDER typical answer]", sample: true },
  ] satisfies Faq[],
  logo: null as string | null, // e.g. "/demos/{slug}/logo.png" (file in assets/, copied to public/demos/{slug}/)
  /**
   * [PLACEHOLDER] Stock photos, e.g. { src: "/demos/{slug}/hero.webp", alt: "Plumber's tools on a workbench" }.
   * Download with `npm run demo-photos` (see clients/README.md). null shows a "Photo coming soon" panel.
   */
  photos: {
    hero: null as DemoPhoto,
    services: [null, null, null] as DemoPhoto[],
    gallery: [null, null, null, null] as DemoPhoto[],
    about: null as DemoPhoto,
  },
} satisfies DemoData & Record<string, unknown>;
