# zkSDK Multi-Agent System - Quick Start Guide

**Created:** October 26, 2025
**Status:** ✅ Ready for Testing

---

## 🎯 What Was Built

A complete multi-agent parallel development system that allows multiple specialist agents to work simultaneously on different privacy protocols, all committing to the same git repository with clear attribution.

### ✅ Completed Components

1. **Configuration System**
   - `.goose/config/multi-agent.yaml` - Central configuration for all agents
   - Supports 5 agents: PrivacyCash, Railgun, Aztec, Bitcoin, FHE
   - Multiple API key support to avoid rate limits
   - Professional git commit templates

2. **Execution Scripts**
   - `scripts/run-agent-parallel.sh` - Run a single specialist agent
   - `scripts/orchestrate-all.sh` - Run all agents in parallel (tmux/parallel/sequential modes)
   - `scripts/monitor-agents.sh` - Live dashboard showing all agent progress
   - `scripts/aggregate-reports.sh` - Combine all agent reports into daily summary

3. **Workspace Structure**
   ```
   workspace/agents/
   ├── privacycash/
   │   ├── handoff.md       (PrivacyCash agent tasks)
   │   └── sessions/        (Session reports)
   ├── railgun/
   │   ├── handoff.md       (Railgun agent tasks)
   │   └── sessions/
   ├── aztec/
   │   ├── handoff.md       (Aztec agent tasks)
   │   └── sessions/
   ├── bitcoin/
   │   ├── handoff.md       (Bitcoin agent tasks)
   │   └── sessions/
   └── fhe/
       ├── handoff.md       (FHE agent tasks)
       └── sessions/
   ```

4. **Inter-Agent Communication Hub**
   - `workspace/hubs/agent-messages.md` - Agent-to-agent messages
   - `workspace/hubs/interface-changes.md` - Track interface changes
   - `workspace/hubs/shared-context.md` - Important info for all agents

---

## 🚀 How to Use

### Option 1: Run Single Agent (Recommended for First Test)

Test with PrivacyCash agent (currently on Session 2/4):

```bash
cd /Users/saeeddawod/Desktop/agent
scripts/run-agent-parallel.sh privacycash
```

This will:
- Read the PrivacyCash handoff to know what to work on
- Run 4 focused sessions (as configured)
- Auto-commit after each session with agent attribution
- Update the handoff after completion

**Expected output:**
- Session logs in `workspace/agents/privacycash/sessions/2025-10-26/`
- Git commits with "Agent: PrivacyCash Specialist" attribution
- Updated handoff with completed tasks

### Option 2: Run Multiple Agents Manually

Open multiple terminals and run different agents:

**Terminal 1: PrivacyCash**
```bash
cd /Users/saeeddawod/Desktop/agent
scripts/run-agent-parallel.sh privacycash
```

**Terminal 2: Railgun**
```bash
cd /Users/saeeddawod/Desktop/agent
scripts/run-agent-parallel.sh railgun
```

**Terminal 3: Monitor Progress**
```bash
cd /Users/saeeddawod/Desktop/agent
scripts/monitor-agents.sh
```

### Option 3: Orchestrate All Agents (Advanced)

Run all 5 agents simultaneously:

**Using tmux (Recommended):**
```bash
cd /Users/saeeddawod/Desktop/agent
scripts/orchestrate-all.sh --mode tmux
```

This creates a tmux session with split panes for each agent. Use:
- `Ctrl+B` then `D` to detach
- `tmux attach -t zkSDK_orchestration_*` to reattach
- `tmux kill-session -t zkSDK_orchestration_*` to stop all

**Using parallel processes:**
```bash
cd /Users/saeeddawod/Desktop/agent
scripts/orchestrate-all.sh --mode parallel
```

Agents run as background processes. Monitor with:
```bash
scripts/monitor-agents.sh
```

**Using sequential mode:**
```bash
cd /Users/saeeddawod/Desktop/agent
scripts/orchestrate-all.sh --mode sequential
```

Agents run one after another (useful for debugging).

### Option 4: Run Specific Subset of Agents

