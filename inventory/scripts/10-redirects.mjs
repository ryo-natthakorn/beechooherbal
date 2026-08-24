// Step 10: regenerate vercel.json's redirect table.
//
// Redirects live here, NOT in astro.config.mjs: Astro's native `redirects` emits a
// 200 + meta-refresh on this static adapter (see astro.config.mjs), which is not a
// 301 and does not consolidate ranking signals.
//
// NEVER a wildcard. `/th/:slug` would destroy every real Thai page, and `/category/*`
// would destroy /category/blog/ — see inventory/events-dupe-check.md. Every rule below
// is one-to-one.
//
// Run: node inventory/scripts/10-redirects.mjs   (npm run redirects)
//
// Renamed from 10-events-redirects.mjs when the blog batch landed: this file
// regenerates the ENTIRE vercel.json, so an events-only name was a trap — the next
// batch's run would silently drop every rule it did not know about.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
// Both post sections. Slugs from BOTH are needed: this script rewrites the whole
// table, so omitting one would delete its mirror rules on the next run.
const CONTENT_DIRS = [path.join(ROOT, 'src', 'content', 'events'), path.join(ROOT, 'src', 'content', 'blog')];

// Rules that are not derived from post slugs.
//
// The Thai events archive at /th/category/เหตุการณ์-ข่าว/ and its root mirror were
// found live (200, self-canonical) during this batch and are in no prior inventory
// doc — the parity report only ever recorded the English /category/events-news/.
// The last two reproduce 301s WordPress already serves today, so dropping them would
// be a regression against the live site rather than a no-op.
const STATIC_RULES = [
  ['/category/events-news/', '/events-news-release/'],
  ['/th/category/เหตุการณ์-ข่าว/', '/th/เหตุการณ์และข่าว/'],
  ['/category/เหตุการณ์-ข่าว/', '/th/เหตุการณ์และข่าว/'],
  ['/th/events-news-release/', '/events-news-release/'],
  ['/เหตุการณ์และข่าว/', '/th/เหตุการณ์และข่าว/'],

  // --- Blog batch ------------------------------------------------------------
  // Every rule below was probed against the live site on 2026-08-24; the observed
  // status is recorded beside it. Nothing is redirected on assumption — a rule for a
  // URL that does not exist is noise, and one for a URL that does is the whole point.

  // The author archive. /author/admin/ is in the sitemap and is a live 200 carrying the
  // old site's ONLY complete hreflang cluster. No author archive is rebuilt (an "Admin"
  // byline archive duplicates the blog index and every post shares the one author), so
  // both sides point at the nearest real listing. Ryo's call.
  ['/author/admin/', '/category/blog/'], //        live 200
  ['/th/author/admin/', '/th/category/บล็อก/'], // live 200

  // Author-archive pagination. 54 posts at WP's 10-per-page: pages 2-6 are live 200s and
  // page 7 is a 404, so exactly five URLs exist. Finite and enumerated — never a
  // /author/admin/page/* wildcard.
  ['/author/admin/page/2/', '/category/blog/'], // live 200
  ['/author/admin/page/3/', '/category/blog/'], // live 200
  ['/author/admin/page/4/', '/category/blog/'], // live 200
  ['/author/admin/page/5/', '/category/blog/'], // live 200
  ['/author/admin/page/6/', '/category/blog/'], // live 200

  // Archive pagination. /category/blog/page/2/ currently 500s and page/3/ 404s, so page 2
  // is the only one that ever existed; it is redirected rather than left to 404 because a
  // 500 today does not mean Google has forgotten the URL.
  // /category/events-news/page/2/ is a live 200 — a gap the events batch left open.
  ['/category/blog/page/2/', '/category/blog/'], //            live 500
  ['/category/events-news/page/2/', '/events-news-release/'], // live 200
  // (/th/category/บล็อก/page/2/ 404s — no rule, nothing to preserve.)

  // The dead `blog-th` WPML term, and the /th/category/blog/ alias that chains into it.
  // The live site already serves both as redirects; reproducing them keeps parity rather
  // than regressing to a 404, and collapses the alias's two hops into one.
  ['/th/category/blog-th/', '/th/category/บล็อก/'], // live 301 -> บล็อก
  ['/th/category/blog/', '/th/category/บล็อก/'], //   live 302 -> blog-th -> บล็อก
  // (/category/บล็อก/ 404s on the live site — no rule.)

  // The self-nested duplicate. /5-causes-…/ 301s on the live site to a DOUBLED copy of
  // its own path. The rebuild serves the real post at the clean path, so only the
  // doubled path needs a rule. The .jpg that chain eventually lands on is deliberately
  // NOT redirected: /wp-content/uploads/ is a real asset namespace and a rule there
  // would be the wildcard this file forbids.
  [
    '/5-causes-of-hair-loss-and-where-to-find-hair-treatment-in-thailand/5-causes-of-hair-loss-and-where-to-find-hair-treatment-in-thailand/',
    '/5-causes-of-hair-loss-and-where-to-find-hair-treatment-in-thailand/',
  ], // live 301
];

