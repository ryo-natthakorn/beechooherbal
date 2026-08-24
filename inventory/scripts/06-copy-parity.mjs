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
  ["faq", "/frequently-asked-questions/", "คำถามที่พบบ่อย"],
  ["herbal-vs-transplant", "/hair-transplant-vs-stem-cell-vs-keratin-treatment-vs-natural-herbal-treatment/", "สมุนไพร-vs-การปลูกผม"],
  ["treatment-cost", "/hair-loss-treatment-cost-in-thailand-prices-revealed/", "ราคาการทำทรีทเม้นท์"],
  // The index page's legacy fragments are its <h1> plus the 6 card titles and 6 card
  // excerpts its (6-capped) Elementor feed rendered. Our index shows all 18/15 posts and
  // renders each card's excerpt as the verbatim WP excerpt.rendered, so those fragments
  // appear naturally — no SKIP group was needed for it.
  ["events", "/events-news-release/", "เหตุการณ์และข่าว"],
];

/**
 * Individual POSTS are checked against the post snapshots rather than rest-pages.json,
 * and against TWO FULL ROOT PATHS rather than PAGES' `dist/th/<thSlug>/` convention —
 * both languages' posts are served from the root. The list is derived from the snapshots,
 * never hand-kept, so it cannot drift from the posts actually built.
 *
 * Three post snapshots, each written by its own fetcher:
 *   rest-posts.json          events   — 08-fetch-posts.mjs
 *   rest-posts-blog.json     blog     — 11-fetch-blog.mjs
 *   rest-posts-wayback.json  blog     — 13-fetch-wayback.mjs, for the ONE post whose
 *                                       REST endpoint and HTML page both return 500.
 *                                       Checked against the frozen 2022 capture, which
 *                                       is the only source of truth that exists for it.
 *                                       That is strictly better than skipping it: a
 *                                       transcription slip in a 2,900-word article is
 *                                       exactly what this script catches.
 * Any that are absent are skipped, so the gate stays green for anyone who has not run
 * every fetcher.
 */
const SNAPSHOT_FILES = ["rest-posts.json", "rest-posts-blog.json", "rest-posts-wayback.json"];
const REST_POSTS = (() => {
  const merged = { variants: { en: [], th: [] }, files: [] };
  for (const f of SNAPSHOT_FILES) {
    const p = join(ROOT, "inventory", f);
    if (!existsSync(p)) continue;
    const snap = JSON.parse(readFileSync(p, "utf8"));
    merged.variants.en.push(...(snap.variants?.en ?? []));
    merged.variants.th.push(...(snap.variants?.th ?? []));
    merged.files.push(f);
  }
  return merged.files.length ? merged : null;
})();

/**
 * Category ARCHIVES, which are NOT pages and therefore cannot go in PAGES above.
 * Verified: rest-pages.json holds 18 EN / 17 TH page records and not one is a
 * /category/* URL — a WordPress term archive has no REST page object, unlike
 * /events-news-release/ which IS a real page (id 1935/3464).
 *
 * Different source of truth, same question. The legacy archive rendered one card per
 * post: title + excerpt. Our index renders those same strings, so the archive is checked
 * against the POST snapshot it lists.
 *
 * ⚠ The card text is `metaDescription ?? excerpt` (see cardText() in src/data/blog.ts —
 * WordPress truncates every Thai excerpt to 30 characters), so BOTH are accepted here.
 */
const ARCHIVES = [
  { label: "blog index EN", dist: join("category", "blog"), lang: "en" },
  { label: "blog index TH", dist: join("th", "category", "บล็อก"), lang: "th" },
];

/**
 * Legacy fragments the build drops deliberately. Each entry needs a reason — an
 * unexplained skip here is indistinguishable from a bug this script exists to catch.
 */
