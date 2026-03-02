const contentCache = new Map();

let overlayEl = null;
let overlayContentEl = null;
let backBtnEl = null;

export function initOverlay({ overlay, overlayContent, backBtn, onBack }) {
  overlayEl = overlay;
  overlayContentEl = overlayContent;
  backBtnEl = backBtn;

  if (backBtnEl) {
    backBtnEl.addEventListener("click", () => {
      if (typeof onBack === "function") {
        onBack();
      }
    });
  }
}

export function isOverlayOpen() {
  return overlayEl?.classList.contains("is-visible") ?? false;
}

export function closeOverlay() {
  if (!overlayEl) return;
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");
}

async function fetchContent(url) {
  if (contentCache.has(url)) {
    return contentCache.get(url);
  }

  try {
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) {
      throw new Error(`Failed to load content: ${res.status}`);
    }
    const html = await res.text();
    contentCache.set(url, html);
    return html;
  } catch (err) {
    console.error(err);
    const fallback = `<h2>Temporarily unavailable</h2><p>Something went wrong while loading this part of the lake. Please try again in a moment.</p>`;
    contentCache.set(url, fallback);
    return fallback;
  }
}

export async function openOverlayForIsland(island, { focus = true } = {}) {
  if (!overlayEl || !overlayContentEl || !island) return;

  const html = await fetchContent(island.contentSource);

  overlayContentEl.innerHTML = html;
  const titleNode = document.getElementById("overlayTitle");
  if (titleNode) {
    titleNode.textContent = island.title || "Section";
  }
  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");

  if (focus) {
    // Focus the first focusable element inside, or the container itself.
    const focusable = overlayContentEl.querySelector(
      "a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"
    );
    (focusable || overlayContentEl).focus();
  }
}

