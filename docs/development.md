<!-- Generated: 2025-08-10T16:30:29+02:00 -->

# Development Guide

## Overview

This Node.js CLI project serves as a lightweight wrapper around the core `kagi-ken` package, using ES modules with a command-based architecture built on Commander.js. The CLI handles command-line argument parsing, authentication token resolution, and output formatting, while delegating all complex functionality to the kagi-ken package. The codebase follows modern JavaScript practices with ES module imports using the `node:` prefix, async/await patterns, and structured JSDoc documentation.

Development follows a minimal approach with no build step required - the code runs directly with Node.js 18+ using ES modules. The architecture prioritizes simplicity and maintainability through clear separation between CLI interface concerns (command parsing, token handling) and business logic (HTTP requests, HTML parsing, stream processing) which is handled by the separate kagi-ken package.

## Code Style

### Documentation Standards

All functions use JSDoc comments with proper type annotations:

```javascript
// From src/commands/search.js:14-42
/**
 * Creates and configures the search command
 * @returns {Command} Configured search command
 */
function createSearchCommand() {
  const searchCommand = new Command("search");
  // Command configuration...
}
```

### File Headers

Each module includes a descriptive fileoverview comment:

```javascript
// From index.js:3-6
/**
 * @fileoverview CLI entry point for kagi-ken-cli.
 * Command dispatcher supporting search and summarize commands.
 */
```

### Function Organization

Functions are organized with main entry points first, followed by helper functions. Public functions are documented with JSDoc, private helpers include inline comments for complex logic:

```javascript
// From src/commands/summarize.js:14-38
/**
 * Creates and configures the summarize command
 * @returns {Command} Configured summarize command
 */
function createSummarizeCommand() {
  const summarizeCommand = new Command("summarize");
  // Command configuration with URL/text options...
}
```

### Error Handling Patterns

The codebase uses consistent error handling with descriptive messages and proper HTTP status code checking:

```javascript
// From src/commands/search.js:36-39
try {
  const token = resolveToken(options.token);
  const results = await search(query, token);
  console.log(JSON.stringify(results, null, 2));
} catch (error) {
  console.error(JSON.stringify({ error: error.message }, null, 2));
  process.exit(1);
}
```

## Common Patterns

### Commander.js Command-Based CLI Structure

The main CLI uses a command dispatcher pattern with separate command implementations:

```javascript
// From index.js:58-85
const program = new Command();

program
  .name("kagi-ken-cli")
  .description("Search Kagi.com using session tokens and return structured JSON results matching the Kagi API format")
  .version(version)
  .addHelpText("after", `
Commands:
  search      Search Kagi.com and return JSON results
  summarize   Summarize content from URL or text using Kagi's summarizer
  help        Display help for a command
`);

// Add commands
program.addCommand(createSearchCommand());
program.addCommand(createSummarizeCommand());
program.addCommand(createHelpCommand(program));
```

Command implementations are modularized and import from kagi-ken package:

```javascript
// From src/commands/search.js:5-6, 31-40
import { search } from "kagi-ken";

// In action handler:
.action(async (query, options) => {
  try {
    const token = resolveToken(options.token);
    const results = await search(query, token);  // Call kagi-ken package
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
    process.exit(1);
  }
});
```

```javascript
// From src/commands/summarize.js:5-6, 77-84
import { summarize, SUPPORTED_LANGUAGES } from "kagi-ken";

// In action handler:
const results = await summarize(input, token, {
  type,
  language,
  isUrl,
});  // Call kagi-ken package
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

### Package Integration Pattern

CLI commands integrate with kagi-ken package functions:

```javascript
// From src/commands/search.js:34
const results = await search(query, token);  // Direct call to kagi-ken package

// From src/commands/summarize.js:78-82
const results = await summarize(input, token, {
  type,
  language,
  isUrl,
});  // Call kagi-ken package with options object
```

### Input Validation Pattern

Summarize command implements comprehensive input validation:

```javascript
// From src/commands/summarize.js:42-68
// Validate mutually exclusive options
const hasUrl = Boolean(options.url);
const hasText = Boolean(options.text);

if (!hasUrl && !hasText) {
  throw new Error("Either --url or --text must be provided");
}

if (hasUrl && hasText) {
  throw new Error("Cannot specify both --url and --text (mutually exclusive)");
}

