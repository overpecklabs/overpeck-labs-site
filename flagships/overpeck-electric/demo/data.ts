import type { DemoPhoto } from "@/components/demos/motion/DemoImage";
import type { Faq, Review } from "@/components/demos/sample";
import type { DemoData } from "@/lib/demo-types";
import { ELECTRIC_PHONE } from "../phone";

/**
 * Overpeck Electric: a FICTIONAL sample brand, Overpeck Labs' third flagship showcase.
 * No real licenses, awards, years or stats are claimed. Business facts (license, insurance, warranties, response
 * times, prices) are flagged `sample: true` and shown with <SampleMark />; reviews are sample reviews.
 * Phone: see ../phone.ts (AI receptionist line when set, otherwise the Overpeck Labs office line).
 */
export const data = {
  slug: "overpeck-electric",
  businessName: "Overpeck Electric",
  industry: "Electrician",
  town: "Bergen County",
  serviceArea: "Bergen County, NJ",
  phone: ELECTRIC_PHONE as NonNullable<DemoData["phone"]>,
  colors: { primary: "#facc15", accent: "#f59e0b", dark: "#0b0f17" },
  services: [
    { key: "panel", title: "Panel upgrades", body: "Swap an old 100-amp or fuse panel for a modern 200-amp service with room to grow, permitted and inspected.", points: ["100A → 200A service", "Fuse box replacement", "Permit & inspection handled"] },
    { key: "ev", title: "EV chargers", body: "Level 2 home chargers installed on a dedicated circuit, sized to your panel and your car.", points: ["Level 2 (240V) install", "Load calculation", "Garage or driveway"] },
    { key: "lighting", title: "Lighting & recessed", body: "Recessed cans, under-cabinet strips, dimmers and outdoor lighting that make every room feel finished.", points: ["Recessed / LED retrofits", "Dimmers & smart switches", "Landscape & security"] },
    { key: "generator", title: "Generators", body: "Standby and portable-ready hookups with a transfer switch, so the essentials stay on in a storm.", points: ["Standby generators", "Transfer switches", "Inlet + interlock kits"] },
    { key: "troubleshooting", title: "Troubleshooting", body: "Dead outlets, tripping breakers and flickering lights traced to the real cause and fixed safely.", points: ["Tripping breakers", "Dead outlets & switches", "Flickering lights"] },
    { key: "inspection", title: "Safety inspections", body: "A top-to-bottom check of panel, wiring, grounding and GFCI/AFCI protection, with a clear written report.", points: ["Home-sale inspections", "GFCI / AFCI checks", "Written report"] },
  ] as { key: string; title: string; body: string; points: string[] }[],
  /** Above-the-fold lead capture: the ONLY form on the page. */
  lead: {
    title: "Get a free estimate",
    ask: { label: "What do you need?", options: ["Panel upgrade", "EV charger", "Outlet / switch", "Lighting", "Generator", "Emergency / no power", "Other"] },
    cta: "Get my free estimate",
    bandTitle: "Breaker tripping? Planning an EV charger?",
    bandBody: "Tell us what you need and an electrician gets back to you fast.",
    finalTitle: "Ready when the lights aren't",
    finalBody: "Free estimates for upgrades and installs, and fast help when something isn't right. For sparks, burning smells or no power, call now.",
  },
  headline: "Bergen County's on-call electricians.",
  subhead: "Panel upgrades, EV chargers, lighting and generators, plus fast help when the power goes out. Clean work, clear prices, done to code.",
  stats: [
    { value: 6, label: "electrical services" },
    { value: 10, label: "Bergen County towns" },
    { text: "Priority", label: "emergency calls" },
    { text: "Free", label: "estimates" },
  ] as ({ value: number; label: string } | { text: string; label: string })[],
  whyUs: [
    { title: "Licensed & insured", body: "Licensed NJ electrical contractor, fully insured.", sample: true },
    { title: "Permits handled", body: "We pull the permit and meet the inspector, so you don't have to." },
    { title: "Upfront pricing", body: "You approve a written price before any work starts.", sample: true },
    { title: "Clean, labeled panels", body: "Every circuit labeled, every job left tidy." },
  ],
  process: [
    { title: "Tell us what you need", body: "Send the short form or call. Add photos of your panel or the problem if you like." },
    { title: "Get a clear estimate", body: "An electrician confirms the scope and gives you a written price." },
    { title: "Powered, safely", body: "We do the work to code, handle the permit and test everything before we leave." },
  ],
  receptionist: {
    title: "Try our AI receptionist",
    body: "When the crew is on a job or it's after hours, an AI receptionist can pick up, flag emergencies safety-first and book your estimate.",
    steps: [
      { title: "Picks up when you can't", body: "Answers while the electrician is on a job or after hours, and asks what's going on." },
      { title: "Handles questions and books the estimate", body: "Flags emergencies, answers common questions and books the visit on the calendar." },
      { title: "Texts the electrician a summary", body: "The caller's details and what they need go straight to the electrician." },
    ],
  },
  ev: {
    /** Sample assumptions for the EV estimate widget (all editable or clearly labeled). */
    rate: 0.21,
    milesPerKwh: 3.5,
    installFrom: 1200,
  },
  /** Sample review total shown in the rating row and structured data (the page shows 8 of them). */
  reviewCount: 80,
  areaTowns: ["Ridgefield Park", "Teaneck", "Hackensack", "Paramus", "Fort Lee", "Englewood", "Ridgewood", "Fair Lawn", "River Edge", "Oradell"],
  reviews: [
    { name: "Kevin D.", town: "Teaneck", rating: 5, service: "Panel upgrade", text: "Upgraded our old 100-amp panel to 200 amps in one day. They pulled the permit, met the inspector and labeled every circuit. Night and day." },
    { name: "Aisha M.", town: "Paramus", rating: 5, service: "EV charger", text: "They checked our panel first, then installed a Level 2 charger in the garage. Clean conduit run and it charges overnight with no issues." },
    { name: "Greg P.", town: "Ridgewood", rating: 5, service: "Recessed lighting", text: "Twelve recessed lights and dimmers in the living room and kitchen. Barely any patching needed and the room finally feels bright." },
    { name: "Lina S.", town: "Fort Lee", rating: 4, service: "Troubleshooting", text: "A breaker kept tripping in the kitchen. They traced it to a bad outlet behind the fridge and fixed it the same visit. Arrival window was a bit long." },
    { name: "Marcus T.", town: "Hackensack", rating: 5, service: "Generator", text: "Standby generator and transfer switch before winter. The next outage, the lights came back on in seconds. Worth every penny." },
    { name: "Jen R.", town: "Fair Lawn", rating: 5, service: "Inspection", text: "Pre-sale inspection with a clear written report. They fixed the two GFCI issues the buyer flagged the next morning." },
    { name: "Omar K.", town: "Englewood", rating: 5, service: "Emergency", text: "Smelled something burning near an outlet at 10 p.m. They told us to shut off that breaker, came out that night and replaced the damaged wiring." },
    { name: "Beth L.", town: "River Edge", rating: 4, service: "Outdoor lighting", text: "Landscape and security lights look great. Took two visits to get the timers right, but they were patient about it." },
  ] satisfies Review[],
  faqs: [
    { q: "What should I do if I see sparks or smell burning?", a: "Turn off the breaker for that area if you can do it safely, unplug nearby devices and call us right away. If there's smoke or fire, get everyone out and call 911. Don't use the outlet or switch again until it's been checked." },
    { q: "What if a power line is down?", a: "Stay at least 30 feet away and keep others away. Call 911 and your utility (PSE&G in most of Bergen County) right away. Never touch a downed line or anything it's touching." },
    { q: "Do I need a panel upgrade for an EV charger?", a: "Not always. We do a load calculation first. Many 200-amp panels can add a Level 2 charger; older 100-amp panels often need an upgrade or a load-management device." },
    { q: "How long does a panel upgrade take?", a: "Most residential panel upgrades take one day, with a short power shutoff. We coordinate the utility disconnect and the town inspection.", sample: true },
    { q: "Do you pull permits?", a: "Yes. Panel upgrades, EV chargers, generators and new circuits get a permit and an inspection, and we handle both." },
    { q: "Are you licensed and insured?", a: "Yes. We're a licensed New Jersey electrical contractor and fully insured.", sample: true },
    { q: "Why does my breaker keep tripping?", a: "Usually an overloaded circuit, a short, or a ground fault from a damaged device or wire. Repeated tripping is a warning, not a nuisance, so have it checked instead of resetting it over and over." },
    { q: "How much does an EV charger install cost?", a: "It depends on the distance from your panel and whether the panel has capacity. The estimate widget above shows a sample starting point; we confirm the exact price after a quick look.", sample: true },
    { q: "Can you add recessed lights without tearing up my ceiling?", a: "Usually yes. We fish wires through the ceiling between joists and use remodel housings, so patching is minimal." },
    { q: "Do you offer emergency service?", a: "Yes. Call us for no power, sparking, burning smells or water near electrical equipment. For a downed line, call 911 and your utility first.", sample: true },
  ] satisfies Faq[],
  footerBlurb: "Panel upgrades, EV chargers, lighting, generators, troubleshooting and safety inspections across Bergen County, NJ.",
  photos: {
    hero: { src: "/demos/overpeck-electric/hero.webp", alt: "Living room with warm evening lighting and a large window" } as DemoPhoto,
    services: {
      panel: { src: "/demos/overpeck-electric/service-panel.webp", alt: "Open residential breaker panel with neatly landed circuits" },
      ev: { src: "/demos/overpeck-electric/service-ev.webp", alt: "Wall-mounted EV charger with its cable plugged in" },
      lighting: { src: "/demos/overpeck-electric/service-lighting.webp", alt: "Modern kitchen with recessed lights and pendant fixtures" },
      generator: { src: "/demos/overpeck-electric/service-generator.webp", alt: "Standby generator next to wall-mounted power equipment" },
      troubleshooting: { src: "/demos/overpeck-electric/service-troubleshooting.webp", alt: "A plug about to go into a wall outlet" },
      inspection: { src: "/demos/overpeck-electric/service-inspection.webp", alt: "Wall-mounted breaker box in a clean room" },
    } as Record<string, DemoPhoto>,
  },
} satisfies DemoData & Record<string, unknown>;
