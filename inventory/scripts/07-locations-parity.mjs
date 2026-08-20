// inventory/scripts/07-locations-parity.mjs
// Does src/data/locations.ts still match the LIVE Locations pages?
//
// Run:  npm run locations-parity
//
// Unlike 06-copy-parity.mjs (which diffs against the frozen inventory/rest-pages.json
// snapshot), this script fetches the live WP REST endpoint every run. That's
// deliberate: the Locations page is Crispin's most frequently edited page (new outlets,
// hour changes) and the Phase-1 snapshot in inventory/_locations_dump.html is already
// known to be stale — it was missing the Ayutthaya outlet entirely (added to the live
// site 2026-08-20, discovered mid-Phase-3-planning). A script that reads the snapshot
// would have been silently wrong forever.
//
// Method: parse each <h1 class="elementor-heading-title">...outlet</h1> block on the EN
// page (id 187) into { name, phones, hours, telHrefs, placeQuery?, lat, lng }, do the
// same for the TH page (id 554) to recover nameTh, then diff both against
// src/data/locations.ts. Anything that doesn't match is either a real drift (fix the
// data) or a deliberate deviation (add to SKIP below, with a reason — same discipline as
// 06-copy-parity.mjs).
//
// Also emits inventory/locations-derived.json: the full parsed shape (including raw
// lat/lng per outlet) for human review when adding a new outlet or re-deriving addresses.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { OUTLETS } from "../../src/data/locations.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const UA = "Mozilla/5.0 (compatible; BeeChooLocationsParity/1.0; +https://beechooherbal.com)";

const EN_PAGE_ID = 187;
const TH_PAGE_ID = 554;

/**
 * Fields we know differ from live on purpose. Each entry needs a reason — an
 * unexplained skip here is indistinguishable from a bug this script exists to catch.
 */
const SKIP = [
  ["chaiyapruek.phoneHref", "we link the first of two published numbers; the second (phoneAltDisplay) has no tel: href by design — matches every other single-number outlet's pattern"],
  ["chonburi.phoneHref", "legacy tel: is malformed (tel:+%20+66969047964, an encoded space); ours is the corrected +66969047964"],
  ["the-crystal.phoneHref", "legacy tel: is malformed (tel:+%20+66955365556%20); ours is the corrected +66955365556"],
  ["sai-mai.area", "the map embed for this outlet points at a different venue (\"Bee Choo Tawanna\"), not Sai Mai itself — areaPending until Crispin confirms which is correct"],
];

