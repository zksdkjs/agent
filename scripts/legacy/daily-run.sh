#!/usr/bin/env bash
set -euo pipefail

# Daily orchestrator: Developer → Social
# Usage: bash scripts/daily-run.sh

cd "$(dirname "$0")/.."

DATE_TAG="$(date +%Y%m%d)"
DEV_SESSION="zkSDK_developer_${DATE_TAG}"
SOC_SESSION="zkSDK_social_${DATE_TAG}"

mkdir -p outputs/social outputs/reports

echo "[daily-run] Starting developer session: ${DEV_SESSION}"
goose run --recipe recipe-developer.yaml \
  --name "${DEV_SESSION}" \
  --max-turns 30 || true

echo "[daily-run] Developer session finished. Expected summary: outputs/social/dev_summary_${DATE_TAG}.md"

echo "[daily-run] Starting social session: ${SOC_SESSION}"
goose run --recipe recipe-social.yaml \
  --name "${SOC_SESSION}" \
  --max-turns 15 || true

echo "[daily-run] Social session finished. Check outputs/social/twitter_${DATE_TAG}.md"

echo "[daily-run] Done."


