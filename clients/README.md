# Client demos

Each client gets one folder, `clients/{slug}/`, holding their private homepage mockup.
The single route `app/demo/[slug]/page.tsx` serves it at `/demo/{slug}` and adds the
"Free homepage mockup" banner, the view tracker, noindex/nofollow, and a 404 for unknown slugs.
Demos are never linked publicly and are not in the sitemap.

```
clients/
  README.md
  _template/              copy this for a new client (never registered or served)
  {slug}/
    index.ts              registry entry (reads slug + name from data.ts)
    demo/
      data.ts             business name, colors, services, contact info, ...
      page-content.tsx    the demo homepage (all its sections)
    assets/               logo + images (copied to public/demos/{slug}/)
    notes.md              industry, town, date created, preview URL
```

## Add a new client

1. Copy `clients/_template` to `clients/{slug}`. The slug is the business name, lowercase and
   hyphenated ("Mains and drains" -> `mains-and-drains`).
2. Fill in `demo/data.ts` (set `slug` to the folder name) and replace every `[PLACEHOLDER]`.
   Use only true details: no invented reviews, awards, licenses, years or stats.
3. Build the homepage in `demo/page-content.tsx`. Keep forms display-only (no network requests).
4. Put the logo and images in `assets/`. `npm run dev` and `npm run build` copy them to
   `public/demos/{slug}/` (`npm run demo-assets` does it on demand). Reference them as
   `/demos/{slug}/<file>`, and commit both copies.
5. Fill in `notes.md`.
6. Register it in `lib/demos.ts`:
   ```ts
   import mainsAndDrains from "@/clients/mains-and-drains";
   export const DEMOS: Demo[] = [mainsAndDrains];
   ```
7. If the demo was shared at an older URL, add it to `LEGACY_DEMO_REDIRECTS` in `next.config.mjs`.
8. `npm run lint && npm run build`, then open `/demo/{slug}?preview=1` (`?preview=1` keeps your
   own visits out of the view counts).
