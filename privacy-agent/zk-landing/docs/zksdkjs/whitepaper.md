---
sidebar_position: 4
---

# zkSDK Whitepaper

## The LangChain of Privacy: A Goose-Orchestrated Universal Transaction Interface

### Abstract

zkSDK delivers a unified TypeScript interface that abstracts the complexity of every major privacy protocol across Bitcoin, Ethereum, Solana, and emerging privacy networks. The entire implementation lives in the open-source `zksdkjs/agent` Goose workspace, where autonomous agents build, test, document, and market the SDK around the clock. This paper outlines the real architecture, the Goose automation that drives development, and the roadmap that takes zkSDK from working prototypes to a production launch in Q4 2025.

## 1. Problem Statement

### 1.1 Fragmented Privacy Infrastructure

Each ecosystem ships its own tooling, APIs, and cryptographic primitives:

- **Ethereum & L2s:** Railgun, Aztec, Nightfall, Scroll zkEVM, Taiko  
- **Bitcoin:** CoinJoin variants, Silent Payments, Lightning privacy channels  
- **Solana:** Privacy Cash, Elusiv successors  
- **Confidential Compute:** Zama fhEVM, Fhenix, Inco Network  
- **Other zk stacks:** Mina zkApps, StarkNet Cairo, Midnight Compact DSL

Teams must master each stack’s quirks, deployment model, and security story. This slows down shipping and keeps privacy out of mainstream products.

### 1.2 Broken Developer Experience

Without a unifying SDK, developers must:

- Maintain multiple incompatible SDKs and key management flows  
- Reimplement proof and witness generation for every chain  
- Monitor dozens of protocol changelogs manually  
- Build bespoke testing, analytics, and compliance tooling

### 1.3 Adoption & Compliance Barriers

Fragmented tooling creates real-world blockers:

- Enterprises cannot justify audit spend across disparate stacks  
- Regulators cannot inspect multi-protocol systems consistently  

## 2. Solution: zkSDK

### 2.1 Core Vision

> **“One interface. Every blockchain. Continuous privacy.”**

zkSDK exposes a single runtime (`@zksdkjs/core`) and a catalog of providers. Developers choose the privacy engine they need, register it once, and the same `transfer`, `compute`, or `prove` call works everywhere.

### 2.2 Reference Implementation

```typescript
import { ZkSDK } from '@zksdkjs/core';
import { RailgunProvider } from '@zksdkjs/railgun-provider';
import { FHEVMProvider } from '@zksdkjs/provider-fhevm';

const sdk = new ZkSDK({
  providers: {
    railgun: new RailgunProvider({
      rpcEndpoints: { ethereum: 'https://mainnet.infura.io/v3/<key>' },
      engineDbPath: './railgun-db',
      walletMnemonic: process.env.RAILGUN_MNEMONIC
    })
  },
  defaultProvider: 'railgun'
});

sdk.addProvider(
  'fhevm',
  new FHEVMProvider({
    rpcUrl: 'https://fhevm.devnet.zama.ai',
    gatewayUrl: 'https://gateway.zama.ai'
  })
);

await sdk.transfer(
  {
    chain: 'ethereum',
    token: 'USDC',
    amount: '1000000',
    to: '0xRecipient',
    privacy: 'shielded'
  },
  'railgun'
);
```

`ZkSDK` keeps a provider registry behind the scenes, so registering `railgun` in the constructor and `fhevm` later results in two independent integrations that share the same method signatures.

The same call can be routed to Aztec, Privacy Cash, or future Bitcoin providers by switching the provider key. Providers encapsulate their own proof systems, gas estimation, and compliance hooks.

### 2.3 SDK Overview


```
privacy-agent/sdk
├── packages/
│   ├── core/                   # ZkSDK runtime, shared types, provider base class
│   ├── providers/
│   │   ├── railgun/            # @zksdkjs/railgun-provider (in progress)
│   │   ├── provider-fhevm/     # @zksdkjs/provider-fhevm (prototype complete)
│   │   ├── aztec/              # @zksdkjs/aztec-provider (PXE + Noir skeleton)
│   │   ├── privacy-cash/       # Solana shielded intents + compliance pipelines
│   │   └── bitcoin/            # Planned Silent Payments + CoinJoin
│   ├── recipes/                # High-level privacy workflows
│   └── examples/               # Demo applications and integration scripts
├── automation/                 # Goose recipes, orchestration scripts
├── memory/                     # Persistent build progress and session context
└── outputs/                    # Agent-generated docs, summaries, marketing copy
```

