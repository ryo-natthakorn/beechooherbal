// Collection filenames for the blog batch, keyed by WordPress post id.
//
// Imported by 11-fetch-blog.mjs, 12-generate-blog.mjs and 13-fetch-wayback.mjs so the
// table cannot fork between them.
//
// WHY KEYED BY wpId, not slug or title: both are unreliable in this migration. Thai
// slugs are truncated mid-word by WordPress (`แก้ปัญหาหนังศีรษะแบบถึ` — the last
// syllable is cut), one legacy slug is actively misleading, and titles are ALL CAPS on
// some 2018 posts. The numeric id is the only stable handle.
//
// WHY ASCII: same reasoning as src/content.config.ts's header — 11 Thai filenames
// would ride Windows->Linux NFC/NFD normalisation between local dev and the Vercel
// builder. The real (Thai, percent-encoded) URL slug lives in the `slug` frontmatter
// field; nothing derives a URL from a filename.
//
// ⚠ THESE NAMES ARE OURS, NOT LEGACY. They are how Crispin will find a file, so they
// are descriptive rather than transliterated. Needs a sanity read, not a translation.
//
// ── PAIRING ──────────────────────────────────────────────────────────────────
// A key shared by an EN and a TH post IS the pairing declaration — visible in `ls`,
// and the only pairing signal this batch has. Unlike the events batch (15 clean pairs
// off a branch token), blog articles mostly have NO counterpart: 4 pairs, 6 EN-only,
// 7 TH-only.
//
// ⚠⚠ ALL FOUR PAIRS NEED NATIVE-SPEAKER SIGN-OFF. They were matched on publish date +
// topic. A wrong pair tells Google two unrelated articles are translations of each
// other, which is worse than declaring no pair at all.
//
//   dry-scalp              629 / 663   SAME DAY 2018-05-16, same subject (dry scalp)
//   white-hair-natural-dye 650 / 1108  SAME DAY 2018-06-09, same subject (white hair,
//                                      natural dye)
//   bangkok-non-touristy  1610 / 1727  2018-08-17 / 08-19, both "10 lesser-known
//                                      places in Bangkok"
//   alopecia              1530 / 1528  2018-08-10 / 08-15, both on hair-loss disease.
//                                      Corroborated by ADJACENT ids — WPML assigns
//                                      near-consecutive ids to a translation pair, so
//                                      this is evidence independent of date and topic.
//                                      (The EN side is the post whose body only
//                                      survives in a 2022 Wayback capture.)

export const KEY_BY_WPID = {
  // ── EN ──────────────────────────────────────────────────────────────────────
  629: 'dry-scalp', //                  /scalp-dry-ways-combat-dry-scalp/            PAIR
  650: 'white-hair-natural-dye', //      /dye-white-hair-naturally/                   PAIR
  700: 'male-pattern-baldness', //       /male-pattern-baldness-treatment-in-bangkok-…/
  1225: 'five-causes-hair-loss', //      /5-causes-of-hair-loss-and-where-to-find-…/  ⚠ legacy URL 301-loops
  1339: 'causes-hair-loss-young-women', // /10-most-possible-causes-of-hair-loss-in-young-women/
  1530: 'alopecia', //                   /suffering-from-alopecia-…/          PAIR + WAYBACK-sourced body
  1610: 'bangkok-non-touristy', //       /top-10-non-touristy-things-to-do-in-bangkok/ PAIR
  1814: 'bangkok-family-places', //      /12-best-family-places-to-visit-in-bangkok/  ⚠ EN article on the dead TH term 7
  2576: 'bangkok-chill-places', //       /chill-places-bangkok/
  3274: 'mild-hair-loss-30s', //         /suffering-from-mild-hair-loss-in-your-30s-…/

  // ── TH ──────────────────────────────────────────────────────────────────────
  663: 'dry-scalp', //                   /ทำไมหนังศีรษะของฉันถึง/                      PAIR
  1108: 'white-hair-natural-dye', //     /อะไรเป็นสาเหตุของผมขาว/                      PAIR
  1528: 'alopecia', //                   /โรคผมร่วงและทรีทเม้นท์/                       PAIR
  1727: 'bangkok-non-touristy', //       /10-สถานที่และสิ่งน่าสนใจ/                     PAIR
  2385: 'scalp-problems', //             /ปัญหาหนังศีรษะ/
  2388: 'first-treatment-review', //     /รักษาผมร่วงครั้งแรก/
  2596: 'scalp-root-cause', //           /แก้ปัญหาหนังศีรษะแบบถึ/
  3023: 'salon-review-bangkok', //       /รีวิว-ซาลอนทำทรีทเม้นท์/
  3331: 'how-to-wash-hair', //           /สระผมให้ถูกวิธี/
  3437: 'beat-hair-loss', //             /พิชิตผมร่วงกับบีชู/
  8307: 'five-helpers-women', //         /5-ตัวช่วยเรื่องผมร่วงของ/
};

/** Expected shape of the batch, asserted by 11's --dry so drift fails loudly. */
export const EXPECT = { posts: 21, en: 10, th: 11, pairs: 4, enOnly: 6, thOnly: 7, keys: 17 };

export function keyFor(wpId) {
  return KEY_BY_WPID[wpId] ?? `unmatched-${wpId}`;
}
