const fs = require("fs");
const path = require("path");
const { slugify } = require("../utils/translit");

function scanDir(dir) {
  const items = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push({
        type: "dir",
        name: entry.name,
        slug: slugify(entry.name),
        children: scanDir(fullPath),
      });
    } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
      const baseName = entry.name.replace(/\.md$/i, "");
      items.push({
        type: "file",
        name: baseName,
        slug: slugify(baseName),
        fullPath,
      });
    }
  }
  items.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name, "ru");
  });
  return items;
}

module.exports = { scanDir };
