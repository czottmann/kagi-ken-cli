#!/usr/bin/env node

/**
 * @fileoverview CLI entry point for kagi-search.
 * Command dispatcher supporting search and help commands.
 */

import { Command } from "commander";
import { readFileSync } from "node:fs";
import { createSearchCommand } from "./src/commands/search.js";
import { AUTHENTICATION_HELP } from "./src/utils/help-text.js";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);
const { version } = packageJson;

/**
 * Creates and configures the help command
 * @param {Command} program - Main program instance
 * @returns {Command} Configured help command
 */
function createHelpCommand(program) {
  const helpCommand = new Command("help");

  helpCommand
    .description("Display help for a command")
    .argument("[command]", "Command to show help for")
    .action((commandName) => {
      if (!commandName) {
        program.help();
        return;
      }

      const command = program.commands.find((cmd) =>
        cmd.name() === commandName
      );
      if (command) {
        command.help();
      } else {
        console.error(`Unknown command: ${commandName}`);
        console.error("Available commands: search, help");
        process.exit(1);
      }
    });

  return helpCommand;
}

/**
 * Main CLI application entry point.
 * Sets up Commander.js program with command-based structure.
 */
function main() {
  const program = new Command();

  program
    .name("kagi-search")
    .description(
      "Search Kagi.com using session tokens and return structured JSON results matching the Kagi Search API format",
    )
    .version(version)
    .addHelpText(
      "after",
      `
Commands:
  search    Search Kagi.com and return JSON results
  help      Display help for a command

Examples:
  $ kagi-search search "steve jobs" --token a1b2c3d4e5f6g7h8i9j0
  $ kagi-search search "search query"
  $ kagi-search help search
  $ kagi-search search --help

${AUTHENTICATION_HELP}
      `,
    );

  // Add commands
  program.addCommand(createSearchCommand());
  program.addCommand(createHelpCommand(program));

  program.parse();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
