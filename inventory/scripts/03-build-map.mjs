// Step 3: build the EN<->TH map.
//  - en-th-map.csv          : best usable map = live hreflang pairs UNION semantic pairs (4 required cols + provenance)
//  - en-th-map.hreflang.csv : STRICT, only genuine cross-language hreflang links present on the live site
//  - en-th-map.json         : same rows as the best map, with source/confidence/note
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { invPath, analyze, buildBestMap, safeDecodeURI } from './lib.mjs';

const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const dec = safeDecodeURI;

function main() {
  const records = JSON.parse(readFileSync(invPath('pages.json'), 'utf8'));
  const { hreflangPairs } = analyze(records);
  const proposed = existsSync(invPath('proposed-pairs.json'))
    ? JSON.parse(readFileSync(invPath('proposed-pairs.json'), 'utf8')).pairs
    : [];

  const rows = buildBestMap(records, proposed, hreflangPairs);

  // Best usable map (human-readable, decoded URLs). Required columns first, provenance appended.
  const head = ['en_url', 'th_url', 'en_title', 'th_title', 'source', 'confidence', 'note'];
  const csv = [head.map(cell).join(',')];
  for (const r of rows)
    csv.push([dec(r.en_url), dec(r.th_url), r.en_title, r.th_title, r.source, r.confidence, r.note].map(cell).join(','));
  writeFileSync(invPath('en-th-map.csv'), csv.join('\n') + '\n');

  // Strict hreflang-only map (the literal "from hreflang" deliverable — sparse by design).
  const hHead = ['en_url', 'th_url', 'en_title', 'th_title'];
  const hCsv = [hHead.map(cell).join(',')];
  const byUrl = new Map(records.map((r) => [r.url, r]));
  for (const p of hreflangPairs)
    hCsv.push([dec(p.en_url), dec(p.th_url), byUrl.get(p.en_url)?.title || '', byUrl.get(p.th_url)?.title || ''].map(cell).join(','));
  writeFileSync(invPath('en-th-map.hreflang.csv'), hCsv.join('\n') + '\n');

  writeFileSync(invPath('en-th-map.json'), JSON.stringify(rows, null, 2));

  console.log(`Wrote en-th-map.csv (${rows.length} rows: ${rows.filter(r=>r.source==='hreflang').length} hreflang + ${rows.filter(r=>r.source==='semantic').length} semantic)`);
  console.log(`Wrote en-th-map.hreflang.csv (${hreflangPairs.length} live hreflang pairs)`);
}
main();
