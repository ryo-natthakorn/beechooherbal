# Spec: The 7 treatment pages (EN + TH) — Phase 3 core build

**Date:** 2026-08-12
**Status:** Draft — planning only, nothing implemented
**Type:** Feature (new pages)

## Problem

Only the homepage exists in the new Astro build (`/` and `/th/home/`). CLAUDE.md
Phase 3 lists the 7 treatment pages as the next core deliverable, and they are the
site's most SEO-valuable pages after the homepage — they are the ones ranking for
"scalp hair loss treatment Bangkok", "รักษารังแค", and so on. Fourteen URLs (7 EN +
7 TH) currently 404 on the new build while their legacy equivalents are live and
indexed.

This spec plans that build: what the pages contain, where the files go, how the copy
and images get sourced, and what has to be decided before anyone writes code. It does
not implement anything — a human reviews this first.

## Project constraints that apply

Pulled from `CLAUDE.md`:

- **URLs are frozen.** Every treatment page must live at its exact legacy path, EN and
  TH (§7 URL rules). Thai slugs are fully-translated and percent-encoded — they cannot
  be derived from the English ones (§11).
- **hreflang on every page** pairing it with its twin (§7). Highest-risk item on the
  project; the legacy site has no usable pairing of its own.
- **Copy verbatim, both languages.** Use the existing site's Thai copy as-is. No
  machine translation, no invented claims about treatments or results (§8, §9).
- **Treatment pages → `Service` JSON-LD** (§7 Schema markup).
- **Astro `<Image>` component always, never raw `<img>`** (§7 Images).
- **Validate downloaded image magic bytes** (PNG `89 50 4E 47`, JPEG `FF D8 FF`) —
  Cloudflare can return 200 + homepage HTML instead of the image (§7 Images).
- **Alt text on every image** (§7).
- **Not women-only** — this clinic serves everyone (§1).
- **CTAs are Call / Facebook / LINE** (+ YouTube, TikTok) — no booking system, no
  custom booking UI (§2, §9).
- Tailwind v4, mobile-first, named `@theme` tokens over arbitrary values (§6).
- Test both languages — Thai wraps and sizes differently (§6).
- Avoid heavy JS libraries (§9).
- Title format: `Page Name - Bee Choo Herbal` (§6).

## What already exists (verified in the repo on 2026-08-12)

This build is lower-risk than it looks, because the routing/SEO plumbing is done:

- **`src/i18n/pairs.ts` already contains all 7 treatment EN↔TH pairs** (lines 23–29),
  decoded, verified against `inventory/en-th-map.csv`. Confirmed by reading both files.
- **`src/components/SEOHead.astro` auto-resolves hreflang** via
  `getPair(Astro.url.pathname)` and emits `en` / `th` / `x-default` plus canonical and
  OG. **A new treatment page at the right path gets correct hreflang with zero new
  wiring** — nothing to build, only to verify.
- **`src/data/treatments.ts`** already holds, per treatment: `slug`, hero `image`
  (`ImageMetadata`, one JPG per treatment in `src/assets/images/treatments/`), `alt`,
  `title`, `teaser`, `href` — all EN/TH keyed, all verbatim from the live site. The
  7 hero images already exist on disk.
- **Homepage component pattern** (`src/components/home/*.astro`, composed by
  `HomePage.astro`, driven by a `lang` prop, with thin route shells at
  `src/pages/index.astro` and `src/pages/th/home.astro` that set only
  `lang`/`title`/`description`). This is the established convention and the treatment
  pages should mirror it exactly.
- **`src/components/YouTubeEmbed.astro`** exists and is reusable for the per-treatment
  video (see Content section — each legacy page has one).
- **`src/i18n/ui.ts`** holds chrome strings (nav, CTA, footer, misc).

What does **not** exist: `src/content/`, `src/content.config.ts`, any JSON-LD anywhere
in `src/` (grepped — zero `ld+json`), and any `/locations/` page.

