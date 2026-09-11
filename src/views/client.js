/* ---------- Тема: light / dark ---------- */
const root = document.documentElement;
const KEY = "notes-theme";
const mql = window.matchMedia("(prefers-color-scheme: dark)");

function initialTheme() {
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return mql.matches ? "dark" : "light";
}

function syncHljs(theme) {
  const light = document.getElementById("hljs-light");
  const dark = document.getElementById("hljs-dark");
  if (!light || !dark) return;
  light.disabled = theme === "dark";
  dark.disabled = theme !== "dark";
}

function apply(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem(KEY, theme);
  syncHljs(theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.title = theme === "dark" ? "Светлая тема" : "Тёмная тема";
  }
}

apply(initialTheme());

document.addEventListener("click", (e) => {
  if (!e.target.closest("#theme-toggle")) return;
  const cur = root.getAttribute("data-theme");
  apply(cur === "dark" ? "light" : "dark");
  window.__renderMermaid?.();
});

/* ---------- Мобильное меню ---------- */
(function () {
  const body = document.body;
  const openBtn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("nav-close");
  const aside = document.getElementById("sidebar");

  function setOpen(open) {
    body.classList.toggle("nav-open", open);
    if (closeBtn) closeBtn.style.display = open ? "inline-flex" : "none";
  }
  openBtn?.addEventListener("click", () => setOpen(true));
  closeBtn?.addEventListener("click", () => setOpen(false));
  document.addEventListener("click", (e) => {
    if (!body.classList.contains("nav-open")) return;
    if (aside.contains(e.target) || openBtn.contains(e.target)) return;
    setOpen(false);
  });
  aside?.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();

/* ---------- Mermaid ---------- */
import("https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs")
  .then(({ default: mermaid }) => {
    const nodes = [...document.querySelectorAll(".mermaid")];
    nodes.forEach((el) => {
      if (!el.dataset.src) el.dataset.src = el.textContent;
    });

    async function render() {
      const theme =
        root.getAttribute("data-theme") === "dark" ? "dark" : "default";
      mermaid.initialize({ startOnLoad: false, theme, securityLevel: "loose" });
      nodes.forEach((el) => {
        el.removeAttribute("data-processed");
        el.textContent = el.dataset.src;
      });
      try {
        await mermaid.run({ nodes });
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    }

    window.__renderMermaid = render;
    render();
  })
  .catch((err) => console.error("Mermaid load error:", err));
