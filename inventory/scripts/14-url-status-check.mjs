// inventory/scripts/14-url-status-check.mjs
// Does every URL the old site published still resolve on the new one?
//
// Run against a Vercel preview BEFORE pointing DNS:
//   BASE_URL=https://<preview>.vercel.app npm run url-check
// Or against production after cutover:
//   npm run url-check
//
// This is the Phase-5 safety net CLAUDE.md asks for and never had. It is the HTTP
// complement to 06-copy-parity.mjs: that script asks "is the COPY still there?" by
// diffing text against the WP REST snapshot, and never issues a request. This one
// asks "does the URL still ANSWER?" and never looks at content. A page can pass one
// and fail the other, which is exactly why both exist.
//
// What counts as a pass: HTTP 200, or a redirect chain that ends in 200. Anything
// else — 404, 500, a chain that dead-ends, a timeout — is a failure and exits 1, so
// this can gate a deploy in CI.
//
// Two sources of URLs, because neither alone is complete:
//   1. inventory/old-urls.txt — the 92 URLs from the legacy sitemap. These are what
//      Google has indexed, so a 404 here is a real ranking loss.
//   2. vercel.json's redirect sources — 106 rules that only earn their place if they
//      actually fire. Reading them from the file (rather than a hardcoded list) means
//      this check grows automatically the next time `npm run redirects` adds a rule.
//
// Redirect chains longer than one hop are reported as a WARNING, not a failure: they
// still resolve, but each hop leaks a little ranking signal and usually means two
// rules should be collapsed into one.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchUrl, pathOf } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = (process.env.BASE_URL || 'https://beechooherbal.com').replace(/\/$/, '');

const MAX_HOPS = 5; // a chain longer than this is broken by definition
const CONCURRENCY = 8; // polite against a real host; the whole run is ~200 requests

// A wildcard `source` cannot be fetched literally — ":path*" is a pattern, not a URL.
// Substitute a path that genuinely existed on the WordPress site so the rule is
// exercised the way a real inbound link would exercise it. If a future wildcard is
// added to vercel.json without a sample here, it is SKIPPED and reported as such
// rather than silently passing.
//
// Currently EMPTY, and that is the correct state: vercel.json has no wildcard rules.
// The /wp-content/uploads/ namespace is covered by 388 one-to-one image rules (each
// old photo URL 301s to the article that used it) rather than a catch-all, so every
// one of them is fetched and verified individually by this script — which is strictly
// better coverage than sampling a wildcard. See inventory/scripts/10-redirects.mjs.
const WILDCARD_SAMPLES = {};

function targets() {
  const rows = [];
  const seen = new Set();
  const add = (urlPath, origin) => {
    if (!urlPath || seen.has(urlPath)) return;
    seen.add(urlPath);
    rows.push({ path: urlPath, origin });
  };

  // 1. Legacy sitemap URLs -> paths (they are absolute on the production domain).
  const sitemap = readFileSync(path.join(ROOT, 'inventory', 'old-urls.txt'), 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  for (const url of sitemap) add(pathOf(url), 'sitemap');

  // 2. Every redirect source in vercel.json.
  const { redirects } = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  for (const rule of redirects) {
    if (rule.source.includes(':') || rule.source.includes('*')) {
      const sample = WILDCARD_SAMPLES[rule.source];
      if (!sample) {
        rows.push({ path: rule.source, origin: 'redirect', skip: 'no WILDCARD_SAMPLES entry' });
        continue;
      }
      add(sample, 'redirect(wildcard)');
      continue;
    }
    add(rule.source, 'redirect');
  }
  return rows;
}

// Walks a redirect chain by hand (redirect: 'manual') so every hop is visible —
// `redirect: 'follow'` would collapse a 4-hop chain into one indistinguishable 200.
async function check(row) {
  if (row.skip) return { ...row, ok: false, skipped: true, detail: row.skip };

  const chain = [];
  let url = new URL(row.path, BASE).href;

  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    const res = await fetchUrl(url, { redirect: 'manual', retries: 1 });

    if (res.error) return { ...row, ok: false, chain, detail: `request failed: ${res.error}` };

    if (res.status >= 300 && res.status < 400) {
      if (!res.location) {
        return { ...row, ok: false, chain, detail: `${res.status} with no Location header` };
      }
      // Location may be relative; resolve against the URL that produced it.
      url = new URL(res.location, url).href;
      chain.push({ status: res.status, to: url });
      continue;
    }

    const ok = res.status === 200;
    return {
      ...row,
      ok,
      chain,
      status: res.status,
      detail: ok ? '' : `final status ${res.status}`,
    };
  }
  return { ...row, ok: false, chain, detail: `redirect chain longer than ${MAX_HOPS} hops` };
}

// Fixed-size worker pool — Promise.all over ~200 URLs at once would look like a
// burst of abuse to the host and skew timings.
async function runPool(rows, worker, limit) {
  const results = new Array(rows.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, rows.length) }, async () => {
    while (next < rows.length) {
      const i = next++;
      results[i] = await worker(rows[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

const rows = targets();
console.log(`Checking ${rows.length} URL(s) against ${BASE}\n`);

const results = await runPool(rows, check, CONCURRENCY);

const failures = results.filter((r) => !r.ok && !r.skipped);
const skipped = results.filter((r) => r.skipped);
const longChains = results.filter((r) => r.ok && r.chain.length > 1);

for (const r of failures) {
  console.log(`FAIL  ${r.path}  [${r.origin}]`);
  console.log(`      ${r.detail}`);
  for (const hop of r.chain) console.log(`      ${hop.status} -> ${hop.to}`);
}

if (longChains.length) {
  console.log(`\n${longChains.length} URL(s) resolve through more than one hop:`);
  for (const r of longChains) {
    console.log(`WARN  ${r.path}  (${r.chain.length} hops)`);
    for (const hop of r.chain) console.log(`      ${hop.status} -> ${hop.to}`);
  }
}

if (skipped.length) {
  console.log(`\n${skipped.length} pattern(s) not checked:`);
  for (const r of skipped) console.log(`SKIP  ${r.path} — ${r.detail}`);
}

// `astro preview`, `python -m http.server` and any other plain static server know
// nothing about vercel.json — they serve files, and every redirect source 404s. That
// produces a wall of FAILs that looks like a broken site but only means "this host
// isn't Vercel". Detect the signature (every redirect-derived URL 404ing) and say so,
// rather than letting someone conclude the redirect table is broken.
const redirectRows = results.filter((r) => r.origin.startsWith('redirect') && !r.skipped);
const redirects404 = redirectRows.filter((r) => !r.ok && r.status === 404);
if (redirectRows.length && redirects404.length === redirectRows.length) {
  console.log(
    `\nNOTE: all ${redirectRows.length} redirect rules 404 here, which means ${BASE} is not\n` +
      `applying vercel.json — expected for \`astro preview\` and any plain static server.\n` +
      `Redirects can only be verified on a Vercel deployment. Re-run with\n` +
      `BASE_URL=https://<preview>.vercel.app to actually test them.`,
  );
}

const direct = results.filter((r) => r.ok && r.chain.length === 0).length;
const viaRedirect = results.filter((r) => r.ok && r.chain.length > 0).length;

console.log(
  `\n${results.length - failures.length - skipped.length}/${results.length - skipped.length} OK ` +
    `(${direct} direct 200, ${viaRedirect} via redirect) — ${failures.length} failing`,
);

// Non-zero exit so this can gate a deploy; a skipped pattern is a gap in THIS
// script, not a broken site, so it does not fail the run.
process.exit(failures.length ? 1 : 0);
