# Botanical colour pass and representative design audit

## Status and limits

The existing redesign was saved in commit `6e65acd` on `codex/hero-dead-sea-recolor`. GitHub reports its Vercel deployment as **Preview**, not Production. No merge to main.

This follow-up applies the approved Botanical palette. The audit below is a **source-based preliminary backlog**, not a completed visual audit of every template. Account-wide five-hour usage moved from 20% to 51% at the next checkpoint, beyond the requested additional 10 percentage-point target. Usage cannot be attributed to this task alone. Extended browser inspection was curtailed; do not treat the earlier Ivory/Forest visual checks as validation of this new palette.

## Colour roles implemented

- Ivory `#F7F5EF` and warm white `#FFFDF8`: canvas and reading surfaces.
- Leaf green `#326348`, deep green `#203F30`: actions, headings, hover and footer.
- Sage `#E6EDDF`: herbal introduction, treatment benefits, process, ingredient band and selected product sections.
- Warm gold `#B4934E`: decorative accent only; pale gold `#F2E8CE`: pricing and signature-product highlights.
- Botanical secondary text `#4C6251`: readable supporting copy on sage.
- Treatment wrapper tones preserve benefits/pricing colours even on pages with scroll tint. Content, routes, fonts, media and metadata are unchanged in this follow-up.

## Prioritised backlog for the next layout pass

| Priority | Surface / source evidence | Impact | Concrete next change |
| --- | --- | --- | --- |
| P1 | Home: `HeroScene.astro` retains `min-h-[100svh]` after ProductBanner | A second full-screen introduction delays access to treatments and duplicates the hero rhythm | Remove viewport minimum; size the introduction to its existing H1/copy and consolidate spacing without removing text |
| P2 | Shared/home: `home-motion.ts` invokes drawn strokes, headline masks, count-up stats and parallax; stroke animation has infinite iterations | Multiple motion systems compete with the launch video and make the page feel assembled | Retain one purposeful transition; make botanical art static and show stats as stable figures; preserve reduced-motion behaviour |
| P2 | About and treatment sections: repeated LeafDivider, centered serif heading and `py-16 md:py-24` | Repeated section openings make unlike information look equally important | Keep botanical mark at one meaningful brand transition; left-align reading sections and vary spacing by content grouping |
| P2 | About, products and treatment cost: rounded bordered/shadowed containers around repeated content | Excess containers flatten hierarchy; price tiers read as separate cards | Use open editorial rows for prose/price comparisons; reserve cards for independently actionable products |
| P2 | Header/footer and home: repeated filled pill CTAs; Footer has several same-weight actions | Primary and secondary navigation compete | Keep primary contact CTA filled; use text/outline treatment for secondary navigation while retaining links and touch targets |
| P2 | TreatmentPage: repeated brand band after condition-specific content | Long pages repeat the same visual sequence and obscure the condition-specific narrative | Rework shared brand information into a compact, consistently structured lower section; retain all indexed copy and anchors |
| P3 | AwardsMarquee: each award gets a circular surface and shadow | Decorative frames compete with the authenticity of award artwork | Use a quiet unframed strip with consistent optical sizing; retain original images and alt text |

These are design issues, not assertions of broken functionality. Brand imagery, real reviews and product photography should remain the main sources of identity; do not replace them with invented graphics or claims.

## Verification completed

- Production build: 93 pages, successful.
- ProductBanner tests: 5/5 passing.
- Copy parity: all legacy fragments retained across 30 pages, 2 category archives and 56 posts.
- Diff whitespace validation: passed.
- Astro check: three existing errors remain (Vite plugin type mismatch in astro.config.mjs; two nullable DOM values in TreatmentPage.astro). No new reported errors.
- GitHub deployment for baseline redesign: Preview, successful.

## Original outstanding acceptance work (superseded by follow-up below)