## Assumptions

1. **Design language matches the homepage.** These pages get the homepage's current
   visual system (Harmony-Green bands, Soft-UI cards, serif headings, zero-JS scroll
   reveals) rather than the older motion system still used elsewhere. Crispin signed
   off on the homepage look; extending it is the point of Goal 4.
2. **"View location" / locations CTAs use the Google Maps fallback**, exactly as the
   homepage does today — `/locations/` does not exist yet (per the 2026-08-10 handoff).
   Swap to internal links when that page ships.
3. **The three shared tail sections (Reviews, cross-sell, How-It-Works, Pricing) are
   the homepage's own components, reused**, not re-implemented. The legacy page uses
   the same content there, so reuse is faithful, not a shortcut.
4. **Videos are kept.** Every legacy treatment page embeds a per-condition YouTube
   video, and the About copy literally says "watch the video above" — dropping it
   would break the copy. IDs extracted from `inventory/rest-pages.json` (below).
5. **No new client photography.** Before/after images come from the legacy media
   library, downloaded and validated per §7.

## Verified source content structure

Extracted from `inventory/rest-pages.json` (`variants.en` / `variants.th`), heading
sequence checked on **all 7** EN pages and all 7 TH pages.

**EN — identical 9-section skeleton on all 7 pages:**

| # | Heading (legacy) | Nature |
|---|---|---|
| 1 | H1 — treatment-specific hero title (e.g. `OILY ITCHY SCALP HAIR TREATMENT`) | Unique per page |
| 2 | H1 — `100% Natural Herbal Hair Treatment, Safe, Highly Effective, Proven, Award Winning Hair Salon Clinic` | Shared string (same as homepage hero) |
| 3 | H1 — `ABOUT <condition>` | **Unique real copy** per condition; references the video |
| 4 | H1 — `BENEFITS OF 100% NATURAL HERBAL TREATMENT` (grey-hair variant: `BENEFITS OF NATURAL DYE`) | **Unique real copy** — do NOT treat as boilerplate |
| 5 | H2 — `SEE OUR CLIENT'S BEFORE AFTER RESULTS` | Image gallery — **assets not yet in repo** |
| 6 | H1 — `REVIEWS ON BEECHOO HAIR TREATMENT` | Shared — homepage `ReviewsWall` |
| 7 | H1 — `BEST HAIR LOSS TREATMENT SALON CLINIC IN BANGKOK, Thailand` | Shared cross-sell — homepage `TreatmentsSection` |
| 8 | H1 — `100% NATURAL HERBAL HAIR TREATMENT - HOW IT WORKS` | Shared — homepage `HowItWorksScene` |
| 9 | H1 — `AFFORDABLE HAIR TREATMENT IN Bangkok, Thailand` | Shared — homepage `PricingSection` |

(Two pages also carry a trailing `HEAR FROM OUR CLIENTS` + repeated tagline band; treat
as part of the shared reviews/closing band, not a distinct section.)

**Correction to the incoming brief — TH is NOT a 1:1 structural mirror.** Four of the
seven Thai pages carry extra sub-headings inside the "About" section that the English
page does not have. Verified examples:

- `/th/ปิดผมหงอกวิธีธรรมชาติ/` (grey hair) adds: `อะไรคือผมขาว ผมหงอก`,
  `อายุเท่าไหร่ทีจะมีผมขาวอย่างรวดเร็ว`, `สาเหตุของผมขาว ผมหงอก`,
  `มีโรคแทรกซ้อนจากการมีผมขาว…`
- `/th/รักษารังแค-ขจัดรังแค-ให้/` (dandruff) adds: `รังแคคืออะไร`, `ใครจะมีรังแคบ้าง`,
  `มีโรคแทรกซ้อนจากรังแคมั้ย?`
- `/th/แก้ผมเสียเร่งด่วน/` (damaged hair) adds four similar sub-headings.

