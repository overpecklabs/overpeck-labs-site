import type { ComponentType } from "react";

/** Common fields every client's clients/{slug}/demo/data.ts provides. Add client-specific extras freely. */
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

/** What each clients/{slug}/index.ts exports and lib/demos.ts registers. */
export type Demo = {
  slug: string;
  businessName: string;
  /** Lazy so each demo's code only loads on its own page. */
  load: () => Promise<{ default: ComponentType }>;
};
