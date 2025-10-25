#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Goose Sessions (last 20) ==="
goose session list | tail -20 || true

echo
echo "=== Running goose processes ==="
ps aux | grep "goose run" | grep -v grep || true

echo
echo "=== Today outputs ==="
ls -la outputs/social | tail -20 || true


