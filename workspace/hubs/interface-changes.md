# Interface Changes Log

**Purpose:** Track changes to shared interfaces that affect multiple agents.

**Last Updated:** Auto-generated initial file

---

## 🔧 Pending Interface Changes

(Changes proposed but not yet implemented)

### Change Format:
```
**Proposed By:** [Agent Name]
**Date:** YYYY-MM-DD
**Affected Agents:** [List of agents]
**Priority:** High/Medium/Low

**Current Interface:**
```typescript
// Current code here
```

**Proposed Change:**
```typescript
// New code here
```

**Reason:** Why this change is needed
**Breaking:** Yes/No
**Migration:** How other agents should adapt
```

---

## ✅ Implemented Changes

(Completed changes for reference)

---

## 📋 Common Interfaces

These interfaces are shared across agents:

### BasePrivacyProvider
- **Location:** `sdk/packages/core/src/types.ts`
- **Used By:** All privacy provider agents
- **Last Modified:** See git log

### WalletAdapter
- **Location:** `sdk/packages/wallet-connect/src/types.ts`
- **Used By:** All agents that need wallet integration
- **Last Modified:** See git log

### ProviderConfig
- **Location:** `sdk/packages/core/src/config.ts`
- **Used By:** All provider agents
- **Last Modified:** See git log

---

## 💡 Guidelines

**Before changing a shared interface:**
1. Post proposed change here
2. Wait for other agents to review (if running in parallel)
3. Update all affected agents
4. Run full test suite: `cd sdk && npm test`

**Breaking changes require:**
- Migration guide for other agents
- Version bump
- Update to all affected agents' handoffs
