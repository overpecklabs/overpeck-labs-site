import type { DemoPhoto } from "@/components/demos/motion/DemoImage";
import type { Faq, Review } from "@/components/demos/sample";
import type { DemoData } from "@/lib/demo-types";
import { EXTERIOR_PHONE } from "../phone";

/**
 * Overpeck Exterior Care: a FICTIONAL sample brand, Overpeck Labs' second flagship showcase.
 * No licenses, awards, years or stats are claimed. Anything that sounds like a business fact (insurance, prices,
 * policies, timings) is flagged `sample: true` and shown with <SampleMark />; reviews are sample reviews.
 * Phone: see ../phone.ts (the Overpeck Labs office line).
 */
export const data = {
  slug: "overpeck-exterior-care",
  businessName: "Overpeck Exterior Care",
  industry: "Exterior cleaning",
  town: "Bergen County",
  serviceArea: "Bergen County, NJ",
  phone: EXTERIOR_PHONE as NonNullable<DemoData["phone"]>,
  colors: { primary: "#0e7490", accent: "#34d399", dark: "#06232a" },
  services: [
    {
      key: "windows",
      title: "Window Washing",
      body: "Streak-free glass inside and out, with screens scrubbed and tracks and sills wiped clean.",
      points: ["Inside & out", "Screens washed", "Tracks & sills detailed"],
    },
    {
      key: "power",
      title: "Power Washing",
      body: "Driveways, walkways, patios and pavers blasted free of grime, oil spots, moss and weeds in the joints.",
      points: ["Driveways & walkways", "Patios & pavers", "Oil and rust spot treatment"],
    },
    {
      key: "softwash",
      title: "Soft Washing",
      body: "Gentle, low-pressure cleaning that's safe for roofs and siding, including the black streaks on shingles.",
      points: ["House siding", "Roofs (black streaks)", "Safe for vinyl, stucco & shingles"],
    },
    {
      key: "deck",
      title: "Deck & Fence",
      body: "Gray, weathered wood brought back to life and prepped for stain or sealer, without fuzzing the grain.",
      points: ["Wood & composite decks", "Fences & railings", "Stain-ready finish"],
    },
    {
      key: "gutters",
      title: "Gutter Cleaning",
      body: "Leaves and debris cleared by hand, downspouts flushed, and the outside of the gutters brightened.",
      points: ["Hand-cleared gutters", "Downspouts flushed", "Gutter faces brightened"],
    },
    {
      key: "commercial",
      title: "Commercial Storefronts",
      body: "Clean glass, sidewalks and entryways that make a great first impression, on a schedule that suits you.",
      points: ["Storefront glass", "Sidewalks & entries", "Weekly or monthly plans"],
    },
  ] as { key: string; title: string; body: string; points: string[] }[],
  /** Above-the-fold lead capture: the ONLY form on the page. */
  lead: {
    title: "Get a free quote",
    ask: { label: "What needs cleaning?", options: ["Windows", "House wash", "Roof soft wash", "Driveway & patio", "Deck or fence", "Gutters", "Commercial"] },
    cta: "Get my free quote",
    bandTitle: "See your home sparkle again",
    bandBody: "Tell us what needs cleaning and we'll send a free, no-pressure quote.",
    finalTitle: "Ready for a cleaner home?",
    finalBody: "Free quotes, no pressure. Tell us what needs cleaning and we'll take it from there.",
  },
  headline: "Make your home look new again.",
  subhead: "Window washing, power washing and gentle soft washing for homes and storefronts across Bergen County. Free quotes, careful crews, spotless results.",
  stats: [
    { value: 6, label: "exterior services" },
    { value: 10, label: "Bergen County towns" },
    { value: 3, label: "seasonal packages" },
    { text: "Free", label: "no-pressure quotes" },
  ] as ({ value: number; label: string } | { text: string; label: string })[],
  softWash: {
    title: "Why soft wash?",
    body: "High pressure can strip paint, force water behind siding and blast the granules off roof shingles. Soft washing uses low pressure and a cleaning solution to lift grime and streaks, then rinses gently.",
    compare: [
      { title: "Pressure washing", tone: "for hard surfaces", points: ["High-pressure water stream", "Best for concrete, pavers and stone", "Too harsh for siding and roofs"] },
      { title: "Soft washing", tone: "for your home", points: ["Low pressure, like a garden hose", "Low-pressure soft washing for roofs and siding", "Safe for vinyl, stucco and shingles"] },
    ],
    plants: "Plant-safe rinse: we wet down your landscaping before and after, and rinse thoroughly so beds, lawns and pets are protected.",
  },
  process: [
    { title: "Get your free quote", body: "Send the short form or call. Add photos if you like and we'll price it fast." },
    { title: "We clean", body: "A careful crew arrives on time, protects your plants and gets to work. You don't need to be home." },
    { title: "Enjoy the shine", body: "We walk the property when we're done, so you're happy before we leave." },
  ],
  packages: [
    { name: "Spring Refresh", from: 399, body: "Wash off winter's grime and get ready for the season.", items: ["Soft wash house siding", "Exterior window washing", "Front walk power wash"] },
    { name: "Summer Curb Appeal", from: 349, body: "Make the outside of your home shine for summer.", items: ["Driveway & walkway power wash", "Patio or pavers cleaned", "Exterior window washing"], featured: true },
    { name: "Fall Gutter & Window", from: 299, body: "Clear the leaves and let the light in before winter.", items: ["Gutters hand-cleared", "Downspouts flushed", "Windows inside & out"] },
  ],
  callUs: {
    title: "Prefer to talk? Give us a call.",
    body: "Tell us what needs cleaning and we'll answer your questions and set up your free estimate.",
    steps: [
      { title: "Tell us what needs cleaning", body: "Windows, siding, driveway, roof or gutters: one call covers it." },
      { title: "Get your free estimate", body: "We confirm the details and book a time that works for you." },
      { title: "We show up and make it shine", body: "Careful crews, spotless results, and we clean up after ourselves." },
    ],
  },
  /** Sample review total shown in the rating row and structured data (the page shows 8 of them). */
  reviewCount: 80,
  areaTowns: ["Ridgefield Park", "Teaneck", "Hackensack", "Paramus", "Fort Lee", "Englewood", "Ridgewood", "Fair Lawn", "River Edge", "Oradell"],
  reviews: [
    { name: "Megan T.", town: "Ridgewood", rating: 5, service: "Soft wash", text: "Our north side was green with mildew. After the soft wash the siding looks brand new, and my hydrangeas didn't even notice they were there." },
    { name: "Raj P.", town: "Teaneck", rating: 5, service: "Windows", text: "Every window inside and out, screens and tracks too. I didn't realize how dull the glass had gotten until they finished." },
    { name: "Elena G.", town: "Fort Lee", rating: 5, service: "Power washing", text: "The driveway had years of oil stains. It's not perfect where the worst spot was, but it's about 90% better and the pavers look great." },
    { name: "Dave K.", town: "Paramus", rating: 4, service: "Gutters", text: "Gutters cleared and downspouts flushed before the first big storm. Quick and tidy. Took a week to get on the schedule in October." },
    { name: "Sofia L.", town: "Fair Lawn", rating: 5, service: "Roof soft wash", text: "The black streaks on our roof are gone. They explained why they don't pressure wash shingles, which made me trust them." },
    { name: "Brian M.", town: "Hackensack", rating: 5, service: "Deck", text: "Our gray deck is back to warm wood. They left it ready for stain and gave us tips on which sealer to use." },
    { name: "Nadia R.", town: "Englewood", rating: 5, service: "Commercial", text: "They wash our storefront glass and sidewalk every other week before we open. Always on time, always spotless." },
    { name: "Chris O.", town: "River Edge", rating: 4, service: "Spring Refresh", text: "House wash, windows and front walk in one visit. Great value. Booking online was easy." },
  ] satisfies Review[],
  faqs: [
    { q: "Is soft washing safe for my house?", a: "Yes. Soft washing uses low pressure, about like a garden hose, plus a cleaning solution that does the work. It's the gentle way to clean vinyl, stucco and asphalt shingles, because high pressure can damage them." },
    { q: "Is it safe for my plants and pets?", a: "We wet down plants and lawns before and after, rinse thoroughly and cover delicate plants when needed. Keep pets inside while we work; once everything is rinsed and dry, the yard is fine for them." },
    { q: "How often should I wash my house?", a: "Most homes look their best with a soft wash every one to two years. Shady, wooded lots that grow mildew fast may need it yearly." },
    { q: "How often should I have my windows cleaned?", a: "Twice a year is typical: spring and fall. Homes near busy roads or with lots of trees often go three or four times a year." },
    { q: "Do I need to be home?", a: "No. For exterior work we just need access to the yard and an outdoor water spigot. For inside windows, someone needs to let us in.", sample: true },
    { q: "What happens if it rains?", a: "Light rain doesn't affect power washing or soft washing. For heavy storms, high wind or window cleaning in the rain, we'll reschedule at no charge.", sample: true },
    { q: "Are you insured?", a: "Yes. We carry full liability insurance, and a certificate is available on request.", sample: true },
    { q: "Can you remove the black streaks on my roof?", a: "Yes. Those streaks are usually algae. A gentle, low-pressure soft wash cleans them off without pressure that would loosen the shingle granules." },
    { q: "Will power washing get the oil stains out of my driveway?", a: "Most oil and rust spots lighten a lot with pre-treatment and hot-water cleaning. Very old stains can leave a shadow, and we'll tell you honestly before we start." },
    { q: "How do I get a quote?", a: "Use the short form at the top of the page or call. Add photos and your address in the extra steps and we can usually quote without a visit.", sample: true },
  ] satisfies Faq[],
  footerBlurb: "Window washing, power washing, soft washing and gutter cleaning for homes and storefronts across Bergen County, NJ.",
  photos: {
    hero: { src: "/demos/overpeck-exterior-care/hero.webp", alt: "Two-story house with a covered porch and a clean front walk" } as DemoPhoto,
    windowView: { src: "/demos/overpeck-exterior-care/window-view.webp", alt: "Bright backyard with a lawn, patio and garden shed, seen through a window" },
    services: {
      windows: { src: "/demos/overpeck-exterior-care/service-windows.webp", alt: "Spotless white-framed windows" },
      power: { src: "/demos/overpeck-exterior-care/service-power.webp", alt: "Long paved driveway in front of a white house" },
      softwash: { src: "/demos/overpeck-exterior-care/service-softwash.webp", alt: "Gray two-story house siding among green trees" },
      deck: { src: "/demos/overpeck-exterior-care/service-deck.webp", alt: "Clean wooden deck with outdoor seating" },
      gutters: { src: "/demos/overpeck-exterior-care/service-gutters.webp", alt: "Gutters along a roof edge against a blue sky" },
      commercial: { src: "/demos/overpeck-exterior-care/service-commercial.webp", alt: "Modern commercial building exterior with clear blue sky" },
    } as Record<string, DemoPhoto>,
    beforeAfter: [
      {
        label: "Driveway",
        before: { src: "/demos/overpeck-exterior-care/ba-driveway-before.webp", alt: "Before: concrete stained with dark oil and dirt spots" },
        after: { src: "/demos/overpeck-exterior-care/ba-driveway-after.webp", alt: "After: clean, even gray concrete" },
      },
      {
        label: "Roof",
        before: { src: "/demos/overpeck-exterior-care/ba-roof-before.webp", alt: "Before: roof shingles covered in green moss and algae" },
        after: { src: "/demos/overpeck-exterior-care/ba-roof-after.webp", alt: "After: clean gray roof shingles" },
      },
      {
        label: "Siding",
        before: { src: "/demos/overpeck-exterior-care/ba-siding-before.webp", alt: "Before: white wall streaked with green mildew" },
        after: { src: "/demos/overpeck-exterior-care/ba-siding-after.webp", alt: "After: clean white exterior wall" },
      },
    ] as { label: string; before: DemoPhoto; after: DemoPhoto }[],
  },
} satisfies DemoData & Record<string, unknown>;
