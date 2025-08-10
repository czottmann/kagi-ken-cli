<!-- Generated: 2025-08-10T16:30:29+02:00 -->

# Testing

## Overview

The kagi-ken-cli project currently has no formal test suite implemented as it serves as a lightweight CLI wrapper around the core `kagi-ken` package. Core functionality testing is handled by the kagi-ken package, while CLI-specific testing focuses on command-line argument parsing, authentication integration, and output formatting. Testing is performed manually through CLI validation and example runs.

## Test Types

### Manual Testing (Current Approach)

**CLI Validation** - Manual execution of CLI commands with various inputs
- Test basic help commands: `./index.js`, `./index.js help`, `./index.js --help`
- Test search command: `./index.js search "query"`, `./index.js search --help`
- Test summarize command: `./index.js summarize --url "https://example.com"`, `./index.js summarize --help`
- Test authentication methods: `--token` flag vs `~/.kagi_session_token` file for both commands
- Test command execution with valid session tokens
- Test error conditions: missing token, invalid token, mutually exclusive summarize options

**Core Package Integration** - Testing CLI interaction with kagi-ken package
- Validate that search command properly calls `search()` function from kagi-ken package
- Validate that summarize command properly calls `summarize()` function from kagi-ken package  
- Test proper passing of authentication tokens to core package functions
- Validate JSON output format matches expected schemas from core package

### Recommended Test Implementation

**Unit Tests** - Test individual CLI components in isolation
- `src/utils/auth.js` - Authentication token resolution and file reading logic (`readTokenFromFile()`, `resolveToken()`)
- `src/commands/search.js` - Search command argument parsing and kagi-ken package integration
- `src/commands/summarize.js` - Summarize command option validation and kagi-ken package integration
- Authentication utility sharing between commands
- Error handling and process exit behavior

**Integration Tests** - Test complete CLI workflows with kagi-ken package
- End-to-end search execution testing CLI to kagi-ken package communication
- End-to-end summarization testing with both URL and text inputs
- Error handling for authentication failures and invalid options
- Output format validation for both search and summarize commands

**CLI Tests** - Test command-line interface behavior
- Argument parsing with Commander.js for search and summarize commands
- Token file reading and fallback behavior shared across commands
- Help text display for main program and individual commands
- Exit codes for success/error conditions
- Command routing and dispatch functionality

## Running Tests

### Current State
```bash
npm test
# Output: Error: no test specified && exit 1
```

### Recommended Test Setup

**Test Framework Installation**
```bash
npm install --save-dev jest
# or
npm install --save-dev mocha chai
```

**Test Commands** - Update `package.json` scripts section
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Test Execution**
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
```

### Manual Testing Commands

**Basic CLI Validation**
```bash
./index.js                 # Should show command list
./index.js --help          # Should show help text
./index.js help            # Should show help text
./index.js search --help   # Should show search command help
./index.js search "test query"  # Should show missing token error
```

**With Valid Token**
```bash
echo "your_token_here" > ~/.kagi_session_token
./index.js search "javascript"    # Should return JSON search results
./index.js search "test" --token different_token  # Token flag overrides file
./index.js summarize --url "https://example.com"  # Should return summarized content
./index.js summarize --text "Long text content" --type takeaway  # Should return takeaway summary
```

**Error Conditions**
```bash
./index.js search "query" --token invalid_token   # Should return authentication error
./index.js summarize --url "https://example.com" --text "also text"  # Should error on mutually exclusive options
./index.js summarize  # Should error when neither URL nor text provided
./index.js summarize --url "https://example.com" --language INVALID  # Should error on unsupported language
```

## Reference

### Test File Organization

**Recommended Structure**
```
tests/
├── unit/
│   ├── auth.test.js          # Test src/utils/auth.js functions  
│   ├── search-command.test.js # Test src/commands/search.js
│   ├── summarize-command.test.js # Test src/commands/summarize.js
│   └── cli.test.js           # Test CLI command routing and help
├── integration/
│   ├── search-e2e.test.js    # End-to-end search workflow tests
│   └── summarize-e2e.test.js # End-to-end summarize workflow tests
└── fixtures/
    └── expected-output.json  # Expected JSON output formats for both commands
```

### Build System Test Targets

**Package.json Configuration** - Update test script in `package.json` (line 17)
```json
{
  "scripts": {
    "test": "jest --passWithNoTests",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:cli": "jest tests/unit/cli.test.js"
  }
}
```

**Test Dependencies** - Add to devDependencies
- `jest` or `mocha` + `chai` - Test framework
- `sinon` - Mocking for kagi-ken package function calls
- `@commander-js/extra-typings` - For CLI testing support

### Key Testing Considerations

**Authentication Testing** - Mock token resolution without real tokens, test file reading scenarios with ES modules, test token sharing between commands
**Package Integration Testing** - Mock kagi-ken package functions (search, summarize) to test CLI integration without actual HTTP requests
**Error Handling** - Test CLI-specific error conditions, invalid command options, missing required parameters, authentication failures
**Output Format** - Validate JSON structure matches expected formats from both kagi-ken package functions
**CLI Integration** - Test Commander.js command-based argument parsing, help text generation, command routing
**File System Testing** - Test token file reading with `node:fs` imports, missing files, permission errors, empty files
**Command Validation** - Test summarize command input validation (URL/text mutual exclusivity, language codes, summary types)
**ES Module Testing** - Test import/export functionality and kagi-ken package import integration
