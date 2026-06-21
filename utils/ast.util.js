const { Project } = require("ts-morph");
const path = require("path");
const fs = require("fs");

/**
     * @method loadSourceFile
     * @description Loads a TypeScript source file using ts-morph.
     * @param {string} relativePath - The relative path to the source file.
     * @returns {SourceFile|null} - The loaded SourceFile or null if not found.
    */
function loadSourceFile(relativePath) {
    const filePath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ File not found: ${relativePath}`);
        return null;
    }
    const project = new Project();
    return project.addSourceFileAtPath(filePath);
}
/**
 * @method addImportIfNotExists
 * @description Adds an import declaration to a source file if it doesn't already exist.
 * @param {SourceFile} sourceFile - The source file to modify.
 * @param {string} importName - The name of the import to add.
 * @param {string} importPath - The path of the module to import from.
 */
function addImportIfNotExists(sourceFile, importName, importPath) {
    const exists = sourceFile.getImportDeclaration(
        (imp) => imp.getModuleSpecifierValue() === importPath
    );

    if (!exists) {
        sourceFile.addImportDeclaration({
            namedImports: [importName],
            moduleSpecifier: importPath,
        });
    }
}
module.exports = { loadSourceFile, addImportIfNotExists };