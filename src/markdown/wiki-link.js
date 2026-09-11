const { slugify, slugifyAnchor } = require("../utils/translit");

const wikiLinkExtension = {
  name: "wikiLink",
  level: "inline",
  start(src) {
    const index = src.indexOf("[[");
    return index >= 0 ? index : undefined;
  },
  tokenizer(src) {
    const rule = /^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "wikiLink",
        raw: match[0],
        target: match[1].trim(),
        displayText: match[2] ? match[2].trim() : null,
      };
    }
  },
  renderer(token) {
    const { target, displayText } = token;
    let href = "";
    let label = displayText;

    const [noteName, heading] = target.split("#");

    if (noteName) {
      href = `/${slugify(noteName)}`;
      if (!label) label = noteName;
    } else if (heading) {
      href = `#${slugifyAnchor(heading)}`;
      if (!label) label = heading;
    }

    if (heading && noteName) {
      href += `#${slugifyAnchor(heading)}`;
      if (!label) label = `${noteName} > ${heading}`;
    }

    return `<a href="${href}">${label || target}</a>`;
  },
};

module.exports = { wikiLinkExtension };
