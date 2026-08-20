// src/data/reviews.ts
// Long-form testimonial content for the Reviews page. Extracted verbatim from the LIVE
// site (fetched directly — the TH page was edited just hours before this batch was
// built, 2026-08-20T06:57, so even the Phase-1 snapshot would have been stale here).
//
// EN and TH are NOT a translation pair — CLAUDE.md requires verbatim-per-language copy,
// and this page is the starkest example of that on the whole site: TH carries 14 named
// testimonials (10 shared with EN, 4 TH-only: Nap, Christabelle, Wirada, Pissamai), body
// text differs in length and wording throughout, and even shared people can carry a
// DIFFERENT video id per language (the Couple/Ja-and-Pop entry: EN plays BMJeoVDBW-U,
// TH plays eBNa1ghAzkY). `body`/`quote`/`videoId` are therefore all keyed per language
// and Partial — render loops must check the CURRENT language's key, not assume both exist.
//
// `concerns` are inferred from each testimonial's own heading/body (not invented) and
// double as the badge shown on its card — each badge links to the matching treatment
// page via src/data/treatments.ts, keyed on the same slugs.
//
// Gallery dates are stored as ISO strings and formatted per-language at render time
// (Buddhist calendar for TH) rather than hard-coded as two caption strings.
import type { ImageMetadata } from "astro";
import karen1 from "../assets/images/reviews/karen-1.jpeg";
import karen2 from "../assets/images/reviews/karen-2.jpeg";
import karen3 from "../assets/images/reviews/karen-3.jpeg";
import karen4 from "../assets/images/reviews/karen-4.jpeg";
import karen5 from "../assets/images/reviews/karen-5.jpeg";
import rachelScan from "../assets/images/reviews/rachel-scan.jpg";
import rachelBeforeAfter from "../assets/images/reviews/rachel-before-after.png";
import alannaBeforeAfter from "../assets/images/reviews/alanna-before-after.png";
import trixie1 from "../assets/images/reviews/trixie-1.jpeg";
import trixie2 from "../assets/images/reviews/trixie-2.jpeg";
import trixie3 from "../assets/images/reviews/trixie-3.jpeg";
import trixie4 from "../assets/images/reviews/trixie-4.jpeg";
import trixieScan from "../assets/images/reviews/trixie-scan.jpg";

export type Lang = "en" | "th";
type PL<T> = Partial<Record<Lang, T>>;

/** Matches the slugs in src/data/treatments.ts — badges link straight to the treatment page. */
export type Concern = "hair-loss" | "grey-hair" | "oily-scalp" | "dandruff" | "damaged-hair" | "bacterial-infection" | "postpartum";

export interface GalleryImage {
  src: ImageMetadata;
  /** Karen's gallery has no legacy alt text at all (both languages: alt=""), so hers is
   *  composed, not transcribed. Trixie's TH gallery has real dated Thai captions
   *  ("ภาพถ่ายเมื่อ 23 พฤษภาคม 2560") in the legacy source — used verbatim. */
  alt: PL<string>;
  /** ISO date, formatted per-language at render time. */
  date?: string;
}

export interface Review {
  slug: string;
  name: PL<string>;
  heading: PL<string>;
  concerns: Concern[];
  body: PL<string[]>;
  quote: PL<string[]>;
  videoId: PL<string>;
  gallery?: GalleryImage[];
  /** A single non-dated supporting image (hair/scalp scan), shown apart from the dated progress gallery. */
  scanImage?: { src: ImageMetadata; alt: PL<string> };
}

