// src/data/treatment-pages.ts
// Long-form body copy for treatment detail pages, keyed by the same `slug` used in
// src/data/treatments.ts (title/image/href/hreflang stay there — this file only adds
// what a detail page needs beyond the homepage card). Copy is extracted verbatim from
// inventory/rest-pages.json (the live site's WP REST export) — do not machine-translate,
// do not paraphrase. Spec: specs/2026-08-12-treatment-pages-plan.md.
//
// About/Benefits are structured per-language (not paired by array index) because the
// live site's Thai and English copy for a given treatment are not always the same
// length or shape — see the spec's note on Thai pages carrying extra sub-sections.
//
// Known source quirks, intentionally NOT silently fixed here (see CLAUDE.md §8 — use
// existing copy verbatim, don't invent or "correct" claims):
// - TH oily-scalp Benefits para 1 has "ปรัฐสภาพผม", almost certainly a live-site typo
//   for "ปรับสภาพผม" ("restore/adjust the hair's condition") — kept verbatim, flag to
//   Crispin before launch.
// - TH oily-scalp's inline FAQ photo (legacy filename "2017-06-31-top-1-225x300.jpg")
//   is hotlinked on the live TH page from the SISTER SINGAPORE SITE
//   (www.beechooladies.com.sg), not beechooherbal.com — the same class of cross-domain
//   bug CLAUDE.md §1 already documents for the homepage service links. Not reproduced
//   here (we don't want this build depending on a different business's domain staying
//   up); flag to Crispin. EN's two inline FAQ photos are unaffected (own domain) and
//   are sourced below.
// - grey-hair's About-section photo (BCL-Shop-in-operations.jpeg) is broken on the live
//   site itself — HTTP 200 but `Content-Length: 0`, Cloudflare-cached since 2022. Can't
//   be sourced from a broken source; left unset (see `AboutContent.image` doc comment).
//
// Two transcription deviations from earlier batches, found 2026-08-17 by diffing the
// built HTML against the REST export. Both are cosmetic and the copy is otherwise
// character-for-character intact, so they are recorded rather than "corrected" (the
// house rule is to flag, not silently rewrite — see the ปรัฐสภาพผม note above):
// - EN grey-hair FAQ 2: the live page reads "are above 40 ." with a stray space before
//   the full stop. Transcribed here as "above 40." Restoring the legacy space would be
//   worse typography for an invisible gain; flag to Crispin only if strict byte parity
//   is ever required.
// - EN oily-scalp FAQ 4: the live page splits this answer across two <p>s, the second
//   starting "If you are prone to scratching...". Transcribed as one string joined with
//   "This is why: if you are prone...", which lowercases that sentence-initial "I". No
//   words added or dropped.
//
// 2026-08-19: EN heading strings (H1s + H2s) below were retyped from the legacy
// ALL-CAPS transcription to Title Case — same words, casing only. Google is
// case-insensitive, so this carries no SEO risk; it is a presentation decision, not a
// copy change, and does NOT violate the verbatim-copy rule above. "BEECHOO" (one word,
// as in the source) becomes "Beechoo" — do not "fix" this to "Bee Choo", the word
// itself must stay identical. TH headings are untouched (no TH heading contains
// embedded ALL-CAPS Latin text). Do not restore the caps in a future pass.
//
// Previously tracked as blocked by sandbox network egress — RESOLVED. All 5 files were
// unreachable from the build sandbox (proxy 403) but download fine from a normal
// network; confirmed genuine images (magic-byte checked), sourced full-resolution
// (unscaled originals, not the WP thumbnail crops the page HTML links to), and wired in:
// - grey-hair before/after: before-treatment.png + after-1.png → `beforeAfter.images`.
//   Alt text corrected to match the live page's actual attributes (a previous session's
//   tracking note paraphrased them slightly).
// - oily-scalp: About-section photo (IMG_2850) → `about.image`; two inline FAQ photos
//   (oily-hair, 180125-R-side) → `about.faq[n].image`, captions restored alongside them.
//
// Not reproduced by design (not a gap — see file):
// - The legacy pricing-chart image and the "How It Works" 4-step composite are already
//   rendered by the reused PricingSection/HowItWorksScene components (src/assets/images/
//   price-list.jpg, how-it-works.jpg) — sourced once for the homepage, shared here.
// - The legacy Reviews-section disclaimer sentence is already present site-wide via
//   HowItWorksScene's `t.disclaimer` (src/data/home.ts) — same sentence, attached to a
//   different section than the legacy page's placement; not duplicated here.
// - The legacy hero strapline is already hard-coded in TreatmentHero.astro (shared
//   across all 7 treatment pages on the live site).
// - The legacy inline LINE "Add Friend" badge/QR image (th.png) is NOT reproduced —
//   redundant with the Call/Facebook/LINE CTA set already on every page (CLAUDE.md §2);
//   flag to Crispin if he wants the graphic itself restored.
//
// Still missing vs. the live site:
// - the trailing locations map graphic (Bee-Choo-Location-ENG/THA-Ver_FINAL.jpg) — real
//   URLs now confirmed reachable (/wp-content/uploads/2025/09/), not yet sourced/wired.
//
// CLOSED 2026-08-17 (was an unlogged gap, found during the 7-page content review): the
// legacy "BEST HAIR LOSS TREATMENT SALON CLINIC IN BANGKOK" block carries a 12-badge
// award carousel on all 7 pages, byte-identical to the homepage's. The build was
// dropping it on treatment pages entirely. Now rendered inside that same section via
// the existing AwardsMarquee component (src/components/AwardsMarquee.astro, already
// sourced for the homepage) — see TreatmentsSection's `showAwards` prop.

import type { ImageMetadata } from "astro";
// Filename is legacy — this was wired as oily-scalp's About photo before it moved to the
// shared Recognitions block. It is NOT a salon photo: it is the Entrepreneur of the Year
// Award ceremony (Singapore, 27 Nov 2017, Guest of Honour Mr Lim Swee Say). The file is
// left named as-is so the emitted asset hash doesn't churn.
import awardCeremonyPhoto from "../assets/images/treatments/oily-scalp-about.jpg";
import oilyScalpFaqCloggedPore from "../assets/images/treatments/oily-scalp-faq-clogged-pore.jpeg";
// Legacy 180125-R-side.jpg. Serves TWO pages on the live site: oily-scalp's second FAQ
// photo and dandruff's "before" hair scan. Verified byte-identical (same md5) at both
// URLs, so it is imported twice under two names rather than stored twice.
import oilyScalpFaqScan from "../assets/images/treatments/oily-scalp-faq-scan.jpg";
import dandruffScanBefore from "../assets/images/treatments/oily-scalp-faq-scan.jpg";
import greyHairBeforeImage from "../assets/images/treatments/grey-hair-before.png";
import greyHairAfterImage from "../assets/images/treatments/grey-hair-after.png";
import dandruffAboutPhoto from "../assets/images/treatments/dandruff-about.jpg";
import dandruffScanAfter from "../assets/images/treatments/dandruff-after.jpg";
import damagedHairAboutPhoto from "../assets/images/treatments/damaged-hair-about.jpg";

export type Lang = "en" | "th";

export interface FaqItem {
  question: string;
  answer: string;
  /** Inline photo the legacy page shows inside this FAQ answer, with its own short
   *  italicised caption underneath (not a real alt on the live site in most cases —
   *  where the source has no alt, the caption text doubles as one here). */
  image?: { src: ImageMetadata; alt: string; caption: string };
}

export interface AboutSubsection {
  heading: string;
  paragraphs: string[];
}

interface AboutContent {
  heading: string;
  /** Paragraphs above the FAQ accordion / subsections. */
  intro: string[];
  /** A trust-building salon/founder photo the live page shows under the intro, before
   *  the FAQ accordion. Per-page, not shared — grey-hair's live source file
   *  (BCL-Shop-in-operations.jpeg) returns HTTP 200 with a 0-byte body (confirmed via
   *  response headers, `Content-Length: 0`, cached since 2022) — a bug on the legacy
   *  site itself, not something we can source. Left unset there.
   *
   *  As of 2026-08-20 NO page sets this: oily-scalp's photo turned out to be an awards
   *  ceremony rather than a salon, and moved to RECOGNITION_PHOTO. Not a content loss —
   *  the same image now renders on all 7 pages instead of 1, with correct alt text. The
   *  field stays because a future page may legitimately have a real salon photo. */
  image?: { src: ImageMetadata; alt: string };
  /** The live site renders "About" as an intro plus an Elementor FAQ-toggle widget
   *  (not <h2>/<h3> tags — that's why an earlier plain heading-tag scan of this page
   *  missed it). Rendered as a native <details>/<summary> accordion: zero JS, and the
   *  answers stay in the DOM (crawlable) whether expanded or not. */
  faq: FaqItem[];
  /** Some pages (confirmed: TH grey/white hair) instead render "About" as an intro
   *  plus several always-visible <h3>-headed sub-sections — real static content, not
   *  a toggle widget. A page may have `faq`, `subsections`, or neither; not both. */
  subsections?: AboutSubsection[];
}

export type BenefitsBlock = { kind: "p"; text: string } | { kind: "list"; items: string[] };

interface BenefitsContent {
  heading: string;
  blocks: BenefitsBlock[];
}

/** An inline run of text, optionally a link. Only needed where the legacy copy has
 *  links mid-paragraph (the cross-sell block's two Business Times articles). */
export type Inline = string | { text: string; href: string };

export interface BeforeAfterImage {
  /** Imported ImageMetadata once the legacy photo is in src/assets/. */
  src: ImageMetadata;
  alt: string;
  /** Short visible label under the photo. The legacy site shows NO caption on these
   *  images — the descriptive text below is its `alt` attribute — so the visible
   *  label is our own presentation choice, not legacy copy. A short one keeps the
   *  pair symmetrical (the long alt wraps to two lines under one photo and one under
   *  the other). `alt` still carries the full description for screen readers. */
  caption?: string;
}

/** The legacy "SEE OUR CLIENT'S BEFORE AFTER RESULTS" band. Heading and body render
 *  even when `images` is empty — on the live site the heading is always present, and
 *  for oily-scalp the visual is a GIPHY embed rather than photos. */
export interface BeforeAfterContent {
  heading: string;
  /** Paragraph(s) under the heading. */
  body: string[];
  /** Legacy photos. Empty where they can't be sourced yet — see the file header. */
  images: BeforeAfterImage[];
  /** Third-party embeds the legacy band carries instead of (or as well as) photos.
   *  A LIST, not a single id: damaged-hair shows TWO GIPHY animations side by side and
   *  bacterial-infection shows TWO YouTube videos, so the earlier single `giphyId`
   *  could only have rendered half of either page's before/after evidence. `title` is
   *  the iframe's accessible name; GIPHY embeds on the legacy site carry none, so it is
   *  optional and BeforeAfterGallery falls back to the section heading. */
  embeds?: { kind: "giphy" | "youtube"; id: string; title?: string }[];
}

/** Text the legacy treatment pages carry in the four shared tail sections. The HOMEPAGE
 *  renders these sections image-only (Crispin's explicit call); the treatment pages keep
 *  their real crawlable text, so it is passed in per-page rather than living in
 *  src/data/home.ts. It is genuinely per-page, not a constant — the Thai cross-sell
 *  paragraph names a different condition on each treatment, and oily-scalp carries an
 *  extra flagship-salon line the others don't. */
// Headings are carried here too, not taken from src/data/home.ts, because the homepage's
// Thai copy transliterates "treatment" as "ทรีตเมนต์" while every legacy treatment page
// uses "ทรีทเม้นท์". The homepage spelling is signed off and stays as it is; the treatment
// pages must reproduce their own pages verbatim, so they pass their own strings.
interface TailContent {
  reviewsHeading: string;
  crossSell: { heading: string; paragraphs: Inline[][] };
  howItWorks: { heading: string; intro: string; stepsLead: string; steps: string[]; outro: string };
  pricing: { heading: string; intro: string; closing: string[] };
}

/** The body sections a treatment page can render, in the order they appear. */
export type SectionKey =
  | "about"
  | "benefits"
  | "beforeAfter"
  | "reviews"
  /** First half of the legacy cross-sell block: the brand paragraphs, the award
   *  ceremony photo and the 12-badge marquee, under the legacy BEST-IN-BANGKOK
   *  heading. Split out from `crossSell` so it can carry its own TOC anchor. */
  | "recognitions"
  | "crossSell"
  | "howItWorks"
  | "pricing";

/** Every renderable section key. `sectionOrder` is a WHITELIST, so a key missing from a
 *  page's order silently drops that section's copy — this is the set the validation loop
 *  at the bottom of this file requires. Deliberately NOT LEGACY_SECTION_ORDER any more:
 *  that constant documents the legacy pages' SOURCE order and shouldn't have to grow a
 *  key just because the build needs a completeness check. Order here is irrelevant. */
export const ALL_SECTIONS: SectionKey[] = [
  "about",
  "benefits",
  "beforeAfter",
  "reviews",
  "howItWorks",
  "pricing",
  "recognitions",
  "crossSell",
];

/** The legacy page order, reproduced faithfully. Kept as documentation of the source
 *  order and as the fallback for any page that has not opted into the standard below.
 *
 *  `recognitions` and `crossSell` are the two halves of ONE legacy block (the
 *  BEST-IN-BANGKOK heading + brand paragraphs + award marquee, then the treatments
 *  grid). They are adjacent and in source order here, so a page falling back to this
 *  order still renders every legacy word in its original sequence — the split adds an
 *  anchor boundary and a header, nothing else. */
