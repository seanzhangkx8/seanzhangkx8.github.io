import { setAnimating } from "./state.js";
import { zoomOutToLake, zoomToIsland, setFogOpacity } from "./scene.js";

function hasGSAP() {
  return typeof window !== "undefined" && window.gsap;
}

export function runEmergence({ bg, fog, onComplete }) {
  setAnimating(true);

  // Background + fog fade are primarily driven by CSS via state classes.
  // Here we just ensure fog reaches its target opacity and then unlock.
  const fogTarget = 0.18;
  const emergenceDuration = 2400;

  setFogOpacity(fogTarget, 1800);

  window.setTimeout(() => {
    setAnimating(false);
    if (typeof onComplete === "function") onComplete();
  }, emergenceDuration);
}

export function runMapIntro({ landingName, headerName, islands }) {
  setAnimating(true);

  const durationCamera = 1200;
  const durationName = 800;

  const tlPromise = new Promise((resolve) => {
    if (hasGSAP() && landingName && headerName) {
      const tl = window.gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: resolve,
      });

      const fromRect = landingName.getBoundingClientRect();
      const toRect = headerName.getBoundingClientRect();

      const fromCenterX = fromRect.left + fromRect.width / 2;
      const fromCenterY = fromRect.top + fromRect.height / 2;
      const toCenterX = toRect.left + toRect.width / 2;
      const toCenterY = toRect.top + toRect.height / 2;

      const dx = toCenterX - fromCenterX;
      const dy = toCenterY - fromCenterY;
      const scale = (toRect.width / fromRect.width) * 0.9;

      tl.to(
        landingName,
        {
          duration: durationName / 1000,
          x: dx,
          y: dy,
          scale,
          autoRound: false,
        },
        0
      );

      tl.to(
        headerName,
        {
          duration: durationName / 1000,
          opacity: 1,
          y: 0,
        },
        0.2
      );

      if (Array.isArray(islands) && islands.length) {
        tl.fromTo(
          islands,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.18,
          },
          0.4
        );
      }
    } else {
      // Fallback: rely on CSS transitions only.
      window.setTimeout(resolve, durationCamera);
    }
  });

  const cameraPromise = zoomOutToLake(durationCamera);

  return Promise.all([tlPromise, cameraPromise]).finally(() => {
    setAnimating(false);
  });
}

export function runIslandEnter({ islandElement }) {
  setAnimating(true);

  const cameraPromise = zoomToIsland(islandElement, 1200);

  const fadeOthersPromise = new Promise((resolve) => {
    const allIslands = Array.from(
      document.querySelectorAll(".island")
    ).filter((el) => el !== islandElement);

    if (hasGSAP()) {
      window.gsap.to(allIslands, {
        duration: 0.5,
        opacity: 0.18,
        ease: "sine.inOut",
        onComplete: resolve,
      });
    } else {
      for (const el of allIslands) {
        el.classList.add("is-dimmed");
      }
      window.setTimeout(resolve, 500);
    }
  });

  return Promise.all([cameraPromise, fadeOthersPromise]).finally(() => {
    setAnimating(false);
  });
}

export function runIslandExit() {
  setAnimating(true);

  const cameraPromise = zoomOutToLake(1200);

  const restorePromise = new Promise((resolve) => {
    const allIslands = Array.from(document.querySelectorAll(".island"));
    if (hasGSAP()) {
      window.gsap.to(allIslands, {
        duration: 0.5,
        opacity: 1,
        ease: "sine.inOut",
        onComplete: () => {
          allIslands.forEach((el) => el.classList.remove("is-dimmed"));
          resolve();
        },
      });
    } else {
      allIslands.forEach((el) => el.classList.remove("is-dimmed"));
      window.setTimeout(resolve, 500);
    }
  });

  return Promise.all([cameraPromise, restorePromise]).finally(() => {
    setAnimating(false);
  });
}

