<!-- Generated: 2025-08-04T21:37:01+02:00 -->

# Deployment

This is an npm package that provides a CLI binary for searching Kagi. The package can be installed globally via npm or run locally during development. Binary distribution is handled through npm's package registry with CLI entry point configuration in package.json.

## Package Types

### npm Package Distribution

**Global Installation** - Main distribution method for end users
- **Package Name**: `kagi-ken-cli` (package.json:2)
- **CLI Binary**: `kagi-ken-cli` command (package.json:7)
- **Entry Point**: `./index.js` (package.json:7)
- **Published Files**: Defined in `files` array (package.json:9-15)

**Local Development** - Direct execution during development
- **Development Command**: `./index.js` or `node index.js`
- **No Build Process**: Direct Node.js execution
- **Dependencies**: Installed via npm/pnpm (package.json:25-28)

### Package File Inclusion

Files included in published package (package.json:9-15):
```
index.js         - Main CLI entry point
src/             - Source code directory
package.json     - Package configuration
README.md        - Documentation
LICENSE.md       - License file
```

## Platform Deployment

### npm Registry Publishing

**Repository Configuration** (package.json:33-40):
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
npm install -g kagi-ken-cli

# Verify installation
kagi-ken-cli --help
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

# Install dependencies
npm install
# or
pnpm install

# Make CLI executable during development
chmod +x index.js

# Run CLI directly
./index.js "search query" --token your-token
```

**Local Package Testing**:
```bash
# Link for local testing
npm link

# Test linked binary
kagi-ken-cli search "test query"

# Unlink when done
npm unlink -g kagi-ken-cli
```

## Reference

### Package Configuration Files

**package.json** - Main package configuration
- **Binary mapping**: `"kagi-ken-cli": "./index.js"` (line 7)
- **Main entry**: `"main": "index.js"` (line 5)
- **Version**: `"version": "1.0.0"` (line 3)
- **License**: `"license": "MIT"` (line 24)

**Dependencies** (package.json:25-28):
- `commander`: CLI framework for argument parsing
- `cheerio`: HTML parsing for search result extraction

### Installation Verification

**Post-Installation Check**:
```bash
# Verify binary is accessible
which kagi-ken-cli

# Check version and help
kagi-ken-cli --help
```

### Distribution Files

**Not Included in Package**:
- `node_modules/` - Dependencies (installed separately)
- `.git/` - Version control files
- Development files not in `files` array

**Required Runtime**:
- Node.js 18+ (for built-in fetch API used in SPEC.md:11)
- npm or compatible package manager for installation

### Authentication Deployment Note

No API keys or sensitive configuration required for deployment. Authentication is handled per-user via:
- `--token` flag at runtime
- `~/.kagi_session_token` file (preferred method)

Users obtain session tokens from their Kagi.com browser sessions as documented in SPEC.md.
