# Project handoff — Astra Priority — 23 September 2026

### Summary
The Hero/Dead Sea redesign, brand recolour and representative design audit are on `codex/hero-dead-sea-recolor`. The latest requested video fix is complete locally: every rendered video now has a self-hosted image before activation. This handoff supersedes earlier outstanding-work lists for the current request; future improvements below remain deliberately unimplemented.

### Key Decisions
- Current A scope: fix all video previews, verify, commit/push this branch, create a PR; provide project handoff with rules. User explicitly authorizes PR after preview fix passes. No merge or production promotion.
- YouTube: all 42 currently rendered IDs have local posters; missing posters fail the build. Original ID, titles, start offsets, privacy-enhanced host and no-script links remain. Before/after YouTube clips now use the same facade.
- Facebook's one clip and three unique GIPHY clips have original still previews and keyboard-operable click-to-load facades. Native Dead Sea keeps its approved cover and controls, starts paused with `preload="none"`, and pauses when reduced motion is enabled. Turning reduced motion off does not auto-start playback.
- Preserve legacy content, media, prices, contact destinations, H1, URLs, canonical, hreflang and SEO. Current work changes presentation/loading only. No dependency or data-schema change.
- EN lives at root; TH homepage is `/th/home/`, with real translated slugs. `src/i18n/pairs.ts` is the pairing registry; never derive Thai routes by prefixing English. Some Thai posts live at root. Preserve intentionally orphaned pages.
- Redirect source is `vercel.json`; `redirects.json` does NOT exist. No catch-all redirects. No booking system, login, payments or database; retain Call/Facebook/LINE and other existing socials. LINE remains `https://lin.ee/ll3injb`.
- Astro components, Tailwind v4 semantic tokens, Astro Image (no raw img in source); shared chrome copy comes from `src/i18n/ui.ts`. Validate downloaded image content, not just HTTP status.
- Current brand palette supersedes the earlier Botanical proposal: Harmony Green `#2D6946`, Oriental Yellow `#FFC600`, white, Origin `#6F6259`, Earth `#DBCBC1`, Treasure `#DAC556`, and named tints. Yellow marks primary actions; green headings/brand. Keep user-approved Lora/Roboto and Noto Serif/Sans Thai, despite the PDF's different digital-font specification.
- Quota stop rule: whichever of 5-hour or weekly runs low first. Stop starting new work at 15% remaining, commit/push to this branch, and write a checkpoint for **Astra, Priority**. Limits are account-wide; do not redeem reset credits without explicit confirmation. Earlier 10-point budget targets were exceeded; latest pre-handoff reading was 5-hour 25% remaining / weekly 44%.

### Open Work
**Future improvements B — recorded, not implemented in this PR's latest fix:**
1. Thai editorial review: remove literal/bot-like wording and spelling errors; requested replacement **ทรีทเมนท์ → ทรีทเมนต์**. The service examples below use the user's supplied spelling **ทรีตเมนต์**; these variants need a deliberate editorial style decision, not silent mass replacement. Existing SEO slugs stay unchanged even if they contain old spelling. Future approved copy changes need explicit parity-baseline handling so tests do not mask accidental content loss. No invented treatment claims or machine translation.
2. Existing treatment navigation/heading should become **TH: ปัญหาหนังศีรษะ / EN: Hair Concerns**; the concerns' existing URLs and content remain.
3. A separate **ทรีทเมนต์ / Treatment** service section is not yet designed. Requested services:
   - ทรีตเมนต์สมุนไพรสำหรับหนังศีรษะและเส้นผม (สีสมุนไพร)
   - ทรีตเมนต์สมุนไพรสำหรับหนังศีรษะและเส้นผม (แบบไร้สี)
   - ทรีตเมนต์สมุนไพรสำหรับหนังศีรษะและเส้นผม (แบบสีพิเศษ)
   - ทรีตเมนต์โคลนเดดซีสำหรับหนังศีรษะและเส้นผม
   The relationship between concerns and services, verified descriptions/prices and any new page requirements are not finalized. Do not invent content or rename existing routes.
4. Products redesign: current open layout feels too bland; old layout scanned more easily but looked generic/AI-generated. Future direction is a middle ground: clearer product grouping, stronger image/name/price hierarchy and easier comparison without repeated decorative cards or excessive empty space. Preserve product copy, order/meaning, prices, images and links. EN route `/bee-choo-hair-care-products/`, TH `/th/แชมพูบีชูป้องกันผมร่วง/`.

