const { toTitleCase } = require("../utils/naming.util");
const { createFilesAndFolder } = require("../utils/file.util");
const {
  updateApiRouter,
  updateIndexRouter,
  updateContainer,
} = require("../update.files");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

/**
 * @class CreateService
 * @description Service class responsible for creating new projects and generating files for controllers, services, and repositories.
 */
class CreateService {
  constructor() {}
  /**
   * @method createProject
   * @description Creates a new Node.js project with the specified name, sets up the necessary file structure, and installs dependencies.
   * @param {string} projectName - The name of the project to be created
   * @returns {void}
   */
  createProject(projectName) {
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

  /**
   * Creates a new controller file
   * @method generateController
   * @param {string} name - The name of the controller to be created
   * @returns {Promise<void>}
   */
  async generateController(name) {
    this.validateName(name, "controller");
    const kebab = name.toLowerCase();

    const shouldCreateRouter = await this.checkFileExistsAndPrompt(
      `${kebab}.router.ts`,
      "router",
      `Router for ${name} not found. Create ${toTitleCase(name)}Router?`,
    );

    if (shouldCreateRouter) {
      this.createRouter(name);
      updateIndexRouter(name);
      console.log("✅ Router created and registered in index router");
    } else {
      updateApiRouter(name);
      console.log("✅ Registered in API router");
    }

    // Create controller
    this.generateFile(
      "controller.ejs",
      name,
      "controller",
      "src/controllers",
      "controllerName",
    );

    updateContainer(name, "controller");

    console.log(`✅ Controller created: ${name}.controller.ts`);
  }
  /**
   * Creates a new service file
   * @method generateService
   * @param {string} name - The name of the service to be created
   * @returns {void}
   */
  generateService(name) {
    this.validateName(name, "service");
    this.generateFile("service.ejs", name, "service", "src/services", "serviceName");
    updateContainer(name, "service");
    console.log(`✅ Service created: ${name}.service.ts`);
  }
  /**
   * Creates a new repository file
   * @method generateRepository
   * @param {string} name - The name of the repository to be created
   * @returns {void}
   */
  generateRepository(name) {
    this.validateName(name, "repository");
    this.generateFile(
      "repository.ejs",
      name,
      "repository",
      "src/repositories",
      "repositoryName",
    );
    updateContainer(name, "repository");
    console.log(`✅ Repository created: ${name}.repository.ts`);
  }
  generateFile(template, name, suffix, folder, keyName) {
    createFilesAndFolder(
      template,
      { [keyName]: toTitleCase(name) },
      `${name.toLowerCase()}.${suffix}.ts`,
      folder,
    );
  }
  validateName(name, type) {
    if (!name) {
      console.log(`❌ Please provide a ${type} name`);
      process.exit(1);
    }
  }
  async checkFileExistsAndPrompt(fileName, directory, message) {
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
  createRouter(name) {
    const routerObject = {
      routerName: `${toTitleCase(name)}Router`,
      controllerName: `${toTitleCase(name)}Controller`,
      controllerFileName: `${name.toLowerCase()}.controller`,
    };

    createFilesAndFolder(
      "default.router.ejs",
      { routerObject },
      `${name.toLowerCase()}.router.ts`,
      "src/router",
    );
  }
}
module.exports = { CreateService };
