#!/bin/bash
# Run zkSDK Test Writer Agent with Pipeline Integration

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 zkSDK Test Writer - Pipeline Integrated${NC}"
echo "=============================================="
echo ""

# Get workspace root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$WORKSPACE"

# Parse command line arguments
TARGET="${1:-auto}"        # auto = detect from dev-hand-off, or specify package
COVERAGE_TARGET="${2:-90}" # Coverage target percentage
SESSION_DURATION="${3:-full}" # quick|medium|full

echo -e "${GREEN}Configuration:${NC}"
echo "  Target: $TARGET"
echo "  Coverage Target: $COVERAGE_TARGET%"
echo "  Session Duration: $SESSION_DURATION"
echo ""

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo -e "${RED}Error: goose is not installed${NC}"
    echo "Please install goose first: https://github.com/block/goose"
    exit 1
fi

# Check if recipe exists
RECIPE_PATH=".goose/recipes/main/recipe-tester.yaml"
if [ ! -f "$RECIPE_PATH" ]; then
    echo -e "${RED}Error: Recipe not found at $RECIPE_PATH${NC}"
    echo "Please ensure you're in the privacy-agent directory"
    exit 1
fi

echo -e "${GREEN}Using recipe: $RECIPE_PATH${NC}"
echo ""

# Create session name with timestamp
SESSION_NAME="tester_$(date +%Y%m%d_%H%M%S)"

# Set environment variables
export GOOSE_MODEL="${GOOSE_MODEL:-qwen/qwen3-coder-plus}"
export GOOSE_PROVIDER="${GOOSE_PROVIDER:-openrouter}"
export GOOSE_TEMPERATURE="${GOOSE_TEMPERATURE:-0.1}"
export GOOSE_MAX_TURNS="${GOOSE_MAX_TURNS:-50}"

# Create session directory
SESSION_DIR="workspace/sessions/$(date +%Y-%m-%d)"
mkdir -p "$SESSION_DIR"
mkdir -p workspace/hubs
mkdir -p workspace/memory/tester

echo -e "${BLUE}Starting Test Writer Session: $SESSION_NAME${NC}"
echo "Model: $GOOSE_MODEL"
echo "Max Turns: $GOOSE_MAX_TURNS"
echo ""

# Refresh shared context so the agent reads the latest dev work
if [ -x "automation/scripts/prepare-context.sh" ]; then
    echo -e "${YELLOW}📦 Preparing context...${NC}"
    automation/scripts/prepare-context.sh
fi

# Read dev hand-off to understand what was just built
DEV_HANDOFF="workspace/hubs/dev-hand-off.md"
if [ -f "$DEV_HANDOFF" ]; then
    echo -e "${YELLOW}📖 Reading development hand-off...${NC}"
    RECENT_WORK=$(cat "$DEV_HANDOFF")
    # Extract target from dev-hand-off if auto
    if [ "$TARGET" == "auto" ]; then
        # Try to detect newly created package
        if echo "$RECENT_WORK" | grep -q "wallet-connect"; then
            TARGET="wallet-connect"
            echo -e "${GREEN}  → Detected target: wallet-connect${NC}"
        elif echo "$RECENT_WORK" | grep -q "Provider Target:"; then
            TARGET=$(echo "$RECENT_WORK" | grep "Provider Target:" | head -1 | awk '{print $3}')
            echo -e "${GREEN}  → Detected target: $TARGET${NC}"
        fi
    fi
else
    RECENT_WORK="No dev hand-off found. Will analyze SDK for test gaps."
    echo -e "${YELLOW}⚠️  No dev hand-off found, analyzing SDK...${NC}"
fi
echo ""

# Check CURRENT test coverage
echo -e "${BLUE}📊 Checking current test coverage...${NC}"
if [ -d "sdk" ]; then
    cd sdk
    BEFORE_COVERAGE=$(npm test -- --coverage --coverageReporters=text-summary 2>&1 || true)
    echo "$BEFORE_COVERAGE"
    cd ..
else
    BEFORE_COVERAGE="SDK directory not found"
fi
echo ""

# Create context document for the tester
cat > workspace/memory/tester/current_task.md <<EOF
# Test Writing Session
Started: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Session: $SESSION_NAME
Target: $TARGET
Coverage Target: $COVERAGE_TARGET%

## Recent Development Work
$RECENT_WORK

