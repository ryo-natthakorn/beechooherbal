// src/data/blog.ts
// Blog index page chrome + the EN<->TH post pairings.
//
// The POSTS live in the `blog` Content Collection (src/content/blog/{en,th}/*.md),
// generated from inventory/rest-posts-blog.json and inventory/rest-posts-wayback.json by
// inventory/scripts/12-generate-blog.mjs. See src/content.config.ts for why blog is a
// separate collection from events.
//
// ---------------------------------------------------------------------------
// WHAT THIS BATCH CLOSES
// ---------------------------------------------------------------------------
// Before it, 24 legacy sitemap URLs had neither a built page nor a redirect and would
// have 404'd at DNS cutover. 21 of those 24 are these blog articles; the other three are
// /privacy-policy/ (still unbuilt), /category/blog/ and /author/admin/ (both handled
// here — the archive is built, the author archive 301s to it).
//
// The nav has linked /category/blog/ and /th/category/บล็อก/ since the header was built.
// Both 404'd until this batch.
//
// ---------------------------------------------------------------------------
// THE CATEGORY SPLIT
// ---------------------------------------------------------------------------
//     EN  id  1 `blog`             "BLOG"            19 posts  -> 10 after filtering
//     TH  id  9 `บล็อก`             "บล็อก"            21 posts  -> 11 after filtering
//     --  id  7 `blog-th`          "Blog"             2 posts  -> 1 (see the anomaly)
// The 20 grand openings carry BOTH a blog term and an events term. They shipped as
// events (see src/data/events.ts), so they are excluded here. That one rule is also
// what stops the dead term 7 double-counting the Suksawat opening.
//
// ⚠ ANOMALY: `/12-best-family-places-to-visit-in-bangkok/` (wpId 1814) is an ENGLISH
// article filed on the dead THAI term, so on the live site it renders on neither
// archive. It is treated as the 10th EN article and carries `wpLang: 'th'` to record the
// discrepancy.
//
// ---------------------------------------------------------------------------
// TWO LEGACY URLs THAT WERE BROKEN, AND ARE NOW FIXED
// ---------------------------------------------------------------------------
// 1. `/5-causes-of-hair-loss-.../` (wpId 1225) 301s on the live site to a doubled copy
//    of its own path. The rebuild serves it at the clean path; the doubled path is
//    301'd in vercel.json.
// 2. `/suffering-from-alopecia-.../` (wpId 1530) returns HTTP 500 — and so does its REST
//    endpoint, AND any listing whose `_fields` includes `excerpt`. Diagnosed 2026-08-24:
//    the EXCERPT is what breaks. Its 2,900-word body was recovered from a frozen 2022
//    Wayback capture (committed at inventory/wayback/1530-20220701072615.html — the only
//    surviving source; do not delete it). The capture's title and publish date were
//    cross-validated against the live listing, which still works without `excerpt`.
//
//    ⚠ This CORRECTS CLAUDE.md §10 and docs/session-2026-07-14-audit.md, which both
//    state that all 54 posts fetch fine individually. They no longer do.
//
//    ⚠ CRISPIN MUST READ THAT ARTICLE BEFORE LAUNCH. It is 2022 copy going live again
//    after years of 500ing, and may contain stale prices or claims.
//
// ---------------------------------------------------------------------------
// IMAGES MISSING UPSTREAM — not a migration loss
// ---------------------------------------------------------------------------
// Nine posts reference images that could not be downloaded. Every one is already broken
// on the live site: four are 404s in beechooherbal.com's own uploads (deleted from the
// media library but still referenced in post bodies) and two are hotlinks to external
// sites (beechooladies.com.sg and majorcineplex.com) that now serve HTML instead of an
// image — the magic-byte guard correctly refused to write those. Where such an image had
// a caption, the caption is kept as prose, because it is legacy copy either way.
//
// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------
// All 21 posts keep their legacy ROOT paths, Thai included — same reasoning as events:
// none of the /th/<slug>/ WPML mirrors are in the sitemap, so moving them would 301 away
// the URLs Google actually crawls. The mirrors are 301'd to the root in vercel.json.

import type { Lang } from "./home";

export type { Lang };

/**
 * ⚠ COMPOSED — all of it. The legacy `/category/blog/` is a WordPress TERM ARCHIVE, not
 * a page: it has no REST page object (verified — rest-pages.json holds 18 EN / 17 TH
 * pages and zero /category/* entries), its <title> is Yoast's boilerplate "BLOG Archives
 * - Bee Choo Herbal", and its meta description is EMPTY. There is nothing to transcribe.
 * Needs Crispin's sign-off. "BLOG Archives" is deliberately not reproduced — it is
 * Yoast's default, not a title anyone wrote.
 */
