#!/bin/bash
# Publish an update to the zk-landing docs/blog site using Goose.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/../.." && pwd)"

DOC_SITE_ROOT="${DOC_SITE_ROOT:-$WORKSPACE/../zk-landing}"
DOC_SECTION="${DOC_SECTION:-docs/zksdkjs}"
POST_SCOPE="${POST_SCOPE:-weekly}"

usage() {
  cat <<'EOF'
Usage: run-doc-site-writer.sh [options]

Options:
  --site-root <path>   Path to zk-landing repository (default: ../zk-landing)
  --section <path>     Docs subdirectory to update (default: docs/zksdkjs)
  --scope <label>      Update scope (daily/weekly/launch/etc., default: weekly)
  -h, --help           Show this help message

Environment overrides:
  DOC_SITE_ROOT   Override the docs site root
  DOC_SECTION     Override the docs section (e.g., docs/zksdkjs)
  POST_SCOPE      Override the post scope label
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --site-root)
      DOC_SITE_ROOT="$2"
      shift 2
      ;;
    --section)
      DOC_SECTION="$2"
      shift 2
      ;;
    --scope)
      POST_SCOPE="$2"
      shift 2
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

if [[ ! -d "$DOC_SITE_ROOT" ]]; then
  echo "❌ Docs site not found at: $DOC_SITE_ROOT"
  echo "    Clone https://github.com/zksdkjs/zk-landing next to the privacy-agent repo or pass --site-root."
  exit 1
fi

SITE_ABS_PATH="$(cd "$DOC_SITE_ROOT" && pwd)"
DOC_SECTION_PATH="$SITE_ABS_PATH/$DOC_SECTION"

mkdir -p "$SITE_ABS_PATH/${DOC_SECTION}/updates"
mkdir -p "$WORKSPACE/workspace/hubs"

SESSION_NAME="doc_site_$(date +%Y%m%d_%H%M%S)"

echo "📰 zkSDK Doc Site Writer"
echo "========================"
echo "Workspace: $WORKSPACE"
echo "Doc site : $SITE_ABS_PATH"
echo "Section  : $DOC_SECTION"
echo "Scope    : $POST_SCOPE"
echo ""

if [[ -x "$SCRIPT_DIR/prepare-context.sh" ]]; then
  "$SCRIPT_DIR/prepare-context.sh" >/dev/null
fi

if ! command -v goose >/dev/null 2>&1; then
  echo "❌ goose CLI not found. Install it or add it to your PATH."
  exit 1
fi

GOOSE_CMD=(
  goose run
  --recipe ".goose/recipes/main/recipe-doc-site-writer.yaml"
  --name "$SESSION_NAME"
  --params "doc_site_root=$SITE_ABS_PATH"
  --params "doc_section=$DOC_SECTION"
  --params "post_scope=$POST_SCOPE"
)

echo "✏️  Launching doc-site writer session: $SESSION_NAME"
echo ""
"${GOOSE_CMD[@]}"
EXIT_CODE=$?

if [[ $EXIT_CODE -ne 0 ]]; then
  echo ""
  echo "⚠️  Doc site writer exited with status $EXIT_CODE."
  exit $EXIT_CODE
fi

echo ""
echo "✅ Doc site writer completed."
echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") doc-site-writer $SESSION_NAME $DOC_SECTION" >> "$WORKSPACE/workspace/hubs/pipeline-log.md"

echo ""
echo "Next steps:"
echo "  • Review workspace/hubs/docs-hand-off.md for the summary."
echo "  • Preview doc changes under $DOC_SECTION_PATH."
echo "  • Commit and push updates to both privacy-agent and zk-landing as needed."
