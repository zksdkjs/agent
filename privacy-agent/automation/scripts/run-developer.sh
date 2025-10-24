#!/bin/bash
# Run zkSDK Developer Agent with Goose Best Practices

set -e

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
WORKSPACE="/Users/saeeddawod/Desktop/agent/privacy-agent"
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
export GOOSE_MODEL="${GOOSE_MODEL:-claude-3-sonnet-20241022}"
export GOOSE_PROVIDER="${GOOSE_PROVIDER:-anthropic}"
export GOOSE_TEMPERATURE="${GOOSE_TEMPERATURE:-0.2}"
export GOOSE_MAX_TURNS="${GOOSE_MAX_TURNS:-50}"

# Create session directory
SESSION_DIR="workspace/sessions/$(date +%Y-%m-%d)"
mkdir -p "$SESSION_DIR"

echo -e "${BLUE}Starting Developer Session: $SESSION_NAME${NC}"
echo "Model: $GOOSE_MODEL"
echo "Max Turns: $GOOSE_MAX_TURNS"
echo ""

# Run goose with the developer recipe and parameters
echo -e "${GREEN}Launching Goose Developer Agent...${NC}"

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
    REPORT_FILE="$SESSION_DIR/developer-*.md"
    if ls $REPORT_FILE 1> /dev/null 2>&1; then
        echo ""
        echo -e "${BLUE}📊 Session Report Summary:${NC}"
        echo "----------------------------"
        head -20 $REPORT_FILE
        echo "..."
        echo ""
        echo -e "Full report: ${YELLOW}$REPORT_FILE${NC}"
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
    echo "2. Check updated sprint: workspace/current/sprint.md"
    echo "3. Review any blockers: workspace/current/blockers.md"
    echo "4. Continue with: goose session --resume --name $SESSION_NAME"
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
    echo "  provider:  auto|railgun|aztec|light-protocol|bitcoin (default: auto)"
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