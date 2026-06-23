// Step 1: collect every page URL from the sitemap into inventory/old-urls.txt
import { writeFileSync } from 'node:fs';
import { fetchUrl, invPath, ensureInv, SITE, sleep } from './lib.mjs';

const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);

async function main() {
  ensureInv();
  let indexUrl, indexXml;
  for (const c of [`${SITE}/sitemap_index.xml`, `${SITE}/sitemap.xml`]) {
    const r = await fetchUrl(c);
    console.log(`probe ${c} -> ${r.status}`);
    if (r.ok && /<(sitemapindex|urlset)/i.test(r.body)) { indexUrl = c; indexXml = r.body; break; }
  }
  if (!indexXml) { console.error('FATAL: no sitemap found'); process.exit(1); }
  console.log(`Using sitemap: ${indexUrl}`);

  const isIndex = /<sitemapindex/i.test(indexXml);
  const subSitemaps = isIndex ? locs(indexXml) : [indexUrl];
  console.log(`Sub-sitemaps: ${subSitemaps.length}`);

  const all = new Set();
  const perSitemap = {};
  for (const sm of subSitemaps) {
    let xml = indexXml;
    if (sm !== indexUrl) {
      const r = await fetchUrl(sm);
      if (!r.ok) { console.log(`  ${sm} -> ${r.status} (SKIP)`); perSitemap[sm] = 0; continue; }
      xml = r.body;
      await sleep(300);
    }
    const urls = locs(xml).filter((u) => !/\.xml(\?|$)/i.test(u));
    urls.forEach((u) => all.add(u));
    perSitemap[sm] = urls.length;
    console.log(`  ${sm} -> ${urls.length} urls`);
  }

  const sorted = [...all].sort();
  writeFileSync(invPath('old-urls.txt'), sorted.join('\n') + '\n');
  writeFileSync(invPath('sitemaps.json'), JSON.stringify({ indexUrl, perSitemap, total: sorted.length }, null, 2));
  console.log(`\nTOTAL URLS: ${sorted.length}`);
  console.log(`Wrote ${invPath('old-urls.txt')}`);
}
main();
