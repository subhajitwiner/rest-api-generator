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
  .command("Help")
  .description("Get help for a specific command")
  .action((name) => {
    console.log(
      "Create a new rest api project with custom tpyescript templates",
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

  createFilesAndFolder("index.ejs", {}, "index.ts", projectName + "/src");
  createFilesAndFolder("nodemon.ejs", {}, "nodemon.json", projectName);
  createFilesAndFolder("tsconfig.ejs", {}, "tsconfig.json", projectName);
  createFilesAndFolder("package.ejs", { projectName },"package.json",projectName);
  createFilesAndFolder("index.router.ejs",{},"index.ts", projectName + "/src/router");
  createFilesAndFolder("api.router.ejs",{}, "api.router.ts", projectName + "/src/router");
  createFilesAndFolder("example.service.ejs",{},"example.service.ts",projectName + "/src/services");
  createFilesAndFolder("example.controller.ejs",{},"example.controller.ts",projectName + "/src/controllers");
  createFilesAndFolder("example.repository.ejs",{},"example.repository.ts",projectName + "/src/repositories");
  createFilesAndFolder("types.ejs",{},"types.ts", projectName + "/src/systems");
  createFilesAndFolder("container.ejs",{},"container.ts", projectName+ "/src/systems");
  createFilesAndFolder("container.core.ejs",{},"container.core.ts", projectName+ "/src/systems");

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
    `${controllerName}Controller.ts`,
    "src/controllers",
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
