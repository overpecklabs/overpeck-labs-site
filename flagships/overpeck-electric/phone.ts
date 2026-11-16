import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

/**
 * Overpeck Electric phone numbers.
 *  - RECEPTIONIST_PHONE: the live AI receptionist demo line from NEXT_PUBLIC_OVERPECK_ELECTRIC_PHONE (inlined at
 *    build time), or null when unset. Tel links that would use it are hidden while it's null.
 *  - ELECTRIC_PHONE: the number used for the page's call buttons: the receptionist line when set, otherwise the
 *    Overpeck Labs office line. Never a 555 number.
 */
type Phone = { display: string; tel: string };

function parse(raw: string | undefined): Phone | null {
  const display = raw?.trim();
  if (!display) return null;
  const d = display.replace(/\D/g, "");
  if (d.length === 10) return { display, tel: `tel:+1${d}` };
  if (d.length === 11 && d.startsWith("1")) return { display, tel: `tel:+${d}` };
  return null;
}

export const RECEPTIONIST_PHONE: Phone | null = parse(process.env.NEXT_PUBLIC_OVERPECK_ELECTRIC_PHONE);
export const OFFICE_PHONE: Phone = { display: PHONE_DISPLAY, tel: `tel:${PHONE_TEL}` };
export const ELECTRIC_PHONE: Phone = RECEPTIONIST_PHONE ?? OFFICE_PHONE;
