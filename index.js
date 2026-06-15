#!/usr/bin/env node

const { Command } = require("commander");
const { CreateCommand } = require("./commands/create.command");
const { HelpCommand } = require("./commands/help.command");

const program = new Command();
const create = program.command("create");

const createCommand = new CreateCommand();
const helpCommand = new HelpCommand();
createCommand.register(create);
helpCommand.register(program);



// 🔹 PARSE INPUT
program.parse(process.argv);



