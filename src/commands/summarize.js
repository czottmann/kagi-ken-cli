/**
 * @fileoverview Summarize command implementation for kagi-ken-cli
 */

import { Command } from "commander";
import { performSummarize } from "../web-client.js";
import { resolveToken } from "../utils/auth.js";
import { AUTHENTICATION_HELP } from "../utils/help-text.js";

// Supported language codes from Kagi Universal Summarizer API
const SUPPORTED_LANGUAGES = [
  "BG",
  "CS",
  "DA",
  "DE",
  "EL",
  "EN",
  "ES",
  "ET",
  "FI",
  "FR",
  "HU",
  "ID",
  "IT",
  "JA",
  "KO",
  "LT",
  "LV",
  "NB",
  "NL",
  "PL",
  "PT",
  "RO",
  "RU",
  "SK",
  "SL",
  "SV",
  "TR",
  "UK",
  "ZH",
  "ZH-HANT",
];

/**
 * Creates and configures the summarize command
 * @returns {Command} Configured summarize command
 */
function createSummarizeCommand() {
  const summarizeCommand = new Command("summarize");

  summarizeCommand
    .description("Summarize content from URL or text using Kagi's summarizer")
    .option("--url <url>", "URL to summarize")
    .option("--text <text>", "Text content to summarize")
    .option(
      "--language <language>",
      "Target language (2-character code, e.g., EN, DE)",
      "EN",
    )
    .option("--type <type>", "Summary type: 'summary' or 'takeaway'", "summary")
    .option("--token <token>", "Kagi session token for authentication")
    .addHelpText(
      "after",
      `
Examples:
  $ kagi-ken-cli summarize --url "https://example.com/article" --token a1b2c3d4e5f6g7h8i9j0
  $ kagi-ken-cli summarize --text "Long text to summarize..." --type takeaway
  $ kagi-ken-cli summarize --url "https://example.com" --language DE

${AUTHENTICATION_HELP}
      `,
    )
    .action(async (options) => {
      try {
        // Validate mutually exclusive options
        const hasUrl = Boolean(options.url);
        const hasText = Boolean(options.text);

        if (!hasUrl && !hasText) {
          throw new Error("Either --url or --text must be provided");
        }

        if (hasUrl && hasText) {
          throw new Error(
            "Cannot specify both --url and --text (mutually exclusive)",
          );
        }

        // Validate and normalize type
        const type = options.type.toLowerCase();
        if (!["summary", "takeaway"].includes(type)) {
          throw new Error("Type must be 'summary' or 'takeaway'");
        }

        // Normalize language to uppercase and validate
        const language = options.language.toUpperCase();
        if (!SUPPORTED_LANGUAGES.includes(language)) {
          const sl = SUPPORTED_LANGUAGES.join(", ");
          throw new Error(
            `Unsupported language code '${language}'. Supported languages: ${sl}`,
          );
        }

        // Resolve authentication token
        const token = resolveToken(options.token);

        // Determine input and mode
        const input = hasUrl ? options.url : options.text;
        const isUrl = hasUrl;

        // Perform summarization
        const results = await performSummarize(input, token, {
          type,
          language,
          isUrl,
        });

        console.log(JSON.stringify(results, null, 2));
      } catch (error) {
        console.error(JSON.stringify({ error: error.message }, null, 2));
        process.exit(1);
      }
    });

  return summarizeCommand;
}

export { createSummarizeCommand };
