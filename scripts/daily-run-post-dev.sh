#!/bin/bash
# Complete Daily Pipeline: Dev → Tests → Examples → Docs → Report
# This runs the full post-development documentation and QA pipeline

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   📦 Complete Post-Development Pipeline${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WORKSPACE"

# Parse arguments
RUN_TESTS="${1:-true}"
RUN_EXAMPLES="${2:-true}"
RUN_DOCS="${3:-true}"
RUN_REPORT="${4:-true}"

# Get target from dev hand-off if available
DEV_HANDOFF="workspace/hubs/dev-hand-off.md"
TARGET="auto"
if [ -f "$DEV_HANDOFF" ]; then
    if grep -q "wallet-connect" "$DEV_HANDOFF"; then
        TARGET="wallet-connect"
    elif grep -q "Provider Target:" "$DEV_HANDOFF"; then
        TARGET=$(grep "Provider Target:" "$DEV_HANDOFF" | head -1 | awk '{print $3}')
    fi
fi

echo -e "${BLUE}Configuration:${NC}"
echo "  Target Package: $TARGET"
echo "  Run Tests: $RUN_TESTS"
echo "  Run Examples: $RUN_EXAMPLES"
echo "  Run Doc Site: $RUN_DOCS"
echo "  Run Report: $RUN_REPORT"
echo ""

PIPELINE_START=$(date +%s)
FAILED_STAGES=()

# ============================================
# STAGE 1: Test Writer
# ============================================
if [ "$RUN_TESTS" == "true" ]; then
    echo -e "${CYAN}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  STAGE 1: Test Writer (Coverage Improvement)     ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""

    if bash "$SCRIPT_DIR/run-test-writer.sh" "$TARGET"; then
        echo -e "${GREEN}✅ Test Writer completed successfully${NC}"
    else
        echo -e "${RED}❌ Test Writer failed or had issues${NC}"
        FAILED_STAGES+=("test-writer")
    fi
    echo ""
fi

# ============================================
# STAGE 2: Example Writer
# ============================================
if [ "$RUN_EXAMPLES" == "true" ]; then
    echo -e "${CYAN}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  STAGE 2: Example Writer (Usage Examples)        ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""

    if bash "$SCRIPT_DIR/run-example-writer.sh"; then
        echo -e "${GREEN}✅ Example Writer completed successfully${NC}"
    else
        echo -e "${RED}❌ Example Writer failed or had issues${NC}"
        FAILED_STAGES+=("example-writer")
    fi
    echo ""
fi

# ============================================
# STAGE 3: Doc Site Writer (Marketing)
# ============================================
if [ "$RUN_DOCS" == "true" ]; then
    echo -e "${CYAN}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  STAGE 3: Doc Site Writer (Marketing Docs)       ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""

    # Check if zk-landing exists
    if [ -d "./zk-landing" ]; then
        export DOC_SITE_ROOT="./zk-landing"
        if bash "$SCRIPT_DIR/run-doc-site-writer.sh" --scope weekly; then
            echo -e "${GREEN}✅ Doc Site Writer completed successfully${NC}"
        else
            echo -e "${RED}❌ Doc Site Writer failed or had issues${NC}"
            FAILED_STAGES+=("doc-site-writer")
        fi
    else
        echo -e "${YELLOW}⚠️  Skipping Doc Site Writer: ./zk-landing not found${NC}"
    fi
    echo ""
fi

# ============================================
# STAGE 4: Daily Report Generation
# ============================================
if [ "$RUN_REPORT" == "true" ]; then
    echo -e "${CYAN}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  STAGE 4: Daily Report (Summary & Insights)      ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""

    if bash "$SCRIPT_DIR/generate-daily-report.sh"; then
        echo -e "${GREEN}✅ Daily Report generated successfully${NC}"
    else
        echo -e "${RED}❌ Daily Report generation failed${NC}"
        FAILED_STAGES+=("daily-report")
    fi
    echo ""
fi

# ============================================
# Final Summary
# ============================================
PIPELINE_END=$(date +%s)
DURATION=$((PIPELINE_END - PIPELINE_START))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   📊 Pipeline Summary${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Duration:${NC} ${MINUTES}m ${SECONDS}s"
echo ""

if [ ${#FAILED_STAGES[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ ALL STAGES COMPLETED SUCCESSFULLY!${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}❌ FAILED STAGES:${NC}"
    for stage in "${FAILED_STAGES[@]}"; do
        echo -e "   • $stage"
    done
    EXIT_CODE=1
fi

echo ""
echo -e "${BLUE}📁 Review Results:${NC}"
echo "  • Test Coverage: sdk/coverage/"
echo "  • Examples: sdk/examples/"
echo "  • Session Logs: workspace/sessions/$(date +%Y-%m-%d)/"
echo "  • Daily Report: insights/daily/$(date +%Y/%m-%B/%d)/"
echo "  • Hand-offs: workspace/hubs/"
echo ""

# Log pipeline completion
echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") complete-pipeline duration=${MINUTES}m${SECONDS}s failed=${#FAILED_STAGES[@]}" >> workspace/hubs/pipeline-log.md

echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

exit $EXIT_CODE
