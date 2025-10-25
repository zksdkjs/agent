# 📚 Recipe Migration to Goose Best Practices

## Summary
All recipes have been migrated from `automation/recipes/` to `.goose/recipes/` following official Goose best practices.

---

## ✅ What Changed

### Before (Non-Standard)
```
automation/
└── recipes/            # 29 recipes in flat structure
    ├── recipe-developer.yaml
    ├── recipe-tester.yaml
    └── ... (27 more)
```

### After (Goose Best Practice)
```
.goose/
└── recipes/           # 31 recipes organized by purpose
    ├── main/          # 10 primary workflows
    ├── specialists/   # 6 protocol-specific experts
    ├── subrecipes/    # 8 reusable components
    └── utilities/     # 7 helper tools
```

---

## 📁 New Organization

### Main Recipes (Primary Workflows)
Located in `.goose/recipes/main/`:
- `recipe-developer.yaml` - Core development work
- `recipe-tester.yaml` - Testing and QA
- `recipe-strategy-chief.yaml` - Strategic planning
- `recipe-privacy-cash-researcher.yaml` - Market research
- `recipe-architecture-overview.yaml` - System architecture
- `recipe-strategy-optimizer.yaml` - Strategy refinement
- `recipe-task-coordinator.yaml` - Work coordination
- `recipe-frontend-integration-examples.yaml` - Frontend examples
- `recipe-frontend-wallet-guides.yaml` - Wallet integration
- `recipe-wallet-connect-system.yaml` - WalletConnect setup

### Specialist Recipes (Protocol Experts)
Located in `.goose/recipes/specialists/`:
- `recipe-aztec-specialist.yaml` - Aztec protocol expert
- `recipe-bitcoin-privacy-specialist.yaml` - Bitcoin privacy
- `recipe-light-protocol-specialist.yaml` - Privacy Cash
- `recipe-light-protocol-privacy-cash.yaml` - Privacy Cash SDK
- `recipe-railgun-specialist.yaml` - Railgun expert
- `recipe-zama-fhe-specialist.yaml` - Zama FHE expert

### Subrecipes (Reusable Components)
Located in `.goose/recipes/subrecipes/`:
- `code-quality.yaml` - Code quality analysis
- `security-analysis.yaml` - Security scanning
- `recipe-qa-fix-tests.yaml` - Test fixing
- `recipe-qa-full-integration.yaml` - Integration testing
- `recipe-aztec-backend-validator.yaml` - Aztec validation
- `recipe-fhevm-backend-validator.yaml` - FHEVM validation
- `recipe-railgun-backend-validator.yaml` - Railgun validation
- `recipe-research-railgun-deep.yaml` - Deep Railgun research

### Utility Recipes (Helper Tools)
Located in `.goose/recipes/utilities/`:
- `recipe-continue-work.yaml` - Session continuation
- `recipe-session-reporter.yaml` - Report generation
- `recipe-goose-improver.yaml` - Goose optimization
- `recipe-marketing-growth.yaml` - Marketing tasks
- `recipe-social.yaml` - Social media
- `recipe-release-operations.yaml` - Release management
- `recipe-research-intelligence.yaml` - Research tasks

---

## 🚀 How to Use

### Simple Commands (Goose Auto-Discovery)
Since recipes are now in `.goose/recipes/`, Goose automatically finds them:

```bash
# Before (had to specify full path)
goose run --recipe automation/recipes/recipe-developer.yaml

# Now (Goose finds it automatically)
goose run --recipe recipe-developer

# Or with the organized path
goose run --recipe main/recipe-developer
```

### Using Launch Scripts
All scripts have been updated to use the new paths:

```bash
# Run developer work
./automation/scripts/run-developer.sh

# Run PM research
./automation/scripts/run-pm-research.sh

# Run test writer
./automation/scripts/run-test-writer.sh
```

### Direct Recipe Execution
```bash
# Main workflows
goose run --recipe .goose/recipes/main/recipe-developer.yaml

# Specialist recipes
goose run --recipe .goose/recipes/specialists/recipe-railgun-specialist.yaml

# Subrecipes (usually called from other recipes)
goose run --recipe .goose/recipes/subrecipes/code-quality.yaml

# Utilities
goose run --recipe .goose/recipes/utilities/recipe-continue-work.yaml
```

---

## 🎯 Benefits of This Migration

1. **Follows Goose Best Practices** - Aligned with official documentation
2. **Auto-Discovery Works** - Goose automatically finds recipes
3. **Better Organization** - Recipes grouped by purpose
4. **No Duplicates** - Single source of truth
5. **Cleaner Commands** - No need for full paths
6. **Easier Maintenance** - Clear structure for adding new recipes

---

## 📝 Script Updates

The following scripts were updated to use new paths:
- `run-developer.sh` - Uses `.goose/recipes/main/recipe-developer.yaml`
- `run-pm-research.sh` - Uses `.goose/recipes/main/recipe-privacy-cash-researcher.yaml`
- `run-test-writer.sh` - Uses `.goose/recipes/main/recipe-tester.yaml`
- `run-example-writer.sh` - Uses `.goose/recipes/main/recipe-developer.yaml`

---

## ⚠️ Breaking Changes

- `automation/recipes/` directory no longer exists
- Any custom scripts referencing old paths need updating
- Update any documentation referencing old recipe locations

---

## 🔄 Migration Checklist

✅ All 29 original recipes migrated
✅ 2 new subrecipes added (code-quality, security-analysis)
✅ Recipes organized into 4 categories
✅ All launch scripts updated
✅ Old directory removed
✅ Documentation created

---

## 📚 References

- Goose Recipe Documentation: `goose/documentation/docs/recipes.md`
- Storing Recipes: `goose/documentation/docs/storing-recipes.md`
- Best Practices: `.goose/GOOSE_BEST_PRACTICES_IMPLEMENTATION.md`

---

*Migration completed: October 24, 2025*