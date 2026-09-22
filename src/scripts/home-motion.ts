// src/scripts/home-motion.ts
// Single motion entry for the homepage (imported once from HomePage.astro, so EN and TH
// are always choreographed identically). Replaces the old per-section scripts
// (treatment-card-reveal.ts, reviews-reveal.ts — deleted; the reviews grid became a
// zero-JS CSS marquee wall).
//
// The graceful-degradation contract every effect here honours:
//   - Nothing content-bearing ships hidden: all "from" states are applied at runtime,
//     so no-JS visitors (and crawlers) get the complete static page.
//   - One prefers-reduced-motion gate at the top governs everything.
//   - Each effect no-ops if its DOM hook is absent.
import { animate } from "motion";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  headerOverlay();
  treatmentsMasterDetail();

}

/** Header: transparent over the hero, solid once scrolled. The markup ships solid
 *  (no-JS default); this only ADDS the transparent at-top state. */
function headerOverlay() {
  const header = document.querySelector<HTMLElement>("header[data-overlay]");
  if (!header) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    if (window.scrollY < 40) header.setAttribute("data-at-top", "");
    else header.removeAttribute("data-at-top");
  };
  update();
  window.addEventListener(
    "scroll",
    () => {
      if (!raf) raf = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

/** Treatments accordion / master-detail — the CSS :has() toggle in global.css already
 *  makes this fully functional with zero JS (mobile: per-row accordion; md+: master-
 *  detail); this only layers a soft crossfade onto a panel when it becomes visible.
 *  Each radio and its own panel are siblings inside the same `.treatment-row`, so
 *  `closest()` finds the right one without needing an index attribute. */
function treatmentsMasterDetail() {
  const root = document.querySelector<HTMLElement>("[data-treatments-md]");
  if (!root) return;
  root.querySelectorAll<HTMLInputElement>(".md-radio").forEach((radio) => {
    radio.addEventListener("change", () => {
      const panel = radio.closest(".treatment-row")?.querySelector<HTMLElement>(".md-panel");
      if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      animate(panel, { opacity: [0, 1], y: [8, 0] }, { duration: 0.35, ease: "easeOut" });
    });
  });
}
