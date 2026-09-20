# Botanical colour pass and preliminary design audit

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

## Remaining acceptance work

New-colour browser inspection remains outstanding: home and grey-hair treatment EN/TH at 375/768/1440, then desktop/mobile representatives for About, Team, Locations, FAQ, comparison, pricing, products, reviews, blog index/post, event index/post and 404. Inspect full-page rhythm, colour dosage and inherited foreground/background combinations. Check hover/focus, menu, LINE destination, video controls and reduced motion. Record route and screenshot evidence for each new visual finding before changing layout. Do not declare the whole-site slop audit complete until this coverage is done.
