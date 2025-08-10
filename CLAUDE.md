# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js CLI tool that provides access to Kagi.com services using session tokens (not API keys):
- **Search**: Parses Kagi's search result HTML pages and returns structured JSON data matching Kagi's official search API schema
- **Summarizer**: Uses Kagi's Summarizer endpoint to summarize URLs or text content with streaming JSON response parsing

The project is fully implemented and functional.

## Architecture

- **CLI Framework**: Uses Commander.js for command-line interface
- **Authentication**: Kagi session token via `--token` flag or `~/.kagi_session_token` file
- **Output**: JSON structured responses (search API format for search, markdown content for summaries)
- **HTML Parsing**: Extracts search results from Kagi's HTML response pages
- **Stream Processing**: Parses Kagi's streaming JSON responses for summarization

## Key Files

- `package.json` - Project configuration with ES modules, Commander.js and Cheerio dependencies
- `SPEC.md` - Complete project specification and requirements
- `example-search-result-page.html` - Sample Kagi search page for parsing reference
- `index.js` - Main CLI entry point with command dispatcher and Commander.js setup
- `src/web-client.js` - Core functionality with HTTP requests, HTML parsing, and streaming JSON parsing
- `src/commands/search.js` - Search command implementation
- `src/commands/summarize.js` - Summarizer command implementation
- `src/utils/auth.js` - Authentication utilities and token resolution
- `src/utils/help-text.js` - Shared help text constants

## Implementation Notes

### CLI Structure
The tool uses a command-based structure with Commander.js. Callable as `kagi-ken-cli` after npm installation, or `./index.js` during development. Main commands:
- `search <query>` - Perform a search with optional --token flag
- `summarize` - Summarize URL or text content with --url/--text, --type, --language options
- `help [command]` - Display help for commands

ES Modules architecture with `node:` prefix for built-in modules.

### Authentication Flow
1. Check for `--token` flag first in command implementations
2. Fall back to `~/.kagi_session_token` file using `resolveToken()` from `src/utils/auth.js`
3. Token is passed as `kagi_session` cookie when querying Kagi via `src/web-client.js`

### Summarizer Implementation
Uses Kagi's `/mother/summary_labs` endpoint with streaming responses:
- URL summarization: GET request with query parameters
- Text summarization: POST request with form data
- Processes NUL-separated stream messages, extracts final JSON, returns `output_data.markdown`
- Supports language targeting and summary types (summary/takeaway)

### HTML Parsing Strategy
Uses Cheerio with CSS selectors to extract search results from Kagi's HTML:
- Main search results (`.search-result`) with titles (`.__sri_title_link`), URLs, and snippets (`.__sri-desc`)
- Grouped sub-results (`.sr-group .__srgi`) for result clusters
- Related searches (`.related-searches a span`) for search suggestions
- Output formatted to match Kagi API schema with type indicators (t: 0 for results, t: 1 for related)

### Development Commands
- `npm install` - Install dependencies (Commander.js, Cheerio)
- `./index.js search "query" --token token` - Run search during development
- `./index.js summarize --url "https://example.com" --token token` - Run summarizer during development
- `./index.js help` or `./index.js help search` - Show help
- `npm link` - Link for global testing during development
- `npm test` - Currently not implemented (shows error message)

## Expected Usage Examples

```bash
# Show help
kagi-ken-cli
kagi-ken-cli help
kagi-ken-cli help search
kagi-ken-cli summarize --help

# Search with token flag
kagi-ken-cli search "search query" --token a1b2c3d4e5f6g7h8i9j0

# Summarize URL with defaults (type=summary, language=EN)
kagi-ken-cli summarize --url "https://example.com/article" --token a1b2c3d4e5f6g7h8i9j0

# Summarize text with custom options
kagi-ken-cli summarize --text "Long text content..." --type takeaway --language DE --token token

# Using token file for both commands
echo "a1b2c3d4e5f6g7h8i9j0" > ~/.kagi_session_token
kagi-ken-cli search "search query"
kagi-ken-cli summarize --url "https://example.com"
```
