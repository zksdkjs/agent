# 🎯 How Framework V2 Works - Complete Guide

## 📖 For Humans: Understanding the System

### The Big Picture
Think of this as a **self-organizing development workspace** where AI agents and humans collaborate. Each folder has a specific purpose, like rooms in a well-designed office building.

## 🏗️ The Structure Explained

### 1️⃣ **workspace/** - The Active Work Zone
This is where ALL current work happens. Think of it as your desk.

```
workspace/
├── current/           # What we're doing RIGHT NOW
│   ├── sprint.md     # Current goals and tasks
│   ├── blockers.md   # Problems we're facing
│   └── decisions.md  # Decisions that need to be made
├── hubs/             # Shared hand-offs between agents
├── sessions/         # Work sessions by date
│   └── 2025-10-23/   
│       ├── morning.md     # Morning work session
│       ├── afternoon.md   # Afternoon work session
│       └── continuation.md # How to continue tomorrow
└── memory/           # Agent memories and state
    ├── developer/    # What the dev agent remembers
    └── tester/       # What the test agent remembers
```

**When to use:**
- Check `current/sprint.md` to see what we're working on
- Start work by reading `sessions/[today]/continuation.md`
- Update `current/blockers.md` when stuck
- Sync with cross-agent hand-offs in `hubs/*.md`

### 2️⃣ **insights/** - All Reports & Analysis
This is the filing cabinet for ALL outputs and research.

```
insights/
├── daily/            # Daily reports organized by date
│   └── 2025/
│       └── 10-October/
│           └── 23/
│               ├── session-report.md
│               └── pm-market-research.md
├── research/         # Research findings
│   ├── market/       # Market analysis
│   ├── competitors/  # Competitor research
│   └── user-needs/   # User research
└── weekly/           # Weekly summaries
```

**When to use:**
- After completing work → Create report in `daily/[date]/`
- After research → Save findings in `research/[category]/`
- Weekly → Aggregate into `weekly/`

### 3️⃣ **strategy/** - Plans & Decisions
The command center for all strategic documents.

```
strategy/
├── active/
│   └── current.md    # THE current strategy (symlink)
├── roadmap/          # Future plans
│   ├── 2025-Q4.md
│   └── features/
├── decisions/        # Important decisions made
│   └── ADR-001-no-wallet-abstraction.md
└── archive/          # Old strategies
```

**When to use:**
- Major decision → Create `decisions/ADR-XXX-[topic].md`
- Strategy update → New file in `active/`, update symlink
- Planning → Add to `roadmap/`

### 4️⃣ **sdk/** - The Actual Product
The code we're building. Standard TypeScript monorepo.

```
sdk/
├── packages/
│   ├── core/         # Main SDK
│   └── providers/    # Privacy protocol integrations
└── examples/         # Usage examples
```

### 5️⃣ **automation/** - AI Agent System
The brains that run everything.

```
automation/
├── recipes/          # AI agent instructions
│   └── recipe-*.yaml
└── scripts/          # Automation scripts
```

## 🔄 The Daily Workflow

### Morning: Start Work
```bash
# 1. Check current status
cat workspace/current/sprint.md

# 2. Read yesterday's continuation
cat workspace/sessions/$(date -d yesterday +%Y-%m-%d)/continuation.md

# 3. Start new session
./automation/scripts/start-new-session.sh
```

### During Work: Run Agents
```bash
# Refresh shared context bundle
./automation/scripts/prepare-context.sh

# Run research → product strategy pipeline
./automation/scripts/daily-run-strategy.sh
# → Writes insights/research/pm-market-research-*.md
# → Refreshes strategy/product/ and workspace/hubs/research-latest.md & strategy-hand-off.md

# Run developer workflow
./automation/scripts/daily-run-dev.sh
# → Calls run-developer.sh, updates workspace/hubs/dev-hand-off.md
# → Optionally generates daily report

# Publish marketing/blog update (requires ../zk-landing clone)
DOC_SITE_ROOT=../zk-landing ./automation/scripts/run-doc-site-writer.sh --scope weekly
# → Creates docs/zksdkjs/updates/*.mdx in zk-landing and updates docs overview
# → Refreshes workspace/hubs/docs-hand-off.md for downstream review
```

