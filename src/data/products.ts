// src/data/products.ts
// Bee Choo Hair Care Products page. Transcribed verbatim from the live site
// (wp-json/wp/v2/pages/327 EN, /581 TH, both last modified 2025-09-02) via
// inventory/rest-pages.json — see CLAUDE.md §8: no machine translation, EN/TH are
// each verbatim in their own language, not a translation pair.
//
// Structure: 18 products in 4 legacy categories (7 shampoos / 2 conditioners /
// 6 tonics / 3 spa-serum-creme). The 4 category HEADINGS are English text on BOTH
// language pages in the legacy source (never translated there) — reproduced as a
// single non-PL `heading` field on purpose, same class of quirk as About's
// English-on-both-pages photo caption.
//
// Deliberate presentation changes (content itself is untouched):
// - Ginger Lime Shampoo moved up one slot (was last of the 7 shampoos, now 4th) so
//   the 4 standalone shampoos form a clean 2x2 before the Rebalance/Recover/
//   Rehydrate Amino trio renders as its own matched 3-across row. Parity checks
//   presence of every fragment, not order.
// - "SCALP TREATMENT ESSENCE" (the only ALL-CAPS legacy heading) is Title Cased to
//   "Scalp Treatment Essence" to match the other 17 product headings' casing.
// - Signature-product markers ("*Signature Product*" / "*ผลิตภัณฑ์ตัวเด่นของร้าน*") are
//   stored WITH their legacy asterisks in `signatureLine`; ProductsPage strips the
//   `*` wrappers at render time and shows a styled badge instead.
// - Short legacy tag-lines (e.g. "Anti-Dandruff", "Cleanse + Control") are moved
//   into `taglines` for pill rendering instead of sitting inline as a paragraph.
//   Each legacy line lives in exactly one field — never duplicated between
//   `paragraphs` and `taglines`.
// - Whitespace-only artifacts from the legacy WYSIWYG source (stray mid-word
//   spaces from manual line-wraps, doubled spaces, trailing &nbsp;) are
//   normalised; wording is never changed. Same convention as team.ts's "joined
//   mid-clause split" precedent. Source TYPOS are kept verbatim (see inline notes).
//
// Image mapping gotcha verified by opening both files: wp-content's
// "DI-Origin-Hair-Tonic-2.png" is actually the ITALY Hair Tonic bottle shot (a
// bright-yellow spray bottle), NOT the Origin Herbal Tonic (a dark-green bottle,
// filed under "DI-Herbal-Hair-Tonic.png"). Mapped by product, not filename.
// TH-page images are duplicate re-uploads of the same 18 artworks (WPML), so only
// one set was downloaded.
//
// EN meta description: the live EN page has NO Yoast description at all (verified
// null in rest-pages.json). Composed below from the page's own og_description,
// trimmed — ⚠ needs Crispin's sign-off before launch (team.ts precedent).
// TH meta description is real Yoast copy, used verbatim.
import type { ImageMetadata } from "astro";
import essenceShampoo from "../assets/images/products/essence-shampoo.png";
import purityScalpShampoo from "../assets/images/products/purity-scalp-shampoo.png";
import miniPurityScalpShampoo from "../assets/images/products/mini-purity-scalp-shampoo.png";
import gingerLimeShampoo from "../assets/images/products/ginger-lime-shampoo.png";
import rebalanceAminoShampoo from "../assets/images/products/rebalance-amino-shampoo.png";
import recoverAminoShampoo from "../assets/images/products/recover-amino-shampoo.png";
import rehydrateAminoShampoo from "../assets/images/products/rehydrate-amino-shampoo.png";
import purityRepairHairConditioner from "../assets/images/products/purity-repair-hair-conditioner.png";
import scalpMoistureLotion from "../assets/images/products/scalp-moisture-lotion.png";
import originHerbalTonic from "../assets/images/products/origin-herbal-tonic.png";
import italyHairTonic from "../assets/images/products/italy-hair-tonic.png";
import naturalHairTonic from "../assets/images/products/natural-hair-tonic.png";
import advancedProHairTonic from "../assets/images/products/advanced-pro-hair-tonic.png";
import essenceVitaminsAmpoule from "../assets/images/products/essence-vitamins-ampoule.png";
import scalpTreatmentEssence from "../assets/images/products/scalp-treatment-essence.png";
import treatmentSpaCreme from "../assets/images/products/treatment-spa-creme.png";
import damagedHairRebuilder from "../assets/images/products/damaged-hair-rebuilder.png";
import ceramideHairTreatmentOil from "../assets/images/products/ceramide-hair-treatment-oil.png";
import locationsBannerEn from "../assets/images/products/locations-banner-en.jpg";
import locationsBannerTh from "../assets/images/products/locations-banner-th.jpg";
import { TREATMENTS } from "./treatments";