export const LEGACY_SECTION_ORDER: SectionKey[] = [
  "about",
  "benefits",
  "beforeAfter",
  "reviews",
  "recognitions",
  "crossSell",
  "howItWorks",
  "pricing",
];

/** The standard order for ALL 7 treatment pages: everything about the visitor's own
 *  concern first, then the shared brand material as a closing band.
 *
 *  Measured against inventory/rest-pages.json, ~14,000 characters per legacy page — about
 *  30% of its weight — is byte-identical boilerplate repeated on all 7 (Reviews and the
 *  BEST-IN-BANGKOK block are byte-identical; How-It-Works differs only by video id;
 *  Pricing has two wording variants). Only the hero H1, the About block, the before/after
 *  caption + media, and (on 4 of 7) the Benefits prose are genuinely per-condition. The
 *  legacy template interleaves those few unique sections with the repeated ones.
 *
 *  This is a PRESENTATION change only — no copy is added, removed, or reworded, so it
 *  carries no SEO content risk (same URL, same text, same headings, all still
 *  server-rendered). Two moves relative to the first grey-hair pass:
 *    1. Pricing rises above the shared blocks — the conversion action should not sit
 *       behind ~1,000 words of brand copy.
 *    2. crossSell becomes last, where a "what else do you treat" grid is genuine exit
 *       navigation rather than mid-page filler (which is why showTreatmentsGrid is back
 *       on, with the current page filtered out of its own grid).
 */
export const STANDARD_SECTION_ORDER: SectionKey[] = [
  "about",
  "beforeAfter",
  "benefits",
  "howItWorks",
  "pricing",
  "reviews",
  "recognitions",
  "crossSell",
];

/** Trailing sections whose copy is shared across all 7 pages. TreatmentPage renders these
 *  inside `.closing-band` — same words, lower visual rank (see global.css). Nothing here
 *  is hidden; compressing is a type-scale and spacing change, not a content one.
 *
 *  crossSell LEAVES this set: it is now just the treatments grid under its own
 *  "Other Treatments" header, which is exit navigation rather than the byte-identical
 *  boilerplate this band exists to de-rank — and that header is meant to be prominent.
 *  recognitions takes its place: the brand paragraphs ARE that boilerplate. */
export const CLOSING_SECTIONS: SectionKey[] = ["reviews", "recognitions"];

/** Part 2 of every treatment page: the sections whose copy is shared brand material
 *  ("about Bee Choo Herbal" — how the treatment works, pricing, reviews, recognitions,
 *  other treatments), rendered as one visually grouped band — see `.brand-band` in
 *  global.css. CLOSING_SECTIONS (a subset) additionally keeps its own lower type
 *  rank inside the band. Presentation only; every word stays rendered and crawlable. */
export const BRAND_SECTIONS: SectionKey[] = ["howItWorks", "pricing", "reviews", "recognitions", "crossSell"];

export interface TreatmentPageContent {
  /** H1. Distinct from src/data/treatments.ts's homepage-card `title`. */
  heroTitle: Record<Lang, string>;
  /** Per-page override of the body section order. Omit to keep the legacy order.
   *  This is a PRESENTATION choice only — no copy is added, removed, or reworded by
   *  reordering, so it carries no SEO content risk (same URL, same text, same
   *  headings, all still server-rendered and crawlable). */
  sectionOrder?: SectionKey[];
  /** Per-page tint override, keyed by section. Omit a key to keep that section's own
   *  component default. Only needed by pages with a custom `sectionOrder` — the
   *  default alternation is correct for the legacy order. Ignored when `scrollTint`
   *  is on, which paints one tint for the whole page instead. */
  sectionBackground?: Partial<Record<SectionKey, "white" | "earth">>;
  /** Opens the page white and eases it to the brand mint as the visitor scrolls,
   *  replacing the alternating per-section bands with one continuous page tint.
   *  See the `.scroll-tint` rules in src/styles/global.css. */
  scrollTint?: boolean;
  /** Drops the decorative leaf ornament between sections page-wide. */
  hideDividers?: boolean;
  /** Adds the reading-progress strip and jump-to-section table of contents
   *  (src/components/treatment/TreatmentToc.astro). Worth it on long pages; the
   *  script that drives it only ships when this is on. */
  readingAids?: boolean;
  /** Set false to hide Benefits' own divider ornament — used when Benefits is
   *  repositioned flush against another same-tint section (see grey-hair). */
  benefitsDivider?: boolean;
  /** Set false to drop the 7-treatment cross-sell grid, keeping only its heading and
   *  brand paragraphs — re-listing every treatment (incl. the current one) reads as
   *  filler once a page's own body already made its case. */
  showTreatmentsGrid?: boolean;
  seo: {
    title: Record<Lang, string>;
    /** <= ~150 chars. Marked draftPending where the live site has no real Yoast
     *  description for that language (Yoast falls back to an auto-generated excerpt,
     *  which is not real copy) — those need Crispin's sign-off before launch. */
    description: Record<Lang, string>;
  };
  /** Per-condition YouTube id (same id embeds on both EN and TH pages on the live
   *  site). The shared/trailing ids that also appear elsewhere on the legacy page
   *  belong to the reused homepage sections (Reviews, How-It-Works) and don't need
   *  wiring here.
   *  OPTIONAL: damaged-hair's legacy page carries no condition video at all in either
   *  language — its About block opens straight into the copy. Omit rather than
   *  borrowing another page's video. */
  videoId?: string;
  /** Some pages (grey-hair) also carry a second, Facebook-hosted video, rendered under
   *  the Benefits heading sized to match the hero video. Full permalink of the source
   *  video — the component builds the plugin URL. */
  facebookVideoHref?: string;
  /** Per-page override for the shared "How It Works" video (src/data/home.ts's
   *  HOME.howItWorks.videoId is, per YouTube's own oEmbed title, "Bee Choo Branding
   *  2025" — a generic brand reel, not this section's process video). Scoped per-page
   *  rather than fixed at the source: the homepage (Crispin-signed-off) and Oily Scalp
   *  (shipped) still show the wrong one until that's a deliberate call, not a side
   *  effect of another page's edit.
   *  `id` is PER-LANGUAGE, not one string: dandruff embeds Uwty-ZDdPYc on EN and
   *  Fp3hdtA-pnE on TH, and bacterial-infection does the exact reverse. A single id
   *  would have silently shipped the wrong video on one language of each. */
  howItWorksVideo?: { id: Record<Lang, string>; title: Record<Lang, string> };
  /** "plain" drops the hero photo band and the green banner behind it, so the H1,
   *  strapline and CTAs sit on the page background with room above — see
   *  TreatmentHero.astro's `variant` prop. Omit for the standard photo hero. */
  heroVariant?: "image" | "plain";
  /** Gives Benefits its own brand-serenity tone instead of the white/earth
   *  alternation — see TreatmentBenefits.astro's `accent` prop doc comment. */
  benefitsAccent?: boolean;
  /** Adds Call/LINE buttons to the Pricing section — see PricingSection.astro's
   *  `showCta` prop doc comment. */
  pricingCta?: boolean;
  about: Record<Lang, AboutContent>;
  benefits: Record<Lang, BenefitsContent>;
  beforeAfter: Record<Lang, BeforeAfterContent>;
  tail: Record<Lang, TailContent>;
  /** Pages whose meta description isn't real live-site copy yet. */
  descriptionDraftPending?: Lang[];
}

/** The award-ceremony photo shown in every treatment page's Recognitions block, right
 *  after the outlet-count paragraph. Shared, not per-page: it is brand material, like
 *  the 12-badge marquee it sits above.
 *
 *  It previously rendered as oily-scalp's About photo with the alt "Bee Choo Herbal
 *  salon" / "ร้านบีชู เฮอร์เบิล", which described the wrong subject entirely — the image
 *  is an awards ceremony, not a salon. Moving it here fixes a factual alt-text bug and
 *  puts it on all 7 pages instead of 1.
 *
 *  ⚠ ALT TEXT NEEDS CRISPIN'S SIGN-OFF. The Thai is newly composed from vocabulary
 *  already on these pages (คุณเชีย บี ชู, ผู้ก่อตั้ง, บีชู ออริจิน, รางวัล, สิงคโปร์ all
 *  appear in CROSS_SELL_FOUNDER.th) — NOT machine-translated.
 *
 *  The EN caption IS legacy copy: the live oily-scalp page captions this photo "Mdm Bee
 *  Choo Receiving Award Presented by Minister Lim Swee Say", which
 *  inventory/scripts/06-copy-parity.mjs flagged as dropped. It also independently
 *  confirms the subject the alt text describes. No Thai caption exists on any legacy
 *  page, so `caption` is Partial and TH renders none rather than getting an invented
 *  translation (CLAUDE.md §8). */
export const RECOGNITION_PHOTO: {
  src: ImageMetadata;
  alt: Record<Lang, string>;
  caption?: Partial<Record<Lang, string>>;
} = {
  src: awardCeremonyPhoto,
  alt: {
    en: "Bee Choo Origin founder Madam Cheah Bee Chew receiving the Entrepreneur of the Year Award in Singapore, 2017",
    th: "คุณเชีย บี ชู ผู้ก่อตั้ง บีชู ออริจิน รับรางวัลผู้ประกอบการแห่งปีในสิงคโปร์ ปี 2017",
  },
  caption: {
    en: "Mdm Bee Choo Receiving Award Presented by Minister Lim Swee Say",
  },
};

// The two Business Times articles the cross-sell paragraph links to, on every page.
const BT_TESTIMONIES = "http://www.businesstimes.com.sg/hub/bt-salutes-enterprise-2016/power-of-testimonies-drives-business-growth";
const BT_SINCERITY = "http://www.businesstimes.com.sg/hub-projects/ceo-conversations-2017/sincerity-before-profit";

// How-It-Works and the pricing closing lines are word-for-word identical across all 7
// treatment pages (verified on oily-scalp + grey-hair); the cross-sell block is NOT, so
// it stays per-page below.
const REVIEWS_HEADING: Record<Lang, string> = {
  en: "Reviews on Beechoo Hair Treatment",
  th: "รีวิว บีชู แฮร์ ทรีทเม้นท์",
};

const HOW_IT_WORKS: Record<Lang, TailContent["howItWorks"]> = {
  en: {
    heading: "100% Natural Herbal Hair Treatment - How It Works",
    intro:
      "Consistently rated as the Best Natural Hair Loss Treatment Salon Clinic in Bangkok, our all natural, safe & highly effective herbal hair treatment gives your Unhealthy/Dry/Damaged/Oily scalp instant rejuvenation. The natural dye contained in the treatment also covers your white hair to the roots in the process!",
    stepsLead: "See how it works above in our simple 4 step treatment process:",
    steps: [
      "Step 1: Apply Hair Tonic on your Scalp",
      "Step 2: Apply Herbal Paste to your Scalp",
      "Step 3: Steam Treatment of your Hair for 45 minutes",
      "Step 4: Rinse-off the Herbal Paste, Scalp Massage and Conditioning of your Hair",
    ],
    outro: "You can also watch the video showing how our herbal treatment is done!",
  },
  th: {
    heading: "ทรีทเม้นท์สมุนไพร 100เปอร์เซ็น ให้ผลยังไงมาดูกัน!",
    intro:
      "ด้วยชื่อเสียงที่มีเสมอมาของซาลอน/คลินิก รักษาผมร่วงที่ดีที่สุด ผลิตภัณฑ์ของเราทั้งหมดมีส่วนผสมจากธรรมชาติและมีความปลอดภัย ให้ผลลัพธ์ที่มีประสิทธิภาพสูง ทำให้เส้นผมที่สุขภาพไม่ดี แห้ง มัน และถูกทำร้ายจะถูกฟื้นฟูอย่างรวดเร็ว สีย้อมผมจากธรรมชาติในทรีทเม้นท์ของเราจะช่วยปกปิดผมขาวจนไปถึงโคนของเส้นผม",
    stepsLead: "มาดู 4 สเต็ปง่ายๆในการทำทรีทเม้นท์ของเรา :",
    steps: [
      "สเต็ปที่ 1 : นวดโทนิคลงไปบนหนังศีรษะ",
      "สเต็ปที่ 2 : ทาน้ำยาสมุนไพรลงไปบนหนังศีรษะ",
      "สเต็ปที่ 3 : อบไอน้ำเป็นเวลา 45 นาที",
      "สเต็ปที่ 4 : ล้างน้ำยาสมุนไพรออก นวดและปรับสภาพหนังศีรษะ",
    ],
    outro: "คุณสามารถชมวีดีโอการทำทรีทเม้นท์ของเราจนจบขั้นตอนได้ตามนี้!",
  },
};

