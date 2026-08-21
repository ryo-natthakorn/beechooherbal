// src/data/herbal-vs-transplant.ts
// "Herbal Treatment vs Hair Transplant" page. Transcribed verbatim from the live site
// (wp-json/wp/v2/pages/1170 EN, /1360 TH, both modified 2025-09-29) via
// inventory/rest-pages.json — see CLAUDE.md §8: no machine translation, EN/TH are
// each verbatim in their own language, not a translation pair.
//
// Deliberate content decision (confirmed with the user 2026-08-21): the EN "Clinics
// offering..." section originally named a real competing clinic ("HH clinic") and a
// real doctor ("Dr. Kongkiat Laorwong") with negative reviews, sourced from two 2018
// forum threads. The live TH version never had either paragraph — verified directly
// against source, not assumed. Dropped both from EN here so the two languages match;
// this is the same content the TH page already ships, not a translation gap.
//
// Section headings Title-Cased from the legacy source's ALL-CAPS ("1. STEM CELL
// THERAPY" etc.) — presentation-only, matches the Title-Case pass already documented
// elsewhere in this codebase (products.ts's "Scalp Treatment Essence").
//
// Legacy outlet+phone lists (in the "Natural Alternative" section, both mid-page and
// at the closing) are dropped — superseded by the shared <LocationsBand> component,
// same "stale hardcoded contact info -> one maintained CTA" fix already applied
// sitewide (Header.astro's Call -> Find a Branch). Bee-Choo-new-logo.png (empty alt,
// decorative) also dropped — redundant with sitewide header/footer branding, same
// precedent as team.ts/treatment-pages.ts.
//
// TH has no <h1> in its own content (confirmed — the theme falls back to the WP page
// title). H1 here is that page title, "ทรีทเม้นท์สมุนไพร vs การปลูกผม" — the Yoast
// title minus the " - Bee Choo Herbal" site suffix, same derivation every other page
// on this site already uses (CLAUDE.md §6 title-format rule), not composed content.
//
// Treatment-Process-Bee-Choo-{ENG,TH}.jpg has empty alt in source — alt composed here
// (⚠ flag for Crispin sign-off, same convention as other composed alt text).
//
// One image genuinely differs by language for the same content slot: the stem-cell
// "how it works" photo (EN: How-does-stem-cell-therapy-work-for-hair-loss-.jpg, TH:
// stem-cell-hair-therapy.jpeg) — modelled via ComparisonSubBlock.image.srcTh.
import type { ImageMetadata } from "astro";
import stemCellTop from "../assets/images/herbal-vs-transplant/stem-cell-top.jpg";
import stemCellHowItWorksEn from "../assets/images/herbal-vs-transplant/stem-cell-how-it-works-en.jpg";
import stemCellHowItWorksTh from "../assets/images/herbal-vs-transplant/stem-cell-how-it-works-th.jpeg";
import keratinTop from "../assets/images/herbal-vs-transplant/keratin-top.png";
import keratinTreatment from "../assets/images/herbal-vs-transplant/keratin-treatment.png";
import fueTop from "../assets/images/herbal-vs-transplant/fue-top.png";
import fueHowItWorks from "../assets/images/herbal-vs-transplant/fue-how-it-works.png";
import futTransplant from "../assets/images/herbal-vs-transplant/fut-transplant.png";
import fueVsFut from "../assets/images/herbal-vs-transplant/fue-vs-fut.png";
import smpTop from "../assets/images/herbal-vs-transplant/smp-top.png";
import treatmentProcessEn from "../assets/images/herbal-vs-transplant/treatment-process-en.jpg";
import treatmentProcessTh from "../assets/images/herbal-vs-transplant/treatment-process-th.jpg";

export type Lang = "en" | "th";
type L = Record<Lang, string>;
type PL = { en: string[]; th: string[] };

export interface ComparisonSubBlock {
  heading: L;
  paragraphs: PL;
  list?: PL;
  /** Text that comes AFTER the list in source order (only a couple of blocks have
   *  this) — kept separate from `paragraphs` so the component can render list then
   *  closing text, matching the legacy document order exactly. */
  paragraphsAfterList?: PL;
  image?: { src: ImageMetadata; alt: string; srcTh?: ImageMetadata };
}

export interface ComparisonSection {
  id: string;
  heading: L;
  topImage?: { src: ImageMetadata; alt: string };
  blocks: ComparisonSubBlock[];
}

export const TRANSPLANT_HERO: { heading: L } = {
  heading: {
    en: "Hair transplant vs stem cell vs keratin treatment vs natural herbal treatment",
    th: "ทรีทเม้นท์สมุนไพร vs การปลูกผม",
  },
};

export const TRANSPLANT_INTRO: { paragraphs1: PL; subheading: L; paragraphs2: PL; closingHeading: L } = {
  paragraphs1: {
    en: [
      "Hair loss is a common problem that is faced by many. Especially with our stressful and busy lives, hair loss is a growing concern that many are facing even at a young age. Coupled with a growing concern of how we look, hair loss can be devastating to many, shattering your self-confidence.",
      "Not looking presentable and at your best can also potentially lead to negative implications in the development of your career, as part of being a successful professional is looking presentable to your clients. With these potential implications of hair loss, it is no wonder that we are constantly looking out for new treatment options to ensure that we have a head of healthy hair that we can be proud of.",
    ],
    th: [
      "ปัญหาผมหลุดร่วงเป็นปัญหาที่หลายๆคนต้องเผชิญ โดยเฉพาะผู้ที่มีความเครียดและยุ่งกับการทำงานอยู่เสมอ ปัญหาผมร่วงก่อให้เกิดความกังวลใจเมื่อเกิดขึ้นตอนอายุยังน้อย รวมไปถึงความกังวลใจด้านรูปลักษณ์ และสูญเสียความมั่นใจในตนเองเป็นอย่างมาก",
      "ไม่ใช่แค่ไม่น่ามองเท่านั้น แต่ก็ยังส่งผลลบโดยนัยในการพัฒนาด้านอาชีพของคุณ เช่นการเป็นส่วนหนึ่งของลุคที่ดูมืออาชีพซึ่งทำให้น่าเชื่อถือเมื่อพบปะกับลูกค้า ผลกระทบทางลบโดยนัยที่เกิดจากปัญหาผมร่วงเหล่านี้ทำให้พวกเราหลายๆคนยังคงหาทรีทเม้นท์ใหม่ๆและตัวช่วยเสริมที่จะทำให้ศีรษะของเราปกคลุมไปด้วยเส้นผมที่มีสุขภาพดี",
    ],
  },
  subheading: { en: "Different Hair and Scalp Treatments Explained", th: "ทรีทเม้นท์สำหรับเส้นผมและหนังศีรษะที่แตกต่างกัน" },
  paragraphs2: {
    en: [
      "Typically, a person loses an average of 50-100 strands of hair a day. This is completely normal and is part of the hair renewal process. However, due to certain factors, some might suffer from excessive hair loss, which can become a huge concern and a source of a lack of confidence to deal with others in their daily lives. Hair loss can be caused by many factors, and the most typical cause by far is hormonal changes.",
      "Hormones are what that stimulates hair growth and renewal, and hence can have a huge impact on the health and growth of hair. This is the reason why prenatal hair loss is such a prevalent issue today, as the mother during the period of pregnancy experiences huge changes in their hormonal levels. Hormonal changes can also be hereditary in nature, which explains why hair loss can be a recurring problem across generations in a family.",
      "Hair loss can also be caused by diseases or illnesses, such as thyroid diseases, cancer treatments and malnutrition. Certain medications can also result in hair loss. Besides that, another major reason contributing to hair loss is mechanical damage to the hair. The use of harsh chemicals in dyes, bleaches and perming solutions can be extremely harsh on the scalp, and prolonged exposure to such harsh and damaging chemicals can result in permanent harm to your hair follicles or even chemical burns to the scalp.",
      "It is important to take immediate care and attention to any signs of hair loss as treating the problem at its early stages is always easier. And of course, it will be best to start taking care of your hair and scalp right now even if you are not experiencing any signs of hair loss, as prevention is almost always definitely better than cure.",
      "There are multiple treatment options for hair loss, and we will be sharing more about these different treatment options that are available in Bangkok, Thailand. The Land of Smiles.",
    ],
    th: [
      "โดยปกติแล้วผมของคนเราจะร่วงโดยเฉลี่ยวันละ 50-100 เส้นต่อวัน ซึ่งเป็นเรื่องปกติและนี่เป็นหนึ่งในกระบวนการสร้างเส้นผมใหม่ แต่เพราะหลายๆปัจจัยที่เกี่ยวข้อง คนที่เผชิญปัญหาผมร่วงมักจะสูญเสียความมั่นใจและยากที่จะพบปะกับคนอื่นๆในชีวิตแต่ละวัน ผมหลุดร่วงนั้นมีหลายปัจจัยและปัจจัยที่ธรรมดามากที่สุดนั่นก็คือการเปลี่ยนแปลงของฮอร์โมน",
      "ฮอร์โมนเป็นตัวกระตุ้นให้ผมเจริญเติบโตและสร้างขึ้นใหม่ ดังนนั้นจึงส่งผลกระทบอย่างใหญ่หลวงต่อสุขภาพและการเจริญเติบโตของเส้นผม และนี่เป็นเหตุผลที่ว่าปัญหาผมร่วงหลังคลอดเป็นปัญหาผมร่วงที่พบได้บ่อยๆในทุกวันนี้ เนื่องจากเมื่อคุณแม่ได้ตั้งครรภ์ทำให้มีการเปลี่ยนแปลงระดับของฮอร์โมนอยู่เสมอ การเปลี่ยนแปลงฮอร์โมนนั้นเป็นกรรมพันธุ์โดยธรรมชาติเช่นกัน ทำให้ปัญหาผมร่วงนั้นเกิดซ้ำในเครือญาติเดียวกัน",
      "ปัญหาผมหลุดร่วงนั้นอาจจะมีสาเหตุมาจากความเจ็บป่วยบางประการเช่น โรคไทรอยด์ การรักษาโรคมะเร็ง หรือผู้ที่มีภาวะขาดสารอาหาร และปัจจัยใหญ่ที่ก่อให้เกิดปัญหาผมร่วงนั่นก็คือการใช้สารเคมีที่รุนแรงต่อเส้นผม เช่น การย้อม การกัดสีผม การดัดผม ซึ่งกระบวนการเหล่านี้ก่อให้เกิดอันตรายต่อหนังศีรษะอย่างร้ายแรงและเมื่อผมถูกทำร้ายจากสารเคมีเป็นระยะเวลานานอย่างต่อเนื่องก็จะเป็นการทำร้ายรูขุมขนเส้นผมอย่างถาวร หรือก่อให้เกิดการไหม้จากสารเคมีที่หนังศีรษะ",
      "มันเป็นเรื่องสำคัญมากที่ต้องเข้ารับการรักษาอย่างทันท่วงที และสังเกตถึงปัญหาผมร่วงอยู่เสมอ เพราะในการรักษาปัญหาเส้นผมในระยะเริ่มแรกนั้นง่ายที่สุดเสมอ และก็เป็นการดีที่คุณจะเริ่มดูแลเส้นผมและหนังศีรษะของคุณตั้งแต่ยังไม่สังเกตเห็นสัญญาณใดๆของปัญหาผมร่วง การป้องกันนั้นย่อมดีกว่าการมารักษาภายหลังเสมอ",
      "มีตัวช่วยอยู่หลายตัวช่วยในการรักษาปัญหาผมหลุดร่วง และพวกเราอยากจะขอแบ่งปันความแตกต่างระหว่างตัวช่วยเหล่านี้ซึ่งมีอยู่ในกรุงเทพฯ ประเทศไทย สยามเมืองยิ้มของเรา!",
    ],
  },
  closingHeading: { en: "Different choices of hair loss treatment in thailand", th: "ตัวช่วยในการรักษาปัญหาผมร่วงที่แตกต่างกันในประเทศไทย" },
};

