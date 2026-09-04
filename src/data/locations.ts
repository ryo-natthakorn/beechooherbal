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
// `coords` PROVENANCE (corrected 2026-09-04): supplied by Ryo as one maps.app.goo.gl
// place link per outlet, resolved to the pin in each resolved URL's `!3d`/`!4d`
// parameters. The 17 source links are listed at the bottom of this file.
//   ⚠ TRAP: do NOT read the `@lat,lng` in a resolved Maps URL — that is the map's
//   VIEWPORT CENTRE, not the place. On these links the two disagree by up to 16 km
//   (Chaiyapruek), which is exactly how the previous coordinates went wrong.
// All 17 pins come from those links, with no exceptions.
//   Two lessons from a false alarm on Kallapaphruk (2026-09-04), both worth keeping:
//   a road name matching a branch name proves nothing (roads run for kilometres), and a
//   reverse geocode near a district boundary will contradict the real postal address.
//   Where a listing states a street address, THAT is the stronger evidence — check it
//   before moving any pin.
//
// The previous values claimed to be "the exact pin from each outlet's own live embed";
// that was disproven — 8 of 17 were >= 400 m out, Sai Mai by 23 km, Ayutthaya by 14 km.
// Every one of the 17 links was checked to resolve to a Bee Choo branch whose Google
// place name matches its outlet, so `mapsQuery` below is now Google's own verified
// place name for all 17 (it used to be present on only 4, with the rest falling back to
// a composed "Bee Choo {name} Thailand" guess).
//
// `coords` is NOT the Directions target — LocationsDirectory builds a name search from
// `mapsQuery`, deliberately, so the link lands on the real reviewed listing instead of
// dropping an anonymous pin. `coords` is the ground-truth location for schema/map use.
//
// `area` is a DERIVED, coarse district/province hint (reverse-geocoded from the
// CORRECTED coords via OpenStreetMap Nominatim, zoom 18) — NOT a verified street
// address. Most pins land at subdistrict/district precision with no house number (the
// outlets sit inside malls/plazas, which rarely geocode to a street-level POI). Do not
// upgrade `area` to a bold "Address:" line in the UI without Crispin confirming it — a
// wrong address is worse than none on a real business's page.
//   Re-derived in this pass, so ⚠ Thai needs native-speaker sign-off like any new UI
//   string: Sai Mai (new — its areaPending flag is now cleared, the pin is confirmed),
//   Ratchada (Din Daeng -> Huai Khwang), Kallapaphruk (Bang Khun Thian -> Phasi
//   Charoen), Phutthamonthon (Sam Phran -> Phutthamonthon), Ayutthaya (Bang Sai ->
//   Phra Nakhon Si Ayutthaya). The other 12 were derived from pins that were already
//   accurate and are left as they were.
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
  /** One line per day-range (1 line for "Everyday", 2 for a Weekdays/Weekends split).
   *  Every line states its OWN last-walk-in time explicitly — never a bare "(last
   *  walk-in)" — per Ryo's 2026-08-20 "should not be X, be consistent" feedback. Where
   *  the legacy source gave no walk-in time distinct from closing time, walk-in = close. */
  hours: { en: string[]; th: string[] };
  coords: { lat: number; lng: number };
  /** The `!2s` place name from the outlet's own map embed. Present on only 4 of 17 —
   *  the rest never had one on the legacy site either. */
  /** Google's own verified place NAME for this branch, resolved from `mapsUrl`.
   *  Not used to build links any more — it is the tripwire: re-resolve `mapsUrl` and
   *  compare, and a branch that was renamed or relocated shows up as a mismatch. */
  mapsQuery?: string;
  /** The Directions target: this outlet's canonical Google Maps PLACE link
   *  (maps.app.goo.gl/... or /maps/place/...). Never a /maps/search/ query by name — a
   *  name search opens a RESULTS LIST and lets Google pick which pin to show, which is
   *  how Chatuchak came to display the wrong location (reported 2026-09-04). */
  mapsUrl: string;
}

