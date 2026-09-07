// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { getPair } from './src/i18n/pairs.ts';

const SITE = 'https://beechooherbal.com';

// Match the canonical shape SEOHead emits (see ensureTrailingSlash there): every
// sitemap URL must be byte-identical to the canonical on the page it points at, or
// we hand Google two spellings of the same page.
/** @param {string} pathname @returns {string} */
function ensureTrailingSlash(pathname) {
  if (pathname === '/') return '/';
  const last = pathname.split('/').pop() ?? '';
  if (last.includes('.')) return pathname;
  return pathname.endsWith('/') ? pathname : pathname + '/';
}

// https://astro.build/config
export default defineConfig({
  site: SITE,

  // NOTE: one-to-one redirects live in vercel.json, NOT here. Astro's native
  // `redirects` config was tested on this deployment (static output, no adapter)
  // on 2026-07-14 and produces HTTP 200 + <meta http-equiv="refresh"> — not a
  // true 301. See SKILL.md "Redirects" caveat.

  // defaultLocale=en means English has NO url prefix. This is a URL-shape decision,
  // NOT a statement about primary language. Do not change to 'th' — it would rewrite
  // every English URL and break SEO. (See CLAUDE.md §6 — Path A. Thai stays at /th/.)
  i18n: {
    locales: ['en', 'th'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false, // English at /, Thai at /th/ — URLs unchanged from WPML
    },
  },

  integrations: [
    sitemap({
      // hreflang alternates in the sitemap come from src/i18n/pairs.ts — the SAME
      // source SEOHead uses for the on-page <link rel="alternate"> tags, so the two
      // can never disagree.
      //
      // ⚠ The integration's own `i18n` option is deliberately NOT used. Its locale key
      // "is used to look for a locale part in a page path", i.e. it assumes Thai lives
      // at /th/<english-slug>. This site's Thai slugs are fully translated
      // (/th/คำถามที่พบบ่อย/, not /th/frequently-asked-questions/), so prefix-swapping
      // would emit alternates for URLs that do not exist. `serialize` sets `links`
      // explicitly instead.
      //
      // A page with no twin gets NO links array at all — same rule SEOHead follows.
      // Emitting a one-sided cluster is worse than emitting none.
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        const pair = getPair(pathname);
        if (!pair?.en || !pair?.th) return item;

        const en = new URL(pair.en, SITE).href;
        const th = new URL(pair.th, SITE).href;
        return {
          ...item,
          url: new URL(ensureTrailingSlash(pathname), SITE).href,
          links: [
            { lang: 'en', url: en },
            { lang: 'th', url: th },
            { lang: 'x-default', url: en },
          ],
        };
      },
    }),
  ],

  // Tailwind CSS v4 — CSS-only config (no tailwind.config file); tokens live in @theme.
  vite: {
    plugins: [tailwindcss()],
  },
});
