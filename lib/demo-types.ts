import type { ComponentType } from "react";

/** Common fields every demo's demo/data.ts provides (clients/{slug}/ or flagships/{slug}/). Add client-specific extras freely. */
export type DemoData = {
  slug: string;
  businessName: string;
  industry: string;
  town: string;
  serviceArea: string;
  phone: { display: string; tel: string } | null;
  colors: { primary: string; accent: string; dark: string };
  services: { title: string; body: string }[];
};

/** What each clients/{slug}/index.ts or flagships/{slug}/index.ts exports and lib/demos.ts registers. */
export type Demo = {
  slug: string;
  businessName: string;
  /** "mockup" (default): "Free homepage mockup for {name}". "showcase": Overpeck Labs' own sample brand. */
  banner?: "mockup" | "showcase";
  /** Optional browser-tab icon, e.g. "/demos/{slug}/icon.svg". */
  icon?: string;
  /** Lazy so each demo's code only loads on its own page. */
  load: () => Promise<{ default: ComponentType }>;
};
