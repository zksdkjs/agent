#!/bin/bash

# EXAMPLE WRITER - Creates unified interface examples

echo "📚 zkSDK Example Writer"
echo "======================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(cd "$SCRIPT_DIR/../.." && pwd)"

mkdir -p memory/examples

PROMPT="Create comprehensive usage examples for the zkSDK unified interface.

GOAL: Show developers how to use zkSDK as \"The LangChain of Privacy\"

CONTEXT:
- SDK Location: sdk/packages/
- Core SDK: sdk/packages/core/src/
- 5 Providers: Aztec, Railgun, Bitcoin, FHEVM, Light Protocol
- Examples Directory: sdk/examples/

TASK: Create these examples in sdk/examples/:

1. **basic-usage.ts** - Simple unified interface example
\`\`\`typescript
// Show how to:
// - Import zkSDK
// - Initialize with providers
// - Make a private transfer
// - Check balance
\`\`\`

2. **multi-chain.ts** - Cross-chain privacy example
\`\`\`typescript
// Show transfers on:
// - Ethereum (Railgun)
// - Aztec L2
// - Solana (Light Protocol)
\`\`\`

3. **advanced-privacy.ts** - Advanced privacy features
\`\`\`typescript
// Show:
// - Different privacy levels
// - FHE encryption (FHEVM)
// - Silent Payments (Bitcoin)
\`\`\`

4. **README.md** - Examples documentation
- How to run each example
- Prerequisites
- Expected output

PATTERN TO FOLLOW:
Look at existing examples in sdk/examples/aztec/ for the structure.

After creating examples:
1. Test each one works (or explain what's needed)
2. Save summary to memory/examples/session_$(date +%Y%m%d).md
3. List all created files

Let's make it easy for developers to use zkSDK!"

echo "Starting Goose example-writing session..."
echo ""

goose session start \
    --recipe .goose/recipes/main/recipe-developer.yaml \
    --prompt "$PROMPT"

echo ""
echo "✅ Examples created!"
echo "📁 Check: sdk/examples/"

