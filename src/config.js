const path = require("path");

module.exports = {
  PORT: process.env.PORT || 3000,
  NOTES_DIR: path.resolve(process.env.NOTES_DIR || "./notes"),
};
