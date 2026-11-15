import type { DemoPhoto } from "@/components/demos/motion/DemoImage";
import type { DemoData } from "@/lib/demo-types";

/** Party Bus 360: true details only (from their free-mockup request and call notes). */
export const data = {
  slug: "party-bus-360",
  businessName: "Party Bus 360",
  industry: "Party bus and limo service",
  town: "Bergen County",
  serviceArea: "Based in Bergen County, serving all of New Jersey",
  phone: { display: "(201) 754-4285", tel: "tel:+12017544285" },
  sms: "sms:+12017544285",
  colors: { primary: "#7c3aed", accent: "#fbbf24", dark: "#0b1020" },
  services: [
    { title: "Weddings", body: "Get the wedding party, family and guests between the ceremony, photos and reception together." },
    { title: "Nightlife", body: "Birthdays, bachelor and bachelorette parties and nights out, with one ride for the whole group." },
    { title: "Corporate events", body: "Team outings, client events and company parties, with everyone arriving together and on time." },
    { title: "Other bookings", body: "Have a different occasion in mind? Tell us about it and we'll let you know if we can help." },
  ],
  excludes: "airport trips",
  events: ["Wedding", "Night out / nightlife", "Corporate event", "Other booking"],
  faqs: [
    { q: "Do you do airport trips?", a: "No. Party Bus 360 doesn't book airport transfers. We focus on weddings, nightlife, corporate events and other group outings." },
    { q: "Which areas do you serve?", a: "We're based in Bergen County and serve all of New Jersey." },
    { q: "How fast can I get a quote?", a: "Instantly. Fill out the quote form and you'll see your quote right away, followed by an email with the details." },
    { q: "How many people fit on a party bus?", a: "[Placeholder: add passenger capacity for each vehicle.]" },
    { q: "How far ahead should I book?", a: "[Placeholder: add your recommended booking window and deposit policy.]" },
  ],
  logo: null as string | null,
  /** Placeholder stock photos (files in ../assets, credits in ../assets/CREDITS.md). null = not chosen yet. */
  photos: {
    hero: { src: "/demos/party-bus-360/hero.webp", alt: "Colorful party lights glowing inside a vehicle at night" } as DemoPhoto,
    services: [
      { src: "/demos/party-bus-360/service-weddings.webp", alt: "Wedding bouquet tied to a car door" },
      { src: "/demos/party-bus-360/service-nightlife.webp", alt: "Manhattan skyline at night seen across the Hudson River" },
      { src: "/demos/party-bus-360/service-corporate.webp", alt: "Event hall with tables under purple stage lighting" },
      { src: "/demos/party-bus-360/service-other.webp", alt: "Gold coupe glasses lined up for a celebration" },
    ] as DemoPhoto[],
    gallery: [
      { src: "/demos/party-bus-360/gallery-1.webp", alt: "Bus interior lit with blue ceiling lights" },
      { src: "/demos/party-bus-360/gallery-2.webp", alt: "Mirror ball glowing in red and purple light" },
      { src: "/demos/party-bus-360/gallery-3.webp", alt: "New York skyline at night from a New Jersey waterfront" },
      { src: "/demos/party-bus-360/gallery-4.webp", alt: "Flowers decorating the hood of a black car" },
      { src: "/demos/party-bus-360/gallery-5.webp", alt: "Vehicle ceiling with blue accent lights" },
      { src: "/demos/party-bus-360/gallery-6.webp", alt: "Hands raising glasses in a toast" },
    ] as DemoPhoto[],
    about: { src: "/demos/party-bus-360/about.webp", alt: "Purple and blue disco ball lights" } as DemoPhoto,
  },
} satisfies DemoData & Record<string, unknown>;
