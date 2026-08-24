// Step 11: pull the BLOG posts (both languages) + every image they reference.
//
// Sibling of 08-fetch-posts.mjs (which does EVENTS/News). Both are thin wrappers over
// the shared pipeline in lib-posts.mjs — see that file's header for why the extraction
// logic is shared rather than copied.
//
// Separate entry points rather than a `--section` flag on 08 for one reason: a flag
// means one wrong default overwrites inventory/rest-posts.json, the provenance
// 09-generate-events.mjs rebuilds all 33 event posts from. Separate scripts writing
// separate files make that impossible. writeSnapshot() enforces it anyway.
//
// ── SCOPE ───────────────────────────────────────────────────────────────────────
// The site has four category terms, because WPML splits them per language:
//     EN  id  1 `blog`             "BLOG"            (19 posts)  <- ours
//     EN  id 16 `events-news`      "EVENTS/News"     (18 posts)
//     TH  id  9 `บล็อก`             "บล็อก"            (21 posts)  <- ours
//     TH  id 17 `เหตุการณ์-ข่าว`     "เหตุการณ์/ข่าว"    (15 posts)
//     --  id  7 `blog-th`          "Blog"            (2 posts, dead term)  <- partly ours
//
// The 20 grand openings are filed in BOTH a blog term and an events term. They shipped
// as events (that recategorisation is the bug the events batch fixed — see
// src/data/events.ts), so they are excluded here by EVENT_TERMS. That single rule is
// also what stops the dead term 7 double-counting the Suksawat opening.
//
// After filtering: 10 EN / 11 TH.
//
// ── THE POST-1530 500 ───────────────────────────────────────────────────────────
// `/suffering-from-alopecia-…/` (id 1530) cannot be fetched in full. Diagnosed
// precisely 2026-08-24: it is the EXCERPT that breaks. Evidence:
//     _fields=id,slug,title,yoast_head_json              -> 200, post present
//     _fields=…,excerpt                                  -> 500 for the WHOLE listing
//     posts/1530?_embed                                  -> 500
//     posts?include=1530                                 -> 500
//     the HTML page                                      -> 500
// So the standard LIST_FIELDS (which carries no `excerpt`) returns it intact, and only
// the detail pass fails. Its body comes from a frozen 2022 Wayback capture via
// 13-fetch-wayback.mjs.
//
// ⚠ This CORRECTS CLAUDE.md §10 and docs/session-2026-07-14-audit.md, which both state
// that all 54 posts fetch fine individually. They no longer do.
//
// Writes inventory/rest-posts-blog.json (NOT rest-posts.json) + inventory/blog-images.json.
// Invoke via `npm run fetch-blog`. `--dry` lists + pairs without fetching bodies.

import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { invPath, sleep, safeDecodeURI } from './lib.mjs';
import { ROOT, listTerm, fetchPost, imageUrlsFrom, downloadImage, writeSnapshot, MAX_W } from './lib-posts.mjs';
import { keyFor, EXPECT } from './blog-keys.mjs';

const IMG_DIR = path.join(ROOT, 'src', 'assets', 'images', 'blog');

// `lang` is the WPML query param — MANDATORY for terms 9 and 7, which return 200 with
// ZERO items without it. `variant` is the bucket a post lands in, which is NOT the same
// thing: see variantByWpId on term 7.
const TERMS = [
  { id: 1, lang: null, variant: 'en', expect: 19, label: 'EN BLOG' },
  { id: 9, lang: 'th', variant: 'th', expect: 21, label: 'TH บล็อก' },
  {
    // ANOMALY. Term 7 (`blog-th`, "Blog") is a dead WPML term holding exactly two
    // posts: the EN Suksawat soft-opening (categories [1,7,16] — dropped by EVENT_TERMS
    // below, already shipped as an event) and post 1814,
    // `12-best-family-places-to-visit-in-bangkok`, which is an ENGLISH article filed on
    // a THAI term. It therefore renders on NEITHER proper archive on the live site and
    // is invisible in both the term-1 and term-9 listings. It is the 10th EN article.
    // Queried with &lang=th (the param the term needs) but bucketed by variantByWpId
    // into the language its copy is actually in.
    id: 7,
    lang: 'th',
    variant: 'th',
    expect: 2,
    label: 'blog-th (dead term)',
    variantByWpId: { 1814: 'en' },
  },
];

