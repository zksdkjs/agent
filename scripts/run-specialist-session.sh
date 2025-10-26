#!/bin/bash
# Recipe: Specialist Session Runner with GUARANTEED handoff creation
# Run specialist agents (Railgun, Aztec, Bitcoin, etc.) with proper 2-phase pipeline

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Show help if requested
if [ "${1:-}" == "--help" ] || [ "${1:-}" == "-h" ] || [ $# -eq 0 ]; then
    echo "Usage: $0 <specialist> [session_duration]"
    echo ""
    echo "Specialists:"
    echo "  railgun       - Railgun EVM privacy system specialist"
    echo "  aztec         - Aztec privacy protocol specialist"
    echo "  bitcoin       - Bitcoin privacy (Silent Payments, Taproot) specialist"
    echo "  privacy-cash  - PrivacyCash Solana ZK compression specialist"
    echo "  zama-fhe      - Zama FHE (Fully Homomorphic Encryption) specialist"
    echo ""
    echo "Session Duration:"
    echo "  quick   - 20 turns development + 10 handoff (30 total)"
    echo "  medium  - 40 turns development + 10 handoff (50 total)"
    echo "  full    - 60 turns development + 10 handoff (70 total, default)"
    echo ""
    echo "Examples:"
    echo "  $0 railgun              # Full session on Railgun"
    echo "  $0 aztec medium         # Medium session on Aztec"
    echo "  $0 privacy-cash quick   # Quick session on PrivacyCash"
    echo ""
    echo "Features:"
    echo "  ✓ 2-Phase pipeline (dev + handoff)"
    echo "  ✓ Specialist-specific handoff files (railgun-hand-off.md, etc.)"
    echo "  ✓ Auto-generates session reports"
    echo "  ✓ Updates sprint tracking"
    echo "  ✓ GUARANTEED handoff creation"
    exit 0
fi

echo -e "${MAGENTA}⚡ zkSDK Specialist Session Runner${NC}"
echo "================================================"
echo ""

# Get workspace root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WORKSPACE"

# Parse arguments
SPECIALIST="${1}"
SESSION_DURATION="${2:-full}"

# Map specialist to recipe file
declare -A SPECIALIST_RECIPES=(
    ["railgun"]=".goose/recipes/specialists/recipe-railgun-specialist.yaml"
    ["aztec"]=".goose/recipes/specialists/recipe-aztec-specialist.yaml"
    ["bitcoin"]=".goose/recipes/specialists/recipe-bitcoin-privacy-specialist.yaml"
    ["privacy-cash"]=".goose/recipes/specialists/recipe-privacy-cash-sdk.yaml"
    ["zama-fhe"]=".goose/recipes/specialists/recipe-zama-fhe-specialist.yaml"
)

# Map specialist to display names
declare -A SPECIALIST_NAMES=(
    ["railgun"]="Railgun EVM Privacy"
    ["aztec"]="Aztec Privacy Protocol"
    ["bitcoin"]="Bitcoin Privacy (Silent Payments/Taproot)"
    ["privacy-cash"]="PrivacyCash Solana ZK Compression"
    ["zama-fhe"]="Zama FHE (Fully Homomorphic Encryption)"
)

# Validate specialist
if [ -z "${SPECIALIST_RECIPES[$SPECIALIST]:-}" ]; then
    echo -e "${RED}Error: Unknown specialist '$SPECIALIST'${NC}"
    echo "Valid specialists: ${!SPECIALIST_RECIPES[@]}"
    echo "Run with --help for more information"
    exit 1
fi

RECIPE_PATH="${SPECIALIST_RECIPES[$SPECIALIST]}"
SPECIALIST_NAME="${SPECIALIST_NAMES[$SPECIALIST]}"

# Check if recipe exists
if [ ! -f "$RECIPE_PATH" ]; then
    echo -e "${RED}Error: Recipe not found at $RECIPE_PATH${NC}"
    exit 1
fi

# Map session duration to turn counts
declare -A DURATION_TURNS=(
    ["quick"]="20"
    ["medium"]="40"
    ["full"]="60"
)

DEV_TURNS="${DURATION_TURNS[$SESSION_DURATION]:-60}"
HANDOFF_TURNS=10
TOTAL_TURNS=$((DEV_TURNS + HANDOFF_TURNS))

echo -e "${GREEN}Configuration:${NC}"
echo "  Specialist: $SPECIALIST_NAME"
echo "  Session Duration: $SESSION_DURATION"
echo "  Dev Turns: $DEV_TURNS"
echo "  Handoff Turns: $HANDOFF_TURNS"
echo "  Total Turns: $TOTAL_TURNS"
echo "  Recipe: $RECIPE_PATH"
echo ""

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo -e "${RED}Error: goose is not installed${NC}"
    echo "Please install goose first: https://github.com/block/goose"
    exit 1
fi

# Create session name with timestamp
SESSION_NAME="${SPECIALIST}_specialist_$(date +%Y%m%d_%H%M%S)"
SESSION_TIMESTAMP="$(date +%H%M%S)"
SESSION_DATE="$(date +%Y-%m-%d)"

# Set environment variables
export GOOSE_MODEL="${GOOSE_MODEL:-qwen/qwen3-coder-plus}"
export GOOSE_PROVIDER="${GOOSE_PROVIDER:-openrouter}"
export GOOSE_TEMPERATURE="${GOOSE_TEMPERATURE:-0.2}"

# Create session directory
SESSION_DIR="workspace/sessions/$(date +%Y-%m-%d)"
mkdir -p "$SESSION_DIR"
mkdir -p workspace/hubs

echo -e "${BLUE}Starting Specialist Session: $SESSION_NAME${NC}"
echo "Model: $GOOSE_MODEL"
echo "Max Turns: $DEV_TURNS (dev) + $HANDOFF_TURNS (handoff) = $TOTAL_TURNS total"
echo ""

# PHASE 1: Run specialist agent with development turns
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Phase 1: Running $SPECIALIST_NAME specialist ($DEV_TURNS turns max)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

goose run \
    --recipe "$RECIPE_PATH" \
    --name "$SESSION_NAME" \
    --max-turns "$DEV_TURNS"

PHASE1_EXIT=$?

echo ""
echo -e "${BLUE}Phase 1 completed with exit code: $PHASE1_EXIT${NC}"
echo ""

# PHASE 2: Auto-resume and force handoff creation
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Phase 2: Forcing handoff creation ($HANDOFF_TURNS turns max)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

# Create the handoff instruction
HANDOFF_FILE="workspace/hubs/${SPECIALIST}-hand-off.md"

HANDOFF_INSTRUCTION="STOP all coding work immediately.

Your ONLY tasks now:
1. Create ${HANDOFF_FILE} documenting ALL changes you made
   - List all files modified
   - Test results (X passing, Y failing)
   - Coverage changes (before → after)
   - What's working, what's broken
   - Next actions needed for ${SPECIALIST_NAME}

2. Update workspace/current/sprint.md with today's ${SPECIALIST_NAME} progress
   - Add or update the ${SPECIALIST_NAME} section
   - Include accomplishments and next steps

3. Create workspace/sessions/${SESSION_DATE}/session-${SESSION_TIMESTAMP}.md
   - Summary of ${SPECIALIST_NAME} work completed this session
   - Key accomplishments and blockers
   - Files modified list
   - Test results

IMPORTANT FILE NAMING:
- Specialist handoff: ${HANDOFF_FILE}
- Session report: workspace/sessions/${SESSION_DATE}/session-${SESSION_TIMESTAMP}.md
- Sprint update: workspace/current/sprint.md

DO NOT write more code. DO NOT run more tests.
ONLY create/update the THREE files above.

DO IT NOW."

# Resume session and force handoff
echo "$HANDOFF_INSTRUCTION" | goose session -r -n "$SESSION_NAME" --max-turns "$HANDOFF_TURNS"

PHASE2_EXIT=$?

echo ""
echo -e "${BLUE}Phase 2 completed with exit code: $PHASE2_EXIT${NC}"
echo ""

# Validate expected files were created
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Validating session output...${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"

EXPECTED_SESSION_REPORT="workspace/sessions/${SESSION_DATE}/session-${SESSION_TIMESTAMP}.md"

# Check if handoff was created
if [ -f "$HANDOFF_FILE" ]; then
    echo -e "${GREEN}✅ Specialist handoff created: ${HANDOFF_FILE}${NC}"
else
    echo -e "${RED}⚠️  Warning: Specialist handoff not found!${NC}"
    echo "Expected: $HANDOFF_FILE"
fi

# Check if session report was created
if [ -f "$EXPECTED_SESSION_REPORT" ]; then
    echo -e "${GREEN}✅ Session report created: session-${SESSION_TIMESTAMP}.md${NC}"
else
    echo -e "${RED}⚠️  Warning: Session report not found!${NC}"
    echo "Expected: $EXPECTED_SESSION_REPORT"
fi

# Check if sprint was updated
if [ -f "workspace/current/sprint.md" ]; then
    if grep -q "$SPECIALIST_NAME" workspace/current/sprint.md 2>/dev/null; then
        echo -e "${GREEN}✅ Sprint tracking updated with ${SPECIALIST_NAME} progress${NC}"
    else
        echo -e "${YELLOW}⚠️  Sprint tracking exists but may not have ${SPECIALIST_NAME} section${NC}"
    fi
else
    echo -e "${RED}⚠️  Warning: Sprint tracking file not found!${NC}"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 Session Output Files${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo "Specialist Handoff: $HANDOFF_FILE"
echo "Sprint Tracking:    workspace/current/sprint.md"
echo "Session Report:     $EXPECTED_SESSION_REPORT"
echo ""

if [ -f "$HANDOFF_FILE" ]; then
    echo -e "${BLUE}📝 ${SPECIALIST_NAME} Handoff Preview:${NC}"
    echo -e "${CYAN}───────────────────────────────────────────────────────${NC}"
    head -30 "$HANDOFF_FILE"
    echo ""
fi

# Show test results if available
if [ -d "sdk" ]; then
    echo ""
    echo -e "${BLUE}📈 Test Coverage:${NC}"
    cd sdk && npm test -- --coverage --coverageReporters=text-summary 2>/dev/null | grep -A 5 "Coverage summary" || true
    cd ..
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}⚡ ${SPECIALIST_NAME} Session Complete${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo "Session: $SESSION_NAME"
echo "Handoff: $HANDOFF_FILE"
echo "Timestamp: $(date)"
echo ""
