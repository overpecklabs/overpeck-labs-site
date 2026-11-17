// Content for /services/[slug]. Each page has its own copy, problems, FAQs and form questions.

export type FormQuestion = { key: string; label: string; type: "text" | "select"; options?: string[] };
export type Faq = { q: string; a: string };

export type ServicePage = {
  slug: "websites" | "workflows-automation" | "track-optimize" | "ai";
  title: string; // <title>
  description: string; // meta description
  h1: string;
  sub: string;
  promise: string; // hub one-liner
  bullets: string[]; // hub bullets
  cta: { label: string; href: string };
  problems: { t: string; d: string }[];
  included: { t: string; d: string }[];
  steps: { t: string; d: string }[];
  demo: "sites" | "workflow" | "dashboard" | "ai";
  bestFor: string[]; // industry slugs
  topAreas: string[]; // area slugs
  connects: { slug: string; why: string }[];
  pricing: "website" | "quote";
  subServices?: { name: string; d: string; points: string[] }[];
  faqs: Faq[];
  questions: FormQuestion[];
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "websites",
    title: "Small Business Websites in Bergen County, NJ | Overpeck Labs",
    description:
      "Custom, mobile-first websites for Bergen County, NJ service businesses, built to turn local searches into calls and booked jobs. Free mockup first, Starter sites from $500 setup + $50/mo.",
    h1: "Websites that bring in calls, not just compliments.",
    sub: "Custom, fast, mobile-first sites for Bergen County service businesses, built around the jobs you want more of.",
    promise: "A site built to turn local searches into calls and booked jobs.",
    bullets: ["Custom design for your trade and your towns", "Tap-to-call, quote forms and booking up front", "Fast, mobile-first and set up for local search"],
    cta: { label: "Get My Free Mockup", href: "/free-mockup" },
    problems: [
      { t: "Your site looks dated", d: "People judge a business in seconds. An old or broken site sends them to the next company in the search results." },
      { t: "Phone visitors can't act", d: "Most local searches happen on a phone. If your number and quote form are hard to find, the visit ends there." },
      { t: "You're invisible locally", d: "Without clear service and town content, you don't show up when someone nearby searches for exactly what you do." },
    ],
    included: [
      { t: "Custom design", d: "Built for your trade and brand, not a recycled template." },
      { t: "Mobile-first build", d: "Fast pages that work one-handed on a phone." },
      { t: "Calls and quote requests", d: "Tap-to-call buttons and short forms on every page." },
      { t: "Local SEO foundations", d: "Page titles, service pages and town content set up properly." },
      { t: "Hosting, SSL and updates", d: "We keep the site online, secure and current." },
      { t: "Small monthly edits", d: "Change hours, photos or a service without a new invoice." },
    ],
    steps: [
      { t: "Free mockup", d: "Answer a few questions and we design your new homepage." },
      { t: "Build and review", d: "We build the full site and you review it before launch." },
      { t: "Launch", d: "We handle the domain, hosting and go-live checks." },
      { t: "Keep it fresh", d: "Small monthly edits keep the site accurate." },
    ],
    demo: "sites",
    bestFor: ["plumbing", "hvac", "electricians", "roofing", "landscaping", "contractors"],
    topAreas: ["hackensack", "paramus", "ridgewood"],
    connects: [
      { slug: "workflows-automation", why: "Every new lead from your site gets an instant follow-up." },
      { slug: "track-optimize", why: "See which pages and searches bring in your calls." },
      { slug: "ai", why: "An AI chatbot answers visitors after hours." },
    ],
    pricing: "website",
    faqs: [
      { q: "What does the free mockup include?", a: "A custom design of your homepage based on your answers to our questionnaire, so you can see the direction before paying anything. There's no obligation." },
      { q: "How much does a website cost?", a: "Starter is $500 setup plus $50/month and covers a custom mobile-first site, hosting, SSL, small edits and a contact/quote form. Growth ($1,000 + $149/mo) adds AI website chat, text lead alerts, Google Business Profile setup and monthly content updates; Pro ($1,500 + $349/mo) adds an AI phone receptionist. No contracts, cancel anytime." },
      { q: "How long does a new site take?", a: "It depends on the size of the site and how quickly photos and details come together. We give you a timeline when we scope the project, before any work starts." },
      { q: "Will my site work well on phones?", a: "Yes. Every site is built mobile-first, with tap-to-call buttons and short forms that are easy to use on a phone." },
      { q: "Can you help me show up on Google?", a: "Every site we build includes basic SEO setup: page titles, service and town content, and a fast, mobile-friendly build. Ongoing local SEO is part of Track & Optimize." },
    ],
    questions: [
      { key: "current_site", label: "Current website (or “none”)", type: "text" },
      { key: "main_goal", label: "What should your new site do most?", type: "select", options: ["Get more calls", "Get quote requests", "Take bookings", "Look more professional"] },
    ],
  },
  {
    slug: "workflows-automation",
    title: "Workflow Automation for Small Businesses in Bergen County, NJ | Overpeck Labs",
    description:
      "Automated follow-ups, booking confirmations, invoice reminders and review requests for Bergen County, NJ businesses, so leads don't go cold while you're on a job.",
    h1: "Automation that handles the busywork after every lead.",
    sub: "Follow-ups, booking confirmations, invoice reminders and review requests that run on their own, so nothing slips while you're on a job.",
    promise: "The follow-up work that happens after every lead, running on its own.",
    bullets: ["Instant replies to new calls, forms and texts", "Booking confirmations and invoice reminders", "Review requests after every finished job"],
    cta: { label: "Get a Free Consultation", href: "#lead-form" },
    problems: [
      { t: "Leads go cold", d: "When nobody follows up the same day, the customer books whoever called back first." },
      { t: "Paperwork at night", d: "Confirmations, reminders and chasing invoices eat the evenings you should have off." },
      { t: "Reviews never happen", d: "Happy customers would leave a review, but nobody asks at the right moment." },
    ],
    included: [
      { t: "Instant lead follow-up", d: "A text or email goes out within minutes of every new inquiry." },
      { t: "Missed-call text-back", d: "Callers you couldn't answer get a quick text so they don't move on." },
      { t: "Booking confirmations", d: "Automatic confirmations and day-before reminders cut no-shows." },
      { t: "Quote follow-ups", d: "A friendly nudge a few days after you send a quote." },
      { t: "Invoice reminders", d: "Polite payment reminders, so you don't have to chase." },
      { t: "Review requests", d: "A review request goes out after each finished job." },
    ],
    steps: [
      { t: "Map your process", d: "We walk through what happens after a lead comes in today." },
      { t: "Build the automations", d: "We write the messages in your voice and set up the triggers." },
      { t: "Test real scenarios", d: "We run test leads, bookings and invoices end to end." },
      { t: "Go live and tune", d: "We switch it on and adjust timing based on what works." },
    ],
    demo: "workflow",
    bestFor: ["hvac", "cleaning", "dental", "salons-barbers", "auto-repair", "contractors"],
    topAreas: ["teaneck", "fair-lawn", "englewood"],
    connects: [
      { slug: "websites", why: "Your site's forms feed straight into the follow-ups." },
      { slug: "track-optimize", why: "Measure which follow-ups turn into booked jobs." },
      { slug: "ai", why: "AI agents take on the trickier back-and-forth." },
    ],
    pricing: "quote",
    faqs: [
      { q: "Do I need to buy new software?", a: "Usually not. We start with the tools you already use where we can, and only suggest something new when it clearly saves time." },
      { q: "Will the messages sound robotic?", a: "We write follow-ups in your voice and keep them short. You approve every message before it goes live." },
      { q: "What happens when a customer replies?", a: "Replies come straight to you or your team, so real conversations stay with real people." },
      { q: "Can I pause or change an automation later?", a: "Yes. Any automation can be paused, edited or switched off, and we'll make changes for you as your business changes." },
    ],
    questions: [
      { key: "time_sink", label: "What task eats the most time?", type: "select", options: ["Following up with leads", "Scheduling and confirmations", "Invoice reminders", "Asking for reviews", "Something else"] },
      { key: "current_tools", label: "What tools do you use now? (CRM, calendar, invoicing)", type: "text" },
    ],
  },
  {
    slug: "track-optimize",
    title: "Lead Tracking, Site Monitoring & Local SEO in Bergen County, NJ | Overpeck Labs",
    description:
      "Call and form tracking, local ranking reports, uptime monitoring and ongoing fixes for Bergen County, NJ businesses, explained in plain English every month.",
    h1: "See what's working. Fix what isn't.",
    sub: "We track calls, forms and rankings, watch your site's health and keep finding new opportunities, then explain it all in plain English.",
    promise: "Know where your leads come from, and keep improving.",
    bullets: ["Calls, forms and rankings tracked in one place", "Site health monitored, problems fixed fast", "A short plain-English report every month"],
    cta: { label: "Get a Free Consultation", href: "#lead-form" },
    problems: [
      { t: "Marketing guesswork", d: "You're paying for ads or listings but can't tell which ones actually bring in jobs." },
      { t: "Silent site problems", d: "A broken form or slow page can cost leads for weeks before anyone notices." },
      { t: "Slipping in local search", d: "Competitors move ahead in nearby searches and you don't know what changed." },
    ],
    included: [
      { t: "Call tracking", d: "See which channel led to each phone call." },
      { t: "Form and booking tracking", d: "Every submission logged with where it came from." },
      { t: "Local ranking reports", d: "Track how you show up for the searches that matter in your towns." },
      { t: "Uptime and speed monitoring", d: "Alerts if the site goes down or slows down." },
      { t: "Fixes and updates", d: "We fix what breaks and keep everything up to date." },
      { t: "Monthly recommendations", d: "What happened, what we fixed and what to try next." },
    ],
    steps: [
      { t: "Set up tracking", d: "Calls, forms, bookings and rankings, connected in one place." },
      { t: "Baseline report", d: "A clear picture of where your leads come from today." },
      { t: "Monitor and fix", d: "We watch site health and handle problems as they appear." },
      { t: "Optimize monthly", d: "Small, steady improvements based on real data." },
    ],
    demo: "dashboard",
    bestFor: ["plumbing", "roofing", "real-estate", "dental", "restaurants", "landscaping"],
    topAreas: ["paramus", "hackensack", "mahwah"],
    connects: [
      { slug: "websites", why: "Tracking starts with a fast, well-built site." },
      { slug: "workflows-automation", why: "See which follow-ups turn leads into jobs." },
      { slug: "ai", why: "Spot the missed calls AI can catch." },
    ],
    pricing: "quote",
    faqs: [
      { q: "What do you actually track?", a: "Calls from your site, form and booking submissions, which pages and searches bring people in, your local rankings, and your site's uptime and speed." },
      { q: "Will I have to read complicated reports?", a: "No. You get a short monthly summary covering what happened, what we fixed and what we recommend next." },
      { q: "Can you really track phone calls?", a: "Yes. Call tracking shows which channel, such as your website, Google listing or an ad, led to each call." },
      { q: "What happens if my site goes down?", a: "Monitoring alerts us when the site is down or unusually slow, and we start working on a fix right away." },
    ],
    questions: [
      { key: "tracking_today", label: "What do you track today?", type: "select", options: ["Nothing yet", "Google Analytics", "Call tracking", "Spreadsheets", "Not sure"] },
      { key: "marketing_spend", label: "Monthly marketing spend", type: "select", options: ["Under $500", "$500–$2,000", "$2,000–$5,000", "$5,000+", "Prefer not to say"] },
    ],
  },
  {
    slug: "ai",
    title: "AI Chatbots, AI Receptionists & AI Agents in Bergen County, NJ | Overpeck Labs",
    description:
      "AI website chatbots, AI call receptionists and AI agents for Bergen County, NJ businesses: answer after hours, handle overflow and book jobs from calls you'd otherwise miss.",
    h1: "AI that catches the leads you can't get to.",
    sub: "An AI chatbot for your website, an AI receptionist for missed calls and AI agents for overflow tasks, set up around how your business actually runs.",
    promise: "Calls, chats and overflow covered, day and night.",
    bullets: ["AI Chatbot answers questions and books from your site", "AI Call Receptionist picks up when you can't", "AI Agents handle quotes, scheduling and follow-ups"],
    cta: { label: "Get a Free Consultation", href: "#lead-form" },
    problems: [
      { t: "Missed calls lose jobs", d: "When you're on a job and a call goes unanswered, many callers simply try the next company." },
      { t: "After-hours visitors leave", d: "Someone browsing your site at 9 p.m. has questions and nobody to answer them." },
      { t: "Repetitive questions pile up", d: "Hours, pricing ranges and availability questions eat your team's day." },
    ],
    included: [
      { t: "AI website chatbot", d: "Answers common questions and captures leads, even after hours." },
      { t: "AI call receptionist", d: "Picks up missed and after-hours calls, then takes details or books." },
      { t: "Calendar booking", d: "Offers open times and books based on rules you set." },
      { t: "Missed-call text-back", d: "A quick text keeps the conversation going." },
      { t: "AI agents", d: "Help with quotes, scheduling and follow-up tasks." },
      { t: "Human handoff", d: "Anything complex gets passed to you with a summary." },
    ],
    subServices: [
      { name: "AI Chatbot", d: "A chat assistant on your website that answers questions in your words and turns visitors into booked jobs.", points: ["Trained on your services, areas and FAQs", "Collects name, number and job details", "Books or requests a callback"] },
      { name: "AI Call Receptionist", d: "Answers when you can't, so a missed call doesn't become a missed job.", points: ["Picks up overflow and after-hours calls", "Asks the right questions for your trade", "Texts you a summary right away"] },
      { name: "AI Agents", d: "Behind-the-scenes helpers for the repetitive work that piles up.", points: ["Drafts quotes from job details", "Handles scheduling back-and-forth", "Keeps follow-ups moving"] },
    ],
    steps: [
      { t: "Learn your business", d: "Services, prices you're comfortable sharing, hours and rules." },
      { t: "Train and configure", d: "We set up the chatbot, receptionist or agents in your voice." },
      { t: "Test calls and chats", d: "We run real scenarios until the answers are right." },
      { t: "Go live and review", d: "We watch conversations and keep improving them." },
    ],
    demo: "ai",
    bestFor: ["plumbing", "hvac", "electricians", "dental", "salons-barbers", "restaurants"],
    topAreas: ["fort-lee", "teaneck", "paramus"],
    connects: [
      { slug: "websites", why: "The chatbot lives on your website." },
      { slug: "workflows-automation", why: "AI conversations kick off the right follow-ups." },
      { slug: "track-optimize", why: "Measure how many leads AI catches." },
    ],
    pricing: "quote",
    faqs: [
      { q: "Will customers know they're talking to AI?", a: "We recommend being upfront. The assistant introduces itself and can hand the conversation to a person whenever needed." },
      { q: "Can the AI book appointments?", a: "Yes. It can offer open times and book into your calendar based on rules you set, like service areas and job types." },
      { q: "What if it doesn't know the answer?", a: "It takes a message or passes the conversation to you instead of guessing." },
      { q: "Does it work at night and on weekends?", a: "Yes. Covering after-hours calls and chats is one of the main reasons businesses use it." },
      { q: "Do I need all three: chatbot, receptionist and agents?", a: "No. Many businesses start with one, often the call receptionist, and add the others later." },
    ],
    questions: [
      { key: "missed_calls", label: "Calls missed per week", type: "select", options: ["0–5", "5–15", "15+", "Not sure"] },
      { key: "after_hours", label: "After-hours coverage today", type: "select", options: ["Voicemail", "Answering service", "Calls forward to my cell", "Nothing"] },
      { key: "ai_interest", label: "Most interested in", type: "select", options: ["AI Chatbot", "AI Call Receptionist", "AI Agents", "Not sure yet"] },
    ],
  },
];

export const servicePage = (slug: string) => SERVICE_PAGES.find((s) => s.slug === slug);
