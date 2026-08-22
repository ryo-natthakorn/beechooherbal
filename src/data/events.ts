// src/data/events.ts
// Events & News page chrome + the EN<->TH post pairings.
//
// The POSTS themselves are not here — they live in the `events` Content Collection
// (src/content/events/{en,th}/*.md), generated from inventory/rest-posts.json by
// inventory/scripts/09-generate-events.mjs. See src/content.config.ts for why posts
// use a collection while every singleton page still uses the src/data/*.ts pattern.
//
// Legacy source: wp-json/wp/v2/pages/1935 (EN) and /3464 (TH), both captured in
// inventory/rest-pages.json.
//
// ---------------------------------------------------------------------------
// THE CATEGORISATION FIX (the reason this batch exists)
// ---------------------------------------------------------------------------
// The live site has four category terms, because WPML splits them per language:
//     EN  id  1 `blog`         "BLOG"           19 posts
//     EN  id 16 `events-news`  "EVENTS/News"    18 posts
//     TH  id  9 `บล็อก`         "บล็อก"           21 posts
//     TH  id 17 `เหตุการณ์-ข่าว` "เหตุการณ์/ข่าว"  15 posts
//     --  id  7 `blog-th`      "Blog"            2 posts (dead term; its archive
//                                                301s to /th/category/บล็อก/)
//
// Every 2023-2025 grand opening is filed in BOTH the blog and the events term
// (`categories: [1,16]` EN / `[9,17]` TH). WordPress renders only the FIRST term as
// the card badge, so all ten display "BLOG" / "บล็อก" — including on the Events page
// itself, where the badge text is literally part of the page copy. Ryo asked for them
// to sit in the right category; in the rebuild they are events only.
//
// Consequence for the later blog batch: /category/blog/ loses those 10 EN / 10 TH
// posts, so the legacy blog archive's card excerpts for them will NOT appear in the
// built blog index. That batch will need its own documented SKIP group in
// 06-copy-parity.mjs. Recording it here while the reasoning is fresh.
//
// No post URL changes as a result of any of this — only archive membership.
//
// ---------------------------------------------------------------------------
// TWO LEGACY BUGS FIXED RATHER THAN REPRODUCED
// ---------------------------------------------------------------------------
// 1. The legacy index renders only SIX of its eighteen posts — an Elementor
//    `posts.cards` default, not an editorial choice. Twelve English events were
//    unreachable except through /category/events-news/. The rebuild shows all of them.
// 2. Thai event posts are served with <html lang="en-US"> because they sit at the root
//    (English URL space). BaseLayout emits the correct lang from the entry's own
//    `lang` field, so the rebuild fixes that without moving any URL.
//
// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------
// All 33 posts keep their legacy ROOT paths, Thai included. None of the /th/<slug>/
// WPML mirrors appear in the sitemap, so moving Thai posts under /th/ would 301 away
// the URLs Google actually crawls. The mirrors are 301'd to the root in vercel.json.

import type { Lang } from "./home";

export type { Lang };

/** ⚠ COMPOSED — the legacy pages carry no Yoast meta description at all (verified
 *  null in inventory/rest-pages.json for both 1935 and 3464). Needs Crispin's
 *  sign-off before launch. The EN title is the legacy <h1> verbatim. */
export const EVENTS_SEO = {
  title: {
    en: "Events, News Release & Promotions - Bee Choo Herbal",
    th: "เหตุการณ์และข่าว - Bee Choo Herbal",
  },
  description: {
    en: "Grand openings, new outlets and news from Bee Choo Herbal Thailand — 16 branches nationwide offering herbal scalp and hair-loss treatment.",
    th: "ข่าวสารการเปิดสาขาใหม่และกิจกรรมของ Bee Choo Herbal ประเทศไทย ทรีทเม้นท์สมุนไพรดูแลหนังศีรษะและปัญหาผมร่วง",
  },
} as const;

/** Legacy <h1>, verbatim. EN keeps the legacy capitalisation pattern normalised the
 *  same way every other page on this site does (documented ALL-CAPS -> Title Case
 *  pass; 06-copy-parity.mjs folds case, so parity is unaffected). */
