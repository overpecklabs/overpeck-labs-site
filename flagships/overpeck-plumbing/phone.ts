import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

/**
 * Overpeck Plumbing's phone number: the Overpeck Labs office line. The AI demo line (201) 379-9138 moved to
 * Overpeck Electric, so NEXT_PUBLIC_OVERPECK_PLUMBING_PHONE is intentionally no longer read here.
 */
export const PLUMBING_PHONE = { display: PHONE_DISPLAY, tel: `tel:${PHONE_TEL}` };
