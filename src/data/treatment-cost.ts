// src/data/treatment-cost.ts
// "Treatment Cost in Thailand" page. Substantially reworked, not ported — confirmed
// with the user 2026-08-21: the legacy page (wp-json/wp/v2/pages/2353 EN, last
// edited 2018-11-02 / /2209 TH, edited 2025-09-02) named 5 real competitor
// businesses (Svenson, Harley St. Hair Center, Thai Hair Center, Trisla, Mamaherb)
// with prices sourced from 2006-2018 forum posts, and stated Bee Choo's OWN price
// two contradictory ways on the same page (850 THB flat vs 600-1,100 THB range),
// neither matching the current live price table.
//
// Kept: the real, still-true hook (clinics often don't list pricing online — TH's
// own Yoast description already says almost exactly this). Dropped: the 2018
// forum-research methodology and the entire named-competitor comparison, replaced
// by Bee Choo's own CURRENT pricing (imported directly from src/data/home.ts's
// HOME.pricing — never retyped, so the two pages can't drift apart) plus one
// composed, de-identified, generic market-price paragraph — user's brief: "generic
// tone, never name the competitors... sincere, and only aim for what's best for the
// customer." ⚠ That paragraph and the transition sentences below are composed, not
// transcribed — flagged for Crispin's sign-off before launch (team.ts precedent).
//
// "How Bee Choo Herbal's Treatment Works" section is verbatim.
export type Lang = "en" | "th";
type L = Record<Lang, string>;
type PL = { en: string[]; th: string[] };

export const COST_SEO = {
  title: {
    en: "What is the Hair Loss Treatment Cost in Thailand? Prices revealed - Bee Choo Herbal",
    th: "ราคาการทำทรีทเม้นท์รักษาปัญหาผมร่วงในประเทศไทยเป็นอย่างไร? - Bee Choo Herbal",
  },
  description: {
    // ⚠ Composed — the live EN page has no meta description (verified null in source).
    en: "What does hair loss treatment cost in Thailand? See Bee Choo Herbal's real, transparent pricing — no hidden charges, based on hair length.",
    // Real Yoast description, verbatim — the one meta description across all 3 new pages that ports with zero edits.
    th: "คุณเคยสังเกตไหมว่าคุณไม่สามารถหาราคาการทำทรีทเม้นท์รักษาปัญหาหนังศีรษะและเส้นผมผ่านทางเว็บไซต์ของคลินิกหรือซาลอนส่วนใหญ่ได้ และวีธีเดียวที่คุณสามารถทราบ",
  },
};

export const COST_HERO: { heading: L } = {
  heading: {
    en: "What is the Hair Loss Treatment Cost in Thailand? Prices Revealed",
    th: "ราคาการทำทรีทเม้นท์รักษาปัญหาผมร่วงในประเทศไทยเป็นอย่างไร?",
  },
};

export const COST_INTRO: { hook: L; transition: L } = {
  hook: {
    // Verbatim first sentence — the real, still-true observation. The legacy
    // page's next clause ("Who are the main hair loss treatment providers...")
    // set up the now-dropped competitor comparison and is dropped with it.
    en: "Do you find it common that many hair loss treatment salons/clinics are not listing their pricing structure online? Very often one has to visit to learn about the treatment prices.",
    th: "คุณเคยสังเกตไหมว่าคุณไม่สามารถหาราคาการทำทรีทเม้นท์รักษาปัญหาหนังศีรษะและเส้นผมผ่านทางเว็บไซต์ของคลินิกหรือซาลอนส่วนใหญ่ได้ และวีธีเดียวที่คุณสามารถทราบถึงค่าทำทรีทเม้นท์คือคุณต้องไปที่ซาลอนหรือคลินิก",
  },
  // ⚠ Composed, both languages — pivots into Bee Choo's own transparent pricing
  // instead of the dropped 2018 forum-research methodology. Flag for sign-off.
  transition: {
    en: "We believe pricing should be clear from the start — here is exactly what our treatment costs, no surprises.",
    th: "เราเชื่อว่าราคาควรชัดเจนตั้งแต่แรก นี่คือราคาทรีทเม้นท์ของเราแบบตรงไปตรงมา ไม่มีค่าใช้จ่ายแอบแฝง",
  },
};

