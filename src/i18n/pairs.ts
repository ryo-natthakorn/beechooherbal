// src/i18n/pairs.ts
// The single source of truth for EN <-> TH page pairings.
// Populate this from inventory/en-th-map.csv. Paths are DECODED and
// RELATIVE (no domain), with a leading and trailing slash.
// A page with no twin in the other language simply does not appear here.

import { EVENT_PAIRS } from "../data/events";
import { BLOG_PAIRS } from "../data/blog";

export interface Pair {
  en: string | null; // e.g. "/about/"            (null if no EN twin)
  th: string | null; // e.g. "/th/home/"          (null if no TH twin)
}

// --- DATA: the 17 verified content pairs from inventory/en-th-map.csv -------
// Populated + re-verified against the live site 2026-07-14 (see
// docs/session-2026-07-14-audit.md). Thai paths are decoded here; SEOHead
// percent-encodes them when building absolute hreflang URLs, which is valid.
const CORE_PAIRS: Pair[] = [
  { en: "/", th: "/th/home/" }, // homepage: TH home lives at /th/home/, not /th/
  { en: "/about/", th: "/th/เกี่ยวกับบีชู/" },
  { en: "/team/", th: "/th/ทีม/" },
  { en: "/locations/", th: "/th/สถานที่ตั้งของร้านค้า/" },
  { en: "/frequently-asked-questions/", th: "/th/คำถามที่พบบ่อย/" },
  { en: "/reviews-and-testimonials-of-bee-choo-origin-treatment/", th: "/th/รีวิวทรีทเม้นท์ที่ดี/" },
  { en: "/scalp-hair-loss-treatment-salon-clinic-in-bangkok/", th: "/th/ซาลอน-คลินิกรักษาผมร่วง/" },
  { en: "/herbal-treatment-to-get-rid-of-oily-scalp-hair/", th: "/th/วิธีแก้หนังศีรษะมัน/" },
  { en: "/cure-dandruff-hair-with-herbal-treatment/", th: "/th/รักษารังแค-ขจัดรังแค-ให้/" },
  { en: "/reverse-premature-grey-white-hair-by-herbal-treatment/", th: "/th/ปิดผมหงอกวิธีธรรมชาติ/" },
  { en: "/repair-chemically-damaged-dry-hair-with-herbal-treatment/", th: "/th/แก้ผมเสียเร่งด่วน/" },
  { en: "/herbal-treatment-cure-for-bacteria-infection-alopecia-areata-and-other-hair-diseases/", th: "/th/หนังศีรษะติดเชื้อ/" },
  { en: "/postpartum-hair-loss-treatment-in-thailand/", th: "/th/ภาวะผมร่วงเฉียบพลันของ/" },
  { en: "/hair-transplant-vs-stem-cell-vs-keratin-treatment-vs-natural-herbal-treatment/", th: "/th/สมุนไพร-vs-การปลูกผม/" },
  { en: "/hair-loss-treatment-cost-in-thailand-prices-revealed/", th: "/th/ราคาการทำทรีทเม้นท์/" },
  { en: "/bee-choo-hair-care-products/", th: "/th/แชมพูบีชูป้องกันผมร่วง/" },
  // medium confidence — get native-speaker/Crispin sign-off before launch:
  { en: "/events-news-release/", th: "/th/เหตุการณ์และข่าว/" },

  // Archive pair — target CORRECTED vs en-th-map.csv after the 2026-07-14 live check
  // (the CSV records what the old site's hreflang literally says, which is stale).
  // /th/category/blog-th/ (old hreflang) 301s to the real, live Thai blog index.
  // Both sides of this pair are BUILT as of the blog batch, so it is no longer inert.
  { en: "/category/blog/", th: "/th/category/บล็อก/" },
  // The author archives (/author/admin/ + /th/author/admin/) were paired here — the old
  // site's only complete hreflang cluster. REMOVED deliberately: no author archive is
  // rebuilt (an "Admin" byline archive duplicates the blog index and every post shares
  // the one author), so both URLs 301 to the blog index in vercel.json. Keeping the pair
  // would make SEOHead advertise a redirecting URL as an hreflang alternate.
];

// The 15 EVENTS/News post pairs come from src/data/events.ts rather than being
// retyped here — that file is where the pairing is derived and justified, and the
// posts' Thai slugs are long, percent-encoded, and in one case actively misleading
// (`...ประเวศ...-2567-2` is the Chatuchak post). Import direction is one-way
// (events.ts imports nothing from here), so getPair stays synchronous.
//
// The three EN-only event posts are absent by design: a page with no twin must emit
// NO hreflang cluster, which is what an undefined getPair() lookup produces.
export const PAIRS: Pair[] = [
  ...CORE_PAIRS,
  ...EVENT_PAIRS.map(({ en, th }): Pair => ({ en, th })),
  // Only 4 of the 21 blog articles have a twin — see BLOG_PAIRS' header. The other 17
  // are absent on purpose so they emit no hreflang cluster at all.
  ...BLOG_PAIRS.map(({ en, th }): Pair => ({ en, th })),
];
// ---------------------------------------------------------------------------

// Normalize any path to a stable lookup key: decode %-encoding, ensure a
// trailing slash. This lets an encoded incoming path match a decoded key.
function normKey(p: string): string {
  let s = p;
  try {
    s = decodeURIComponent(p);
  } catch {
    /* leave as-is if it's not valid encoding */
  }
  if (s === "/") return "/";
  const last = s.split("/").pop() ?? "";
  if (last.includes(".")) return s; // looks like a file, don't add a slash
  return s.endsWith("/") ? s : s + "/";
}

// Build a lookup that works from EITHER side of the pair.
const lookup = new Map<string, Pair>();
for (const pair of PAIRS) {
  if (pair.en) lookup.set(normKey(pair.en), pair);
  if (pair.th) lookup.set(normKey(pair.th), pair);
}

/** Returns the pair this path belongs to, or undefined if it's an orphan. */
export function getPair(pathname: string): Pair | undefined {
  return lookup.get(normKey(pathname));
}
