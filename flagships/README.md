# Flagship demos

Overpeck Labs' own **fictional** sample companies. They show prospects everything we can build, so each one
is the best-looking, most complete demo on the site. They're not clients: real client demos live in
`clients/` (see `clients/README.md`).

Flagships are served exactly like client demos, at `/demo/{slug}` by `app/demo/[slug]/page.tsx` (noindex,
not in the sitemap, view tracker on), but their registry entry sets `banner: "showcase"`, so the banner reads
"Sample site by Overpeck Labs" with a "Get yours" button instead of "Free homepage mockup for …".

## Flagships

| Flagship | Live URL | AI receptionist (demo line) | Env vars |
| --- | --- | --- | --- |
| Overpeck Plumbing (`overpeck-plumbing/`) | https://overpecklabs.com/demo/overpeck-plumbing | (201) 379-9138 | `NEXT_PUBLIC_OVERPECK_PLUMBING_PHONE`, `OVERPECK_PLUMBING_AI_MODEL`, `AI_GATEWAY_API_KEY` |
| Overpeck Exterior Care (`overpeck-exterior-care/`) | https://overpecklabs.com/demo/overpeck-exterior-care | not set yet (card shows "Demo line coming soon") | `NEXT_PUBLIC_OVERPECK_EXTERIOR_PHONE`, `OVERPECK_EXTERIOR_AI_MODEL`, `AI_GATEWAY_API_KEY` |

### Env vars

| Variable | Used by | What it does |
| --- | --- | --- |
| `AI_GATEWAY_API_KEY` | every flagship's AI chat | Turns on the real AI chat through Vercel AI Gateway. Without it, the chat runs a scripted demo. |
| `NEXT_PUBLIC_OVERPECK_PLUMBING_PHONE` | Overpeck Plumbing (page, chat, homepage showcase) | The phone number shown everywhere (the live AI receptionist line). Build-time; fallback "(201) 379-9138". |
| `OVERPECK_PLUMBING_AI_MODEL` | Overpeck Plumbing chat | Optional Gateway model id. Default `google/gemini-2.5-flash-lite`. |
| `NEXT_PUBLIC_OVERPECK_EXTERIOR_PHONE` | Overpeck Exterior Care | The AI receptionist demo line. Build-time. Unset: the receptionist card shows "Demo line coming soon" with no tel link, and the page's call buttons use the Overpeck Labs office line (201) 949-7695. |
| `OVERPECK_EXTERIOR_AI_MODEL` | Overpeck Exterior Care chat | Optional Gateway model id. Default `google/gemini-2.5-flash-lite`. |

`NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.

## Folder layout

Same as a client demo (start from `clients/_template`):

```
flagships/{slug}/
  index.ts        registry entry (banner: "showcase", icon)
  demo/           data.ts, page-content.tsx and any demo-only components
  assets/         photos (WebP) + CREDITS.md, synced to public/demos/{slug}/
  notes.md
```

Register it in `lib/demos.ts` with `import x from "@/flagships/{slug}"`. AI chat routes live at
`app/api/demo/{slug}/chat/route.ts`. Photos: `npm run demo-photos -- get {slug} ...` saves into
`flagships/{slug}/assets/` once that folder exists.

## Rules every flagship follows

- Fictional brand: claim no licenses, awards, years or stats; anything that sounds like a fact gets `<SampleMark />`,
  reviews are sample reviews with one `<SampleTag />`. No 555 numbers. Never mention text-message summaries.
- Single lead flow: the hero form is the only form; every other CTA goes to it (`<LeadJump>`) or opens its
  "Add details" steps. Everything goes through `submitLead()` (display-only).
- Lead capture above the fold (on phones: headline, form and call button on the first 375x667 screen), subtle
  image-only parallax, finished copy, stock photos credited in `assets/CREDITS.md`.
