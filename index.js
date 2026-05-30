#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const ejs = require("ejs");
const { Project } = require("ts-morph");

const program = new Command();
const create = program.command("create");

// 🔹 CREATE COMMAND
create
  .command("new <projectName>")
  .description("Create a new Node.js project")
  .action((projectName) => {
    createProject(projectName);
  });

// 🔹 SAY HELLO COMMAND
create
  .command("controller <name>")
  .description("Create a new controller")
  .action(async (name) => {
    let useDefault = await checkFileExistsAndPrompt(
      `${name.toLowerCase()}.router.ts`,
      "router",
      `Router file for ${name} does not exist. Do you want to create a default router?`,
    );
    if (useDefault) {
      updateApiRouter(name);
      createController(name);
      console.log(`New controller created as ${name}.controller.ts and registered in API router`);
    } else {
      let routerObject = {
        routerName: toTitleCase(name) + "Router",
        controllerName: toTitleCase(name) + "Controller",
        controllerFileName: name.toLowerCase() + ".controller",
      };
      createFilesAndFolder(
        "default.router.ejs",
        { routerObject },
        `${name}.router.ts`,
        "src/router",
      );
      updateIndexRouter(name);
      createController(name);
      console.log(`New router created as ${name}.router.ts`);
    }
    
  });

create
  .command("service <name>")
  .description("Create a new service")
  .action((name) => {
    createService(name);
  });

create
  .command("repository <name>")
  .description("Create a new repository")
  .action((name) => {
    createRepository(name);
  });

create
  .command("Help")
  .description("Get help for a specific command")
  .action((name) => {
    console.log(
      "using this command: " +
        "\n rag create controller <name> - Create a new controller" +
        "\n rag create service <name> - Create a new service" +
        "\n rag create repository <name> - Create a new repository" +
        "\n rag create model <name> - Create a new model",
    );
  });

program
  .command("help")
  .description("Display help information")
  .action(() => {
    console.log(
      "Commands: \n rag new <projectName> - Create a new Node.js project" +
        "\n rag create --help - Get help for a specific command" +
        "\n rag create controller <name> - Create a new controller",
      "\n rag create service <name> - Create a new service" +
        "\n rag create repository <name> - Create a new repository" +
        "\n rag create model <name> - Create a new model",
    );
  });

// 🔹 PARSE INPUT
program.parse(process.argv);

// ================= FUNCTION =================
function createProject(projectName) {
  if (!projectName) {
    console.log("❌ Please provide a project name");
    process.exit(1);
  }
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`📁 Creating project files`);

  createFilesAndFolder("index.ejs", {}, "index.ts", projectName + "/src");
  createFilesAndFolder("nodemon.ejs", {}, "nodemon.json", projectName);
  createFilesAndFolder("tsconfig.ejs", {}, "tsconfig.json", projectName);
  createFilesAndFolder(
    "package.ejs",
    { projectName },
    "package.json",
    projectName,
  );
  createFilesAndFolder(
    "index.router.ejs",
    {},
    "index.ts",
    projectName + "/src/router",
  );
  let routerObject = {
    routerName: "ApiRouter",
    controllerName: "ExampleController",
    controllerFileName: "example.controller",
  };
  createFilesAndFolder(
    "default.router.ejs",
    { routerObject },
    "api.router.ts",
    projectName + "/src/router",
  );
  createFilesAndFolder(
    "example.service.ejs",
    {},
    "example.service.ts",
    projectName + "/src/services",
  );
  createFilesAndFolder(
    "example.controller.ejs",
    {},
    "example.controller.ts",
    projectName + "/src/controllers",
  );
  createFilesAndFolder(
    "example.repository.ejs",
    {},
    "example.repository.ts",
    projectName + "/src/repositories",
  );
  createFilesAndFolder(
    "container.ejs",
    {},
    "container.ts",
    projectName + "/src/systems",
  );

  createFilesAndFolder("example.env.ejs", {}, "example.env", projectName);
  createFilesAndFolder(
    "example.model.ejs",
    {},
    "example.model.ts",
    projectName + "/src/models",
  );
  createFilesAndFolder(
    "model.array.ejs",
    {},
    "model.array.ts",
    projectName + "/src/database",
  );
  createFilesAndFolder(
    "typeorm.ejs",
    {},
    "typeORM.ts",
    projectName + "/src/database",
  );

  console.log("📦 Installing dependencies...");
  execSync("npm install", { cwd: projectPath, stdio: "inherit" });
  console.log("🚀 Project ready!");
}
function createController(controllerName) {
  if (!controllerName) {
    console.log("❌ Please provide a controller name");
    process.exit(1);
  }
  createFilesAndFolder(
    "controller.ejs",
    { controllerName },
    `${controllerName.toLowerCase()}.controller.ts`,
    "src/controllers",
  );
}
function createService(serviceName) {
  if (!serviceName) {
    console.log("❌ Please provide a service name");
    process.exit(1);
  }
  createFilesAndFolder(
    "service.ejs",
    { serviceName },
    `${serviceName.toLowerCase()}.service.ts`,
    "src/services",
  );
}
function createRepository(repositoryName) {
  if (!repositoryName) {
    console.log("❌ Please provide a repository name");
    process.exit(1);
  }
  createFilesAndFolder(
    "repository.ejs",
    { repositoryName },
    `${repositoryName.toLowerCase()}.repository.ts`,
    "src/repositories",
  );
}

