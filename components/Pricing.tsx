"use client";

import Link from "next/link";
import { scrollToId } from "@/lib/journey";
import { prefillContact, type ServiceKey } from "@/lib/services";

type Price = { kind: "free" } | { kind: "fixed"; upfront: string; monthly: string } | { kind: "quote" };

type Plan = {
  name: string;
  tag: string;
  blurb: string;
  items: string[];
  price: Price;
  cta: { label: string } & ({ href: string } | { prefill: ServiceKey[] });
  badge?: string;
  featured?: boolean;
};

// Array order = display order on every screen size (cards stack in this order on mobile).
const PLANS: Plan[] = [
  {
    name: "Free Mockup",
    tag: "Start here",
    blurb: "A custom design of your new homepage, no cost, no obligation.",
    price: { kind: "free" },
    items: ["Custom homepage design", "Built around your trade and towns", "Ready in 2–3 business days", "No credit card needed"],
    cta: { label: "Get My Free Mockup", href: "/free-mockup" },
  },
  {
    name: "Launch",
    tag: "Websites That Win Business",
    blurb: "A custom website built to bring in calls and jobs.",
    price: { kind: "fixed", upfront: "$500", monthly: "+ $50/month" },
    items: ["Custom, mobile-friendly website", "Hosting and SSL included", "Basic SEO setup", "Contact / lead form", "Small monthly edits"],
    cta: { label: "Get Started", href: "/free-mockup" },
    badge: "Most Popular",
    featured: true,
  },
  {
    name: "Growth",
    tag: "Automation + Tracking",
    blurb: "Everything in Launch, plus systems that follow up for you and show what's working.",
    price: { kind: "quote" },
    items: ["Everything in Launch", "Workflows & Automation", "Track, Monitor & Optimize", "Ongoing improvements"],
    cta: { label: "Book a call", prefill: ["websites", "workflows", "tracking"] },
  },
  {
    name: "Operator",
    tag: "Everything, including AI",
    blurb: "The full system, with AI covering calls, chats and overflow.",
    price: { kind: "quote" },
    items: ["Everything in Growth", "AI Chat Bot", "AI Call Receptionist", "AI Agents for overflow tasks"],
    cta: { label: "Book a call", prefill: ["websites", "workflows", "tracking", "ai"] },
  },
];

function PriceBlock({ price }: { price: Price }) {
  if (price.kind === "free")
    return (
      <>
        <div className="font-display text-5xl font-bold text-gradient">Free</div>
        <div className="mt-1 text-sm text-white/60">No obligation</div>
      </>
    );
  if (price.kind === "fixed")
    return (
      <>
        <div className="font-display text-5xl font-bold text-gradient">{price.upfront}</div>
        <div className="mt-1 text-sm font-medium text-white/70">{price.monthly}</div>
      </>
    );
  return (
    <>
      <div className="font-display text-3xl font-bold leading-[3rem]">Custom quote</div>
      <div className="mt-1 text-sm text-white/60">Book a call</div>
    </>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-ink px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">Pricing</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">Start free. Add what you need.</h2>
        <p className="mt-4 max-w-xl text-white/65">See your design before you spend anything. Growth and Operator are quoted to fit your business.</p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`glass relative flex flex-col rounded-3xl p-6 ${p.featured ? "max-lg:mt-3 border-teal/60 shadow-[0_0_60px_rgba(25,240,210,0.18)] lg:-my-2 lg:py-8" : ""}`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-teal to-violet px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(25,240,210,0.4)]">
                  {p.badge}
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-violet">{p.tag}</p>
              <h3 className="font-display mt-2 text-2xl font-bold">{p.name}</h3>
              <div className="mt-4 min-h-[5rem]">
                <PriceBlock price={p.price} />
              </div>
              <p className="mt-3 text-sm text-white/70">{p.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-white/80">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-teal" aria-hidden>
                      ✓
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
              {"href" in p.cta ? (
                <Link href={p.cta.href} className={`${p.featured || p.price.kind === "free" ? "btn-primary" : "btn-ghost"} mt-7`}>
                  {p.cta.label}
                </Link>
              ) : (
                <button
                  className="btn-ghost mt-7"
                  onClick={() => {
                    if ("prefill" in p.cta) prefillContact(p.cta.prefill);
                    scrollToId("contact");
                  }}
                >
                  {p.cta.label}
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-white/45">Final pricing depends on site size and features. We confirm it with you before any work begins.</p>
      </div>
    </section>
  );
}