const SKIP = [
  // --- WordPress/Elementor chrome and social widget labels, never page copy ---
  [/^(facebook|facebook-f|youtube|yelp|instagram|tiktok|line)$/i, "social widget labels, not copy"],
  [/^(read more|prev|next|search|menu|home)$/i, "WP navigation chrome"],

  // --- Blog: this script's own <ol> chunking, NOT a content drop --------------
  // Both fragments below are an artefact of the widget-container sweep further down:
  // it splits on </p>, <br>, <div> and <h1-6>, but NOT on </li> or </ol>. So an <ol>
  // gets flattened into ONE fragment that also swallows the heading paragraph which
  // follows it ("…dr. orn clinic 4) การเยียวยาที่บ้าน" — the salon list plus the next
  // section title).
  //
  // The build renders each <li> as its own paragraph, so the same words are all there
  // but never contiguous in that order. VERIFIED PRESENT on the built page, string by
  // string: 786 salon, Bond Beauty Bangkok Asoke, Serge Comtesse, Nirunda, Cellport
  // Clinic, Kamol Hospital, and การเยียวยาที่บ้าน. Nothing is missing; only this
  // script's chunking disagrees with the DOM.
  [/^bee choo origin herbal thailand 786 salon bond beauty bangkok asoke/i, "copy-parity's own <ol> flattening — every item verified present on the built page"],
  [/^nirunda cellport clinic kamol hospital ktop clinic/i, "copy-parity's own <ol> flattening — every item verified present on the built page"],
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

  // --- FAQ page ---
  // Both headings carry a trailing zero-width space (WordPress editing artefact),
  // same class of issue as the Reviews page precedent above.
  [/^does bee choo thailand provide hair cutting services\?/i, "legacy heading carries a trailing zero-width space (WordPress editing artefact); dropped, not real content"],
  [/^what ingredients are in the herbal treatment\?/i, "legacy heading carries a trailing zero-width space (WordPress editing artefact); dropped, not real content"],
  // Intro adapted: stale one-branch phone number (02-108-3938) replaced with the
  // sitewide Find-a-Branch/Facebook/LINE CTA routing — see faq.ts header.
  [/^in this section, we have listed down the most frequently asked questions/i, "adapted — stale phone number replaced with sitewide CTA routing, see faq.ts header"],
  [/^ในส่วนนี้เราได้ตอบคำถามที่พบบ่อยจากลูกค้าของเรา/, "adapted — stale phone number replaced with sitewide CTA routing, see faq.ts header"],
  // Q10: dropped trailing sentence linking to beechooladies.com.sg (Singapore sister
  // site) — broken/off-brand cross-domain link, see faq.ts header.
  [/^this will depend on your scalp condition/i, "trailing broken cross-domain link sentence dropped, see faq.ts header"],

  // --- Herbal vs Hair Transplant page ---
  // Confirmed content decision (2026-08-21): drop the 2 negative named-competitor
  // paragraphs from EN so it matches what the TH page already ships. See
  // herbal-vs-transplant.ts header.
  [/^one of the clinics in thailand offering hair transplant treatments is the hh clinic/i, "negative named-competitor paragraph dropped per confirmed decision, matches what TH already ships"],
  [/^another popular doctor for hair transplants is dr\. kongkiat laorwong/i, "negative named-competitor paragraph dropped per confirmed decision, matches what TH already ships"],
  // Flat outlet name/phone lists (mid-page and closing) superseded by the shared
  // <LocationsBand> component — same "stale hardcoded contact info -> one
  // maintained CTA" fix already applied sitewide (Header.astro's Call -> Find a
  // Branch). One regex covers every bare name, name+phone line, and the
  // editor-sweep's concatenated blob variants, since all start with "Bee Choo <name>".
  [
    /^bee choo (udomsuk|ratchada|siam square|kallapaphruk|chaiyaphruek|saimai|chonburi|the crystal park ekamai raindra|sammakorn|prawet|chatuchak \(prachachuen\)|suksawat|korat|surat thani|chiang mai|phutthamonthon)/i,
    "flat outlet name/phone list superseded by shared <LocationsBand> component",
  ],
  [/^currently, we have outlets at:$/i, "outlet list intro chrome, superseded by <LocationsBand>"],
  [/^see all our locations here\s*!/i, "outlet list intro chrome, superseded by <LocationsBand>"],
  [/^visit us at any of our outlets:$/i, "outlet list intro chrome, superseded by <LocationsBand>"],
  [/^see them in detail here\s*!/i, "outlet list intro chrome, superseded by <LocationsBand>"],
  [/^สถานที่ตั้งของแต่ละสาขาของ บีชู ในประเทศไทย$/, "TH-only closing heading for the outlet list, superseded by <LocationsBand>"],

  // --- Treatment Cost page ---
  // Confirmed content decision (2026-08-21): drop the entire named-competitor price
  // comparison (stale 2006-2018 forum research, self-contradicted on Bee Choo's own
  // price) — replaced with Bee Choo's own current pricing + a generic, de-identified
  // market-context paragraph. See treatment-cost.ts header.
  [/^do you find it common that many hair loss treatment salons\/clinics/i, "kept only the real hook sentence; the trailing 'who are the main providers' question set up the now-dropped comparison"],
  [/^to save our readers time, effort and money/i, "stale 2018 forum-research methodology dropped, see treatment-cost.ts header"],
  [/^to be reliable, we have attached proof from forums/i, "stale 2018 forum-research methodology dropped, see treatment-cost.ts header"],
  [/^note: this page is only detailing prices and nothing else\.$/i, "chrome for the dropped comparison table"],
  [/^6 most known hair loss treatment providers in thailand with costs revealed$/i, "heading for the dropped competitor comparison"],
  [/^(svenson|harley st\. hair center|thai hair center|trisla|mamaherb|bee choo)\s*[-–]\s*[\d,]+\s*thb/i, "named-competitor price-list line, dropped per confirmed decision"],
  [/^(svenson|harley st\. hair center|ไทยแฮร์เซ็นเตอร์|ตรีสลา|มะมาเฮิร์บ|bee choo บีชู)\s*[-–]\s*[\d,]+\s*บาท/i, "named-competitor price-list line, dropped per confirmed decision"],
  [/^data collected from thai forums$/i, "caption on the dropped competitor price-comparison chart image"],
  [/^\d\.\s*(mamma herb|harley st\. hair center|thai hair center clinic|bee choo herbal)$/i, "named-competitor section heading, dropped per confirmed decision"],
  [/^chantamon poonnin, the owner started a new brand/i, "named-competitor (Mamma Herb) profile paragraph, dropped"],
  [/^retrieved from (http|https):\/\/(www\.)?(mammaherb|trislathaiherbs|thaihaircenter)/i, "named-competitor citation link, dropped"],
  [/^retrieved from https?:\/\/pantip\.com/i, "named-competitor forum-citation link, dropped"],
  [/^retrieved from https?:\/\/topicstock\.pantip\.com/i, "named-competitor forum-citation link, dropped"],
  [/^retrieved from https:\/\/www\.harleyhaircentre\.com/i, "named-competitor citation link, dropped"],
  [/^retrieved from https:\/\/beechooherbal\.com\/th\/$/i, "old self-listing citation, dropped along with the stale competitor comparison"],
  [/^hair loss treatment price estimated/i, "named-competitor estimated price line, dropped per confirmed decision"],
  [/^hair fall, hair loss, gray hair, baldness, scalp dandruff/i, "named-competitor (Trisla) profile paragraph, dropped"],
  [/^svenson hair used to have many outlets in thailand/i, "named-competitor (Svenson) profile paragraph, dropped"],
  [/^for 30 years, harley st\. hair centre/i, "named-competitor (Harley St.) profile paragraph, dropped"],
  [/^thai hair center is a hair loss, hair thinning clinic/i, "named-competitor (Thai Hair Center) profile paragraph, dropped"],
  [/^hair loss treatment price: 940 thb per month/i, "named-competitor price line, dropped"],
  [/^a recognised household brand name, established since 2000/i, "old Bee Choo self-listing paragraph inside the dropped competitor comparison, superseded by the page's own current pricing"],
  [/^bee choo origin is the largest scalp\/hair loss treatment clinic/i, "old Bee Choo self-listing paragraph inside the dropped competitor comparison, superseded by the page's own current pricing"],
  [/^hair loss treatment price: 600 - 1,100 thb/i, "old, self-contradicting Bee Choo price line, superseded by the page's own current HOME.pricing table"],
  [/^ดูแลฟื้นฟู ผมร่วง ผมบาง ผมขาว ศีรษะล้าน/, "named-competitor (Trisla) profile paragraph, dropped"],
  [/^สเวนสัน แฮร์ เซ็นเตอร์ เคยมีสาขาจำนวนมาก/, "named-competitor (Svenson) profile paragraph, dropped"],
  [/^ฮาร์ลีย์ เอสที แฮร์ เซ็นเตอร์/, "named-competitor (Harley St.) profile paragraph, dropped"],
  [/^ไทยแฮร์เซ็นเตอร์เป็นศูนย์รักษาเรื่องผมร่วงผมบาง/, "named-competitor (Thai Hair Center) profile paragraph, dropped"],
  [/^ราคาค่ารักษา: 940 บาทต่อเดือน/, "named-competitor price line, dropped"],
  [/^อ\.ฉันทมน พูลนิล/, "named-competitor (Mamma Herb) profile paragraph, dropped"],
  [/^ราคาการทำทรีทเม้นท์โดยประมาณ/, "named-competitor estimated price line, dropped per confirmed decision"],
  [/^บีชู ได้ก่อตั้งเมื่อปี 2000/, "old Bee Choo self-listing paragraph inside the dropped competitor comparison, superseded by the page's own current pricing"],
  [/^บีชู ออริจิน เป็นทรีทเม้นท์ซาลอนและคลินิกรักษาผมร่วงที่ใหญ่ที่สุด/, "old Bee Choo self-listing paragraph inside the dropped competitor comparison, superseded by the page's own current pricing"],
  [/^ราคาการทำทรีทเม้นท์\s*:\s*800\s*-1,200 บาท/, "old TH price line — the page's own current HOME.pricing table is used instead so the two can never drift apart"],
  [/^คุณเคยสังเกตไหมว่าคุณไม่สามารถหาราคาการทำทรีทเม้นท์.*และวีธีเดียวที่คุณสามารถทราบ/, "kept only the real hook sentence, verbatim, as COST_INTRO.hook; the following stale-methodology sentences were dropped"],
  [/^เพื่อช่วยให้ทุกท่านทั้งหลายไม่เสียดายเวลา/, "stale 2018 forum-research methodology dropped, see treatment-cost.ts header"],
  [/^ราคาดังกล่าวคือราคาที่เราค้นเจอเมื่อวันที่ 25 กันยายน 2561/, "stale 2018 forum-research methodology dropped, see treatment-cost.ts header"],
  // Heading swapped for the existing UI.toc.howItWorks string per the plan's
  // decision to minimize new composed chrome (content itself is verbatim).
  [/^how bee choo herbal's treatment works$/i, "heading reuses existing UI.toc.howItWorks string instead of a new composed heading; body copy is verbatim"],
  [/^ทรีทเม้นท์ของบีชู เฮอร์เบิล ทำงานอย่างไร\?$/, "heading reuses existing UI.toc.howItWorks string instead of a new composed heading; body copy is verbatim"],
  [/^watch our transparent treatment process$/i, "video section chrome, superseded by the generic YouTubeEmbed section heading"],
  [/^bee choo thailand locations$/i, "outlet/phone chrome, superseded by <LocationsBand>"],
  [/^(tawanna, bangkapi outlet|siam square one \(floor 6\)|ratchada soi 7 lane 4|the master @ bts udomsuk)$/i, "individual outlet name, superseded by <LocationsBand>"],
  [/^tel: /i, "outlet phone number, superseded by <LocationsBand>"],
];

/**
 * Legacy video/GIF ids the build drops deliberately (same audit-trail rule as SKIP
 * above, extended to the id-only check below since embeds carry no text).
 */
const SKIP_VIDEO_IDS = new Set([
  // Two decorative GIPHY reaction GIFs embedded inside Treatment Cost's dropped
  // stale-methodology/competitor-comparison section — same "GIPHY chrome, not page
  // copy" reasoning as the `via giphy` SKIP entry above, just applied to the embed
  // itself rather than its attribution text.
  "37sogIrvhmVY6fdWVH",
  "Zyv6MOrU1FOTlkgllN",

  // --- Blog batch: decorative GIPHY reaction GIFs -----------------------------
  // Every id below is a giphy.com/embed/* iframe (verified against the raw post HTML,
  // not inferred from the id shape). They are reaction GIFs punctuating the 2018 travel
  // listicles and hair-care articles — "chrome, not page copy", the same call already
  // made for Treatment Cost above.
  //
  // Carrying them would mean ~21 third-party giphy.com iframes on a site whose whole
  // premise is near-zero JS (CLAUDE.md §3), in exchange for decoration that carries no
  // information. Every one is listed individually rather than skipped by a blanket
  // giphy.com rule, so a NEW embed still fails loudly and gets a decision.
  //
  // Note this list is GIPHY only. Real YouTube videos in these posts are CARRIED, and
  // two were recovered while building this list: an <a href> link to youtube.com (which
  // the extractor had been stripping to its label) and an Elementor `video` widget whose
  // URL lives in a data-settings JSON blob.
  "1kJYep7bSfVjtmnCFF",
  "9AIAX6KeXfjGGct3Qa",
  "3q0gsjUP5gnzokdN44",
  "8Bl2Aiu7choMmqIt8z",
  "l0ErF5NVjqvvquRna",
  "8TCWfhWi30fNinARM6",
  "MV1jgzE9Sp5zLATwIT",
  "l2QZXwGah3PZa9x28",
  "d3MKvWzccYif1XCU",
  "okMZne8cKftrq",
  "3o7TKz2eMXx7dn95FS",
  "3og0IJlBi94ro3OTbq",
  "xT77XWum9yH7zNkFW0",
  "l1J3CbFgn5o7DGRuE",
  "jquDWJfPUMCiI",
  "3o6fJ2J2Ct3zcv1u7K",
  "7SdIVBc0xjpja",
  "xT1R9CMeVujUND154I",
  "OYgHBpEfKG4UM",
  "t7752IVYRBN1YzOPaL",
  "KXNxjTjMzGuEcC7gip",
]);

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
    const missingVideos = [...legacyVideoIds(legacy.content.rendered || legacy.content)].filter(
      (id) => !html.includes(id) && !SKIP_VIDEO_IDS.has(id),
    );
    if (missingVideos.length) {
      missingTotal += missingVideos.length;
      report.push(`\n  ${slug} ${lang.toUpperCase()} — ${missingVideos.length} legacy video/GIF id(s) not found in the build: ${missingVideos.join(", ")}`);
    }
  }
}