const PRICING: Record<Lang, TailContent["pricing"]> = {
  en: {
    heading: "Affordable Hair Treatment in Bangkok, Thailand",
    intro:
      "Our prices are based on your hair length between 800 Baht to 1200 Baht for à la carte herbal hair treatment. Strictly no hidden charges. You may choose to make upfront payment before treatment",
    closing: [
      "Give your hair a chance at the Best Hair Loss Treatment Clinic in Bangkok – affordable, reasonable for your budget",
      "Try it out and reserve your first appointment now (limited seats during peak hours)!",
      "Voted as the best hair loss clinic, hair thinning cure in Bangkok, Thailand!",
    ],
  },
  th: {
    heading: "ทรีทเม้นท์ผมราคาจับต้องได้ในประเทศไทย",
    intro:
      "ราคาในการให้บริการของเรานั้นขึ้นอยู่กับความยาวของเส้นผม โดยเริ่มต้นที่ 800 บาท ไปจนถึง 1,200 บาท ในการทำ à la carte ทรีทเม้นท์สมุนไพร ซึ่งทางเราไม่มีการคิดเงินเกินจากที่กำหนดไว้แน่นอน ลูกค้าสามารถตกลงราคาก่อนที่จะทำทรีทเม้นท์ได้",
    closing: [
      "ให้เราได้ดูแลเส้นผมของคุณ!",
      "ซาลอน/คลินิก รักษาผมร่วงที่ดีที่สุดในกรุงเทพฯ – ราคาเป็นมิตร เข้าถึงได้",
      "มาลองทำทรีทเม้นท์กับเราได้โดยการสำรองที่นั่งตอนนี้! (ที่นั่งมีจำนวนจำกัดนะคะ)",
    ],
  },
};

/** The cross-sell paragraph 2 is identical everywhere apart from being per-language. */
const CROSS_SELL_FOUNDER: Record<Lang, Inline[]> = {
  en: [
    "A recognised household brand name, established since 2000, our founder Madam Cheah Bee Chew and her brand has won numerous accolades from Singapore Agencies. You may read more from two articles written by Business Times Singapore titled “",
    { text: "Power of testimonies drives business growth", href: BT_TESTIMONIES },
    "” and “",
    { text: "Sincerity before profit", href: BT_SINCERITY },
    "“.",
  ],
  th: [
    "บีชู ได้ก่อตั้งเมื่อปี 2000 โดยคุณเชีย บี ชู และด้วยชื่อเสียงของแบรนด์ที่มีเสมอมา การันตีโดยรางวัลมากมายในสิงคโปร์ คุณสามารถอ่านเรื่องราวเพิ่มเติมได้ในนิตยสาร ไทม์ สิงคโปร์ ในหัวข้อ “",
    { text: "ผลลัพธ์จากการการันตีที่ทำให้ธุรกิจเติบโต", href: BT_TESTIMONIES },
    "” และ “",
    { text: "ความจริงใจมาก่อนผลกำไร", href: BT_SINCERITY },
    "”",
  ],
};

const CROSS_SELL_HEADING: Record<Lang, string> = {
  en: "Best Hair Loss Treatment Salon Clinic in Bangkok, Thailand",
  th: "ทรีทเม้นท์รักษาผมร่วงที่เห็นผลมากที่สุดในประเทศไทย",
};

/** Assembles a page's `tail` from the four shared constants above, plus whatever that
 *  page words differently.
 *
 *  ⚠ CORRECTION (2026-08-20). This file used to assert the tail was "word-for-word
 *  identical across all 7 treatment pages (verified on oily-scalp + grey-hair)". It is
 *  not — that claim was extrapolated from the only two pages built at the time. All 14
 *  legacy pages were diffed line-by-line against grey-hair; the real deviations are:
 *    EN  hair-loss, postpartum  — different pricing heading, intro AND closing lines
 *    EN  hair-loss, postpartum  — step 4 reads "Rinse Off" (no hyphen)
 *    EN  damaged, bacterial     — step 4 reads "Rinse-Off" (capital O)
 *    EN  dandruff               — step 3 reads "Steam for 45 minutes"
 *    EN  damaged                — How-It-Works intro has an extra chemical-dye clause
 *    TH  dandruff, damaged      — How-It-Works heading uses "100เปอร์เซ็นต์"
 *    TH  dandruff, damaged      — NO founder paragraph and no Business Times links
 *    TH  postpartum             — the whole tail is the "ทรีตเมนต์" spelling variant
 *  Copying one page's tail onto another would therefore silently rewrite indexed copy.
 *  The constants above stay as the MAJORITY text; each page states its own deviations
 *  here, so a deviation is visible at the page rather than hidden in a constant. */
const sharedTail = (
  lang: Lang,
  crossSellParagraphs: Inline[][],
  overrides: {
    reviewsHeading?: string;
    crossSellHeading?: string;
    howItWorks?: Partial<TailContent["howItWorks"]>;
    pricing?: Partial<TailContent["pricing"]>;
  } = {},
): TailContent => ({
  reviewsHeading: overrides.reviewsHeading ?? REVIEWS_HEADING[lang],
  crossSell: { heading: overrides.crossSellHeading ?? CROSS_SELL_HEADING[lang], paragraphs: crossSellParagraphs },
  howItWorks: { ...HOW_IT_WORKS[lang], ...overrides.howItWorks },
  pricing: { ...PRICING[lang], ...overrides.pricing },
});

/** The chrome every treatment page shares, so a new page opts in with one spread rather
 *  than six flags it might get subtly wrong. Established on grey-hair and standardised
 *  across all 7 (2026-08-17 handoff open question #4).
 *
 *  NOTE on `heroVariant: "plain"`: grey-hair's original justification was page-specific
 *  (its only candidate photos were clinical scalp macros). It is applied site-wide here
 *  as a deliberate consistency call, NOT because that reasoning generalises — revisit
 *  per page if Crispin wants a hero photo back on pages with an inviting one. */
const STANDARD_CHROME = {
  sectionOrder: STANDARD_SECTION_ORDER,
  scrollTint: true,
  hideDividers: true,
  readingAids: true,
  pricingCta: true,
  heroVariant: "plain",
} as const satisfies Partial<TreatmentPageContent>;

