# 🤖 Goose Agent Rules - Framework V2

## MANDATORY RULES FOR ALL GOOSE AGENTS

### 1. FILE OUTPUT LOCATIONS

**ALWAYS use these exact paths:**

```yaml
# Research & Analysis
insights/research/market/[topic]-YYYY-MM-DD.md
insights/research/competitors/[company]-analysis-YYYY-MM-DD.md
insights/research/user-needs/[topic]-YYYY-MM-DD.md

# Daily Reports
insights/daily/YYYY/MM-MonthName/DD/[report-type].md
# Example: insights/daily/2025/10-October/23/session-report.md

# Session Work
workspace/sessions/YYYY-MM-DD/[time]-[agent].md
# Example: workspace/sessions/2025-10-23/afternoon-developer.md

# Strategy Documents
strategy/active/vN-strategy-YYYY-MM-DD-HHMM.md
strategy/decisions/ADR-NNN-[topic].md
strategy/roadmap/[topic]-plan.md

# Current Work State
workspace/current/sprint.md        # UPDATE, don't replace
workspace/current/blockers.md      # APPEND new blockers
workspace/current/decisions.md     # ADD pending decisions

# Agent Memory
workspace/memory/[agent-type]/current_task.md
workspace/memory/[agent-type]/completed_tasks.md
workspace/memory/[agent-type]/knowledge.md
```

### 2. STARTUP SEQUENCE

**EVERY agent MUST read these files on startup:**

```python
# Required reads in order:
1. workspace/current/sprint.md          # What we're building
2. workspace/current/blockers.md        # Current problems
3. workspace/sessions/[TODAY]/continuation.md  # Where to continue
4. strategy/active/current.md           # Current strategy
5. workspace/memory/[YOUR-ROLE]/*       # Your specific memory
```

### 3. SESSION CONTINUITY

**At the END of EVERY session, create:**

```markdown
# workspace/sessions/YYYY-MM-DD/continuation.md

## Work Completed
- [What you finished]

## Current State
- [Where you left off]

## Next Steps
- [Exactly what to do next]

## Commands to Continue
```bash
# Exact commands to resume
```
```

### 4. REPORT GENERATION

**When creating reports:**

```markdown
# insights/daily/YYYY/MM-MonthName/DD/[type]-report.md

# REQUIRED SECTIONS:
## Summary
## Work Completed  
## Decisions Made
## Blockers Encountered
## Next Actions
## Metrics
```

### 5. CODE CHANGES

**When modifying SDK code:**
- Changes go in: `sdk/packages/`
- Tests go in: `sdk/test/` or `sdk/packages/*/test/`
- Examples go in: `sdk/examples/`
- NEVER modify `insights/`, `strategy/`, or `workspace/` when coding

### 6. NAMING CONVENTIONS

**Use these exact patterns:**

| Type | Pattern | Example |
|------|---------|---------|
| Session | `[time]-[agent].md` | `morning-developer.md` |
| Report | `[type]-report-YYYY-MM-DD.md` | `pm-research-report-2025-10-23.md` |
| Research | `[topic]-analysis-YYYY-MM-DD.md` | `railgun-analysis-2025-10-23.md` |
| Strategy | `vN-strategy-YYYY-MM-DD-HHMM.md` | `v2-strategy-2025-10-23-1430.md` |
| Decision | `ADR-NNN-[topic].md` | `ADR-002-defi-support.md` |

### 7. MEMORY MANAGEMENT

**Update your memory after EVERY task:**

```bash
# After completing a task
echo "✅ Implemented Railgun provider" >> workspace/memory/developer/completed_tasks.md

# When learning something new
echo "Railgun uses cross-contract calls for DeFi" >> workspace/memory/developer/knowledge.md

# Update current task
echo "Working on: Bitcoin Silent Payments" > workspace/memory/developer/current_task.md
```

### 8. CROSS-AGENT COMMUNICATION

**Leave messages for other agents:**

```bash
# Tell another agent something
echo "Tester: Please test new Railgun provider" >> workspace/current/messages.md

# Request help
echo "BLOCKER: Need Research agent to analyze Aztec docs" >> workspace/current/blockers.md
```

### 9. PROGRESS TRACKING

**Update sprint progress:**

```markdown
# In workspace/current/sprint.md
- [x] Complete Railgun provider
- [x] Add tests
- [ ] Create documentation  # Currently working on this
```

### 10. ERROR HANDLING

**When encountering errors:**

1. Log to `workspace/current/blockers.md`
2. Create detailed error report in `workspace/sessions/[date]/error-[time].md`
3. Update your memory with the solution when found

## RECIPE-SPECIFIC RULES

### Developer Agent
- Code → `sdk/packages/`
- Tests → `sdk/test/`
- Dev logs → `workspace/sessions/[date]/dev-[time].md`

### PM/Research Agent  
- Research → `insights/research/[category]/`
- Analysis → `insights/daily/[date]/`
- Strategy updates → `strategy/active/`

### Tester Agent
- Test results → `insights/daily/[date]/test-results.md`
- Coverage reports → `insights/daily/[date]/coverage.md`
- Bug reports → `workspace/current/blockers.md`

### Social Agent
- Content → `insights/daily/[date]/social-content.md`
- Analytics → `insights/research/market/social-metrics-[date].md`

## CRITICAL PATHS

**These files are SACRED - read but NEVER delete:**
- `strategy/active/current.md` - The current strategy
- `workspace/current/sprint.md` - Current goals
- `sdk/packages/core/` - Core SDK code

## AUTOMATION HOOKS

**Trigger these scripts when appropriate:**

```bash
# After session work
./automation/scripts/generate-daily-report.sh

# Starting new session
./automation/scripts/start-new-session.sh

# After major milestone
git add . && git commit -m "feat: [description]"
```

## DATE FORMAT RULES

**ALWAYS use these formats:**
- Dates in filenames: `YYYY-MM-DD` (2025-10-23)
- Dates in folders: `YYYY/MM-MonthName/DD` (2025/10-October/23)
- Times: `HHMM` (1430 for 2:30 PM)
- Months: `MM-MonthName` (10-October)

## VERIFICATION CHECKLIST

Before ending your session, verify:
- [ ] Created continuation.md
- [ ] Updated workspace/current/sprint.md
- [ ] Saved work to correct location
- [ ] Updated your memory
- [ ] Committed important changes

---

**REMEMBER: The structure is your friend. Use it correctly and everything stays organized automatically.**
