import type { DemoPhoto } from "@/components/demos/motion/DemoImage";
import type { Faq, Review } from "@/components/demos/sample";
import type { DemoData } from "@/lib/demo-types";

/**
 * Paws and Tails (dog sitting). Real facts: the name, Ridgefield Park, the phone number, owner Parwin.
 * Everything else is sample copy for the preview: facts we don't know are flagged `sample: true` and shown with <SampleMark />.
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
    {
      title: "Dog walking",
      body: "Regular midday walks that break up a long day at home. We follow your dog's usual route and pace, keep them safely leashed the whole way, and top up the water bowl before we head out.",
    },
    {
      title: "Drop-in visits",
      body: "Short home visits for potty breaks, meals, medications and some quality cuddle time. Perfect for long workdays, or for pups who are happiest in their own space.",
    },
    {
      title: "Overnight sitting",
      body: "We stay at your home overnight so your dog keeps their routine, from the evening walk to breakfast. Your house looks lived-in while you're away, and your dog never spends a night alone.",
    },
    {
      title: "Puppy & senior care",
      body: "Extra potty breaks and gentle training reinforcement for puppies, and slower walks, medications and lots of patience for seniors. We follow your instructions to the letter.",
    },
  ],
  headline: "Loving dog sitting in Ridgefield Park",
  subhead: "Walks, drop-in visits and overnight care in your own home, so your dog stays happy and on routine while you're away.",
  whyUs: [
    { title: "Your dog stays home", body: "No kennels and no crates in a stranger's house. Your dog stays with their own bed, toys and routine." },
    { title: "Updates after every visit", body: "A quick text and photo after each visit, so you always know how things went.", sample: true },
    { title: "Right here in Ridgefield Park", body: "Local and close by, from Overpeck Park loops to quiet side-street walks for nervous pups." },
    { title: "Insured and trusted", body: "Fully insured, with references from local pet parents available on request.", sample: true },
  ],
  about: {
    title: "Meet Paws and Tails",
    body: "Paws and Tails is Parwin's Ridgefield Park dog-sitting service. The idea is simple: treat every dog like family, keep their routine on track, and give owners real peace of mind while they're at work or away. Walks, drop-ins, overnights, puppies and seniors, all in the comfort of your own home.",
  },
  process: [
    { title: "Call or text", body: "Tell us about your dog and the dates you need." },
    { title: "Meet & greet", body: "We stop by to meet your dog, learn the routine and pick up keys." },
    { title: "Relax", body: "Enjoy your day or trip while your dog stays happy at home." },
  ],
  stats: [
    { value: 4, label: "ways we care for your dog" },
    { text: "Local", label: "based in Ridgefield Park" },
    { text: "Daily", label: "photo updates", sample: true },
    { text: "At home", label: "care in your own home" },
  ],
  areaTowns: "Teaneck, Bogota, Little Ferry, Leonia and Hackensack",
  ctaTitle: "Going away soon?",
  ctaBody: "Give us a call or send a text, and let's make sure your dog is in good hands.",
  footerBlurb: "Dog walking, drop-in visits and overnight sitting in Ridgefield Park, NJ.",
  reviews: [
    { name: "Samantha L.", town: "Ridgefield Park", rating: 5, service: "Dog walking", text: "Our lab Bruno gets three walks a week and goes wild with excitement at the door every time. Reliable, kind, and we always get a photo from the walk." },
    { name: "Mike D.", town: "Teaneck", rating: 5, service: "Overnight", text: "We were nervous leaving our senior beagle for a whole week, but the overnight care was perfect. Her medication schedule stayed on track and she still got her walk around Votee Park every day." },
    { name: "Ana R.", town: "Little Ferry", rating: 5, service: "Drop-in visits", text: "Booked drop-in visits while we were away at a wedding. The house was spotless and our pup was happy and relaxed when we got home." },
    { name: "Tom H.", town: "Bogota", rating: 4, service: "Dog walking", text: "Very flexible with scheduling, even when our plans changed last minute. Would love a few more weekend slots, but the care itself is top-notch." },
    { name: "Jennifer K.", town: "Hackensack", rating: 5, service: "Puppy care", text: "Our puppy was a handful, and the extra midday potty breaks made house training so much easier. Patient, kind and always on time." },
    { name: "Ryan P.", town: "Ridgefield Park", rating: 5, service: "Dog walking", text: "Overpeck Park walks every afternoon and a tired, happy dog every evening. Five stars." },
    { name: "Grace C.", town: "Leonia", rating: 5, service: "Drop-in visits", text: "Great communication, fair prices, and our anxious rescue actually looks forward to the visits. That says it all." },
  ] satisfies Review[],
  faqs: [
    { q: "Which areas do you cover?", a: "Ridgefield Park and nearby Bergen County towns. Not sure if you're in range? Call or text and we'll let you know." },
    { q: "How do I book?", a: "Call or text (201) 754-4285, or send a request through the form above, and we'll get back to you to set up a meet & greet." },
    { q: "Can we meet before the first booking?", a: "Yes. Every new client starts with a free meet & greet at home, so we can meet your dog, go over the routine and pick up keys.", sample: true },
    { q: "How much does it cost?", a: "Walks start at $25 for 30 minutes, drop-in visits at $22, and overnight stays at $85 per night. Holiday rates may apply.", sample: true },
    { q: "Do you take care of more than one dog?", a: "Absolutely. Multi-dog households are welcome, and each additional dog from the same home is a small add-on.", sample: true },
    { q: "Can you give medications?", a: "Yes. We can give pills and liquid medications and follow special feeding instructions. Just walk us through it at the meet & greet.", sample: true },
    { q: "Will I get updates?", a: "You'll get a text and a photo after every visit, so you always know how your dog is doing.", sample: true },
    { q: "Are you insured?", a: "Yes. Paws and Tails is fully insured for dog walking and pet sitting.", sample: true },
    { q: "How far ahead should I book?", a: "A week's notice is ideal, and for holidays book as early as you can. Last-minute requests are welcome too, so just call or text.", sample: true },
    { q: "How do keys work?", a: "Most clients leave a spare key or share a door code at the meet & greet. Keys are labeled with a code, never with your address.", sample: true },
  ] satisfies Faq[],
  logo: null as string | null,
  /** Stock photos (files in ../assets, credits in ../assets/CREDITS.md). */
  photos: {
    hero: { src: "/demos/paws-and-tails-dog-sitting/hero.webp", alt: "Happy golden retriever walking on a leash" } as DemoPhoto,
    services: [
      { src: "/demos/paws-and-tails-dog-sitting/service-walking.webp", alt: "White dog on a red leash walking through a park" },
      { src: "/demos/paws-and-tails-dog-sitting/service-dropin.webp", alt: "A hand patting a happy dog at home" },
      { src: "/demos/paws-and-tails-dog-sitting/service-overnight.webp", alt: "Beagle sleeping in a cozy bed" },
      { src: "/demos/paws-and-tails-dog-sitting/service-puppy-senior.webp", alt: "Beagle puppy lying next to a stuffed toy" },
    ] as DemoPhoto[],
    gallery: [
      { src: "/demos/paws-and-tails-dog-sitting/gallery-1.webp", alt: "Corgi sitting in a park with autumn leaves" },
      { src: "/demos/paws-and-tails-dog-sitting/gallery-2.webp", alt: "Senior Labrador resting on a rug at home" },
      { src: "/demos/paws-and-tails-dog-sitting/gallery-3.webp", alt: "Puppy chewing a toy in the grass" },
      { src: "/demos/paws-and-tails-dog-sitting/gallery-4.webp", alt: "Golden retriever trotting along a garden path" },
    ] as DemoPhoto[],
    about: { src: "/demos/paws-and-tails-dog-sitting/about.webp", alt: "A hand gently petting a contented dog" } as DemoPhoto,
  },
} satisfies DemoData & Record<string, unknown>;
