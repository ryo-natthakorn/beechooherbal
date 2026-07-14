// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://beechooherbal.com',

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

  // Tailwind CSS v4 — CSS-only config (no tailwind.config file); tokens live in @theme.
  vite: {
    plugins: [tailwindcss()],
  },
});
