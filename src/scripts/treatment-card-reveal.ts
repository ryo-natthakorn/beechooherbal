// Fades + springs each treatment card up as it scrolls into view. Cards have no
// opacity styling of their own (see TreatmentCard.astro), so if this script never
// runs — blocked, disabled, crawler — cards simply stay at their default full
// opacity: no reveal effect, but nothing is ever hidden. Same reason reduced-motion
// is checked rather than skipping the import: the fallback (no animation) is just
// the card's natural static state, never a hidden one.
import { animate, inView } from "motion";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  inView(
    ".card-reveal",
    (element) => {
      const index = Number((element as HTMLElement).dataset.revealIndex ?? "0");
      animate(
        element,
        { opacity: [0, 1], y: [32, 0], scale: [0.96, 1] },
        {
          delay: (index % 3) * 0.06,
          opacity: { duration: 0.4, ease: "easeOut" },
          y: { type: "spring", stiffness: 120, damping: 18 },
          scale: { type: "spring", stiffness: 120, damping: 18 },
        },
      );
    },
    { margin: "0px 0px 15% 0px" },
  );
}
