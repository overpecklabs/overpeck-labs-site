// Sample homepage designs for FICTIONAL local businesses, built from common industry
// design patterns. Names, copy and phone numbers are invented (555-01xx numbers are
// reserved for fiction). Photos: see public/mock/CREDITS.md.

export const FONTS = {
  grotesk: "var(--font-grotesk), system-ui, sans-serif",
  inter: "var(--font-inter), system-ui, sans-serif",
  playfair: "var(--font-playfair), Georgia, serif",
  bebas: "var(--font-bebas), Impact, 'Arial Narrow', sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  rounded: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif",
  verdana: "Verdana, Geneva, sans-serif",
} as const;

type FontKey = keyof typeof FONTS;

export type PeekItem = { label: string; sub?: string; icon?: string; img?: string; pos?: string };

export type Industry = {
  slug: string;
  industry: string;
  name: string;
  /** monogram letters or an icon key for the logo mark */
  mark: { icon?: string; text?: string };
  utility: { left: string; right: string };
  nav: string[];
  navCta: string;
  hero: {
    img: string;
    alt: string;
    headline: string;
    sub: string;
    cta: string;
    cta2?: string;
    align?: "left" | "center";
    /** CSS background layered over the photo for legibility */
    overlay: string;
    pills?: string[];
    /** CSS art used if the photo fails to load */
    fallback: string;
  };
  trust: string[];
  peek: { title: string; kind: "tiles" | "thumbs" | "services" | "steps"; items: PeekItem[]; note?: string };
  heading: FontKey;
  body: FontKey;
  upper?: boolean;
  tracking?: string;
  c: {
    bg: string; // page background
    fg: string; // page text
    muted: string;
    accent: string; // primary button
    onAccent: string;
    bar: string; // utility bar
    barFg: string;
    heroFg: string; // text over the photo
    soft: string; // pills / tiles background
  };
};

const img = (slug: string, f: string) => `/mock/${slug}/${f}.webp`;

