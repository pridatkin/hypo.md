const express = require("express");
const { NOTES_DIR } = require("../config");
const { scanDir } = require("../notes/scan");
const { renderTree } = require("../views/tree");
const { page } = require("../views/page");

const router = express.Router();

router.get("/", (req, res) => {
  const tree = scanDir(NOTES_DIR);
  res.send(
    page({
      title: "Заметки",
      treeHtml: renderTree(tree),
      isIndex: true,
    }),
  );
});

module.exports = router;
