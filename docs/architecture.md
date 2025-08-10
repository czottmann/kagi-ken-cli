<!-- Generated: 2025-08-10T16:30:29+02:00 -->

# Architecture

## Overview

The kagi-ken-cli tool implements a modular two-layer architecture that separates CLI interface concerns from core Kagi functionality. The CLI layer handles command-line argument parsing, authentication token resolution, and result output formatting, while delegating all complex operations to the separate `kagi-ken` package. This design provides clean separation between the user interface (CLI) and business logic (Kagi integration).

The architecture follows a clean separation of concerns with the CLI wrapper handling user interaction, command routing, and token management, while the core `kagi-ken` package manages HTTP requests, HTML parsing, stream processing, and result extraction. This modular approach allows the core functionality to be reused in other contexts beyond the CLI, such as programmatic Node.js applications or web services.

## Component Map

**CLI Layer** - Command-line interface and program entry point in `index.js` (lines 55-93)
- Commander.js framework for command routing and argument parsing
- Help system with command-specific documentation
- Error handling and process exit management

**Command Implementations** - Individual command handlers in `src/commands/`
- Search command in `src/commands/search.js` (lines 14-42) with query argument and token option
- Summarize command in `src/commands/summarize.js` (lines 14-89) with URL/text options, language targeting
- Authentication integration using shared auth utilities

**Authentication System** - Token-based authentication utilities in `src/utils/auth.js`
- File-based token storage and CLI flag precedence handling (lines 32-42)
- Session token validation and resolution from multiple sources
- Cross-command authentication utility sharing

**Core Package Integration** - `kagi-ken` package dependency providing all business logic
- HTTP request management with proper User-Agent and session cookie headers
- HTML parsing with Cheerio-based DOM traversal and CSS selector matching
- Stream processing for real-time summarization responses
- Result extraction and JSON formatting matching Kagi API schemas

## Key Files

**index.js** - Main CLI entry point with Commander.js program setup (lines 58-85), command registration, and help system implementation

**src/commands/search.js** - Search command implementation importing `search` function from kagi-ken package (line 6), with argument parsing and authentication integration

**src/commands/summarize.js** - Summarization command implementation importing `summarize` and `SUPPORTED_LANGUAGES` from kagi-ken package (line 6), with input validation and option handling

**src/utils/auth.js** - Authentication utilities with `resolveToken` function (lines 32-42) and file reading capabilities shared across commands

**package.json** - Project configuration defining CLI binary mapping (lines 7-8), dependency management for Commander.js and kagi-ken package (lines 27-28), and npm package metadata

## Data Flow

**Command Routing** - CLI arguments flow from `index.js:92` program parser → command registration at `index.js:83-85` → individual command handlers in `src/commands/`

**Search Command Flow** - Search arguments processed in `src/commands/search.js:31` → token resolution through `resolveToken()` at line 33 → `search()` function call to kagi-ken package at line 34 → JSON output at line 35

**Summarize Command Flow** - Summarization arguments processed in `src/commands/summarize.js:39` → input validation for URL/text options (lines 42-68) → language and type validation (lines 56-68) → `summarize()` function call to kagi-ken package at line 78

**Authentication Flow** - Both commands use shared authentication pattern → `resolveToken()` from `src/utils/auth.js` → checks CLI flag first, then `~/.kagi_session_token` file → token passed to kagi-ken package functions

**Core Package Integration** - All HTTP requests, HTML parsing, and result extraction handled by kagi-ken package → CLI commands receive structured JSON responses → direct output to stdout with error handling

**Output Generation** - Structured JSON responses from kagi-ken package → `JSON.stringify()` formatting in command handlers → stdout output with consistent error handling across both commands