## Current Test Coverage (Before)
\`\`\`
$BEFORE_COVERAGE
\`\`\`

## Your Mission
1. Review what was recently developed (see above)
2. Identify test gaps (current vs ${COVERAGE_TARGET}% target)
3. Write comprehensive tests for:
   - New packages/features (especially $TARGET)
   - Existing code with low coverage
   - Edge cases and error handling
   - Integration scenarios
4. Follow existing test patterns (see sdk/packages/providers/railgun/src/__tests__/)
5. Run tests and verify coverage improves
6. Document what you tested

## Test Standards
- Minimum ${COVERAGE_TARGET}% coverage
- Unit tests for all functions
- Integration tests for workflows
- Mock external dependencies
- Test both success and failure cases
- Clear test descriptions

## Deliverables
- Tests in sdk/packages/**/src/__tests__/
- Session summary in workspace/sessions/$(date +%Y-%m-%d)/
- Update this file with results
EOF

echo -e "${GREEN}📝 Context saved to workspace/memory/tester/current_task.md${NC}"
echo ""

# Run Goose with the tester recipe
echo -e "${GREEN}Launching Goose Test Writer Agent...${NC}"
echo ""

goose run \
    --recipe "$RECIPE_PATH" \
    --name "$SESSION_NAME" \
    --params "target=$TARGET" \
    --params "coverage_target=$COVERAGE_TARGET" \
    --params "session_duration=$SESSION_DURATION"

# Check exit status
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Test writing session completed successfully!${NC}"

    # Check for session report
    shopt -s nullglob
    REPORT_FILES=("$SESSION_DIR"/tester-*.md)
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

    # Check AFTER test coverage
    echo ""
    echo -e "${BLUE}📈 Final Test Coverage:${NC}"
    if [ -d "sdk" ]; then
        cd sdk
        AFTER_COVERAGE=$(npm test -- --coverage --coverageReporters=text-summary 2>&1 || true)
        echo "$AFTER_COVERAGE"
        cd ..
    else
        AFTER_COVERAGE="SDK directory not found"
    fi

    # Show next steps
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Review test results: workspace/sessions/$(date +%Y-%m-%d)/"
    echo "2. Check coverage report: sdk/coverage/"
    echo "3. Run example writer: automation/scripts/run-example-writer.sh"
    echo "4. Continue if needed: goose session --resume --name $SESSION_NAME"

    # Update docs hand-off (test results go here per pipeline architecture)
    {
        cat <<EOF
# Test & Documentation Hand-off
Run: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Session: $SESSION_NAME
Agent: Test Writer
Target: $TARGET
Coverage Target: $COVERAGE_TARGET%

## Test Coverage Results

### Before
\`\`\`
$BEFORE_COVERAGE
\`\`\`

### After
\`\`\`
$AFTER_COVERAGE
\`\`\`

## Session Report
EOF
        if [ -n "$LATEST_REPORT" ] && [ -f "$LATEST_REPORT" ]; then
            rel_path="${LATEST_REPORT#./}"
            echo "- Report: ${rel_path:-$LATEST_REPORT}"
            echo ""
            head -n 15 "$LATEST_REPORT" 2>/dev/null || echo "(report preview unavailable)"
        else
            echo "(no session report found)"
        fi
        echo ""
        echo "## Next Actions"
        echo "- Review test coverage improvements"
        echo "- Run example writer for usage examples"
        echo "- Run doc site writer for documentation updates"
        echo ""
        echo "---"
        echo "*Updated by test-writer pipeline*"
    } > workspace/hubs/docs-hand-off.md

    # Append to pipeline log
    echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") test-writer $SESSION_NAME target=$TARGET coverage=$COVERAGE_TARGET" >> workspace/hubs/pipeline-log.md

    echo ""
    echo -e "${GREEN}✅ Hand-off files updated:${NC}"
    echo "  • workspace/hubs/docs-hand-off.md"
    echo "  • workspace/hubs/pipeline-log.md"

else
    echo ""
    echo -e "${RED}❌ Test writing session encountered issues (exit code: $EXIT_CODE)${NC}"
    echo ""
    echo "To debug:"
    echo "1. Check logs: goose session logs --name $SESSION_NAME"
    echo "2. Resume session: goose session --resume --name $SESSION_NAME"
    echo "3. Check memory: cat workspace/memory/tester/current_task.md"
fi

echo ""
echo -e "${BLUE}Session: $SESSION_NAME${NC}"
echo "Timestamp: $(date)"
echo ""

# Usage help
if [ "${1:-}" == "--help" ] || [ "${1:-}" == "-h" ]; then
    echo "Usage: $0 [target] [coverage] [session]"
    echo ""
    echo "Parameters:"
    echo "  target:   auto|wallet-connect|railgun|aztec|<package-name> (default: auto)"
    echo "  coverage: Test coverage target percentage (default: 90)"
    echo "  session:  quick|medium|full (default: full)"
    echo ""
    echo "Examples:"
    echo "  $0                        # Auto-detect from dev hand-off"
    echo "  $0 wallet-connect         # Test wallet-connect package"
    echo "  $0 auto 95                # Auto-detect, target 95% coverage"
    echo "  $0 railgun 100 quick      # Quick test session for railgun"
    exit 0
fi
