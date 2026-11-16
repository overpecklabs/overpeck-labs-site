import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

/**
 * Overpeck Exterior Care's phone number: the Overpeck Labs office line, (201) 949-7695. No dedicated AI line is
 * planned for this demo, so the page never promises an AI receptionist. Never a 555 number.
 */
type Phone = { display: string; tel: string };

export const EXTERIOR_PHONE: Phone = { display: PHONE_DISPLAY, tel: `tel:${PHONE_TEL}` };
