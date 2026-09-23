import type { Lang } from "./home";

const bilingual = <T>(value: Record<Lang, T>) => value;

// Facts and positioning supplied by the owner for the Dead Sea Mud launch.
export const PRODUCT_BANNER = {
  productName: "Dead Sea Mud Mineral Scalp Detox Mask",
  launchLabel: bilingual({ th: "ใหม่ · ทรีตเมนต์โคลนเดดซี", en: "New · Dead Sea Mud Treatment" }),
  eyebrow: bilingual({ th: "บริการทรีตเมนต์ที่ร้าน · 45–60 นาที", en: "In-salon treatment · 45–60 minutes" }),
  title: bilingual({ th: "ทรีตเมนต์โคลนเดดซี สำหรับหนังศีรษะ", en: "Dead Sea Mud Scalp Treatment" }),
  description: bilingual({ th: "ทำความสะอาดหนังศีรษะ บำรุงด้วยแร่ธาตุ และเติมความชุ่มชื้น", en: "Scalp cleansing, mineral nourishment and hydration." }),
  ingredientsHeading: bilingual({ th: "วัตถุดิบจากเดดซี 87%", en: "87% Dead Sea materials" }),
  ingredients: [
    { amount: "70%", label: bilingual({ th: "โคลนเดดซี", en: "Dead Sea mud" }) },
    { amount: "16%", label: bilingual({ th: "น้ำจากเดดซี", en: "Dead Sea water" }) },
    { amount: "1%", label: bilingual({ th: "เกลือเดดซี", en: "Dead Sea salt" }) },
  ],
  benefitsHeading: bilingual({ th: "ดูแลหนังศีรษะอย่างอ่อนโยน", en: "A gentle scalp reset" }),
  benefits: [
    bilingual({ th: "ทำความสะอาดหนังศีรษะ", en: "Scalp cleansing" }),
    bilingual({ th: "บำรุงด้วยแร่ธาตุ", en: "Mineral nourishment" }),
    bilingual({ th: "เติมความชุ่มชื้น", en: "Hydration" }),
  ],
  price: bilingual({ th: "฿1,500 ต่อครั้ง ทุกความยาวผม", en: "฿1,500 per session, any hair length" }),
  pairingHeading: bilingual({ th: "แนะนำให้ทำควบคู่กัน", en: "Best paired with your regular treatment" }),
  pairing: bilingual({ th: "ทรีตเมนต์ปกติ 3 ครั้งต่อเดือน ควบคู่กับทรีตเมนต์เดดซี 1 ครั้งต่อเดือน", en: "3 regular treatments + 1 Dead Sea treatment each month" }),
  cta: bilingual({ th: "สอบถามทรีตเมนต์ผ่าน LINE", en: "Ask about this treatment on LINE" }),
  alt: bilingual({ th: "ซอง Dead Sea Mud Mineral Scalp Detox Mask พร้อมชามโคลนและพายไม้", en: "Dead Sea Mud Mineral Scalp Detox Mask pouch beside a bowl of mud and a wooden spatula" }),
  href: "https://lin.ee/ll3injb",
};
