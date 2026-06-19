const { toTitleCase } = require("../utils/naming.util");
const { createFilesAndFolder } = require("../utils/file.util");
/**
 * @function generateFromTemplate
 * @description Generates a file from a specified template, replacing placeholders with the provided name in title case.
 * @param {string} template - The name of the template file to use for generation
 * @param {string} name - The name to replace placeholders with
 * @param {string} suffix - The file suffix (e.g., "controller", "service")
 * @param {string} folder - The folder path where the file should be created
 * @param {string} keyName - The key name for the placeholder in the template
 */
function generateFromTemplate(template, name, suffix, folder, keyName) {
    createFilesAndFolder(
        template,
        { [keyName]: toTitleCase(name) },
        `${name.toLowerCase()}.${suffix}.ts`,
        folder,
    );
}
module.exports = { generateFromTemplate };