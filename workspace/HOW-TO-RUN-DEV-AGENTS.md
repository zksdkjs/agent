Author: Claude Code

# How to Run Development Agents - Complete Guide

**Problem Solved**: Developer agents now ALWAYS create handoff documents, no more manual handoffs!

## Quick Start

### Option 1: Fresh Development Session (Recommended)
```bash
bash scripts/run-dev-session.sh
```

This runs a full development session with **guaranteed handoff creation**:
- Phase 1: Developer agent works for 40 turns
- Phase 2: Auto-resumes to force handoff creation (10 turns)
- Result: `workspace/hubs/dev-hand-off.md` always created

### Option 2: Resume Failed Session
```bash
bash scripts/resume-dev-session.sh developer_20251026_130827
```

Use this when:
- A previous dev session hit the turn limit without creating handoff
- Session crashed/corrupted but you want the handoff
- You want to force handoff creation for ANY existing session

---

## Detailed Usage

### run-dev-session.sh - Fresh Start with Auto-Handoff

**Full Syntax:**
```bash
bash scripts/run-dev-session.sh [provider] [work_type] [coverage] [session]
```

**Parameters:**
- `provider`: auto|railgun|aztec|light-protocol|bitcoin (default: auto)
- `work_type`: feature|bugfix|test|refactor|docs (default: feature)
- `coverage`: Test coverage target % (default: 90)
- `session`: quick|medium|full (default: full)

**Examples:**
```bash
# Default: Auto-select provider, feature work, 90% coverage
bash scripts/run-dev-session.sh

# Work on specific provider
bash scripts/run-dev-session.sh railgun

# Bug fixes with higher coverage target
bash scripts/run-dev-session.sh aztec bugfix 95

# Quick test writing session
bash scripts/run-dev-session.sh auto test 100 quick
```

**What Happens:**

1. **Phase 1 (40 turns)**: Developer agent works on code
   - Implements features/fixes
   - Writes tests
   - Improves coverage
   - May hit 40 turn limit before finishing

2. **Phase 2 (10 turns)**: Forced handoff creation
   - Session automatically resumes
   - Agent receives STOP instruction
   - Must create handoff documents:
     - `workspace/hubs/dev-hand-off.md`
     - `workspace/current/sprint.md` update
     - `workspace/sessions/YYYY-MM-DD/session-report.md`
   - Cannot continue coding, must document

3. **Result**: Handoff ALWAYS created, even if agent didn't finish work

---

### resume-dev-session.sh - Resume Existing Session

**Syntax:**
```bash
bash scripts/resume-dev-session.sh SESSION_NAME
```

**When to Use:**
- Old session (`developer_20251026_130827`) hit turn limit without handoff
- Session corrupted but you want to try forcing handoff
- Manual intervention needed on specific session

**How to Find Session Names:**
```bash
# List all developer sessions (newest first)
ls -t ~/.local/share/goose/sessions/ | grep "^developer_"

# Or just run script without args to see available sessions
bash scripts/resume-dev-session.sh
```

**Example:**
```bash
# List sessions
bash scripts/resume-dev-session.sh
# Output shows: developer_20251026_130827, developer_20251026_125454, etc.

# Resume specific session
bash scripts/resume-dev-session.sh developer_20251026_130827
```

**What Happens:**
1. Finds the session in `~/.local/share/goose/sessions/`
2. Resumes with 10 turn limit
3. Forces handoff creation (same as run-dev-session.sh Phase 2)
4. Creates all required documentation

---

## Understanding the Handoff System

### Why Handoffs Matter

Handoffs are **critical** for agent pipeline coordination:
- **Developer agent** → Creates code → Writes handoff
- **Doc-site-writer** → Reads handoff → Creates public docs
- **Next dev session** → Reads handoff → Continues work

Without handoffs, agents don't know what previous agents did!

### What's in a Handoff?

`workspace/hubs/dev-hand-off.md` contains:

```markdown
## ✅ Completed Work
- Files modified
- Tests added/passing
- Coverage improvements

## 📊 Current Status
- Test coverage %
- What's working
- Current issues

## 🎯 Next Actions
- What should be done next
- Blockers to address

## 📁 Files Modified
- Complete list of changed files
```

### The Turn Limit Problem (SOLVED!)

**Old Problem:**
1. Developer agent starts with 50 turns
2. Agent writes lots of code and tests
3. Turn 48: "Almost done, just one more test..."
4. Turn 50: **LIMIT REACHED** - Session ends
5. No handoff created 😢
6. Manual handoff creation needed 🤦

