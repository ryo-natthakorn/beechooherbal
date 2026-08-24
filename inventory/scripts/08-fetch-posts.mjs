// Step 8: pull the EVENTS/News posts (both languages) + every image they reference.
//
// Why this exists separately from 04-fetch-rest.mjs:
//   04 pulls `posts?per_page=100&_embed&page=N`, and that exact shape 500s on this
//   host (documented in docs/session-2026-07-14-audit.md) — which is why
//   inventory/rest-posts.json shipped EMPTY. Verified 2026-08-21: the 500 is limited
//   to WIDE `_embed` collection queries. Both of these return 200:
//     - posts?categories=<id>&per_page=100&_fields=<narrow list>   (no _embed)
//     - posts/<id>?_embed                                          (one post at a time)
//   So we list narrow, then fetch detail per post. Slower, but it works.
//
// Scope: the EVENTS/News category only. The site has four category terms because WPML
// splits them per language:
//     EN  id  1 `blog`             "BLOG"            (19 posts)
//     EN  id 16 `events-news`      "EVENTS/News"     (18 posts)  <- ours
//     TH  id  9 `บล็อก`             "บล็อก"            (21 posts)
//     TH  id 17 `เหตุการณ์-ข่าว`     "เหตุการณ์/ข่าว"    (15 posts)  <- ours
//     --  id  7 `blog-th`          "Blog"            (2 posts, dead term)
// The 2023-2025 grand openings are filed in BOTH the blog and events terms, so
// WordPress renders "BLOG" as their card badge. The rebuild files them as events only
// — that is the bug this batch fixes. See src/data/events.ts's header.
//
// `&lang=th` is MANDATORY for the Thai terms: `categories=17` without it returns 200
// with zero items.
//
// Writes inventory/rest-posts.json in the SAME shape 04-fetch-rest.mjs produces
// ({type, fetched_at, variants:{default,en,th}, errors, counts}) so that
// 06-copy-parity.mjs's `rest()` helper works against it unchanged.
// Never touches rest-pages.json.
//
// NOT wired into run-all.mjs on purpose — run-all re-runs the Phase-1 pipeline, which
// would clobber rest-pages.json. Invoke via `npm run fetch-posts`.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { invPath, sleep, safeDecodeURI } from './lib.mjs';
// The fetch + image pipeline lives in lib-posts.mjs so the blog batch (11/12/13)
// shares it rather than copying it. See that file's header for why that matters.
import {
  ROOT,
  listTerm,
  fetchPost,
  imageUrlsFrom,
  downloadImage,
  writeSnapshot,
  MAX_W,
} from './lib-posts.mjs';

const IMG_DIR = path.join(ROOT, 'src', 'assets', 'images', 'events');

// Category term -> which rest-posts.json variant it lands in.
// `lang` is the WPML query param; null means "site default" (English terms).
const TERMS = [
  { id: 16, lang: null, variant: 'en', expect: 18, label: 'EN EVENTS/News' },
  { id: 17, lang: 'th', variant: 'th', expect: 15, label: 'TH เหตุการณ์/ข่าว' },
];

// The dead `blog-th` term (id 7) carries the Suksawat post as a stray third category.
// Pulled only so the snapshot records the full category membership of every post; it
// contributes no NEW posts (asserted below).
const STRAY_TERM = { id: 7, lang: 'th', label: 'blog-th (stray)' };

// ---------------------------------------------------------------- pair keys

