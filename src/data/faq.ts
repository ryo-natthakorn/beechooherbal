// src/data/faq.ts
// FAQ page. Transcribed verbatim from the live site (wp-json/wp/v2/pages/181 EN,
// /576 TH) via inventory/rest-pages.json — see CLAUDE.md §8: no machine translation,
// EN/TH are each verbatim in their own language.
//
// Legacy page is a flat, always-visible list (no accordion). Rebuilt as a
// <details>/<summary> accordion (FaqPage.astro), reusing the exact card pattern
// already in production on treatment pages (TreatmentAbout.astro) — multi-open,
// zero JS, every answer stays in the DOM/crawlable regardless of open state (needed
// so the FaqSchema JSON-LD text always matches what's actually on the page).
//
// Two content fixes, not silent drops:
// - Q10 (treatment frequency): EN's trailing sentence links to
//   beechooladies.com.sg/wp-content/uploads/... — the SINGAPORE sister site, broken/
//   off-brand. Dropped entirely rather than leaving a dangling "see chart" mention
//   with no chart shown. TH's own phrasing already just mentions the chart in
//   flowing prose with no link at all, so it's kept as-is — nothing to fix there.
// - Q9's second image (Your-paragraph-text.png, empty alt, 2024/10 upload) is an
//   apparent unedited template placeholder — dropped. Flagged to Crispin as a
//   legacy content-quality finding, not a scope decision. The real "dark tone herb"
//   photo on the same question is kept.
//
// TH's Q7 answer had `<wbr>` soft-break tags scattered mid-word throughout the
// source HTML (a WordPress editing artefact) — stripped when transcribing; wording
// itself is untouched.
import type { ImageMetadata } from "astro";
import darkToneBeforeAfter from "../assets/images/faq/before-after.png";
import hairDyeBeforeAfter from "../assets/images/faq/hair-dye-before-and-after.png";

export type Lang = "en" | "th";
type L = Record<Lang, string>;
type PL = { en: string[]; th: string[] };

export interface FaqQaItem {
  question: L;
  paragraphs: PL;
  /** Q7 only — rendered as a distinct tinted callout, not folded into `paragraphs`. */
  caution?: { heading: L; text: L };
  /** Q9, Q12 only. */
  image?: { src: ImageMetadata; alt: L };
}

