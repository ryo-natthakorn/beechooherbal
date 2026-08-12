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
// - Pure image-caption fragments (e.g. "Example of clogged hair pore") were dropped from
//   the extracted paragraphs — they're captions for inline images that aren't sourced
//   into this build yet (see spec's Content gaps §1), and reproducing an orphaned
//   caption with no image would read as a typo, not fidelity.
//
// Still missing vs. the live site, blocked NOT by a decision but by network egress —
// beechooherbal.com is unreachable from the build sandbox (proxy 403), so no legacy
// binary can be downloaded here. Tracked so it isn't lost:
// - grey-hair before/after photos: before-treatment-269x300.png ("White Hair Before Bee
//   Choo Herbal Treatment") + after-1-295x300.png ("White Hairs Covered Immediately
//   After Treatment"). `beforeAfter.images` is [] until they land; the section renders
//   its heading and body regardless.
// - oily-scalp: About-section photo IMG_2850 and two inline FAQ images.
// - both: the trailing locations map graphic.

import type { ImageMetadata } from "astro";

export type Lang = "en" | "th";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AboutSubsection {
  heading: string;
  paragraphs: string[];
}

interface AboutContent {
  heading: string;
  /** Paragraphs above the FAQ accordion / subsections. */
  intro: string[];
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
}

/** The legacy "SEE OUR CLIENT'S BEFORE AFTER RESULTS" band. Heading and body render
 *  even when `images` is empty — on the live site the heading is always present, and
 *  for oily-scalp the visual is a GIPHY embed rather than photos. */