export const REVIEWS: Review[] = [
  {
    slug: "sugus",
    name: { en: "Sugus", th: "คุณซูกัส" },
    heading: {
      en: "Sugus - loving the natural colouring from bee choo herbal treatment",
      th: "คุณซูกัส – รักการย้อมผมด้วยผลิตภัณฑ์จากธรรมชาติเพื่อปกปิดผมขาว",
    },
    concerns: ["grey-hair"],
    body: {
      en: [
        "She really loves the natural colouring from our herbal treatment.",
        "She wanted a natural treatment to cover her white hairs. She finally found the exact solution she was looking for after trying Bee Choo Herbal treatment; not only did she find a solution to cover white and grey hairs, she also realize that her hair is getting thicker. She highly recommends Bee Choo Herbal treatment as it does no damaged to your hair and scalp because they use only natural ingredients.",
        "Check out how beautiful natural colouring and natural treatment can be, watch her testimony now!",
      ],
      th: [
        "เธอรักสีจากธรรมชาติที่เกิดจากการทำทรีทเม้นท์สมุนไพรของเรา เธอต้องการการรักษาแบบธรรมชาติเพื่อปกปิดผมขาวของเธอ และในที่สุดเธอก็ได้พบทางออกของปัญหานี้หลังจากได้ทดลองใช้บริการทรีทเม้นท์สมุนไพรที่บีชู เธอไม่เพียงแค่พบวิธีการปกปิดผมขาวของเธอเท่านั้น แต่เธอยังรู้สึกได้ว่าผมของเธอเริ่มหนาขึ้น เธอยังแนะนำจริงๆ อีกว่าสมุนไพรบีชูไม่ทำลายเส้นผมและหนังศีรษะของคุณ เพราะว่าพวกเขาใช้วัตถุดิบจากธรรมชาติเท่านั้น",
        "ตรวจดูวิธีการทำสีตามธรรมชาติที่สวยงามและการทรีทเม้นท์แบบธรรมชาติได้ที่วิดีโอของเธอ ตอนนี้",
      ],
    },
    quote: {},
    videoId: { en: "4NDshUrosxI", th: "4NDshUrosxI" },
  },
  {
    slug: "ja-and-pop",
    name: { en: "Ja and Pop", th: "คุณจาและคุณป๊อบ" },
    heading: {
      en: "Couple Testimonial - Overcoming Dandruff and Hair Loss Together",
      th: "คุณจาและคุณป๊อบ ปัญหาผมร่วงและรังแค",
    },
    concerns: ["dandruff", "hair-loss"],
    body: {
      en: [
        "This couple in Bangkok had both been having dandruff and hair loss issues for many years. They had tried various shampoos, treatments but to no avail. Finally, through an exhibition which Bee Choo held in Bangkok, Thailand, they decided to give Bee Choo Herbal Scalp Treatment a try.",
        "Immediately after their first treatment and after purchasing the anti-dandruff shampoo from Bee Choo, the itchiness and dandruff they had were no longer as severe.",
        "This video was taking on their 5th treatment as they want to let other people who might have the same issue as them know that help is here and it is affordable as well. Kudos to the lovely couple for sharing their testimony!",
      ],
      th: [
        "คุณจาและคุณป๊อบประสบปัญหาหนังศีรษะแห้งและอาการผมร่วง พวกเขาได้ให้ความไว้วางใจกับเราโดยได้มาทำทรีทเม้นท์เป็นครั้งที่ 5 แล้ว",
        "พวกเขายืนยันว่าการทำทรีทเม้นท์รักษาผมร่วงของบีชูสามารถช่วยลดอาการผมร่วงได้เป็นอย่างดีเมื่อใช้ผลิตภัณฑ์ของบีชูควบคู่ไปกับการทำทรีทเม้นท์",
        "ทรีทเม้นท์ของบีชูยังสามารถทำให้หนังศีรษะชุ่มชื้น หายจากการมีหนังศีรษะแห้งและส่งผลให้หายจากการมีรังแค",
        "คุณป๊อบยังบอกอีกด้วยว่าความรู้สึกดีที่มีหลังจากกลับมามีหนังศีรษะสุขภาพดีนั้นอธิบายไม่ได้ หากไม่ได้มาลองทำทรีทเม้นท์กับบีชูด้วยตัวเองแล้วจะไม่รู้เลยว่าความรู้สึกนี้เป็นอย่างไร",
      ],
    },
    quote: {},
    // Different clips on each language page — see file header.
    videoId: { en: "BMJeoVDBW-U", th: "eBNa1ghAzkY" },
  },
  {
    slug: "suvincha",
    name: { en: "Suvincha", th: "คุณสุวิณชา" },
    heading: {
      en: "Suvincha - reduction in hair fall after first treatment",
      th: "คุณสุวิณชา - ลดผมร่วงตั้งแต่การทำทรีทเม้นท์ครั้งแรก",
    },
    concerns: ["hair-loss"],
    body: {
      en: [
        "Suvincha had been seeing an increase in hair fall recently, worried about her condition, she decided to try out Bee Choo's herbal hair treatment. Just after her first's herbal treatment, she notice that the amount of hair fall had lessen and was compelled to come back for more treatments as she feels that her hair and scalp is much comfortable and healthier after herbal treatment.",
      ],
      th: [
        "คุณสุวิณชาได้สังเกตเห็นปริมาณผมร่วงที่มากขึ้น จึงเกิดความกังวลใจ เลยตัดสินใจมาทดลองทรีทเม้นท์สมุนไพรกับ บีชู หลังจากทำทรีทเม้นท์ครั้งแรก คุณสุวิณชาได้สังเกตว่าปริมาณของผมหลุดร่วงนั้นมีจำนวนที่น้อยลง และหลังจากทำทรีทเม้นท์ในครั้งต่อๆไป ก็สามารถรู้สึกได้ว่าหนังศีรษะมีสุขภาพดีและมีความเบาสบายหลังจากทำทรีทเม้นท์",
      ],
    },
    quote: {},
    videoId: { en: "Y1gtnm5Fst4", th: "Y1gtnm5Fst4" },
  },
  {
    slug: "jongkol",
    name: { en: "Jongkol", th: "คุณจงกล" },
    heading: {
      en: "Jongkol - Preparing for postpartum hair loss",
      th: "คุณจงกลเตรียมพร้อมที่จะรักษาภาวะผมร่วงหลังคลอด",
    },
    concerns: ["postpartum"],
    body: {
      en: [
        "Kol has been a regular customer of ours and she has been doing herbal hair treatments even before expecting. When she was expecting her first child, she was aware that she'd face postpartum hair loss after giving birth, a natural occurrence for most mothers.",
        "So she starting preparing her scalp early by doing regularly treatments before and after giving birth. This has helped reduce the severity of her postpartum hair loss and her hair was back to full-thickness within months of giving birth.",
      ],
      th: [
        "คุณ Kol ลูกค้าประจำของร้านเรา ได้มาทำทรีตเม้นต์สมุนไพรที่ร้านอย่างต่อเนื่องตั้งแต่ก่อนตั้งครรภ์ เมื่อเธอตั้งครรภ์ลูกคนแรก เธอก็กลัวภาวะผมร่วงหลังคลอดอย่างมาก เพราะเป็นอาการปกติที่คุณแม่ส่วนใหญ่จะต้องเจอ",
        "คุณ Kol ก็เลยให้ทางร้านของเราดูแลหนังศีรษะตั้งแต่ก่อนคลอดและทำทรีตเม้นต์ต่อเนื่องยันหลังคลอด ซึ่งทรีตเม้นต์ของเราก็ช่วยลดอาการผมร่วงหลังคลอด และผมของเธอก็กลับมาดกดำอีกครั้งในเพียงระยะเวลา 1 เดือนหลังจากคลอด",
      ],
    },
    quote: {},
    videoId: { en: "sdTNOZ9HJVM", th: "sdTNOZ9HJVM" },
  },
  {
    slug: "karen",
    name: { en: "Ms Karen", th: "คุณคาเรน" },
    heading: {
      en: "Ms Karen - Recovery from Female Hair Loss",
      th: "คุณคาเรน - ได้หายจากอาการผมร่วงในเพศหญิง",
    },
    concerns: ["hair-loss"],
    body: {
      en: [
        "Ms. Karen has been suffering from a recurring patchy hair loss for a lengthy period of time, affecting the crown of her head. She trusted Bee Choo Ladies and took a treatment course. It took her just 3 months to fully recover from her hair loss. In addition, her scalp is now much healthier than before and the bald patch is no longer visible! Hear it from her yourself:",
      ],
      th: [
        "คุณคาเรนได้เผชิญกับปัญหาผมร่วงเป็นหย่อมเป็นเวลานาน จนประสบปัญหาผมร่วงเป็นวงกว้างบริเวณกลางศีรษะ แต่เธอก็มั่นใจให้ บีชู เลดี้ และได้ทำทรีทเม้นท์คอร์สเป็นเวลาเพียง 3 เดือน ผมของเธอก็กลับมาดกดำเหมือนเดิม และผมไม่กลับไปร่วงอีก ยิ่งไปกว่านั้นหนังศีรษะของเธอยังมีสุขภาพดีมากยิ่งขึ้นกว่าแต่ก่อน มาฟังจากปากเธอกันเลยค่ะ",
      ],
    },
    quote: {
      en: [
        "\"Karen: I can see a lot of improvement so when I touch my head at the back, I dont feel the baldness there cause my sister say \"hey your hair here got one patch, you look very horrible, better go and do something or all your hair might become BOTAK!\"",
        "Interviewer: So what was your first experience like?",
        "Karen: Very good, the staff are all very courteous, helpful and the place is very nice.",
        "Interviewer: How long have you been with Bee Choo? How many treatments?",
        "Karen: 10, 10 treatments",
        "Interviewer: So how is Bee Choo different from other hair treatment companies?",
        "Karen: Your treatment is quite straight forward. The price here is also reasonable, affordable. Because I did try other hair treatment like at SGD 3000 plus but to no effect\"",
      ],
      th: [
        "คุณคาเรน \"ฉันได้เห็นถึงผลลัพธ์ที่ดีขึ้น ตอนฉันจับผมด้านหลัง ฉันไม่รู้สึกว่ามันล้านอีกแล้ว เพราะน้องสาวของฉันมักจะล้อเลียนฉันเรื่องนี้อยู่เสมอ\"",
        "ผู้สัมภาษณ์ \"แล้วความรู้สึกแรกเป็นยังไงคะ?\"",
        "คุณคาเรน \"รู้สึกดีมากเลยค่ะ พนักงานทุกคนมีมารยาทมาก ทุกคนได้ช่วยเหลือเป็นอย่างดีทุกอย่าง แล้วสถานที่ก็สวยด้วยค่ะ\"",
        "ผู้สัมภาษณ์ \"แล้วคุณมาที่บีชูมานานรึยังคะ? คุณทำทรีทเม้นท์ไปกี่ครั้งแล้วคะ?\"",
        "คุณคาเรน \"ทำทรีทเม้นท์ไป 10 ครั้งแล้วค่ะ\"",
        "ผู้สัมภาษณ์ \"แล้วมาทำผมที่ ซาลอน/คลินิก บีชู แตกต่างกับทำผมที่ซาลอนอื่นยังไงคะ\"",
        "คุณคาเรน \"ทรีทเม้นท์ของคุณให้ผลดี ราคาเข้าถึงได้ เพราะว่าฉันก็เคยทำทรีทเม้นท์ผมที่อื่นแล้วราคามันก็แพงมากกว่า 3,000 สิงคโปร์ดอลล่า\"",
      ],
    },
    videoId: { en: "Ux_KD0_ymHM", th: "Ux_KD0_ymHM" },
    gallery: [
      { src: karen1, alt: { en: "Karen's scalp progress photo, 22 November 2017", th: "ภาพความคืบหน้าหนังศีรษะของคุณคาเรน 22 พฤศจิกายน 2560" }, date: "2017-11-22" },
      { src: karen2, alt: { en: "Karen's scalp progress photo, 5 January 2018", th: "ภาพความคืบหน้าหนังศีรษะของคุณคาเรน 5 มกราคม 2561" }, date: "2018-01-05" },
      { src: karen3, alt: { en: "Karen's scalp progress photo, 18 January 2018", th: "ภาพความคืบหน้าหนังศีรษะของคุณคาเรน 18 มกราคม 2561" }, date: "2018-01-18" },
      { src: karen4, alt: { en: "Karen's scalp progress photo, 9 February 2018", th: "ภาพความคืบหน้าหนังศีรษะของคุณคาเรน 9 กุมภาพันธ์ 2561" }, date: "2018-02-09" },
      { src: karen5, alt: { en: "Karen's scalp progress photo, 25 February 2018", th: "ภาพความคืบหน้าหนังศีรษะของคุณคาเรน 25 กุมภาพันธ์ 2561" }, date: "2018-02-25" },
    ],
  },
  {
    slug: "hui-hui",
    name: { en: "Hui Hui", th: "คุณฮุย ฮุย" },
    heading: {
      en: "Hui Hui - Recovery from Fungal Scalp Infection",
      th: "คุณฮุย ฮุย - หายจากการติดเชื้อจากเชื้อราที่หนังศีรษะ",
    },
    concerns: ["bacterial-infection"],
    body: {
      en: [
        "Bee Choo Origin successfully helped a 12-year-old girl, Hui Hui solved Fungal Scalp Infection with Origin Herbal treatment. And, successfully restored her scalp and hair to full health.",
        "Hui Hui had a serious case of fungal infection. Her parents had been finding a cure for her issue but to no avail. It was only until a friend referred them to Bee Choo Origin Kota Tinggi before they started seeing improvements.",
        "They had never thought that she would make a full recovery, but the team in Malaysia never gave up and keep encouraging her to believe in the treatment and products. It did take some time for her to make a full recovery, but she eventually did. Most importantly, Hui Hui is now a much more confident and happy young lady after overcoming this trying period in her life.",
      ],
      th: [
        "บีชู ออริจิน ได้ประสบความสำเร็จในการช่วยเหลือเด็กหญิงอายุ 12 ปี ให้หายขาดจากการติดเชื้อราที่หนังศีรษะด้วยการทำทรีทเม้นท์สมุนไพร และยังช่วยฟื้นฟูหนังศีรษะให้แข็งแรงและมีสุขภาพดี",
        "คุณฮุย ฮุย มีปัญหาติดเชื้อจากเชื้อราที่ย่ำแย่มาก พ่อแม่ของเธอได้หาทางรักษาอยู่หลายวิธีแต่ก็ไม่ได้ผล จนมีเพื่อนได้แนะนำให้ไปที่ บีชู ออริจิน โคตา ทิงกิ มาเลเซีย จากนั้นจึงเห็นการเปลี่ยนแปลงที่ดีขึ้นตามมา",
        "ในตอนแรกพวกเขาแทบไม่เชื่อเลยว่าจะสามารถรักษาหนังศีรษะของคุณฮุย ฮุย ได้อย่างขาดหาย แต่ทีมงานของเราในมาเลเซียก็ไม่ยอมแพ้ค่ะ โดยการให้กำลังใจและขอให้เชื่อในทรีทเม้นท์และผลิตภัณฑ์ของเรา มันอาจจะต้องใช้เวลาบ้างในการรักษา แต่สุดท้ายก็ได้ผลค่ะ ตอนนี้คุณฮุย ฮุยเป็นเด็กสาวที่มีความสุขมาก และมีความมั่นใจมากกว่าเดิม หลังจากผ่านช่วงเวลาที่แสนทรมานนี้",
      ],
    },
    quote: {
      en: ["This video is a must watch! REAL pictures, REAL videos, you just can't make up such recovery stories."],
      th: ["วีดีโอนี้ควรดูเลยนะคะ ภาพจริง คลิปจริง และคุณก็ไม่สามารถแต่งเรื่องจากเรื่องราวเหล่านี้ได้เลย"],
    },
    videoId: { en: "nkdzUsTCzZU", th: "nkdzUsTCzZU" },
  },
  {
    slug: "pimpchanok",
    name: { en: "Pimpchanok", th: "คุณพิมชนก" },
    heading: {
      en: "Pimpchanok - Recovery from Hair Loss and oily scalp",
      th: "คุณพิมชนก - หายจากอาการผมร่วงและหนังศีรษะมัน",
    },
    concerns: ["hair-loss", "oily-scalp"],
    body: {
      en: [
        "Pimpchanok was suffering from hair loss and oily scalp. She walked passed Bee Choo Tawanna and decided to give it a try. After her first treatment, her scalp felt much healthier. One day, while visiting her regular hair dresser, her hair dresser told her that hair is much thicker and healthier and asked her what she has been using! From that day on, Pimchanok was convinced of the effectiveness of Bee Choo's herbal treatment and has brought many of her friends to try the treatment as well! Hear it from her yourself!",
      ],
      th: [
        "คุณพิมชนกได้เผชิญหน้ากับปัญหาผมร่วงและหนังศีรษะมัน แต่ก็ได้มาพบกับร้านของเราโดยบังเอิญที่ตะวันนา จึงตัดสินใจลองทำทรีทเม้นท์ดู ก็รู้สึกได้ว่าหนังศีรษะมีสุขภาพที่ดีขึ้น และช่างตัดผมที่ไปตัดผมด้วยเป็นประจำนั้นยังถามถึงผลิตภัณฑ์ที่ใช้ และหลังจากที่คุณพิมชนกได้ติดใจกับทรีทเม้นท์ของเราแล้ว ยังได้ชวนเพื่อนๆและคนในครอบครัวมาที่ร้านบีชูของเราด้วย ไปฟังจากปากของเธอกันค่ะ",
      ],
    },
    quote: {},
    videoId: { en: "YZ9ah0xrO7E", th: "YZ9ah0xrO7E" },
  },
  {
    slug: "rachel",
    name: { en: "Rachel", th: "คุณราเชล" },
    heading: {
      en: "Rachel - Recovery from Itchy Scalp and Patchy Hair Loss",
      th: "คุณราเชล – ผู้ที่ได้รับการฟื้นฟูสภาพหนังศีรษะจากอาการคันและผมร่วงเป็นหย่อมๆ",
    },
    concerns: ["bacterial-infection", "oily-scalp"],
    body: {
      en: [
        "Originally posted on www.beechooladies.com.sg",
        "Rachel has been having two patches on her scalp which is extremely itchy and hairs on the patch gets broken for several years. She had this condition for years and had never been able to solve it. It was only recently, when a friend told her to try out Bee Choo Ladies that she decided to give it a try. She was surprised to find out that the treatment prices was reasonable and she decided to commit to a weekly treatment for the first month with Bee Choo Ladies.",
        "Below is the picture of the hair scan of the patch.",
        "Rachel: \"There was always some itchiness and it is on & off and I always had one patch in my scalp that really get quite itchy I think it has been for a few years the itchiness comes and goes so what I will do is try different shampoos that is supposed to be for itchy scalp. But it doesn't seem to help.\"",
        "Bee Choo Ladies: \"Other than the shampoos, did you try other treatments?\"",
        "Rachel: \"My hair stylist did recommend me. Once we did hair treatment for the scalp. But I think it didn't help as well. It is like those normal hair salon kind of treatment.\"",
        "Bee Choo Ladies: \"Who introduced you to Bee Choo Ladies?\"",
        "Rachel: \"A friend of mine. Initially when they did the consultation of the scalp. The therapist said that it was oily and because of the itchiness, they took some scans and it looks like there was some bacterial infection. So they recommended to start treatment once per week for the first month and monitor the condition after. I started treatment some time before Chinese New Year (4 months ago) and right now I am doing two treatments per month. The patch is pretty much healed. Really a lot less itchy now because there was a period of time when my scalp was really very itchy! But right now you can see and feel the difference\"",
        "Watch the full video here!",
      ],
      th: [
        "ต้นฉบับถูกเผยแพร่ที่เว็บไซต์ www.beechooladies.com.sg",
        "หลังจากที่คุณราเชลประสบปัญหาคันหนังศีรษะอย่างมากและผมขาดหลุดร่วงมาเป็นเวลาหลายปี ทำให้เธอมีปัญหาผมบางเป็นหย่อม 2 จุด โดยที่เธอไม่รู้ว่าจะรักษามันอย่างไร เมื่อไม่นานมานี้ เพื่อนของคุณราเชลได้แนะนำให้เธอลองปรึกษาปัญหานี้กับทางเจ้าหน้าที่ Bee Choo ซึ่งเธอก็ตัดสินใจที่จะเข้ามาพูดคุยกับผู้เชี่ยวชาญของเราเพื่อรับฟังข้อมูลการรักษาด้วยการทำทรีทเมนท์ หลังจากรับฟังข้อมูลเธอรู้สึกแปลกใจที่ค่าใช้จ่ายในการทำทรีทเมนท์ไม่ได้แพงอย่างที่เธอคิด เธอจึงตัดสินใจที่จะเข้าคอร์สทรีทเมนท์รายสัปดาห์เป็นเวลา 1 เดือนกับทางเราทันที",
        "ภาพด้านล่างนี้ เป็นภาพจากการสแกนจุดที่มีผมร่วงบาง ในวันที่คุณราเชลเข้ารับคำปรึกษาที่ Bee Choo เมื่อวันที่ 17 มีนาคม 2561",
        "คุณราเชล: \"ชั้นมักจะมีอาการคันหนังศีรษะบ่อยๆ แบบเป็นๆหายๆ และสังเกตเห็นว่าผมเริ่มบางในจุดที่มีอาการคันมากๆด้วย ชั้นคิดว่าอาการคันเหล่านี้เป็นมาได้สัก 2-3 ปีแล้วค่ะ ตอนนั้นชั้นพยายามเปลี่ยนยาสระผมไปใช้สูตรที่ช่วยป้องกันอาการคันหนังศีรษะ แต่ถึงจะเปลี่ยนมาหลายยี่ห้อก็รู้สึกว่ามันไม่ได้ช่วยให้อาการดีขึ้นเลย\"",
        "เจ้าหน้าที่ Bee Choo: \"นอกจากการเปลี่ยนแชมพูแล้ว คุณได้เคยลองทำทรีทเมนท์บ้างมั้ยคะ\"",
        "คุณราเชล: \"ช่างทำผมของชั้นก็เคยมีแนะนำเหมือนกันค่ะ ครั้งนึงชั้นเคยทำทรีทเมนต์เพื่อบำรุงหนังศีรษะ แต่ชั้นคิดว่ามันไม่ได้ช่วยอะไรนะคะ ชั้นรู้สึกเหมือนการทำทรีทเมนท์เส้นผมตามร้านทำผมทั่วๆไปค่ะ\"",
        "เจ้าหน้าที่ Bee Choo: \"แล้วไม่ทราบว่า ใครเป็นคนแนะนำให้คุณรู้จักกับ Bee Choo คะ\"",
        "คุณราเชล: \"เพื่อนของชั้นเป็นคนแนะนำมาค่ะ ตอนที่ชั้นมาครั้งแรกเพื่อรับคำปรึกษา ทางผู้เชี่ยวชาญบอกว่าหนังศีรษะของชั้นค่อนข้างมันและเนื่องจากชั้นมีอาการคันหนังศีรษะ พวกเขาจึงทำการสแกนหนังศีรษะให้ และก็พบว่าหนังศีรษะของชั้นมีการติดเชื้อจากแบคทีเรีย เจ้าหน้าที่จึงแนะนำให้ชั้นลองทำทรีทเมนท์อาทิตย์ละครั้งเป็นเวลาหนึ่งเดือนก่อนและค่อยติดตามผลอีกทีหลังจากนั้น ชั้นได้เริ่มเข้ามาทำทรีทเมนท์ตั้งแต่ ช่วงก่อนวันตรุษจีน (เมื่อ 4 เดือนที่แล้ว) จนตอนนี้ชั้นทำทรีทเมนท์แค่เดือนละ 2 ครั้ง เพราะว่าผมที่บางเริ่มดีขึ้น และอาการคันก็ลดลงไปมากจากที่ชั้นเคยต้องทนกับอาการคันมาเป็นเวลานาน เห็นได้ชัดเลยว่ามันดีขึ้นจริงๆ\"",
      ],
    },
    quote: {},
    videoId: { en: "DMK31WHz8yE", th: "eTuuc_ReLXs" },
    scanImage: {
      src: rachelScan,
      alt: { en: "Scan taken during consultation at Bee Choo Ladies on 17-Mar-2018", th: "ภาพสแกนหนังศีรษะของคุณราเชล วันที่ 17 มีนาคม 2561" },
    },
    gallery: [{ src: rachelBeforeAfter, alt: { en: "Before and After photo of Rachel", th: "หนังศีรษะของคุณราเชล ก่อนและหลังทำทรีทเม้นท์สมุนไพรบีชู" } }],
  },
  {
    slug: "alanna-tok",
    name: { en: "Alanna Tok", th: "คุณอัลแลนนา ต๊อก" },
    heading: {
      en: "Alanna Tok - Started experiencing hair loss after a rebonding session",
      th: "คุณอัลแลนนา ต๊อก – ผู้ที่เริ่มมีอาการผมร่วงหลังจากการยืดผมรีบอนดิ้ง",
    },
    concerns: ["hair-loss", "damaged-hair"],
    body: {
      en: [
        "Originally posted on www.beechooladies.com.sg",
        "Allanna Tok had been suffering from thinning of hair and hair loss for 10 years. her hair loss first started after a rebonding session which left her with an allergic reaction to the chemicals. After that, her hair thickness and volume was never the same. She had tried various products: hair loss shampoos, tonics etc, But none of them worked. After hearing of Bee Choo Ladies, she decided to give Bee Choo Ladies a try, after about several months of treatment, she saw the results for herself.",
        "If you are suffering from hair loss, do not despair, especially for early stage hair loss. Opt for a herbal hair treatment with Bee Choo Herbal. Bee Choo Herbal's treatment is non-invasive, chemical free and affordable.",
      ],
      th: [
        "ต้นฉบับถูกเผยแพร่ที่เว็บไซต์ www.beechooladies.com.sg",
        "คุณอัลแลนนา ต๊อก ประสบปัญหาผมบางและผมร่วงมาเป็นเวลากว่า 10 ปี ผมของเธอเริ่มร่วงครั้งแรกเนื่องจากการแพ้สารเคมีหลังจากการยืดผมรีบอนดิ้ง หลังจากนั้นผมของเธอที่เคยหนาและมีน้ำหนักก็ไม่เหมือนเดิม เธอได้ลองใช้ผลิตภัณฑ์มากมาย ไม่ว่าจะเป็นแชมพูลดผมร่วง ผลิตภัณฑ์บำรุงเส้นผม และอื่นๆ แต่ก็ไม่มีตัวไหนเลยที่ช่วยได้",
        "หลังจากที่เธอได้ยินเกี่ยวกับ Bee Choo เธอตัดสินใจลองเข้ามาทำ และหลังจากการทำทรีทเม้นท์เป็นเวลาหลายเดือน เธอก็เริ่มเห็นผลที่ดีขึ้นกับตัวเธอเอง",
        "ถ้าคุณกำลังประสบกับปัญหาผมร่วง อย่าเพิ่งท้อแท้นะคะ โดยเฉพาะอย่างยิ่งถ้าเป็นช่วงแรกที่ผมเริ่มร่วง ลองเข้ามาทำ ทรีทเม้นท์กับทาง Bee Choo Herbal นะคะ ทรีทเมนท์ของ Bee Choo Herbal ไม่เป็นอันตราย ไม่มีสารเคมี และราคาก็ไม่แพงด้วยค่ะ",
      ],
    },
    quote: {
      en: [
        "I would say I first started losing hair about 10 years ago After a rebonding session. That was quite bad. So I had alot of hair fall issues. I basically stopped all forms of treatment and Hair colouring for the last 10 years. And so I have tried alot of over the counter products: shampoo, hair spray, you name it, nothing works.",
        "I've thought of more expensive programs like Yum Nam & Beijing 101. But it doesn't work for everybody because I have colleagues who actually tried those cheap one time trials as well but they were very pushy. So i decided to give Bee Choo a try and after the first session, I felt that my hair was drier and not so frizzy. Scalp feels alot cleaner.",
        "I think the greatest impact was the next morning when i woke up it will always feel very matty and I will feel like I need to wash it. But surprisingly (for the first time) the feel was still very good so i was actually pretty enticed to come back again one week later. I like it that they (Bee Choo Origin) don't hard sell. They don't push you.",
        "The second week was my second session so I did a consecutive 13 sessions, 13 weeks. I always like to ask the ladies whenever I am here that.. is it growing? And they have always been very positive and convincing that it is growing. But, you don't know like if it is like a sales tactic or whatsoever until 6 months later when I saw the pictures. I was like Yes! It really is working!",
      ],
      th: [
        "\"ชั้นเริ่มมีอาการผมร่วงครั้งแรกเมื่อ 10 ปีที่แล้วหลังจากที่ไปทำการยืดผมรีบอนดิ้งมา มันเป็นอะไรที่แย่มากที่ผมเราร่วงเป็นกระจุก ชั้นหยุดทำทรีทเม้นท์ทุกอย่างและหยุดการทำสีผมตั้งแต่นั้น และลองผลิตภัณฑ์ที่ขายตามท้องตลาดทั้งแชมพู สเปรย์ใส่ผม แต่มันก็ไม่ช่วยให้ดีขึ้นเลย",
        "ชั้นเคยคิดที่จะไปเข้าโปรแกรมแพงๆอย่าง Yum Nam & Beijing 101 แต่มันก็ใช่ว่าจะดีสำหรับทุกคน เพราะเพื่อนร่วมงานของชั้นหลายคนเคยลองไปทำคอร์สทดลอง แต่หลังจากนั้นทางร้านก็จะขายคอร์สอื่นๆให้คุณอย่างที่คุณจะปฏิเสธไม่ได้",
        "ดังนั้นชั้นจึงตัดสินใจลองมาทำที่ Bee Choo ซึ่งหลังจากที่ได้ลองทำครั้งแรก ชั้นรู้สึกเลยว่าผมของชั้นมันน้อยลง ไม่ชี้ฟูเหมือนเดิม และรู้สึกว่าหนังศีรษะสะอาดขึ้น และสิ่งที่เห็นผลมากที่สุด คือ ปกติในเช้าวันรุ่งขึ้นหลังจากที่ชั้นตื่นนอน ชั้นจะรู้สึกว่าผมแห้งหยาบจนอยากจะสระผมใหม่ แต่หลังจากที่ได้ลองทำครั้งแรก เช้าวันรุ่งขึ้นชั้นกลับยังรู้สึกว่าผมยังดีอยู่ มันทำให้ชั้นอยากจะกลับไปทำอีกในอาทิตย์ถัดมา และส่วนหนึ่งที่ชั้นชอบ Bee Choo เป็นเพราะว่าพวกเขาไม่บังคับขายผลิตภัณฑ์ หรือพยายามกดดันให้คุณซื้อ",
        "ในสัปดาห์ถัดมา ชั้นได้เข้ามาทำครั้งที่ 2 และหลังจากนั้นก็ทำติดต่อกันรวม 13 ครั้ง เป็นเวลาทั้งหมด 13 สัปดาห์ ทุกครั้งที่ชั้นเข้ามาทำ ชั้นมักจะถามเจ้าหน้าที่ว่า ผมชั้นเริ่มขึ้นหรือยัง และพวกเขาก็มักจะให้กำลังใจและทำให้ชั้นมั่นใจว่ามันจะขึ้นอย่างแน่นอน แต่คุณจะไม่รู้หรอกว่ามันเป็นวิธีการขายหรืออะไร จนกระทั่ง 6 เดือนถัดมาชั้นได้ดูรูปหลังการทำและชั้นก็รู้ว่ามันขึ้นมาแล้วจริงๆ มันได้ผลจริงๆนะ\" - อัลแลนนา",
      ],
    },
    videoId: { en: "M3cgqlWSJhg", th: "2R1AHlnr9GU" },
    gallery: [{ src: alannaBeforeAfter, alt: { en: "Alanna Tok's hair, before and after Bee Choo herbal treatment", th: "ผมของคุณอัลแลนนา ต๊อก ก่อนและหลังทำทรีทเม้นท์สมุนไพรบีชู" } }],
  },
  {
    slug: "trixie",
    name: { en: "Trixie", th: "คุณทริกซี่" },
    heading: {
      en: "Trixie - Recovering from a bacterial infection",
      th: "คุณ ทริกซี่ – หายจากอาการติดเชื้อแบคทีเรีย",
    },
    concerns: ["bacterial-infection"],
    body: {
      en: [
        "Originally posted on www.beechooladies.com",
        "This young lady had been suffering from severe hair loss for a long time. She is not yet a teenager but below is the photo of her condition prior to starting treatment with Bee Choo Ladies.",
        "Photo 1: Trixie when she first visited Bee Choo Ladies",
        "Photo 2: Trixie when she first visited Bee Choo Ladies",
        "On closer inspection, we realise that her hair loss was due to a bacterial infection as the hair scan showed hair breakage. If you look closely at the hair scans, you will see black dots. These are actually fully grown hairs that have broken off near the roots! The bacterial attacks the hair and causes breakage. In serious cases, it can also infect the scalp causing inflammation, infection and extreme itchiness.",
        "Can you imagine the difficulties she faced while in school? It must have been a hard time for her in school. We were really heartbroken and we really wanted to do our best to help her. We recommended her to do herbal treatment once per week for the first two months and after that twice per month. We recorded her progress; these are the results:",
        "We are glad to say that we managed to help her recover from her condition in 7 months. We are grateful for her patience and trust in Bee Choo Ladies.",
        "Bacterial infection can be treated, but it must be addressed quickly before it starts spreading to other family members. The fastest way to deal with it is to go for treatment, dispose all existing hair equipments and, avoid muddy area and pets as these are possible areas where the bacterial was contracted from!",
      ],
      th: [
        "บทความจาก www.beechooladies.com",
        "เด็กสาวคนนี้เผชิญปัญหาผมร่วงรุนแรงมาเป็นเวลานาน อายุของเธอยังไม่ทันเข้าวัยรุ่นแต่สภาพหนังศีรษะของเธอก่อนเข้ารับการรักษากับ บีชู เลดี้ เป็นแบบรูปภาพด้านล่าง",
        "รูปภาพที่ 1: คุณทริกซี่ตอนมาพบบีชู เลดี้ ครั้งแรก",
        "รูปภาพที่ 2: คุณทริกซี่ตอนมาพบบีชู เลดี้ ครั้งแรก",
        "ถ้าเปลี่ยนมุมมองเป็นมุมขยายของผมเธอ เราจะพบว่าผมของเธอร่วงเพราะเป็นการติดเชื้อจากแบคทีเรียที่ทำให้เส้นผมของเธอขาด ถ้าคุณมองใกล้ๆคุณจะเห็นว่าหนังศีรษะของเธอมีจุดดำๆ อยู่เป็นจำนวนมาก จุดดำๆแหล่านี้คือเส้นผมของเธอที่ขึ้นตามปกติแต่ขาดช่วงรากเพราะเชื้อแบคทีเรีย ในบางรายที่มีอาการหนัก หนังศีรษะที่ติดเชื้อแบคทีเรียอาจเกิดอาการอักเสบและคันเป็นอย่างมาก",
        "คุณไม่รู้หรอกว่าชีวิตในโรงเรียนของเธอนั้นลำบากแค่ไหน เราใจสลายและอยากช่วยเธอให้ได้มากที่สุด เราแนะนำให้เธอทำทรีทเม้นท์สมุนไพรอาทิตย์ละครั้งในสองเดือนแรกและหลังจากนั้นเดือนละสองครั้ง เราได้ทำการบันทึกความคืบหน้าการรักษาของเธอ และภาพเหล่านี้คือผลการรักษา:",
        "เรายินดีที่จะพูดได้ว่าเรารักษาอาการเธอภาพใน 7 เดือน เราต้องขอบคุณเธอที่เธอให้ความไว้วางใจกับ บีชู เลดี้",
        "การติดเชื้อแบคทีเรียสามารถรักษาได้ แต่จะต้องได้รับการรักษาก่อนที่เชื้อแบคทีเรียจะแพร่กระจายไปยังส่วนใกล้เคียง วิธีการรักษาที่เร็วที่สุดคือการทำทรีทเม้นท์ ทิ้งอุปกรณ์ทำผมทุกอย่างที่เคยใช้ หลีกเลี่ยงพื้นที่ที่เต็มไปด้วยโคลนและสัตว์เลี้ยงเพราะสิ่งเหล่านี้อาจเป็นสิ่งที่ทำให้เราติดเชื้อแบคทีเรีย",
      ],
    },
    quote: {},
    videoId: {},
    scanImage: {
      src: trixieScan,
      alt: { en: "Hair scan of Trixie showing broken hairs.", th: "ภาพแสกนหนังศีรษะของคุณทริกซี่ เผยให้เห็นถึงเส้นผมที่ขาดตรงราก" },
    },
    gallery: [
      { src: trixie1, alt: { en: "Trixie's scalp progress photo, 23 May 2017", th: "ภาพถ่ายเมื่อ 23 พฤษภาคม 2560" }, date: "2017-05-23" },
      { src: trixie2, alt: { en: "Trixie's scalp progress photo, 8 July 2017", th: "ภาพถ่ายเมื่อ 8 กรกฎาคม 2560" }, date: "2017-07-08" },
      { src: trixie3, alt: { en: "Trixie's scalp progress photo, 19 August 2017", th: "ภาพถ่ายเมื่อ 19 สิงหาคม 2560" }, date: "2017-08-19" },
      { src: trixie4, alt: { en: "Trixie's scalp progress photo, 23 December 2017", th: "ภาพถ่ายเมื่อ 23 ธันวาคม 2560" }, date: "2017-12-23" },
    ],
  },
  // --- TH-only testimonials (4) — no EN counterpart exists on the live source ---
  {
    slug: "nap",
    name: { th: "คุณแน็ป" },
    heading: { th: "คุณแน็ป – ดีขึ้นจากการมีหนังศีรษะที่บอบบางและมีอาการคัน" },
    concerns: ["oily-scalp"],
    body: {
      th: [
        "คุณแน็ปเธอได้เข้ามาลองใช้บริการที่ร้านของเราสาขาสยามสแควร์และเธอรู้สึกทึ่งกับการทรีทเม้นท์หนังศีรษะด้วยสมุนไพรของเราเป็นอย่างมาก เธอเคยมองหาอะไรแบบนี้มานานเพราะเธอมีปัญหากับหนังศีรษะของเธออย่างมาก มันทั้งมีอาการคันและทำให้เธอรู้สึกไม่สบายตัว หลังจากที่เธอได้รับการทรีทเม้นท์จากเรา เธอได้รู้สึกแตกต่างไปจริงๆ อาการคันหนังศีรษะและทำให้ไม่สบายตัวแบบเมื่อก่อน ได้พัฒนาไปในทางที่ดีขึ้นมากๆ ชมวิดีโอนี้เพื่อรับฟังเธอพูดถึงเรา",
      ],
    },
    quote: {},
    videoId: { th: "rwANwecG35s" },
  },
  {
    slug: "christabelle",
    name: { th: "คุณ Christabelle" },
    heading: { th: "ผมเกิดขึ้นมาใหม่อย่างเห็นได้ชัด! (คุณ Christabelle)" },
    concerns: ["hair-loss", "oily-scalp"],
    body: {
      th: [
        "Christabelle เคยมีหนังศีรษะมันและผมร่วง เธอลองไปใช้บริการหลายๆ ร้าน แต่มันไม่ได้ผลจนเธอได้ใช้บริการทำทรีตเมนต์ที่ Bee Choo Herbal จนถึงตอนนี้ เธอได้ใช้บริการทำทรีตเมนต์ที่ Bee Choo Herbal มามากกว่า 6 เดือนแล้วและยังคงใช้บริการเป็นประจำเดือนละครั้ง ในคำพูดของเธอ \"จนถึงตอนนี้ฉันบอกได้เลยว่ามันใช้งานได้ดีจริงๆ สำหรับฉัน\" และเธอยังแนะนำเพื่อนของเธอทั้ง 3 คน รวมทั้งสามีของเธอให้มาใช้บริการที่ Bee Choo ด้วย ตอนนี้อาการผมร่วงของเธอลดลงอย่างมาก อีกทั้งเธอยังรู้สึกว่าผมและหนังศีรษะมีสุขภาพดีขึ้น เธอเริ่มเห็นผมเกิดใหม่ที่หน้าผากเธออีกด้วย",
        "ดูคำรับรองจากใจของเธอที่วิดีโอด้านล่าง!",
      ],
    },
    quote: {},
    videoId: { th: "hgFMtXYgRT4" },
  },
  {
    slug: "wirada",
    name: { th: "คุณวิรดา" },
    heading: { th: "คุณวิรดา - ผมหยุดร่วงและรังแคลดลงตั้งแต่ครั้งแรกที่ทำทรีทเม้นท์" },
    concerns: ["hair-loss", "dandruff", "oily-scalp"],
    body: {
      th: [
        "คุณวิรดามีปัญหาผมร่วง รังแค และหนังศีรษะมันจึงมาหาเราที่บีชู เธอรู้สึกว่าการทำทรีทเม้นท์กับเราทำให้สุขภาพหนังศีรษะและเส้นผมของเธอดีขึ้นโดยเฉพาะการแก้ปัญหาผมร่วง รังแคและหนังศีรษะมัน เธอติดใจและทำต่อเพื่อบำรุงสุขภาพเส้นผมและหนังศีรษะของเธอ",
      ],
    },
    quote: {},
    videoId: { th: "a1XCv4rxrrA" },
  },
  {
    slug: "pissamai",
    name: { th: "คุณพิศมัย" },
    heading: { th: "คุณพิศมัย - ผมร่วงและผมบางลดลง" },
    concerns: ["hair-loss", "grey-hair"],
    body: {
      th: [
        "คุณพิศมัยมีอาการผมร่วงและผมบาง เธอจึงมองหาวิธีแก้ปัญหานี้และได้มาพบกับเรา เธอประทับใจในบริการของเรามากเพราะทรีทเม้นท์ของเราไม่ได้เพียงแค่รักษาอาการผมร่วงและผมบางของเธอเท่านั้น แต่ยังสามารถปิดผมขาว และดูแลสุขภาพหนังศีรษะของเธอให้ดียิ่งขึ้นด้วย",
      ],
    },
    quote: {},
    videoId: { th: "pXy5Yx4C5N8" },
  },
];

