# Aztec Agent Handoff Document

## 🎯 Current Session: 1 of 4

**Agent:** Aztec Specialist
**Description:** Aztec privacy L2 with Noir smart contracts
**Working Directory:** `sdk/packages/providers/aztec`
**Priority:** MEDIUM

---

## 📋 Next Task

**Session 1/4: Install Aztec.js SDK & Implement PXE Integration**

Aztec uses a Private Execution Environment (PXE) for managing private state:

**Implementation Steps:**

1. **Install Dependencies:**
   ```bash
   cd sdk/packages/providers/aztec
   npm install @aztec/aztec.js @aztec/accounts @aztec/circuits.js
   ```

2. **Create Provider Structure:**
   ```
   src/
   ├── aztec-provider.ts      (main provider)
   ├── pxe.ts                 (PXE client integration)
   ├── accounts.ts            (account management)
   ├── contracts.ts           (contract interactions)
   └── types.ts               (Aztec-specific types)
   ```

3. **Core Features to Implement:**
   - Connect to Aztec sandbox/testnet
   - PXE client initialization
   - Account creation/import
   - Private balance queries
   - Private transactions

4. **Success Criteria:**
   - [ ] Aztec.js SDK installed
   - [ ] PXE client connection working
   - [ ] Basic account operations
   - [ ] Build passes: `cd sdk && npm run build`
   - [ ] Initial tests passing

**Reference:** See main handoff at `workspace/hubs/dev-hand-off.md` and Aztec documentation.

---

## ✅ Completed Tasks

(This will be populated as sessions complete)

---

## 🎯 Upcoming Sessions

**Session 2/4:** Implement Private Transactions
- Private token transfers
- Confidential contract calls
- Transaction proofs

**Session 3/4:** Add Noir Contract Support
- Deploy Noir contracts
- Interact with private functions
- Contract state management

**Session 4/4:** Final Testing & Documentation
- Integration tests with sandbox
- Performance benchmarks
- Complete API documentation

---

**Last Updated:** Auto-generated initial handoff
**Next Update:** After Session 1 completion
