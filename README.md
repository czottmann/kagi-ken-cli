# kagi-web-search

A Node.js CLI tool that searches Kagi.com using session tokens and returns structured JSON data matching Kagi's official search API schema.

Unlike the official Kagi Search API which requires API access, this tool uses your existing Kagi session to perform searches and parse the HTML results into the same JSON format.

## Why?

The [Kagi Search API](https://kagi.com/api) requires a separate API key. If you already have a Kagi subscription and want to programmatically search from scripts or tools, this CLI provides an alternative by:

- Using your existing Kagi session token (no additional API costs)
- Parsing Kagi's HTML search results into structured JSON
- Matching the official API response format for compatibility

## Showcase

### Basic search with environment variable

```bash
# Show help
kagi-search

# Set your session token once
export KAGI_SESSION_TOKEN=your_session_token_here

# Search and get JSON results
kagi-search "steve jobs"
```

### Search with token flag

```bash
# Pass token directly
kagi-search "machine learning" --token your_session_token_here
```

### JSON output format

```json
{
  "data": [
    {
      "t": 0,
      "url": "https://en.wikipedia.org/wiki/Steve_Jobs",
      "title": "Steve Jobs - Wikipedia",
      "snippet": "Steven Paul Jobs (February 24, 1955 – October 5, 2011) was an American businessman..."
    },
    {
      "t": 1,
      "list": ["steve jobs death", "steve jobs quotes", "steve jobs film"]
    }
  ]
}
```

## Authentication

Get your Kagi session token:

1. Visit [Kagi Settings](https://kagi.com/settings/user_details) in your browser
2. Copy the **Session Link**
3. Extract the `token` value from the link
4. Use that value as your session token

**Security Note**: Keep your session token private. It provides access to your Kagi account.

## Installation

```bash
npm install -g git@github.com:czottmann/kagi-web-search.git
```


## Quick Commands

```bash
# Show help
./index.js --help

# Search with environment token
export KAGI_SESSION_TOKEN=your_token
./index.js "search query"

# Search with flag
./index.js "search query" --token your_token

# Example searches
./index.js "javascript async await"
./index.js "climate change 2024" --token abc123
```

## Output Format

Results match the Kagi Search API schema:

- **Search Results** (`t: 0`): Web search results with `url`, `title`, `snippet`
- **Related Searches** (`t: 1`): Suggested search terms in `list` array

The output is wrapped in a `data` object for consistency with API standards.

## Technical Details

- **HTML Parsing**: Uses Kagi's `/html/search` endpoint for server-side rendered results
- **Authentication**: Session token via Cookie header
- **Error Handling**: Network errors, invalid tokens, parsing failures
- **User Agent**: Mimics Safari browser for compatibility

## Author

Carlo Zottmann, <carlo@zottmann.dev>, https://c.zottmann.dev, https://github.com/czottmann

> [!TIP]
> ### 💡 Did you know?
>
> I make Shortcuts-related macOS & iOS productivity apps like [Actions For Obsidian](https://actions.work/actions-for-obsidian), [Browser Actions](https://actions.work/browser-actions) (which adds Shortcuts support for several major browsers), and [BarCuts](https://actions.work/barcuts) (a surprisingly useful contextual Shortcuts launcher). Check them out!

## Key Files

- **Main Entry Point**: `index.js` (Commander.js CLI setup 16-56, authentication flow 38-45)
- **Search Engine**: `src/search.js` (HTTP requests 22-49, HTML parsing 58-188)
- **HTML Parsing**: CSS selectors for `.search-result` (67-72), grouped results (75-80)
- **Configuration**: `package.json` (dependencies, CLI binary configuration)
- **Documentation**: `CLAUDE.md` (AI assistant guidance), `SPEC.md` (project specification)

## Documentation

The codebase includes comprehensive documentation for understanding the Kagi search result parsing, authentication flow, and CLI structure. Key implementation details are found in the search module's HTML parsing functions and the main CLI argument handling.
