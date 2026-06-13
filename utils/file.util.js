const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { getTemplatePath } = require("../utils/template.util");

/**
 * @param {string} templateFile - The name of the EJS template file to use.
 * @param {object} data - An object containing the data to be injected into the template.
 * @param {string} filename - The name of the output file to be created.
 * @param {string} [filePath] - Optional. The directory path where the output file should be created. If not provided, the file will be created in the current directory.
 */
function createFilesAndFolder(templateFile, data, filename, filePath = "") {
  
  const templatePath = getTemplatePath(templateFile);
  const template = fs.readFileSync(templatePath, "utf-8");
  const output = ejs.render(template, data);
  if (filePath) {
    const outputDir = path.join(process.cwd(), filePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outputDir, `${filename}`), output);
  } else {
    fs.writeFileSync(path.join(`${filename}`), output);
  }
}

module.exports = { createFilesAndFolder };