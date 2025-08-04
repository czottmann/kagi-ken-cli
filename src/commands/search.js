/**
 * @fileoverview Search command implementation for kagi-search CLI
 */

const { Command } = require("commander");
const { performSearch } = require("../web-client");
const { resolveToken } = require("../utils/auth");
const { AUTHENTICATION_HELP } = require("../utils/help-text");

/**
 * Creates and configures the search command
 * @returns {Command} Configured search command
 */
function createSearchCommand() {
  const searchCommand = new Command("search");

  searchCommand
    .description("Search Kagi.com and return structured JSON results")
    .argument("<query>", "Search query to execute")
    .option("--token <token>", "Kagi session token for authentication")
    .addHelpText(
      "after",
      `
Examples:
  $ kagi-search search "steve jobs" --token a1b2c3d4e5f6g7h8i9j0
  $ kagi-search search "search query"

${AUTHENTICATION_HELP}
      `,
    )
    .action(async (query, options) => {
      try {
        const token = resolveToken(options.token);
        const results = await performSearch(query, token);
        console.log(JSON.stringify(results, null, 2));
      } catch (error) {
        console.error(JSON.stringify({ error: error.message }, null, 2));
        process.exit(1);
      }
    });

  return searchCommand;
}

module.exports = {
  createSearchCommand,
};
