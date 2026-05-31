#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { toTitleCase } = require("./utils/naming.util");
const { updateApiRouter, updateIndexRouter, updateContainer } = require("./update.files");
const { createFilesAndFolder } = require("./utils/file.util");

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
      `Router file for ${name} does not exist. Do you want to create a ${toTitleCase(name)}Router?`,
    );
    if (useDefault) {
      updateApiRouter(name);
      updateContainer(name, "controller");
      createController(name);
      console.log(
        `New controller created as ${name}.controller.ts and registered in API router`,
      );
    } else {
      let routerObject = {
        routerName: toTitleCase(name) + "Router",
        controllerName: toTitleCase(name) + "Controller",
        controllerFileName: name.toLowerCase() + ".controller",
      };
      createFilesAndFolder(
        __dirname,
        "default.router.ejs",
        { routerObject },
        `${name}.router.ts`,
        "src/router",
      );
      updateIndexRouter(name);
      updateContainer(name, "controller");
      createController(name);
      console.log(`New router created as ${name}.router.ts and new controller created as ${name}.controller.ts and router registered in index router`);
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

  createFilesAndFolder(
    __dirname,
    "index.ejs",
    {},
    "index.ts",
    projectName + "/src",
  );
  createFilesAndFolder(
    __dirname,
    "nodemon.ejs",
    {},
    "nodemon.json",
    projectName,
  );
  createFilesAndFolder(
    __dirname,
    "tsconfig.ejs",
    {},
    "tsconfig.json",
    projectName,
  );
  createFilesAndFolder(
    __dirname,
    "package.ejs",
    { projectName },
    "package.json",
    projectName,
  );
  createFilesAndFolder(
    __dirname,
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
    __dirname,
    "default.router.ejs",
    { routerObject },
    "api.router.ts",
    projectName + "/src/router",
  );
  createFilesAndFolder(
    __dirname,
    "example.service.ejs",
    {},
    "example.service.ts",
    projectName + "/src/services",
  );
  createFilesAndFolder(
    __dirname,
    "example.controller.ejs",
    {},
    "example.controller.ts",
    projectName + "/src/controllers",
  );
  createFilesAndFolder(
    __dirname,
    "example.repository.ejs",
    {},
    "example.repository.ts",
    projectName + "/src/repositories",
  );
  createFilesAndFolder(
    __dirname,
    "container.ejs",
    {},
    "container.ts",
    projectName + "/src/systems",
  );

  createFilesAndFolder(
    __dirname,
    "example.env.ejs",
    {},
    "example.env",
    projectName,
  );
  createFilesAndFolder(
    __dirname,
    "example.model.ejs",
    {},
    "example.model.ts",
    projectName + "/src/models",
  );
  createFilesAndFolder(
    __dirname,
    "model.array.ejs",
    {},
    "model.array.ts",
    projectName + "/src/database",
  );
  createFilesAndFolder(
    __dirname,
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
    __dirname,
    "controller.ejs",
    { controllerName: toTitleCase(controllerName) },
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
    __dirname,
    "service.ejs",
    { serviceName: toTitleCase(serviceName) },
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
    __dirname,
    "repository.ejs",
    { repositoryName: toTitleCase(repositoryName) },
    `${repositoryName.toLowerCase()}.repository.ts`,
    "src/repositories",
  );
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
