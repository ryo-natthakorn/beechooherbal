// Step 9: turn inventory/rest-posts.json into src/content/events/{en,th}/*.md.
//
// Generated, not hand-typed, on purpose. CLAUDE.md §8 requires the legacy copy
// verbatim; a generator copying strings out of the REST snapshot IS verbatim, and is
// more trustworthy than re-keying 33 bilingual posts by hand. Everything it composes
// rather than copies is marked ⚠ below and in the emitted frontmatter.
//
// Re-runnable: rewrites every file from the snapshot. Hand edits to generated files
// WILL be lost — change the generator, or the snapshot, instead.
//
// What is COPIED verbatim:  title, excerpt, body paragraphs, image captions, dates.
// What is COMPOSED (⚠):     image alt text (legacy alt is empty on every image).
//
// Run: node inventory/scripts/09-generate-events.mjs   (npm run generate-events)

import { writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { invPath, safeDecodeURI, decodeEntities } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT_DIR = path.join(ROOT, 'src', 'content', 'events');
const IMG_ROOT = path.join(ROOT, 'src', 'assets', 'images', 'events');

const POSTS = JSON.parse(readFileSync(invPath('rest-posts.json'), 'utf8'));
const IMAGES = JSON.parse(readFileSync(invPath('events-images.json'), 'utf8'));

// --- outlet linkage -------------------------------------------------------
// Maps a pair key to a slug in OUTLETS (src/data/locations.ts) so a post announcing a
// branch can show that branch's CURRENT address/hours instead of freezing the 2018
// details into the post body. Every value below was checked against the real slug list
// in locations.ts, which locations-parity keeps in sync with the live site.
//
// Deliberately unmapped:
//   naan-charity, essence-shampoo   — not branch openings
//   saimai-krungthepkreetha         — announces TWO branches (Sai Mai AND Krungthep
//                                     Kreetha); Krungthep Kreetha is not in OUTLETS, so
//                                     linking only Sai Mai would misrepresent the post
const OUTLET_BY_KEY = {
  phutthamonthon: 'phutthamonthon',
  'chiang-mai': 'chiang-mai',
  'surat-thani': 'surat-thani',
  korat: 'korat',
  suksawat: 'suksawat',
  chatuchak: 'chatuchak',
  prawet: 'prawet',
  sammakorn: 'sammakorn',
  chonburi: 'chonburi',
  kallapaphruk: 'kallapaphruk',
  'thecrystalparkekamai-ramindra': 'the-crystal',
  'siam-grand-opening': 'siam-square',
  'siam-square-make-merit': 'siam-square',
  udomsuk: 'udomsuk',
  ratchada: 'ratchada',
};

// --- HTML -> text ---------------------------------------------------------

const stripTags = (s) => s.replace(/<[^>]+>/g, '');

// Legacy copy runs through this on its way into Markdown. Entities are decoded (the
// build re-escapes as needed) and NBSP is folded to a normal space, matching what
// 06-copy-parity.mjs's norm() does — otherwise a stray U+00A0 reads as a missing
// fragment. Emoji are left strictly alone: they are page copy here (💚🌿 📍) and
// dropping them would fail parity.
function text(html) {
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
const mdEscape = (s) => s.replace(/^(\s*)([#>\-+*]|\d+[.)])(\s)/gm, "$1\\$2$3");

// Walk the post body in document order, emitting paragraphs and image references as
// they appear. Order matters: a caption is the paragraph that FOLLOWS its image.
//
// Images are frequently nested INSIDE the text container (`<p><img …></p>` — that is
// how the 2018 galleries are marked up, 20 images in a single <p>). So a container's
// inner HTML is split on <img> and the pieces emitted in order, rather than the
// container being treated as an opaque text block — doing the latter stripped the
// images to nothing and silently produced empty galleries.
function pushImg(out, tag) {
  const src = tag.match(/\ssrc\s*=\s*"([^"]+)"/i)?.[1];
  if (src) out.push({ type: 'img', src: src.split('?')[0] });
}

// YouTube ids from <iframe> embeds. These posts are mostly photo galleries, but two
// of them (the Siam Square merit ceremony, EN and TH) embed a video, and dropping it
// lost real content — copy-parity's separate embed-id check caught it.
const YT_RE = /(?:youtube(?:-nocookie)?\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

// Splits on BOTH <img> and <iframe>. Media is routinely nested inside the text
// container on these posts (`<p><img ...></p>`, `<p><iframe ...></iframe></p>`), and the
// paragraph regex matches the wrapper first, so anything not split out here is stripped
// to nothing and silently lost. That cost the 2018 galleries their photos and the Siam
// Square merit post its video before copy-parity caught both.
function emitInner(out, inner, tag) {
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

function blocks(html) {
  const out = [];
  // `figcaption` is in this list because that is where WordPress puts real image
  // captions ("Special Promotion Available at Bee Choo Sammakorn"). Omitting it
  // dropped seven captions across the batch.
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

// --- image resolution -----------------------------------------------------

// The fetch script normalised URLs (stripped WP's -WxH suffix) before saving, and
// recorded the mapping in events-images.json. Resolve a body <img> src back to the
// local file through that manifest, matching on basename so a resized variant in the
// body still finds the original that was downloaded.
const toOriginal = (u) => u.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, '');
const baseOf = (u) => safeDecodeURI(path.basename(toOriginal(u.split('?')[0]))).toLowerCase();

const byBase = new Map();
for (const [url, entry] of Object.entries(IMAGES.byUrl)) {
  byBase.set(baseOf(url), entry);
}

function localFor(src, pairKey) {
  const entry = byBase.get(baseOf(src));
  if (!entry) return null;
  // Content files live in src/content/events/<lang>/; images in src/assets/images/events/<key>/.
  const abs = path.join(ROOT, entry.path);
  if (!existsSync(abs)) return null;
  return '../../../assets/images/events/' + path.posix.join(pairKey, path.basename(entry.path));
}

// --- alt text (⚠ COMPOSED) ------------------------------------------------
// Every legacy image on these posts has an EMPTY alt attribute, so there is nothing to
// transcribe. One deterministic formula, applied uniformly, so the ~173 strings can be
// reviewed as a rule rather than one by one: "<post title>, photo N".
// A caption, where the legacy post had one, is real copy and is used instead.
function altFor(title, index, caption) {
  if (caption) return caption;
  return `${title} — photo ${index + 1}`;
}

// --- YAML -----------------------------------------------------------------

// Always single-quote and escape; titles contain ':', '#', emoji, and Thai.
const yq = (s) => `'${String(s).replace(/'/g, "''")}'`;

function frontmatter(fields) {
  const lines = [];
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (!v.length) continue;
      lines.push(`${k}:`);
      for (const item of v) {
        if (typeof item === 'object') {
          const [first, ...rest] = Object.entries(item).filter(([, x]) => x !== undefined);
          lines.push(`  - ${first[0]}: ${typeof first[1] === 'number' ? first[1] : yq(first[1])}`);
          for (const [ik, iv] of rest) lines.push(`    ${ik}: ${typeof iv === 'number' ? iv : yq(iv)}`);
        } else {
          lines.push(`  - ${typeof item === 'number' ? item : yq(item)}`);
        }
      }
    } else if (typeof v === 'number') {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${yq(v)}`);
    }
  }
  return lines.join('\n');
}

// --- pair key (mirrors 08-fetch-posts.mjs) --------------------------------
const BRANCHES = [
  ['phutthamonthon', 'พุทธมณฑล'], ['chiang-mai', 'เชียงใหม่'], ['surat-thani', 'สุราษฎร์'],
  ['korat', 'โคราช'], ['suksawat', 'สุขสวัสดิ์'], ['chatuchak', 'จตุจักร'], ['prawet', 'ประเวศ'],
  ['sammakorn', 'สัมมากร'], ['thecrystalparkekamai-ramindra', 'เดอะคริสตัล'], ['chonburi', 'ชลบุรี'],
  ['saimai-krungthepkreetha', null], ['ratchada', null], ['kallapaphruk', 'กัลปพฤกษ์'],
  ['naan-charity', 'ช่วยเหลือ'], ['essence-shampoo', 'essence'], ['udomsuk', 'อุดมสุข'],
  ['siam-square-make-merit', 'ทำบุญ'], ['siam-grand-opening', 'สยามสแควร์'],
];
function pairKeyFor(post, variant) {
  const slug = safeDecodeURI(post.slug || '').toLowerCase();
  const title = (post.title?.rendered || '').toLowerCase();
  const hay = variant === 'en' ? `${slug} ${title}` : title;
  for (const [en, th] of BRANCHES) {
    if (hay.includes(en) || (th && hay.includes(th.toLowerCase()))) return en;
  }
  return `unmatched-${post.id}`;
}

// --- main -----------------------------------------------------------------

function build(post, variant) {
  const pairKey = pairKeyFor(post, variant);
  const title = text(post.title?.rendered || '');
  const excerpt = text(post.excerpt?.rendered || '');
  const body = blocks(post.content?.rendered || '');

  const featuredUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const heroPath = featuredUrl ? localFor(featuredUrl, pairKey) : null;

  // These posts open with a photo, then run prose, then a photo run — so "prose is
  // whatever precedes the first image" loses the entire body. Instead: walk in
  // document order, treat a SHORT paragraph immediately following an image as that
  // image's caption, and keep every other text block as prose regardless of position.
  // The hero is pulled out of the gallery wherever it appears so it is not shown twice;
  // if it carried a caption, that caption becomes the hero's alt (it is real copy and
  // must not be dropped — copy-parity would flag it).
  const prose = [];
  const gallery = [];
  const videos = [];
  let heroCaption;
  for (let i = 0; i < body.length; i++) {
    const b = body[i];
    if (b.type === 'video') {
      if (!videos.includes(b.id)) videos.push(b.id);
      continue;
    }
    if (b.type !== 'img') {
      prose.push(b);
      continue;
    }
    const local = localFor(b.src, pairKey);
    if (!local) continue;

    // A <figcaption> always belongs to its image, however long. A plain paragraph is
    // only treated as a caption when it is short enough to plausibly be one — the
    // legacy posts caption photos both ways.
    const next = body[i + 1];
    const isCaption =
      next && next.type === 'text' && (next.tag === 'figcaption' || next.text.length < 120);
    const caption = isCaption ? next.text : undefined;
    if (caption) i++; // consume it — it belongs to this image, not to the prose

    if (heroPath && local === heroPath) {
      if (caption) heroCaption = caption;
      continue; // never repeat the hero in the gallery
    }
    gallery.push({ src: local, alt: altFor(title, gallery.length, caption), caption });
  }

  const fm = frontmatter({
    lang: variant,
    slug: safeDecodeURI(post.slug || ''),
    title,
    excerpt,
    pubDate: post.date,
    modDate: post.modified !== post.date ? post.modified : undefined,
    hero: heroPath ?? undefined,
    // Legacy caption where there was one, else the bare title. ⚠ composed either way
    // in the sense that the legacy alt attribute was empty.
    heroAlt: heroPath ? heroCaption ?? title : undefined,
    gallery,
    videos,
    outlet: OUTLET_BY_KEY[pairKey],
    wpId: post.id,
    wpCategories: post.categories || [],
  });

  const markdown = prose.map((b) => mdEscape(b.text)).join('\n\n');
  return {
    pairKey,
    file: path.join(OUT_DIR, variant, `${pairKey}.md`),
    contents: `---\n${fm}\n---\n\n${markdown}\n`,
    stats: { prose: prose.length, gallery: gallery.length, hero: Boolean(heroPath) },
  };
}

function main() {
  const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];

  if (!only && existsSync(OUT_DIR)) {
    // Full regeneration: clear first, so a post removed upstream cannot linger.
    for (const lang of ['en', 'th']) {
      const dir = path.join(OUT_DIR, lang);
      if (existsSync(dir)) for (const f of readdirSync(dir)) rmSync(path.join(dir, f));
    }
  }

  let written = 0;
  const missingHero = [];
  for (const variant of ['en', 'th']) {
    mkdirSync(path.join(OUT_DIR, variant), { recursive: true });
    for (const post of POSTS.variants[variant]) {
      const built = build(post, variant);
      if (only && built.pairKey !== only) continue;
      writeFileSync(built.file, built.contents);
      written++;
      if (!built.stats.hero) missingHero.push(`${variant}/${built.pairKey}`);
      console.log(
        `  ${variant}/${built.pairKey}.md  ${built.stats.prose} para, ` +
          `${built.stats.gallery} gallery${built.stats.hero ? '' : ', NO HERO'}`,
      );
    }
  }
  console.log(`\nwrote ${written} file(s) to ${path.relative(ROOT, OUT_DIR)}`);
  if (missingHero.length) console.log(`no featured image: ${missingHero.join(', ')}`);
}

main();
