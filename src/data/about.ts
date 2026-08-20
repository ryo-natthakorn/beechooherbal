// src/data/about.ts
// Long-form body copy for the About Us page, keyed like treatment-pages.ts. Extracted
// verbatim from the LIVE site (fetched directly, not the Phase-1 snapshot — both pages
// were last edited 2025-09-01/02, so the snapshot happens to be current here, but this
// batch was built the same way as Locations: fetch live first, never assume).
//
// Two verbatim quirks kept deliberately, not "fixed":
// - The hero photo caption ("Bee Choo's Flagship Store at Udomsuk, Bangna. Opened in
//   July 2018") and the closing operator line are in ENGLISH on BOTH language pages —
//   that's what the live site actually has on its Thai page too, so it's reproduced
//   as-is rather than inventing a Thai translation that doesn't exist on source.
// - EN and TH content for Values/Vision/Mission genuinely diverge in wording and item
//   count (not a translation pair) — CLAUDE.md requires verbatim-per-language copy, not
//   parity between languages, so both are kept exactly as published.
// - The TH "Our Vision" heading carries a stray leading ">" in the live source
//   (`>วิสัยทัศน์ของเรา`) — a WordPress editing artefact, not real content. Dropped.
//
// "Call Us Today" (EN) is the legacy CTA button text and is NOT reproduced as body
// copy — every other page on this site drops it in favour of our own Facebook/LINE/
// Find-a-Branch CTA set (see inventory/scripts/06-copy-parity.mjs's SKIP list for the
// site-wide precedent).
import type { ImageMetadata } from "astro";
import flagshipPhoto from "../assets/images/about-flagship.jpg";
import logoMark from "../assets/images/brand/logo-mark.png";

export type Lang = "en" | "th";
type L = Record<Lang, string>;

export interface AboutContent {
  seo: { title: L; description: L };
  hero: {
    heading: L;
    image: ImageMetadata;
    /** Verbatim from source — English on both language pages, not a translation gap. */
    caption: string;
  };
  logoStory: {
    heading: L;
    image: ImageMetadata;
    paragraphs: L[];
  };
  philosophy: {
    heading: L;
    paragraphs: L[];
  };
  video: {
    heading: L;
    id: string;
    start: { en: number; th: number };
  };
  /** Values/Vision/Mission: EN and TH genuinely diverge in wording AND item count on
   *  the live source (not a translation pair) — CLAUDE.md requires verbatim-per-language
   *  copy, not cross-language parity, so an item can be Partial: present in one language
   *  only. Render loops must filter on the CURRENT language's key, not assume both exist. */
  values: { heading: L; items: Partial<L>[] };
  vision: { heading: L; items: Partial<L>[] };
  mission: { heading: L; items: Partial<L>[] };
  /** Verbatim from source — English on both language pages, but NOT identical: the TH
   *  page's own copy appends "here in Thailand", which the EN page's doesn't. */
  operatorLine: L;
}