**Consequence for the component design:** the About section must accept a *list of
sub-blocks* (optional heading + body), not a single fixed body string, so the Thai
page can carry more sub-sections than its English twin without forking the component
or (worse) dropping real indexed Thai content. This is the main structural decision
this spec adds beyond the brief.

**Per-treatment YouTube IDs (from the legacy HTML):**

| Treatment | Unique video ID(s) | Shared/trailing IDs |
|---|---|---|
| Hair loss | `LJI-zrPWXhk` | `Uwty-ZDdPYc`, `WCJrb2D9PNE` |
| Grey/white | `Kd9EKBizDIg` | `Uwty-ZDdPYc` |
| Oily scalp | `HhYhUh7qvLM` | `Uwty-ZDdPYc` |
| Dandruff | `9-fX3NojpSs` | `Uwty-ZDdPYc` |
| Damaged hair | `Qee9lcHF75s` | `Uwty-ZDdPYc` |
| Bacterial/alopecia | `7BdHMXcLJoY`, `5RAAX5-v1TU`, `hvu5Eh2IO1A`, `Fp3hdtA-pnE` | — |
| Postpartum | `qG_5mPtD8xg`, `lMZ1aIwWga4` | `WCJrb2D9PNE` |

Each ID must be re-checked as still-playable before launch (a delisted video renders
as an empty box).

## Proposed change

### 1. Data model — recommendation: **stay with `src/data/*.ts`, do not add a Content Collection**

CLAUDE.md §6 documents a `treatments` Content Collection, so this is a deliberate,
recorded deviation rather than an oversight. Reasoning:

- **The corpus is fixed and tiny.** Seven treatments, hand-authored, never added to by
  a content editor. Collections earn their keep on growing, editor-managed corpora —
  which is exactly the blog (Phase 4), where a collection *should* be used.
- **The content is bilingual-paired, not per-file.** Everything on this site is a
  `{ en, th }` object keyed off one `lang` prop. Markdown collections push toward
  one file per language, which then needs a join key and a second lookup layer to
  reunite the pair — re-implementing what `src/data/treatments.ts` already does in
  plain TypeScript today.
- **Type safety and image handling are already solved.** `Treatment` is a typed
  interface, hero images are real `ImageMetadata` imports (so `<Image>` gets width,
  height, and hashing for free). A Markdown collection would need `image()` schema
  helpers to get back to parity.
- **It matches the homepage precedent** (`src/data/home.ts`, `src/data/locations.ts`)
  and integrates cleanly with `pairs.ts` / `SEOHead`. Two conventions for the same job
  is a maintenance cost with no payoff here.
- **The content is prose-heavy, but not Markdown-shaped** — the About and Benefits
  sections are structured sub-blocks with headings, which express fine as typed arrays
  and would need frontmatter conventions to express in Markdown anyway.

**Concretely:** extend `src/data/treatments.ts` in place (the homepage already imports
`TREATMENTS`, so the array stays the single index of the 7 treatments and their URLs),
adding per-treatment page-body fields:

```ts
interface TreatmentPage {
  heroTitle: { en: string; th: string };   // section 1
  seo: { title: LangStr; description: LangStr };
  videoId: { en: string; th: string };
  about:    { heading: LangStr; blocks: Array<{ heading?: LangStr; body: LangStr }> };
  benefits: { heading: LangStr; blocks: Array<{ heading?: LangStr; body: LangStr }> };
  beforeAfter: { images: ImageMetadata[]; alt: LangStr[]; caption?: LangStr };
}
```
Put the page bodies in a **separate file** (`src/data/treatment-pages.ts`) keyed by
`slug`, so `treatments.ts` stays the small, homepage-facing index it is today and the
long-form copy does not bloat it. Revisit if a third data file with the same shape
appears — that would be the real signal to move to collections.

**If the reviewer prefers collections anyway**, it is a contained decision: it changes
Batch 1 only, and the routing/SEO plan below is unaffected.

