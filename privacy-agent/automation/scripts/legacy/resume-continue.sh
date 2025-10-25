#!/usr/bin/env bash
set -euo pipefail

# Resume a session and give it a short instruction to continue
# Usage: bash scripts/resume-continue.sh <SESSION_NAME> [EXTRA_TURNS] [MESSAGE]

cd "$(dirname "$0")/.."

SESSION_NAME="${1:-}"
EXTRA_TURNS="${2:-20}"
MESSAGE="${3:-Yes, continue and complete your current plan, then summarize results.}"

if [[ -z "$SESSION_NAME" ]]; then
  echo "Usage: $0 <SESSION_NAME> [EXTRA_TURNS] [MESSAGE]" >&2
  exit 1
fi

goose run --resume --name "$SESSION_NAME" --max-turns "$EXTRA_TURNS" --text "$MESSAGE"


