// src/i18n/pairGuard.ts
// Build-time assertion that every declared EN<->TH pair points at a page this build
// actually emits.
//
// Extracted from EventsPage.astro when the blog index needed the same check. Shared
// rather than copied for a specific reason: a GUARD that has drifted is worse than no
// guard, because it keeps passing while no longer checking the thing it names. Two
// copies of an assertion are two chances for one to quietly stop biting.
//
// What it protects: hreflang is generated from src/i18n/pairs.ts, so a pair naming a
// path this build does not produce would advertise a 404 to Google as the translation of
// a real page. The likeliest way to cause that is a typo in a long percent-encoded Thai
// slug — which is exactly the kind of thing that survives code review.

export interface DeclaredPair {
  key: string;
  en: string;
  th: string;
}

/**
 * Throws if any pair names a path absent from `emitted`.
 *
 * @param pairs    the declared pairs (EVENT_PAIRS / BLOG_PAIRS)
 * @param emitted  per-language sets of the paths this build emits, as `/slug/`
 * @param source   the file that declares them, named in the error so the fix is obvious
 */
export function assertPairsResolve(
  pairs: readonly DeclaredPair[],
  emitted: Readonly<Record<"en" | "th", ReadonlySet<string>>>,
  source: string,
): void {
  for (const pair of pairs) {
    for (const side of ["en", "th"] as const) {
      if (!emitted[side].has(pair[side])) {
        throw new Error(
          `${source}: pair "${pair.key}".${side} is "${pair[side]}", but no ${side.toUpperCase()} ` +
            `post is emitted at that path. hreflang would advertise a URL this build does not ` +
            `produce. Check ${source} against the slugs in the content collection.`,
        );
      }
    }
  }
}

/** Collect emitted `/slug/` paths per language from a set of collection entries. */
export function emittedPaths(
  entries: readonly { data: { lang: string; slug: string } }[],
): Record<"en" | "th", Set<string>> {
  const out: Record<"en" | "th", Set<string>> = { en: new Set(), th: new Set() };
  for (const e of entries) {
    const lang = e.data.lang as "en" | "th";
    if (out[lang]) out[lang].add(`/${e.data.slug}/`);
  }
  return out;
}
