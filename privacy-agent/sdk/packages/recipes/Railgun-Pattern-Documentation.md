# Railgun Recipe→Step→ComboMeal Pattern Implementation

## Overview

This document describes the implementation of the Recipe→Step→ComboMeal pattern for Railgun EVM privacy transactions in zkSDK. This pattern provides a structured, composable approach to building complex privacy operations.

## Pattern Architecture

### Step
The fundamental building block representing a single atomic operation.

### Recipe
A sequence of steps that accomplish a specific privacy task.

### ComboMeal
A collection of recipes that can be executed together for complex operations.

## Implementation Details

### 1. Step Implementation

The `RailgunPrivateTransferStep` is the core step for executing private transfers:

```typescript
class RailgunPrivateTransferStep extends Step {
  async execute(input: RailgunPrivateTransferStepInput): Promise<RailgunPrivateTransferStepOutput>
}
```

Key features:
- Validates transfer parameters
- Executes private transfer using Railgun provider
- Tracks gas usage and fees
- Maintains context between steps

### 2. Recipe Implementation

Two main recipes are implemented:

#### RailgunPrivateTransferRecipe
Executes a single private transfer:

```typescript
class RailgunPrivateTransferRecipe extends Recipe {
  async execute(input: RailgunPrivateTransferRecipeInput)
}
```

#### RailgunBatchTransferRecipe
Executes multiple private transfers in a batch:

```typescript
class RailgunBatchTransferRecipe extends Recipe {
  async execute(input: RailgunBatchTransferRecipeInput)
}
```

### 3. ComboMeal Implementation

The `RailgunPrivacyOperationsComboMeal` combines multiple recipes:

```typescript
class RailgunPrivacyOperationsComboMeal extends ComboMeal {
  async execute(input: RailgunPrivacyOperationsComboMealInput)
}
```

## Gas Optimization

The pattern includes gas optimization features:
- Gas estimation for each step
- Aggregated gas estimation for recipes and combo meals
- Configurable gas limits for different operations

## Error Handling

The pattern provides comprehensive error handling:
- Input validation at each level
- Error aggregation and reporting
- Graceful degradation (continue execution when possible)

## Testing

Each component includes comprehensive tests:
- Unit tests for steps
- Integration tests for recipes
- End-to-end tests for combo meals

## Usage Examples

### Simple Private Transfer
```typescript
const recipe = new RailgunPrivateTransferRecipe(railgunProvider);
const result = await recipe.execute({
  network: 'ethereum',
  walletAddress: '0x...',
  transferParams: {
    token: '0x...',
    amount: '1000000',
    to: '0x...'
  }
});
```

### Batch Transfer
```typescript
const recipe = new RailgunBatchTransferRecipe(railgunProvider);
const result = await recipe.execute({
  network: 'polygon',
  walletAddress: '0x...',
  transfers: [
    { token: '0x...', amount: '1000000', to: '0x...' },
    { token: '0x...', amount: '2000000', to: '0x...' }
  ]
});
```

### ComboMeal Operations
```typescript
const comboMeal = new RailgunPrivacyOperationsComboMeal(railgunProvider);
const result = await comboMeal.execute({
  network: 'arbitrum',
  walletAddress: '0x...',
  operations: [
    { type: 'privateTransfer', params: { ... } },
    { type: 'batchTransfer', params: { ... } }
  ]
});
```

## Extensibility

The pattern is designed to be extensible:
- New steps can be created by extending the `Step` base class
- New recipes can be created by extending the `Recipe` base class
- New combo meals can be created by extending the `ComboMeal` base class

## Future Enhancements

Planned enhancements include:
- Advanced privacy features (e.g., mixing, staking)
- Cross-chain operations
- Smart contract interaction steps
- Advanced gas optimization strategies