export const EVENTS_HERO = {
  heading: {
    en: "Events, News Release & Promotions",
    th: "เหตุการณ์และข่าว",
  },
  /** ⚠ COMPOSED — the legacy page has no intro prose at all (it is an h1 followed
   *  immediately by the card feed). Added because a bare grid of cards under a
   *  heading reads as unfinished. Needs sign-off. */
  intro: {
    en: "News from Bee Choo Herbal Thailand — grand openings, new outlets, and the moments we've shared with our customers along the way.",
    th: "ข่าวสารจาก Bee Choo Herbal ประเทศไทย ทั้งการเปิดสาขาใหม่ และช่วงเวลาดี ๆ ที่เราได้ร่วมแบ่งปันกับลูกค้าของเรา",
  },
} as const;

/**
 * EN <-> TH post pairs, keyed by the collection filename (the branch token).
 * Spread into PAIRS in src/i18n/pairs.ts so hreflang and the language switcher work
 * on every post with no per-page wiring.
 *
 * 15 pairs. The three EN-only posts (saimai-krungthepkreetha, ratchada,
 * kallapaphruk) are deliberately absent — a page with no twin must emit NO hreflang
 * cluster, which is exactly what getPair() returning undefined produces.
 *
 * ⚠ Pairing was derived from publish date + branch, NOT from slugs, and needs
 * native-speaker/Crispin sign-off. Slugs are demonstrably unreliable here: the Thai
 * post at `grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567-2` is titled จตุจักร
 * (Chatuchak), not ประเวศ (Prawet) — it is paired with the EN Chatuchak post below.
 * Four pairs also publish a day or more apart in each language (Chiang Mai, Suksawat,
 * Chonburi, Naan), which is why the pair key carries no date.
 */
export const EVENT_PAIRS: { key: string; en: string; th: string }[] = [
  { key: "phutthamonthon", en: "/grand-opening-of-new-outlet-bee-choo-phutthamonthon/", th: "/grand-opening-บีชู-สาขาพุทธมณฑล-ในวั/" },
  { key: "chiang-mai", en: "/grand-opening-of-new-outlet-bee-choo-chiang-mai/", th: "/grand-opening-บีชู-สาขาเชียงใหม่-ในว/" },
  { key: "surat-thani", en: "/grand-opening-of-new-outlet-bee-choo-surat-thani/", th: "/grand-opening-บีชู-สุราษฎร์ธานี-ในวั/" },
  { key: "korat", en: "/grand-opening-of-new-outlet-bee-choo-korat/", th: "/grand-opening-บีชู-สาขาโคราช-ในวันที/" },
  { key: "suksawat", en: "/soft-opening-of-new-outlet-bee-choo-suksawat/", th: "/soft-opening-บช-สาขาสขสวสดในวนท-19-กนย/" },
  // NOTE the Thai slug below says ประเวศ (Prawet) but the post is CHATUCHAK. Correct as written.
  { key: "chatuchak", en: "/grand-opening-of-new-outlet-bee-choo-chatuchak/", th: "/grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567-2/" },
  { key: "prawet", en: "/grand-opening-of-new-outlet-bee-choo-prawet/", th: "/grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567/" },
  { key: "sammakorn", en: "/grand-opening-of-new-outlet-bee-choo-sammakorn/", th: "/grand-opening-สาขาสัมมากร/" },
  { key: "thecrystalparkekamai-ramindra", en: "/opening-of-new-outlet-bee-choo-thecrystalparkekamai-ramindra/", th: "/grand-opening-บีชู-สาขาเดอะคริสตัล-เ/" },
  { key: "chonburi", en: "/first-outlet-outside-of-bangkok-bee-choo-chonburi/", th: "/บีชูชลบุรีสาขาแรกนอกเข/" },
  { key: "naan-charity", en: "/naan-charity-trip-2019/", th: "/ช่วยเหลือเหล่าเด็กๆ-ที่/" },
  { key: "essence-shampoo", en: "/introducing-essence-shampoo-and-newly-formulated-essence-vitamins/", th: "/ขอแนะนำ-essence-shampoo-และ-essence-vitamins-สูตรใหม่/" },
  { key: "udomsuk", en: "/bee-choo-udomsuk-grand-opening-23-sept-2018/", th: "/grand-opening-บีชู-สาขาอุดมสุข-23-กันยา/" },
  { key: "siam-grand-opening", en: "/bee-choo-siam-grand-opening/", th: "/grand-opening-บีชู-สาขาสยามสแควร์วั/" },
  { key: "siam-square-make-merit", en: "/bee-choo-siam-square-make-merit/", th: "/ทำบุญเปิดร้านสาขาสยามส/" },
];

/** The index page's own path per language — used for the post pages' back-link. */
export const EVENTS_INDEX: Record<Lang, string> = {
  en: "/events-news-release/",
  th: "/th/เหตุการณ์และข่าว/",
};
