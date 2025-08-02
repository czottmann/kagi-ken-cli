# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js CLI tool that searches Kagi.com using session tokens (not API keys). It parses Kagi's search result HTML pages and returns structured JSON data matching Kagi's official search API schema.

The project is currently in specification phase - implementation has not started yet.

## Architecture

- **CLI Framework**: Uses Commander.js for command-line interface
- **Authentication**: Kagi session token via `--token` flag or `KAGI_SESSION_TOKEN` environment variable
- **Output**: JSON structured to match Kagi Search API response format
- **HTML Parsing**: Extracts search results from Kagi's HTML response pages

## Key Files

- `package.json` - Project configuration with Commander.js dependency
- `SPEC.md` - Complete project specification and requirements
- `example-search-result-page.html` - Sample Kagi search page for parsing reference
- `index.js` - Main CLI entry point (to be created)

## Implementation Notes

### CLI Structure
The tool should be callable as `kagi-search` after npm installation, or `./index.js` during development. Reference the "render-claude-context.txt" structure mentioned in SPEC.md for CLI patterns.

### Authentication Flow
1. Check for `--token` flag first
2. Fall back to `KAGI_SESSION_TOKEN` environment variable
3. Token is passed as URL parameter `token` when querying Kagi

### HTML Parsing Strategy
Use the provided `example-search-result-page.html` to understand Kagi's search result structure and extract:
- Search results with titles, URLs, snippets
- Search metadata (timing, result count)
- Format output to match Kagi Search API schema

### Development Commands
- `npm test` - Currently not implemented (shows error message)
- No build or lint commands defined yet

## Expected Usage Examples

```bash
# Show help
kagi-search
kagi-search help
kagi-search --help

# Search with token flag
kagi-search "search query" --token a1b2c3d4e5f6g7h8i9j0

# Search with environment variable
export KAGI_SESSION_TOKEN=a1b2c3d4e5f6g7h8i9j0
kagi-search "search query"
```