export type Lang = "en" | "th";
type PL<T> = Partial<Record<Lang, T>>;

export type CategoryId = "shampoos" | "conditioners" | "tonics" | "spas";

export interface ProductCategory {
  id: CategoryId;
  /** Legacy H2 — English text on both language pages in the source, never translated there. */
  heading: string;
  /** Shortened chip label for the sticky subnav, English on both languages (same reasoning as `heading`). */
  chipLabel: string;
}

export const CATEGORIES: ProductCategory[] = [
  { id: "shampoos", heading: "Bee Choo Shampoos", chipLabel: "Shampoos" },
  { id: "conditioners", heading: "Bee Choo Conditioners", chipLabel: "Conditioners" },
  { id: "tonics", heading: "Bee Choo Hair Tonics", chipLabel: "Hair Tonics" },
  { id: "spas", heading: "Bee Choo Spas, Serum and Cremes", chipLabel: "Spas & Cremes" },
];

export interface Product {
  slug: string;
  category: CategoryId;
  name: PL<string>;
  image: ImageMetadata;
  alt: { en: string; th: string };
  paragraphs: PL<string[]>;
  /** Short legacy tag-lines (e.g. "Anti-Dandruff") rendered as pills, never duplicated in `paragraphs`. */
  taglines?: PL<string[]>;
  /** Asterisk-prefixed fine print, verbatim including the asterisk(s). */
  note?: PL<string>;
  /** "*Signature Product*" verbatim; ProductsPage strips the `*` wrappers for the badge. */
  signatureLine?: PL<string>;
  /** The "use as a booster with our herbal treatment" cross-sell line + link to the hair-loss treatment page. */
  booster?: { line: PL<string>; href: { en: string; th: string } };
  family?: "amino";
}

const hairLossHref = { en: TREATMENTS[0].href.en, th: TREATMENTS[0].href.th };

