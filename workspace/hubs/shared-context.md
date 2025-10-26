# Shared Context

**Purpose:** Important information that ALL agents should be aware of.

**Last Updated:** Auto-generated initial file

---

## 🎯 Current Sprint Goals

**Sprint:** zkSDK Multi-Protocol Integration
**Duration:** October 2025
**Goal:** Complete all 5 privacy providers with high test coverage

**Priority Order:**
1. PrivacyCash (Solana) - HIGH
2. Railgun (EVM) - HIGH
3. Aztec (L2) - MEDIUM
4. Bitcoin (Silent Payments) - MEDIUM
5. FHEVM (Verification) - LOW

---

## 🚧 Known Blockers

(Cross-agent blockers that affect multiple teams)

**None currently** ✅

---

## 📊 Key Metrics

**Overall Project:**
- Test Coverage: 91.66%
- Tests Passing: 215/215
- Build Status: ✅ Passing

**Target Metrics:**
- Coverage: >90%
- Test Pass Rate: 95%+
- Build: Always passing

---

## 🔗 Critical Dependencies

**Shared Packages:**
- `@zksdk/core` - Core types and interfaces
- `@zksdk/wallet-connect` - Wallet adapters
- `@zksdk/testing` - Test utilities

**If you update these packages:**
1. Notify all other agents via `agent-messages.md`
2. Update version numbers
3. Run full test suite
4. Check no regressions

---

## 📝 Coding Standards

**All agents must follow:**

1. **TypeScript Strict Mode:** All code
2. **Test Coverage:** >85% per package
3. **Documentation:** JSDoc for all public APIs
4. **Error Handling:** Comprehensive with meaningful messages
5. **Naming:** Clear, descriptive, consistent

**Git Commit Format:**
```
type(scope): subject

Agent: [Your Agent Name]
Session: session-{agent}-{timestamp}

🤖 Co-Authored-By: zkSDK [Agent] Agent <noreply@zksdk.dev>
```

---

## 🛠️ Development Commands

**All agents use these commands:**

```bash
# Build
cd sdk && npm run build

# Test
cd sdk && npm test

# Test specific package
cd sdk && npm test -- packages/providers/{your-provider}

# Coverage
cd sdk && npm run test:coverage

# Lint
cd sdk && npm run lint
```

---

## 📚 Important Files

**Read these before starting:**
- `workspace/hubs/dev-hand-off.md` - Main development handoff
- `.goose/CLAUDE.md` - Goose memory (what NOT to do)
- `docs/ARCHITECTURE.md` - System architecture
- `docs/INTEGRATION_FLOWS.md` - How providers integrate

**Your agent-specific files:**
- `workspace/agents/{your-agent}/handoff.md` - Your tasks
- `.goose/recipes/specialists/recipe-{your-agent}.yaml` - Your recipe
- `sdk/packages/providers/{your-dir}/` - Your working directory

---

## 💡 Best Practices

**DO:**
- Read your handoff at start of each session
- Write clear commit messages with agent attribution
- Update your handoff after each session
- Post in `agent-messages.md` if you need to communicate
- Run tests before committing
- Keep sessions focused on your assigned protocol

**DON'T:**
- Work on other agents' providers
- Skip reading handoffs
- Commit without testing
- Rewrite completed code (especially FHEVM)
- Waste turns exploring files (file locations are documented)
- Make breaking changes without coordination

---

## 🎯 Success Criteria

**Each agent should achieve:**
- [ ] Provider fully implemented
- [ ] >85% test coverage
- [ ] All tests passing
- [ ] Complete documentation
- [ ] Integration tests
- [ ] Testnet verification (where applicable)

---

**Questions?** Check `workspace/hubs/agent-messages.md` or your agent's handoff.
