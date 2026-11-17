import { STEPS } from "../steps";
import type { WizardDef } from "../types";

/** Pro: everything in Growth plus an AI phone receptionist (answers when you're busy or after hours, books jobs, texts each lead). 15 steps. */
export const proWizard: WizardDef = {
  plan: "pro",
  planName: "Pro",
  introTitle: "Let's set up your website, lead tools and phone receptionist",
  intro:
    "Your website and lead tools first, then your phone line, the receptionist's script, booking rules and transfers. It takes about 25 minutes, saves as you go, and you can come back any time.",
  checklist: [
    "Everything we need to build your website and lead tools",
    "Your business phone line and how forwarding works with your carrier",
    "The receptionist's greeting and answers to common questions",
    "Which jobs it can book, and when",
    "When to transfer a call to you, and who gets lead texts",
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
    STEPS.phone,
    STEPS.script,
    STEPS.booking,
    STEPS.transfers,
    STEPS.review,
  ],
};
