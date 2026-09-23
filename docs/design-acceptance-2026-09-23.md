# Final representative design acceptance — 23 September 2026

## Outcome
The implementation backlog carried by the 22 September handoff is closed for this redesign scope. No additional code changes were necessary in this pass. The branch remains a preview; no merge or production promotion was performed.

## Fresh checks on the settled preview
- Tested implementation/documentation HEAD 79affbf9a1d268cb15f2a7fc6503ebd4fba6beba. GitHub reports Vercel success and deployment 6585797758 as Preview for that SHA.
- After confirming deployment success, the existing URL checker passed 588/588: 89 direct 200, 499 via redirects, zero failures. This supersedes the earlier check during rollout.
- Desktop at 1440: Treatments receives keyboard focus; after the visibility transition settles, Tab enters Hair Loss at the correct local treatment URL. The earlier inconclusive test is resolved.
- Mobile at 375: native menu summary opens with Enter, without horizontal overflow. Thai link reaches /th/home/; switching back reaches /. Reading position remained approximately comparable: measured page fraction 0.786 before versus 0.763 after, consistent with differing language content and media layout. This is not exact paragraph synchronisation.
- Header at 1280: no horizontal overflow. Tab from branch CTA reaches EN with a visible 2px outline. The coordinate hover probe did not establish hover and is not reported as passed.
- Inspected other-treatments-0.jpg and other-treatments-1.jpg from the prior capture set for page rhythm. They show no new structural defect; repeated sticky-header fragments are known stitching artifacts, not duplicate DOM content. These historical sheets predate the last video facade fix and are not used to validate its loading state.
- Fresh readable mobile viewport screenshots inspected: Thai Products body/product imagery, Thai Reviews card with a long titled video facade, English herbal/transplant comparison body, and the long English hair-loss testimonial post. Text wraps, controls fit, and content remains readable. A first review screenshot was transiently blank; a settled DOM read and subsequent screenshot showed the complete card and facade, so no speculative layout fix was made.

## Existing verified evidence retained
The immediately preceding implementation passed build (93 pages), Astro check (0 errors/0 warnings), copy parity, ProductBanner tests (5/5), static checks on all built pages, desktop media sweeps of 93 routes and mobile sweeps of 35 representative routes. No implementation file changed during this final acceptance pass, so these results remain applicable. See docs/astra-priority-handoff-2026-09-22.md and docs/audits/2026-09-22 for recorded evidence.

## Limits and release boundary
This is representative visual/function acceptance, not a certification of every pixel, device, assistive technology or third-party player state. Browser media emulation is unavailable in the supplied browser capability, so reduced motion is supported by source/script checks and the implemented CSS gates, not a newly emulated browser test. External player/network failures are outside the layout guarantee. A final owner visual approval and production merge are separate release actions.

The latest quota checkpoint in this pass was five-hour 46% used, weekly 52% used. No reset credit was redeemed. The next work need not restart the audit; only new user feedback or a reproducible defect should reopen implementation.
