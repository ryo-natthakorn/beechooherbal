// Shared helpers for the beechooherbal.com Phase-1 inventory pipeline.
// No external dependencies — uses Node 18+ global fetch / AbortSignal.timeout.
import { setTimeout as sleep } from 'node:timers/promises';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE = 'https://beechooherbal.com';
export const UA =
  'Mozilla/5.0 (compatible; BeeChooInventoryBot/1.0; +https://beechooherbal.com)';

const here = path.dirname(fileURLToPath(import.meta.url));
export const INV_DIR = path.resolve(here, '..'); // -> inventory/
export function invPath(...p) {
  return path.join(INV_DIR, ...p);
}
export function ensureInv() {
  mkdirSync(INV_DIR, { recursive: true });
}
export { sleep };

// Fetch with timeout + one retry. Never throws — returns a normalized object.
export async function fetchUrl(
  url,
  { timeout = 20000, retries = 1, method = 'GET', redirect = 'follow' } = {}
) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        redirect,
        headers: { 'User-Agent': UA, 'Accept-Language': 'en' },
        signal: AbortSignal.timeout(timeout),
      });
      const body = method === 'HEAD' ? '' : await res.text();
      return {
        ok: res.ok,
        status: res.status,
        finalUrl: res.url,
        redirected: res.redirected,
        location: res.headers.get('location') || '',
        headers: Object.fromEntries(res.headers.entries()),
        body,
        error: null,
      };
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await sleep(1500);
    }
  }
  return {
    ok: false, status: 0, finalUrl: url, redirected: false, location: '',
    headers: {}, body: '', error: String(lastErr),
  };
}

// --- tiny HTML helpers (regex-based, good enough for <head> metadata) ---
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…',
  ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
};
export function decodeEntities(s) {
  if (!s) return s;
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => ENTITIES[n] ?? m);
}
export function parseAttrs(tag) {
  const attrs = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  while ((m = re.exec(tag))) attrs[m[1].toLowerCase()] = m[3] ?? m[4] ?? m[5] ?? '';
  return attrs;
}
export function safeDecodeURI(u) {
  try { return decodeURIComponent(u); } catch { return u; }
}

// Normalize a URL for matching: lowercase host, decoded path, trailing slash, no hash/query.
export function normUrl(u) {
  if (!u) return '';
  try {
    const x = new URL(u);
    let p = safeDecodeURI(x.pathname);
    if (!p.endsWith('/')) p += '/';
    return `${x.protocol}//${x.host.toLowerCase()}${p}`;
  } catch {
    return u;
  }
}
export function pathOf(u) {
  try { return safeDecodeURI(new URL(u).pathname); } catch { return u; }
}

const THAI = /[฀-๿]/;
// Determine a page's CONTENT language.
// NOTE: on this site <html lang> and og:locale are UNRELIABLE — the WPML default
// (en-US / en_US) is emitted site-wide, including on Thai posts published at the root.
// So Thai script in the path/title and the /th/ prefix are the trustworthy signals.
export function langSide(rec) {
  const path = pathOf(rec.url);
  const og = (rec.og_locale || '').toLowerCase();
  const html = (rec.html_lang || '').toLowerCase();
  if (/^\/th(\/|$)/.test(path)) return 'th';
  if (og.startsWith('th') || html.startsWith('th')) return 'th';
  if (THAI.test(path) || THAI.test(rec.title || '')) return 'th'; // Thai content at the root
  return 'en';
}

// A sitemap URL that 301/302s away, or whose followed redirect lands somewhere odd.
export function redirectInfo(rec) {
  if (!rec.redirected) return null;
  const finalPath = pathOf(rec.final_url || '');
  const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(finalPath);
  return { url: rec.url, final_url: rec.final_url, isImage };
}

