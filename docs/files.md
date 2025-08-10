<!-- Generated: 2025-08-10T16:30:29+02:00 -->

# Files Catalog

This catalog provides a comprehensive overview of all files in the kagi-ken-cli project, organized by function and purpose. The project implements a Node.js CLI wrapper around the core `kagi-ken` package, providing command-line access to Kagi.com search and summarization services. The CLI handles argument parsing, authentication, and output formatting while delegating all complex functionality to the separate kagi-ken package.

The codebase follows a command-based modular architecture using ES modules with clear separation between CLI command dispatcher (`index.js`), command implementations (`src/commands/`), and utility modules (`src/utils/`). The core functionality (HTTP requests, HTML parsing, stream processing) is provided by the external kagi-ken package dependency.

## Core Source Files

**Main Entry Point** - `index.js` (103 lines)  
CLI command dispatcher with Commander.js setup supporting search, summarize, and help commands. Implements command-based architecture with `createSearchCommand()`, `createSummarizeCommand()`, and `createHelpCommand()` functions (lines 58-85).

**Search Command** - `src/commands/search.js` (45 lines)  
Search command implementation importing `search` function from kagi-ken package. Handles argument parsing, authentication integration, and JSON output formatting (lines 14-42).

**Summarize Command** - `src/commands/summarize.js` (94 lines)  
Summarization command implementation importing `summarize` and `SUPPORTED_LANGUAGES` from kagi-ken package. Handles URL/text input validation, language targeting, and streaming response processing (lines 14-89).

**Authentication Utilities** - `src/utils/auth.js` (54 lines)  
Token authentication utilities shared across commands with file reading and validation. Implements `resolveToken()` (lines 32-42) and `readTokenFromFile()` (lines 13-24) functions.

**Help Text Constants** - `src/utils/help-text.js` (15 lines)  
Shared help text constants used across commands. Defines `AUTHENTICATION_HELP` constant (lines 8-12) for consistent authentication documentation.

## Platform Implementation

This project runs on Node.js and doesn't require platform-specific implementations. The CLI wrapper uses standard Node.js APIs and relies on the kagi-ken package for all platform-specific functionality including HTTP requests and HTML parsing.

## Build System

**Package Configuration** - `package.json` (41 lines)  
Main project configuration defining CLI binary (`kagi-ken-cli`), dependencies (Commander.js ^14.0.0, kagi-ken package from GitHub), and npm publishing settings. Specifies entry point and files for distribution.

**Lock Files** - Package manager dependency locks  
- `pnpm-lock.yaml` - PNPM dependency resolution and version locking
- `package-lock.json` - NPM dependency resolution backup

**Dependencies Directory** - `node_modules/`  
Contains installed npm packages: `commander/` for CLI framework and `kagi-ken/` package providing core Kagi integration functionality.

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
├── src/                  # CLI source code modules
│   ├── commands/         # Command implementations
│   │   ├── search.js     # Search command importing kagi-ken
│   │   └── summarize.js  # Summarize command importing kagi-ken
│   └── utils/            # Utility modules
│       ├── auth.js       # Authentication utilities (shared)
│       └── help-text.js  # Shared help constants
├── docs/                 # Documentation files
├── package.json          # Project configuration with kagi-ken dependency
└── node_modules/         # Dependencies (including kagi-ken package)
```

### Naming Conventions

- **CLI Entry**: `index.js` with shebang for direct execution
- **Commands**: Command implementations in `src/commands/` directory (`search.js`, `summarize.js`)
- **Utilities**: Helper modules in `src/utils/` directory (`auth.js`, `help-text.js`)
- **Core Package**: External dependency (`kagi-ken`) providing all business logic
- **Documentation**: Uppercase for project docs (`README.md`, `CLAUDE.md`)
- **Configuration**: Standard Node.js patterns (`.gitignore`, `package.json`)

### Dependency Relationships

- `index.js` imports from `./package.json` (version), `./src/commands/search.js`, `./src/commands/summarize.js`, and `./src/utils/help-text.js` (help constants)
- `src/commands/search.js` depends on `kagi-ken` package (`search` function) and `../utils/auth.js` (authentication)
- `src/commands/summarize.js` depends on `kagi-ken` package (`summarize`, `SUPPORTED_LANGUAGES`) and `../utils/auth.js` (authentication)
- `src/utils/auth.js` depends on Node.js built-in modules with `node:` prefix (`node:fs`, `node:os`, `node:path`)
- All modules use ES modules (`import`/`export`) pattern with `"type": "module"` in package.json
- CLI functionality provided by `commander` package for argument parsing and help generation
- Core functionality provided by `kagi-ken` package dependency for HTTP requests, HTML parsing, and stream processing
