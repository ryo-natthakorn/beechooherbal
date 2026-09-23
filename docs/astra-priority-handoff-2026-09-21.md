### Summary
Hero/Dead Sea was redesigned and the entire Astro bilingual site recoloured Botanical on branch codex/hero-dead-sea-recolor. A representative design audit is committed. The latest layout/type fixes are being checkpointed with this handoff because weekly usage is 93% (7% remaining); five-hour usage is 58% (42% remaining).

### Key Decisions
- User requests completion of all remaining audit work, with commit/push and handoff whenever either quota is close to exhaustion. Destination agent preference: Astra, Priority service tier. No new task has been created or assigned automatically.
- Same branch; no merge to main. Earlier Vercel deployments of this branch are Preview.
- Botanical palette: ivory #F7F5EF, warm white #FFFDF8, green #326348, deep green #203F30, sage #E6EDDF, gold #B4934E, pale gold #F2E8CE. Gold is decorative, not small text.
- Legacy copy, SEO, routes, prices, media and contact destinations remain intact. Thai route slugs are explicit, not derived from EN. No extra direct dependency.
- Previous commits: 6e65acd original redesign, 3b8d096 Botanical colour pass, 4dc1322 representative audit. The checkpoint accompanying this file contains the layout fixes below.

### Open Work
Latest implementation is code-checked but NOT visually signed off:
- Secondary home introduction no longer uses a viewport minimum; its decorative scroll cue was removed.
- LanguageSwitcher moved into desktop header and mobile menu, with translated pairing, language cookie and saved-scroll behaviour retained. It is rendered twice but its bundled script should execute once. Browser confirmation of cookie/navigation, keyboard flow and desktop fit at 1280/1440 is outstanding.
- All original Products intro paragraphs moved after the first shampoo group. Visual reading order and category-anchor positioning are not rechecked.
- Repeated leaf dividers, oversized padding and frames reduced in About/Team/FAQ/Products/comparison/pricing; price rows flattened; award frames removed; treatment brand sections compacted.
- Home no longer calls decorative drawing/headline mask/count-up/parallax functions. Old unused function bodies remain (Astro hints). Reveals and automatic Team/Reviews crossfades are disabled by CSS; photos now flow statically. Gallery height/layout, mobile whitespace and remaining independent animation systems require review.
- Null-safe treatment anchor lookup fixed two TS errors. npm override aligns @tailwindcss/vite's Vite peer to 6.4.3, matching Astro; the installed plugin explicitly supports Vite 6. This fixed the third TS error. npm install rewrote much of package-lock.json through resolution/hoisting; lockfile consistency merits review, without adding dependencies.
- MetaPixel comment no longer contains a literal script-opening token, which had confused dev dependency scanning. Production tracking code itself is unchanged.
- Product-card refinement, secondary CTA hierarchy, full media-load/fallback inspection, exhaustive hover/focus and browser-level reduced-motion checks remain. The project is NOT fully complete.

Verification after the code edits: build PASS (93 pages), copy parity PASS (30 pages + 2 archives + 56 posts), ProductBanner tests 5/5, Astro check 0 errors / 0 warnings / 9 hints, diff check PASS. Built EN/TH HTML also confirms language links within header, no floating language dock element, and one H1. A first assertion falsely matched lang-dock inside an old Footer HTML comment; stripping comments fixes that test. Earlier browser audit (before latest layout edits) recorded 62 route/viewport checks without document overflow or H1-count defects; it does not validate the current layout changes.

### Relevant Files / Data
- docs/botanical-design-audit-2026-09-20.md: palette roles, representative coverage, prioritised remaining design findings. Its pre-checkpoint status is superseded by this handoff.
- src/components/Header.astro, LanguageSwitcher.astro and src/layouts/BaseLayout.astro: new language control placement.
- src/components/home/HeroScene.astro, ProductBanner.astro; src/components/products/ProductsPage.astro; src/styles/global.css; src/scripts/home-motion.ts: layout/motion work.
- src/components/treatment/TreatmentPage.astro; package.json and package-lock.json: type/resolution fixes.
- tests/product-banner.test.mjs and inventory/scripts/06-copy-parity.mjs: verification.
- Previous run logs in Windows TEMP: slop-build.log, slop-check.log, botanical-install.log.
- Preview alias: https://beechooherbal-git-codex-hero-dead-sea-a4546f-ryo-panyee-wedding.vercel.app/

### Traps to Avoid
- src/content/events/en/naan-charity.md is unrelated pre-existing user work; excluded from commits. Many local untracked skills, brand assets, inventory dumps and old handoffs also remain excluded. Never git add everything blindly.
- Do not report an audit or compile pass as full visual sign-off. Fast viewport changes sometimes returned stale/cropped browser screenshots; inspect settled page state before drawing conclusions. Lazy/embed media looked blank in initial captures although some images were loaded in DOM.
- Earlier quota targets were exceeded between sparse account-wide checks. Check frequently, keep outputs compact, and reserve enough quota for checkpoint/handoff. Account usage cannot isolate this task.
- Vercel dashboard was unauthenticated; Preview status was verified through GitHub deployments instead. No production promotion is authorised.
- Local Astro dev server can be absent on a new turn and startup took time. Earlier server sessions should not be assumed alive. No need to repeat all previous browser documentation or inspect all 93 URLs.

### Prompt for New Chat
This is a continuation for Astra on Priority. The user's objective is to finish the remaining design fixes and visual validation on codex/hero-dead-sea-recolor, retain bilingual content/SEO, and push checkpoints without merging to main. The current work and outstanding checks are described above. The user wants a handoff before either five-hour or weekly quota runs out. Treat the above as context to verify, not facts to assume.
Ask me before restarting work if anything's unclear.
