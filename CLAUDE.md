# CLAUDE.md — Bee Choo Herbal (Thailand) Website Rebuild

This file gives you (Claude Code) everything you need to know about this project.
Read this entire file before touching any code.

> This is the **second** Bee Choo migration. The first — beechooladies.com.sg — is
> done. This site is similar in spirit but has important differences (see §1). Do
> NOT copy assumptions from the Singapore site blindly.

---

## 1. What This Project Is

We are rebuilding **beechooherbal.com** — a herbal scalp and hair-loss treatment
clinic in Bangkok, Thailand (Bee Choo Herbal / Bee Choo Origin) — from WordPress
into Astro.

This is a **content and SEO site**, not a web app. No login, no accounts, no
complex logic — just pages, images, text, and contact/booking CTAs.

### Goals (in order of priority)
1. Keep or improve Google search rankings — SEO is the #1 priority
2. Make the site faster and easier to maintain via code
3. Preserve all existing pages, content, and conversion actions, in BOTH languages
4. Give the new site a modern, clean, and intuitive design

> Goal 4 applies to the **visual layer and UX** — look, layout, navigation feel —
> NOT to URLs, content, or SEO, which stay faithful to the existing site (goals 1
> and 3). In other words: same URLs and same copy, fresher presentation. This is
> how the Singapore homepage redesign was handled.

### How this site differs from beechooladies.com.sg — READ THIS
- **Bilingual (WPML).** English at `/` and Thai at `/th/`. This is the single
  biggest difference and the main SEO risk. Every page needs `hreflang` tags
  pairing it with its translated twin so Google does not treat EN/TH as duplicate
  content. The Singapore site was English-only; that playbook did not cover this.
- **NOT women-only.** This clinic serves everyone. Do NOT add women-only messaging.
- **Different conversion model.** CTAs are phone (`+66 02 072 6698`), Facebook,
  LINE (`lin.ee`), and TikTok — NOT Acuity Scheduling. There may be no scheduling
  embed at all. Confirm with Crispin before building any booking UI.
- **Service pages live at the root** (e.g. `/scalp-hair-loss-treatment-salon-clinic-in-bangkok/`),
  not under `/services/`. Blog is at `/category/blog/`.
- **Known bug on the existing site to FIX (not faithfully copy):** the homepage
  service *headings* link to the old `beechooladies.com.sg` service pages, while the
  "read more" buttons correctly link to `beechooherbal.com`. Point both to the
  correct beechooherbal.com pages on the new build.

---

## 2. Business Context

- **Brand:** Bee Choo Herbal / Bee Choo Origin (Bangkok). 16 outlets in Thailand by end 2025.
- **Audience:** People in Thailand with hair loss, grey hair, oily/itchy scalp, dandruff,
  damaged hair, scalp infections, postpartum hair loss.
- **Key actions a visitor should take:** Call, message on Facebook, add on LINE, or
  visit a location.
- **Content manager post-launch:** Crispin (the boss) — confirm editing preference.
- **Booking/contact (CONFIRMED by Crispin):** reproduce the original's contact set
  faithfully — Call (`+66 02 072 6698`), Facebook, and LINE as the main buttons, plus
  the social links the original carries (YouTube, TikTok @beechooth). "All of them,
  exactly like the original." No online booking system to migrate. Same links/behaviour
  as the current site, just presented in the new (modernised) design.

---

## 3. Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Astro (static site generation) | Near-zero JS by default |
| i18n | Astro built-in i18n routing | `/` = English, `/th/` = Thai (URLs unchanged); Thai-first by design + hreflang |
| Styling | Tailwind CSS v4 | Via `@tailwindcss/vite` plugin — no `tailwind.config` file |
| Content | Astro Content Collections (Markdown) | Astro 5+ Content Layer API; per-language |
| Hosting | Vercel | Auto-deploys from GitHub on every push |
| Version control | GitHub | New repo: `ryo-natthakorn/beechooherbal` |
| Booking/contact | CTA links (phone/FB/LINE) | Do NOT build custom booking logic |
| Images | Astro Image component | Never use raw `<img>` tags |

