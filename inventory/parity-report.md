# Bee Choo Herbal — Phase 1 Inventory & EN/TH Parity Report

Generated: 2026-06-22T08:49:36.845Z  ·  Source: https://beechooherbal.com

## ⚠ Headline finding — the bilingual site is NOT wired together

The EN and TH pages exist in parallel but are **not linked as translations anywhere the
machine can read**. Three independent signals confirm it:

1. **hreflang is self-referential.** Content pages emit only `hreflang="en"`→themselves
   (+`x-default`→themselves); `/th/` pages emit only `hreflang="th"`→themselves. Neither
   side points at its translation. (e.g. `/about/` does NOT link to `/th/เกี่ยวกับบีชู/`.)
2. **The WPML language switcher falls back to `/th/`.** On every content page the TH
   switcher link is `https://beechooherbal.com/th/` (the Thai home) — WPML's behaviour
   when a page has *no registered translation*.
3. **The REST page objects carry no translation fields** (no `translations`/`wpml_*`).

Only 2 objects have genuine cross-language hreflang (the blog category and the author
archive), and even those point at TH URLs that are **not in the sitemap**.

**Consequence:** there is no on-site EN↔TH map to harvest. The map below is built from the
2 real hreflang pairs **plus 17 pairs matched semantically** by reading the live Thai +
English titles (flagged `source=semantic`). Wiring up correct hreflang/translation links is
the #1 SEO task for the rebuild.

## Summary

| Metric | Count |
|---|---|
| Total URLs in sitemap | 92 |
| English pages (by content) | 49 |
| Thai pages (by content) | 43 |
| Working hreflang pairs on live site | 2 |
| EN↔TH pairs in usable map (hreflang + semantic) | 19 |
| — of which high/medium-confidence semantic | 17 |
| Orphan EN (no TH twin, after semantic matching) | 30 |
| Orphan TH (no EN twin, after semantic matching) | 26 |
| Thai content living at the root (lang≠path) | 26 |
| Sitemap URLs that 301-redirect away | 1 |
| Non-200 URLs | 1 |
| Near-duplicate slugs | 1 |

## Structural anomalies

### Home / `/th/` behaviour (live, redirects not followed)

| Path | Status | Redirects to |
|---|---|---|
| `/` | 200 | — |
| `/th/` | 301 | `https://beechooherbal.com/th/home/` |
| `/th/home/` | 200 | — |

- **English home** = bare `/` (200). **Thai home** = `/th/home/` (200).
- `/th/` itself **301-redirects to `/th/home/`** — confirmed. So the Thai home is `/th/home/`, not `/th/`.

### Sitemap URLs that redirect (should not be in a sitemap)

| Sitemap URL | Redirects (followed) to | Note |
|---|---|---|
| https://beechooherbal.com/5-causes-of-hair-loss-and-where-to-find-hair-treatment-in-thailand/ | https://beechooherbal.com/wp-content/uploads/2018/07/5-CAUSES-OF-HAIR-LOSS-AND-WHERE-TO-FIND-HAIR-TREATMENT-IN-THAILAND.jpg | ⚠ lands on an IMAGE — broken permalink/redirect loop |

### Non-200 URLs

| URL | Status | Note |
|---|---|---|
| https://beechooherbal.com/suffering-from-alopecia-hair-loss-natural-herbal-treatment-in-bangkok-thailand/ | 500 | recover content via HTML scrape (REST unavailable) |

### WP REST `posts` endpoint is broken

`/wp-json/wp/v2/posts` returns **HTTP 500 for every variant** (default, `&lang=th`, `&lang=en`).
Blog/event **post** content therefore cannot be pulled via REST and must be scraped from HTML
in Phase 4. (At least one corrupt post — `/suffering-from-alopecia-.../` — 500s individually and
almost certainly breaks the whole collection query.) The REST **pages** endpoint works fine.

### Near-duplicate pages

- Near-duplicate slug: `/grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567-2/` vs `/grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567/` (WordPress `-N` suffix)
- Duplicate `<title>` "Home - Bee Choo Herbal":
  - https://beechooherbal.com/ _(en)_
  - https://beechooherbal.com/th/home/ _(th)_

### Canonical points elsewhere

