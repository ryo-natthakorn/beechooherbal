// inventory/scripts/06-copy-parity.mjs
// Does the BUILT site still contain every word the legacy site had?
//
// Run:  npm run build && node inventory/scripts/06-copy-parity.mjs
//
// The single biggest risk on this migration is silently dropping indexed copy: a typo in
// a `sectionOrder`, a paragraph missed while transcribing, a "shared" constant copied
// onto a page that words it differently. None of those break the build. This turns that
// worry into a command.
//
// Method: reduce each legacy page's WP-REST HTML to text fragments, reduce the matching
// built page to one normalised string, and report any legacy fragment that is not a
// substring of it. Substring rather than line equality on purpose — the build
// deliberately joins some multi-paragraph legacy blocks into a single string (e.g. an
// FAQ answer that the legacy page split across four <p>s), and a line-equality check
// would flag every one of those as missing.
//
// Normalisation folds case, whitespace, HTML entities and typographic punctuation, so
// the documented ALL-CAPS -> Title Case heading pass and curly/straight quote
// differences don't register as content loss. Anything the build drops ON PURPOSE has to
// be named in SKIP below, with a reason — that list is the audit trail.
//
// Also checks video/GIF EMBEDS separately (legacyVideoIds below) — carries no text, so
// legacyFragments can't see it. Added after damaged-hair shipped with two videos
// silently missing: they're Elementor `video` widgets (URL in a data-settings JSON
// attribute), not plain <iframe> tags, which the original extraction never matched.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REST = JSON.parse(readFileSync(join(ROOT, "inventory", "rest-pages.json"), "utf8"));

/** Built page <-> legacy page, per language. Thai dist dirs are the decoded slug. */
const PAGES = [
  ["hair-loss", "/scalp-hair-loss-treatment-salon-clinic-in-bangkok/", "ซาลอน-คลินิกรักษาผมร่วง"],
  ["oily-scalp", "/herbal-treatment-to-get-rid-of-oily-scalp-hair/", "วิธีแก้หนังศีรษะมัน"],
  ["grey-hair", "/reverse-premature-grey-white-hair-by-herbal-treatment/", "ปิดผมหงอกวิธีธรรมชาติ"],
  ["dandruff", "/cure-dandruff-hair-with-herbal-treatment/", "รักษารังแค-ขจัดรังแค-ให้"],
  ["damaged-hair", "/repair-chemically-damaged-dry-hair-with-herbal-treatment/", "แก้ผมเสียเร่งด่วน"],
  ["bacterial-infection", "/herbal-treatment-cure-for-bacteria-infection-alopecia-areata-and-other-hair-diseases/", "หนังศีรษะติดเชื้อ"],
  ["postpartum", "/postpartum-hair-loss-treatment-in-thailand/", "ภาวะผมร่วงเฉียบพลันของ"],
  // Not a treatment page, but the same verbatim-copy risk applies — generalizes cleanly
  // since this script keys off slug/URL, not the treatment content model.
  ["about", "/about/", "เกี่ยวกับบีชู"],
  ["team", "/team/", "ทีม"],
  ["reviews", "/reviews-and-testimonials-of-bee-choo-origin-treatment/", "รีวิวทรีทเม้นท์ที่ดี"],
  ["products", "/bee-choo-hair-care-products/", "แชมพูบีชูป้องกันผมร่วง"],
];

/**
 * Legacy fragments the build drops deliberately. Each entry needs a reason — an
 * unexplained skip here is indistinguishable from a bug this script exists to catch.
 */
