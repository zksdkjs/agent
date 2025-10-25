# zkSDK Recipes Package

Implementation of the Recipe→Step→ComboMeal pattern for privacy operations in zkSDK.

## Overview

The Recipe→Step→ComboMeal pattern is a structured approach to building complex privacy operations:

1. **Steps** - Individual atomic operations (e.g., private transfer, balance check)
2. **Recipes** - Sequences of steps that accomplish a specific privacy task (e.g., private transfer recipe)
3. **ComboMeals** - Collections of recipes that can be executed together (e.g., batch privacy operations)

## Architecture

```
ComboMeal
├── Recipe 1
│   ├── Step 1
│   ├── Step 2
│   └── Step 3
├── Recipe 2
│   ├── Step 1
│   └── Step 2
└── Recipe 3
    ├── Step 1
    ├── Step 2
    └── Step 3
```

## Components

### Step
The base unit of execution. Each step performs a single operation and returns a result.

```typescript
class Step {
  config: StepConfig;
  execute(input: StepInput): Promise<StepOutput>;
  estimateGas(input: StepInput): Promise<number>;
}
```

### Recipe
A sequence of steps that accomplish a specific privacy task.

```typescript
class Recipe {
  config: RecipeConfig;
  execute(input: RecipeInput): Promise<RecipeOutput>;
  estimateGas(input: RecipeInput): Promise<number>;
}
```

### ComboMeal
A collection of recipes that can be executed together.

```typescript
class ComboMeal {
  config: ComboMealConfig;
  execute(input: ComboMealInput): Promise<ComboMealOutput>;
  estimateGas(input: ComboMealInput): Promise<number>;
}
```

## Railgun Implementation

### RailgunPrivateTransferStep
Executes a single private transfer using Railgun.

### RailgunPrivateTransferRecipe
A recipe for executing private transfers using Railgun.

### RailgunBatchTransferRecipe
A recipe for executing multiple private transfers in a batch using Railgun.

### RailgunPrivacyOperationsComboMeal
A combo meal for executing multiple privacy operations using Railgun.

## Usage

```typescript
// Initialize Railgun provider
const railgunProvider = new RailgunProvider(config);

// Create a private transfer recipe
const recipe = new RailgunPrivateTransferRecipe(railgunProvider);

// Execute the recipe
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

## Testing

Run tests with:
```bash
npm test
```

## Building

Build the package with:
```bash
npm run build
```