| URL | Canonical |
|---|---|
| https://beechooherbal.com/ช่วยเหลือเหล่าเด็กๆ-ที่/ | https://beechooherbal.com/th/ช่วยเหลือเหล่าเด็กๆ-ที่/ |
| https://beechooherbal.com/แก้ปัญหาหนังศีรษะแบบถึ/ | https://beechooherbal.com/th/แก้ปัญหาหนังศีรษะแบบถึ/ |
| https://beechooherbal.com/โรคผมร่วงและทรีทเม้นท์/ | https://beechooherbal.com/th/โรคผมร่วงและทรีทเม้นท์/ |
| https://beechooherbal.com/10-most-possible-causes-of-hair-loss-in-young-women/ | https://beechooherbal.com/th/10-most-possible-causes-of-hair-loss-in-young-women/ |
| https://beechooherbal.com/bee-choo-siam-grand-opening/ | https://beechooherbal.com/th/bee-choo-siam-grand-opening/ |
| https://beechooherbal.com/bee-choo-siam-square-make-merit/ | https://beechooherbal.com/th/bee-choo-siam-square-make-merit/ |
| https://beechooherbal.com/bee-choo-udomsuk-grand-opening-23-sept-2018/ | https://beechooherbal.com/th/bee-choo-udomsuk-grand-opening-23-sept-2018/ |
| https://beechooherbal.com/grand-opening-บีชู-สาขาสยามสแควร์วั/ | https://beechooherbal.com/th/grand-opening-บีชู-สาขาสยามสแควร์วั/ |
| https://beechooherbal.com/grand-opening-บีชู-สาขาอุดมสุข-23-กันยา/ | https://beechooherbal.com/th/grand-opening-บีชู-สาขาอุดมสุข-23-กันยา/ |
| https://beechooherbal.com/introducing-essence-shampoo-and-newly-formulated-essence-vitamins/ | https://beechooherbal.com/th/introducing-essence-shampoo-and-newly-formulated-essence-vitamins/ |
| https://beechooherbal.com/naan-charity-trip-2019/ | https://beechooherbal.com/th/naan-charity-trip-2019/ |

## Language does not match path — Thai content at the root

These 26 URLs serve **Thai** content but live at the **root** (English URL space),
not under `/th/`. `<html lang>`/`og:locale` wrongly report `en-US`; the Thai script in the slug
+ title is what reveals them. They are Thai blog/event posts that were never placed in the `/th/` tree.

