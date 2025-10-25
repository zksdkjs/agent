---
sidebar_position: 2
---

# Range Proofs for EVM

The Range Proof package enables developers to prove that a value falls within a specific range without revealing the actual value. This is useful for age verification, balance checks, score validation, and many other privacy-preserving applications.

## Overview

Range proofs allow you to prove statements like:
- "I am at least 18 years old" without revealing your exact age
- "My credit score is between 650-850" without revealing the exact score  
- "My account balance is above $1000" without revealing the exact amount

## Installation

```bash
npm install @zkthings/range-proof-evm
# or
bun add @zkthings/range-proof-evm
```

## Quick Start

### Basic Age Verification

```typescript
import { RangeProof } from '@zkthings/range-proof-evm';

// Prove you're 18+ without revealing exact age
const ageProof = await rangeProof.prove(25, 18, 255);

// Verify the proof (auto-detects bit size)
const isValid = await rangeProof.verify(ageProof);

// Export Solidity Verifier
const verifierContract = await rangeProof.exportSolidityVerifier(ageProof);
```

### Generic Range Proof

```typescript
// Prove credit score is in "excellent" range (750-850)
const creditProof = await rangeProof.prove(
  780,    // actual score (private)
  750,    // min score (public)
  850     // max score (public)  
  // Auto-detects 16-bit circuit since max value is 850
);
```

## Circuit Bit Sizes

Choose the appropriate bit size based on your maximum expected value:

| Bit Size | Max Value | Use Cases | Example |
|----------|-----------|-----------|---------|
| 8-bit | 255 | Ages, percentages, grades | Age verification (0-120), test scores (0-100) |
| 16-bit | 65,535 | Credit scores, ratings | Credit scores (300-850), star ratings (1-5) |
| 32-bit | 4.2 billion | Financial amounts | Account balances, transaction amounts |
| 64-bit | 18 quintillion | Very large amounts | Enterprise financial systems |

## API Reference

### `rangeProof.prove(value, minValue, maxValue, bitSize?)`

Proves a value is within the specified range. Most flexible method with auto bit-size detection.

**Parameters:**
- `value` (number): The actual value (private input)
- `minValue` (number): Minimum allowed value (public)
- `maxValue` (number): Maximum allowed value (public)
- `bitSize` (number, optional): Circuit bit size (8, 16, 32, or 64) - auto-detected if not provided

**Returns:** `Promise<ProofOutput>`

```typescript
// Age verification: Auto-detected (uses 8-bit circuit)
const ageProof = await rangeProof.prove(
  25,   // Your actual age (SECRET!)
  18,   // Minimum age required (public)
  255   // Maximum possible age (public)
  // bitSize auto-detected as 8 since max value is 255
);

// Temperature verification: Auto-detected (uses 8-bit circuit)
const tempProof = await rangeProof.prove(
  32,   // Temperature + offset (22°C + 10 = 32) (SECRET!)
  0,    // Min temp + offset (-10°C + 10 = 0) (public)
  50    // Max temp + offset (40°C + 10 = 50) (public)
  // bitSize auto-detected as 8 since max value is 50
);

// Credit score: Auto-detected (uses 16-bit circuit)
const creditProof = await rangeProof.prove(
  720,  // Your actual credit score (SECRET!)
  650,  // Minimum "good" credit score (public)
  850   // Maximum excellent credit score (public)
  // bitSize auto-detected as 16 since max value is 850
);

// Balance verification: Auto-detected (uses 32-bit circuit)
const balanceProof = await rangeProof.prove(
  5000,     // Your actual balance (SECRET!)
  1000,     // Minimum required balance (public)
  4294967295 // Maximum 32-bit value (public)
  // bitSize auto-detected as 32 since max value requires 32-bit
);
```


### `rangeProof.verify(proofOutput)` or `rangeProof.verify(proof, publicSignals, bitSize)`

Verifies a range proof.

**Simple API (Recommended):**
```typescript
// Just pass the complete proof output - auto-detects bit size
const isValid = await rangeProof.verify(proofOutput);
```

**Legacy API (Manual):**
```typescript
// Or manually specify all parameters
const isValid = await rangeProof.verify(
  proof.proof,         // Proof object
  proof.publicSignals, // Public signals array
  proof.bitSize        // Bit size (must match original)
);
```

**Returns:** `Promise<boolean>`

## Use Cases

### Financial Applications

```typescript
// Loan eligibility (income >= $50K without revealing exact salary)
const incomeProof = await rangeProof.prove(75000, 50000, 500000);

// Investment tier (balance $10K - $100K range)
const tierProof = await rangeProof.prove(25000, 10000, 100000);
```

### Educational & Testing

```typescript
// Course prerequisite (GPA >= 3.0)
const gpaProof = await rangeProof.prove(35, 30, 40); // GPA * 10, auto-detects 8-bit

// Certification level (score 80-100%)
const certProof = await rangeProof.prove(92, 80, 100); // Auto-detects 8-bit
```

### Healthcare & Insurance

