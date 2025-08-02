<!-- Generated: 2025-08-02T19:22:46+02:00 -->

# Architecture

## Overview

The kagi-web-search tool implements a three-layer architecture that transforms Kagi.com HTML search pages into structured JSON data matching the official Kagi Search API format. The system operates as a command-line interface that accepts search queries and authentication tokens, performs HTTP requests to Kagi's web interface, and parses the resulting HTML to extract search results using CSS selectors.

The architecture follows a clean separation of concerns with the CLI layer handling user interaction and authentication, the HTTP layer managing web requests with proper headers and error handling, and the parsing layer extracting structured data from Kagi's HTML response format. This design allows the tool to act as a bridge between Kagi's web interface and applications expecting API-formatted responses.

## Component Map

**CLI Layer** - Command-line interface and program entry point in `index.js` (lines 16-71)
- Argument parsing and validation using Commander.js
- Authentication token resolution from flags or environment variables
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
- Environment variable and CLI flag precedence handling

## Key Files

**index.js** - Main CLI entry point with Commander.js program setup (lines 16-27), authentication resolution (lines 46-60), and error handling pipeline

**src/search.js** - Core search implementation with `performSearch` function (lines 22-50) for HTTP requests, `parseSearchResults` function (lines 58-94) for HTML parsing, and specialized extractors for different result types (lines 103-185)

**package.json** - Project configuration defining CLI binary mapping (lines 6-8), dependency management for Commander.js and Cheerio (lines 25-28), and npm package metadata

## Data Flow

**Input Processing** - CLI arguments flow from `index.js:40` action handler → token resolution at `index.js:46` → query validation at `index.js:41-44`

**HTTP Request Flow** - Search query and token passed to `performSearch` in `src/search.js:22` → URL construction with encoded query at `src/search.js:25` → HTTP request with session cookie at `src/search.js:29` → response validation at `src/search.js:34-39`

**HTML Parsing Flow** - Raw HTML from response flows to `parseSearchResults` at `src/search.js:42` → Cheerio DOM loading at `src/search.js:59` → multiple extraction passes for main results (lines 64-69), grouped results (lines 72-77), and related searches (lines 80-86)

**Result Extraction** - Individual result processing through `extractSearchResult` (lines 103-128) and `extractGroupedResult` (lines 137-162) → CSS selector queries for titles (`.__sri_title_link`), URLs (`href` attributes), and snippets (`.__sri-desc`) → structured JSON assembly with type indicators and metadata

**Output Generation** - Parsed results aggregated into data array at `src/search.js:43` → JSON serialization in CLI at `index.js:63` → stdout output with error handling at `index.js:64-67`