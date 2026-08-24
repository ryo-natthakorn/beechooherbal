// Shared post-migration pipeline: WP REST fetching, image download/validation, and
// HTML -> Markdown extraction. Used by the EVENTS batch (08/09) and the BLOG batch
// (11/12/13).
//
// WHY THIS IS SHARED RATHER THAN COPIED. Everything here was moved VERBATIM out of
// 08-fetch-posts.mjs and 09-generate-events.mjs when the blog batch arrived. The
// extraction half carries five fixes that `npm run copy-parity` caught on the events
// batch, every one of which had silently DROPPED content:
//
//   1. images nested inside a text container (`<p><img …></p>`) were stripped to
//      nothing, emptying the 2018 galleries entirely
//   2. <figcaption> captions were not extracted at all (7 lost across the batch)
//   3. <br> runs collapsed adjacent words together
//   4. a paragraph opening "1) Bee Choo Udomsuk" had its literal "1)" eaten, because
//      GFM reads `1)` as an ordered-list delimiter
//   5. an <iframe> nested in a <p> dropped a YouTube embed
//
// Blog content hits every one of them — the 2018 travel listicles use exactly that
// `<p><img></p>` gallery markup and are numbered `1)`. Two copies of this logic would
// mean two chances to regress each fix independently.
//
// RULE FOR CHANGING ANYTHING HERE: re-run both generators and diff their output.
// `npm run generate-events` must leave src/content/events/** byte-identical.

import { writeFileSync, existsSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchUrl, SITE, safeDecodeURI, decodeEntities } from './lib.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// ================================================================ REST fetching

export const LIST_FIELDS = 'id,slug,link,date,modified,categories,title';

/**
 * Narrow list pass. `_fields` narrowing (and NO `_embed`) is what keeps this at 200 —
 * the wide `posts?per_page=100&_embed` shape 500s on this host, which is why
 * 04-fetch-rest.mjs shipped an empty rest-posts.json.
 *
 * `lang` is the WPML query param and is MANDATORY for Thai terms: `categories=17`
 * without it returns 200 with ZERO items.
 */