export const FAQ_ITEMS: FaqQaItem[] = [
  {
    question: { en: "Can I Colour my Hair (Chemically) After Treatment?", th: "ทำสีผมเคมีหลังจาทำทรีทเม้นท์ได้หรือไม่?" },
    paragraphs: {
      en: [
        "Yes, you may, but we strongly discourage you to do it.",
        "The herbal elements will stay on your scalp and hair for 2 to 3 weeks. If you opt for chemical treatment within this period, it may not be able to penetrate fully into your hair shaft, this will affect the desired results.",
        "Furthermore, any chemical treatment might undo the good we have done for your hair and scalp, reducing the effectiveness of the treatment.",
        "We will advise you to refrain from any colouring, perming, rebonding or performing any chemical process to your hair for at least 3 weeks to allow the herbal ingredients to be fully absorbed into your scalp.",
      ],
      th: [
        "ได้ค่ะ แต่ทางเราไม่แนะนำอย่างสูง เนื่องจากอนุภาคของสมุนไพรจะอยู่บนหนังศีรษะและเส้นผมเป็นเวลา 2-3 อาทิตย์ และถ้าคุณได้ย้อมสีเคมีในช่วงนี้ สีอาจจะไม่แทรกซึมถึงก้านของเส้นผม อาจจะทำให้สีที่ออกมาไม่ได้ตามความต้องการ",
        "ยิ่งไปกว่านั้นในการทำทรีทเม้นท์เคมีอาจจะทำให้ทรีทเม้นท์ของเราซึ่งส่งผลดีต่อหนังศีรษะและเส้นผมอยู่แล้วลดประสิทธิภาพลง",
        "ทางเราจึงแนะนำให้งดการทำเคมีทุกชนิด ไม่ว่าจะเป็นการย้อมสี การดัดผม การทำรีบอนด์ ต่างๆ เป็นเวลาอย่างน้อย 3 อาทิตย์ เพื่อให้ส่วนผสมจากธรรมชาติในทรีทเม้นท์ของเราได้แทรกซึมเข้าไปที่หนังศีรษะอย่างเต็มประสิทธิภาพ",
      ],
    },
  },
  {
    question: { en: "Do I Have to Buy a Package or Treatment Course?", th: "จำเป็นต้องซื้อแพคเกจหรือทรีทเม้นท์คอร์สมั้ย?" },
    paragraphs: {
      en: [
        "No, you do not have to buy. We provide à la carte herbal hair treatments. We do not believe in up-selling tactics, we strongly believe that when customers see results they will automatically come again on their own and refer their friends and family members to us. This is how we are able to keep the treatment affordable for the long term.",
      ],
      th: [
        "ไม่จำเป็นต้องซื้อค่ะ ทางเราจัดการทำทรีทเม้นท์ในครั้งเดียวให้เสร็จสรรพ ทางเราไม่มีการเพิ่มราคาอย่างมีชั้นเชิงนะคะ เราเชื่อว่าลูกค้าจะกลับมาอีกครั้งเมื่อได้เห็นผลจากการทำทรีทเม้นท์ และยังแนะนำให้เพื่อนๆ คนในครอบครัวมาทำทรีทเม้นท์กับเราด้วยค่ะ และสิ่งนี้เองทำให้เราคงราคาทรีทเม้นท์ไว้ให้ทุกคนได้เข้าถึงมาเป็นมาเวลานาน",
      ],
    },
  },
  {
    question: { en: "Do I Need to Wash My Hair Before Treatment?", th: "ต้องสระผมก่อนการทำทรีทเม้นท์หรือไม่?" },
    paragraphs: {
      en: [
        "It is not necessary, as our herbal treatment is targeted to remove oil and dirt on the scalp. However, if you have styling gel, wax or clay applied on your hair, you can inform us and we will gladly wash away the styling substance on your hair before proceeding with the treatment.",
      ],
      th: [
        "ไม่จำเป็นเนื่องจากทรีทเม้นท์ของเรามีเป้าหมายในการล้างน้ำมันและสิ่งสกปรกออกจากหนังศีรษะอยู่แล้ว แต่ถึงยังไงถ้าคุณใช้เจล หรือผลิตภัณฑ์แต่งผมอื่นๆ คุณสามารถบอกให้เราล้างออกให้ก่อนได้",
      ],
    },
  },
  {
    question: { en: "Does Bee Choo Thailand Provide Hair Cutting Services?", th: "ซาลอน/คลินิก บีชู มีบริการตัดผมมั้ย?" },
    paragraphs: {
      en: [
        "Certain outlets provide hair cutting services. However, we do not provide hair services such as chemical colouring, rebonding, perming, etc.",
        "We are strictly a hair treatment establishment. Do note that our therapist will only semi-blow-dry your hair post treatment. This is to ensure that your hair absorbs all the nutrients from the herbal paste after treatment. In addition, over blow-drying post treatment will damage your hair ends, thus it is best to let it air dry once hair has been semi-dried.",
      ],
      th: [
        "ทางร้านเรามีบริการตัดผมเฉพาะบางสาขาค่ะ แต่เราไม่มีบริการทำผมที่ใช้สารเคมี เช่น การย้อม รีบอนด์ ดัด หรืออื่นๆนะคะ",
        "สถาบันของเราเป็นสถาบันที่เข้มงวดมากในการรักษาผม หลังจากการทำทรีทเม้นท์เสร็จแล้วทีมงานของเราจะเป่าผมให้แห้งหมาดๆเท่านั้น ซึ่งในกระบวนการนี้จะทำให้มั่นใจได้ว่าผมจะดูดซับสารอาหารที่มีประโยชน์จากครีมสมุนไพรของพวกเรา ถ้าเราเป่าผมให้แห้งสนิทหลังจากการทำทรีทเม้นท์อาจจะทำให้ผมแห้งแตกปลายได้ ทางที่ดีที่สุดคือให้ผมแห้งสนิทเองโดยธรรมชาติดีกว่าค่ะ",
      ],
    },
  },
  {
    question: { en: "Does Bee Choo Provide Free Scalp Analysis and Scalp Scan?", th: "ซาลอน/คลินิก บีชู มีการแสกนเพื่อตรวจสภาพหนังศีรษะฟรีไหม?" },
    paragraphs: {
      en: [
        "At the moment, we are providing complementary hair & scalp scanning services if you visit during our off peak hours. Our off peak hours at 10am to 5pm (weekdays). If you want to get a hair scan during our peak period, it would be best to call our shop and check before hand.",
      ],
      th: [
        "ในตอนนี้เราได้มีบริการแสกนเส้นผมและหนังศีรษะในช่วงเวลาที่มีลูกค้าหนาแน่น คุณสามารถมาหาเราได้ในเวลา 10.00-17.00น. (วันธรรมดา) และถ้าคุณอยากแสกนเส้นผมก่อนใคร เราแนะนำให้คุณโทรเข้ามาสอบถามก่อนนะคะ",
      ],
    },
  },
  {
    question: { en: "How Long Does the Natural Dye Last?", th: "การทำสีจากธรรมชาติจะอยู่ได้นานแค่ไหน?" },
    paragraphs: {
      en: [
        "The natural dye will remain on your hair for a good 2 – 4 months depending on your hair type, how frequent you wash your hair, etc. It does not last indefinitely because our natural dye is a semi-permanent dye, meaning to say, it does not penetrate your hair shaft but forms a layer of coating around your hair.",
      ],
      th: [
        "การทำสีผมธรรมชาติปกติจะอยู่ได้ประมาณ 2-4 เดือน และขึ้นอยู่กับประเภทของเส้นผม ความบ่อยของการสระผมด้วยนะคะ การทำสีผมจากธรรมชาติของเราเป็นการทำสีแบบกึ่งถาวร คือสีจะไม่ได้เข้าไปถึงก้านผมแต่จะเคลือบอยู่ด้านนอกเส้นผม",
      ],
    },
  },
  {
    question: { en: "Is The Treatment 100% Safe?", th: "ทรีทเม้นท์ปลอดภัย 100% หรือไม่?" },
    paragraphs: {
      en: [
        "Our treatment is very safe. It does not contain any chemicals or harmful ingredients. We see more than 1000 customers per month at our outlet and very rarely do we see allergic reactions to the herbal treatment.",
        "With that said, there is always exceptions. In very rare cases, we have seen minor rash break out in customers; most of the time this is solved by having the customer NOT steam their head and instead leaving the herbal paste on for 1 hour. These people are sensitive to heat and therefore unable to go through the steaming process.",
      ],
      th: [
        "ทรีทเม้นท์ของเรามีความปลอดภัยมากเพราะไม่มีส่วนผสมของสารเคมีหรือสารอันตรายใด ๆ ทั้งสิ้น ทุกสาขาของเราให้บริการลูกค้าจำนวนมากกว่า 1000 ท่านต่อเดือน การที่จะเกิดอาการแพ้ทรีทเม้นท์สมุนไพรจะพบได้ยาก",
        "แต่สำหรับลูกค้าที่เกิดอาการแพ้ จะมีผื่นคันขึ้นในบริเวณต่างๆของหนังศีรษะ ส่วนมากแล้ววิธีแก้ไขปัญหาอาการแพ้นี้คืองดการอบไอน้ำและหมักสมุนไพรเป็นเวลา 1 ชั่วโมงแทนเพราะลูกค้าที่เกิดอาการแพ้จะมีหนังศีรษะที่มีความไวต่อความร้อนมากกว่าปกติ",
      ],
    },
    caution: {
      heading: { en: "G6PD deficiency", th: "ภาวะขาดเอนไซม์จีซิกพีดี (G6PD deficiency)" },
      text: {
        en: "Do take extra caution if you are G6PD deficient. Although we do not have any case where our herbal treatment had trigger hemolysis in G6PD deficient customers, we are aware that our herbal paste may be a possible trigger, especially in children. So if you decide to proceed with the herbal treatment knowing that you're G6PD deficient, it will be at your own risk.",
        th: "หากลูกค้ามีภาวะขาดเอนไซม์จีซิกพีดี ลูกค้าจำเป็นจะต้องระมัดระวังเป็นพิเศษ ทรีทเม้นท์ของเราไม่เคยมีประวัติที่เป็นตัวกระตุ้นการแตกของเม็ดเลือดแดง (hemolysis) ในผู้ที่มีภาวะขาดเอนไซม์จีซิกพีดี เราทราบดีว่าครีมทรีทเม้นท์ของเราอาจเป็นตัวกระตุ้นให้เกิดการแตกของเม็ดเลือดแดงโดยเฉพาะในเด็ก หากลูกค้ามีภาวะดังกล่าวแล้วตัดสินใจที่จะทำทรีทเม้นท์ คุณลูกค้าจะต้องรับผิดชอบในความเสี่ยงที่จะเกิดอาการนี้เองนะคะ",
      },
    },
  },
  {
    question: { en: "Is The Treatment Same as Henna?", th: "การทำทรีทเม้นท์เหมือนการทำสีเฮนนาไหม?" },
    paragraphs: {
      en: [
        "Our treatment is not henna; we are using 100% Chinese herbs. We prepare the herbal treatment by cooking the Chinese herbs. Whereas for henna, after you choose the desired colour, hot water, tea or coffee is added into the henna powder to form the henna paste. Customer who experience discomfort, redness or itchiness on their scalp after the henna treatment, do not experience any of the earlier mentioned after doing our Herbal treatment.",
      ],
      th: [
        "การทำทรีทเม้นท์ของเราไม่ใช่เฮนนานะคะ เราใช้สมุนไพรจีน 100% พวกเราต้องเตรียมทรีทเม้นท์สมุนไพรโดยผ่านกรรมวิธีต่างๆ ซึ่งตรงข้ามกับเฮนน่าที่คุณสามารถเลือกสี น้ำร้อน ชาหรือกาแฟที่จะใส่ลงไปในเฮนนาได้ คุณลูกค้าที่เคยมีปัญหาหนังศีรษะไม่สบาย แดงและคันหลังจากทำทรีทเม้นท์แบบเฮนนา แต่ไม่เคยมีอาการแบบนั้นจากการทำทรีทเม้นท์สมุนไพรของเรานะคะ",
      ],
    },
  },
  {
    question: { en: "Is There Any Other Colour That I Can Choose From?", th: "มีสีอื่นๆที่สามารถเลือกได้ไหม?" },
    paragraphs: {
      en: [
        "Our policy is that we will never introduce any form of chemical into our paste to achieve a desired colour. This is one of the reasons why our herbal paste comes only in reddish/copper colour at the moment.",
        "We do have a \"colouress\" version. However, be warned, the colourless version may still have a tinge of copper colour especially if your hair had been bleached before. Also, the steaming process may also cause your previous colour to run, but this rarely happens.",
        "We have a \"dark tone\" herb that can be used to darken EXISTING colour, i.e. it can only be used after the normal coloured herb has been used and must be done within 7 days of that, otherwise it doesnt work effectively. For this option, please inform our therapist and they can explain furher at the shop.",
      ],
      th: [
        "ทางเราไม่มีนโยบายที่จะใส่สารเคมีหรือสีต่างๆลงไปในครีมทรีทเม้นท์สมุนไพรของเราเพื่อที่จะได้สีผมตามต้องการนะคะ นี่เป็นเหตุผลว่าทำไมเมื่อทำทรีทเม้นท์สมุนไพรของเราออกมาแล้วจะได้สีเดียว คือสีน้ำตาลธรรมชาติค่ะ",
        "เรามีสมุนไพร \"สูตรไม่มีสี\" เช่นกัน แต่อาจมีติ่งสีคอปเปอร์อยู่นิดหน่อยนะคะโดยเฉพาะลูกค้าที่เคยกัดสีผมมาแล้ว นอกจากนี้แล้วการอบไอน้ำอาจทำให้สีผมของคุณลูกค้าที่เคยทำสีผมมาจางลงด้วยนะคะโดยที่การจางลงของสีผมจะพบได้ไม่บ่อย",
        "เรามีสมุนไพร \"โทนเข้ม\" ที่สามารถใช้เพื่อทำให้สีที่มีอยู่เข้มขึ้นได้ โดยสามารถใช้ได้หลังจากใช้สมุนไพรสีปกติแล้วเท่านั้น และต้องทำภายใน 7 วันหลังจากนั้น มิฉะนั้นจะไม่มีประสิทธิภาพ สำหรับตัวเลือกนี้ โปรดแจ้งให้พนักงงานของเราทราบ และพวกเขาสามารถอธิบายเพิ่มเติมได้ที่ร้านค่ะ",
      ],
    },
    image: {
      src: darkToneBeforeAfter,
      alt: { en: "before after bee choo herbal colour of the herb", th: "before after bee choo herbal colour of the herb" },
    },
  },
  {
    question: { en: "How often should I come for treatment?", th: "ควรจะมาทำทรีทเม้นท์บ่อยแค่ไหน?" },
    paragraphs: {
      en: [
        "This will depend on your scalp condition. For those with severe hair issues, you should treat your hair every week for the first one to two months to benefit fully from the intensive herbal reconditioning. You can reduce the frequency once the health of your scalp improves.",
      ],
      th: [
        "ขึ้นอยู่กับสภาพหนังศีรษะของแต่ละท่านค่ะ และสำหรับคุณลูกค้าที่มีปัญหาผม เราแนะนำให้ทำอาทิตย์ละครั้งตั้งแต่ 1-2เดือน เพื่อที่จะได้ประโยชน์จากสมุนไพรสูงสุดค่ะ และคุณไม่ต้องมาทำบ่อยก็ได้เมื่อสุขภาพของเส้นผมและหนังศีรษะดีขึ้นแล้ว มาดูชาร์ตสุขภาพหนังศีรษะที่ผ่านการทำทรีทเม้นท์กับเรากันค่ะ",
      ],
    },
  },
  {
    question: { en: "What ingredients are in the herbal treatment?", th: "ส่วนผสมอะไรที่อยู่ในทรีทเม้นท์สมุนไพร" },
    paragraphs: {
      en: [
        "Our herbal treatment contain herbs like Dang Gui, Ginseng, He Shuo Wu, Chuan Xiong, Lin Zhi and many other ingredients that effectively help control and improve your hair condition and at the same time, encouraging hair growth. There are no chemicals added to our herbal paste.",
        "All our herbal pastes are freshly cooked daily in the factory to ensure freshness and quality. The chinese herbs are cooked for hours in order to bring out the nutrients from the herbs which are essential in bringing back the health in your scalp.",
        "Our range of hair products such as the shampoos, conditioner, tonics and spa contain chemicals. Our products are top of the range and as far as possible we have remove the use of potentially harmful chemicals in our hair products.",
      ],
      th: [
        "ทรีทเม้นท์สมุนไพรของเรามีส่วนประกอบหลักคือ ตังกุย โสม ห่อสิ่วโอว ชวงซง เห็ดหลินจือและส่วนผสมอื่นๆอีกมากมายที่ช่วยบำรุงและฟื้นฟูหนังศีรษะและเส้นผมอย่างมีประสิทธิภาพ และกระตุ้นการงอกใหม่ของเส้นผมเช่นเดียวกัน แล้วก็ไม่มีสารเคมีเป็นส่วนประกอบเลยนะคะ",
        "สมุนไพรของเราได้ผ่านกรรมวิธีเพื่อนำมาทำเป็นครีมทรีทเม้นท์แบบวันต่อวันที่โรงงานนะคะ คุณลูกค้ามั่นใจได้เลยค่ะว่าจะได้ทรีทเม้นท์ที่สดใหม่และมีคุณภาพแน่นอน สมุนไพรจีนที่เราใช้ถูกต้มอยู่หลายชั่วโมงเพื่อที่เราจะสามารถดึงสารอาหารออกมาให้ได้มากที่สุด ซึ่งเป็นส่วนสำคัญมากเพราะเป็นการนำสารเหล่านี้กลับมาบำรุงหนังศีรษะอีกทีค่ะ",
        "เรามาดูค่าพิสัยของผลิตภัณฑ์ของเรากันค่ะ ไม่ว่าจะเป็นแชมพู ครีมนวดผม โทนิค และผลิตภัณฑ์อื่นๆที่อาจจะมีสารเคมี แต่ผลิตภัณฑ์ของเราอยู่จุดสูงสุดและไกลที่สุดเลยนะคะ นั่นเป็นเพราะว่าเราตัดส่วนผสมที่เป็นสารเคมีที่ไม่จำเป็นออกจากผลิตภัณฑ์ของเราค่ะ",
      ],
    },
  },
  {
    question: { en: "Will my Normal Hair Colour be Affected by the Natural Dye?", th: "สีย้อมผมจากธรรมชาติจะส่งผมกับสีผมปกติไหม?" },
    paragraphs: {
      en: [
        "If your natural hair colour is brown or black, it will not be affected. This is illustrated by the hair scan images below:",
        "As seen in the picture, the natural black hair remain unchanged while white hair turned copperish in colour. If your natural hair colour is blonde, it will become brownish/copperish in colour.",
      ],
      th: [
        "ถ้าสีผมธรรมชาติของคุณเป็นสำดำหรือน้ำตาล ทรีทเม้นท์ของเราจะไม่ส่งผลใดๆทั้งสิ้น ภาพด้านล่างนี้มาจากเครื่องแสกนของเรา :",
        "จากที่เห็นในภาพ จะเห็นได้ว่าผมสีดำนั้นไม่มีการเปลี่ยนแปลงใดๆ แต่ผมขาวจะเปลี้ยนเป็นสีน้ำตาลแดง และถ้าสีผมธรรมชาติของคุณเป็นสีบลอน สีผมก็จะเปลี้ยนเป็นสีน้ำตาลหรือน้ำตาลแดง",
      ],
    },
    image: { src: hairDyeBeforeAfter, alt: { en: "", th: "" } },
  },
];

