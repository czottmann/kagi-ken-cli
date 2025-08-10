<!-- Generated: 2025-08-10T16:30:29+02:00 -->

# Project Overview

kagi-ken-cli is a Node.js CLI wrapper that provides command-line access to Kagi.com services including search and summarization. The CLI tool is built as a lightweight wrapper around the core `kagi-ken` package, which handles all the complex functionality including HTML parsing, HTTP requests, and result formatting. This separation allows for clean modularity where the CLI focuses on command-line interface concerns while the core package provides the underlying Kagi integration functionality.

The project authenticates using Kagi session tokens (obtained by logging into Kagi.com) instead of API keys, making it accessible to all Kagi users. It returns structured JSON data matching Kagi's official API schemas for both search results and summarization output, providing seamless integration for applications and scripts.

## Key Files

**Main Entry Point** - `index.js` (lines 1-103): CLI command dispatcher using Commander.js framework with command routing, help system, and ES module structure

**Search Command** - `src/commands/search.js` (lines 1-45): Search command implementation importing from `kagi-ken` package with argument parsing, authentication integration, and JSON output formatting

**Summarize Command** - `src/commands/summarize.js` (lines 1-94): Summarization command implementation importing from `kagi-ken` package with URL/text input options, language targeting, and streaming response handling

**Authentication Utils** - `src/utils/auth.js` (lines 1-54): Token resolution utilities with file reading and validation functions for both commands

**Core Package Dependency** - `kagi-ken` package (GitHub dependency): Provides all HTTP request handling, HTML parsing, stream processing, and result extraction functionality

**Project Configuration** - `package.json` (lines 1-41): NPM package definition with dependencies (Commander.js, kagi-ken package), binary entry point, and metadata

**Project Specification** - `SPEC.md` (lines 1-111): Complete implementation requirements, API format specifications, and usage examples

**Development Instructions** - `CLAUDE.md`: Project-specific guidance for AI assistants and development context

## Technology Stack

**CLI Framework** - Commander.js v14.0.0 for command-line interface and argument parsing (`package.json` line 27)

**Core Functionality Package** - `kagi-ken` v1.0.0 (GitHub dependency) provides HTML parsing with Cheerio, HTTP requests with Node.js fetch API, and result extraction (`package.json` line 28)

**Authentication Method** - Kagi session tokens passed as cookies, supporting both CLI flags and `~/.kagi_session_token` file through dedicated auth utilities (`src/utils/auth.js` lines 32-42)

**Output Format** - JSON structured to match Kagi API schemas for search results (t: 0/1) and summarization output (markdown format) handled by the kagi-ken package

**Stream Processing** - Real-time parsing of Kagi's streaming responses for summarization features provided by the core kagi-ken package

## Platform Support

**Node.js Requirements** - Node.js 18+ required for built-in fetch API support used by the kagi-ken core package

**Installation Method** - Global NPM installation with `kagi-ken-cli` binary command (`package.json` lines 7-8)

**Cross-Platform Compatibility** - Pure Node.js implementation with no platform-specific dependencies, executable on macOS, Linux, and Windows

**Package Dependencies** - Core functionality provided by separate `kagi-ken` package, allowing modular architecture and reusability

**ES Module Architecture** - Modern JavaScript with ES module imports using `node:` prefix for built-in modules and `"type": "module"` in package.json (line 5)

**Authentication Requirements** - Valid Kagi.com account with session token obtained through web browser login, no API key or special access needed
