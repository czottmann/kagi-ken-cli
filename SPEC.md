# Spec "Kagi Search" node package

This project creates a CLI tool which lets you search Kagi.com. It uses Kagi's session link/token for authentication, and so does not need an invite-only API key. 

The tool returns its results as JSON in the same structure as Kagi's search API does, see ["Execute Search" in Kagi's Docs](https://help.kagi.com/kagi/api/search.html#endpoints). To do that, it will parse the returned search page HTML to extract its content. See @example-search-result-page.html

## Dependencies

- `commander` - CLI framework (already added)
- `cheerio` - HTML parsing with jQuery-like CSS selectors
- Built-in `fetch` - HTTP requests (Node.js 18+)

## CLI

The tool uses Commander to create a single-command CLI following the structure in the provided "render-claude-context.txt" file. When called with a query argument, it should check for the existence of the session token.

### Authentication to Kagi

The user must provide a "Kagi session token" either by `--token` flag or `KAGI_SESSION_TOKEN` environment variable. This token is passed as `kagi_session` cookie when querying Kagi.

### HTTP Requests

- **URL Format**: `https://kagi.com/search?q={query}`
- **Authentication**: Session token passed as `kagi_session` cookie
- **User-Agent**: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15`
- **Method**: GET with cookie header

### HTML Parsing Strategy

Use cheerio with CSS selectors to extract search results:
- `.search-result` - Main search results
- `.sr-group` - Grouped sub-results (e.g., Wikipedia sub-pages)
- `.related-searches` - Related search suggestions

### JSON Output Format

Each search result should include:
- `t`: Integer (0 for search results, 1 for related searches)
- `url`: String (web page URL)
- `title`: String (result title)
- `snippet`: String (result description/snippet)

**Example result:**
```json
{
  "t": 0,
  "url": "https://en.wikipedia.org/wiki/Steve_Jobs",
  "title": "Steve Jobs - Wikipedia",
  "snippet": "Steven Paul Jobs (February 24, 1955 – October 5, 2011) was an American businessman, inventor, and investor best known for co-founding..."
}
```

**Note**: Ignore `thumbnail` objects from the official API schema.

### Error Handling

**Authentication Errors**: Missing or invalid tokens
**Network Errors**: Request failures, timeouts
**Parsing Errors**: Unexpected HTML structure

All errors output JSON format:
```json
{
  "error": "Error message description"
}
```

Exit with code 1 for errors, code 0 for success.

### Edge Cases

- **No results found**: Return empty array `[]`
- **Network failures**: Treat as error (JSON error message + exit 1)
- **Invalid HTML structure**: Treat as error (JSON error message + exit 1)

### Output Behavior

- Pretty-print JSON by default
- No search metadata (timing, result count) included
- Write to stdout for results, stderr for errors

### Example calls

This being a node package, `kagi-search` is the CLI tool name after installation. During development, it's `./index.js`

```bash
kagi-search # shows usage
kagi-search help # shows usage
kagi-search --help # shows usage

# Runs a search, returns the results as structured data. Token flag is required
# unless the env var `KAGI_SESSION_TOKEN` is set
kagi-search "some search query" --token a1b2c3d4e5f6g7h8i9j0

# Using environment variable
export KAGI_SESSION_TOKEN=a1b2c3d4e5f6g7h8i9j0
kagi-search "search query"
```

## Installation

Package should be installable globally via npm with binary entry:

```json
{
  "bin": {
    "kagi-search": "./index.js"
  }
}
```
