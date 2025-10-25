#!/bin/bash
# Orchestrate research → product strategy hand-off.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/../.." && pwd)"

PM_RESEARCH_SCRIPT="$SCRIPT_DIR/run-pm-research.sh"
PRODUCT_MANAGER_SCRIPT="$SCRIPT_DIR/run-product-manager.sh"

RESEARCH_DEPTH="${RESEARCH_DEPTH:-comprehensive}"
FOCUS_AREA="${FOCUS_AREA:-all}"
SKIP_PM_RESEARCH=false
SKIP_PRODUCT_MANAGER=false

usage() {
  cat <<'EOF'
Usage: daily-run-strategy.sh [options]

Runs the current sprint workflow in order:
  1. PM market research agent
  2. Senior Product Manager strategy agent

Environment overrides:
  RESEARCH_DEPTH   Research depth for PM strategy (default: comprehensive)
  FOCUS_AREA       Focus area for PM strategy (default: all)

Options:
  --skip-pm-research       Skip the market research step
  --skip-product-manager   Skip the Senior PM strategy step
  -h, --help               Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-pm-research)
      SKIP_PM_RESEARCH=true
      shift
      ;;
    --skip-product-manager)
      SKIP_PRODUCT_MANAGER=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

require_file() {
  local file=$1
  if [[ ! -x "$file" ]]; then
    echo "❌ Required script not found or not executable: $file"
    exit 1
  fi
}

require_command() {
  local cmd=$1
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ Required command '$cmd' is not available."
    exit 1
  fi
}

echo "🚀 zkSDK Sprint Pipeline"
echo "========================"
echo "Workspace: $WORKSPACE"
echo ""

require_command goose
require_file "$PM_RESEARCH_SCRIPT"
require_file "$PRODUCT_MANAGER_SCRIPT"

if [[ -x "$SCRIPT_DIR/prepare-context.sh" ]]; then
  "$SCRIPT_DIR/prepare-context.sh" >/dev/null
fi

if [[ "${GOOSE_PROVIDER:-}" == "anthropic" || "${GOOSE_MODEL:-}" == claude* ]]; then
  if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
    echo "⚠️  ANTHROPIC_API_KEY not set. goose will fall back to stored Anthropic credentials if configured."
    echo "    Run 'goose configure' to add an API key if needed."
    echo ""
  fi
fi

if [[ "$SKIP_PM_RESEARCH" == false ]]; then
  echo "🔬 Step 1/2: Running market research agent..."
  "$PM_RESEARCH_SCRIPT"
  echo ""
else
  echo "⏭  Step 1/2 skipped (PM market research)."
  echo ""
fi

if [[ "$SKIP_PRODUCT_MANAGER" == false ]]; then
  echo "🧭 Step 2/2: Running Senior Product Manager strategy agent..."
  RESEARCH_DEPTH="$RESEARCH_DEPTH" FOCUS_AREA="$FOCUS_AREA" \
    "$PRODUCT_MANAGER_SCRIPT" "$RESEARCH_DEPTH" "$FOCUS_AREA"
  echo ""
else
  echo "⏭  Step 2/2 skipped (Senior Product Manager)."
  echo ""
fi

echo "✅ Sprint pipeline finished."
echo ""
echo "Next steps:"
echo "  • Review market research: insights/research/pm-market-research-$(date +%Y-%m-%d).md (if generated)"
echo "  • Check strategy outputs in strategy/product/"
echo "  • Update sprint notes in workspace/current/sprint.md"

echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") daily-run-strategy ${USER:-agent} completed" >> "$WORKSPACE/workspace/hubs/pipeline-log.md"
