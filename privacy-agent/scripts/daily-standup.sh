#!/bin/bash

# Privacy Agent Daily Standup Script
# Runs the daily coordination meeting for all agents

echo "🌅 Privacy Agent Daily Standup - $(date)"
echo "========================================="

# Set working directory
cd "$(dirname "$0")/.."

# Check if Goose is installed
if ! command -v goose &> /dev/null; then
    echo "❌ Error: Goose is not installed"
    echo "Please install Goose first: https://block.github.io/goose/docs/getting-started/installation/"
    exit 1
fi

# Run the orchestrator in standup mode
echo "Starting daily standup coordination..."
python3 scripts/orchestrate.py --mode standup

echo "✅ Daily standup complete!"
echo ""
echo "Check the following for results:"
echo "  - Logs: outputs/logs/"
echo "  - Reports: outputs/reports/"
echo "  - Memory: memory/"