#!/bin/bash
# Recipe: Multi-Agent System
# Run a single specialist agent in parallel mode with isolated workspace

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
    echo "Usage: $0 <agent_name> [options]"
    echo ""
    echo "Run a specialized agent in parallel mode"
    echo ""
    echo "Arguments:"
    echo "  agent_name    Agent to run (privacycash, railgun, aztec, bitcoin, fhe)"
    echo ""
    echo "Options:"
    echo "  --sessions N  Override number of sessions (default: from config)"
    echo "  --dry-run     Show what would run without executing"
    echo "  --help, -h    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 privacycash                # Run PrivacyCash agent"
    echo "  $0 railgun --sessions 3       # Run Railgun with 3 sessions"
    echo "  $0 aztec --dry-run            # Show Aztec config without running"
    echo ""
    echo "Available agents:"
    echo "  privacycash  - Solana ZK Compression (Light Protocol)"
    echo "  railgun      - EVM privacy with Recipe→Step→ComboMeal"
    echo "  aztec        - Aztec privacy L2 with Noir"
    echo "  bitcoin      - Bitcoin Silent Payments (BIP352)"
    echo "  fhe          - Zama homomorphic encryption"
    exit 0
fi

# Get agent name
AGENT_NAME="${1:-}"
if [ -z "$AGENT_NAME" ]; then
    echo -e "${RED}Error: Agent name required${NC}"
    echo "Usage: $0 <agent_name>"
    echo "Run '$0 --help' for more information"
    exit 1
fi

# Parse options
SESSIONS_OVERRIDE=""
DRY_RUN=false

shift || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --sessions)
            SESSIONS_OVERRIDE="$2"
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

# Extract agent config (using yq if available, otherwise grep/awk)
if command -v yq &> /dev/null; then
    # Use yq for proper YAML parsing
    AGENT_RECIPE=$(yq eval ".agents.${AGENT_NAME}.recipe" "$CONFIG_FILE")
    AGENT_WORKSPACE=$(yq eval ".agents.${AGENT_NAME}.workspace" "$CONFIG_FILE")
    AGENT_WORKDIR=$(yq eval ".agents.${AGENT_NAME}.working_dir" "$CONFIG_FILE")
    AGENT_SESSIONS=$(yq eval ".agents.${AGENT_NAME}.sessions" "$CONFIG_FILE")
    AGENT_DESC=$(yq eval ".agents.${AGENT_NAME}.description" "$CONFIG_FILE")
else
    # Fallback to grep/awk (less robust but works)
    AGENT_RECIPE=$(grep -A 10 "^  ${AGENT_NAME}:" "$CONFIG_FILE" | grep "recipe:" | awk '{print $2}' | tr -d '"')
    AGENT_WORKSPACE=$(grep -A 10 "^  ${AGENT_NAME}:" "$CONFIG_FILE" | grep "workspace:" | awk '{print $2}' | tr -d '"')
    AGENT_WORKDIR=$(grep -A 10 "^  ${AGENT_NAME}:" "$CONFIG_FILE" | grep "working_dir:" | awk '{print $2}' | tr -d '"')
    AGENT_SESSIONS=$(grep -A 10 "^  ${AGENT_NAME}:" "$CONFIG_FILE" | grep "sessions:" | awk '{print $2}')
    AGENT_DESC=$(grep -A 10 "^  ${AGENT_NAME}:" "$CONFIG_FILE" | grep "description:" | cut -d'"' -f2)
fi

# Check if agent exists
if [ -z "$AGENT_RECIPE" ] || [ "$AGENT_RECIPE" == "null" ]; then
    echo -e "${RED}Error: Agent '${AGENT_NAME}' not found in config${NC}"
    echo "Available agents:"
    if command -v yq &> /dev/null; then
        yq eval '.agents | keys | .[]' "$CONFIG_FILE"
    else
        grep "^  [a-z]" "$CONFIG_FILE" | grep ":" | cut -d: -f1 | sed 's/^  /  - /'
    fi
    exit 1
fi

# Override sessions if specified
if [ -n "$SESSIONS_OVERRIDE" ]; then
    AGENT_SESSIONS="$SESSIONS_OVERRIDE"
fi

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SESSION_DATE=$(date +%Y-%m-%d)

# Set API key (use agent-specific or fall back to default)
API_KEY_VAR="OPENROUTER_API_KEY"
if [ "$AGENT_NAME" == "railgun" ] && [ -n "${OPENROUTER_API_KEY_2:-}" ]; then
    API_KEY_VAR="OPENROUTER_API_KEY_2"
elif [ "$AGENT_NAME" == "aztec" ] && [ -n "${OPENROUTER_API_KEY_3:-}" ]; then
    API_KEY_VAR="OPENROUTER_API_KEY_3"
fi

export GOOSE_API_KEY="${!API_KEY_VAR}"
export GOOSE_MODEL="${GOOSE_MODEL:-qwen/qwen3-coder-plus}"
export GOOSE_PROVIDER="${GOOSE_PROVIDER:-openrouter}"
export GOOSE_TEMPERATURE="${GOOSE_TEMPERATURE:-0.2}"

