<!-- Generated: 2025-08-10T16:30:29+02:00 -->

# Deployment

This is an npm package that provides a CLI binary wrapping the core kagi-ken package functionality for both search and summarization. The package can be installed globally via npm or run locally during development. The CLI serves as a lightweight wrapper that handles command-line interface concerns while delegating all core functionality to the separate kagi-ken package dependency.

## Package Types

### npm Package Distribution

**Global Installation** - Main distribution method for end users
- **Package Name**: `kagi-ken-cli` (package.json:2)
- **CLI Binary**: `kagi-ken-cli` command (package.json:7)
- **Entry Point**: `./index.js` (package.json:6)
- **Published Files**: Defined in `files` array (package.json:10-15)
- **Core Dependency**: `kagi-ken` package automatically installed from GitHub (package.json:28)

**Local Development** - Direct execution during development
- **Search Command**: `./index.js search "query"` with optional `--token` flag
- **Summarize Command**: `./index.js summarize --url "https://example.com"` with various options
- **No Build Process**: Direct Node.js execution
- **Dependencies**: Installed via npm/pnpm including kagi-ken package (package.json:26-28)

### Package File Inclusion

Files included in published package (package.json:10-15):
```
index.js         - Main CLI entry point and command dispatcher
src/             - CLI command implementations and utility modules
package.json     - Package configuration with kagi-ken dependency
README.md        - Documentation
LICENSE.md       - License file
```

## Platform Deployment

### npm Registry Publishing

**Repository Configuration** (package.json:33-39):
- **Git Repository**: `https://github.com/czottmann/kagi-ken-cli.git`
- **Issue Tracker**: `https://github.com/czottmann/kagi-ken-cli/issues`
- **Homepage**: `https://github.com/czottmann/kagi-ken-cli#readme`

**Publishing Commands**:
```bash
# Publish to npm registry
npm publish

# Publish with tag (beta, alpha, etc.)
npm publish --tag beta
```

### Global Installation

**End User Installation**:
```bash
# Install globally to make kagi-ken-cli available system-wide
# This automatically installs the kagi-ken dependency
npm install -g kagi-ken-cli

# Verify installation with available commands
kagi-ken-cli --help
kagi-ken-cli search --help
kagi-ken-cli summarize --help
```

**Binary Location**: Installed to npm's global bin directory, typically:
- macOS/Linux: `/usr/local/bin/kagi-ken-cli`
- Windows: `%APPDATA%\npm\kagi-ken-cli.cmd`

### Local Development Setup

**Development Installation**:
```bash
# Clone repository
git clone https://github.com/czottmann/kagi-ken-cli.git
cd kagi-ken-cli

# Install dependencies (includes kagi-ken package from GitHub)
npm install
# or
pnpm install

# Make CLI executable during development
chmod +x index.js

# Run CLI commands directly
./index.js search "search query" --token your-token
./index.js summarize --url "https://example.com" --token your-token
./index.js help
```

**Local Package Testing**:
```bash
# Link for local testing
npm link

# Test linked binary with both commands
kagi-ken-cli search "test query" --token your-token
kagi-ken-cli summarize --url "https://example.com" --token your-token
kagi-ken-cli help

# Unlink when done
npm unlink -g kagi-ken-cli
```

## Reference

### Package Configuration Files

**package.json** - Main package configuration
- **Binary mapping**: `"kagi-ken-cli": "./index.js"` (line 8)
- **Main entry**: `"main": "index.js"` (line 6)
- **Version**: `"version": "1.5.0"` (line 3)
- **License**: `"license": "MIT"` (line 25)

**Dependencies** (package.json:26-28):
- `commander`: CLI framework for argument parsing and command routing
- `kagi-ken`: Core package providing search and summarization functionality (GitHub dependency)

### Installation Verification

**Post-Installation Check**:
```bash
# Verify binary is accessible
which kagi-ken-cli

# Check version and available commands
kagi-ken-cli --version
kagi-ken-cli --help
kagi-ken-cli search --help
kagi-ken-cli summarize --help
```

### Distribution Files

**Not Included in Package**:
- `node_modules/` - Dependencies (installed separately)
- `.git/` - Version control files
- Development files not in `files` array

**Required Runtime**:
- Node.js 18+ (for built-in fetch API used by kagi-ken package)
- npm or compatible package manager for installation
- Network access for kagi-ken package installation from GitHub

### Authentication Deployment Note

No API keys or sensitive configuration required for deployment. Authentication is handled per-user via:
- `--token` flag at runtime for both search and summarize commands
- `~/.kagi_session_token` file (preferred method, shared across commands)

Users obtain session tokens from their Kagi.com browser sessions. The CLI wrapper handles token resolution and passes tokens to the kagi-ken package functions.
