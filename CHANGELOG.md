# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-08-04

### Changed
- **BREAKING**: Changed CLI syntax from `kagi-search "query"` to `kagi-search search "query"` (command-based structure)
- **BREAKING**: Migrated from CommonJS to ES Modules with `"type": "module"` in package.json

### Added
- Command-based CLI architecture
- `search` subcommand with current search functionality
- `help` command supporting both patterns: `kagi-search help search` and `kagi-search search --help`


## [1.1.0] - 2025-08-03

### Changed
- **BREAKING**: Replaced `KAGI_SESSION_TOKEN` environment variable authentication with `~/.kagi_session_token` file-based authentication
- Authentication priority: `--token` flag now takes precedence over `~/.kagi_session_token` file
- Updated CLI help text and error messages to reference file-based authentication
- Improved security by preventing token exposure in process lists and environment variables

### Added
- `readTokenFromFile()` helper function with robust error handling for missing files, permission errors, and empty files
- File-based token storage with automatic content trimming to handle whitespace/newlines
- Enhanced documentation across all project files reflecting new authentication method

### Fixed
- Token authentication now uses more secure file-based approach instead of environment variables

### Documentation
- Updated README.md with file-based authentication examples
- Updated all documentation in `docs/` directory to reflect new authentication method
- Updated CLAUDE.md project guidance with current implementation details
- Added comprehensive usage examples for file-based token storage

## [1.0.0] - 2025-08-02

### Added
- Initial release of kagi-web-search CLI tool
- Command-line interface using Commander.js framework
- HTML parsing of Kagi search results using Cheerio
- JSON output matching Kagi Search API schema format
- Session token authentication via `--token` flag or environment variable
- Support for main search results, grouped results, and related searches
- Comprehensive error handling for network issues, authentication failures, and parsing errors
- Complete project documentation and specifications