```typescript
// Age-based insurance (65+ senior plans)
const seniorProof = await rangeProof.prove(68, 65, 255);

// BMI range verification (18.5-24.9 normal range)
const bmiProof = await rangeProof.prove(220, 185, 249); // BMI * 10, auto-detects 16-bit
```

## Moving from Test to Production

### Trusted Setup
A trusted setup is a crucial security process that creates the cryptographic parameters needed for zero-knowledge proofs. It requires multiple participants to ensure no single party has access to the complete setup information.

The setup process happens in two phases:
1. Phase 1 (Powers of Tau): General setup that can be reused
2. Phase 2: Circuit-specific setup for Range Proof operations

#### Coordinator Setup
```typescript
import { PowerOfTau } from '@zkthings/range-proof-evm';

// Initialize ceremony
const ceremony = new PowerOfTau(15);  // For range proofs up to 64-bit

// 1. Initialize ceremony
const ptauFile = await ceremony.initCeremony();

// 2. Share ptauFile with participants
// Each participant must contribute sequentially

// 3. After receiving final contribution
await ceremony.finalizeCeremony();

// 4. Generate production parameters
await ceremony.initPhase2('RangeProof');
await ceremony.finalizeCircuit('RangeProof');
```

#### Participant Contribution
```typescript
import { PowerOfTau } from '@zkthings/range-proof-evm';

// Each participant runs this
const ceremony = new PowerOfTau(15);

// Import previous contribution
await ceremony.importContribution(ptauFile);

// Add contribution
const newPtau = await ceremony.contributePhase1(`Participant ${id}`);

// Send newPtau to next participant or coordinator
```

#### Ceremony Flow
1. Coordinator initializes: `pot15_0000.ptau`
2. Participant 1 contributes: `pot15_0001.ptau`
3. Participant 2 contributes: `pot15_0002.ptau`
4. Final participant returns to coordinator
5. Coordinator finalizes ceremony

### Production Deployment
```typescript
// Use custom ceremony output
const rangeProof = new RangeProof({
  baseDir: './production-zkconfig',
  maxBits: 64
});

// Generate production proofs
const proof = await rangeProof.prove(value, min, max);
```

## Performance Characteristics

| Circuit | Constraints | Proof Time | Verification Time | Key Size |
|---------|-------------|------------|-------------------|----------|
| 8-bit   | ~19        | ~50ms      | ~5ms             | ~1MB     |
| 16-bit  | ~35        | ~100ms     | ~5ms             | ~2MB     |
| 32-bit  | ~67        | ~200ms     | ~10ms            | ~4MB     |
| 64-bit  | ~131       | ~500ms     | ~15ms            | ~8MB     |

*Performance varies by hardware. Times are approximate.*

## Security Considerations

### Input Validation
- Values must fit within the chosen bit size
- Range bounds (minValue, maxValue) are **public**
- Only the actual value remains **private**

### Bit Size Selection
```typescript
// ❌ Wrong: Using 8-bit for large values
await rangeProof.prove(50000, 1000, 100000, 8); // Will fail!

// ✅ Correct: Let auto-detection handle it
await rangeProof.prove(50000, 1000, 100000); // Auto-detects 32-bit!
```

### Negative Numbers
```typescript
// ❌ Wrong: Direct negative numbers not supported
await rangeProof.prove(-5, -10, 10); // Will fail!

// ✅ Correct: Use offset for negative ranges
const temp = 22; // 22°C
const tempWithOffset = temp + 10; // Add 10 to make positive
await rangeProof.prove(tempWithOffset, 0, 50); // Range: -10°C to 40°C, auto-detects 8-bit
```

## Error Handling

```typescript
try {
  // This will throw if age > 255 (8-bit limit)
  const proof = await rangeProof.prove(300, 18, 255);
} catch (error) {
  console.error('Age exceeds 8-bit limit:', error.message);
}

try {
  // This will throw if value outside range
  const proof = await rangeProof.prove(150, 0, 100);
} catch (error) {
  console.error('Value outside range:', error.message);
}
```

## Solidity Integration

Export verifier contracts for on-chain verification:

```typescript
// Export Groth16 verifier for 8-bit age verification
const verifierCode = await rangeProof.exportSolidityVerifier(8, 'groth16');

// Deploy and use in your smart contract
// The verifier will check that proofs are valid on-chain
```

## Best Practices

1. **Choose minimal bit size** for better performance
2. **Document range bounds** clearly for users
3. **Handle edge cases** (exact min/max values)
4. **Validate inputs** before proof generation
5. **Cache verification keys** for better performance

## Circuit Attribution

This implementation builds upon:
- **Circom & snarkjs**: Core ZK infrastructure by iden3
- **Range proof patterns**: Inspired by [fluree/example-zero-knowledge](https://github.com/fluree/example-zero-knowledge)
- **Comparator circuits**: Based on circomlib implementation
- **zkSDK ecosystem**: Part of the broader zkSDK toolkit

## Support

- **Documentation**: [zksdk.dev](https://zksdk.dev)
- **GitHub**: [zkThings/range-proof-evm](https://github.com/zksdkjs/range-proof-evm)