export async function listTerm({ id, lang, label }) {
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

/** Per-post detail. Single-post `_embed` is fine; only the wide collection query 500s. */
export async function fetchPost(id, lang) {
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

/**
 * Snapshot writer with a CROSS-SECTION CLOBBER GUARD.
 *
 * inventory/rest-posts.json is the events provenance that 09-generate-events.mjs
 * regenerates all 33 event posts from. Overwriting it with a blog pull would destroy
 * that silently. Every snapshot therefore carries a `section` marker, and this refuses
 * to write one section's data over another's.
 *
 * rest-posts.json predates the marker, so a snapshot with no `section` is treated as
 * 'events' rather than as a wildcard.
 */
export function writeSnapshot(absPath, snapshot) {
  if (!snapshot.section) throw new Error('writeSnapshot: snapshot must carry a `section`');
  if (existsSync(absPath)) {
    let prior = null;
    try {
      prior = JSON.parse(readFileSync(absPath, 'utf8'));
    } catch {
      prior = null; // unreadable/corrupt — let the write proceed and replace it
    }
    if (prior) {
      const priorSection = prior.section ?? 'events';
      if (priorSection !== snapshot.section) {
        throw new Error(
          `REFUSING to write ${path.basename(absPath)}: it holds the '${priorSection}' snapshot, ` +
            `but this run produced '${snapshot.section}'. Overwriting it would destroy the ` +
            `provenance its generator rebuilds content from. Use a different output file.`,
        );
      }
    }
  }
  writeFileSync(absPath, JSON.stringify(snapshot, null, 2));
}

// ================================================================ images

// WordPress rewrites uploads to `name-1024x768.jpg`. Strip that suffix to get the
// original. Cross-checked against the widest srcset candidate where one exists.
export const toOriginal = (u) => u.replace(/-\d+x\d+(?=\.[a-z0-9]+(?:\?|$))/i, '');

export function imageUrlsFrom(post) {
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
export const MAGIC = [
  { ext: '.png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: '.jpg', bytes: [0xff, 0xd8, 0xff] },
  { ext: '.gif', bytes: [0x47, 0x49, 0x46] },
  { ext: '.webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF....WEBP
];
export function sniff(buf) {
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
export const MAX_W = 2400;
export const JPEG_Q = 85;

export async function normalizeInPlace(file, manifest) {
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

export const sanitize = (u) =>
  safeDecodeURI(path.basename(u))
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';

export async function downloadImage(url, destDir, index, manifest) {
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
    manifest.failures.push({
      url,
      reason: `magic-byte check failed (${buf.length}b, starts "${buf.slice(0, 16).toString('ascii').replace(/\s+/g, ' ')}")`,
    });
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

// ================================================================ HTML -> text

export const stripTags = (s) => s.replace(/<[^>]+>/g, '');

// Legacy copy runs through this on its way into Markdown. Entities are decoded (the
// build re-escapes as needed) and NBSP is folded to a normal space, matching what
// 06-copy-parity.mjs's norm() does — otherwise a stray U+00A0 reads as a missing
// fragment. Emoji are left strictly alone: they are page copy here and dropping them
// would fail parity.
export function text(html) {
  return decodeEntities(stripTags(html.replace(/<br\s*\/?>/gi, ' ')))
    .replace(/ /g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

// Escape what would change meaning at the START of a Markdown line.
// `\d+\)` matters as much as `\d+\.`: the Naan post opens a paragraph with
// "1) Bee Choo Udomsuk", and GFM treats `1)` as an ordered-list delimiter, so the
// literal "1)" was being consumed into list markup and the copy silently lost.
// copy-parity caught it — exactly the class of drop it exists to catch.
export const mdEscape = (s) => s.replace(/^(\s*)([#>\-+*]|\d+[.)])(\s)/gm, '$1\\$2$3');

// YouTube ids from <iframe> embeds. Dropping one loses real content, and copy-parity's
// separate embed-id check is what caught it on the events batch.
export const YT_RE = /(?:youtube(?:-nocookie)?\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function pushImg(out, tag) {
  const src = tag.match(/\ssrc\s*=\s*"([^"]+)"/i)?.[1];
  if (src) out.push({ type: 'img', src: src.split('?')[0] });
}

// Splits on BOTH <img> and <iframe>. Media is routinely nested inside the text
// container (`<p><img ...></p>`, `<p><iframe ...></iframe></p>`), and the paragraph
// regex matches the wrapper first, so anything not split out here is stripped to
// nothing and silently lost. That cost the 2018 galleries their photos and the Siam
// Square merit post its video before copy-parity caught both.
export function emitInner(out, inner, tag) {
  const parts = inner.split(/(<img[^>]*>|<iframe[^>]*>(?:<\/iframe>)?)/i);
  for (const part of parts) {
    if (!part) continue;
    if (/^<img/i.test(part)) {
      pushImg(out, part);
      continue;
    }
    if (/^<iframe/i.test(part)) {
      const id = part.match(YT_RE)?.[1];
      if (id) out.push({ type: 'video', id });
      continue;
    }
    const t = text(part);
    if (t) out.push({ type: 'text', tag, text: t });
  }
}

/**
 * Walk a post body in DOCUMENT ORDER, emitting {type:'text'|'img'|'video'} blocks.
 * Order matters: a caption is the text that FOLLOWS its image.
 */
export function blocks(html) {
  const out = [];
  // `figcaption` is in this list because that is where WordPress puts real image
  // captions ("Special Promotion Available at Bee Choo Sammakorn"). Omitting it
  // dropped seven captions across the events batch.
  const re = /<img[^>]*>|<iframe[^>]*>(?:<\/iframe>)?|<(p|h[1-6]|li|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    if (/^<img/i.test(m[0])) {
      pushImg(out, m[0]);
      continue;
    }
    if (/^<iframe/i.test(m[0])) {
      const id = m[0].match(YT_RE)?.[1];
      if (id) out.push({ type: 'video', id });
      continue;
    }
    emitInner(out, m[2], m[1].toLowerCase());
  }
  return out;
}

// ================================================================ image resolution

/** Basename key for manifest lookup, so a resized body variant finds its original. */
export const baseOf = (u) => safeDecodeURI(path.basename(toOriginal(u.split('?')[0]))).toLowerCase();

/**
 * Build a `localFor(src, key)` resolver over a downloaded-image manifest.
 * `section` is the folder under src/assets/images/ AND the segment in the emitted
 * relative path — content files live at src/content/<section>/<lang>/, which is three
 * levels deep, hence the '../../../'.
 */
export function makeImageResolver(images, section) {
  const byBase = new Map();
  for (const [url, entry] of Object.entries(images.byUrl)) byBase.set(baseOf(url), entry);

  return function localFor(src, key) {
    const entry = byBase.get(baseOf(src));
    if (!entry) return null;
    const abs = path.join(ROOT, entry.path);
    if (!existsSync(abs)) return null;
    return `../../../assets/images/${section}/` + path.posix.join(key, path.basename(entry.path));
  };
}

// ================================================================ alt text (COMPOSED)

// Legacy `alt` is empty on essentially every image in this migration, so there is
// nothing to transcribe. One deterministic formula, applied uniformly, so the strings
// can be reviewed as a RULE rather than one by one. A real caption, where the legacy
// post had one, is genuine copy and is used instead.
export function altFor(title, index, caption) {
  if (caption) return caption;
  return `${title} — photo ${index + 1}`;
}

// ================================================================ YAML

// Always single-quote and escape; titles contain ':', '#', emoji, and Thai.
export const yq = (s) => `'${String(s).replace(/'/g, "''")}'`;

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function frontmatter(fields, indent = '') {
  const lines = [];
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (!v.length) continue;
      lines.push(`${indent}${k}:`);
      for (const item of v) {
        if (typeof item === 'object') {
          const [first, ...rest] = Object.entries(item).filter(([, x]) => x !== undefined);
          lines.push(`${indent}  - ${first[0]}: ${typeof first[1] === 'number' ? first[1] : yq(first[1])}`);
          for (const [ik, iv] of rest) lines.push(`${indent}    ${ik}: ${typeof iv === 'number' ? iv : yq(iv)}`);
        } else {
          lines.push(`${indent}  - ${typeof item === 'number' ? item : yq(item)}`);
        }
      }
    } else if (isPlainObject(v)) {
      // Nested mapping (e.g. the blog batch's `provenance`). The events generator never
      // passes one, so this branch is additive and cannot change the events output.
      const nested = frontmatter(v, `${indent}  `);
      if (!nested) continue;
      lines.push(`${indent}${k}:`);
      lines.push(nested);
    } else if (typeof v === 'number') {
      lines.push(`${indent}${k}: ${v}`);
    } else {
      lines.push(`${indent}${k}: ${yq(v)}`);
    }
  }
  return lines.join('\n');
}