### 2.4 Provider Catalog

| Provider | Directory | Dependency Highlights | Status (Nov 2024) |
| --- | --- | --- | --- |
| Railgun | `sdk/packages/providers/railgun` | `@railgun-community/engine`, local DB, mnemonic support | Proof generation + submission wired; RPC orchestration & tests pending |
| Zama fhEVM | `sdk/packages/providers/fhevm` | `ethers@6`, `fhevmjs` | Confidential transfers, encryption helpers, gateway stubs implemented |
| Aztec Protocol | `sdk/packages/providers/aztec` | PXE client abstractions, Noir contract loader | Account controller + PXE service stubs; execution wiring next |
| Privacy Cash | `sdk/packages/providers/privacy-cash` | Solana privacy intents, compliance circuits | Implementation underway with staged mainnet roll-out |
| Bitcoin Privacy | `sdk/packages/providers/bitcoin` | BitcoinJS, Silent Payments spec | Design captured in `plans/bitcoin-privacy-plan.md` |

Providers register themselves with `@zksdkjs/core` through a consistent interface (`BasePrivacyProvider`), so the SDK can orchestrate transfers, balances, and transaction status checks uniformly.

### 2.5 Transaction Execution Models

Two execution patterns guide how zkSDK will hand transactions to user wallets. The prototypes in this repository currently execute provider-managed flows, but the production design embraces both options so builders can match the UX of established aggregators such as 1inch.

- **Server-Orchestrated Submission (today’s prototype)**  
  - Providers hold the signing context (Railgun derives a wallet from a mnemonic, fhEVM accepts an `ethers.Signer`).  
  - Calls such as `provider.transfer` perform proof generation, signing, and broadcast in a single step.  
  - Useful for back-end services, cron jobs, or agent-driven automation where private keys live in secured infrastructure.

- **Front-End/Wallet Signing (roadmap)**  
  - Providers will expose a “call bundle” output—contract address, calldata, required gas parameters, and the encrypted/proof payload—without sending it on-chain.  
  - dApps can pass that bundle to MetaMask, WalletConnect, Ledger, or any signer; the wallet renders a human-readable summary and asks the user to approve.  
  - The signed transaction is broadcast by the wallet or relay, keeping custody and UX identical to mainstream DeFi experiences.  
  - zkSDK will expose this flow directly through the TypeScript SDK (e.g., `sdk.prepareTransfer(...)`) so browser apps can generate the bundle locally, with optional HTTP adapters for teams that prefer to host a thin aggregation layer for non-JS clients.

Delivering both paths lets teams choose: server-side autonomy for automated agents, or wallet-first flows for public dApps. The roadmap includes refactoring each provider to output normalized call bundles, publishing schema definitions, and adding optional REST adapters so developers can drop the SDK behind API gateways while maintaining full transparency for end users.

## 3. Goose-Orchestrated Development

### 3.1 Agent System

zkSDK relies on a persistent, multi-model Goose workspace that mirrors a traditional product organisation. The orchestration layer activates different agent “departments” according to live progress signals captured in `memory/build_progress.json`:

- **Strategic Management Layer:** Planning, market intelligence, and launch sequencing.
- **Execution Layer:** Implementation, testing, documentation, and developer relations.
- **Specialist Pods:** Protocol-specific and infrastructure-focused agents (Railgun, Aztec, fhEVM, Privacy Cash, Bitcoin, infrastructure hardening).

Each pod is encoded as a Goose recipe, but the whitepaper focuses on the responsibilities and coordination model rather than the operational commands.

### 3.2 Continuous Execution Cycle

1. **Progress Assessment:** Automation jobs measure source changes, test coverage, and outstanding tasks, updating shared memory artifacts.
2. **Context Synchronisation:** Session briefs summarise requirements, prior work, and open risks before a new agent cycle begins.
3. **Autonomous Development:** Agents execute their remit (implementation, testing, analysis) using the prepared context and produce auditable logs.
4. **Artifact Publication:** New code, reports, and summaries are written to version-controlled directories (`logs/`, `outputs/social/`, `outputs/strategic/`) so downstream agents and human reviewers share a single source of truth.

