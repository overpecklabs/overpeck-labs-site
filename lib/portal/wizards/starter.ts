import { STEPS } from "../steps";
import type { WizardDef } from "../types";

/** Starter: custom mobile-first website, hosting and SSL, small edits, contact / quote form. 7 steps. */
export const starterWizard: WizardDef = {
  plan: "starter",
  planName: "Starter",
  introTitle: "Let's build your website",
  intro:
    "A few quick sections about your business, your look and your services. It takes about 10 to 15 minutes, saves as you go, and you can stop and pick up later.",
  checklist: [
    "Your business details and service area",
    "Your logo, colors and style",
    "Your services, with short descriptions",
    "Photos of your work",
    "The pages and quote form you want",
    "Your domain details",
  ],
  steps: [STEPS.basics, STEPS.brand, STEPS.services, STEPS.photos, STEPS.pages, STEPS.domain, STEPS.review],
};
