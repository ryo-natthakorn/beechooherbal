// src/content.config.ts
// Astro 5 Content Layer collections. This is the project's FIRST collection —
// every page before this one uses the src/data/*.ts module pattern, which is still
// correct for singleton pages (see CLAUDE.md §6). Posts are the case §5 reserves for
// a collection, and the reasons are concrete here:
//   - 33 posts carry 173 images; that many ImageMetadata imports in one .ts module
//     would be unmaintainable (products.ts has 20 and is already 38 KB).
//   - EN and TH are NOT translation pairs. There are 15 pairs plus 3 EN-only posts,
//     with different titles and bodies per language. The `PL<T>` shape used by the
//     data modules would force three half-empty leaves.
//   - Crispin maintains content post-launch; Markdown is editable without TypeScript.
//
// FILENAMES ARE ASCII, DELIBERATELY. The file's basename is the pair key (the branch
// token: `phutthamonthon`, `chiang-mai`, …) and the real URL slug — Thai, percent-
// encoded on the live site — lives in the `slug` field. Thai filenames would ride
// Windows→Linux NFC/NFD normalisation between local dev and the Vercel builder for 15
// files; this sidesteps that entirely and makes the EN↔TH pairing visible in `ls`.
//
// Chronology comes from `pubDate`, never from a filename: four pairs were published on
// different days in each language, so a date-prefixed filename would desynchronise them.

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      lang: z.enum(["en", "th"]),
      /** Decoded legacy URL slug, no slashes. The page is emitted at `/<slug>/`. */
      slug: z.string(),
      /** Verbatim legacy post title. */
      title: z.string(),
      /**
       * Verbatim WordPress `excerpt.rendered`, tags stripped. This is the parity
       * anchor: the legacy index page's card excerpts are exactly this string, so
       * rendering it verbatim on the card is what keeps copy-parity green with no
       * SKIP entries. Do not rewrite it — it truncates mid-sentence on purpose.
       */
      excerpt: z.string(),
      pubDate: z.coerce.date(),
      modDate: z.coerce.date().optional(),
      /** Featured image (WP `featured_media`). Card thumbnail + post hero. */
      hero: image().optional(),
      heroAlt: z.string().default(""),
      /**
       * In-body photos, in document order, with any legacy caption that followed
       * them. Kept in frontmatter rather than inline Markdown so EventPost.astro can
       * lay them out as a real <Image> grid instead of a one-per-paragraph column.
       */
      gallery: z
        .array(
          z.object({
            src: image(),
            /** ⚠ COMPOSED. Legacy alt is empty on every one of these images
             *  (verified 0/8 non-empty on the sample post) — needs sign-off. */
            alt: z.string(),
            /** Verbatim legacy caption paragraph, when the post had one. */
            caption: z.string().optional(),
          }),
        )
        .default([]),
      /**
       * YouTube ids embedded in the legacy post body. Only the Siam Square merit
       * ceremony (EN + TH) has one, but it is real content — copy-parity's embed-id
       * check flags a dropped video, since `legacyFragments` only reasons about text.
       */
      videos: z.array(z.string()).default([]),
      /** Slug into OUTLETS in src/data/locations.ts, when the post announces a branch. */
      outlet: z.string().optional(),
      /** Provenance — the WP REST post id in inventory/rest-posts.json. */
      wpId: z.number(),
      /**
       * Legacy category term ids, recorded as found. The 2023-2025 grand openings
       * carry BOTH the blog and events terms ([1,16] EN / [9,17] TH), which is why
       * WordPress badges them "BLOG". The rebuild files them as events only.
       */
      wpCategories: z.array(z.number()),
    }),
});

export const collections = { events };
