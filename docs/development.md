<!-- Generated: 2025-08-02T19:22:46+02:00 -->

# Development Guide

## Overview

This Node.js CLI project uses a straightforward architecture with Commander.js for CLI handling and Cheerio for HTML parsing. The codebase follows modern JavaScript practices with async/await patterns, clean error handling, and structured JSDoc documentation. The project is organized into a main entry point (`index.js`) and modular search functionality (`src/search.js`), emphasizing separation of concerns between CLI interface and core business logic.

Development follows a minimal approach with no build step required - the code runs directly with Node.js 18+. The architecture prioritizes simplicity and maintainability over complex abstractions, making it easy to understand and modify the search parsing logic as Kagi's HTML structure evolves.

## Code Style

### Documentation Standards

All functions use JSDoc comments with proper type annotations:

```javascript
// From src/search.js:16-21
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
// From index.js:3-6
/**
 * @fileoverview CLI entry point for kagi-search.
 * Searches Kagi.com using session tokens and returns structured JSON results.
 */
```

### Function Organization

Functions are organized with main entry points first, followed by helper functions. Public functions are documented with JSDoc, private helpers include inline comments for complex logic:

```javascript
// From src/search.js:96-102
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
// From src/search.js:34-39
if (!response.ok) {
  if (response.status === 401 || response.status === 403) {
    throw new Error("Invalid or expired session token");
  }
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
```

## Common Patterns

### Commander.js CLI Structure

The main CLI follows a single-command pattern with argument and option handling:

```javascript
// From index.js:19-44
program
  .name("kagi-search")
  .description("Search Kagi.com using session tokens...")
  .argument("[query]", "Search query to execute")
  .option("--token <token>", "Kagi session token for authentication")
  .version(version)
  .action(async (query, options) => {
    if (!query) {
      program.help();
      return;
    }
    // Implementation...
  });
```

### Authentication Flow

Token authentication follows a hierarchical fallback pattern:

```javascript
// From index.js:46-60
const token = options.token || process.env.KAGI_SESSION_TOKEN;

if (!token) {
  console.error(
    JSON.stringify(
      {
        error: "Authentication required: provide --token flag or set KAGI_SESSION_TOKEN environment variable",
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
```

### HTTP Request Pattern

Fetch requests use consistent headers and error handling:

```javascript
// From src/search.js:24-32
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
// From src/search.js:64-69
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
// From src/search.js:108-117
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

1. **Install dependencies**: `npm install` (installs Commander.js and Cheerio from `package.json:25-28`)
2. **Run during development**: `./index.js "query" --token token` 
3. **Test globally**: `npm link` then `kagi-search "query" --token token`

### Adding New Search Result Types

1. **Update parsing logic** in `src/search.js:parseSearchResults()` (line 58)
2. **Add extraction function** following pattern in `extractSearchResult()` (line 103)
3. **Test with sample HTML** using `example-search-result-page.html`

### Debugging HTML Parsing

1. **Save HTML responses** to files for inspection
2. **Use Cheerio selectors** in Node REPL: `const $ = cheerio.load(html); $(".selector")`
3. **Add console.log** statements in extraction functions for debugging

### Error Testing

Test error conditions by modifying token or network connectivity:

```javascript
// Test invalid token
kagi-search "query" --token invalid

// Test missing token  
kagi-search "query"

// Test network error (modify URL in src/search.js:25)
```

### Module Testing

Individual functions can be tested by requiring the module:

```javascript
const { parseSearchResults } = require('./src/search');
const fs = require('fs');
const html = fs.readFileSync('example-search-result-page.html', 'utf8');
const results = parseSearchResults(html);
```

## Reference

### File Organization

- **`/index.js`** - CLI entry point with Commander.js setup and main action handler
- **`/src/search.js`** - Core search functionality with HTTP requests and HTML parsing
- **`/package.json`** - Project configuration with Commander.js and Cheerio dependencies (lines 25-28)
- **`/SPEC.md`** - Complete project specification and requirements
- **`/docs/`** - Documentation directory (defined in `package.json:30`)

### Naming Conventions

- **Functions**: camelCase with descriptive verbs (`performSearch`, `extractSearchResult`)
- **Constants**: UPPER_SNAKE_CASE (`USER_AGENT` in `src/search.js:12`)
- **Module exports**: Explicit object with named functions (`src/search.js:187-190`)

### CSS Selectors Used

Based on Kagi's HTML structure:
- **`.search-result`** - Main search result containers
- **`.__sri_title_link`** - Title links within results
- **`.__sri-desc`** - Result description/snippet text
- **`.sr-group .__srgi`** - Grouped sub-results
- **`.related-searches a span`** - Related search terms

### Common Issues

- **Token expiration**: Results in 401/403 errors (handled in `src/search.js:35-37`)
- **HTML structure changes**: May break CSS selectors - check extraction functions
- **Network timeouts**: Handled with generic error wrapping (lines 45-49)
- **Missing elements**: All extraction functions return null for invalid/missing elements
- **Query encoding**: URLs properly encoded with `encodeURIComponent()` (line 25)