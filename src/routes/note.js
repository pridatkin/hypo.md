const express = require("express");
const fs = require("fs");
const { NOTES_DIR } = require("../config");
const { scanDir } = require("../notes/scan");
const { findBySlugs } = require("../notes/find");
const { renderTree } = require("../views/tree");
const { page } = require("../views/page");
const { renderMarkdown } = require("../markdown");
const { escapeHtml } = require("../utils/html");

const router = express.Router();

router.get("/{*path}", (req, res, next) => {
  const segs = req.params.path || [];
  const parts = (Array.isArray(segs) ? segs : [segs]).filter(Boolean);

  const tree = scanDir(NOTES_DIR);
  const file = findBySlugs(tree, parts);
  if (!file) return next();

  const md = fs.readFileSync(file.fullPath, "utf8");
  const contentHtml = renderMarkdown(md);

  res.send(
    page({
      title: file.name,
      treeHtml: renderTree(tree),
      contentHtml: `<h1>${escapeHtml(file.name)}</h1>${contentHtml}`,
    }),
  );
});

module.exports = router;