| URL | Title |
|---|---|
| https://beechooherbal.com/ขอแนะนำ-essence-shampoo-และ-essence-vitamins-สูตรใหม่/ | ขอแนะนำ Essence Shampoo และ Essence Vitamins สูตรใหม่ - Bee Choo Herbal |
| https://beechooherbal.com/ช่วยเหลือเหล่าเด็กๆ-ที่/ | ช่วยเหลือเหล่าเด็กๆ ที่จังหวัดน่าน - Bee Choo Herbal |
| https://beechooherbal.com/ทำบุญเปิดร้านสาขาสยามส/ | ทำบุญเปิดร้านสาขาสยามสแควร์วัน - Bee Choo Herbal |
| https://beechooherbal.com/ทำไมหนังศีรษะของฉันถึง/ | ทำไมหนังศีรษะของฉันถึงแห้ง จะมีวิธีป้องกันหนังศีรษะแห้งหรือไม่? - Bee Choo Herbal |
| https://beechooherbal.com/บีชูชลบุรีสาขาแรกนอกเข/ | บีชูชลบุรี, สาขาแรกนอกเขตกรุงเทพ! - Bee Choo Herbal |
| https://beechooherbal.com/ปัญหาหนังศีรษะ/ | ปัญหาหนังศีรษะ…มีใครเป็นเหมือนกันบ้างคะ? - Bee Choo Herbal |
| https://beechooherbal.com/พิชิตผมร่วงกับบีชู/ | พิชิตผมร่วงผมมันและรังแคกับบีชู - Bee Choo Herbal Thailand |
| https://beechooherbal.com/รักษาผมร่วงครั้งแรก/ | รีวิวการทำทรีทเม้นท์รักษาผมร่วงครั้งแรกที่บีชู - Bee Choo Herbal |
| https://beechooherbal.com/รีวิว-ซาลอนทำทรีทเม้นท์/ | รีวิว: ซาลอนทำทรีทเม้นท์ผมในกรุงเทพมหานคร - Bee Choo Herbal |
| https://beechooherbal.com/สระผมให้ถูกวิธี/ | สระผมให้ถูกวิธีทำอย่างไร มาดูกัน! - Bee Choo Herbal |
| https://beechooherbal.com/อะไรเป็นสาเหตุของผมขาว/ | อะไรเป็นสาเหตุของผมขาว และจะย้อมผมด้วยวิธีธรรมชาติได้อย่างไร |
| https://beechooherbal.com/แก้ปัญหาหนังศีรษะแบบถึ/ | แก้ปัญหาหนังศีรษะแบบถึงรากถึงโคนด้วยสมุนไพร - Bee Choo Herbal |
| https://beechooherbal.com/โรคผมร่วงและทรีทเม้นท์/ | โรคผมร่วงชนิดต่างๆ \| โรคผมร่วงเป็นหย่อม \| วิธีแก้ปัญหาผมร่วง \| ทรีทเม้นท์สำหรับโรคผมร่วง |
| https://beechooherbal.com/10-สถานที่และสิ่งน่าสนใจ/ | 10 สถานที่และสิ่งน่าสนใจในกรุงเทพ - Bee Choo Herbal |
| https://beechooherbal.com/5-ตัวช่วยเรื่องผมร่วงของ/ | 5 ตัวช่วยเรื่องผมร่วงของผู้หญิงในประเทศไทย - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567-2/ | Grand Opening บีชู สาขาจตุจักร (ประชาชื่น) 3 สิงหาคม 2567 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567/ | Grand Opening บีชู สาขาประเวศ  7 กรกฎาคม 2567 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาพุทธมณฑล-ในวั/ | Grand Opening บีชู สาขาพุทธมณฑล ในวันที่ 20 กันยายน 2568 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาสยามสแควร์วั/ | Grand Opening บีชู สาขาสยามสแควร์วัน - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาอุดมสุข-23-กันยา/ | Grand Opening บีชู สาขาอุดมสุข 23 กันยายน 2561 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาเชียงใหม่-ในว/ | Grand Opening บีชู สาขาเชียงใหม่ ในวันที่ 6 กันยายน 2568 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาเดอะคริสตัล-เ/ | Grand Opening บีชู สาขาเดอะคริสตัล (เอกมัย-รามอินทรา) 18 พฤศจิกายน 2566 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาโคราช-ในวันที/ | Grand Opening บีชู สาขาโคราช ในวันที่ 11 มกราคม 2568 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สุราษฎร์ธานี-ในวั/ | Grand Opening บีชู สาขาสุราษฎร์ธานี ในวันที่ 7 มีนาคม 2568 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-สาขาสัมมากร/ | Grand Opening บีชู สาขาสัมมากร 24 มีนาคม 2567 - Bee Choo Herbal |
| https://beechooherbal.com/soft-opening-บช-สาขาสขสวสดในวนท-19-กนย/ | Soft Opening บีชู สาขาสุขสวัสดิ์ในวันที่ 19 กันยายน 2567 - Bee Choo Herbal |

## Orphan EN pages (no Thai twin, after semantic matching)

Count: **30** — mostly English blog/event posts. (Privacy Policy has no Thai version.)

