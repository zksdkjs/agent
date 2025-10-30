#!/bin/bash
# Run zkSDK Developer Agent with Goose Best Practices

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 zkSDK Developer Agent - Goose Best Practices Edition${NC}"
echo "================================================"
echo ""

# Get workspace root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WORKSPACE"

# Parse command line arguments
PROVIDER="${1:-auto}"
WORK_TYPE="${2:-feature}"
COVERAGE="${3:-90}"
SESSION="${4:-full}"

echo -e "${GREEN}Configuration:${NC}"
echo "  Provider: $PROVIDER"
echo "  Work Type: $WORK_TYPE"
echo "  Coverage Target: $COVERAGE%"
echo "  Session Duration: $SESSION"
echo ""

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo -e "${RED}Error: goose is not installed${NC}"
    echo "Please install goose first: https://github.com/block/goose"
    exit 1
fi

# Check if recipe exists
RECIPE_PATH=".goose/recipes/main/recipe-developer.yaml"
if [ ! -f "$RECIPE_PATH" ]; then
    echo -e "${RED}Error: Recipe not found at $RECIPE_PATH${NC}"
    echo "Please ensure you're in the privacy-agent directory"
    exit 1
fi

echo -e "${GREEN}Using recipe: $RECIPE_PATH${NC}"
echo ""

# Create session name with timestamp
SESSION_NAME="developer_$(date +%Y%m%d_%H%M%S)"

# Set environment variables
export GOOSE_MODEL="${GOOSE_MODEL:-qwen/qwen3-coder-plus}"
export GOOSE_PROVIDER="${GOOSE_PROVIDER:-openrouter}"
export GOOSE_TEMPERATURE="${GOOSE_TEMPERATURE:-0.2}"
export GOOSE_MAX_TURNS="${GOOSE_MAX_TURNS:-50}"

# Create session directory
SESSION_DIR="workspace/sessions/$(date +%Y-%m-%d)"
mkdir -p "$SESSION_DIR"
mkdir -p workspace/hubs

if [[ "$GOOSE_PROVIDER" == "anthropic" || "$GOOSE_MODEL" == claude* ]]; then
    if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
        echo -e "${YELLOW}Warning:${NC} ANTHROPIC_API_KEY not set but Anthropic provider selected."
        echo "         Run 'goose configure' or export the key before continuing."
    fi
fi

echo -e "${BLUE}Starting Developer Session: $SESSION_NAME${NC}"
echo "Model: $GOOSE_MODEL"
echo "Max Turns: $GOOSE_MAX_TURNS"
echo ""

# Run goose with the developer recipe and parameters
echo -e "${GREEN}Launching Goose Developer Agent...${NC}"

# Refresh shared context so the agent reads the latest plan
if [ -x "automation/scripts/prepare-context.sh" ]; then
    automation/scripts/prepare-context.sh
fi

goose run \
    --recipe "$RECIPE_PATH" \
    --name "$SESSION_NAME" \
    --params "provider_name=$PROVIDER" \
    --params "work_type=$WORK_TYPE" \
    --params "test_coverage_target=$COVERAGE" \
    --params "session_duration=$SESSION"

# Check exit status
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Development session completed successfully!${NC}"

    # Check for session report
    shopt -s nullglob
    REPORT_FILES=("$SESSION_DIR"/developer-*.md)
    shopt -u nullglob
    if [ ${#REPORT_FILES[@]} -gt 0 ]; then
        LATEST_REPORT="${REPORT_FILES[0]}"
        for candidate in "${REPORT_FILES[@]}"; do
            if [ "$candidate" -nt "$LATEST_REPORT" ]; then
                LATEST_REPORT="$candidate"
            fi
        done
        echo ""
        echo -e "${BLUE}📊 Session Report Summary:${NC}"
        echo "----------------------------"
        head -20 "$LATEST_REPORT"
        echo "..."
        echo ""
        echo -e "Full report: ${YELLOW}$LATEST_REPORT${NC}"
    else
        LATEST_REPORT=""
    fi

    # Check test coverage if available
    if [ -d "sdk" ]; then
        echo ""
        echo -e "${BLUE}📈 Test Coverage:${NC}"
        cd sdk && npm test -- --coverage --coverageReporters=text-summary 2>/dev/null || true
        cd ..
    fi

    # Show next steps
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Review session report: workspace/sessions/$(date +%Y-%m-%d)/"
    echo "2. Update development hand-off: workspace/hubs/dev-hand-off.md"
    echo "3. Review blockers: workspace/current/blockers.md"
    echo "4. Continue with: goose session --resume --name $SESSION_NAME"

    {
        cat <<EOF
# Development Hand-off
Run: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Session: $SESSION_NAME
Provider Target: $PROVIDER
Work Type: $WORK_TYPE
Coverage Target: $COVERAGE%

## Session Log
EOF
        if [ -n "$LATEST_REPORT" ] && [ -f "$LATEST_REPORT" ]; then
            rel_path="${LATEST_REPORT#./}"
            echo "- Report: ${rel_path:-$LATEST_REPORT}"
            echo ""
            head -n 15 "$LATEST_REPORT"
        else
            echo "(no session report found)"
        fi
        echo ""
        echo "## Next Actions"
        echo "- Review sprint priorities: workspace/current/sprint.md"
        echo "- Update continuation if additional work is required."
    } > workspace/hubs/dev-hand-off.md

    echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") developer $SESSION_NAME workspace/sessions/$(date +%Y-%m-%d)" >> workspace/hubs/pipeline-log.md
else
    echo ""
    echo -e "${RED}❌ Development session encountered issues (exit code: $EXIT_CODE)${NC}"
    echo ""
    echo "To debug:"
    echo "1. Check logs: goose session logs --name $SESSION_NAME"
    echo "2. Resume session: goose session --resume --name $SESSION_NAME"
    echo "3. Check blockers: cat workspace/current/blockers.md"
fi

echo ""
echo -e "${BLUE}Session: $SESSION_NAME${NC}"
echo "Timestamp: $(date)"
echo ""

# Usage help
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: $0 [provider] [work_type] [coverage] [session]"
    echo ""
    echo "Parameters:"
    echo "  provider:  auto|railgun|aztec|privacycash|bitcoin (default: auto)"
    echo "  work_type: feature|bugfix|test|refactor|docs (default: feature)"
    echo "  coverage:  Test coverage target percentage (default: 90)"
    echo "  session:   quick|medium|full (default: full)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Auto-select provider, feature work"
    echo "  $0 railgun            # Work on Railgun provider"
    echo "  $0 aztec bugfix 95    # Fix bugs in Aztec with 95% coverage"
    echo "  $0 auto test 100 quick # Quick test writing session"
    exit 0
fi
