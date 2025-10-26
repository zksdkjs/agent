#!/bin/bash
# Launch the Coinbase x402 research agent and collect deliverables.

set -euo pipefail

echo "🔍 Coinbase x402 Research Run"
echo "============================="
echo ""
echo "This workflow will:"
echo "  • Inspect the locally cloned Coinbase x402 repository"
echo "  • Produce internal research + integration planning docs"
echo "  • Publish a public-friendly update inside zk-landing"
echo ""

export GOOSE_MODEL="${GOOSE_MODEL:-qwen/qwen3-coder-plus}"
export GOOSE_PROVIDER="${GOOSE_PROVIDER:-openrouter}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
SESSION_NAME="coinbase_x402_research_$(date +%Y%m%d_%H%M%S)"
TODAY="$(date +%Y-%m-%d)"

RECIPE_PATH=".goose/recipes/utilities/recipe-coinbase-x402-researcher.yaml"
REPORT_PATH="plans/x402/x402-research-report.md"
PLAN_PATH="plans/x402/x402-integration-plan.md"
REFERENCE_PATH="docs/x402/coinbase-x402-reference.md"
DOC_UPDATE_PATH="zk-landing/docs/zksdkjs/updates/${TODAY}-coinbase-x402.mdx"
PIPELINE_LOG="workspace/hubs/pipeline-log.md"

ensure_command() {
  local cmd=$1
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ Required command '$cmd' not found on PATH."
    exit 1
  fi
}

ensure_command goose

if [[ "${GOOSE_PROVIDER:-}" == "anthropic" || "${GOOSE_MODEL:-}" == claude* ]]; then
  if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
    echo "⚠️  ANTHROPIC_API_KEY not set. goose may rely on stored credentials."
    echo ""
  fi
fi

cd "$WORKSPACE"

if [[ -x "scripts/prepare-context.sh" ]]; then
  scripts/prepare-context.sh >/dev/null
fi

mkdir -p "$(dirname "$PIPELINE_LOG")"

echo "🚀 Launching Goose session: $SESSION_NAME"
echo "Recipe: $RECIPE_PATH"
echo "Model:  $GOOSE_MODEL"
echo ""

goose run \
  --recipe "$RECIPE_PATH" \
  --max-turns 32 \
  --name "$SESSION_NAME"

echo ""
echo "📦 Verifying deliverables..."

status=0

for file in "$REPORT_PATH" "$PLAN_PATH" "$REFERENCE_PATH"; do
  if [[ -f "$file" ]]; then
    echo "  ✅ $file"
  else
    echo "  ⚠️  Missing expected file: $file"
    status=1
  fi
done

if [[ -f "$DOC_UPDATE_PATH" ]]; then
  echo "  ✅ $DOC_UPDATE_PATH"
else
  echo "  ⚠️  Missing expected zk-landing update: $DOC_UPDATE_PATH"
  status=1
fi

if [[ -f "$REPORT_PATH" ]]; then
  echo ""
  echo "📋 Executive summary preview:"
  sed -n '1,40p' "$REPORT_PATH"
fi

timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
log_line="$timestamp coinbase-x402-research $SESSION_NAME $REPORT_PATH"
echo "$log_line" >> "$PIPELINE_LOG"

echo ""
echo "🪪 Session metadata:"
echo "  goose session --resume --name $SESSION_NAME"

if [[ $status -ne 0 ]]; then
  echo ""
  echo "⚠️  One or more deliverables are missing. Review the session logs and rerun if required."
  exit $status
fi

echo ""
echo "✅ Coinbase x402 research completed successfully."
