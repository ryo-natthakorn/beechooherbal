// Step 12: turn the blog snapshots into src/content/blog/{en,th}/*.md.
//
// Sibling of 09-generate-events.mjs. Both drive the shared extraction in lib-posts.mjs,
// so the five silent-content-drop fixes that copy-parity caught on the events batch are
// fixed once, for both sections. See that file's header.
//
// Reads TWO snapshots:
//   inventory/rest-posts-blog.json     — 20 posts from the live REST API (11-fetch-blog)
//   inventory/rest-posts-wayback.json  — post 1530, whose body only survives in a 2022
//                                        web capture (13-fetch-wayback)
// Merging them here means the Wayback post goes through the SAME generator, schema and
// copy-parity path as every other one; only its `provenance` marks it apart.
//
// ── THE ONE REAL DIVERGENCE FROM 09 ─────────────────────────────────────────────
// Images stay INLINE in the Markdown body, in document order. 09 hoists them into a
// frontmatter `gallery` so an event post can close with a photo grid — right for an
// announcement, wrong for a 39-paragraph article with diagrams mid-text, where hoisting
// would dump every illustration at the bottom and sever the image/text relationship.
// Relative Markdown images still go through Astro's asset pipeline, so they are
// optimised and dimensioned; styling lives on the <Content /> wrapper in BlogPost.astro.
//
// Re-runnable: rewrites every file from the snapshots. Hand edits WILL be lost — change
// the generator or the snapshot instead.
//
// Run: node inventory/scripts/12-generate-blog.mjs   (npm run generate-blog)

import { writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { invPath, safeDecodeURI } from './lib.mjs';
import { ROOT, text, mdEscape, blocks, makeImageResolver, altFor, frontmatter, elementorVideoIds } from './lib-posts.mjs';
import { keyFor, EXPECT } from './blog-keys.mjs';

const OUT_DIR = path.join(ROOT, 'src', 'content', 'blog');

const readJson = (f) => JSON.parse(readFileSync(invPath(f), 'utf8'));

const BLOG = readJson('rest-posts-blog.json');
const WAYBACK = existsSync(invPath('rest-posts-wayback.json')) ? readJson('rest-posts-wayback.json') : null;

// Both fetchers write their own image manifest; merge them into one lookup.
const mergedImages = { byUrl: {}, byPost: {} };
for (const f of ['blog-images.json', 'wayback-images.json']) {
  if (!existsSync(invPath(f))) continue;
  const m = readJson(f);
  Object.assign(mergedImages.byUrl, m.byUrl);
  Object.assign(mergedImages.byPost, m.byPost);
}
// byPost is what scopes a lookup to the post asking for it. Two blog posts each carry an
// image basenamed `caption.jpg`, and another pair share `img-9884.jpg`; without the
// scoping they resolve to whichever was downloaded last.
const localFor = makeImageResolver(mergedImages, mergedImages.byPost);

// The dead WPML term. A post carrying it while sitting in the EN bucket is the
// 12-best-family-places anomaly: English copy filed on a Thai term.
const DEAD_TH_TERM = 7;

// ---------------------------------------------------------------- assembly

/** Markdown alt text cannot carry an unescaped `]`. */
const mdAlt = (s) => String(s).replace(/\]/g, '\\]');