export const COMPARISON_SECTIONS: ComparisonSection[] = [
  {
    id: "stem-cell",
    heading: { en: "1. Stem Cell Therapy", th: "1. สเต็มเซลล์บำบัด" },
    topImage: { src: stemCellTop, alt: "stem cell therapy thailand does it work" },
    blocks: [
      {
        heading: { en: "How does stem cell therapy work for hair loss?", th: "สเต็มเซลล์รักษาปัญหาผมร่วงได้อย่างไร" },
        image: { src: stemCellHowItWorksEn, alt: "How does stem cell therapy work for hair loss?", srcTh: stemCellHowItWorksTh },
        paragraphs: {
          en: [
            "Our hair grows from the follicles that we have on our scalp, and a reason why your hair can stop growing and replacing itself is when your hair follicles are dead or damaged. Recent scientific research and improvements in technology now makes it possible for stem cells to be used to stimulate the cells in the follicles. This ultimately helps the growth of new follicles and correspondingly new hair when they are transplanted onto the scalp, allowing you to have that thick mane of hair you missed so much again. A requisite growth factor is present in scaffolding, which is stem cell enriched. When this is injected onto the scalp with the use of a syringe, it aid in the orientation of the hair follicles, ensuring that they develop in the right direction.",
            "As you age, usually it shows on your hair too. As we grow older, our follicles have a tendency to shrink and stop responding to the chemical signals that are transmitted to it. This hinders the entire process of hair growth. With stem cell therapy, the new follicle stem cells will send chemical signals to the follicles that have shrunk, which will help in the regeneration of your hair.",
            "For stem cell therapy, the total number of visits you need to make to the hair specialist will differ slightly based on the specific stage and amount of your hair loss. This will usually range from two to six sittings of stem cell therapy for results to be seen. Pain level wise, it is side to be about a pin prick when they are injecting the stem cells onto your scalp. You may read more about this from www.stylecraze.com",
          ],
          th: [
            "ที่มา: http://www.hairclinichungary.com/hair-transplant/stem-cell-hair-transplant/",
            "เส้นผมของเราเติบโตมาจากรูขุมขนที่อยู่บนหนังศีรษะของเรา และสาเหตุที่เส้นผมหยุดเติบโตนั่นก็คือ เมื่อรูขุมขนเส้นผมตายหรือถูกทำร้าย เมื่อไม่นานมานี้ได้มีการคิดค้นเทคโนโลยีทางวิทยาศาสตร์ที่จะสามารถพัฒนาสเต็มเซลล์ โดยการกระตุ้นเซลล์ในรูขุมขน นี่เป็นการช่วยให้เกิดการสร้างรูขุมขนเส้นผมขึ้นมาใหม่พร้อมกับเส้นผมที่เกิดใหม่ด้วย เมื่อทำการปลูกถ่ายไปยังหนังศีรษะแล้ว คุณจะคิดว่าได้ผมที่ดกดำและหนาโดยทันทีนั้นคงจะเป็นไปไม่ได้ ปัจจัยในการเจริญเติบโตคือการที่เส้นผมมีโครงสร้างที่แข็งแรงซึ่งประกอบไปด้วยสเต็มเซลล์ที่สมบูรณ์ และเมื่อฉีดสเต็มเซลล์เข้าไปที่หนังศีรษะด้วยเข็มฉีดยาจะช่วยให้การเติบโตของรูขุมขนเส้นผมเจริญเติบโตไปอย่างถูกทิศทาง",
            "ช่วงวัยเป็นสิ่งที่กำหนดสภาพของเส้นผมเช่นเดียวกัน เมื่อเรามีอายุที่มากขึ้น รูขุมขนของเเรามีแนวโน้มที่จะหดตัวและไม่ตอบสนองต่อผลิตภัณฑ์ต่างๆที่เราใช้กับเส้นผม ด้วยเหตุนี้จึงเป็นสาเหตุให้เส้นผมหยุดการเจิรญเติบโต แต่การรักษาด้วยสเต็มเซลล์บำบัด สเต็มเซลล์ของรูขุมขนที่เกิดใหม่จะส่งสัญญาณทางเคมีให้กับรูขุมขนที่หดตัวทำให้เกิดการงอกใหม่ของเส้นผม",
            "สำหรับจำนวนครั้งที่คุณจะต้องเข้าไปพบผู้เชี่ยวชาญทางด้านสเต็มเซลล์บำบัดนั้นขึ้นอยู่กับระยะของปัญหาในแต่ละคน รวมไปถึงจำนวนของเส้นผมด้วย ซึ่งในการเข้ารับการรักษาต้องใช้เวลา 2-6 ครั้งถึงจะเห็นผล ส่วนระดับความเจ็บปวดนั้นขึ้นอยู่กับจำนวนเข็มที่ฉีดไปที่หนังศีรษะของคุณ คุณสามารถอ่านเพิ่มเติมได้ที่ www.stylecraze.com",
          ],
        },
      },
      {
        heading: { en: "What is the process of stem cell therapy for hair loss?", th: "สเต็มเซลล์บำบัดทำงานอย่างไรในการแก้ปัญหาผมร่วง?" },
        paragraphs: {
          en: [
            "At the first stage of the process, the hair specialists will remove some hair follicles that you currently have on your scalp. They will then take these hair follicles, process them and then culture them in a lab to produce more stem cells from it. After a period of around 15 to 20 days, the second stage of the therapy process will be initiated. The newly cultured stem cells from your hair follicles will then be inserted onto your scalp via an injection.",
            "Besides this more conventional method of treatment, there is also another procedure that can be used for stem cell therapy in treating hair loss. First, the patient's blood will be draw out, concentrated and then separated. This is done via a process known as centrifugation. Next, this will be re-injected into the problem areas of the scalp. This method is otherwise known as Platelet Rich Plasma, or PRP in short. This also serves as a therapeutic non-surgical option for the stimulation of the growth of new hair— an alternative for those who do not want to go under the knife or do not want the down time of an invasive surgical procedure. You may read more about this at www.hairlossrevolution.com",
          ],
          th: [
            "ในขั้นแรกผู้เชี่ยวชาญจะเก็บรูขุมขนเส้นผมที่คุณมีอยู่บนหนังศีรษะ จากนั้นจึงนำไปเพาะเลี้ยงในห้องทดลองเพื่อเพิ่มจำนวนของสเต็มเซลล์ประมาณ 15-20 วัน เมื่อสเต็มเซลล์เกิดใหม่มีความแข็งแรงแล้วก็จะถูกนำเข้าสู่หนังศีรษะของคุณโดยการฉีดยา",
            "นอกจากนี้ยังมีอีกวิธีการหนึ่งในการรักษาผมร่วง นั่นก็คือการนำเลือดของผู้เข้ารับการรักษามาทำให้เข้มข้นขึ้นและนำมาแยกแยะโดยการหมุนเหวี่ยง จากนั้นจึงนำมาฉีดเข้าบริเวณที่มีปัญหาที่หนังศีรษะอีกครั้ง ซึ่งวิธีนี้รู้จักกันในชื่อว่า Platelet Rich Plasma หรือการฉีดPRP เป็นวิธีการกระตุ้นผมให้เกิดใหม่โดยไม่ต้องเข้ารับการผ่าตัดซึ่งเป็นอีกหนึ่งทางเลือกสำหรับผู้ที่ไม่อยากเจ็บตัวเพราะมีดหมอหรือไม่อยากเสียเวลาในการพักฟื้นจากการผ่าตัด คุณสามารถอ่านเพิ่มเติมได้ที่ www.hairlossrevolution.com",
          ],
        },
      },
      {
        heading: { en: "Why people try Stem Cell Therapy", th: "ทำไมผู้คนถึงเข้ารับการรักษาโดยสเต็มเซลล์บำบัด?" },
        paragraphs: { en: [], th: [] },
        list: {
          en: [
            "Treatment via this method is minimally invasive, and this means both less stress on your part and also less down time after the treatment.",
            "Treatment is quick, each session doesn't take more than an hour.",
          ],
          th: [
            "การรักษาด้วยสเต็มเซลล์บำบัดเป็นวิธีการที่ไม่มีการลุกลาม และในการรักษาด้วยสเต็มเซลล์ทั้ง 2 แบบนี้ทำให้ไม่ก่อให้เกิดความตึงเครียดในส่วนต่างๆและประหยัดเวลาหลังการเข้ารับการรักษา",
            "การรักษาด้วยสเต็มเซลล์บำบัดใช้เวลาไม่นาน และในแต่ละครั้งใช้เวลาไม่ถึง 1 ชั่วโมง",
          ],
        },
      },
      {
        heading: { en: "Side effects of Stem Cell Therapy", th: "ผลข้างเคียงในการเข้ารับการรักษาโดยสเต็มเซลล์บำบัด" },
        paragraphs: {
          en: [
            "While stem cell therapy for hair loss is a promising treatment for your hair, it still comes with some cons and might not be for everyone. The possible concerns with stem cell therapy for hair loss includes:",
          ],
          th: [
            "ในการรักษาผมร่วงโดยวิธีการสเต็มเซลล์บำบัดนั้นถึงจะทำให้เห็นผล แต่ก็มีข้อเสียบางประการที่อาจจะส่งผลกระทบจากการรักษานี้ได้แก่",
          ],
        },
        list: {
          en: [
            "Due to the fact that stem cell therapy is a recent breakthrough discovery when it comes to its use for treating hair loss, there remains a lot that we might not know about it. This includes the potential long term side effects of such a treatment method as it has not been tested in the long run.",
            "A side effect that has been observed by researchers is that patients going through stem cell therapy generally have a compromised immune system too.",
            "Leaders in stem cell research has also come up to claim that stem cell treatments can lead to the growth of benign tumors. While tumors might be harmless when they remain benign, there is also always a chance that they can evolve to become malignant at any time, which can cause disastrous consequences to your health.",
            "There have also been multiple doctors claiming that there is no such thing such as stem cell therapy for hair loss to date, questioning the reliability and legitimacy of such services provided. For instance, doctors such as Jae Pak, MD and Dr John E Frank have stood up to make this claim.",
          ],
          th: [
            "เนื่องจากการรักษาโดยวิธีสเต็มเซลล์บำบัดเพิ่งจะถูกคิดค้นไม่นานมานี้ จึงทำให้ข้อเสียต่างๆยังไม่เป็นที่แน่ชัดเจน รวมไปถึงผลเสียในระยะยาวของการเข้ารับการรักษาด้วยเนื่องจากไม่มีการทดสอบที่ใช้เวลานานอย่างเพียงพอ",
            "ผลข้างเคียงที่เห็นได้ชัดโดยนักวิจัยและผู้เข้ารับการรักษาคือ การรักษาโดยสเต็มเซลล์บำบัดนั้นส่งผลถึงระบบภูมิคุ้มกันของผู้เข้ารับการรักษาด้วย",
            "ผู้ทำการวิจัยเกี่ยวกับสเต็มเซลล์บำบัดนั้นได้ออกมากล่าวถึงผลข้างเคียงในการรักษาคือ การรักษานั้นอาจจะกระตุ้นให้เกิดเนื้องอกที่ไม่เป็นอันตรายได้ แต่เนื้องอกที่ไม่เป็นอันตรายนี้ก็อาจจะเปลี่ยนแปลงเป็นเนื้อร้ายเมื่อไรก็ได้ ซึ่งจะเป็นผลกระทบที่ร้ายแรงต่อสุขภาพอย่างคาดไม่ถึง",
            "มีแพทย์หลายๆท่านที่ออกมากล่าวว่าไม่มีผู้เชี่ยวชาญทางด้านสเต็มเซลล์อย่างแท้จริง จึงก่อให้เกิดคำถามที่มีต่อความน่าเชื่อถือและความชอบธรรมทางด้านกฎหมายที่ตามมา แพทย์ที่มีชื่อเสียงที่โด่งดัง เช่น นายแพทย์แจ ปาร์ค และ ด็อกเตอร์ จอห์น อี แฟรงค์ ได้ออกมากล่าวถึงเรื่องนี้เช่นกัน",
          ],
        },
        paragraphsAfterList: {
          en: [
            "Stem cell therapy can be dangerous when not done correctly, and can cause severe repercussions such as death. In fact, a tourist has been reported to have lost her life after stem cell therapy in Bangkok – click here to read more about her true but unfortunate tragedy.",
          ],
          th: [
            "การรักษาโดยสเต็มเซลล์บำบัดนั้นอาจจะเป็นอันตรายถ้ารักษาอย่างไม่ถูกต้อง และผลที่ร้ายแรงที่สุดคืออาจจะส่งผลถึงชีวิตได้ ในความเป็นจริงแล้วมีนักท่องเที่ยวที่เสียชีวิตในการรักษาโดยสเต็มเซลล์บำบัดในกรุงเทพฯ – อ่านต่อเกี่ยวกับโศกนาฏกรรมอันน่าเศร้านี้",
          ],
        },
      },
    ],
  },
  {
    id: "keratin",
    heading: { en: "2. Keratin Treatment", th: "2. เคราติน ทรีทเม้นท์" },
    topImage: { src: keratinTop, alt: "keratin treatment benefits and costs" },
    blocks: [
      {
        heading: { en: "What Is Keratin?", th: "เคราตินคืออะไร?" },
        paragraphs: {
          en: [
            "Keratin is a form of structural protein that is present in our hair and nails. It acts as a building block for healthy hair and nails, and also play a part in regulating vital cellular activities such as protein production and cell growth. The type of keratin that makes up our hair is also known as alpha-keratin, which maintains the strength of our hair.",
          ],
          th: [
            "เคราติน คือโครงสร้างของโปรตีนที่มีอยู่ในผมและเล็บของเรา ซึ่งทำหน้าที่เหมือนตึกใหญ่สำหรับเส้นผมกับเล็บ และยังทำหน้าที่ในการเสริมสร้างโปรตีนและการเจริญเติบโตของเซลล์อีกด้วย ชนิดของเคราตินที่นำมาใช้กับเส้นผมนั่นก็คือ อัลฟา เคราติน ซึ่งทำให้เส้นผมแข็งแรง",
          ],
        },
      },
      {
        heading: { en: "What is Keratin treatment for your hair?", th: "เคราตินทรีทเม้นท์ช่วยผมในเรื่องอะไรบ้าง?" },
        image: { src: keratinTreatment, alt: "What is Keratin treatment for your hair?" },
        paragraphs: {
          en: [
            "Keratin treatment is a form of restorative treatment that is said to strengthen the hair shaft and make it more resilient to the elements and stresses of daily life. It is semi-permanent and targets the cuticle or outside layer of the hair. Keratin is a protein that is present naturally in our hair. Usually Kertain treatment involves the hair specialist applying a keratin hair straightening product to your hair. Heat, which can be applied in the form of a flat iron, is then used to seal everything in your hair. The entire process takes around 90 minutes from start to finish, but will take a longer time if you have long hair. This treatment will typically last around 2.5 months.",
            "If you are thinking about getting keratin treatment for your hair, make sure that you do not wash your hair immediately after the treatment process. Instead, you should refrain from washing your hair for three to four days after the treatment, as the keratin solution needs some time to work into your hair. Besides that, also make sure to change your regular shampoo to sodium sulfate free shampoo to make sure that the effects of the treatment lasts for a longer time. More information can be found at allure, webmd.",
          ],
          th: [
            "เคราตินทรีทเม้นท์เป็นการรักษาในรูปแบบของการฟื้นบำรุงให้แก่เส้นผม ซึ่งได้ถูกขนานว่าทำให้เส้นผมมีความแข็งแรงมากยิ่งขึ้น ช่วยฟื้นฟูแร่ธาตุต่างๆที่ได้รับผลเสียจากความเครียดในแต่ละวัน และเป็นเกราะป้องกันภายนอกอย่างกึ่งถาวรให้แก่เส้นผม โดยปกติแล้วเคราตินเป็นโปรตีนที่มีในเส้นผมของเราอยู่แล้ว การทำทรีทเม้นท์เคราตินนั้นจะทำโดยผู้เชี่ยวชาญโดยทาผลิตภัณฑ์ที่มีเคราตินลงไปที่เส้นผมและใช้ความร้อน โดยอาจจะเป็นในรูปแบบของการใช้เครื่องรีดผมไฟฟ้าเพื่อทำให้ส่วนผสมทุกอย่างเข้าสู่เส้นผมของคุณ ซึ่งกระบวนการทั้งหมดจะใช้เวลาประมาณ 90 นาที และอาจจะใช้เวลามากกว่านี้ถ้าคุณมีผมยาวมาก ทรีทเม้นท์นี้จะอยู่ที่ผมคุณประมาณ 2.5 เดือน",
            "ถ้าคุณกำลังคิดจะอยากทำทรีทเม้นท์เคราติน คุณต้องจำไว้ว่าคุณต้องห้ามสระผมเป็นระยะเวลา 3-4 วัน หลังจากการทำทรีทเม้นท์ เนื่องจากการทำทรีทเม้นท์เคราตินนี้จะต้องใช้เวลาในการเห็นผล และคุณจำเป็นต้องใช้แชมพูที่ปราศจาก โซเดียม ซัลเฟต เพื่อให้เคราตินทรีทเม้นท์นั้นคงอยู่บนเส้นผมได้นานที่สุดเท่าที่จะเป็นไปได้ สำหรับข้อมูลเพิ่มเติมนั้นสามารถเข้าไปอ่านได้ที่ allure, webmd",
          ],
        },
      },
      {
        heading: { en: "Why people try Keratin Hair Treatment", th: "ทำไมผู้คนถึงทำทรีทเม้นท์เคราติน" },
        paragraphs: { en: [], th: [] },
        list: {
          en: ["Non-invasive treatment", "For damaged hair but doesn't help with hair loss, oily scalp, sensitive scalp etc"],
          th: ["เป็นทรีทเม้นท์ที่ไม่มีการลุกลาม", "ช่วยเรื่องผมเสีย แต่ไม่ช่วยปัญหาอื่นๆเช่นผมร่วง หนังศีรษะมัน และหนังศีรษะบอบบางแพ้ง่ายและปัญหาผมอื่นๆ"],
        },
      },
      {
        heading: { en: "Side effects of Keratin Hair Treatment", th: "ผลข้างเคียงจากการทำทรีทเม้นท์เคราติน" },
        paragraphs: {
          en: [
            "Keratin hair treatment can be harmful than when done incorrectly or if the wrong products are used. In fact, Jennifer Aniston once attributed her chin length haircut to a botched up keratin straightening treatment, causing her to chop off her long tresses. Here are some problems that might come with a keratin hair treatment that you should really know about before deciding to go for one:",
          ],
          th: [
            "การทำทรีทเม้นท์เคราตินนั้นสามารถเป็นอันตรายได้ถ้าทำอย่างไม่ถูกวิธี หรือการใช้ผลิตภัณฑ์ที่ไม่ถูกต้อง มีอยู่ครั้งหนึ่ง ที่คุณเจนิเฟอร์ แอนิสตัน ดาราฮอลลีวู้ดชื่อดังได้ตัดผมสั้นเท่าความยาวของคางของเธอ เนื่องจากเธอได้ไปทำทรีทเม้นท์ยืดผมเคราตินอย่างลวกๆมา ทำให้เธอต้องตัดผมที่ยาวสลวยของเธอออกไป และนี่อาจจะเป็นปัญหาที่ตามมาจากการทำทรีทเม้นท์เคราตินที่คุณควรรู้ก่อนที่จะตัดสินใจไปทำ",
          ],
        },
        list: {
          en: [
            "The keratin treatment itself will not result in hair breakage, but hair breakage is still a real concern when going for such treatments if the hair stylist is not experienced or careful enough. The flat ironing of your hair after the keratin solution treatment is applied can definitely result in hair breakage if done incorrectly when heat is used to dry and seal hair. Some hair stylists might use a flat iron that is way too hot, which will result in the hair being scorched and breakage of hair.",
            "This form of treatment might not be suitable for those with psoriasis or seborrheic dermatitis, and those suffering from these ailments will definitely need to consult your dermatologist before trying the keratin treatment on your hair.",
            "Many keratin products contain the chemical formaldehyde. This is linked to multiple health problems, especially for those who are continuously exposed to it in the long run. While most commercial keratin treatments that are sold on the market use safe levels of formaldehyde, some salons might choose to mix their own concoction for their keratin hair treatments, resulting in problems when too much formaldehyde is mixed in. Formaldehyde is also a known carcinogen, and can increase the risk of cancer. Besides being a carcinogen, exposure to formaldehyde can also cause damage to your central nervous system, amounting to symptoms such as increased number of headaches, depression, changes in your mood, difficulties sleeping and increased irritability.",
            "There have been research that show that regular exposure to formaldehyde increases one's chance from dying from ALS by three times compared to those who are not exposed to the chemical at all. Especially for those who are pregnant, keratin hair treatment should not be an option at all as exposure to the chemical during pregnancy can cause fertility and reproductive problems, as well as miscarriage. At the salon, these chemicals can trigger immediate discomfort, such as burning of your eyes and a scratchy throat.",
            "Having a history of asthma or other breathing conditions will make you more sensitive to exposure to these chemicals too as they act as an irritant to your airways and makes it harder for you to breathe. Every time you use a heat styling tool to straighten or curl your hair—or perhaps even the simple use of a hair dryer to dry your hair after a bath, these chemicals that reside on your hair can be reactivated, producing fumes that are not beneficial to your health.",
            "Even for those who claim that they use only natural and organic ingredients and are free from formaldehyde, the label on these products itself should not be taken at face value. A closer examination of the exact ingredients used is needed to make sure that the product is truly safe and natural for you. Many treatment products that claim to be free from formaldehyde replace the chemical with other harmful chemicals. A common replacement is a chemical known as methylene glycol, which will release formaldehyde when exposed to heat—essentially resulting in the same health risks from exposure to these chemicals.",
            "If it is any consolation, it is also good to note that keratin straightening is different from Japanese straightening, as Japanese straightening targets the lower layers of the hair shaft. This means that if anything bad happens during your keratin treatment, a simple solution to save your hair can simply be cutting the damaged portions off—but that of course means saying goodbye to the hair you have tried so long to grow out too.",
            "The keratin hair treatment process requires strong heat to be applied to your hair. The hair iron that is used for heat application at salons or hair treatment centers are usually set at a temperature of 450 degrees. If you have fine, coloured or damaged hair, the application of such high heat directly to your hair can result in much damage being done to your hair. The health of your hair has already been compromised with the other treatments such as colouring or perming your hair, making it more susceptible to heat damage. More information about this can be found at harpersbazaar, indiatimes and draxe.",
          ],
          th: [
            "1. โดยปกติแล้วเคราตินทรีทเม้นท์จะไม่ทำให้ผมเปราะขาด แต่ปัญหาผมเปราะขาดนั้นสามารถเกิดขึ้นได้ระหว่างทำทรีทเม้นท์เนื่องจากช่างทำผมไม่มีประสบการณ์เท่าที่ควร การที่ใช้เครื่องรีดผมไฟฟ้ากับผมของคุณนั้นสามารถทำให้ผมเปราะขาดได้จริงถ้าใช้อย่างไม่ถูกวิธี เมื่อความร้อนถูกใช้ในการทำให้แห้งและซีลเส้นผมแต่ช่างทำผมบางคนอาจจะปรับระดับความร้อนให้ร้อนจนเกินไปจึงทำให้ผมไหม้เกรียมและเปราะขาด",
            "การทำทรีทเม้นท์นี้ไม่เหมาะสำหรับผู้ที่เป็นโรคสะเก็ดเงิน หรือ ผู้ที่เป็นโรคต่อมไขมันอักเสบ สำหรับผู้ที่มีอาการป่วยเหล่านี้ควรปรึกษาแพทย์ผิวหนังก่อนทำทรีทเม้นท์เคราติน",
            "ผลิตภัณฑ์ที่มีเคราตินประกอบไปด้วยสารฟอร์มาลดีไฮด์ซึ่งก่อให้เกิดผลเสียต่อสุขภาพ โดยเฉพาะผู้ที่ไปทำทรีทเม้นท์เคราตินอยู่เป็นประจำ ในขณะที่โฆษณาของทรีทเม้นท์เคราตินต่างๆในท้องตลาดที่อ้างว่ามีระดับของฟอร์มาลดีไฮด์ในระดับต่ำสามารถใช้ได้อย่างปลอดภัย ในร้านซาลอนบางร้านเลือกที่จะผสมทรีทเม้นท์เคราตินของร้านตัวเองขึ้นมาเองซึ่งทำให้สารฟอร์มาลดีไฮด์ถูกรวมเข้าด้วยกันอย่างเข้มข้นมากขึ้น สารฟอร์มาลดีไฮด์เป็นที่รู้จักดีว่าเป็นสารก่อมะเร็งสามารถเพิ่มความเสี่ยงในการเป็นมะเร็ง ยิ่งไปกว่าการเป็นหนึ่งในสารก่อมะเร็งแล้ว สารฟอร์มาลดีไฮด์ยังเป็นสาเหตุในการทำลายระบบประสาทอีกด้วย ทำให้มีอาการปวดหัว ซึมเศร้า อารมณ์เปลี่ยนแปลง และทำให้มีอารมณ์ฉุนเฉียวง่าย",
            "มีการวิจัยอย่างต่อเนื่องเกี่ยวกับการรับสารฟอร์มาลดีไฮด์ สามารถทำให้ผู้ที่ได้รับสารมีโอกาสเสียชีวิตจากโรคกล้ามเนื้ออ่อนแรงมากกว่าผู้ที่ไม่ได้รับสารเป็น 3 เท่า โดยเฉพาะผู้หญิงตั้งครรภ์ ทรีทเม้นท์เคราตินไม่ควรเป็นตัวเลือกในการรักษาผมเลย เนื่องจากจะส่งผลถึงความสมบูรณ์ของลูกในครรภ์และก่อปัญหาเรื่องการสืบพันธุ์ ก่อให้เกิดการแท้งเช่นกัน ซาลอนที่มีสารเคมีเหล่านี้อาจจะทำให้รู้สึกแสบตาและระคายคออีกด้วย",
            "สำหรับผู้ที่มีปัญหาโรคหืดหรือมีปัญหาด้านระบบหายใจ คุณอาจจะมีความไวต่อสารเคมีเหล่านี้มากกว่าผู้อื่น โดยคุณอาจจะรู้สึกหายใจลำบากในทุกๆครั้งที่คุณใช้อุปกรณ์ในการจัดแต่งทรงผมในการรีดผมให้ตรง หรือม้วนลอนผม หรือบางทีอาจจะแค่การใช้ไดร์เป่าผมหลังจากอาบน้ำคุณก็รู้สึกว่าหายใจลำบากแล้ว ไอของสารเคมีเหล่านี้จะติดอยู่ที่เส้นผมของคุณซึ่งไม่เป็นผลดีต่อสุขภาพแน่ๆ",
            "นอกจากผลิตภัณฑ์ที่ประกอบไปด้วยสารเคมีเหล่านั้นยังรวมไปถึงผลิตภัณฑ์ที่อ้างว่ามาจากธรรมชาติและมีส่วนผสมที่เป็นออร์แกนิคโดยปราศจากสารฟอร์มาลดีไฮด์ ฉลากของผลิตภัณฑ์นั้นก็ไม่ได้แสดงค่าที่แท้จริงของส่วนผสม การแนบผลทดสอบของส่วนผสมที่แท้จริงนั้นจำเป็นมากในการแสดงว่าผลิตภัณฑ์มีความปลอดภัยจริง ผลิตภัณฑ์ทรีทเม้นท์หลายยี่ห้ออ้างว่าปลอดภัยจากสารฟอร์มาลดีไฮด์แต่ทดแทนด้วยสารเคมีที่เป็นอันตรายอย่างอื่น เช่น เอทิลีนไกลคอล จะปล่อยสารฟอร์มาดีไฮด์เมื่อถูกความร้อน – ผลลัพธ์ที่ตามมาคือความเสี่ยงด้านปัญหาสุขภาพเมื่อได้รับสารเคมีเหล่านี้",
            "ถ้าเป็นเรื่องของความสบายใจ มันเป็นเรื่องที่ดีที่รูว่าการยืดเคราตินนั้นไม่เหมือนกับการยืดแบบญี่ปุ่น คือการยืดแบบญี่ปุ่นจะมุ่งไปที่ชั้นที่ต่ำกว่าแก่นผม ซึ่งหมายความว่าถ้ามีผลเสียเกิดขึ้นในการทำเคราตินทรีทเม้นท์ คุณก็แค่ตัดผมในส่วนที่เสียหายออก แต่นั่นก็หมายความว่าคุณต้องสูญเสียเส้นผมที่คุณอุส่าห์เลี้ยงจนกว่าจะยาวตั้งนาน",
            "ในการทำทรีทเม้นท์เคราตินนั้นต้องใช้ความร้อนสูงทาบบนผมของคุณ เครื่องหนีบผมไฟฟ้าที่ซาลอนทั่วๆไปใช้นั้นปกติแล้วใช้ความร้อนอยู่ที่ 450 องศาเซลเซียส ถ้าคุณมีเส้นผมที่บาง ย้อมสีและแห้งเสีย เมื่อถูกความร้อนจากเครื่องหนีบผมไฟฟ้านั้นก็จะยิ่งสร้างความเสียหายให้แก่เส้นผม ถ้าสภาพเส้นผมของคุณนั้นเคยผ่านการย้อม หรือการดัด จะทำให้ผมเสียเนื่องจากความร้อนมากยิ่งขึ้น สำหรับข้อมูลเพิ่มเติมสามารถอ่านเพิ่มเติมได้ที่ harperbazaar, indiatimes และ draxe",
          ],
        },
      },
    ],
  },
  {
    id: "fue-fut",
    heading: { en: "3. FUE / FUT Hair Transplant", th: "3. การปลูกผมแบบ FUE/FUT" },
    topImage: { src: fueTop, alt: "What is FUE Hair transplantation?" },
    blocks: [
      {
        heading: { en: "What is FUE Hair transplantation?", th: "การปลูกผมแบบ FUE คืออะไร?" },
        image: { src: fueHowItWorks, alt: "How does FUE hair transplantation work" },
        paragraphs: {
          en: [
            "Follicular Unit Extraction (FUE) is a technique that is used for hair extraction. The grafts extracted will then be manually transplanted to the areas of hair loss. Each follicular unit is harvested one by one from the scalp. Because the extraction is not done in a mechanical fashion but instead performed randomly, you will hardly notice a decrease in hair density in the donor area after the hair transplant process has been completed.",
            "As the number of follicles that are harvested can be controlled by the hair specialist providing the treatment, they can exact the precise number of grafts they will require from each donor site. Donor sites can then be covered with the surrounding hair to hide any loss of hair from the donor sites after the hair transplantation process. Most hairs from the donor site will usually also grow back. The specificity of this procedure also means that the hair specialists will be able to precisely control the density of the recipient site to ensure that the finished look is a natural one that you will be happy with. You may read more information from orangecountryhairrestoration. and slclinic.",
          ],
          th: [
            "Follicular Unit Extraction (FUE) เป็นเทคนิคที่ใช้สารสกัดจากเส้นผม การปลูกถ่ายสารสกัดจะถูกทำด้วยมือและนำไปปลูกในที่บริเวณหนังศีรษะที่มีผมร่วง ในแต่ละรูจะถูกเก็บทีละรูจากหนังศีรษะ เพราะสารสกัดจากผมนั้นไม่สามารถทำให้เสร็จได้โดยเครื่องกลสมัยใหม่ แต่จะถูกทำอย่างไร้แบบแผน คุณจะสังเกตเห็นว่าบริเวณที่ปลูกผมนั้นมีผมขึ้นอย่างหนาแน่นหลังจากจบขั้นตอน",
            "จำนวนของรูขุมขนที่เก็บนั้นจะถูกควบคุมโดยผู้เชี่ยวชาญด้านเส้นผมซึ่งเป็นผู้รักษา ผู้เชี่ยวชาญนั้นสามารถสกัดจำนวนของการปลูกถ่ายลงบริเวณที่ต้องปลูกอย่างพิถีพิถัน บริเวณที่ปลูกถ่ายนั้นจะมีผมขึ้นหลังจากที่จบกระบวนการปลูกผม และในบริเวณนั้นก็จะมีผมงอกขึ้นใหม่ด้วย ความพิเศษของขั้นตอนนี้ยังหมายความว่าผู้เชี่ยวชาญทางด้านเส้นผมจะสามารถควบคุมความหนาแน่นบนพื้นที่ปลูกถ่ายซึ่งจะทำให้คุณพอใจกับผลลัพธ์สุดท้ายที่เป็นธรรมชาติที่คุณจะได้รับ คุณสามารถอ่านข้อมูลเพิ่มเติมได้ที่ orangecountryhairrestoration และ slclinic",
          ],
        },
      },
      {
        heading: { en: "What is the typical process of FUE hair transplantation?", th: "กระบวนการโดยทั่วๆไปของการปลูกผมแบบ FUE มีอะไรบ้าง" },
        paragraphs: {
          en: [
            "Firstly, the hair at the donor site will be shortened with the use of a shaver. To ensure that everything is clean and sterile, the donor site will then be cleaned thoroughly with the use of an antiseptic solution. To make sure that the process is not uncomfortable, the scalp at the donor site will be numbed with the use of local anesthetic. A specialised pen for hair transplantation will then be used to extract the follicular units individually. The hair grafts that are harvested will then be stored in a solution to preserve them.",
            "The grafts will then be inspected under a high powered microscope to make sure that they are ideal for transplantation. This process will increase the chances of survival of the grafts once they are transplanted to the recipient site as the ones chosen to be transplanted will be of higher quality. An implantation scheme will then be worked out for the recipient site, which will detail the angles, directions and distributions of the grafts at the recipient site. Finally, the hair grafts will then be implanted individually by hand to the recipient site by the hair specialist. Read more about FUE from ehaclinic.",
          ],
          th: [
            "ขั้นแรกบริเวณสำหรับที่ต้องสกัดเซลล์นั้นจะถูกโกนให้สั้นโดยการใช้มีดโกน เพื่อมั่นใจว่าทุกออย่างสะอาดและปลอดเชื้อ และถูกทำความสะอาดโดยใช้น้ำยาฆ่าเชื้อ แต่ต้องบอกก่อนว่าในกระบวนการนี้ไม่ค่อยจะสบายนักเนื่องจากบริเวณที่จะต้องสกัดสารสกัดจะถูกฉีดยาชาเฉพาะที่ และใช้ปากกาสำหรับการปลูกผมโดยเฉพาะในการสกัดในแต่ละรู เนื้อเยื่อของผมนั้นจะถูกเก็บไว้ในกระบวนการที่ช่วยคงสภาพ",
            "เนื้อเยื่อของผมจะถูกส่องโดยกล้องจุลทรรศน์เพื่อให้แน่ใจว่าจะเป็นเนื้อเยื่อที่เหมาะสมในการปลูกถ่าย ในกระบวนการนี้จะเพิ่มโอกาสสำหรับเนื้อเยื่อที่มีคุณภาพเมื่อถูกปลูกลงในบริเวณที่ผมร่วง ในการปลูกฝังจะสามารถรู้รายระเอียดได้ถึงมุม ทิศทาง และการกระจายของเนื้อเยื่อบนพื้นที่ ขั้นตอนสุดท้ายเนื้อเยื่อจะถูกฝังในแต่ละชิ้นด้วยมือลงบนบริเวณที่ผมร่วงโดยผู้เชี่ยวชาญ อ่านข้อมูลเพิ่มเติมเกี่ยวกับการปลูกผมแบบ FUE ได้ที่ ehaclinic",
          ],
        },
      },
      {
        heading: { en: "What is FUT hair transplantation?", th: "การปลูกผมแบบ FUT คืออะไร?" },
        image: { src: futTransplant, alt: "FUT HAIR TRANSPLANT" },
        paragraphs: {
          en: [
            "Follicular Unit Transplantation (FUT) is also known as strip harvesting. The FUT process involves the removal of a small strip of tissue from the back of your head. With this strip of tissue, the donor hair follicles will be extracted. They hair follicles are then individually transplanted to the recipient areas. FUT is usually the preferred method in cases involving advanced hair loss as it will allow the physician to fully use the scalp area to deliver consistent results. This procedure also typically allows the greatest number of grafts to be transplanted per session.",
            "The grafts will then be inspected under a high powered microscope to make sure that they are ideal for transplantation. This process will increase the chances of survival of the grafts once they are transplanted to the recipient site as the ones chosen to be transplanted will be of higher quality. An implantation scheme will then be worked out for the recipient site, which will detail the angles, directions and distributions of the grafts at the recipient site. Finally, the hair grafts will then be implanted individually by hand to the recipient site by the hair specialist. You may also find out more about it from zieringmedical and crownclinic.",
          ],
          th: [
            "Follicular Unit Transplantation (FUT) เป็นที่รู้จักกันดีในชื่อ Strip Harvest Technique โดยจะตัดชิ้นเนื้อจากด้านหลังของศีรษะของคุณ และจะสกัดรูขุมขนเส้นผมจากชิ้นเนื้อนั้น รูขุมขนเส้นผมจะถูกปลูกทีละรูลงบนพื้นที่ที่ผมร่วง การปลูกผมแบบ FUT จะเป็นวิธีถูกเลือกมากสำหรับผู้ที่มีผมร่วงอย่างรุนแรง โดยหมอจะทำให้บริเวณหนังศีรษะมีผลลัพธ์อย่างน่าพอใจ ในขั้นตอนนี้ชิ้นเนื้อเยื่อจำนวนมากจะถูกปลูกในการเข้ารับการรักษาในแต่ละครั้ง",
            "เนื้อเยื่อจะถูกส่องโดยกล้องจุลทรรศน์เพื่อให้มั่นใจว่าเป็นเนื้อเยื่อที่ดี ในกระบวกการนี้จะเป็นการเพิ่มโอกาสของเนื้อเยื่อที่มีคุณภาพดีในการปลูกถ่ายลงบนพื้นที่ที่ผมร่วง ซึ่งคุณสามารถรู้ได้ถึงมุม ทิศทาง การกระจายของเนื้อเยื่อบนพื้นที่ ขั้นตอนสุดท้ายเนื้อเยื่อของผมแต่ละชิ้นจะถูกฝังโดยใช้มือของผู้เชี่ยวชาญ คุณสามารถอ่านข้อมูลเพิ่มเติมได้ที่ zieringmedical และ crownclinic",
          ],
        },
      },
      {
        heading: { en: "What is the typical procedure of FUT hair transplantation?", th: "กระบวนการโดยทั่วๆไปของการปลูกผมแบบ FUT มีอะไรบ้าง" },
        paragraphs: {
          en: [
            "Firstly, the donor zone is identified and will be prepared for the process of harvesting of follicles. A strip of tissue will be removed from the donor zone and then dissected into follicular units of 1 to 4 hairs with the use of a scope. The recipient sites will then be created in the proper angle, direction and orientation to make sure that the final effect of the hair transplantation treatment is a natural one that you will be satisfied with. The harvested hair grafts will then be transplanted to the recipient sites individually. Throughout the treatment process, local anesthesia will be used to minimise any discomfort during the treatment. After the hair transplantation process, you will usually be able to head home almost immediately without spending more time at the treatment center. New hair will start to grow back in around three to four months, but it can take up to six to eight months for you to see a noticeable difference in your appearance.",
            "The grafts will then be inspected under a high powered microscope to make sure that they are ideal for transplantation. This process will increase the chances of survival of the grafts once they are transplanted to the recipient site as the ones chosen to be transplanted will be of higher quality. An implantation scheme will then be worked out for the recipient site, which will detail the angles, directions and distributions of the grafts at the recipient site. Finally, the hair grafts will then be implanted individually by hand to the recipient site by the hair specialist.",
          ],
          th: [],
        },
        list: {
          en: [],
          th: [
            "ตรวจหาพื้นที่หนังศีรษะที่จะนำมาสกัดรูขุมขนเส้นผม",
            "ชิ้นหนังศีรษะจากพื้นที่ตรวจจะถูกตัดออกและนำมาแบ่งเป็นเซลล์รากผม (Follicular Unit) โดยใช้กล้องจุลทรรศน์ แต่ละเซลล์รากผม (Follicular Unit) จะมีเส้นผม 1 ถึง 4 เส้น",
            "แนวการปลูกผมจะถูกทำขึ้นในมุมและลักษณะที่ทำให้ดูเป็นธรรมชาติและน่าพึงพอใจ",
            "ปลูกผมโดยนำเซลล์รากผมที่ถูกแบ่งออกมาทำการปลูกทีละรูขุมขน ระหว่างการทำการปลูกผมจะใช้ยาชาเพื่อช่วยลดอาการเจ็บ",
          ],
        },
        // TH paragraph must render AFTER the list (source order); EN has no such
        // paragraph. See ComparisonSubBlock.paragraphsAfterList.
        paragraphsAfterList: { en: [], th: ["หลังจากการปลูกผมเรียบร้อยแล้ว คุณจะสามารถกลับบ้านได้เลย ระยะเวลาโดยประมาณที่เส้นผมที่ปลูกใหม่จะเริ่มขึ้นคือ 3 ถึง 4 เดือน แต่อาจจะใช้ระยะเวลาประมาณ 6 ถึง 8 เดือนถึงจะเห็นความแตกต่าง"] },
      },
      {
        heading: { en: "FUE hair transplantation vs FUT hair transplantation", th: "ความแตกต่างระหว่าง FUE และ FUT" },
        image: { src: fueVsFut, alt: "FUE hair transplantation vs FUT hair transplantation" },
        paragraphs: { en: [], th: [] },
        list: {
          en: [
            "The main advantage of the FUT hair transplantation procedure is that it usually results in the highest yield of hair, which is essential if you are suffering from severe hair loss. This is attributed to reasons such as the precision of being able to dissect the individual follicles under a microscope and also the ability to harvest more selectively from a specific area of the donor zone. On the other hand, the main advantage of the FUE hair transplantation procedure is that it does not leave a linear donor scar and a shorter period of time required for the donor site to be completely healed. Hence, if you are looking for a shorter down time or will be self-conscious of a linear scar, FUE might be better for you.",
            "For both the FUE and FUT procedures, it is of upmost importance that high quality follicular unit grafts are harvested for transplantation to the recipient site to ensure that the results obtained from the treatment is maximized. The hair grafts that are of a high quality are obtained from the most permanent part of the donor area, and must be undamaged. The protective layer of tissue around the follicles should also remain intact. This protective layer of tissue reduces the chances of mechanical injury to the hair follicles when they are being inserted to the recipient area and from drying out when the hair grafts are outside of the body. In FUT, the donor strip is removed from the scalp, and via the use of dissecting microscopes, the follicular units are isolated from each other while ensuring that the protective layer remains intact and unbroken. Due to the precision allowed under the microscope, this process usually allows the extraction of high quality grafts, especially if the hair specialist conducting the dissecting procedure is highly skilled and trained in this area. In the FUE process, the hair specialist will extract follicular units from the donor area individually. Through this arduous process, there is a risk of cutting through the follicular units during harvesting as only the upper part of the follicle can be seen. Hence, the direction of the hair follicles that are below the surface of the skin can only at best be estimated, and are more likely to be damaged or stripped off the protective layer. Besides that, if the skin is not cut deep enough, the follicular unit might be extracted without the lower parts of the follicle, resulting in it being unable to survive the transplantation process. The presence of lower quality grafts can result in them being more fragile and growing less well than high quality grafts, hence compromising the effects of the hair transplantation treatment. However, it is also important to note that with the advent of Robotic FUE hair transplant technology, the overall quality of the follicular grafts that can be obtained via the FUE procedure is improved, hence reducing the quality of follicular grafts that can be obtained via the FUT procedure and the FUE procedure.",
            "Another difference between FUT and FUE is the proportion of follicular units that are being harvested from the middle of the donor zone. Follicular units from the middle of the donor area is usually more resistant to balding, while those that are obtained from the sides of the donor area are more likely to drop off as time passes. In FUT, the donor strip is removed from the middle of the permanent zone, while in FUE, the follicular units are obtained from a wider area to ensure that enough grafts are obtained for the transplant. Only one fifth of the follicles can be obtained from each area in FUE, and it is often the case where hair follicles are also harvested from the sides of the donor area. Hence, the follicular units transplanted in the FUE process might be lost to balding.",
            "In FUE, the small wounds that are incurred are left open to heal. The result of this is the presence of thousands of tiny scars that might not be visible to the human eye. However, these scars can have the effect of distorting the adjacent follicular units, which will make further sessions in the future more difficult. This then limits the donor supply that is available for the FUE procedure. In FUT, the scarring occurs in a single line due to linear strip removal from the donor site. This is a significant disadvantage for FUE, as a limited donor supply can prevent FUE from being a solution to complete hair restoration, especially if you are suffering from severe hair loss.",
            "In FUT, the donor strip is taken from the middle of the donor area. The edges of the wound are then sewn together. This then leaves a single, fine scar. This scar can be visible if you have very short hair, but can typically be covered by longer hair. If you repeat the FUT treatment again, the initial scar is removed when the subsequent donor strip is extracted. This means that you will only have one linear scar regardless of how many times you repeat the FUT procedure. On the other hand, for FUE, the tiny dotted scars from the procedure can be difficult to see even if you have short hair. Hence, FUE might be right for you if you are expecting to go with a shorter hairdo in the future and do not want a visible scar to be seen. However, if FUE treatments are repeated, the tiny scars will add on with each procedure done, which can have the effect of distorting the surrounding follicular units, making future sessions of treatment more difficult.",
            "While some patients claim that FUT comes with more discomfort compared to FUE due to the swelling that can sometimes occur in the area where the strip of tissue was removed, both methods are not significantly invasive and patients undergoing both have a relatively short recovery time. Pain medication can be prescribed for any discomfort that you might experience after the process. Both FUT and FUE hair transplantation are fairly simple procedures and you will be able to go back to your daily lives the next day after the procedure, ensuring minimal disruption to your daily schedule.",
            "Pricing is usually set on a per-graft basis. This allows you to only pay for what you need, and the final bill will be lower if your hair loss is less severe. Generally, the per-graft cost of FUT is lower than that of the FUE procedure, but this really depends on the quality of services that are provided by the clinics offering such procedures too. You may read more about FUE vs FUT hair transplant from bosley and bernsteinmedical.",
          ],
          th: [
            "ข้อได้เปรียบหลักของ FUT คือการทำวีธีนี้จะได้จำนวนเส้นผมใหม่มากที่สุดและมันจำเป็นมากสำหรับผู้ที่ผมร่วงมาก เหตุผลที่ทำให้ได้เส้นผมมากเป็นเพราะวีธีนี้สามารถนำหนังศีรษะที่ตัดออกมาส่องใต้กล้องจุลทรรศน์และคัดเลือกเซลล์รากผมทีละรู สำหรับ FUE นั้น ข้อได้เปรียบคือ ขั้นตอนการปลูกผมจะไม่จำเป็นต้องตัดหนังศีรษะส่วนที่จะนำมาปลูกจึงทำให้ไม่เป็นรอยแผลเป็น และระยะเวลาที่ใช้ในการฟื้นตัวของส่วนที่นำเซลล์ผมมานั้นน้อยกว่า เพราะฉะนั้นถ้าคุณกำลังมองหาวีธีที่ใช้เวลาพักฟื้นน้อยหรือกังวลเรื่องแผลเป็น FUE อาจเป็นตัวเลือกที่เหมาะสมกว่า",
            "สำหรับวิธี FUE และ FUT คุณภาพของเซลล์รากผมนั้นสำคัญมากเพื่อคุณภาพของการปลูกถ่าย เซลล์รากผมที่ถูกคัดมาเพื่อปลูกถ่ายจะต้องไม่ได้รับความเสียหายจากการสกัดออก เนื้อเยื่อหุ้มเซลล์รากผมจะยังคงต้องมีอยู่ด้วยกับเซลล์รากผมเพราะเนื้อเยื่อเหล่านี้จะช่วยลดโอกาสที่เซลล์รากผมจะรับความเสียหายระหว่างขั้นตอนการปลูกถ่ายและข่วยให้เซลล์รากผมไม่ตายเมื่อนำออกมาจากศีรษะแล้ว ในการทำ FUT หนังศีรษะที่ถูกตัดออกจะถูกนำมาคัดเป็นเซลล์รากผมโดยใช้กล้องจุลทรรศน์เพื่อให้ได้เซลล์รากผมคุณภาพสูงสุด ใน FUE หนังศีรษะจะไม่ถูกตัดออกเหมือนกับใน FUT เพราะการคัดเซลล์รากผมนั้นจะทำทีละเซลล์โดยทำจากหนังศีรษะโดยตรง แต่ในการทำ FUE จะมีโอกาสที่เซลล์รากผมจะได้รับความเสียหายเนื่องจากการทำวิธีนี้จะสามารถเห็นได้แค่ส่วนบนของเซลล์ เซลล์รากผมอาจจะถูกตัดออกไม่ครบทุกส่วนโดยขาดส่วนที่ลึกสุดถ้าผู้เชี่ยวชาญไม่ตัดเข้าหนังศีรษะลึกพอและจะทำให้เซลล์นั้นตายหลังการปลูกถ่าย ปัจจุบันการทำ FUE มีการใช้ Robotic FUE Hair Transplant Technology เพื่อช่วยเพิ่มประสิทธิภาพของการสกัดเซลล์รากผมจึงทำให้คุณภาพของเซลล์ที่สกัดออกมานั้นเพิ่มขึ้น",
            "อีกข้อแตกต่างระหว่าง FUT และ FUE คือจำนวนเซลล์รากผมที่ถูกคัดจากตรงกลางของหนังศีรษะที่เป็น Donor zone ปกติแล้วเซลล์รากผมที่อยู่ตรงกลางของ Donor zone จะไม่ร่วงแต่เซลล์บริเวณรอบๆของตรงกลางจะมีโอกาสร่วงและทำให้หัวล้าน ใน FUT หนังศีรษะที่ถูกตัดออกคือตรงกลางส่วนที่มีเซลล์ผมแข็งแรงแต่ใน FUE เซลล์รากผมจะถูกคัดมาจากหลายๆจุดเพื่อที่ให้ได้เซลล์รากผมเพียงพอต่อการปลูกถ่าย ในแต่ละจุดจะสามารถคัดเซลล์รากผมได้เพียงแค่ 1 ใน 5 ของเซลล์รากผมทั้งหมด และการคัดเซลล์รากผมตามตำแหน่งเหล่านี้มีโอกาสสูงที่เซลล์ไม่ได้อยู่ตรงกลางของ Donor zone จึงทำให้ผมอาจร่วงและกลับมาหัวล้าน",
            "ใน FUE แผลที่เกิดจากการคัดเซลล์รากผมอาจเป็นปัญหาตามมาเนื่องจากแผลเหล่านี้มีผลกระทบต่อเซลล์รากผมที่อยู่ใกล้เคียงทำให้การปลูกถ่ายในครั้งถัดๆไปมีปริมาณเซลล์ที่สามารถนำมาปลูกถ่ายได้นั้นลดลง การทำ FUT จะทำโดยการตัดหนังศีรษะออกโดยเป็นแผลเส้นตรงเท่านั้น",
            "ใน FUT หลังจากตัดหนังศีรษะออก การทำแผลคือจะเย็บปากแผลเข้าหากันโดยทำให้มีบาดแผลยาวหนึ่งบาดแผล บาดแผลนี้จะมองเห็นได้ชัดเมื่อผมสั้น แต่เมื่อพอไว้ผมยาวจะสังเกตเห็นได้ยากขึ้น และถ้าจำเป็นจะต้องทำ FUT ใหม่ หนังศีรษะจะถูกตัดออกจากแผลเป็นเดิมทำให้มีแผลเป็นที่เดียวไม่ว่าจะทำ FUT อีกกี่ครั้ง แต่ถ้าแผลเป็นจะเป็นปัญหาเพราะว่าคุณจะไว้ผมสั้น FUE อาจเป็นทางเลือกที่เหมาะสมกว่า คุณอาจจะต้องคำนึงถึงผลเสียของรอยแผลเป็นเล็กๆที่มีอยู่หลายบริเวณซึ่งอาจะทำให้การทำ FUE ในอนาคตเป็นไปได้ยากขึ้น",
            "บางคนอาจบอกว่าการทำ FUT จะทำให้เจ็บกว่าการทำ FUE เนื่องจากอาการบวมของหนังศีรษะที่ถูกตัดออก แต่ในความเป็นจริงแล้ว การปลูกถ่ายผมทั้งสองแบบนั้นไม่ได้ทำให้คนที่ทำการปลูกถ่ายมีชีวิตที่แตกต่างจากเดิมเนื่องจากแผลที่ได้รับจากการปลูกถ่ายใช้เวลาพักฟื้นไม่นาน ยาแก้ปวดที่ให้หลังจากการผ่าตัดสามารถช่วยเรื่องอาการเจ็บปวดได้ ผู้ที่ผ่านการทำการปลูกถ่ายสามารถกลับไปดำเนินชีวิตประจำวันได้ตามปกติหลังวันที่ทำการปลูกถ่าย",
            "ค่าใช้จ่ายส่วนใหญ่จะคิดเป็นต่อเซลล์รากผม ซึ่งแปลว่าถ้าผู้ที่ต้องการปลูกถ่ายเส้นผมไม่ได้ผมร่วงมากหรือหัวล้าน ราคาจะไม่เท่ากันกับผู้ที่หัวล้าน และส่วนใหญ่ราคาต่อเซลล์รากผมของ FUT จะถูกกว่า FUE แต่อาจขึ้นอยู่กับแต่ละคลินิค คุณสามารถอ่านเพิ่มเติมเกี่ยวความแตกต่างระหว่าง FUE และ FUT ได้ที่ bosley และ bernsteinmedical",
          ],
        },
      },
      {
        heading: { en: "Can you have both FUT and FUE done on you?", th: "ทำ FUT และ FUE ควบคู่กันได้หรือไม่" },
        paragraphs: {
          en: [
            "Both procedures can be carried out on the same person. FUT can be used to maximize the yield the very first time you are getting a hair transplant, and you can then switch to FUE for future sessions when fewer follicular units are required to be harvested. If you decide to opt for FUE first, and the yield of follicular units that can be harvested is insufficient to completely treat your hair loss problems, you can also then switch to FUT instead in the future.",
          ],
          th: [
            "กระบวนการทั้งสองแบบสามารถทำได้ในคนเดียว FUT สามารถเป็นทางเลือกแรกของผู้ปลูกถ่ายที่ต้องการเซลล์รากผมปริมาณมาก และในอนาคต เมื่อความต้องการจำนวนเซลล์ลดลง ผู้ปลูกถ่ายสามารถเปลี่ยนไปใช้วิธี FUE ได้ ในขณะเดียวกัน ถ้าผู้ปลูกถ่ายเลือกที่จะใช้วิธี FUE ก่อนแต่จำนวนเซลล์รากผมที่ได้นั้นไม่เพียงพอสำหรับการรักษาอาการหัวล้าน ผู้ปลูกสามารถเปลี่ยนไปใช้ FUT ได้",
          ],
        },
      },
      {
        heading: { en: "Why people try FUE FUT Hair Transplant", th: "ทำไมคนถึงลองใช้วิธี FUE" },
        paragraphs: { en: [], th: [] },
        list: {
          en: [
            "Since FUE involves the removal of follicular units individually, this method of harvesting of follicular units is minimally invasive. It usually only requires the use of small circular punches with a diameter of 1mm to remove the individual follicular units from the donor site, which will then be transplanted onto the recipient site.",
            "When done by a skilled hair specialist, the result can be a natural looking hairline, thick hair density and minimal scarring.",
            "The process can be extremely precise as the follicular units are implanted individually by hand.",
            "There is minimal trauma incurred to the donor site since the follicular units are extracted individually, and also decreased wastage of the grafts that are harvested as a precise number can be harvested depending on the specific numbers required for the specific treatment.",
            "Should the follicles in the donor site be insufficient, the treatment is flexible enough to allow the use of grafts from other parts of the body to achieve the same results from the treatment process.",
            "Enjoy an increase in your hair density via this treatment method, as when the grafts are being replanted into your scalp, the hair specialist will be able to tailor the positioning of each graft to make sure that the match the natural angles of hair growth of the surrounding hairs. This prevents a potentially unnatural look that can be caused when grafts are planted too close to each other or too close to existing hair.",
            "Since the donor and recipient areas are numbed with the use of local anesthesia, you will experience minimal discomfort throughout the entire FUE hair transplantation process.",
            "If you are a busy working adult, time is extremely important to you, and you will be glad to know that the down time for this treatment is a reasonable one that will not put you away from your daily routine for too long. Some patients are able to return to their daily schedules even within a short period of 1 to 2 days after the FUE hair transplantation procedure.",
          ],
          th: [
            "FUE ไม่ทำการรบกวนชีวิตประจำวันของผู้ปลูกถ่ายเพราะ FUE ใช้วิธีการคัดเซลล์รากผมทีละเซลล์ การคัดเซลล์จะใช้เครื่องมือที่มีลักษณะคล้ายเข็มฉีดยา แต่บริเวณปลายอุปกรณ์จะไม่แหลมคม มีเส้นผ่าศูนย์กลาง 1 มิลลิเมตรเพื่อคัดเซลล์จาก donor zone",
            "เมื่อทำโดยผู้เชี่ยวชาญ ผลที่ได้รับคือความเป็นธรรมชาติ ความหนาแน่นของผม ละรอยแผลเป็นจำนวนน้อย",
            "วิธีการปลูกถ่ายมีความแม่นยำเพราะทำทีละเซลล์ โดยใช้มือ",
            "ความเสียหายที่เกิดขึ้นบน donor zone จะน้อยที่สุดเพราะการคัดเซลล์รากผมจะถูกคัดทีละเซลล์ และจำนวนเซลล์ที่ถูกคัดจะไม่ถูกใช้ทิ้งขว้างเนื่องจากจำนวนที่คัดออกเป็นไปตามจำนวนที่ต้องใช้ในการปลูกถ่าย",
            "ถ้าจำนวนเซลล์รากจาก donor zone ไม่เพียงพอ สามารถนำเซลล์รากจากส่วนอื่นของร่างกายมาใช้ทดแทนได้",
            "ผมจะดูหนาขึ้นเพราะการปลูกถ่ายสามารถกำหนดมุมและลักษณะที่ผมจะขึ้นเพื่อให้ดูเป็นธรรมชาติมากที่สุด",
            "ยาชาจะถูกฉีดขณะที่คัดเซลล์รากผมเพื่อลดอาการเจ็บปวดของผู้ปลูกถ่าย",
            "วิธีปลูกถ่าย FUE นั้นใช้เวลาพักฟื้นน้อย ฉะนั้นผู้ปลูกถ่ายไม่จำเป็นต้องกังวลเรื่องเวลาพักฟื้น เวลาพักฟื้นอาจใช้เพียงหนึ่งถึงสองวันหลังปลูกถ่ายเสร็จ",
          ],
        },
      },
      {
        heading: { en: "Side effects of FUE FUT Hair Transplant", th: "ผลข้างเคียงของ FUE และ FUT" },
        paragraphs: { en: [], th: [] },
        list: {
          en: [
            "The need for an experienced hair specialist: Since the FUE hair transplantation procedure is highly technical, the success of the procedure depends significantly on the skill of the person who is performing the procedure. Such skilled persons can be hard to come by, or charge significantly higher rates for their services. Many private companies who promote FUE devices are more interested in making money and higher profits than anything else, and hence might compromise on the safety of the treatment as well as the quality of treatment. There are also instances where licensed physicians hire out their job to those who are unlicensed and not qualified to conduct such treatment procedures. The outcomes of such treatment can be devastating. In light of this, there is a need for you to be extra careful when getting such a procedure done and ask if the surgeon will be involved at all a stages of the surgery. When the rates offered are discounted and too affordable, it is usually for a reason, which might not necessarily be a good one.",
            "Experience is an important part of being able to perform a natural transplantation using the FUE method, so even if the hair specialist is certified as being able to perform such treatments, if he lacks experience with such procedures, the final effect of the treatment might be less than ideal, and you might not be able to get the natural effect that you hoped for and paid good money to get.",
            "The process does not end with the hair transplant, and a full medical treatment programme has to be followed after the actual transplantation itself for the best results, This medical programme is required to halt or slow down the progression of hair loss to allow you to maintain your hairline. Usually, this will involve the topical use of Minoxidil two times a day, a DHT blocker, or laser light therapy. Consistent efforts still have to be put in to make sure that the FUE hair transplantation procedure does not go to waste and the same hair loss and receding hair line cycle does not repeat itself again.",
            "There are multiple risks that comes with the procedure of FUE hair transplantation. This includes bleeding, infection, itching, pain, poor wound healing, swelling, haemorrhage and the possible need for revision surgery if the first one does not go well.",
            "This treatment option is also not suitable for everyone, such as those with bleeding or blood clotting disorders, are on blood thinning medication, are suffering from an active bacterial or viral infection, are suffering from skin conditions or have other systemic conditions such as diabetes or poor wound healing. If you fall under any of these categories, FUE hair transplantation is definitely not an option that is available for you.",
            "Because of the high level of expertise required for quality FUE hair transplantations, this is usually a costlier procedure if you want to get a quality job done.",
          ],
          th: [
            "การปลูกถ่ายจำเป็นต้องใช้ผู้เชี่ยวชาญเพราะการปลูกถ่ายจะสำเร็จและดูเป็นธรรมชาติขึ้นอยู่กับความสามารถของผู้เชี่ยวชาญ ผู้ปลูกถ่ายต้องใช้วิจารณญาณในการเลือกคลินิค ซึ่งอาจประเมินตามราคาและอื่นๆ อย่างเช่นถ้าราคาไม่สมเหตุสมผล อาจมีเหตุผลที่ไม่ดีแอบแฝงอยู่ ผู้ปลูกถ่ายจำเป็นจะต้องระวังเป็นอย่างมาก",
            "ประสบการณ์ของผู้เชี่ยวชาญสำคัญมากในการปลูกถ่าย การมีใบรับรองความสามารถในการปลูกถ่ายไม่จำเป็นต้องเป็นสิ่งบอกถึงความสวยงามและหรือความเป็นธรรมชาติของเส้นผมที่ผู้ปลูกถ่ายจะได้รับ",
            "หลังจากการปลูกถ่าย ผู้ปลูกถ่ายจะต้องผ่านอีกหลายขั้นตอนเพื่อให้การปลูกถ่ายมีประสิทธิภาพสูงสุดและป้องกันอาการผมร่วงกลับมาเช่น การใช้ Minoxidil สองครั้งต่อหนึ่งวัน หรือ การฉายแสงเลเซอร์ (laser light therapy)",
            "ผู้ปลูกถ่ายมีความเสี่ยงต่อการเลือดออก ติดเชื้อ คัน ปวด แผลหายช้า บวม เลือดคั่ง อาจจำเป็นต้องปรึกษาแพทย์ผู้เชี่ยวชาญ",
            "การปลูกถ่ายไม่เหมาะสำหรับผู้ป่วยที่มีปัญหาเกี่ยวกับการเลือดออก เลือดคั่ง หรือกำลังรับประทานยาเจือจางเลือด ผู้ที่กำลังติดเชื้อแบคทีเรีย หรือมีปัญหาทางด้านผิวหนัง ผู้ที่เป็นเบาหวาน และผู้ที่บาดแผลหายช้า",
            "การปลูกปลูกถ่ายแบบ FUE อาจมีราคาสูงเพราะจำเป็นต้องใช้ผู้เชี่ยวชาญที่มีความสามารถสูง",
          ],
        },
      },
    ],
  },
  {
    id: "smp",
    heading: { en: "4. Scalp Micropigmentation", th: "4. การสักไรผม/การสักหัวล้าน" },
    topImage: { src: smpTop, alt: "What is scalp micropigmentation?" },
    blocks: [
      {
        heading: { en: "What is scalp micropigmentation?", th: "สักไรผม/สักหัวล้าน คืออะไร?" },
        paragraphs: {
          en: [
            "Scalp micropigmentation (SMP) is a process where microneedles are used to deposit coloured pigment into the scalp. This will then create the effect of hair follicles that will give the illusion of a full head of hair. The pigments will replicate the look of natural hair follicles, hence creating more density to the areas that are thinning out.",
            "It can be used not simply to treat balding problems and recession of the hairline, but also for burn or surgery related hair loss. It can also be used to cover any scars, blemishes or birthmarks that are on your scalp that you want to conceal.",
            "The SMP treatment involves the matching of the colour of the pigments used on a gray scale and hence can be used to treat those of varying skin tones—from those who are extremely pale to those who have darker skin tones. There are also pigments of different colours available, making it possible to treat those with red or grey hair.",
            "While SMP is a treatment that seems to be more suited for men, women can also benefit from this treatment. While men undergo this treatment to replace shaven hair follicles, women can use this treatment as a way to decrease any contrast between the scalp and hair. Shaving is also not required before the treatment sessions, and instead, the hair specialist will apply the pigments with the microneedles by parting the hair in sections.",
            "The scalp will then be shaded to a darker colour, making it harder to see any difference in colour between the hair and the scalp. This then gives the illusion of a thicker and healthier head of hair. It is important to note though, that SMP works more for those with dark hair, and is not that effective if you have light coloured hair.",
            "Typically, natural hair on the scalp has a diameter of 77 micrometers. SMP dots that are made on the scalp usually vary from 90 to 150 micrometers. While this is thicker than natural hair, it is almost indistinguishable from your natural hair follicles when you are viewing it from a distance. You may read more from hishairclinic.",
          ],
          th: [
            "การสักไรผม หรือ สักหัวล้าน (SMP) เป็นวิธีการใช้เข็มอันเล็กๆฉีดสีเข้าไปในหนังศีรษะ สีเหล่านี้จะทำให้ดูเหมือนศีรษะมีผมขึ้นหนาแน่นและดูเป็นธรรมชาติ",
            "วิธีการสักนี้ไม่ได้ใช้แค่สำหรับคนหัวล้าน แต่สามารถใช้กับแผลไฟไหม้ แผลเป็น หรือ รอยต่างๆที่ผู้สักต้องการปิดบัง",
            "การสักไรผม หรือ สักหัวล้าน ใช้ระบบสีเทาต่างระดับความเข้ม (gray scale) เพื่อโทนสีที่เหมาะสมกับผู้สัก การสักจึงสามารถทำได้ในผู้สักที่มีสีผิวแตกต่างกัน จากผู้ที่มีผิวขาวจนถึงผู้ที่มีผิวคล้ำ นอกเหนือจากสีเทาแล้ว การสักยังสามารถใช้สีต่างๆเผื่อให้ตรงกับสีผมของผู้สัก",
            "การสักไรผม หรือ สักหัวล้าน อาจดูเหมาะสำหรับผู้สักเพศชายมากกว่าเพศหญิง แต่ผู้สักเพศหญิงก็สามารถสักได้เช่นกัน ผู้สักเพศชายมักสักหัวล้านเพื่อนำรอยสักมาแทนที่รูขุมขนเส้นผมที่ถูกโกน ส่วนผู้สักเพศหญิงมักสักเพื่อลดความแตกต่างระหว่างสีผมละสีหนังศีรษะ การสักหัวล้านนั้นไม่จำเป็นจะต้องโกนศีรษะก่อนทำการสัก ผู้เชี่ยวชาญจะใช้เข็มอันเล็กเพื่อทำการสักเอง",
            "หลัง การสักไรผม หรือ สักหัวล้าน หนังศีรษะจะดูเข้มขึ้น ทำให้ความแตกต่างของสีผมและหนังศีรษะลดลงและทำให้ดูเหมือนว่าศีรษะของผู้สักนั้นมีผมหนาและดูสุขภาพดี การสักมีข้อแม้ว่าถ้าคุณมีเส้นผมสีอ่อน การสักอาจไม่ช่วยให้คุณดูมีเส้นผมหนาถึบและสุขถาพศีรษะดีเท่าผู้สักที่มีเส้นผมสีเข้ม",
            "ตามกปกติแล้ว เส้นผมบนหนังศีรษะมีเส้นผ่าศูนย์กลาง 77 ไมโครเมตร การสักแต่ละรอยจะมีเส้นผ่าศูนย์กลางจุดละ 90 ถึง 150 ไมโครเมตร นี่อาจดูเหมือนว่าความแตกต่างของขนาดเส้นผ่าศูนย์กลางของเส้นผมปกติและรอยจุดการสักนั้นเยอะ แต่ถ้าหากคุณมองศีรษะของผู้สักจากไกลๆ คุณจะแทบไม่สามารถเห็นความแตกต่างของรอยสักและรูขุมขนเส้นผมได้เลย คุณสามารถอ่านเพิ่มเติมได้ที่ hishairclinic",
          ],
        },
      },
      {
        heading: { en: "What is the process of scalp micropigmentation?", th: "การสักไรผม หรือ สักหัวล้าน มีวีธีการอย่างไร?" },
        paragraphs: {
          en: [
            "The treatment process of SMP is typically divided into three parts. However, the actual duration of the entire course of the treatment is dependent on the extent of hair loss and the style that you are looking to achieve. Before the whole treatment process kicks in, the hair specialist will discuss the treatment and what you want to achieve with you. During the actual treatment process, a small wound is created in the skin when the microneedle deposits the pigment. A scab will then heal over the wound and fall off.",
            "This takes some of the deposited pigment away. The immune system will kick in to attack the deposited pigments as they will be recognised as foreign material, resulting in them shrinking in size. The fading of the pigment that one will experience differs for each person, so you will need a different number of sessions to get the desired effect depending on how much fading you experience.",
            "The pigments that are used are typically combinations of metal oxides that will act to replicate the gray scale that most people seek. Beta carotene additives are used to get a pigment that will be suitable for those with red or lighter hair.",
            "In each treatment session, different shades of pigmentation will be applied. This is required as different shades of pigment are required to allow some of the pigment deposits to stand out. Typically, lighter pigments are applied in the earlier sessions, and darker pigments will be applied in the later stages of treatment. Each treatment session can last around 3 to 5 hours each.",
            "The discomfort that you will experience in the SMP treatment process is usually a mild one. Discomfort is more common in the earlier treatment sessions, and will become more tolerable as the session progresses and you get used to the sensation. Some areas of the scalp might be more sensitive than the rest, and hence you might experience different levels of discomfort when different parts of your scalp is being targeted. Ultimately, the discomfort is usually less than what you will experience if you choose to get a hair transplant. If the discomfort is too much to bear, you can also opt for anesthetics to be applied.",
            "After the treatment, there is no down time, ensuring that you will be able to go on with your day without any hindrance. However, you might experience some redness on the area that has been treated, which can last up to 48 hours. The usual time in between treatment sessions for SMP is seven days",
            "For the first few days post treatment, you should try to avoid any activity that will cause your scalp to become wet—such as sweating, shampooing or washing of your head. On the fourth day, you can opt to shave with a foil shaver, but take caution not to shave the areas where the scabs have not fallen off. By day 10, shaving of the treated areas can usually be done with a razor blade. SMP is a semi-permanent solution, and will usually last around four to six years before the pigments fade.",
            "When that happens, you will need to go for another round of SMP treatment to correct your hair problems again. To make sure that the SMP treatment lasts for a long time, make sure to stay healthy and keep a strong immune system. Also, make sure to stay away from the sun to minimise the fading of the pigments on your scalp. If you need more touch ups, you will be glad to know that the cost of these touch ups are usually cheaper than the cost of a full treatment that you will need at the start. Read more about it from smpdebate and baldingbeards.",
          ],
          th: [
            "การสักไรผม หรือ สักหัวล้าน (SMP) นั้นโดยส่วนใหญ่แบ่งออกเป็นสามส่วน แต่ระยะเวลาที่ใช้ในการทำการสักนั้นขึ้นอยู่กับความต้องการและความรุนแรงของอาการผมร่วง ก่อนเริ่มการทำการสัก ผู้เชี่ยวชาญจะทำการสอบถามความต้องการของคุณและบอกรายละเอียดของขั้นตอนต่างๆของการสัก",
            "ระหว่างการสักจะมีการทำให้หนังศีรษะตรงที่จะสักเป็นแผลเล็กๆเพื่อใส่สารให้สีเข้าไปในบาดแผลนั้น บาดแผลนี้จะตกสะเก็ดและร่วงพร้อมกับสารให้สีที่ใส่เข้าไปในเบื่องต้น ระบบภูมิคุ้มกันของร่างกายจะทำการต่อต้านสิ่งแปลกปลอมซึ่งคือสารให้สีที่ใส่เข้าไปในบาดแผล และนี่จะทำให้จุดรอยสักเล็กลง การจางลงของสีที่ใส่เข้าไปอาจมีความไม่เท่ากันในแต่ละคน ฉะนั้นจำนวนครั้งของการสักจะไม่เท่ากันเช่นกันและขึ้นอยู่กับความจางลงของสี",
            "สารให้สีนั้นโดยปกติแล้วจะมีส่วนผสมจากหลาย metal oxides ซึ่งจะทำให้ดูเป็นสีเทาต่างระดับความเข้มที่หลายคนตามหา เบต้าแคโรทีนจะถูกนำมาใช้เพื่อให้ได้สีที่เหมาะสำหรับผู้ที่มีผมสีแดงและสีอ่อน",
            "ในแต่ละรอบของการสัก สารให้สีที่ใช้จะมีหลายอย่างเพื่อสีที่แตกต่างละทำให้สีบางสีมีความโดดเด่น ปกติแล้วลำดับการใช้สารให้สีจะใช้สีอ่อนก่อนและสีเข้มทีหลัง การทำการสักปกติแล้วจะใช้เวลาประมาณ 3 ถึง 5 ชั่วโมงในแต่ละรอบ",
            "ในการสักแต่ละครั้ง คุณอาจมีความรู้สึกเจ็บหรือไม่สบายตัวแต่ความรู้สึกเหล่านี้จะไม่มากเท่าการปลูกถ่ายเซลล์รากผม ในรอบแรกของการสักคุณอาจรู้สึกเจ็บมากที่สุด แต่ในครั้งถัดๆไปคุณจะรู้สึกชินไปเอง บางจุดของหนังศีรษะอาจไวต่อความเจ็บปวดมากกว่าส่วนอื่นฉะนั้นการสักในแต่ละจุดคุณจะรู้สึกความเจ็บปวดไม่เท่ากัน แต่ถ้าคุณรู้สึกเจ็บมากจนทนไม่ไหว คุณสามารถขอใช้ยาชาได้",
            "หลังจากการสัก คุณไม่จำเป็นต้องพักฟื้น คุณสามารถกลับไปดำเนินชีวิตตามปกติได้ แต่จุดที่คุณได้ทำการสักอาจเป็นรอยแดงนาน 48 ชั่วโมง การสักในแต่ละครั้งจะเว้นช่วงห่าง 7 วัน",
            "หลังจากได้ทำการสักในช่วงสองสามวันแรก คุณควรหลีกเลี่ยงการทำให้ศีรษะคุณเปียกด้วยวีธีต่างๆเช่น เหงื่อออก สระผม หรือ ล้างหัว ในวันที่สี่คุณสามารถใช้เครื่องโกนหนวดฟอยล์ (foil shaver) ในการโกน แต่ต้องระวังอย่าโกนศีรษะส่วนที่ตกสะเก็ดและยังไม่หลุด ในวันที่ 10 การโกนโดยทั่วไปสามารถใช้มีดโกนได้แล้ว การสัก (SMP) คือการแก้ปัญหากึ่งถาวรและจะคงอยู่ประมาณ 4 ถึง 6 ปีก่อนที่สีจะจางลง",
            "เมื่อสีจางลง คุณจะต้องไปทำการสักใหม่เพื่อแก้ปัญหาเดิม เพื่อให้การสักอยู่ได้นาน คุณจะต้องมีสุขภาพร่างกายแข็งแรงและภูมิคุ้มกันที่แข็งแรง คุณจะต้องพยายามหลีกเลี่ยงการตากแดดเพราะแดดจะทำให้สีจางลง ถ้าหากคุณต้องตาเติมแต่ง คุณจะรู้สึกดีที่ได้ทราบว่าค่าใช้จ่ายในการเติมแต่งจะถูกกว่าค่าใช้จ่ายถ้าทำการสักใหม่ทักหมด คุณสามารถอ่านเพิ่มเติมได้ที่ smpdebate และ baldingbeards",
          ],
        },
      },
      {
        heading: { en: "Why people try Scalp Micopigmentation", th: "ทำไมหลายคนถึงลอง การสักไรผม หรือ สักหัวล้าน" },
        paragraphs: { en: [], th: [] },
        list: {
          en: [
            "It is a semi-invasive form of treatment, unlike hair transplantation that will require some form of surgery being done and consequentially more down time for recovery.",
            "It is semi-permanent and lasts for years.",
            "Unlike hair transplantation options, it can be reversed and modified depending on what you need over the years.",
          ],
          th: [
            "ผลกระทบต่อชีวิตประจำวันน้อยกว่าการปลูกถ่ายเซลล์รากผมเพราะไม่ต้องทำการผ่าตัดและไม่ต้องพักฟื้น",
            "เป็นวิธีแก้ปัญหาแบบกึ่งถาวร สามารถอยู่ได้หลายปี",
            "สามารถแก้ไขเปลี่ยนแปลงหรือย้อนกลับได้ตามความต้องการ ไม่เหมือนการปลูกถ่ายเซลล์ผม",
          ],
        },
      },
      {
        heading: { en: "Side effects of Scalp Micopigmentation", th: "ผมข้างเคียงของการสักไรผม หรือ สักหัวล้าน" },
        paragraphs: { en: [], th: [] },
        list: {
          en: [
            "There can be irritation of the scalp as you are essentially creating many small scars on it using the microneedles when the pigment is being deposited. This can cause both redness and itchiness after every treatment session.",
            "The quality of the final effect of SMP treatments is heavily dependent on how skilled and experienced the hair specialist carrying out the treatment for you is. If the person is highly skilled, a natural effect can be obtained. However, if the person administering the procedure is not well skilled or trained, you can easily end up with something that you hate. Of course, practitioners with better skills typically also ask for higher rates, and getting a quality SMP treatment might be costly too.",
            "SMP is semi-permanent, which means that the hair pattern that you have will remain the same. Removing it will require a laser process.",
            "If you are someone who loves being in the sun, this treatment option might not be for you as prolonged exposure to the sun can increase the rate the pigmentation on your scalp fades. This will then mean that you will have to visit the treatment center for more touch ups over the years.",
            "Besides fading, prolonged exposure under the sun can also result in the pigmentations smearing. The pigmentations can also degrade, resulting in the altering of their chromophores and hence altering their colour. This can result in the pigmentation taking on an unappealing blue hue with time.",
            "SMP usually works well only for very short hairstyles where the micro-needled pigmentation can act as shaven hair. Hence, it is not usually a good option if you are looking for a longer hairdo.",
            "SMP essentially involves a microneedle being poked into the skin on your scalp multiple times, and hence, you might also experience pain and discomfort throughout the treatment process. Patients have reported experiencing pain across their temples and above their ears during the treatment process.",
          ],
          th: [
            "หนังศีรษะของคุณอาจมีอาการคันและแดงหลังการสักเนื่องจากบาดแผลอันเล็กๆที่ใช้เข็มเจาะเพื่อใส่วารให้สี",
            "คุณภาพของการสักนั้นขึ้นอยู่กับฝีมือและประสบการณ์ของผู้เชี่ยวชาญคนเดียวเท่านั้น ผู้เชี่ยวชาญที่ฝีมือดีอาจคิดราคาสูงและทำให้ค่าใช้จ่ายในการสักสูงเช่นกัน",
            "การสักไรผม หรือ สักหัวล้าน (SMP) เป็นทางออกแบบกึ่งถาวร ฉะนั้นรอยสักที่คุณได้รับจะอยู่คงทน ถ้าหากต้องการลบออกจะต้องใช้เลเซอร์",
            "ถ้าหากคุณเป็นคนชอบตากแดด คุณอาจไม่เหมาะสำหรับวีธีนี้เพราะการตากแดดจะทำให้สีจางไวขึ้น และทำให้คุณต้องกลับไปแก้ไขรอยสักใหม่หลายครั้ง",
            "นอกจากการจางแล้ว การตากแดดอาจทำให้เกิดปฏิกิริยาต่อสารให้สี ทำให้สีที่ได้เปลี่ยนหรือเพี้ยนไปจากเดิม",
            "การสักไรผม หรือ สักหัวล้านใช้เข็มอันเล็กแทงเข้าไปในหนังศีรษะหลายครั้ง คุณอาจรู้สึกเจ็บในคณะทำการสัก ผู้สักหลายคนเล่าว่ามีอาการปวดที่ขมับและเหนือหูในขณะที่ทำการสัก",
          ],
        },
      },
    ],
  },
];

