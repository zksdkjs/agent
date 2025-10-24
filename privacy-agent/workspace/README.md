# Workspace - Active Development

This is the active workspace for zkSDK development.

## Structure

- `current/` - Current sprint, blockers, decisions
- `sessions/` - Daily session logs and continuity
- `memory/` - Agent state and memory

## Quick Commands

Start new session:
```bash
./automation/scripts/start-new-session.sh
```

Generate daily report:
```bash
./automation/scripts/generate-daily-report.sh
```

Continue Goose session:
```bash
goose session --resume --name [SESSION_NAME]
```

## Navigation

- Latest strategy: `strategy/active/current.md`
- Today's insights: `insights/daily/$(date +%Y/%m-%B/%d)/`
- Current sprint: `workspace/current/sprint.md`
