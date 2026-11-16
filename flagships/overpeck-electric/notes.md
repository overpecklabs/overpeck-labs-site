# Overpeck Electric (flagship showcase)

- **Slug:** overpeck-electric
- **Industry:** Electrician (panel upgrades, EV chargers, lighting, generators, troubleshooting, inspections)
- **Town:** Bergen County, NJ
- **Demo created:** 2026-11-16
- **Live URL:** https://overpecklabs.com/demo/overpeck-electric?preview=1

## Notes
- Fictional sample brand by Overpeck Labs (third flagship). Not a client. "Licensed & insured" and other facts carry <SampleMark />.
- Server-rendered page; client islands: HeroLeadForm (+ DetailsWizard), CircuitStory (one continuous scroll story), EvEstimate, ChatAssistant/ChatPanel, AppearObserver.
- Phone (phone.ts): NEXT_PUBLIC_OVERPECK_ELECTRIC_PHONE = AI receptionist demo line. Unset: the receptionist card shows
  "Demo line coming soon" with no tel link, and the call buttons use the Overpeck Labs office line (201) 949-7695.
- AI chat: app/api/demo/overpeck-electric/chat/route.ts (AI SDK via Vercel AI Gateway, default google/gemini-2.5-flash-lite,
  override OVERPECK_ELECTRIC_AI_MODEL, needs AI_GATEWAY_API_KEY). Safety-first prompt. Scripted fallback.
