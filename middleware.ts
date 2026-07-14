// middleware.ts
// Vercel Routing Middleware — must live at the project root (same level as
// package.json), NOT inside src/. This runs on Vercel's servers per-request,
// which is the only way to react to a header like Accept-Language; static
// HTML has no code running at request time to do this itself.
//
// WHAT THIS DOES: a visitor with a Thai browser/OS language preference who
// lands on the bare "/" gets sent to "/th/home/". This is the second of the
// two Thai-first mechanisms in CLAUDE.md §6 — hreflang (already live via
// SEOHead) handles Google's search results; this handles a human arriving
// at "/" directly (bookmark, shared link, typed URL) that hreflang can't
// reach. URLs never change — see Path A in CLAUDE.md. English "/" stays
// independently crawlable throughout.
//
// CRITICAL — must NEVER redirect crawlers. Googlebot crawls as English from
// US IPs, so it would fail the language check anyway, but the User-Agent
// check below is deliberate defense-in-depth: if that ever changes, a typo
// in the language logic can't silently start hiding "/" from Google.
//
// Runs "before the cache" per Vercel's docs, so this logic re-evaluates on
// every request rather than getting stuck serving one visitor's redirect
// decision to everyone else.
//
// NOTE: this file cannot be build-tested by `npm run build` — it's Vercel
// server code, not part of the static site build. The language-weight
// parsing logic below WAS unit-tested directly in Node against real
// Accept-Language header strings (10/10 cases pass, including ties and
// implicit q=1 values), and the bot regex was tested against real
// Googlebot/Bingbot/Facebook User-Agent strings (5/5 pass). The full
// request/redirect behavior still needs verification on the Vercel preview
// deploy — open the preview's bare "/" with your browser's language set to
// Thai vs English, and separately confirm Google Search Console's URL
// Inspection / "Test Live URL" on "/" still shows the English page.

import { next } from '@vercel/functions';

export const config = {
  matcher: '/', // only ever runs on the bare root — every other URL is untouched
};

// Conservative bot list covering the crawlers that actually matter for SEO
// (Google, Bing) plus common social-preview/link-unfurl bots that also
// shouldn't be redirected. If you spot a real crawler getting redirected in
// Vercel's function logs, add its User-Agent substring here.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|whatsapp|telegrambot|discordbot|linkedinbot|pinterest|semrush|ahrefs/i;

export default function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';
  if (BOT_PATTERN.test(userAgent)) {
    return next(); // never redirect a crawler — "/" must stay indexable as English
  }

  const acceptLanguage = request.headers.get('accept-language') ?? '';
  if (prefersThaiOverEnglish(acceptLanguage)) {
    return Response.redirect(new URL('/th/home/', request.url), 302); // 302: per-visitor personalization, not a permanent URL change
  }

  return next();
}

// Accept-Language looks like: "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7"
// Compares Thai's weight against English's rather than just checking
// "does th appear anywhere" — a browser listing both should go wherever
// the visitor ranked higher, not default to Thai just because it's present.
export function prefersThaiOverEnglish(header: string): boolean {
  if (!header) return false;

  const weights = header.split(',').reduce<Record<string, number>>((acc, part) => {
    const pieces = part.split(';').map((p) => p.trim());
    const tag = pieces[0]?.toLowerCase();
    if (!tag) return acc;
    let q = 1;
    for (const piece of pieces.slice(1)) {
      const match = piece.match(/^q=([\d.]+)$/i);
      if (match) q = parseFloat(match[1]);
    }
    const lang = tag.split('-')[0]; // "th-TH" -> "th"
    acc[lang] = Math.max(acc[lang] ?? 0, isNaN(q) ? 1 : q);
    return acc;
  }, {});

  const th = weights['th'] ?? 0;
  const en = weights['en'] ?? 0;
  return th > 0 && th >= en;
}
