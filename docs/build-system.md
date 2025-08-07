<!-- Generated: 2025-08-04T21:37:01+02:00 -->

# Build System

## Overview

The kagi-ken project uses npm for package management and distribution. The build system is configured in `package.json` (lines 1-41) with a CLI binary entry point defined at `index.js`. The project leverages standard Node.js tooling for development and publishing to the npm registry.

## Build Workflows

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

Dependencies are defined in `package.json` (lines 25-28):
- `commander@^14.0.0` - CLI framework
- `cheerio@^1.1.2` - HTML parsing

### Development

```bash
# Run CLI during development
./index.js "search query" --token TOKEN

# Test installation (placeholder)
npm test
```

Test command is defined in `package.json` (lines 16-18) but currently shows error message for unimplemented tests.

### Distribution

```bash
# Install globally for CLI usage
npm install -g .

# After global install, use CLI command
kagi-ken search "search query" --token TOKEN
```

CLI binary configuration in `package.json` (lines 6-8) maps `kagi-ken` command to `./index.js`.

## Platform Setup

### Node.js Requirements

- **Node.js**: Compatible with versions supporting ES modules and Commander.js v14+
- **Package Manager**: npm (package-lock.json present) or pnpm (pnpm-lock.yaml present)

### File Distribution

Distribution files configured in `package.json` (lines 9-15):
- `index.js` - Main CLI entry point
- `src/` - Source code directory
- `package.json` - Package configuration
- `README.md` - Documentation
- `LICENSE.md` - License file

### Platform-Specific Notes

- **Cross-platform**: Pure Node.js implementation, no platform-specific dependencies
- **Executable**: `index.js` requires shebang for Unix-like systems
- **Windows**: Works through npm's executable wrapper generation

## Reference

### Build Targets

- **install**: Install dependencies from `package.json`
- **test**: Run test suite (currently placeholder in lines 16-18)
- **publish**: Publish to npm registry using files list (lines 9-15)

### Configuration Files

- **package.json** (lines 1-41): Main package configuration with dependencies, scripts, and metadata
- **package-lock.json**: npm dependency lock file
- **pnpm-lock.yaml**: pnpm alternative dependency lock file

### Troubleshooting

#### Common Issues

**Missing dependencies**: Run `npm install` or `pnpm install` to install from `package.json` (lines 25-28)

**CLI command not found**: 
- Check global installation: `npm list -g kagi-ken`
- Verify binary configuration in `package.json` (lines 6-8)
- Try local execution: `./index.js`

**Module resolution errors**: 
- Verify main entry point in `package.json` (line 5)
- Check file permissions on `index.js`

**Package publishing issues**:
- Review files list in `package.json` (lines 9-15)
- Verify package name availability: `kagi-ken`