// A post carrying an EVENTS term is an event, whatever else it carries.
const EVENT_TERMS = new Set([16, 17]);
const isEvent = (p) => (p.categories || []).some((c) => EVENT_TERMS.has(c));

const DRY = process.argv.includes('--dry');

// ---------------------------------------------------------------- list + classify

async function collect() {
  const byId = new Map(); // dedupe: Suksawat appears in terms 1 AND 7

  for (const term of TERMS) {
    const { items, total } = await listTerm(term);
    // Silent membership drift is exactly what this batch must not absorb quietly.
    if (items.length !== term.expect || total !== term.expect) {
      throw new Error(
        `${term.label}: expected ${term.expect} posts, got ${items.length} (x-wp-total ${total}). ` +
          `Category membership changed on the live site — re-check the split before continuing.`,
      );
    }

    for (const stub of items) {
      if (isEvent(stub)) continue; // already shipped as an event
      const variant = term.variantByWpId?.[stub.id] ?? term.variant;
      if (!byId.has(stub.id)) byId.set(stub.id, { stub, variant, lang: term.lang, term: term.id });
    }

    // A future Thai post added to the dead term must not get silently misfiled as
    // English (or vice versa) — force an explicit decision.
    if (term.variantByWpId) {
      const survivors = items.filter((p) => !isEvent(p));
      const unmapped = survivors.filter((p) => !(p.id in term.variantByWpId));
      if (unmapped.length) {
        throw new Error(
          `${term.label}: ${unmapped.length} post(s) survive the events filter but are not in ` +
            `variantByWpId, so their language is undecided: ${unmapped.map((p) => `${p.id} ${safeDecodeURI(p.slug)}`).join(', ')}. ` +
            `Add each to variantByWpId with the language its COPY is in.`,
        );
      }
    }
    await sleep(400);
  }

  const posts = [...byId.values()];
  const counts = { en: posts.filter((p) => p.variant === 'en').length, th: posts.filter((p) => p.variant === 'th').length };
  if (counts.en !== EXPECT.en || counts.th !== EXPECT.th) {
    throw new Error(
      `After the events filter: expected ${EXPECT.en} EN / ${EXPECT.th} TH, got ${counts.en} / ${counts.th}. ` +
        `Check EVENT_TERMS and the term expectations above.`,
    );
  }
  return posts;
}

// ---------------------------------------------------------------- dry run

function dryReport(posts) {
  console.log(`\n-- ${posts.length} blog post(s) after the events filter --`);
  for (const { stub, variant } of [...posts].sort((a, b) => a.stub.date.localeCompare(b.stub.date))) {
    console.log(`  ${variant}  ${stub.date.slice(0, 10)}  ${String(stub.id).padStart(5)}  ${keyFor(stub.id)}`);
    console.log(`           ${safeDecodeURI(stub.slug).slice(0, 66)}`);
  }

  const keys = new Map();
  for (const { stub, variant } of posts) {
    const k = keyFor(stub.id);
    if (!keys.has(k)) keys.set(k, {});
    keys.get(k)[variant] = safeDecodeURI(stub.slug);
  }
  console.log(`\n-- pair keys (${keys.size}) --`);
  for (const [k, v] of [...keys.entries()].sort()) {
    const mark = v.en && v.th ? 'PAIR    ' : v.en ? 'EN-ONLY ' : 'TH-ONLY ';
    console.log(`  ${mark} ${k}`);
    if (v.en) console.log(`             en: ${v.en.slice(0, 62)}`);
    if (v.th) console.log(`             th: ${v.th.slice(0, 62)}`);
  }

  const pairs = [...keys.values()].filter((v) => v.en && v.th).length;
  const enOnly = [...keys.values()].filter((v) => v.en && !v.th).length;
  const thOnly = [...keys.values()].filter((v) => !v.en && v.th).length;
  const unmatched = [...keys.keys()].filter((k) => k.startsWith('unmatched-')).length;
  console.log(`\npairs ${pairs} | EN-only ${enOnly} | TH-only ${thOnly} | unmatched ${unmatched} | keys ${keys.size}`);
  const ok =
    pairs === EXPECT.pairs && enOnly === EXPECT.enOnly && thOnly === EXPECT.thOnly && unmatched === 0 && keys.size === EXPECT.keys;
  console.log(
    ok
      ? `OK — matches the planned ${EXPECT.pairs} pairs / ${EXPECT.enOnly} EN-only / ${EXPECT.thOnly} TH-only.`
      : 'MISMATCH — fix KEY_BY_WPID in blog-keys.mjs before the real run.',
  );
}

