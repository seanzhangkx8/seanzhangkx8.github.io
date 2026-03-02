import { AppState, getState } from "./state.js";
import { isOverlayOpen, closeOverlay } from "./overlay.js";

export function initA11y({ islandsContainer, startBtn, backBtn }) {
  setupKeyboardNavigation(islandsContainer);
  setupGlobalShortcuts({ startBtn, backBtn });
}

function setupKeyboardNavigation(islandsContainer) {
  if (!islandsContainer) return;

  islandsContainer.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("island")) return;

    switch (event.key) {
      case "Enter":
      case " ":
        target.click();
        event.preventDefault();
        break;
      default:
        break;
    }
  });
}

function setupGlobalShortcuts({ startBtn, backBtn }) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (isOverlayOpen()) {
        closeOverlay();
        backBtn?.click();
        event.preventDefault();
      }
    }

    if (
      (event.key === "Enter" || event.key === " ") &&
      getState() === AppState.EMERGENCE &&
      startBtn &&
      !startBtn.disabled
    ) {
      startBtn.click();
      event.preventDefault();
    }
  });
}