export const BLOG_SEO = {
  title: {
    en: "Blog - Bee Choo Herbal",
    th: "บล็อก - Bee Choo Herbal",
  },
  description: {
    en: "Hair and scalp advice from Bee Choo Herbal Thailand — causes of hair loss, greying and dry scalp, plus places to visit around Bangkok.",
    th: "บทความและคำแนะนำเรื่องเส้นผมและหนังศีรษะจาก Bee Choo Herbal ประเทศไทย ทั้งสาเหตุของผมร่วง ผมหงอก หนังศีรษะแห้ง และสถานที่น่าไปในกรุงเทพ",
  },
} as const;

export const BLOG_HERO = {
  /** The nav label the site already uses for this archive, verbatim. */
  heading: {
    en: "Blog",
    th: "บล็อก",
  },
  /**
   * ⚠ COMPOSED — the legacy archive has no intro prose at all (it is a bare card feed).
   * Needs sign-off.
   *
   * ⚠ EDITORIAL, for Crispin: this deliberately mentions Bangkok places as well as hair
   * care, because 4 of the 10 English articles are travel listicles (chill-out places,
   * non-touristy things to do, 12 family places, plus a Bangkok salon round-up) rather
   * than hair advice. CLAUDE.md Phase 0 says reproduce the site faithfully, so they are
   * migrated — but Crispin may not realise they are there, and an intro promising only
   * scalp advice would misrepresent the archive.
   */
  intro: {
    en: "Advice on hair loss, greying, dandruff and scalp care from the Bee Choo Herbal team — along with a few of our favourite places around Bangkok.",
    th: "คำแนะนำเรื่องผมร่วง ผมหงอก รังแค และการดูแลหนังศีรษะ จากทีมงาน Bee Choo Herbal พร้อมกับสถานที่น่าสนใจในกรุงเทพที่เราชอบ",
  },
} as const;

/**
 * EN <-> TH blog pairs, keyed by the collection filename.
 *
 * ⚠⚠ ALL FOUR NEED NATIVE-SPEAKER SIGN-OFF. This is the sharpest difference from the
 * events batch, which produced 15 pairs off an unambiguous branch token. Blog articles
 * have no such token, so these were matched on publish date + subject:
 *
 *   dry-scalp               SAME DAY 2018-05-16, both on dry scalp
 *   white-hair-natural-dye  SAME DAY 2018-06-09, both on white hair + natural dye
 *   bangkok-non-touristy    2018-08-17 / 08-19, both "10 lesser-known Bangkok places"
 *   alopecia                2018-08-10 / 08-15, both on hair-loss disease. Corroborated
 *                           by ADJACENT WordPress ids (1530 / 1528) — WPML assigns
 *                           near-consecutive ids to a translation pair, which is
 *                           evidence independent of date and subject.
 *
 * The remaining 6 EN and 7 TH articles have NO plausible counterpart and are ABSENT BY
 * DESIGN. A page with no twin must emit NO hreflang cluster, which is exactly what
 * getPair() returning undefined produces. Do not invent a pair to make this table
 * symmetrical: a wrong hreflang tells Google two unrelated articles are translations of
 * each other, which is worse than declaring nothing.
 */
export const BLOG_PAIRS: { key: string; en: string; th: string }[] = [
  { key: "dry-scalp", en: "/scalp-dry-ways-combat-dry-scalp/", th: "/ทำไมหนังศีรษะของฉันถึง/" },
  { key: "white-hair-natural-dye", en: "/dye-white-hair-naturally/", th: "/อะไรเป็นสาเหตุของผมขาว/" },
  { key: "bangkok-non-touristy", en: "/top-10-non-touristy-things-to-do-in-bangkok/", th: "/10-สถานที่และสิ่งน่าสนใจ/" },
  {
    key: "alopecia",
    en: "/suffering-from-alopecia-hair-loss-natural-herbal-treatment-in-bangkok-thailand/",
    th: "/โรคผมร่วงและทรีทเม้นท์/",
  },
];

/** The archive's own path per language — used for post back-links and breadcrumbs. */
export const BLOG_INDEX: Record<Lang, string> = {
  en: "/category/blog/",
  th: "/th/category/บล็อก/",
};

/**
 * What a card and a <meta description> should show for a post.
 *
 * ⚠ DECISION NEEDING SIGN-OFF. Prefers the Yoast description over WordPress's own
 * excerpt. Both are legacy-authored strings — neither is composed — but WP's
 * `excerpt.rendered` is generated by word count, and Thai has no inter-word spaces, so
 * EVERY Thai post's excerpt comes back truncated to exactly 30 characters, cut mid-word
 * (e.g. "เราได้ทำการค้นหา กลั่นกรองและร"). English excerpts are a usable 140-185 chars.
 * Rendering the 30-char version would put visibly broken text on 11 of 21 cards, so the
 * complete legacy sentence wins where one exists.
 *
 * 15 of the 21 posts have a Yoast description. The 6 without fall back to `excerpt`,
 * which for the one Thai case among them (dry-scalp) means a short card.
 */
export function cardText(data: { metaDescription?: string; excerpt: string }): string {
  return data.metaDescription?.trim() || data.excerpt;
}
