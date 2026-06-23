# Bee Choo Herbal (TH) — Project Handoff / Context

**Date:** 2026-06-22
**Purpose:** Bring a fresh chat up to speed on the beechooherbal.com WordPress→Astro
migration. Full standing spec lives in `CLAUDE.md` (project knowledge); this doc is the
"where we are right now" snapshot.

---

## 1. What this is

Rebuild **beechooherbal.com** — Bee Choo Herbal / Origin, a herbal scalp & hair-loss
clinic in Bangkok — from WordPress into Astro. Second migration after the (completed)
beechooladies.com.sg Singapore site. Same goal: exact faithful copy on a faster stack,
**SEO is priority #1**. Client: **Crispin W. Francis** (owner, non-technical).

Biggest difference from the SG site: **this one is bilingual (WPML)** — English and Thai.

---

## 2. Setup decisions (done / in progress)

- **New everything**, not shared with the SG project:
  - New Claude Project (this one).
  - New GitHub repo: `ryo-natthakorn/beechooherbal` — set **Private** (client work),
    **no README**, **no .gitignore** (Astro scaffold provides its own). Empty repo so the
    first push is clean.
  - New local folder: `Desktop\beechooherbal`.
- **Not using Cowork.** Project config happens in claude.ai; execution in Claude Code
  (VS Code / terminal), same workflow as the SG site.
- **Project knowledge files:** `CLAUDE.md` (generated, current) + `SKILL.md` (existing
  wordpress-to-astro-migration skill). Re-upload `CLAUDE.md` whenever it changes — project
  knowledge is a snapshot, not a live link. (Later option: connect the GitHub repo so it
  stays in sync.)

---

## 3. Scope confirmed by Crispin (Phase 0 — DONE)