// The pair key doubles as the image folder name and, later, as the content filename.
// Deliberately ASCII: 15 Thai filenames would otherwise ride Windows->Linux NFC/NFD
// normalisation between dev and the Vercel builder. The real (Thai) URL slug is
// carried in the post record, not in any filename.
//
// Derived from the BRANCH token found in the slug (EN) or title (TH). Crucially the
// TH side matches on TITLE, never slug: the post at
// `grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567-2` is titled จตุจักร (Chatuchak), so a
// slug-derived key would file it with the Prawet opening.
//
// Branch tokens, matched against the post slug (EN) or title (TH). Order matters:
// longer / more specific first, so `siam-square-make-merit` wins over `siam`.
const BRANCHES = [
  ['phutthamonthon', 'พุทธมณฑล'],
  ['chiang-mai', 'เชียงใหม่'],
  ['surat-thani', 'สุราษฎร์'],
  ['korat', 'โคราช'],
  ['suksawat', 'สุขสวัสดิ์'],
  ['chatuchak', 'จตุจักร'],
  ['prawet', 'ประเวศ'],
  ['sammakorn', 'สัมมากร'],
  ['thecrystalparkekamai-ramindra', 'เดอะคริสตัล'],
  ['chonburi', 'ชลบุรี'],
  ['saimai-krungthepkreetha', null],
  ['ratchada', null],
  ['kallapaphruk', 'กัลปพฤกษ์'],
  ['naan-charity', 'ช่วยเหลือ'],
  ['essence-shampoo', 'essence'],
  ['udomsuk', 'อุดมสุข'],
  ['siam-square-make-merit', 'ทำบุญ'],
  ['siam-grand-opening', 'สยามสแควร์'],
];

// The key is the BRANCH TOKEN ALONE — deliberately no date prefix. Four pairs were
// published on different days in each language (Chiang Mai EN 2025-09-10 / TH 09-11;
// Suksawat 09-17 / 09-16; Chonburi 2023-01-12 / 01-18; Naan 2019-07-29 / 08-02), so a
// date-prefixed key splits them into false EN-only + TH-only singletons. The branch
// token is already unique across all 18 posts. Chronology comes from `pubDate` in
// frontmatter, never from a filename.
function pairKeyFor(post, variant) {
  const slug = safeDecodeURI(post.slug || '').toLowerCase();
  const title = (post.title?.rendered || '').toLowerCase();
  // EN: slug is trustworthy. TH: slug is NOT (see note above) — match on title only.
  const hay = variant === 'en' ? `${slug} ${title}` : title;
  for (const [en, th] of BRANCHES) {
    if (hay.includes(en) || (th && hay.includes(th.toLowerCase()))) return en;
  }
  return `unmatched-${post.id}`;
}

// ---------------------------------------------------------------- main

// `--dry` runs the list pass and the pair-key derivation only: no post bodies, no
// image downloads, nothing written. Use it to confirm the EN<->TH pairing before
// committing to the full fetch.
const DRY = process.argv.includes('--dry');

