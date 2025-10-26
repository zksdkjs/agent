#!/bin/bash
# Recipe: Multi-Agent System
# Aggregate all agent reports into a daily summary

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WORKSPACE"

# Show help if requested
if [ "${1:-}" == "--help" ] || [ "${1:-}" == "-h" ]; then
    echo "Usage: $0 [options]"
    echo ""
    echo "Aggregate all specialist agent reports into a daily summary"
    echo ""
    echo "Options:"
    echo "  --date YYYY-MM-DD  Date to aggregate (default: today)"
    echo "  --output FILE      Output file (default: workspace/hubs/daily-report-{date}.md)"
    echo "  --help, -h         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                # Aggregate today's reports"
    echo "  $0 --date 2025-10-25              # Aggregate specific date"
    echo "  $0 --output custom-report.md      # Custom output file"
    echo ""
    exit 0
fi

# Parse options
REPORT_DATE=$(date +%Y-%m-%d)
OUTPUT_FILE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --date)
            REPORT_DATE="$2"
            shift 2
            ;;
        --output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Set default output file if not specified
if [ -z "$OUTPUT_FILE" ]; then
    OUTPUT_FILE="workspace/hubs/daily-report-${REPORT_DATE}.md"
fi

# Load config
CONFIG_FILE=".goose/config/multi-agent.yaml"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: Config file not found: $CONFIG_FILE${NC}"
    exit 1
fi

# Get list of agents
if command -v yq &> /dev/null; then
    AGENTS=($(yq eval '.agents | keys | .[]' "$CONFIG_FILE"))
else
    # Fallback parsing
    AGENTS=(privacycash railgun aztec bitcoin fhe)
fi

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}  ${CYAN}zkSDK Multi-Agent Daily Report Aggregator${NC}                  ${BLUE}║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Report Date:${NC}    $REPORT_DATE"
echo -e "${CYAN}Output File:${NC}    $OUTPUT_FILE"
echo -e "${CYAN}Agents:${NC}         ${AGENTS[*]}"
echo ""

# Create report header
mkdir -p "$(dirname "$OUTPUT_FILE")"

cat > "$OUTPUT_FILE" << EOF
# zkSDK Multi-Agent Daily Report

**Date:** $REPORT_DATE
**Generated:** $(date '+%Y-%m-%d %H:%M:%S')

---

## 🎯 Executive Summary

This report aggregates the work completed by all specialist agents today.

EOF

# Statistics variables
TOTAL_COMMITS=0
TOTAL_FILES=0
TOTAL_SESSIONS=0

# Process each agent
echo -e "${CYAN}Processing agent reports...${NC}"
echo ""

