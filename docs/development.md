<!-- Generated: 2025-08-04T21:37:01+02:00 -->

# Development Guide

## Overview

This Node.js CLI project uses ES modules with a command-based architecture built on Commander.js for CLI handling and Cheerio for HTML parsing. The codebase follows modern JavaScript practices with ES module imports using the `node:` prefix, async/await patterns, clean error handling, and structured JSDoc documentation. The project is organized with a command dispatcher entry point (`index.js`), modular command implementations (`src/commands/`), utility modules (`src/utils/`), and core web client functionality (`src/web-client.js`).

Development follows a minimal approach with no build step required - the code runs directly with Node.js 18+ using ES modules. The architecture prioritizes simplicity and maintainability through clear separation of concerns: command handling, authentication utilities, and web client functionality are isolated into distinct modules.

## Code Style

### Documentation Standards

All functions use JSDoc comments with proper type annotations:

```javascript
// From src/web-client.js:15-20
/**
 * Performs a search on Kagi.com and returns structured results
 *
 * @param {string} query - Search query
 * @param {string} token - Kagi session token
 * @returns {Promise<Object>} Object containing data array with search results and related searches
 */
```

### File Headers

Each module includes a descriptive fileoverview comment:

```javascript
// From index.js:4-6
/**
 * @fileoverview CLI entry point for kagi-ken-cli.
 * Command dispatcher supporting search and help commands.
 */
```

### Function Organization

Functions are organized with main entry points first, followed by helper functions. Public functions are documented with JSDoc, private helpers include inline comments for complex logic:

```javascript
// From src/web-client.js:104-109
/**
 * Extracts a single search result from a search-result element
 *
 * @param {CheerioAPI} $ - Cheerio instance
 * @param {CheerioElement} element - Search result element
 * @returns {Object|null} Parsed search result or null if invalid
 */
```

### Error Handling Patterns

The codebase uses consistent error handling with descriptive messages and proper HTTP status code checking:

```javascript
// From src/web-client.js:41-46
if (!response.ok) {
  if (response.status === 401 || response.status === 403) {
    throw new Error("Invalid or expired session token");
  }
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
```

## Common Patterns

### Commander.js Command-Based CLI Structure

The main CLI uses a command dispatcher pattern with separate command implementations:

```javascript
// From index.js:54-82
const program = new Command();

program
  .name("kagi-ken-cli")
  .description("Search Kagi.com using session tokens and return structured JSON results matching the Kagi API format")
  .version(version)
  .addHelpText("after", `
Commands:
  search    Search Kagi.com and return JSON results
  help      Display help for a command
`);

// Add commands
program.addCommand(createSearchCommand());
program.addCommand(createHelpCommand(program));
```

Search command implementation is modularized:

```javascript
// From src/commands/search.js:14-42
function createSearchCommand() {
  const searchCommand = new Command("search");
  
  searchCommand
    .description("Search Kagi.com and return structured JSON results")
    .argument("<query>", "Search query to execute")
    .option("--token <token>", "Kagi session token for authentication")
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
```

### Authentication Flow

Token authentication is handled by a dedicated utility module with hierarchical fallback:

```javascript
// From src/utils/auth.js:32-42
function resolveToken(tokenFlag) {
  const token = tokenFlag || readTokenFromFile();

  if (!token) {
    throw new Error(
      "Authentication required: provide --token flag or create ~/.kagi_session_token file",
    );
  }

  return token;
}
```

The `readTokenFromFile()` helper function safely reads from `~/.kagi_session_token`:

```javascript
// From src/utils/auth.js:13-24
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
```

### HTTP Request Pattern

Fetch requests use consistent headers and error handling:

