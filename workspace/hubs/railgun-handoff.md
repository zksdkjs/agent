# Railgun Provider - Agent Handoff Checklist

Use this checklist to complete the Railgun provider production-ready iteration. Update status boxes as you complete tasks and add notes so the next agent can pick up without context loss.

## How to use
- Check off completed items with `x` (e.g., `[x]`)
- Add concise notes after each task under **Notes** (include file paths, line numbers, blockers, decisions)
- If you start a task but can't finish, add a summary under **Notes** and leave checkbox unchecked
- Work through phases in order (Critical → Implementation → Testing → Docs → Cleanup)

---

## 📍 Project Context

**Package**: `@zksdk/railgun-provider` - EVM privacy using zero-knowledge proofs
**Location**: `/Users/saeeddawod/Desktop/agent/sdk/packages/providers/railgun`
**Status**: 90% complete, real SDK integrated, needs production finishing touches
**Main File**: `src/index.ts` (783 lines)
**Pattern**: Extends `BasePrivacyProvider` from `@zksdk/core`

**Key Railgun SDK APIs** (from research):
- `startRailgunEngine(walletSource, db, debug, artifactStore, ...)` - Initialize engine
- `createRailgunWallet(encryptionKey, mnemonic)` → returns `{id, railgunAddress}`
- `generateProofTransactions(ProofType, network, walletId, ...)` - Generate ZK proofs
- `refreshBalances(network, [walletId])` - Refresh wallet balances
- Balance access: `wallet.balances[network][tokenAddress]`

**Reference Providers**:
- Privacy Cash: `sdk/packages/providers/privacy/src/privacycash-provider.ts`
- FHEVM: `sdk/packages/providers/fhevm/src/provider.ts`

---

## Phase 0 – Critical Blockers (15 min)

### [ ] Task 1: Install missing `level` dependency
**Problem**: TypeScript error `TS2307: Cannot find module 'level'` at line 151 - blocks ALL tests
**Action**:
```bash
cd /Users/saeeddawod/Desktop/agent/sdk/packages/providers/railgun
npm install --save level@^8.0.0
npm install --save-dev @types/level@^6.0.0
npm test  # Should compile now (tests may fail, but will compile)
```
**Notes**:

### [ ] Task 2: Fix database path validation
**Problem**: Railgun SDK `validateWalletSource()` rejects paths with "." character
**Files**: `src/index.ts:92-94` (default path), line 43-44 (docs)
**Action**: Change `'./railgun-artifacts'` → `'railgun-artifacts'` (remove `./` prefix)
**Notes**:

---

## Phase 1 – Core Implementation (3-4 hours)

### [ ] Task 3: Remove test mode fallbacks
**Problem**: Production code has `if (process.env.NODE_ENV === 'test')` branches - bad practice
**Files**: `src/index.ts:262-273` (transfer), `509-520` (shield), `620-630` (unshield)
**Action**: Delete all 3 blocks that generate mock txHashes
**Why**: Use proper test mocks instead of runtime checks
**Notes**:

### [ ] Task 4: Implement balance extraction
**Problem**: Line 429 has TODO comment, returns empty array
**Current**: `return allBalances; // empty`
**Action**:
1. Import `refreshBalances` and `getEngine` from `@railgun-community/wallet`
2. Loop networks, call `refreshBalances(network, [this.walletId])`
3. Get wallet: `const wallet = getEngine().wallets[this.walletId]`
4. Access: `wallet.balances[network][tokenAddress]`
5. Map to `Balance[]` format from `@zksdk/core`
**Notes**:

### [ ] Task 5: Fix transaction broadcasting
**Problem**: Using wrong ethers v6 API - `provider.broadcastTransaction()` needs signed raw tx string
**Files**: `src/index.ts:337` (transfer), `559` (shield), `691` (unshield)
**Action**:
1. Add `signer?: ethers.Signer` to `RailgunConfig` interface (line 37)
2. Add `private signer: ethers.Signer | null = null` to class (line 52)
3. In `initialize()`: `if (config.signer) this.signer = config.signer`
4. Replace all 3 broadcasting blocks with:
   ```typescript
   if (!this.signer) throw new Error('Signer required');
   const txResponse = await this.signer.sendTransaction(populatedTx);
   const receipt = await txResponse.wait(1);
   ```
5. Return real status/fee from receipt
**Notes**:

### [ ] Task 6: Create typed error classes
**New File**: `src/errors.ts`
**Action**: Create error classes extending base `RailgunError`:
- `RailgunInitializationError`
- `RailgunTransferError`
- `RailgunBalanceError`
- `RailgunNetworkError`

Then replace all `throw new Error()` in `src/index.ts` with typed errors
**Example**: Line 76 → `throw new RailgunInitializationError('Either db instance or engineDbPath is required')`
**Notes**:

### [ ] Task 7: Fix provider type casting
**Problem**: Unsafe casts between `JsonRpcProvider` ↔ `FallbackProvider`
**Files**: `src/index.ts:58` (type def), `758` (getter cast), `778` (setter cast)
**Action**:
- Line 58: Change `Map<NetworkName, FallbackProvider>` → `Map<NetworkName, JsonRpcProvider>`
- Line 758: Remove `as unknown as JsonRpcProvider`
- Line 778: Remove `as unknown as FallbackProvider`
**Notes**:

---

## Phase 2 – Testing & QA (1-2 hours)

