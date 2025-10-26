#!/bin/bash
# Recipe: zkSDK Developer Agent
# Run zkSDK Developer Agent with GUARANTEED handoff creation
# This script automatically resumes the session to force handoff creation

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 zkSDK Developer Agent - Auto Handoff Edition${NC}"
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

# Create session directory
SESSION_DIR="workspace/sessions/$(date +%Y-%m-%d)"
mkdir -p "$SESSION_DIR"
mkdir -p workspace/hubs

echo -e "${BLUE}Starting Developer Session: $SESSION_NAME${NC}"
echo "Model: $GOOSE_MODEL"
echo "Max Turns: 40 (dev) + 10 (handoff) = 50 total"
echo ""

# PHASE 1: Run developer agent with 40 turn limit (saves 10 for handoff)
echo -e "${GREEN}Phase 1: Running developer agent (40 turns max)...${NC}"
echo ""

goose run \
    --recipe "$RECIPE_PATH" \
    --name "$SESSION_NAME" \
    --max-turns 40 \
    --params "provider_name=$PROVIDER" \
    --params "work_type=$WORK_TYPE" \
    --params "test_coverage_target=$COVERAGE" \
    --params "session_duration=$SESSION"

PHASE1_EXIT=$?

echo ""
echo -e "${BLUE}Phase 1 completed with exit code: $PHASE1_EXIT${NC}"
echo ""

# PHASE 2: Auto-resume and force handoff creation
echo -e "${GREEN}Phase 2: Forcing handoff creation (10 turns max)...${NC}"
echo ""

# Create the handoff instruction
HANDOFF_INSTRUCTION="STOP all coding work immediately.

Your ONLY tasks now:
1. Create workspace/hubs/dev-hand-off.md documenting ALL changes you made
   - List all files modified
   - Test results (X passing, Y failing)
   - Coverage changes (before → after)
   - What's working, what's broken
   - Next actions needed

2. Update workspace/current/sprint.md with today's progress

3. Create workspace/sessions/$(date +%Y-%m-%d)/developer-session-report.md

DO NOT write more code. DO NOT run more tests.
ONLY create the documentation above and call final_output.

DO IT NOW."

# Resume session and force handoff
echo "$HANDOFF_INSTRUCTION" | goose session -r -n "$SESSION_NAME" --max-turns 10

PHASE2_EXIT=$?

echo ""
echo -e "${BLUE}Phase 2 completed with exit code: $PHASE2_EXIT${NC}"
echo ""

# Check if handoff was created
if [ -f "workspace/hubs/dev-hand-off.md" ]; then
    echo -e "${GREEN}✅ Handoff document created successfully!${NC}"
    echo ""
    echo -e "${BLUE}📊 Handoff Summary:${NC}"
    echo "----------------------------"
    head -30 workspace/hubs/dev-hand-off.md
    echo ""
else
    echo -e "${RED}⚠️  Warning: Handoff document not found!${NC}"
    echo "Check: workspace/hubs/dev-hand-off.md"
fi

# Show test results if available
if [ -d "sdk" ]; then
    echo ""
    echo -e "${BLUE}📈 Test Coverage:${NC}"
    cd sdk && npm test -- --coverage --coverageReporters=text-summary 2>/dev/null | grep -A 5 "Coverage summary" || true
    cd ..
fi

echo ""
echo -e "${BLUE}📋 Session Complete${NC}"
echo "Session: $SESSION_NAME"
echo "Handoff: workspace/hubs/dev-hand-off.md"
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
    echo ""
    echo "This script runs in 2 phases:"
    echo "  Phase 1: Developer agent does work (40 turns max)"
    echo "  Phase 2: Auto-resume to force handoff creation (10 turns)"
    echo ""
    echo "GUARANTEED handoff creation - no more manual handoffs!"
    exit 0
fi
