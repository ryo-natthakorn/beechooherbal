---
name: wordpress-to-astro-migration
description: Rebuild a WordPress site as an Astro static site WITHOUT losing SEO. Use this whenever the user wants to migrate, rebuild, copy, or move a WordPress (or other CMS) site to Astro, or mentions URL parity, 301 redirects, preserving Google rankings, content migration from the WP REST API, or making an "exact faithful copy" of an existing site. Trigger even if they don't say the word "migration" — phrases like "rebuild my site in Astro", "move off WordPress", or "keep the same URLs" all apply.
---

# WordPress → Astro Migration (SEO-Preserving)

## The one thing to never forget

The existing site's Google rankings ARE the business asset. A broken URL is lost
money. So the whole job is: reproduce every URL and every piece of content
faithfully on a faster stack, so Google notices nothing except the speed.
When in doubt, choose the option that keeps the old site's behaviour identical.

## Do the steps in THIS order — it saves the most time

The expensive mistakes come from doing things out of order: building pages before
you know all the URLs, or hand-migrating content you could have scripted. Front-load
discovery, build the shared foundation, then automate the bulk work.

1. Inventory the old site (before any code)
2. Build the foundation (layout, SEO head, redirect strategy)
3. Automate the bulk content + image migration
4. Verify parity with a re-runnable check
5. Launch behind a safety net

---

## Step 1 — Inventory the old site (the old site is the spec)

Do all of this BEFORE writing page code. The output is your definition of "done".

- **Get the full URL list** from the SEO plugin's sitemap: try `/sitemap_index.xml`
  (Yoast / Rank Math) or `/sitemap.xml`. Save every URL to `old-urls.txt`. You will
  diff against this file at the end to prove nothing broke.
- **Pull all content via the REST API in one sweep**:
  `/wp-json/wp/v2/posts?per_page=100&_embed` and `/wp-json/wp/v2/pages?per_page=100&_embed`.
  - `_embed` returns featured image + author inline, so you avoid hundreds of follow-up calls.
  - `_fields=id,slug,title,content,date` trims the payload if responses are huge.
- **Capture SEO metadata** (Yoast stores per-page title + meta description).
- **Note the moving parts**: booking embed, contact forms, analytics IDs, any custom post types.
- **Decide URL shape**: match WordPress exactly. If WP serves blog posts at `/slug`
  (root level), serve them at `/slug` in Astro — NOT `/blog/slug`. Same for tag archives.

## Step 2 — Build the foundation first (the trunk before the branches)

Everything hangs off these, so build them before any individual page.

- Scaffold Astro + Tailwind CSS v4 (v4 is CSS-only config via `@theme` in `global.css`;
  there is no `tailwind.config` file).
- Build `BaseLayout.astro` + `SEOHead.astro` first. `SEOHead` renders `<title>`,
  `<meta name="description">`, Open Graph tags, and an auto-generated canonical URL from
  the site base. Every page passes `title` + `description` down through `BaseLayout`.
- Decide the redirect strategy and **test it before relying on it** (see Redirects below).
- Use the Astro `<Image>` component, never raw `<img>`. Always include `alt` text.

## Step 3 — Automate the bulk migration (don't hand-migrate)

Hand-migrating dozens of posts is the biggest time sink. Script it instead.

- Write ONE script that loops the REST API results, converts each post's HTML to
  Markdown, writes the frontmatter, and downloads images to `public/images/<slug>/`.
- Or use a ready-made loader: **DeWP** (`delucis.github.io/dewp`) pulls WordPress content
  into Astro content collections via the REST API at build time.
- **Validate every downloaded image's magic bytes.** Hosts behind Cloudflare can silently
  return an HTML homepage with a 200 status instead of the real image. Check the first
  bytes: PNG = `89 50 4E 47`, JPEG = `FF D8 FF`, GIF = `47 49 46`. If they don't match,
  the download failed even though the HTTP status looked fine.
- If a specific post returns a 500 from the REST API, fall back to scraping that one
  post's HTML directly.

## Step 4 — Verify parity with a check you can re-run (data, not vibes)

- **URL check**: for every URL in `old-urls.txt`, request it on the new site (or preview
  deploy) and assert it returns 200, or a 301 that lands on a real 200 page. Print every
  404. "Did I break anything?" should have a number answer.
- **Sitemap check**: install `@astrojs/sitemap`, then confirm the generated URL count and
  that it contains no duplicates and no redirect-source URLs.
- **Schema markup (JSON-LD)** via `<script type="application/ld+json">`:
  `LocalBusiness` on the homepage, `Service` on service pages, `FAQPage` on the FAQ page.

## Step 5 — Launch behind a safety net

- Deploy to a host preview URL first (e.g. Vercel preview). Run the Step 4 URL check
  against the preview, not production.
- Get visual sign-off from the stakeholder BEFORE pointing DNS.
- Cut DNS over (e.g. via Cloudflare). Confirm redirects are live on the real domain.
- Submit the new sitemap to Google Search Console and watch the Coverage / Pages report
  for crawl errors for ~2 weeks.

---

## Redirects — the rule and the trap

The rule: every old URL must resolve at the same path OR have an immediate 301.

- **One-to-one redirects** → `redirects.json` (or Astro's `redirects` config).
- **Catch-all / wildcard patterns** (e.g. every `/tag/*` URL) → these do NOT work in
  `redirects.json` with Astro static output, because static output needs `getStaticPaths`
  to know the paths ahead of time. Use a **host-level wildcard** instead — e.g. Vercel's
  `vercel.json` with `"source": "/tag/:path*"`.

> ⚠ **Caveat (verified empirically 2026-07-14, beechooherbal):** on **static output with
> NO adapter** (plain `astro build` + Vercel zero-config detection), Astro's native
> `redirects` config does NOT produce a real 301 — it emits an HTML page with
> `<meta http-equiv="refresh">` that the host serves as **HTTP 200** (confirmed with
> `curl -I` against a live Vercel deployment). A meta-refresh is a materially weaker SEO
> signal than a real 301. On such deployments, **one-to-one redirects also belong in
> `vercel.json`**, not just wildcards — use `"statusCode": 301` (note: `"permanent": true`
> sends a 308, not a 301). The one-to-one rule above assumes an adapter is installed.

Always check the redirect map before deleting or renaming any page file.

## Gotchas learned the hard way

- Static-output wildcard redirects must be host-level, not `redirects.json`.
- Cloudflare can return a 200 + homepage HTML instead of an image → magic-byte check.
- The WP REST API can 500 on the odd post → scrape that post's HTML as a fallback.
- Edit interdependent files (markup + CSS + JS in one component) in a SINGLE session,
  not as separate batched instructions — they break each other when split.
- If a change makes things worse, revert fast. Don't debug a hole deeper.

## Working rhythm that holds up

- Plan / ask questions in chat → execute in the terminal → commit with a clear message →
  get visual sign-off → only then push to the deploy branch.
- Save a session handoff note (`docs/session-YYYY-MM-DD.md`) so the next session — or a
  fresh chat — can pick up without re-explaining everything.
- Confirm scope with the human stakeholder early, and again before anything irreversible
  (URL changes, removing pages, switching the booking system, DNS cutover).
