<!-- Generated: 2025-08-10T16:30:29+02:00 -->

# Build System

## Overview

The kagi-ken-cli project uses npm for package management and distribution as a lightweight CLI wrapper around the core `kagi-ken` package. The build system is configured in `package.json` (lines 1-41) with a CLI binary entry point defined at `index.js`. The project depends on the separate `kagi-ken` package for all core functionality, allowing the CLI to focus solely on command-line interface concerns.

## Build Workflows

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

Dependencies are defined in `package.json` (lines 26-28):
- `commander@^14.0.0` - CLI framework for argument parsing and command routing
- `kagi-ken@github:czottmann/kagi-ken#1.0.0` - Core Kagi integration package providing search and summarization functionality

### Development

```bash
# Run search command during development
./index.js search "search query" --token TOKEN

# Run summarize command during development
./index.js summarize --url "https://example.com" --token TOKEN

# Test installation (placeholder)
npm test
```

Test command is not implemented - the CLI depends on the kagi-ken package which handles the core functionality testing.

### Distribution

```bash
# Install globally for CLI usage
npm install -g .

# After global install, use CLI commands
kagi-ken-cli search "search query" --token TOKEN
kagi-ken-cli summarize --url "https://example.com" --token TOKEN
kagi-ken-cli help
```

CLI binary configuration in `package.json` (lines 7-8) maps `kagi-ken-cli` command to `./index.js`.

## Platform Setup

### Node.js Requirements

- **Node.js**: Node.js 18+ required for built-in fetch API support used by kagi-ken package
- **Package Manager**: npm (package-lock.json present) or pnpm (pnpm-lock.yaml present)
- **Core Package**: kagi-ken package automatically installed from GitHub dependency

### File Distribution

Distribution files configured in `package.json` (lines 10-15):
- `index.js` - Main CLI entry point
- `src/` - CLI command implementations and utilities
- `package.json` - Package configuration with kagi-ken dependency
- `README.md` - Documentation
- `LICENSE.md` - License file

### Platform-Specific Notes

- **Cross-platform**: Pure Node.js implementation, no platform-specific dependencies
- **Executable**: `index.js` requires shebang for Unix-like systems
- **Windows**: Works through npm's executable wrapper generation

## Reference

### Build Targets

- **install**: Install dependencies from `package.json` (installs Commander.js and kagi-ken package from GitHub)
- **test**: No test suite - testing is handled by the kagi-ken core package
- **publish**: Publish CLI wrapper to npm registry using files list (lines 10-15)

### Configuration Files

- **package.json** (lines 1-41): Main package configuration with Commander.js and kagi-ken dependencies, scripts, and metadata
- **package-lock.json**: npm dependency lock file
- **pnpm-lock.yaml**: pnpm alternative dependency lock file

### Troubleshooting

#### Common Issues

**Missing dependencies**: Run `npm install` or `pnpm install` to install Commander.js and kagi-ken package from `package.json` (lines 26-28)

**CLI command not found**: 
- Check global installation: `npm list -g kagi-ken-cli`
- Verify binary configuration in `package.json` (lines 7-8)
- Try local execution: `./index.js search "test"`

**kagi-ken package issues**: 
- Verify GitHub dependency installation: `npm ls kagi-ken`
- Check network access for GitHub package installation
- Try reinstalling: `npm install kagi-ken@github:czottmann/kagi-ken#1.0.0`

**Module resolution errors**: 
- Verify main entry point in `package.json` (line 6)
- Check file permissions on `index.js`
- Ensure kagi-ken package is properly installed in node_modules

**Package publishing issues**:
- Review files list in `package.json` (lines 10-15)
- Verify package name availability: `kagi-ken-cli`
- Ensure kagi-ken dependency is accessible for installation
