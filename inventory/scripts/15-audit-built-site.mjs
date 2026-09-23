// Read-only audit of every generated HTML page and its local media references.
// Run after npm run build. JSON on stdout; does not mutate the build or inventory.
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../../dist/', import.meta.url));
const files = (await readdir(dist, { recursive: true })).filter(f => f.endsWith('.html'));
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const results = [];
for (const file of files) {
  const html = (await readFile(path.join(dist, file), 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
  const route = '/' + file.replaceAll('\\', '/').replace(/index\.html$/, '');
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(m => m[0]);
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => m[0]);
  const canonical = attr(links.find(t => attr(t, 'rel') === 'canonical') || '', 'href');
  const alternates = links.filter(t => attr(t, 'hreflang')).map(t => ({ lang: attr(t, 'hreflang'), href: attr(t, 'href') }));
  const description = attr(metas.find(t => attr(t, 'name') === 'description') || '', 'content');
  const issues = [];
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  // Astro minifies an empty decorative alt="" to the valid bare alt attribute.
  for (const tag of images) if (!/\salt(?=[\s=>])/.test(tag)) issues.push('Image without alt attribute');
  const refs = new Set([...html.matchAll(/<(?:img|source|video)\b[^>]*>/g)].flatMap(m => {
    const tag = m[0];
    return [attr(tag, 'src'), attr(tag, 'poster'), ...(attr(tag, 'srcset') || '').split(',').map(s => s.trim().split(/\s+/)[0])];
  }).filter(s => s?.startsWith('/') && !s.startsWith('//')));
  for (const ref of refs) {
    try { await access(path.join(dist, decodeURIComponent(ref.split('?')[0]))); }
    catch { issues.push('Missing local media: ' + ref); }
  }
  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) issues.push(`H1 count: ${h1}`);
  if (!/<title>[^<]+<\/title>/.test(html)) issues.push('Missing title');
  if (!description) issues.push('Missing description');
  if (!route.endsWith('/404.html') && !canonical) issues.push('Missing canonical');
  // Unpaired legacy posts intentionally have no translation cluster (SEOHead).
  if (alternates.length && !['en', 'th', 'x-default'].every(lang => alternates.some(a => a.lang === lang))) issues.push('Incomplete hreflang cluster');
  results.push({ route, lang: attr(html.match(/<html\b[^>]*>/)?.[0] || '', 'lang'), h1, canonical, description, alternates, images: images.length, localMedia: refs.size, issues });
}
console.log(JSON.stringify({ pages: results.length, failed: results.filter(r => r.issues.length).length, results }, null, 2));
if (results.some(r => r.issues.length)) process.exitCode = 1;

