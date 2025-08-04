# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js CLI tool that searches Kagi.com using session tokens (not API keys). It parses Kagi's search result HTML pages and returns structured JSON data matching Kagi's official search API schema.

The project is fully implemented and functional.

## Architecture

- **CLI Framework**: Uses Commander.js for command-line interface
- **Authentication**: Kagi session token via `--token` flag or `~/.kagi_session_token` file
- **Output**: JSON structured to match Kagi Search API response format
- **HTML Parsing**: Extracts search results from Kagi's HTML response pages

## Key Files

- `package.json` - Project configuration with ES modules, Commander.js and Cheerio dependencies
- `SPEC.md` - Complete project specification and requirements
- `example-search-result-page.html` - Sample Kagi search page for parsing reference
- `index.js` - Main CLI entry point with command dispatcher and Commander.js setup
- `src/web-client.js` - Core search functionality with HTTP requests and HTML parsing
- `src/commands/search.js` - Search command implementation
- `src/utils/auth.js` - Authentication utilities and token resolution
- `src/utils/help-text.js` - Shared help text constants

## Implementation Notes

### CLI Structure
The tool uses a command-based structure with Commander.js. Callable as `kagi-search` after npm installation, or `./index.js` during development. Main commands:
- `search <query>` - Perform a search with optional --token flag
- `help [command]` - Display help for commands

ES Modules architecture with `node:` prefix for built-in modules.

### Authentication Flow
1. Check for `--token` flag first in `src/commands/search.js`
2. Fall back to `~/.kagi_session_token` file using `resolveToken()` from `src/utils/auth.js`
3. Token is passed as `kagi_session` cookie when querying Kagi via `src/web-client.js`

### HTML Parsing Strategy
Uses Cheerio with CSS selectors to extract search results from Kagi's HTML:
- Main search results (`.search-result`) with titles (`.__sri_title_link`), URLs, and snippets (`.__sri-desc`)
- Grouped sub-results (`.sr-group .__srgi`) for result clusters
- Related searches (`.related-searches a span`) for search suggestions
- Output formatted to match Kagi Search API schema with type indicators (t: 0 for results, t: 1 for related)

### Development Commands
- `npm install` - Install dependencies (Commander.js, Cheerio)
- `./index.js search "query" --token token` - Run CLI during development
- `./index.js help` or `./index.js help search` - Show help
- `npm link` - Link for global testing during development
- `npm test` - Currently not implemented (shows error message)

## Expected Usage Examples

```bash
# Show help
kagi-search
kagi-search help
kagi-search help search
kagi-search search --help

# Search with token flag
kagi-search search "search query" --token a1b2c3d4e5f6g7h8i9j0

# Search with token file
echo "a1b2c3d4e5f6g7h8i9j0" > ~/.kagi_session_token
kagi-search search "search query"
```