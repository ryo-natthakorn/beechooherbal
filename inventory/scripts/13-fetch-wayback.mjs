// Step 13: recover post 1530's body from the Internet Archive.
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────────
// `/suffering-from-alopecia-hair-loss-natural-herbal-treatment-in-bangkok-thailand/`
// (post id 1530) cannot be fetched from the live site at all:
//     the HTML page                          -> HTTP 500
//     wp-json/wp/v2/posts/1530?_embed        -> HTTP 500
//     wp-json/wp/v2/posts?include=1530       -> HTTP 500
//     any listing whose _fields includes `excerpt` -> HTTP 500 for the WHOLE listing
// Diagnosed 2026-08-24: it is the EXCERPT that breaks. A listing without `excerpt`
// returns the post fine, which is how 11-fetch-blog.mjs still has its title, link,
// date and categories — only the BODY is unreachable.
//
// ⚠ This CORRECTS CLAUDE.md §10 and docs/session-2026-07-14-audit.md, which both state
// that all 54 posts fetch fine individually. They no longer do.
//
// The article is real content the site ranks on (2,985 words on alopecia), so Ryo's
// call was to rebuild it rather than redirect the URL away.
//
// ── WHY IT PRODUCES A REST-SHAPED RECORD ────────────────────────────────────────
// Rather than hand-writing a Markdown file, this emits a record with the same shape
// 11-fetch-blog.mjs produces. That way 12-generate-blog.mjs, the content schema and
// 06-copy-parity.mjs all treat this post IDENTICALLY to the other twenty — a
// hand-written file would put 2,985 words outside every automated check in the batch.
// The `provenance` block is what keeps it honest and impossible to mistake for
// live-sourced content.
//
// ── CAPTURE CHOICE ──────────────────────────────────────────────────────────────
// Captures from 2022-12 onward (5-8 KB) are Cloudflare bot-check interstitials
// containing NO article — only the 2021/2022 captures (26-29 KB) are usable.
// Usable, newest first: 20220701072615, 20220129010045, 20210925055347, 20210624054015.
//
// The raw capture is committed to inventory/wayback/ because it is the ONLY surviving
// source of this article. Do not delete it; a re-fetch may not be possible.
//
// Invoke via `npm run fetch-wayback`. `--dry` extracts and reports without writing.

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fetchUrl, invPath, SITE } from './lib.mjs';
import { ROOT, imageUrlsFrom, downloadImage, writeSnapshot, text } from './lib-posts.mjs';
import { keyFor } from './blog-keys.mjs';

const CAPTURE = {
  wpId: 1530,
  ts: '20220701072615',
  slug: 'suffering-from-alopecia-hair-loss-natural-herbal-treatment-in-bangkok-thailand',
  alternates: ['20220129010045', '20210925055347', '20210624054015'],
};
CAPTURE.link = `${SITE}/${CAPTURE.slug}/`;
CAPTURE.archive = `http://web.archive.org/web/${CAPTURE.ts}/${CAPTURE.link}`;

const RAW_DIR = path.join(ROOT, 'inventory', 'wayback');
const RAW_FILE = path.join(RAW_DIR, `${CAPTURE.wpId}-${CAPTURE.ts}.html`);
const IMG_DIR = path.join(ROOT, 'src', 'assets', 'images', 'blog');

const DRY = process.argv.includes('--dry');

// ---------------------------------------------------------------- capture handling

/**
 * Undo the Archive's URL rewriting so the body carries LIVE upload URLs again.
 * Must run BEFORE image extraction, or imageUrlsFrom() sees web.archive.org URLs and
 * the -WxH original-stripping never matches the manifest.
 * The optional `im_`/`js_`/`cs_`/`if_` suffix is the Archive's resource-type marker.
 */