### Evening: Wrap Up
```bash
# Generate daily report
./automation/scripts/generate-daily-report.sh
# → Creates insights/daily/[date]/daily-summary.md

# Update continuation guide
echo "Tomorrow: Continue with X" >> workspace/sessions/$(date +%Y-%m-%d)/continuation.md
```

## 📝 Where Things Go - Quick Reference

| What You Have | Where It Goes | Example |
|--------------|---------------|---------|
| Research findings | `insights/research/` | `insights/research/market/privacy-sdk-analysis.md` |
| Daily work log | `workspace/sessions/[date]/` | `workspace/sessions/2025-10-23/afternoon.md` |
| Test results | `insights/daily/[date]/` | `insights/daily/2025/10-October/23/test-report.md` |
| New strategy | `strategy/active/` | `strategy/active/v2-strategy-2025-10-24.md` |
| Architecture decision | `strategy/decisions/` | `strategy/decisions/ADR-002-defi-support.md` |
| Current blockers | `workspace/current/` | `workspace/current/blockers.md` |
| Agent memory | `workspace/memory/` | `workspace/memory/developer/current_task.md` |
| Code changes | `sdk/packages/` | `sdk/packages/providers/railgun/` |
| Marketing update | `../zk-landing/docs/zksdkjs/updates/` | `../zk-landing/docs/zksdkjs/updates/2025-10-24-weekly-update.mdx` |
| New recipe | `automation/recipes/` | `automation/recipes/recipe-bitcoin-specialist.yaml` |

## 🤖 For AI Agents: Where to Put Everything

### OUTPUT RULES FOR GOOSE AGENTS

When creating files, follow these rules:

1. **Session Work** → `workspace/sessions/YYYY-MM-DD/[session-name].md`
2. **Research Reports** → `insights/research/[category]/[topic]-YYYY-MM-DD.md`
3. **Daily Reports** → `insights/daily/YYYY/MM-Month/DD/[report-name].md`
4. **Strategy Updates** → `strategy/active/v[N]-strategy-YYYY-MM-DD-HHMM.md`
5. **Decisions** → `strategy/decisions/ADR-[NNN]-[topic].md`
6. **Current State** → Update files in `workspace/current/`
7. **Memory/State** → `workspace/memory/[agent-name]/[file].md`

### READING RULES FOR GOOSE AGENTS

When starting work, ALWAYS read in this order:

1. `workspace/current/sprint.md` - Current goals
2. `workspace/current/blockers.md` - Current issues
3. `workspace/sessions/[today]/continuation.md` - Where to continue
4. `strategy/active/current.md` - Current strategy
5. `workspace/memory/[your-role]/` - Your specific memory

## 🚀 Common Commands

```bash
# Start new work session
./automation/scripts/start-new-session.sh

# Generate daily report
./automation/scripts/generate-daily-report.sh

# Publish marketing/blog update (requires ../zk-landing clone)
DOC_SITE_ROOT=../zk-landing ./automation/scripts/run-doc-site-writer.sh --scope weekly

# Run PM market research
./automation/scripts/run-pm-research.sh

# Check current sprint
cat workspace/current/sprint.md

# View today's work
ls workspace/sessions/$(date +%Y-%m-%d)/

# Find reports from specific date
ls insights/daily/2025/10-October/23/
```

## 📊 Why This Structure?

Based on industry best practices:

1. **Scalability**: Can handle 10,000+ files without confusion
2. **Searchability**: Date-based organization = instant finding
3. **Continuity**: Clear handoff between sessions
4. **Separation**: Work (workspace) vs Results (insights) vs Plans (strategy)
5. **Automation**: Scripts handle organization automatically

## 🔍 Finding Things

### Find yesterday's report:
```bash
ls insights/daily/$(date -d yesterday +%Y/%m-%B/%d)/
```

### Find all research on Railgun:
```bash
find insights/research -name "*railgun*"
```

### Find current strategy:
```bash
cat strategy/active/current.md
```

### Find what agent is working on:
```bash
cat workspace/memory/developer/current_task.md
```

## 🎯 The Key Insight

**workspace/** = Present (what we're doing now)
**insights/** = Past (what we've learned)
**strategy/** = Future (where we're going)
**sdk/** = Product (what we're building)
**automation/** = System (how we build)

---

*This structure is designed to scale from 1 developer to 100, from 10 reports to 10,000.*