| EN URL | Title |
|---|---|
| https://beechooherbal.com/10-most-possible-causes-of-hair-loss-in-young-women/ | 10 MOST POSSIBLE CAUSES OF HAIR LOSS IN YOUNG WOMEN - Bee Choo Herbal |
| https://beechooherbal.com/12-best-family-places-to-visit-in-bangkok/ | 12 best family places to visit in Bangkok - Bee Choo Herbal |
| https://beechooherbal.com/5-causes-of-hair-loss-and-where-to-find-hair-treatment-in-thailand/ |  |
| https://beechooherbal.com/bee-choo-siam-grand-opening/ | Bee Choo Siam Grand Opening - Bee Choo Herbal |
| https://beechooherbal.com/bee-choo-siam-square-make-merit/ | Bee Choo Siam Square Make Merit (Tam Buun) - Bee Choo Herbal |
| https://beechooherbal.com/bee-choo-udomsuk-grand-opening-23-sept-2018/ | Bee Choo Udomsuk Grand Opening 23 Sept 2018 - Bee Choo Herbal |
| https://beechooherbal.com/category/events-news/ | EVENTS/News Archives - Bee Choo Herbal |
| https://beechooherbal.com/chill-places-bangkok/ | Chill Out Places to visit in Bangkok, Thailand - Bee Choo Herbal |
| https://beechooherbal.com/dye-white-hair-naturally/ | WHAT CAUSES WHITE HAIR? HOW TO DYE HAIR NATURALLY? - Bee Choo Herbal |
| https://beechooherbal.com/first-outlet-outside-of-bangkok-bee-choo-chonburi/ | First Outlet outside of Bangkok! Bee Choo Chonburi - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-of-new-outlet-bee-choo-chatuchak/ | Grand Opening of New outlet - Bee Choo Chatuchak (Prachachuen)! - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-of-new-outlet-bee-choo-chiang-mai/ | Grand Opening of New outlet - Bee Choo Star Avenue 5, Chiang Mai - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-of-new-outlet-bee-choo-korat/ | Grand Opening of New outlet - Bee Choo Korat ! - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-of-new-outlet-bee-choo-phutthamonthon/ | Grand Opening of New outlet - Bee Choo Phutthamonthon - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-of-new-outlet-bee-choo-prawet/ | Grand Opening of New outlet - Bee Choo Prawet ! - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-of-new-outlet-bee-choo-sammakorn/ | Grand Opening of New outlet - Bee Choo Sammakorn ! - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-of-new-outlet-bee-choo-surat-thani/ | Grand Opening of New outlet - Bee Choo Surat Thani ! - Bee Choo Herbal |
| https://beechooherbal.com/introducing-essence-shampoo-and-newly-formulated-essence-vitamins/ | Introducing Essence Shampoo and Newly Formulated Essence Vitamins - Bee Choo Herbal |
| https://beechooherbal.com/male-pattern-baldness-treatment-in-bangkok-causes-symptoms-of-hair-loss/ | MALE PATTERN BALDNESS - Treatment in Bangkok, Causes, Symptoms of hair loss - Bee Choo Herbal |
| https://beechooherbal.com/naan-charity-trip-2019/ | Naan Charity Trip 2019 - Bee Choo Herbal |
| https://beechooherbal.com/new-outlet-saimai-krungthepkreetha/ | New Outlets! Bee Choo Sai Mai and Krungthep Kreetha! - Bee Choo Herbal |
| https://beechooherbal.com/new-year-new-outlet-bee-choo-ratchada/ | New year new outlet! Bee Choo Ratchada - Bee Choo Herbal |
| https://beechooherbal.com/opening-of-new-outlet-bee-choo-kallapaphruk/ | Opening of New outlet - Bee Choo Kallapaphruk! - Bee Choo Herbal |
| https://beechooherbal.com/opening-of-new-outlet-bee-choo-thecrystalparkekamai-ramindra/ | Grand Opening of New outlet - Bee Choo The Crystal Ekamai-Ramindra! - Bee Choo Herbal |
| https://beechooherbal.com/privacy-policy/ | Privacy Policy - Bee Choo Herbal |
| https://beechooherbal.com/scalp-dry-ways-combat-dry-scalp/ | WHY IS MY SCALP DRY? WAYS TO COMBAT DRY SCALP? - Bee Choo Herbal |
| https://beechooherbal.com/soft-opening-of-new-outlet-bee-choo-suksawat/ | Soft Opening of New outlet - Bee Choo Suksawat ! - Bee Choo Herbal |
| https://beechooherbal.com/suffering-from-alopecia-hair-loss-natural-herbal-treatment-in-bangkok-thailand/ |  |
| https://beechooherbal.com/suffering-from-mild-hair-loss-in-your-30s-she-found-the-perfect-solution/ | Suffering from mild hair loss in your 30s? She found the perfect solution! - Bee Choo Herbal |
| https://beechooherbal.com/top-10-non-touristy-things-to-do-in-bangkok/ | Top 10 Non-touristy things to do in bangkok - Bee Choo Herbal |

## Orphan TH pages (no English twin, after semantic matching)

Count: **26** — the Thai blog/event posts at the root.