```bash
cd /Users/saeeddawod/Desktop/agent
scripts/orchestrate-all.sh --agents privacycash,railgun --mode tmux
```

Only runs PrivacyCash and Railgun agents.

---

## 📊 Monitoring & Reports

### Live Monitoring

Watch all agents in real-time:
```bash
scripts/monitor-agents.sh
```

Show status once and exit:
```bash
scripts/monitor-agents.sh --once
```

### Daily Reports

Generate aggregated report after agents complete:
```bash
scripts/aggregate-reports.sh
```

Output: `workspace/hubs/daily-report-2025-10-26.md`

### Check Git Commits

See all agent commits today:
```bash
git log --since="today" --grep="Agent:" --oneline
```

See commits by specific agent:
```bash
git log --grep="Agent.*PrivacyCash" --oneline
```

---

## 🎯 Agent Session Configurations

From `.goose/config/multi-agent.yaml`:

| Agent | Sessions | Priority | Status |
|-------|----------|----------|--------|
| **PrivacyCash** | 4 | HIGH | Session 2/4 in progress |
| **Railgun** | 5 | HIGH | Ready to start |
| **Aztec** | 4 | MEDIUM | Ready to start |
| **Bitcoin** | 3 | MEDIUM | Ready to start |
| **FHE** | 2 | LOW | Verification only |

**Total:** 18 sessions across all agents

**Estimated Time:**
- Per session: ~45-60 minutes (60 turns)
- Single agent: 3-5 hours
- All agents (parallel): 3-5 hours
- All agents (sequential): 15-20 hours

---

## 🔧 Configuration

### Multiple API Keys (Recommended)

To avoid rate limits when running agents in parallel:

```bash
export OPENROUTER_API_KEY="your-primary-key"
export OPENROUTER_API_KEY_2="your-secondary-key"  # Optional: for Railgun
export OPENROUTER_API_KEY_3="your-tertiary-key"   # Optional: for Aztec
```

If secondary keys not set, all agents use primary key (may hit rate limits).

### Override Session Count

Run agent with different number of sessions:
```bash
scripts/run-agent-parallel.sh privacycash --sessions 2
```

### Dry Run Mode

Preview what would run without executing:
```bash
scripts/run-agent-parallel.sh privacycash --dry-run
scripts/orchestrate-all.sh --dry-run
```

---

## 📋 What Each Agent Will Do

### PrivacyCash (Session 2/4)
- **Current Task:** Implement transaction signing with Solana keypairs
- **Working Dir:** `sdk/packages/providers/privacy`
- **Focus:** Real blockchain transactions, replace mock implementations

### Railgun (Session 1/5)
- **Current Task:** Install Railgun Cookbook SDK & implement Recipe→Step→ComboMeal pattern
- **Working Dir:** `sdk/packages/providers/railgun`
- **Focus:** EVM privacy with food-themed SDK terminology

### Aztec (Session 1/4)
- **Current Task:** Install Aztec.js SDK & implement PXE integration
- **Working Dir:** `sdk/packages/providers/aztec`
- **Focus:** Private Execution Environment, Noir contracts

### Bitcoin (Session 1/3)
- **Current Task:** Install Bitcoin libraries & implement BIP352 Silent Payments
- **Working Dir:** `sdk/packages/providers/bitcoin`
- **Focus:** Reusable payment addresses without linking