// --- individual posts ------------------------------------------------------
// Same comparison as PAGES, different source of truth (the post snapshots) and different
// path convention: BOTH languages live at the root, so PAGES' `dist/th/<thSlug>/` shape
// does not apply.
let postsChecked = 0;
if (REST_POSTS) {
  // Match on the decoded path with `endsWith`, not `includes`: post slugs share long
  // prefixes here (`…-prawet-7-กรกฎาคม-2567` vs `…-2567-2`), and a substring match
  // would happily return the wrong post.
  const postPath = (p) => {
    try {
      return decodeURIComponent(new URL(p.link).pathname);
    } catch {
      return "";
    }
  };
  const allPosts = [...REST_POSTS.variants.en, ...REST_POSTS.variants.th];

  for (const legacy of allPosts) {
    const path = postPath(legacy);
    if (!path || path === "/") continue;
    const distPath = join(ROOT, "dist", path.replace(/^\/|\/$/g, ""), "index.html");
    const label = `post ${path.slice(1, 45)}`;
    if (!existsSync(distPath)) {
      pending.push(label);
      continue;
    }
    postsChecked++;
    const html = readFileSync(distPath, "utf8").replace(/<script[\s\S]*?<\/script>/g, " ");
    const attrs = [...html.matchAll(/\b(?:alt|title)="([^"]*)"/g)].map((m) => m[1]).join(" ");
    const built = key(`${html.replace(/<[^>]+>/g, " ")} ${attrs}`);
    const missing = legacyFragments(legacy.content.rendered || legacy.content).filter(
      (frag) => !built.includes(key(frag)) && !SKIP.some(([re]) => re.test(frag)),
    );
    if (missing.length) {
      missingTotal += missing.length;
      report.push(`\n  ${label} — ${missing.length} legacy fragment(s) not found in the build:`);
      for (const frag of missing) report.push(`    · ${frag.slice(0, 150)}${frag.length > 150 ? "…" : ""}`);
    }
    const missingVideos = [...legacyVideoIds(legacy.content.rendered || legacy.content)].filter(
      (id) => !html.includes(id) && !SKIP_VIDEO_IDS.has(id),
    );
    if (missingVideos.length) {
      missingTotal += missingVideos.length;
      report.push(`\n  ${label} — ${missingVideos.length} legacy video/GIF id(s) not found: ${missingVideos.join(", ")}`);
    }
  }
}

