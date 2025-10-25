#!/bin/bash
# Start a new work session with context

SESSION_TIME=$(date +%H%M)
SESSION_DATE=$(date +%Y-%m-%d)
SESSION_DIR="workspace/sessions/$SESSION_DATE"
mkdir -p "$SESSION_DIR"

# Load current context
echo "# Session $SESSION_TIME" > "$SESSION_DIR/session-$SESSION_TIME.md"
echo "Started: $(date)" >> "$SESSION_DIR/session-$SESSION_TIME.md"
echo "" >> "$SESSION_DIR/session-$SESSION_TIME.md"
echo "## Current Sprint" >> "$SESSION_DIR/session-$SESSION_TIME.md"
cat workspace/current/sprint.md >> "$SESSION_DIR/session-$SESSION_TIME.md"

echo "Session started: $SESSION_DIR/session-$SESSION_TIME.md"
echo "Current context loaded. Begin work!"
