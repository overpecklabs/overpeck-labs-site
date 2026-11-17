import type { Field, StepDef } from "./types";

// Every onboarding step, as data. The tier wizards (lib/portal/wizards/*) pick and order these.
// REQUIRED fields here must match private.portal_required() in supabase/migrations/20261117140100_client_portal_functions.sql.

const REVIEW_NOTE = "Look everything over. Use Edit to fix anything, then submit. We'll take it from there.";

export const STEPS = {
  basics: {
    id: "basics",
    title: "Business basics",
    description: "The facts that go on your site and help us reach you.",
    fields: [
      { kind: "text", key: "business_name", label: "Business name", required: true, max: 200 },
      { kind: "text", key: "contact_name", label: "Your name", required: true, max: 200 },
      { kind: "text", key: "phone", label: "Phone number to show on the site", required: true, input: "tel", max: 40, placeholder: "(201) 555-0123" },
      {
        kind: "text",
        key: "lead_email",
        label: "Email where leads should go",
        required: true,
        input: "email",
        max: 200,
        help: "Private. We'll send quote requests here, and we never publish it on your site.",
      },
      { kind: "text", key: "trade", label: "Trade or type of business", required: true, max: 200, placeholder: "Electrician, plumber, landscaper…" },
      { kind: "textarea", key: "service_area", label: "Towns and service area", required: true, max: 1500, rows: 3, placeholder: "Hackensack, Paramus, Ridgewood, and nearby" },
      { kind: "textarea", key: "hours", label: "Business hours", required: true, max: 800, rows: 3, placeholder: "Mon–Fri 7am–5pm, Sat by appointment" },
      { kind: "text", key: "license_number", label: "License number", max: 100, help: "Optional. Customers like to see it." },
      { kind: "text", key: "years_in_business", label: "Years in business", max: 40 },
    ],
  },
  brand: {
    id: "brand",
    title: "Brand",
    description: "Your logo, colors and the look you want.",
    fields: [
      { kind: "upload", key: "logo", label: "Logo", slot: "logo", help: "PNG, JPG, SVG or PDF, up to 10 MB. No logo? Skip it and tell us below." },
      { kind: "colors", key: "colors", label: "Brand colors", help: "Pick up to four, or tell us you're not sure." },
      {
        kind: "select",
        key: "style",
        label: "Style you like",
        options: [
          { value: "modern", label: "Clean and modern" },
          { value: "bold", label: "Bold and strong" },
          { value: "friendly", label: "Friendly and warm" },
          { value: "classic", label: "Classic and trusted" },
          { value: "unsure", label: "Not sure, show me ideas" },
        ],
      },
      { kind: "text", key: "current_website", label: "Current website", input: "url", max: 300, placeholder: "https://" },
      { kind: "textarea", key: "social_links", label: "Social media links", max: 1500, rows: 3, help: "Facebook, Instagram, anything you use. One per line." },
      { kind: "textarea", key: "review_links", label: "Review links", max: 1500, rows: 3, help: "Google, Yelp, Angi, and so on. One per line." },
    ],
  },
  services: {
    id: "services",
    title: "Services",
    description: "What you do, in your words.",
    fields: [
      {
        kind: "repeater",
        key: "services",
        label: "Your services",
        itemLabel: "Service",
        addLabel: "Add a service",
        min: 1,
        max: 25,
        required: true,
        fields: [
          { kind: "text", key: "name", label: "Service", required: true, max: 120 },
          { kind: "textarea", key: "description", label: "Short description", max: 500, rows: 2 },
          { kind: "text", key: "starting_at", label: "Starting at (optional)", max: 40, placeholder: "$150" },
        ],
      },
      { kind: "toggle", key: "show_prices", label: "Show prices on the site?", help: "If off, we leave the prices out and keep the descriptions." },
    ],
  },
  photos: {
    id: "photos",
    title: "Photos",
    description: "Real jobs, your team and your truck make the site yours.",
    fields: [
      { kind: "upload", key: "photos", label: "Job, team and truck photos", slot: "photos", help: "Images only, up to 15 MB each, up to 40 photos." },
      { kind: "textarea", key: "photo_notes", label: "Anything we should know about the photos?", max: 800, rows: 2 },
    ],
  },
  pages: {
    id: "pages",
    title: "Website pages and quote form",
    description: "What the site includes and what you want visitors to do.",
    fields: [
      {
        kind: "multi",
        key: "pages",
        label: "Pages to include",
        required: true,
        options: [
          { value: "home", label: "Home" },
          { value: "about", label: "About" },
          { value: "services", label: "Services" },
          { value: "gallery", label: "Photo gallery" },
          { value: "reviews", label: "Reviews" },
          { value: "areas", label: "Towns we serve" },
          { value: "faq", label: "FAQ" },
          { value: "contact", label: "Contact / quote request" },
          { value: "financing", label: "Financing" },
          { value: "careers", label: "Careers" },
        ],
      },
      {
        kind: "select",
        key: "main_goal",
        label: "Main goal of the site",
        required: true,
        options: [
          { value: "calls", label: "Phone calls" },
          { value: "quotes", label: "Quote requests" },
          { value: "bookings", label: "Bookings" },
        ],
      },
      {
        kind: "multi",
        key: "quote_fields",
        label: "Quote form fields",
        help: "What should visitors fill in?",
        options: [
          { value: "name", label: "Name" },
          { value: "phone", label: "Phone" },
          { value: "email", label: "Email" },
          { value: "address", label: "Address or ZIP code" },
          { value: "service", label: "Service needed" },
          { value: "description", label: "Job description" },
          { value: "timing", label: "Preferred timing" },
          { value: "photos", label: "Photo upload" },
          { value: "source", label: "How they found you" },
        ],
      },
      { kind: "textarea", key: "avoid", label: "Anything to avoid?", max: 1000, rows: 3, help: "Words, colors, claims or competitors you don't want on the site." },
    ],
  },
  domain: {
    id: "domain",
    title: "Domain and hosting",
    description: "Where your website address lives. Please don't enter any passwords here.",
    fields: [
      {
        kind: "select",
        key: "has_domain",
        label: "Do you own a domain name?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No, I need one" },
          { value: "unsure", label: "Not sure" },
        ],
      },
      { kind: "text", key: "domain_name", label: "Your domain", max: 200, placeholder: "yourbusiness.com", showIf: { key: "has_domain", equals: "yes" } },
      {
        kind: "text",
        key: "registrar",
        label: "Where is it registered, or who hosts your DNS?",
        max: 200,
        placeholder: "GoDaddy, Namecheap, Squarespace…",
        showIf: { key: "has_domain", equals: "yes" },
      },
      {
        kind: "select",
        key: "access_choice",
        label: "How should we get access?",
        required: true,
        options: [
          { value: "delegate", label: "I'll add you as a delegate or user at my registrar" },
          { value: "call", label: "Please call me and we'll arrange it together" },
          { value: "none", label: "I don't have a domain yet, so there's nothing to share" },
        ],
      },
      { kind: "note", key: "pw_note", label: "About passwords", text: "We never need your password. If you add us as a delegate or user, you stay in control and can remove us any time." },
    ],
  },
  chat: {
    id: "chat",
    title: "AI website chat",
    description: "Teach the chat to answer like you would.",
    fields: [
      {
        kind: "repeater",
        key: "faqs",
        label: "Top customer questions and your answers",
        itemLabel: "Question",
        addLabel: "Add a question",
        min: 1,
        max: 10,
        required: true,
        fields: [
          { kind: "text", key: "question", label: "Question customers ask", required: true, max: 300 },
          { kind: "textarea", key: "answer", label: "Your answer", required: true, max: 800, rows: 3 },
        ],
      },
      {
        kind: "textarea",
        key: "never_say",
        label: "What should the chat never quote or promise?",
        max: 1200,
        rows: 3,
        placeholder: "Exact prices, arrival times, warranties…",
      },
      {
        kind: "multi",
        key: "lead_info",
        label: "What should the chat collect from a lead?",
        required: true,
        options: [
          { value: "name", label: "Name" },
          { value: "phone", label: "Phone" },
          { value: "email", label: "Email" },
          { value: "address", label: "Address or ZIP code" },
          { value: "service", label: "Service needed" },
          { value: "timing", label: "Preferred timing" },
          { value: "description", label: "Short description of the job" },
        ],
      },
      {
        kind: "textarea",
        key: "handoff",
        label: "When should the chat hand off to a call?",
        required: true,
        max: 1200,
        rows: 3,
        placeholder: "Emergencies, large jobs, anyone who asks for a person…",
      },
    ],
  },
  alerts: {
    id: "alerts",
    title: "Lead alerts by text",
    description: "Where we text you when a new lead comes in.",
    fields: [
      {
        kind: "repeater",
        key: "alert_numbers",
        label: "Mobile numbers to alert",
        itemLabel: "Number",
        addLabel: "Add a number",
        min: 1,
        max: 5,
        required: true,
        fields: [
          { kind: "text", key: "name", label: "Name", max: 120 },
          { kind: "text", key: "number", label: "Mobile number", required: true, input: "tel", max: 40 },
        ],
      },
      {
        kind: "consent",
        key: "sms_consent",
        label: "I agree that Overpeck Labs may text lead alerts to the numbers above. Message and data rates may apply. Reply STOP to opt out.",
        required: true,
      },
      { kind: "toggle", key: "quiet_enabled", label: "Pause alerts during quiet hours?" },
      { kind: "text", key: "quiet_start", label: "Quiet hours start", input: "time", showIf: { key: "quiet_enabled", equals: true } },
      { kind: "text", key: "quiet_end", label: "Quiet hours end", input: "time", showIf: { key: "quiet_enabled", equals: true } },
    ],
  },
  gbp: {
    id: "gbp",
    title: "Google Business Profile",
    description: "Your listing on Google Search and Maps.",
    fields: [
      {
        kind: "select",
        key: "has_gbp",
        label: "Do you have a Google Business Profile?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No, please create one" },
          { value: "unsure", label: "Not sure" },
        ],
      },
      { kind: "text", key: "gbp_link", label: "Link to your profile", input: "url", max: 400, placeholder: "https://", showIf: { key: "has_gbp", equals: "yes" } },
      {
        kind: "note",
        key: "gbp_access_note",
        label: "Giving us manager access",
        text: "Open your profile on Google, go to Business Profile settings, choose People and access, and add {{support_email}} as a Manager. If you'd rather not, call us and we'll do it together. Please don't share any passwords.",
      },
      {
        kind: "select",
        key: "manager_access",
        label: "Manager access",
        options: [
          { value: "added", label: "I've added you" },
          { value: "later", label: "I'll add you soon" },
          { value: "call", label: "Please call me" },
        ],
      },
      {
        kind: "textarea",
        key: "categories",
        label: "Service categories",
        required: true,
        max: 800,
        rows: 3,
        help: "Your main category first, then others. For example: Electrician, EV charging station installer.",
      },
    ],
  },
  content: {
    id: "content",
    title: "Monthly content",
    description: "What we post and update each month.",
    fields: [
      { kind: "textarea", key: "topics", label: "Topics you'd like covered", max: 1500, rows: 3 },
      { kind: "textarea", key: "promos", label: "Seasonal promos or offers", max: 1500, rows: 3, placeholder: "Spring tune-up special, winter heating checks…" },
      { kind: "text", key: "approver_name", label: "Who approves updates?", required: true, max: 200 },
      {
        kind: "select",
        key: "reach_method",
        label: "Best way to reach them",
        required: true,
        options: [
          { value: "call", label: "Phone call" },
          { value: "text", label: "Text message" },
          { value: "email", label: "Email" },
        ],
      },
      { kind: "text", key: "reach_detail", label: "Number or email to use", max: 200 },
    ],
  },
  phone: {
    id: "phone",
    title: "Phone line",
    description: "The number your customers call. We'll set up call forwarding with you.",
    fields: [
      { kind: "text", key: "business_number", label: "Business number customers call", required: true, input: "tel", max: 40 },
      { kind: "text", key: "carrier", label: "Phone carrier or provider", required: true, max: 120, placeholder: "Verizon, RingCentral, Google Voice…" },
      {
        kind: "select",
        key: "forwarding",
        label: "Does call forwarding work on this line?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "unsure", label: "Not sure" },
          { value: "no", label: "No, or my carrier doesn't allow it" },
        ],
      },
      { kind: "textarea", key: "phone_notes", label: "Anything we should know about your phone setup?", max: 1000, rows: 3 },
    ],
  },
  script: {
    id: "script",
    title: "Receptionist script",
    description: "How the receptionist greets callers and what it can answer.",
    fields: [
      { kind: "textarea", key: "greeting", label: "Greeting", required: true, max: 500, rows: 3, placeholder: "Thanks for calling Smith Electric, how can I help?" },
      { kind: "text", key: "name_pronunciation", label: "How to say your business name", max: 200, help: "Spell it out if it's tricky." },
      {
        kind: "repeater",
        key: "caller_faqs",
        label: "Top caller questions and answers",
        itemLabel: "Question",
        addLabel: "Add a question",
        min: 1,
        max: 10,
        required: true,
        fields: [
          { kind: "text", key: "question", label: "What callers ask", required: true, max: 300 },
          { kind: "textarea", key: "answer", label: "Your answer", required: true, max: 800, rows: 3 },
        ],
      },
      { kind: "textarea", key: "avoid_topics", label: "Topics to steer away from", max: 1200, rows: 3, placeholder: "Pricing, legal questions, competitors…" },
    ],
  },
  booking: {
    id: "booking",
    title: "Booking rules",
    description: "What the receptionist can book, and when.",
    fields: [
      { kind: "textarea", key: "job_types", label: "Job types it can book", required: true, max: 1200, rows: 3 },
      { kind: "textarea", key: "availability", label: "Availability windows", required: true, max: 1200, rows: 3, placeholder: "Mon–Fri, 8am–4pm" },
      { kind: "text", key: "lead_time", label: "Lead time", max: 200, placeholder: "At least 24 hours' notice" },
      { kind: "textarea", key: "service_limits", label: "Service area limits", max: 1000, rows: 2 },
      {
        kind: "select",
        key: "confirm_method",
        label: "How is a booking confirmed?",
        required: true,
        options: [
          { value: "calendar", label: "Calendar link" },
          { value: "callback", label: "We call the customer back" },
        ],
      },
      { kind: "text", key: "calendar_link", label: "Calendar link", input: "url", max: 400, placeholder: "https://", showIf: { key: "confirm_method", equals: "calendar" } },
      { kind: "textarea", key: "callback_jobs", label: "Jobs that always need a callback", max: 1000, rows: 2 },
    ],
  },
  transfers: {
    id: "transfers",
    title: "Transfers and lead texts",
    description: "When to put a call through to you, and who gets the lead summaries.",
    fields: [
      { kind: "text", key: "transfer_number", label: "Number to transfer calls to", required: true, input: "tel", max: 40 },
      {
        kind: "multi",
        key: "transfer_when",
        label: "When should it transfer?",
        options: [
          { value: "emergency", label: "Emergencies" },
          { value: "existing", label: "Existing customers" },
          { value: "by_name", label: "Callers who ask for you by name" },
          { value: "large", label: "Large or commercial jobs" },
          { value: "stuck", label: "Anything it can't answer" },
        ],
      },
      { kind: "textarea", key: "transfer_notes", label: "Other transfer rules", max: 1000, rows: 2 },
      {
        kind: "repeater",
        key: "summary_numbers",
        label: "Numbers that get lead summaries by text",
        itemLabel: "Number",
        addLabel: "Add a number",
        min: 1,
        max: 5,
        required: true,
        fields: [
          { kind: "text", key: "name", label: "Name", max: 120 },
          { kind: "text", key: "number", label: "Mobile number", required: true, input: "tel", max: 40 },
        ],
      },
    ],
  },
  review: {
    id: "review",
    title: "Review and submit",
    description: REVIEW_NOTE,
    fields: [],
    review: true,
  },
} satisfies Record<string, StepDef>;

export type StepId = keyof typeof STEPS;

export const STEP_LIBRARY: Record<string, StepDef> = STEPS;

export function isField(f: Field): f is Exclude<Field, { kind: "note" | "upload" }> {
  return f.kind !== "note" && f.kind !== "upload";
}
