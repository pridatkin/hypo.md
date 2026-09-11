const fs = require("fs");
const path = require("path");
const { escapeHtml } = require("../utils/html");

const CSS = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
const CLIENT_JS = fs.readFileSync(path.join(__dirname, "client.js"), "utf8");

function page({ title, treeHtml, contentHtml = "", isIndex = false }) {
  return `<!doctype html>
<html lang="ru" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" id="hljs-light"
  href="https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css">
<link rel="stylesheet" id="hljs-dark"
  href="https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github-dark.min.css" disabled>
<style>${CSS}</style>
<script>
  (function () {
    try {
      const KEY = 'notes-theme';
      const saved = localStorage.getItem(KEY);
      const theme = (saved === 'light' || saved === 'dark')
        ? saved
        : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
      document.addEventListener('DOMContentLoaded', function () {
        var light = document.getElementById('hljs-light');
        var dark  = document.getElementById('hljs-dark');
        if (!light || !dark) return;
        light.disabled = theme === 'dark';
        dark.disabled  = theme !== 'dark';
      });
    } catch (e) {}
  })();
</script>
</head>
<body>
<div class="layout">
  <aside id="sidebar">
    <div class="sidebar-head">
      <a href="/" class="brand">📝 Заметки</a>
      <div style="display:flex; gap:6px;">
        <button class="icon-btn" id="theme-toggle" type="button"
                title="Сменить тему" aria-label="Сменить тему">🌗</button>
        <button class="icon-btn" id="nav-close" type="button"
                title="Закрыть меню" aria-label="Закрыть меню"
                style="display:none;">✕</button>
      </div>
    </div>
    ${treeHtml}
  </aside>

  <main>
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
      <button class="icon-btn" id="menu-toggle" type="button"
              title="Открыть меню" aria-label="Открыть меню">☰</button>
    </div>
    ${
      isIndex
        ? "<h1>Список заметок</h1><p>Выберите заметку в дереве слева.</p>"
        : contentHtml
    }
  </main>
</div>

<script type="module">${CLIENT_JS}</script>
</body>
</html>`;
}

module.exports = { page };
