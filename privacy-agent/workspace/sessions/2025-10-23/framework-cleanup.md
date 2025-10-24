# Framework V2 Cleanup - Documentation Locations

## ✅ Fixed: Now Everything Follows Framework V2

### What I Did Wrong
I created Framework V2 but then put docs in the wrong places! Classic "do as I say, not as I do" 😅

### What I Fixed

1. **Moved Framework Proposal**
   - Was: `FRAMEWORK-V2-PROPOSAL.md` (root)
   - Now: `strategy/decisions/ADR-003-framework-v2-migration.md` ✅
   - Why: It's an architecture decision

2. **Cleaned Reports Folder**
   - Was: Duplicate reports in both `reports/` and `insights/daily/`
   - Now: Only in `insights/daily/2025/10-October/23/` ✅
   - Why: Single source of truth

3. **Kept Root Documentation**
   - `HOW-IT-WORKS.md` - Framework guide (OK in root - entry point)
   - `QUICK-REFERENCE.md` - Quick lookup (OK in root - easy access)
   - `README.md` - Project overview (must be in root)
   - Why: These are essential "how to use this repo" docs

## 📍 Correct Locations According to Framework V2

| Document Type | Correct Location | Example |
|--------------|------------------|---------|
| **Entry docs** | Root (`/`) | README.md, HOW-IT-WORKS.md |
| **Daily reports** | `insights/daily/YYYY/MM-Month/DD/` | session-report.md |
| **Research** | `insights/research/[category]/` | market-analysis-2025-10-23.md |
| **Decisions** | `strategy/decisions/` | ADR-003-framework-v2.md |
| **Active work** | `workspace/current/` | sprint.md, blockers.md |
| **Session logs** | `workspace/sessions/YYYY-MM-DD/` | afternoon-developer.md |
| **Strategies** | `strategy/active/` | v2-strategy-2025-10-23.md |
| **Future plans** | `strategy/roadmap/` | bitcoin-integration-plan.md |

## 🎯 Key Learning

The framework says:
- **workspace/** = Current work
- **insights/** = Reports and research (outputs)
- **strategy/** = Plans and decisions
- **Root** = Only essential entry-point documentation

I was putting reports in `reports/` and framework docs scattered everywhere. Now it's clean!

## ✅ Verification

```bash
# Reports folder is empty ✅
ls reports/  # Empty

# Insights has all reports ✅
ls insights/daily/2025/10-October/23/  # Has all 3 reports

# Decisions folder has framework ADR ✅
ls strategy/decisions/  # Has ADR-003-framework-v2-migration.md

# Root has only essential guides ✅
ls *.md  # README, HOW-IT-WORKS, QUICK-REFERENCE, SETUP
```

---
*Lesson: Always follow your own framework!*
