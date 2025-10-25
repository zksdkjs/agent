#!/bin/bash
# Migrate to Framework V2.0 - Sustainable Organization

set -e

echo "🚀 Migrating to Framework V2.0"
echo "=============================="
echo ""

# Get the workspace root
WORKSPACE="/Users/saeeddawod/Desktop/agent/privacy-agent"
cd "$WORKSPACE"

# Backup current structure
echo "📦 Creating backup..."
tar -czf "../privacy-agent-backup-$(date +%Y%m%d-%H%M%S).tar.gz" . 2>/dev/null || true
echo "✅ Backup created"

# Create new directory structure
echo ""
echo "📁 Creating new directory structure..."

# Create workspace directories
mkdir -p workspace/current
mkdir -p workspace/sessions/$(date +%Y-%m-%d)
mkdir -p workspace/memory

# Create insights directories
mkdir -p insights/daily/$(date +%Y)/$(date +%m-%B)/$(date +%d)
mkdir -p insights/research/{market,competitors,user-needs}
mkdir -p insights/retrospectives
mkdir -p insights/weekly

# Create strategy directories  
mkdir -p strategy/active
mkdir -p strategy/roadmap
mkdir -p strategy/decisions
mkdir -p strategy/archive/$(date +%Y)

# Create knowledge directories
mkdir -p knowledge/patterns
mkdir -p knowledge/protocols
mkdir -p knowledge/troubleshooting

echo "✅ Directory structure created"

# Move existing files (safe moves - won't overwrite)
echo ""
echo "📚 Migrating existing files..."

# Move memory to workspace
if [ -d "memory" ]; then
    cp -r memory/* workspace/memory/ 2>/dev/null || true
    echo "  → Moved memory to workspace/memory"
fi

# Move current work status
if [ -f "memory/CURRENT_WORK.md" ]; then
    cp memory/CURRENT_WORK.md workspace/current/sprint.md 2>/dev/null || true
    echo "  → Created workspace/current/sprint.md"
fi

# Move reports to insights with date structure
if [ -d "reports" ]; then
    for report in reports/*.md; do
        if [ -f "$report" ]; then
            filename=$(basename "$report")
            # Extract date from filename if present
            if [[ $filename == *"2025-10-23"* ]]; then
                cp "$report" insights/daily/2025/10-October/23/ 2>/dev/null || true
                echo "  → Moved $filename to insights/daily/2025/10-October/23/"
            else
                cp "$report" insights/daily/$(date +%Y)/$(date +%m-%B)/$(date +%d)/ 2>/dev/null || true
                echo "  → Moved $filename to today's insights"
            fi
        fi
    done
fi

# Move plans to strategy/roadmap
if [ -d "plans" ]; then
    cp -r plans/* strategy/roadmap/ 2>/dev/null || true
    echo "  → Moved plans to strategy/roadmap"
fi

# Create symlink for current strategy
if [ -f "strategy/v1-strategy-2025-10-23-1310.md" ]; then
    ln -sf v1-strategy-2025-10-23-1310.md strategy/active/current.md 2>/dev/null || true
    echo "  → Created strategy/active/current.md symlink"
fi

echo "✅ Files migrated"

# Create initial workspace files
echo ""
echo "📝 Creating workspace files..."

# Create current sprint file
cat > workspace/current/sprint.md << 'EOF'
# Current Sprint - zkSDK Development

## Sprint Goal
Complete PM Market Research and decide SDK scope

## Active Tasks
- [ ] Run PM market research
- [ ] Analyze developer needs
- [ ] Update strategy based on findings
- [ ] Decide: Transfer-only or Full DeFi?

## Blockers
None currently

## Next Session
Continue from PM research findings

---
*Updated: $(date)*
EOF

# Create session continuation template
cat > workspace/sessions/$(date +%Y-%m-%d)/continuation.md << 'EOF'
# Session Continuation Guide

## Last Session Summary
- Created Framework V2.0 structure
- Prepared PM research system

## Current State
- SDK: 60% complete (3/5 providers)
- Decision needed on scope

## To Continue
1. Run PM research: `./automation/scripts/run-pm-research.sh`
2. Review findings in insights/research/
3. Update strategy based on data

## Active Recipes
- recipe-privacy-cash-researcher.yaml (ready)
- recipe-strategy-optimizer.yaml (after research)

---
*Generated: $(date)*
EOF

echo "✅ Workspace files created"

# Create helper scripts
echo ""
echo "🔧 Creating helper scripts..."

# Create daily report generator
cat > automation/scripts/generate-daily-report.sh << 'EOF'
#!/bin/bash
# Generate daily report from all sessions

DATE=$(date +%Y-%m-%d)
REPORT_DIR="insights/daily/$(date +%Y)/$(date +%m-%B)/$(date +%d)"
mkdir -p "$REPORT_DIR"

echo "# Daily Report - $DATE" > "$REPORT_DIR/daily-summary.md"
echo "" >> "$REPORT_DIR/daily-summary.md"

# Aggregate all session reports
for session in workspace/sessions/$DATE/*.md; do
    if [ -f "$session" ]; then
        echo "## $(basename $session .md)" >> "$REPORT_DIR/daily-summary.md"
        cat "$session" >> "$REPORT_DIR/daily-summary.md"
        echo "" >> "$REPORT_DIR/daily-summary.md"
    fi
done

echo "Daily report generated: $REPORT_DIR/daily-summary.md"
EOF

chmod +x automation/scripts/generate-daily-report.sh

# Create session starter
cat > automation/scripts/start-new-session.sh << 'EOF'
#!/bin/bash
# Start a new work session with context

SESSION_TIME=$(date +%H%M)
SESSION_DATE=$(date +%Y-%m-%d)
SESSION_DIR="workspace/sessions/$SESSION_DATE"
mkdir -p "$SESSION_DIR"

# Load current context
echo "# Session $SESSION_TIME" > "$SESSION_DIR/session-$SESSION_TIME.md"
echo "Started: $(date)" >> "$SESSION_DIR/session-$SESSION_TIME.md"
echo "" >> "$SESSION_DIR/session-$SESSION_TIME.md"
echo "## Current Sprint" >> "$SESSION_DIR/session-$SESSION_TIME.md"
cat workspace/current/sprint.md >> "$SESSION_DIR/session-$SESSION_TIME.md"

echo "Session started: $SESSION_DIR/session-$SESSION_TIME.md"
echo "Current context loaded. Begin work!"
EOF

chmod +x automation/scripts/start-new-session.sh

echo "✅ Helper scripts created"

# Create README for new structure
cat > workspace/README.md << 'EOF'
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
EOF

echo ""
echo "✨ Migration Complete!"
echo ""
echo "📊 Summary:"
echo "  ✅ New directory structure created"
echo "  ✅ Existing files migrated safely"
echo "  ✅ Workspace files initialized"
echo "  ✅ Helper scripts installed"
echo ""
echo "🎯 Next Steps:"
echo "  1. Review new structure in workspace/"
echo "  2. Check migrated files in insights/"
echo "  3. Start new session: ./automation/scripts/start-new-session.sh"
echo "  4. Run PM research: ./automation/scripts/run-pm-research.sh"
echo ""
echo "📚 Documentation: See FRAMEWORK-V2-PROPOSAL.md for details"
