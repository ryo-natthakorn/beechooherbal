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

import { writeFileSync, existsSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchUrl, invPath, SITE, sleep, safeDecodeURI } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
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

const LIST_FIELDS = 'id,slug,link,date,modified,categories,title';

// ---------------------------------------------------------------- list pass

async function listTerm({ id, lang, label }) {
  let url = `${SITE}/wp-json/wp/v2/posts?categories=${id}&per_page=100&_fields=${LIST_FIELDS}`;
  if (lang) url += `&lang=${lang}`;
  const r = await fetchUrl(url, { timeout: 30000, retries: 1 });
  if (!r.ok) throw new Error(`${label}: list failed HTTP ${r.status} ${r.error || ''}`);
  let data;
  try {
    data = JSON.parse(r.body);
  } catch {
    throw new Error(`${label}: list returned non-JSON (first 200 chars): ${r.body.slice(0, 200)}`);
  }
  if (!Array.isArray(data)) throw new Error(`${label}: list returned ${typeof data}, expected array`);
  const total = parseInt(r.headers['x-wp-total'] || '0', 10);
  console.log(`  ${label}: ${data.length} items (x-wp-total ${total})`);
  return { items: data, total };
}

// ---------------------------------------------------------------- detail pass

async function fetchPost(id, lang) {
  let url = `${SITE}/wp-json/wp/v2/posts/${id}?_embed`;
  if (lang) url += `&lang=${lang}`;
  const r = await fetchUrl(url, { timeout: 30000, retries: 1 });
  if (!r.ok) return { error: `HTTP ${r.status} ${r.error || ''}` };
  try {
    return { post: JSON.parse(r.body) };
  } catch {
    return { error: 'parse-error' };
  }
}

// ---------------------------------------------------------------- images

// WordPress rewrites uploads to `name-1024x768.jpg`. Strip that suffix to get the
// original. Cross-checked against the widest srcset candidate where one exists.
const toOriginal = (u) => u.replace(/-\d+x\d+(?=\.[a-z0-9]+(?:\?|$))/i, '');

function imageUrlsFrom(post) {
  const urls = [];
  const push = (u) => {
    if (!u) return;
    const clean = toOriginal(u.split('?')[0].trim());
    if (/\.(jpe?g|png|gif|webp)$/i.test(clean) && !urls.includes(clean)) urls.push(clean);
  };

  // Featured image first — it becomes the card thumbnail and the post hero.
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (media?.source_url) push(media.source_url);

  const html = post.content?.rendered || '';
  // Prefer the widest srcset candidate when present; WP's `src` is often a resized copy
  // and the -WxH strip alone can miss a differently-named original.
  for (const m of html.matchAll(/<img[^>]*>/gi)) {
    const tag = m[0];
    const srcset = tag.match(/srcset\s*=\s*"([^"]+)"/i)?.[1];
    if (srcset) {
      const widest = srcset
        .split(',')
        .map((c) => c.trim().split(/\s+/))
        .map(([u, w]) => ({ u, w: parseInt(w, 10) || 0 }))
        .sort((a, b) => b.w - a.w)[0];
      if (widest) push(widest.u);
    }
    push(tag.match(/\ssrc\s*=\s*"([^"]+)"/i)?.[1]);
  }
  return urls;
}

// Cloudflare answers 200 + homepage HTML for images it does not have. A file that is
// not really an image must never be left on disk — it would build into the site.
const MAGIC = [
  { ext: '.png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: '.jpg', bytes: [0xff, 0xd8, 0xff] },
  { ext: '.gif', bytes: [0x47, 0x49, 0x46] },
  { ext: '.webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF....WEBP
];
function sniff(buf) {
  for (const { ext, bytes } of MAGIC) {
    if (bytes.every((b, i) => buf[i] === b)) {
      if (ext === '.webp' && buf.slice(8, 12).toString('ascii') !== 'WEBP') continue;
      return ext;
    }
  }
  return null;
}

// Source-image cap. WordPress serves untouched camera/video-export originals — the
// Ratchada and Kallapaphruk posts are 4K video stills at 4-5 MB each, and those two
// posts alone were 86 MB of a 103 MB first pass. Astro re-encodes at build time
// regardless, so oversized SOURCES buy nothing and bloat every clone forever.
// 2400px is still well above anything the gallery grid or a retina hero renders.
//
// sharp comes in with astro (its default image service); it is not a direct dependency.
const MAX_W = 2400;
const JPEG_Q = 85;

async function normalizeInPlace(file, manifest) {
  const before = readFileSync(file);
  let sharp;
  try {
    ({ default: sharp } = await import('sharp'));
  } catch {
    return before.length; // no sharp — leave the file exactly as fetched
  }
  const img = sharp(before);
  const meta = await img.metadata();
  if (!meta.width || meta.width <= MAX_W) return before.length;

  const ext = path.extname(file).toLowerCase();
  let pipeline = img.resize({ width: MAX_W, withoutEnlargement: true });
  if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true });
  else if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 9 });
  else return before.length; // gif/webp: leave alone, animation/alpha not worth risking

  const out = await pipeline.toBuffer();
  if (!sniff(out)) return before.length; // never replace a good file with a bad one
  writeFileSync(file, out);
  manifest.resized.push({
    path: path.relative(ROOT, file).replace(/\\/g, '/'),
    from: `${meta.width}x${meta.height}`,
    to: `${MAX_W}px wide`,
    bytes: [before.length, out.length],
  });
  return out.length;
}

const sanitize = (u) =>
  safeDecodeURI(path.basename(u))
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';

async function downloadImage(url, destDir, index, manifest) {
  if (manifest.byUrl[url]) return manifest.byUrl[url]; // deduped across the EN/TH pair

  mkdirSync(destDir, { recursive: true });
  const stem = `${String(index + 1).padStart(2, '0')}-${sanitize(url)}`;

  // Skip-if-exists: re-runs are cheap and do not re-hammer the origin. Cached files
  // still go through normalizeInPlace, so the cap is self-healing across re-runs.
  for (const { ext } of MAGIC) {
    const candidate = path.join(destDir, stem + ext);
    if (existsSync(candidate)) {
      const bytes = await normalizeInPlace(candidate, manifest);
      const rel = path.relative(ROOT, candidate).replace(/\\/g, '/');
      const entry = { url, path: rel, bytes, type: ext, cached: true };
      manifest.byUrl[url] = entry;
      return entry;
    }
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(30000) }).catch((e) => ({ ok: false, err: e }));
  if (!res || !res.ok) {
    manifest.failures.push({ url, reason: `HTTP ${res?.status ?? 0}` });
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = sniff(buf);
  if (!ext) {
    // Do NOT write it. This is the Cloudflare-HTML case the project has been bitten by.
    manifest.failures.push({ url, reason: `magic-byte check failed (${buf.length}b, starts "${buf.slice(0, 16).toString('ascii').replace(/\s+/g, ' ')}")` });
    return null;
  }
  const dest = path.join(destDir, stem + ext);
  writeFileSync(dest, buf);

  // Belt and braces: re-read and re-sniff what actually landed on disk.
  if (!sniff(readFileSync(dest))) {
    unlinkSync(dest);
    manifest.failures.push({ url, reason: 'post-write validation failed; file deleted' });
    return null;
  }

  const bytes = await normalizeInPlace(dest, manifest);
  const rel = path.relative(ROOT, dest).replace(/\\/g, '/');
  const entry = { url, path: rel, bytes, type: ext, cached: false };
  manifest.byUrl[url] = entry;
  return entry;
}

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
  writeFileSync(invPath('rest-posts.json'), JSON.stringify(out, null, 2));
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