### FHE (Session 1/2)
- **Current Task:** Verify FHEVM implementation & add final tests
- **Working Dir:** `sdk/packages/providers/fhevm`
- **Focus:** Verification only - DO NOT rewrite existing code (it's complete!)

---

## 🔗 Inter-Agent Communication

Agents can communicate via shared hub files:

### Post a Message
Edit `workspace/hubs/agent-messages.md`:
```markdown
**From:** Railgun Agent
**To:** All
**Date:** 2025-10-26 15:30
**Priority:** High
**Subject:** Breaking change to BasePrivacyProvider interface

I need to add a new method `estimateGas()` to the BasePrivacyProvider interface.
This will affect all agents.

**Action Required:** Please review and update your implementations.
```

### Propose Interface Change
Edit `workspace/hubs/interface-changes.md` following the template.

### Check Shared Context
All agents should read `workspace/hubs/shared-context.md` for:
- Current sprint goals
- Known blockers
- Key metrics
- Coding standards
- Important files

---

## ✅ Success Criteria

After agents complete, verify:

1. **Build passes:**
   ```bash
   cd sdk && npm run build
   ```

2. **All tests pass:**
   ```bash
   cd sdk && npm test
   ```

3. **Coverage maintained:**
   ```bash
   cd sdk && npm run test:coverage
   # Should show >90% coverage
   ```

4. **Git commits are professional:**
   ```bash
   git log --since="today" --grep="Agent:"
   # Should show clear agent attribution
   ```

5. **Handoffs updated:**
   ```bash
   cat workspace/agents/*/handoff.md
   # Should show completed tasks and next steps
   ```

---

## 🐛 Troubleshooting

### Problem: "Config file not found"
**Solution:** Make sure you're in `/Users/saeeddawod/Desktop/agent` directory

### Problem: Rate limit errors
**Solution:** Set up multiple API keys (see Configuration section)

### Problem: Agent conflicts
**Solution:** Each agent works in isolated directory - conflicts are rare. If they occur:
- Git will show merge conflicts
- Resolve manually or rerun affected agent

### Problem: Tmux not found
**Solution:** Install tmux: `brew install tmux` or use parallel mode:
```bash
scripts/orchestrate-all.sh --mode parallel
```

### Problem: yq not found
**Warning:** Scripts will use fallback parsing. For better results:
```bash
brew install yq
```

---

## 📚 Additional Resources

**Architecture:**
- `.goose/config/multi-agent.yaml` - Full configuration
- `docs/ARCHITECTURE.md` - System architecture
- `docs/INTEGRATION_FLOWS.md` - Provider integration patterns

**Agent Recipes:**
- `.goose/recipes/specialists/recipe-privacy-cash-sdk.yaml`
- `.goose/recipes/specialists/recipe-railgun-specialist.yaml`
- `.goose/recipes/specialists/recipe-aztec-specialist.yaml`
- `.goose/recipes/specialists/recipe-bitcoin-privacy-specialist.yaml`
- `.goose/recipes/specialists/recipe-zama-fhe-specialist.yaml`

**Handoffs:**
- `workspace/hubs/dev-hand-off.md` - Main development handoff
- `workspace/agents/{agent}/handoff.md` - Per-agent handoffs

---

## 🎉 Next Steps

1. **Test Single Agent:**
   ```bash
   scripts/run-agent-parallel.sh privacycash
   ```

2. **Monitor Progress:**
   ```bash
   # In another terminal
   scripts/monitor-agents.sh
   ```

3. **Check Results:**
   ```bash
   # After completion
   cat workspace/agents/privacycash/handoff.md
   git log --grep="PrivacyCash" --oneline
   cd sdk && npm test
   ```

4. **Scale Up:**
   Once single agent works well, try running multiple agents:
   ```bash
   scripts/orchestrate-all.sh --agents privacycash,railgun --mode tmux
   ```

5. **Full Orchestration:**
   When confident, run all agents:
   ```bash
   scripts/orchestrate-all.sh --mode tmux
   ```

---

## 🤝 Benefits

✅ **5x Faster Development** - All protocols progress simultaneously
✅ **Single Repo** - Easy to manage, track, and review
✅ **Clear Attribution** - Git log shows which agent did what
✅ **Professional Commits** - Proper commit messages with agent tags
✅ **Scalable** - Easy to add new agents (DeFi, Uniswap, etc.)
✅ **Isolated Workspaces** - Agents don't interfere with each other
✅ **Smart Communication** - Agents can coordinate when needed

---

**Ready to start?** Run your first agent:
```bash
cd /Users/saeeddawod/Desktop/agent
scripts/run-agent-parallel.sh privacycash
```

**Questions?** Check the handoffs or agent-messages hub.