export const CLINICS_WARNING: { heading: L; paragraphs: PL } = {
  heading: {
    en: "Clinics offering hair loss growth treatments including transplants in Thailand:",
    th: "คลินิคที่ให้บริการแก้ปัญหาผมร่วงที่รวมไปถึงการปลูกถ่ายเซลล์รากผมในประเทศไทย",
  },
  paragraphs: {
    en: [
      "There are many clinics that are offering these various hair treatments in Thailand. Some are better than the others, and making a wrong choice to go to an unprofessional place to get these treatments done can be a disastrous decision. While some treatment centers often offer special cheap prices for their treatment, this usually also means less quality treatment. When you are looking for something to be permanently done to your hair, you want to find a place that can do it well, as a botched up job can have severe and lasting side effects that will leave you in regrets.",
    ],
    th: [
      "มีคลินิคให้บริการแก้ปัญหาผมร่วงมากมายในประเทศไทย แต่ไม่ใช่ว่าทุกคลินิคจะดีเท่ากัน การเลือกให้ถูกที่จึงเป็นเรื่องสำคัญเพราะหากคุณเลือกผิดที่คุณอาจผิดหวังกับผลลัพธ์ที่ได้หลังจากการทำการรักษา เรื่องราคาเป็นปัจจัยสำคัญในการเลือกสถานที่ บางที่อาจมีราคาถูกแต่คุณภาพของการบริการลดลง การมองหาคลินิคที่ดีเพื่อรักษาปัญหาผมร่วงจึงเป็นสิ่งสำคัญเพราะบางขั้นตอนของการรักษามีผลถาวรและคุณคงไม่อยากเสียใจในภายหลัง",
    ],
  },
};

