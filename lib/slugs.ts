// Lightweight slug/name maps shared by client components (kept separate from the big
// page-content files so they don't bloat client bundles).

export const SERVICE_SLUGS = [
  { slug: "websites", name: "Websites", full: "Websites That Win Business", sym: "Ws", color: "#c8f5ec", ink: "#0f766e" },
  { slug: "workflows-automation", name: "Workflows & Automation", full: "Workflows & Automation", sym: "Au", color: "#dbe8ff", ink: "#1f6feb" },
  { slug: "track-optimize", name: "Track & Optimize", full: "Track, Monitor & Optimize", sym: "Op", color: "#dcf3df", ink: "#237a34" },
  { slug: "ai", name: "AI Implementation", full: "AI That Never Misses", sym: "Ai", color: "#fdebc8", ink: "#a15c00" },
] as const;

/** Industry page slug -> display name, and the label used by the /free-mockup questionnaire. */
export const INDUSTRY_SLUGS = [
  { slug: "plumbing", name: "Plumbing", mockup: "Plumbing" },
  { slug: "hvac", name: "HVAC", mockup: "HVAC" },
  { slug: "electricians", name: "Electricians", mockup: "Electrician" },
  { slug: "roofing", name: "Roofing", mockup: "Roofing" },
  { slug: "landscaping", name: "Landscaping", mockup: "Landscaping" },
  { slug: "contractors", name: "Contractors & Remodelers", mockup: "Contractor / Remodeling" },
  { slug: "cleaning", name: "Cleaning", mockup: "Cleaning" },
  { slug: "auto-repair", name: "Auto Repair", mockup: "Auto Repair" },
  { slug: "salons-barbers", name: "Salons & Barbers", mockup: "Salon / Barber" },
  { slug: "restaurants", name: "Restaurants", mockup: "Restaurant" },
  { slug: "dental", name: "Dental", mockup: "Dental" },
  { slug: "real-estate", name: "Real Estate", mockup: "Real Estate" },
] as const;

export const AREA_SLUGS = [
  { slug: "hackensack", name: "Hackensack" },
  { slug: "paramus", name: "Paramus" },
  { slug: "fort-lee", name: "Fort Lee" },
  { slug: "englewood", name: "Englewood" },
  { slug: "teaneck", name: "Teaneck" },
  { slug: "fair-lawn", name: "Fair Lawn" },
  { slug: "ridgewood", name: "Ridgewood" },
  { slug: "mahwah", name: "Mahwah" },
] as const;

export const serviceBySlug = (s: string) => SERVICE_SLUGS.find((x) => x.slug === s);
export const industryBySlug = (s: string) => INDUSTRY_SLUGS.find((x) => x.slug === s);
export const areaBySlug = (s: string) => AREA_SLUGS.find((x) => x.slug === s);
