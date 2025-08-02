# Testing

<!-- Generated: 2025-08-02T19:23:00+02:00 -->

## Overview

The project currently has no formal test suite implemented. Testing is performed manually through CLI validation and example runs. The npm test script in `package.json` (line 17) shows a placeholder error message indicating tests need to be implemented.

## Test Types

### Manual Testing (Current Approach)

**CLI Validation** - Manual execution of CLI commands with various inputs
- Test basic help commands: `./index.js`, `./index.js help`, `./index.js --help`
- Test authentication methods: `--token` flag vs `KAGI_SESSION_TOKEN` environment variable
- Test search queries with valid session tokens
- Test error conditions: missing token, invalid token, network failures

**HTML Parsing Validation** - Using sample data for parser development
- Reference file: `search-result.html` - Sample Kagi search page for testing HTML parsing logic
- Test CSS selector extraction against known HTML structure
- Validate JSON output format matches Kagi Search API schema from `SPEC.md` (lines 37-53)

### Recommended Test Implementation

**Unit Tests** - Test individual components in isolation
- `src/search.js` - HTTP request and response parsing functions
- Authentication token validation logic
- HTML parsing with cheerio selectors
- JSON output formatting

**Integration Tests** - Test complete CLI workflows
- End-to-end search execution with mock HTTP responses
- Error handling for various failure scenarios
- Output format validation against API schema

**CLI Tests** - Test command-line interface behavior
- Argument parsing with Commander.js
- Environment variable handling
- Help text display
- Exit codes for success/error conditions

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
./index.js                 # Should show usage
./index.js --help          # Should show help text
./index.js "test query"    # Should show missing token error
```

**With Valid Token**
```bash
export KAGI_SESSION_TOKEN=your_token_here
./index.js "javascript"    # Should return JSON search results
./index.js "test" --token different_token  # Token flag overrides env var
```

**Error Conditions**
```bash
./index.js "query" --token invalid_token   # Should return authentication error
# Network errors require disconnected state or invalid URLs
```

## Reference

### Test File Organization

**Recommended Structure**
```
tests/
├── unit/
│   ├── search.test.js     # Test src/search.js functions
│   └── cli.test.js        # Test CLI argument parsing
├── integration/
│   └── e2e.test.js        # End-to-end workflow tests
└── fixtures/
    ├── sample-response.html    # Mock Kagi HTML responses
    └── expected-output.json    # Expected JSON output formats
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
- `nock` - HTTP request mocking for integration tests
- `@commander-js/extra-typings` - For CLI testing support

### Key Testing Considerations

**Authentication Testing** - Mock Kagi session validation without real tokens
**HTML Parsing** - Use `search-result.html` as test fixture for consistent parsing validation
**Error Handling** - Test all error conditions specified in `SPEC.md` (lines 57-68)
**Output Format** - Validate JSON structure matches API schema from `SPEC.md` (lines 44-51)
**CLI Integration** - Test Commander.js argument parsing and help text generation