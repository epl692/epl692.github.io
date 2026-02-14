#!/bin/bash

# ntfy-send.sh: Send piped input as a message to an ntfy.sh topic
# Usage: command | ./ntfy-send.sh -t <topic> [-s <server>]
#   -t <topic>   The ntfy topic to send the message to (required)
#   -s <server>  The ntfy server to use (optional, default: ntfy.sh)

set -e

TOPIC=""
SERVER="ntfy.sh"

while getopts "t:s:" opt; do
  case $opt in
    t) TOPIC="$OPTARG" ;;
    s) SERVER="$OPTARG" ;;
    *) echo "Usage: $0 -t <topic> [-s <server>]" >&2; exit 1 ;;
  esac
done

if [ -z "$TOPIC" ]; then
  echo "Error: Topic (-t) is required." >&2
  echo "Usage: $0 -t <topic> [-s <server>]" >&2
  exit 1
fi

MESSAGE="$(cat)"

if [ -z "$MESSAGE" ]; then
  echo "Error: No input provided to send." >&2
  exit 1
fi

URL="https://$SERVER/$TOPIC"

if ! curl --fail --silent --show-error -d "$MESSAGE" "$URL"; then
  echo "Error: Failed to send message to $URL" >&2
  exit 1
fi