New-colour browser inspection remains outstanding: home and grey-hair treatment EN/TH at 375/768/1440, then desktop/mobile representatives for About, Team, Locations, FAQ, comparison, pricing, products, reviews, blog index/post, event index/post and 404. Inspect full-page rhythm, colour dosage and inherited foreground/background combinations. Check hover/focus, menu, LINE destination, video controls and reduced motion. Record route and screenshot evidence for each new visual finding before changing layout. Do not declare the whole-site slop audit complete until this coverage is done.


## Follow-up browser audit — 20 September 2026

Resumed on user instruction. Five-hour account usage started at 21% and reached 68% at the coverage checkpoint. This again exceeded the intended 10-point allowance; the shared meter cannot isolate this task. No broader layout rewrite was performed.

### Coverage and evidence

- Home EN/TH and grey-hair treatment EN/TH: 375, 768 and 1440px. Screenshots inspected for title wrapping, header, hero hierarchy, video proportions and colour roles. All four routes retain one H1 and have no document horizontal overflow.
- About, Team, Locations, FAQ, herbal/transplant comparison, treatment cost, Products, Reviews, Blog index and Events index: EN/TH DOM layout checks at 375 and 1440px. Representative screenshots inspected (About/Team desktop; other groups mobile).
- Blog post examples: /suffering-from-mild-hair-loss-in-your-30s-she-found-the-perfect-solution/ and /5-ตัวช่วยเรื่องผมร่วงของ/. Event examples: /grand-opening-of-new-outlet-bee-choo-ayutthaya/ and /grand-opening-บีชู-สาขาอยุธยา-ในวันท/. Checked each at 375/1440 along with /404/.
- 62 route/viewport checks in total including the initial Thai mobile check: no document overflow or duplicate/missing H1 found. This is representative template coverage, not every individual URL or every scroll position.
- Actual computed ingredient/benefits background: rgb(230,237,223); pricing: rgb(242,232,206). LINE links on checked pages retain https://lin.ee/ll3injb.
- Native video controls, mute and poster present; source ratio 1281/726; Space pauses playback. Thai mobile menu opens/closes without overflow. Reduced-motion initial state and preference-change pause behaviour pass a VM execution of the actual component script.
- Contrast pairs: ivory/action 6.39:1; muted text/pale gold 4.75:1; botanical text/sage 5.53:1; action/sage 5.82:1. These token checks are not an exhaustive per-element accessibility audit.
- Vercel reports Botanical commit 3b8d096 as a Preview deployment.

### Visual findings confirmed or added

1. **P1, Home:** the second full-height brand introduction visibly separates the launch details from core treatments with too much vertical space. Keep the existing H1, remove the viewport minimum in the next layout pass.
2. **P2, Products EN/TH mobile:** long centered opening copy consumes most of the first screen before products appear. Keep all copy, but use a short visible introduction plus a clearly labelled expandable remainder or move supporting copy below the first product group; this needs a layout decision before implementation.
3. **P2, shared language switcher:** the fixed bottom-right pill overlays article/review reading space on narrow screens. Move the control into the header/menu in the next navigation pass, preserving page-specific language pairing.
4. **P2, FAQ/Locations/Reviews/Team:** repeated leaf divider, centered heading, large vertical padding and rounded frames reinforce the same template rhythm across unrelated content. Use the backlog above to remove decorative repetition selectively.
5. **P2, media presentation:** several embedded/lazy-media areas appear as large empty framed regions in initial captures. Do not classify these as missing content from a screenshot alone; some images were confirmed loaded in DOM. Review loading/fallback affordances separately from palette changes.
6. **P3, global.css:** mechanical detector flags the existing TOC width transition at line 223. Replace with a non-layout animation or remove transition during a focused motion pass.

### Bounds of this sign-off

The Botanical palette passes representative layout and token-contrast checks. No new colour defect requiring code changes was found in this pass. The original build, copy-parity and five ProductBanner test results remain applicable because this follow-up changes documentation only. The three pre-existing Astro type errors remain. Full-page image-load verification, exhaustive hover/focus inspection and browser-level reduced-motion emulation were not completed; they are not claimed as passed. Structural slop fixes remain a prioritised next implementation pass, as specified in the approved scope.
