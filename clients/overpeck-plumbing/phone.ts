/**
 * Overpeck Plumbing's phone number = the live AI receptionist demo line. Single source for the demo page, its chat
 * and the homepage showcase. NEXT_PUBLIC_OVERPECK_PLUMBING_PHONE (inlined at build time) overrides the fallback.
 */
const FALLBACK = { display: "(201) 379-9138", tel: "tel:+12013799138" };

function fromEnv(raw: string | undefined): { display: string; tel: string } {
  const display = raw?.trim();
  if (!display) return FALLBACK;
  const d = display.replace(/\D/g, "");
  if (d.length === 10) return { display, tel: `tel:+1${d}` };
  if (d.length === 11 && d.startsWith("1")) return { display, tel: `tel:+${d}` };
  return FALLBACK;
}

export const PLUMBING_PHONE = fromEnv(process.env.NEXT_PUBLIC_OVERPECK_PLUMBING_PHONE);
