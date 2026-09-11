const { slugifyAnchor } = require("../utils/translit");

function makeHeadingIdFactory() {
  const seen = new Map();
  return {
    make(text) {
      const plain = String(text)
        .replace(/<[^>]+>/g, "")
        .replace(/[*_`~\[\]()]/g, "")
        .trim();
      const base = slugifyAnchor(plain) || "section";
      const n = seen.get(base) || 0;
      seen.set(base, n + 1);
      return n === 0 ? base : `${base}-${n}`;
    },
  };
}

let current = makeHeadingIdFactory();

function resetHeadingIds() {
  current = makeHeadingIdFactory();
}

function makeHeadingId(text) {
  return current.make(text);
}

module.exports = { makeHeadingIdFactory, resetHeadingIds, makeHeadingId };