### 2. Page structure

One shared component `src/components/treatment/TreatmentPage.astro`, driven by
`lang` + `slug`, mirroring `HomePage.astro`. Section components in
`src/components/treatment/`:

| Section | Component | Source |
|---|---|---|
| 1 Hero | `TreatmentHero.astro` (new) | `heroTitle` + hero image from `treatments.ts` + Call/FB/LINE CTAs from `ui.ts` |
| 2 Tagline band | reuse the homepage's shared tagline string | `src/data/home.ts` (check for an existing constant before duplicating) |
| 3 About | `TreatmentAbout.astro` (new) | `about.blocks` (variable-length — see TH note) + `YouTubeEmbed` |
| 4 Benefits | `TreatmentBenefits.astro` (new) | `benefits.blocks` |
| 5 Before/After | `BeforeAfterGallery.astro` (new) | blocked on image sourcing — see Content gaps |
| 6 Reviews | **reuse** `home/ReviewsWall.astro` | already lang-driven |
| 7 Cross-sell | **reuse** `home/TreatmentsSection.astro` | already lang-driven; must render 7 links, current-page row de-emphasised or self-linked — decide during Batch 1 |
| 8 How-It-Works | **reuse** `home/HowItWorksScene.astro` | currently image-only — see Open questions |
| 9 Pricing | **reuse** `home/PricingSection.astro` | currently image-only — see Open questions |

The four reused homepage components live in `src/components/home/`. If reusing them
outside the homepage feels wrong once the code is in front of you, move them to
`src/components/sections/` **as a mechanical rename in its own batch**, not folded
into a feature batch.

### 3. Routing and file layout

Mirror the homepage exactly: thin route shells, shared body component. **7 individual
files per language, not a `[slug].astro` dynamic route** — the EN slugs are seven
unrelated long strings and the TH slugs are non-ASCII; explicit files keep every URL
greppable, keep title/description visible at page level (the homepage's stated
convention), and avoid `getStaticPaths` encoding surprises with Thai paths.

| # | Treatment | EN route file → URL | TH route file → URL |
|---|---|---|---|
| 1 | Hair loss | `src/pages/scalp-hair-loss-treatment-salon-clinic-in-bangkok.astro` → `/scalp-hair-loss-treatment-salon-clinic-in-bangkok/` | `src/pages/th/ซาลอน-คลินิกรักษาผมร่วง.astro` → `/th/ซาลอน-คลินิกรักษาผมร่วง/` |
| 2 | Grey/white | `src/pages/reverse-premature-grey-white-hair-by-herbal-treatment.astro` | `src/pages/th/ปิดผมหงอกวิธีธรรมชาติ.astro` |
| 3 | Oily scalp | `src/pages/herbal-treatment-to-get-rid-of-oily-scalp-hair.astro` | `src/pages/th/วิธีแก้หนังศีรษะมัน.astro` |
| 4 | Dandruff | `src/pages/cure-dandruff-hair-with-herbal-treatment.astro` | `src/pages/th/รักษารังแค-ขจัดรังแค-ให้.astro` |
| 5 | Damaged/dry | `src/pages/repair-chemically-damaged-dry-hair-with-herbal-treatment.astro` | `src/pages/th/แก้ผมเสียเร่งด่วน.astro` |
| 6 | Bacterial/alopecia | `src/pages/herbal-treatment-cure-for-bacteria-infection-alopecia-areata-and-other-hair-diseases.astro` | `src/pages/th/หนังศีรษะติดเชื้อ.astro` |
| 7 | Postpartum | `src/pages/postpartum-hair-loss-treatment-in-thailand.astro` | `src/pages/th/ภาวะผมร่วงเฉียบพลันของ.astro` |

