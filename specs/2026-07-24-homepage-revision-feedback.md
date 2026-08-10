# Spec: Homepage revision — Crispin's Mobile + Desktop feedback

**Date:** 2026-07-24
**Status:** Done
**Type:** Bug fix + Feature (mixed)

## Problem

Crispin reviewed the homepage revision shipped in commit `2c9b10d` ("Homepage revision
pass: hero motion, master-detail treatments, per-tier pricing/steps") on both Mobile
and Desktop, and returned itemized feedback per section. TrustStats, ReviewsWall, and
AwardsSection are approved as-is. The remaining five sections (HeroScene,
TreatmentsSection, HowItWorksScene, PricingSection, LocationsSection) each need at
least one fix, and two of them (HeroScene, TreatmentsSection) need a *different* fix
on mobile vs. desktop. This spec covers all of it.

All affected components live at `src/components/home/*.astro` and are shared,
lang-driven components rendered by both `/` (EN) and `/th/home/` (TH) via
`HomePage.astro` — every fix here must be verified in **both languages**.

Two more pieces of feedback landed mid-execution and were folded in as Batch A/B
(site-chrome, not homepage-section): remove the mobile sticky `ContactBar`, and swap
the header's top-right Call CTA for a LINE CTA on both breakpoints. A third
(How-It-Works/Pricing: "remove all the effects, put the original picture back, keep
it simple") landed after Batches 1–4 were already done and replaced this spec's
original Batch 5/6 approach — see the **Result** section at the bottom for what
actually shipped there instead.

## Project constraints that apply

- Always use the Astro `<Image>` component, never a raw `<img>` tag (§7 Images).
- Validate any downloaded image's magic bytes before using it (§7 Images) — done for
  both source composites below (both are valid JPEG, `FF D8 FF E0` header).
- Do not machine-translate or invent copy; outlet names/hours below are transcribed
  verbatim from the live site's own Locations page content, not translated.
- Avoid heavy JS libraries unless absolutely necessary (§9) — the locations fix reuses
  an iframe (the business's existing Google My Maps embed), not a mapping library.
- Mobile-first Tailwind v4, named `@theme` tokens over arbitrary values (§6 Styling).
- Test both EN and TH — Thai text wraps differently (§6 Styling note).
- "Modernise the look, not the URLs/content/SEO" (Goal 4, §1) — none of these changes
  touch URLs, page copy, or hreflang.

## Assumptions

1. **Locations "interactive map" = the business's own Google My Maps embed.** The live
   site already embeds `https://www.google.com/maps/d/embed?mid=1877_7x9CBuDCk-PxD79RPqWKixsevYU&noprof=1`
   (verified live, 200 OK, contains real "Bee Choo" outlet pins). Re-using it means the
   pins are accurate and business-maintained — we are not hand-geocoding 16 addresses
   ourselves. We restyle its container (rounded corners, shadow, heading) to look
   modern; we don't rebuild the map data.
2. **Mobile "list-view alternative" (client's own suggested option) is what we build**,
   rather than trying to make the embedded map's drag-to-pan safe inside a scrolling
   page. Below the `md` breakpoint the map iframe isn't rendered at all — visitors get
   a card list of all 16 outlets (name, phone as a `tel:` link, hours, and a
   "Directions" link) instead. This fully removes the scroll-trap risk rather than
   mitigating it.
3. **Outlet data** (16 outlets, verified against the live site's Locations page
   content — matches Crispin's "16 outlets" exactly): Sai Mai, Siam Square, Ratchada,
   Udomsuk, Chaiyapruek, Kallapaphruk, Chonburi, The Crystal (Ekamai-Ramindra),
   Sammakorn, Prawet, Chatuchak (Prachachuen), Suksawat, Korat, Surat Thani, Chiang
   Mai, Phutthamonthon — each with a phone number and operating hours scraped from the
   live page. The 17th (opening ~August) isn't on the live site yet, so it isn't in
   this dataset; the list is easy to extend when Crispin supplies it.
4. **SUPERSEDED — see Result.** The original plan was to re-crop `step-1..4.jpg` /
   `tier-1..5.jpg` from the original composite graphics downloaded off the live site's
   media library. Before that work started, Crispin asked to remove the effects
   entirely and go back to the single original picture for both sections instead —
   that replaced the re-crop plan outright, so the two composites below were used
   directly as single images rather than re-cropped into split assets:
   - `wp-content/uploads/2024/07/Treatment-Process-Bee-Choo-ENG.jpg` (800×419) — turned
     out to already be sitting in the repo, unused, as `src/assets/images/how-it-works.jpg`
     (identical file, verified by hash) — no download needed after all.
   - `wp-content/uploads/2022/04/Bee-Choo-price-list-2022_edit-scaled.jpg` (800×566) —
     likewise already in the repo as `src/assets/images/price-list.jpg`.
5. **SUPERSEDED — see Result.** ("Native resolution ceiling" — was about the re-crop
   plan's image quality; moot once the single original composites were used directly
   at their own native resolution instead of being re-cropped into smaller pieces.)
6. **Treatments mobile fix uses a checkbox/radio + `:has()` accordion**, not a native
   `<details>`/`<summary>` element as originally planned — see Result for why (the
   desktop master-detail layout needed the label and its panel to be independently
   grid-placed via `display: contents`, which doesn't compose cleanly with `<details>`
   the same way). Desktop keeps the existing side-by-side master-detail layout; only
   column alignment/height changes there.
7. **Hero desktop fix tunes the existing WebGL shader's uniforms** (push radius/
   strength/easing in `hero-webgl.ts`) rather than replacing the effect — "heavily
   refine the physics to make it subtle" reads as calibration, not removal.

## Proposed change

### 1. HeroScene — mobile text wrap / clutter (`src/components/home/HeroScene.astro`)
`text-balance` currently applies to the EN H1 at *all* sizes, not just `md:` — with
this headline's length, that's very likely today's "broken wrap" on narrow phones
(balance's line-count heuristics don't behave well at 320–390px). Fix:
- Gate `text-balance` to `md:` and up; mobile gets plain natural wrapping with a
  slightly tighter `leading-snug` instead.
- Recheck the tagline (`text-xl font-bold uppercase`-style long string) for the same
  issue; add balance/pretty wrapping there if it also breaks awkwardly on mobile.
- Tighten mobile vertical rhythm (the `py-20` hero + `mt-5/8/10` stack of h1 + tagline
  + 3 CTAs + video, inside `min-h-[100svh]`) so it reads calm rather than cluttered —
  likely a `py-` reduction and smaller gaps at the base breakpoint only, unchanged at
  `md:`.
- No content or CTA changes — text stays identical (SEO).

### 2. HeroScene — desktop cloth cursor (`src/scripts/hero-webgl.ts`)
Reduce the "cloth-push" gimmick to something subtle: lower `u_mouseStrength`'s peak
multiplier (currently `0.7`), shrink the `smoothstep(1.4, 0.0, dist)` influence radius,
and slow the strength-easing factor (currently `0.08`) so the bulge fades in/out more
gently and covers less area. Exact numbers tuned by eye against the live shader in a
browser, not guessed blind.

### 3. TreatmentsSection — mobile accordion (`src/components/home/TreatmentsSection.astro`, `src/styles/global.css`)
Replace the mobile rendering path with a true per-row accordion: each of the 7
treatments becomes its own `<details>` (label as `<summary>`, image + teaser + "Read
more" as the disclosed content), so tapping a name expands its content immediately
below that same row — no scrolling down to a separate panel and back up. Desktop
(`md:`) keeps the current side-by-side list + single detail panel; only the CSS
`:has()` master-detail wiring stays there. `HerbalStrokes`/other approved sections
untouched.

### 4. TreatmentsSection — desktop alignment (`src/components/home/TreatmentsSection.astro`)
`md:items-start` on the two-column grid is why the columns aren't height-matched.
Switch to stretch alignment (`md:items-stretch`, the grid default once `items-start`
is removed) and make the label-list column fill the available height so its 7 rows
distribute evenly (`flex h-full flex-col`, each row `flex-1`) to match the detail
panel's height — "strict symmetry," top-aligned by default under `items-stretch`.

### 5. HowItWorksScene — SUPERSEDED, see Result
Originally planned as an image re-crop of `step-{1..4}.jpg`. Superseded mid-spec by
"remove all the effects, put the original picture back" — see Result for what shipped.

### 6. PricingSection — SUPERSEDED, see Result
Originally planned as an image re-crop of `tier-{1..5}.jpg`. Superseded mid-spec by
"remove all the effects, put the original picture back" — see Result for what shipped.

### 7. LocationsSection — interactive map (`src/components/home/LocationsSection.astro`, new `src/data/locations.ts`)
- **Desktop (`md:` and up):** replace the static `locations-map.jpg` with the
  business's Google My Maps embed (Assumption 1) in a modernised card shell (rounded
  corners, shadow, heading, "Get directions" CTA kept). Add a small "click to
  interact" gesture-gate (cheap vanilla JS in `home-motion.ts`, matching the file's
  existing no-op-if-absent pattern) so hovering the map while scrolling the page
  doesn't get captured by the map's own scroll-zoom.
- **Mobile (below `md:`):** no map iframe at all. Render a list of all 16 outlets
  (`src/data/locations.ts`) as compact cards: name, `tel:` link, hours, and a
  "Directions" link (same `google.com/maps/search/?api=1&query=...` pattern already
  used for `MAPS_HREF`, one per outlet name). Zero scroll-trap risk since there's no
  pannable element on mobile at all.
- Both breakpoints keep the section heading and overall visual language consistent
  with the rest of the (approved) homepage.

## Out of scope

- ReviewsWall, TrustStats, AwardsSection — approved, not touched.
- Building the standalone `/locations/` page (CLAUDE.md Phase 3 backlog item) — this
  spec only touches the homepage teaser section.
- New professional photography for steps/pricing — we re-crop the existing composite
  source; commissioning new photos is a follow-up if Crispin wants sharper imagery.
- Any page other than the homepage (`/` and `/th/home/`) — other pages still use the
  old motion system per the prior session's handoff notes; extending the redesign
  elsewhere is separate work.
- The 17th outlet (opens ~August) — not on the live site yet, so not in the dataset;
  trivial to append later.
- Adding a general map/geo library (Leaflet, Mapbox, Google Maps JS SDK) — the
  existing My Maps iframe embed covers the requirement without new dependencies.

## Batches

**A. Remove mobile sticky ContactBar** (site-wide, not homepage-only) — folded in
mid-execution, see Result.
**B. Header Call CTA → LINE CTA** (both breakpoints) — folded in mid-execution, see
Result.

1. **Hero mobile** — text-wrap + spacing fixes in `HeroScene.astro`. Verify with
   Playwright screenshots at 320×568 and 390×844 in both `en`/`th`.
2. **Hero desktop** — cloth-cursor uniform tuning in `hero-webgl.ts`. Verify with a
   Playwright screenshot/pointer-move test at desktop width.
3. **Treatments mobile accordion** — `TreatmentsSection.astro` + `global.css`. Verify
   by tapping a row in a mobile-viewport Playwright run and confirming the panel
   expands inline without page-jump.
4. **Treatments desktop alignment** — CSS-only change to the same file. Verify equal
   column heights in a desktop screenshot.
5. **How-It-Works — revised to a single static image**, not a re-crop (see Result).
6. **Pricing — revised to a single static image**, not a re-crop (see Result).
7. **Locations interactive map + mobile list** — new `src/data/locations.ts`,
   `LocationsSection.astro` rewrite. Verify map renders on desktop, list renders (no
   map) on mobile, and mobile page-scroll isn't captured when swiping over the list
   area.

Each batch: `npm run build` must pass with zero errors before moving to the next
batch (see Result — `npm run astro check` has a pre-existing, unrelated failure);
commit after each.

## Verification

- `npm run build` clean after every batch (see Result on `astro check`).
- Playwright (playwright-core + the already-cached Chromium binary from a prior
  session) screenshots at mobile (320×568, 390×844) and desktop (1440×900) widths, EN
  and TH, for every touched section.
- Manual interaction check in the Playwright session: tap/click the treatments
  accordion rows, hover the hero canvas, click the locations map's gesture-gate,
  scroll past the mobile outlet list to confirm no scroll-trap.
- Final pass: reload the full homepage (both langs) top-to-bottom at both breakpoints
  and confirm nothing outside the touched sections regressed.

## Result

All batches shipped (commits `5dba61f`…`d2fb305` on `homepage-revisions`). Summary of
what shipped vs. what changed from the original plan:

- **Batch A/B** (folded in mid-spec): deleted `ContactBar.astro` and its `BaseLayout`
  wiring/`UI[lang].bar`/`misc.contact` strings entirely (it was the only mobile sticky
  element in the codebase, rendered site-wide via `BaseLayout`, so "remove the sticky
  buttons" meant removing it everywhere, not just on the homepage). Header's top-right
  pill now links to LINE (`ui.cta.line` label, LINE icon reused from `HeroScene`)
  instead of `tel:`.
- **Batch 1** grew beyond the planned text-wrap/spacing fix: testing surfaced that
  `LanguageSwitcher` (fixed `top-20`, same offset as the hero's `py-20`) sat directly
  on top of the H1 on the homepage specifically, because the overlay header there
  doesn't push content down the way a normal sticky header does. Fixed by moving the
  switcher to `bottom-4` on mobile (freed up now that Batch A removed the old bottom
  ContactBar) and bumping the hero's mobile top padding to `pt-24` so it reliably
  clears the header even in its worst case (2-line wordmark wrap, or a
  reduced-motion visitor whose header never goes transparent).
- **Batch 3** used a checkbox/radio + `:has()` accordion instead of the planned native
  `<details>`: the desktop master-detail layout needs each row's label and panel
  independently placed into a 2-column grid via `display: contents`, and getting a
  single-panel-visible-at-a-time exclusivity out of that while also working as a plain
  accordion on mobile was more directly achieved by reusing the existing radio-based
  `:has()` pattern than restructuring around `<details>`.
- **Batch 4** surfaced and fixed a real CSS bug along the way: an unlayered
  `display: block` rule (meant only to control panel visibility) was unconditionally
  beating the panel's own Tailwind `md:grid` utility regardless of specificity,
  silently breaking its image | text side-by-side layout. Fixed with
  `display: revert-layer` so a shown panel falls back to Tailwind's own responsive
  display classes instead of a hardcoded value.
- **Batch 5/6** — superseded by later feedback ("remove all the effects, put the
  original picture back, keep it simple") before the re-crop work started. Instead of
  cropping `step-{1..4}.jpg`/`tier-{1..5}.jpg` from the originals, both sections now
  render the single original composite image directly
  (`src/assets/images/how-it-works.jpg`, `price-list.jpg` — both already sat in the
  repo, unused, byte-identical to the live site's originals). The pinned scroll-scrubbed
  How-It-Works scene and the 5-card Pricing grid are gone entirely, along with their
  dead CSS/JS. **Explicit trade the user chose, on the record:** the step list and
  per-tier price/name text used to also exist as real, crawlable HTML text alongside
  the images (added specifically for SEO/accessibility in the prior redesign pass) —
  asked directly, the user chose full image-only parity with the legacy site over
  keeping that text. That is a deliberate step back from CLAUDE.md's SEO-first
  guidance, made knowingly, not an oversight.
- **Batch 7** shipped as planned: the live site's own Google My Maps embed on desktop
  behind a CSS-only (`:checked`, zero JS) click-to-interact gate, and a full 16-outlet
  list (name/hours/call/directions) on mobile with no pannable element at all.
- **Tooling note:** `npm run astro check` fails on this branch (and on `main`) with a
  pre-existing Vite/Astro plugin type-mismatch in `astro.config.mjs`, unrelated to any
  of this work (confirmed via `git stash`). `npm run build` was used as the real
  per-batch gate instead.
- **Deferred / not done:** re-cropping isn't needed anymore (superseded); no new
  follow-ups identified beyond what's already in "Out of scope" above.