/**
 * @param {string} templateFile - The name of the EJS template file to use.
 * @param {object} data - An object containing the data to be injected into the template.
 * @param {string} filename - The name of the output file to be created.
 * @param {string} [filePath] - Optional. The directory path where the output file should be created. If not provided, the file will be created in the current directory.
 */
function createFilesAndFolder(templateFile, data, filename, filePath = "") {
  const templatePath = path.join(__dirname, "templates", templateFile);

  const template = fs.readFileSync(templatePath, "utf-8");

  // Render using EJS
  const output = ejs.render(template, data);

  if (filePath) {
    // Create output directory if it doesn't exist

    const outputDir = path.join(process.cwd(), filePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outputDir, `${filename}`), output);
  } else {
    fs.writeFileSync(path.join(`${filename}`), output);
  }
}
function toTitleCase(str) {
  return str
    .split(/[\s-_]+/) // handle space, dash, underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
function updateIndexRouter(name) {
  const project = new Project();
  const filePath = path.join(process.cwd(), "src/router/index.ts");
  const sourceFile = project.addSourceFileAtPath(filePath);
  const pascal = toPascalCase(name);
  const kebab = toKebabCase(name);
  const importName = `${pascal}Router`;
  const importPath = `./${kebab}.router`;

  // ======================
  // ✅ 1. Add Import
  // ======================
  const existingImport = sourceFile.getImportDeclaration(
    (imp) => imp.getModuleSpecifierValue() === importPath,
  );
  if (!existingImport) {
    sourceFile.addImportDeclaration({
      namedImports: [importName],
      moduleSpecifier: importPath,
    });
  }
  // ======================
  // ✅ 2. Find Class
  // ======================
  const cls = sourceFile.getClass("IndexRouter");
  if (!cls) {
    console.log("❌ IndexRouter class not found");
    return;
  }
  // ======================
  // ✅ 3. Find route() method
  // ======================
  const method = cls.getMethod("route");
  if (!method) {
    console.log("❌ route() method not found");
    return;
  }
  const body = method.getBody();
  if (!body) return;
  const routeLine = `${importName}(this.router,'/${kebab}');`;
  // ======================
  // ✅ 4. Prevent duplicate
  // ======================
  if (body.getText().includes(routeLine)) {
    console.log("⚠️ Router already exists");
    return;
  }
  // ======================
  // ✅ 5. Insert before return
  // ======================
  const returnStmt = body
    .getStatements()
    .find((stmt) => stmt.getText().includes("return this.router"));

  if (returnStmt) {
    body.insertStatements(returnStmt.getChildIndex(), routeLine);
  }
  // ======================
  // ✅ 6. Save file
  // ======================
  sourceFile.saveSync();
  console.log("✅ Index router updated (AST safe)");
}
function toPascalCase(str) {
  return str
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
/**
 * @param {string} fileName - The name of the file to check for existence.
 * @param {string} directory - The directory where the file is expected to be located.
 * @param {string} message - The message to display in the confirmation prompt if the file does not exist.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether to use the default option or not.
 */
async function checkFileExistsAndPrompt(fileName, directory, message) {
  const filepath = path.join(process.cwd(), `src/${directory}/${fileName}`);
  const { confirm } = await import("@inquirer/prompts");
  let useDefault = false;
  if (!fs.existsSync(filepath)) {
    useDefault = await confirm({
      message,
      default: true,
    });
  }
  return useDefault;
}

function updateApiRouter(name) {
  const { Project } = require("ts-morph");
  const path = require("path");

  const project = new Project();

  const filePath = path.join(process.cwd(), "src/router/api.router.ts");
  const sourceFile = project.addSourceFileAtPath(filePath);

  const pascal = toPascalCase(name);
  const camel = toCamelCase(name);
  const kebab = toKebabCase(name);

  const controllerClass = `${pascal}Controller`;
  const controllerVar = `${camel}Controller`;
  const importPath = `../controllers/${kebab}.controller`;

  // ✅ Add import
  const existingImport = sourceFile.getImportDeclaration(
    (imp) => imp.getModuleSpecifierValue() === importPath
  );

  if (!existingImport) {
    sourceFile.addImportDeclaration({
      namedImports: [controllerClass],
      moduleSpecifier: importPath,
    });
  }

  // ✅ Add makeInvoker
  const exists = sourceFile.getVariableStatements().some(v =>
    v.getText().includes(`const ${controllerVar}`)
  );

  if (!exists) {
    const lastInvoker = sourceFile
      .getVariableStatements()
      .filter(v => v.getText().includes("makeInvoker"))
      .pop();

    if (lastInvoker) {
      const index = lastInvoker.getChildIndex();
      sourceFile.insertStatements(
        index + 1,
        `const ${controllerVar} = makeInvoker(${controllerClass});`
      );
    }
  }

  sourceFile.saveSync();

  console.log("✅ Controller registered in default API router");
}