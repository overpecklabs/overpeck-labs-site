import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

/**
 * Overpeck Plumbing's phone number: the Overpeck Labs office line (the AI demo line moved to Overpeck Electric).
 * Single source for the demo page and its chat. NEXT_PUBLIC_OVERPECK_PLUMBING_PHONE (inlined at build time) overrides it.
 */
const FALLBACK = { display: PHONE_DISPLAY, tel: `tel:${PHONE_TEL}` };

function fromEnv(raw: string | undefined): { display: string; tel: string } {
  const display = raw?.trim();
  if (!display) return FALLBACK;
  const d = display.replace(/\D/g, "");
  if (d.length === 10) return { display, tel: `tel:+1${d}` };
  if (d.length === 11 && d.startsWith("1")) return { display, tel: `tel:+${d}` };
  return FALLBACK;
}

export const PLUMBING_PHONE = fromEnv(process.env.NEXT_PUBLIC_OVERPECK_PLUMBING_PHONE);