// Validate language code
const language = options.language.toUpperCase();
if (!SUPPORTED_LANGUAGES.includes(language)) {
  throw new Error(`Unsupported language code '${language}'`);
}
```

### Shared Authentication Pattern

Both commands use the same authentication resolution pattern:

```javascript
// From src/commands/search.js:33 and src/commands/summarize.js:71
const token = resolveToken(options.token);

// resolveToken() checks CLI flag first, then file, from src/utils/auth.js:32-42
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

## Workflows

### Development Setup

1. **Install dependencies**: `npm install` (installs Commander.js and kagi-ken package from `package.json:26-28`)
2. **Run search during development**: `./index.js search "query" --token token` 
3. **Run summarize during development**: `./index.js summarize --url "https://example.com" --token token`
4. **Test globally**: `npm link` then `kagi-ken-cli search "query" --token token`

### Adding New Commands

1. **Create command file** in `src/commands/new-command.js` following existing patterns
2. **Import kagi-ken functions** needed for the command functionality
3. **Add command registration** in `index.js:83-85` with `createNewCommand()`
4. **Update help text** in `index.js` to include the new command

### Debugging CLI Integration

1. **Add console.log** statements in command handlers before kagi-ken package calls
2. **Test error handling** by passing invalid tokens or parameters
3. **Use Node.js debugger** with `node --inspect ./index.js command args`
4. **Check kagi-ken package** logs and errors for core functionality issues

### Error Testing

Test error conditions by modifying tokens or command options:

```bash
# Test invalid token
kagi-ken-cli search "query" --token invalid

# Test missing token (no file and no flag)
rm ~/.kagi_session_token
kagi-ken-cli search "query"

# Test with token file
echo "your_token_here" > ~/.kagi_session_token
kagi-ken-cli search "query"

# Test summarize command errors
kagi-ken-cli summarize  # No URL or text provided
kagi-ken-cli summarize --url "example.com" --text "also text"  # Mutually exclusive
kagi-ken-cli summarize --url "example.com" --language INVALID  # Bad language code
```

### Module Testing

Individual CLI utilities can be tested by importing the module:

```javascript
import { resolveToken } from './src/utils/auth.js';
import { createSearchCommand } from './src/commands/search.js';
import { createSummarizeCommand } from './src/commands/summarize.js';

// Test authentication resolution
const token = resolveToken('test-token');

// Test command creation
const searchCmd = createSearchCommand();
const summarizeCmd = createSummarizeCommand();
```

## Reference

### File Organization

- **`/index.js`** - CLI entry point with command dispatcher and help system (lines 58-93)
- **`/src/commands/search.js`** - Search command implementation importing from kagi-ken package
- **`/src/commands/summarize.js`** - Summarize command implementation importing from kagi-ken package
- **`/src/utils/auth.js`** - Authentication utilities for token resolution shared across commands
- **`/src/utils/help-text.js`** - Shared help text constants used in commands
- **`/package.json`** - Project configuration with ES modules and dependencies (lines 26-28)
- **`/docs/`** - Documentation directory (defined in `package.json:30`)

### Naming Conventions

- **Functions**: camelCase with descriptive verbs (`createSearchCommand`, `resolveToken`)
- **Constants**: UPPER_SNAKE_CASE (`AUTHENTICATION_HELP` in `src/utils/help-text.js:8`)
- **Module exports**: ES module named exports (`src/commands/search.js:45`, `src/utils/auth.js:53`)
- **Package imports**: Named imports from kagi-ken package (`search`, `summarize`, `SUPPORTED_LANGUAGES`)

### CSS Selectors Used

HTML parsing is handled by the kagi-ken package. CLI-specific patterns:
- **Command creation functions** - `createSearchCommand()`, `createSummarizeCommand()`
- **Option validation** - Input validation before calling kagi-ken functions
- **Error handling** - Consistent JSON error output across commands
- **Authentication flow** - Token resolution from CLI flags or file

### Common Issues

- **Token expiration**: Results in authentication errors from kagi-ken package, caught and formatted by CLI commands
- **Missing options**: Summarize command validates required URL/text input and mutual exclusivity
- **Invalid options**: Language codes and summary types validated against supported values from kagi-ken package
- **Command routing**: All commands properly registered in main program dispatcher
- **Package integration**: Ensure kagi-ken package is properly installed and imported
- **ES Module imports**: Use import/export syntax with `node:` prefix for built-in modules, named imports for kagi-ken
