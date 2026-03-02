import { transitionTo, AppState } from "./state.js";

let bgEl = null;
let loadingEl = null;

export function initPerformance({ bg, loading }) {
  bgEl = bg;
  loadingEl = loading;

  setupHiResBackgroundPreload();
  setupVisibilityHandling();
}

function setupHiResBackgroundPreload() {
  if (!bgEl) return;

  const hiSrc = "assets/img/westlake-bg-HI.jpg";

  const img = new Image();
  const start = performance.now();
  let timeoutId = null;

  // Show a loading hint if things are slow.
  timeoutId = window.setTimeout(() => {
    if (loadingEl) {
      loadingEl.classList.add("is-visible");
      document.body.classList.add("is-loading");
    }
  }, 800);

  img.onload = () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    if (loadingEl) {
      loadingEl.classList.remove("is-visible");
      document.body.classList.remove("is-loading");
    }

    const elapsed = performance.now() - start;
    // Crossfade to high-res once ready.
    bgEl.classList.add("bg-hi-visible");
    console.info(`Hi-res background loaded in ${Math.round(elapsed)}ms`);
  };

  img.onerror = () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    if (loadingEl) {
      loadingEl.classList.remove("is-visible");
      document.body.classList.remove("is-loading");
    }
    console.warn("Unable to load high-res background; using gradient fallback.");
  };

  img.src = hiSrc;
}

function setupVisibilityHandling() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // When hidden, drop back to a stable state.
      transitionTo(AppState.MAP_IDLE, { force: true });
      document.body.classList.remove("fog-animated");
      return;
    }

    // When returning, restore gentle fog unless user prefers reduced motion.
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      document.body.classList.add("fog-animated");
    }
  });
}

