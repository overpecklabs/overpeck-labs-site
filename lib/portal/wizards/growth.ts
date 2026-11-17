import { STEPS } from "../steps";
import type { WizardDef } from "../types";

/** Growth: everything in Starter plus AI website chat, instant lead alerts by text, Google Business Profile setup, monthly content updates. 11 steps. */
export const growthWizard: WizardDef = {
  plan: "growth",
  planName: "Growth",
  introTitle: "Let's set up your website and lead tools",
  intro:
    "First your website details, then the website chat, lead alerts by text, your Google Business Profile and monthly content. It takes about 15 to 20 minutes, saves as you go, and you can pick up where you left off.",
  checklist: [
    "Everything we need to build your website",
    "Answers for your AI website chat, and when it should hand off to a call",
    "Where to text you when a new lead comes in",
    "Your Google Business Profile details",
    "Topics and offers for your monthly content",
  ],
  steps: [
    STEPS.basics,
    STEPS.brand,
    STEPS.services,
    STEPS.photos,
    STEPS.pages,
    STEPS.domain,
    STEPS.chat,
    STEPS.alerts,
    STEPS.gbp,
    STEPS.content,
    STEPS.review,
  ],
};
