const { toTitleCase } = require("../utils/naming.util");
const { createFilesAndFolder } = require("../utils/file.util");
const {generateFromTemplate} = require("../utils/generator.util");
const { validateRequiredName } = require("../utils/validation.util");
const { confirmIfFileMissing } = require("../utils/prompt.util");
const {
  updateApiRouter,
  updateIndexRouter,
  updateContainer,
  updateModelArray,
} = require("../update.files");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

/**
 * @class CreateService
 * @description Service class responsible for creating new projects and generating files for controllers, services, and repositories.
 */
class CreateService {
  constructor() { }
  /**
   * @method createProject
   * @description Creates a new Node.js project with the specified name, sets up the necessary file structure, and installs dependencies.
   * @param {string} projectName - The name of the project to be created
   * @returns {void}
   */
  createProject(projectName) {
    validateRequiredName(projectName, "project");
    const indexpath = projectName + "/src";
    const routerpath = indexpath + "/router";
    const servicepath = indexpath + "/services";
    const controllerpath = indexpath + "/controllers";
    const repositorypath = indexpath + "/repositories";
    const systempath = indexpath + "/systems";
    const modelpath = indexpath + "/models";
    const databasepath = indexpath + "/database";
    let routerObject = {
      routerName: "ApiRouter",
      controllerName: "ExampleController",
      controllerFileName: "example.controller",
    };
    const projectPath = path.join(process.cwd(), projectName);

    console.log(`📁 Creating project files`);

    createFilesAndFolder("index.ejs", {}, "index.ts", indexpath);
    createFilesAndFolder("nodemon.ejs", {}, "nodemon.json", projectName);
    createFilesAndFolder("tsconfig.ejs", {}, "tsconfig.json", projectName);
    createFilesAndFolder("package.ejs", { projectName }, "package.json", projectName);
    createFilesAndFolder("index.router.ejs", {}, "index.ts", routerpath);
    createFilesAndFolder("default.router.ejs", { routerObject }, "api.router.ts", routerpath);
    createFilesAndFolder("example.service.ejs", {}, "example.service.ts", servicepath);
    createFilesAndFolder("example.controller.ejs", {}, "example.controller.ts", controllerpath);
    createFilesAndFolder("example.repository.ejs", {}, "example.repository.ts", repositorypath);
    createFilesAndFolder("container.ejs", {}, "container.ts", systempath);
    createFilesAndFolder("example.env.ejs", {}, "example.env", projectName);
    createFilesAndFolder("example.model.ejs", {}, "example.model.ts", modelpath);
    createFilesAndFolder("model.array.ejs", {}, "model.array.ts", databasepath);
    createFilesAndFolder("typeorm.ejs", {}, "typeORM.ts", databasepath);

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
    validateRequiredName(name, "controller");
    const kebab = name.toLowerCase();

    const shouldCreateRouter = await confirmIfFileMissing(
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
    generateFromTemplate(
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
    validateRequiredName(name, "service");
    generateFromTemplate(
      "service.ejs",
      name,
      "service",
      "src/services",
      "serviceName",
    );
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
    validateRequiredName(name, "repository");
    generateFromTemplate(
      "repository.ejs",
      name,
      "repository",
      "src/repositories",
      "repositoryName",
    );
    updateContainer(name, "repository");
    console.log(`✅ Repository created: ${name}.repository.ts`);
  }
  /**
   * Creates a new model file
   * @method generateModel
   * @param {string} name - The name of the model to be created
   * @returns {void}
   */
  generateModel(name) {
    validateRequiredName(name, "model");
    generateFromTemplate(
      "model.ejs",
      name,
      "model",
      "src/models",
      "modelName",
    );
    updateModelArray(name);
    console.log(`✅ Model created: ${name}.model.ts`);
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
