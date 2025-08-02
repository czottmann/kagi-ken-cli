<!-- Generated: 2025-08-02T19:22:46+02:00 -->

# Files Catalog

This catalog provides a comprehensive overview of all files in the kagi-web-search project, organized by function and purpose. The project implements a Node.js CLI tool that searches Kagi.com using session tokens and returns structured JSON results matching the Kagi Search API schema. Files are organized into logical categories to help developers and LLMs quickly locate specific functionality and understand the project structure.

The codebase follows a modular architecture with clear separation between CLI interface (`index.js`), core search functionality (`src/search.js`), and supporting configuration files. Dependencies are managed through npm with Cheerio for HTML parsing and Commander.js for CLI functionality.

## Core Source Files

**Main Entry Point** - `index.js` (78 lines)  
CLI application entry point with Commander.js setup, argument parsing, and error handling. Defines the `kagi-search` command interface with token authentication and query processing.

**Search Engine** - `src/search.js` (191 lines)  
Core search functionality implementing HTTP requests to Kagi.com and HTML parsing. Contains `performSearch()` function (lines 22-50), HTML parsing with `parseSearchResults()` (lines 58-94), and result extraction functions for different HTML structures.

## Platform Implementation

This project runs on Node.js and doesn't require platform-specific implementations. The code uses standard Node.js APIs and cross-platform dependencies.

## Build System

**Package Configuration** - `package.json` (42 lines)  
Main project configuration defining CLI binary (`kagi-search`), dependencies (Commander.js ^14.0.0, Cheerio ^1.1.2), and npm publishing settings. Specifies entry point and files for distribution.

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
├── index.js              # CLI entry point (executable)
├── src/                  # Source code modules
│   └── search.js         # Core functionality
├── docs/                 # Documentation files
├── package.json          # Project configuration
└── node_modules/         # Dependencies
```

### Naming Conventions

- **CLI Entry**: `index.js` with shebang for direct execution
- **Modules**: Descriptive names in `src/` directory (`search.js`)
- **Documentation**: Uppercase for project docs (`README.md`, `SPEC.md`)
- **Configuration**: Standard Node.js patterns (`.gitignore`, `package.json`)

### Dependency Relationships

- `index.js` imports from `./package.json` (version) and `./src/search` (functionality)
- `src/search.js` depends on `cheerio` for HTML parsing and Node.js `fs` for file operations
- All modules use CommonJS (`require`/`module.exports`) pattern
- CLI functionality provided by `commander` package for argument parsing and help generation