export const INDUSTRIES: Industry[] = [
  {
    slug: "plumbing",
    industry: "Plumbing",
    name: "Bergen Flow Plumbing",
    mark: { icon: "drop" },
    utility: { left: "Emergency Service", right: "(201) 555-0101 · Mon–Sat 7am–7pm" },
    nav: ["Services", "About", "Reviews", "Contact"],
    navCta: "Call Now",
    hero: {
      img: img("plumbing", "hero"),
      alt: "Plumber working under a kitchen sink",
      headline: "Plumbing Done Right, The First Time",
      sub: "Fast, clean repairs from licensed local plumbers.",
      cta: "Schedule Service",
      overlay: "linear-gradient(90deg, rgba(8,26,52,0.92) 0%, rgba(8,26,52,0.75) 50%, rgba(8,26,52,0.1) 100%)",
      fallback: "linear-gradient(135deg,#0b2545,#1d6fe0)",
    },
    trust: ["Licensed & Insured", "Family-Owned Since 2009", "Sample reviews", "Financing Available"],
    peek: {
      title: "Our Services",
      kind: "tiles",
      items: [
        { label: "Drains", icon: "drain" },
        { label: "Water Heaters", icon: "flame" },
        { label: "Leak Detection", icon: "drop" },
      ],
    },
    heading: "inter",
    body: "inter",
    c: { bg: "#ffffff", fg: "#0b2545", muted: "#5b6b85", accent: "#e03a2f", onAccent: "#fff", bar: "#0b2545", barFg: "#dbe7ff", heroFg: "#ffffff", soft: "#eef3fb" },
  },
  {
    slug: "hvac",
    industry: "HVAC",
    name: "Palisade Air",
    mark: { icon: "fan" },
    utility: { left: "Same-Day Service Available", right: "(201) 555-0102" },
    nav: ["Heating", "Cooling", "Plans", "Financing"],
    navCta: "Book Online",
    hero: {
      img: img("hvac", "hero"),
      alt: "Technician servicing an outdoor AC unit",
      headline: "Comfort You Can Count On, Every Season",
      sub: "Heating & cooling repair, installs and maintenance plans.",
      cta: "Book a Tune-Up",
      overlay: "linear-gradient(90deg, rgba(28,49,74,0.93) 0%, rgba(28,49,74,0.72) 55%, rgba(28,49,74,0.05) 100%)",
      fallback: "linear-gradient(135deg,#2f5d8a,#f08a24)",
    },
    trust: ["Upfront Pricing", "100% Satisfaction Guarantee", "Sample reviews", "0% Financing Options"],
    peek: {
      title: "How Can We Help?",
      kind: "tiles",
      items: [
        { label: "Heating", icon: "flame" },
        { label: "Cooling", icon: "snow" },
        { label: "Indoor Air", icon: "wind" },
      ],
    },
    heading: "rounded",
    body: "verdana",
    c: { bg: "#f7f9fc", fg: "#1c314a", muted: "#5d6f84", accent: "#f08a24", onAccent: "#1c1206", bar: "#2f5d8a", barFg: "#e6f0fa", heroFg: "#ffffff", soft: "#e9eff6" },
  },
  {
    slug: "electrician",
    industry: "Electrician",
    name: "Volt Line Electric",
    mark: { icon: "bolt" },
    utility: { left: "Licensed Master Electricians", right: "(201) 555-0103 · Emergency calls" },
    nav: ["Residential", "Commercial", "EV Chargers"],
    navCta: "Get a Quote",
    hero: {
      img: img("electrician", "hero"),
      alt: "Electrician testing an electrical panel",
      headline: "Safe, Reliable Power For Your Home",
      sub: "Panel upgrades, lighting, EV chargers and repairs.",
      cta: "Request Service",
      overlay: "linear-gradient(90deg, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.78) 50%, rgba(17,17,17,0.15) 100%)",
      fallback: "linear-gradient(135deg,#111,#3a3a3a 60%,#ffd60a)",
    },
    trust: ["Licensed · Bonded · Insured", "Workmanship Warranty", "Sample reviews"],
    peek: {
      title: "What We Do",
      kind: "tiles",
      items: [
        { label: "Panels", icon: "panel" },
        { label: "Lighting", icon: "bulb" },
        { label: "EV Charging", icon: "plug" },
      ],
    },
    heading: "bebas",
    body: "inter",
    upper: true,
    tracking: "0.03em",
    c: { bg: "#161616", fg: "#f5f5f5", muted: "#a3a3a3", accent: "#ffd60a", onAccent: "#111", bar: "#ffd60a", barFg: "#111", heroFg: "#ffffff", soft: "#232323" },
  },
  {
    slug: "roofing",
    industry: "Roofing",
    name: "Ridgeline Roofing Co.",
    mark: { icon: "roof" },
    utility: { left: "Financing Available · Serving NJ Since 2004", right: "(201) 555-0104" },
    nav: ["Roofing", "Gutters", "Storm Damage", "Gallery"],
    navCta: "Free Estimate",
    hero: {
      img: img("roofing", "hero"),
      alt: "Shingle rooftops on neighboring homes",
      headline: "Roofs Built To Weather Anything",
      sub: "Repairs, full replacements and storm restoration.",
      cta: "Free Roof Estimate",
      overlay: "linear-gradient(0deg, rgba(36,33,30,0.95) 0%, rgba(36,33,30,0.55) 55%, rgba(36,33,30,0.15) 100%)",
      fallback: "linear-gradient(160deg,#4a4038,#b87333)",
    },
    trust: ["Workmanship Warranty", "Licensed & Insured", "Storm Repair Experts", "Sample reviews"],
    peek: {
      title: "Roofing Services",
      kind: "tiles",
      items: [
        { label: "Repair", icon: "hammer" },
        { label: "Replace", icon: "roof" },
        { label: "Gutters", icon: "gutter" },
      ],
    },
    heading: "grotesk",
    body: "verdana",
    c: { bg: "#f6f1e8", fg: "#24211e", muted: "#6f665d", accent: "#b87333", onAccent: "#fff", bar: "#24211e", barFg: "#e8d9c4", heroFg: "#fbf6ee", soft: "#ece3d4" },
  },
  {
    slug: "landscaping",
    industry: "Landscaping",
    name: "Fieldstone Landscaping",
    mark: { icon: "leaf" },
    utility: { left: "Design · Build · Maintain", right: "(201) 555-0105" },
    nav: ["Design", "Hardscapes", "Portfolio", "About"],
    navCta: "Contact",
    hero: {
      img: img("landscaping", "hero"),
      alt: "Backyard pergola patio with string lights",
      headline: "Outdoor Spaces, Beautifully Made",
      sub: "Patios, plantings and outdoor living, designed for you.",
      cta: "Get a Free Design Quote",
      overlay: "linear-gradient(90deg, rgba(22,46,33,0.9) 0%, rgba(22,46,33,0.6) 55%, rgba(22,46,33,0.05) 100%)",
      fallback: "linear-gradient(135deg,#1f3d2b,#7a9a4a)",
    },
    trust: ["Custom Design Plans", "Fully Insured", "Sample reviews"],
    peek: {
      title: "Recent Projects",
      kind: "thumbs",
      items: [
        { label: "Fire Pit Patio", img: img("landscaping", "thumb1") },
        { label: "Cedar Pergola", img: img("landscaping", "thumb2") },
        { label: "Evening Retreat", img: img("landscaping", "hero"), pos: "30% 60%" },
      ],
      note: "Sample projects",
    },
    heading: "playfair",
    body: "inter",
    c: { bg: "#f7f3e8", fg: "#1f3d2b", muted: "#5f6f60", accent: "#c8a24a", onAccent: "#1f2a16", bar: "#1f3d2b", barFg: "#e9e2c8", heroFg: "#fbf8ef", soft: "#ece6d2" },
  },
  {
    slug: "cleaning",
    industry: "Cleaning",
    name: "Fresh Nest Cleaning",
    mark: { icon: "sparkle" },
    utility: { left: "Book online in 60 seconds", right: "(201) 555-0106" },
    nav: ["Services", "Pricing", "How It Works"],
    navCta: "Book Now",
    hero: {
      img: img("cleaning", "hero"),
      alt: "Bright, clean kitchen with a marble island",
      headline: "Come Home To Spotless",
      sub: "Trusted home cleaning, on your schedule.",
      cta: "Book a Clean",
      align: "center",
      overlay: "linear-gradient(0deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0.45) 100%)",
      pills: ["Standard", "Deep", "Move-in"],
      fallback: "linear-gradient(135deg,#e6faf7,#7fd6cb)",
    },
    trust: ["Bonded & Insured", "Eco-Friendly Products", "Happiness Guarantee", "Sample reviews"],
    peek: {
      title: "How It Works",
      kind: "steps",
      items: [
        { label: "Book Online", sub: "Pick a time" },
        { label: "We Clean", sub: "Same team each visit" },
        { label: "You Relax", sub: "Enjoy your home" },
      ],
    },
    heading: "rounded",
    body: "rounded",
    c: { bg: "#ffffff", fg: "#21414a", muted: "#5f7c83", accent: "#2bb3a3", onAccent: "#fff", bar: "#e8f7f5", barFg: "#21414a", heroFg: "#21414a", soft: "#effaf8" },
  },
  {
    slug: "auto-repair",
    industry: "Auto Repair",
    name: "Route 4 Auto Care",
    mark: { icon: "gear" },
    utility: { left: "Mon–Fri 7:30–6 · Sat 8–2", right: "(201) 555-0107" },
    nav: ["Services", "Specials", "About", "Contact"],
    navCta: "Book Service",
    hero: {
      img: img("auto-repair", "hero"),
      alt: "Mechanic's hands working on an engine with a wrench",
      headline: "Honest Repairs. Done Right.",
      sub: "Diagnostics, brakes, maintenance and more for all makes.",
      cta: "Book Service",
      overlay: "linear-gradient(90deg, rgba(24,26,30,0.95) 0%, rgba(24,26,30,0.78) 50%, rgba(24,26,30,0.1) 100%)",
      fallback: "linear-gradient(135deg,#1d2025,#4a4f57 70%,#d92d2d)",
    },
    trust: ["Certified Technicians", "12-Mo Parts & Labor Warranty", "All Makes & Models", "Sample reviews"],
    peek: {
      title: "Popular Services",
      kind: "tiles",
      items: [
        { label: "Oil Change", icon: "oil" },
        { label: "Brakes", icon: "brake" },
        { label: "Inspection", icon: "clipboard" },
      ],
    },
    heading: "bebas",
    body: "verdana",
    upper: true,
    tracking: "0.04em",
    c: { bg: "#1d2025", fg: "#eceef1", muted: "#9aa1a9", accent: "#d92d2d", onAccent: "#fff", bar: "#d92d2d", barFg: "#fff", heroFg: "#ffffff", soft: "#2a2e35" },
  },
  {
    slug: "salon",
    industry: "Salon / Barber",
    name: "Fade & Finch",
    mark: { text: "F&F" },
    utility: { left: "Walk-ins welcome", right: "(201) 555-0108 · Tue–Sun" },
    nav: ["Services", "Team", "Book"],
    navCta: "Book Now",
    hero: {
      img: img("salon", "hero"),
      alt: "Barber chairs in a warmly lit shop",
      headline: "Sharp Cuts. Classic Shaves.",
      sub: "A modern barbershop with old-school standards.",
      cta: "Book Now",
      overlay: "linear-gradient(90deg, rgba(10,9,8,0.92) 0%, rgba(10,9,8,0.6) 55%, rgba(10,9,8,0.2) 100%)",
      fallback: "linear-gradient(135deg,#0d0c0b,#3a2f1e 60%,#c9a227)",
    },
    trust: ["Licensed Barbers", "Online Booking", "Sample reviews"],
    peek: {
      title: "Services",
      kind: "services",
      items: [
        { label: "Signature Cut", sub: "45 min · $40" },
        { label: "Hot Towel Shave", sub: "30 min · $35" },
        { label: "Cut & Beard", sub: "60 min · $55" },
      ],
      note: "Sample prices",
    },
    heading: "playfair",
    body: "georgia",
    c: { bg: "#0d0c0b", fg: "#f3ead9", muted: "#a89a84", accent: "#c9a227", onAccent: "#0d0c0b", bar: "#1a1714", barFg: "#c9a227", heroFg: "#f6efe1", soft: "#1c1916" },
  },
  {
    slug: "restaurant",
    industry: "Restaurant",
    name: "Trattoria Lucia",
    mark: { text: "TL" },
    utility: { left: "Tue–Sun 5–10pm · Lunch Fri–Sun", right: "Reservations (201) 555-0109" },
    nav: ["Menu", "Private Events", "Catering", "Visit"],
    navCta: "Reserve",
    hero: {
      img: img("restaurant", "hero"),
      alt: "Spaghetti being lifted from a plate",
      headline: "Handmade Pasta, Family Recipes",
      sub: "A neighborhood trattoria with a wood-fired kitchen.",
      cta: "Reserve a Table",
      cta2: "View Menu",
      overlay: "linear-gradient(90deg, rgba(58,20,22,0.92) 0%, rgba(58,20,22,0.6) 55%, rgba(58,20,22,0.05) 100%)",
      fallback: "linear-gradient(135deg,#5a1f22,#c4673e)",
    },
    trust: ["Fresh Pasta Daily", "Private Dining", "Sample reviews"],
    peek: {
      title: "From the Kitchen",
      kind: "thumbs",
      items: [
        { label: "Pappardelle al Ragù", img: img("restaurant", "thumb1") },
        { label: "Spaghetti Pomodoro", img: img("restaurant", "thumb2") },
        { label: "Nonna's Bolognese", img: img("restaurant", "hero"), pos: "40% 80%" },
      ],
    },
    heading: "playfair",
    body: "georgia",
    c: { bg: "#f7efe1", fg: "#3a1416", muted: "#7a5a50", accent: "#c4673e", onAccent: "#fff", bar: "#6b2232", barFg: "#f3e2cf", heroFg: "#fbf3e6", soft: "#efe2cd" },
  },
  {
    slug: "dental",
    industry: "Dental",
    name: "Bright Path Dental",
    mark: { icon: "tooth" },
    utility: { left: "New patients welcome", right: "(201) 555-0110 · Evening hours" },
    nav: ["Services", "New Patients", "Our Team", "Insurance"],
    navCta: "Book Visit",
    hero: {
      img: img("dental", "hero"),
      alt: "Calm, bright dental operatory",
      headline: "Gentle Dental Care For The Whole Family",
      sub: "Modern dentistry in a calm, comfortable office.",
      cta: "Request Appointment",
      overlay: "linear-gradient(90deg, rgba(247,250,253,0.97) 0%, rgba(247,250,253,0.86) 50%, rgba(247,250,253,0.1) 100%)",
      fallback: "linear-gradient(135deg,#eaf3fb,#9cc4e4)",
    },
    trust: ["Most Insurance Accepted", "Same-Week Visits", "Sample reviews"],
    peek: {
      title: "Our Services",
      kind: "tiles",
      items: [
        { label: "Cleanings", icon: "sparkle" },
        { label: "Whitening", icon: "tooth" },
        { label: "Implants", icon: "shield" },
      ],
    },
    heading: "inter",
    body: "inter",
    c: { bg: "#f7fafd", fg: "#1d3346", muted: "#5d7385", accent: "#5b9bd5", onAccent: "#fff", bar: "#dcebf7", barFg: "#1d3346", heroFg: "#1d3346", soft: "#eaf2f9" },
  },
  {
    slug: "remodeling",
    industry: "Contractor / Remodeling",
    name: "Cornerstone Remodeling",
    mark: { text: "C" },
    utility: { left: "Kitchens · Baths · Additions", right: "(201) 555-0111" },
    nav: ["Projects", "Process", "About"],
    navCta: "Get Started",
    hero: {
      img: img("remodeling", "hero"),
      alt: "Finished kitchen with a walnut island",
      headline: "Remodels Built Around How You Live",
      sub: "Design to final walkthrough, with one dedicated crew.",
      cta: "Request a Walkthrough",
      overlay: "linear-gradient(90deg, rgba(28,24,21,0.93) 0%, rgba(28,24,21,0.65) 50%, rgba(28,24,21,0.05) 100%)",
      fallback: "linear-gradient(135deg,#1c1815,#6b4a33)",
    },
    trust: ["In-House Trades", "Written Guarantee", "20 Years Building", "Sample reviews"],
    peek: {
      title: "Featured Projects",
      kind: "thumbs",
      items: [
        { label: "Ridgewood Kitchen", img: img("remodeling", "thumb1") },
        { label: "Tenafly Kitchen", img: img("remodeling", "thumb2") },
        { label: "Closter Kitchen", img: img("remodeling", "hero"), pos: "50% 75%" },
      ],
      note: "Sample projects",
    },
    heading: "georgia",
    body: "verdana",
    c: { bg: "#faf7f2", fg: "#1c1815", muted: "#6e6259", accent: "#7a5434", onAccent: "#fff", bar: "#1c1815", barFg: "#e7dccd", heroFg: "#faf6ef", soft: "#efe8dd" },
  },
  {
    slug: "real-estate",
    industry: "Real Estate",
    name: "Maple Lane Realty",
    mark: { text: "ML" },
    utility: { left: "Serving Bergen County", right: "(201) 555-0112" },
    nav: ["Buy", "Sell", "Neighborhoods", "Agents"],
    navCta: "Contact",
    hero: {
      img: img("real-estate", "hero"),
      alt: "Large home lit up at twilight",
      headline: "Find Your Place In Bergen County",
      sub: "Local agents for buying, selling and everything between.",
      cta: "Buy a Home",
      cta2: "Sell Your Home",
      align: "center",
      overlay: "linear-gradient(0deg, rgba(14,14,16,0.88) 0%, rgba(14,14,16,0.45) 60%, rgba(14,14,16,0.25) 100%)",
      fallback: "linear-gradient(160deg,#20253a,#4a3b5c 60%,#c9a96e)",
    },
    trust: ["Local Market Experts", "Free Home Valuation", "Sample reviews"],
    peek: {
      title: "Featured Homes",
      kind: "thumbs",
      items: [
        { label: "Colonial with Porch", sub: "4 bd · 3 ba", img: img("real-estate", "thumb1") },
        { label: "Brick Traditional", sub: "4 bd · 2.5 ba", img: img("real-estate", "thumb2") },
      ],
      note: "Sample listings",
    },
    heading: "playfair",
    body: "inter",
    upper: true,
    tracking: "0.06em",
    c: { bg: "#ffffff", fg: "#111111", muted: "#6b6b6b", accent: "#b08d57", onAccent: "#fff", bar: "#111111", barFg: "#d9c3a0", heroFg: "#ffffff", soft: "#f2efe9" },
  },
];
