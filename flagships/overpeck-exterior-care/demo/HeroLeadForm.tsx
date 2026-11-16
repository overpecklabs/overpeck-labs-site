"use client";

import { LeadForm, type LeadBasics } from "@/components/demos/lead";
import DetailsWizard from "./DetailsWizard";
import { data } from "./data";

/** The hero lead form with its "Add details" steps (a client island; the page is server-rendered). */
const renderDetails = (basics: LeadBasics) => <DetailsWizard basics={basics} accent={data.colors.accent} />;

export default function HeroLeadForm(props: Omit<React.ComponentProps<typeof LeadForm>, "renderDetails" | "details">) {
  return <LeadForm {...props} renderDetails={renderDetails} />;
}
