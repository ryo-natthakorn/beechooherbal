// src/data/home.ts
// ALL homepage copy for both languages, verbatim from the live site (SEO — do not edit
// wording). One source of truth so /(EN) and /th/home/ (TH) render from the same section
// components and can never drift. Mirrors the {en,th} pattern of src/data/treatments.ts.
// Page <title>/<meta description> stay in the route files (src/pages/index.astro,
// src/pages/th/home.astro) so the SEO-critical strings are obvious at page level.
import singaporeExcellenceAward from "../assets/images/awards/singapore-excellence-award.jpg";
import singaporeHeartland from "../assets/images/awards/singapore-heartland.jpg";
import singaporePrestigeWinner from "../assets/images/awards/singapore-prestige-winner.jpg";
import singaporePrestige from "../assets/images/awards/singapore-prestige.jpg";
import superHealthBrand from "../assets/images/awards/super-health-brand.jpg";
import theEntrepreneur from "../assets/images/awards/the-entrepreneur.jpg";
import goldenEagleAward from "../assets/images/awards/golden-eagle-award.jpg";
import promisingSme500 from "../assets/images/awards/promising-sme-500.jpg";
import readersChoice from "../assets/images/awards/readers-choice.jpg";
import serviceClass from "../assets/images/awards/service-class.jpg";
import sinChewBusiness from "../assets/images/awards/sin-chew-business.jpg";
import tapAwards from "../assets/images/awards/tap-awards-most-innovative.png";
import review1 from "../assets/images/reviews/review-1.jpg";
import review2 from "../assets/images/reviews/review-2.jpg";
import review3 from "../assets/images/reviews/review-3.jpg";
import review4 from "../assets/images/reviews/review-4.jpg";

export type Lang = "en" | "th";
type L = Record<Lang, string>;

