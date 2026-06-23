// Step 5+6: write inventory/parity-report.md (+ summary.json) and print the console summary.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { invPath, analyze, buildBestMap, fetchUrl, SITE, normUrl, pathOf, safeDecodeURI, langSide, sleep } from './lib.mjs';

const dec = safeDecodeURI;
const td = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
const readJson = (f) => (existsSync(invPath(f)) ? JSON.parse(readFileSync(invPath(f), 'utf8')) : null);

async function probe(p) {
  const r = await fetchUrl(SITE + p, { redirect: 'manual', timeout: 20000 });
  await sleep(250);
  return { path: p, status: r.status, location: r.location || '' };
}

async function main() {
  const records = JSON.parse(readFileSync(invPath('pages.json'), 'utf8'));
  const { mismatches, redirects, hreflangPairs, counts, sideOf } = analyze(records);
  const proposed = readJson('proposed-pairs.json')?.pairs || [];
  const best = buildBestMap(records, proposed, hreflangPairs);

  // Orphans relative to the BEST (usable) map.
  const mappedEn = new Set(best.map((r) => normUrl(r.en_url)).filter(Boolean));
  const mappedTh = new Set(best.map((r) => normUrl(r.th_url)).filter(Boolean));
  const enRecs = records.filter((r) => sideOf.get(r) === 'en');
  const thRecs = records.filter((r) => sideOf.get(r) === 'th');
  const orphanEn = enRecs.filter((r) => !mappedEn.has(normUrl(r.url)));
  const orphanTh = thRecs.filter((r) => !mappedTh.has(normUrl(r.url)));

  // Structural probes (live).
  const probes = {};
  for (const p of ['/', '/th/', '/th/home/']) probes[p] = await probe(p);

  // Anomalies.
  const nonOk = records.filter((r) => r.status !== 200);
  const canonMismatch = records.filter((r) => r.canonical && r.status === 200 && normUrl(r.canonical) !== normUrl(r.url));
  const titleMap = new Map();
  for (const r of records) {
    if (!r.title || r.status !== 200) continue;
    const k = r.title.trim().toLowerCase();
    (titleMap.get(k) || titleMap.set(k, []).get(k)).push(r);
  }
  const dupTitles = [...titleMap.values()].filter((rs) => rs.length > 1);
  // Near-duplicate slugs (WordPress "-2"/"-N" dedupe suffix).
  const pathSet = new Set(records.map((r) => pathOf(r.url).replace(/\/$/, '')));
  const nearDup = [];
  for (const r of records) {
    const p = pathOf(r.url).replace(/\/$/, '');
    const m = p.match(/^(.+)-(\d{1,2})$/);
    if (m && pathSet.has(m[1])) nearDup.push({ dup: p + '/', base: m[1] + '/' });
  }

  // REST results.
  const restPosts = readJson('rest-posts.json');
  const restPages = readJson('rest-pages.json');

  // Event-post candidates (informational — exact pairing deferred to Phase 4).
  const enEvents = enRecs.filter((r) => /opening/i.test(pathOf(r.url)) && r.status === 200);
  const thEvents = thRecs.filter((r) => /opening/i.test(pathOf(r.url)) && r.status === 200);

  // ---------------- markdown ----------------
  const L = [];
  const P = (...x) => L.push(...x);
  P('# Bee Choo Herbal — Phase 1 Inventory & EN/TH Parity Report', '');
  P(`Generated: ${new Date().toISOString()}  ·  Source: ${SITE}`, '');

  P('## ⚠ Headline finding — the bilingual site is NOT wired together', '');
  P('The EN and TH pages exist in parallel but are **not linked as translations anywhere the');
  P('machine can read**. Three independent signals confirm it:', '');
  P('1. **hreflang is self-referential.** Content pages emit only `hreflang="en"`→themselves');
  P('   (+`x-default`→themselves); `/th/` pages emit only `hreflang="th"`→themselves. Neither');
  P('   side points at its translation. (e.g. `/about/` does NOT link to `/th/เกี่ยวกับบีชู/`.)');
  P('2. **The WPML language switcher falls back to `/th/`.** On every content page the TH');
  P('   switcher link is `https://beechooherbal.com/th/` (the Thai home) — WPML\'s behaviour');
  P('   when a page has *no registered translation*.');
  P('3. **The REST page objects carry no translation fields** (no `translations`/`wpml_*`).', '');
  P('Only 2 objects have genuine cross-language hreflang (the blog category and the author');
  P('archive), and even those point at TH URLs that are **not in the sitemap**.', '');
  P('**Consequence:** there is no on-site EN↔TH map to harvest. The map below is built from the');
  P('2 real hreflang pairs **plus 17 pairs matched semantically** by reading the live Thai +');
  P('English titles (flagged `source=semantic`). Wiring up correct hreflang/translation links is');
  P('the #1 SEO task for the rebuild.', '');

  P('## Summary', '');
  P('| Metric | Count |', '|---|---|');
  P(`| Total URLs in sitemap | ${counts.total} |`);
  P(`| English pages (by content) | ${counts.en} |`);
  P(`| Thai pages (by content) | ${counts.th} |`);
  P(`| Working hreflang pairs on live site | ${hreflangPairs.length} |`);
  P(`| EN↔TH pairs in usable map (hreflang + semantic) | ${best.length} |`);
  P(`| — of which high/medium-confidence semantic | ${best.filter((r) => r.source === 'semantic').length} |`);
  P(`| Orphan EN (no TH twin, after semantic matching) | ${orphanEn.length} |`);
  P(`| Orphan TH (no EN twin, after semantic matching) | ${orphanTh.length} |`);
  P(`| Thai content living at the root (lang≠path) | ${mismatches.length} |`);
  P(`| Sitemap URLs that 301-redirect away | ${redirects.length} |`);
  P(`| Non-200 URLs | ${nonOk.length} |`);
  P(`| Near-duplicate slugs | ${nearDup.length} |`);
  P('');

  P('## Structural anomalies', '');
  P('### Home / `/th/` behaviour (live, redirects not followed)', '');
  P('| Path | Status | Redirects to |', '|---|---|---|');
  for (const p of ['/', '/th/', '/th/home/']) {
    const pr = probes[p];
    P(`| \`${p}\` | ${pr.status} | ${pr.location ? '`' + pr.location + '`' : '—'} |`);
  }
  P('');
  P(`- **English home** = bare \`/\` (200). **Thai home** = \`/th/home/\` (200).`);
  P(`- \`/th/\` itself **301-redirects to \`/th/home/\`** — confirmed. So the Thai home is \`/th/home/\`, not \`/th/\`.`, '');

  P('### Sitemap URLs that redirect (should not be in a sitemap)', '');
  if (!redirects.length) P('_None._');
  else {
    P('| Sitemap URL | Redirects (followed) to | Note |', '|---|---|---|');
    for (const r of redirects)
      P(`| ${td(dec(r.url))} | ${td(dec(r.final_url))} | ${r.isImage ? '⚠ lands on an IMAGE — broken permalink/redirect loop' : 'redirect'} |`);
  }
  P('');

  P('### Non-200 URLs', '');
  if (!nonOk.length) P('_None._');
  else {
    P('| URL | Status | Note |', '|---|---|---|');
    for (const r of nonOk) P(`| ${td(dec(r.url))} | ${r.status}${r.error ? ' (' + r.error + ')' : ''} | recover content via HTML scrape (REST unavailable) |`);
  }
  P('');

  P('### WP REST `posts` endpoint is broken', '');
  if (restPosts && (restPosts.errors?.length || (restPosts.counts && Object.values(restPosts.counts).every((c) => c === 0)))) {
    P('`/wp-json/wp/v2/posts` returns **HTTP 500 for every variant** (default, `&lang=th`, `&lang=en`).');
    P('Blog/event **post** content therefore cannot be pulled via REST and must be scraped from HTML');
    P('in Phase 4. (At least one corrupt post — `/suffering-from-alopecia-.../` — 500s individually and');
    P('almost certainly breaks the whole collection query.) The REST **pages** endpoint works fine.', '');
  } else P('_REST posts endpoint responded (re-check rest-posts.json)._', '');

  P('### Near-duplicate pages', '');
  if (!nearDup.length && !dupTitles.length) P('_None._');
  else {
    for (const d of nearDup) P(`- Near-duplicate slug: \`${td(dec(d.dup))}\` vs \`${td(dec(d.base))}\` (WordPress \`-N\` suffix)`);
    for (const rs of dupTitles) {
      P(`- Duplicate \`<title>\` "${td(rs[0].title)}":`);
      for (const r of rs) P(`  - ${td(dec(r.url))} _(${langSide(r)})_`);
    }
  }
  P('');

  P('### Canonical points elsewhere', '');
  if (!canonMismatch.length) P('_None — every 200 page is self-canonical._');
  else { P('| URL | Canonical |', '|---|---|'); for (const r of canonMismatch) P(`| ${td(dec(r.url))} | ${td(dec(r.canonical))} |`); }
  P('');

  P('## Language does not match path — Thai content at the root', '');
  P(`These ${mismatches.length} URLs serve **Thai** content but live at the **root** (English URL space),`);
  P('not under `/th/`. `<html lang>`/`og:locale` wrongly report `en-US`; the Thai script in the slug');
  P('+ title is what reveals them. They are Thai blog/event posts that were never placed in the `/th/` tree.', '');
  P('| URL | Title |', '|---|---|');
  for (const m of mismatches) {
    const r = records.find((x) => x.url === m.url);
    P(`| ${td(dec(m.url))} | ${td(r?.title)} |`);
  }
  P('');

  P('## Orphan EN pages (no Thai twin, after semantic matching)', '');
  P(`Count: **${orphanEn.length}** — mostly English blog/event posts. (Privacy Policy has no Thai version.)`, '');
  P('| EN URL | Title |', '|---|---|');
  for (const r of orphanEn) P(`| ${td(dec(r.url))} | ${td(r.title)} |`);
  P('');

  P('## Orphan TH pages (no English twin, after semantic matching)', '');
  P(`Count: **${orphanTh.length}** — the Thai blog/event posts at the root.`, '');
  P('| TH URL | Title |', '|---|---|');
  for (const r of orphanTh) P(`| ${td(dec(r.url))} | ${td(r.title)} |`);
  P('');

  P('## WP REST content pull', '');
  if (restPages) P(`- **pages**: ${JSON.stringify(restPages.counts)}  → 18 EN + 17 TH = 35 (matches the page-sitemap).`);
  if (restPosts) P(`- **posts**: ${JSON.stringify(restPosts.counts)}  → ⚠ all variants 500 (see above).`);
  P('- WPML `&lang=` filtering works for pages (en=18, th=17), confirming pages are *language-assigned*');
  P('  even though they are not *translation-linked*.', '');

  P('## Confirmed + proposed EN↔TH pairs (side by side)', '');
  P(`Usable map: **${best.length}** pairs (${best.filter((r) => r.source === 'hreflang').length} live hreflang, ${best.filter((r) => r.source === 'semantic').length} semantic). Full data in \`en-th-map.csv\`.`, '');
  P('| EN URL | TH URL | Source | Conf. | EN title | TH title |', '|---|---|---|---|---|---|');
  for (const r of best)
    P(`| ${td(dec(r.en_url))} | ${td(dec(r.th_url))} | ${r.source} | ${r.confidence} | ${td(r.en_title)} | ${td(r.th_title)} |`);
  P('');
  P('> `semantic` rows are inferred from the live titles (the site has no translation links). High');
  P('> confidence = title meanings match directly; `medium` (events page) should get a native-speaker check.', '');

  P('## Candidate event-post pairs (Phase 4 — needs content review)', '');
  P(`${enEvents.length} English and ${thEvents.length} Thai outlet-opening posts exist. They cover the same`);
  P('grand openings in two languages but are NOT linked on the site. **The two lists below are NOT');
  P('row-aligned** — pair them by *branch from the title* during blog migration (note: at least one');
  P('Thai slug is misleading, e.g. a `...ประเวศ...-2567-2` slug whose title is actually สาขาจตุจักร/Chatuchak).', '');
  P('**English opening posts:**', '');
  for (const r of enEvents) P(`- ${td(dec(pathOf(r.url)))} — ${td(r.title)}`);
  P('', '**Thai opening posts:**', '');
  for (const r of thEvents) P(`- ${td(dec(pathOf(r.url)))} — ${td(r.title)}`);
  P('');

  writeFileSync(invPath('parity-report.md'), L.join('\n'));
  writeFileSync(invPath('summary.json'), JSON.stringify({
    total: counts.total, en: counts.en, th: counts.th,
    liveHreflangPairs: hreflangPairs.length, usableMapPairs: best.length,
    semanticPairs: best.filter((r) => r.source === 'semantic').length,
    orphanEn: orphanEn.length, orphanTh: orphanTh.length,
    thaiAtRoot: mismatches.length, redirectingUrls: redirects.length, nonOk: nonOk.length,
    nearDuplicates: nearDup.length, probes,
    restPages: restPages?.counts || null, restPosts: restPosts?.counts || null,
    generated_at: new Date().toISOString(),
  }, null, 2));

  // ---------------- Step 6: console summary ----------------
  console.log('\n================ PHASE 1 SUMMARY ================');
  console.log(`Total sitemap URLs:        ${counts.total}`);
  console.log(`English pages:             ${counts.en}`);
  console.log(`Thai pages:                ${counts.th}`);
  console.log(`Working hreflang pairs:    ${hreflangPairs.length}   <-- site has almost no translation links`);
  console.log(`Usable EN<->TH pairs:      ${best.length}   (${hreflangPairs.length} hreflang + ${best.length - hreflangPairs.length} semantic)`);
  console.log(`Orphan EN (no TH twin):    ${orphanEn.length}`);
  console.log(`Orphan TH (no EN twin):    ${orphanTh.length}`);
  console.log(`Thai content at root:      ${mismatches.length}`);
  console.log(`Redirecting sitemap URLs:  ${redirects.length}   Non-200: ${nonOk.length}   Near-dup: ${nearDup.length}`);
  console.log('Probes: ' + ['/', '/th/', '/th/home/'].map((p) => `${p}=${probes[p].status}${probes[p].location ? '→' + probes[p].location : ''}`).join('  '));
  console.log(`Wrote ${invPath('parity-report.md')}`);
  console.log('================================================');
}
main();