# Display configuration
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}  ${CYAN}zkSDK Multi-Agent Parallel Development System${NC}              ${BLUE}║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Agent Configuration:${NC}"
echo -e "  ${CYAN}Name:${NC}        $AGENT_NAME"
echo -e "  ${CYAN}Recipe:${NC}      .goose/recipes/$AGENT_RECIPE"
echo -e "  ${CYAN}Description:${NC} $AGENT_DESC"
echo -e "  ${CYAN}Workspace:${NC}   $AGENT_WORKSPACE"
echo -e "  ${CYAN}Working Dir:${NC} $AGENT_WORKDIR"
echo -e "  ${CYAN}Sessions:${NC}    $AGENT_SESSIONS"
echo -e "  ${CYAN}API Key:${NC}     Using $API_KEY_VAR"
echo -e "  ${CYAN}Model:${NC}       $GOOSE_MODEL"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}Dry run mode - not executing${NC}"
    exit 0
fi

# Create agent workspace structure
mkdir -p "$AGENT_WORKSPACE"
mkdir -p "$AGENT_WORKSPACE/sessions/$SESSION_DATE"
mkdir -p "workspace/logs"

# Create/update agent handoff if it doesn't exist
HANDOFF_FILE="$AGENT_WORKSPACE/handoff.md"
if [ ! -f "$HANDOFF_FILE" ]; then
    echo -e "${YELLOW}Creating initial handoff for $AGENT_NAME...${NC}"
    cat > "$HANDOFF_FILE" << EOF
# ${AGENT_NAME^} Agent Handoff Document

## 🎯 Current Session: 1 of $AGENT_SESSIONS

**Agent:** $AGENT_NAME
**Description:** $AGENT_DESC
**Working Directory:** $AGENT_WORKDIR

---

## 📋 Next Task

Focus on implementing the core functionality for $AGENT_NAME.
Check the main handoff at \`workspace/hubs/dev-hand-off.md\` for global context.

---

## ✅ Completed Tasks

(This will be populated as sessions complete)

---

## 🎯 Next Session Focus

Work on the next priority task for $AGENT_NAME implementation.

EOF
fi

# Log start
LOG_FILE="workspace/logs/agent-${AGENT_NAME}-${TIMESTAMP}.log"
echo "[$(date)] Starting $AGENT_NAME agent with $AGENT_SESSIONS sessions" > "$LOG_FILE"

echo -e "${GREEN}Starting $AGENT_NAME Agent Sessions...${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Run sessions
for ((SESSION=1; SESSION<=AGENT_SESSIONS; SESSION++)); do
    echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║${NC} ${CYAN}Session $SESSION of $AGENT_SESSIONS${NC}                                            ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    SESSION_NAME="${AGENT_NAME}_session_${SESSION}_${TIMESTAMP}"
    SESSION_START=$(date +%s)

    # Run the specialist recipe
    echo -e "${CYAN}Launching ${AGENT_NAME} specialist recipe...${NC}"
    echo "[$(date)] Session $SESSION starting" >> "$LOG_FILE"

    # Change to working directory for the agent
    cd "$WORKSPACE/$AGENT_WORKDIR" 2>/dev/null || cd "$WORKSPACE"

    # Run goose with the specialist recipe
    goose run \
        --recipe "$WORKSPACE/.goose/recipes/$AGENT_RECIPE" \
        --name "$SESSION_NAME" \
        --max-turns 60 \
        2>&1 | tee -a "$LOG_FILE"

    SESSION_EXIT=$?
    SESSION_END=$(date +%s)
    SESSION_DURATION=$((SESSION_END - SESSION_START))

    echo "[$(date)] Session $SESSION completed in ${SESSION_DURATION}s with exit code $SESSION_EXIT" >> "$LOG_FILE"

    # Return to workspace root
    cd "$WORKSPACE"

    # Auto-commit if git enabled
    if [ -d ".git" ]; then
        echo ""
        echo -e "${CYAN}Creating git commit for session $SESSION...${NC}"

        # Get changed files
        CHANGED_FILES=$(git diff --name-only | wc -l | tr -d ' ')

        if [ "$CHANGED_FILES" -gt 0 ]; then
            # Stage changes
            git add .

            # Create commit
            COMMIT_MSG="feat(${AGENT_NAME}): session $SESSION/$AGENT_SESSIONS updates

Agent: ${AGENT_NAME^} Specialist
Session: $SESSION_NAME
Duration: ${SESSION_DURATION}s
Working Dir: $AGENT_WORKDIR

🤖 Generated with zkSDK Developer Agent
Co-Authored-By: zkSDK ${AGENT_NAME^} Agent <noreply@zksdk.dev>"

            git commit -m "$COMMIT_MSG" || true

            echo -e "${GREEN}✅ Git commit created${NC}"
        else
            echo -e "${YELLOW}No changes to commit${NC}"
        fi
    fi

    echo ""
    echo -e "${GREEN}Session $SESSION complete (${SESSION_DURATION}s)${NC}"
    echo ""

    # Small delay between sessions
    if [ $SESSION -lt $AGENT_SESSIONS ]; then
        echo -e "${YELLOW}Pausing 5 seconds before next session...${NC}"
        sleep 5
    fi
done

# Summary
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ${CYAN}All Sessions Complete for $AGENT_NAME${NC}                             ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}Agent:${NC}        $AGENT_NAME"
echo -e "  ${CYAN}Sessions:${NC}     $AGENT_SESSIONS"
echo -e "  ${CYAN}Workspace:${NC}    $AGENT_WORKSPACE"
echo -e "  ${CYAN}Log File:${NC}     $LOG_FILE"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "  - Review workspace/${AGENT_NAME}/handoff.md"
echo -e "  - Check git log: ${GREEN}git log --grep=\"${AGENT_NAME}\"${NC}"
echo -e "  - View session reports in: ${CYAN}$AGENT_WORKSPACE/sessions/$SESSION_DATE/${NC}"
echo ""