| TH URL | Title |
|---|---|
| https://beechooherbal.com/ขอแนะนำ-essence-shampoo-และ-essence-vitamins-สูตรใหม่/ | ขอแนะนำ Essence Shampoo และ Essence Vitamins สูตรใหม่ - Bee Choo Herbal |
| https://beechooherbal.com/ช่วยเหลือเหล่าเด็กๆ-ที่/ | ช่วยเหลือเหล่าเด็กๆ ที่จังหวัดน่าน - Bee Choo Herbal |
| https://beechooherbal.com/ทำบุญเปิดร้านสาขาสยามส/ | ทำบุญเปิดร้านสาขาสยามสแควร์วัน - Bee Choo Herbal |
| https://beechooherbal.com/ทำไมหนังศีรษะของฉันถึง/ | ทำไมหนังศีรษะของฉันถึงแห้ง จะมีวิธีป้องกันหนังศีรษะแห้งหรือไม่? - Bee Choo Herbal |
| https://beechooherbal.com/บีชูชลบุรีสาขาแรกนอกเข/ | บีชูชลบุรี, สาขาแรกนอกเขตกรุงเทพ! - Bee Choo Herbal |
| https://beechooherbal.com/ปัญหาหนังศีรษะ/ | ปัญหาหนังศีรษะ…มีใครเป็นเหมือนกันบ้างคะ? - Bee Choo Herbal |
| https://beechooherbal.com/พิชิตผมร่วงกับบีชู/ | พิชิตผมร่วงผมมันและรังแคกับบีชู - Bee Choo Herbal Thailand |
| https://beechooherbal.com/รักษาผมร่วงครั้งแรก/ | รีวิวการทำทรีทเม้นท์รักษาผมร่วงครั้งแรกที่บีชู - Bee Choo Herbal |
| https://beechooherbal.com/รีวิว-ซาลอนทำทรีทเม้นท์/ | รีวิว: ซาลอนทำทรีทเม้นท์ผมในกรุงเทพมหานคร - Bee Choo Herbal |
| https://beechooherbal.com/สระผมให้ถูกวิธี/ | สระผมให้ถูกวิธีทำอย่างไร มาดูกัน! - Bee Choo Herbal |
| https://beechooherbal.com/อะไรเป็นสาเหตุของผมขาว/ | อะไรเป็นสาเหตุของผมขาว และจะย้อมผมด้วยวิธีธรรมชาติได้อย่างไร |
| https://beechooherbal.com/แก้ปัญหาหนังศีรษะแบบถึ/ | แก้ปัญหาหนังศีรษะแบบถึงรากถึงโคนด้วยสมุนไพร - Bee Choo Herbal |
| https://beechooherbal.com/โรคผมร่วงและทรีทเม้นท์/ | โรคผมร่วงชนิดต่างๆ \| โรคผมร่วงเป็นหย่อม \| วิธีแก้ปัญหาผมร่วง \| ทรีทเม้นท์สำหรับโรคผมร่วง |
| https://beechooherbal.com/10-สถานที่และสิ่งน่าสนใจ/ | 10 สถานที่และสิ่งน่าสนใจในกรุงเทพ - Bee Choo Herbal |
| https://beechooherbal.com/5-ตัวช่วยเรื่องผมร่วงของ/ | 5 ตัวช่วยเรื่องผมร่วงของผู้หญิงในประเทศไทย - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567-2/ | Grand Opening บีชู สาขาจตุจักร (ประชาชื่น) 3 สิงหาคม 2567 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567/ | Grand Opening บีชู สาขาประเวศ  7 กรกฎาคม 2567 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาพุทธมณฑล-ในวั/ | Grand Opening บีชู สาขาพุทธมณฑล ในวันที่ 20 กันยายน 2568 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาสยามสแควร์วั/ | Grand Opening บีชู สาขาสยามสแควร์วัน - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาอุดมสุข-23-กันยา/ | Grand Opening บีชู สาขาอุดมสุข 23 กันยายน 2561 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาเชียงใหม่-ในว/ | Grand Opening บีชู สาขาเชียงใหม่ ในวันที่ 6 กันยายน 2568 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาเดอะคริสตัล-เ/ | Grand Opening บีชู สาขาเดอะคริสตัล (เอกมัย-รามอินทรา) 18 พฤศจิกายน 2566 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สาขาโคราช-ในวันที/ | Grand Opening บีชู สาขาโคราช ในวันที่ 11 มกราคม 2568 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-บีชู-สุราษฎร์ธานี-ในวั/ | Grand Opening บีชู สาขาสุราษฎร์ธานี ในวันที่ 7 มีนาคม 2568 - Bee Choo Herbal |
| https://beechooherbal.com/grand-opening-สาขาสัมมากร/ | Grand Opening บีชู สาขาสัมมากร 24 มีนาคม 2567 - Bee Choo Herbal |
| https://beechooherbal.com/soft-opening-บช-สาขาสขสวสดในวนท-19-กนย/ | Soft Opening บีชู สาขาสุขสวัสดิ์ในวันที่ 19 กันยายน 2567 - Bee Choo Herbal |

