import type { DemoPhoto } from "@/components/demos/motion/DemoImage";
import type { DetailStep } from "@/components/demos/lead";
import type { Faq, Review } from "@/components/demos/sample";
import type { DemoData } from "@/lib/demo-types";

/**
 * Party Bus 360. Real facts (from their mockup request + calls): Bergen County based, serves all of New Jersey,
 * weddings / nightlife / corporate / other bookings, no airport trips, instant online quotes followed by email,
 * online booking, prefers text. Anything else is sample copy: flagged `sample: true` and shown with <SampleMark />.
 */
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
    {
      title: "Weddings",
      body: "Keep the whole wedding party together from the first look to the last dance. We plan pickups around the getting-ready spots, ceremony, photos and reception, so nobody is hunting for a ride in a tux. Add a late-night send-off to the after-party.",
    },
    {
      title: "Nightlife",
      body: "Birthdays, bachelor and bachelorette parties, concerts and big nights out in Hoboken, Jersey City or right here in Bergen County. The whole group rides together with the lights and music on, and nobody gets stuck as the designated driver.",
    },
    {
      title: "Corporate events",
      body: "Team outings, client dinners, holiday parties and conference shuttles. Everyone arrives together and on time, and you get one clear quote for the whole trip instead of a pile of rideshare receipts.",
    },
    {
      title: "Other bookings",
      body: "Proms, sweet sixteens, quinceañeras, game days, winery tours and more. Tell us what you're planning and we'll let you know right away if we can make it happen. (We don't do airport runs.)",
    },
  ],
  excludes: "airport trips",
  events: ["Wedding", "Night out / nightlife", "Corporate event", "Other booking"],
  vehicles: ["Party bus", "Stretch limo", "Not sure, help me choose"],
  /** Above-the-fold lead capture (short form + optional multi-step details). */
  lead: {
    title: "Free quote in 20 seconds",
    ask: { label: "What's the occasion?", options: ["Wedding", "Night out", "Corporate", "Other"] },
    cta: "Get my free quote",
    finalTitle: "Lock in your date",
    finalBody: "Weekends fill up fast, especially in wedding and prom season. Send your details and get your quote right away.",
    bandTitle: "Planning a night out or a wedding?",
    bandBody: "Get an instant quote for your group in under a minute.",
    details: [
      {
        title: "Your event",
        fields: [
          { name: "date", label: "Event date", type: "date" },
          { name: "pickup", label: "Pickup town", type: "text", placeholder: "e.g. Hackensack" },
          { name: "guests", label: "Number of guests", type: "number", placeholder: "e.g. 20" },
        ],
      },
      {
        title: "Your ride",
        fields: [
          { name: "hours", label: "Hours needed", type: "select", options: ["3 hours", "4 hours", "5 hours", "6+ hours"] },
          { name: "vehicle", label: "Vehicle", type: "select", options: ["Party bus", "Stretch limo", "Not sure, help me choose"] },
        ],
      },
      {
        title: "Anything else?",
        fields: [
          { name: "email", label: "Email", type: "email", optional: true },
          { name: "notes", label: "Notes", type: "textarea", placeholder: "Stops, timing, music requests…", optional: true },
        ],
      },
    ] satisfies DetailStep[],
  },
  heroSub: "Weddings, nightlife and corporate events across New Jersey. Get an instant quote online and book your ride in minutes.",
  whyUs: [
    { title: "Instant online quotes", body: "Pick your date, group size and pickup town and see your price right away, then get every detail by email. No waiting on a callback." },
    { title: "One ride for the whole crew", body: "Nobody gets left behind, nobody has to drive, and everyone arrives together. It's the easiest way to move a group around New Jersey." },
    { title: "Anywhere in New Jersey", body: "We're based in Bergen County and travel the whole state, from Mahwah to the Shore." },
    { title: "Clean, comfortable rides", body: "Leather seating, custom lighting and a sound system you can plug your playlist into.", sample: true },
  ],
  about: {
    title: "Bergen County's party bus crew",
    body: "Party Bus 360 gets groups where they're going and makes the ride part of the celebration. We're based in Bergen County, serve all of New Jersey, and focus on the events that matter most: weddings, big nights out and company celebrations. Get an instant quote online, book in a few clicks, or just text us with a question.",
  },
  stats: [
    { value: 21, label: "NJ counties served" },
    { value: 4, label: "kinds of events" },
    { value: 500, suffix: "+", label: "groups driven", sample: true },
    { text: "Instant", label: "online quotes" },
  ],
  gallerySub: "Lights, music and room for the whole crew. Here's a feel for the night.",
  areaBlurb: "Wherever your night starts in New Jersey, from Paramus and Hackensack to Hoboken, Morristown or the Shore, tell us your pickup town and we'll quote your ride instantly.",
  ctaTitle: "Ready to roll?",
  ctaBody: "Get your instant quote now, or call or text and we'll help plan the perfect ride for your group.",
  footerBlurb: "Party buses and limos for weddings, nightlife and corporate events across New Jersey.",
  reviews: [
    { name: "Jessica M.", town: "Paramus", rating: 5, service: "Bachelorette", text: "Booked the bus for my sister's bachelorette and it was the highlight of the weekend. The instant quote made it easy to compare dates, and our driver was so patient with 14 of us running late. Already planning the next one." },
    { name: "Marcus T.", town: "Hackensack", rating: 5, service: "Wedding", text: "Used Party Bus 360 for our wedding party. They picked up the groomsmen in Hackensack and the bridesmaids in Teaneck and got everyone to photos and the reception right on schedule. One less thing to stress about." },
    { name: "Priya S.", town: "Fort Lee", rating: 5, service: "Birthday", text: "Super easy to book. I had a quote in about a minute and the confirmation email had every detail." },
    { name: "Danny R.", town: "Ridgewood", rating: 4, service: "Night out", text: "Great night out for my 30th. The lights and music were awesome. Only wish we'd booked an extra hour!" },
    { name: "Lauren K.", town: "Teaneck", rating: 5, service: "Corporate", text: "We booked a bus for our company holiday party in Englewood. Twenty-five people, zero rideshare chaos, and everyone got home safe. The team is still talking about it." },
    { name: "Chris D.", town: "Fair Lawn", rating: 5, service: "Night out", text: "Texted a bunch of questions before booking and got quick, friendly answers every time. The bus was spotless." },
    { name: "Nicole A.", town: "Mahwah", rating: 5, service: "Prom", text: "Prom night for my daughter and her friends. I felt so much better knowing they had a professional driver, and the kids loved every minute." },
  ] satisfies Review[],
  faqs: [
    { q: "Do you do airport trips?", a: "No. Party Bus 360 doesn't book airport transfers. We focus on weddings, nightlife, corporate events and other group celebrations." },
    { q: "Which areas do you serve?", a: "We're based in Bergen County and serve all of New Jersey. Tell us your pickup town and we'll take it from there." },
    { q: "How fast can I get a quote?", a: "Instantly. Fill out the quote form and your price appears right away, followed by an email with all the details." },
    { q: "Can I book online?", a: "Yes. Once you have your quote, choose your vehicle and date and book right on the site. We'll confirm everything by email." },
    { q: "How many people fit on a party bus?", a: "Our party buses carry groups of up to 30 guests, and our limos are a great fit for groups of 8 to 10. Tell us your headcount and we'll match the right vehicle.", sample: true },
    { q: "How far ahead should I book?", a: "For Saturdays in wedding and prom season (April through June) and around the holidays, book 4 to 8 weeks ahead. Weeknights and off-season dates can often be booked a few days out.", sample: true },
    { q: "Is there a deposit?", a: "A 25% deposit holds your date, and the balance is due one week before your event. We accept all major credit cards.", sample: true },
    { q: "Can we bring drinks on board?", a: "Guests 21 and over may bring their own drinks on party bus rentals. We provide coolers, ice and cups. No glass bottles, please.", sample: true },
    { q: "Are you licensed and insured?", a: "Yes. Party Bus 360 is fully licensed and insured, and every driver is a professional, background-checked chauffeur.", sample: true },
    { q: "Can I just text you?", a: "Absolutely. Text (201) 754-4285 any time with questions and we'll get right back to you." },
  ] satisfies Faq[],
  logo: null as string | null,
  /** Stock photos (files in ../assets, credits in ../assets/CREDITS.md). */
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
