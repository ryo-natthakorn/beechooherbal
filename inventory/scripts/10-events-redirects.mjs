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
// Run: node inventory/scripts/10-events-redirects.mjs   (npm run events-redirects)

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const EVENTS_DIR = path.join(ROOT, 'src', 'content', 'events');

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
];

// Pre-existing rules, preserved verbatim.
const KEEP = [
  { source: '/th', destination: '/th/home/', statusCode: 301 },
  { source: '/th/', destination: '/th/home/', statusCode: 301 },
];

// Every post slug, from the generated content files.
const slugs = [];
for (const lang of ['en', 'th']) {
  const dir = path.join(EVENTS_DIR, lang);
  for (const file of readdirSync(dir)) {
    const fm = readFileSync(path.join(dir, file), 'utf8');
    const slug = fm.match(/^slug:\s*'(.+?)'\s*$/m)?.[1];
    if (slug) slugs.push(slug);
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
