<!-- Generated: 2025-08-04T21:37:01+02:00 -->

# Files Catalog

This catalog provides a comprehensive overview of all files in the kagi-ken-cli project, organized by function and purpose. The project implements a Node.js CLI tool that searches Kagi.com using session tokens and returns structured JSON results matching the Kagi API schema. Files are organized into logical categories to help developers and LLMs quickly locate specific functionality and understand the project structure.

The codebase follows a command-based modular architecture using ES modules with clear separation between CLI command dispatcher (`index.js`), command implementations (`src/commands/`), utility modules (`src/utils/`), and core web client functionality (`src/web-client.js`). Dependencies are managed through npm with Cheerio for HTML parsing and Commander.js for CLI functionality.

## Core Source Files

**Main Entry Point** - `index.js` (92 lines)  
CLI command dispatcher with Commander.js setup supporting search and help commands. Implements command-based architecture with `createSearchCommand()` and `createHelpCommand()` functions (lines 54-85).

**Search Command** - `src/commands/search.js` (46 lines)  
Search command implementation with argument parsing and error handling. Creates the search command with required query argument and optional token flag (lines 14-42).

**Web Client** - `src/web-client.js` (195 lines)  
Core search functionality implementing HTTP requests to Kagi.com and HTML parsing. Contains `performSearch()` function (lines 21-57), HTML parsing with `parseSearchResults()` (lines 65-101), and result extraction functions for different HTML structures.

**Authentication Utilities** - `src/utils/auth.js` (54 lines)  
Token authentication utilities with file reading and validation. Implements `resolveToken()` (lines 32-42) and `readTokenFromFile()` (lines 13-24) functions.

**Help Text Constants** - `src/utils/help-text.js` (15 lines)  
Shared help text constants used across commands. Defines `AUTHENTICATION_HELP` constant (lines 8-12).

**Legacy Search Module** - `src/search.js` (191 lines)  
Legacy search functionality using CommonJS exports (not ES modules). Maintained for backward compatibility but superseded by `src/web-client.js`.

## Platform Implementation

This project runs on Node.js and doesn't require platform-specific implementations. The code uses standard Node.js APIs and cross-platform dependencies.

## Build System

**Package Configuration** - `package.json` (42 lines)  
Main project configuration defining CLI binary (`kagi-ken-cli`), dependencies (Commander.js ^14.0.0, Cheerio ^1.1.2), and npm publishing settings. Specifies entry point and files for distribution.

**Lock Files** - Package manager dependency locks  
- `pnpm-lock.yaml` - PNPM dependency resolution and version locking
- `package-lock.json` - NPM dependency resolution backup

**Dependencies Directory** - `node_modules/`  
Contains installed npm packages: `commander/` for CLI framework and `cheerio/` for HTML parsing.

## Configuration

**Git Configuration** - `.gitignore` (27 lines)  
Standard Node.js ignore patterns excluding `node_modules/`, logs, IDE files, and project-specific generated files (`**/CLAUDE-derived.md`, `.claude/tmp/`).

## Documentation

**Project Specification** - `SPEC.md`  
Complete project requirements and implementation specification.

**AI Instructions** - `CLAUDE.md`  
Project-specific guidance for Claude Code with architecture overview and implementation notes.

**Change Log** - `CHANGELOG.md`  
Project version history and changes.

**Project Overview** - `README.md`  
Main project documentation and usage instructions.

## Reference

### File Organization Patterns

```
/                          # Project root
├── index.js              # CLI command dispatcher (executable)
├── src/                  # Source code modules
│   ├── commands/         # Command implementations
│   │   └── search.js     # Search command
│   ├── utils/            # Utility modules
│   │   ├── auth.js       # Authentication utilities
│   │   └── help-text.js  # Shared help constants
│   ├── web-client.js     # Core web client functionality
│   └── search.js         # Legacy search module (CommonJS)
├── docs/                 # Documentation files
├── package.json          # Project configuration
└── node_modules/         # Dependencies
```

### Naming Conventions

- **CLI Entry**: `index.js` with shebang for direct execution
- **Commands**: Command implementations in `src/commands/` directory (`search.js`)
- **Utilities**: Helper modules in `src/utils/` directory (`auth.js`, `help-text.js`)
- **Core Modules**: Main functionality files (`web-client.js`)
- **Documentation**: Uppercase for project docs (`README.md`, `SPEC.md`)
- **Configuration**: Standard Node.js patterns (`.gitignore`, `package.json`)

### Dependency Relationships

- `index.js` imports from `./package.json` (version), `./src/commands/search.js` (search command), and `./src/utils/help-text.js` (help constants)
- `src/commands/search.js` depends on `../web-client.js` (search functionality) and `../utils/auth.js` (authentication)
- `src/web-client.js` depends on `cheerio` for HTML parsing
- `src/utils/auth.js` depends on Node.js built-in modules with `node:` prefix (`node:fs`, `node:os`)
- All modules use ES modules (`import`/`export`) pattern with `"type": "module"` in package.json
- CLI functionality provided by `commander` package for argument parsing and help generation
