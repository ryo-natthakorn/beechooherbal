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
import { animate, inView, scroll } from "motion";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  headerOverlay();
  drawStrokes();
  maskHeadlines();
  countUpStats();
  parallaxLayers();
  treatmentCards();
  howItWorksScene();
  heroShader();
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

/** Botanical line art draws itself on when it enters the viewport (hero draws on load,
 *  footer as you reach it). SSR state is fully drawn; the dash "hidden" state is set
 *  only here, when JS is confirmed live. Strokes are aria-hidden at ~0.1 opacity, so
 *  the single-frame swap is imperceptible. */
function drawStrokes() {
  const done = new WeakSet<Element>();
  inView(
    "svg[data-draw]",
    (element) => {
      if (done.has(element)) return;
      done.add(element);
      element.querySelectorAll("path").forEach((path, i) => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
        animate(path, { strokeDashoffset: [len, 0] }, {
          duration: 1.5,
          delay: i * 0.08,
          ease: [0.16, 1, 0.3, 1],
        });
      });
    },
    { amount: 0.15 },
  );
}

/** Masked line-rise on section headings. The clip wrapper is built at runtime (SSR
 *  markup is a plain visible heading) and the whole heading rises as ONE block —
 *  never per-word, so it is safe for space-free Thai script. Hero H1 is exempt
 *  (it is the LCP element; it keeps the fast CSS .hero-enter). */
function maskHeadlines() {
  const done = new WeakSet<Element>();
  document.querySelectorAll<HTMLElement>("[data-mask-reveal]").forEach((el) => {
    const inner = document.createElement("span");
    inner.style.display = "block";
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
    el.style.overflow = "hidden";
    inner.style.transform = "translateY(110%)";
  });
  inView(
    "[data-mask-reveal]",
    (element) => {
      if (done.has(element)) return;
      done.add(element);
      const inner = element.firstElementChild as HTMLElement | null;
      if (!inner) return;
      animate(inner, { y: ["110%", "0%"] }, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    },
    { margin: "0px 0px -10% 0px" },
  );
}

/** Count-up stat numerals. The real final integer is server-rendered (SEO/no-JS see
 *  the true number); this only replays 0 → N once, with tabular-nums + a reserved
 *  ch-width in the markup so there is zero layout shift. */
function countUpStats() {
  const done = new WeakSet<Element>();
  inView(
    "[data-countup]",
    (element) => {
      if (done.has(element)) return;
      done.add(element);
      const target = Number((element as HTMLElement).dataset.countup ?? "0");
      if (!Number.isFinite(target) || target <= 0) return;
      animate(0, target, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => {
          element.textContent = String(Math.round(v));
        },
      });
    },
    { amount: 0.5 },
  );
}

/** Scroll-linked parallax drift. Transform-only (GPU-safe); depth comes from
 *  data-parallax (e.g. 0.12 → ±~10px). */
function parallaxLayers() {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const depth = Number(el.dataset.parallax || "0.1");
    scroll(animate(el, { y: [depth * 80, depth * -80] }, { ease: "linear" }), {
      target: el,
      offset: ["start end", "end start"],
    });
  });
}

/** Treatment-card choreography — the Phase 3 upgrade of the old uniform reveal:
 *  spring rise + de-blur with a per-column stagger. Cards ship visible (the [0,1]
 *  opacity "from" only exists while this animation runs). */
function treatmentCards() {
  inView(
    ".card-reveal",
    (element) => {
      const index = Number((element as HTMLElement).dataset.revealIndex ?? "0");
      animate(
        element,
        { opacity: [0, 1], y: [36, 0], scale: [0.96, 1], filter: ["blur(8px)", "blur(0px)"] },
        {
          delay: (index % 3) * 0.07,
          opacity: { duration: 0.45, ease: "easeOut" },
          filter: { duration: 0.5, ease: "easeOut" },
          y: { type: "spring", stiffness: 120, damping: 17 },
          scale: { type: "spring", stiffness: 120, damping: 17 },
        },
      );
    },
    { margin: "0px 0px 15% 0px" },
  );
}

/** Pinned, scroll-scrubbed How-It-Works. The section ships as a normal static block;
 *  desktop + JS + motion-allowed adds .scene-active (tall track + sticky stage) and
 *  scrubs the 4 steps, gold progress bar, and a subtle image zoom off scroll progress.
 *  Mobile and no-JS keep the plain layout — no dead scroll distance. */
function howItWorksScene() {
  const track = document.querySelector<HTMLElement>("[data-scene-track]");
  if (!track) return;
  if (!window.matchMedia("(min-width: 768px)").matches) return;
  track.classList.add("scene-active");
  const steps = Array.from(track.querySelectorAll<HTMLElement>(".scene-step"));
  const progressBar = track.querySelector<HTMLElement>(".scene-progress");
  const visual = track.querySelector<HTMLElement>("[data-scene-visual]");
  scroll(
    (progress: number) => {
      const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
      steps.forEach((step, i) => step.setAttribute("data-active", String(i === idx)));
      if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
      if (visual) visual.style.transform = `scale(${1 + progress * 0.05})`;
    },
    { target: track, offset: ["start start", "end end"] },
  );
}

/** WebGL hero shader — lazy-loaded and hard-gated: desktop width + fine pointer only
 *  (mobile and crawlers never fetch the module). The CSS .hero-aura beneath the canvas
 *  is the everywhere-else fallback, including WebGL-unavailable. */
function heroShader() {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas[data-hero-canvas]");
  if (!canvas) return;
  if (!window.matchMedia("(min-width: 768px) and (pointer: fine)").matches) return;
  import("./hero-webgl")
    .then((m) => m.initHeroShader(canvas))
    .catch(() => {
      /* module load failed — aura fallback stays */
    });
}
