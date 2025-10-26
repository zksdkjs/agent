#!/bin/bash
# Recipe: Multi-Agent System
# Monitor progress of all specialist agents in real-time

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WORKSPACE"

# Show help if requested
if [ "${1:-}" == "--help" ] || [ "${1:-}" == "-h" ]; then
    echo "Usage: $0 [options]"
    echo ""
    echo "Monitor all specialist agents in real-time"
    echo ""
    echo "Options:"
    echo "  --refresh N   Refresh interval in seconds (default: 5)"
    echo "  --once        Show status once and exit (no loop)"
    echo "  --help, -h    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Monitor with 5 second refresh"
    echo "  $0 --refresh 10       # Monitor with 10 second refresh"
    echo "  $0 --once             # Show status once and exit"
    echo ""
    exit 0
fi

# Parse options
REFRESH_INTERVAL=5
ONCE_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --refresh)
            REFRESH_INTERVAL="$2"
            shift 2
            ;;
        --once)
            ONCE_MODE=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Load config
CONFIG_FILE=".goose/config/multi-agent.yaml"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: Config file not found: $CONFIG_FILE${NC}"
    exit 1
fi

# Get list of agents
if command -v yq &> /dev/null; then
    AGENTS=($(yq eval '.agents | keys | .[]' "$CONFIG_FILE"))
else
    # Fallback parsing
    AGENTS=(privacycash railgun aztec bitcoin fhe)
fi

# Clear screen function
clear_screen() {
    if [ "$ONCE_MODE" = false ]; then
        clear
    fi
}

# Get agent status
get_agent_status() {
    local agent="$1"
    local workspace="workspace/agents/$agent"
    local status="NOT_STARTED"
    local session_info=""
    local last_commit=""
    local files_changed=""
    local current_task=""

    # Check if workspace exists
    if [ ! -d "$workspace" ]; then
        echo "NOT_STARTED||N/A||N/A||N/A||N/A"
        return
    fi

    # Get session info from handoff
    if [ -f "$workspace/handoff.md" ]; then
        # Extract current session from handoff (e.g., "## 🎯 Current Session: 2 of 4")
        session_info=$(grep -o "Current Session: [0-9]* of [0-9]*" "$workspace/handoff.md" 2>/dev/null | head -1 || echo "N/A")

        # Extract current task
        current_task=$(grep -A 2 "## 📋 Next Task" "$workspace/handoff.md" 2>/dev/null | tail -1 | sed 's/^[[:space:]]*//' || echo "N/A")
    fi

    # Check if agent is currently running (look for goose process with agent name)
    if pgrep -f "goose.*${agent}" > /dev/null 2>&1; then
        status="RUNNING"
    else
        # Check if there are session files (agent has run before)
        if [ -d "$workspace/sessions" ] && [ "$(find "$workspace/sessions" -name "*.md" 2>/dev/null | wc -l)" -gt 0 ]; then
            status="COMPLETED"
        else
            status="IDLE"
        fi
    fi

    # Get last commit by this agent
    if [ -d ".git" ]; then
        last_commit=$(git log --grep="Agent.*${agent}" --format="%ar" -1 2>/dev/null || echo "Never")
    else
        last_commit="N/A"
    fi

    # Get files changed in workspace
    if [ -d "$workspace" ]; then
        files_changed=$(find "$workspace" -name "*.md" -mmin -60 2>/dev/null | wc -l | tr -d ' ')
    else
        files_changed="0"
    fi

    echo "$status||${session_info:-N/A}||$last_commit||$files_changed||${current_task:-N/A}"
}

# Get overall progress percentage
get_progress_percentage() {
    local session_info="$1"
    if [[ "$session_info" =~ ([0-9]+)\ of\ ([0-9]+) ]]; then
        local current="${BASH_REMATCH[1]}"
        local total="${BASH_REMATCH[2]}"
        local percentage=$((current * 100 / total))
        echo "$percentage"
    else
        echo "0"
    fi
}

# Draw progress bar
draw_progress_bar() {
    local percentage="$1"
    local width=20
    local filled=$((percentage * width / 100))
    local empty=$((width - filled))

    echo -n "["
    for ((i=0; i<filled; i++)); do echo -n "█"; done
    for ((i=0; i<empty; i++)); do echo -n "░"; done
    echo -n "]"
}