// Opening section, before any individual testimonial — the page's own H1 + intro line
// + (EN only) a "Testimonial Compilation" sub-heading and paragraph — plus a shared
// compilation video (WCJrb2D9PNE, same id both languages).
export const REVIEWS_INTRO: {
  heading: PL<string>;
  intro: PL<string>;
  subHeading: PL<string>;
  subParagraph: PL<string>;
  videoId: PL<string>;
} = {
  heading: { en: "Bee Choo Origin Reviews and Testimonials", th: "บีชูประเทศไทย" },
  intro: {
    en: "We are very happy to have effectively helped our customers with their hair issues over the years. Do read on and hear what they say about Bee Choo Origin treatment.",
    th: "ผลการรับรองที่เราได้เก็บข้อมูลไว้วิดีโอนี้คือผลการรับรองจากลูกค้าที่มาใช้บริการกับเราที่สามารถรวบรวมมาได้ในช่วงไม่กี่ปีที่ผ่านมา เราให้บริการลูกค้าหลายพันคน ทำให้พวกเขาเกิดความสุขมากขึ้น หลายคนมีพัฒนาการของหนังศีรษะและเส้นผมไปในทางที่ดีขึ้น",
  },
  // EN-only sub-section — no TH counterpart on the live source.
  subHeading: { en: "Bee Choo Thailand - Testimonial Compilation" },
  subParagraph: {
    en: "This is a video compilation of our customers' testimonials over the past few years of operations. We've served thousands and thousands of happy customers, many whom have seen great improvement in their scalp and hair conditions.",
  },
  videoId: { en: "WCJrb2D9PNE", th: "WCJrb2D9PNE" },
};

