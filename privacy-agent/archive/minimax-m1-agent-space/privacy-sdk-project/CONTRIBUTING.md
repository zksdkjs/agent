# Contributing to Privacy SDK

We welcome contributions to the Privacy SDK! This document provides guidelines for contributing to the project.

## 🎯 Getting Started

### Prerequisites

- Node.js 16.0 or higher
- pnpm (recommended) or npm
- TypeScript 4.5 or higher
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/privacy-sdk.git
   cd privacy-sdk
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Build the SDK**
   ```bash
   cd packages/sdk
   pnpm build
   ```

4. **Run Tests**
   ```bash
   pnpm test
   ```

## 📋 Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages

We follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(recipes): add batch transfer recipe
fix(providers): resolve Railgun initialization issue
docs(api): update provider configuration examples
```

## 🧱 Project Structure

```
privacy-sdk/
├── packages/
│   ├── sdk/                 # Core SDK package
│   │   ├── src/
│   │   │   ├── core/        # Core SDK classes
│   │   │   ├── providers/   # Provider implementations
│   │   │   ├── recipes/     # Recipe implementations
│   │   │   ├── types/       # Type definitions
│   │   │   ├── utils/       # Utility functions
│   │   │   └── tests/       # Test files
│   │   └── package.json
│   └── website/             # Documentation website
├── examples/                # Usage examples
├── docs/                    # Architecture docs
└── README.md
```

## 🔧 Contributing Guidelines

### Code Style

- Use TypeScript for all code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable and function names
- Add JSDoc comments for public APIs

### Adding New Providers

1. **Create Provider Plugin**
   ```typescript
   // src/providers/new-provider-plugin.ts
   export class NewProviderPlugin extends BaseProviderPlugin {
     readonly name = 'new-provider';
     // Implementation...
   }
   ```

2. **Create Provider Implementation**
   ```typescript
   // src/providers/new-provider.ts
   export class NewProvider implements PrivacyProvider {
     // Implementation...
   }
   ```

3. **Add Configuration Types**
   ```typescript
   // src/types/plugin.ts
   export interface NewProviderConfig extends ProviderConfig {
     type: 'new-provider';
     // Provider-specific config...
   }
   ```

4. **Register Plugin**
   ```typescript
   // src/core/privacy-sdk.ts
   private registerBuiltInPlugins(): void {
     this.pluginRegistry.register(new NewProviderPlugin());
   }
   ```

5. **Add Tests**
   ```typescript
   // src/tests/new-provider.test.ts
   describe('NewProvider', () => {
     // Test implementation...
   });
   ```

### Adding New Recipes

1. **Create Recipe Class**
   ```typescript
   // src/recipes/new-recipe.ts
   export class NewRecipe extends BaseRecipe {
     readonly name = 'new_recipe';
     readonly supportedProviders = ['provider1', 'provider2'];
     // Implementation...
   }
   ```

2. **Register Recipe**
   ```typescript
   // src/recipes/index.ts
   private registerBuiltInRecipes(): void {
     this.register(new NewRecipe());
   }
   ```

3. **Add Recipe Interface**
   ```typescript
   // src/types/recipe.ts
   export interface NewRecipeParams extends RecipeParams {
     // Recipe-specific parameters...
   }
   ```

4. **Add Tests**
   ```typescript
   // src/tests/new-recipe.test.ts
   describe('NewRecipe', () => {
     // Test implementation...
   });
   ```

### Testing

- Write unit tests for all new functionality
- Maintain test coverage above 80%
- Use descriptive test names
- Mock external dependencies

```typescript
describe('PrivacySDK', () => {
  describe('constructor', () => {
    it('should create SDK instance with valid config', () => {
      const sdk = new PrivacySDK(validConfig);
      expect(sdk).toBeInstanceOf(PrivacySDK);
    });
  });
});
```

---

**Thank you for contributing to Privacy SDK! 🎉**