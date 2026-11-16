"use client";

import { LeadForm, type LeadBasics } from "@/components/demos/lead";
import QuoteWizard from "./QuoteWizard";
import { data } from "./data";

/** The short lead form with the multi-step quote as its "Add details" flow (a client island; the page is server-rendered). */
const renderQuote = (basics: LeadBasics) => <QuoteWizard basics={basics} accent={data.colors.accent} />;

export default function HeroLeadForm(props: Omit<React.ComponentProps<typeof LeadForm>, "renderDetails" | "details">) {
  return <LeadForm {...props} renderDetails={renderQuote} />;
}
