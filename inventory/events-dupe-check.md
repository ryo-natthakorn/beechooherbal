# Events archive vs. page — redirect pre-check

Read-only check against `inventory/old-urls.txt` and `inventory/pages.json` before deciding how to
handle the near-duplicate `/category/events-news/` (WP auto-archive) vs `/events-news-release/`
(standalone page).

## 1. Is `/category/events-news/` in the sitemap? → **YES**

`/category/events-news/` **is** in `old-urls.txt` (status 200). It is in the Yoast sitemap, so
Google almost certainly knows it and may have it indexed. **It needs a 301 — it cannot just vanish**
(a 404 would drop a URL Google currently has).

## 2. Canonical tag → **self-canonical (points at ITSELF)**

| URL | canonical points to |
|---|---|
| `/category/events-news/` | **itself** (`/category/events-news/`) |
| `/events-news-release/` | itself (`/events-news-release/`) |

The archive does **not** canonicalise to the standalone page. So WordPress is **not** already telling
Google the page is primary — both URLs self-canonicalise, i.e. Google is invited to index them as two
**separate** near-duplicate URLs. That is the textbook duplicate-content case, and it means the
consolidation has to be done by us via a **301** (there is no existing canonical doing the job).

## 3. Other `/category/*` archives in the sitemap → **2 total, and they are NOT the same case**

Only two `/category/*` URLs exist in `old-urls.txt`:

| Category URL | Title | Self-canonical? | Right outcome |
|---|---|:--:|---|
| `/category/events-news/` | `EVENTS/News Archives` | yes | **301 → `/events-news-release/`** (near-duplicate of the standalone page) |
| `/category/blog/` | `BLOG Archives` | yes | **KEEP** — this is the **blog index** (the primary blog listing; CLAUDE.md §11) |

This is the key finding for the wildcard question: the two category archives need **different**
treatment. `/category/events-news/` duplicates a standalone page → redirect it. `/category/blog/` is
the blog index itself → it must stay (redirecting it would throw away the indexed blog archive). A
blanket `/category/*` rule would wrongly send `/category/blog/` somewhere too.

## 4. Thai-side category archive → **none crawled; one dead reference**

- **No `/th/category/...` URL exists in `old-urls.txt`** (the Thai side has no crawled category archive).
- `/category/blog/` carries a TH `hreflang` pointing at `https://beechooherbal.com/th/category/blog-th/`,
  but that target is **not a real crawled page** (confirmed: not in `pages.json`) — the dead hreflang
  target flagged earlier. `/category/events-news/` has **no** TH `hreflang` at all.

So there is nothing to redirect on the Thai category side. Action item for the rebuild instead: **do
not emit** a TH `hreflang` to `/th/category/blog-th/` (it 404s). The Thai events content lives at the
page `/th/เหตุการณ์และข่าว/` (already the confirmed twin of `/events-news-release/`), not at a category URL.

---

## Recommendation → **ONE-OFF redirect, not a `/category/*` wildcard**

Handle these per-URL, because there are only two `/category/*` URLs and they require opposite outcomes:

1. **301 `/category/events-news/` → `/events-news-release/`** (exact, single URL).
   It's in the sitemap, self-canonical, and a near-duplicate of the page → it must be redirected, not
   deleted. A single exact-match entry in `redirects.json` (Astro static redirects) is enough — no
   wildcard needed for the one known URL.
2. **Keep `/category/blog/`** as the blog index (no redirect).

A wildcard `/category/:path*` is the **wrong** tool here: it would also capture `/category/blog/`, the
page we must preserve. Only reach for a host-level wildcard in `vercel.json` if we later find indexed
pagination/feed children of the events archive (`/category/events-news/page/2/`, `/feed/`); none are in
the current sitemap, so scope any such rule to `/category/events-news/:path*` specifically — never a
blanket `/category/*`.

**Suggested entry (Phase 4 redirect map):**
```
"/category/events-news/": "/events-news-release/"
```
