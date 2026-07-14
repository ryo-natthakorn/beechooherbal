# Homepage Design — Bee Choo Herbal (EN + TH)

**Date:** 2026-07-14 · **Status:** Approved by user, pending Crispin sign-off before wider rollout

## Goal

Build the real homepage (`/` EN + `/th/home/` TH), replacing the Phase 2 placeholders, per
CLAUDE.md Phase 3. This is the first real page and needs visual sign-off before any other
page is built. Same content and URLs as the live WordPress site (CLAUDE.md Goal 3), fresher
presentation (Goal 4). No new sections, no removed sections, no invented copy.

## Source content (verified via WP REST export, not guessed)

Pulled from `inventory/rest-pages.json`: EN home = page id 2 (`variants.default`), TH home =
page id 572 (`variants.th`). Both are Elementor-built pages; content extracted and mapped to
sections below. Full extracted headings/links/paragraphs are in
`scratchpad/en-extract.json` / `scratchpad/th-extract.json` from this session (not committed;
regenerate from `inventory/rest-pages.json` if needed — see script inline in this doc's
history, or re-derive with a short node script against `rest-pages.json`).

## Known bug to fix (not preserve)

Today, treatment section **headings** link to `beechooladies.com.sg` (the Singapore site's
service pages) while the **"Click here to read more" buttons** correctly link to the
matching `beechooherbal.com` page. Both must point at `beechooherbal.com` in the rebuild.

## Section structure (content order unchanged from live site)

1. **Header/nav** — logo (leaf mark + wordmark), nav links, phone number visible.
   `LanguageSwitcher.astro` (existing) stays.
2. **Hero** — H1 "100% Natural Herbal Hair Treatment, Safe, Highly Effective, Proven, Award
   Winning Hair Salon Clinic" + "BEST HAIR LOSS TREATMENT CLINIC IN BANGKOK, Thailand", CTA
   buttons: Call (`tel:+66020726698`), Facebook (`https://www.facebook.com/beechooherbal/`),
   LINE.
3. **Trust intro** — "Bee Choo Origin is the largest scalp/hair loss treatment clinic..."
   paragraph (16 outlets by end 2025) + founder/media-mentions paragraph (Business Times
   links to `businesstimes.com.sg`, kept as external links).
4. **7 treatment cards** (photo-forward style, per user approval) — Hair Loss, Oily Itchy
   Scalp, White/Grey Hair, Dandruff, Bacterial Infection/Alopecia Areata/Others, Damaged Hair,
   Postpartum. Each card: real photo on top (`hair-loss-1.jpeg`, `oily-hair-.jpeg`,
   `white-hair-1.jpeg`, `dandruff-hair-1.jpeg`, `split-end.jpeg` or similar, `03.jpg`,
   `BCH-7-1.jpg` — verify exact filenames against live site at build time), title (linked to
   the correct `beechooherbal.com` treatment page), 1-line teaser pulled from the existing
   paragraph copy, "Read more" button (same link as title). Both title and button use the
   `PAIRS`-mapped EN/TH treatment URLs already in `src/i18n/pairs.ts`.
5. **How it works** — 4-step graphic (`Treatment-Process-Bee-Choo-ENG.jpg`), reused as-is per
   user's "download & reuse as-is" decision, with real `alt` text added (currently empty on
   the live site). Surrounding copy: "See how it works above..." + colour-choice note + results
   disclaimer.
6. **Reviews** — testimonial section (`REVIEWS ON BEECHOO HAIR TREATMENT` / TH equivalent).
7. **Awards & recognitions** — 12 award badge images (Singapore Excellence Award, Singapore
   Heartland, Singapore Prestige Winner, Singapore Prestige, Super Health Brand, The
   Entrepreneur, Golden Eagle Award, Promising SME 500, Reader's Choice, Service Class,
   Sin Chew Business, TAP Awards Most Innovative), laid out as a clean grid (current site
   crams them into a slider). TQCSI/ISO certification copy kept.
8. **Pricing** — price-list image (`Bee-Choo-price-list-2022_edit-scaled.jpg`), reused as-is,
   with the "800–1200 Baht, no hidden charges" copy alongside it.
9. **Locations teaser** — locations graphic (`Bee-Choo-Location-ENG-Ver_FINAL.jpg`), reused
   as-is, linking to `/locations/`.
