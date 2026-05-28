#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const ejs = require("ejs");

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
  .action((name) => {
    createController(name);
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
    console.log("using this command: "+
      "\n rag create controller <name> - Create a new controller" +
      "\n rag create service <name> - Create a new service" +
      "\n rag create repository <name> - Create a new repository" +
      "\n rag create model <name> - Create a new model");
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
  createFilesAndFolder(
    "api.router.ejs",
    {},
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