### [ ] Task 8: Update test mocks
**File**: `src/__mocks__/@railgun-community/wallet.ts`
**Action**: Add missing mock functions:
```typescript
export const populateProvedTransfer = jest.fn().mockResolvedValue({
  transaction: { to: '0x...', data: '0x', value: 0n, gasLimit: 2000000n }
});
export const populateShield = jest.fn().mockResolvedValue({
  transaction: { to: '0x...', data: '0x', value: 0n, gasLimit: 300000n }
});
```
**Why**: Tests expect these after removing test mode fallbacks
**Notes**:

### [ ] Task 9: Update test files
**Files**: `src/__tests__/*.test.ts` (4 test files)
**Action**:
1. Import typed errors: `import { RailgunInitializationError } from '../errors'`
2. Update expect statements to use typed errors
3. Remove reliance on `process.env.NODE_ENV` checks
4. Add integration test: initialize → shield → transfer → unshield flow
5. Run: `npm test -- --coverage` (target: ≥90%)
**Notes**:

---

## Phase 3 – Documentation & Examples (2 hours)

### [ ] Task 10: Create usage examples
**Directory**: `examples/` (create new)
**Action**: Create 5 example files:
1. `01-basic-initialization.ts` - Setup with level DB + signer
2. `02-shield-tokens.ts` - Shield USDC from public to private
3. `03-private-transfer.ts` - Private transfer with memo
4. `04-unshield-tokens.ts` - Unshield to public wallet
5. `05-check-balances.ts` - Query private balances

**Reference**: Look at `sdk/packages/providers/privacy/examples/` for pattern
**Notes**:

### [ ] Task 11: Update package README
**File**: `README.md`
**Action**: Add/update sections:
- Installation (include `level` and `ethers` dependencies)
- Quick start (show level DB + signer setup)
- Configuration reference (document all `RailgunConfig` fields)
- API documentation (all public methods with signatures)
- Security notes (mnemonic/key handling, never commit secrets)

**Reference**: `sdk/packages/providers/privacy/README.md`
**Notes**:

### [ ] Task 12: Update docs site
**Location**: `/Users/saeeddawod/Desktop/agent/zk-landing/docs/zksdkjs/`
**Action**: Update 4 documentation files:
1. `integration-flows.md:18-41` - Update Railgun sequence diagram (add signer connection step)
2. `provider-comparison.md:18` - Change status column to "✅ Production"
3. `provider-comparison.md:52-61` - Update Railgun config code example (add signer)
4. `overview.md:108` - Update coverage from 48% → 90%
**Notes**:

---

## Phase 4 – Cleanup & Finalization (30 min)

### [ ] Task 13: Delete debug/test files
**Action**: Remove leftover debug files:
```bash
cd /Users/saeeddawod/Desktop/agent
rm sdk/test-railgun-*.{ts,js,cjs}
rm sdk/test/__mocks__/railgun-wallet.ts
rm sdk/packages/wallet-connect/debug-railgun.ts
```
**Verify**: `git status` shows only intended changes
**Notes**:

### [ ] Task 14: Update hand-off document
**File**: `workspace/hubs/dev-hand-off.md`
**Action**: Add new section at end:
- Date: October 28, 2025
- Title: "Railgun Provider - Production Ready Iteration"
- List: All 7 issues resolved (dependency, paths, fallbacks, balances, broadcasting, types, errors)
- Status: "Production Ready ✅"
**Notes**:

### [ ] Task 15: Final verification
**Action**: Run verification checklist:
```bash
cd sdk/packages/providers/railgun
npm run build          # ✅ Must succeed with 0 errors
npm test               # ✅ All tests pass
npm test -- --coverage # ✅ Coverage ≥ 90%
grep -r "TODO" src/    # ✅ No critical TODOs remain
git status             # ✅ Review all changes
```
**Notes**:

---

## ✅ Success Criteria

Mark complete when ALL of these are true:
- [ ] TypeScript compiles with 0 errors
- [ ] All tests pass (no failures)
- [ ] Test coverage ≥ 90%
- [ ] No test mode fallbacks in `src/index.ts`
- [ ] Real transaction broadcasting implemented (using signer)
- [ ] Balance extraction working (real wallet.balances access)
- [ ] 5 working examples created
- [ ] Documentation site updated
- [ ] Git status clean (no unexpected changes)

---

## 🚧 Parking Lot / Blockers

Pending decisions, external dependencies, or blockers go here:
-

---

## 📚 Quick Reference

**Useful Commands**:
```bash
# Navigate
cd /Users/saeeddawod/Desktop/agent/sdk/packages/providers/railgun

# Test
npm test
npm test -- --watch
npm test -- --coverage

# Build
npm run build

# Search
grep -r "TODO" src/
grep -r "FIXME" src/
```

**Key Dependencies**:
- `@railgun-community/engine` (^9.4.0)
- `@railgun-community/wallet` (^10.4.0)
- `@railgun-community/shared-models` (^6.4.0)
- `level` (^8.0.0) ⚠️ Must install
- `ethers` (^6.7.1)

**Interface to Implement** (`@zksdk/core`):
```typescript
abstract class BasePrivacyProvider {
  abstract initialize(config: ProviderConfig): Promise<void>;
  abstract transfer(params: TransferParams): Promise<TransferResult>;
  abstract getBalances(address: string): Promise<Balance[]>;
  abstract getTransactionStatus(txHash: string): Promise<TransferResult>;
}
```

---

**Version**: 1.0
**Date**: 2025-10-28
**Estimated Time**: 5-7 hours total
**Status**: Ready for execution