async function main() {
  console.log(`== events posts ==${DRY ? '  (dry run — list + pairing only)' : ''}`);

  const out = {
    type: 'posts',
    // Consumed by writeSnapshot's cross-section clobber guard: this file must never be
    // overwritten by a blog pull, because 09-generate-events.mjs rebuilds all 33 event
    // posts from it. See lib-posts.mjs.
    section: 'events',
    fetched_at: new Date().toISOString(),
    variants: { default: [], en: [], th: [] },
    errors: [],
    counts: {},
  };
  const manifest = { fetched_at: out.fetched_at, byUrl: {}, byPost: {}, resized: [], failures: [] };

  // 1. List pass -------------------------------------------------------------
  const listed = [];
  for (const term of TERMS) {
    const { items, total } = await listTerm(term);
    // A silent membership drift is exactly what this batch must not absorb quietly.
    if (items.length !== term.expect || total !== term.expect) {
      throw new Error(
        `${term.label}: expected ${term.expect} posts, got ${items.length} (x-wp-total ${total}). ` +
          `Category membership changed on the live site — re-check the split before continuing.`,
      );
    }
    listed.push({ term, items });
    await sleep(400);
  }

  const { items: strayItems } = await listTerm(STRAY_TERM);
  const knownIds = new Set(listed.flatMap(({ items }) => items.map((p) => p.id)));
  const strayNew = strayItems.filter((p) => !knownIds.has(p.id));
  console.log(
    `  stray term contributes ${strayNew.length} post(s) not already listed` +
      (strayNew.length ? `: ${strayNew.map((p) => p.slug).join(', ')} (NOT pulled — blog batch)` : ''),
  );

  if (DRY) {
    const keys = new Map();
    for (const { term, items } of listed) {
      for (const stub of items) {
        const k = pairKeyFor(stub, term.variant);
        if (!keys.has(k)) keys.set(k, {});
        keys.get(k)[term.variant] = safeDecodeURI(stub.slug);
      }
    }
    const rows = [...keys.entries()].sort().reverse();
    console.log(`\n-- pair keys (${rows.length}) --`);
    for (const [k, v] of rows) {
      const mark = v.en && v.th ? 'PAIR    ' : v.en ? 'EN-ONLY ' : 'TH-ONLY!';
      console.log(`  ${mark} ${k}`);
      if (v.en) console.log(`             en: ${v.en}`);
      if (v.th) console.log(`             th: ${v.th}`);
    }
    const pairs = rows.filter(([, v]) => v.en && v.th).length;
    const enOnly = rows.filter(([, v]) => v.en && !v.th).length;
    const thOnly = rows.filter(([, v]) => !v.en && v.th).length;
    const unmatched = rows.filter(([k]) => k.includes('unmatched')).length;
    console.log(`\npairs ${pairs} | EN-only ${enOnly} | TH-only ${thOnly} | unmatched ${unmatched}`);
    console.log(pairs === 15 && enOnly === 3 && thOnly === 0 && unmatched === 0 ? 'OK — matches the planned 15 + 3.' : 'MISMATCH — fix BRANCHES before the real run.');
    return;
  }

  // 2. Detail pass -----------------------------------------------------------
  for (const { term, items } of listed) {
    console.log(`\n-- ${term.label}: fetching ${items.length} post bodies --`);
    for (const stub of items) {
      const { post, error } = await fetchPost(stub.id, term.lang);
      if (error) {
        out.errors.push({ variant: term.variant, id: stub.id, slug: stub.slug, error });
        console.log(`  ! ${stub.id} ${stub.slug}: ${error}`);
        await sleep(400);
        continue;
      }
      out.variants[term.variant].push(post);
      const key = pairKeyFor(post, term.variant);
      console.log(`  ${post.id} ${key}  (${safeDecodeURI(post.slug).slice(0, 40)})`);

      // 3. Image pass (interleaved so a failure is attributable to its post) ---
      const urls = imageUrlsFrom(post);
      const dir = path.join(IMG_DIR, key);
      const saved = [];
      for (const [i, u] of urls.entries()) {
        const entry = await downloadImage(u, dir, i, manifest);
        if (entry) saved.push(entry);
      }
      manifest.byPost[post.id] = { pairKey: key, lang: term.variant, slug: safeDecodeURI(post.slug), images: saved };
      console.log(`      ${saved.length}/${urls.length} images ok`);
      await sleep(400);
    }
  }

  // 4. Write -----------------------------------------------------------------
  out.counts = Object.fromEntries(Object.entries(out.variants).map(([k, v]) => [k, v.length]));
  writeSnapshot(invPath('rest-posts.json'), out);
  writeFileSync(invPath('events-images.json'), JSON.stringify(manifest, null, 2));

  const files = Object.keys(manifest.byUrl).length;
  const refs = Object.values(manifest.byPost).reduce((n, p) => n + p.images.length, 0);
  console.log('\n--- summary ---');
  console.log('posts:', JSON.stringify(out.counts), out.errors.length ? `(errors: ${out.errors.length})` : '');
  const totalBytes = Object.values(manifest.byUrl).reduce((n, e) => n + e.bytes, 0);
  console.log(`images: ${files} unique files from ${refs} references, ${(totalBytes / 1048576).toFixed(1)} MB on disk`);
  if (manifest.resized.length) {
    const saved = manifest.resized.reduce((n, r) => n + (r.bytes[0] - r.bytes[1]), 0);
    console.log(`resized: ${manifest.resized.length} source(s) capped to ${MAX_W}px, saving ${(saved / 1048576).toFixed(1)} MB`);
  }
  if (manifest.failures.length) {
    console.log(`\n${manifest.failures.length} IMAGE FAILURE(S) — nothing was written for these:`);
    for (const f of manifest.failures) console.log(`  - ${f.url}\n      ${f.reason}`);
  }
  console.log(`\nWrote ${invPath('rest-posts.json')}`);
  console.log(`Wrote ${invPath('events-images.json')}`);

  if (out.errors.length || manifest.failures.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error('\nFAILED:', e.message);
  process.exitCode = 1;
});