**Non-ASCII filename risk to test in Batch 1, before writing six more of them:** Thai
filenames on Windows + git + Vercel's Linux build. Verify (a) git records the name
without mangling (`core.quotepath` output), (b) `npm run build` emits
`dist/th/<thai>/index.html`, (c) the deployed URL resolves to the same
percent-encoding `pairs.ts`/`SEOHead` generate. **If any of that is shaky, the
fallback is a `[...slug].astro` catch-all under `src/pages/th/` with an explicit
`getStaticPaths` list** — same URLs, no Thai filenames on disk. Decide from the test,
not from theory.

Also confirm each route's trailing-slash behaviour matches the legacy URL, and add
nothing to `redirects.json` — these URLs are unchanged, which is the point.

### 4. SEO requirements per page

- **hreflang:** already automatic. Requires only that the built path matches the
  `pairs.ts` entry exactly. Verify per page in the built HTML — do not assume.
- **Title:** use the legacy Yoast title verbatim. Confirmed available for all 14 pages,
  e.g. `Scalp Hair Loss Treatment Salon Clinic in Bangkok - Bee Choo Herbal`;
  TH e.g. `ซาลอน/ คลินิกรักษาผมร่วง คลินิกรักษาผมบาง ในกรุงเทพ - Bee Choo Herbal`.
- **Meta description — a real gap.** All 7 **Thai** pages have a Yoast description.
  Only **2 of 7 English** pages do (hair loss, postpartum); the other five are
  `undefined` in `yoast_head_json`. Those five need descriptions written by
  condensing that page's own existing English copy — condensing existing copy, never
  inventing a new claim (§8). Flag them to Crispin for approval rather than shipping
  silently-authored copy on the site's top landing pages.
- **`Service` JSON-LD (net new).** Checked `yoast_head_json.schema['@graph']` on the
  hair-loss page: legacy types are only `WebPage`, `ImageObject`, `BreadcrumbList`,
  `WebSite`, `Organization`. There is **no `Service` schema on the live site at all**,
  so this is an improvement to author, not something to copy. Proposed shape, one per
  page, language-matched:

  ```jsonc
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "<treatment title, e.g. Hair Loss Treatment>",
    "name": "<page H1>",
    "description": "<page meta description>",
    "url": "<canonical>",
    "inLanguage": "en" | "th",
    "image": "<hero image absolute URL>",
    "provider": {
      "@type": "HealthAndBeautyBusiness",
      "name": "Bee Choo Herbal",
      "telephone": "+66 02 072 6698",
      "url": "https://beechooherbal.com/",
      "areaServed": { "@type": "Country", "name": "Thailand" }
    },
    "audience": { "@type": "PeopleAudience" }   // deliberately NOT gender-scoped (§1)
  }
  ```
  Build it as `src/components/ServiceSchema.astro` taking typed props, so the seven
  pages cannot drift. Do **not** add `aggregateRating`, `offers`, or `review` unless
  Crispin supplies real, verifiable numbers — fabricated review markup is a manual
  penalty risk and violates §8's "do not invent claims".
  Validate every page through Google's Rich Results Test before launch.
- **Images:** `alt` on every image, EN and TH, sourced from the legacy `alt` where one
  exists and written descriptively where it does not. Hero alts already exist in
  `treatments.ts`. `<Image>` only, never `<img>`.
- **Heading hierarchy — deliberate deviation.** The legacy pages use **eight `<h1>`s
  per page** (Elementor default). The rebuild should emit one `<h1>` (the hero title)
  and demote the rest to `<h2>`/`<h3>`. The *text* is unchanged, so this is a
  structural/accessibility fix, not a content change — it does not conflict with
  "reproduce the content faithfully". Worth one line in the Crispin update.

### 5. Content needs and gaps

