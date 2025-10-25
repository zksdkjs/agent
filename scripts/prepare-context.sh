#!/bin/bash
# Build a consolidated context packet for Goose agents.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
export PRIVACY_AGENT_ROOT="$ROOT"

python3 <<'PY'
import datetime
import os
from pathlib import Path

root = Path(os.environ["PRIVACY_AGENT_ROOT"])
context_path = root / ".goose" / "data" / "context" / "current-session.md"
context_path.parent.mkdir(parents=True, exist_ok=True)

def read_optional(path: Path) -> str:
    try:
        text = path.read_text().strip()
        return text if text else "(empty)"
    except FileNotFoundError:
        return "(missing)"

def latest_continuation() -> tuple[Path | None, str]:
    candidates = sorted(
        root.glob("workspace/sessions/*/continuation.md"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    if not candidates:
        return None, "(missing)"
    latest = candidates[0]
    return latest, read_optional(latest)

sections: list[str] = []

sections.append("# Current Session Context")
sections.append(f"Generated: {datetime.datetime.now(datetime.timezone.utc).isoformat()}")
sections.append("")

sections.append("## Sprint Goals (`workspace/current/sprint.md`)")
sections.append(read_optional(root / "workspace" / "current" / "sprint.md"))
sections.append("")

sections.append("## Blockers (`workspace/current/blockers.md`)")
sections.append(read_optional(root / "workspace" / "current" / "blockers.md"))
sections.append("")

sections.append("## Pending Decisions (`workspace/current/decisions.md`)")
sections.append(read_optional(root / "workspace" / "current" / "decisions.md"))
sections.append("")

latest_path, latest_text = latest_continuation()
sections.append("## Latest Continuation Guide")
if latest_path:
    rel = latest_path.relative_to(root)
    sections.append(f"Source: `{rel}`")
sections.append(latest_text)
sections.append("")

sections.append("## Current Strategy (`strategy/active/current.md`)")
sections.append(read_optional(root / "strategy" / "active" / "current.md"))
sections.append("")

def hub_section(filename: str, title: str):
    sections.append(f"## {title} (`workspace/hubs/{filename}`)")
    sections.append(read_optional(root / "workspace" / "hubs" / filename))
    sections.append("")

hub_section("research-latest.md", "Research Hand-off")
hub_section("strategy-hand-off.md", "Strategy Hand-off")
hub_section("dev-hand-off.md", "Development Hand-off")
hub_section("docs-hand-off.md", "Docs & Comms Hand-off")

with context_path.open("w", encoding="utf-8") as fh:
    fh.write("\n".join(sections).strip() + "\n")

print(f"[prepare-context] Wrote {context_path.relative_to(root)}")
PY
