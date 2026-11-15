import type { DemoData } from "@/lib/demo-types";

/**
 * Paws and Tails (dog sitting). True details only: name, Ridgefield Park, phone.
 * Services are typical for dog sitting and labeled as suggested on the page.
 */
export const data = {
  slug: "paws-and-tails-dog-sitting",
  businessName: "Paws and Tails (dog sitting)",
  /** Header text logo: the name, with "Dog sitting" as a tagline. */
  logoName: "Paws and Tails",
  logoTagline: "Dog sitting",
  industry: "Dog sitting",
  town: "Ridgefield Park",
  serviceArea: "Ridgefield Park, NJ and nearby Bergen County towns",
  phone: { display: "(201) 754-4285", tel: "tel:+12017544285" },
  sms: "sms:+12017544285",
  colors: { primary: "#2f6f4f", accent: "#f4a259", dark: "#1f2a24" },
  services: [
    { title: "Dog walking", body: "Regular walks to keep your dog happy, healthy and tired out while you're at work or busy." },
    { title: "Drop-in visits", body: "Short home visits for potty breaks, fresh water, feeding and some company." },
    { title: "Overnight sitting", body: "Care in your own home overnight, so your dog keeps their routine while you're away." },
    { title: "Puppy & senior care", body: "Extra-frequent breaks, feeding schedules and gentle attention for young and older dogs." },
  ],
  headline: "Loving dog sitting in Ridgefield Park",
  subhead: "Walks, drop-in visits and overnight care, so your dog stays happy at home while you're away.",
  logo: null as string | null,
  faqs: [
    { q: "Which areas do you cover?", a: "Ridgefield Park, NJ and nearby Bergen County towns. Call or text to check your street." },
    { q: "Can we meet before the first booking?", a: "[Placeholder: describe your meet-and-greet process.]" },
    { q: "Do you take care of more than one dog?", a: "[Placeholder: add your policy for multiple dogs.]" },
    { q: "Are you insured?", a: "[Placeholder: add insurance / bonding details if applicable.]" },
    { q: "How much does it cost?", a: "[Placeholder: add your rates for walks, drop-ins and overnights.]" },
  ],
} satisfies DemoData & Record<string, unknown>;