## WP REST content pull

- **pages**: {"default":18,"th":17,"en":18}  → 18 EN + 17 TH = 35 (matches the page-sitemap).
- **posts**: {"default":0,"th":0,"en":0}  → ⚠ all variants 500 (see above).
- WPML `&lang=` filtering works for pages (en=18, th=17), confirming pages are *language-assigned*
  even though they are not *translation-linked*.

## Confirmed + proposed EN↔TH pairs (side by side)

Usable map: **19** pairs (2 live hreflang, 17 semantic). Full data in `en-th-map.csv`.

| EN URL | TH URL | Source | Conf. | EN title | TH title |
|---|---|---|---|---|---|
| https://beechooherbal.com/ | https://beechooherbal.com/th/home/ | semantic | high | Home - Bee Choo Herbal | Home - Bee Choo Herbal |
| https://beechooherbal.com/about/ | https://beechooherbal.com/th/เกี่ยวกับบีชู/ | semantic | high | ABOUT - Bee Choo Herbal | เกี่ยวกับบีชู ซาลอน/คลินิก รักษาผมที่ดีที่สุดในประเทศไทย |
| https://beechooherbal.com/author/admin/ | https://beechooherbal.com/th/author/admin/ | hreflang | confirmed | Admin, Author at Bee Choo Herbal |  |
| https://beechooherbal.com/bee-choo-hair-care-products/ | https://beechooherbal.com/th/แชมพูบีชูป้องกันผมร่วง/ | semantic | high | Bee Choo Hair Care Products - Bee Choo Herbal | แชมพูบีชูและผลิตภัณฑ์ป้องกันผมร่วง - Bee Choo Herbal |
| https://beechooherbal.com/category/blog/ | https://beechooherbal.com/th/category/blog-th/ | hreflang | confirmed | BLOG Archives - Bee Choo Herbal |  |
| https://beechooherbal.com/cure-dandruff-hair-with-herbal-treatment/ | https://beechooherbal.com/th/รักษารังแค-ขจัดรังแค-ให้/ | semantic | high | Cure Dandruff Hair with Herbal Treatment - Bee Choo Herbal | วิธีขจัดรังแคและความคันอย่างเร่งด่วน - บีชู เฮอร์เบิล |
| https://beechooherbal.com/events-news-release/ | https://beechooherbal.com/th/เหตุการณ์และข่าว/ | semantic | medium | Events and News - Bee Choo Herbal | เหตุการณ์และข่าว - Bee Choo Herbal |
| https://beechooherbal.com/frequently-asked-questions/ | https://beechooherbal.com/th/คำถามที่พบบ่อย/ | semantic | high | Frequently Asked Questions - Bee Choo Herbal | คำถามที่พบบ่อยจากลูกค้า - |
| https://beechooherbal.com/hair-loss-treatment-cost-in-thailand-prices-revealed/ | https://beechooherbal.com/th/ราคาการทำทรีทเม้นท์/ | semantic | high | What is the Hair Loss Treatment Cost in Thailand? Prices revealed - Bee Choo Herbal | ราคาการทำทรีทเม้นท์รักษาปัญหาผมร่วงในประเทศไทยเป็นอย่างไร? - Bee Choo Herbal |
| https://beechooherbal.com/hair-transplant-vs-stem-cell-vs-keratin-treatment-vs-natural-herbal-treatment/ | https://beechooherbal.com/th/สมุนไพร-vs-การปลูกผม/ | semantic | high | Hair transplant vs stem cell vs keratin treatment vs natural herbal treatment - Bee Choo Herbal | ทรีทเม้นท์สมุนไพร vs การปลูกผม - Bee Choo Herbal |
| https://beechooherbal.com/herbal-treatment-cure-for-bacteria-infection-alopecia-areata-and-other-hair-diseases/ | https://beechooherbal.com/th/หนังศีรษะติดเชื้อ/ | semantic | high | Herbal Treatment Cure for Bacteria Infection, Alopecia Areata and other hair diseases - Bee Choo Herbal | ทรีทเม้นท์สมุนไพรรักษาเชื้อแบคทีเรีย ผมร่วงเป็นหย่อม และปัญหาผมอื่นๆ |
| https://beechooherbal.com/herbal-treatment-to-get-rid-of-oily-scalp-hair/ | https://beechooherbal.com/th/วิธีแก้หนังศีรษะมัน/ | semantic | high | Herbal Treatment to get rid of oily scalp - Bee Choo Herbal | ลดหนังศีรษะมันและคันหรือมีกลิ่นเหม็นด้วยทรีทเม้นท์ธรรมชาติ - Bee Choo Herbal |
| https://beechooherbal.com/locations/ | https://beechooherbal.com/th/สถานที่ตั้งของร้านค้า/ | semantic | high | Locations - Bee Choo Herbal | สถานที่ตั้งของร้านค้า - บีชู ไทยแลนด์ |
| https://beechooherbal.com/postpartum-hair-loss-treatment-in-thailand/ | https://beechooherbal.com/th/ภาวะผมร่วงเฉียบพลันของ/ | semantic | high | Postpartum Hair Loss Treatment in Thailand - Bee Choo Herbal | ทรีตเมนต์แก้ปัญหาผมร่วงสำหรับคุณแม่หลังคลอด​ในประเทศไทย - Bee Choo Herbal |
| https://beechooherbal.com/repair-chemically-damaged-dry-hair-with-herbal-treatment/ | https://beechooherbal.com/th/แก้ผมเสียเร่งด่วน/ | semantic | high | Repair Chemically Damaged Dry Hair with Herbal Treatment - Bee Choo Herbal | แก้ปัญหาผมเสียจากสารเคมีเร่งด่วนด้วยสมุนไพร - Bee Choo (บีชู เฮอร์เบิล) |
| https://beechooherbal.com/reverse-premature-grey-white-hair-by-herbal-treatment/ | https://beechooherbal.com/th/ปิดผมหงอกวิธีธรรมชาติ/ | semantic | high | Reverse Premature Grey White Hair by Herbal Treatment - Bee Choo Herbal | ปิดผมหงอกและผมขาวโดยวิธีธรรมชาติ - Bee Choo Herbal |
| https://beechooherbal.com/reviews-and-testimonials-of-bee-choo-origin-treatment/ | https://beechooherbal.com/th/รีวิวทรีทเม้นท์ที่ดี/ | semantic | high | Reviews and Testimonials of Bee Choo Origin Treatment - Bee Choo Herbal | รีวิว ทรีทเม้นท์ บี ชู ออริจิน และการการันตีจากลูกค้า - Bee Choo Herbal |
| https://beechooherbal.com/scalp-hair-loss-treatment-salon-clinic-in-bangkok/ | https://beechooherbal.com/th/ซาลอน-คลินิกรักษาผมร่วง/ | semantic | high | Scalp Hair Loss Treatment Salon Clinic in Bangkok - Bee Choo Herbal | ซาลอน/ คลินิกรักษาผมร่วง คลินิกรักษาผมบาง ในกรุงเทพ - Bee Choo Herbal |
| https://beechooherbal.com/team/ | https://beechooherbal.com/th/ทีม/ | semantic | high | TEAM - Bee Choo Herbal | ทีม - เจ้าของและผู้บริหาร บีชู |

