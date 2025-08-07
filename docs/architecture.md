<!-- Generated: 2025-08-02T23:59:27+02:00 -->

# Architecture

## Overview

The kagi-ken tool implements a three-layer architecture that transforms Kagi.com HTML search pages into structured JSON data matching the official Kagi API format. The system operates as a command-line interface that accepts search queries and authentication tokens, performs HTTP requests to Kagi's web interface, and parses the resulting HTML to extract search results using CSS selectors.

The architecture follows a clean separation of concerns with the CLI layer handling user interaction and authentication, the HTTP layer managing web requests with proper headers and error handling, and the parsing layer extracting structured data from Kagi's HTML response format. This design allows the tool to act as a bridge between Kagi's web interface and applications expecting API-formatted responses.

## Component Map

**CLI Layer** - Command-line interface and program entry point in `index.js` (lines 16-71)
- Argument parsing and validation using Commander.js
- Authentication token resolution from flags or `~/.kagi_session_token` file
- Error handling and JSON output formatting

**Search Engine** - Core search functionality in `src/search.js` (lines 22-50)
- HTTP request management with proper User-Agent and session cookie headers
- Response validation and network error handling
- Integration between CLI commands and HTML parsing

**HTML Parser** - Result extraction engine in `src/search.js` (lines 58-185)
- Cheerio-based DOM traversal and data extraction
- Multiple result type handlers for different HTML structures
- CSS selector-based pattern matching for search result elements

**Authentication System** - Token-based authentication across both files
- Session token validation and cookie management in HTTP headers
- File-based token storage and CLI flag precedence handling

## Key Files

**index.js** - Main CLI entry point with Commander.js program setup (lines 16-27), authentication resolution (lines 46-60), and error handling pipeline

**src/search.js** - Core search implementation with `performSearch` function (lines 22-50) for HTTP requests, `parseSearchResults` function (lines 58-94) for HTML parsing, and specialized extractors for different result types (lines 103-185)

**package.json** - Project configuration defining CLI binary mapping (lines 6-8), dependency management for Commander.js and Cheerio (lines 25-28), and npm package metadata

## Data Flow

**Command Routing** - CLI arguments flow from `index.js:84` command dispatcher → command registration at `index.js:81-82` → search command handling in `src/commands/search.js:31`

**Input Processing** - Search arguments processed in `src/commands/search.js:31` → token resolution through `resolveToken()` at line 33 → query and token passed to web client

**HTTP Request Flow** - Search query and token passed to `performSearch` in `src/web-client.js:21` → URL construction with encoded query at `src/web-client.js:32` → HTTP request with session cookie at `src/web-client.js:36` → response validation at `src/web-client.js:41-46`

**HTML Parsing Flow** - Raw HTML from response flows to `parseSearchResults` at `src/web-client.js:49` → Cheerio DOM loading at `src/web-client.js:66` → multiple extraction passes for main results (lines 71-76), grouped results (lines 79-84), and related searches (lines 87-93)

**Result Extraction** - Individual result processing through `extractSearchResult` (lines 110-135) and `extractGroupedResult` (lines 144-169) → CSS selector queries for titles (`.__sri_title_link`), URLs (`href` attributes), and snippets (`.__sri-desc`) → structured JSON assembly with type indicators and metadata

**Output Generation** - Parsed results aggregated into data array at `src/web-client.js:50` → JSON serialization in search command at `src/commands/search.js:35` → stdout output with error handling at `src/commands/search.js:37-39`
