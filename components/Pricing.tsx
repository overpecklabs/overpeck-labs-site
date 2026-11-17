"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { RECEPTIONIST_PHONE as DEMO_LINE } from "@/flagships/overpeck-electric/phone";
import ElementBadge from "./ElementBadge";

type Price = { setup: string; monthly: string };

type Plan = {
  name: string;
  el: { num: string; sym: string };
  tag: string;
  blurb: string;
  items: string[];
  price: Price;
  mol: string[]; // the matching molecule (which elements this tier combines)
  glow: string; // hover glow
  card: string; // index-card color
  tile: string; // element tile color
  tilt: string;
  badge?: string;
  featured?: boolean;
  /** Item that gets the "Hear it: call our demo line" link. */
  demoItem?: string;
};

// Each card has one CTA, "Get started": the tier's Stripe Payment Link (build-time env), or /free-mockup if unset.
const CHECKOUT: Record<string, string | undefined> = {
  Starter: process.env.NEXT_PUBLIC_STRIPE_LINK_STARTER,
  Growth: process.env.NEXT_PUBLIC_STRIPE_LINK_GROWTH,
  Pro: process.env.NEXT_PUBLIC_STRIPE_LINK_PRO,
};
const RECEPTIONIST = "AI phone receptionist that picks up when you're on a job or after hours, books jobs and texts you each lead";

// Array order = display order on every screen size (cards stack in this order on mobile).
const PLANS: Plan[] = [
  {
    name: "Starter",
    el: { num: "01", sym: "St" },
    tag: "Your website, done right",
    blurb: "A custom website built to bring in calls and jobs.",
    price: { setup: "$500", monthly: "$50" },
    items: ["Custom mobile-first website", "Hosting and SSL", "Small edits", "Contact / quote form"],
    mol: ["Ws"],
    glow: "rgba(15,118,110,0.28)",
    card: "#c8f5ec",
    tile: "#e8fbf7",
    tilt: "tilt-l",
  },
  {
    name: "Growth",
    el: { num: "02", sym: "Gr" },
    tag: "Catch more leads online",
    blurb: "Everything in Starter, plus AI and alerts that turn visitors into jobs.",
    price: { setup: "$1,000", monthly: "$149" },
    items: [
      "Everything in Starter",
      "AI website chat that answers questions and captures leads, even after hours",
      "Instant lead alerts by text",
      "Google Business Profile setup",
      "Monthly content updates",
    ],
    mol: ["Ws", "Au", "Ai"],
    glow: "rgba(31,111,235,0.25)",
    card: "#dbe8ff",
    tile: "#eef4ff",
    tilt: "tilt-r",
    badge: "Most popular",
    featured: true,
  },
  {
    name: "Pro",
    el: { num: "03", sym: "Pr" },
    tag: "Pick up more calls",
    blurb: "Everything in Growth, plus an AI receptionist on your phone line.",
    price: { setup: "$1,500", monthly: "$349" },
    items: ["Everything in Growth", RECEPTIONIST],
    demoItem: RECEPTIONIST,
    mol: ["Ws", "Au", "Op", "Ai"],
    glow: "rgba(47,158,68,0.25)",
    card: "#dcf3df",
    tile: "#eefaef",
    tilt: "tilt-l",
  },
];

const ATOM: Record<string, string> = { Ws: "#19f0d2", Au: "#8ab4f8", Op: "#7fd18f", Ai: "#f5c26b" };

