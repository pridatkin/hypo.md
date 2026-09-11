const { escapeHtml } = require("../utils/html");

function renderTree(items, currentPath = []) {
  let html = '<ul class="tree">';
  for (const item of items) {
    const itemPath = [...currentPath, item.slug];
    if (item.type === "dir") {
      html += `<li class="dir">
        <details open>
          <summary>${escapeHtml(item.name)}</summary>
          ${renderTree(item.children, itemPath)}
        </details>
      </li>`;
    } else {
      const href = "/" + itemPath.map(encodeURIComponent).join("/");
      html += `<li class="file"><a href="${href}">${escapeHtml(item.name)}</a></li>`;
    }
  }
  html += "</ul>";
  return html;
}

module.exports = { renderTree };
