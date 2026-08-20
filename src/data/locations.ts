// src/data/locations.ts
// Bee Choo Thailand outlets. Re-verified against the LIVE site 2026-08-20 (not the stale
// Phase-1 dump — see inventory/scripts/07-locations-parity.mjs, `npm run
// locations-parity`, which fetches live on every run for exactly this reason). The live
// EN page was edited THAT SAME DAY to add outlet #17 (Ayutthaya); the live TH page is
// still ~11 months stale (no Ayutthaya, English fragments in its hours text) — Thai
// hours/name below are composed from the corrected EN data, not transcribed, and are
// therefore flagged for native-speaker sign-off (⚠ below), same as any new UI string.
//
// Names/phones/hours corrected against live where they drifted from the previous data:
// Siam Square, Udomsuk, The Crystal and Suksawat all had WRONG hours here before this
// pass (see 2026-08-20 planning notes) — a visitor trusting the old data could have
// shown up to a closed shop. Ratchada/Chaiyapruek/Korat/Phutthamonthon gained the
// "last walk-in" precision the legacy site states but our old data dropped.
//
// `coords` is the exact Google Maps pin from each outlet's own live embed — used as the
// Directions link target (a coordinate beats a fuzzy text search). `area` is a
// DERIVED, coarse district/province hint (reverse-geocoded via OpenStreetMap Nominatim,
// zoom 18) — NOT a verified street address. Most pins land at subdistrict/district
// precision with no house number (the outlets are inside malls/plazas, which rarely
// geocode to a street-level POI). Do not upgrade `area` to a bold "Address:" line in the
// UI without Crispin confirming it — a wrong address is worse than none on a real
// business's page. `areaPending: true` marks the one outlet where even the pin itself is
// suspect.
export interface Outlet {
  slug: string;
  name: string;
  nameTh: string;
  region: "bangkok" | "upcountry";
  /** Derived, coarse locality hint — see file header. Absent where too unreliable to show at all. */
  area?: { en: string; th: string };
  /** True where the underlying map pin itself looks wrong — do not show `area` as fact. */
  areaPending?: true;
  phoneDisplay: string;
  phoneAltDisplay?: string;
  phoneHref: string;
  hours: { en: string; th: string };
  coords: { lat: number; lng: number };
  /** The `!2s` place name from the outlet's own map embed. Present on only 4 of 17 —
   *  the rest never had one on the legacy site either. */
  mapsQuery?: string;
}

