const { Command } = require("commander");
const { CreateService } = require("../services/create.service");

/**
 * @class CreateCommand
 * @description Command class responsible for defining CLI commands related to creating new projects, controllers, services, and repositories. It uses the CreateService to perform the actual file generation and project setup tasks.
 */
class CreateCommand {
  service = new CreateService();
  /**
   * @method createNew
   * @param {Command} commandName - The command to create a new project
   */
  createNew(commandName) {
    commandName
      .command("new <projectName>")
      .description("Create a new Node.js project")
      .action((projectName) => {
        this.service.createProject(projectName);
      });
  }
  /**
   * @method createControllerCommand
   * @param {Command} commandName - The command to create a new project
   */
  createControllerCommand(commandName) {
    commandName
      .command("controller <name>")
      .description("Create a new controller")
      .action(async (name) => {
        await this.service.generateController(name);
      });
  }

  /**
   * @method createServiceCommand
   * @param {Command} commandName - The command to create a new project
   */
  createServiceCommand(commandName) {
    commandName
      .command("service <name>")
      .description("Create a new service")
      .action((name) => {
        console.log(name + " creating");
        this.service.generateService(name);
      });
  }
  /**
   * @method createRepositoryCommand
   * @param {Command} commandName - The command to create a new project
   */
  createRepositoryCommand(commandName) {
    commandName
      .command("repository <name>")
      .description("Create a new repository")
      .action((name) => {
        this.service.generateRepository(name);
      });
  }
  /**
   * @method showHelp
   * @param {Command} commandName - The command to display help information
   */
  showHelp(commandName) {
    commandName
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
  }
}

module.exports = {
  CreateCommand,
};
