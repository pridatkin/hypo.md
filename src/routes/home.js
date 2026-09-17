const express = require("express");
const fs = require("fs");
const { HOME_NOTE } = require("../config");
const { getTree } = require("../notes/cache");
const { renderTree } = require("../views/tree");
const { page } = require("../views/page");
const { renderMarkdown } = require("../markdown");
const { escapeHtml } = require("../utils/html");

const router = express.Router();

router.get("/", (req, res, next) => {
  // Нет HOME_NOTE или файл не существует — отдаём 404
  if (!HOME_NOTE || !fs.existsSync(HOME_NOTE)) {
    return next();
  }

  const tree = getTree();
  const md = fs.readFileSync(HOME_NOTE, "utf8");
  const contentHtml = renderMarkdown(md);
  const title = HOME_NOTE.split(/[\\/]/).pop().replace(/\.md$/i, "");

  res.send(
    page({
      title,
      treeHtml: renderTree(tree),
      contentHtml: `<h1>${escapeHtml(title)}</h1>${contentHtml}`,
    }),
  );
});

module.exports = router;