export const TREATMENT_PAGES: Record<string, TreatmentPageContent> = {
  "oily-scalp": {
    heroTitle: {
      en: "Oily Itchy Scalp Hair Treatment",
      th: "ทรีทเม้นท์สำหรับผมมันและอาการคันหนังศีรษะ",
    },
    // Moved off the legacy order onto the shared standard. This page previously shipped
    // the legacy section order and the homepage design language; it now matches every
    // other treatment page. No copy changed — see STANDARD_SECTION_ORDER.
    ...STANDARD_CHROME,
    seo: {
      title: {
        en: "Herbal Treatment to get rid of oily scalp - Bee Choo Herbal",
        th: "ลดหนังศีรษะมันและคันหรือมีกลิ่นเหม็นด้วยทรีทเม้นท์ธรรมชาติ - Bee Choo Herbal",
      },
      description: {
        // No real Yoast description exists on the live EN page (only an auto-generated
        // excerpt) — this is condensed from this page's own About/Benefits copy below,
        // not invented. Needs Crispin's sign-off before launch.
        en: "100% natural herbal treatment for oily, itchy scalp using traditional Ling Zhi herb. Safe, effective, trusted by thousands of clients in Bangkok.",
        // Real live-site Yoast description, verbatim.
        th: "ปัญหาหนังศีรษะมันเป็นปัญหาธรรมดาที่สามารถรักษาได้ด้วย บีชู เฮอร์เบิล ทรีทเม้นท์ ที่ซาลอน/คลินิก บีชู ของเรา น้ำยาทรีทเม้นท์นั้นทำจาก เห็ดหลินจือ ซึ่งรู้กัน",
      },
    },
    videoId: "HhYhUh7qvLM",
    about: {
      en: {
        heading: "About Itchy Oily Scalp Hair Condition",
        intro: [
          "Do take a minute to watch the video above to see how our customer had recovered from his oily scalp condition. These are all REAL pictures and videos taken at our salon. Oily Scalp in both men and women can be treated effectively with Bee Choo Herbal Hair Treatment. Thousands of customers trust us with their hair.",
          "Our scalp naturally secretes oil via the sebaceous glands and this oil protects the hair and sustains its structure. However, due to several factors, the sebum production could go into overdrive, causing excessive oil on the scalp, a condition known as seborrheic dermatitis. Excessive oil not only causes you to feel uncomfortable and itchy and it could ultimately lead to hair loss if left untreated!",
        ],
        faq: [
          {
            question: "What is Itchy and Oily Scalp?",
            answer:
              "The hot weather in Thailand, unhealthy diet, stress and wrong use of shampoo are factors that cause excess oil production in our scalp. Prolong usage of helmet and poor hygiene conditions relating to headgears and helmet also irritates and causes the scalp to overproduce oil. Excess oil builds up on the scalp causing hair follicles to get clogged.",
            image: { src: oilyScalpFaqCloggedPore, alt: "Example of clogged hair pore", caption: "Example of clogged hair pore" },
          },
          {
            question: "Why am I suffering from Itchy and Oily Scalp?",
            answer:
              "This is a common condition especially in temperate countries like Bangkok, Thailand. According to a survey done in 2017 with our first time customers, we found that ~30% of them visit us to seek help regarding itchy and oily scalp problems. The common causes of oily and itchy scalp are the use of wrong shampoo type and unhealthy diet (i.e. too much fried food and processed food).",
          },
          {
            question: "What exactly causes Itchy and Oily Scalp?",
            answer:
              "The condition is scientifically known seborrheic dermatitis. This condition is triggered by oily scalp and an overgrowth of yeast. Bacteria and yeast can infect the hair follicles leading to the itchiness felt in your scalp! Poor hygiene is another main culprit. Poorly kept scalp induces the production of sebum in the scalp. If hair is not washed with right shampoo frequent enough, the oils on the scalp will accumulate. Oily scalp can even lead to dandruff, dandruff caused by excess oil are yellowish in colour and the flakes are larger than their counter-parts caused by dry scalp. Under a hair microscope it could look like this:",
            image: { src: oilyScalpFaqScan, alt: "dandruff scalp hair scan", caption: "example of oil accumulation on scalp" },
          },
          {
            question: "Could oily and itchy scalp lead to hair loss?",
            answer:
              "In the short-run, no. However, in the long-run, if left untreated, it could lead to hair loss. This is why: if you are prone to scratching your scalp, you could introduce bacterial or fungus to broken skin on the scalp. You may even damage your hair follicles from frequent scratching. Therefore, indirectly, oily scalp can lead to hair loss. Even if you are able to resist scratching, that is not the end of the story. When hair pores are clogged for too long, the supply of nutrients to the hair will be inhibited; hairs growing out from these clogged pores are not healthy and this may lead to thinner hair and loss of hair volume.",
          },
        ],
      },
      th: {
        heading: "ผมมันและอาการคันหนังศีรษะ",
        intro: [
          "เรามาดูวีดีโอในการรักษาหนังศีรษะมันและคันของลูกค้าของเรากันค่ะ รูปภาพทุกภาพเป็นภาพจริงที่ถ่ายในซาลอน/คลินิก ของเรานะคะ โดยปกติทั้งผู้ชายและผู้หญิงสามารถมีหนังศีรษะมันและคันได้ทั้งนั้น และสามารถรักษาได้อย่างมีประสิทธิภาพด้วย บีชู แฮร์ ทรีทเม้นท์ของเราค่ะ ลูกค้าจำนวนมากพึงพอใจในการรักษาเส้นผมกับเรา",
          "โดยปกติแล้วหนังศีรษะเรามีการผลิตน้ำมันผ่านทางต่อมไขมันของเรา และน้ำมันนี้เองจะช่วยปกป้องเส้นผมและคงสภาพโครงสร้างของเส้นผม แต่ทั้งนี้ทั้งนั้นก็ยังคงมีปัจจัยต่างๆที่ทำให้ต่อมไขมันผลิตน้ำมันออกมามากกว่าปกติ ทำให้ต่อมไขมันเกิดการอักเสบ น้ำมันที่มากเกิดไปนอกจากจะทำให้คุณรู้สึกไม่สบายและคันแล้วยังนำไปสู่ปัญหาผมร่วงถ้าไม่ได้รับการรักษา",
        ],
        faq: [
          {
            question: "หนังศีรษะมันและคันเป็นอย่างไร?",
            answer:
              "เนื่องจากอากาศที่ร้อนอบอ้าวในประเทศไทย อาหารที่ไม่ดีต่อสุขภาพ ความเครียด การเลือกใช้แชมพูที่ไม่ถูกต้อง สาเหตุต่างๆเหล่านี้ก่อให้เกิดการผลิตน้ำมันที่มากเกินไปบนหนังศีรษะทางนั้น รวมไปถึงการสวมหมวกกันน็อคที่ไม่สะอาดที่อาจจะทำให้เกิดการระคายเคืองและทำให้หนังศีรษะผลิตน้ำมันที่มากเกินไป น้ำมันที่มากจนเกินไปนั้นอาจจะทำให้รูขุมขนเส้นผมอุดตันได้ด้วยเช่นกันและจะเกิดอาการคันหนังศีรษะเนื่องจากหนังศีรษะมันมากว่าปกติ",
          },
          {
            question: "ทำไมถึงมีหนังศีรษะมันและคัน?",
            answer:
              "การมีหนังศีรษะมันเป็นเรื่องปกติมากโดยเฉพาะกับเมืองที่มีอากาศร้อนอบอ้าวอย่างกรุงเทพฯ ประเทศไทย จากการสำรวจของเราในปี 2017 พบว่าลูกค้าจำนวน 30เปอร์เซ็น ได้มาที่ซาลอน/คลินิก เนื่องจากมีปัญหาในเรื่องหนังศีรษะมันและคันหนังศีรษะ สาเหตุของการมีหนังศีรษะมันและคันนั้นเนื่องจากการเลือกใช้แชมพูที่ไม่ถูกต้อง และการทานอาหารที่ไม่ดีต่อสุขภาพ เช่น อาหารทอด และอาหารที่ผ่านกระบวนการมากเกินไป",
          },
          {
            question: "อะไรคือสาเหตุที่ก่อให้เกิดหนังศีรษะมันและคัน",
            answer:
              "ในทางวิทยาศาสตร์สภาพที่ต่อมไขมันผลิตน้ำมันมากเกินไปเป็นที่รู้จักในชื่อ “ต่อมไขมันอักเสบ” ซึ่งจะทำให้หนังศีรษะผลิตน้ำมันออกมามาก การเติบโตของยีสต์ก็มีมากด้วยเช่นกัน รูขุมขนเส้นผมนั้นสามารถติดเชื้อจากแบคทีเรียและยีสต์ได้ ซึ่งนำไปสู่อาการคันหนังศีรษะ การรักษาความสะอาดที่ไม่ถูกต้องนั้นเป็นอีกหนึ่งสาเหตุที่ทำให้หนังศีรษะผลิตน้ำมันที่มากเกินไป และเมื่อสระผมด้วยแชมพูที่ไม่เหมาะสมอย่างต่อเนื่อง น้ำมันจะสมสมอยู่ที่หนังศีรษะ ซึ่งจะทำให้เกิดรังแคตามมา รังแค่สีเหลืองและเป็นเกล็ดนั้นจะเกิดขึ้นกับหนังศีรษะมันมากกว่าผู้ที่มีหนังศีรษะแห้ง",
          },
          {
            question: "หนังศีรษะมันและคันสามารถนำไปสู่ปัญหาผมหลุดร่วงได้ไหม",
            answer:
              "ในระยะเวลาสั้นๆนั้นอาจจะยังไม่เห็นผล แต่เมื่อหนังศีรษะมันและคันเป็นระยะเวลาที่ยาวนานนั้นสามารถนำไปสู่ปัญหาผมร่วงได้ เนื่องจาก เมื่อคุณเกาหนังศีรษะ ในการเกานั้นก็จะทำให้แบคทีเรียและเชื้อราเข้าไปยังหนังศีรษะได้ และเป็นการทำร้ายรูขุมขนเส้นผมอีกด้วย ดังนั้นการมีหนังศีรษะที่มันและคันจะส่งผลให้เกิดปัญหาผมร่วงในทางอ้อม แต่เรื่องยังไม่จบแค่นั้น ถ้าคุณเป็นคนชอบเกาหนังศีรษะจะทำให้รูขุมขนเส้นผมก็จะเกิดการอุดตันได้ และเมื่อเกิดการอุดตันเป็นเวลานานจะทำให้เส้นผมไม่ได้รับสารบำรุงต่างๆ เมื่อเส้นผมงอกออกมานั้นก็จะกลายเป็นผมที่สุขภาพไม่ดี ลีบแบน และไม่มีวอลลุม",
          },
        ],
      },
    },
    benefits: {
      en: {
        heading: "Benefits of 100% Natural Herbal Treatment",
        blocks: [
          {
            kind: "p",
            text: "Oily scalp is a common hair issue and it can be solved with Bee Choo Herbal Treatment. At Bee Choo, our herbal paste contains a traditional Chinese herb known as Ling Zhi which is an adaptogen with a dual-modulating function. Ling Zhi helps to modulate your scalp regardless if it is too oily or too dry, bringing your scalp back to its normal and healthy state after each treatment. Stop living with the itch, realise how great it feels to have a squeaky clean scalp!",
          },
        ],
      },
      th: {
        heading: "ประโยชน์ของการทำทรีทเม้นท์ สมุนไพรธรรมชาติ 100เปอร์เซ็น",
        blocks: [
          {
            kind: "p",
            text: "ปัญหาหนังศีรษะมันเป็นปัญหาธรรมดาที่สามารถรักษาได้ด้วย บีชู เฮอร์เบิล ทรีทเม้นท์ ที่ซาลอน/คลินิก บีชู ของเรา น้ำยาทรีทเม้นท์นั้นทำจาก เห็ดหลินจือ ซึ่งรู้กันดีว่าเป็นสมุนไพรพื้นบ้านของจีน เห็ดหลินจือจะช่วยปรัฐสภาพผมไม่ว่าคุณจะมีหนังศีรษะที่มันหรือแห้งเกินไป ก็จะกลับมาสู่สภาพปกติและมีสุขภาพดีหลังจากการทำทรีทเม้นท์ในแต่ละครั้ง เลิกอยู่กับความคันแล้วมาสัมผัสความสบายและสะอาดของหนังศีรษะกันได้แล้ววันนี้!",
          },
        ],
      },
    },
    // "Get rid of the itch…" / "มาลดความมันและความคัน…" belongs HERE, not in Benefits:
    // on the live site it is its own section sitting under the before/after heading.
    beforeAfter: {
      en: {
        heading: "See Our Client's Before After Results",
        body: ["Get rid of the itch and excess oil today. With regular treatment, your scalp will be free of itch and excess oil."],
        images: [],
        embeds: [{ kind: "giphy", id: "t7752IVYRBN1YzOPaL" }],
      },
      th: {
        heading: "มาดูผล ก่อน - หลัง ของลูกค้าของเรา",
        body: ["มาลดความมันและความคันของหนังศีรษะกันค่ะ ด้วยทรีทเม้นท์ของพวกเรา คุณจะรู้สึกสบายมากขึ้นเมื่อไม่มีน้ำมันและอาการคันมากวนใจ"],
        images: [],
        embeds: [{ kind: "giphy", id: "t7752IVYRBN1YzOPaL" }],
      },
    },
    tail: {
      en: sharedTail("en", [
        ["Bee Choo Origin is the largest scalp/hair loss treatment salon/clinic specialising in the treatment of hair loss, dandruff, oily scalp and other hair issues. There are 21 outlets in Singapore, 68 outlets in Malaysia with more than 160 outlets across Asia Pacific. The Group has expanded into Bangkok, Thailand and sees Thailand as a potential market to grow the brand. Annually we serve millions of happy customers with effective and proven results."],
        CROSS_SELL_FOUNDER.en,
      ]),
      th: sharedTail("th", [
        ["บีชู ออริจิน เป็นทรีทเม้นท์ซาลอนและคลินิกที่ใหญ่ที่สุด พวกเรามีความเชี่ยวชาญด้านการรักษาผมร่วง รังแค หนังศีรษะมันและคัน และปัญหาอื่นๆเกี่ยวกับเส้นผม พวกเรามีสาขาในสิงคโปร์จำนวน 21 สาขา ในมาเลเซียจำนวน 68 สาขา และมากกว่า 160 สาขาในภูมิภาคเอเชียแปซิฟิก ซึ่งตอนนี้พวกเราได้ขยายสาขามายังกรุงเทพฯ ประเทศไทย พวกเรามีความภาคภูมิใจที่ได้ทำให้ลูกค้าพึงพอใจในผลลัพธ์เป็นอย่างมาก"],
        // This flagship-salon line appears on oily-scalp only, not on grey-hair.
        ["ซาลอนสาขาใหญ่ของเราตั้งอยู่เขตตะวันนา บางกะปิ"],
        CROSS_SELL_FOUNDER.th,
      ]),
    },
    descriptionDraftPending: ["en"],
  },

  "grey-hair": {
    heroTitle: {
      en: "Reverse Premature Grey White Hair",
      th: "ลดผมขาวและผมหงอกอย่างถาวร",
    },
    // This page piloted the revised IA; it now follows the shared standard instead of
    // its own order. The rationale that drove it still holds and is preserved in
    // STANDARD_SECTION_ORDER: the legacy page makes a visitor read ~2,700 characters of
    // education about what grey hair IS before learning what the treatment DOES, then
    // buries "how it works" and the price behind a block of brand/awards copy.
    //
    // Changes from this page's own first pass: Pricing rises above Reviews/crossSell
    // rather than sitting last, and the 7-card grid comes back (it was off because
    // re-listing every treatment mid-page read as filler — as the final section it is
    // exit navigation, and the page no longer lists itself). The education block still
    // deliberately stays high: it is what the page ranks for, merely collapsed into the
    // accordion the EN page already uses. See the `subsections` note in `about.th`.
    //
    // One continuous page tint (white easing to mint on scroll) replaces per-section
    // white/earth bands, so `sectionBackground` / `benefitsAccent` are gone — they'd be
    // inert, since .scroll-tint forces every section transparent. `benefitsDivider` is
    // likewise superseded by `hideDividers`.
    ...STANDARD_CHROME,
    seo: {
      title: {
        en: "Reverse Premature Grey White Hair by Herbal Treatment - Bee Choo Herbal",
        th: "ปิดผมหงอกและผมขาวโดยวิธีธรรมชาติ - Bee Choo Herbal",
      },
      description: {
        // No real Yoast description exists on the live EN page — condensed from this
        // page's own About/Benefits copy below, not invented. Needs Crispin's sign-off.
        en: "100% natural herbal treatment covers premature grey and white hair with a natural dye, right to the roots, while treating the scalp. Safe, non-invasive, no elaborate course required.",
        // Real live-site Yoast description, verbatim (Yoast's own 154-char cut, not ours).
        th: "โดยปกติแล้วหนังศีรษะของลูกค้าของเราจะได้รับการรักษาไปพร้อมๆกับการปกปิดผมหงอกและผมขาวโดยผลิตภัณฑ์ บีชู เฮอร์เบิล จะช่วยปกปิดผมขาวตั้งแต่โคนจรดปลายโดยไม่ก่อ",
      },
    },
    videoId: "Kd9EKBizDIg",
    facebookVideoHref: "https://www.facebook.com/beechooherbal/videos/1096213878455331/",
    // The wrong "How It Works" video, confirmed via YouTube's own oEmbed title
    // ("Bee Choo Branding 2025") — see the field's doc comment above. This ID is what
    // the legacy site itself actually embeds in this exact section on both languages.
    howItWorksVideo: {
      id: { en: "Uwty-ZDdPYc", th: "Uwty-ZDdPYc" },
      title: {
        en: "How Bee Choo herbal hair treatment works",
        th: "ทรีตเมนต์สมุนไพรบีชูให้ผลอย่างไร",
      },
    },
    about: {
      en: {
        heading: "About Premature Grey White Hair",
        intro: [
          "Do take a minute to watch the video above to see how our the natural dye in our herbal paste works. These are all REAL pictures and videos taken at our salon.",
          "Premature white and grey hair can be annoying and it is irreversible.",
          "Yes! Once melanin production ceases in a particular hair follicle, it is permanent. This means that all hair produced by that follicle will forever be white / grey. The simplest and easiest way to deal with white / grey hair is to colour it. Bee Choo Herbal Treatment covers white and grey hair with a natural copper colour while leaving black hair unchanged. Because our treatment is chemical free and improves the health of the scalp, many customers achieve two goals when they do regular scalp maintenance with us; they are able to cover all their white hair to the roots and keep their scalp healthy in the process.",
        ],
        faq: [
          {
            question: "What is Premature Greying/White Hair?",
            answer:
              "Typically, white people (caucasians) start going grey when they are in their mid-30s, but we Thais (Asians) are usually luckier in that aspect. Normally, Thais only start to see signs of greying when they are in their late 30s or after that. Hence, if you start to see your hair turning white or grey in your 20s, it will be considered as premature greying.",
          },
          {
            question: "At what age is it normal to see streaks of white hair?",
            answer:
              "From a survey done at one of our outlets, the highest percentage of people with white hair issues are above 40. From another study in a mixed gender outlet, male customer, on average, start having white hair earlier than female customers by about 5 years. However, we note there is no minimum age, we have seen teenagers as young as 14 years old having streaks and streaks of white hair. A quick rule of thumb used is the 50:50:50 rule: By the age of 50, 50% of the population will have 50% grey hair.",
          },
          {
            question: "What causes Premature Greying/White Hair?",
            answer:
              "The reason why your former black hair is turning grey or white is because the colour-producing cells have stopped producing the pigments that give it that rich and deep colour. Your hair follicles contain pigmentation cells, which are also called melanin. While these cells are tiny and might seem insignificant, they are responsible for giving our hair its natural colour. The higher melanin content generated by your hair follicles, the darker your hair will be. Conversely, the lower the melanin content that is generated by your hair follicles, the lighter the colour of your hair will be. Another possible reason is that naturally occurring hydrogen peroxide might have built up in your hair, causing it to be bleached.",
          },
          {
            question: "Are there any complications from having Premature Greying/White Hair?",
            answer:
              "There is no physical harm derived from having grey or white hair. You could have a perfectly healthy scalp but have loads of white hair. The texture of the white hair is, however, not the same as normal hair. Melanin supplies the hair with moisture, thus, the white hair has less bounce and looks “lifeless”. Yet, when a person, suffers from premature greying, it could affect the self-image of that person. This can be stressful and frightening for some and could even affect their confidence and psychological well-being. Most of the complications that arise from premature greying and white hair derives from how an individual deals with the white hair issue. If a person constantly covers her white hair using chemical dye, it damages her hair and may even harm the scalp if the chemical dye is not done correctly. We have seen customers with severe hair loss caused by chemical burns to the scalp! Our advice is: if you have to constantly cover your white hair, it would be best to opt for a natural dye like ours. Keeping your scalp healthy plus covering those white hair naturally!",
          },
        ],
      },
      th: {
        heading: "เกี่ยวกับ ผมขาว / ผมหงอก ถาวร",
        intro: [
          "เรามาดูวีดีโอการทำทรีทเม้นท์ของเรากันค่ะ ครีมทรีทเม้นท์ของเราทำจากสมุนไพรธรรมชาติเลยนะคะ และรูปทั้งหมดเป็นรูปที่ถ่ายในร้านของเราค่ะ ผมหงอก ผมขาว ใช่ค่ะ! มันเป็นปัญหาที่น่ารำคาญ เมื่อเมลานินในรูขุมขนเส้นผมของเราลดลง ซึ่งเป็นการลดลงอย่างถาวรนะคะ ทำให้ผมที่เกิดขึ้นมาใหม่เรื่อยๆกลายเป็นสีเทาหรือสีขาว และวิธีที่จะช่วยแก้ปัญหาของผมหงอกและผมขาวที่ง่ายที่สุดคือการย้อมค่ะ บีชู เฮอร์เบิล ทรีทเม้นท์ จะช่วยในการปกปิดผมขาว ผมหงอก ของคุณ ด้วย คอปเปอร์จากธรรมชาติ ทรีทเม้นท์ของเราไม่มีส่วนประกอบของสารเคมีใดๆ และพิสูจน์แล้วว่าช่วยทำให้หนังศีรษะมีสุขภาพแข็งแรง ลูกค้าหลายท่านของเราพึงพอใจเป็นอย่างมากในการรักษาเส้นผมและหนังศีรษะของทางร้านเรา ผมขาวทั้งหมดถูกปกปิดตั้งแต่โคนจรดปลายและหนังศีรษะยังมีสุขภาพดีด้วยค่ะ",
        ],
        // No FAQ toggle on the live TH page — instead four always-visible <h3>
        // sub-sections. See AboutSubsection note above.
        //
        // NOTE on presentation: the live TH page ships this as ONE undivided 2,716-char
        // text-editor blob with the four <h3>s embedded in it — no toggles, nothing
        // collapsed. The live EN page carries the SAME four topics as a collapsed
        // 4-item accordion. That asymmetry is why the TH page reads as a wall of text
        // while EN doesn't. We render both languages as the accordion: identical copy,
        // still server-rendered and crawlable inside <details>, just scannable.
        faq: [],
        subsections: [
          {
            heading: "อะไรคือผมขาว ผมหงอก",
            paragraphs: [
              "ปกติแล้วชาวตะวันตกจะเริ่มมีผมขาวในช่วงอายุ 30 กลางๆ และโชคดีสำหรับคนไทยที่พบว่าผมขาวนั้นจะเริ่มขึ้นในช่วงอายุ 30 ปลายๆ และถ้าคุณเริ่มสังเกตเห็นผมขาว หรือผมหงอกที่เริ่มจะงอกขึ้นมาตอนช่วงอายุ 20 นั้น อาจจะเป็นสัญญาณว่าคุณกำลังจะมีผมหงอกก่อนวัยอันควร",
            ],
          },
          {
            heading: "อายุเท่าไหร่ทีจะมีผมขาวอย่างรวดเร็ว",
            paragraphs: [
              "จากผลสำรวจของทางร้านของเรา ผู้ที่มีอายุ 40 ปีขึ้นไปนั้นจะมีเปอร์เซ็นของผมขาวที่เพิ่มขึ้นทั้งในเพศชายและเพศหญิง แต่ในเพศชายผมขาวนั้นจะมาเร็วกว่าเพศหญิงประมาณ 5 ปี แต่ถึงอย่างไรก็ตามการเริ่มมีผมขาวนั้นไม่มีอายุเฉลี่ยที่แน่นอน เพราะเราเคยพบกับลูกค้าที่ต้องเผชิญกับผมขาวในวัยเพียง 14 ปีเท่านั้น",
            ],
          },
          {
            heading: "สาเหตุของผมขาว ผมหงอก",
            paragraphs: [
              "สาเหตุที่ทำให้ผมดำธรรมชาติกลายเป็นสีเทาหรือขาวนั้น เป็นเพราะเมลานิน หรือเซลล์ผลิตเม็ดสีซึ่งอยู่ในรูขุมขนเส้นผมของเรานั้นหยุดการสร้างเม็ดสี",
              "ในขณะที่เซลล์ผลิตเม็ดสีนั้นมีขนาดที่เล็กมากและอาจจะดูไม่สำคัญแต่จะช่วยให้สีผมมีสีธรรมชาติ ระดับของเมลานินและความเข้มของสีผมนั้นขึ้นอยู่กับรูขุมขนเส้นผมของคนเราถ้ามีรูขุมขนเส้นผมจำนวนมาก สีผมก็เข้มขึ้นด้วนเช่นกัน และในทางกลับกัน ถ้าระดับเมลานินในรูขุมขนเส้นผมน้อยก็จะทำให้สีผมมีสีอ่อน และเกิดจากสาเหตุอื่น คือการมีไฮโดรเจนเปอร์ออกไซด์มากเกินไป(เกิดขึ้นเองตามธรรมชาติ)ทำให้เส้นผมมีสีที่จางลง",
            ],
          },
          {
            heading: "มีโรคแทรกซ้อนจากการมีผมขาว ผมหงอกก่อนวัยมั้ย?",
            paragraphs: [
              "โดยปกติแล้วไม่มีอันตรายใดๆในการมีผมขาวหรือผมหงอก คุณสามารถมีหนังศีรษะที่แข็งแรงแต่มีผมขาวผมหงอกทั้งหนังศีรษะได้ แต่ด้วยลักษณะของผมขาวผมหงอกนั้นจะแตกต่างกับผมสีธรรมชาติเพราะเมลานินจะช่วยให้ผมมีความชุ่มชื่น ดังนั้นผมขาวจะดูไม่มีวอลลุมและไม่มีชีวิตชีวา",
              "ถึงอย่างนั้นแล้ว มีผู้คนจำนวนมากมายที่ต้องเผชิญปัญหาผมหงอกและผมขาวก่อนวัย ทำให้สูญเสียความมั่นใจในตนเองและเกิดความกังวลใจในเวลาต่อๆมา",
              "โรคแทรกซ้อนโดยส่วนมากที่เกิดจากการมีผมขาวและผมหงอกคือการใช้ผลิตภัณฑ์ที่มีสารเคมีในการปกปิดสีผม ทำให้สารเคมีนั้นทำอันตรายกับหนังศีรษะเนื่องจากย้อมในวิธีที่ไม่ถูกต้อง พวกเรานั้นเคยพบกับลูกค้าที่มีปัญหาผมร่วงเนื่องจากหนังศีรษะไหม้เพราะสารเคมีมาแล้ว! ทางเลือกที่ดีที่สุดสำหรับผู้ที่มีผมหงอกและผมขาวคือควรเลือกใช้ผลิตภัณฑ์ที่มีส่วนผสมจากธรรมชาติดังเช่นผลิตภัณฑ์ของพวกเราซึ่งจะช่วยให้หนังศีรษะคุณมีสุขภาพที่ดีและช่วยปกปิดผมขาวของคุณอย่างแนบสนิท!",
            ],
          },
        ],
      },
    },
    benefits: {
      en: {
        heading: "Benefits of Natural Dye",
        blocks: [
          {
            kind: "p",
            text: "Our customers come to us regularly to cover their white / grey hair and at the same time get their scalp treated. By choosing Bee Choo Herbal, they are able to cover their white hair safely to the roots without worrying about damaging their scalp or their hair ends.",
          },
          { kind: "p", text: "Our herbal treatment is:" },
          {
            kind: "list",
            items: [
              "Safe and non-invasive",
              "Pain-free, natural and effective",
              "No elaborate course purchase required, you can do one treatment at a time",
              "Price Transparent; and",
              "Covers white hair with a natural reddish/brownish colour",
            ],
          },
          {
            kind: "p",
            text: "However, because our treatment relies only on traditional Chinese herbs, the choice of colouring is also limited.",
          },
        ],
      },
      th: {
        heading: "ประโยชน์ของการใช้ผลิตภัณฑ์จากธรรมชาติในการย้อมผม",
        blocks: [
          {
            kind: "p",
            text: "โดยปกติแล้วหนังศีรษะของลูกค้าของเราจะได้รับการรักษาไปพร้อมๆกับการปกปิดผมหงอกและผมขาวโดยผลิตภัณฑ์ บีชู เฮอร์เบิล จะช่วยปกปิดผมขาวตั้งแต่โคนจรดปลายโดยไม่ก่อให้เกิดอันตรายต่อเส้นผมและหนังศีรษะ",
          },
          {
            kind: "list",
            items: [
              "ข้อดีของทรีทเม้นท์สมุนไพรของพวกเรานั่นก็คือ",
              "ปลอดภัยไม่มีผลข้างเคียง",
              "ไม่แสบเนื่องจากเป็นส่วนผสมจากธรรมชาติ แต่มีประสิทธิภาพสูง",
              "ไม่มีการคิดราคาที่ไม่เป็นธรรม คุณสามารถทำทรีทเม้นท์ในราคาที่ได้ตกลงไว้และสมเหตุสมผล",
              "ปกปิดผมขาวด้วยสีน้ำตาลธรรมชาติ",
              "แต่ถึงอย่างไรก็ตามเนื่องจากผลิตภัณฑ์ของเรามีส่วนผสมของสมุนไพรจีนพื้นบ้านอาจจะทำให้มีสีที่จำกัดในการย้อม",
            ],
          },
        ],
      },
    },
    beforeAfter: {
      en: {
        heading: "See Our Client's Before After Results",
        body: ["Immediately after herbal treatment, white hair will be covered with a copper dye while leaving black hairs unchanged."],
        // Alt text is the live page's actual attribute, verbatim (a previous session's
        // tracking note in this file's header paraphrased it slightly — corrected here).
        images: [
          { src: greyHairBeforeImage, alt: "White hair before herbal treatment", caption: "Before Bee Choo Herbal Treatment" },
          {
            src: greyHairAfterImage,
            alt: "White Hairs Gone Immediately After Treatment",
            // Was "Immediately After Bee Choo Herbal Treatment" — wrapped to 2 lines in
            // the 280px card, unlike its "Before" pair. This caption is our own
            // presentation choice (see BeforeAfterImage's doc comment — the legacy site
            // has no caption here at all), so shortening it is a layout fix, not a copy
            // change; the full "immediately after" claim still lives in `body` above and
            // in `alt`. Same length as "Before Bee Choo Herbal Treatment" now, so the
            // pair reads as a matched set.
            caption: "After Bee Choo Herbal Treatment",
          },
        ],
      },
      th: {
        heading: "มาดูผล ก่อน - หลัง ของลูกค้าของเรากันค่ะ",
        body: ["สีผมของลูกค้าของเราได้ถูกปกปิดทันทีหลังจากทำทรีทเม้นท์สมุนไพร ด้วยคอปเปอร์ธรรมชาติจะช่วยปกปิดผมขาวและผมหงอกแต่ยังคงสีผมธรรมชาติไว้ตามเดิมค่ะ"],
        // Live TH page's <img> tags have no alt attribute at all; these are a plain
        // factual description (not invented marketing copy) to meet CLAUDE.md §7.
        // TH captions were composed from vocabulary already on this page verbatim —
        // "ก่อน"/"หลัง" and "ทันที" from the section heading and body ("...ถูกปกปิด
        // ทันทีหลังจากทำทรีทเม้นท์สมุนไพร"), "บีชู เฮอร์เบิล" from the Benefits
        // paragraph — rather than machine-translated from the English (CLAUDE.md §8).
        // Still worth Crispin's eye before launch, since the phrasing is assembled.
        images: [
          { src: greyHairBeforeImage, alt: "ผมขาวก่อนทำทรีทเม้นท์", caption: "ก่อนทำทรีทเม้นท์ บีชู เฮอร์เบิล" },
          {
            src: greyHairAfterImage,
            alt: "ผมขาวหลังทำทรีทเม้นท์ทันที",
            caption: "ทันทีหลังทำทรีทเม้นท์ บีชู เฮอร์เบิล",
          },
        ],
      },
    },
    tail: {
      en: sharedTail("en", [
        ["Bee Choo Origin is the largest scalp/hair loss treatment salon/clinic specialising in the treatment of hair loss, dandruff, oily scalp and other hair issues. There are 21 outlets in Singapore, 68 outlets in Malaysia with more than 160 outlets across Asia Pacific. The Group has expanded into Bangkok, Thailand and sees Thailand as a potential market to grow the brand. Annually we serve millions of happy customers with effective and proven results."],
        CROSS_SELL_FOUNDER.en,
      ]),
      th: sharedTail("th", [
        // Note: this page says "หนังศีรษะเป็นเชื้อรา" where oily-scalp says
        // "หนังศีรษะมันและคัน" — verbatim per page, which is why this isn't a constant.
        ["บีชู ออริจิน เป็นทรีทเม้นท์ซาลอนและคลินิกที่ใหญ่ที่สุด พวกเรามีความเชี่ยวชาญด้านการรักษาผมร่วง รังแค หนังศีรษะเป็นเชื้อรา และปัญหาอื่นๆเกี่ยวกับเส้นผม พวกเรามีสาขาในสิงคโปร์จำนวน 21 สาขา ในมาเลเซียจำนวน 68 สาขา และมากกว่า 160 สาขาในภูมิภาคเอเชียแปซิฟิก ซึ่งตอนนี้พวกเราได้ขยายสาขามายังกรุงเทพฯ ประเทศไทย พวกเรามีความภาคภูมิใจที่ได้ทำให้ลูกค้าพึงพอใจในผลลัพธ์เป็นอย่างมาก"],
        CROSS_SELL_FOUNDER.th,
      ]),
    },
    descriptionDraftPending: ["en"],
  },

  dandruff: {
    heroTitle: {
      en: "Herbal Treatment to Cure Dandruff Hair",
      th: "ทรีทเมนต์สมุนไพรรักษาปัญหารังแค",
    },
    ...STANDARD_CHROME,
    seo: {
      title: {
        en: "Cure Dandruff Hair with Herbal Treatment - Bee Choo Herbal",
        th: "วิธีขจัดรังแคและความคันอย่างเร่งด่วน - บีชู เฮอร์เบิล",
      },
      description: {
        // No real Yoast description on the live EN page — condensed from this page's own
        // Benefits copy below, not invented. Needs Crispin's sign-off.
        en: "Ling Zhi and Chuan Xiong in Bee Choo's herbal paste settle a dry, flaking scalp and restore healthy circulation. Even persistent dandruff clears in a few sessions.",
        // Real live-site Yoast description, verbatim (Yoast's own 154-char cut, not ours).
        th: "น้ำยาทรีทเม้นท์ของ บีชู มีส่วนประกอบของเห็ดหลินจือที่จะช่วยปรับสภาพของหนังศีรษะให้อยู่ในสภาพที่เป็นปกติ โกฐหัวบัวจะช่วยในการไหลเวียนโลหิตซึ่งจะทำให้การทำงาน",
      },
    },
    videoId: "9-fX3NojpSs",
    // Per-language ids: the legacy EN and TH pages embed DIFFERENT videos in this same
    // section. Verified against both pages' raw HTML — not a transcription slip.
    howItWorksVideo: {
      id: { en: "Uwty-ZDdPYc", th: "Fp3hdtA-pnE" },
      title: {
        en: "How Bee Choo herbal hair treatment works",
        th: "ทรีตเมนต์สมุนไพรบีชูให้ผลอย่างไร",
      },
    },
    about: {
      en: {
        heading: "About Dandruff Hair",
        intro: [
          "Do take a minute to watch the video above to understand how the herbal treatment is able to unclog choked hair pores and remove dandruff. Many of our customers stop experiencing dandruff once they start regular treatment with us. As the health of their scalp improves, the chance of recurrence of dandruff falls drastically.",
          "Many customers are able to eradicate their dandruff issues completely in just a few sessions.",
          "Some common causes of Dandruff are: Long-term use of unsuitable hair products, poor & unhealthy diet or drastic change in climate.",
        ],
        // First page to use AboutContent.image since oily-scalp's photo turned out to be
        // an awards ceremony and moved to RECOGNITION_PHOTO. This one really is a salon
        // photo (legacy P1010006.jpg); the live page carries no alt, so this is a plain
        // factual description written to meet CLAUDE.md §7.
        // alt is the legacy page's own caption on this photo, verbatim — real copy beats
        // a description we would otherwise have had to write.
        image: { src: dandruffAboutPhoto, alt: "Hair & Scalp Analysis done at Bee Choo Origin" },
        faq: [
          {
            question: "What is Dandruff?",
            answer:
              "Dandruff (scientific term – Pityriasis Capitis) are the white skin flakes found in your hair. Sometimes on your shirt when it is excessive. Just brush your hair with your hands, if you see white flakes falling all over the place, you have dandruff. Dandruff is a common condition, which causes itchiness and it can be embarrassing when others notice your dandruff problems.",
          },
          {
            question: "Who is affected by Dandruff?",
            answer:
              "Both men and women suffer from dandruff. It can be triggered by a sudden change in weather or environment. It can also be triggered when you change shampoo to one that is not suitable for your scalp type. You cannot get rid of Dandruff just by the normal washing of hair. Even if you wash your hair frequently, you will notice flakes appearing not long after showering. If you have a dry scalp, dandruff appears to be fine and powdery. For dandruff caused by oily scalp, it will appear yellowish or translucent with a greasy texture and these flakes are slightly larger than flakes caused by dry scalp.",
          },
          {
            // The legacy answer runs to four paragraphs — the cause, an attribution line,
            // the quoted study summary and the citation. Joined into one string, the way
            // every other FaqItem.answer in this file is; no words added or dropped.
            question: "What causes Dandruff?",
            answer:
              "Dandruff is triggered the fungus, Malassezia globosa. The micro-organism is a cousin of the yeast and feeds on sebum. When the globosa grows too quickly, the natural renewal of cells will be disrupted. According to a report in ACS’ Journal of Medicinal Chemistry: Claudiu T. Supuran and colleagues explain that dandruff involves an excessive shedding of dead skin cells from the scalp. In people without dandruff, it takes about 30 days for a crop of new skin cells to mature, die and shed. In people with dandruff, it may take only 2-7 days. Irritation by the scalp-dwelling fungus Malassezia globosa (M. globosa). Reference: Kirsty S. Hewitson, Daniela Vullo, Andrea Scozzafava, Antonio Mastrolorenzo, Claudiu T. Supuran. Molecular Cloning, Characterization, and Inhibition Studies of a β-Carbonic Anhydrase fromMalassezia globosa, a Potential Antidandruff Target. Journal of Medicinal Chemistry, 2012; 55 (7): 3513 DOI: 10.1021/jm300203r",
          },
          {
            question: "Are there any complications from Dandruff?",
            answer:
              "If you have been experiencing chronic dandruff with irritation, redness and unbearable itchiness on your scalp, you could have an underlying condition that is more serious than normal dandruff. You could have a fungal infection or psoriasis. It is important that you seek treatment early before your scalp condition gets worse as it may even lead to hair loss. Dandruff is known to cause psychological damage due to the embarrassment and lost in self-esteem is can cause to the sufferer. Do not feel embarrassed by dandruff, it is a very common condition and it can be solved with the right treatment, hair product and upkeep.",
          },
        ],
      },
      th: {
        heading: "ปัญหารังแค",
        intro: [
          "มาดูวีดูโอการรักษารังแคโดยใช้ทรีทเม้นท์สมุนไพรของเรากันค่ะ จะเห็นว่าทรีทเม้นท์สมุนไพรของเราจะช่วยปลดล็อครูขุมขนที่อุดตันและล้างรังแคออกมา ลูกค้าหลายท่านของเราหยุดการทดลองผลิตภัณฑ์ต่างๆเพื่อรักษารังแค และมารักษาด้วยการทำทรีทเม้นท์กับเรา พบว่าสุขภาพของหนังศีรษะดีขึ้น การเกิดรังแคนั้นน้อยลงจนคุณลูกค้าสังเกตได้",
          "สาเหตุทั่วไปในการเกิดรังแคนั้นคือการเลือกใช้แชมพูที่ไม่เหมาะกับสภาพเส้นผม อาหารที่ไม่ดีต่สุขภาพ และอากาศที่เปลี่ยนแปลง",
        ],
        image: { src: dandruffAboutPhoto, alt: "การทาน้ำยาสมุนไพรบีชูลงบนหนังศีรษะของลูกค้าที่ร้าน" },
        // Same shape as TH grey-hair: no toggle widget on the live TH page, just
        // always-visible <h3> sub-sections inside one text blob. THREE here where EN has
        // four — the Thai page folds "who is affected" and "what causes" into one.
        faq: [],
        subsections: [
          {
            heading: "รังแคคืออะไร",
            paragraphs: [
              "รังแค (ชื่อทางภาษาอังกฤษ – Pityriasis Capitis) คือสะเก็ดผิวสีขาวซึ่งสามารถเจอได้ในเส้นผม ตามเสื้อผ้า เมื่อใช้มือสางก็จะพบว่ามีสะเก็ดของรังแคร่วงอยู่ทั่วๆไป ปัญหารังแคเป็นปัญหาทั่วไปที่นำไปสู่อาการคัน และทำให้เกิดความอับอายเมื่อคนอื่นสามารถมองเห็นรังแคคุณได้",
            ],
          },
          {
            heading: "ใครจะมีรังแคบ้าง",
            paragraphs: [
              "ทั้งผู้ชายและผู้หญิงสามารถมีรังแคได้ทั้งนั้น เนื่องจากอากาศที่เปลี่ยนแปลงหรือเปลี่ยนแชมพู โดยเฉพาะเมื่อใช้แชมพูที่ไม่เหมาะกับสภาพของหนังศีรษะ",
              "คุณไม่สามารถลดจำนวนของรังแคลงได้จากการสระผมธรรมดา ถึงแม้ว่าจะสระผมบ่อยแค่ไหน คุณก็จะสังเกตเห็นรังแคได้เมื่อสระผมไปไม่นาน ถ้าคุณมีหนังศีรษะแห้ง รังแคจะมีลักษณะเหมือนแป้งธรรมดาๆ แต่สำหรับหนังศีรษะมันรังแคจะมีลักษณะเป็นสีเหลือง มีความเหนียวและมีขนาดใหญ่มากกว่ารังแคที่เกิดจากหนังศีรษะแห้ง",
              "รังแค มีสาเหตุมาจากเชื้อรา เชื้อเกลื้อน สิ่งมีชีวิตเล็กๆเหล่านี้อยู่ในเครือเดียวกันกับยีสต์ และกินไขผิวหนังเป็นอาหาร เมื่อเชื้อได้เติบโตไวมากเกินไป การสร้างเซลล์ใหม่นั้นจะถูกทำลาย",
              "อ้างอิงจาก รายงาน ACS’ Journal of Medicinal Chemistry: Claudiu T. Supuran และคณะ กล่าวว่าการมีรังแคนั้นมีความขึ้นอยู่กับการผลัดเซลล์ที่ตายแล้วของหนังศีรษะ สำหรับผู้ที่ไม่มีรังแคหนังศีรษะจะใช้เวลาในการผลัดเซลล์ที่ตายแล้วประมาณ 30 วัน จากนั้นก็จะมีเซลล์เกิดใหม่ตามขึ้นมา แต่สำหรับผู้ที่มีรังแคแล้วจะใช้เวลาแค่ 2 – 7 วัน เท่านั้น",
              "แหล่งข้อมูลจาก Reference: Kirsty S. Hewitson, Daniela Vullo, Andrea Scozzafava, Antonio Mastrolorenzo, Claudiu T. Supuran. Molecular Cloning, Characterization, and Inhibition Studies of a β-Carbonic Anhydrase fromMalassezia globosa, a Potential Antidandruff Target. Journal of Medicinal Chemistry, 2012; 55 (7): 3513 DOI: 10.1021/jm300203r",
            ],
          },
          {
            heading: "มีโรคแทรกซ้อนจากรังแคมั้ย?",
            paragraphs: [
              "ถ้าคุณเคยพบกับปัญหาที่มีต้นเหตุมาจากรังแคเรื้อรัง เช่น หนังศีรษะแดง หรือมีอาการคันแทบจะทนไม่ได้ คุณอาจจะเจอปัญหาที่หนักกว่ารังแคธรรมดา นั่นก็คือการติดเชื้อจากเชื้อรา หรือโรคสะเก็ดเงิน เป็นเรื่องสำคัญที่คุณต้องเข้ารับการรักษาอย่างรวดเร็วก่อนที่จะสายเกินไป หนังศีรษะของคุณอาจจะมีสภาพที่เลวร้ายมากยิ่งขึ้น และนำไปสู่ปัญหาผมหลุดร่วง",
              "รังแคก่อให้เกิดความอับอายและสูญเสียความมั่นใจ แต่อย่าได้กังวลมากเกินไป เนื่องจากเป็นปัญหาที่ธรรมดามากของหนังศีรษะ ปัญหานี้สามารถแก้ไขด้วยการรักษาและการใช้ผลิตภัณฑ์ที่ถูกต้อง",
            ],
          },
        ],
      },
    },
    benefits: {
      en: {
        heading: "Benefits of 100% Natural Herbal Treatment",
        blocks: [
          {
            kind: "p",
            text: "Bee Choo’s herbal paste contains Ling Zhi, the dual-modulating adaptogen that would help to regulate your dry and dandruff scalp and help to regain its healthy state. Chuan Xiong found in our herbal paste is also known to help improve blood circulation which helps the sebaceous glands to function healthily.",
          },
          {
            kind: "p",
            text: "Very often, dryness or dandruff is caused by the wrong choice of shampoo. Bee Choo’s Purity Repair Shampoo, Purity Remove Shampoo and Purity Repair Conditioner is specially designed for our customers who have damaged hair and dandruff. In addition, Bee Choo has tonics catering specifically to dry & dandruff hair. Used in conjunction with our special herbal hair treatment, even the most persistent of dandruff problems can be treated in no time! Do not let dandruff embarrass you anymore, get rid of it today.",
          },
        ],
      },
      th: {
        heading: "ประโยชน์ของ ทรีทเม้นท์สมุนไพร 100เปอร์เซ็น",
        blocks: [
          {
            kind: "p",
            text: "ครีมทรีทเม้นท์ของ บีชู มีส่วนประกอบของเห็ดหลินจือที่จะช่วยปรับสภาพของหนังศีรษะให้อยู่ในสภาพที่เป็นปกติ โกฐหัวบัวจะช่วยในการไหลเวียนโลหิตซึ่งจะทำให้การทำงานของต่อมไขมันเป็นไปอย่างสุขภาพดี",
          },
          {
            kind: "p",
            text: "ในหลายๆครั้งที่ความแห้ง และรังแคมีสาเหตุมาจากการเลือกใช้แชมพูที่ไม่เหมาะสม บีชู เพียวริตี้ รีแพร์ แชมพู, เพียวริตี้ รีมูฟ แชมพู และ ครีมนวด เพียวริตี้ รีแพร์ ผลิตภัณฑ์ของเรานั้นได้ถูกคิดค้นมาเพื่อลูกค้า ผู้ที่มีผมเสียและมีรังแค และยิ่งไปกว่านั้น บีชู ยังมีโทนิคสำหรับหนังศีรษะแห้งและมีรังแคโดยเฉพาะ เมื่อใช้ควบคู่กับการทำทรีทเม้นท์สมุนไพรของเราแล้ว ปัญหารังแคของคุณจะได้รับการรักษาทันที! อย่าให้ปัญหารังแคมาสร้างความอับอายให้แก่คุณอีกเลย มาแก้ไขปัญหาด้วยกันวันนี้.",
          },
        ],
      },
    },
    beforeAfter: {
      en: {
        heading: "See Our Client's Before After Results",
        body: ["Below shows the before and after hair scan of a customer after 4 sessions of herbal treatment. Dandruff has been removed completely and inflammation of the scalp has been reduced greatly."],
        // Unlike grey-hair, this page DOES caption its before/after pair, so both the alt
        // (the live <img> attribute, "Hebral" typo and all) and the caption are legacy
        // copy here rather than anything we composed.
        images: [
          { src: dandruffScanBefore, alt: "dandruff scalp hair scan", caption: "Hair Scan of Dandruff Scalp" },
          {
            src: dandruffScanAfter,
            alt: "Hair Scan After Bee Choo Hebral Treatment Recovered from Dandruff",
            caption: "Hair Scan After 4 Sessions - No more dandruff!",
          },
        ],
      },
      th: {
        heading: "เรามาดูผล ก่อน - หลัง ของลูกค้าของเรากันนะคะ",
        // "สมุนไรพ" is a live-site typo for "สมุนไพร" — kept verbatim per CLAUDE.md §8,
        // same handling as the ปรัฐสภาพผม typo in this file's header. Flag to Crispin.
        body: ["รูปภาพด้านล่างโชว์ผลแสกนทั้งก่อนและหลังหลังจากทำทรีทเม้นท์สมุนไรพ 4 ครั้ง จะเห็นว่ารังแคถูกขจัดออกไปหมดเลยนะคะ และหนังศีรษะที่อักเสบก็ดูดีขึ้นมากด้วยค่ะ"],
        // The live TH <img> tags carry no alt at all; these are plain factual
        // descriptions, and the captions reuse vocabulary already on this page.
        images: [
          { src: dandruffScanBefore, alt: "ผลแสกนหนังศีรษะที่มีรังแคก่อนทำทรีทเม้นท์", caption: "ก่อนทำทรีทเม้นท์ บีชู เฮอร์เบิล" },
          { src: dandruffScanAfter, alt: "ผลแสกนหนังศีรษะหลังทำทรีทเม้นท์ รังแคถูกขจัดออกไป", caption: "หลังทำทรีทเม้นท์ บีชู เฮอร์เบิล" },
        ],
      },
    },
    tail: {
      en: sharedTail(
        "en",
        [
          ["Bee Choo Origin is the largest scalp/hair loss treatment salon/clinic specialising in the treatment of hair loss, dandruff, oily scalp and other hair issues. There are 21 outlets in Singapore, 68 outlets in Malaysia with more than 160 outlets across Asia Pacific. The Group has expanded into Bangkok, Thailand and sees Thailand as a potential market to grow the brand. Annually we serve millions of happy customers with effective and proven results."],
          CROSS_SELL_FOUNDER.en,
        ],
        {
          // Step 3 is the short form on this page only ("Steam for 45 minutes", not
          // "Steam Treatment of your Hair for 45 minutes"). Verbatim per page.
          howItWorks: {
            steps: [
              "Step 1: Apply Hair Tonic on your Scalp",
              "Step 2: Apply Herbal Paste to your Scalp",
              "Step 3: Steam for 45 minutes",
              "Step 4: Rinse-off the Herbal Paste, Scalp Massage and Conditioning of your Hair",
            ],
          },
        },
      ),
      th: sharedTail(
        "th",
        [
          // ONE paragraph, not two: the live TH page carries no founder paragraph and no
          // Business Times links at all — unlike EN, and unlike TH grey-hair. It also
          // says "20 สาขา" in Singapore where every other page says 21. Verbatim.
          ["บีชู ออริจิน เป็นทรีทเม้นท์ซาลอนและคลินิกที่ใหญ่ที่สุด พวกเรามีความเชี่ยวชาญด้านการรักษาผมร่วง รังแค หนังศีรษะ และปัญหาอื่นๆเกี่ยวกับเส้นผม พวกเรามีสาขาในสิงคโปร์จำนวน 20 สาขา ในมาเลเซียจำนวน 68 สาขา และมากกว่า 160 สาขาในภูมิภาคเอเชียแปซิฟิก ซึ่งตอนนี้พวกเราได้ขยายสาขามายังกรุงเทพฯ ประเทศไทย พวกเรามีความภาคภูมิใจที่ได้ทำให้ลูกค้าพึงพอใจในผลลัพธ์เป็นอย่างมาก"],
        ],
        {
          howItWorks: {
            // "100เปอร์เซ็นต์" with the final ต์ on this page and damaged-hair; every
            // other TH page writes "100เปอร์เซ็น".
            heading: "ทรีทเม้นท์สมุนไพร 100เปอร์เซ็นต์ ให้ผลยังไงมาดูกัน!",
            // The intro names the thinning-hair clinic too ("คลินิกรักษาผมบางที่ดีที่สุด")
            // where grey-hair/oily-scalp just say "รักษาผมร่วงที่ดีที่สุด". Caught by
            // inventory/scripts/06-copy-parity.mjs, not by eye.
            intro:
              "ด้วยชื่อเสียงที่มีเสมอมาของซาลอน/คลินิกรักษาผมร่วง คลินิกรักษาผมบางที่ดีที่สุด ผลิตภัณฑ์ของเราทั้งหมดมีส่วนผสมจากธรรมชาติและมีความปลอดภัย ให้ผลลัพธ์ที่มีประสิทธิภาพสูง ทำให้เส้นผมที่สุขภาพไม่ดี แห้ง มัน และถูกทำร้ายจะถูกฟื้นฟูอย่างรวดเร็ว สีย้อมผมจากธรรมชาติในทรีทเม้นท์ของเราจะช่วยปกปิดผมขาวจนไปถึงโคนของเส้นผม",
          },
        },
      ),
    },
    descriptionDraftPending: ["en"],
  },

  "damaged-hair": {
    heroTitle: {
      en: "Repair Chemically Damaged Dry Hair",
      th: "ซ่อมแซมผมเสียจากการทำสีด้วยสารเคมี",
    },
    ...STANDARD_CHROME,
    seo: {
      title: {
        en: "Repair Chemically Damaged Dry Hair with Herbal Treatment - Bee Choo Herbal",
        th: "แก้ปัญหาผมเสียจากสารเคมีเร่งด่วนด้วยสมุนไพร - Bee Choo (บีชู เฮอร์เบิล)",
      },
      description: {
        // No real Yoast description on the live EN page — condensed from this page's own
        // Benefits copy below, not invented. Needs Crispin's sign-off.
        en: "Chuan Xiong, Ginseng, Dang Gui, He Shou Wu and Ling Zhi coat every strand with a protective layer, repairing chemically damaged hair and covering white hair without dye.",
        // Real live-site Yoast description, verbatim (Yoast's own cut, not ours). Note it
        // opens "น้ำยาย้อมผม" where the on-page Benefits paragraph says "ครีมปกปิดผมขาว" —
        // Yoast's stored text differs slightly from the body copy; kept as Yoast has it.
        th: "น้ำยาย้อมผมตัวเด็ดของเรานั้น เป็นที่รู้กันดีว่าประกอบไปด้วยสมุนไพรจีนพื้นบ้านหลายชนิด ได้แก่ ชวนซง, โสม, ตังกุย, ห่อสิ่วโอว และเห็ดหลินจือ และในการทำทรีทเม้",
      },
    },
    // No videoId: the legacy page embeds NO condition video in either language — its
    // About block opens straight into the copy. The EN intro still says "watch the video
    // above", which is a legacy inconsistency, not a missing transcription; reproduced
    // verbatim per CLAUDE.md §8. Flag to Crispin.
    howItWorksVideo: {
      id: { en: "Uwty-ZDdPYc", th: "Uwty-ZDdPYc" },
      title: {
        en: "How Bee Choo herbal hair treatment works",
        th: "ทรีตเมนต์สมุนไพรบีชูให้ผลอย่างไร",
      },
    },
    about: {
      en: {
        heading: "About Chemically Damaged Dry Hair",
        intro: [
          "Do take a minute to watch the video above to see how our customer overcame her damaged hair and split-ends. These are all REAL pictures and videos taken at our salon. Frequent usage of chemicals in either styling or treatments is widely known to be damaging to our hair. However, what many are unaware of is that incorrect usage of these products may also lead to damaged hair and its associated problems. Chemically damaged hair can be treated effectively, but it takes time and patience. Thousands of customers trust us with their hair.",
        ],
        image: { src: damagedHairAboutPhoto, alt: "Client's hair after Bee Choo herbal treatment for chemically damaged, dry ends" },
        faq: [
          {
            question: "What is Chemically Damaged Hair?",
            answer:
              "Our hair is made up of dead skin cells which is why during a haircut, you do not feel any pain. However, that doesn’t mean you can do as you please with your hair; it still can be damaged. Overdrying or frequent exposure to harsh chemical substances can ruin one’s hair, causing it to become frizzy or ‘wiry’. This happens when the outer structure of a hair strand, the cuticle, gets damaged or eroded, leaving the cortex exposed, causing more hair breakages, split ends and causing visibly unhealthy hair.",
          },
          {
            question: "What causes Hair Damage?",
            answer:
              "Chemical hair dyes contain lots of harmful chemicals including peroxide and ammonia. These chemicals damages and weakens your hair. If these chemicals get in contact with your scalp, it can cause chemical burns, itchiness and sensitivity. Using third-grade chemical dyes without proper licensing can lead to disastrous results. In the process of changing your hair colour, the dye has to break through your hair’s natural protection, the cuticle, to get into the hair shaft. The ammonia contained in the dye raises the cuticle, allowing the peroxide to bleach out your natural hair colour. Finally, the colouring component comes in and does its job. Post colouring, the hair structure is no longer what it used to be and the cuticle is almost always damaged permanently in the process. In addition, overheating from styling tools such as the hair iron, curlers or blow dryers can cause damage to your hair resulting in split-ends and brittle hair.",
          },
          {
            // The legacy answer here is a three-item bullet list, not prose. FaqItem.answer
            // is a single string, so the items are joined into one paragraph — same words,
            // same order. Worth revisiting if a page ever needs a real list inside an FAQ.
            question: "How Do I know If My Hair / Scalp Have Been Damaged?",
            answer:
              "If you ever bleached your hair, it probably is damaged permanently. You experience frizzy and dry hair ends. You have to use a flat iron or blow dryer every morning to style your hair, without this routine, your hair would be a mess. You have bumps and itchiness on your scalp after doing a chemical treatment.",
          },
          {
            // "the scalp.Less serious" — missing space after the full stop on the live
            // page. Kept verbatim; flag to Crispin.
            question: "What are the complications of Chemical Damage?",
            answer:
              "Hair ends that have been damaged are frizzy, dry and have split-ends. There are no severe complications from this other than the aesthetics aspect. It is not easy to repair such damaged hair, you will have to abstain from the daily routine of ironing/blow drying your hair before heading out and cut down on chemical treatments. You might suffer in the short-run but continue natural herbal treatment with us and trust that it would be better in the long-run. More serious complications arise when chemical burns affect the scalp.Less serious chemical allergies can lead to reddish bumps and sensitive scalp that causes itchiness and pain. More serious chemical burns can even damage the hair follicles severely causing hair to fall out in clumps.",
          },
        ],
      },
      th: {
        heading: "เกี่ยวกับผมแห้งเสียเนื่องจากสารเคมี",
        // "ประมาณงนะคะ" is incomplete on the live page (a word appears to be missing
        // after "ประมาณ"). Kept verbatim per CLAUDE.md §8; flag to Crispin.
        intro: [
          "เรามาดูวีดีโอด้านบนกันค่ะ จะเห็นว่าคุณลูกค้าท่านนี้มีผมเสียและแตกปลาย รูปภาพนี้เป็นภาพจริงนะคะ ถ่ายที่ซาลอน/คลินิก ของเราเลยค่ะ การใช้ผลิตภัณฑ์จัดแต่งทรงผมที่เต็มไปด้วยสารเคมีเป็นที่รู้กันดีว่าทำให้ผมเสียเป็นอย่างมาก และยังคงนำไปสู่ปัญหาผมต่างๆตามมาเช่นกัน ผมเสียจากสารเคมีสามารถรักษาได้อย่างมีประสิทธิภาพ ขั้นตอนในการรักษานั้นก็จะต้องใช้ระยะเวลาประมาณงนะคะ ลูกค้าเป็นจำนวนมากมีความเชื่อมั่นให้พวกเราดูแลเส้นผมค่ะ",
        ],
        image: { src: damagedHairAboutPhoto, alt: "เส้นผมของลูกค้าหลังทำทรีทเม้นท์สมุนไพรบีชูสำหรับผมแห้งเสียจากสารเคมี" },
        faq: [],
        subsections: [
          {
            heading: "ผมเสียจากสารเคมีคืออะไร",
            paragraphs: [
              "เส้นผมของเรานั้นเกิดจากเซลล์ผิวที่ตายแล้ว นี่เป็นเหตุผลว่าทำไมเมื่อเราตัดผมเราจึงไม่รู้สีกเจ็บ แต่เพียงแค่การตัดผมนั้นก็ไม่สามารถทำให้พวกเราพอใจได้ การไดร์ผมบ่อยๆ และให้ผมสัมผัสกับสารเคมีนั้นเป็นการทำร้ายผมเป็นอย่างมาก ผมจึงมีสภาพแห้งกรอบ หงิกงอ เส้นผมลักษณะนี้แสดงให้เห็นว่าเกลียวผมได้ถูกทำลาย และเปลือกนอกของเส้นผมได้ถูกเปิดออก ยิ่งผมแตกหักและแห้งแตกปลายมากเท่าไหร่ก็จะแสดงถึงผมที่สุขภาพไม่ดีมากเท่านั้น",
            ],
          },
          {
            heading: "อะไรที่ทำให้ผมเสีย",
            paragraphs: [
              "สีย้อมผมนั้นประกอบด้วยสารเคมีที่เป็นอันตรายมากมายเช่น เปอร์ออกไซด์ และ แอมโมเนีย สารเคมีเหล่านี้จะทำให้ผมอ่อนแอลง และถ้าสารเหล่านี้ได้สัมผัสกับหนังศีรษะนั้นจะสามารถทำให้เกิดการไหม้จากสารเคมี ความคันและทำให้หนังศีรษะบอบบางได้ และยิ่งไปกว่านั้นการใช้ผลิตภัณฑ์ที่ไม่ได้มาตรฐาน ไม่ได้มีใบอนุญาตจะยิ่งก่อให้เกิดผลที่เลวร้ายมากยิ่งขึ้น",
              "ขั้นตอนในการย้อมสีผมนั้น สีย้อมผมจะเข้าไปทำลายผมชั้นนอกที่เป็นตัวปกป้องเส้นผมโดยธรรมชาติเพื่อที่จะได้ซึมเข้าสู่ก้านผม เมื่อแอมโมเนียเข้าถึงผิวชั้นนอก เปอร์ออกไซด์ก็จะทำให้สีผมธรรมชาตินั้นจางลง และเมื่อสีผมได้ถูกเปลี่ยนขั้นตอนก็จะเสร็จสิ้น",
              "และยิ่งไปกว่านั้น การใช้เครื่องมือในการจัดแต่งทรงผม เช่นที่รีดผมไฟฟ้า ที่ม้วนผม หรือไดร์เป่าผมสามารถทำให้ผมแตกปลายและขาดเปราะได้ง่าย",
            ],
          },
          {
            heading: "จะรู้ได้ยังไงว่าผมเสีย",
            paragraphs: [
              "การกัดสีผมนั้นเป็นการทำร้ายผมอย่างถาวร คุณจะรู้สึกถึงความแห้งกรอบได้ที่ปลายผม และถ้าคุณใช้ที่รีดผมไฟฟ้าหรือไดร์เป่าผมเพื่อจัดแต่งทรงทุกวันในตอนเช้า เมื่อทำเป็นประจำอย่างต่อเนื่องคุณก็จะได้ผลกระทบนั่นก็คืออาการคันที่หนังศีรษะหลังจากผ่านการทำผมโดยใช้สารเคมี",
            ],
          },
          {
            heading: "โรคแทรกซ้อนอะไรที่เกิดจากความเสียหายจากสารเคมี",
            paragraphs: [
              "ไม่มีโรคแทรกซ้อนใดๆที่เกิดจากการมีผมแห้งเสียแตกปลาย นอกเสียจากความไม่สวยงามที่สามารถมองเห็นได้ ในการรักษาผมเสียนั้นไม่ได้ทำกันง่ายๆนัก เนื่องจากต้องงดการจัดแต่งทรงผมโดยใช้อุปรณ์ไฟฟ้าต่างๆหรือการย้อมสี คุณอาจจะต้องทนกับการทำทรีทเม้นท์สมุนไพรในระยะสั้นๆกับพวกเรา แต่เชื่อเถอะค่ะว่ามันจะดีต่อสุขภาพของเส้นผมในระยะยาวแน่นอน",
              "สำหรับปัญหาที่น่ากลัวมากกว่าโรคแทรกซ้อนนั่นก็คือ หนังศรีษะที่ไหม้จากสารเคมี และการแพ้สารเคมีในผลิตภัณฑ์ที่อาจจะทำให้หนังศีรษะมีตุ่มสีแดงๆ มีความบอบบาง ซึ่งก่อให้เกิดอาการคันและเจ็บแสบ และยิ่งกว่าปัญหาที่กล่าวมานี้ คือเมื่อสารเคมีได้เข้าไปทำลายรูขุมขนเส้นผมหลายๆครั้งก็จำสามารถทำให้เกิดปัญหาผมร่วงเป็นกระจุกได้",
            ],
          },
        ],
      },
    },
    benefits: {
      en: {
        heading: "Benefits of 100% Natural Herbal Treatment",
        blocks: [
          {
            kind: "p",
            text: "Bee Choo’s signature Herbal Paste is specially blended with several Chinese herbs including Chuan Xiong, Ginseng, Dang Gui, He Shou Wu and Ling Zhi. After each of our treatment session, every strand of your hair would be coated with a protective layer. This helps reduce damage to hair and also repairs damaged hair by acting as a replacement for the damaged cuticle. Furthermore, the treatment covers all white hair in the process, meaning to say, you no longer need to chemically dye your hair with this special herbal treatment!",
          },
        ],
      },
      th: {
        heading: "ประโยชน์ของทรีทเม้นท์สมุนไพร 100เปอร์เซ็น",
        blocks: [
          {
            kind: "p",
            text: "ครีมปกปิดผมขาวตัวเด็ดของเรานั้น เป็นที่รู้กันดีว่าประกอบไปด้วยสมุนไพรจีนพื้นบ้านหลายชนิด ได้แก่ ชวนซง, โสม, ตังกุย, ห่อสิ่วโอว และเห็ดหลินจือ และในการทำทรีทเม้นท์ทุกครั้ง เกลียวของเส้นผมจะได้รับการปกป้อง ซึ่งจะช่วยให้เส้นผมถูกทำร้ายได้ยากขึ้นและรักษาผมเสียโดยการเคลือบผมประหนึ่งเกราะชั้นนอก",
          },
        ],
      },
    },
    beforeAfter: {
      en: {
        heading: "See Our Client's Before After Results",
        body: ["Shortly within 3 months of hair treatment with Bee Choo Origin, this client achieved this effective results below:"],
        images: [],
        // TWO GIPHY clips, side by side, exactly as the legacy page shows them — this is
        // the page that forced `embeds` to be a list rather than one `giphyId`.
        embeds: [
          { kind: "giphy", id: "ywk5yj8EPv7Vzu2K4F" },
          { kind: "giphy", id: "LVOdW9t7VMge0jk0Vz" },
        ],
      },
      th: {
        heading: "มาดูผล ก่อน - หลัง จากการทำทรีทเม้นท์ของลูกค้ากันค่ะ",
        body: ["เพียงในระยะเวลาแค่ 3 เดือน เท่านั้น! กับการทำทรีทเม้นท์กับ บีชู ออริจิน ลูกค้าได้ผลลัพธ์ที่มีประสิทธิภาพตามรูปด้านล่างนี้"],
        images: [],
        embeds: [
          { kind: "giphy", id: "ywk5yj8EPv7Vzu2K4F" },
          { kind: "giphy", id: "LVOdW9t7VMge0jk0Vz" },
        ],
      },
    },
    tail: {
      en: sharedTail(
        "en",
        [
          ["Bee Choo Origin is the largest scalp/hair loss treatment salon/clinic specialising in the treatment of hair loss, dandruff, oily scalp and other hair issues. There are 21 outlets in Singapore, 68 outlets in Malaysia with more than 160 outlets across Asia Pacific. The Group has expanded into Bangkok, Thailand and sees Thailand as a potential market to grow the brand. Annually we serve millions of happy customers with effective and proven results."],
          CROSS_SELL_FOUNDER.en,
        ],
        {
          howItWorks: {
            // This page's intro carries an extra closing clause about no longer needing
            // chemical dye that no other EN page has, and step 4 capitalises the "Off".
            intro:
              "Consistently rated as the Best Natural Hair Loss Treatment Salon Clinic in Bangkok, our all natural, safe & highly effective herbal hair treatment gives your Unhealthy/Dry/Damaged/Oily scalp instant rejuvenation. The natural dye contained in the treatment also covers your white hair to the roots in the process, this means you no longer have to dye your hair with chemicals, avoiding damage done by such colouring.",
            steps: [
              "Step 1: Apply Hair Tonic on your Scalp",
              "Step 2: Apply Herbal Paste to your Scalp",
              "Step 3: Steam Treatment of your Hair for 45 minutes",
              "Step 4: Rinse-Off the Herbal Paste, Scalp Massage and Conditioning of your Hair",
            ],
          },
        },
      ),
      th: sharedTail(
        "th",
        [
          // ONE paragraph again — no founder paragraph, no Business Times links, and
          // "20 สาขา". Byte-identical to dandruff TH's, but kept per page rather than
          // hoisted: these two pages agreeing is a fact about the legacy site, not a
          // rule, and the other five TH pages all word this differently.
          ["บีชู ออริจิน เป็นทรีทเม้นท์ซาลอนและคลินิกที่ใหญ่ที่สุด พวกเรามีความเชี่ยวชาญด้านการรักษาผมร่วง รังแค หนังศีรษะ และปัญหาอื่นๆเกี่ยวกับเส้นผม พวกเรามีสาขาในสิงคโปร์จำนวน 20 สาขา ในมาเลเซียจำนวน 68 สาขา และมากกว่า 160 สาขาในภูมิภาคเอเชียแปซิฟิก ซึ่งตอนนี้พวกเราได้ขยายสาขามายังกรุงเทพฯ ประเทศไทย พวกเรามีความภาคภูมิใจที่ได้ทำให้ลูกค้าพึงพอใจในผลลัพธ์เป็นอย่างมาก"],
        ],
        // Same two How-It-Works deviations as dandruff TH: the "100เปอร์เซ็นต์" heading,
        // and an intro that also names the thinning-hair clinic.
        {
          howItWorks: {
            heading: "ทรีทเม้นท์สมุนไพร 100เปอร์เซ็นต์ ให้ผลยังไงมาดูกัน!",
            intro:
              "ด้วยชื่อเสียงที่มีเสมอมาของซาลอน/คลินิกรักษาผมร่วง คลินิกรักษาผมบางที่ดีที่สุด ผลิตภัณฑ์ของเราทั้งหมดมีส่วนผสมจากธรรมชาติและมีความปลอดภัย ให้ผลลัพธ์ที่มีประสิทธิภาพสูง ทำให้เส้นผมที่สุขภาพไม่ดี แห้ง มัน และถูกทำร้ายจะถูกฟื้นฟูอย่างรวดเร็ว สีย้อมผมจากธรรมชาติในทรีทเม้นท์ของเราจะช่วยปกปิดผมขาวจนไปถึงโคนของเส้นผม",
          },
        },
      ),
    },
    descriptionDraftPending: ["en"],
  },
};