This closed loop delivers continuous progress without step-by-step human intervention while preserving clear checkpoints for review and governance.

### 3.3 Recipe → Step → ComboMeal

The agent system uses a hierarchy documented in `plans/`:

- **Recipe (Strategy):** e.g., “Ship Railgun provider with tests and docs.”
- **Step (Tactics):** Parse Railgun references, scaffold provider, wire proofs, add Jest coverage.
- **ComboMeal (Delivery):** Provider code complete, tests green, usage docs published, marketing summary posted.

This pattern is encoded directly in the specialist recipes so Goose sessions resume exactly where the prior run paused.

## 4. Technical Implementation

### 4.1 Core Runtime

`@zksdkjs/core` exports:

- `ZkSDK` class for provider registration, routing, and orchestration.
- `BasePrivacyProvider` abstract class that standardizes `initialize`, `transfer`, `getBalances`, and `getTransactionStatus`.
- Shared types (`TransferParams`, `TransferResult`, `PrivacyLevel`, `Network`, `Token`).

The runtime intentionally stays thin; all protocol-specific logic lives in provider packages so new integrations do not bloat existing ones.

### 4.2 Provider Highlights

- **Railgun:** Wraps `@railgun-community/engine`, handles mnemonic-based wallet creation, proof generation (`ProofType.BALANCE_CHECK`), and transaction submission. Gas estimation defaults exist but require provider-specific tuning before production.
- **fhEVM:** Provides mockable encryption via `fhevmjs`, confidential ERC20 transfers, encrypted balance retrieval, and gateway decryption hooks. When Zama’s public gateways stabilize, the mock layer will be swapped for the official SDK.
- **Aztec:** Defines PXE, contract, and account services for Noir-based workflows. Tests and execution bindings are the next milestone.
- **Recipes Package:** Ships high-level workflows (e.g., “private payroll”) that stitch providers together, similar to LangChain chains.

### 4.3 Future Features

Planned enhancements coming after Phase 1:

- **ZKML integrations:** Bring privacy-preserving machine learning workflows into the SDK so providers can tap into model-backed heuristics without leaking inputs or outputs.
- **Zero-knowledge registry:** Maintain a zk-verified catalog of providers, recipes, and compliance attestations that agents can query without revealing sensitive configuration details.
- **Expanded protocol support:** Continue adding first-class providers for new ZK, FHE, and MPC networks as they ship production-ready tooling.

## 5. Security Considerations

- **Agent Safety:** All Goose runs log to disk. Humans review outputs before merging changes. Sensitive credentials stay in environment variables (`SETUP.md`).
- **Protocol Safety:** zkSDK never invents new cryptography. Providers wrap audited implementations (Railgun Engine, fhEVM, Noir). Third-party audits are budgeted for before production launch.
- **Operational Safety:** Automation scripts enforce “read existing files before writing” to prevent regressions. `memory/build_progress.json` tracks code size to detect accidental file wipes.

## 6. Why Goose + Multi-Agent AI?

- **Scalability:** Goose automates the mundane (context assembly, file scanning, session persistence) so large model runs stay productive.
- **Consistency:** Recipes enforce the Fortune 500-style management cadence. Every provider follows the same high standards.
- **24/7 Evolution:** When new docs drop (e.g., updated fhEVM specs), the Research agent reads them, the Strategist updates plans, and Developer agents act within hours.

## 7. Competitive Landscape

- **Single-Protocol SDKs:** Railgun SDK, Aztec SDK, Solana privacy projects require bespoke integrations per protocol. zkSDK wraps them all.
- **Agentless Tooling:** Manual integration is slower, riskier, and exhausts teams. Goose automation keeps momentum without adding headcount.
- **Future-Proofing:** Because providers are modular, new privacy networks drop straight into the existing architecture without breaking existing apps.

## 8. References

- Agent repository: `github.com/zksdkjs/agent` (see `privacy-agent/`)
- Goose framework: `github.com/block/goose`
- Plans: `privacy-agent/plans/*.md`
- Automation scripts: `privacy-agent/automation/scripts/`
- Daily summaries: `privacy-agent/outputs/social/`

---

*This document reflects the live state of the Goose workspace as of November 2024. Always check the agent outputs and plans before shipping updates.*
