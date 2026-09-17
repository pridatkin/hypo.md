// src/routes/notFound.js
const { page } = require("../views/page");
const { renderTree } = require("../views/tree");
const { getTree } = require("../notes/cache");

/**
 * Глобальный обработчик 404.
 * Отдаёт HTML-страницу в общем стиле проекта.
 */
function notFoundHandler(req, res) {
  const tree = getTree();

  const contentHtml = `
    <h1>404 — Заметка не найдена</h1>
    <p>Возможно, заметка ещё не создана или ссылка устарела.</p>
    <p><a href="/">← Вернуться на главную</a></p>
  `;

  res.status(404).send(
    page({
      title: "Заметка не найдена",
      treeHtml: renderTree(tree),
      contentHtml,
    }),
  );
}

module.exports = notFoundHandler;
