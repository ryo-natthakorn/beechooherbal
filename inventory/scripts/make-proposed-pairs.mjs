// Generates inventory/proposed-pairs.json — the EN<->TH pairing the live site does NOT
// encode anywhere (no working hreflang / WPML translation links). Each Thai page is matched
// to its English topic by a UNIQUE token found in the live path/title (semantic, verified by
// reading both languages' titles), then resolved to the exact sitemap URL. Re-run after 02.
import { readFileSync, writeFileSync } from 'node:fs';
import { invPath, pathOf, langSide } from './lib.mjs';

// [enToken, thToken, confidence, note]  — enToken matches an EN path; thToken matches a TH path.
const SPECS = [
  ['^/$',                          '/th/home/',        'high', 'EN home / TH home (/th/ 301s to /th/home/)'],
  ['/about/',                      'เกี่ยวกับ',         'high', ''],
  ['/team/',                       '/th/ทีม/',          'high', ''],
  ['/locations/',                  'สถานที่',           'high', ''],
  ['frequently-asked',             'คำถาม',             'high', 'FAQ'],
  ['reviews-and-testimonials',     'รีวิว',             'high', 'Testimonials'],
  ['scalp-hair-loss-treatment-salon', 'ซาลอน',         'high', 'Main hair-loss treatment page'],
  ['get-rid-of-oily',              'หนังศีรษะมัน',      'high', 'Oily scalp'],
  ['cure-dandruff',                'รังแค',             'high', 'Dandruff'],
  ['reverse-premature-grey',       'หงอก',              'high', 'Grey/white hair'],
  ['repair-chemically-damaged',    'ผมเสีย',            'high', 'Chemically damaged/dry hair (TH title confirms)'],
  ['bacteria-infection-alopecia',  'ติดเชื้อ',          'high', 'Bacterial infection / alopecia (TH title confirms)'],
  ['postpartum-hair-loss',         'เฉียบพลัน',         'high', 'Postpartum (TH title: ผมร่วงสำหรับคุณแม่หลังคลอด)'],
  ['hair-transplant-vs-stem-cell', 'ปลูกผม',            'high', 'Herbal vs hair transplant'],
  ['hair-loss-treatment-cost',     'ราคา',              'high', 'Treatment cost/prices'],
  ['bee-choo-hair-care-products',  'แชมพู',             'high', 'Products (TH title: แชมพูบีชูและผลิตภัณฑ์)'],
  ['events-news-release',          'เหตุการณ์',         'medium', 'EN Events&News page <-> TH events page'],
];

function main() {
  const records = JSON.parse(readFileSync(invPath('pages.json'), 'utf8'));
  const en = records.filter((r) => langSide(r) === 'en');
  const th = records.filter((r) => langSide(r) === 'th');
  const findEn = (tok) =>
    tok === '^/$' ? en.filter((r) => pathOf(r.url) === '/') : en.filter((r) => pathOf(r.url).includes(tok));
  // The 17 structural pairs are all /th/ pages; restrict here so root Thai blog posts
  // (which share keywords like ซาลอน / รีวิว) don't collide.
  const findTh = (tok) => th.filter((r) => /^\/th\//.test(pathOf(r.url)) && pathOf(r.url).includes(tok));

  const pairs = [];
  const warnings = [];
  for (const [enTok, thTok, confidence, note] of SPECS) {
    const e = findEn(enTok), t = findTh(thTok);
    if (e.length !== 1) warnings.push(`EN token "${enTok}" matched ${e.length} (expected 1)`);
    if (t.length !== 1) warnings.push(`TH token "${thTok}" matched ${t.length} (expected 1)`);
    if (e.length && t.length)
      pairs.push({ en: e[0].url, th: t[0].url, confidence, note,
        en_title: e[0].title, th_title: t[0].title });
  }

  writeFileSync(invPath('proposed-pairs.json'), JSON.stringify({
    _note: 'Semantic EN<->TH pairing. The live site encodes NO translation links for these ' +
      'pages (hreflang is self-referential; the WPML switcher points every page to /th/). ' +
      'Each pair was matched by reading the live Thai + English titles. Confidence flagged per row. ' +
      'Regenerate with scripts/make-proposed-pairs.mjs after re-running 02-fetch-pages.mjs.',
    generated_at: new Date().toISOString(),
    pairs,
  }, null, 2));

  console.log(`Wrote ${invPath('proposed-pairs.json')} (${pairs.length} pairs)`);
  if (warnings.length) { console.log('WARNINGS:'); warnings.forEach((w) => console.log('  - ' + w)); }
  else console.log('All tokens resolved 1:1 cleanly.');
}
main();