1. **Before/after images are not in the repo.** `src/assets/images/treatments/`
   contains exactly seven files — one hero per treatment, nothing else. Naive
   extraction of the legacy galleries found roughly 2–4 images per page (~13+ total,
   e.g. `2018/04/Hair-loss-1st-225x300.jpeg`), but the extraction is **not reliable**:
   two pages returned zero and one page's results were contaminated with award badges,
   because Elementor galleries store some URLs in widget settings rather than plain
   `<img src>`. **Sourcing these is a content dependency that blocks full parity and is
   not in this spec's batches.** When it happens: re-extract per page carefully,
   download, and **validate magic bytes** (§7) — Cloudflare returning 200 + homepage
   HTML instead of a JPEG is a known failure on this project. Note also that the
   legacy files are small (225×300, 300×225) and will look soft in a modern layout.
   Until sourced, Batch 1 should render the gallery section as a graceful no-op when
   `beforeAfter.images` is empty rather than shipping a broken frame.
2. **How-It-Works and Pricing are currently image-only** on the homepage — Crispin's
   explicit, on-the-record choice (see `specs/2026-07-24-…` Result and the 2026-08-10
   handoff). Inheriting that here means the site's **primary SEO landing pages** carry
   no crawlable text for treatment process or prices. That was a homepage-specific
   trade; re-applying it to the treatment pages is a bigger SEO cost and should be a
   fresh, explicit decision, not a silent inheritance. See Open questions.
3. **"…from Singapore" in the live EN hair-loss meta description.** The legacy
   description reads "See our transparent 4 step herbal treatment process from
   **Singapore**" — a leftover from the Singapore site on a Thailand page. **Do not
   silently rewrite it.** Flag to Crispin; if he confirms, fix it, and note in the
   spec Result that a legacy string was intentionally corrected.
4. **Videos** — see the ID table. Confirm each is still public before launch.
5. **Thai About sub-sections** — extra Thai sub-headings must be carried through, not
   flattened (see Verified source content structure).
6. **Locations CTA** points at the Google Maps fallback until `/locations/` exists.

## Out of scope

- The blog, and the Phase 4 blog migration / redirect map / tracking codes.
- Building `/locations/`, `/about/`, `/team/`, FAQ, Testimonials, Products, Events —
  separate Phase 3 items even though this spec reuses their homepage teasers.
- **Sourcing/downloading the before/after images** — a content dependency, explicitly
  outside these batches (see Content gaps 1).
- Any redesign of the approved homepage sections. Reuse them; do not restyle them.
  If a reused section genuinely needs a variant, add a prop, do not fork the file.
- New photography, new copy, or translation of any kind.
- Adding `redirects.json` entries — URLs are unchanged by design.
- Fixing the pre-existing `npm run astro check` failure (unrelated Vite/Astro plugin
  type mismatch in `astro.config.mjs`, present on `main`; `npm run build` is the gate).

## Batches

Sequenced so the riskiest unknowns are proven on **one** page before being repeated
seven times.

**Batch 1 — Data model + pilot page end to end (hair loss, EN + TH).**
Add `src/data/treatment-pages.ts` with the hair-loss entry only (copy extracted
verbatim from `inventory/rest-pages.json`); build
`src/components/treatment/TreatmentPage.astro` + the four new section components;
build `ServiceSchema.astro`; create both route files. Proves, in order: the Thai
filename question (§3), that `SEOHead` emits the right hreflang pair unaided, that the
four reused homepage sections render correctly off-homepage, and that the About
component handles Thai's extra sub-blocks. **Stop and re-plan if the Thai filename
test fails** — that changes the routing approach for all seven.

**Batch 2 — Grey/white hair (EN + TH).** First repetition; the one that shows whether
the component API actually generalises (this page has the `BENEFITS OF NATURAL DYE`
heading variant and four extra Thai sub-blocks). Expect small component adjustments
here; expect none after.

**Batch 3 — Oily scalp (EN + TH).**
**Batch 4 — Dandruff (EN + TH).**
**Batch 5 — Damaged/dry hair (EN + TH).**
**Batch 6 — Bacterial infection / alopecia areata (EN + TH).** Has four videos —
decide placement from the legacy page order.
**Batch 7 — Postpartum (EN + TH).**