export const PRODUCTS: Product[] = [
  // --- Bee Choo Shampoos (7) ---
  {
    slug: "essence-shampoo",
    category: "shampoos",
    name: { en: "Essence Shampoo", th: "เอสเซ้นส์ แชมพู" },
    image: essenceShampoo,
    alt: { en: "Bee Choo Essence Shampoo bottle", th: "ขวดเอสเซ้นส์ แชมพู บีชู" },
    paragraphs: {
      en: [
        "A gentle cleanser with strengthening properties, it nourishes and rebalances the scalp pH level while promoting a healthy environment for hair growth.",
        "Enriched with the omega rich extracts of walnut, grapes and linseed, the fatty acid nourishes the follicles and strengthens the hair from root to tip, making it less prone to breakage. With the addition of peach extracts, it leaves your tresses soft and shiny after every wash.",
      ],
      th: [
        "แชมพูทำความสะอาดอย่างอ่อนโยน ช่วยเสริมสร้างความแข็งแรงเพราะจะช่วยบำรุงและปรับสมดุลของระดับ pH ของหนังศีรษะซึ่งจะส่งเสริมการเจริญเติบโตของเส้นผม",
        "อุดมไปด้วยสารสกัดจาก walnut grapeseed และ linseed ซึ่งจะช่วยบำรุงและเสริมสร้างความแข็งแรงของเส้นผมจากโคนจรดปลายทำให้ผมขาดยากขึ้น นอกจากนี้แล้วยังมีสารสารสกัดจากพีชเป็นส่วนผสมที่จะทำให้ปลายผมนุ่มลื่นและเงางามทุกครั้งที่ใช้สระผม",
      ],
    },
    // TH typo kept verbatim: "ปราดสจากสาร" (should read "ปราศจากสาร").
    note: { en: "*SLES and Parabens free.", th: "*ปราดสจากสาร SLES และ Parabens ." },
  },
  {
    slug: "purity-scalp-shampoo",
    category: "shampoos",
    name: { en: "Purity Scalp Shampoo", th: "เพียวริตี้ สเกาป์ แชมพู" },
    image: purityScalpShampoo,
    alt: { en: "Bee Choo Purity Scalp Shampoo bottle", th: "ขวดเพียวริตี้ สเกาป์ แชมพู บีชู" },
    paragraphs: {
      en: [
        "An effective shampoo for oily scalp and fine hair formulated with a combination of surfactants and silk protein to deeply cleanse excessive scalp sebum and oily residue while protecting your hair, leaving a cool mint sensation after every wash.",
        "Cultured specifically for customers having oily scalp issues.",
      ],
      th: [
        "แชมพูอันทรงประสิทธิภาพที่เหมาะสำหรับสภาพผมมันและผมธรรมดา ด้วยคุณค่าของโปรตีนไหมจะช่วยล้างความมันส่วนเกินออกจากหนังศีรษะ อีกทั้งยังช่วยปกป้องเส้นผม คุณจะรู้สึกเย็นสบายทุกครั้งหลังจากทุกครั้งที่ได้ใช้",
        "แนะนำสำหรับคุณลูกค้าที่มีปัญหาหนังศีรษะมันโดยเฉพาะ",
      ],
    },
  },
  {
    slug: "mini-purity-scalp-shampoo",
    category: "shampoos",
    name: { en: "Mini Purity Scalp Hair Shampoo", th: "มินิ เพียวริตี้ สเกาป์ แชมพู" },
    image: miniPurityScalpShampoo,
    alt: { en: "Bee Choo Mini Purity Scalp Hair Shampoo travel bottle", th: "ขวดมินิ เพียวริตี้ สเกาป์ แชมพู บีชู ขนาดพกพา" },
    paragraphs: {
      en: ["A mini version of the Purity Scalp Shampoo. Great for travels and for those on the go.", "Definitely better than default shampoos provided by hotels."],
      th: ["เพียวริตี้ สเกาป์ แชมพู ขนาดพกพา เหมาะสำหรับการทางและนักเดินทาง", "เป็นอีกหนึ่งทางเลือกที่ดีกว่าแชมพูทั่วไปตามโรงแรม แน่นอน"],
    },
  },
  {
    slug: "ginger-lime-shampoo",
    category: "shampoos",
    name: { en: "Ginger Lime Shampoo", th: "จิงเจอร์ ไลม์ แชมพู" },
    image: gingerLimeShampoo,
    alt: { en: "Bee Choo Origin Organic Ginger Lime Shampoo bottle", th: "ขวดจิงเจอร์ ไลม์ แชมพู บีชู" },
    paragraphs: {
      en: [
        "Using 100% natural essentials oils & botanical extracts. The Pure Lime oil helps to effectively remove oil on the scalp, smooth, refreshes and heals scalp making roots stronger. The formula nourishes hair follicles to make them appear fuller and healthier.",
        "Origin Organic Ginger Lime Shampoo is most suitable for those with extremely oily scalp.",
      ],
      th: [
        "แชมพูที่มีส่วนประกอบของสารสกัดจากธรรมชาติและน้ำมันธรรมชาติ 100เปอร์เซ็น น้ำมันบริสุทธิ์จากมะนาวจะช่วยล้างน้ำมันออกจากหนังศีรษะอย่างมีประสิทธิภาพ ช่วยทำให้รากผมแข็งแรงขึ้น ช่วยบำรุงให้รากผมสามารถสร้างเส้นผมได้อย่างมีประสิทธิภาพและแข็งแรง",
        "ออริจิน ออแกนิค จิงเจอร์ ไลม์ แชมพู เหมาะมากกับผู้ที่มีหนังศีรษะมันอย่างมาก",
      ],
    },
  },
  {
    slug: "rebalance-amino-shampoo",
    category: "shampoos",
    family: "amino",
    name: { en: "Rebalance Amino Shampoo", th: "รีบาลานซ์ อะมิโน แชมพู" },
    image: rebalanceAminoShampoo,
    alt: { en: "Bee Choo Rebalance Amino Shampoo bottle", th: "ขวดรีบาลานซ์ อะมิโน แชมพู บีชู" },
    paragraphs: {
      en: ["For oily scalp. Formulated with Bee Choo Essence™"],
      th: ["เหมาะสำหรับ หนังศีรษะมัน + ด้วยเอสเซ้นส์บีชู"],
    },
    taglines: { en: ["Cleanse + Control", "Anti-Dandruff"], th: ["สะอาด + ควบคุมความมัน", "ขจัดรังแค"] },
  },
  {
    slug: "recover-amino-shampoo",
    category: "shampoos",
    family: "amino",
    name: { en: "Recover Amino Shampoo", th: "รีคัพเวอร์ อะมิโน แชมพู" },
    image: recoverAminoShampoo,
    alt: { en: "Bee Choo Recover Amino Shampoo bottle", th: "ขวดรีคัพเวอร์ อะมิโน แชมพู บีชู" },
    paragraphs: {
      en: ["For sensitive scalp. Formulated with Bee Choo Essence™"],
      th: ["เหมาะสำหรับหนังศีรษะแพ้ง่าย + ด้วยเอสเซ้นส์บีชู"],
    },
    taglines: { en: ["Cleanse + soothe.", "Anti-Dandruff"], th: ["สะอาด + อ่อนโยน", "ขจัดรังแค"] },
  },
  {
    slug: "rehydrate-amino-shampoo",
    category: "shampoos",
    family: "amino",
    name: { en: "Rehydrate Amino Shampoo", th: "รีไฮเดรท อะมิโน แชมพู" },
    image: rehydrateAminoShampoo,
    alt: { en: "Bee Choo Rehydrate Amino Shampoo bottle", th: "ขวดรีไฮเดรท อะมิโน แชมพู บีชู" },
    paragraphs: {
      en: ["For Dry-Balance Scalp. Formulated with Bee Choo Essence™"],
      th: ["เหมาะสำหรับหนังศีรษะแห้ง + ด้วยเอสเซ้นส์บีชู"],
    },
    taglines: { en: ["Cleanse + Moisturize", "Anti-Dandruff"], th: ["สะอาด + เพิ่มความชุ่มชื่น", "ขจัดรังแค"] },
  },

  // --- Bee Choo Conditioners (2) ---
  {
    slug: "purity-repair-hair-conditioner",
    category: "conditioners",
    name: { en: "Purity Repair Hair Conditioner", th: "เพียวริตี้ รีแพร์ แฮร์ คอนดิชันเนอร์" },
    image: purityRepairHairConditioner,
    alt: { en: "Bee Choo Purity Repair Hair Conditioner bottle", th: "ขวดเพียวริตี้ รีแพร์ แฮร์ คอนดิชันเนอร์ บีชู" },
    paragraphs: {
      en: [
        "Contain Pro-Vitamin B-5 and protein to penetrate into hair shaft, making hair elastic and easy to comb. Give moisture and strength to hair, make hair look shiny and smooth after usage.",
      ],
      th: [
        "ประกอบไปด้วยส่วนผสมของ โปร วิตมิน บี5 ที่จะแทรกซึมเข้าสู่แก่นผม ทำให้ผมมีความแข็งแรงมากขึ้น หวีง่าย มอบความชุ่มชื้นและแข็งแรงให้แก่เส้นผม เพื่อเส้นผมที่เป็นประกายและสุขภาพดี",
      ],
    },
  },
  {
    slug: "scalp-moisture-lotion",
    category: "conditioners",
    name: { en: "Scalp Moisture lotion", th: "สเกาป์ มอยเจอร์ โลชั่น" },
    image: scalpMoistureLotion,
    alt: { en: "Bee Choo Scalp Moisture Lotion bottle", th: "ขวดสเกาป์ มอยเจอร์ โลชั่น บีชู" },
    paragraphs: {
      en: [
        "Apply directly on Damp scalp after shampoo. Gentle massage and leave on for a minute, rinse of completely. Remove dandruff-causing fungus from your scalp and reduce itchiness while preventing tightness and irritation on your scalp. Address dullness and frizz to give you more control over your strands.",
      ],
      th: [
        "ช่วยขจัดเชื้อราที่ก่อให้เกิดรังแคบนหนังศีรษะและลดอาการคัน พร้อมป้องกันการตึงและระคายเคืองบนหนังศีรษะ ปกป้องผมจากมลภาวะและการชี้ฟูของเส้นผมได้อย่างดี",
      ],
    },
    note: { th: "** ใช้โดยตรงบนหนังศีรษะที่เปียกหมาด หลังสระผม นวดเบาๆ ทิ้งไว้ 1 นาทีล้างออกให้สะอาด" },
  },

  // --- Bee Choo Hair Tonics (6) ---
  {
    slug: "origin-herbal-tonic",
    category: "tonics",
    name: { en: "Origin Herbal Tonic", th: "ออริจิน เฮอร์เบิล โทนิค" },
    image: originHerbalTonic,
    alt: { en: "Bee Choo Origin Herbal Tonic bottle, dark green", th: "ขวดออริจิน เฮอร์เบิล โทนิค บีชู สีเขียวเข้ม" },
    signatureLine: { en: "*Signature Product*", th: "*ผลิตภัณฑ์ตัวเด่นของร้าน*" },
    paragraphs: {
      en: [
        "A unique Chinese formula which uses exotic and precious Chinese herbs to help accelerate hair growth and control hair loss. Designed for customer with severe hair loss problems.",
      ],
      th: ["โทนิคซึ่งอุดมไปด้วยคุณค่าของสมุนไพรจีนจะช่วยกระตุ้นผมเกิดใหม่ และลดการหลุดร่วงของเส้นผม ออกแบบโดยลูกค้าของเราที่มีปัญหาผมร่วง"],
    },
    booster: {
      line: {
        en: "This tonic can be used together with our herbal treatment as a booster.",
        th: "โทนิคตัวนี้สามารถใช้ควบคู่กับการทำทรีทเม้นท์สมุนไพรได้ เพื่อประสิทธิภาพที่ดีมากยิ่งขึ้น",
      },
      href: hairLossHref,
    },
  },
  {
    slug: "italy-hair-tonic",
    category: "tonics",
    name: { en: "Italy Hair Tonic", th: "อิตาลี่ แฮร์ โทนิค" },
    image: italyHairTonic,
    alt: { en: "Bee Choo Italy Hair Tonic spray bottle, yellow", th: "ขวดสเปรย์อิตาลี่ แฮร์ โทนิค บีชู สีเหลือง" },
    paragraphs: {
      en: [
        "Energy and vitality for hair and scalp. Leave-in tonic. It provides both hair and scalp with tone.",
        "It amplifies hair texture and helps stimulate micro-circulation. Promoting hair growth and healthy scalp.",
        "Refreshing effect.",
      ],
      th: [
        "เพิ่มพลังให้แก่เส้นผมและหนังศีรษะ ด้วยโทนิคบำรุงผมแบบไม่ต้องล้างออก จะช่วยปรับสภาพของหนังศีรษะและเส้นผม กระตุ้นการไหลเวียนโลหิตและการงอกใหม่ของเส้นผม ให้ผลความรู้สึกสดชื่นหลังจากการใช้",
      ],
    },
  },
  {
    slug: "natural-hair-tonic",
    category: "tonics",
    name: { en: "Natural Hair Tonic", th: "เนเชอร์รัล แฮร์ โทนิค" },
    image: naturalHairTonic,
    alt: { en: "Bee Choo Natural Hair Tonic bottle", th: "ขวดเนเชอร์รัล แฮร์ โทนิค บีชู" },
    paragraphs: {
      en: [
        "This rejuvenating Hair Tonic is created for dull or damaged hair in need of some natural ingredients to supplement the growth of healthy hair. Formulated with natural active ingredients and a broad spectrum of natural extracts, it works to improve the supply of nutrients to the hair from the roots, whilst improving natural hair growth and maintaining a healthy scalp.",
      ],
      th: [
        "โทนิคตัวนี้ถูกคิดค้นมาเพื่อฟื้นฟูผมแห้งเสียด้วยคุณค่าจากสารสกัดจากธรรมชาติ ทำให้เส้นผมที่งอกใหม่มีสุขภาพดีตั้งแต่รากผม และช่วยกระตุ้นการเกิดใหม่ของผมควบคู่กับการมีหนังศีรษะที่สุขภาพดี",
      ],
    },
  },
  {
    slug: "advanced-pro-hair-tonic",
    category: "tonics",
    name: { en: "Advanced Pro Hair Tonic", th: "แอดวานซ์ โปร แฮร์ โทนิค" },
    image: advancedProHairTonic,
    alt: { en: "Bee Choo Advanced Pro Hair Tonic bottle", th: "ขวดแอดวานซ์ โปร แฮร์ โทนิค บีชู" },
    paragraphs: {
      // EN body says "Advance Pro"; the product name/heading says "Advanced Pro" — both
      // kept verbatim exactly as the legacy source has them, in their own field.
      en: [
        "Containing Swertia Japonica Extract and Bisabolol, Advance Pro Hair Tonic helps to boost nutrients to the scalp for healthy hair. This invigorating tonic helps prevent hair loss, control sebum production and strengthen hair follicles. Advance Pro Hair Tonic is a great addition to your scalp care routine for healthy looking hair!",
      ],
      // TH source has this paragraph as bare sibling <div>s (no <p> wrapper) immediately
      // after the <h2> — easy to miss with a <p>-only scrape; confirmed via raw markup.
      th: [
        "ด้วยสารสกัดจาก Swertia Japonica และ Bisabolol Advance Pro Hair Tonic ช่วยเพิ่มสารอาหารให้กับหนังศีรษะเพื่อสุขภาพผมที่ดี โทนิคที่ชุ่มชื่นนี้ช่วยป้องกันผมร่วง ควบคุมการผลิตไขมัน และเสริมสร้างรูขุมขน แอดวานซ์ โปร แฮร์ โทนิค เป็นส่วนเสริมที่ดีในการดูแลหนังศีรษะของคุณเพื่อให้ผมดูสุขภาพดี!",
      ],
    },
    taglines: { en: ["Great for oily / itchy scalp or hair loss."], th: ["เหมาะสำหรับหนังศีรษะมัน / คันหรือผมร่วง"] },
  },
  {
    slug: "essence-vitamins-ampoule",
    category: "tonics",
    name: { en: "Essence Vitamins (Ampoule)", th: "เอสเซ้นส์ วิตมิน (แอมพูล)" },
    image: essenceVitaminsAmpoule,
    alt: { en: "Bee Choo Essence Vitamins Ampoule box and vials", th: "กล่องและหลอดเอสเซ้นส์ วิตมิน แอมพูล บีชู" },
    signatureLine: { en: "*Signature Product*", th: "*ผลิตภัณฑ์ตัวเด่นของร้าน*" },
    paragraphs: {
      en: [
        "Rebalance the hair's condition and stimulate root metabolism with the action of the exclusive Energy Complex, which combats hair follicle atrophy, activating hair growth. Makes the hair stronger and more resistant. It contains Serenoa Repens, a special active which helps to inhibit the enzyme 5-Alfa Reductase, responsible for hair loss in men.",
      ],
      th: [
        "ช่วยปรับสภาพเส้นผมและกระตุ้นการไหลเวียนของโลหิตด้วยการทำงานของเอเนอจี้ คอมเพล็กซ์ จะช่วยการยับยั้งการเสื่อมสภาพของรูขุมขนเส้นผม กระตุ้นการเกิดใหม่ของผม และช่วยบำรุงให้ผมแข็งแรงขึ้น สารสกัดจากปาล์มใบเลื่อย ซึ่งอุดมไปด้วย เอ็นไซน์ 5อัลฟา จะช่วยลดปัญหาผมร่วงสำหรับผู้ชายเป็นอย่างดี",
      ],
    },
    booster: {
      line: {
        en: "Ampoule can be used together with our herbal treatment as a booster.",
        th: "แอมพูลตัวนี้สามารถใช้ควบคู่กับการทำทรีทเม้นท์สมุนไพรเพื่อได้ผลที่มีประสิทธิภาพมากขึ้น",
      },
      href: hairLossHref,
    },
  },
  {
    slug: "scalp-treatment-essence",
    category: "tonics",
    // Legacy EN heading is ALL-CAPS ("SCALP TREATMENT ESSENCE") — Title Cased here to
    // match the other 17 product headings; TH heading had literal &nbsp; runs, cleaned.
    name: { en: "Scalp Treatment Essence", th: "สเกาป์ ทรีทเม้นท์ เอสเซ้นส์" },
    image: scalpTreatmentEssence,
    alt: { en: "Bee Choo Scalp Treatment Essence bottle", th: "ขวดสเกาป์ ทรีทเม้นท์ เอสเซ้นส์ บีชู" },
    paragraphs: {
      en: [
        "Promote healthy hair growth. If your scalp is not cared for, your hair growth will be slowed, and the hair that does grow may be more fragile and prone to breakage, irritated scalp formulated with Bee Choo essence.",
      ],
      th: [
        "ช่วยส่งเสริมการเจริญเติบโตของเส้นผมให้แข็งแรง หากหนังศีรษะของคุณขาดการดูแลอย่างถูกวิธี การเจริญเติบโตของเส้นผมของคุณก็จะช้าลง และผมที่งอกขึ้นใหม่อาจเปราะบางและมีแนวโน้มที่จะขาดง่าย.",
        "เหมาะสำหรับ หนังศีรษะระคายเคือง สูตรผสมบีชูเอสเซนส์",
      ],
    },
    note: {
      en: "Apply directly to clean scalp after treatment or hair wash immediately.",
      th: "** ชโลมลงบนหนังศีรษะที่สะอาดโดยตรงหลังการทําทรีตเมนต์หรือสระผมทันที",
    },
  },

  // --- Bee Choo Spas, Serum and Cremes (3) ---
  {
    slug: "treatment-spa-creme",
    category: "spas",
    name: { en: "Treatment Spa Creme", th: "ทรีทเม้นท์ สปา ครีม" },
    image: treatmentSpaCreme,
    alt: { en: "Bee Choo Treatment Spa Creme tub", th: "กระปุกทรีทเม้นท์ สปา ครีม บีชู" },
    paragraphs: {
      en: [
        "Specially designed for coarse, dry or natural curly hair. One step convenience to penetrate deeply to deliver optimum protein to the hair to its most natural state. Unique formulation containing special softening and conditioning agents. Perfect treatment choice for dry and damaged hair.",
        "The Spa can be used during herbal treatment process for softer hair ends post treatment.",
      ],
      th: [
        "ทรีทเม้นท์ สปา ครีมถูกออกแบบมาเพื่อผมแห้งเสีย หยาบกระด้าง หรือผู้ที่มีผมหยิกธรรมชาติ ใช้เพียงขั้นตอนเดียวก็จะทำให้เส้นผมได้สารบำรุงและโปรตีนจากธรรมชาติที่จะแทรกซึมเข้าสู่เส้นผม ทรีทเม้นท์ตัวนี้เป็นทรีทเม้นท์สำหรับผมแห้งเสียอย่างสมบูรณ์แบบ",
        "ทรีทเม้นท์ สปา ครีม สามารถใช้ได้ในระหว่างการทำทรีทเม้นท์สมุนไพรเพื่อผมที่นุ่มสลวยหลังจากการทำทรีทเม้นท์",
      ],
    },
  },
  {
    slug: "damaged-hair-rebuilder",
    category: "spas",
    name: { en: "Damaged Hair Rebuilder", th: "แดมเมจ แฮร์ รีบิวเดอร์" },
    image: damagedHairRebuilder,
    alt: { en: "Bee Choo Damaged Hair Rebuilder bottle", th: "ขวดแดมเมจ แฮร์ รีบิวเดอร์ บีชู" },
    paragraphs: {
      en: [
        "Packed with Silk Protein, Jojoba and Vitamin E that nourishes and repairs hair tissue instantly, it adds definition, moisture and brilliant shine with unique light-holding ingredients. It reduces breakage caused by thermal styling, UV damage and combing.",
        "Apply on the hair ends after every hair wash to have soft and silky, manageable hair.",
      ],
      th: [
        "อันแน่นไปด้วยสารสกัดจากโปรตีนไหม เมล็ดโจโจ้บา และวิตมินอี ที่จะช่วยฟื้นฟูเส้นผมอย่างรวดเร็ว และยังทำให้ผมมีความชุ่มชื้น เป็นประกาย ปกป้องเส้นผมจากความร้อนในการจัดแต่งทรงผม หรือรังสีUV หรือการแปรงผม",
        // TH typo kept verbatim: "นุ่นสลวย" (should read "นุ่มสลวย").
        "ทาผลิตภัณฑ์บริเวณปลายผมทุกครั้งหลังสระเพื่อผมที่นุ่นสลวย จัดทรงง่าย",
      ],
    },
  },
  {
    slug: "ceramide-hair-treatment-oil",
    category: "spas",
    name: { en: "Ceramide Hair Treatment Oil", th: "เซรามาย แฮร์ ทรีทเม้นท์ ออยล์" },
    image: ceramideHairTreatmentOil,
    alt: { en: "Bee Choo Ceramide Hair Treatment Oil bottle", th: "ขวดเซรามาย แฮร์ ทรีทเม้นท์ ออยล์ บีชู" },
    paragraphs: {
      en: [
        "Ceramide Hair Treatment Oil provides all the best benefits for your hair without weighting it down. Formulated with ceramides and avocado oil, it helps to condition and moisturized hair, leaving your locks smooth and silky. Protect your hair from sun damage and treat your hair ends to a nourishing oil treatment today!",
      ],
      th: [
        "เซรามาย แฮร์ ทรีทเม้นท์ ออยล์ ให้ประโยชน์สูงสุดแก่เส้นผมของคุณโดยไม่ทำให้ผมเสีย ด้วยสารสกัดจากเซราไมด์และน้ำมันอะโวคาโด ช่วยปรับสภาพและให้ความชุ่มชื้นแก่เส้นผม ทำให้ล็อคผมเรียบลื่น ปกป้องเส้นผมของคุณจากการทำร้ายของแสงแดดและดูแลปลายผมด้วยทรีทเม้นท์น้ำมันบำรุงผมวันนี้!",
      ],
    },
    taglines: { en: ["For all hair types, especially for dull and damaged hair."], th: ["เหมาะสำหรับทุกสภาพเส้นผม โดยเฉพาะผมบอบบางและผมเสีย"] },
  },
];

