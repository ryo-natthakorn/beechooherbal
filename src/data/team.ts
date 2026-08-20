// src/data/team.ts
// Bios for the Team page. Extracted verbatim from the live site (fetched directly,
// wp-json/wp/v2/pages/195 EN + 601 TH, both current — last edited 2025-09-25/29).
//
// Dropped the legacy "(left)" / "(center)" parentheticals after each name: they're
// positional references to what was clearly meant to be ONE shared group photo (Rick
// "on the left", Crispin "in the center" of the same frame) — but the two source images
// (Mr.-Rick-Lim-Ting-Feng-Director.png and 754ba551-....jpg) turned out to be TWO
// UNRELATED photos, neither a clean single-person portrait: Rick's is a casual 2-person
// garden photo, Crispin's is a formal 3-person award-ceremony photo. Cropped both down to
// just the named person (src/assets/images/team/) rather than publishing group photos
// under a single name — but these are best-effort crops of found photos, not real
// headshots. Flagged for Crispin: worth asking for actual individual headshots.
// "(left)"/"(center)" would also be actively wrong once cropped to one person each.
//
// The trailing duplicate "OUR TEAM" string at the end of both legacy pages' content is a
// stray artefact (not a second heading anyone would see) and is not reproduced.
//
// TH role label uses "กรรมการผู้จัดการ" (Managing Director) rather than a fresh
// translation of "Director" — that exact phrase already appears verbatim inside each
// bio's own first paragraph, so reusing it is quoting the source, not composing new
// copy. Everything else on the TH page keeps "Director" in English, exactly as published.
import type { ImageMetadata } from "astro";
import crispinPhoto from "../assets/images/team/crispin.jpg";
import rickPhoto from "../assets/images/team/rick.png";

export type Lang = "en" | "th";
type L = Record<Lang, string>;

export interface TeamMember {
  /** Identical on both language pages on the live source — not a translation gap. */
  name: string;
  role: L;
  photo: ImageMetadata;
  bio: L[];
}

export const TEAM_SEO = {
  title: {
    en: "Our Team - Bee Choo Herbal",
    th: "ทีมของเรา - Bee Choo Herbal",
  },
  description: {
    en: "Meet the founders of Bee Choo Origin Thailand — Rick Lim and Crispin Francis, co-founders of R.C. Business Group.",
    // ⚠ Composed, not transcribed — the live TH page has no Yoast description of its own. Needs Crispin's sign-off.
    th: "รู้จักผู้ก่อตั้งบีชู ออริจิน ประเทศไทย ริค ลิม และ คริสปิน ฟรานซิส ผู้ร่วมก่อตั้ง อาร์ ซี บิซซิเนส กรุ๊ป",
  },
};

