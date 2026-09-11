const { marked } = require("marked");
const { renderer } = require("./renderer");
const { wikiLinkExtension } = require("./wiki-link");
const { resetHeadingIds } = require("./heading-ids");

marked.use({
  useNewRenderer: true,
  extensions: [wikiLinkExtension],
  renderer,
  gfm: true,
  breaks: false,
});

function renderMarkdown(md) {
  resetHeadingIds();
  return marked.parse(md);
}

module.exports = { renderMarkdown };