// `sectionOrder` is a WHITELIST, not merely an order: TreatmentPage maps over it, so any
// key left out is silently never rendered and that section's copy vanishes from the page
// with no build error. With every page now carrying an explicit order, a single typo
// would drop indexed content — exactly the failure mode CLAUDE.md §7 exists to prevent.
// Fail the build instead of shipping a page that quietly lost a section.
for (const [slug, page] of Object.entries(TREATMENT_PAGES)) {
  if (!page.sectionOrder) continue;
  const order = page.sectionOrder;
  const missing = ALL_SECTIONS.filter((key) => !order.includes(key));
  const duplicated = order.filter((key, i) => order.indexOf(key) !== i);
  if (missing.length > 0 || duplicated.length > 0) {
    throw new Error(
      `treatment-pages: "${slug}" has an invalid sectionOrder` +
        (missing.length > 0 ? ` — missing section(s) whose copy would silently not render: ${missing.join(", ")}` : "") +
        (duplicated.length > 0 ? ` — duplicated section(s): ${duplicated.join(", ")}` : ""),
    );
  }
  // .brand-band (Part 2 — "about Bee Choo Herbal") assumes the brand sections form one
  // contiguous, trailing run so it can wrap them as a single visual band. Both orders
  // defined above satisfy this; this guards any future custom order from silently
  // breaking that assumption.
  const firstBrand = order.findIndex((key) => BRAND_SECTIONS.includes(key));
  if (firstBrand !== -1 && order.slice(firstBrand).some((key) => !BRAND_SECTIONS.includes(key))) {
    throw new Error(
      `treatment-pages: "${slug}" interleaves brand sections with concern sections — .brand-band renders BRAND_SECTIONS as one contiguous trailing run`,
    );
  }
}