# Display dashboard
display_dashboard() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  ${BOLD}${CYAN}zkSDK Multi-Agent Progress Dashboard${NC}                        ${BLUE}║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Last Updated:${NC} $timestamp"
    echo ""

    local total_agents=${#AGENTS[@]}
    local running_count=0
    local completed_count=0
    local idle_count=0
    local not_started_count=0

    # Agent status table
    for agent in "${AGENTS[@]}"; do
        local status_line=$(get_agent_status "$agent")
        IFS='||' read -r status session_info last_commit files_changed current_task <<< "$status_line"

        # Count statuses
        case "$status" in
            RUNNING) ((running_count++)) ;;
            COMPLETED) ((completed_count++)) ;;
            IDLE) ((idle_count++)) ;;
            NOT_STARTED) ((not_started_count++)) ;;
        esac

        # Display agent info
        echo -e "${MAGENTA}┌─────────────────────────────────────────────────────────────┐${NC}"

        # Agent name and status
        local status_color=""
        local status_icon=""
        case "$status" in
            RUNNING)
                status_color="${GREEN}"
                status_icon="⚡"
                ;;
            COMPLETED)
                status_color="${BLUE}"
                status_icon="✓"
                ;;
            IDLE)
                status_color="${YELLOW}"
                status_icon="⏸"
                ;;
            NOT_STARTED)
                status_color="${RED}"
                status_icon="○"
                ;;
        esac

        echo -e "${MAGENTA}│${NC} ${status_icon} ${BOLD}${CYAN}${agent^}${NC} ${status_color}[$status]${NC}"

        # Session progress
        if [ "$session_info" != "N/A" ]; then
            local percentage=$(get_progress_percentage "$session_info")
            echo -e "${MAGENTA}│${NC}   Session: $session_info $(draw_progress_bar $percentage) ${percentage}%"
        else
            echo -e "${MAGENTA}│${NC}   Session: ${YELLOW}Not started${NC}"
        fi

        # Working directory
        if command -v yq &> /dev/null; then
            local working_dir=$(yq eval ".agents.${agent}.working_dir" "$CONFIG_FILE")
            if [ "$working_dir" != "null" ]; then
                echo -e "${MAGENTA}│${NC}   Working on: ${CYAN}$working_dir${NC}"
            fi
        fi

        # Last commit
        if [ "$last_commit" != "N/A" ] && [ "$last_commit" != "Never" ]; then
            echo -e "${MAGENTA}│${NC}   Last commit: ${GREEN}$last_commit${NC}"
        else
            echo -e "${MAGENTA}│${NC}   Last commit: ${YELLOW}$last_commit${NC}"
        fi

        # Current task (truncated)
        if [ "$current_task" != "N/A" ] && [ ${#current_task} -gt 0 ]; then
            local truncated_task="${current_task:0:50}"
            if [ ${#current_task} -gt 50 ]; then
                truncated_task="${truncated_task}..."
            fi
            echo -e "${MAGENTA}│${NC}   Task: $truncated_task"
        fi

        # Recent activity
        if [ "$files_changed" != "0" ] && [ "$files_changed" != "N/A" ]; then
            echo -e "${MAGENTA}│${NC}   Recent files: ${GREEN}$files_changed modified in last hour${NC}"
        fi

        echo -e "${MAGENTA}└─────────────────────────────────────────────────────────────┘${NC}"
        echo ""
    done

    # Summary statistics
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  ${BOLD}Summary${NC}                                                      ${BLUE}║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${CYAN}Total Agents:${NC}     $total_agents"
    echo -e "  ${GREEN}Running:${NC}          $running_count"
    echo -e "  ${BLUE}Completed:${NC}        $completed_count"
    echo -e "  ${YELLOW}Idle:${NC}             $idle_count"
    echo -e "  ${RED}Not Started:${NC}      $not_started_count"
    echo ""

    # Git activity
    if [ -d ".git" ]; then
        local today_commits=$(git log --since="today" --oneline --grep="Agent:" 2>/dev/null | wc -l | tr -d ' ')
        echo -e "  ${CYAN}Agent commits today:${NC} $today_commits"
    fi

    echo ""

    # Show logs location
    if [ -d "workspace/logs" ]; then
        local log_count=$(find workspace/logs -name "*.log" -mtime 0 2>/dev/null | wc -l | tr -d ' ')
        if [ "$log_count" -gt 0 ]; then
            echo -e "${CYAN}Log Files:${NC} $log_count active logs in ${GREEN}workspace/logs/${NC}"
            echo ""
        fi
    fi

    # Commands
    if [ "$ONCE_MODE" = false ]; then
        echo -e "${YELLOW}Commands:${NC}"
        echo -e "  Press ${BOLD}Ctrl+C${NC} to exit"
        echo -e "  Refreshing every ${CYAN}${REFRESH_INTERVAL}s${NC}"
        echo ""
    fi
}

# Main loop
main() {
    if [ "$ONCE_MODE" = true ]; then
        # Just show once and exit
        display_dashboard
    else
        # Continuous monitoring
        while true; do
            clear_screen
            display_dashboard
            sleep "$REFRESH_INTERVAL"
        done
    fi
}

# Trap Ctrl+C for clean exit
trap 'echo -e "\n${GREEN}Monitoring stopped${NC}"; exit 0' INT

# Run
main
