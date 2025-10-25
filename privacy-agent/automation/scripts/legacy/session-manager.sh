#!/bin/bash
# GOOSE SESSION MANAGER - Persistent, resumable sessions

set -euo pipefail

# Configuration
GOOSE_DATA_DIR="${HOME}/.local/share/goose"
SESSION_DIR="${GOOSE_DATA_DIR}/sessions"
MEMORY_DIR="$(pwd)/memory"
LOGS_DIR="$(pwd)/logs"

# Function to find latest session for an agent
find_latest_session() {
    local agent_name=$1
    ls -t "${SESSION_DIR}"/${agent_name}_*.jsonl 2>/dev/null | head -1
}

# Function to extract session ID from filename
get_session_id() {
    local session_file=$1
    basename "$session_file" .jsonl | sed 's/.*_session/session/'
}

# Function to resume or start session
manage_session() {
    local recipe=$1
    local agent_name=$2
    local max_turns=${3:-500}
    
    # Check for existing session
    local latest_session=$(find_latest_session "$agent_name")
    
    if [[ -n "$latest_session" ]]; then
        local session_id=$(get_session_id "$latest_session")
        echo "📂 Found existing session: $session_id"
        echo "   Resuming from: $latest_session"
        
        # Resume with context
        goose run \
            --recipe "$recipe" \
            --name "$agent_name" \
            --resume "$session_id" \
            --max-turns "$max_turns"
    else
        echo "🆕 Starting new session for: $agent_name"
        
        # Start fresh with context
        goose run \
            --recipe "$recipe" \
            --name "$agent_name" \
            --max-turns "$max_turns"
    fi
}

# Main execution
if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <recipe> <agent_name> [max_turns]"
    echo "Example: $0 recipes/recipe-railgun-specialist.yaml railgun_specialist 500"
    exit 1
fi

manage_session "$@"