export const OUTLETS: Outlet[] = [
  {
    slug: "sai-mai",
    name: "Sai Mai",
    nameTh: "สาขา สิริ อเวนิว สายไหม",
    region: "bangkok",
    // ⚠ This outlet's own live map embed is titled "Bee Choo Tawanna (Shop 1&2)" — a
    // DIFFERENT mall name than the outlet itself ("Sai Mai" / "Siri Avenue Sai Mai").
    // Every other outlet with a named pin (Siam Square, Ratchada, Udomsuk) has a name
    // that matches its own branch — this one doesn't, and it was still wrong on the
    // 2026-08-20 update. Corroborating find: the live TH page's own (also stale) Yoast
    // meta description still opens with "ตะวันนา ... 02-108-3938" (Tawanna,
    // 02-108-3938) as this outlet's old identity — a DIFFERENT phone number than the
    // 02-121-4419 the page body now shows. Likely explanation: Tawanna was this
    // branch's former name/number before a rename or relocation to Sai Mai, and both
    // the map pin and the meta description are stale leftovers nobody updated — but
    // that is an inference, not a confirmation. Do not show an address for this
    // outlet; ask Crispin to confirm before launch.
    areaPending: true,
    phoneDisplay: "02-121-4419",
    phoneHref: "+6621214419",
    hours: {
      en: "Weekdays 9am–8pm, Weekends 9am–7pm (last walk-in)",
      th: "วันจันทร์–ศุกร์ 9.00–20.00 น., เสาร์–อาทิตย์ 9.00–19.00 น. (รับลูกค้าคนสุดท้ายตามเวลาปิด)",
    },
    coords: { lat: 13.723194515651315, lng: 100.59925377984273 },
    mapsQuery: "Bee Choo Tawanna (Shop 1&2) - Hair Loss Treatment",
  },
  {
    slug: "siam-square",
    name: "Siam Square",
    nameTh: "สาขา สยามสแควร์ วัน",
    region: "bangkok",
    area: { en: "Near Siam Square One", th: "ใกล้สยามสแควร์ วัน" },
    phoneDisplay: "02-115-1300",
    phoneHref: "+6621151300",
    hours: {
      en: "Everyday 10:30am–9:30pm (last walk-in 8pm)",
      th: "ทุกวัน 10.30–21.30 น. (รับลูกค้าคนสุดท้าย 20.00 น.)",
    },
    coords: { lat: 13.67816145621077, lng: 100.5578651533341 },
    mapsQuery: "Bee Choo Siam Square One - Hair Loss Treatment",
  },
  {
    slug: "ratchada",
    name: "Ratchada",
    nameTh: "สาขา รัชดา",
    region: "bangkok",
    area: { en: "Din Daeng, Bangkok", th: "ดินแดง กรุงเทพฯ" },
    phoneDisplay: "06-1729-3434",
    phoneHref: "+66617293434",
    hours: {
      en: "Everyday 9am–7pm (last walk-in 6:30pm)",
      th: "ทุกวัน 9.00–19.00 น. (รับลูกค้าคนสุดท้าย 18.30 น.)",
    },
    coords: { lat: 13.770767790335112, lng: 100.56847791483071 },
    mapsQuery: "Bee Choo Ratchada - Hair Loss Treatment",
  },
  {
    slug: "udomsuk",
    name: "Udomsuk",
    nameTh: "สาขา อุดมสุข",
    region: "bangkok",
    area: { en: "Bang Na, Bangkok", th: "บางนา กรุงเทพฯ" },
    phoneDisplay: "02-072-6698",
    phoneHref: "+6620726698",
    hours: {
      en: "Weekdays 9am–8pm, Weekends 9am–7pm (last walk-in)",
      th: "วันจันทร์–ศุกร์ 9.00–20.00 น., เสาร์–อาทิตย์ 9.00–19.00 น. (รับลูกค้าคนสุดท้ายตามเวลาปิด)",
    },
    coords: { lat: 13.677999290395206, lng: 100.62571691482964 },
    mapsQuery: "Bee Choo Udomsuk - Hair Loss Treatment",
  },
  {
    slug: "chaiyapruek",
    name: "Chaiyapruek",
    nameTh: "สาขาชัยพฤกษ์",
    region: "bangkok",
    area: { en: "Tha It, Pak Kret, Nonthaburi", th: "ท่าอิฐ ปากเกร็ด นนทบุรี" },
    phoneDisplay: "02-147-1459",
    phoneAltDisplay: "093-138-5214",
    phoneHref: "+6621471459",
    hours: {
      en: "Everyday 9am–8pm (last walk-in 7pm)",
      th: "ทุกวัน 9.00–20.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)",
    },
    coords: { lat: 13.8930982, lng: 100.4495541 },
  },
  {
    slug: "kallapaphruk",
    name: "Kallapaphruk",
    nameTh: "สาขากัลปพฤกษ์",
    region: "bangkok",
    area: { en: "Bang Khun Thian, Bangkok", th: "บางขุนเทียน กรุงเทพฯ" },
    phoneDisplay: "090-221-7745",
    phoneHref: "+66902217745",
    hours: { en: "Everyday 9am–8pm (last walk-in)", th: "ทุกวัน 9.00–20.00 น. (รับลูกค้าคนสุดท้าย)" },
    coords: { lat: 13.7110402941577, lng: 100.45910132461015 },
  },
  {
    slug: "chonburi",
    name: "Chonburi",
    nameTh: "สาขาชลบุรี",
    region: "upcountry",
    area: { en: "Mueang Chon Buri, Chon Buri", th: "เมืองชลบุรี ชลบุรี" },
    phoneDisplay: "096-904-7964",
    // Legacy tel: is malformed (tel:+%20+66969047964, an encoded literal space) — using
    // the corrected value.
    phoneHref: "+66969047964",
    hours: { en: "Everyday 9am–8pm (last walk-in)", th: "ทุกวัน 9.00–20.00 น. (รับลูกค้าคนสุดท้าย)" },
    coords: { lat: 13.3396377, lng: 100.9669745 },
  },
  {
    slug: "the-crystal",
    name: "The Crystal (Ekamai-Ramindra)",
    nameTh: "สาขาเดอะคริสตัล (เอกมัย-รามอินทรา)",
    region: "bangkok",
    area: { en: "Lat Phrao, Bangkok", th: "ลาดพร้าว กรุงเทพฯ" },
    phoneDisplay: "095-536-5556",
    // Legacy tel: is malformed (tel:+%20+66955365556%20) — using the corrected value.
    phoneHref: "+66955365556",
    hours: {
      en: "Everyday 10am–7pm (last walk-in)",
      th: "ทุกวัน 10.00–19.00 น. (รับลูกค้าคนสุดท้าย)",
    },
    coords: { lat: 13.811590995850063, lng: 100.6161469108795 },
  },
  {
    slug: "sammakorn",
    name: "Sammakorn",
    nameTh: "สาขาสัมมากร",
    region: "bangkok",
    area: { en: "Saphan Sung, Bangkok", th: "สะพานสูง กรุงเทพฯ" },
    phoneDisplay: "086-004-1122",
    phoneHref: "+66860041122",
    hours: { en: "Everyday 9am–7pm (last walk-in)", th: "ทุกวัน 9.00–19.00 น. (รับลูกค้าคนสุดท้าย)" },
    coords: { lat: 13.772174396765358, lng: 100.67410061082713 },
  },
  {
    slug: "prawet",
    name: "Prawet",
    nameTh: "สาขาประเวศ",
    region: "bangkok",
    area: { en: "Prawet, Bangkok", th: "ประเวศ กรุงเทพฯ" },
    phoneDisplay: "083-445-0589",
    phoneHref: "+66834450589",
    hours: {
      en: "Weekdays 9am–8pm, Weekends 9am–7pm (last walk-in)",
      th: "วันจันทร์–ศุกร์ 9.00–20.00 น., เสาร์–อาทิตย์ 9.00–19.00 น. (รับลูกค้าคนสุดท้ายตามเวลาปิด)",
    },
    coords: { lat: 13.7033444, lng: 100.7064603 },
  },
  {
    slug: "chatuchak",
    name: "Chatuchak (Prachachuen)",
    nameTh: "สาขา จตุจักร (ประชาชื่น)",
    region: "bangkok",
    area: { en: "Lat Yao, Chatuchak, Bangkok", th: "ลาดยาว จตุจักร กรุงเทพฯ" },
    phoneDisplay: "080-274-1868",
    phoneHref: "+66802741868",
    hours: { en: "Everyday 9am–7pm (last walk-in)", th: "ทุกวัน 9.00–19.00 น. (รับลูกค้าคนสุดท้าย)" },
    coords: { lat: 13.839663837717845, lng: 100.55273156587941 },
  },
  {
    slug: "suksawat",
    name: "Suksawat",
    nameTh: "สาขาสุขสวัสดิ์",
    region: "bangkok",
    area: { en: "Phra Pradaeng, Samut Prakan", th: "พระประแดง สมุทรปราการ" },
    phoneDisplay: "064-153-2662",
    phoneHref: "+66641532662",
    hours: { en: "Everyday 9am–7pm (last walk-in)", th: "ทุกวัน 9.00–19.00 น. (รับลูกค้าคนสุดท้าย)" },
    coords: { lat: 13.6534558, lng: 100.5193583 },
  },
  {
    slug: "korat",
    name: "Korat",
    nameTh: "สาขาโคราช",
    region: "upcountry",
    area: { en: "Mueang Nakhon Ratchasima, Korat", th: "เมืองนครราชสีมา โคราช" },
    phoneDisplay: "081-741-0763",
    phoneHref: "+66817410763",
    hours: {
      en: "Everyday 9am–8pm (last walk-in 7:30pm)",
      th: "ทุกวัน 9.00–20.00 น. (รับลูกค้าคนสุดท้าย 19.30 น.)",
    },
    coords: { lat: 14.9839575, lng: 102.0635698 },
  },
  {
    slug: "surat-thani",
    name: "Surat Thani",
    nameTh: "สาขาสุราษฎร์ธานี",
    region: "upcountry",
    area: { en: "Mueang Surat Thani, Surat Thani", th: "เมืองสุราษฎร์ธานี สุราษฎร์ธานี" },
    phoneDisplay: "064-380-8888",
    phoneHref: "+66643808888",
    hours: {
      en: "Weekdays 9am–8pm, Weekends 9am–7pm (last walk-in)",
      th: "วันจันทร์–ศุกร์ 9.00–20.00 น., เสาร์–อาทิตย์ 9.00–19.00 น. (รับลูกค้าคนสุดท้ายตามเวลาปิด)",
    },
    coords: { lat: 9.141184499999998, lng: 99.33985489999999 },
  },
  {
    slug: "chiang-mai",
    name: "Chiang Mai",
    nameTh: "สาขาเชียงใหม่",
    region: "upcountry",
    area: { en: "Hang Dong, Chiang Mai", th: "หางดง เชียงใหม่" },
    phoneDisplay: "082-123-4602",
    phoneHref: "+66821234602",
    hours: { en: "Everyday 9am–8pm (last walk-in)", th: "ทุกวัน 9.00–20.00 น. (รับลูกค้าคนสุดท้าย)" },
    coords: { lat: 18.72929095248222, lng: 98.94505282418133 },
  },
  {
    slug: "phutthamonthon",
    name: "Phutthamonthon",
    nameTh: "สาขาพุทธมณฑล",
    region: "bangkok",
    area: { en: "Sam Phran, Nakhon Pathom", th: "สามพราน นครปฐม" },
    phoneDisplay: "083-090-3672",
    phoneHref: "+66830903672",
    hours: {
      en: "Everyday 10am–8pm (last walk-in 7:30pm)",
      th: "ทุกวัน 10.00–20.00 น. (รับลูกค้าคนสุดท้าย 19.30 น.)",
    },
    coords: { lat: 13.7593365, lng: 100.3302113 },
  },
  {
    // ⚠ Added to the live site 2026-08-20 (this same day) — the Thai locations page has
    // not been updated to include it yet, so nameTh/area.th below are composed, not
    // transcribed. Flag for native-speaker + Crispin sign-off before launch.
    slug: "ayutthaya",
    name: "Ayutthaya",
    nameTh: "สาขาอยุธยา",
    region: "upcountry",
    area: { en: "Bang Sai, Phra Nakhon Si Ayutthaya", th: "บางไทร พระนครศรีอยุธยา" },
    phoneDisplay: "063-237-5413",
    phoneHref: "+66632375413",
    hours: { en: "Everyday 9am–8pm (last walk-in)", th: "ทุกวัน 9.00–20.00 น. (รับลูกค้าคนสุดท้าย)" },
    coords: { lat: 14.234499931887632, lng: 100.52441566682144 },
  },
];