for agent in "${AGENTS[@]}"; do
    echo -e "  ${CYAN}Processing ${agent}...${NC}"

    AGENT_WORKSPACE="workspace/agents/$agent"

    # Skip if agent workspace doesn't exist
    if [ ! -d "$AGENT_WORKSPACE" ]; then
        echo -e "    ${YELLOW}No workspace found, skipping${NC}"
        continue
    fi

    # Agent section header (capitalize agent name)
    AGENT_NAME_CAP=$(echo "$agent" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
    AGENT_WORKING_DIR=$(yq eval ".agents.${agent}.working_dir" "$CONFIG_FILE" 2>/dev/null || echo "N/A")
    AGENT_DESC=$(yq eval ".agents.${agent}.description" "$CONFIG_FILE" 2>/dev/null || echo "N/A")

    cat >> "$OUTPUT_FILE" << EOF

---

## 🤖 ${AGENT_NAME_CAP} Agent

**Working Directory:** \`${AGENT_WORKING_DIR}\`
**Description:** ${AGENT_DESC}

EOF

    # Find sessions for today
    SESSION_DIR="$AGENT_WORKSPACE/sessions/$REPORT_DATE"
    if [ -d "$SESSION_DIR" ]; then
        SESSION_COUNT=$(find "$SESSION_DIR" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
        TOTAL_SESSIONS=$((TOTAL_SESSIONS + SESSION_COUNT))

        cat >> "$OUTPUT_FILE" << EOF
### 📊 Session Summary

- **Sessions Completed:** $SESSION_COUNT
- **Session Directory:** \`$SESSION_DIR\`

EOF

        # List session files
        if [ "$SESSION_COUNT" -gt 0 ]; then
            cat >> "$OUTPUT_FILE" << EOF
**Session Files:**
EOF
            find "$SESSION_DIR" -name "*.md" 2>/dev/null | sort | while read -r session_file; do
                local session_name=$(basename "$session_file")
                echo "- [\`$session_name\`]($session_file)" >> "$OUTPUT_FILE"
            done
            echo "" >> "$OUTPUT_FILE"
        fi
    else
        cat >> "$OUTPUT_FILE" << EOF
### 📊 Session Summary

- **Sessions Completed:** 0
- **Status:** No activity today

EOF
    fi

    # Git commits by this agent today
    if [ -d ".git" ]; then
        AGENT_COMMITS=$(git log --since="$REPORT_DATE 00:00:00" --until="$REPORT_DATE 23:59:59" \
            --grep="Agent.*${agent}" --oneline 2>/dev/null | wc -l | tr -d ' ')
        TOTAL_COMMITS=$((TOTAL_COMMITS + AGENT_COMMITS))

        cat >> "$OUTPUT_FILE" << EOF
### 📝 Git Activity

- **Commits Today:** $AGENT_COMMITS

EOF

        if [ "$AGENT_COMMITS" -gt 0 ]; then
            cat >> "$OUTPUT_FILE" << EOF
**Recent Commits:**

\`\`\`
$(git log --since="$REPORT_DATE 00:00:00" --until="$REPORT_DATE 23:59:59" \
    --grep="Agent.*${agent}" --oneline --color=never 2>/dev/null | head -5)
\`\`\`

EOF
        fi
    fi

    # Files modified in working directory
    if command -v yq &> /dev/null; then
        WORKING_DIR=$(yq eval ".agents.${agent}.working_dir" "$CONFIG_FILE" 2>/dev/null)
        if [ "$WORKING_DIR" != "null" ] && [ -d "$WORKING_DIR" ]; then
            # Find files modified today
            FILES_MODIFIED=$(find "$WORKING_DIR" -type f -newermt "$REPORT_DATE" ! -newermt "$REPORT_DATE 23:59:59" 2>/dev/null | wc -l | tr -d ' ')
            TOTAL_FILES=$((TOTAL_FILES + FILES_MODIFIED))

            cat >> "$OUTPUT_FILE" << EOF
### 📁 Files Modified

- **Files Changed:** $FILES_MODIFIED files in \`$WORKING_DIR\`

EOF
        fi
    fi

    # Extract key accomplishments from handoff
    if [ -f "$AGENT_WORKSPACE/handoff.md" ]; then
        cat >> "$OUTPUT_FILE" << EOF
### ✅ Current Status

$(grep -A 10 "## ✅ Completed" "$AGENT_WORKSPACE/handoff.md" 2>/dev/null | tail -10 || echo "Status not available")

### 🎯 Next Focus

$(grep -A 5 "## 🎯 Next" "$AGENT_WORKSPACE/handoff.md" 2>/dev/null | head -6 || echo "Next steps not available")

EOF
    fi

    echo -e "    ${GREEN}✓ Processed${NC}"
done

# Add summary statistics
cat >> "$OUTPUT_FILE" << EOF

---

## 📊 Overall Statistics

| Metric | Count |
|--------|-------|
| **Total Agents** | ${#AGENTS[@]} |
| **Total Sessions** | $TOTAL_SESSIONS |
| **Total Commits** | $TOTAL_COMMITS |
| **Files Modified** | $TOTAL_FILES |

---

## 🔗 Quick Links

- [Agent Configuration](.goose/config/multi-agent.yaml)
- [Agent Workspaces](workspace/agents/)
- [Main Handoff](workspace/hubs/dev-hand-off.md)
- [Pipeline Log](workspace/hubs/pipeline-log.md)

---

## 📅 Next Steps

1. Review individual agent handoffs in \`workspace/agents/{agent}/handoff.md\`
2. Check git commits: \`git log --since="$REPORT_DATE" --grep="Agent:"\`
3. Run tests: \`cd sdk && npm test\`
4. Continue development: \`scripts/orchestrate-all.sh\`

---

*Report generated by zkSDK Multi-Agent System*
*For questions or issues, check \`workspace/hubs/pipeline-log.md\`*

EOF

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ${BOLD}Report Generation Complete${NC}                                 ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Summary:${NC}"
echo -e "  Agents Processed:  ${GREEN}${#AGENTS[@]}${NC}"
echo -e "  Total Sessions:    ${GREEN}$TOTAL_SESSIONS${NC}"
echo -e "  Total Commits:     ${GREEN}$TOTAL_COMMITS${NC}"
echo -e "  Files Modified:    ${GREEN}$TOTAL_FILES${NC}"
echo ""
echo -e "${CYAN}Output:${NC} ${GREEN}$OUTPUT_FILE${NC}"
echo ""
echo -e "${YELLOW}View report:${NC}"
echo -e "  cat $OUTPUT_FILE"
echo -e "  # or open in editor"
echo ""