---

## 4. Commands

```bash
# Install dependencies
npm install

# Start development server (local preview)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type-check (Astro + TypeScript)
npm run astro check
```

---

## 5. Project Structure

```
beechooherbal/
├── CLAUDE.md                    ← You are here
├── astro.config.mjs             ← Astro config (incl. i18n: en + th)
├── package.json
├── redirects.json               ← OLD URL → NEW URL map (critical for SEO)
├── vercel.json                  ← Host-level wildcard redirects (if needed)
├── public/
│   └── images/                  ← Static images (logo, salon photos, awards, favicons)
└── src/
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── LanguageSwitcher.astro   ← EN ⇄ TH toggle
    │   └── SEOHead.astro            ← title, description, OG, canonical, HREFLANG
    ├── layouts/
    │   └── BaseLayout.astro     ← Wraps all pages; accepts title + description + lang
    ├── pages/
    │   ├── index.astro          → /            (English home)
    │   ├── about.astro          → /about
    │   ├── ... (English pages at root)
    │   └── th/                  → /th/...       (Thai mirror of every page)
    │       └── index.astro      → /th/
    ├── content/
    │   ├── treatments/          ← service/treatment pages (per language)
    │   └── blog/                ← blog posts (per language)
    ├── i18n/
    │   └── ui.ts                ← shared UI strings per language (nav labels, buttons)
    ├── content.config.ts        ← Content Collection schemas (Astro 5 — at src/ root)
    └── styles/
        └── global.css           ← @import "tailwindcss" + @theme brand tokens
```

> The exact i18n folder strategy (subfolder `th/` vs route config) is a Phase-2
> decision — see §10. Whatever we pick must keep the live URLs identical: English
> unprefixed at `/`, Thai at `/th/` (Path A — no URL flip; see §6).

---

## 6. Architecture & Conventions

### Page conventions
- Every page must export `title: string` and `description: string` as const variables,
  and declare its `lang` (`"en"` or `"th"`).
- Pass them to `<BaseLayout title={title} description={description} lang={lang}>`.
- `<BaseLayout>` passes them through to `<SEOHead>`.
- `<SEOHead>` renders `<title>`, `<meta name="description">`, Open Graph tags,
  canonical URL, **and `hreflang` alternate links** (see SEO rules).
