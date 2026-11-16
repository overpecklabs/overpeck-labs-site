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

`clients/overpeck-plumbing/` is Overpeck Labs' own flagship showcase (a fictional brand, not a client). Its
registry entry sets `banner: "showcase"` ("Sample site by Overpeck Labs" + "Get yours") and an `icon`; it also
shows the AI chat assistant (`app/api/demo/overpeck-plumbing/chat`, AI SDK with Google Gemini, falls back
to a scripted demo without `GOOGLE_GENERATIVE_AI_API_KEY`) and a custom multi-step quote via `<LeadForm renderDetails>`.

## Add a new client

1. Copy `clients/_template` to `clients/{slug}`. The slug is the business name, lowercase and
   hyphenated ("Mains and drains" -> `mains-and-drains`).
2. Fill in `demo/data.ts` (set `slug` to the folder name) and replace every `[PLACEHOLDER]` with finished,
   specific copy: the demo must look done. Real facts as-is; unknown facts (rates, license, insurance, years,
   stats) get natural typical wording plus `sample: true` (shows a tiny "sample" marker). Write 6-8 sample
   reviews (one `<SampleTag />` on the heading) and 8-10 FAQs. See `components/demos/sample.tsx`.
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
7. Photos and motion (every demo has both):
   - **Photos:** free-license stock photos (Pexels preferred, or Unsplash) for the hero, services, gallery and
     about sections. Never hotlink: download them with the script, which saves WebP (max 1600px wide) to
     `assets/`, copies to `public/demos/{slug}/` and records source + photographer in `assets/CREDITS.md`:
     ```
     npm run demo-photos -- search "dog walking park"            # check the contact sheet it prints
     npm run demo-photos -- get {slug} pexels:12345 hero --alt "Dog on a leash in a park"
     ```
     Needs `PEXELS_API_KEY` (or `UNSPLASH_ACCESS_KEY`) in `.env.local`. No identifiable people presented
     as the business's staff, no other companies' logos or branded vehicles. AI-generated images only if no
     fitting stock photo exists, marked "AI-generated" in CREDITS.md. Put the paths in `data.photos` and
     render every image with `<DemoImage>` (lazy unless `priority`).
   - **Lead capture:** use `@/components/demos/lead`: a short `<LeadForm>` above the fold (desktop right
     column; on phones headline, form and call button all fit the first 375x667 screen), `<CtaBand>` after
     services, the same form in the final CTA, `<MobileLeadBar>` and desktop-only `<ExitIntent>`. Forms are
     display-only; `submitLead()` is where a live site would save to Supabase. One lead flow only: no long
     forms further down; extra CTAs are `<CtaBand>` / `<LeadJump>` back to the hero form (they open "Add
     details" once it's submitted).
   - **Parallax:** image-only and subtle. `<HeroImage>` for the hero photo, plus `<Parallax>` (a fixed aspect
     box) on 1-2 photo sections. Never on text, buttons, forms, reviews or FAQ. It's off under reduced motion
     and halved under 768px.
   - **Motion:** use `@/components/demos/motion`: `MotionRoot`, `StickyHeader`, `HeroIntro`/`HeroItem`,
     `HeroImage`, `Reveal`, `Stagger`/`StaggerItem`, `CountUp` (true numbers only) and the `demo-lift` class.
     They respect prefers-reduced-motion and animate transform/opacity only.
8. If the demo was shared at an older URL, add it to `LEGACY_DEMO_REDIRECTS` in `next.config.mjs`.
9. `npm run lint && npm run build`, then open `/demo/{slug}?preview=1` (`?preview=1` keeps your
   own visits out of the view counts).
