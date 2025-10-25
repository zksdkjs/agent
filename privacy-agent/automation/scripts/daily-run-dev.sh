#!/bin/bash
# Run the developer workflow with optional reporting.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEV_SCRIPT="$SCRIPT_DIR/run-developer.sh"
REPORT_SCRIPT="$SCRIPT_DIR/generate-daily-report.sh"
CONTEXT_SCRIPT="$SCRIPT_DIR/prepare-context.sh"

RUN_REPORT=true
DEV_ARGS=()

usage() {
  cat <<'EOF'
Usage: daily-run-dev.sh [options] [-- <developer-args>]

Options:
  --no-report   Skip generating the daily report after the developer run
  -h, --help    Show this help message

Examples:
  daily-run-dev.sh
  daily-run-dev.sh -- -- providerX bugfix 95 quick
  daily-run-dev.sh --no-report
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-report)
      RUN_REPORT=false
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      DEV_ARGS+=("$@")
      break
      ;;
    *)
      DEV_ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ ! -x "$DEV_SCRIPT" ]]; then
  echo "❌ Developer script missing: $DEV_SCRIPT"
  exit 1
fi

if [[ -x "$CONTEXT_SCRIPT" ]]; then
  "$CONTEXT_SCRIPT" >/dev/null
fi

echo "🛠️  Daily Developer Run"
echo "======================="
echo "Workspace: $WORKSPACE"
echo ""

"$DEV_SCRIPT" "${DEV_ARGS[@]}"

if [[ "$RUN_REPORT" == true && -x "$REPORT_SCRIPT" ]]; then
  echo ""
  echo "📝 Generating daily report..."
  "$REPORT_SCRIPT"
fi

echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") daily-run-dev ${USER:-agent} completed" >> "$WORKSPACE/workspace/hubs/pipeline-log.md"

echo ""
echo "Done. Review:"
echo "  • workspace/hubs/dev-hand-off.md"
echo "  • workspace/sessions/$(date +%Y-%m-%d)/"
echo "  • workspace/current/sprint.md"