// Closing video — a general appeal to Thai mothers, not tied to a named customer, so it
// doesn't fit the review-card model. EN-only: this Thai-language paragraph appears
// verbatim at the end of the EN page (not machine-translated by us — the legacy site
// itself left it in Thai on the English page).
export const REVIEWS_CLOSING: {
  heading: PL<string>;
  body: PL<string[]>;
  videoId: PL<string>;
} = {
  heading: { en: "ถึงคุณแม่ชาวไทยทั้งหลาย! นี่คือวิธีการดูแลหนังศีรษะของพวกคุณระหว่างตั้งครรภ์และหลังคลอด" },
  body: {
    en: [
      "ใครๆ ก็ทำทรีตเมนต์สมุนไพรหนังศีรษะที่บีชูได้ เพราะเป็นธรรมชาติ 100% โดยเฉพาะคุณแม่หลังคลอดที่มีปัญหาหนังศีรษะต่างๆ ก็ทำได้อย่างปลอดภัย สมุนไพรของเราจะสร้างความพอใจให้กับลูกค้าแค่ไหน ไปชมกันเลยค่ะ",
    ],
  },
  videoId: { en: "6e_rVl2qqg0" },
};

export const REVIEWS_SEO = {
  title: {
    en: "Reviews and Testimonials - Bee Choo Herbal",
    th: "รีวิว บีชู ออริจิน และ การการันตีจากลูกค้า - Bee Choo Herbal",
  },
  description: {
    en: "Real customer stories from Bee Choo Herbal Thailand — hair loss, dandruff, oily scalp, bacterial infection, grey hair and postpartum hair loss, in their own words.",
    th: "เรื่องราวจากลูกค้าจริงของบีชู เฮอร์บัล ประเทศไทย ปัญหาผมร่วง รังแค หนังศีรษะมัน ติดเชื้อแบคทีเรีย ผมขาว และผมร่วงหลังคลอด บอกเล่าโดยลูกค้าเอง",
  },
};