- Site base URL is `https://beechooherbal.com`.
- Title format: `Page Name - Bee Choo Herbal` (match the existing site's pattern).

### Internationalisation (i18n) — the new core requirement
**Decision (Path A): Thai is the primary EXPERIENCE, but URLs do NOT change.**
Crispin confirmed "Thai as default language" — interpreted as a business intent
(Thai is primary / shown first), NOT a request to move Thai to the bare-root URL.
The live site serves English at `/` and Thai at `/th/`; we keep that exactly to
protect rankings. "Thai-first" is delivered through design emphasis, content
priority, `hreflang`, and a root language redirect — NOT by moving Thai to the root.

- **URLs stay as-is:** English unprefixed at `/`, Thai under `/th/`. No URL flip.
- **Astro config gotcha:** in `astro.config.mjs`, the unprefixed locale must remain
  English so `/about/` stays `/about/` (not `/en/about/`). Astro's `defaultLocale`
  setting only decides "which locale has no URL prefix" — keep that as English to
  preserve URLs. It is NOT a statement about which language is primary. The
  Thai-first *experience* is a design/content/hreflang/redirect concern, separate.
- **How Thai visitors reach Thai content (two mechanisms):**
  1. `hreflang` so Google serves the `/th/` URL directly to Thai-language searchers.
  2. A **root language redirect**: when a visitor with a Thai browser preference hits
     `/`, send them to `/th/`. This is what makes the site feel Thai-default to Thai
     humans without changing any URL.
  Implement the redirect carefully: base it on `Accept-Language`, never block crawlers
  (Googlebot crawls as English from the US, so it stays on `/` and sees the indexed
  English version), and keep `/` independently crawlable. With hreflang in place this
  is an SEO-acceptable pattern.
- Every page must know its translated counterpart's URL so `SEOHead` can emit the
  correct `hreflang` pair (see SEO rules). Keep a per-page mapping of EN ⇄ TH URLs.
- UI chrome (nav labels, button text, footer) comes from a shared strings file
  (`src/i18n/ui.ts`), not hard-coded per page.
- Do NOT machine-translate content. Use the existing site's Thai copy verbatim.

### Content Collections
Schemas live in `src/content.config.ts` using the Astro 5 Content Layer API with
`glob` loaders.
- **treatments** schema: `title`, `description`, `order` (number), `lang`, optional `image`
- **blog** schema: `title`, `description`, `pubDate` (Date), `lang`, optional `author`, `tags`
- Always validate new collection entries against the schema before adding content.

### Styling
- Tailwind CSS v4 — CSS-only config, no `tailwind.config` file.
- Brand colours/fonts defined with `@theme` tokens in `src/styles/global.css`.
- Mobile-first; then `md:` / `lg:` breakpoints.
- Avoid arbitrary values (`[#abc123]`) — add named tokens to `@theme` instead.
- Note: Thai text wraps and sizes differently from English — test both languages.

### Component conventions
- Prefer `.astro` components; use React/Vue only if client interactivity truly requires it.
- Keep components small and single-responsibility.

---

## 7. SEO Rules — DO NOT SKIP

The site has years of Google rankings in two languages. If we break these, the
business loses customers.

### URL rules
- Every old WordPress URL (EN and TH) must have a matching new page or a 301 redirect.
- Do not change URL slugs unless absolutely necessary.
- If a URL must change, add it to `redirects.json` immediately.
- Check `redirects.json` before deleting or renaming any page file.
- Wildcard/catch-all redirects (e.g. `/category/*`) do NOT work in `redirects.json`
  with static output — use host-level rules in `vercel.json` instead.

### hreflang — the bilingual must-have
Every page emits, in `<head>`, a set of alternate links pointing to itself and its
translation, e.g.:
```html
<link rel="alternate" hreflang="en" href="https://beechooherbal.com/about/" />
<link rel="alternate" hreflang="th" href="https://beechooherbal.com/th/about/" />
<link rel="alternate" hreflang="x-default" href="https://beechooherbal.com/about/" />
```
Get this wrong and Google may treat EN and TH as duplicate content. This is the
highest-risk new item on this project.

Under Path A (URLs unchanged), `hreflang` is ALSO the Thai-first routing mechanism:
correct tags let Google serve the `/th/` URL directly to Thai-language searchers, so
the business gets a Thai-first result in search without any root redirect. `x-default`
points at the English root as the fallback for visitors who match neither EN nor TH.

### Every page must have
```astro
---
const lang = "en"; // or "th"
const title = "Page Title";
const description = "150 characters max. Specific to this page.";
// canonical + hreflang are generated by SEOHead
---
<BaseLayout title={title} description={description} lang={lang}>
```

### Schema markup (JSON-LD)
- Homepage → `LocalBusiness` schema (note: multiple Thailand outlets — confirm how to represent)
- Treatment pages → `Service` schema
- FAQ page → `FAQPage` schema
- Use `<script type="application/ld+json">` tags.

### Images
- Always include `alt` text on every image.
- Always use the Astro `<Image>` component, never a raw `<img>` tag.
- Compress images before adding to `/public/images/`.
- Validate downloaded images' magic bytes (PNG `89 50 4E 47`, JPEG `FF D8 FF`,
  GIF `47 49 46`) — Cloudflare can return a 200 + homepage HTML instead of the image.

### Do NOT
- Remove any page that exists on the current site (in either language) without a redirect.
- Use client-side rendering for content Google needs to index.
- Add heavy JavaScript libraries unless absolutely necessary.

---

## 8. Content Guidelines

- **Tone:** Warm, trustworthy, professional — speaks to people worried about hair/scalp issues.
- **Languages:** English and Thai. Use the existing site's copy verbatim in each language.
  Do NOT machine-translate; do NOT invent claims about treatments or results.
- **No women-only messaging** — this clinic serves everyone (unlike the SG site).