**Batch 8 — Cross-cutting SEO pass.** All 14 pages: meta descriptions present (incl.
the five newly-written EN ones, once approved), one `<h1>` per page, `Service` JSON-LD
validating in the Rich Results Test, hreflang cluster correct in both directions, every
image with alt text, cross-sell links resolving internally (and the CLAUDE.md §1
known bug — headings linking to `beechooladies.com.sg` — not reproduced).

**Batch 9 (blocked, do not start) — Before/after galleries.** Only once the images are
sourced and magic-byte-validated.

Per-batch gate: `npm run build` passes with zero errors; commit after each. Do not
stack batches on a broken build.

## Verification

- `npm run build` clean after every batch. (`npm run astro check` fails pre-existing —
  see Out of scope.)
- **Per page, in the built HTML** (`dist/`), assert: exactly one `<h1>`; `<link
  rel="canonical">` matching the legacy URL; three `hreflang` links (`en`, `th`,
  `x-default`) with the correct twin; a non-empty `<meta name="description">`; one
  `Service` JSON-LD block; zero raw `<img>` tags; every `<img>` rendered by `<Image>`
  carrying `alt`. Worth a small re-runnable Node script over `dist/` rather than
  eyeballing 14 pages.
- **Visual check in a real browser**, using the workflow recorded in the 2026-08-10
  handoff (`npm run preview` + the already-cached Chromium at
  `…/ms-playwright/chromium-1228/…`, isolated `playwright-core`, not added to
  `package.json`): each page at 390×844 and 1440×900, EN and TH. Thai wraps
  differently and these pages are copy-heavy. Allow ~600–1000 ms after scrolling
  before screenshotting lazy `<Image>`s.
- **Copy fidelity spot-check:** diff the rendered body text of at least 3 pages
  (including one Thai) against the `rest-pages.json` source to confirm nothing was
  dropped, paraphrased, or reordered — particularly the Thai About sub-sections.
- `Service` JSON-LD through Google's Rich Results Test.
- Confirm each YouTube ID still plays.
- Homepage regression: `/` and `/th/home/` still render identically after the four
  shared sections gain a second consumer.

## Batch 1 progress (2026-08-12)

**Pilot swapped from Hair Loss to Oily Scalp.** While pulling the real hair-loss copy
for the pilot, found that the live Thai hair-loss page
(`/th/ซาลอน-คลินิกรักษาผมร่วง/`) has the correct title but its About/Benefits body is
actually the **oily-scalp** page's content verbatim (mentions "หนังศีรษะมันและคัน" and
the Ling Zhi herb specific to oily scalp). Verified against all 7 Thai pages' own About
headings — this mismatch is isolated to hair-loss; the other 6 are internally
consistent. A real legacy CMS bug, not a lookup error on this side. Hair Loss is now
blocked (see Open questions) until Crispin supplies correct Thai copy; **Oily Scalp
piloted instead** — content verified clean in both languages.

**Correction to this spec's "About" structure.** The heading-tag scan that produced
the 9-section table above missed a real structural layer: on the live site, "About"
is actually an intro (1-2 plain paragraphs) followed by an **Elementor FAQ-toggle
widget** — a real Q&A accordion (e.g. "What is Itchy and Oily Scalp?" /
"Why am I suffering from Itchy and Oily Scalp?") — on **both** EN and TH for
oily-scalp. This didn't show up in the earlier `<h1>`-`<h4>` heading scan because
toggle titles are `<a class="elementor-toggle-title">`, not heading tags at all. Built
as native `<details>/<summary>` (zero JS, answers stay in the DOM/crawlable whether
expanded or not) rather than the generic "sub-blocks" shape floated earlier. Whether
every treatment has this toggle (vs. some being flat paragraphs only) needs
reconfirming per-page in Batches 2-7 — don't assume the 9-section table alone is a
complete map of any given page's real structure; re-check each page's raw HTML for
`elementor-widget-toggle` before extracting.

