// src/data/treatments.ts
// The 7 treatments shown as homepage cards. Copy is excerpted verbatim (not machine-translated,
// not invented) from the live site's WP REST export — see
// docs/superpowers/specs/2026-07-14-homepage-design.md for source.
import type { ImageMetadata } from "astro";
import hairLoss from "../assets/images/treatments/hair-loss.jpg";
import oilyScalp from "../assets/images/treatments/oily-scalp.jpg";
import greyHair from "../assets/images/treatments/grey-hair.jpg";
import dandruff from "../assets/images/treatments/dandruff.jpg";
import bacterialInfection from "../assets/images/treatments/bacterial-infection.jpg";
import damagedHair from "../assets/images/treatments/damaged-hair.jpg";
import postpartum from "../assets/images/treatments/postpartum.jpg";

export interface Treatment {
  slug: string;
  image: ImageMetadata;
  alt: { en: string; th: string };
  title: { en: string; th: string };
  teaser: { en: string; th: string };
  href: { en: string; th: string };
}

export const TREATMENTS: Treatment[] = [
  {
    slug: "hair-loss",
    image: hairLoss,
    alt: { en: "Client receiving Bee Choo herbal hair loss treatment", th: "ลูกค้ากำลังรับทรีตเมนต์สมุนไพรแก้ปัญหาผมร่วงจากบีชู" },
    title: { en: "Hair Loss Treatment", th: "ทรีตเมนต์แก้ปัญหาผมร่วง" },
    teaser: {
      en: "The average person sheds about 100 hairs a day; those with hair loss can lose more than 300 hairs per day.",
      th: "ปกติแล้วคนเราจะมีผมร่วงวันละ 100 เส้นโดยเฉลี่ย แต่สำหรับผู้ที่มีปัญหาผมร่วง ผมนั้นอาจจะร่วงได้ถึงวันละ 300 เส้นต่อวัน",
    },
    href: { en: "/scalp-hair-loss-treatment-salon-clinic-in-bangkok/", th: "/th/ซาลอน-คลินิกรักษาผมร่วง/" },
  },
  {
    slug: "oily-scalp",
    image: oilyScalp,
    alt: { en: "Bee Choo oily and itchy scalp herbal treatment", th: "ทรีตเมนต์สมุนไพรแก้ปัญหาหนังศีรษะมันและคันจากบีชู" },
    title: { en: "Oily Itchy Scalp Treatment", th: "ทรีตเมนต์ผมมัน / ทรีตเมนต์หนังศีรษะมันและคัน" },
    teaser: {
      en: "Our scalp naturally secretes oil via the sebaceous glands, and this oil protects the hair and sustains its structure.",
      th: "โดยปกติแล้วหนังศีรษะของคนเราจะหลั่งน้ำมันออกมาทางต่อมไขมัน และน้ำมันนี้จะช่วยปกป้องเส้นผมและช่วยรักษาโครงสร้างของเส้นผม",
    },
    href: { en: "/herbal-treatment-to-get-rid-of-oily-scalp-hair/", th: "/th/วิธีแก้หนังศีรษะมัน/" },
  },
  {
    slug: "grey-hair",
    image: greyHair,
    alt: { en: "Bee Choo grey and white hair herbal treatment", th: "ทรีตเมนต์สมุนไพรรักษาผมขาวผมหงอกจากบีชู" },
    title: { en: "White or Grey Hair Treatment", th: "ทรีตเมนต์รักษาผมขาว / รักษาผมหงอก" },
    teaser: {
      en: "Grey hair occurs at the hair follicles where melanin pigment production has ceased. This is permanent.",
      th: "ผมขาวหรือผมหงอกนั้นเกิดขึ้นอยู่ในบริเวณรูขุมขนของเส้นผมของเรา ซึ่งในรูขุมขนนั้นมีการสร้างเม็ดสีเมลานินอยู่เสมอ",
    },
    href: { en: "/reverse-premature-grey-white-hair-by-herbal-treatment/", th: "/th/ปิดผมหงอกวิธีธรรมชาติ/" },
  },
  {
    slug: "dandruff",
    image: dandruff,
    alt: { en: "Bee Choo dandruff herbal treatment", th: "ทรีตเมนต์สมุนไพรรักษารังแคจากบีชู" },
    title: { en: "Dandruff Treatment", th: "ทรีตเมนต์รักษารังแค/ขจัดรังแค" },
    teaser: {
      en: "Dandruff is triggered by the fungus Malassezia globosa, a microorganism related to yeast that feeds on sebum.",
      th: "เชื้อรา เชื้อเกลื้อนมาลาสซีเซีย ซึ่งเป็นตัวกระตุ้นให้เกิดรังแคนั้น เป็นสิ่งมีชีวิตขนาดเล็กในเครือเดียวกันกับยีสต์ ซึ่งอาหารของพวกมันคือไขผิวหนังของเรานั่นเอง",
    },
    href: { en: "/cure-dandruff-hair-with-herbal-treatment/", th: "/th/รักษารังแค-ขจัดรังแค-ให้/" },
  },
  {
    slug: "bacterial-infection",
    image: bacterialInfection,
    alt: { en: "Bee Choo treatment for bacterial infection and alopecia areata", th: "ทรีตเมนต์บีชูสำหรับการติดเชื้อแบคทีเรียและผมร่วงเป็นหย่อม" },
    title: { en: "Bacterial Infection Treatment/ Alopecia Areata / Others", th: "ทรีตเมนต์รักษาการติดเชื้อจากแบคทีเรีย / ผมร่วงเป็นหย่อม และปัญหาอื่นๆ" },
    teaser: {
      en: "Certain diseases resulting from bacterial and/or fungal infection could cause severe hair loss.",
      th: "อาการเหล่านี้เป็นผลจากการติดเชื้อจากแบคทีเรีย Tinea capitis หรือเชื้อรา ซึ่งก่อให้เกิดปัญหาผมร่วงตามมา",
    },
    href: { en: "/herbal-treatment-cure-for-bacteria-infection-alopecia-areata-and-other-hair-diseases/", th: "/th/หนังศีรษะติดเชื้อ/" },
  },
  {
    slug: "damaged-hair",
    image: damagedHair,
    alt: { en: "Bee Choo damaged and chemically dried hair herbal treatment", th: "ทรีตเมนต์สมุนไพรรักษาผมเสียจากสารเคมีจากบีชู" },
    title: { en: "Damaged Hair Treatment", th: "ทรีตเมนต์ผมเสีย/ ทรีตเมนต์ผมแตกปลาย" },
    teaser: {
      en: "Over-drying or frequent exposure to harsh chemical substances can ruin hair, causing it to become frizzy or wiry.",
      th: "ผมเสียและผมแตกปลายเกิดจากการทำสีผมที่บ่อยเกินไป จนได้รับความเสียหายจากสารเคมี ทำให้ผมแห้งกรอบ หงิกงอ",
    },
    href: { en: "/repair-chemically-damaged-dry-hair-with-herbal-treatment/", th: "/th/แก้ผมเสียเร่งด่วน/" },
  },
  {
    slug: "postpartum",
    image: postpartum,
    alt: { en: "Bee Choo postpartum hair loss herbal treatment", th: "ทรีตเมนต์สมุนไพรรักษาผมร่วงหลังคลอดจากบีชู" },
    title: { en: "PostPartum hair loss treatment", th: "ทรีตเมนต์แก้ปัญหาผมร่วงสำหรับคุณแม่หลังคลอด" },
    teaser: {
      en: "Many women experience increased hair fall 2-4 months after giving birth.",
      th: "ผู้หญิงหลายคนประสบการณ์ผมขาดหลุดร่วงมากขึ้นภายหลัง 2-4 เดือนหลังคลอดบุตร",
    },
    href: { en: "/postpartum-hair-loss-treatment-in-thailand/", th: "/th/ภาวะผมร่วงเฉียบพลันของ/" },
  },
];
