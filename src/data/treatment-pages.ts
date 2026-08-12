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
// - Pure image-caption fragments (e.g. "Example of clogged hair pore") and a stray
//   "via GIPHY" credit were dropped from the extracted paragraphs — they're captions
//   for inline images that aren't sourced into this build yet (see spec's Content
//   gaps §1), and reproducing an orphaned caption with no image would read as a typo,
//   not fidelity.

export type Lang = "en" | "th";

export interface FaqItem {
  question: string;
  answer: string;
}

interface AboutContent {
  heading: string;
  /** Paragraphs above the FAQ accordion. */
  intro: string[];
  /** The live site renders "About" as an intro plus an Elementor FAQ-toggle widget
   *  (not <h2>/<h3> tags — that's why an earlier plain heading-tag scan of this page
   *  missed it). Rendered as a native <details>/<summary> accordion: zero JS, and the
   *  answers stay in the DOM (crawlable) whether expanded or not. */
  faq: FaqItem[];
}

interface BenefitsContent {
  heading: string;
  paragraphs: string[];
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
  about: Record<Lang, AboutContent>;
  benefits: Record<Lang, BenefitsContent>;
  /** Pages whose meta description isn't real live-site copy yet. */
  descriptionDraftPending?: Lang[];
}

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
        paragraphs: [
          "Oily scalp is a common hair issue and it can be solved with Bee Choo Herbal Treatment. At Bee Choo, our herbal paste contains a traditional Chinese herb known as Ling Zhi which is an adaptogen with a dual-modulating function. Ling Zhi helps to modulate your scalp regardless if it is too oily or too dry, bringing your scalp back to its normal and healthy state after each treatment. Stop living with the itch, realise how great it feels to have a squeaky clean scalp!",
          "Get rid of the itch and excess oil today. With regular treatment, your scalp will be free of itch and excess oil.",
        ],
      },
      th: {
        heading: "ประโยชน์ของการทำทรีทเม้นท์ สมุนไพรธรรมชาติ 100เปอร์เซ็น",
        paragraphs: [
          "ปัญหาหนังศีรษะมันเป็นปัญหาธรรมดาที่สามารถรักษาได้ด้วย บีชู เฮอร์เบิล ทรีทเม้นท์ ที่ซาลอน/คลินิก บีชู ของเรา น้ำยาทรีทเม้นท์นั้นทำจาก เห็ดหลินจือ ซึ่งรู้กันดีว่าเป็นสมุนไพรพื้นบ้านของจีน เห็ดหลินจือจะช่วยปรัฐสภาพผมไม่ว่าคุณจะมีหนังศีรษะที่มันหรือแห้งเกินไป ก็จะกลับมาสู่สภาพปกติและมีสุขภาพดีหลังจากการทำทรีทเม้นท์ในแต่ละครั้ง เลิกอยู่กับความคันแล้วมาสัมผัสความสบายและสะอาดของหนังศีรษะกันได้แล้ววันนี้!",
          "มาลดความมันและความคันของหนังศีรษะกันค่ะ ด้วยทรีทเม้นท์ของพวกเรา คุณจะรู้สึกสบายมากขึ้นเมื่อไม่มีน้ำมันและอาการคันมากวนใจ",
        ],
      },
    },
    descriptionDraftPending: ["en"],
  },
};
