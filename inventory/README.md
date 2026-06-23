# Phase 1 Inventory — beechooherbal.com

Re-runnable inventory of the live WordPress site in **both** languages, plus a verified
EN↔TH URL map. No external dependencies — pure Node 18+ (`fetch` built in).

## Run everything

```bash
node scripts/run-all.mjs
```

Or run any step on its own (each is idempotent and overwrites its outputs):

| Step | Script | Produces |
|---|---|---|
| 1 | `scripts/01-fetch-sitemap.mjs` | `old-urls.txt`, `sitemaps.json` |
| 2 | `scripts/02-fetch-pages.mjs` | `pages.json` (lang, hreflang, title, desc, canonical per URL) |
| — | `scripts/make-proposed-pairs.mjs` | `proposed-pairs.json` (semantic EN↔TH pairs) |
| 3 | `scripts/03-build-map.mjs` | `en-th-map.csv`, `en-th-map.hreflang.csv`, `en-th-map.json` |
| 4 | `scripts/04-fetch-rest.mjs` | `rest-posts.json`, `rest-pages.json` |
| 5 | `scripts/05-parity-report.mjs` | `parity-report.md`, `summary.json` (+ prints the summary) |

Steps 2 and 4 hit the network politely (≈0.35 s between requests, 1 retry on failure).

## Read this first

`parity-report.md` is the deliverable. The headline: **the live site is bilingual but the
EN and TH pages are not linked as translations** (hreflang is self-referential, the WPML
switcher sends every page to `/th/`, and REST exposes no translation fields). So the
EN↔TH map could not be harvested from the site — 2 pairs come from real hreflang and 17
were matched **semantically** from the live titles (flagged `source=semantic` in
`en-th-map.csv`). Re-confirm the `medium`-confidence rows with a native speaker.

## Files

- `old-urls.txt` — all 92 sitemap URLs (sorted, deduped, percent-encoded for fetching).
- `pages.json` — per-URL metadata; `url_decoded` holds the human-readable Thai.
- `en-th-map.csv` — the usable map (required cols `en_url,th_url,en_title,th_title` + `source,confidence,note`), decoded URLs.
- `en-th-map.hreflang.csv` — strict: only the 2 genuine on-site hreflang pairs.
- `proposed-pairs.json` — the semantic pairing input (regenerate with `make-proposed-pairs.mjs`).
- `rest-pages.json` — WP REST pages (en=18, th=17). `rest-posts.json` — empty: the posts endpoint 500s.
- `summary.json` — machine-readable counts.
