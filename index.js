#!/usr/bin/env node

const { Command } = require("commander");
const { CreateCommand } = require("./commands/create.command");

const program = new Command();
const create = program.command("create");

const createCommand = new CreateCommand();
createCommand.createNew(create);
createCommand.createControllerCommand(create);
createCommand.createServiceCommand(create);
createCommand.createRepositoryCommand(create);
createCommand.showHelp(create);

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



