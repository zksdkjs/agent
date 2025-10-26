#!/bin/bash
# Run the developer workflow with optional reporting.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/.." && pwd)"
DEV_SCRIPT="$SCRIPT_DIR/run-developer.sh"
REPORT_SCRIPT="$SCRIPT_DIR/generate-daily-report.sh"
CONTEXT_SCRIPT="$SCRIPT_DIR/prepare-context.sh"

RUN_REPORT=true
RUN_POST_DEV=false
DEV_ARGS=()

usage() {
  cat <<'EOF'
Usage: daily-run-dev.sh [options] [-- <developer-args>]

Options:
  --no-report       Skip generating the daily report after the developer run
  --with-post-dev   Run full post-dev pipeline (tests, examples, docs) after dev
  -h, --help        Show this help message

Examples:
  daily-run-dev.sh
  daily-run-dev.sh --with-post-dev              # Run dev + full QA/docs pipeline
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
    --with-post-dev)
      RUN_POST_DEV=true
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

if [ ${#DEV_ARGS[@]} -gt 0 ]; then
  "$DEV_SCRIPT" "${DEV_ARGS[@]}"
else
  "$DEV_SCRIPT"
fi

if [[ "$RUN_REPORT" == true && -x "$REPORT_SCRIPT" ]]; then
  echo ""
  echo "📝 Generating daily report..."
  "$REPORT_SCRIPT"
fi

echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") daily-run-dev ${USER:-agent} completed" >> "$WORKSPACE/workspace/hubs/pipeline-log.md"

# Run post-dev pipeline if requested
if [[ "$RUN_POST_DEV" == true ]]; then
  POST_DEV_SCRIPT="$SCRIPT_DIR/daily-run-post-dev.sh"
  if [[ -x "$POST_DEV_SCRIPT" ]]; then
    echo ""
    echo "🔗 Chaining to post-dev pipeline..."
    echo ""
    # Skip report in post-dev if we already ran it
    if [[ "$RUN_REPORT" == true ]]; then
      "$POST_DEV_SCRIPT" true true true false  # tests, examples, docs, skip-report
    else
      "$POST_DEV_SCRIPT"  # Run with defaults (includes report)
    fi
  else
    echo "⚠️  Post-dev script not found or not executable: $POST_DEV_SCRIPT"
  fi
fi

echo ""
echo "Done. Review:"
echo "  • workspace/hubs/dev-hand-off.md"
echo "  • workspace/sessions/$(date +%Y-%m-%d)/"
echo "  • workspace/current/sprint.md"
if [[ "$RUN_POST_DEV" == true ]]; then
  echo "  • workspace/hubs/docs-hand-off.md (post-dev results)"
  echo "  • insights/daily/$(date +%Y/%m-%B/%d)/ (daily report)"
fi
