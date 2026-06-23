// Step 2: fetch each URL, extract <html lang>, hreflang alternates, title, description, canonical.
import { readFileSync, writeFileSync } from 'node:fs';
import { fetchUrl, invPath, parseAttrs, decodeEntities, safeDecodeURI, sleep } from './lib.mjs';

const headOf = (html) => {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : html;
};

function extract(html) {
  const htmlTag = (html.match(/<html\b[^>]*>/i) || [''])[0];
  const html_lang = parseAttrs(htmlTag).lang || '';
  const head = headOf(html);

  const links = [...head.matchAll(/<link\b[^>]*?>/gi)].map((m) => parseAttrs(m[0]));
  const alternates = links
    .filter((a) => (a.rel || '').toLowerCase() === 'alternate' && a.hreflang)
    .map((a) => ({ hreflang: a.hreflang, href: a.href || '' }));
  const canonical = (links.find((a) => (a.rel || '').toLowerCase() === 'canonical') || {}).href || '';

  const titleM = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleM ? decodeEntities(titleM[1].trim()) : '';

  const metas = [...head.matchAll(/<meta\b[^>]*?>/gi)].map((m) => parseAttrs(m[0]));
  const descMeta = metas.find((a) => (a.name || '').toLowerCase() === 'description');
  const description = descMeta ? decodeEntities(descMeta.content || '') : '';
  const ogLocale = (metas.find((a) => (a.property || '').toLowerCase() === 'og:locale') || {}).content || '';

  return { html_lang, alternates, canonical, title, description, og_locale: ogLocale };
}

async function main() {
  const urls = readFileSync(invPath('old-urls.txt'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
  const records = [];
  let i = 0;
  for (const url of urls) {
    i++;
    const r = await fetchUrl(url, { timeout: 25000, retries: 1 });
    const rec = {
      url,
      url_decoded: safeDecodeURI(url),
      status: r.status,
      redirected: r.redirected,
      final_url: r.finalUrl,
      error: r.error,
      html_lang: '', alternates: [], canonical: '', title: '', description: '', og_locale: '',
      fetched_at: new Date().toISOString(),
    };
    if (r.ok && r.body) Object.assign(rec, extract(r.body));
    records.push(rec);
    console.log(`[${i}/${urls.length}] ${r.status} lang=${rec.html_lang || '?'} alts=${rec.alternates.length}  ${rec.url_decoded}`);
    writeFileSync(invPath('pages.json'), JSON.stringify(records, null, 2)); // incremental save = crash-safe
    await sleep(350);
  }
  console.log(`\nWrote ${invPath('pages.json')} (${records.length} records)`);
}
main();