> `semantic` rows are inferred from the live titles (the site has no translation links). High
> confidence = title meanings match directly; `medium` (events page) should get a native-speaker check.

## Candidate event-post pairs (Phase 4 — needs content review)

12 English and 11 Thai outlet-opening posts exist. They cover the same
grand openings in two languages but are NOT linked on the site. **The two lists below are NOT
row-aligned** — pair them by *branch from the title* during blog migration (note: at least one
Thai slug is misleading, e.g. a `...ประเวศ...-2567-2` slug whose title is actually สาขาจตุจักร/Chatuchak).

**English opening posts:**

- /bee-choo-siam-grand-opening/ — Bee Choo Siam Grand Opening - Bee Choo Herbal
- /bee-choo-udomsuk-grand-opening-23-sept-2018/ — Bee Choo Udomsuk Grand Opening 23 Sept 2018 - Bee Choo Herbal
- /grand-opening-of-new-outlet-bee-choo-chatuchak/ — Grand Opening of New outlet - Bee Choo Chatuchak (Prachachuen)! - Bee Choo Herbal
- /grand-opening-of-new-outlet-bee-choo-chiang-mai/ — Grand Opening of New outlet - Bee Choo Star Avenue 5, Chiang Mai - Bee Choo Herbal
- /grand-opening-of-new-outlet-bee-choo-korat/ — Grand Opening of New outlet - Bee Choo Korat ! - Bee Choo Herbal
- /grand-opening-of-new-outlet-bee-choo-phutthamonthon/ — Grand Opening of New outlet - Bee Choo Phutthamonthon - Bee Choo Herbal
- /grand-opening-of-new-outlet-bee-choo-prawet/ — Grand Opening of New outlet - Bee Choo Prawet ! - Bee Choo Herbal
- /grand-opening-of-new-outlet-bee-choo-sammakorn/ — Grand Opening of New outlet - Bee Choo Sammakorn ! - Bee Choo Herbal
- /grand-opening-of-new-outlet-bee-choo-surat-thani/ — Grand Opening of New outlet - Bee Choo Surat Thani ! - Bee Choo Herbal
- /opening-of-new-outlet-bee-choo-kallapaphruk/ — Opening of New outlet - Bee Choo Kallapaphruk! - Bee Choo Herbal
- /opening-of-new-outlet-bee-choo-thecrystalparkekamai-ramindra/ — Grand Opening of New outlet - Bee Choo The Crystal Ekamai-Ramindra! - Bee Choo Herbal
- /soft-opening-of-new-outlet-bee-choo-suksawat/ — Soft Opening of New outlet - Bee Choo Suksawat ! - Bee Choo Herbal