export const HOME = {
  hero: {
    h1Line1: {
      en: "100% Natural Herbal Hair Treatment,",
      th: "การรักษาผมร่วง ผมบาง หนังศีรษะมันและคันหนังศีรษะ ผมขาว ผมหงอก ขจัดรังแค ด้วยสมุนไพรธรรมชาติ 100%,",
    } as L,
    h1Line2: {
      en: "Safe, Highly Effective, Proven, Award Winning Hair Salon Clinic",
      th: "ปลอดภัย, มีประสิทธิภาพสูง, ได้รับรางวัลร้านทำผมยอดเยี่ยม",
    } as L,
    tagline: {
      en: "BEST HAIR LOSS TREATMENT CLINIC IN BANGKOK, Thailand",
      th: "ซาลอน/คลินิกรักษาผมร่วง ผมบาง ที่ดีที่สุดในประเทศไทย",
    } as L,
    // Hero CTA labels are the pages' historical strings (EN Facebook label differs from
    // the footer's UI.cta.facebook — keep both verbatim).
    ctaCall: { en: "Call Us Today", th: "Call Us Today" } as L,
    ctaFacebook: { en: "Talk to us on Facebook!", th: "พูดคุยกับเราผ่านเฟสบุ๊ค" } as L,
    ctaLine: { en: "Add us on LINE", th: "เพิ่มเพื่อนทาง LINE" } as L,
    videoId: "c8x_e1zPvMY",
    videoTitle: {
      en: "Bee Choo Herbal hair treatment introduction",
      th: "วิดีโอแนะนำทรีตเมนต์สมุนไพรบีชู",
    } as L,
  },

  trust: {
    p1: {
      en: "Bee Choo Origin is the largest scalp/hair loss treatment clinic specialising in the treatment of hair loss, dandruff, oily itchy scalp and other hair issues. There are 21 outlets in Singapore, 68 outlets in Malaysia with more than 170 outlets across Asia Pacific. The Group has expanded into Bangkok, and by end 2025, Bee Choo Thailand has 16 outlets. Annually, we serve millions of happy customers with effective and proven results.",
      th: "บีชู ออริจิน เป็นทรีตเมนต์ซาลอนและคลินิกรักษาผมร่วงที่ใหญ่ที่สุด พวกเรามีความเชี่ยวชาญด้านการรักษาผมร่วง รักษาผมบาง รังแค หนังศีรษะมัน และปัญหาอื่นๆเกี่ยวกับเส้นผม พวกเรามีสาขาในสิงคโปร์จำนวน 21 สาขา ในมาเลเซียจำนวน 68 สาขา และมากกว่า 170 สาขาในภูมิภาคเอเชียแปซิฟิก ซึ่งตอนนี้พวกเราได้ขยายสาขามายังกรุงเทพฯ ประเทศไทย และจะมีทั้งหมด 16 สาขาภายในสิ้นปี 2568 นี้ พวกเรามีความภาคภูมิใจที่ได้ทำให้ลูกค้าพึงพอใจในผลลัพธ์เป็นอย่างมากที่สุด",
    } as L,
    // The second paragraph embeds two Business Times archive links. Stored structurally
    // (never flattened / never set:html) so the component renders real <a> elements and
    // the crawlable copy stays byte-for-byte what the live site has.
    p2Before: {
      en: "A recognised household brand name, established since 2000, our founder Madam Cheah Bee Chew and her brand has won numerous accolades from Singapore Agencies. You may read more from two articles written by Business Times Singapore titled",
      th: "บีชู ได้ก่อตั้งเมื่อปี 2000 โดยคุณเชีย บี ชู และด้วยชื่อเสียงของแบรนด์ที่มีเสมอมา การันตีโดยรางวัลมากมายในสิงคโปร์ คุณสามารถอ่านเรื่องราวเพิ่มเติมได้ในนิตยสาร ไทม์ สิงคโปร์ ในหัวข้อ",
    } as L,
    // Link texts exclude the surrounding typographic quotes — those live as literal
    // characters in TrustStats.astro so Astro doesn't entity-escape them (&quot;).
    p2Link1: {
      text: {
        en: "Power of testimonies drives business growth",
        th: "ผลลัพธ์จากการการันตีที่ทำให้ธุรกิจเติบโต",
      } as L,
      href: "https://web.archive.org/web/20181020133432/http://www.businesstimes.com.sg/hub/bt-salutes-enterprise-2016/power-of-testimonies-drives-business-growth",
    },
    p2Between: { en: "and", th: "และ" } as L,
    p2Link2: {
      text: {
        en: "Sincerity before profit",
        th: "ความจริงใจมาก่อนผลกำไร",
      } as L,
      href: "https://web.archive.org/web/20181020133432/http://www.businesstimes.com.sg/hub-projects/ceo-conversations-2017/sincerity-before-profit",
    },
    // EN closes the sentence with a period after the second link; TH does not.
    p2After: { en: ".", th: "" } as L,
  },

  treatments: {
    heading: {
      en: "Hair Treatment in Bangkok, Thailand (7 Types)",
      th: "7 ทรีตเมนต์สำหรับเส้นผมและหนังศีรษะในกรุงเทพฯ",
    } as L,
  },

  howItWorks: {
    heading: {
      en: "100% NATURAL HERBAL HAIR TREATMENT - HOW IT WORKS",
      th: "ทรีตเมนต์สมุนไพร 100เปอร์เซ็น ให้ผลยังไงมาดูกัน!",
    } as L,
    imageAlt: {
      en: "Bee Choo herbal hair treatment process",
      th: "ภาพขั้นตอนทรีตเมนต์สมุนไพรบีชู",
    } as L,
    // Same 4 steps the process photo shows, transcribed as real text (previously these
    // only existed in the image's alt attribute) — accessible and indexable.
    steps: {
      en: [
        "Spray and massage tonic",
        "Apply herbal cream",
        "Steam for 45 minutes",
        "Rinse and condition",
      ],
      th: [
        "เสปรย์และนวดโทนิค",
        "ทาครีมสมุนไพร",
        "อบไอน้ำ 45 นาที",
        "ล้างและปรับสภาพหนังศีรษะ",
      ],
    } as Record<Lang, string[]>,
    videoId: "QOgcSx7_C7w",
    videoTitle: {
      en: "How Bee Choo herbal hair treatment works",
      th: "ทรีตเมนต์สมุนไพรบีชูให้ผลอย่างไร",
    } as L,
    disclaimer: {
      en: "3 colours to choose from -> Copper / Colourless / Darken, for more information please see our FAQ. Disclaimer: Results may vary depending on various factors such as hair type, age, ethnicity, etc.",
      th: "มีให้เลือก 3 สี ได้แก่ แบบมีสี / แบบไม่มีสี / แบบมีสี (สีพิเศษ) สำหรับข้อมูลเพิ่มเติม ศึกษาได้จากหน้าคำถามที่พบบ่อย (FAQ) ข้อควรระวัง: ผลลัพธ์ที่ได้อาจแตกต่างกันขึ้นอยู่กับปัจจัยต่าง ๆ เช่น ประเภทของผม อายุ เชื้อชาติ ฯลฯ",
    } as L,
  },

  reviews: {
    heading: {
      en: "REVIEWS ON BEECHOO HAIR TREATMENT",
      th: "รีวิว บีชู แฮร์ ทรีตเมนต์",
    } as L,
    // Alt text transcribed from the actual screenshots (branded Thai testimonial cards)
    // so screen-reader users get the page's key social proof in their language.
    items: [
      {
        img: review1,
        alt: {
          en: "Customer review: loved the herbal hair colouring. Beautiful colour, lovely helpful staff, back for a second visit and planning to keep coming",
          th: "รีวิวลูกค้า: ทำสีผมสมุนไพรแล้วประทับใจ สีผมสวยถูกใจ พนักงานบริการดีน่ารัก มาใช้บริการครั้งที่ 2 แล้ว",
        } as L,
      },
      {
        img: review2,
        alt: {
          en: "Customer review: oily scalp visibly improved after trying the treatment. Scalp feels clean and healthy",
          th: "รีวิวลูกค้า: อาการหนังศีรษะมันดีขึ้นชัดเจนหลังลองทำ รู้สึกหนังศีรษะสะอาดและสุขภาพดี",
        } as L,
      },
      {
        img: review3,
        alt: {
          en: "Customer review: scalp felt refreshed almost from the first session, first-class service with a relaxing massage from the herbal application through to the wash",
          th: "รีวิวลูกค้า: หนังศีรษะสดชื่นตั้งแต่ครั้งแรกที่ทำ บริการที่หนึ่ง ผ่อนคลายด้วยการนวดก่อนลงสมุนไพรจนถึงสระ",
        } as L,
      },
      {
        img: review4,
        alt: {
          en: "Customer review: itchy scalp, dandruff and hair loss all gone thanks to the shop's herbal treatment, with truly enjoyable service",
          th: "รีวิวลูกค้า: อาการคันหนังศีรษะ รังแค และผมร่วงหมดไปด้วยสมุนไพรของทางร้าน บริการประทับใจมาก",
        } as L,
      },
    ],
    readMoreLabel: {
      en: "Read more reviews and testimonials",
      th: "อ่านรีวิวและความคิดเห็นจากลูกค้าเพิ่มเติม",
    } as L,
    readMoreHref: {
      en: "/reviews-and-testimonials-of-bee-choo-origin-treatment/",
      th: "/th/รีวิวทรีทเม้นท์ที่ดี/",
    } as L,
  },

  awards: {
    heading: {
      en: "OUR AWARDS & RECOGNITIONS",
      th: "ความคิดเห็นจากลูกค้าของเรา / รางวัลการันตี",
    } as L,
    // The EN page carries an intro paragraph; the TH page never had one — keep that
    // difference (verbatim parity with the live site beats symmetry).
    intro: {
      en: "Certified with TQCSI, Bee Choo Herbal Hair Treatment surpassed the stringent criteria of the ISO standards and demonstrates consistent ability to enhance customer satisfaction and assurance to deliver quality service, which enables Bee Choo to receive a number of awards in the Asia Pacific.",
      th: "",
    } as L,
    items: [
      { img: singaporeExcellenceAward, alt: { en: "Singapore Excellence Award", th: "รางวัล Singapore Excellence Award" } as L },
      { img: singaporeHeartland, alt: { en: "Singapore Heartland Award", th: "รางวัล Singapore Heartland" } as L },
      { img: singaporePrestigeWinner, alt: { en: "Singapore Prestige Award - Winner", th: "รางวัล Singapore Prestige - ผู้ชนะ" } as L },
      { img: singaporePrestige, alt: { en: "Singapore Prestige Award", th: "รางวัล Singapore Prestige" } as L },
      { img: superHealthBrand, alt: { en: "Super Health Brand Award", th: "รางวัล Super Health Brand" } as L },
      { img: theEntrepreneur, alt: { en: "The Entrepreneur Award", th: "รางวัล The Entrepreneur" } as L },
      { img: goldenEagleAward, alt: { en: "Golden Eagle Award", th: "รางวัล Golden Eagle Award" } as L },
      { img: promisingSme500, alt: { en: "Promising SME 500 Award", th: "รางวัล Promising SME 500" } as L },
      { img: readersChoice, alt: { en: "Reader's Choice Award", th: "รางวัล Reader's Choice" } as L },
      { img: serviceClass, alt: { en: "Service Class Award", th: "รางวัล Service Class" } as L },
      { img: sinChewBusiness, alt: { en: "Sin Chew Business Excellence Award", th: "รางวัล Sin Chew Business Excellence" } as L },
      { img: tapAwards, alt: { en: "TAP Awards - Most Innovative Badge", th: "ตรา TAP Awards - Most Innovative" } as L },
    ],
    bannerAlt: {
      en: "Bee Choo Origin awards and recognitions",
      th: "รางวัลและการรับรองของบีชู ออริจิน",
    } as L,
  },

  pricing: {
    heading: {
      en: "AFFORDABLE HAIR TREATMENT IN Bangkok, Thailand",
      th: "ทรีตเมนต์ผมราคาจับต้องได้ในประเทศไทย",
    } as L,
    imageAlt: {
      en: "Bee Choo hair treatment price list: 800 to 1200 Baht depending on hair length, no hidden charges",
      th: "ราคาทรีตเมนต์บีชู 800 ถึง 1200 บาท ขึ้นอยู่กับความยาวผม ไม่มีค่าใช้จ่ายแอบแฝง",
    } as L,
    body: {
      en: "Our prices are based on your hair length between 800 Baht to 1200 Baht for à la carte herbal hair treatment. Strictly no hidden charges. You may choose to make upfront payment before treatment.",
      th: "ราคาในการให้บริการของเรานั้นขึ้นอยู่กับความยาวของเส้นผม โดยเริ่มต้นที่ 800 บาท ไปจนถึง 1,200 บาท ในการทำ à la carte ทรีตเมนต์สมุนไพร ซึ่งทางเราไม่มีการคิดเงินเกินจากที่กำหนดไว้แน่นอน ลูกค้าสามารถตกลงราคาก่อนที่จะทำทรีตเมนต์ได้",
    } as L,
  },

  locations: {
    heading: {
      en: "BEE CHOO THAILAND LOCATIONS",
      th: "BEE CHOO THAILAND LOCATIONS",
    } as L,
    mapAlt: {
      en: "Map of Bee Choo Thailand outlet locations in Bangkok",
      th: "แผนที่สาขาบีชู ประเทศไทย ในกรุงเทพฯ",
    } as L,
    href: {
      en: "/locations/",
      th: "/th/สถานที่ตั้งของร้านค้า/",
    } as L,
  },
};