1. **Languages:** Rebuild both EN + TH. **Thai is the primary language** ("Thai as
   default") — interpreted as business intent (Thai shown first), NOT a request to move
   Thai to the bare root URL.
2. **Design:** Yes to a **modern, clean look** — same content, pages, and URLs, fresher
   presentation. Homepage shown to Crispin first for sign-off before the rest (as in SG).
3. **Contact/booking:** **All of them, exactly like the original** — Call
   (`+66 02 072 6698`) + Facebook + LINE as main buttons, plus YouTube and TikTok
   (@beechooth) as the original carries them. **No online booking system** to migrate.
4. **Pages:** No additions/removals/changes. Current site = master copy, reproduce faithfully.

---

## 4. The i18n decision: Path A (locked in)

"Thai as default" is delivered **without changing any URLs** (protects rankings):

- **URLs stay as-is:** English unprefixed at `/`, Thai under `/th/`. No flip.
- Thai-first experience comes from: (a) Thai-leaning design, (b) `hreflang` so Google
  serves `/th/` URLs to Thai searchers, (c) a **root language redirect** (Accept-Language
  based) so Thai visitors hitting `/` land on Thai. Crawlers stay on `/` (English remains
  crawlable).
- In `astro.config.mjs`, the **unprefixed locale must stay English** or Astro silently
  rewrites every English URL to `/en/...`. `defaultLocale` = "which locale has no prefix",
  NOT "which language is primary."
- Path B (Thai literally at root, English to `/en/`) was **rejected** — it would relocate
  the most valuable Thai URLs and require 301s on everything.
- **One optional loose end:** if Crispin specifically wants the address bar to read
  `beechooherbal.com` (no `/th/`) for Thai branding, that's the only reason to revisit
  Path B. With the redirect he won't notice, so we're proceeding with Path A.

---

## 5. CRITICAL finding — EN and TH do NOT cleanly match

From a partial Phase-1 preview (verify with the full crawl):

- Thai home is at **`/th/home/`**, not `/th/`. English home is bare `/`.
- Thai pages use **fully translated Thai slugs** (percent-encoded), e.g. oily scalp =
  `/th/วิธีแก้หนังศีรษะมัน/`, FAQ = `/th/คำถามที่พบบ่อย/`. **You cannot derive a Thai URL
  from its English one.**
- **Some Thai content lives at the root** (no `/th/`), e.g. Thai blog posts. Language is
  NOT reliable from the path.
- **Consequence:** need an explicit per-page **EN↔TH URL map** (source of truth = each
  page's `hreflang` tags). Astro routing must emit each Thai page at its real translated
  slug. This reshapes Phase 2.

---

## 6. Where we are right now

- `CLAUDE.md` written and updated (Path A, confirmed scope, corrected Thai-URL section).
- GitHub repo creation in progress (Private settings as above).
- Crispin's scope answers received and logged into `CLAUDE.md` Phase 0.
- **Phase 1 inventory batch is written and ready to paste into Claude Code — not yet run.**
  (Batch text is in section 7 below.)
- No site code written yet. Correct — scaffolding is Phase 2, after inventory.

---

## 7. Immediate next steps

1. Finish creating the **Private** GitHub repo.
2. Make `Desktop\beechooherbal`, open in VS Code (`code .`).
3. **Run the Phase 1 inventory batch** in Claude Code (below) → produces
   `inventory/parity-report.md` + `inventory/en-th-map.csv`.
4. Review the parity report. **Orphan pages** (EN with no TH twin or vice versa) are a
   decision for Crispin, not an auto-fix — never machine-translate a missing page.
5. Then Phase 2: turn the slug map into the Astro routing plan + scaffold.

### Phase 1 batch (paste into Claude Code)

```
PHASE 1 — INVENTORY & EN/TH PARITY CHECK (beechooherbal.com)

Goal: produce a complete, verified inventory of the live site in BOTH languages,
and a true EN↔TH URL map. Do NOT assume Thai = English-slug under /th/ — the live
site uses translated Thai slugs and even has some Thai content at the root. The map
must come from the site itself, not from transforming slugs. Save all outputs to a
new /inventory folder. Make every step re-runnable.

1. FULL URL LIST
   - Fetch https://beechooherbal.com/sitemap_index.xml (fall back to /sitemap.xml).
   - Follow every sub-sitemap it references and collect ALL <loc> URLs.
   - Save the deduplicated, sorted list to inventory/old-urls.txt.
   - Print the total count.

2. PER-PAGE METADATA (the source of truth for the language map)
   - For each URL in old-urls.txt, fetch the page and extract:
       • <html lang="..."> value
       • every <link rel="alternate" hreflang="x" href="y"> (gives the translated-page
         pairing AND shows how the current hreflang is set up)
       • <title>, <meta name="description">, <link rel="canonical">
   - Be polite: small delay between requests, reasonable timeout, retry once on failure.
     Thai slugs are percent-encoded — keep them encoded for fetching, store a decoded
     version for human-readable reports.
   - Save to inventory/pages.json (one record per URL).

3. BUILD THE EN↔TH MAP
   - From the hreflang data, build inventory/en-th-map.csv:
       en_url, th_url, en_title, th_title
   - Blank cell where a page has no alternate in the other language.

4. CONTENT PULL (for the later migration, both languages)
   - WP REST API:
       /wp-json/wp/v2/posts?per_page=100&_embed   (paginate until exhausted)
       /wp-json/wp/v2/pages?per_page=100&_embed
     Also try &lang=th and &lang=en in case WPML filters by language.
   - Save to inventory/rest-posts.json and inventory/rest-pages.json.
   - If a post 500s, note its ID and skip (scrape later).

5. PARITY REPORT — inventory/parity-report.md
   With counts and full lists:
       • EN pages with NO Thai translation (orphan EN)
       • TH pages with NO English translation (orphan TH)
       • URLs whose language doesn't match their path
       • Anomalies: is Thai home at /th/ or /th/home/? Does /th/ redirect? Duplicates?
       • Side-by-side table of every confirmed EN↔TH pair.

6. SUMMARY
   - Print: total URLs, EN count, TH count, matched pairs, orphans each way.
   - Do NOT write any site code yet. This phase only produces the inventory.
```

---

## 8. Watch-items / known gotchas

- **Existing-site bug to FIX (not copy):** homepage service *headings* link to the old
  beechooladies.com.sg pages; "read more" buttons link correctly. Point both to
  beechooherbal.com on the new build.
- **WPML REST quirk:** if the REST pull returns only one language, WPML's REST language
  filter may be off — fall back to the `hreflang` harvest (step 2) for the language map.
- **Not women-only** (unlike SG) — no women-only messaging.
- Astro `defaultLocale` footgun (see §4).
- Project knowledge = snapshot; re-upload `CLAUDE.md` after edits.

---

## 9. Stack & working rhythm (brief — full detail in CLAUDE.md)

- **Stack:** Astro (5/6) static, Tailwind CSS v4 (CSS-only config), Vercel (auto-deploy
  from GitHub), Cloudflare (DNS + redirect rules). Windows / CMD / Claude Code.
- **Rhythm:** plan in chat → execute in Claude Code one batch at a time → wait for zero
  build errors → commit → visual sign-off → push. Revert fast if a change makes things
  worse. High-risk interdependent changes go in a single session. Save handoff docs to
  `docs/session-YYYY-MM-DD.md`. Confirm with Crispin before anything irreversible.
```