**Thai opening posts:**

- /grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567-2/ — Grand Opening บีชู สาขาจตุจักร (ประชาชื่น) 3 สิงหาคม 2567 - Bee Choo Herbal
- /grand-opening-บช-สาขาประเวศ-7-กรกฎาคม-2567/ — Grand Opening บีชู สาขาประเวศ  7 กรกฎาคม 2567 - Bee Choo Herbal
- /grand-opening-บีชู-สาขาพุทธมณฑล-ในวั/ — Grand Opening บีชู สาขาพุทธมณฑล ในวันที่ 20 กันยายน 2568 - Bee Choo Herbal
- /grand-opening-บีชู-สาขาสยามสแควร์วั/ — Grand Opening บีชู สาขาสยามสแควร์วัน - Bee Choo Herbal
- /grand-opening-บีชู-สาขาอุดมสุข-23-กันยา/ — Grand Opening บีชู สาขาอุดมสุข 23 กันยายน 2561 - Bee Choo Herbal
- /grand-opening-บีชู-สาขาเชียงใหม่-ในว/ — Grand Opening บีชู สาขาเชียงใหม่ ในวันที่ 6 กันยายน 2568 - Bee Choo Herbal
- /grand-opening-บีชู-สาขาเดอะคริสตัล-เ/ — Grand Opening บีชู สาขาเดอะคริสตัล (เอกมัย-รามอินทรา) 18 พฤศจิกายน 2566 - Bee Choo Herbal
- /grand-opening-บีชู-สาขาโคราช-ในวันที/ — Grand Opening บีชู สาขาโคราช ในวันที่ 11 มกราคม 2568 - Bee Choo Herbal
- /grand-opening-บีชู-สุราษฎร์ธานี-ในวั/ — Grand Opening บีชู สาขาสุราษฎร์ธานี ในวันที่ 7 มีนาคม 2568 - Bee Choo Herbal
- /grand-opening-สาขาสัมมากร/ — Grand Opening บีชู สาขาสัมมากร 24 มีนาคม 2567 - Bee Choo Herbal
- /soft-opening-บช-สาขาสขสวสดในวนท-19-กนย/ — Soft Opening บีชู สาขาสุขสวัสดิ์ในวันที่ 19 กันยายน 2567 - Bee Choo Herbal