**New Solution:**
1. Developer agent gets 40 turns for coding
2. Turn 40: **AUTO-RESUME TRIGGERED**
3. Phase 2 starts with "STOP CODING, CREATE HANDOFF" instruction
4. Agent has 10 turns to document (plenty of time)
5. Handoff always created ✅

---

## Troubleshooting

### "Session not found"
```bash
# Check if session exists
ls -t ~/.local/share/goose/sessions/ | grep SESSION_NAME

# If not found, session may have different name
ls -t ~/.local/share/goose/sessions/ | grep "^developer_"
```

### "Handoff not created even after resume"
```bash
# Session might be corrupted - create handoff manually
# Check what changed:
git status --short
git diff --stat

# Then create handoff from git analysis
# (We already did this for developer_20251026_130827)
```

### "I want to continue where agent left off"
```bash
# After handoff is created, you can still resume for more work
goose session -r -n SESSION_NAME --max-turns 50

# OR just start fresh session (reads previous handoff automatically)
bash scripts/run-dev-session.sh
```

---

## Session Workflow Diagram

```
START
  ↓
run-dev-session.sh
  ↓
Phase 1: Developer Agent (40 turns)
  ├─→ Writes code
  ├─→ Adds tests
  ├─→ Improves coverage
  └─→ May hit turn limit
  ↓
Phase 2: Auto-Resume (10 turns)
  ├─→ STOP instruction sent
  ├─→ Force handoff creation
  └─→ Document all changes
  ↓
Handoff Created ✅
  ├─→ workspace/hubs/dev-hand-off.md
  ├─→ workspace/current/sprint.md
  └─→ workspace/sessions/YYYY-MM-DD/report.md
  ↓
READY FOR:
  ├─→ Next dev session
  ├─→ Doc-site-writer agent
  └─→ Git commit
```

---

## For Other AI Agents Reading This

If you're an AI agent and need to run a developer session:

**Simple Command:**
```bash
bash scripts/run-dev-session.sh
```

**That's it!** The script handles everything:
- ✅ Creates session with timestamp
- ✅ Runs developer agent
- ✅ Auto-resumes for handoff
- ✅ Guarantees handoff creation

**Want to resume a failed session?**
```bash
bash scripts/resume-dev-session.sh SESSION_NAME
```

**Where to find session names:**
```bash
ls -t ~/.local/share/goose/sessions/ | grep "^developer_" | head -5
```

---

## Environment Variables

The scripts respect these environment variables:

```bash
# Model selection
export GOOSE_MODEL="qwen/qwen3-coder-plus"  # Default
# Or: export GOOSE_MODEL="claude-3-5-sonnet-20241022"

# Provider
export GOOSE_PROVIDER="openrouter"  # Default
# Or: export GOOSE_PROVIDER="anthropic"

# Temperature
export GOOSE_TEMPERATURE="0.2"  # Default (deterministic)
```

**API Keys:**
```bash
# OpenRouter (default)
export OPENROUTER_API_KEY="sk-or-..."

# Anthropic (if using claude directly)
export ANTHROPIC_API_KEY="sk-ant-..."
```

---

## Script Locations

```
scripts/
├── run-dev-session.sh          ← NEW: Auto-handoff dev session
├── resume-dev-session.sh       ← NEW: Resume and force handoff
├── run-developer.sh            ← OLD: Original (no auto-handoff)
├── run-doc-site-writer.sh      ← Reads handoff, creates docs
└── run-coinbase-x402-research.sh ← Research agent example
```

**Recommendation**: Use `run-dev-session.sh` for all new development work.

---

## Success Indicators

**You know it worked when:**

1. ✅ Script completes both Phase 1 and Phase 2
2. ✅ File exists: `workspace/hubs/dev-hand-off.md`
3. ✅ Handoff shows recent timestamp (today)
4. ✅ Git shows uncommitted changes from dev work
5. ✅ Tests pass (or at least run)

**Next steps after successful handoff:**

```bash
# Option 1: Run more dev sessions
bash scripts/run-dev-session.sh

# Option 2: Generate public docs
bash scripts/run-doc-site-writer.sh

# Option 3: Commit the changes
git add .
git commit -m "feat: [description]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Questions?

If you're stuck or something isn't working:

1. Check session logs: `goose session logs --name SESSION_NAME`
2. Check if handoff exists: `cat workspace/hubs/dev-hand-off.md`
3. Check git changes: `git status --short` and `git diff --stat`
4. If all else fails, manually create handoff from git analysis

**The handoff is the key** - everything else in the pipeline depends on it!

---

*Last updated: 2025-10-26*
*Created by: Claude Code*