**Shipped this batch:**
- `src/data/treatment-pages.ts` — new data file, `oily-scalp` entry (heroTitle, seo,
  videoId, about intro+FAQ, benefits), structured per-language (not paired by array
  index) so a future treatment with mismatched EN/TH content shapes doesn't need a
  format change.
- `src/components/treatment/{TreatmentPage,TreatmentHero,TreatmentAbout,TreatmentBenefits,BeforeAfterGallery}.astro`
  and `src/components/ServiceSchema.astro`.
- Route files: `src/pages/herbal-treatment-to-get-rid-of-oily-scalp-hair.astro` (EN),
  `src/pages/th/วิธีแก้หนังศีรษะมัน.astro` (TH).
- **Thai filename risk: resolved, no fallback needed.** `git status` (with default
  `core.quotepath`) octal-escapes the filename, but `git -c core.quotepath=false
  status` and `git ls-files` show it's stored correctly; `npm run build` emits
  `dist/th/วิธีแก้หนังศีรษะมัน/index.html` correctly; hreflang/canonical resolve to the
  matching percent-encoded URL automatically via the existing `pairs.ts`. The
  `[...slug].astro` catch-all fallback in this spec's §3 is not needed — plain files
  per URL, as originally proposed, work fine.
- Verified in a real browser (desktop + 375×812 mobile, EN + TH): single `<h1>` per
  page (legacy's 8×`<h1>` collapsed as planned), correct hreflang cluster + canonical,
  one `Service` JSON-LD block with correct fields, FAQ accordion opens/closes and
  exposes real answer text, all reused homepage sections (Reviews, cross-sell,
  How-It-Works, Pricing) render correctly off the homepage in both languages, no
  horizontal overflow on mobile, homepage unaffected (footer height regression-checked
  at 430px, matching this session's earlier footer fix).
- `npm run build` clean, 4 pages built.
- Dropped a few orphaned image-caption fragments and a "via GIPHY" credit from the
  extracted paragraphs (both languages) — they're captions for inline images not
  sourced into this build yet (see Content gaps §1); shipping the caption sentence
  with no image would read as an editing error, not fidelity.
- Left the EN meta description as a draft (`descriptionDraftPending: ["en"]` in the
  data file) since no real Yoast description exists on the legacy EN page — condensed
  from this page's own real copy, not invented, but not shipped as final.
- **Not yet done:** `git commit` (pending review — see below).

## Open questions for Crispin (blocking, or close to it)

1. **How-It-Works and Pricing on treatment pages: image-only, or real text?** These
   are the pages people actually land on from Google for "hair treatment price
   Bangkok". Image-only means Google cannot read the process steps or any price. The
   homepage went image-only at Crispin's explicit request — this is a separate
   decision and should be asked separately, before Batch 1 fixes the pattern.
   *(This is the biggest open question in this spec.)*
2. **The "from Singapore" meta description** on the EN hair-loss page — correct it, or
   reproduce it verbatim?
3. **The five missing English meta descriptions** — approve descriptions condensed
   from each page's own existing copy?
4. **Data model** — confirm the recommendation above (plain typed TS, deferring
   Content Collections to the blog) is an acceptable, recorded deviation from
   CLAUDE.md §6.
5. **New: the Thai hair-loss page's real copy.** `/th/ซาลอน-คลินิกรักษาผมร่วง/`
   currently serves oily-scalp's About/Benefits content under the hair-loss title —
   found during Batch 1 (see "Batch 1 progress" above). Needs either (a) Crispin
   supplies/points to the correct Thai hair-loss copy, or (b) explicit sign-off to
   flag it as a known gap and ship English-only for that page's About/Benefits until
   real Thai copy exists (not machine-translate the English — CLAUDE.md §8). Blocks
   the Hair Loss batch specifically, not the other 6.