// --- category archives -----------------------------------------------------
// The blog index lists one card per post: title + card text. Checked against the post
// snapshot it lists, because a WP term archive has no REST page record to compare with.
let archivesChecked = 0;
if (REST_POSTS) {
  const blogSnapshotIds = new Set();
  for (const f of ["rest-posts-blog.json", "rest-posts-wayback.json"]) {
    const p = join(ROOT, "inventory", f);
    if (!existsSync(p)) continue;
    const snap = JSON.parse(readFileSync(p, "utf8"));
    for (const lang of ["en", "th"]) for (const post of snap.variants?.[lang] ?? []) blogSnapshotIds.add(`${lang}:${post.id}`);
  }

  for (const archive of ARCHIVES) {
    const distPath = join(ROOT, "dist", archive.dist, "index.html");
    if (!existsSync(distPath)) {
      pending.push(archive.label);
      continue;
    }
    archivesChecked++;
    const html = readFileSync(distPath, "utf8").replace(/<script[\s\S]*?<\/script>/g, " ");
    const attrs = [...html.matchAll(/\b(?:alt|title)="([^"]*)"/g)].map((m) => m[1]).join(" ");
    const built = key(`${html.replace(/<[^>]+>/g, " ")} ${attrs}`);

    // Every post the archive should list must have its TITLE on the page, plus either
    // its Yoast description or its excerpt (whichever the card renders — see cardText).
    const missing = [];
    for (const f of ["rest-posts-blog.json", "rest-posts-wayback.json"]) {
      const p = join(ROOT, "inventory", f);
      if (!existsSync(p)) continue;
      const snap = JSON.parse(readFileSync(p, "utf8"));
      for (const post of snap.variants?.[archive.lang] ?? []) {
        const title = decode(post.title?.rendered || "");
        if (title && !built.includes(key(title))) missing.push(`card title: ${title}`);
        const desc = decode(post.yoast_head_json?.description || "");
        const exc = decode((post.excerpt?.rendered || "").replace(/<[^>]+>/g, " "));
        const cardHas = (desc && built.includes(key(desc))) || (exc && built.includes(key(exc)));
        if ((desc || exc) && !cardHas) missing.push(`card text for "${title.slice(0, 40)}"`);
      }
    }
    if (missing.length) {
      missingTotal += missing.length;
      report.push(`
  ${archive.label} — ${missing.length} card field(s) not found:`);
      for (const m of missing) report.push(`    · ${m.slice(0, 150)}`);
    }
  }
}

console.log(`copy parity: ${checked} built page(s) checked against inventory/rest-pages.json`);
if (archivesChecked) console.log(`             ${archivesChecked} category archive(s) checked against the blog snapshot`);
if (REST_POSTS) console.log(`             ${postsChecked} built post(s) checked against ${REST_POSTS.files.join(" + ")}`);
else console.log("             posts NOT checked — no post snapshot present (run `npm run fetch-posts` / `fetch-blog`)");
if (pending.length) console.log(`not built yet (not a failure): ${pending.join(", ")}`);
if (report.length) console.log(report.join("\n"));
if (missingTotal === 0) {
  console.log("OK — every legacy fragment is present in the built pages.");
} else {
  console.log(`\nFAIL — ${missingTotal} legacy fragment(s) missing. Either transcribe them, or add a SKIP entry with a reason.`);
  process.exitCode = 1;
}