```javascript
// From src/web-client.js:31-39
const response = await fetch(
  `https://kagi.com/html/search?q=${encodeURIComponent(query)}`,
  {
    headers: {
      "User-Agent": USER_AGENT,
      "Cookie": `kagi_session=${token}`,
    },
  },
);
```

### HTML Parsing Strategy

Cheerio parsing uses CSS selectors with defensive programming for element extraction:

```javascript
// From src/web-client.js:71-76
$(".search-result").each((_, element) => {
  const result = extractSearchResult($, element);
  if (result) {
    results.push(result);
  }
});
```

### Safe Element Extraction

Element parsing includes null checks and fallbacks:

```javascript
// From src/web-client.js:115-124
const titleLink = $element.find(".__sri_title_link").first();
const title = titleLink.text().trim();
const url = titleLink.attr("href");
const snippet = $element.find(".__sri-desc").text().trim();

if (!title || !url) {
  return null;
}
```

## Workflows

### Development Setup

1. **Install dependencies**: `npm install` (installs Commander.js and Cheerio from `package.json:24-27`)
2. **Run during development**: `./index.js search "query" --token token` 
3. **Test globally**: `npm link` then `kagi-ken-cli search "query" --token token`

### Adding New Search Result Types

1. **Update parsing logic** in `src/web-client.js:parseSearchResults()` (line 65)
2. **Add extraction function** following pattern in `extractSearchResult()` (line 110)
3. **Test with sample HTML** using `example-search-result-page.html`

### Debugging HTML Parsing

1. **Save HTML responses** to files for inspection
2. **Use Cheerio selectors** in Node REPL: `const $ = cheerio.load(html); $(".selector")`
3. **Add console.log** statements in extraction functions for debugging

### Error Testing

Test error conditions by modifying token or network connectivity:

```javascript
// Test invalid token
kagi-ken-cli search "query" --token invalid

// Test missing token (no file and no flag)
rm ~/.kagi_session_token
kagi-ken-cli search "query"

// Test with token file
echo "your_token_here" > ~/.kagi_session_token
kagi-ken-cli search "query"

// Test network error (modify URL in src/web-client.js:32)
```

### Module Testing

Individual functions can be tested by requiring the module:

```javascript
import { parseSearchResults } from './src/web-client.js';
import { readFileSync } from 'node:fs';
const html = readFileSync('example-search-result-page.html', 'utf8');
const results = parseSearchResults(html);
```

## Reference

### File Organization

- **`/index.js`** - CLI entry point with command dispatcher and help system (lines 54-85)
- **`/src/commands/search.js`** - Search command implementation with argument parsing
- **`/src/web-client.js`** - Core search functionality with HTTP requests and HTML parsing
- **`/src/utils/auth.js`** - Authentication utilities for token resolution
- **`/src/utils/help-text.js`** - Shared help text constants
- **`/package.json`** - Project configuration with ES modules and dependencies (lines 24-27)
- **`/SPEC.md`** - Complete project specification and requirements
- **`/docs/`** - Documentation directory (defined in `package.json:29`)

### Naming Conventions

- **Functions**: camelCase with descriptive verbs (`performSearch`, `extractSearchResult`)
- **Constants**: UPPER_SNAKE_CASE (`USER_AGENT` in `src/web-client.js:11`, `AUTHENTICATION_HELP` in `src/utils/help-text.js:8`)
- **Module exports**: ES module named exports (`src/web-client.js:194`, `src/utils/auth.js:53`)

### CSS Selectors Used

Based on Kagi's HTML structure:
- **`.search-result`** - Main search result containers
- **`.__sri_title_link`** - Title links within results
- **`.__sri-desc`** - Result description/snippet text
- **`.sr-group .__srgi`** - Grouped sub-results
- **`.related-searches a span`** - Related search terms

### Common Issues

- **Token expiration**: Results in 401/403 errors (handled in `src/web-client.js:42-44`)
- **HTML structure changes**: May break CSS selectors - check extraction functions
- **Network timeouts**: Handled with generic error wrapping (lines 52-56)
- **Missing elements**: All extraction functions return null for invalid/missing elements
- **Query encoding**: URLs properly encoded with `encodeURIComponent()` (line 32)
- **ES Module imports**: Use import/export syntax with `node:` prefix for built-in modules