const SKIP = [
  // --- WordPress/Elementor chrome and social widget labels, never page copy ---
  [/^(facebook|facebook-f|youtube|yelp|instagram|tiktok|line)$/i, "social widget labels, not copy"],
  [/^(read more|prev|next|search|menu|home)$/i, "WP navigation chrome"],
  // --- Legacy CTAs, replaced by our own Facebook/LINE/Find-a-Branch set (CLAUDE.md §2) ---
  [/^(call us today|talk to us on facebook!?|พูดคุยกับเราผ่านเฟสบุ๊ค)$/i, "legacy CTA button, replaced by our CTA set"],
  // --- The hero strapline, hard-coded in TreatmentHero.astro rather than per page ---
  [/^100% natural herbal hair treatment, safe/i, "strapline lives in TreatmentHero.astro"],
  [/^(การรักษาผมด้วยสมุนไพร|ทรีตเมนต์จากสมุนไพร)ธรรมชาติ 100/, "strapline lives in TreatmentHero.astro"],
  // --- Media the build renders as components/assets rather than legacy markup ---
  [/via giphy/i, "GIPHY attribution chrome on the embed, not page copy"],
  [/^reference:?$/i, "label folded into the citation string it introduces"],
  [/^แหล่งข้อมูลจาก$/, "label folded into the citation string it introduces"],
  // --- Known, documented transcription deviations (see treatment-pages.ts header) ---
  [/are above 40 \./i, "legacy stray space before the full stop; see file header"],
  [/^if you are prone to scratching/i, "sentence joined mid-answer; see file header"],
  // grey-hair's two before/after captions. Ryo asked (2026-08-20) for the "after"
  // caption to fit on one line, which the legacy wording does not; the pair was then
  // shortened together so they stay symmetrical. Captions on that page are our own
  // presentation choice — the legacy claim itself still renders, in `body` and in the
  // images' `alt`. dandruff, which had no such instruction, keeps its legacy captions.
  [/^white hairs? (before|covered|gone)/i, "grey-hair captions shortened on request; claim still in body + alt"],
  // --- Team page: "(left)"/"(center)" dropped, see src/data/team.ts's header ---
  [/^mr\. rick, lim ting feng \(left\) director$/i, "positional caption for a group photo that turned out to be two unrelated photos, not one — see team.ts header"],
  [/^mr\. crispin w\. francis \(center\) director$/i, "positional caption for a group photo that turned out to be two unrelated photos, not one — see team.ts header"],
  // --- Reviews page: legacy typos/artefacts, and deliberate gallery curation ---
  [/^trixie - recovering from a bacterial infection.$/i, "legacy heading carries a trailing zero-width space (WordPress editing artefact); dropped, not real content"],
  [/^คุณพิศมัย - ผมร่วงและผมบางลดลง.$/, "legacy heading carries a trailing zero-width space (WordPress editing artefact); dropped, not real content"],
  [/^2017-05-23 \(top\) photo 2: trixie when she first visited bee choo ladies$/i, "adjacent-image lightbox-title + alt text concatenated with no separator in source; both pieces are transcribed separately in reviews.ts"],
  [/^2018-10-13 side3 hair scan of trixie showing broken hairs\.$/i, "adjacent-image lightbox-title + alt text concatenated with no separator in source; both pieces are transcribed separately in reviews.ts"],
  [
    /^2017-05-23 \(top\) 2017-07-08 \(top\) 2017-07-08 2017-08-19 \(1\) 2017-12-23 2017-05-31 2017-07-22 2017-09-15$/i,
    "legacy EN gallery has 8 photos; ours shows the same 4 dated milestones TH uses (deliberate curation, not a content drop — flagged as an open item to expand if Crispin wants full EN parity)",
  ],
  // Ryo asked (2026-08-21) to remove Trixie's zoomed hair-follicle scan photo entirely
  // (the "2018-10-13 side3" image referenced above) — its alt text is gone with it.
  [/^hair scan of trixie showing broken hairs\.$/i, "scan photo removed from the page on request; not a content drop"],
];

