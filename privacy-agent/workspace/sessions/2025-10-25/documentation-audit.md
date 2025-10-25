# Documentation Audit - October 25, 2025

## Critical Issues Found

### ❌ WRONG: Package Names
**Docs Say:** `@zksdkjs/core`, `@zksdkjs/railgun-provider`
**Reality:** `@zksdk/core`, `@zksdk/providers-railgun`, `@zksdk/wallet-connect`

### ❌ WRONG: Automation Scripts
**Docs Say:** `launch-strategic-system.sh`, `goose-continue.sh`, `run-forever.sh`
**Reality:**
- `daily-run-dev.sh` - Development pipeline
- `daily-run-post-dev.sh` - Tests/docs/report pipeline
- `daily-run-strategy.sh` - Strategy pipeline
- `run-developer.sh`, `run-test-writer.sh`, `run-example-writer.sh`, `run-doc-site-writer.sh`
- `run-pm-research.sh`, `run-product-manager.sh`
- `prepare-context.sh` - Context builder
- `generate-daily-report.sh` - Report generator

### ❌ WRONG: Recipe Locations
**Docs Say:** `automation/recipes/*.yaml`
**Reality:** `.goose/recipes/` with subdirectories:
- `main/` - 14 core recipes
- `specialists/` - 5 provider specialists
- `utilities/` - 7 utility recipes
- `subrecipes/` - 5 sub-workflows

### ❌ WRONG: Memory/State Structure
**Docs Say:** `memory/build_progress.json`, `outputs/social/`, `outputs/strategic/`, `outputs/logs/`
**Reality:**
```
workspace/
├── current/           # Sprint goals, blockers, decisions
├── memory/            # Agent persistent state
├── sessions/          # Daily session logs
└── hubs/              # Agent hand-off files
    ├── dev-hand-off.md
    ├── docs-hand-off.md
    ├── strategy-hand-off.md
    ├── research-latest.md
    └── pipeline-log.md

insights/
└── daily/             # Daily reports (YYYY/MM-Month/DD/)
```

### ❌ MISSING: New Features (Oct 2025)
1. **wallet-connect Package** - Not documented anywhere
   - zkWalletConnect class
   - Auto-provider detection
   - Railgun/Aztec adapters

2. **Recipe→Step→ComboMeal Pattern** - SDK has this, docs don't mention
   ```
   sdk/packages/recipes/src/
   ├── recipes/          # High-level workflows
   ├── steps/            # Atomic operations
   └── combo-meals/      # Multi-step sequences
   ```

3. **Pipeline Automation** - Completely missing from docs
   - Context preparation system
   - Hand-off between agents
   - Test-writer integration
   - Post-dev automation

4. **Test Coverage System** - No mention of:
   - 100% core package coverage
   - Coverage targets (90%)
   - Test infrastructure

### ❌ WRONG: Agent Roster
**Docs Say:** 7 agents (CSO, Developer, Tester, Research, Marketing, Social, Release)
**Reality:** Main recipes in `.goose/recipes/main/`:
1. `recipe-developer.yaml` - Code implementation
2. `recipe-tester.yaml` - Test writing
3. `recipe-product-manager.yaml` - Strategy & requirements
4. `recipe-privacy-cash-researcher.yaml` - Market research
5. `recipe-doc-site-writer.yaml` - Marketing docs
6. `recipe-frontend-integration-examples.yaml` - Examples
7. `recipe-strategy-chief.yaml` - High-level planning
8. `recipe-task-coordinator.yaml` - Workflow coordination
9. `recipe-frontend-wallet-guides.yaml` - Wallet integration
10. `recipe-architecture-overview.yaml` - Architecture docs
11. `recipe-strategy-optimizer.yaml` - Strategy refinement
12. `recipe-wallet-connect-system.yaml` - Wallet connect impl

**Plus Specialists:**
- Railgun, Aztec, Bitcoin, Privacy Cash, Zama fhEVM

### ❌ WRONG: SDK Structure
**Docs Don't Mention:**
- `@zksdk/wallet-connect` - NEW Oct 25
- `@zksdk/recipes` - Recipe pattern package
- Core tests (100% coverage)
- Provider package structure updates

