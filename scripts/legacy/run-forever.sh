#!/bin/bash
# RUN FOREVER - Continuous agent work with pause/resume support

set -euo pipefail

echo "♾️  CONTINUOUS AGENT SYSTEM"
echo "=========================="
echo ""
echo "Press Ctrl+C to pause (sessions will be saved)"
echo "Run this script again to resume from where you left off"
echo ""

# Lock file to prevent multiple instances
LOCK_FILE="/tmp/goose-continuous.lock"
STATE_FILE="$(pwd)/memory/continuous_state.json"

# Check if already running
if [[ -f "$LOCK_FILE" ]]; then
    PID=$(cat "$LOCK_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "⚠️  Another instance is already running (PID: $PID)"
        echo "Kill it first: kill $PID"
        exit 1
    else
        echo "🔧 Removing stale lock file"
        rm "$LOCK_FILE"
    fi
fi

# Create lock file
echo $$ > "$LOCK_FILE"

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping continuous system..."
    rm -f "$LOCK_FILE"
    
    # Save current state
    cat > "$STATE_FILE" << EOF
{
  "last_run": "$(date -Iseconds)",
  "last_provider": "$CURRENT_PROVIDER",
  "session_count": $SESSION_COUNT,
  "total_runtime": $TOTAL_RUNTIME
}
EOF
    
    echo "✅ State saved. Run this script again to continue."
    exit 0
}

trap cleanup EXIT INT TERM

# Initialize state
CURRENT_PROVIDER=""
SESSION_COUNT=0
START_TIME=$(date +%s)
TOTAL_RUNTIME=0

# Load previous state if exists
if [[ -f "$STATE_FILE" ]]; then
    echo "📂 Loading previous state..."
    PREV_PROVIDER=$(python3 -c "import json; print(json.load(open('$STATE_FILE'))['last_provider'])" 2>/dev/null || echo "")
    PREV_COUNT=$(python3 -c "import json; print(json.load(open('$STATE_FILE'))['session_count'])" 2>/dev/null || echo "0")
    PREV_RUNTIME=$(python3 -c "import json; print(json.load(open('$STATE_FILE'))['total_runtime'])" 2>/dev/null || echo "0")
    
    SESSION_COUNT=$PREV_COUNT
    TOTAL_RUNTIME=$PREV_RUNTIME
    
    echo "   Previous provider: $PREV_PROVIDER"
    echo "   Total sessions: $SESSION_COUNT"
    echo "   Total runtime: $((TOTAL_RUNTIME / 60)) minutes"
    echo ""
fi

# Function to run one cycle
run_cycle() {
    # Update build progress
    ./launch-strategic-system.sh > /tmp/goose-cycle.log 2>&1 &
    AGENT_PID=$!
    
    # Extract current provider from log
    sleep 2
    CURRENT_PROVIDER=$(grep "Next priority:" /tmp/goose-cycle.log | awk '{print $NF}' || echo "unknown")
    
    echo "🔄 Cycle $((SESSION_COUNT + 1)): Working on $CURRENT_PROVIDER"
    echo "   Agent PID: $AGENT_PID"
    
    # Wait for agent to complete or be interrupted
    wait $AGENT_PID || true
    
    SESSION_COUNT=$((SESSION_COUNT + 1))
    
    # Show progress
    echo ""
    echo "✅ Cycle complete. Checking progress..."
    python3 -c "
import json
with open('memory/build_progress.json', 'r') as f:
    data = json.load(f)
    for provider, info in data['providers'].items():
        emoji = '✅' if info['status'] == 'complete' else '🚧' if info['status'] == 'partial' else '❌'
        print(f'{emoji} {provider}: {info[\"lines\"]} lines')
"
    echo ""
}

# Main continuous loop
echo "🚀 Starting continuous work..."
echo ""

while true; do
    # Update runtime
    CURRENT_TIME=$(date +%s)
    RUNTIME=$((CURRENT_TIME - START_TIME + TOTAL_RUNTIME))
    
    echo "⏱️  Runtime: $((RUNTIME / 60)) minutes | Sessions: $SESSION_COUNT"
    
    # Run one cycle
    run_cycle
    
    # Check if all providers are complete
    INCOMPLETE=$(python3 -c "
import json
with open('memory/build_progress.json', 'r') as f:
    data = json.load(f)
    incomplete = sum(1 for p in data['providers'].values() if p['status'] != 'complete')
    print(incomplete)
" 2>/dev/null || echo "5")
    
    if [[ $INCOMPLETE -eq 0 ]]; then
        echo ""
        echo "🎉 ALL PROVIDERS COMPLETE!"
        echo "Total sessions: $SESSION_COUNT"
        echo "Total runtime: $((RUNTIME / 60)) minutes"
        break
    fi
    
    # Wait before next cycle
    echo "💤 Waiting 10 seconds before next cycle..."
    sleep 10
done