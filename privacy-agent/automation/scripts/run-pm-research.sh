#!/bin/bash
# Run PM Market Research for Privacy SDK

set -euo pipefail

echo "🔬 Starting PM Market Research for Privacy SDK"
echo "================================================"
echo ""
echo "This will:"
echo "1. Research real developer usage of Privacy Cash SDK (Solana)"
echo "2. Analyze Railgun DeFi integrations"
echo "3. Study Aztec production applications"
echo "4. Create comprehensive market research report"
echo "5. Update strategy based on findings"
echo ""
echo "Starting research agent with web search capabilities..."
echo ""

# Set up environment
export GOOSE_MODEL="${GOOSE_MODEL:-qwen/qwen3-coder-plus}"
export GOOSE_PROVIDER="${GOOSE_PROVIDER:-openrouter}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export WORKSPACE="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Create session name with timestamp
SESSION_NAME="pm_research_$(date +%Y%m%d_%H%M%S)"

# Run the PM research recipe with web search
if ! command -v goose >/dev/null 2>&1; then
  echo "❌ goose CLI not found. Install it or add it to your PATH."
  exit 1
fi

if [[ "${GOOSE_PROVIDER:-}" == "anthropic" || "${GOOSE_MODEL:-}" == claude* ]]; then
  if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
    echo "⚠️  ANTHROPIC_API_KEY not set. goose may fail without configured Anthropic credentials."
    echo "    Run 'goose configure' or export the key before retrying."
  fi
fi

echo "🚀 Launching PM Research Agent: $SESSION_NAME"
echo "Model: $GOOSE_MODEL"
echo ""

cd "$WORKSPACE"

# Refresh shared context before launching the agent
if [ -x "automation/scripts/prepare-context.sh" ]; then
  automation/scripts/prepare-context.sh
fi

mkdir -p workspace/hubs

# Run with increased turns for thorough research
goose run \
  --recipe .goose/recipes/main/recipe-privacy-cash-researcher.yaml \
  --max-turns 30 \
  --name "$SESSION_NAME" \
  --profile privacy-research

# Check if report was created
REPORT_DATE=$(date +%Y-%m-%d)
RESEARCH_DIR="$WORKSPACE/insights/research"
mkdir -p "$RESEARCH_DIR"
REPORT_PATH="$RESEARCH_DIR/pm-market-research-$REPORT_DATE.md"

if [ -f "$REPORT_PATH" ]; then
    echo ""
    echo "✅ Research Complete!"
    echo "📊 Report available at: $REPORT_PATH"
    echo ""
    echo "📋 Quick summary:"
    head -20 "$REPORT_PATH"
    echo ""
    echo "To view full report: cat $REPORT_PATH"
    echo "To continue development: review workspace/hubs/research-latest.md and workspace/sessions/$(date +%Y-%m-%d)/"

    {
      echo "# Research Hand-off"
      echo "Run: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
      echo "Session: $SESSION_NAME"
      echo "Recipe: .goose/recipes/main/recipe-privacy-cash-researcher.yaml"
      echo "Report: insights/research/pm-market-research-$REPORT_DATE.md"
      echo ""
      echo "## Preview"
      head -20 "$REPORT_PATH"
    } > workspace/hubs/research-latest.md

    echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") pm-research $SESSION_NAME insights/research/pm-market-research-$REPORT_DATE.md" >> workspace/hubs/pipeline-log.md
else
    echo ""
    echo "⚠️  Report not found. Check session logs:"
    echo "goose session --resume --name $SESSION_NAME"
fi

echo ""
echo "💡 Next steps:"
echo "1. Review the market research report"
echo "2. Check updated strategy in strategy/ folder"
echo "3. Run appropriate recipe based on findings"
echo "4. Use session continuation guide to resume work"
