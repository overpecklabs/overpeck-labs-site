import type { DemoPhoto } from "@/components/demos/motion/DemoImage";
import type { Faq, Review } from "@/components/demos/sample";
import type { DemoData } from "@/lib/demo-types";
import { PLUMBING_PHONE } from "../phone";

/**
 * Overpeck Plumbing: a FICTIONAL sample brand, Overpeck Labs' flagship showcase demo.
 * There are no real facts here: no licenses, awards, years or stats are claimed. Anything that sounds like a
 * business fact is flagged `sample: true` (shown with <SampleMark />), and the reviews are sample reviews.
 * The phone number is the live AI receptionist demo line (see ../phone.ts).
 */
export const data = {
  slug: "overpeck-plumbing",
  businessName: "Overpeck Plumbing",
  industry: "Plumbing",
  town: "Bergen County",
  serviceArea: "Bergen County, NJ",
  phone: PLUMBING_PHONE as NonNullable<DemoData["phone"]>,
  colors: { primary: "#2563eb", accent: "#22d3ee", dark: "#050d1f" },
  emergency: { from: "#dc2626", to: "#f97316" },
  services: ([
    { icon: "drop", title: "Leak detection & repair", body: "Hidden leaks found fast and fixed right, from dripping fittings to pinhole leaks behind the wall." },
    { icon: "drain", title: "Drain cleaning", body: "Kitchen, bath and main-line clogs cleared with snaking or hydro-jetting, plus a camera check when needed." },
    { icon: "flame", title: "Water heaters", body: "Tank and tankless repair, replacement and flushing, so the hot water comes back and stays on." },
    { icon: "toilet", title: "Toilets & fixtures", body: "Running toilets, weak flushes, faucets and garbage disposals repaired or replaced the same day." },
    { icon: "pipe", title: "Sewer lines", body: "Sewer backups, root intrusion and broken lines diagnosed with a camera, then repaired the least invasive way." },
    { icon: "bath", title: "Kitchen & bath remodels", body: "New fixtures, re-piping and rough-in for remodels, done cleanly and on schedule." },
    { icon: "siren", title: "24/7 emergency service", body: "Burst pipe or flooding at 2 a.m.? Call any time and a plumber heads your way." },
  ] as { icon: string; title: string; body: string }[]),
  /** Above-the-fold lead capture. */
  lead: {
    title: "Get a plumber on the way",
    ask: { label: "What's happening?", options: ["Leak", "Clogged drain", "No hot water", "Sewer backup", "Other"] },
    cta: "Get help now",
    finalTitle: "Water where it shouldn't be?",
    finalBody: "Tell us what's going on and a plumber will call you back fast. For flooding or a burst pipe, call now.",
    bandTitle: "Something leaking right now?",
    bandBody: "Send a request in 20 seconds, or call and talk to a plumber.",
  },
  headline: "Burst pipe? Flooding? We're on the way.",
  subhead: "Fast, tidy, upfront plumbing for homes and businesses across Bergen County. Day or night, our AI receptionist picks up and gets a plumber moving.",
  stats: ([
    { value: 7, label: "plumbing services" },
    { text: "24/7", label: "emergency line" },
    { value: 15, label: "Bergen County towns" },
    { text: "60 min", label: "typical emergency arrival", sample: true },
  ] as ({ value: number; label: string; sample?: boolean } | { text: string; label: string; sample?: boolean })[]),
  whyUs: [
    { title: "Upfront pricing", body: "You approve the price before any work starts. No surprises on the bill.", sample: true },
    { title: "Clean, respectful crews", body: "Shoe covers, drop cloths and a clean-up before we leave." },
    { title: "Licensed & insured", body: "Fully licensed and insured plumbers on every job.", sample: true },
    { title: "Work guaranteed", body: "Every repair is backed by a written workmanship guarantee.", sample: true },
  ],
  receptionist: {
    title: "Call our AI receptionist 24/7",
    body: "No voicemail, no hold music. An AI receptionist picks up every call, day or night, and keeps the job moving.",
    steps: [
      { title: "Answers every call 24/7", body: "Picks up on the first ring, day or night, and asks what's going on." },
      { title: "Handles emergencies and books the job", body: "Spots urgent problems, gets help moving and books the visit on the calendar." },
      { title: "Logs every call so nothing slips through", body: "Every call is logged with the caller's details and what they need." },
    ],
  },
  areaTowns: [
    "Hackensack", "Teaneck", "Englewood", "Fort Lee", "Ridgefield Park", "Paramus", "Fair Lawn", "Bergenfield",
    "Ridgewood", "Lodi", "Little Ferry", "Leonia", "Bogota", "Garfield", "Rutherford",
  ],
  reviews: [
    { name: "Karen M.", town: "Teaneck", rating: 5, service: "Emergency", text: "Pipe burst in the basement at 11 p.m. They picked up on the first ring and had someone here within the hour. Water was off and the pipe fixed before midnight." },
    { name: "Luis R.", town: "Hackensack", rating: 5, service: "Drain cleaning", text: "Our kitchen drain kept backing up. They ran a camera, showed us the grease buildup, cleared it and gave us tips to keep it clear." },
    { name: "Priya S.", town: "Fort Lee", rating: 5, service: "Water heater", text: "No hot water on a Sunday morning. They fit us in that morning, the plumber explained repair vs. replace honestly, and we had hot water by the afternoon." },
    { name: "Tom B.", town: "Paramus", rating: 4, service: "Toilet repair", text: "Fixed a running toilet and a leaky faucet in one visit. Fair price, quick work. Only wish the arrival window was a little narrower." },
    { name: "Dana K.", town: "Ridgewood", rating: 5, service: "Remodel", text: "They did all the plumbing for our bathroom remodel. Clean, on schedule, and the inspector signed off first try." },
    { name: "Marco P.", town: "Lodi", rating: 5, service: "Sewer line", text: "Sewer backed up into the basement. They found roots in the line with a camera and fixed it without digging up the whole yard." },
    { name: "Jenna W.", town: "Englewood", rating: 5, service: "Leak repair", text: "Water stain on the ceiling turned out to be a pinhole leak. Found it fast, patched the pipe and left everything spotless." },
    { name: "Chris L.", town: "Fair Lawn", rating: 4, service: "Drain cleaning", text: "Main line clog cleared quickly. Booking online took a minute and they showed up right on time." },
  ] satisfies Review[],
  faqs: [
    { q: "Do you offer 24/7 emergency plumbing?", a: "Yes. Call any time, day or night, including weekends and holidays. For a burst pipe or flooding, call instead of using the form so we can talk you through shutting off the water while we're on the way." },
    { q: "What should I do if a pipe bursts?", a: "Shut off the main water valve (usually where the water line enters the house, near the meter), turn off the water heater, move valuables away from the water and call us. If water is near outlets or appliances, switch off power to that area at the breaker if it's safe to do so." },
    { q: "How fast can you get here?", a: "For emergencies we typically arrive within about an hour in most of Bergen County. Non-urgent visits can usually be booked same day or next day.", sample: true },
    { q: "How much does a plumber cost?", a: "It depends on the job. You'll get an upfront price before any work starts. The quote form above gives a sample estimated range for common jobs, and the plumber confirms the exact price on site.", sample: true },
    { q: "Are you licensed and insured?", a: "Yes. Every plumber is licensed and the company is fully insured.", sample: true },
    { q: "Should I repair or replace my water heater?", a: "Most tank water heaters last around 8 to 12 years. If yours is in that range and leaking from the tank, replacement is usually the better value. Repairs like a new thermostat, element or valve make sense on younger units." },
    { q: "Why does my drain keep clogging?", a: "Repeat clogs usually mean buildup further down the line: grease, hair, soap scum or tree roots in the sewer line. A camera inspection shows exactly what's going on, and hydro-jetting clears the pipe wall instead of just poking a hole through the clog." },
    { q: "Do you work on tankless water heaters?", a: "Yes. We repair, descale and install tankless water heaters, and can tell you whether switching from a tank makes sense for your home." },
    { q: "Do you offer a guarantee?", a: "Yes. Every repair comes with a written workmanship guarantee.", sample: true },
    { q: "Which areas do you serve?", a: "All of Bergen County, including Hackensack, Teaneck, Englewood, Fort Lee, Paramus, Ridgewood and the towns listed above. Not sure if you're in range? Just call." },
  ] satisfies Faq[],
  footerBlurb: "Emergency plumbing, drain cleaning, water heaters and sewer service across Bergen County, NJ.",
  photos: {
    hero: { src: "/demos/overpeck-plumbing/hero.webp", alt: "Plumber's hands tightening a fitting under a sink" } as DemoPhoto,
    before: { src: "/demos/overpeck-plumbing/before.webp", alt: "Before: old sink with a rusted faucet" } as DemoPhoto,
    after: { src: "/demos/overpeck-plumbing/after.webp", alt: "After: modern white vanity sink with a new faucet" } as DemoPhoto,
    gallery: [
      { src: "/demos/overpeck-plumbing/gallery-heater.webp", alt: "Wrench on a water heater supply line" },
      { src: "/demos/overpeck-plumbing/gallery-bath.webp", alt: "Remodeled bathroom with glass shower and vanity" },
      { src: "/demos/overpeck-plumbing/gallery-pipes.webp", alt: "Clean pipe and valve layout on a brick wall" },
      { src: "/demos/overpeck-plumbing/gallery-kitchen.webp", alt: "Modern kitchen sink with a black faucet" },
      { src: "/demos/overpeck-plumbing/gallery-drain.webp", alt: "Close-up of a stainless steel sink drain" },
      { src: "/demos/overpeck-plumbing/gallery-lines.webp", alt: "Neatly run white water lines on a wall" },
    ] as DemoPhoto[],
  },
} satisfies DemoData & Record<string, unknown>;

/** Sample price ranges for the quote's "estimated range" card. Clearly labeled as samples on the page. */
export const SAMPLE_RANGES: Record<string, [number, number]> = {
  "Leak repair": [150, 450],
  "Drain cleaning": [125, 350],
  "Water heater": [250, 2800],
  "Toilet / fixture": [150, 500],
  "Sewer line": [300, 3500],
  Remodel: [2500, 15000],
  Other: [125, 400],
};
