#!/bin/bash
# Recipe: zkSDK Developer Agent
# Resume a failed/incomplete developer session and force handoff creation

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Resume Developer Session - Force Handoff${NC}"
echo "=============================================="
echo ""

# Get workspace root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WORKSPACE"

# Check if session name provided
if [ -z "${1:-}" ]; then
    echo -e "${RED}Error: No session name provided${NC}"
    echo ""
    echo "Usage: $0 SESSION_NAME"
    echo ""
    echo "Example:"
    echo "  $0 developer_20251026_130827"
    echo ""
    echo -e "${YELLOW}Available sessions in ~/.local/share/goose/sessions/${NC}"
    echo ""
    # List recent developer sessions
    if [ -d ~/.local/share/goose/sessions ]; then
        echo "Recent developer sessions:"
        ls -t ~/.local/share/goose/sessions/ | grep "^developer_" | head -10
    fi
    echo ""
    exit 1
fi

SESSION_NAME="$1"

echo -e "${GREEN}Session to resume: $SESSION_NAME${NC}"
echo ""

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo -e "${RED}Error: goose is not installed${NC}"
    echo "Please install goose first: https://github.com/block/goose"
    exit 1
fi

# Check if session exists
SESSION_PATH="$HOME/.local/share/goose/sessions/$SESSION_NAME"
if [ ! -d "$SESSION_PATH" ]; then
    echo -e "${RED}Error: Session not found at $SESSION_PATH${NC}"
    echo ""
    echo "Available sessions:"
    ls -t ~/.local/share/goose/sessions/ | grep "^developer_" | head -10
    exit 1
fi

echo -e "${GREEN}Found session: $SESSION_PATH${NC}"
echo ""

# Create session directory for reports
SESSION_DATE=$(echo "$SESSION_NAME" | grep -oE "[0-9]{8}" | sed 's/\([0-9]\{4\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)/\1-\2-\3/')
SESSION_DIR="workspace/sessions/$SESSION_DATE"
mkdir -p "$SESSION_DIR"
mkdir -p workspace/hubs

echo -e "${BLUE}Resuming session and forcing handoff creation...${NC}"
echo ""

# Create the handoff instruction
HANDOFF_INSTRUCTION="STOP all coding work immediately.

Your ONLY tasks now:
1. Create workspace/hubs/dev-hand-off.md documenting ALL changes you made
   - List all files modified (use git status and git diff --stat)
   - Test results (run npm test to get current results)
   - Coverage changes (before → after)
   - What's working, what's broken
   - Next actions needed

2. Update workspace/current/sprint.md with today's progress

3. Create workspace/sessions/$SESSION_DATE/session-report.md with summary

DO NOT write more code. DO NOT run more tests (except to check coverage).
ONLY create the documentation above and call final_output.

DO IT NOW."

# Resume session and force handoff
echo "$HANDOFF_INSTRUCTION" | goose session -r -n "$SESSION_NAME" --max-turns 10

RESUME_EXIT=$?

echo ""
echo -e "${BLUE}Resume completed with exit code: $RESUME_EXIT${NC}"
echo ""

# Check if handoff was created
if [ -f "workspace/hubs/dev-hand-off.md" ]; then
    echo -e "${GREEN}✅ Handoff document created successfully!${NC}"
    echo ""
    echo -e "${BLUE}📊 Handoff Summary:${NC}"
    echo "----------------------------"
    head -40 workspace/hubs/dev-hand-off.md
    echo ""
    echo -e "Full handoff: ${YELLOW}workspace/hubs/dev-hand-off.md${NC}"
else
    echo -e "${RED}⚠️  Warning: Handoff document not found!${NC}"
    echo "The session may have failed to create the handoff."
    echo "Check: workspace/hubs/dev-hand-off.md"
    echo ""
    echo -e "${YELLOW}You may need to create the handoff manually from git changes:${NC}"
    echo "  git status --short"
    echo "  git diff --stat"
fi

# Show test results if available
if [ -d "sdk" ]; then
    echo ""
    echo -e "${BLUE}📈 Test Coverage:${NC}"
    cd sdk && npm test -- --coverage --coverageReporters=text-summary 2>/dev/null | grep -A 5 "Coverage summary" || true
    cd ..
fi

echo ""
echo -e "${BLUE}📋 Resume Complete${NC}"
echo "Session: $SESSION_NAME"
echo "Handoff: workspace/hubs/dev-hand-off.md"
echo "Timestamp: $(date)"
echo ""