export const FAQ_HERO: { heading: L; intro: L } = {
  heading: { en: "Frequently Asked Questions", th: "คำถามที่พบบ่อย" },
  intro: {
    // Adapted: legacy hard-codes a stale one-branch phone number (02-108-3938) in
    // real prose — replaced with the sitewide Facebook/LINE/Find-a-Branch CTA
    // routing, same fix Header.astro already made for the same underlying problem.
    // ⚠ Composed/adapted, flag for Crispin sign-off.
    en: "In this section, we have listed down the most frequently asked questions from our customers. You may also message us on Facebook or find your nearest branch to enquire more 🙂",
    th: "ในส่วนนี้เราได้ตอบคำถามที่พบบ่อยจากลูกค้าของเรา หรือถ้าคุณลูกค้ามีข้อสงสัยอะไรสามารถส่งข้อความหาเราได้ทางเฟสบุ๊ค หรือค้นหาสาขาใกล้คุณ",
  },
};

export const FAQ_VIDEO = { id: "C1NNwuqcroc" };

export const FAQ_SEO = {
  title: {
    en: "Frequently Asked Questions - Bee Choo Herbal",
    th: "คำถามที่พบบ่อยจากลูกค้า - Bee Choo Herbal",
  },
  description: {
    // ⚠ Composed — the live EN page has no meta description (verified null in source).
    en: "Answers to the most frequently asked questions about Bee Choo Herbal's natural herbal hair treatment — safety, results, ingredients and more.",
    // Adapted from the real TH Yoast description — stale phone number removed. ⚠ Flag for sign-off.
    th: "ในส่วนนี้เราได้ตอบคำถามที่พบบ่อยจากลูกค้าของเรา หรือถ้าคุณลูกค้ามีข้อสงสัยอะไรสามารถส่งข้อความหาเราได้ทางเฟสบุ๊ค",
  },
};