export const OUTLETS: Outlet[] = [
  {
    slug: "sai-mai",
    name: "Sai Mai",
    nameTh: "สาขา สิริ อเวนิว สายไหม",
    region: "bangkok",
    area: { en: "Sai Mai, Bangkok", th: "สายไหม กรุงเทพฯ" },
    phoneDisplay: "02-121-4419",
    phoneHref: "+6621214419",
    hours: {
      en: ["Weekdays: 9am–8pm (last walk-in 8pm)", "Weekends: 9am–7pm (last walk-in 7pm)"],
      th: ["วันจันทร์ – วันศุกร์: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 20.00 น.)", "วันเสาร์ – วันอาทิตย์: 9.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"],
    },
    coords: { lat: 13.9214388, lng: 100.660748 },
    mapsQuery: "Bee Choo Sai Mai - บีชู สายไหม",
    mapsUrl: "https://maps.app.goo.gl/hszg1q6i5ovMZjtH9",
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
      en: ["Everyday: 10:30am–9:30pm (last walk-in 8pm)"],
      th: ["ทุกวัน: 10.30 – 21.30 น. (รับลูกค้าคนสุดท้าย 20.00 น.)"],
    },
    coords: { lat: 13.7449758, lng: 100.5334774 },
    mapsQuery: "Bee Choo Siam Square - บีชู สยามสแควร์",
    mapsUrl: "https://maps.app.goo.gl/3KHVDCFpG314iep37",
  },
  {
    slug: "ratchada",
    name: "Ratchada",
    nameTh: "สาขา รัชดา",
    region: "bangkok",
    area: { en: "Huai Khwang, Bangkok", th: "ห้วยขวาง กรุงเทพฯ" },
    phoneDisplay: "06-1729-3434",
    phoneHref: "+66617293434",
    hours: {
      en: ["Everyday: 9am–7pm (last walk-in 6:30pm)"],
      th: ["ทุกวัน: 9.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 18.30 น.)"],
    },
    coords: { lat: 13.7867949, lng: 100.5752917 },
    mapsQuery: "Bee Choo Ratchada - บีชู รัชดา",
    mapsUrl: "https://maps.app.goo.gl/zpSvgfaTWcHFrbyN8",
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
      en: ["Weekdays: 9am–8pm (last walk-in 8pm)", "Weekends: 9am–7pm (last walk-in 7pm)"],
      th: ["วันจันทร์ – วันศุกร์: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 20.00 น.)", "วันเสาร์ – วันอาทิตย์: 9.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"],
    },
    coords: { lat: 13.6778917, lng: 100.6279435 },
    mapsQuery: "Bee Choo Udomsuk - บีชู อุดมสุข",
    mapsUrl: "https://maps.app.goo.gl/G9XqJr7YxqdfG4EW9",
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
      en: ["Everyday: 9am–8pm (last walk-in 7pm)"],
      th: ["ทุกวัน: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"],
    },
    coords: { lat: 13.8930759, lng: 100.449464 },
    mapsQuery: "Bee Choo Chaiyaphruek - บีชู ชัยพฤกษ์",
    mapsUrl: "https://maps.app.goo.gl/aFrCmrhpnT4NUfmY6",
  },
  {
    slug: "kallapaphruk",
    name: "Kallapaphruk",
    nameTh: "สาขากัลปพฤกษ์",
    region: "bangkok",
    area: { en: "Chom Thong, Bangkok", th: "จอมทอง กรุงเทพฯ" },
    phoneDisplay: "090-221-7745",
    phoneHref: "+66902217745",
    hours: { en: ["Everyday: 9am–8pm (last walk-in 8pm)"], th: ["ทุกวัน: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 20.00 น.)"] },
    // Verified address (from the branch's own Google listing, 2026-09-04):
    //   City Connect กัลปพฤกษ์ ห้อง B33, 55/75 Kanlapaphruek Rd, บางขุนเทียน,
    //   เขตจอมทอง กรุงเทพมหานคร 10150
    // ⚠ Do NOT "fix" this pin by reverse-geocoding it. The pin is ~100 m from the
    // Bang Khun Thian / Bang Wa boundary, so a reverse geocode reports "Bang Wa, Phasi
    // Charoen, 10160" — contradicting the real address above. `area` below therefore
    // follows the ADDRESS (Chom Thong), not the geocoder.
    // History, so this is not re-broken: on 2026-09-04 this pin was moved 1.5 km to the
    // legacy site's embed because that embed sat on Kanlapaphruek Road and the branch is
    // named after it. That reasoning was wrong — the road runs for kilometres and the
    // embed was on a different stretch. OpenStreetMap independently places the building
    // "ซิตี้คอนเนค กัลปพฤกษ์" 119 m from the pin below and 1,482 m from the legacy embed.
    coords: { lat: 13.7059313, lng: 100.4465747 },
    mapsQuery: "Bee Choo Kallapaphruk - บีชู กัลปพฤกษ์",
    mapsUrl: "https://maps.app.goo.gl/xpD5sY5ciDD1UHg78",
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
    hours: { en: ["Everyday: 9am–8pm (last walk-in 8pm)"], th: ["ทุกวัน: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 20.00 น.)"] },
    coords: { lat: 13.3395653, lng: 100.966991 },
    mapsQuery: "Bee Choo Chonburi - บีชู ชลบุรี",
    mapsUrl: "https://maps.app.goo.gl/AybfwJ4LQbbHowjr9",
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
      en: ["Everyday: 10am–7pm (last walk-in 7pm)"],
      th: ["ทุกวัน: 10.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"],
    },
    coords: { lat: 13.8115792, lng: 100.6188394 },
    mapsQuery: "Bee Choo Crystal Park (Ekamai-Ramindra) - บีชู คริสตัลปาร์ค (เอกมัย-รามอินทรา)",
    mapsUrl: "https://maps.app.goo.gl/S1P3sU3TCHUsnn5t7",
  },
  {
    slug: "sammakorn",
    name: "Sammakorn",
    nameTh: "สาขาสัมมากร",
    region: "bangkok",
    area: { en: "Saphan Sung, Bangkok", th: "สะพานสูง กรุงเทพฯ" },
    phoneDisplay: "086-004-1122",
    phoneHref: "+66860041122",
    hours: { en: ["Everyday: 9am–7pm (last walk-in 7pm)"], th: ["ทุกวัน: 9.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"] },
    coords: { lat: 13.7720839, lng: 100.6768173 },
    mapsQuery: "Bee Choo Sammakorn",
    mapsUrl: "https://maps.app.goo.gl/F6VfrosdUfydsbPG6",
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
      en: ["Weekdays: 9am–8pm (last walk-in 8pm)", "Weekends: 9am–7pm (last walk-in 7pm)"],
      th: ["วันจันทร์ – วันศุกร์: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 20.00 น.)", "วันเสาร์ – วันอาทิตย์: 9.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"],
    },
    coords: { lat: 13.6989818, lng: 100.7054455 },
    mapsQuery: "Bee Choo Prawet - บีชูประเวศ",
    mapsUrl: "https://maps.app.goo.gl/sR9qEnLQW8CzzYcs8",
  },
  {
    slug: "chatuchak",
    name: "Chatuchak (Prachachuen)",
    nameTh: "สาขา จตุจักร (ประชาชื่น)",
    region: "bangkok",
    area: { en: "Lat Yao, Chatuchak, Bangkok", th: "ลาดยาว จตุจักร กรุงเทพฯ" },
    phoneDisplay: "080-274-1868",
    phoneHref: "+66802741868",
    hours: { en: ["Everyday: 9am–7pm (last walk-in 7pm)"], th: ["ทุกวัน: 9.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"] },
    coords: { lat: 13.8398812, lng: 100.553069 },
    mapsQuery: "Bee Choo Chatuchak (Prachachuen) - บีชู จตุจักร (ประชาชื่น)",
    mapsUrl: "https://maps.app.goo.gl/VQ6m8SDwLeaexMa39",
  },
  {
    slug: "suksawat",
    name: "Suksawat",
    nameTh: "สาขาสุขสวัสดิ์",
    region: "bangkok",
    area: { en: "Phra Pradaeng, Samut Prakan", th: "พระประแดง สมุทรปราการ" },
    phoneDisplay: "064-153-2662",
    phoneHref: "+66641532662",
    hours: { en: ["Everyday: 9am–7pm (last walk-in 7pm)"], th: ["ทุกวัน: 9.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"] },
    coords: { lat: 13.6534558, lng: 100.5193583 },
    mapsQuery: "Bee Choo Suksawat - บีชู สุขสวัสดิ์",
    mapsUrl: "https://maps.app.goo.gl/iBix3JQthZx5mojq8",
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
      en: ["Everyday: 9am–8pm (last walk-in 7:30pm)"],
      th: ["ทุกวัน: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 19.30 น.)"],
    },
    coords: { lat: 14.9872254, lng: 102.0572744 },
    mapsQuery: "Bee Choo Korat - บีชู โคราช",
    mapsUrl: "https://maps.app.goo.gl/Nhyex9n9kPvtnVo29",
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
      en: ["Weekdays: 9am–8pm (last walk-in 8pm)", "Weekends: 9am–7pm (last walk-in 7pm)"],
      th: ["วันจันทร์ – วันศุกร์: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 20.00 น.)", "วันเสาร์ – วันอาทิตย์: 9.00 – 19.00 น. (รับลูกค้าคนสุดท้าย 19.00 น.)"],
    },
    coords: { lat: 9.1411649, lng: 99.3398456 },
    mapsQuery: "Bee Choo Surat Thani - บีชู สุราษฎร์ธานี",
    mapsUrl: "https://maps.app.goo.gl/1V5eZeAkuJcBuHij8",
  },
  {
    slug: "chiang-mai",
    name: "Chiang Mai",
    nameTh: "สาขาเชียงใหม่",
    region: "upcountry",
    area: { en: "Hang Dong, Chiang Mai", th: "หางดง เชียงใหม่" },
    phoneDisplay: "082-123-4602",
    phoneHref: "+66821234602",
    hours: { en: ["Everyday: 9am–8pm (last walk-in 8pm)"], th: ["ทุกวัน: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 20.00 น.)"] },
    coords: { lat: 18.7246124, lng: 98.9487462 },
    mapsQuery: "Bee Choo Chiang Mai - บีชู เชียงใหม่",
    mapsUrl: "https://maps.app.goo.gl/j2PtvWVB8nJHjeYM7",
  },
  {
    slug: "phutthamonthon",
    name: "Phutthamonthon",
    nameTh: "สาขาพุทธมณฑล",
    region: "bangkok",
    area: { en: "Phutthamonthon, Nakhon Pathom", th: "พุทธมณฑล นครปฐม" },
    phoneDisplay: "083-090-3672",
    phoneHref: "+66830903672",
    hours: {
      en: ["Everyday: 10am–8pm (last walk-in 7:30pm)"],
      th: ["ทุกวัน: 10.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 19.30 น.)"],
    },
    coords: { lat: 13.7586629, lng: 100.3298688 },
    mapsQuery: "Bee Choo Phutthamonthon - บีชู พุทธมณฑล",
    mapsUrl: "https://maps.app.goo.gl/eHLSu7Pmghts9Q2G8",
  },
  {
    // Added to the live EN page 2026-08-20T04:54; the TH page caught up mid-session at
    // 2026-08-20T07:38, so nameTh/hours.th below are now transcribed verbatim (not
    // composed — the file previously flagged them as a placeholder pending that update).
    slug: "ayutthaya",
    name: "Ayutthaya",
    nameTh: "สาขาอยุธยา",
    region: "upcountry",
    area: { en: "Phra Nakhon Si Ayutthaya", th: "พระนครศรีอยุธยา" },
    phoneDisplay: "063-237-5413",
    phoneHref: "+66632375413",
    // TH hours facts are from the live page (added 2026-08-20T07:38 — see
    // locations-parity's output), reformatted to the same "ทุกวัน:" template as every
    // other outlet for visual consistency across the directory — same times, not
    // composed from scratch.
    hours: { en: ["Everyday: 9am–8pm (last walk-in 8pm)"], th: ["ทุกวัน: 9.00 – 20.00 น. (รับลูกค้าคนสุดท้าย 20.00 น.)"] },
    coords: { lat: 14.3336293, lng: 100.6050204 },
    mapsQuery: "Bee Choo Ayutthaya - บีชู อยุธยา",
    mapsUrl: "https://maps.app.goo.gl/Lq94hu8NADGU2B7ZA",
  },
];
// ---------------------------------------------------------------------------------
// Source place links for `coords` / `mapsQuery` (Ryo, 2026-09-04). Re-resolve these to
// re-derive; read `!3d`/`!4d`, never `@`.
//   sai-mai        https://maps.app.goo.gl/hszg1q6i5ovMZjtH9
//   siam-square    https://maps.app.goo.gl/3KHVDCFpG314iep37
//   ratchada       https://maps.app.goo.gl/zpSvgfaTWcHFrbyN8
//   udomsuk        https://maps.app.goo.gl/G9XqJr7YxqdfG4EW9
//   chaiyapruek    https://maps.app.goo.gl/aFrCmrhpnT4NUfmY6
//   kallapaphruk   https://maps.app.goo.gl/xpD5sY5ciDD1UHg78
//   the-crystal    https://maps.app.goo.gl/S1P3sU3TCHUsnn5t7
//   sammakorn      https://maps.app.goo.gl/F6VfrosdUfydsbPG6
//   prawet         https://maps.app.goo.gl/sR9qEnLQW8CzzYcs8
//   chatuchak      https://maps.app.goo.gl/VQ6m8SDwLeaexMa39
//   suksawat       https://maps.app.goo.gl/iBix3JQthZx5mojq8
//   phutthamonthon https://maps.app.goo.gl/eHLSu7Pmghts9Q2G8
//   chonburi       https://maps.app.goo.gl/AybfwJ4LQbbHowjr9
//   korat          https://maps.app.goo.gl/Nhyex9n9kPvtnVo29
//   surat-thani    https://maps.app.goo.gl/1V5eZeAkuJcBuHij8
//   chiang-mai     https://maps.app.goo.gl/j2PtvWVB8nJHjeYM7
//   ayutthaya      https://maps.app.goo.gl/Lq94hu8NADGU2B7ZA