export const ABOUT: AboutContent = {
  seo: {
    title: {
      en: "About - Bee Choo Herbal",
      th: "เกี่ยวกับบีชู - Bee Choo Herbal",
    },
    description: {
      en: "Bee Choo Origin has provided natural, safe herbal hair and scalp treatment in Thailand for over 18 years — read our story, values and mission.",
      // ⚠ Composed, not transcribed — the live TH page has no Yoast description of its own. Needs Crispin's sign-off.
      th: "บีชู ออริจิน ให้บริการทรีทเม้นท์สมุนไพรธรรมชาติดูแลเส้นผมและหนังศีรษะในประเทศไทยมากว่า 18 ปี อ่านเรื่องราว ค่านิยม และพันธกิจของเรา",
    },
  },
  hero: {
    heading: {
      en: "About Bee Choo Herbal",
      th: "เกี่ยวกับบีชู เฮอร์บัล",
    },
    image: flagshipPhoto,
    caption: "Bee Choo's Flagship Store at Udomsuk, Bangna. Opened in July 2018",
  },
  logoStory: {
    heading: {
      en: "Bee Choo Origin Logo Story",
      th: "ความหมายของโลโก้ Bee Choo Origin",
    },
    image: logoMark,
    paragraphs: [
      {
        en: "Our logo symbolizes our brand's values and beliefs. The three leaves and flower bud represent growth, renewal, and transformation. Since 2000, Bee Choo Origin has been dedicated to providing the best hair care solutions.",
        // Legacy source prefixes this paragraph with a styled run-in label "สัญลักษณ์" (Symbol).
        th: "สัญลักษณ์ โลโก้ของเราหมายถึงค่านิยมและความเชื่อของแบรนด์เรา สามใบไม้และตาดอกไม้แทนการเติบโต การฟื้นฟูและการเปลี่ยนแปลง ตั้งแต่ปี 2000 Bee Choo Origin มุ่งมั่นที่จะให้คำแนะนำด้านการดูแลเส้นผมอย่างดีที่สุด",
      },
      {
        en: "The three leaves represent genuineness, excellence, and care – the pillars of our brand. We believe in building trust through authenticity, delivering high-quality products, and prioritizing our customers' needs.",
        th: "ใบไม้สามใบ แทนความเที่ยงตรง ความเป็นเลิศและความเอาใจใส่ - เสาหลักของแบรนด์ของเรา เราเชื่อในการสร้างความเชื่อมั่นผ่านความเป็นจริง เสนอผลิตภัณฑ์คุณภาพสูง และให้ความสำคัญกับความต้องการของลูกค้าของเรา",
      },
      {
        en: "The flower bud symbolizes new beginnings and growth. It represents the potential for transformation and the power of nature to renew and restore. With our logo, we visually express our belief that everyone deserves healthy, beautiful hair.",
        th: "ดอกไม้แทนการเริ่มต้นใหม่และการเติบโต สัญลักษณ์ถึงศักยภาพในการเปลี่ยนแปลงและพลังของธรรมชาติในการฟื้นฟูและเติบโตอีกครั้ง ด้วยโลโก้ของเรา แสดงแสดงให้เห็นถึงความเชื่อของเราว่าทุกคนมีสิทธิ์ที่จะมีเส้นผมที่สุขภาพดีและสวยงาม",
      },
      {
        en: "Together, the flower logo and Bee Choo Origin represent our commitment to transformative hair care. By combining genuineness, excellence, and care, we create solutions that nourish and rejuvenate your hair and scalp, helping you achieve vibrant and beautiful hair.",
        th: "รวมกัน เครื่องหมายดอกไม้และ Bee Choo Origin แสดงถึงการมุ่งมั่นของเราในการดูแลเส้นผมที่เปลี่ยนแปลงได้ โดยผสมผสานความเที่ยงตรง เป็นเลิศและใส่ใจ เราสร้างสรรค์สูตรที่บำรุงและฟื้นฟูเส้นผมและหนังศีรษะของคุณ เพื่อช่วยให้คุณมีเส้นผมที่สดใสและสวยงาม.",
      },
    ],
  },
  philosophy: {
    heading: {
      en: "Natural and safe solution to hair problems",
      th: "การแก้ไขปัญหาผมด้วยวิธีธรรมชาติและปลอดภัย",
    },
    paragraphs: [
      {
        en: "We strongly believe in non-invasive, safe and price transparent solutions for hair issues. Be it oily scalp, dandruff, hair loss, bacterial infection or other hair issues, we believe that everyone deserves to be in control of their hair and scalp issues. Very often, when people start losing hair, they feel helpless and do not know who to trust. Finding the right partner to entrust your hair takes trial and error, and it can be quite costly if you choose the wrong company.",
        th: "พวกเรามีความเชื่อมั่นในการรักษาผมด้วยวิธีธรรมชาติ ปลอดภัย ไม่มีผลข้างเคียง ที่สำคัญมีราคาที่ยุติธรรมและโปร่งใสด้วยนะคะ พวกเราทุกคนล้วนเจอปัญหาผมกันทั้งนั้น ไม่ว่าจะเป็น หนังศีรษะมัน รังแค ผมร่วง การติดเชื้อจากแบคทีเรียและปัญหาอื่นๆ เมื่อทุกคนเจอกับปัญหาผมหลุดร่วงก็อาจจะทำให้สูญเสียความมั่นใจและไม่รู้ว่าจะเชื่อใจในสินค้าหรือซาลอนที่ไหนได้บ้างเหมือนการลองผิดลองถูกกับเส้นผมและหนังศีรษะของตนเอง",
      },
      {
        en: "At Bee Choo Origin, our Philosophy of integrity and sincerity has enabled us to establish our good name through customer recommendations.",
        th: "ที่ บีชู ออริจิน เรามีหลักปรัชญาในการดำเนินธุรกิจของเราคือ ซื่อสัตย์และจริงใจ จึงทำให้ได้รับความไว้ใจจากลูกค้าและมีชื่อเสียงเสมอมา",
      },
      {
        en: "Whether you are facing Hair loss, dandruff, damaged hair or oily scalp, our 100% natural, safe, highly effective herbal hair treatment brings you a healthier scalp. We do this using natural herbs made from a combination by leveraging modern advance extraction technology, that includes Chuan Xiong, Ginseng, Dang Gui, He Shou Wu and Ling Zhi.",
        th: "ทรีทเม้นท์ของเราจะช่วยให้ปัญหาผมของคุณดีขึ้น ไม่ว่าคุณจะเผชิญปัญหาอยู่กับ ผมร่วง รังแค ผมเสีย หรือ หนังศีรษะมัน ทรีทเม้นท์ของเรามีส่วนประกอบจากธรรมชาติ 100เปอร์เซ็น ได้แก่ ซวนซง โสม ตังกุย ห่อสิ่วโอว และ เห็ดหลินจือ ซึ่งมีความปลอดภัยต่อเส้นผมและหนังศีรษะ และสามารถเห็นผลได้อย่างมีประสิทธิภาพ",
      },
      {
        en: "We bring with us over 18 years of experience in the hair loss treatment industry to Bangkok. We aim to provide the beautiful people of Thailand safe, honest and affordable hair care. At our outlets in Singapore, we have a 98.9% satisfaction rating from our customers and also won numerous highly prestigious awards and accolades over the years.",
        th: "พวกเรามีประสบการณ์ในการรักษาผมหลุดร่วงมาเป็นเวลา 18 ปี และในตอนนี้เราได้อยากให้คนไทยได้สัมผัสกับผลิตภัณฑ์บำรุงผมที่มีความซื่อสัตย์ ปลอดภัย และราคาเป็นมิตร สำหรับที่สิงคโปร์ 98.9% ของลูกค้าพึงพอใจในซาลอนของเรา และเราก็ยังได้รับรางวัลมากมายในเวลาหลายปีมานี้ จุดเด่นของเรานั้นรวมไปถึงทรีทเม้นท์ที่สามารถเลือกตามสภาพของเส้นผม หนังศีรษะได้ และตรงตามความต้องการของลูกค้าแต่ละคนด้วย",
      },
      {
        en: "Visit our Hair Growth Consultants for a Healthier Head of Hair today! Let us help you to effectively repair scalp to encourage more hair growth! Consistently voted the best hair loss treatment salon in Singapore for more than 6 years from the Global Business Magazine!",
        th: "มาปรึกษาผู้เชี่ยวชาญด้านการปลูกผมของเรากันนะคะ เพื่อสภาพเส้นผมและหนังศีรษะที่มีสุขภาพดีมากขึ้นในวันนี้! ให้พวกเราช่วยคุณรักษาหนังศีรษะอย่างมีประสิทธิภาพเพื่อผมที่ดกดำมากยิ่งขึ้น! ด้วยชื่อเสียงที่มีมาอย่างไม่ขาดสาย ทรีทเม้นท์ของเราได้ถูกโหวตให้เป็นทรีทเม้นท์รักษาผมหลุดร่วงที่ดีที่สุด เป็นเวลาติดต่อกันมากกว่า 6 ปี จากนิตยสาร โกลเบิล บิสเนส แม็กกาซีน",
      },
    ],
  },
  video: {
    heading: {
      en: "Hear what our customers in bangkok, thailand have to say about the herbal hair treatment",
      th: "มาดูกันค่ะว่าลูกค้าของเราจะมีความคิดยังไงบ้างกับทรีทเม้นท์ของเรานะคะ",
    },
    id: "37MCsANIJ-k",
    start: { en: 51, th: 68 },
  },
  values: {
    heading: { en: "Our Values", th: "เกียรติของเรา" },
    items: [
      {
        en: "Our values stand on the foundation of honesty, diligence, service minded and constant learning",
        th: "เกียรติของเราตั้งอยู่บนความซื่อสัตย์และความจริงใจในการบริการ",
      },
      {
        en: "To always ensure that our products and services are of top quality and always safe for our customers",
        th: "เราคำนึงถึงการรักษาปัญหาผมของลูกค้ามาก่อนสิ่งอื่นใด",
      },
      {
        // No EN counterpart on the live source — TH has a third item EN doesn't.
        th: "เรามีความมั่นใจเสมอว่าผลิตภัณฑ์และการบริการของเรามีคุณภาพสูงและปลอดภัยต่อลูกค้า",
      },
    ],
  },
  vision: {
    heading: { en: "Our Vision", th: "วิสัยทัศน์ของเรา" },
    items: [
      {
        en: "A Group in which people trust for quality and consistency",
        th: "นำร่องผลิตภัณฑ์เกี่ยวกับเส้นผมที่ดีต่อสุขภาพ",
      },
      {
        // No EN counterpart — TH has a second item EN doesn't.
        th: "เป็นกลุ่มที่ทุกคนมั่นใจในคุณภาพ",
      },
    ],
  },
  mission: {
    heading: { en: "Our Mission", th: "ภารกิจของเรา" },
    items: [
      {
        en: "To uphold and promote natural Thai beauty",
        th: "เพื่อสนับสนุนและส่งเสริมความงามจากธรรมชาติ",
      },
      {
        en: "To provide all R.C. Business Group employees opportunities to learn and grow as long as they work hard towards it",
        th: "ส่งเสริมผลิตภัณฑ์ความงามจากธรรมชาติที่มีความปลอดภัย ดีต่อสุขภาพ ให้เป็นที่แพร่หลาย",
      },
      {
        en: "To provide consistently great products and services to people that will improve their well-being",
        th: "เนรมิตรความงาม ความอ่อนเยาว์แก่ให้ลูกค้าของพวกเรา เพื่อก่อให้เกิดความมั่นใจ",
      },
    ],
  },
  operatorLine: {
    en: "Bee Choo Origin Thailand is operated by R.C. Business Group",
    th: "Bee Choo Origin Thailand is operated by R.C. Business Group here in Thailand",
  },
};
