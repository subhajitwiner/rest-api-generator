/**
 * @class HelpCommand
 * @description This class is responsible for registering the "help" command in the CLI application.
 * It provides users with information about available commands and their usage.
 */
class HelpCommand {
  /**
   * @method register
   * @param {Command} program - The main command program to which the help command will be registered.
   * This method adds the "help" command to the CLI, which displays information about available commands and their usage.
   */
  register(program) {
    program
      .command("help")
      .description("Display help information")
      .action(() => {
        console.log(
          `
Commands:

rag new <projectName>              Create a new Node.js project
rag create controller <name>       Create a new controller
rag create service <name>          Create a new service
rag create repository <name>       Create a new repository
rag create model <name>            Create a new model
rag create --help                  Show create command help
          `,
        );
      });
  }
}

module.exports = { HelpCommand };
