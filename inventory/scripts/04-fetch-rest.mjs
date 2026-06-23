// Step 4: pull all WP REST content (posts + pages), with WPML &lang=th / &lang=en variants.
import { writeFileSync } from 'node:fs';
import { fetchUrl, invPath, SITE, sleep } from './lib.mjs';

const MAX_PAGES = 50; // safety bound

async function pull(type, lang) {
  const tag = `${type}${lang ? `[${lang}]` : '[default]'}`;
  const items = [];
  const errors = [];
  let totalPages = null;
  for (let page = 1; page <= MAX_PAGES; page++) {
    let url = `${SITE}/wp-json/wp/v2/${type}?per_page=100&_embed&page=${page}`;
    if (lang) url += `&lang=${lang}`;
    const r = await fetchUrl(url, { timeout: 30000, retries: 1 });

    if (r.status === 400 || r.status === 404) break; // past last page
    if (r.status >= 500) { errors.push({ page, status: r.status, url }); continue; } // note + skip (per spec)
    if (!r.ok) { errors.push({ page, status: r.status, url }); break; }

    let data;
    try { data = JSON.parse(r.body); } catch (e) { errors.push({ page, status: 'parse-error', url }); break; }
    if (!Array.isArray(data) || data.length === 0) break;

    items.push(...data);
    if (totalPages == null && r.headers['x-wp-totalpages'])
      totalPages = parseInt(r.headers['x-wp-totalpages'], 10);
    console.log(`  ${tag} page ${page}: +${data.length} (total ${items.length}${totalPages ? '/' + totalPages + 'pg' : ''})`);

    if (data.length < 100) break;
    if (totalPages && page >= totalPages) break;
    await sleep(400);
  }
  return { items, errors, count: items.length };
}

async function pullAll(type) {
  console.log(`\n== ${type} ==`);
  const out = { type, fetched_at: new Date().toISOString(), variants: {}, errors: [] };
  for (const lang of [null, 'th', 'en']) {
    const key = lang || 'default';
    const { items, errors, count } = await pull(type, lang);
    out.variants[key] = items;
    if (errors.length) out.errors.push({ variant: key, errors });
    console.log(`  ${type}[${key}] => ${count} items, ${errors.length} errors`);
  }
  out.counts = Object.fromEntries(Object.entries(out.variants).map(([k, v]) => [k, v.length]));
  return out;
}

async function main() {
  const posts = await pullAll('posts');
  writeFileSync(invPath('rest-posts.json'), JSON.stringify(posts, null, 2));
  const pages = await pullAll('pages');
  writeFileSync(invPath('rest-pages.json'), JSON.stringify(pages, null, 2));

  console.log('\n--- REST summary ---');
  console.log('posts:', JSON.stringify(posts.counts), posts.errors.length ? `(errors: ${JSON.stringify(posts.errors)})` : '');
  console.log('pages:', JSON.stringify(pages.counts), pages.errors.length ? `(errors: ${JSON.stringify(pages.errors)})` : '');
  console.log(`Wrote ${invPath('rest-posts.json')} and ${invPath('rest-pages.json')}`);
}
main();
