#!/bin/sh

# kagi-search-wrapper.sh
# A wrapper script that sets KAGI_SESSION_TOKEN and calls kagi-search

# Try to read token from file if not already set
if [ -z "$KAGI_SESSION_TOKEN" ]; then
    # Check for token file in common locations
    for token_file in "$HOME/.kagi_session_token" "$HOME/.config/kagi/session_token" ".kagi_session_token"; do
        if [ -f "$token_file" ]; then
            KAGI_SESSION_TOKEN=$(cat "$token_file" | tr -d '\n\r')
            export KAGI_SESSION_TOKEN
            break
        fi
    done
fi

# Check if we have a token now
if [ -z "$KAGI_SESSION_TOKEN" ]; then
    echo "Error: KAGI_SESSION_TOKEN environment variable is not set" >&2
    echo "Please either:" >&2
    echo "  1. Set environment variable: export KAGI_SESSION_TOKEN=your_token_here" >&2
    echo "  2. Create token file: echo 'your_token_here' > ~/.kagi_session_token" >&2
    exit 1
fi

# Call kagi-search with all arguments passed to this script
exec kagi-search "$@"
