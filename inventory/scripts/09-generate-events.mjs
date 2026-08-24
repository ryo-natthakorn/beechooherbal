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
import { readFileSync } from 'node:fs';
import { invPath, safeDecodeURI } from './lib.mjs';
// HTML -> Markdown extraction lives in lib-posts.mjs so the blog generator shares it
// rather than copying it. Five silent-content-drop fixes live in there; see its header.
import {
  ROOT,
  text,
  mdEscape,
  blocks,
  makeImageResolver,
  altFor,
  frontmatter,
} from './lib-posts.mjs';

const OUT_DIR = path.join(ROOT, 'src', 'content', 'events');

const POSTS = JSON.parse(readFileSync(invPath('rest-posts.json'), 'utf8'));
const IMAGES = JSON.parse(readFileSync(invPath('events-images.json'), 'utf8'));

// Resolves a body <img> src back to its downloaded local file via the manifest,
// matching on basename so a resized variant still finds the original. 'events' is both
// the folder under src/assets/images/ and the segment in the emitted relative path.
const localFor = makeImageResolver(IMAGES, 'events');

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