// ---------------------------------------------------------------- main

async function main() {
  console.log(`== blog posts ==${DRY ? '  (dry run — list + pairing only)' : ''}`);

  const posts = await collect();
  if (DRY) return dryReport(posts);

  const out = {
    type: 'posts',
    // Consumed by writeSnapshot's cross-section clobber guard.
    section: 'blog',
    fetched_at: new Date().toISOString(),
    variants: { default: [], en: [], th: [] },
    errors: [],
    counts: {},
  };
  const manifest = { fetched_at: out.fetched_at, byUrl: {}, byPost: {}, resized: [], failures: [] };

  console.log(`\n-- fetching ${posts.length} post bodies --`);
  for (const { stub, variant, lang } of posts) {
    const key = keyFor(stub.id);
    const { post, error } = await fetchPost(stub.id, lang);
    if (error) {
      // Keep the list-pass stub: for post 1530 it carries the only working copy of the
      // title, link, date and categories. 13-fetch-wayback.mjs supplies the body.
      out.errors.push({ variant, id: stub.id, slug: stub.slug, key, error, stub });
      console.log(`  ! ${stub.id} ${key}: ${error}`);
      await sleep(400);
      continue;
    }
    out.variants[variant].push(post);
    console.log(`  ${String(stub.id).padStart(5)} ${variant}/${key}`);

    const urls = imageUrlsFrom(post);
    const dir = path.join(IMG_DIR, key);
    const saved = [];
    for (const [i, u] of urls.entries()) {
      const entry = await downloadImage(u, dir, i, manifest);
      if (entry) saved.push(entry);
    }
    manifest.byPost[post.id] = { key, lang: variant, slug: safeDecodeURI(post.slug), images: saved };
    console.log(`        ${saved.length}/${urls.length} images ok`);
    await sleep(400);
  }

  out.counts = Object.fromEntries(Object.entries(out.variants).map(([k, v]) => [k, v.length]));
  writeSnapshot(invPath('rest-posts-blog.json'), out);
  writeFileSync(invPath('blog-images.json'), JSON.stringify(manifest, null, 2));

  const files = Object.keys(manifest.byUrl).length;
  const refs = Object.values(manifest.byPost).reduce((n, p) => n + p.images.length, 0);
  const totalBytes = Object.values(manifest.byUrl).reduce((n, e) => n + e.bytes, 0);
  console.log('\n--- summary ---');
  console.log('posts:', JSON.stringify(out.counts), out.errors.length ? `(${out.errors.length} error(s))` : '');
  console.log(`images: ${files} unique files from ${refs} references, ${(totalBytes / 1048576).toFixed(1)} MB on disk`);
  if (manifest.resized.length) {
    const saved = manifest.resized.reduce((n, r) => n + (r.bytes[0] - r.bytes[1]), 0);
    console.log(`resized: ${manifest.resized.length} source(s) capped to ${MAX_W}px, saving ${(saved / 1048576).toFixed(1)} MB`);
  }
  if (manifest.failures.length) {
    console.log(`\n${manifest.failures.length} IMAGE FAILURE(S) — nothing was written for these:`);
    for (const f of manifest.failures) console.log(`  - ${f.url}\n      ${f.reason}`);
  }

  if (out.errors.some((e) => e.id === 1530)) {
    console.log('\n  Post 1530 (suffering-from-alopecia-…) 500d, AS EXPECTED.');
    console.log('  Precisely: it is the EXCERPT that breaks — a listing without `excerpt`');
    console.log('  returns the post fine, which is why the list pass above still has its');
    console.log('  title/link/date. Its BODY comes from a frozen 2022 Wayback capture:');
    console.log('      npm run fetch-wayback');
    console.log('  This CORRECTS CLAUDE.md §10 and docs/session-2026-07-14-audit.md, which');
    console.log('  both state all 54 posts fetch fine individually. They no longer do.');
  }

  console.log(`\nWrote ${invPath('rest-posts-blog.json')}`);
  console.log(`Wrote ${invPath('blog-images.json')}`);

  // Only 1530 is a known, handled failure; anything else is a real problem.
  const unexpected = out.errors.filter((e) => e.id !== 1530);
  if (unexpected.length || manifest.failures.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error('\nFAILED:', e.message);
  process.exitCode = 1;
});
