# kagi-web-search

A Node.js CLI tool that provides access to Kagi.com services using session tokens:

- **Search**: Searches Kagi.com and returns structured JSON data matching Kagi's official search API schema
- **Summarizer**: Uses Kagi's Summarizer to create summaries from URLs or text content

Unlike the official Kagi Search API which requires API access, this tool uses your existing Kagi session to access both search and summarization features.


## Why?

The [Kagi Search API](https://help.kagi.com/kagi/api/overview.html) requires a separate API key, which are invite-only at the moment. If you already have a Kagi subscription and want to programmatically access Kagi's services from scripts or tools, this CLI provides an alternative by:

- Using your existing Kagi session token (no additional API costs)
- Parsing Kagi's HTML search results into structured JSON (matching official API format)
- Accessing Kagi's Summarizer for URL and text summarization
- Providing a unified CLI interface for both services


## Showcase

### Basic usage with token file

```bash
# Show help
kagi-search
kagi-search help

# Set your session token once
echo "$kagi_session_token" > ~/.kagi_session_token

# Search and get JSON results
kagi-search search "steve jobs"

# Summarize a URL (default: type=summary, language=EN)
kagi-search summarize --url "https://en.wikipedia.org/wiki/Steve_Jobs"

# Summarize text with custom options
kagi-search summarize --text "Long article content..." --type takeaway --language DE
```

### Usage with token flag

```bash
# Pass token directly for any command
kagi-search search "steve jobs" --token $kagi_session_token
kagi-search summarize --url "https://example.com" --token $kagi_session_token
```


### JSON output formats

#### Search Results
Results match the Kagi Search API schema:

- **Search Results** (`t: 0`): Web search results with `url`, `title`, `snippet`
- **Related Searches** (`t: 1`): Suggested search terms in `list` array

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

#### Summarizer Results
Summaries return the markdown content directly:

```json
{
  "data": {
    "output": "# Summary\n\nSteve Jobs was an American entrepreneur and inventor who co-founded Apple Inc..."
  }
}
```


## Authentication

Get your Kagi session token:

1. Visit [Kagi Settings](https://kagi.com/settings/user_details) in your browser
2. Copy the **Session Link**
3. Extract the `token` value from the link
4. Use that value as your session token: save to `~/.kagi_session_token`, alternatively use with the `--token` flag

> [!WARNING]
> **Security Note**: Keep your session token private. It provides access to your Kagi account.


## Installation

```bash
npm install -g git@github.com:czottmann/kagi-web-search.git
```

## Tips

Kagi's **search operators** work, of course: [Kagi Keyboard Shortcuts and Search Operators | Kagi's Docs](https://help.kagi.com/kagi/features/search-operators.html#search-operators-1).

Since you're basically using the web search, **this tool inherits the setting in your account**. For example you can:

- Block or promote websites (results personalization)
- Select to receive longer or shorter search snippets (under [Kagi Settings → Search](https://kagi.com/settings/search))

**For LLM or agent use,** the tool reads the token from `~/.kagi_session_token` by default, preventing token exposure in command lines or environment variables.


## Technical Details

- **Architecture**: ES Modules with command-based CLI structure using Commander.js
- **Search**: Uses Kagi's `/html/search` endpoint for server-side rendered results (HTML parsing)
- **Summarizer**: Uses Kagi's `/mother/summary_labs` endpoint with streaming JSON responses
- **Authentication**: Session token via Cookie header (from --token flag or ~/.kagi_session_token file)
- **Error Handling**: Network errors, invalid tokens, parsing failures, stream processing
- **User Agent**: Mimics Safari browser for compatibility
- **Module System**: Native ES6 imports with `node:` prefix for built-in modules

## Author

Carlo Zottmann, <carlo@zottmann.dev>, https://c.zottmann.dev, https://github.com/czottmann.

This project is neither affiliated with nor endorsed by Kagi. I'm just a very happy customer.

> [!TIP]
> I make Shortcuts-related macOS & iOS productivity apps like [Actions For Obsidian](https://actions.work/actions-for-obsidian), [Browser Actions](https://actions.work/browser-actions) (which adds Shortcuts support for several major browsers), and [BarCuts](https://actions.work/barcuts) (a surprisingly useful contextual Shortcuts launcher). Check them out!

---

## Key Files

- **Main Entry Point**: `index.js` (Commander.js CLI setup, command dispatcher)
- **Web Client**: `src/web-client.js` (HTTP requests, HTML parsing, streaming JSON processing)
- **Search Command**: `src/commands/search.js` (search command implementation)
- **Summarizer Command**: `src/commands/summarize.js` (summarizer command implementation)
- **Authentication**: `src/utils/auth.js` (token resolution, file reading)
- **Help Text**: `src/utils/help-text.js` (shared help constants and messages)
- **Configuration**: `package.json` (ES modules, dependencies, CLI binary configuration)
- **Documentation**: `CLAUDE.md` (AI assistant guidance), `SPEC.md` (project specification)

## Documentation

- **[Project Overview](docs/project-overview.md)** - Purpose, technology stack, platform support with file references
- **[Architecture](docs/architecture.md)** - Component map, data flow, key functions with line numbers
- **[Build System](docs/build-system.md)** - Build workflows, installation, and distribution
- **[Testing](docs/testing.md)** - Testing approach, manual validation, and future test recommendations
- **[Development](docs/development.md)** - Code patterns, CLI structure, authentication flow with examples
- **[Deployment](docs/deployment.md)** - Package distribution, npm installation, and platform setup
- **[Files Catalog](docs/files.md)** - Complete file organization, dependencies, naming conventions

LLMs will find specific file paths, line numbers for key functions, actual code examples from the codebase, and practical guidance for understanding and extending the Kagi search functionality.
