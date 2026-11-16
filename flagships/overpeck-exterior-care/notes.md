# Overpeck Exterior Care (flagship showcase)

- **Slug:** overpeck-exterior-care
- **Industry:** Exterior cleaning (window washing, power washing, soft washing)
- **Town:** Bergen County, NJ
- **Demo created:** 2026-11-16
- **Live URL:** https://overpecklabs.com/demo/overpeck-exterior-care?preview=1

## Notes
- Fictional sample brand by Overpeck Labs (second flagship). Not a client.
- Single lead flow: the hero form is the only form; every other CTA uses <LeadJump> (hero form, or its "Add details" steps).
- Phone (phone.ts): NEXT_PUBLIC_OVERPECK_EXTERIOR_PHONE = AI receptionist demo line. Unset: the receptionist card shows
  "Demo line coming soon" with no tel link, and the call buttons use the Overpeck Labs office line (201) 949-7695.
- AI chat: app/api/demo/overpeck-exterior-care/chat/route.ts (AI SDK via Vercel AI Gateway, default
  google/gemini-2.5-flash-lite, override OVERPECK_EXTERIOR_AI_MODEL, needs AI_GATEWAY_API_KEY). Scripted fallback.
- No licenses, awards, years or stats are claimed; package prices, insurance and policies carry <SampleMark />.
