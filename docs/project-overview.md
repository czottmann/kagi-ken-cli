<!-- Generated: 2025-08-04T21:37:01+02:00 -->

# Project Overview

kagi-ken is a Node.js CLI tool that enables programmatic access to Kagi.com search results without requiring paid API access. The tool authenticates using Kagi session tokens (obtained by logging into Kagi.com) instead of invite-only API keys, making it accessible to all Kagi users. It parses HTML search result pages and returns structured JSON data that matches Kagi's official Search API schema, providing a seamless integration path for applications that need search functionality.

The project bridges the gap between web scraping and API access by providing a clean, command-line interface that outputs machine-readable JSON while handling authentication, error cases, and result parsing automatically. This approach allows developers to integrate Kagi search into their workflows, scripts, and applications without API costs or access limitations.

## Key Files

**Main Entry Point** - `index.js` (lines 1-92): CLI command dispatcher using Commander.js framework with command routing, help system, and ES module structure

**Search Command** - `src/commands/search.js` (lines 1-46): Search command implementation with argument parsing, authentication integration, and JSON output formatting

**Core Web Client** - `src/web-client.js` (lines 1-195): HTTP request handling, HTML parsing with Cheerio, and result extraction functions using ES modules

**Authentication Utils** - `src/utils/auth.js` (lines 1-54): Token resolution utilities with file reading and validation functions

**Project Configuration** - `package.json` (lines 1-41): NPM package definition with dependencies (Commander.js, Cheerio), binary entry point, and metadata

**Project Specification** - `SPEC.md` (lines 1-111): Complete implementation requirements, API format specifications, and usage examples

**Development Instructions** - `CLAUDE.md`: Project-specific guidance for AI assistants and development context

## Technology Stack

**CLI Framework** - Commander.js v14.0.0 for command-line interface and argument parsing (`package.json` line 26)

**HTML Parsing** - Cheerio v1.1.2 for jQuery-like CSS selector-based parsing of Kagi search result pages using ES module imports (`src/web-client.js` line 6)

**HTTP Requests** - Node.js built-in fetch API for HTTPS requests to Kagi.com with cookie-based session authentication (`src/web-client.js` lines 31-39)

**Authentication Method** - Kagi session tokens passed as `kagi_session` cookies, supporting both CLI flags and `~/.kagi_session_token` file through dedicated auth utilities (`src/utils/auth.js` lines 32-42)

**Output Format** - JSON structured to match Kagi API schema with search results (t: 0) and related searches (t: 1) (`src/web-client.js` lines 126-131)

## Platform Support

**Node.js Requirements** - Node.js 18+ required for built-in fetch API support (`SPEC.md` line 11)

**Installation Method** - Global NPM installation with `kagi-ken` binary command (`package.json` lines 6-8)

**Cross-Platform Compatibility** - Pure Node.js implementation with no platform-specific dependencies, executable on macOS, Linux, and Windows

**User-Agent Specification** - Safari macOS user agent for Kagi compatibility (`src/web-client.js` lines 11-12)

**ES Module Architecture** - Modern JavaScript with ES module imports using `node:` prefix for built-in modules and `"type": "module"` in package.json (line 5)

**Authentication Requirements** - Valid Kagi.com account with session token obtained through web browser login, no API key or special access needed
