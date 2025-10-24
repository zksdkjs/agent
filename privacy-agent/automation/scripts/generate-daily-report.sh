#!/bin/bash
# Generate daily report from all sessions

DATE=$(date +%Y-%m-%d)
REPORT_DIR="insights/daily/$(date +%Y)/$(date +%m-%B)/$(date +%d)"
mkdir -p "$REPORT_DIR"

echo "# Daily Report - $DATE" > "$REPORT_DIR/daily-summary.md"
echo "" >> "$REPORT_DIR/daily-summary.md"

# Aggregate all session reports
for session in workspace/sessions/$DATE/*.md; do
    if [ -f "$session" ]; then
        echo "## $(basename $session .md)" >> "$REPORT_DIR/daily-summary.md"
        cat "$session" >> "$REPORT_DIR/daily-summary.md"
        echo "" >> "$REPORT_DIR/daily-summary.md"
    fi
done

echo "Daily report generated: $REPORT_DIR/daily-summary.md"
