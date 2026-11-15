export type ServiceKey = "mockup" | "websites" | "workflows" | "tracking" | "ai";

export const SERVICES: { key: Exclude<ServiceKey, "mockup">; n: string; name: string; line: string; anchor: string }[] = [
  {
    key: "websites",
    n: "01",
    name: "Websites That Win Business",
    line: "Sites built to bring in calls, leads and jobs, not just look good.",
    anchor: "websites",
  },
  {
    key: "workflows",
    n: "02",
    name: "Workflows & Automation",
    line: "Follow-ups, booking, invoice reminders and review requests run on their own.",
    anchor: "workflows",
  },
  {
    key: "tracking",
    n: "03",
    name: "Track, Monitor & Optimize",
    line: "We watch calls, forms, rankings and site health, fix what breaks and find new opportunities.",
    anchor: "tracking",
  },
  {
    key: "ai",
    n: "04",
    name: "AI That Never Misses",
    line: "AI Chat Bot, AI Call Receptionist and AI Agents catch the leads you can't get to.",
    anchor: "ai",
  },
];

export const CONTACT_OPTIONS: { key: ServiceKey; label: string }[] = [
  { key: "mockup", label: "Free website mockup" },
  ...SERVICES.map((s) => ({ key: s.key, label: s.name })),
];

export const PHONE_DISPLAY = "(201) 949-7695";
export const PHONE_TEL = "+12019497695";

/** Ask the contact form to pre-check these options. */
export function prefillContact(keys: ServiceKey[]) {
  window.dispatchEvent(new CustomEvent<ServiceKey[]>("contact-prefill", { detail: keys }));
}
