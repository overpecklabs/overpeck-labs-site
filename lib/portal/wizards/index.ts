import type { PortalPlan, WizardDef } from "../types";
import { growthWizard } from "./growth";
import { proWizard } from "./pro";
import { starterWizard } from "./starter";

const WIZARDS: Record<PortalPlan, WizardDef> = { starter: starterWizard, growth: growthWizard, pro: proWizard };

/** The wizard for a plan, or null when the plan is missing or unknown (the portal then shows a "we're setting up" message). */
export function getWizard(plan: string | null | undefined): WizardDef | null {
  return plan && plan in WIZARDS ? WIZARDS[plan as PortalPlan] : null;
}

export { starterWizard, growthWizard, proWizard };
