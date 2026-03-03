function runMapTransition() {
  const landingUI = document.getElementById("landingUI");
  const header = document.getElementById("header");

  if (!landingUI || !header) return;

  landingUI.classList.add("is-hidden");

  document.body.classList.add("map-active");

  requestAnimationFrame(() => {
    header.classList.add("is-visible");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      startBtn.disabled = true;
      runMapTransition();
    });
  }

  // Simple test routing: each marker navigates to a content page.
  const markerRoutes = [
    { selector: ".marker-baoshu", href: "assets/content/bio.html" },
    { selector: ".marker-hehua", href: "assets/content/research.html" },
    { selector: ".marker-ting", href: "assets/content/fun.html" },
    { selector: ".marker-santan", href: "assets/content/projects.html" },
  ];

  markerRoutes.forEach(({ selector, href }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.addEventListener("click", () => {
      window.location.href = href;
    });
  });
});
