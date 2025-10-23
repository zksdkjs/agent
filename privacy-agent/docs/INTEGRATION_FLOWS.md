# zkSDK Integration Flows

**Version**: 1.0.0-beta
**Last Updated**: 2025-10-22

This document provides detailed sequence diagrams and integration flows for common zkSDK operations.

---

## Table of Contents

1. [Frontend Wallet Connection](#frontend-wallet-connection)
2. [Provider Initialization](#provider-initialization)
3. [Private Transfer Execution](#private-transfer-execution)
4. [Balance Queries](#balance-queries)
5. [Transaction Status Tracking](#transaction-status-tracking)
6. [Error Handling Flows](#error-handling-flows)
7. [Multi-Provider Setup](#multi-provider-setup)

---

## Frontend Wallet Connection

### Railgun Wallet Connection

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant MetaMask
    participant RailgunSDK
    participant IndexedDB

    User->>Frontend: Click "Connect Railgun"
    Frontend->>MetaMask: Request Account Access
    MetaMask-->>User: Approve Connection
    User-->>MetaMask: Approve
    MetaMask-->>Frontend: EVM Address

    Frontend->>Frontend: Show Mnemonic Input Modal
    User->>Frontend: Enter Railgun Mnemonic
    Frontend->>Frontend: Validate Mnemonic Format

    Frontend->>RailgunSDK: initialize({ walletMnemonic, engineDbPath })
    RailgunSDK->>IndexedDB: Create/Open Database
    RailgunSDK->>RailgunSDK: Derive Railgun Address
    RailgunSDK->>RailgunSDK: Initialize Proof Engine
    RailgunSDK-->>Frontend: Ready (Railgun Address)

    Frontend-->>User: Display Connected (EVM + Railgun addresses)
```

**Key Steps**:
1. Connect MetaMask for RPC access
2. Prompt user for Railgun mnemonic (separate from MetaMask)
3. Initialize Railgun engine with local database
4. Display both EVM and Railgun addresses

---

### Aztec Wallet Connection

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant PXE
    participant AztecSDK

    User->>Frontend: Click "Connect Aztec"
    Frontend->>Frontend: Check PXE Availability
    alt PXE Available
        Frontend->>Frontend: Show Mnemonic Input Modal
        User->>Frontend: Enter Account Mnemonic
        Frontend->>AztecSDK: initialize({ pxeUrl, accountMnemonic })
        AztecSDK->>PXE: Connect to PXE Server
        PXE-->>AztecSDK: Connection Established
        AztecSDK->>PXE: Derive Account from Mnemonic
        PXE-->>AztecSDK: Aztec Account Address
        AztecSDK-->>Frontend: Ready (Aztec Address)
        Frontend-->>User: Display Connected
    else PXE Unavailable
        Frontend-->>User: Error: PXE Server Required
        Frontend->>Frontend: Show PXE Setup Instructions
    end
```

**Key Steps**:
1. Check PXE server availability (local or remote)
2. Prompt user for account mnemonic
3. Connect to PXE and derive account
4. Display Aztec address

---

### FHEVM Wallet Connection

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant MetaMask
    participant FHEVMSDK
    participant ZamaNetwork

    User->>Frontend: Click "Connect FHEVM"
    Frontend->>MetaMask: Request Account Access
    MetaMask-->>User: Approve Connection
    User-->>MetaMask: Approve
    MetaMask-->>Frontend: Signer

    Frontend->>FHEVMSDK: new FHEVMProvider({ rpcUrl, chainId })
    Frontend->>FHEVMSDK: connect(signer)
    FHEVMSDK->>ZamaNetwork: Fetch FHE Public Key
    ZamaNetwork-->>FHEVMSDK: Public Key
    FHEVMSDK-->>Frontend: Ready
    Frontend-->>User: Display Connected (EVM Address)
```

**Key Steps**:
1. Connect MetaMask (standard EVM wallet)
2. Extract signer from MetaMask
3. Initialize FHEVM provider with signer
4. Fetch FHE public key from network
5. Display connected EVM address

---

### Light Protocol Wallet Connection (Solana)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Phantom
    participant LightSDK
    participant Helius

    User->>Frontend: Click "Connect Phantom"
    Frontend->>Phantom: Request Connection
    Phantom-->>User: Approve Connection
    User-->>Phantom: Approve
    Phantom-->>Frontend: Solana PublicKey

    Frontend->>LightSDK: initialize({ keypair, rpcUrl, heliusApiKey })
    LightSDK->>Helius: Verify Indexer Access
    Helius-->>LightSDK: API Key Valid
    LightSDK-->>Frontend: Ready
    Frontend-->>User: Display Connected (Solana Address)
```

**Key Steps**:
1. Connect Phantom wallet
2. Extract Solana public key
3. Initialize Light Protocol with keypair
4. Verify Helius indexer access
5. Display Solana address

---

## Provider Initialization

### zkSDK Multi-Provider Setup

```mermaid
sequenceDiagram
    participant App
    participant zkSDK
    participant RailgunProvider
    participant AztecProvider
    participant FHEVMProvider

    App->>RailgunProvider: new RailgunProvider()
    App->>RailgunProvider: initialize(railgunConfig)
    RailgunProvider-->>App: Ready

    App->>AztecProvider: new AztecProvider()
    App->>AztecProvider: initialize(aztecConfig)
    AztecProvider-->>App: Ready

    App->>FHEVMProvider: new FHEVMProvider(fhevmConfig)
    App->>FHEVMProvider: connect(signer)
    FHEVMProvider-->>App: Ready

    App->>zkSDK: new ZkSDK({ providers: { railgun, aztec, fhevm } })
    zkSDK-->>App: SDK Ready

    Note over App,zkSDK: Now can call zkSDK.transfer('railgun', params)
```

**Configuration Example**:
```typescript
// Initialize individual providers
const railgun = new RailgunProvider();
await railgun.initialize({
  walletMnemonic: userMnemonic,
  engineDbPath: './railgun-db',
  rpcEndpoints: { ethereum: ethRpc }
});

const aztec = new AztecProvider();
await aztec.initialize({
  type: 'aztec',
  chainId: 1,
  networkType: 'testnet',
  pxeConfig: { pxeUrl: 'http://localhost:8080' }
});

// Create unified SDK
const sdk = new ZkSDK({
  providers: { railgun, aztec },
  defaultProvider: 'railgun'
});
```

---

## Private Transfer Execution

### Railgun Private Transfer Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant zkSDK
    participant RailgunProvider
    participant RailgunEngine
    participant EthereumNetwork

    User->>Frontend: Submit Transfer Form
    Frontend->>Frontend: Validate Input (amount, recipient)
    Frontend->>zkSDK: transfer({ chain, token, amount, to, privacy: 'shielded' }, 'railgun')
    zkSDK->>RailgunProvider: transfer(params)

    RailgunProvider->>RailgunProvider: Validate Parameters
    RailgunProvider->>RailgunEngine: Get Private Balance
    RailgunEngine-->>RailgunProvider: Balance

    alt Insufficient Balance
        RailgunProvider-->>zkSDK: Error: Insufficient Balance
        zkSDK-->>Frontend: Error
        Frontend-->>User: Show Error
    else Sufficient Balance
        RailgunProvider->>RailgunEngine: Generate ZK Proof
        Note over RailgunEngine: ~5-15 seconds
        RailgunEngine-->>RailgunProvider: Proof Generated

        RailgunProvider->>EthereumNetwork: Submit Private Transaction + Proof
        EthereumNetwork-->>RailgunProvider: Transaction Hash
        RailgunProvider-->>zkSDK: TransferResult { txHash, status: 'pending' }
        zkSDK-->>Frontend: TransferResult
        Frontend-->>User: Display Success + Explorer Link
    end
```

**Timeline**:
- Validation: < 1 second
- Proof Generation: 5-15 seconds
- Transaction Submission: 1-5 seconds
- Total: ~6-20 seconds before tx submission

---

### Aztec Private Transfer Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant zkSDK
    participant AztecProvider
    participant PXE
    participant AztecL2

    User->>Frontend: Submit Transfer Form
    Frontend->>zkSDK: transfer(params, 'aztec')
    zkSDK->>AztecProvider: transfer(params)

    AztecProvider->>AztecProvider: Validate Parameters
    AztecProvider->>PXE: Query Private Balance
    PXE-->>AztecProvider: Balance

    alt Insufficient Balance
        AztecProvider-->>zkSDK: Error: Insufficient Balance
        zkSDK-->>Frontend: Error
        Frontend-->>User: Show Error
    else Sufficient Balance
        AztecProvider->>PXE: Create Private Transaction
        PXE->>PXE: Generate ZK Proof
        Note over PXE: ~10-30 seconds
        PXE-->>AztecProvider: Encrypted TX + Proof

        AztecProvider->>AztecL2: Submit to L2 Sequencer
        AztecL2-->>AztecProvider: Transaction Hash
        AztecProvider-->>zkSDK: TransferResult { txHash, status: 'pending' }
        zkSDK-->>Frontend: TransferResult
        Frontend-->>User: Display Success
    end
```

**Timeline**:
- Validation: < 1 second
- Proof Generation: 10-30 seconds
- L2 Submission: 1-3 seconds
- L2 Finality: ~1-3 seconds
- L1 Finality: ~15 minutes

---

### FHEVM Confidential Transfer Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant zkSDK
    participant FHEVMProvider
    participant FHEVMEncryption
    participant ZamaNetwork

    User->>Frontend: Submit Transfer Form
    Frontend->>zkSDK: transfer(params, 'fhevm')
    zkSDK->>FHEVMProvider: transfer(params)

    FHEVMProvider->>FHEVMProvider: Validate Parameters
    FHEVMProvider->>FHEVMEncryption: Encrypt Amount
    Note over FHEVMEncryption: Client-side FHE encryption ~1-5 sec
    FHEVMEncryption-->>FHEVMProvider: Encrypted Amount + Proof

    FHEVMProvider->>ZamaNetwork: Call Confidential ERC20.transfer(encrypted)
    ZamaNetwork->>ZamaNetwork: Execute FHE Operations on Encrypted Data
    ZamaNetwork-->>FHEVMProvider: Transaction Hash
    FHEVMProvider-->>zkSDK: TransferResult { txHash, status: 'pending' }
    zkSDK-->>Frontend: TransferResult
    Frontend-->>User: Display Success
```

**Timeline**:
- Encryption: 1-5 seconds
- Transaction Submission: 1-3 seconds
- Network Finality: ~30 seconds (Zama devnet)

---

## Balance Queries

### Unified Balance Query Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant zkSDK
    participant Provider
    participant Network/Indexer

    Frontend->>zkSDK: getBalances('railgun', userAddress)
    zkSDK->>Provider: getBalances(address)

    alt Railgun
        Provider->>Network/Indexer: Query Shielded Balances
        Network/Indexer-->>Provider: Encrypted Balances
        Provider->>Provider: Decrypt with User Keys
    else Aztec
        Provider->>Network/Indexer: Query PXE Private State
        Network/Indexer-->>Provider: Private Balances
    else FHEVM
        Provider->>Network/Indexer: Query Encrypted On-Chain State
        Network/Indexer-->>Provider: Encrypted Balances
        Provider->>Provider: Decrypt with ACL Permission
    else Light Protocol
        Provider->>Network/Indexer: Query Helius Compressed State
        Network/Indexer-->>Provider: Compressed Account Data
        Provider->>Provider: Decompress State
    end

    Provider-->>zkSDK: Balance[]
    zkSDK-->>Frontend: Balance[]
    Frontend->>Frontend: Display Balances with USD Values
```

**Performance**:
- Railgun: 1-3 seconds (requires local decryption)
- Aztec: 0.5-2 seconds (PXE cached)
- FHEVM: 1-2 seconds (on-chain query)
- Light Protocol: 0.5-1 second (Helius indexed)

---

## Transaction Status Tracking

### Polling for Transaction Finality

```mermaid
sequenceDiagram
    participant Frontend
    participant zkSDK
    participant Provider
    participant Network

    Frontend->>zkSDK: getTransactionStatus('railgun', txHash)
    zkSDK->>Provider: getTransactionStatus(txHash)

    loop Every 5 seconds
        Provider->>Network: Query Transaction Status
        Network-->>Provider: { status, confirmations }

        alt Pending
            Provider-->>zkSDK: { status: 'pending', confirmations: X }
            zkSDK-->>Frontend: Pending
            Frontend->>Frontend: Show Loading Indicator
        else Confirmed
            Provider-->>zkSDK: { status: 'success', confirmations: 12 }
            zkSDK-->>Frontend: Success
            Frontend->>Frontend: Show Success Message
            Frontend->>Frontend: Update Balance Display
        else Failed
            Provider-->>zkSDK: { status: 'failed', error }
            zkSDK-->>Frontend: Failed
            Frontend->>Frontend: Show Error Message
        end
    end
```

**Polling Intervals**:
- Ethereum/Polygon (Railgun): Poll every 5-10 seconds
- Aztec L2: Poll every 2-3 seconds (faster finality)
- Zama (FHEVM): Poll every 3-5 seconds
- Solana (Light): Poll every 1-2 seconds

---

## Error Handling Flows

### Comprehensive Error Handling

```mermaid
sequenceDiagram
    participant Frontend
    participant zkSDK
    participant Provider
    participant Network

    Frontend->>zkSDK: transfer(params, 'railgun')
    zkSDK->>Provider: transfer(params)

    alt Invalid Parameters
        Provider->>Provider: validateTransferParams()
        Provider-->>zkSDK: ValidationError: "Amount must be > 0"
        zkSDK-->>Frontend: Error
        Frontend->>Frontend: Show Validation Error to User
    else Insufficient Balance
        Provider->>Network: Query Balance
        Network-->>Provider: Balance too low
        Provider-->>zkSDK: ProviderError: "Insufficient balance"
        zkSDK-->>Frontend: Error
        Frontend->>Frontend: Show Balance Error + Suggest Top-Up
    else Network Error
        Provider->>Network: Submit Transaction
        Network-->>Provider: Network Timeout
        Provider-->>zkSDK: ProviderError: "Network unavailable"
        zkSDK-->>Frontend: Error
        Frontend->>Frontend: Show Network Error + Retry Button
    else Proof Generation Failed
        Provider->>Provider: Generate Proof
        Provider-->>zkSDK: ProviderError: "Proof generation failed"
        zkSDK-->>Frontend: Error
        Frontend->>Frontend: Show Technical Error + Contact Support
    else Success
        Provider->>Network: Submit Transaction
        Network-->>Provider: Transaction Hash
        Provider-->>zkSDK: TransferResult
        zkSDK-->>Frontend: Success
        Frontend->>Frontend: Show Success Message
    end
```

### Error Types and User Messages

| Error Type | User-Friendly Message | Recommended Action |
|------------|----------------------|-------------------|
| `ValidationError` | "Please check your input and try again" | Highlight invalid field |
| `InsufficientBalanceError` | "You don't have enough funds for this transfer" | Show balance + top-up button |
| `NetworkError` | "Connection issue. Please check your internet" | Retry button |
| `ProofGenerationError` | "Transaction preparation failed. Please try again" | Retry or contact support |
| `ProviderNotInitializedError` | "Please connect your wallet first" | Redirect to wallet connection |
| `UnsupportedChainError` | "This chain is not supported by [provider]" | Show supported chains list |

---

## Multi-Provider Setup

### Switching Between Providers

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant zkSDK
    participant RailgunProvider
    participant AztecProvider

    User->>Frontend: Select "Use Railgun for this transfer"
    Frontend->>zkSDK: transfer(params, 'railgun')
    zkSDK->>RailgunProvider: transfer(params)
    RailgunProvider-->>zkSDK: TransferResult
    zkSDK-->>Frontend: Success
    Frontend-->>User: "Transfer successful via Railgun"

    Note over User,AztecProvider: Later...

    User->>Frontend: Select "Use Aztec for next transfer"
    Frontend->>zkSDK: transfer(params, 'aztec')
    zkSDK->>AztecProvider: transfer(params)
    AztecProvider-->>zkSDK: TransferResult
    zkSDK-->>Frontend: Success
    Frontend-->>User: "Transfer successful via Aztec"
```

**Frontend Example**:
```typescript
const [selectedProvider, setSelectedProvider] = useState('railgun');

async function handleTransfer() {
  try {
    const result = await sdk.transfer({
      chain: 'ethereum',
      token: tokenAddress,
      amount: amountWei,
      to: recipientAddress,
      privacy: 'shielded'
    }, selectedProvider); // 'railgun' | 'aztec' | 'fhevm'

    showSuccess(`Transfer via ${selectedProvider} successful!`);
  } catch (error) {
    showError(error.message);
  }
}
```

---

## Security Considerations

### Credential Flow (Secure)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant SecureModal
    participant Provider

    User->>Frontend: Click "Connect"
    Frontend->>SecureModal: Show Input Dialog
    User->>SecureModal: Enter Mnemonic
    SecureModal->>SecureModal: Validate Format
    SecureModal->>Provider: initialize(mnemonic)
    Provider->>Provider: Store in Memory Only
    Provider-->>SecureModal: Success
    SecureModal->>SecureModal: Clear Input Field Immediately
    SecureModal-->>Frontend: Connection Successful
    Frontend->>Frontend: Update UI (DO NOT store mnemonic)

    Note over Frontend: ❌ NEVER store mnemonic in localStorage
    Note over Frontend: ❌ NEVER log mnemonic to console
    Note over Frontend: ✅ Provider holds in memory during session
```

### Anti-Patterns to Avoid

```typescript
// ❌ NEVER DO THIS
localStorage.setItem('mnemonic', userMnemonic);
console.log('User mnemonic:', mnemonic);
const config = { walletMnemonic: 'hardcoded mnemonic here' };

// ✅ DO THIS INSTEAD
// Prompt user each session
const mnemonic = await promptSecureMnemonic();
provider.initialize({ walletMnemonic: mnemonic });
// Clear from scope immediately
mnemonic = null;
```

---

## Next Steps

1. **Choose Your Provider**: [PROVIDER_COMPARISON.md](./PROVIDER_COMPARISON.md)
2. **Backend Integration**: See [docs/backend/](./backend/) for provider-specific guides
3. **Frontend Integration**: See [docs/frontend/](./frontend/) for wallet connection guides
4. **System Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Questions about integration flows?** Open an issue at [GitHub Repository URL]