const decode = (s) =>
  s
    // Numeric entities first, and generically: the two sides escape different things.
    // Astro emits &#38; inside attributes where WordPress emits &amp; in body text, so a
    // hand-listed table missed alt/caption text containing "&" (e.g. dandruff's
    // "Hair & Scalp Analysis") and reported it as dropped copy.
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#8217;|&#039;|&#39;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8211;|&#8212;/g, "-")
    .replace(/&#8230;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/** Fold everything that is presentation rather than content. */
const norm = (s) =>
  decode(s)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/**
 * The form actually compared: normalised, then ALL whitespace removed.
 *
 * Whitespace is the one thing that legitimately differs between the two sides and never
 * carries meaning here. Stripping a tag leaves a space where the legacy had none (the
 * founder paragraph's inline <a>s are the worst case, and Elementor's own <br>-separated
 * text-editor blobs are the other), so a space-sensitive compare reported whole
 * paragraphs as "missing" that were present character-for-character. It also makes Thai
 * — which does not use inter-word spaces at all — behave the same as English.
 * The trade is a slightly weaker check (two adjacent fragments can now satisfy one
 * legacy fragment), which errs toward silence rather than false alarms. Acceptable: the
 * question this answers is "did we DROP anything", not "is the markup identical".
 */
const key = (s) => norm(s).replace(/\s+/g, "");

/** Legacy HTML -> the text fragments a reader would actually see. */
function legacyFragments(html) {
  const out = [];
  const re =
    /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>|<a[^>]*elementor-toggle-title[^>]*>([\s\S]*?)<\/a>|<div[^>]*elementor-toggle-title[^>]*>([\s\S]*?)<\/div>|<p[^>]*>([\s\S]*?)<\/p>|<li[^>]*>([\s\S]*?)<\/li>/g;
  let m;
  while ((m = re.exec(html))) {
    const text = norm((m[2] ?? m[3] ?? m[4] ?? m[5] ?? m[6] ?? "").replace(/<[^>]+>/g, " "));
    // One-word fragments carry no evidence either way and are almost all chrome.
    if (text.split(" ").length > 2) out.push(text);
  }
  // Elementor text-editor widgets hold prose in bare divs with no <p> at all (this is
  // what an earlier heading-only scan of these pages missed). Sweep those separately.
  // Split on headings as well as line breaks: these blobs interleave <h3> sub-headings
  // with their prose, and the build re-renders that as an accordion whose summary and
  // body are separated by a "+" glyph. A chunk spanning a heading boundary therefore
  // never appears contiguously in the build even when every word of it is present.
  // Also split on bare <div>...</div> paragraphs (the Reviews page mixes a real <p> for
  // one line with a plain <div> for the next, inside the same widget-container) — without
  // this, the two get concatenated into one fragment that never appears contiguously in
  // the build even though both halves are individually transcribed.
  const editors = html.matchAll(/<div class="elementor-widget-container">([\s\S]*?)<\/div>\s*<\/div>/g);
  for (const e of editors) {
    for (const chunk of e[1].split(/<br\s*\/?>|<\/p>|<h[1-6][^>]*>|<\/h[1-6]>|<div[^>]*>|<\/div>|\n\s*\n/)) {
      const text = norm(chunk.replace(/<[^>]+>/g, " "));
      if (text.split(" ").length > 6) out.push(text);
    }
  }
  return [...new Set(out)];
}

const rest = (variant, fragment) =>
  REST.variants[variant].find((p) => decodeURIComponent(p.link || "").includes(fragment));

/**
 * Legacy YouTube/GIPHY video ids, from every embed SHAPE the legacy pages use.
 *
 * Added 2026-08-20 after damaged-hair shipped with two videos silently missing: its
 * legacy page embeds them via Elementor's `video` widget, which stores the URL inside a
 * `data-settings` JSON attribute rather than a plain `<iframe src>`. The original
 * extraction pass only ever looked for `<iframe>` tags (see legacyFragments' history and
 * the transcription notes in treatment-pages.ts), so that page's videos were never
 * flagged as missing — this check exists specifically to catch that class of gap, since
 * `legacyFragments` above only reasons about TEXT and a video carries none.
 */
function legacyVideoIds(html) {
  const ids = new Set();
  for (const m of html.matchAll(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/g)) ids.add(m[1]);
  for (const m of html.matchAll(/giphy\.com\/embed\/([A-Za-z0-9]+)/g)) ids.add(m[1]);
  // Elementor `video` widgets: URL lives inside a JSON blob in `data-settings`, HTML- and
  // backslash-escaped, so it never matches the plain-iframe patterns above.
  for (const m of html.matchAll(/elementor-widget-video[\s\S]{0,600}?data-settings="([^"]+)"/g)) {
    const decoded = m[1].replace(/&quot;/g, '"').replace(/&#038;/g, "&");
    try {
      const url = JSON.parse(decoded).youtube_url ?? "";
      const idMatch = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      if (idMatch) ids.add(idMatch[1]);
    } catch {
      /* malformed widget settings on the legacy page — nothing to extract */
    }
  }
  return ids;
}

let checked = 0;
let missingTotal = 0;
const pending = [];
const report = [];

for (const [slug, enPath, thSlug] of PAGES) {
  for (const [lang, distPath, legacy] of [
    ["en", join(ROOT, "dist", enPath.replace(/^\/|\/$/g, ""), "index.html"), rest("en", enPath)],
    ["th", join(ROOT, "dist", "th", thSlug, "index.html"), rest("th", thSlug)],
  ]) {
    // Not every treatment page is built yet. That is a schedule fact, not a parity
    // failure, so it is listed and does not affect the exit code.
    if (!existsSync(distPath)) {
      pending.push(`${slug} ${lang.toUpperCase()}`);
      continue;
    }
    if (!legacy) {
      report.push(`  - ${slug} ${lang.toUpperCase()}: no legacy page in rest-pages.json`);
      continue;
    }
    checked++;
    // alt/title attribute values count as page copy — they are what a screen reader
    // announces and what Google reads for an image — but they live INSIDE tags, so
    // stripping markup would discard them and report legacy image captions we faithfully
    // carried across as "missing". Hoist them out before the strip.
    const html = readFileSync(distPath, "utf8").replace(/<script[\s\S]*?<\/script>/g, " ");
    const attrs = [...html.matchAll(/\b(?:alt|title)="([^"]*)"/g)].map((m) => m[1]).join(" ");
    const built = key(`${html.replace(/<[^>]+>/g, " ")} ${attrs}`);
    const missing = legacyFragments(legacy.content.rendered || legacy.content).filter(
      (frag) => !built.includes(key(frag)) && !SKIP.some(([re]) => re.test(frag)),
    );
    if (missing.length) {
      missingTotal += missing.length;
      report.push(`\n  ${slug} ${lang.toUpperCase()} — ${missing.length} legacy fragment(s) not found in the build:`);
      for (const frag of missing) report.push(`    · ${frag.slice(0, 150)}${frag.length > 150 ? "…" : ""}`);
    }

    // Video/GIF ids are checked as plain substrings of the raw built HTML (not `built`,
    // which is text-only and has the id's surrounding markup stripped) — the id itself
    // is what has to survive, wherever it lands (iframe src, or the click-to-load
    // facade's data-yt-id attribute).
    const missingVideos = [...legacyVideoIds(legacy.content.rendered || legacy.content)].filter((id) => !html.includes(id));
    if (missingVideos.length) {
      missingTotal += missingVideos.length;
      report.push(`\n  ${slug} ${lang.toUpperCase()} — ${missingVideos.length} legacy video/GIF id(s) not found in the build: ${missingVideos.join(", ")}`);
    }
  }
}

console.log(`copy parity: ${checked} built page(s) checked against inventory/rest-pages.json`);
if (pending.length) console.log(`not built yet (not a failure): ${pending.join(", ")}`);
if (report.length) console.log(report.join("\n"));
if (missingTotal === 0) {
  console.log("OK — every legacy fragment is present in the built pages.");
} else {
  console.log(`\nFAIL — ${missingTotal} legacy fragment(s) missing. Either transcribe them, or add a SKIP entry with a reason.`);
  process.exitCode = 1;
}