/** Ball-and-stick sketch of the elements a tier combines (decorative). */
function Molecule({ atoms }: { atoms: string[] }) {
  if (!atoms.length)
    return (
      <svg width="58" height="44" viewBox="0 0 58 44" aria-hidden>
        <circle cx="29" cy="22" r="15" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="4 4" />
        <text x="29" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a1a1a">?</text>
      </svg>
    );
  const pts = atoms.map((_, i) => ({ x: 18 + i * 30, y: i % 2 ? 30 : 14 }));
  const w = 36 + (atoms.length - 1) * 30;
  return (
    <svg width={w} height="44" viewBox={`0 0 ${w} 44`} aria-hidden>
      {pts.slice(1).map((p, i) => (
        <line key={i} x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y} stroke="#1a1a1a" strokeWidth="2.5" />
      ))}
      {atoms.map((a, i) => (
        <g key={a}>
          <circle cx={pts[i].x} cy={pts[i].y} r="12" fill={ATOM[a]} stroke="#1a1a1a" strokeWidth="2" />
          <text x={pts[i].x} y={pts[i].y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1a1a1a">
            {a}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PriceBlock({ price }: { price: Price }) {
  return (
    <>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-bold text-ink">{price.setup}</span>
        <span className="text-sm font-semibold text-ink/85">setup</span>
      </div>
      <div className="mt-1 text-sm font-semibold text-ink/85">
        + <span className="font-display text-xl font-bold text-ink">{price.monthly}</span>/mo
      </div>
    </>
  );
}

export default function Pricing() {
  const grid = useRef<HTMLDivElement>(null);

  // Desktop: cards start stacked in depth like lab tiles, fan out into a row as you scroll,
  // then "Most popular" gets circled in red marker as they land. Phones / reduced motion: static.
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    if (!window.matchMedia("(min-width: 1024px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
      const w = cards[0].offsetWidth + 28;
      gsap.set("[data-circle]", { strokeDashoffset: 1 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", end: "top 30%", scrub: 0.6 } });
      cards.forEach((c, i) => {
        const off = (cards.length - 1) / 2 - i; // distance from the center of the row
        tl.fromTo(
          c,
          { x: off * w, z: -120 - i * 70, rotationY: 32, rotationZ: -off * 3, opacity: 0.35 },
          { x: 0, z: 0, rotationY: 0, rotationZ: 0, opacity: 1, ease: "power2.out", duration: 1 },
          0
        );
      });
      tl.to("[data-circle]", { strokeDashoffset: 0, ease: "power1.inOut", duration: 0.35 }, 0.95);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" style={{ ["--cv-h" as string]: "2277px" }} className="cv-m graph-paper relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">Pricing</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold text-ink sm:text-5xl">Simple pricing. Real results.</h2>
        <p className="mt-4 max-w-xl text-ink/85">
          Three plans, clear prices. Every plan starts with a free homepage design, so you see your new site before you spend anything.
        </p>

        <div ref={grid} className="mx-auto mt-24 grid max-w-md gap-x-7 gap-y-20 [perspective:1600px] lg:max-w-none lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              data-card
              className={`relative flex flex-col rounded-[4px] p-6 shadow-[0_2px_3px_rgba(26,26,26,0.06),0_14px_30px_rgba(26,26,26,0.10)] transition-shadow duration-300 hover:shadow-[0_6px_10px_rgba(26,26,26,0.06),0_30px_60px_var(--glow)] ${p.tilt} ${
                p.featured ? "outline outline-[3px] outline-offset-0 outline-[#0f766e] max-lg:mt-4 lg:-my-2 lg:py-8" : ""
              }`}
              style={{ background: p.card, ["--glow" as string]: p.glow }}
            >
              {/* the tier's molecule, floating above the card */}
              <div className="float-y absolute -top-14 left-1/2 -translate-x-1/2" title={`Combines: ${p.mol.join(", ")}`}>
                <Molecule atoms={p.mol} />
              </div>
              {p.badge && (
                <span className="absolute -top-3.5 right-5 rotate-[3deg] rounded-sm border-2 border-[#0f766e] bg-white px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0f766e] shadow-sm">
                  {p.badge}
                  {/* red marker circle, drawn as the cards land */}
                  <svg className="pointer-events-none absolute -inset-x-4 -inset-y-3 h-[calc(100%+24px)] w-[calc(100%+32px)] overflow-visible" viewBox="0 0 140 44" preserveAspectRatio="none" aria-hidden>
                    <path data-circle d="M10 24 C8 6 128 2 132 20 C136 38 18 44 8 26 C6 18 20 10 40 8" fill="none" stroke="#d93f44" strokeWidth="2.5" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 0 }} />
                  </svg>
                </span>
              )}
              <div className="flex items-start gap-4">
                <ElementBadge num={p.el.num} symbol={p.el.sym} name={p.name.split(" ")[0]} bg={p.tile} />
                <div className="min-w-0 pt-1">
                  <p className="text-[11px] font-bold uppercase leading-tight tracking-widest text-ink/80">{p.tag}</p>
                  <h3 className="font-display mt-1 text-2xl font-bold text-ink">{p.name}</h3>
                </div>
              </div>
              <div className="mt-5 min-h-[5rem]">
                <PriceBlock price={p.price} />
                <p className="mt-1.5 text-xs font-semibold text-ink/75">No contracts, cancel anytime.</p>
              </div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-ink/75">
                {p.mol.length === 4 ? "The full formula" : p.mol.join(" + ")}
              </div>
              <p className="mt-3 text-sm text-ink/85">{p.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-ink/90">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" className="mt-0.5 shrink-0" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 13 l5 5 L20 6" />
                    </svg>
                    <span>
                      {i}
                      {p.demoItem === i && (
                        <a href={DEMO_LINE.tel} className="mt-1.5 flex flex-wrap items-center gap-x-1.5 font-semibold text-teal-ink underline underline-offset-4 hover:no-underline">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                          </svg>
                          Hear it: call our demo line <span className="whitespace-nowrap font-normal">{DEMO_LINE.display}</span>
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {CHECKOUT[p.name] ? (
                <a href={CHECKOUT[p.name]} aria-label={`Get started with the ${p.name} plan`} className={`${p.featured ? "btn-primary" : "btn-ghost"} mt-7 text-center`}>
                  Get started
                </a>
              ) : (
                <Link href="/free-mockup" aria-label={`Get started with the ${p.name} plan`} className={`${p.featured ? "btn-primary" : "btn-ghost"} mt-7 text-center`}>
                  Get started
                </Link>
              )}
            </div>
          ))}
        </div>
        <p className="mt-16 text-center text-base font-semibold text-ink/85">No contracts. Cancel anytime.</p>
      </div>
    </section>
  );
}
