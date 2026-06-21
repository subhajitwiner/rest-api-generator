const path = require("path");
const fs = require("fs");
async function confirmIfFileMissing(fileName, directory, message) {
  const filepath = path.join(process.cwd(), `src/${directory}/${fileName}`);
  const { confirm } = await import("@inquirer/prompts");

  if (!fs.existsSync(filepath)) {
    return await confirm({
      message,
      default: true,
    });
  }

  return false;
}

module.exports = { confirmIfFileMissing }