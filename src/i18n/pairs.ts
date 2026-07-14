// src/i18n/pairs.ts
// The single source of truth for EN <-> TH page pairings.
// Populate this from inventory/en-th-map.csv. Paths are DECODED and
// RELATIVE (no domain), with a leading and trailing slash.
// A page with no twin in the other language simply does not appear here.

export interface Pair {
  en: string | null; // e.g. "/about/"            (null if no EN twin)
  th: string | null; // e.g. "/th/home/"          (null if no TH twin)
}

// --- DATA: replace with your en-th-map.csv rows -----------------------------
// The one pair we already know for certain (home). Add the rest from the CSV.
export const PAIRS: Pair[] = [
  { en: "/", th: "/th/home/" }, // homepage: TH home lives at /th/home/, not /th/
  // { en: "/about/", th: "/th/<thai-slug>/" },
  // { en: "/frequently-asked-questions/", th: "/th/คำถามที่พบบ่อย/" },
  // ...one row per confirmed pair...
];
// ---------------------------------------------------------------------------

// Normalize any path to a stable lookup key: decode %-encoding, ensure a
// trailing slash. This lets an encoded incoming path match a decoded key.
function normKey(p: string): string {
  let s = p;
  try {
    s = decodeURIComponent(p);
  } catch {
    /* leave as-is if it's not valid encoding */
  }
  if (s === "/") return "/";
  const last = s.split("/").pop() ?? "";
  if (last.includes(".")) return s; // looks like a file, don't add a slash
  return s.endsWith("/") ? s : s + "/";
}

// Build a lookup that works from EITHER side of the pair.
const lookup = new Map<string, Pair>();
for (const pair of PAIRS) {
  if (pair.en) lookup.set(normKey(pair.en), pair);
  if (pair.th) lookup.set(normKey(pair.th), pair);
}

/** Returns the pair this path belongs to, or undefined if it's an orphan. */
export function getPair(pathname: string): Pair | undefined {
  return lookup.get(normKey(pathname));
}