10. **Footer** — Call, Facebook, LINE (with QR/add-friend button, `th.png` on live site),
    YouTube, TikTok — matching the CTA set CLAUDE.md §2 confirms with Crispin ("all of them,
    exactly like the original").

## Visual system

**Brand palette** (from `2026 BC_brandguide_R4_18122025.pdf`, supplied by user this session)
— added as `@theme` tokens in `src/styles/global.css`:

```css
@theme {
  --color-brand-green: #2D6946;   /* Harmony Green — primary: headings, logo, nav, CTAs */
  --color-brand-yellow: #FFC600;  /* Oriental Yellow — CTA accents, alerts */
  --color-brand-pink: #EFA693;    /* Gentle Pink — soft accents, hover states */
  --color-brand-earth: #DBCBC1;   /* section backgrounds, dividers */
  --color-brand-origin: #6F6259;  /* body text on light bg */
  --color-brand-treasure: #DAC556;
  --color-brand-root: #D47E00;
  --color-brand-nude: #F6B9A7;
  --color-brand-serenity: #B2E1D8;
  --font-sans: "Roboto", system-ui, sans-serif;   /* EN body/headings */
  --font-thai: "Noto Sans Thai", sans-serif;      /* TH body/headings */
}
```

`BaseLayout.astro` selects `--font-sans` vs `--font-thai` on `<body>` based on the `lang` prop.

**Typography rationale:** the brand guide specifies Lora+Avenir for digital and Roboto for
print, but the user directed Roboto for this build (already an approved corporate font) with
Noto Sans Thai as the Thai companion — confirmed by Wikipedia that Roboto natively covers only
Latin/Greek/Cyrillic (Android itself falls back to Noto Sans Thai for Thai text), so a
separate Thai font is required regardless of which Latin font is chosen.

**Logo:** real leaf-mark + full wordmark PNGs supplied by the user this session, to be saved
to `public/images/logo-leaf.png` and `public/images/logo-full.png`. **Blocking gap:** these
were shared as chat image attachments, which are not directly accessible from the filesystem
during this session — before implementation starts, the user needs to save the two logo files
into `public/images/` (or resend as attachments during the implementation session so they can
be captured then). Until then, the header/footer fall back to a styled text wordmark
("BEE CHOO Origin" in brand green, Roboto bold) so the build isn't blocked.

## Images plan (per user's "download & reuse as-is" decision)

Download from the live site and re-host in `public/images/`, adding real `alt` text
(currently empty/missing on the live site for most of these — an accessibility/SEO bug to
fix): 7 treatment photos, 12 award badges, how-it-works graphic, price-list graphic,
locations graphic, LINE QR/add-friend button. Validate magic bytes per CLAUDE.md §7 (Cloudflare
can return a 200 + HTML instead of the actual image). Use Astro `<Image>` component
throughout, never raw `<img>`.

## Technical build

New/changed files:
- `src/components/Header.astro` — logo, nav, phone number
- `src/components/Footer.astro` — CTA buttons + social icons, brand-green background
- `src/components/TreatmentCard.astro` — photo, linked title, teaser, linked "Read more"
- `src/pages/index.astro` (EN) — real content, replaces placeholder
- `src/pages/th/home.astro` (TH) — real content, replaces placeholder
- `public/images/` — downloaded assets (see above)
- `src/styles/global.css` — brand `@theme` tokens (see above)

Both homepage files stay wired through `BaseLayout` (`title`/`description`/`lang`) so
hreflang continues to come from `src/i18n/pairs.ts` (already has the `/` ↔ `/th/home/` pair).

## Verification before stopping for review

- `npm run build` exits 0
- `npm run astro check` — no type errors
- Dev-server visual check of both `/` and `/th/home/`: no broken images, treatment card
  title + button both link to `beechooherbal.com` (not `beechooladies.com.sg`)
- Manual spot-check that Thai text renders in Noto Sans Thai and doesn't overflow/clip
  (brand guide's typography settings don't cover Thai, so this needs a visual check)

## Explicitly out of scope for this batch

- Any page other than the homepage (CLAUDE.md requires homepage sign-off first)
- Rebuilding the flat-image sections (price list, process steps, locations map) as real
  HTML/CSS — deferred per user's "reuse as-is" decision; can revisit later if desired
- Schema markup / JSON-LD (Phase 4 per CLAUDE.md §10)
- Tracking codes (Phase 4)