export const NATURAL_ALTERNATIVE: {
  heading: L;
  intro: PL;
  reputationLine: PL;
  processImage: { srcEn: ImageMetadata; srcTh: ImageMetadata; alt: L };
  closingIntro: PL;
  closingOutro: PL;
  benefitsHeading: L;
  benefits: PL;
  hardTruthsHeading: L;
  hardTruths: PL;
  videoHeading: L;
} = {
  heading: {
    en: "A Natural Alternative: Bee Choo Herbal Hair Treatment",
    th: "ทางเลือกทางธรรมชาติ บีชู เฮอร์บัล แฮร์ ทรีทเม้นท์",
  },
  intro: {
    en: [
      "If you are suffering from hair loss and other common hair problems and are looking for a place to get natural treatment for your hair problems, Bee Choo Herbal is the place to go! Bee Choo Herbal is the largest hair clinic specialising in the treatment of various hair issues, such as hair loss, dandruff and oily scalp. We have a large international outreach, with 20 in Singapore, 70 Malaysia and 200 across Asia Pacific.",
    ],
    th: [
      "หากคุณกำลังมีปัญหาผมร่วงหรือปัญหาอื่นๆเกี่ยวกับเส้นผมของคุณ และคุณกำลังมองหาสถานที่ทำการรักษาแบบธรรมชาติ เราขอแนะนำ บีชูเฮอร์บัล เราคือคลินิคที่มีความเชี่ยวชาญการแก้ปัญหาเกี่ยวกับเส้นผมเช่น ผมร่วง รังแค หรือ หนังศีรษะมัน เรามีสาขาในสิงคโปร์จำนวน 20 สาขา ในมาเลเซียจำนวน 70 สาขา และอีกกว่า 200 สาขาในภูมิภาคเอเชียแปซิฟิก",
    ],
  },
  reputationLine: {
    en: ["We are a reputable brand recognised by the Business Times newspaper in Singapore and have also won numerous awards from Singapore Agencies."],
    th: ["เราเป็นแบรนด์ที่มีชื่อเสียง ได้รับการยอมรับจากหนังสือพิมพ์ Business Times ของสิงคโปร์และชนะรางวัลมากมายจากตัวแทนของประเทศสิงคโปร์"],
  },
  processImage: {
    srcEn: treatmentProcessEn,
    srcTh: treatmentProcessTh,
    // ⚠ Composed — legacy source has empty alt on this image in both languages.
    alt: { en: "The Bee Choo Herbal treatment process, step by step", th: "ขั้นตอนการทำทรีทเม้นท์ของบีชู เฮอร์บัล" },
  },
  closingIntro: {
    en: [
      "If you are suffering from any of these hair problems, make sure to visit our clinics. We offer an all-natural, safe and effective herbal hair treatment that can solve your hair woes. The natural dye that is present in our treatment formula also helps to cover any white or grey hairs that you might have at the same time! The process of the treatment is simple and non-invasive.",
    ],
    th: [
      "หากคุณกำลังมีปัญหาเรื่องผมข้างต้น โปรดแวะมาที่คลินิคเรา เรามีทรีทเม้นท์จากธรรมชาติที่ปลอดภัยและเห็นผลและสามารถรักษาปัญหาเกี่ยวกับเส้นผมและหนังศีรษะได้ สีจากธรรมชาติในสูตรการรักษาของเราสามารถช่วยเรื่องผมขาวได้เช่นกัน วิธีการของเราเรียบง่าย",
    ],
  },
  closingOutro: {
    en: ["Bee Choo Herbal offers a simple yet effective and safe solution to your hair problems! Make sure to pay us a visit, and you will not be disappointed."],
    th: ["บีชู เฮอร์บัล ขอเสนอวิธีจัดการปัญหาของเส้นผมของคุณที่ปลอดภัยและเห็นผล แวะมาหาเราและเราจะไม่ทำให้คุณผิดหวัง"],
  },
  benefitsHeading: { en: "Benefits of Bee Choo Herbal Treatment", th: "ประโยชน์ของ บีชู เฮอร์บัล ทรีทเม้นท์" },
  benefits: {
    en: [
      "Solves various hair issues such as: hair loss, oily scalp, damaged hair, dandruff",
      "Covers white hair with a coppish dye",
      "Affordable and effective",
      "Reputable brand. Zero down time.",
      "Immediate / Quick results for white hair / oily scalp / dandruff scalp conditions",
      "Those in early stages of hair loss will recovery very quickly",
    ],
    th: [
      "แก้ปัญหาต่างๆของเส้นผมและหนังศีรษะเช่น ผมร่วง หนังศีรษะมัน ผมเสีย หรือรังแค",
      "ปิดผมขาวด้วยสีน้ำตาล",
      "ราคาเข้าถึงได้และเห็นผล",
      "เห็นผลทันทีเมื่อรักษาปัญหาผมขาว หนังศีรษะมัน และรังแค",
      "สำหรับคนที่มีปัญหาผมร่าวงในขั้นแรก อาการคุณจะดีขึ้นอย่างรวดเร็ว",
    ],
  },
  hardTruthsHeading: { en: "Hard Truths of Bee Choo Herbal Treatment", th: "ความจริงที่อาจทำร้ายจิตใจคนรับรู้ของ บีชู เฮอร์บัล ทรีทเม้นท์" },
  hardTruths: {
    en: [
      "Those particular about hair colour can't choose.",
      "Hair growth results aren't immediate. Scalp needs time to regain health and new hairs need time to grow.",
    ],
    th: ["คุณไม่สามารถเลือกสีผมได้", "เส้นผมของคุณจะไม่ยาวทันทีและหนังศีรษะอาจต้องใช้เวลาในการปรับสภาพ"],
  },
  videoHeading: {
    en: "Watch this video to get a better idea of Bee Choo Herbal treatment process",
    th: "ชมวิดีโอนี้แล้วคุณจะเข้าใจวิธีการของ บีชู เฮอร์บัล ทรีทเม้นท์ มากขึ้น",
  },
};

export const TRANSPLANT_VIDEO = { id: "1w5-bvdyq8k" };

export const TRANSPLANT_SEO = {
  title: {
    en: "Hair transplant vs stem cell vs keratin treatment vs natural herbal treatment - Bee Choo Herbal",
    th: "ทรีทเม้นท์สมุนไพร vs การปลูกผม - Bee Choo Herbal",
  },
  description: {
    // ⚠ Composed — neither language has a real Yoast meta description (verified null in source).
    en: "Comparing hair transplant, stem cell therapy, keratin treatment and scalp micropigmentation against Bee Choo Herbal's natural herbal hair treatment.",
    th: "เปรียบเทียบการปลูกผม สเต็มเซลล์บำบัด เคราตินทรีทเม้นท์ และการสักไรผม กับทรีทเม้นท์สมุนไพรจากธรรมชาติของบีชู เฮอร์บัล",
  },
};
