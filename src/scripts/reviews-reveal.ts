// Same reveal pattern as treatment-card-reveal.ts, applied to the review screenshots
// grid. Images have no opacity styling of their own, so a blocked/failed script (or
// reduced-motion) just leaves them at their natural, fully-visible state.
import { animate, inView } from "motion";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  inView(
    ".review-reveal",
    (element) => {
      const index = Number((element as HTMLElement).dataset.revealIndex ?? "0");
      animate(
        element,
        { opacity: [0, 1], y: [28, 0], scale: [0.96, 1] },
        {
          delay: (index % 4) * 0.08,
          opacity: { duration: 0.4, ease: "easeOut" },
          y: { type: "spring", stiffness: 120, damping: 18 },
          scale: { type: "spring", stiffness: 120, damping: 18 },
        },
      );
    },
    { margin: "0px 0px 15% 0px" },
  );
}
