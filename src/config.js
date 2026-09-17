const path = require("path");

const NOTES_DIR = path.resolve(process.env.NOTES_DIR || "./notes");

module.exports = {
  PORT: process.env.PORT || 3000,
  NOTES_DIR,
  HOME_NOTE: path.resolve(
    process.env.HOME_NOTE || path.join(NOTES_DIR, "Home.md"),
  ),
};
