// utils/template.util.js
const path = require("path");

const BASE_DIR = path.resolve(__dirname, ".."); 
// this goes UP from utils → root

function getTemplatePath(templateFile) {
  return path.join(BASE_DIR, "templates", templateFile);
}

module.exports = {
  getTemplatePath
};