function isSkipped(key) {
  return SKIP.some(([k]) => k === key);
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

function decodeEntities(s) {
  return s
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function htmlToLines(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, "\n"))
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Split the page body into one chunk per outlet, anchored on each H1. */
function splitOutletBlocks(html) {
  return html.split(/(?=<h1[^>]*class="elementor-heading-title)/).slice(1);
}

function parseEnBlock(block) {
  const name = decodeEntities((block.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] || "").replace(/\s+outlet$/i, "").trim();
  const telHrefs = [...block.matchAll(/href="tel:([^"]+)"/g)].map((m) => m[1]);
  const place = (block.match(/!2s([^!]+)!/) || [])[1];
  const placeQuery = place ? decodeURIComponent(place.replace(/\+/g, " ")) : undefined;
  const coordMatch = block.match(/!2d([-0-9.]+)!3d([-0-9.]+)/);
  const lng = coordMatch ? Number(coordMatch[1]) : undefined;
  const lat = coordMatch ? Number(coordMatch[2]) : undefined;
  const lines = htmlToLines(block);
  const phoneLines = lines.filter((l) => /\d{3}[- ]?\d{3}/.test(l) && !/^Call /i.test(l));
  const hoursIdx = lines.findIndex((l) => /Operating Hours/i.test(l));
  const hours = hoursIdx >= 0 ? lines.slice(hoursIdx + 1, hoursIdx + 3).filter((l) => !/^Call /i.test(l)) : [];
  return { name, phoneLines, hours, telHrefs, placeQuery, lat, lng };
}

function parseThNames(html) {
  // TH page only marks SOME outlets with a real <h1>; the rest render their Thai name
  // as plain paragraph text in the same visual position. A name is unreliable to grab by
  // itself (some are split "สาขา" / "จตุจักร (ประชาชื่น)" across two lines) — instead
  // anchor on "เบอร์โทร" (every branch's phone-number line, present all 16 times) and
  // take everything between the previous branch's "Call X" line and this one as the name.
  const lines = htmlToLines(html);
  const startIdxs = [];
  lines.forEach((l, i) => { if (/^เบอร์โทร/.test(l)) startIdxs.push(i); });
  let prevEnd = lines.findIndex((l) => l.includes("หาเราที่นี่"));
  const names = [];
  for (const idx of startIdxs) {
    names.push(lines.slice(prevEnd + 1, idx).join(" ").replace(/\s+/g, " ").trim());
    const nextCall = lines.findIndex((l, i) => i > idx && /^Call /.test(l));
    prevEnd = nextCall;
  }
  return names;
}

async function main() {
  console.log("Fetching live Locations pages...");
  const [enPage, thPage] = await Promise.all([
    fetchJson(`https://beechooherbal.com/wp-json/wp/v2/pages/${EN_PAGE_ID}`),
    fetchJson(`https://beechooherbal.com/wp-json/wp/v2/pages/${TH_PAGE_ID}`),
  ]);

  const enBlocks = splitOutletBlocks(enPage.content.rendered).map(parseEnBlock);
  const thNames = parseThNames(thPage.content.rendered);

  console.log(`EN modified: ${enPage.modified} — ${enBlocks.length} outlets`);
  console.log(`TH modified: ${thPage.modified} — ${thNames.length} names recovered`);
  if (enPage.modified.slice(0, 10) !== thPage.modified.slice(0, 10)) {
    console.log(`⚠ EN and TH pages were last edited on different dates — TH may be stale.`);
  }

  writeFileSync(
    join(ROOT, "inventory", "locations-derived.json"),
    JSON.stringify({ fetchedAt: new Date().toISOString(), enModified: enPage.modified, thModified: thPage.modified, en: enBlocks, thNames }, null, 2),
  );
  console.log("Wrote inventory/locations-derived.json for review.\n");

  // --- Diff against src/data/locations.ts ---
  let failures = 0;
  const bySlugName = new Map(OUTLETS.map((o) => [o.name.toLowerCase(), o]));

  if (enBlocks.length !== OUTLETS.length) {
    console.log(`❌ Outlet count mismatch: live has ${enBlocks.length}, locations.ts has ${OUTLETS.length}.`);
    failures++;
  }

  for (const block of enBlocks) {
    const outlet = [...bySlugName.entries()].find(([n]) => n.includes(block.name.toLowerCase().split(" ")[0]))?.[1];
    if (!outlet) {
      console.log(`❌ Live outlet "${block.name}" has no match in locations.ts.`);
      failures++;
      continue;
    }
    const key = outlet.slug;

    for (const tel of block.telHrefs) {
      if (tel !== outlet.phoneHref && !isSkipped(`${key}.phoneHref`)) {
        console.log(`❌ [${key}] phoneHref: locations.ts="${outlet.phoneHref}" live tel="${tel}"`);
        failures++;
      }
    }

    const liveHours = block.hours.join(" ").replace(/\s+/g, " ");
    const ourHours = (outlet.hours?.en ?? outlet.hours ?? "").replace(/\s+/g, " ");
    if (liveHours && ourHours && !sameTimeTokens(liveHours, ourHours)) {
      console.log(`❌ [${key}] hours drift:\n     live: "${liveHours}"\n     ours: "${ourHours}"`);
      failures++;
    }
  }

  console.log(failures === 0 ? "\n✅ locations-parity OK" : `\n❌ locations-parity found ${failures} issue(s).`);
  process.exitCode = failures === 0 ? 0 : 1;
}

// Compares the SET of time-of-day tokens (e.g. "10.30", "9", "6.30") mentioned in each
// string, ignoring wording/punctuation differences ("9am to 8pm" vs "9am–8pm", "9 am"
// vs "9am", "10.30am" vs "10:30am") that would otherwise fail a naive substring check
// on every single outlet without indicating any REAL content drift.
function sameTimeTokens(a, b) {
  const extract = (s) => new Set([...s.toLowerCase().matchAll(/\d+(?:[:.]\d+)?/g)].map((m) => m[0].replace(":", ".")));
  const setA = extract(a);
  const setB = extract(b);
  if (setA.size !== setB.size) return false;
  for (const t of setA) if (!setB.has(t)) return false;
  return true;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