export const PRODUCTS_INTRO: { paragraphs: PL<string[]> } = {
  paragraphs: {
    en: [
      "Looking for anti hair loss shampoos, hair growth tonics, anti dandruff shampoos? You have found the best effective solution in Thailand. Bee Choo Herbal brings the best hair care treatment and hair products from Singapore to Thailand. Whether you are looking for shampoo to treat your oily scalp or hair, shampoo to treat your dry or chemically damaged hair with split ends, check out our series of shampoo made from a variety of chinese herbs which are natural and contain herbal active ingredients that promotes the regrowth of your hair through our hair tonic, shampoo that is anti hair loss even hair tonics to treat severe hair loss problems. Scroll down to check them out!",
    ],
    th: [
      "หากคุณกำลังมองหาแชมพูแก้ปัญหาผมร่วง โทนิกส่งเสริมการเจริญเติบโตของเส้นผม หรือแชมพูแก้ปัญหารังแค คุณมาถูกที่แล้วเพราะเรามีแชมพูแก้ปัญหาเส้นผมและหนังศีรษะที่ดีที่สุดในประเทศไทย",
      "Bee Choo ได้นำผลิตภัณฑ์ดูแลเส้นผมและหนังศีรษะที่ดีที่สุดจากประเทศสิงคโปร์มายังประเทศไทยแล้ว ไม่ว่าคุณจะกำลังมองหาแชมพูที่จะแก้ปัญหาหนังศีรษะมัน หนังศีรษะแห้ง หรือแก้ปัญหาเส้นผมที่เกิดจากการทำเคมีที่ทำให้ผมแตกปลาย คุณควรลองใช้ผลิตภัณฑ์ของเราที่มีส่วนประกอบคือสารสกัดจากธรรมชาติและสมุนไพรจีนพื้นบ้านต่าง ๆ ที่จะช่วยส่งเสริมการเจริญเติบโตของเส้นผม ลองเลื่อนไปดูผลิตภัณฑ์ของเราด้านล่างนะคะ",
    ],
  },
};