**Validation for the video fix:**
- Fresh build: 93 pages, PASS. Astro check: 0 errors, 0 warnings, 5 existing JSON-LD hints.
- ProductBanner + video-preview tests: 7/7 PASS. Full built-site coverage: 89 embedded previews, 42 unique YouTube IDs, 2 native posters; image files exist, accessible buttons present, no pre-activation video-provider iframes.
- Copy parity PASS: 30 core pages, 2 archives and 56 post outputs retain legacy fragments.
- Browser checks: EN FAQ at 375px has loaded actual thumbnail before Enter creates correct iframe; Facebook EN mobile has loaded original poster and Enter activates original source; TH About activation preserves `start=68`; TH oily-scalp GIPHY still loads and Enter activates original source; TH FAQ at 768px shows full poster without overflow; TH home at 1440px starts paused, original cover visible, Space starts native playback. EN home mobile starts paused with controls/poster. Representative screenshots inspected.
- Limits: no claim that every external video was played end-to-end. External provider availability, consent/ad blocking and login can affect playback after activation. Reduced-motion source/regression behavior verified; current browser tool has no media emulation, so an emulated reduced-motion browser pass is not claimed. Current checks are targeted video acceptance, not a new exhaustive design/SEO launch audit.
- Previous audit acceptance is documented separately. Vercel deployment of the latest commit must be read from PR checks; do not assume an alias has updated just because push succeeded.
- Production launch remains outside this scope. Reverify stale AGENTS launch checklist against current code before acting (schema/privacy/tracking/redirect tasks changed during previous sessions). DNS, tracking IDs and any substantive content decisions belong with owner Crispin.

### Relevant Files / Data
- `src/components/YouTubeEmbed.astro`, `EmbedPreview.astro`: image facades and activation.
- `src/components/treatment/BeforeAfterGallery.astro`, `TreatmentBenefits.astro`: YouTube/GIPHY/Facebook consumers.
- `src/components/home/ProductBanner.astro`: native poster and explicit playback.
- `src/assets/images/video-thumbs/README.md`: original asset provenance and maintenance rules. All new JPEGs decoded/validated, max width 960px; Astro optimizes served versions. Existing four retained. Facebook expiring CDN URL is not shipped.
- `tests/video-previews.test.mjs`, `tests/product-banner.test.mjs`: run after `npm run build` with `node --test tests/product-banner.test.mjs tests/video-previews.test.mjs`.
- Other checks: `npm run astro check`, `npm run copy-parity`; preview URL check is `npm run url-check` with `BASE_URL` set to the preview.
- `docs/design-acceptance-2026-09-23.md`: previous representative audit and limits.
- `docs/astra-priority-handoff-2026-09-22.md`: historical implementation evidence, not current outstanding scope.
- `docs/audits/2026-09-22/`: committed earlier audit results. `output/` contains untracked local logs/screenshots.
- Preview: https://beechooherbal-git-codex-hero-dead-sea-a4546f-ryo-panyee-wedding.vercel.app/
- Remote: https://github.com/ryo-natthakorn/beechooherbal . Branch: `codex/hero-dead-sea-recolor`.

### Traps to Avoid
- An earlier fix added titled green facades without images; it did NOT satisfy image previews. Current fix replaces that fallback with mandatory actual local thumbnails.
- Image dimensions must retain intrinsic ratio; forcing 4:3 thumbnails to 16:9 in Astro generation distorts them. `object-contain` preserves complete previews in existing boxes.
- Facebook poster currently belongs to one specific clip; replacing its video requires replacing the poster too.
- User-owned/unrelated untracked files include AGENTS.md, skill folders, historical handoffs, inventory dumps, output and original brand PDFs/logos. Stage explicit task files only. Do not revert content work from other tasks.
- Full-page browser screenshots can stitch incorrectly; use settled viewport captures. Scroll at x=5 to avoid wheel events being captured by iframes. Lazy off-screen images are not broken images.
- Current user asks for future B in the handoff, not immediate editorial/navigation/product implementation. Do not widen this video PR into those changes.

### Prompt for New Chat
This is the Bee Choo Herbal Thailand bilingual Astro rebuild. The active branch contains the Hero/Dead Sea redesign, approved brand alignment and the video-preview fix. The latest handoff is `docs/project-handoff-2026-09-23.md`; its Future improvements B are pending. Work is intended for Astra with Priority. Existing URLs, SEO and content remain protected; a future Thai editorial pass is separately requested. Quotas are account-wide, and the user's stop-and-push rule applies before either window is exhausted. No merge or production release is authorized.

Treat the above as context to verify, not facts to assume. Ask me before restarting work if anything's unclear.