interface BeforeAfterContent {
  heading: string;
  /** Paragraph(s) under the heading. */
  body: string[];
  /** Legacy photos. Empty where they can't be sourced yet — see the file header. */
  images: BeforeAfterImage[];
  /** giphy.com embed id, where the before/after visual is an animation (oily-scalp). */
  giphyId?: string;
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

export interface TreatmentPageContent {
  /** H1. Distinct from src/data/treatments.ts's homepage-card `title`. */
  heroTitle: Record<Lang, string>;
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
   *  wiring here. */
  videoId: string;
  /** Some pages (grey-hair) also embed a Facebook video in the About section. Full
   *  permalink of the source video — the component builds the plugin URL. */
  facebookVideoHref?: string;
  about: Record<Lang, AboutContent>;
  benefits: Record<Lang, BenefitsContent>;
  beforeAfter: Record<Lang, BeforeAfterContent>;
  tail: Record<Lang, TailContent>;
  /** Pages whose meta description isn't real live-site copy yet. */
  descriptionDraftPending?: Lang[];
}

// The two Business Times articles the cross-sell paragraph links to, on every page.
const BT_TESTIMONIES = "http://www.businesstimes.com.sg/hub/bt-salutes-enterprise-2016/power-of-testimonies-drives-business-growth";
const BT_SINCERITY = "http://www.businesstimes.com.sg/hub-projects/ceo-conversations-2017/sincerity-before-profit";

// How-It-Works and the pricing closing lines are word-for-word identical across all 7
// treatment pages (verified on oily-scalp + grey-hair); the cross-sell block is NOT, so
// it stays per-page below.
const REVIEWS_HEADING: Record<Lang, string> = {
  en: "REVIEWS ON BEECHOO HAIR TREATMENT",
  th: "รีวิว บีชู แฮร์ ทรีทเม้นท์",
};

const HOW_IT_WORKS: Record<Lang, TailContent["howItWorks"]> = {
  en: {
    heading: "100% NATURAL HERBAL HAIR TREATMENT - HOW IT WORKS",
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
    heading: "AFFORDABLE HAIR TREATMENT IN Bangkok, Thailand",
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
  en: "BEST HAIR LOSS TREATMENT SALON CLINIC IN BANGKOK, Thailand",
  th: "ทรีทเม้นท์รักษาผมร่วงที่เห็นผลมากที่สุดในประเทศไทย",
};

export const TREATMENT_PAGES: Record<string, TreatmentPageContent> = {
  "oily-scalp": {
    heroTitle: {
      en: "OILY ITCHY SCALP HAIR TREATMENT",
      th: "ทรีทเม้นท์สำหรับผมมันและอาการคันหนังศีรษะ",
    },
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
        heading: "ABOUT ITCHY OILY SCALP HAIR CONDITION",
        intro: [
          "Do take a minute to watch the video above to see how our customer had recovered from his oily scalp condition. These are all REAL pictures and videos taken at our salon. Oily Scalp in both men and women can be treated effectively with Bee Choo Herbal Hair Treatment. Thousands of customers trust us with their hair.",
          "Our scalp naturally secretes oil via the sebaceous glands and this oil protects the hair and sustains its structure. However, due to several factors, the sebum production could go into overdrive, causing excessive oil on the scalp, a condition known as seborrheic dermatitis. Excessive oil not only causes you to feel uncomfortable and itchy and it could ultimately lead to hair loss if left untreated!",
        ],
        faq: [
          {
            question: "What is Itchy and Oily Scalp?",
            answer:
              "The hot weather in Thailand, unhealthy diet, stress and wrong use of shampoo are factors that cause excess oil production in our scalp. Prolong usage of helmet and poor hygiene conditions relating to headgears and helmet also irritates and causes the scalp to overproduce oil. Excess oil builds up on the scalp causing hair follicles to get clogged.",
          },
          {
            question: "Why am I suffering from Itchy and Oily Scalp?",
            answer:
              "This is a common condition especially in temperate countries like Bangkok, Thailand. According to a survey done in 2017 with our first time customers, we found that ~30% of them visit us to seek help regarding itchy and oily scalp problems. The common causes of oily and itchy scalp are the use of wrong shampoo type and unhealthy diet (i.e. too much fried food and processed food).",
          },
          {
            question: "What exactly causes Itchy and Oily Scalp?",
            answer:
              "The condition is scientifically known seborrheic dermatitis. This condition is triggered by oily scalp and an overgrowth of yeast. Bacteria and yeast can infect the hair follicles leading to the itchiness felt in your scalp! Poor hygiene is another main culprit. Poorly kept scalp induces the production of sebum in the scalp. If hair is not washed with right shampoo frequent enough, the oils on the scalp will accumulate. Oily scalp can even lead to dandruff, dandruff caused by excess oil are yellowish in colour and the flakes are larger than their counter-parts caused by dry scalp.",
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
        heading: "BENEFITS OF 100% NATURAL HERBAL TREATMENT",
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
        heading: "SEE OUR CLIENT'S BEFORE AFTER RESULTS",
        body: ["Get rid of the itch and excess oil today. With regular treatment, your scalp will be free of itch and excess oil."],
        images: [],
        giphyId: "t7752IVYRBN1YzOPaL",
      },
      th: {
        heading: "มาดูผล ก่อน - หลัง ของลูกค้าของเรา",
        body: ["มาลดความมันและความคันของหนังศีรษะกันค่ะ ด้วยทรีทเม้นท์ของพวกเรา คุณจะรู้สึกสบายมากขึ้นเมื่อไม่มีน้ำมันและอาการคันมากวนใจ"],
        images: [],
        giphyId: "t7752IVYRBN1YzOPaL",
      },
    },
    tail: {
      en: {
        reviewsHeading: REVIEWS_HEADING.en,
        crossSell: {
          heading: CROSS_SELL_HEADING.en,
          paragraphs: [
            ["Bee Choo Origin is the largest scalp/hair loss treatment salon/clinic specialising in the treatment of hair loss, dandruff, oily scalp and other hair issues. There are 21 outlets in Singapore, 68 outlets in Malaysia with more than 160 outlets across Asia Pacific. The Group has expanded into Bangkok, Thailand and sees Thailand as a potential market to grow the brand. Annually we serve millions of happy customers with effective and proven results."],
            CROSS_SELL_FOUNDER.en,
          ],
        },
        howItWorks: HOW_IT_WORKS.en,
        pricing: PRICING.en,
      },
      th: {
        reviewsHeading: REVIEWS_HEADING.th,
        crossSell: {
          heading: CROSS_SELL_HEADING.th,
          paragraphs: [
            ["บีชู ออริจิน เป็นทรีทเม้นท์ซาลอนและคลินิกที่ใหญ่ที่สุด พวกเรามีความเชี่ยวชาญด้านการรักษาผมร่วง รังแค หนังศีรษะมันและคัน และปัญหาอื่นๆเกี่ยวกับเส้นผม พวกเรามีสาขาในสิงคโปร์จำนวน 21 สาขา ในมาเลเซียจำนวน 68 สาขา และมากกว่า 160 สาขาในภูมิภาคเอเชียแปซิฟิก ซึ่งตอนนี้พวกเราได้ขยายสาขามายังกรุงเทพฯ ประเทศไทย พวกเรามีความภาคภูมิใจที่ได้ทำให้ลูกค้าพึงพอใจในผลลัพธ์เป็นอย่างมาก"],
            // This flagship-salon line appears on oily-scalp only, not on grey-hair.
            ["ซาลอนสาขาใหญ่ของเราตั้งอยู่เขตตะวันนา บางกะปิ"],
            CROSS_SELL_FOUNDER.th,
          ],
        },
        howItWorks: HOW_IT_WORKS.th,
        pricing: PRICING.th,
      },
    },
    descriptionDraftPending: ["en"],
  },

  "grey-hair": {
    heroTitle: {
      en: "REVERSE PREMATURE GREY WHITE HAIR",
      th: "ลดผมขาวและผมหงอกอย่างถาวร",
    },
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
    about: {
      en: {
        heading: "ABOUT PREMATURE GREY WHITE HAIR",
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
        heading: "BENEFITS OF NATURAL DYE",
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
        heading: "SEE OUR CLIENT'S BEFORE AFTER RESULTS",
        body: ["Immediately after herbal treatment, white hair will be covered with a copper dye while leaving black hairs unchanged."],
        // Legacy photos exist (before-treatment-269x300.png / after-1-295x300.png) but
        // can't be downloaded from this sandbox — see the file header.
        images: [],
      },
      th: {
        heading: "มาดูผล ก่อน - หลัง ของลูกค้าของเรากันค่ะ",
        body: ["สีผมของลูกค้าของเราได้ถูกปกปิดทันทีหลังจากทำทรีทเม้นท์สมุนไพร ด้วยคอปเปอร์ธรรมชาติจะช่วยปกปิดผมขาวและผมหงอกแต่ยังคงสีผมธรรมชาติไว้ตามเดิมค่ะ"],
        images: [],
      },
    },
    tail: {
      en: {
        reviewsHeading: REVIEWS_HEADING.en,
        crossSell: {
          heading: CROSS_SELL_HEADING.en,
          paragraphs: [
            ["Bee Choo Origin is the largest scalp/hair loss treatment salon/clinic specialising in the treatment of hair loss, dandruff, oily scalp and other hair issues. There are 21 outlets in Singapore, 68 outlets in Malaysia with more than 160 outlets across Asia Pacific. The Group has expanded into Bangkok, Thailand and sees Thailand as a potential market to grow the brand. Annually we serve millions of happy customers with effective and proven results."],
            CROSS_SELL_FOUNDER.en,
          ],
        },
        howItWorks: HOW_IT_WORKS.en,
        pricing: PRICING.en,
      },
      th: {
        reviewsHeading: REVIEWS_HEADING.th,
        crossSell: {
          heading: CROSS_SELL_HEADING.th,
          paragraphs: [
            // Note: this page says "หนังศีรษะเป็นเชื้อรา" where oily-scalp says
            // "หนังศีรษะมันและคัน" — verbatim per page, which is why this isn't a constant.
            ["บีชู ออริจิน เป็นทรีทเม้นท์ซาลอนและคลินิกที่ใหญ่ที่สุด พวกเรามีความเชี่ยวชาญด้านการรักษาผมร่วง รังแค หนังศีรษะเป็นเชื้อรา และปัญหาอื่นๆเกี่ยวกับเส้นผม พวกเรามีสาขาในสิงคโปร์จำนวน 21 สาขา ในมาเลเซียจำนวน 68 สาขา และมากกว่า 160 สาขาในภูมิภาคเอเชียแปซิฟิก ซึ่งตอนนี้พวกเราได้ขยายสาขามายังกรุงเทพฯ ประเทศไทย พวกเรามีความภาคภูมิใจที่ได้ทำให้ลูกค้าพึงพอใจในผลลัพธ์เป็นอย่างมาก"],
            CROSS_SELL_FOUNDER.th,
          ],
        },
        howItWorks: HOW_IT_WORKS.th,
        pricing: PRICING.th,
      },
    },
    descriptionDraftPending: ["en"],
  },
};