function build(post, variant, provenance) {
  const key = keyFor(post.id);
  const title = text(post.title?.rendered || '');
  const excerpt = text(post.excerpt?.rendered || '');
  const metaDescription = text(post.yoast_head_json?.description || '') || undefined;
  // keepLinks: blog articles cite sources and link out constantly (192 links across the
  // corpus). Without this the destinations are stripped and only the label survives.
  const body = blocks(post.content?.rendered || '', { keepLinks: true });

  const featuredUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const heroPath = featuredUrl ? localFor(featuredUrl, key) : null;

  // Walk in document order. Text becomes a paragraph; an image becomes an inline
  // Markdown image; a SHORT text block immediately following an image (or any
  // <figcaption>) is that image's caption and is emitted as emphasis beneath it — the
  // caption is real legacy copy, so it must stay in the DOM for copy-parity.
  const lines = [];
  const videos = [];
  let photoN = 0;
  let missingImages = 0;

  for (let i = 0; i < body.length; i++) {
    const b = body[i];

    if (b.type === 'video') {
      if (!videos.includes(b.id)) videos.push(b.id);
      continue;
    }

    if (b.type === 'text') {
      lines.push(mdEscape(b.text));
      continue;
    }

    // b.type === 'img'
    const local = localFor(b.src, key);
    const next = body[i + 1];
    const isCaption = next && next.type === 'text' && (next.tag === 'figcaption' || next.text.length < 120);
    const caption = isCaption ? next.text : undefined;

    if (!local) {
      // The image 404s on the origin or is an external hotlink now serving HTML — all
      // of which are ALREADY broken on the live site (see src/data/blog.ts's header).
      // Drop the image but KEEP any caption as prose: it is legacy copy either way.
      missingImages++;
      if (caption) {
        lines.push(mdEscape(caption));
        i++;
      }
      continue;
    }
    if (caption) i++; // consumed — belongs to this image, not to the prose

    if (heroPath && local === heroPath) continue; // never repeat the hero in the body

    lines.push(`![${mdAlt(caption ?? altFor(title, photoN++, undefined))}](${local})`);
    if (caption) lines.push(`*${caption}*`);
  }

  // Elementor `video` widgets keep their URL in a data-settings JSON blob, so blocks()
  // cannot see them (it walks p/h/li/figcaption/img/iframe; the widget is a bare <div>).
  // Same shape that once shipped a treatment page with two videos silently missing.
  for (const id of elementorVideoIds(post.content?.rendered || '')) {
    if (!videos.includes(id)) videos.push(id);
  }

  const fm = frontmatter({
    lang: variant,
    slug: safeDecodeURI(post.slug || ''),
    title,
    excerpt,
    metaDescription,
    pubDate: post.date,
    modDate: post.modified !== post.date ? post.modified : undefined,
    hero: heroPath ?? undefined,
    heroAlt: heroPath ? title : undefined,
    videos,
    // Only emitted where WPML disagrees with the language the copy is actually in.
    wpLang: variant === 'en' && (post.categories || []).includes(DEAD_TH_TERM) ? 'th' : undefined,
    provenance,
    wpId: post.id,
    wpCategories: post.categories || [],
  });

  return {
    key,
    variant,
    file: path.join(OUT_DIR, variant, `${key}.md`),
    contents: `---\n${fm}\n---\n\n${lines.join('\n\n')}\n`,
    stats: { paras: lines.filter((l) => !l.startsWith('![')).length, imgs: photoN, missingImages, hero: Boolean(heroPath) },
  };
}

// ---------------------------------------------------------------- main

function main() {
  const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];

  if (!only && existsSync(OUT_DIR)) {
    for (const lang of ['en', 'th']) {
      const dir = path.join(OUT_DIR, lang);
      if (existsSync(dir)) for (const f of readdirSync(dir)) rmSync(path.join(dir, f));
    }
  }

  // The Wayback post is tagged with its real provenance; everything else defaults.
  const sources = [
    { snapshot: BLOG, provenance: undefined },
    WAYBACK && {
      snapshot: WAYBACK,
      provenance: {
        source: 'wayback',
        capturedAt: WAYBACK.provenance.capturedAt,
        url: WAYBACK.provenance.capture,
        note: WAYBACK.provenance.warning,
      },
    },
  ].filter(Boolean);

  let written = 0;
  const noHero = [];
  const missing = [];
  const seenKeys = new Map();

  for (const lang of ['en', 'th']) mkdirSync(path.join(OUT_DIR, lang), { recursive: true });

  for (const { snapshot, provenance } of sources) {
    for (const variant of ['en', 'th']) {
      for (const post of snapshot.variants[variant]) {
        const built = build(post, variant, provenance);
        if (only && built.key !== only) continue;

        // Two posts in the SAME language must never share a key — that would silently
        // overwrite one with the other. (Sharing across languages IS the pair signal.)
        const dupeKey = `${variant}/${built.key}`;
        if (seenKeys.has(dupeKey)) {
          throw new Error(
            `Key collision: wpId ${post.id} and ${seenKeys.get(dupeKey)} both map to ` +
              `${dupeKey}. Fix KEY_BY_WPID in blog-keys.mjs.`,
          );
        }
        seenKeys.set(dupeKey, post.id);

        writeFileSync(built.file, built.contents);
        written++;
        if (!built.stats.hero) noHero.push(dupeKey);
        if (built.stats.missingImages) missing.push(`${dupeKey} (${built.stats.missingImages})`);
        console.log(
          `  ${variant}/${built.key}.md  ${built.stats.paras} para, ${built.stats.imgs} inline img` +
            `${built.stats.hero ? '' : ', NO HERO'}${built.stats.missingImages ? `, ${built.stats.missingImages} img MISSING upstream` : ''}` +
            `${provenance ? '  [WAYBACK]' : ''}`,
        );
      }
    }
  }

  console.log(`\nwrote ${written} file(s) to ${path.relative(ROOT, OUT_DIR)}`);
  if (noHero.length) console.log(`no featured image: ${noHero.join(', ')}`);
  if (missing.length) {
    console.log(`\nimages referenced but unavailable upstream (already broken on the live site):`);
    console.log(`  ${missing.join(', ')}`);
  }
  if (!only && written !== EXPECT.posts) {
    console.log(`\nWARNING: wrote ${written} files, expected ${EXPECT.posts}.`);
    process.exitCode = 1;
  }
}

main();
