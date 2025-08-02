#!/usr/bin/env node

/**
 * @fileoverview CLI entry point for kagi-search.
 * Searches Kagi.com using session tokens and returns structured JSON results.
 */

const { Command } = require("commander");
const { version } = require("./package.json");
const { performSearch } = require("./src/search");
const os = require("os");
const fs = require("fs");
const path = require("path");

/**
 * Reads Kagi session token from ~/.kagi_session_token file
 * @returns {string|null} Token content (trimmed) or null if file doesn't exist/is empty
 */
function readTokenFromFile() {
  try {
    const tokenPath = path.join(os.homedir(), ".kagi_session_token");
    const content = fs.readFileSync(tokenPath, "utf8").trim();
    return content || null;
  } catch (error) {
    if (error.code === "ENOENT") {
      return null; // File doesn't exist
    }
    throw new Error(`Unable to read token file: ${error.message}`);
  }
}

/**
 * Main CLI application entry point.
 * Sets up Commander.js program with search command and options.
 */
function main() {
  const program = new Command();

  program
    .name("kagi-search")
    .description(
      "Search Kagi.com using session tokens and return structured JSON results matching the Kagi Search API format",
    )
    .argument("[query]", "Search query to execute")
    .option("--token <token>", "Kagi session token for authentication")
    .version(version)
    .addHelpText(
      "after",
      `
Examples:
  $ kagi-search "steve jobs" --token a1b2c3d4e5f6g7h8i9j0
  $ echo "a1b2c3d4e5f6g7h8i9j0" > ~/.kagi_session_token
  $ kagi-search "search query"

Authentication:
  Provide session token via --token flag or create ~/.kagi_session_token file.
  Get your session token from Kagi.com while logged in.
      `,
    )
    .action(async (query, options) => {
      if (!query) {
        program.help();
        return;
      }
      try {
        const token = options.token || readTokenFromFile();

        if (!token) {
          console.error(
            JSON.stringify(
              {
                error:
                  "Authentication required: provide --token flag or create ~/.kagi_session_token file",
              },
              null,
              2,
            ),
          );
          process.exit(1);
        }

        const results = await performSearch(query, token);
        console.log(JSON.stringify(results, null, 2));
      } catch (error) {
        console.error(JSON.stringify({ error: error.message }, null, 2));
        process.exit(1);
      }
    });

  program.parse();
}

if (require.main === module) {
  main();
}

module.exports = { main };
