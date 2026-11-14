import type { Faq } from "./service-pages";

// Content for /areas/[slug]. Local details are general, well-known facts (corridors,
// neighboring towns). No statistics, no client claims.
export type AreaPage = {
  slug: string;
  name: string;
  county: string;
  intro: string;
  details: string[]; // short local facts used on the page and the map doodle
  corridors: string[]; // road labels for the sketch map
  neighbors: string[]; // neighboring towns (plain text)
  points: { t: string; d: string }[]; // why online presence matters here
  industries: string[]; // industry slugs to feature
  faqs: Faq[];
  nearby: string[]; // area slugs we have pages for
};

export const AREAS: AreaPage[] = [
  {
    slug: "hackensack",
    name: "Hackensack",
    county: "Bergen County",
    intro: "As the county seat, Hackensack draws people from all over Bergen County for court, hospital visits and business, and many of them search for local services while they're in town.",
    details: ["Bergen County's county seat", "Downtown along Main Street", "Close to Routes 4, 17 and 80"],
    corridors: ["Main St", "Route 4", "Route 17"],
    neighbors: ["Teaneck", "River Edge", "Maywood", "Bogota", "Lodi"],
    points: [
      { t: "Competition is close by", d: "Busy corridors mean many businesses compete for the same nearby searches, so a clear, fast site matters." },
      { t: "Visitors search on the go", d: "People in town for appointments often look up services on their phones, right where they are." },
      { t: "Downtown is changing", d: "As Main Street grows, an up-to-date online presence helps local businesses keep pace." },
    ],
    industries: ["plumbing", "auto-repair", "cleaning", "electricians"],
    faqs: [
      { q: "Do you work with businesses in downtown Hackensack?", a: "Yes. We work with service businesses across Hackensack, from Main Street to the neighborhoods off Route 4 and Route 17." },
      { q: "Should my site mention the towns around Hackensack?", a: "If you serve them, yes. Naming the towns you cover, like Teaneck, River Edge and Maywood, helps nearby customers find you." },
      { q: "Can you meet in person in Hackensack?", a: "We're based in Bergen County. Call us to talk about whether an in-person meeting makes sense for your project." },
      { q: "What's the fastest way to get more local calls?", a: "Usually a mobile-friendly site with tap-to-call, accurate hours and clear service pages, paired with fast follow-up on every lead." },
    ],
    nearby: ["teaneck", "paramus", "fair-lawn"],
  },
  {
    slug: "paramus",
    name: "Paramus",
    county: "Bergen County",
    intro: "Paramus is one of the region's busiest shopping destinations, with major retail along Route 4 and Route 17. Local service businesses here compete for attention with some big names.",
    details: ["Retail hub along Routes 4 and 17", "Home to large shopping centers", "Bergen County blue laws close most retail on Sundays"],
    corridors: ["Route 4", "Route 17", "Paramus Rd"],
    neighbors: ["Hackensack", "River Edge", "Oradell", "Ridgewood", "Fair Lawn", "Rochelle Park"],
    points: [
      { t: "Big brands set expectations", d: "Shoppers used to polished retail websites expect local businesses to look just as professional." },
      { t: "Sundays work differently", d: "With most retail closed on Sundays, online booking and chat let customers reach you anyway." },
      { t: "Heavy traffic, quick decisions", d: "People searching from the Route 17 or Route 4 corridors want an answer fast, often on their phone." },
    ],
    industries: ["dental", "hvac", "auto-repair", "real-estate"],
    faqs: [
      { q: "How do Paramus businesses stand out next to big retailers?", a: "A fast, modern site with clear local details and real photos helps a local business feel just as trustworthy as a big brand." },
      { q: "Can customers book with me on Sundays?", a: "Yes. Online booking, an AI chatbot or an AI receptionist can take requests any day, including when you're closed." },
      { q: "Do you build sites for businesses on Route 17 and Route 4?", a: "Yes. We work with businesses throughout Paramus and the surrounding towns." },
      { q: "Is local SEO different in a retail-heavy town?", a: "Competition for nearby searches is tougher, so accurate listings, service pages and steady tracking matter more." },
    ],
    nearby: ["hackensack", "ridgewood", "fair-lawn"],
  },
  {
    slug: "fort-lee",
    name: "Fort Lee",
    county: "Bergen County",
    intro: "Sitting at the George Washington Bridge, Fort Lee is home to a dense mix of high-rise residents, commuters and small businesses along Main Street and Lemoine Avenue.",
    details: ["At the New Jersey end of the George Washington Bridge", "Main Street and Lemoine Avenue business districts", "Many high-rise residential buildings"],
    corridors: ["Main St", "Lemoine Ave", "GWB"],
    neighbors: ["Edgewater", "Englewood Cliffs", "Leonia", "Palisades Park", "Cliffside Park"],
    points: [
      { t: "Commuters search after hours", d: "Many residents commute into the city, so they research and book services in the evening." },
      { t: "Apartment living changes needs", d: "High-rise residents need services that coordinate with building rules and schedules." },
      { t: "A multilingual community", d: "Clear, simple copy and easy contact options help reach a diverse customer base." },
    ],
    industries: ["cleaning", "salons-barbers", "restaurants", "real-estate"],
    faqs: [
      { q: "Why does after-hours coverage matter in Fort Lee?", a: "Commuters often reach out in the evening. An AI chatbot or receptionist makes sure those inquiries get answered." },
      { q: "Can my site explain building access and scheduling?", a: "Yes. We can add details about building coordination, parking and scheduling so high-rise customers know what to expect." },
      { q: "Can you build a site in more than one language?", a: "We can talk through options on a call, including key pages in a second language." },
      { q: "Do you work with businesses on Main Street and Lemoine Avenue?", a: "Yes. We work with businesses across Fort Lee and the nearby river towns." },
    ],
    nearby: ["englewood", "teaneck", "hackensack"],
  },
  {
    slug: "englewood",
    name: "Englewood",
    county: "Bergen County",
    intro: "Englewood's downtown around Palisade Avenue and Dean Street mixes shops, restaurants and the bergenPAC performing arts center, with service businesses spread through the surrounding neighborhoods.",
    details: ["Downtown along Palisade Avenue and Dean Street", "Home to bergenPAC, a performing arts center", "Near Route 4 and the Palisades Interstate Parkway"],
    corridors: ["Palisade Ave", "Dean St", "Route 4"],
    neighbors: ["Teaneck", "Tenafly", "Englewood Cliffs", "Leonia", "Bergenfield"],
    points: [
      { t: "Downtown foot traffic", d: "Visitors heading to dinner or a show look up nearby businesses on their phones." },
      { t: "Homeowners expect quality", d: "Customers in established neighborhoods look carefully at reviews and past work before hiring." },
      { t: "Restaurant and retail competition", d: "A busy downtown means your hours, menu or services need to be accurate and easy to find." },
    ],
    industries: ["restaurants", "salons-barbers", "contractors", "electricians"],
    faqs: [
      { q: "How do downtown Englewood businesses benefit from a better site?", a: "Visitors often search on their phones right before they go out, so fast pages, accurate hours and easy booking make a real difference." },
      { q: "Can you help a restaurant near bergenPAC?", a: "Yes. Mobile menus, reservation links and accurate show-night hours help pre-theater diners choose you." },
      { q: "What matters most for contractors serving Englewood homes?", a: "Project photos, clear process details and a way to request a walkthrough help homeowners feel confident." },
      { q: "Do you also serve nearby towns like Tenafly and Teaneck?", a: "Yes. We work with businesses throughout eastern Bergen County." },
    ],
    nearby: ["teaneck", "fort-lee", "hackensack"],
  },
  {
    slug: "teaneck",
    name: "Teaneck",
    county: "Bergen County",
    intro: "Teaneck is a large, diverse community with business districts along Cedar Lane and Teaneck Road, quick access to Route 4 and I-95, and a Fairleigh Dickinson University campus.",
    details: ["Business districts on Cedar Lane and Teaneck Road", "Easy access to Route 4 and I-95", "Home to a Fairleigh Dickinson University campus"],
    corridors: ["Cedar Ln", "Teaneck Rd", "Route 4"],
    neighbors: ["Hackensack", "Bergenfield", "Englewood", "Bogota", "New Milford"],
    points: [
      { t: "Neighborhood loyalty", d: "Residents like supporting local businesses, especially ones that are easy to find and contact." },
      { t: "Busy families book online", d: "Households with packed schedules appreciate online booking and quick replies." },
      { t: "Highway access widens your reach", d: "With Route 4 and I-95 nearby, you can serve surrounding towns, and your site should say so." },
    ],
    industries: ["plumbing", "dental", "cleaning", "hvac"],
    faqs: [
      { q: "Do you work with businesses on Cedar Lane and Teaneck Road?", a: "Yes. We work with businesses in both districts and throughout the township." },
      { q: "How can I reach busy families in Teaneck?", a: "Online booking, quick automated replies and reminder texts make it easy for busy households to work with you." },
      { q: "Should my site list the towns near Teaneck?", a: "If you serve them, yes. Mentioning towns like Bergenfield, Bogota and New Milford helps you show up there too." },
      { q: "Is an AI receptionist a good fit for a small Teaneck business?", a: "It's often most helpful for small teams who can't always answer the phone during jobs or appointments." },
    ],
    nearby: ["hackensack", "englewood", "fort-lee"],
  },
  {
    slug: "fair-lawn",
    name: "Fair Lawn",
    county: "Bergen County",
    intro: "Fair Lawn is a residential community known for Radburn, its historic planned neighborhood, with local businesses along Broadway (Route 4) and River Road.",
    details: ["Home to Radburn, a historic planned community", "Business corridors on Broadway (Route 4) and River Road", "Borders Passaic County to the west"],
    corridors: ["Broadway", "River Rd", "Route 208"],
    neighbors: ["Glen Rock", "Paramus", "Elmwood Park", "Saddle Brook", "Hawthorne"],
    points: [
      { t: "Homeowners maintain long-term", d: "Established homes mean steady demand for repairs, upgrades and seasonal maintenance." },
      { t: "Word of mouth goes online", d: "Neighbors share recommendations, and people check your site and reviews before calling." },
      { t: "Serving both counties", d: "Close to the Passaic County line, many businesses serve towns on both sides." },
    ],
    industries: ["hvac", "plumbing", "landscaping", "roofing"],
    faqs: [
      { q: "Do you work with businesses on Broadway and River Road?", a: "Yes. We work with businesses throughout Fair Lawn and nearby towns." },
      { q: "How do I turn neighbor recommendations into calls?", a: "When someone hears your name, they look you up. A clear site with reviews, photos and tap-to-call converts that interest." },
      { q: "Can my site cover towns in Passaic County too?", a: "Yes. We can add service-area content for towns on both sides of the county line." },
      { q: "What do homeowners in established neighborhoods look for?", a: "Reliability, clear pricing information and proof of past work, so we highlight all three." },
    ],
    nearby: ["paramus", "ridgewood", "hackensack"],
  },
  {
    slug: "ridgewood",
    name: "Ridgewood",
    county: "Bergen County",
    intro: "Ridgewood's walkable downtown, centered around Ridgewood Avenue and the train station, is lined with shops and restaurants, and surrounded by neighborhoods of well-kept homes.",
    details: ["Walkable downtown around Ridgewood Avenue", "NJ Transit train station downtown", "Known for its restaurants and shops"],
    corridors: ["Ridgewood Ave", "Franklin Ave", "Route 17"],
    neighbors: ["Glen Rock", "Paramus", "Ho-Ho-Kus", "Midland Park", "Wyckoff"],
    points: [
      { t: "High expectations for quality", d: "Homeowners compare carefully and expect a polished website and clear proof of quality." },
      { t: "Downtown dining and shopping", d: "Restaurants and shops compete for visitors who decide on their phones." },
      { t: "Home projects are big decisions", d: "Remodels, roofs and landscaping projects get researched thoroughly before anyone calls." },
    ],
    industries: ["contractors", "landscaping", "restaurants", "real-estate"],
    faqs: [
      { q: "Do you work with downtown Ridgewood businesses?", a: "Yes. We work with restaurants, shops and service businesses downtown and throughout the village." },
      { q: "What helps contractors win Ridgewood projects?", a: "Detailed project pages, a clear process and an easy walkthrough request help homeowners feel confident." },
      { q: "Can you help my restaurant stand out downtown?", a: "Yes. Mobile menus, reservation links and great photos help diners choose you when they're deciding where to eat." },
      { q: "Do you serve towns near Ridgewood?", a: "Yes, including Glen Rock, Ho-Ho-Kus, Midland Park and Wyckoff." },
    ],
    nearby: ["paramus", "fair-lawn", "mahwah"],
  },
  {
    slug: "mahwah",
    name: "Mahwah",
    county: "Bergen County",
    intro: "Mahwah is Bergen County's northernmost town, bordering New York State, with business along the Route 17 and I-287 corridor and Ramapo College on its western side.",
    details: ["Bergen County's northernmost town", "Route 17 and I-287 corridor", "Home to Ramapo College"],
    corridors: ["Route 17", "I-287", "Franklin Tpk"],
    neighbors: ["Ramsey", "Upper Saddle River", "Oakland", "Allendale", "Suffern, NY"],
    points: [
      { t: "Customers cover more ground", d: "With homes spread out, people search for services that cover their specific area." },
      { t: "Cross-state customers", d: "Being right at the New York line, many businesses here also serve customers across the border." },
      { t: "Seasonal property care", d: "Larger properties mean steady seasonal work, from landscaping to HVAC." },
    ],
    industries: ["landscaping", "hvac", "roofing", "auto-repair"],
    faqs: [
      { q: "Can my site show the areas I cover around Mahwah?", a: "Yes. We add clear service-area details, including nearby towns like Ramsey, Oakland and Upper Saddle River." },
      { q: "Do you help businesses that also serve New York customers?", a: "Yes. We can include service-area content for towns across the state line, such as Suffern." },
      { q: "How do I keep a steady schedule through the seasons?", a: "Automated seasonal reminders and maintenance plans help fill the calendar before each season starts." },
      { q: "Do you work with businesses on the Route 17 corridor?", a: "Yes. We work with businesses throughout Mahwah and northern Bergen County." },
    ],
    nearby: ["ridgewood", "paramus", "fair-lawn"],
  },
];

export const areaPage = (slug: string) => AREAS.find((a) => a.slug === slug);