---

## 9. What NOT to Build

- ❌ Custom booking/appointment system — use the existing contact/booking CTAs.
- ❌ User accounts or login
- ❌ Payment processing
- ❌ Anything that requires a database or server
- ❌ WordPress-style plugin logic
- ❌ Machine-translated content

---

## 10. Project Phases & To-Do

### Phase 0 — Confirm scope with Crispin (CONFIRMED — June 2026)
- [x] Migrate BOTH English and Thai? → **YES.** Thai is the primary language
      ("Thai as default"). Delivered via Path A — Thai-first experience, URLs unchanged
      (see §6 i18n).
- [x] Conversion actions / booking? → **All of them, exactly like the original:**
      Call + Facebook + LINE (+ YouTube, TikTok as on the current site). No online
      booking system to migrate. (see §2 Business Context)
- [x] Modernise the look? → **YES** — cleaner, modern design; same content, pages, and
      URLs. Homepage shown to Crispin first for sign-off before the rest (see Goal 4, §1).
- [x] Any pages to add, drop, or change? → **NO.** Treat the current site as the master
      copy and reproduce everything faithfully.

### Phase 1 — Inventory (both languages) — DONE (June 2026, see `inventory/`)
- [x] Pull full URL list from the sitemap (`/sitemap_index.xml`) → `inventory/old-urls.txt` (**92 URLs**)
- [x] Map every EN URL to its TH counterpart → `inventory/en-th-map.csv` (**19 pairs**; see caveat below)
- [x] Pull content via WP REST API → `inventory/rest-pages.json` (en=18, th=17).
      ⚠ CORRECTED 2026-07-14: `/wp/v2/posts` 500s only for **large page-1 collection queries**
      (`per_page=50`/`100&page=1`); **all 54 posts fetch fine individually** (`per_page=1&page=N`),
      including the alopecia post whose HTML page 500s. Phase 4 blog migration CAN use REST —
      pull posts one at a time; no HTML scraping needed. (See `docs/session-2026-07-14-audit.md`.)
- [x] Capture SEO metadata (lang, hreflang, title, description, canonical) → `inventory/pages.json`
- [x] Note moving parts → `inventory/parity-report.md`. Re-run anytime: `node inventory/scripts/run-all.mjs`

**Key verified findings (full detail in `inventory/parity-report.md`):**
- ⚠ **The site is NOT translation-linked.** hreflang is self-referential, the WPML switcher
  sends every page to `/th/`, and REST has no translation fields. Only 2 real hreflang pairs
  exist. The 17 main EN↔TH pairs were matched **semantically** (by reading live titles) — the
  rebuild must CREATE the correct hreflang/translation links. This is the #1 SEO task.
- **49 EN / 43 TH pages.** 26 TH pages are blog/event posts sitting at the **root** (English URL
  space) with a misleading `<html lang=en-US>` — language is NOT reliable from path or lang attr.
- **Broken URLs to fix, not copy:** `/5-causes-of-hair-loss-…/` 301-loops to a `.jpg`;
  `/suffering-from-alopecia-…/` returns 500 (its content IS recoverable via single-post REST);
  a duplicate `…ประเวศ…-2567-2` post (title is actually Chatuchak). 11 root posts have
  `canonical` pointing at `/th/<slug>/` — CORRECTED 2026-07-14: those `/th/<slug>/` mirrors are
  **live 200 duplicates** (not 404s), i.e. the live site tells Google the `/th/` mirror is
  canonical for those posts. The Phase 4 redirect map must cover these mirror URLs even though
  they are not among the 92 sitemap URLs.

### Phase 2 — Foundation (trunk before branches)
- [ ] Scaffold Astro + Tailwind v4, set up Vercel deploy from GitHub
- [ ] Decide i18n architecture (Astro i18n routing; keep URLs identical to WPML)
- [ ] Build BaseLayout + SEOHead (with hreflang from day one) + LanguageSwitcher
- [ ] Decide + TEST redirect strategy before relying on it

