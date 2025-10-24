#!/bin/bash
# Run Senior Product Manager - Privacy Protocol Strategy & Architecture

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🎯 Senior Product Manager - Privacy Protocol Strategy${NC}"
echo "======================================================"
echo ""
echo -e "${BLUE}Expert PM with deep DeFi/ZK/Privacy knowledge${NC}"
echo ""

# Get workspace root
WORKSPACE="/Users/saeeddawod/Desktop/agent/privacy-agent"
cd "$WORKSPACE"

# Parse command line arguments
RESEARCH_DEPTH="${1:-comprehensive}"
FOCUS_AREA="${2:-all}"

echo -e "${GREEN}Configuration:${NC}"
echo "  Research Depth: $RESEARCH_DEPTH (quick/standard/comprehensive)"
echo "  Focus Area: $FOCUS_AREA (all/defi/integration/architecture/market)"
echo ""

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo -e "${RED}Error: goose is not installed${NC}"
    echo "Please install goose first: https://github.com/block/goose"
    exit 1
fi

# Check if recipe exists
RECIPE_PATH=".goose/recipes/main/recipe-product-manager.yaml"
if [ ! -f "$RECIPE_PATH" ]; then
    echo -e "${RED}Error: PM recipe not found at $RECIPE_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}Using recipe: $RECIPE_PATH${NC}"
echo ""

# Create session name with timestamp
SESSION_NAME="product_manager_$(date +%Y%m%d_%H%M%S)"

# Set environment variables for PM work
export GOOSE_MODEL="${GOOSE_MODEL:-claude-3-sonnet-20241022}"
export GOOSE_PROVIDER="${GOOSE_PROVIDER:-anthropic}"
export GOOSE_TEMPERATURE="${GOOSE_TEMPERATURE:-0.3}"
export GOOSE_MAX_TURNS="${GOOSE_MAX_TURNS:-50}"

# Ensure strategy directories exist
mkdir -p strategy/product
mkdir -p workspace/current

echo -e "${PURPLE}📊 PM Research Scope:${NC}"
echo ""
echo "  ${BLUE}Protocol Research:${NC}"
echo "    • Railgun - DeFi composability, gas costs"
echo "    • Aztec - Noir contracts, developer experience"
echo "    • Bitcoin - Silent payments, Lightning privacy"
echo "    • Privacy Cash SDK - Solana ZK compression"
echo "    • FHEVM - Encrypted computation"
echo ""
echo "  ${BLUE}Market Analysis:${NC}"
echo "    • Developer pain points"
echo "    • Competition landscape"
echo "    • Integration patterns"
echo "    • DeFi protocol needs"
echo ""
echo "  ${BLUE}Deliverables:${NC}"
echo "    • User personas"
echo "    • Technical architecture"
echo "    • Product requirements"
echo "    • Go-to-market strategy"
echo ""

echo -e "${YELLOW}Starting Senior PM Session: $SESSION_NAME${NC}"
echo "Model: $GOOSE_MODEL"
echo "Max Turns: $GOOSE_MAX_TURNS"
echo ""

# Run goose with the PM recipe and parameters
echo -e "${GREEN}Launching Senior Product Manager...${NC}"

goose run \
    --recipe "$RECIPE_PATH" \
    --name "$SESSION_NAME" \
    --params "research_depth=$RESEARCH_DEPTH" \
    --params "focus_area=$FOCUS_AREA"

# Check exit status
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ PM research completed successfully!${NC}"
    echo ""

    # Show created files
    echo -e "${BLUE}📁 Strategy Documents Created:${NC}"
    echo "-----------------------------------"

    if [ -d "strategy/product" ]; then
        ls -la strategy/product/*.md 2>/dev/null | tail -10 || echo "  (Checking for documents...)"
    fi

    echo ""
    echo -e "${BLUE}📊 Key Documents to Review:${NC}"
    echo "  1. User Personas: strategy/product/user-personas.md"
    echo "  2. Market Analysis: strategy/product/market-analysis.md"
    echo "  3. Architecture: strategy/product/technical-architecture.md"
    echo "  4. Requirements: strategy/product/product-requirements-v1.md"
    echo "  5. Go-to-Market: strategy/product/go-to-market.md"
    echo ""

    echo -e "${PURPLE}🎯 Next Steps:${NC}"
    echo "  1. Review PM findings in strategy/product/"
    echo "  2. Check product decisions in workspace/current/product-decisions.md"
    echo "  3. Run Strategy Chief to create technical strategy:"
    echo "     ${YELLOW}./automation/scripts/run-strategy-chief.sh${NC}"
    echo "  4. Run Developer to implement based on requirements:"
    echo "     ${YELLOW}./automation/scripts/run-developer.sh${NC}"
    echo ""

    # Check for product decisions
    if [ -f "workspace/current/product-decisions.md" ]; then
        echo -e "${GREEN}📋 Key Decisions Made:${NC}"
        echo "------------------------"
        head -15 workspace/current/product-decisions.md
        echo ""
    fi
else
    echo ""
    echo -e "${RED}❌ PM session encountered issues (exit code: $EXIT_CODE)${NC}"
    echo ""
    echo "To debug:"
    echo "  1. Check logs: goose session logs --name $SESSION_NAME"
    echo "  2. Resume session: goose session --resume --name $SESSION_NAME"
    echo "  3. Check partial outputs in strategy/product/"
fi

echo ""
echo -e "${BLUE}Session: $SESSION_NAME${NC}"
echo "Timestamp: $(date)"
echo ""

# Usage help
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: $0 [research_depth] [focus_area]"
    echo ""
    echo "Parameters:"
    echo "  research_depth: quick|standard|comprehensive (default: comprehensive)"
    echo "  focus_area: all|defi|integration|architecture|market (default: all)"
    echo ""
    echo "Examples:"
    echo "  $0                           # Comprehensive research on all areas"
    echo "  $0 quick defi                # Quick DeFi-focused research"
    echo "  $0 standard integration      # Standard integration research"
    echo "  $0 comprehensive market      # Deep market analysis"
    echo ""
    echo "The PM will:"
    echo "  • Research privacy protocols deeply"
    echo "  • Analyze developer needs"
    echo "  • Create technical product strategy"
    echo "  • Define SDK architecture"
    echo "  • Prioritize features"
    echo "  • Create go-to-market plan"
    exit 0
fi