const express = require("express");
const { NOTES_DIR } = require("../config");
const { getTree } = require("../notes/cache");
const { renderTree } = require("../views/tree");
const { page } = require("../views/page");

const router = express.Router();

router.get("/", (req, res) => {
  const tree = getTree();
  res.send(
    page({
      title: "Заметки",
      treeHtml: renderTree(tree),
      isIndex: true,
    }),
  );
});

module.exports = router;