// Pre-existing rules, preserved verbatim.
const KEEP = [
  { source: '/th', destination: '/th/home/', statusCode: 301 },
  { source: '/th/', destination: '/th/home/', statusCode: 301 },
];

// Every post slug, from the generated content files of BOTH sections.
const slugs = [];
const slugOwner = new Map();
for (const base of CONTENT_DIRS) {
  if (!existsSync(base)) continue;
  const section = path.basename(base);
  for (const lang of ['en', 'th']) {
    const dir = path.join(base, lang);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      const fm = readFileSync(path.join(dir, file), 'utf8');
      const slug = fm.match(/^slug:\s*'(.+?)'\s*$/m)?.[1];
      if (!slug) continue;
      // Post URLs share one flat root namespace, so a slug claimed twice would mean two
      // pages fighting for one URL — and here it would silently emit one mirror rule
      // instead of two. Fail loudly rather than let `seen` swallow it.
      const prior = slugOwner.get(slug);
      if (prior) {
        throw new Error(`Slug "${slug}" is claimed by both ${prior} and ${section}/${lang}/${file}.`);
      }
      slugOwner.set(slug, `${section}/${lang}/${file}`);
      slugs.push(slug);
    }
  }
}
slugs.sort();

const rules = [...KEEP];
const seen = new Set(KEEP.map((r) => r.source));

// WPML mirrors every post under /th/ as well as at the root. None of those mirrors is
// in the sitemap, and for 8 posts the live site currently names the /th/ mirror as
// canonical — so 301'ing the mirror to the root consolidates onto the URL Google
// actually crawls. Posts themselves stay at their legacy root paths.
const add = (source, destination) => {
  for (const form of new Set([source, encodeURI(source)])) {
    if (seen.has(form)) continue;
    seen.add(form);
    rules.push({ source: form, destination, statusCode: 301 });
  }
};

for (const [from, to] of STATIC_RULES) add(from, to);
for (const slug of slugs) add(`/th/${slug}/`, `/${slug}/`);

writeFileSync(path.join(ROOT, 'vercel.json'), JSON.stringify({ redirects: rules }, null, 2) + '\n');

const encoded = rules.filter((r) => r.source !== decodeURI(r.source)).length;
console.log(`wrote vercel.json: ${rules.length} redirect(s)`);
console.log(`  ${KEEP.length} pre-existing, ${STATIC_RULES.length} archive/index, ${slugs.length} post mirrors`);
console.log(`  ${encoded} percent-encoded duplicate(s) emitted alongside their decoded form`);
console.log('\nVercel is not documented as to whether `source` matches the decoded or the');
console.log('encoded path, and vercel.json had no non-ASCII precedent. Both forms are shipped;');
console.log('confirm on the preview deploy and drop whichever never fires.');