export const TEAM: TeamMember[] = [
  {
    name: "Mr. Rick, Lim Ting Feng",
    role: { en: "Director", th: "กรรมการผู้จัดการ" },
    photo: rickPhoto,
    bio: [
      {
        en: "Rick Lim is the managing director and co-founder of R.C. Business Group. The Group owns the Thailand master franchise of Bee Choo Origin and Bee Choo Ladies located at 5 Pahang Street, Singapore 198606.",
        th: "ริค ลิม (Director, Rick Lim) กรรมการผู้จัดการ และผู้ร่วมก่อตั้ง อาร์ ซี บิซซิเนส กรุ๊ป ซึ่งเป็นเจ้าของแฟรนไชน์ บีชู ออริจิน ในประเทศไทย และ บีชู เลดี้ ในสิงคโปร์",
      },
      {
        en: "Rick is a successful entrepreneur and business owner with extensive experience in international business development. At present, Mr. Lim holds key positions in Origin Herbal, Mikawa, ServiceBuild and R.C. Business Group.",
        th: "ริค เป็นนักลงทุนทางการเงินและเป็นเจ้าของธุรกิจที่ประสบความสำเร็จ โดยสั่งสมประสบการณ์จากบริษัทพัฒนาธุรกิจในระดับนานาชาติ ปัจจุบันนี้ คุณริม ได้ดำรงตำแหน่งสำคัญใน ออริจิน เฮอร์เบิล, มิคาวา, เซอร์วิสบิ้วท์ และ อาร์ซี บิซซิเนส กรุ๊ป",
      },
      {
        en: "Rick graduated from Temasek Polytechnic with a Diploma in business (marketing and human resource). Rick is a family man with two kids. In his spare time, Rick enjoys gardening and playing with his kids.",
        th: "ริค จบการศึกษาจาก Temasek Polytechnic โดยได้รับประกาศนียบัตรด้านธุรกิจ (การตลาดและงานบุคลากร) ตอนนี้คุณริคเป็นคุณพ่อลูก 2 เขามักจะแบ่งเวลาเล่นกับลูกๆ ของเขาเสมอ",
      },
    ],
  },
  {
    name: "Mr. Crispin W. Francis",
    role: { en: "Director", th: "กรรมการผู้จัดการ" },
    photo: crispinPhoto,
    bio: [
      {
        en: "Crispin William Francis is the managing director and co-founder of R.C. Business Group. The Group owns the Thailand master franchise of Bee Choo Origin and Bee Choo Ladies (located at 5 Pahang Street, Singapore 198606).",
        th: "คริสปิน วิลเลี่ยม ฟรานซิส (Director, Crispin William Francis) กรรมการผู้จัดการ และผู้ร่วมก่อตั้ง อาร์ ซี บิซซิเนส กรุ๊ป ซึ่งเป็นเจ้าของแฟรนไชน์ บีชู ออริจิน ในประเทศไทย และ บีชู เลดี้ ในสิงคโปร์",
      },
      {
        en: "Crispin is a serial entrepreneur who also co-founded Bee Choo Ladies together with Rick Lim. Before venturing into the beauty business, Crispin was an investment analyst analyzing Corporate M&A, he was frequently quoted by major financial news agency such as Bloomberg and Reuters.",
        // Legacy source splits this sentence mid-clause across two <p> tags; joined here — same convention as the treatment pages (see inventory/scripts/06-copy-parity.mjs SKIP list).
        th: "คริสปินเป็นนักลงทุนทางการเงินและผู้ก่อตั้ง บีชู เลดี้ ร่วมกับริค ลิม ก่อนที่จะหันมาจับธุรกิจความงาม คริสปิน ได้ทำงานเป็นผู้วิเคราะห์ด้านการลงทุนร่วมกับ M&A และได้ถูกกล่าวถึงในนิตยสารการเงินที่โด่งเช่น บลูมเบิร์กและรอยเตอร์สอยู่บ่อยครั้ง",
      },
      {
        en: "Crispin believes in restoring customer's beauty and confidence by solving their hair problems using organic and natural means. Crispin is a strong advocate of affordable and honest hair care solutions. He often shares with his staffs: “There is nothing more satisfying than seeing customers regain their beauty and confidence.”",
        th: "คริสปินเชื่อว่าการฟื้นฟูด้านความงามโดยใช้วิธีจากธรรมชาติจะช่วยเสริมสร้างความมั่นใจให้แก่ลูกค้า และเขายังได้สนับสนุนผลิตภัณฑ์ที่ช่วยแก้ปัญหาเกี่ยวกับเส้นผมที่มีราคาสมเหตุสมผลและซื่อสัตย์อย่างแรงกล้า เขามักจะกล่าวกับทีมงานเสมอว่า “ไม่มีอะไรน่าพอใจไปกว่าการที่ได้เห็นลูกค้าได้รับความสวยงามและความมั่นใจที่เพิ่มมากขึ้น”",
      },
      {
        en: "Crispin graduated from the National University of Singapore with a BSc in Real Estate Finance. In his spare time, Crispin enjoys playing football and Muay Thai. Crispin is currently based in Bangkok and speaks Thai fluently.",
        th: "คริสปินจบการศึกษาจากมหาวิทยาลัยประจำชาติสิงคโปร์ ด้วย BSc สาขาการเงินอสังหาริมทรัพย์ ในเวลาว่าง คริสปินชอบเล่นฟุตบอลและมวยไทย และตอนนี้เขาได้อาศัยอยู่ในกรุงเทพฯ และสามารถพูดภาษาไทยได้อย่างคล่องแคล่ว",
      },
    ],
  },
];