function unrewrite(html) {
  return html.replace(/https?:\/\/web\.archive\.org\/web\/\d+(?:[a-z]{2}_)?\//g, '');
}

/** Strip the Archive's injected toolbar/scripts, which are not part of the page. */
function stripArchiveChrome(html) {
  return html
    .replace(/<!-- BEGIN WAYBACK TOOLBAR INSERT -->[\s\S]*?<!-- END WAYBACK TOOLBAR INSERT -->/g, '')
    .replace(/<div id="wm-ipp-base"[\s\S]*?<\/div>\s*<\/div>/g, '')
    .replace(/<script[^>]*web-static\.archive\.org[\s\S]*?<\/script>/g, '')
    .replace(/<link[^>]*web-static\.archive\.org[^>]*>/g, '');
}

/**
 * Extract the inner HTML of the first element matching `openRe`, counting nested
 * <div>s so the correct closing tag is found. A regex alone cannot do this — the
 * Elementor content is ~40 nested divs deep.
 */
function extractBalancedDiv(html, openRe) {
  const m = openRe.exec(html);
  if (!m) return null;
  const start = m.index + m[0].length;
  let depth = 1;
  const tag = /<div\b[^>]*>|<\/div>/gi;
  tag.lastIndex = start;
  let t;
  while ((t = tag.exec(html))) {
    depth += t[0][1] === '/' ? -1 : 1;
    if (depth === 0) return html.slice(start, t.index);
  }
  return null; // unbalanced — caller treats as failure
}

const meta = (html, pat) => {
  const m = new RegExp(pat, 'is').exec(html);
  return m ? m[1].trim() : null;
};

// ---------------------------------------------------------------- main

async function main() {
  console.log(`== wayback recovery: post ${CAPTURE.wpId} ==${DRY ? '  (dry run — nothing written)' : ''}`);
  console.log(`   ${CAPTURE.archive}`);

  // 1. Capture ---------------------------------------------------------------
  let raw;
  if (existsSync(RAW_FILE)) {
    raw = readFileSync(RAW_FILE, 'utf8');
    console.log(`\n  using committed capture (${(raw.length / 1024).toFixed(0)} KB) — ${path.relative(ROOT, RAW_FILE)}`);
  } else {
    const r = await fetchUrl(CAPTURE.archive, { timeout: 60000, retries: 2 });
    if (!r.ok) throw new Error(`capture fetch failed: HTTP ${r.status} ${r.error || ''}`);
    raw = r.body;
    console.log(`\n  fetched ${(raw.length / 1024).toFixed(0)} KB`);
    // A bot-check interstitial is ~5-8 KB and has no article. Refuse it loudly rather
    // than freezing an empty post.
    if (raw.length < 20000) {
      throw new Error(
        `capture is only ${raw.length} bytes — that is the Cloudflare bot-check interstitial, ` +
          `not the article. Try an alternate: ${CAPTURE.alternates.join(', ')}`,
      );
    }
    if (!DRY) {
      mkdirSync(RAW_DIR, { recursive: true });
      writeFileSync(RAW_FILE, raw);
      console.log(`  committed raw capture -> ${path.relative(ROOT, RAW_FILE)}`);
    }
  }

  // 2. Clean + isolate the body ---------------------------------------------
  const clean = unrewrite(stripArchiveChrome(raw));
  const body = extractBalancedDiv(clean, /<div class="entry-content">/i);
  if (!body) throw new Error('could not isolate <div class="entry-content"> — the capture structure changed');

  // 3. Metadata, copied from the capture's own tags --------------------------
  const title = meta(clean, '<h1[^>]*>(.*?)</h1>') ?? meta(clean, '<meta property="og:title" content="([^"]*)"');
  const description = meta(clean, '<meta name="description" content="([^"]*)"');
  const published = meta(clean, '<meta property="article:published_time" content="([^"]*)"');
  const modified = meta(clean, '<meta property="article:modified_time" content="([^"]*)"');
  const ogImage = meta(clean, '<meta property="og:image" content="([^"]*)"');

  // 4. CROSS-VALIDATE against the live site ---------------------------------
  // The listing endpoint still works (it is only `excerpt` that 500s), so the live
  // title and date are available. Checking them proves this capture is the right post
  // and has not rotted — the single highest-value guard in this script.
  const listUrl = `${SITE}/wp-json/wp/v2/posts?categories=1&per_page=100&_fields=id,slug,link,date,modified,categories,title`;
  const lr = await fetchUrl(listUrl, { timeout: 30000, retries: 1 });
  let live = null;
  if (lr.ok) {
    try {
      live = JSON.parse(lr.body).find((p) => p.id === CAPTURE.wpId) ?? null;
    } catch {
      live = null;
    }
  }
  if (!live) {
    console.log('\n  ! could not reach the live listing to cross-validate — proceeding on the capture alone');
  } else {
    const liveTitle = text(live.title?.rendered || '');
    const capTitle = text(title || '');
    const liveDate = (live.date || '').slice(0, 10);
    const capDate = (published || '').slice(0, 10);
    const titleOk = liveTitle.toLowerCase() === capTitle.toLowerCase();
    const dateOk = liveDate === capDate;
    console.log('\n  cross-validation against the live listing:');
    console.log(`    title  ${titleOk ? 'MATCH' : 'DIFFERS'}  live="${liveTitle.slice(0, 46)}"`);
    console.log(`    date   ${dateOk ? 'MATCH' : 'DIFFERS'}  live=${liveDate} capture=${capDate}`);
    if (!titleOk || !dateOk) {
      throw new Error(
        'capture does not match the live post metadata — wrong capture, or the post changed. ' +
          'Do NOT freeze this; check the alternates.',
      );
    }
    // Prefer the LIVE slug/link/categories: they are current, the capture is 2022.
    CAPTURE.link = live.link;
    CAPTURE.categories = live.categories;
    CAPTURE.liveModified = live.modified;
  }

  // 5. Build a REST-shaped record -------------------------------------------
  const record = {
    id: CAPTURE.wpId,
    date: published,
    modified: modified ?? published,
    slug: CAPTURE.slug,
    link: CAPTURE.link,
    title: { rendered: title },
    // The live excerpt is exactly what 500s, so it is reconstructed from the capture's
    // meta description — which IS what Yoast generated from this post. Verified to
    // match the live listing's yoast_head_json.description character for character.
    excerpt: { rendered: description ? `<p>${description}</p>` : '' },
    content: { rendered: body },
    categories: CAPTURE.categories ?? [1],
    yoast_head_json: { description },
    _embedded: ogImage ? { 'wp:featuredmedia': [{ source_url: ogImage }] } : undefined,
  };

  const stats = (() => {
    const paras = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((m) => text(m[1]))
      .filter((t) => t.split(' ').length > 6);
    return { paragraphs: paras.length, words: paras.reduce((n, t) => n + t.split(' ').length, 0), head: paras[0], tail: paras.at(-1) };
  })();

  console.log('\n  extracted body:');
  console.log(`    ${body.length} chars | ${stats.paragraphs} substantive paragraphs | ~${stats.words} words`);
  console.log(`    imgs: ${(body.match(/<img/gi) || []).length}`);
  console.log(`\n    FIRST: ${(stats.head || '').slice(0, 150)}`);
  console.log(`    LAST:  ${(stats.tail || '').slice(0, 150)}`);
  console.log(`\n    meta description: ${(description || '(none)').slice(0, 120)}`);

  if (DRY) {
    console.log('\n  --dry: nothing written. Read the FIRST/LAST lines above — they must be');
    console.log('  article prose, NOT navigation or footer text. Isolation is the one step');
    console.log('  copy-parity cannot check (it verifies legacy->built, never built->legacy).');
    return;
  }

  // 6. Images ----------------------------------------------------------------
  const manifest = { fetched_at: new Date().toISOString(), byUrl: {}, byPost: {}, resized: [], failures: [] };
  const key = keyFor(CAPTURE.wpId);
  const urls = imageUrlsFrom(record);
  const saved = [];
  for (const [i, u] of urls.entries()) {
    // Uploads are static and still 200 even though the POST 500s, so the live URL is
    // tried first; the capture's own copy is the fallback.
    let entry = await downloadImage(u, path.join(IMG_DIR, key), i, manifest);
    if (!entry) {
      const viaArchive = `http://web.archive.org/web/${CAPTURE.ts}im_/${u}`;
      entry = await downloadImage(viaArchive, path.join(IMG_DIR, key), i, manifest);
    }
    if (entry) saved.push(entry);
  }
  manifest.byPost[CAPTURE.wpId] = { key, lang: 'en', slug: CAPTURE.slug, images: saved };
  console.log(`\n  images: ${saved.length}/${urls.length} ok`);

  // 7. Write -----------------------------------------------------------------
  const out = {
    type: 'posts',
    section: 'wayback',
    fetched_at: new Date().toISOString(),
    provenance: {
      source: 'wayback',
      reason:
        'wp-json/wp/v2/posts/1530 returns HTTP 500, as does the live HTML page and any ' +
        'listing whose _fields includes `excerpt`. The excerpt is what breaks.',
      capture: CAPTURE.archive,
      capturedAt: '2022-07-01T07:26:15Z',
      rawFile: path.relative(ROOT, RAW_FILE).replace(/\\/g, '/'),
      alternates: CAPTURE.alternates,
      warning: 'Anything edited on this post after 2022-07-01 is NOT reflected.',
      crossValidated: Boolean(live),
    },
    variants: { default: [], en: [record], th: [] },
    errors: [],
    counts: { default: 0, en: 1, th: 0 },
  };
  writeSnapshot(invPath('rest-posts-wayback.json'), out);
  writeFileSync(invPath('wayback-images.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nWrote ${invPath('rest-posts-wayback.json')}`);
  console.log(`Wrote ${invPath('wayback-images.json')}`);
  if (manifest.failures.length) {
    console.log(`\n${manifest.failures.length} image failure(s):`);
    for (const f of manifest.failures) console.log(`  - ${f.url}\n      ${f.reason}`);
  }
}

main().catch((e) => {
  console.error('\nFAILED:', e.message);
  process.exitCode = 1;
});
