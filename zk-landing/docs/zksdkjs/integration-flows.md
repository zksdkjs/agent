---
id: integration-flows
title: Integration Flows
sidebar_label: Integration Flows
---

# zkSDK Integration Flows

**Version**: 1.0.0-beta  
**Last Updated**: 2025-10-22

Detailed sequence diagrams for common zkSDK operations.

## Frontend Wallet Connection

### Railgun

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant MetaMask
    participant RailgunSDK
    participant IndexedDB

    User->>Frontend: Click "Connect Railgun"
    Frontend->>MetaMask: Request account access
    MetaMask-->>User: Approve connection
    User-->>MetaMask: Approve
    MetaMask-->>Frontend: EVM address

    Frontend->>Frontend: Show mnemonic input
    User->>Frontend: Enter Railgun mnemonic
    Frontend->>RailgunSDK: initialize({ walletMnemonic, engineDbPath })
    RailgunSDK->>IndexedDB: Create/open database
    RailgunSDK->>RailgunSDK: Derive Railgun address & init proof engine
    RailgunSDK-->>Frontend: Ready
    Frontend-->>User: Display connected state
```

### Aztec

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant PXE
    participant AztecSDK

    User->>Frontend: Click "Connect Aztec"
    Frontend->>Frontend: Check PXE availability
    alt PXE Available
        Frontend->>Frontend: Prompt for mnemonic
        User->>Frontend: Enter mnemonic
        Frontend->>AztecSDK: initialize({ pxeUrl, accountMnemonic })
        AztecSDK->>PXE: Connect & derive account
        PXE-->>AztecSDK: Account address
        AztecSDK-->>Frontend: Ready
        Frontend-->>User: Display Aztec address
    else PXE Missing
        Frontend-->>User: Prompt PXE setup
    end
```

### FHEVM

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant MetaMask
    participant FHEVMSDK
    participant ZamaNetwork

    User->>Frontend: Click "Connect FHEVM"
    Frontend->>MetaMask: Request account access
    MetaMask-->>User: Approve
    User-->>MetaMask: Approve
    MetaMask-->>Frontend: Signer

    Frontend->>FHEVMSDK: new FHEVMProvider({ rpcUrl, chainId })
    Frontend->>FHEVMSDK: connect(signer)
    FHEVMSDK->>ZamaNetwork: Fetch FHE public key
    ZamaNetwork-->>FHEVMSDK: Public key
    FHEVMSDK-->>Frontend: Ready
    Frontend-->>User: Display connected state
```

### Privacy Cash (Solana)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Phantom
    participant PrivacyCashSDK
    participant PrivacyCashRelay

    User->>Frontend: Click "Connect Phantom"
    Frontend->>Phantom: Request connection
    Phantom-->>User: Approve
    User-->>Phantom: Approve
    Phantom-->>Frontend: Public key

    Frontend->>PrivacyCashSDK: initialize({ keypair, rpcUrl, relayEndpoint, complianceKey })
    PrivacyCashSDK->>PrivacyCashRelay: Register session + fetch compressed state snapshot
    PrivacyCashRelay-->>PrivacyCashSDK: Session token + latest commitments
    PrivacyCashSDK-->>Frontend: Ready
    Frontend-->>User: Display Solana address
```

## Provider Initialization Checklist

| Provider | Required Inputs | Optional Inputs | Notes |
|----------|-----------------|-----------------|-------|
| Railgun | Wallet mnemonic, engine DB path, RPC endpoints | Relayer config | Creates local proof engine + database. |
| Aztec | PXE URL, account mnemonic | Contract deployment config | Requires PXE server to be running. |
| FHEVM | RPC URL, chain ID, signer | Gateway URL | Fetches FHE public key on connect. |
| Privacy Cash | Solana keypair, RPC URL, relay endpoint | Compliance domain, intent expiry | Pulls compressed state via relay and enforces domain-specific policies. |
| Bitcoin | Silent payment key, electrum URL | Watch-only wallet path | Leverages BIP352 derivation paths. |

## Private Transfer Execution

```mermaid
sequenceDiagram
    participant Frontend
    participant zkSDK
    participant Provider
    participant Blockchain

    Frontend->>zkSDK: transfer(params)
    zkSDK->>Provider: transfer(params)
    Provider->>Provider: Validate parameters
    Provider->>Provider: Generate proof/encryption
    Provider->>Blockchain: Submit transaction
    Blockchain-->>Provider: txHash/status
    Provider-->>zkSDK: TransferResult
    zkSDK-->>Frontend: TransferResult
```

## Balance Queries

```mermaid
sequenceDiagram
    participant Frontend
    participant zkSDK
    participant Provider
    participant Indexer

    Frontend->>zkSDK: getBalances(provider, address)
    zkSDK->>Provider: getBalances(address)
    Provider->>Indexer: Query private state
    Indexer-->>Provider: Encrypted balances
    Provider->>Provider: Decrypt as needed
    Provider-->>zkSDK: Balance[]
    zkSDK-->>Frontend: Balance[]
```

## Transaction Status Tracking

```mermaid
sequenceDiagram
    participant Frontend
    participant zkSDK
    participant Provider
    participant Blockchain

    loop Poll
        Frontend->>zkSDK: getTransactionStatus(provider, txHash)
        zkSDK->>Provider: getTransactionStatus(txHash)
        Provider->>Blockchain: Fetch status
        Blockchain-->>Provider: Pending/Confirmed/Failed
        Provider-->>zkSDK: TransferResult
        zkSDK-->>Frontend: Status update
    end
```

## Error Handling Patterns

- **Validation errors**: Providers throw typed errors with remediation tips (`InvalidMnemonicError`, `MissingConfigError`, etc.).
- **Network errors**: Retry with exponential backoff; escalate to UI with actionable message.
- **Proof failures**: Providers include failure codes (e.g., `PROOF_VERIFICATION_FAILED`, `INSUFFICIENT_PRIVACY_BALANCE`).
- **PXE availability**: Detect early and surface instructions to start the PXE server.

## Multi-Provider Setup

```typescript
import { ZkSDK } from '@zksdkjs/core';
import { RailgunProvider } from '@zksdkjs/providers/railgun';
import { FHEVMProvider } from '@zksdkjs/providers/fhevm';

const sdk = new ZkSDK({
  providers: {
    railgun: new RailgunProvider(),
    fhevm: new FHEVMProvider(),
  },
  defaultProvider: 'railgun',
});

await sdk.initializeProvider('railgun', railgunConfig);
await sdk.initializeProvider('fhevm', fhevmConfig);
```

### Routing Strategy

- Default provider handles most operations.
- Applications can override provider per call (`sdk.transfer(params, 'aztec')`).
- Fallback logic can inspect provider health metrics before routing.
