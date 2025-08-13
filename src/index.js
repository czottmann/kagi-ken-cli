#!/usr/bin/env node

/**
 * @fileoverview CLI entry point for kagi-ken-cli.
 * Command dispatcher supporting search and help commands.
 */

import { Command } from "commander";
import { readFileSync } from "node:fs";
import { createSearchCommand } from "./commands/search.js";
import { createSummarizeCommand } from "./commands/summarize.js";
import { AUTHENTICATION_HELP } from "./utils/help-text.js";

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
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
        console.error("Available commands: search, summarize, help");
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
    .name("kagi-ken-cli")
    .description(
      "Search Kagi.com using session tokens and return structured JSON results matching the Kagi API format",
    )
    .version(version)
    .addHelpText(
      "after",
      `
Commands:
  search      Search Kagi.com and return JSON results
  summarize   Summarize content from URL or text using Kagi's summarizer
  help        Display help for a command

Examples:
  $ kagi-ken-cli search "steve jobs" --token a1b2c3d4e5f6g7h8i9j0
  $ kagi-ken-cli summarize --url "https://example.com" --type summary
  $ kagi-ken-cli help search
  $ kagi-ken-cli summarize --help

${AUTHENTICATION_HELP}
      `,
    );

  // Add commands
  program.addCommand(createSearchCommand());
  program.addCommand(createSummarizeCommand());
  program.addCommand(createHelpCommand(program));

  // Show help when no command is provided
  if (process.argv.length <= 2) {
    program.help();
  }

  program.parse();
}

// Run main() when this file is executed directly (not imported)
if (
  import.meta.url.startsWith("file://") && process.argv[1] &&
  import.meta.url.includes("index.js")
) {
  main();
}

export { main };
