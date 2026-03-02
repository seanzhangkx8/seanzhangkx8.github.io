(function () {
  var base = window.PAGE_BASE || "";
  var toggle = document.getElementById("dark-mode-toggle");
  if (!toggle) return;
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("latex-dark");
    toggle.src = base + "art/moon.png";
  }
  toggle.addEventListener("click", function () {
    document.body.classList.toggle("latex-dark");
    var isDark = document.body.classList.contains("latex-dark");
    toggle.src = isDark ? base + "art/moon.png" : base + "art/sun.png";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
})();
