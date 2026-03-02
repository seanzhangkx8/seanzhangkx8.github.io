const CAMERA_SCALE = 2.1;

let sceneInnerEl = null;
let bgEl = null;
let fogEl = null;

export function initScene({ sceneInner, bg, fog }) {
  sceneInnerEl = sceneInner;
  bgEl = bg;
  fogEl = fog;

  // Slightly zoomed-in camera to allow a subtle zoom-out on intro.
  if (sceneInnerEl) {
    sceneInnerEl.style.transform = "translate3d(0, 0, 0) scale(1.15)";
  }
}

export function getSceneElements() {
  return { sceneInner: sceneInnerEl, bg: bgEl, fog: fogEl };
}

function hasGSAP() {
  return typeof window !== "undefined" && typeof window.gsap !== "undefined";
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function animateSceneTransform({ tx, ty, scale, duration = 1200 }) {
  if (!sceneInnerEl) return Promise.resolve();

  const useReduced = prefersReducedMotion();
  if (useReduced) {
    // Skip major camera motion when reduced motion is requested.
    sceneInnerEl.style.transform = "translate3d(0, 0, 0) scale(1)";
    return Promise.resolve();
  }

  if (hasGSAP()) {
    return new Promise((resolve) => {
      window.gsap.to(sceneInnerEl, {
        duration: duration / 1000,
        x: tx,
        y: ty,
        scale,
        ease: "power2.inOut",
        overwrite: "auto",
        onComplete: resolve,
      });
    });
  }

  return new Promise((resolve) => {
    sceneInnerEl.style.transitionDuration = `${duration}ms`;
    sceneInnerEl.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    const timeout = window.setTimeout(resolve, duration + 50);

    const handleTransitionEnd = () => {
      sceneInnerEl.removeEventListener("transitionend", handleTransitionEnd);
      window.clearTimeout(timeout);
      resolve();
    };
    sceneInnerEl.addEventListener("transitionend", handleTransitionEnd, {
      once: true,
    });
  });
}

export function zoomOutToLake(duration = 1200) {
  if (!sceneInnerEl) return Promise.resolve();
  return animateSceneTransform({ tx: 0, ty: 0, scale: 1, duration });
}

export function zoomToIsland(islandElement, duration = 1200) {
  if (!sceneInnerEl || !islandElement) return Promise.resolve();

  const rect = islandElement.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const islandCenterX = rect.left + rect.width / 2;
  const islandCenterY = rect.top + rect.height / 2;

  const tx = vw / 2 - islandCenterX;
  const ty = vh / 2 - islandCenterY;

  return animateSceneTransform({
    tx,
    ty,
    scale: CAMERA_SCALE,
    duration,
  });
}

export function setFogOpacity(targetOpacity, duration = 1200) {
  if (!fogEl) return Promise.resolve();

  if (hasGSAP()) {
    return new Promise((resolve) => {
      window.gsap.to(fogEl, {
        duration: duration / 1000,
        opacity: targetOpacity,
        ease: "sine.inOut",
        overwrite: "auto",
        onComplete: resolve,
      });
    });
  }

  return new Promise((resolve) => {
    fogEl.style.transitionDuration = `${duration}ms`;
    fogEl.style.opacity = String(targetOpacity);
    const timeout = window.setTimeout(resolve, duration + 50);

    const handleTransitionEnd = () => {
      fogEl.removeEventListener("transitionend", handleTransitionEnd);
      window.clearTimeout(timeout);
      resolve();
    };
    fogEl.addEventListener("transitionend", handleTransitionEnd, {
      once: true,
    });
  });
}