### Phase 3 — Core pages (each in EN + TH)
- [ ] Home
- [ ] 7 treatment pages (hair loss, grey/white, oily, dandruff, damaged/dry, bacterial, postpartum)
- [ ] About, Team, Locations, Privacy Policy
- [ ] Testimonials, FAQ (+ "Herbal vs Hair Transplant"), Products, Events & News

### Phase 4 — Migration & SEO
- [ ] Automate blog migration via REST API (per language)
- [ ] Build complete 301 redirect map; wildcard rules in vercel.json if needed
- [ ] Add schema markup to all pages
- [ ] Add tracking codes (confirm which: GTM / Meta Pixel / TikTok Pixel) in BaseLayout
- [ ] Re-runnable URL parity check (EN + TH): assert 200 or 301→200, print every 404

### Phase 5 — Launch behind a safety net
- [ ] Deploy to Vercel preview; run parity check against preview
- [ ] Visual sign-off from Crispin BEFORE pointing DNS
- [ ] DNS cutover (Cloudflare); confirm redirects live on real domain
- [ ] Submit new sitemap to Google Search Console; watch crawl errors ~2 weeks

---

## 11. Known URL Inventory (starting point — verify against sitemap)

English (root):
- `/` — Home
- `/scalp-hair-loss-treatment-salon-clinic-in-bangkok/` — Hair Loss
- `/reverse-premature-grey-white-hair-by-herbal-treatment/` — Grey/White Hair
- `/herbal-treatment-to-get-rid-of-oily-scalp-hair/` — Oily Scalp
- `/cure-dandruff-hair-with-herbal-treatment/` — Dandruff
- `/repair-chemically-damaged-dry-hair-with-herbal-treatment/` — Damaged/Dry Hair
- `/herbal-treatment-cure-for-bacteria-infection-alopecia-areata-and-other-hair-diseases/` — Bacterial Infection
- `/postpartum-hair-loss-treatment-in-thailand/` — Postpartum
- `/locations/`
- `/about/`
- `/team/`
- `/privacy-policy/`
- `/reviews-and-testimonials-of-bee-choo-origin-treatment/` — Testimonials
- `/frequently-asked-questions/` — FAQ
- `/hair-transplant-vs-stem-cell-vs-keratin-treatment-vs-natural-herbal-treatment/`
- `/category/blog/` — Blog index (+ individual posts)
- `/bee-choo-hair-care-products/` — Products
- `/events-news-release/` — Events & News

Thai: **does NOT simply mirror the English paths under `/th/`.** Verified from the
live site during Phase 1 inventory:
- Thai home is at `/th/home/` (not `/th/`); English home is the bare `/`.
- Thai pages use **fully translated Thai slugs** (percent-encoded), e.g. oily scalp =
  `/th/วิธีแก้หนังศีรษะมัน/`, FAQ = `/th/คำถามที่พบบ่อย/`. You CANNOT derive a Thai
  URL from its English one.
- Some Thai content lives at the **root**, not under `/th/` (e.g. Thai blog posts).
  Language is therefore NOT reliable from the path alone.
- Consequence: we need an explicit per-page **EN↔TH URL map** → `inventory/en-th-map.csv`.
  ⚠ **Correction from the Phase 1 batch:** the live `hreflang` is NOT a usable source — it is
  self-referential (each page only links to itself) and the WPML switcher points every page to
  `/th/`, so the site contains **no machine-readable EN↔TH pairing**. The 17 main pairs in the
  map were therefore matched **semantically from the live titles** (only 2 real hreflang pairs
  exist, for the blog category + author archive). Astro routing must emit each Thai page at its
  real translated slug (not a `/th/`-prefixed English slug) AND emit correct hreflang from day one.
  Verified counts: 92 URLs, 49 EN / 43 TH, 19 mapped pairs, 30 orphan EN / 26 orphan TH.

---

## 12. Key Contact

- **Crispin W. Francis** — Boss, project owner, content maintainer
- Confirm with Crispin before: changing URLs, removing pages, the booking/contact
  decision, and DNS cutover.

---

*Created: June 2026 — adapted from the beechooladies.com.sg CLAUDE.md*
