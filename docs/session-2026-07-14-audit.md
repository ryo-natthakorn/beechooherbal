# Full Project Audit — 2026-07-14

**Purpose:** independent re-verification of everything claimed by Phase 1 and Phase 2 so far.
Nothing was taken on faith: counts were re-derived from raw data with fresh logic (not the
inventory's own scripts), every logged anomaly was re-probed against the live site, and the
Phase 2 code was read, built, and its emitted HTML inspected. This doc supersedes the anomaly
log in `docs/session-2026-06-23.md` §2 where they conflict.

---

## 1. Phase 1 counts — ALL CONFIRMED ✅

Re-derived from `old-urls.txt` + `pages.json` + `en-th-map.csv` with an independent script
(fresh normalization + language rules, no reuse of `inventory/scripts/lib.mjs`):

| Metric | Claimed | Re-derived | Verdict |
|---|---:|---:|---|
| Sitemap URLs (old-urls.txt = pages.json, no dupes) | 92 | 92 | ✅ |
| English / Thai pages | 49 / 43 | 49 / 43 | ✅ |
| en-th-map.csv rows (17 semantic + 2 hreflang) | 19 | 19 | ✅ |
| Orphan EN / orphan TH | 30 / 26 | 30 / 26 | ✅ |
| Thai content at root | 26 | 26 | ✅ |
| Pages under `/th/` (all paired) | 17 | 17, 0 unpaired | ✅ |
| Canonical-drift root posts | 11 | 11 | ✅ |
| Genuine cross-language hreflang on live site | 2 | 2 (author + blog category) | ✅ |

**Live sitemap re-pulled 2026-07-14: identical — 92 URLs, 0 added, 0 removed** since the
June 22 crawl. The inventory is still current.

The 17 semantic pairs in `en-th-map.csv` were spot-verified live (about ↔ เกี่ยวกับบีชู etc.);
the hreflang self-referential claim reproduces exactly (36 self-only pages, 54 with no
alternates at all, only the 2 archive pages cross-link).

## 2. Anomaly log — 4 claims were WRONG or STALE ⚠

Every anomaly in `docs/session-2026-06-23.md` §2 was re-probed live (redirects not followed):

| Claim on file | Live reality (2026-07-14) |
|---|---|
| `/th/` 301 → `/th/home/` | ✅ Confirmed |
| `/5-causes-…/` 301-loops to a `.jpg` | ✅ Confirmed (2 hops: doubled path → uploads `.jpg`) |
| `/suffering-from-alopecia-…/` returns 500 | ✅ Confirmed — **but see REST below: its content is recoverable** |
| `…ประเวศ…-2567-2` slug is really the Chatuchak post | ✅ Confirmed (title + REST date adjacency) |
| **WP REST `posts` "500s for every variant"** | ❌ **STALE/OVERBROAD.** Only large page-1 collection queries 500 (`per_page=50`/`100&page=1`). `per_page=1&page=N` walked **all 54 posts successfully — including the alopecia post**. `x-wp-total=54` matches the post-sitemap. **Phase 4 can migrate every post via REST, one at a time. No HTML scraping needed; the alopecia content is NOT lost.** |
| **`/th/author/admin/` is a dead hreflang target** | ❌ **FALSE.** Live **200**, and it carries the site's only complete correct hreflang cluster (en + th + x-default, canonical → `/author/admin/`). Just not in the sitemap. |
| **`/th/category/blog-th/` is a dead hreflang target** | ❌ **FALSE.** **301 → `/th/category/บล็อก/`**, a live 200 Thai blog archive ("บล็อก Archives", self-canonical). **The Thai blog index exists** — the correct blog pair is `/category/blog/` ↔ `/th/category/บล็อก/`. |
| Root posts' `canonical` points at "non-existent" `/th/<slug>/` (CLAUDE.md wording) | ❌ **FALSE on "non-existent".** Probed targets return **200** — the `/th/<slug>/` mirrors are live duplicates. For those 11 posts the live site declares the `/th/` mirror canonical, so Google may have indexed THOSE URLs. **Phase 4 redirect map must include the `/th/<slug>/` mirror variants even though they are not among the 92 sitemap URLs.** |

Corrections applied: `CLAUDE.md` §10 (two bullets), `inventory/events-dupe-check.md` (dated
addendum), `src/i18n/pairs.ts` (archive pair targets).

### Bonus finding — event-twin pairing key for Phase 4
The REST walk shows EN/TH twins of each outlet-opening post were published **minutes apart**
(e.g. Prawet TH 2024-07-02 09:39 / EN 09:31; Chatuchak TH 2024-08-01 08:37 / EN 08:26; the
2018 dye-white-hair pair shares an identical timestamp). **Pair event/blog posts by publish-date
adjacency + title**, which is far more reliable than slugs (the `-2567-2` slug proves slugs lie).

## 3. Phase 2 state — machinery sound; two claimed files DO NOT EXIST

- `astro.config.mjs` ✅ correct (en unprefixed, th at `/th/`, `prefixDefaultLocale: false`).
- `SEOHead.astro` ✅ logic verified: self-canonical w/ trailing slash, twin-only hreflang
  cluster (en + th + x-default → EN), og:locale th_TH/en_US, decode-tolerant path matching.
- `BaseLayout.astro` ✅ owns `<html lang>` (fixes the live site's `en-US`-on-Thai bug).
- **Build verified 2026-07-14:** `npm run build` exits 0; `dist/index.html` emits the full,
  correct hreflang cluster; the TH placeholder at `/th/` correctly emits none.
- `pairs.ts` — **was seeded with only 1 of 19 pairs** (commit said so honestly, but the
  hreflang machinery was inert for every page except home). **Now populated** with all 17
  verified content pairs + the 2 archive pairs at their corrected live targets.
- **`LanguageSwitcher.astro` and `middleware.ts` do NOT exist** — not in the working tree,
  any commit, or any stash. If they were built, they were lost before commit. Rebuild them.
  Note for the root language redirect: this is a **static** site — Astro middleware does not
  run in production static deploys. Implement the Accept-Language redirect at the host layer
  (Vercel Edge Middleware / `middleware.ts` at repo root under Vercel's convention), never
  blocking crawlers.
- Placeholder note: the final build must NOT ship a real page at `/th/` — the old site 301s
  `/th/` → `/th/home/`, and the new site must reproduce that (host-level 301; the real Thai
  home page goes at `src/pages/th/home.astro`).

## 4. Process/repo findings

- **The GitHub repo is PUBLIC.** `docs/session-2026-06-22-handoff.md` records the decision to
  make it **Private** ("client work"). Either flip it to private or record the change of
  decision with Crispin. (Contents are crawled public-site data, but the decision log says private.)
- `docs/session-2026-06-23.md` also calls the repo "private" — same discrepancy.
- `dist/` correctly git-ignored; working tree was clean and synced with origin before this audit.
- `/category/events-news/` → `/events-news-release/` one-off 301 is well-reasoned
  (`events-dupe-check.md`) but is a URL-behaviour change → **needs Crispin sign-off** per
  CLAUDE.md §12 before launch.
- Open items unchanged from before: medium-confidence events pair needs a native-speaker
  check; orphan pages are a Crispin decision (`orphans-for-crispin.md`).

## 5. Verified next steps

1. Build `LanguageSwitcher.astro` (consume `getPair`; fall back to `/` ⇄ `/th/home/` for orphans).
2. Design the root language redirect at the host layer (NOT Astro middleware) — crawler-safe.
3. Phase 3 pages per CLAUDE.md §10, wiring every page through `BaseLayout` so the now-populated
   `pairs.ts` emits hreflang everywhere.
4. Phase 4 blog migration: single-post REST pulls (54 posts), pair twins by date+title,
   redirect map must include the 11 live `/th/<slug>/` canonical mirrors + `/category/events-news/`
   + the two broken URLs (5-causes, alopecia — both bodies recoverable via REST).
