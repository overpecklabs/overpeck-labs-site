"use client";

import { scrollToId } from "@/lib/journey";
import { prefillContact, type ServiceKey } from "@/lib/services";

type Plan = {
  name: string;
  tag: string;
  blurb: string;
  items: string[];
  prefill: ServiceKey[];
  price?: { from: string; monthly: string };
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Launch",
    tag: "Websites That Win Business",
    blurb: "A custom website built to bring in calls and jobs.",
    price: { from: "$500", monthly: "$50/month" },
    items: ["Custom, mobile-friendly website", "Hosting and SSL included", "Basic SEO setup", "Contact / lead form", "Small monthly edits"],
    prefill: ["mockup", "websites"],
    cta: "Get My Free Mockup",
    featured: true,
  },
  {
    name: "Growth",
    tag: "Website + Automation + Tracking",
    blurb: "Everything in Launch, plus systems that follow up for you and show what's working.",
    items: ["Everything in Launch", "Workflows & Automation", "Track, Monitor & Optimize", "Ongoing improvements"],
    prefill: ["websites", "workflows", "tracking"],
    cta: "Book a call",
  },
  {
    name: "Operator",
    tag: "Everything, including AI",
    blurb: "The full system, with AI covering calls, chats and overflow.",
    items: ["Everything in Growth", "AI Chat Bot", "AI Call Receptionist", "AI Agents for overflow tasks"],
    prefill: ["websites", "workflows", "tracking", "ai"],
    cta: "Book a call",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-ink px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">Pricing</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">Start small. Add what you need.</h2>
        <p className="mt-4 max-w-xl text-white/65">Every plan starts with a free website mockup. Growth and Operator are quoted to fit your business.</p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`glass flex flex-col rounded-3xl p-7 ${p.featured ? "border-teal/50 shadow-[0_0_60px_rgba(25,240,210,0.15)]" : ""}`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet">{p.tag}</p>
              <h3 className="font-display mt-2 text-3xl font-bold">{p.name}</h3>

              <div className="mt-4 min-h-[5.5rem]">
                {p.price ? (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/55">Websites starting at</div>
                    <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display text-5xl font-bold text-gradient">{p.price.from}</span>
                      <span className="text-sm text-white/70">upfront</span>
                    </div>
                    <div className="text-sm text-white/80">
                      + as low as <span className="font-semibold text-white">{p.price.monthly}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/55">Pricing</div>
                    <div className="font-display mt-1 text-3xl font-bold">Custom quote</div>
                    <div className="text-sm text-white/60">Scoped on a quick call</div>
                  </>
                )}
              </div>

              <p className="mt-4 text-sm text-white/70">{p.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-white/80">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-teal">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <button
                className={`${p.featured ? "btn-primary" : "btn-ghost"} mt-7`}
                onClick={() => {
                  prefillContact(p.prefill);
                  scrollToId("contact");
                }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-white/45">
          &quot;Starting at&quot; prices are for a standard small-business site. Final pricing depends on size and features, and we confirm it before any work begins.
        </p>
      </div>
    </section>
  );
}
