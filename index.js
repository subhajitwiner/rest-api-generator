#!/usr/bin/env node

const { Command } = require("commander");
const path = require("path");

const { createRepository, createService, createController, createProject } = require("./utils/create.command");

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
    await createController(name);
  });

create
  .command("service <name>")
  .description("Create a new service")
  .action((name) => {
    console.log(name + " creating");
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



