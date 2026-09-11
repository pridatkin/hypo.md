function findBySlugs(tree, parts) {
  let level = tree;
  for (let i = 0; i < parts.length; i++) {
    const item = level.find((x) => x.slug === parts[i]);
    if (!item) return null;
    if (i === parts.length - 1) {
      return item.type === "file" ? item : null;
    }
    if (item.type !== "dir") return null;
    level = item.children;
  }
  return null;
}

module.exports = { findBySlugs };