export const MARKET_CONTEXT: { heading: L; paragraph: L } = {
  // ⚠ Composed, both languages — new chrome + new prose, needs Crispin's sign-off.
  // De-identified per the user's brief: no competitor names, no specific numbers
  // attributed to any named business.
  heading: { en: "What Else Is Out There", th: "ราคาโดยทั่วไปในท้องตลาด" },
  paragraph: {
    en: "Hair loss treatment pricing in Bangkok varies widely depending on the type of treatment and provider — anywhere from a few hundred baht for a single session to tens of thousands of baht for a full course. We can't speak for other clinics, but we believe you deserve to know exactly what you're paying for and why, which is why our pricing below is simple, upfront, and the same for every customer.",
    th: "ราคาการรักษาผมร่วงในกรุงเทพฯ มีความหลากหลายมาก ขึ้นอยู่กับประเภทของการรักษาและผู้ให้บริการ ตั้งแต่หลักร้อยบาทต่อครั้งไปจนถึงหลักหมื่นบาทต่อคอร์ส เราไม่สามารถพูดแทนคลินิกอื่นได้ แต่เราเชื่อว่าลูกค้าควรทราบชัดเจนว่ากำลังจ่ายเงินเพื่ออะไร นี่คือเหตุผลที่ราคาของเราด้านล่างนี้เรียบง่าย ตรงไปตรงมา และเท่ากันสำหรับลูกค้าทุกคน",
  },
};

export const HOW_IT_WORKS: { paragraphs: PL } = {
  paragraphs: {
    en: [
      "This is the treatment process that we have at Bee Choo Herbal. No injections, no pain, no medication. Purely herbal hair treatment.",
      "They use 100% natural herbs in our treatment and products to boost hair growth. This will allow you to enjoy a thicker head of hair again, without any invasive treatment. Since we utilise natural herbs, you will also not be loading a ton of chemicals onto your hair, which might eventually do more harm than good. Bee Choo's hair treatments are safe and effective, so there is no need to worry about any toxic chemicals coming into contact with your scalp. While you might be thinking that herbs often come with a strong, pungent smell, the hair products and treatments that we use do not come with any unpleasant smells. Some ancient herbs we use include Ginseng, Lingzhi, He Shou Wu and Ginger.",
    ],
    th: [
      "ทรีทเม้นท์ของเราไม่ต้องฉีดยา ไม่ต้องทานยา และที่สำคัญคือ ไม่เจ็บ",
      "เราใช้สมุนไพรธรรมชาติ 100% เพื่อส่งเสริมการเจริญเติบโคของเส้นผม และการทำทรีทเม้นท์กับเราสามารถช่วยทำให้ศีรษะของคุณกลับมามีผมดกดำได้เหมือนเดิมโดยไม่จำเป็นต้องใช้วิธีที่เป็นการรุกราน ทรีทเม้นท์ของเราไม่มีสารเคมี เพราะเราคำนึงถึงผลร้ายต่างๆที่จะตามมาเมื่อใช้เคมีผสม โดยคุณสามารถมั่นใจได้ว่า ทรีทเม้นท์ของเราปลอดภัยและเห็นผล",
      "คุณอาจคิดว่าการใช้สมุนไพรมาทำเป็นส่วนประกอบของทรีทเม้นท์จะทำให้มีกลิ่นเหม็น หากคุณได้มาลองทำทรีทเม้นท์กับเรา คุณจะทราบว่าสมุนไพรหมักศีรษะและผลิตภัณฑ์ต่างๆของเราไม่มีกลิ่นเหม็น สมุนไพรโบรานที่เราใช้มีจินเส็ง หลินจือ และขิง",
    ],
  },
};

export const COST_VIDEO = { id: "YZ9ah0xrO7E" };