## What Needs Fixing

### 1. overview.md
- [ ] Fix all package names (@zksdkjs → @zksdk)
- [ ] Update script references
- [ ] Add wallet-connect package
- [ ] Fix directory structure
- [ ] Update status table with real data
- [ ] Add Recipe pattern explanation

### 2. agents.md
- [ ] Fix recipe paths (.goose/recipes/)
- [ ] Update agent roster with real recipes
- [ ] Remove references to non-existent scripts
- [ ] Add pipeline automation explanation
- [ ] Document hand-off system
- [ ] Add context preparation

### 3. whitepaper.md
- [ ] Fix package names throughout
- [ ] Update architecture section
- [ ] Add wallet-connect to design
- [ ] Document Recipe pattern
- [ ] Fix code examples
- [ ] Add test infrastructure section

### 4. NEW DOCS NEEDED
- [ ] Recipe pattern guide
- [ ] Pipeline automation guide
- [ ] Hand-off system explanation
- [ ] Test infrastructure docs
- [ ] Wallet-connect detailed guide

## Correct Information

### Real SDK Packages
```
sdk/packages/
├── core/              @zksdk/core
├── wallet-connect/    @zksdk/wallet-connect (NEW Oct 25)
├── recipes/           @zksdk/recipes
└── providers/
    ├── railgun/       @zksdk/providers-railgun
    ├── aztec/         @zksdk/providers-aztec
    ├── bitcoin/       @zksdk/providers-bitcoin
    ├── light-protocol/  @zksdk/providers-light-protocol
    └── fhevm/         @zksdk/providers-fhevm
```

### Real Automation Scripts
```
automation/scripts/
├── daily-run-dev.sh            # Dev pipeline
├── daily-run-post-dev.sh       # QA/docs/report
├── daily-run-strategy.sh       # Strategy pipeline
├── run-developer.sh            # Individual dev agent
├── run-test-writer.sh          # Test writer
├── run-example-writer.sh       # Example generator
├── run-doc-site-writer.sh      # Marketing docs
├── run-pm-research.sh          # Market research
├── run-product-manager.sh      # Product strategy
├── prepare-context.sh          # Context builder
└── generate-daily-report.sh    # Report generator
```

### Real Recipe Structure
```
.goose/recipes/
├── main/              # 14 core workflows
├── specialists/       # 5 provider experts
├── utilities/         # 7 helper recipes
└── subrecipes/        # 5 sub-workflows
```

### Real Pipeline Flow
```
prepare-context.sh → Aggregates workspace state
    ↓
daily-run-strategy.sh → PM research + Strategy
    ↓ writes strategy-hand-off.md
daily-run-dev.sh → Developer builds features
    ↓ writes dev-hand-off.md
daily-run-post-dev.sh → Tests + Examples + Docs
    ↓ writes docs-hand-off.md
generate-daily-report.sh → Creates daily summary
    ↓ writes insights/daily/YYYY/MM/DD/
```

### Real Memory Structure
```
workspace/
├── current/
│   ├── sprint.md         # Active goals
│   ├── blockers.md       # Current issues
│   └── decisions.md      # Recent decisions
├── memory/
│   ├── developer/        # Dev agent state
│   └── tester/           # Test agent state
├── sessions/
│   └── YYYY-MM-DD/       # Daily sessions
└── hubs/
    ├── dev-hand-off.md       # Dev → Test
    ├── docs-hand-off.md      # Test → Examples
    ├── strategy-hand-off.md  # Strategy → Dev
    ├── research-latest.md    # Research summary
    └── pipeline-log.md       # Audit trail
```

## Action Plan

1. **Fix overview.md** - Correct structure, packages, examples
2. **Fix agents.md** - Real recipes, pipeline flow, hand-offs
3. **Fix whitepaper.md** - Architecture, wallet-connect, recipes
4. **Create recipe-pattern.md** - Document Recipe→Step→ComboMeal
5. **Create pipeline-guide.md** - Automation workflow
6. **Update all code examples** - Use @zksdk namespace

---
**Audit Date:** 2025-10-25
**Status:** Documentation critically outdated, needs comprehensive rewrite