// Legacy CTA sentence, repeated 3x on the source page (top, after Conditioners, after
// Hair Tonics). URL upgraded http -> https to match the same destination used site-wide
// (Footer.astro, CLAUDE.md §2) — same account, same target, scheme only.
export const PRODUCTS_CTA = {
  label: {
    en: "Purchase our products via Facebook, msg us today (only in Thailand)",
    th: "ซื้อผลิตภัณฑ์ของเราได้ทาง Facebook ส่งข้อความหาเราได้เลย!",
  },
  href: "https://www.facebook.com/beechooherbal/",
};

// Legacy trailing branch-location banner graphic — URL confirmed reachable at
// /wp-content/uploads/2025/09/ (treatment-pages.ts had flagged this asset as "not yet
// sourced/wired"; now downloaded and available for reuse there too).
export const LOCATIONS_BANNER = {
  image: { en: locationsBannerEn, th: locationsBannerTh },
  alt: {
    en: "Map of Bee Choo Herbal branches across Thailand",
    th: "แผนที่สาขา Bee Choo Herbal ทั่วประเทศไทย",
  },
};

export const PRODUCTS_SEO = {
  title: {
    en: "Bee Choo Hair Care Products - Bee Choo Herbal",
    th: "แชมพูบีชูและผลิตภัณฑ์ป้องกันผมร่วง - Bee Choo Herbal",
  },
  description: {
    // ⚠ Composed, not transcribed — the live EN page has NO meta description at all
    // (verified null in inventory/rest-pages.json's yoast_head_json). Adapted from the
    // page's own og_description, trimmed to fit. Needs Crispin's sign-off before launch
    // (same convention as team.ts's composed EN description).
    en: "Shampoos, conditioners, hair tonics and treatment cremes from Bee Choo Herbal — natural herbal hair care for oily scalp, dandruff and hair loss.",
    // Verbatim Yoast meta description from the live TH page.
    th: "แชมพูป้องกันผมร่วง ปรับสภาพของเส้นผมและกระตุ้นการไหลเวียนของเลือดภายในรากผม โดยผสานพลังจาก AHASจากผลไม้จะช่วยผลัดเซลล์หนังศีรษะออกอย่างอ่อนโยน",
  },
};