// Build the EN<->TH map + parity classifications purely from hreflang in pages.json.
export function analyze(records) {
  const byNorm = new Map();
  for (const r of records) byNorm.set(normUrl(r.url), r);
  const resolve = (href) => byNorm.get(normUrl(href));
  const sideOf = new Map(records.map((r) => [r, langSide(r)]));
  const altHref = (r, lang) =>
    (r.alternates || []).find((a) => (a.hreflang || '').toLowerCase().startsWith(lang))?.href || '';

  const rowByKey = new Map();
  const upsert = (enRec, enHref, thRec, thHref) => {
    const enU = enRec ? enRec.url : enHref || '';
    const thU = thRec ? thRec.url : thHref || '';
    const key = normUrl(enU) || 'TH::' + normUrl(thU);
    const prev = rowByKey.get(key) || {};
    rowByKey.set(key, {
      en_url: enU || prev.en_url || '',
      th_url: thU || prev.th_url || '',
      en_title: enRec?.title || prev.en_title || '',
      th_title: thRec?.title || prev.th_title || '',
    });
  };

  for (const r of records) {
    if (sideOf.get(r) === 'en') {
      const thHref = altHref(r, 'th');
      upsert(r, r.url, thHref ? resolve(thHref) : null, thHref);
    } else {
      const enHref = altHref(r, 'en');
      upsert(enHref ? resolve(enHref) : null, enHref, r, r.url);
    }
  }

  const pairs = [...rowByKey.values()].sort((a, b) =>
    (a.en_url || a.th_url).localeCompare(b.en_url || b.th_url)
  );
  const matched = pairs.filter((p) => p.en_url && p.th_url);
  const orphanEn = pairs.filter((p) => p.en_url && !p.th_url);
  const orphanTh = pairs.filter((p) => p.th_url && !p.en_url);

  // Language vs. path mismatches.
  const mismatches = [];
  for (const r of records) {
    const side = sideOf.get(r);
    const p = pathOf(r.url);
    const underTh = /^\/th(\/|$)/.test(p);
    if (side === 'th' && !underTh)
      mismatches.push({ url: r.url, path: p, lang: r.html_lang || side, note: 'Thai content NOT under /th/' });
    if (side === 'en' && underTh)
      mismatches.push({ url: r.url, path: p, lang: r.html_lang || side, note: 'English content under /th/' });
  }

  // GENUINE cross-language hreflang pairs (the page actually links to a different-language URL).
  const hreflangPairs = [];
  for (const r of records) {
    const side = sideOf.get(r);
    const other = side === 'en' ? 'th' : 'en';
    const href = altHref(r, other);
    if (!href) continue;
    const otherUnderTh = /^\/th(\/|$)/.test(pathOf(href));
    const linksAcross = other === 'th' ? otherUnderTh : !otherUnderTh;
    if (linksAcross && normUrl(href) !== normUrl(r.url))
      hreflangPairs.push(side === 'en'
        ? { en_url: r.url, th_url: href }
        : { en_url: href, th_url: r.url });
  }

  // Redirecting sitemap URLs (a sitemap should not list URLs that 301 away).
  const redirects = records.map(redirectInfo).filter(Boolean);

  const counts = {
    total: records.length,
    en: records.filter((r) => sideOf.get(r) === 'en').length,
    th: records.filter((r) => sideOf.get(r) === 'th').length,
    matched: matched.length,
    orphanEn: orphanEn.length,
    orphanTh: orphanTh.length,
    hreflangPairs: hreflangPairs.length,
  };
  return { pairs, matched, orphanEn, orphanTh, mismatches, redirects, hreflangPairs, counts, sideOf };
}

// Best usable EN<->TH map = genuine hreflang pairs + curated semantic pairs (proposed-pairs.json).
// The site itself contains no translation links for content pages, so semantic pairs are
// inferred by reading the live Thai/English titles and clearly flagged with a confidence.
export function buildBestMap(records, proposed, hreflangPairs) {
  const byNorm = new Map(records.map((r) => [normUrl(r.url), r]));
  const find = (u) => byNorm.get(normUrl(u));
  const titleOf = (u) => find(u)?.title || '';
  const rows = [];
  const seen = new Set();
  const add = (en, th, source, confidence, note) => {
    const key = normUrl(en) + '|' + normUrl(th);
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({
      en_url: en || '', th_url: th || '',
      en_title: titleOf(en), th_title: titleOf(th),
      source, confidence, note: note || '',
    });
  };
  for (const p of hreflangPairs) add(p.en_url, p.th_url, 'hreflang', 'confirmed', 'live hreflang link');
  for (const p of proposed) {
    // resolve to the canonical sitemap URL where the page exists, else keep the given path
    const en = find(p.en)?.url || (p.en ? new URL(p.en, SITE).href : '');
    const th = find(p.th)?.url || (p.th ? new URL(p.th, SITE).href : '');
    add(en, th, 'semantic', p.confidence || 'medium', p.note);
  }
  rows.sort((a, b) => (a.en_url || a.th_url).localeCompare(b.en_url || b.th_url));
  return rows;
}
