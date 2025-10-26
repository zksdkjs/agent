#!/bin/bash
# Recipe: Multi-Agent System
# Orchestrate all specialist agents in parallel

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WORKSPACE"

# Show help if requested
if [ "${1:-}" == "--help" ] || [ "${1:-}" == "-h" ]; then
    echo "Usage: $0 [options]"
    echo ""
    echo "Orchestrate all specialist agents in parallel"
    echo ""
    echo "Options:"
    echo "  --agents LIST    Comma-separated list of agents (default: all)"
    echo "  --mode MODE      Execution mode: tmux|parallel|sequential (default: tmux)"
    echo "  --dry-run        Show what would run without executing"
    echo "  --help, -h       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run all agents with tmux"
    echo "  $0 --agents privacycash,railgun       # Run only specific agents"
    echo "  $0 --mode parallel                    # Run in background processes"
    echo "  $0 --mode sequential                  # Run one after another"
    echo ""
    exit 0
fi

# Parse options
AGENT_LIST="all"
MODE="tmux"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --agents)
            AGENT_LIST="$2"
            shift 2
            ;;
        --mode)
            MODE="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
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
if [ "$AGENT_LIST" == "all" ]; then
    if command -v yq &> /dev/null; then
        AGENTS=($(yq eval '.agents | keys | .[]' "$CONFIG_FILE"))
    else
        # Fallback parsing
        AGENTS=(privacycash railgun aztec bitcoin fhe)
    fi
else
    IFS=',' read -ra AGENTS <<< "$AGENT_LIST"
fi

# Banner
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}  ${CYAN}zkSDK Multi-Agent Orchestrator${NC}                                ${BLUE}║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Configuration:${NC}"
echo -e "  ${CYAN}Agents:${NC}      ${AGENTS[*]}"
echo -e "  ${CYAN}Mode:${NC}        $MODE"
echo -e "  ${CYAN}Total:${NC}       ${#AGENTS[@]} agents"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}Dry run mode - not executing${NC}"
    for agent in "${AGENTS[@]}"; do
        echo -e "  Would run: ${CYAN}scripts/run-agent-parallel.sh $agent${NC}"
    done
    exit 0
fi

# Check dependencies
if [ "$MODE" == "tmux" ] && ! command -v tmux &> /dev/null; then
    echo -e "${YELLOW}Warning: tmux not found, falling back to parallel mode${NC}"
    MODE="parallel"
fi

# Create orchestration session
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SESSION_NAME="zkSDK_orchestration_${TIMESTAMP}"

case "$MODE" in
    tmux)
        echo -e "${CYAN}Starting tmux orchestration session...${NC}"
        echo ""

        # Create new tmux session
        tmux new-session -d -s "$SESSION_NAME"

        # Split windows for each agent
        for ((i=0; i<${#AGENTS[@]}; i++)); do
            agent="${AGENTS[$i]}"

            if [ $i -eq 0 ]; then
                # First agent uses the initial pane
                tmux send-keys -t "$SESSION_NAME:0" "scripts/run-agent-parallel.sh $agent" C-m
            else
                # Create new pane and run agent
                tmux split-window -t "$SESSION_NAME" -v
                tmux select-layout -t "$SESSION_NAME" tiled
                tmux send-keys -t "$SESSION_NAME:0.$i" "scripts/run-agent-parallel.sh $agent" C-m
            fi

            echo -e "  ${GREEN}✓${NC} Launched ${CYAN}$agent${NC} in tmux pane $i"
        done

        echo ""
        echo -e "${GREEN}All agents launched in tmux session: ${CYAN}$SESSION_NAME${NC}"
        echo ""
        echo -e "${YELLOW}Commands:${NC}"
        echo -e "  ${CYAN}tmux attach -t $SESSION_NAME${NC}     # Attach to session"
        echo -e "  ${CYAN}tmux kill-session -t $SESSION_NAME${NC}  # Stop all agents"
        echo -e "  ${CYAN}Ctrl+B then D${NC}                      # Detach from session"
        echo ""

        # Attach to the session
        echo -e "${CYAN}Attaching to tmux session...${NC}"
        sleep 2
        tmux attach -t "$SESSION_NAME"
        ;;

    parallel)
        echo -e "${CYAN}Starting parallel background processes...${NC}"
        echo ""

        PIDS=()
        for agent in "${AGENTS[@]}"; do
            # Run in background
            scripts/run-agent-parallel.sh "$agent" > "workspace/logs/orchestrate-${agent}-${TIMESTAMP}.log" 2>&1 &
            PID=$!
            PIDS+=($PID)
            echo -e "  ${GREEN}✓${NC} Launched ${CYAN}$agent${NC} (PID: $PID)"
        done

        echo ""
        echo -e "${GREEN}All agents launched${NC}"
        echo -e "${CYAN}Process IDs: ${PIDS[*]}${NC}"
        echo ""
        echo -e "${YELLOW}Monitoring progress...${NC}"
        echo -e "Press Ctrl+C to stop monitoring (agents will continue running)"
        echo ""

        # Monitor processes
        while true; do
            RUNNING=0
            for pid in "${PIDS[@]}"; do
                if ps -p $pid > /dev/null 2>&1; then
                    ((RUNNING++))
                fi
            done

            echo -ne "\r  ${CYAN}Agents running: $RUNNING/${#AGENTS[@]}${NC}  "

            if [ $RUNNING -eq 0 ]; then
                echo ""
                echo -e "${GREEN}All agents completed!${NC}"
                break
            fi

            sleep 5
        done

        # Aggregate reports
        echo ""
        echo -e "${CYAN}Aggregating reports...${NC}"
        if [ -f "scripts/aggregate-reports.sh" ]; then
            scripts/aggregate-reports.sh
        fi
        ;;

    sequential)
        echo -e "${CYAN}Starting sequential execution...${NC}"
        echo ""

        for ((i=0; i<${#AGENTS[@]}; i++)); do
            agent="${AGENTS[$i]}"
            echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
            echo -e "  ${CYAN}Agent $((i+1))/${#AGENTS[@]}: $agent${NC}"
            echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
            echo ""

            scripts/run-agent-parallel.sh "$agent"

            echo ""
            echo -e "${GREEN}✓ $agent complete${NC}"
            echo ""

            if [ $((i+1)) -lt ${#AGENTS[@]} ]; then
                echo -e "${YELLOW}Proceeding to next agent in 5 seconds...${NC}"
                sleep 5
            fi
        done

        echo ""
        echo -e "${GREEN}All agents completed sequentially!${NC}"
        ;;

    *)
        echo -e "${RED}Unknown mode: $MODE${NC}"
        exit 1
        ;;
esac

# Final summary
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}  ${GREEN}Orchestration Complete${NC}                                      ${BLUE}║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Agents run:${NC} ${AGENTS[*]}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "  - Review agent workspaces in ${GREEN}workspace/agents/${NC}"
echo -e "  - Check git commits: ${GREEN}git log --since=\"today\"${NC}"
echo -e "  - Aggregate reports: ${GREEN}scripts/aggregate-reports.sh${NC}"
echo ""
