import type { Faq } from "./service-pages";

// Content for /industries/[slug]. Every trade gets its own pain points, features and FAQs.
export type WorkflowStep = { icon: string; t: string; d: string };
/** One concrete, industry-specific automation ("Signature AI Workflow"). Sample, customized per business. */
export type SignatureWorkflow = { title: string; promise: string; steps: WorkflowStep[]; saves: string[]; tools: string[] };

export type IndustryPage = {
  slug: string;
  name: string; // "Plumbing"
  pros: string; // "plumbers"
  mockup: string; // label of its sample card in lib/industries.ts
  intro: string;
  pains: { t: string; d: string }[];
  angles: { websites: string; workflows: string; tracking: string; ai: string };
  features: { t: string; d: string }[];
  faqs: Faq[];
  related: string[]; // industry slugs
  areas: string[]; // area slugs
  workflow: SignatureWorkflow;
  more: string[]; // 3 more automation ideas
};

export const INDUSTRY_PAGES: IndustryPage[] = [
  {
    slug: "plumbing",
    name: "Plumbing",
    pros: "plumbers",
    mockup: "Plumbing",
    intro: "When a pipe bursts, homeowners call whoever answers first. We help Bergen County plumbers be that company.",
    pains: [
      { t: "Emergency calls during jobs", d: "A leak doesn't wait. If you're under a sink when the phone rings, that caller often dials the next plumber." },
      { t: "After-hours demand", d: "Many urgent calls come in evenings and weekends, when nobody is at the desk." },
      { t: "Price shoppers", d: "Callers compare several plumbers quickly, so the one who looks trustworthy online wins the job." },
    ],
    angles: {
      websites: "Emergency number at the top of every page, service pages for drains, water heaters and leaks.",
      workflows: "Instant text-back when you can't pick up, and a review request after every repair.",
      tracking: "See which searches, like “water heater repair,” actually turn into calls.",
      ai: "An AI receptionist answers urgent calls while you're on a job and flags emergencies.",
    },
    features: [
      { t: "Emergency banner", d: "Your number and an emergency message visible on every screen." },
      { t: "Service-area pages", d: "Clear pages for the towns you cover, so local searches find you." },
      { t: "Water heater and drain pages", d: "Dedicated pages for your most profitable jobs." },
      { t: "Auto text-back", d: "A quick text when you can't pick up, so emergency callers don't move on." },
      { t: "Financing callout", d: "Mention payment options for bigger installs, if you offer them." },
    ],
    faqs: [
      { q: "Can an AI receptionist tell a real emergency from a routine call?", a: "We set it up with questions you choose, like whether water is actively leaking, and it flags urgent calls to you right away." },
      { q: "Should my plumbing site list prices?", a: "Many plumbers show starting prices or a service-call fee to build trust, then quote the job on site. We'll help you decide what fits your business." },
      { q: "Do I need separate pages for water heaters and drains?", a: "It helps. Focused pages match what people search for and make it clear you handle that exact job." },
      { q: "How do review requests work after a repair?", a: "When you mark a job done, the customer gets a short text with a link to leave a review. It's timed while the fix is still fresh." },
    ],
    workflow: {
      "title": "Catch More Emergency Calls",
      "promise": "Urgent calls picked up and triaged, even while you're on a job.",
      "steps": [
        {
          "icon": "phone",
          "t": "AI picks up after hours",
          "d": "It can pick up while you're under a sink."
        },
        {
          "icon": "alert",
          "t": "Triages the emergency",
          "d": "Asks if water is actively leaking, where, and how bad."
        },
        {
          "icon": "calendar",
          "t": "Books or dispatches",
          "d": "Urgent jobs go to you right away; routine ones get booked."
        },
        {
          "icon": "message",
          "t": "Texts the customer an ETA",
          "d": "The customer knows when you'll arrive, without calling back."
        },
        {
          "icon": "wrench",
          "t": "Job gets done",
          "d": "You mark it complete from your phone."
        },
        {
          "icon": "star",
          "t": "Review request goes out",
          "d": "A short text asks for a review while the fix is fresh."
        }
      ],
      "saves": [
        "Emergency calls that go unanswered",
        "Back-and-forth calls about arrival times",
        "Remembering to ask for reviews"
      ],
      "tools": [
        "Your business phone line",
        "Calendar",
        "Text messaging",
        "Google Business Profile"
      ]
    },
    more: [
      "Water heater maintenance reminders",
      "Quote follow-ups for repipes and replacements",
      "Auto text-back while you're on a job"
    ],
    related: ["hvac", "electricians", "contractors"],
    areas: ["hackensack", "teaneck", "fair-lawn"],
  },
  {
    slug: "hvac",
    name: "HVAC",
    pros: "HVAC companies",
    mockup: "HVAC",
    intro: "HVAC work swings with the seasons. We help Bergen County heating and cooling companies stay booked in the busy months and the quiet ones.",
    pains: [
      { t: "Seasonal swings", d: "The first heat wave or cold snap floods the phones, then demand drops off." },
      { t: "Maintenance plans don't sell themselves", d: "Tune-up memberships are steady income, but customers forget to renew." },
      { t: "Long sales cycles on replacements", d: "System replacements take quotes, follow-ups and time to decide." },
    ],
    angles: {
      websites: "Pages for heating, cooling and indoor air, plus easy tune-up booking.",
      workflows: "Seasonal tune-up reminders and quote follow-ups for replacement systems.",
      tracking: "Track demand by season and which campaigns fill the schedule.",
      ai: "AI handles the surge of calls on the first hot or cold day of the year.",
    },
    features: [
      { t: "Seasonal tune-up campaigns", d: "Spring AC and fall furnace reminders sent automatically." },
      { t: "Maintenance plan signup", d: "Explain your plan and let customers join online." },
      { t: "Replacement quote follow-ups", d: "Gentle nudges while a homeowner decides on a new system." },
      { t: "Online booking", d: "Let customers pick a tune-up time without calling." },
      { t: "Financing details", d: "Present payment options clearly for big-ticket installs." },
    ],
    faqs: [
      { q: "Can you automate seasonal tune-up reminders?", a: "Yes. Customers get reminders before cooling and heating season, with a link to book a visit." },
      { q: "How do we handle the call surge on the first hot day?", a: "An AI receptionist can pick up overflow calls, collect details and book or queue jobs so fewer callers go unanswered." },
      { q: "Will a website help sell maintenance plans?", a: "A clear plan page with benefits and online signup makes it much easier for customers to say yes." },
      { q: "Can follow-ups help close replacement quotes?", a: "Yes. A short sequence after you send a quote keeps you in the conversation while the homeowner compares options." },
    ],
    workflow: {
      "title": "Seasonal Tune-Up Machine",
      "promise": "Fill spring and fall schedules from customers you already have.",
      "steps": [
        {
          "icon": "list",
          "t": "Pulls your past customers",
          "d": "Builds a reminder list from your existing customer records."
        },
        {
          "icon": "bell",
          "t": "Sends seasonal reminders",
          "d": "Spring AC and fall furnace tune-up reminders by text and email."
        },
        {
          "icon": "calendar",
          "t": "Books online",
          "d": "Customers pick a time without calling the office."
        },
        {
          "icon": "repeat",
          "t": "Filter change reminders",
          "d": "Friendly reminders between visits keep systems running well."
        },
        {
          "icon": "chart",
          "t": "Flags aging units",
          "d": "Suggests replacement quotes for older systems, for you to review."
        }
      ],
      "saves": [
        "Calling down a customer list every season",
        "Scrambling for bookings once the rush starts",
        "Missing replacement opportunities on older units"
      ],
      "tools": [
        "Your customer list or CRM",
        "Text messaging",
        "Email",
        "Online booking",
        "Calendar"
      ]
    },
    more: [
      "Maintenance plan renewals",
      "Overflow call answering on the first hot day",
      "Follow-ups on new system quotes"
    ],
    related: ["plumbing", "electricians", "roofing"],
    areas: ["paramus", "fair-lawn", "mahwah"],
  },
  {
    slug: "electricians",
    name: "Electricians",
    pros: "electricians",
    mockup: "Electrician",
    intro: "From panel upgrades to EV chargers, homeowners want a licensed electrician they can trust. We help Bergen County electricians show it.",
    pains: [
      { t: "Trust and licensing questions", d: "People want proof you're licensed and insured before they let you near the panel." },
      { t: "Small jobs crowd the schedule", d: "Quick calls about outlets and fixtures can push aside bigger, better projects." },
      { t: "New demand is growing", d: "EV chargers and generators bring new customers, if they can find you." },
    ],
    angles: {
      websites: "Licensing and insurance up front, plus pages for panels, lighting and EV chargers.",
      workflows: "Quote follow-ups for larger projects and reminders for scheduled work.",
      tracking: "See which project types bring in the most valuable leads.",
      ai: "AI answers routine questions and screens jobs so the right ones reach you.",
    },
    features: [
      { t: "License and insurance badges", d: "Credentials shown clearly near every call-to-action." },
      { t: "EV charger page", d: "A dedicated page for one of the fastest-growing requests." },
      { t: "Panel upgrade quote form", d: "Collect photos and details before the site visit." },
      { t: "Project gallery", d: "Show finished panels, lighting and installs." },
      { t: "Job screening questions", d: "Sort small fixes from larger projects automatically." },
    ],
    faqs: [
      { q: "Can customers send photos of their panel before I visit?", a: "Yes. A quote form can accept photos, so you can see what you're walking into." },
      { q: "Is it worth having an EV charger page?", a: "If you install chargers, a dedicated page helps you show up when homeowners search for that specific job." },
      { q: "How should I show I'm licensed?", a: "We place your license and insurance details near your call buttons and in the footer, where people look for them." },
      { q: "Can AI help me skip small jobs I don't want?", a: "It can ask a few screening questions and route requests based on rules you set, like minimum job size." },
    ],
    workflow: {
      "title": "Quote-to-Job Pipeline",
      "promise": "From a customer's photo to a booked job, with you approving every price.",
      "steps": [
        {
          "icon": "camera",
          "t": "Customer sends photos",
          "d": "The quote form collects photos and a short description."
        },
        {
          "icon": "scan",
          "t": "AI reads the request",
          "d": "Reviews the photos and notes to understand the job."
        },
        {
          "icon": "dollar",
          "t": "Drafts an estimate range",
          "d": "Based on your pricing rules, never sent on its own."
        },
        {
          "icon": "check",
          "t": "You approve it",
          "d": "Adjust or approve the estimate in a tap."
        },
        {
          "icon": "mail",
          "t": "Sent to the customer",
          "d": "A clear estimate goes out by email or text."
        },
        {
          "icon": "repeat",
          "t": "Follows up until booked",
          "d": "Polite check-ins until the customer books or declines."
        }
      ],
      "saves": [
        "Writing every quote from scratch",
        "Forgotten follow-ups on open quotes",
        "Site visits for jobs that were never a fit"
      ],
      "tools": [
        "Your website quote form",
        "Email",
        "Text messaging",
        "Calendar"
      ]
    },
    more: [
      "EV charger inquiry intake",
      "Permit and inspection reminders",
      "Review requests after panel upgrades"
    ],
    related: ["hvac", "plumbing", "contractors"],
    areas: ["englewood", "teaneck", "hackensack"],
  },
  {
    slug: "roofing",
    name: "Roofing",
    pros: "roofers",
    mockup: "Roofing",
    intro: "Roofing is a big decision and a big ticket. We help Bergen County roofers earn trust online and follow up until the job is signed.",
    pains: [
      { t: "High-stakes decisions", d: "Homeowners compare several roofers and want proof of quality before they sign." },
      { t: "Storm-driven spikes", d: "After a storm, calls pour in all at once and it's easy to lose track." },
      { t: "Long follow-up cycles", d: "Estimates can sit for weeks while homeowners think it over." },
    ],
    angles: {
      websites: "Project photos, warranty details and a free estimate form front and center.",
      workflows: "Estimate follow-ups that keep you top of mind while homeowners decide.",
      tracking: "See which neighborhoods and searches bring in estimate requests.",
      ai: "AI collects storm-damage details and photos when calls spike.",
    },
    features: [
      { t: "Free estimate form", d: "Collect address, roof type and photos in one step." },
      { t: "Before-and-after gallery", d: "Show the quality of your work on real homes." },
      { t: "Warranty and materials page", d: "Explain what's covered in plain language." },
      { t: "Storm response page", d: "A clear page homeowners can find after severe weather." },
      { t: "Estimate follow-up sequence", d: "Friendly check-ins over the following weeks." },
    ],
    faqs: [
      { q: "How do I handle the flood of calls after a storm?", a: "An AI receptionist and online forms can collect addresses, damage details and photos so you can prioritize inspections." },
      { q: "Should my roofing site show project photos?", a: "Yes. Real before-and-after photos are one of the strongest trust signals for a big purchase like a roof." },
      { q: "How long should I follow up on an estimate?", a: "Roofing decisions often take weeks, so we set up a spaced sequence that checks in without being pushy." },
      { q: "Can you highlight financing or warranties?", a: "Yes. We give warranties and any payment options their own clear sections so homeowners don't have to ask." },
    ],
    workflow: {
      "title": "Storm Response Autopilot",
      "promise": "Reach the right homeowners right after a storm, with photos in hand.",
      "steps": [
        {
          "icon": "cloud",
          "t": "Watches for storms",
          "d": "Monitors weather alerts for the towns you serve."
        },
        {
          "icon": "mail",
          "t": "Offers inspections",
          "d": "Past customers and open leads get an inspection offer."
        },
        {
          "icon": "camera",
          "t": "Collects damage photos",
          "d": "Homeowners upload photos of the damage from their phone."
        },
        {
          "icon": "clipboard",
          "t": "Prioritizes requests",
          "d": "Sorts requests by urgency so the worst damage comes first."
        },
        {
          "icon": "calendar",
          "t": "Schedules inspections",
          "d": "Books inspection visits into your calendar."
        }
      ],
      "saves": [
        "Scrambling through call lists after a storm",
        "Driving out without knowing what you'll find",
        "Juggling inspection requests by hand"
      ],
      "tools": [
        "Weather alerts",
        "Your customer list",
        "Text messaging",
        "Email",
        "Website forms",
        "Calendar"
      ]
    },
    more: [
      "Estimate follow-up sequences",
      "Warranty check-in reminders",
      "Seasonal gutter cleaning offers"
    ],
    related: ["contractors", "landscaping", "hvac"],
    areas: ["ridgewood", "mahwah", "paramus"],
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    pros: "landscapers",
    mockup: "Landscaping",
    intro: "Landscaping sells on looks. We help Bergen County landscapers show off their work and fill the calendar before the season starts.",
    pains: [
      { t: "Your best work stays hidden", d: "Beautiful patios and gardens don't help if your site doesn't show them." },
      { t: "Spring rush, winter lull", d: "Everyone calls in April; planning ahead keeps the year steady." },
      { t: "Design projects need nurturing", d: "Hardscape and design jobs involve consultations and decisions over weeks." },
    ],
    angles: {
      websites: "A photo-first site with project galleries for patios, plantings and outdoor living.",
      workflows: "Pre-season reminders and follow-ups after design consultations.",
      tracking: "See which project types and towns bring the best inquiries.",
      ai: "AI answers common questions about maintenance plans and scheduling.",
    },
    features: [
      { t: "Project gallery", d: "Big, fast-loading photos organized by project type." },
      { t: "Design consultation booking", d: "Let homeowners request a consultation online." },
      { t: "Seasonal service reminders", d: "Spring cleanups and fall work booked ahead of time." },
      { t: "Maintenance plan page", d: "Explain recurring service and let customers sign up." },
      { t: "Before-and-after comparisons", d: "Show the transformation, not just the result." },
    ],
    faqs: [
      { q: "How should a landscaping site show my work?", a: "We build a photo-first gallery organized by project type, with images optimized so the site stays fast." },
      { q: "Can you help me book spring work earlier?", a: "Yes. Automated pre-season reminders invite past customers to get on the schedule before the rush." },
      { q: "Do design consultations need their own form?", a: "A short consultation form with project type, budget range and photos helps you prepare and qualify leads." },
      { q: "Can customers sign up for maintenance online?", a: "Yes. A maintenance plan page can explain what's included and collect signups." },
    ],
    workflow: {
      "title": "Job Photos on Autopilot",
      "promise": "Your crew takes the photos; your gallery and social feeds take care of themselves.",
      "steps": [
        {
          "icon": "camera",
          "t": "Crew snaps photos",
          "d": "Photos upload from any phone right on the job site."
        },
        {
          "icon": "tag",
          "t": "AI sorts and tags them",
          "d": "Each photo is tagged by service, before or after, town and plants."
        },
        {
          "icon": "folder",
          "t": "Saved to Google Drive",
          "d": "Filed into organized folders by client and project."
        },
        {
          "icon": "globe",
          "t": "Best shots go to your gallery",
          "d": "Top photos are added to your website gallery automatically."
        },
        {
          "icon": "pen",
          "t": "AI writes the captions",
          "d": "Short captions in your voice, ready to post."
        },
        {
          "icon": "share",
          "t": "Posted on a schedule",
          "d": "Shared to Google Business Profile, Instagram and Facebook, with owner approval if you want it."
        }
      ],
      "saves": [
        "Evenings spent sorting and renaming photos",
        "Logging in to update your gallery",
        "Writing captions and remembering to post"
      ],
      "tools": [
        "Google Drive",
        "Instagram",
        "Facebook",
        "Google Business Profile",
        "Your website"
      ]
    },
    more: [
      "Seasonal service reminders to past clients",
      "Design consultation follow-ups",
      "Maintenance plan renewal reminders"
    ],
    related: ["roofing", "contractors", "cleaning"],
    areas: ["ridgewood", "fair-lawn", "mahwah"],
  },
  {
    slug: "contractors",
    name: "Contractors & Remodelers",
    pros: "contractors and remodelers",
    mockup: "Contractor / Remodeling",
    intro: "Kitchens, baths and additions are big, personal projects. We help Bergen County contractors attract the right projects and manage them from first call to final walkthrough.",
    pains: [
      { t: "Tire-kickers waste time", d: "Site visits for projects that were never going to happen eat your week." },
      { t: "Trust is everything", d: "Homeowners worry about delays and surprises, so they look for proof before calling." },
      { t: "Communication gaps", d: "Clients want updates, and missed updates turn into stress and bad reviews." },
    ],
    angles: {
      websites: "Featured projects, your process and a walkthrough request form that qualifies leads.",
      workflows: "Project updates, scheduling reminders and review requests at handoff.",
      tracking: "Know which project types and sources bring in serious inquiries.",
      ai: "AI agents gather project details and budgets before you schedule a visit.",
    },
    features: [
      { t: "Walkthrough request form", d: "Project type, budget range and timeline collected up front." },
      { t: "Featured project pages", d: "Tell the story of a kitchen or addition from start to finish." },
      { t: "Your process, explained", d: "Show homeowners what to expect at each stage." },
      { t: "Client update messages", d: "Automated check-ins so clients feel informed." },
      { t: "Review request at completion", d: "Ask for a review at the moment of the final walkthrough." },
    ],
    faqs: [
      { q: "How can my site filter out unserious inquiries?", a: "A walkthrough form that asks for project type, budget range and timeline helps you focus on projects that fit." },
      { q: "Should I show my process on the website?", a: "Yes. Explaining your steps, from design to final walkthrough, reduces anxiety and sets expectations." },
      { q: "Can automation keep clients updated during a project?", a: "We can set up scheduled check-in messages at key milestones so clients aren't left wondering." },
      { q: "When is the best time to ask for a review?", a: "Right at completion, while the client is enjoying the finished space. We automate that timing." },
    ],
    workflow: {
      "title": "Project Updates Without the Phone Tag",
      "promise": "Clients stay in the loop without you writing a single update.",
      "steps": [
        {
          "icon": "camera",
          "t": "Site photos and notes",
          "d": "The crew uploads photos and quick notes from the job."
        },
        {
          "icon": "pen",
          "t": "AI writes the weekly update",
          "d": "A clear progress summary in your voice."
        },
        {
          "icon": "mail",
          "t": "Emailed to the client",
          "d": "Clients get a tidy update every week."
        },
        {
          "icon": "dollar",
          "t": "Milestone invoices go out",
          "d": "Invoices are sent automatically when a milestone is reached."
        },
        {
          "icon": "folder",
          "t": "Added to your portfolio",
          "d": "Finished projects become portfolio pages on your website."
        }
      ],
      "saves": [
        "Writing update emails late at night",
        "Chasing invoices at each milestone",
        "Building portfolio pages by hand"
      ],
      "tools": [
        "Phone photo uploads",
        "Email",
        "Your invoicing tool",
        "Google Drive",
        "Your website"
      ]
    },
    more: [
      "Walkthrough request qualification",
      "Permit deadline reminders",
      "Review requests at project completion"
    ],
    related: ["roofing", "electricians", "plumbing"],
    areas: ["ridgewood", "englewood", "paramus"],
  },
  {
    slug: "cleaning",
    name: "Cleaning",
    pros: "cleaning companies",
    mockup: "Cleaning",
    intro: "Cleaning businesses grow on trust and recurring schedules. We help Bergen County cleaners make booking easy and keep customers coming back.",
    pains: [
      { t: "Booking back-and-forth", d: "Quoting and scheduling by phone takes time for every new customer." },
      { t: "Trust in the home", d: "People are letting you into their home and want reassurance first." },
      { t: "Churn on recurring plans", d: "Customers drift away when there's no easy way to reschedule." },
    ],
    angles: {
      websites: "Clear packages (standard, deep, move-in) and online booking.",
      workflows: "Booking confirmations, visit reminders and easy rescheduling.",
      tracking: "See which packages and neighborhoods bring the most recurring clients.",
      ai: "An AI chatbot quotes standard packages and books from your site.",
    },
    features: [
      { t: "Package pricing pages", d: "Standard, deep and move-in cleans explained simply." },
      { t: "Online booking", d: "Customers pick a date without a phone call." },
      { t: "Visit reminders", d: "Day-before reminders reduce lockouts and no-shows." },
      { t: "Trust section", d: "Bonding, insurance and your vetting process, clearly stated." },
      { t: "Recurring plan signup", d: "Weekly or biweekly plans with easy changes." },
    ],
    faqs: [
      { q: "Can customers book a cleaning online?", a: "Yes. We can set up package selection and online booking so customers can schedule without calling." },
      { q: "How do I show customers they can trust my team?", a: "We give bonding, insurance and how you vet your team a prominent place on the site." },
      { q: "Will reminders really reduce no-shows?", a: "A reminder the day before gives customers a chance to reschedule instead of leaving your team locked out." },
      { q: "Can an AI chatbot give cleaning quotes?", a: "For standard packages, yes. It can ask about home size and type, then share your pricing or book a visit." },
    ],
    workflow: {
      "title": "Recurring Booking Autopilot",
      "promise": "Bookings, reminders and rebooks that run themselves.",
      "steps": [
        {
          "icon": "calendar",
          "t": "Online booking",
          "d": "Clients choose a package and a time on your site."
        },
        {
          "icon": "bell",
          "t": "Automatic reminders",
          "d": "A reminder before every visit cuts lockouts."
        },
        {
          "icon": "message",
          "t": "AI reschedules by text",
          "d": "Clients reply to move a visit; the calendar updates."
        },
        {
          "icon": "star",
          "t": "Feedback and reviews",
          "d": "A quick check-in after each clean, then a review request."
        },
        {
          "icon": "repeat",
          "t": "Re-book prompts",
          "d": "One-time clients are invited onto a recurring plan."
        }
      ],
      "saves": [
        "Scheduling back-and-forth by phone",
        "Lockouts and no-shows",
        "Remembering to invite clients back"
      ],
      "tools": [
        "Online booking",
        "Calendar",
        "Text messaging",
        "Email",
        "Google Business Profile"
      ]
    },
    more: [
      "Move-out cleaning quote intake",
      "Team schedule notifications",
      "Win-back offers for lapsed clients"
    ],
    related: ["landscaping", "real-estate", "salons-barbers"],
    areas: ["fort-lee", "teaneck", "hackensack"],
  },
  {
    slug: "auto-repair",
    name: "Auto Repair",
    pros: "auto repair shops",
    mockup: "Auto Repair",
    intro: "Drivers want an honest shop they can count on. We help Bergen County auto repair shops build that trust and keep the bays full.",
    pains: [
      { t: "Honesty concerns", d: "Many drivers worry about being overcharged, so they research shops carefully." },
      { t: "Phones ring all day", d: "Service writers juggle calls about status, pricing and appointments." },
      { t: "Maintenance gets forgotten", d: "Customers forget oil changes and inspections until something goes wrong." },
    ],
    angles: {
      websites: "Services, specials and online appointment requests for all makes.",
      workflows: "Maintenance reminders and “your car is ready” texts.",
      tracking: "See which services and specials bring in new customers.",
      ai: "AI answers common questions and takes appointment requests when the shop is busy.",
    },
    features: [
      { t: "Online appointment requests", d: "Drivers request a time and describe the problem." },
      { t: "Maintenance reminders", d: "Oil change and inspection reminders sent on schedule." },
      { t: "Specials page", d: "Seasonal offers that are easy to update." },
      { t: "Vehicle-ready texts", d: "Fewer status calls to the front desk." },
      { t: "Warranty details", d: "Parts and labor warranty explained clearly." },
    ],
    faqs: [
      { q: "Can customers request repair appointments online?", a: "Yes. A short form collects the vehicle, the problem and a preferred time, and confirms automatically." },
      { q: "How do maintenance reminders work?", a: "Based on the last visit, customers get a reminder when an oil change or inspection is likely due." },
      { q: "Can texts cut down status calls?", a: "Yes. An automatic “your vehicle is ready” text answers the most common call before it happens." },
      { q: "Can AI answer questions about my shop?", a: "It can handle hours, services, warranties and appointment requests, and pass anything technical to your team." },
    ],
    workflow: {
      "title": "Service Reminder Engine",
      "promise": "Keep customers coming back and the front desk off the phone.",
      "steps": [
        {
          "icon": "bell",
          "t": "Mileage and date reminders",
          "d": "Oil changes and inspections, timed to each vehicle."
        },
        {
          "icon": "message",
          "t": "AI answers “is my car ready?”",
          "d": "Status questions by text, answered right away."
        },
        {
          "icon": "camera",
          "t": "Photo and video inspections",
          "d": "Customers see what the technician found."
        },
        {
          "icon": "check",
          "t": "Approval links for repairs",
          "d": "Customers approve recommended work with one tap."
        },
        {
          "icon": "car",
          "t": "Ready-for-pickup text",
          "d": "A heads-up the moment the car is done."
        }
      ],
      "saves": [
        "Status calls to the service desk",
        "Waiting on repair approvals by phone",
        "Maintenance visits customers forget"
      ],
      "tools": [
        "Your shop management system",
        "Text messaging",
        "Email",
        "Payment links"
      ]
    },
    more: [
      "Seasonal tire-change offers",
      "Declined-service follow-ups",
      "Fleet account reminders"
    ],
    related: ["cleaning", "electricians", "real-estate"],
    areas: ["hackensack", "paramus", "mahwah"],
  },
  {
    slug: "salons-barbers",
    name: "Salons & Barbers",
    pros: "salons and barbershops",
    mockup: "Salon / Barber",
    intro: "A full chair is everything. We help Bergen County salons and barbershops make booking effortless and turn first visits into regulars.",
    pains: [
      { t: "Phone booking interrupts cuts", d: "Answering the phone mid-appointment slows everyone down." },
      { t: "No-shows cost money", d: "An empty chair from a forgotten appointment is lost revenue." },
      { t: "Standing out locally", d: "There are plenty of options nearby, so your style needs to come through online." },
    ],
    angles: {
      websites: "An editorial site that shows your style, team and services with online booking.",
      workflows: "Appointment reminders and rebooking prompts after each visit.",
      tracking: "See which services and stylists draw new clients.",
      ai: "An AI chatbot answers questions about services and books appointments.",
    },
    features: [
      { t: "Online booking", d: "Clients book their stylist or barber anytime." },
      { t: "Team pages", d: "Show each stylist's specialties and work." },
      { t: "Service menu", d: "Services and durations, easy to scan on a phone." },
      { t: "Reminders and rebooking", d: "Fewer no-shows and more repeat visits." },
      { t: "Walk-in information", d: "Clear details about walk-ins and wait times." },
    ],
    faqs: [
      { q: "Can clients book a specific stylist online?", a: "Yes. Booking can be set up by stylist or barber, with each person's services and availability." },
      { q: "Do reminders really cut no-shows?", a: "Reminders before an appointment give clients an easy way to confirm or reschedule, which helps keep chairs full." },
      { q: "How do I get clients to rebook?", a: "A friendly message a few weeks after a visit, timed to their usual schedule, invites them back." },
      { q: "Can the website show our style?", a: "Yes. We design an editorial look with your photos, colors and team so the site feels like your shop." },
    ],
    workflow: {
      "title": "Fill Empty Chairs",
      "promise": "Cancellations get filled and regulars come back right on schedule.",
      "steps": [
        {
          "icon": "alert",
          "t": "A client cancels",
          "d": "The open slot is spotted the moment it opens up."
        },
        {
          "icon": "message",
          "t": "AI texts the waitlist",
          "d": "Clients waiting for that stylist get a text offer."
        },
        {
          "icon": "calendar",
          "t": "First reply gets the slot",
          "d": "The booking updates automatically."
        },
        {
          "icon": "repeat",
          "t": "Rebooking reminders",
          "d": "Timed to each client's usual cut or color cycle."
        },
        {
          "icon": "share",
          "t": "Portfolio photos to Instagram",
          "d": "Stylists' best work posted with AI-written captions."
        }
      ],
      "saves": [
        "Empty chairs from last-minute cancellations",
        "Calling down the waitlist",
        "Remembering to post new work"
      ],
      "tools": [
        "Your booking system",
        "Text messaging",
        "Instagram"
      ]
    },
    more: [
      "Birthday offers",
      "New-client welcome series",
      "Product restock reminders"
    ],
    related: ["restaurants", "cleaning", "dental"],
    areas: ["englewood", "fort-lee", "ridgewood"],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    pros: "restaurants",
    mockup: "Restaurant",
    intro: "Guests check your menu, hours and reservations before they ever walk in. We help Bergen County restaurants make that first look count.",
    pains: [
      { t: "Outdated menus and hours", d: "A PDF menu from last year or wrong holiday hours turns guests away." },
      { t: "Reservation phone calls", d: "Answering the phone for bookings during service pulls staff off the floor." },
      { t: "Catering and events get lost", d: "Private event inquiries need follow-up, and they're easy to miss." },
    ],
    angles: {
      websites: "Mobile-friendly menus, hours and reservations that are easy to update.",
      workflows: "Reservation confirmations and catering inquiry follow-ups.",
      tracking: "See how guests find you and which pages they use most.",
      ai: "AI answers questions about hours, parking and dietary options, even after hours.",
    },
    features: [
      { t: "Mobile menu pages", d: "Readable menus instead of hard-to-zoom PDFs." },
      { t: "Reservation links", d: "Book a table in a tap." },
      { t: "Catering and private events form", d: "Date, party size and details in one request." },
      { t: "Hours and holiday updates", d: "Easy changes so your information is always right." },
      { t: "Photo-forward design", d: "Your dishes and dining room, presented well." },
    ],
    faqs: [
      { q: "Why not just upload a PDF menu?", a: "PDFs are hard to read on phones. A real menu page loads faster, reads better and is easier for search engines to understand." },
      { q: "Can guests reserve a table from the website?", a: "Yes. We add clear reservation buttons that link to your booking system or a simple request form." },
      { q: "How do you handle catering inquiries?", a: "A dedicated form collects date, headcount and details, and an automatic follow-up makes sure no inquiry slips." },
      { q: "Can the AI answer allergy and dietary questions?", a: "It can share the information you provide, like which dishes are vegetarian, and suggest guests confirm with staff for allergies." },
    ],
    workflow: {
      "title": "Reviews & Reservations on Autopilot",
      "promise": "Guests get answers, reviews get replies and specials get posted.",
      "steps": [
        {
          "icon": "phone",
          "t": "AI answers phone and chat",
          "d": "Reservations, hours and menu questions, handled."
        },
        {
          "icon": "calendar",
          "t": "Books reservations",
          "d": "Tables booked straight into your reservation system."
        },
        {
          "icon": "star",
          "t": "AI drafts review replies",
          "d": "Thoughtful replies ready for you to approve."
        },
        {
          "icon": "camera",
          "t": "Snap the daily special",
          "d": "One photo and a few words from the kitchen."
        },
        {
          "icon": "share",
          "t": "Posted everywhere",
          "d": "Shared to Google Business Profile, Instagram and Facebook."
        }
      ],
      "saves": [
        "Phone interruptions during service",
        "Writing every review reply yourself",
        "Posting specials on three platforms"
      ],
      "tools": [
        "Your phone line",
        "Website chat",
        "Your reservation system",
        "Google Business Profile",
        "Instagram",
        "Facebook"
      ]
    },
    more: [
      "Catering inquiry follow-ups",
      "Private event deposit reminders",
      "Holiday hours updates in one place"
    ],
    related: ["salons-barbers", "real-estate", "cleaning"],
    areas: ["englewood", "ridgewood", "fort-lee"],
  },
  {
    slug: "dental",
    name: "Dental",
    pros: "dental practices",
    mockup: "Dental",
    intro: "New patients choose a dentist who feels calm, modern and easy to book. We help Bergen County practices make that first impression online.",
    pains: [
      { t: "Front desk overload", d: "Phones ring with appointment requests and insurance questions all day." },
      { t: "Nervous new patients", d: "Many patients feel anxious and look for a practice that feels welcoming." },
      { t: "Recall visits slip", d: "Patients put off cleanings without timely reminders." },
    ],
    angles: {
      websites: "A calm, modern site with new-patient information and appointment requests.",
      workflows: "Recall reminders, appointment confirmations and review requests.",
      tracking: "See how new patients find the practice and which services they ask about.",
      ai: "AI answers common questions about insurance and availability after hours.",
    },
    features: [
      { t: "Appointment request form", d: "New and returning patients request times online." },
      { t: "New patient page", d: "What to expect, forms and insurance information." },
      { t: "Recall reminders", d: "Cleaning reminders sent on schedule." },
      { t: "Service pages", d: "Cleanings, whitening and implants explained simply." },
      { t: "Team introductions", d: "Friendly bios that help anxious patients feel at ease." },
    ],
    faqs: [
      { q: "Can patients request appointments online?", a: "Yes. An appointment request form lets patients share preferred times and reason for visit, and your team confirms." },
      { q: "How do recall reminders work?", a: "Patients get reminders when they're due for a cleaning, with an easy way to request a time." },
      { q: "Can the AI discuss insurance questions?", a: "It can share general information you provide, like which plans you accept, and route specific questions to your team." },
      { q: "How do we help anxious patients feel comfortable?", a: "A calm design, clear new-patient information and team introductions go a long way before the first visit." },
    ],
    workflow: {
      "title": "Recall & No-Show Saver",
      "promise": "Fuller schedules with fewer no-shows and less phone time.",
      "steps": [
        {
          "icon": "bell",
          "t": "Recall reminders",
          "d": "Patients due for a cleaning get a reminder to book."
        },
        {
          "icon": "message",
          "t": "AI confirmation texts",
          "d": "Patients confirm or reschedule by replying."
        },
        {
          "icon": "calendar",
          "t": "Waitlist fills cancellations",
          "d": "Open slots are offered to patients who want an earlier visit."
        },
        {
          "icon": "clipboard",
          "t": "New-patient intake forms",
          "d": "Forms completed online before the first visit."
        },
        {
          "icon": "chat",
          "t": "Insurance FAQ chatbot",
          "d": "Answers common insurance questions using your information."
        }
      ],
      "saves": [
        "Confirmation calls every day",
        "Cancelled slots that stay empty",
        "Paperwork at the front desk"
      ],
      "tools": [
        "Your practice management system",
        "Text messaging",
        "Email",
        "Website chat",
        "Online forms"
      ]
    },
    more: [
      "Post-treatment check-in texts",
      "Treatment plan follow-ups",
      "Review requests after visits"
    ],
    related: ["salons-barbers", "real-estate", "restaurants"],
    areas: ["paramus", "teaneck", "ridgewood"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    pros: "real estate agents and brokerages",
    mockup: "Real Estate",
    intro: "Buyers and sellers start their search online. We help Bergen County agents look like the local experts they are and follow up with every lead.",
    pains: [
      { t: "Leads from many sources", d: "Inquiries arrive from portals, social media and your site, and it's hard to keep up." },
      { t: "Slow follow-up loses clients", d: "Buyers often work with the first agent who responds." },
      { t: "Standing out from big portals", d: "Your local knowledge gets buried under national listing sites." },
    ],
    angles: {
      websites: "Neighborhood pages, featured listings and home valuation requests.",
      workflows: "Instant lead responses and long-term nurture for future buyers and sellers.",
      tracking: "See which neighborhoods and sources bring serious inquiries.",
      ai: "AI responds to listing inquiries instantly and books showings.",
    },
    features: [
      { t: "Home valuation request", d: "A seller lead form with address and timeline." },
      { t: "Neighborhood guides", d: "Pages that show your local expertise town by town." },
      { t: "Featured listings", d: "Spotlight your current properties." },
      { t: "Instant lead response", d: "Every inquiry gets a reply within minutes." },
      { t: "Long-term nurture", d: "Stay in touch with people who aren't ready yet." },
    ],
    faqs: [
      { q: "Can my site capture seller leads?", a: "Yes. A home valuation request form collects the address, timeline and contact details for sellers." },
      { q: "Should I have neighborhood pages?", a: "Neighborhood guides showcase your local knowledge and help you show up for town-specific searches." },
      { q: "How fast should I respond to a new lead?", a: "As fast as possible. An instant automated reply buys you time to follow up personally." },
      { q: "Can AI book showings?", a: "It can answer basic listing questions and offer showing times based on your availability rules." },
    ],
    workflow: {
      "title": "Instant Lead Responder",
      "promise": "Every new lead gets a thoughtful reply within about a minute.",
      "steps": [
        {
          "icon": "bell",
          "t": "A new lead arrives",
          "d": "From your site, a portal or social media."
        },
        {
          "icon": "message",
          "t": "AI replies in about a minute",
          "d": "A personal-sounding first response, even after hours."
        },
        {
          "icon": "list",
          "t": "Qualifies the lead",
          "d": "Buying or selling, timeline and budget."
        },
        {
          "icon": "calendar",
          "t": "Books showings",
          "d": "Offers times based on your availability."
        },
        {
          "icon": "mail",
          "t": "Sends matching listings",
          "d": "A drip of homes that fit what they're looking for."
        },
        {
          "icon": "share",
          "t": "New listings to social",
          "d": "Listing photos posted to Instagram and Facebook."
        }
      ],
      "saves": [
        "Leads waiting hours for a reply",
        "Phone tag to set up showings",
        "Posting every new listing by hand"
      ],
      "tools": [
        "Your lead sources",
        "Your CRM",
        "Text messaging",
        "Email",
        "Calendar",
        "Instagram",
        "Facebook"
      ]
    },
    more: [
      "Home valuation follow-ups",
      "Past-client anniversary check-ins",
      "Open house sign-in follow-ups"
    ],
    related: ["contractors", "cleaning", "dental"],
    areas: ["ridgewood", "fort-lee", "englewood"],
  },
];

export const industryPage = (slug: string) => INDUSTRY_PAGES.find((i) => i.slug === slug);
