const { Project } = require("ts-morph");
const path = require("path");
const fs = require("fs");
const { toCamelCase, toKebabCase, toPascalCase } = require("../utils/naming.util");
 const { addImportIfNotExists, loadSourceFile} = require("../utils/ast.util");

class ProjectModifier {

    /**
     * @method registerControllerInApiRouter
     * @description Registers a new controller in the API router file.
     * @param {string} name - The name of the controller to register.
    */
    registerControllerInApiRouter(name) {
        const sourceFile = loadSourceFile("src/router/api.router.ts");
        if (!sourceFile) return;

        const pascal = toPascalCase(name);
        const camel = toCamelCase(name);
        const kebab = toKebabCase(name);

        const controllerClass = `${pascal}Controller`;
        const controllerVar = `${camel}Controller`;
        const importPath = `../controllers/${kebab}.controller`;

        // ✅ Import
        addImportIfNotExists(sourceFile, controllerClass, importPath);

        // ✅ Prevent duplicate invoker
        const alreadyExists = sourceFile
            .getVariableStatements()
            .some((v) => v.getText().includes(`const ${controllerVar}`));

        if (alreadyExists) {
            console.log("⚠️ Controller already registered in API router");
            return;
        }

        // ✅ Find last makeInvoker
        const statements = sourceFile.getStatements();

        const lastInvokerIndex = statements
            .map((stmt, index) => ({ text: stmt.getText(), index }))
            .filter((s) => s.text.includes("makeInvoker"))
            .pop();

        if (!lastInvokerIndex) {
            console.log("⚠️ No makeInvoker found in API router");
            return;
        }

        sourceFile.insertStatements(
            lastInvokerIndex.index + 1,
            `const ${controllerVar} = makeInvoker(${controllerClass});`
        );

        sourceFile.saveSync();
        console.log("✅ Controller registered in API router");
    }
    /**
     * @method registerRouterInIndex
     * @description Registers a new router in the index.ts router file.
     * @param {string} name - The name of the router to register.
    */
    registerRouterInIndex(name) {
        const sourceFile = loadSourceFile("src/router/index.ts");
        if (!sourceFile) return;

        const pascal = toPascalCase(name);
        const kebab = toKebabCase(name);

        const routerName = `${pascal}Router`;
        const importPath = `./${kebab}.router`;

        // ✅ Import
        addImportIfNotExists(sourceFile, routerName, importPath);

        // ✅ Find class
        const cls = sourceFile.getClass("IndexRouter");
        if (!cls) {
            console.log("❌ IndexRouter class not found");
            return;
        }

        // ✅ Find method
        const method = cls.getMethod("route");
        if (!method) {
            console.log("❌ route() method not found");
            return;
        }

        const body = method.getBody();
        if (!body) return;

        const routeLine = `${routerName}(this.router,'/${kebab}');`;

        // ✅ Prevent duplicate
        if (body.getText().includes(routeLine)) {
            console.log("⚠️ Router already exists in index");
            return;
        }

        // ✅ Insert before return
        const returnStmt = body
            .getStatements()
            .find((stmt) => stmt.getText().includes("return this.router"));

        if (!returnStmt) {
            console.log("⚠️ return statement not found");
            return;
        }

        body.insertStatements(returnStmt.getChildIndex(), routeLine);

        sourceFile.saveSync();
        console.log("✅ Index router updated");
    }
    /**
     * @method registerDependencyInContainer
     * @description Updates the container.ts file to register a new controller, service, or repository.
     * @param {string} kind - "controller", "service", or "repository"
     * @param {string} name - The name of the item to update
     */
    registerDependencyInContainer(name, kind) {
        const sourceFile = loadSourceFile("src/systems/container.ts");
        if (!sourceFile) return;

        const pascal = toPascalCase(name);
        const camel = toCamelCase(name);
        const kebab = toKebabCase(name);

        const kindMap = {
            controller: {
                className: `${pascal}Controller`,
                key: `${camel}Controller`,
                importPath: `../controllers/${kebab}.controller`,
            },
            service: {
                className: `${pascal}Service`,
                key: `${camel}Service`,
                importPath: `../services/${kebab}.service`,
            },
            repository: {
                className: `${pascal}Repository`,
                key: `${camel}Repository`,
                importPath: `../repositories/${kebab}.repository`,
            },
        };

        const target = kindMap[kind];
        if (!target) {
            console.log("❌ Invalid container type. Use controller, service, or repository.");
            return;
        }

        // Add import if missing
        addImportIfNotExists(sourceFile, target.className, target.importPath);

        const registerText = sourceFile.getText();
        const entryLine = `    ${target.key}: asClass(${target.className}).scoped(),`;

        // If already present, do nothing
        if (registerText.includes(entryLine)) {
            console.log(`⚠️ ${target.key} already exists in container`);
            return;
        }

        const sourceText = sourceFile.getFullText();
        const registerMatch = sourceText.match(/container\.register\(\{\s*([\s\S]*?)\s*\}\);/);

        if (!registerMatch) {
            console.log("❌ container.register block not found");
            return;
        }

        const blockContent = registerMatch[1];
        const lines = blockContent
            .split("\n")
            .map((line) => line.trimEnd());

        // Try to place the new entry near the same module group
        let insertIndex = lines.length;
        const groupPrefix = `${camel}`;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(`${groupPrefix}`)) {
                insertIndex = i + 1;
            }
        }

        // If the exact key already exists, skip
        if (lines.some((line) => line.includes(`${target.key}:`))) {
            console.log(`⚠️ ${target.key} already exists in container`);
            return;
        }

        lines.splice(insertIndex, 0, entryLine);

        const newBlock = `container.register({ ${lines.join("\n")} });`;

        const updatedText = sourceText.replace(registerMatch[0], newBlock);
        sourceFile.replaceWithText(updatedText);
        sourceFile.saveSync();

        console.log(`✅ Container updated for ${kind}: ${name}`);
    }
    /**
     * @method registerModelInArray
     * @description Updates the model.array.ts file to include a new model in the ModelArray.
     * @param {string} modelName 
     * @returns {void}
    */
    registerModelInArray(modelName) {
        const sourceFile = loadSourceFile("src/database/model.array.ts");
        if (!sourceFile) return;

        const pascal = toPascalCase(modelName);
        const kebab = toKebabCase(modelName);


        const modelClass = `${pascal}`;
        const importPath = `../models/${kebab}.model`;

        // ✅ Add import
        addImportIfNotExists(sourceFile, modelClass, importPath);

        // ✅ Find ModelArray variable
        const variable = sourceFile.getVariableDeclaration("ModelArray");

        if (!variable) {
            console.log("❌ ModelArray not found");
            return;
        }
        const initializer = variable.getInitializer();
        if (!initializer || !initializer.getText().startsWith("[")) {
            console.log("❌ ModelArray is not an array");
            return;
        }
        // ✅ Get existing items
        const arrayText = initializer.getText();
        // Prevent duplicate
        if (arrayText.includes(modelClass)) {
            console.log("⚠️ Model already exists in ModelArray");
            return;
        }
        // Remove closing ]
        const updatedArray = arrayText.replace(/\]$/, `, ${modelClass}]`);
        initializer.replaceWithText(updatedArray);
        sourceFile.saveSync();
        console.log(`✅ Model registered: ${modelClass}`);

    }
}
module.exports = { ProjectModifier };