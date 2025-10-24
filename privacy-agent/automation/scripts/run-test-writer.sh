#!/bin/bash

# TEST WRITER - Uses Goose to write comprehensive tests for SDK

echo "🧪 zkSDK Test Writer"
echo "===================="
echo ""

cd /Users/saeeddawod/Desktop/agent/privacy-agent

# Create memory directory if it doesn't exist
mkdir -p memory/tester

# Check what needs tests
echo "Analyzing test coverage..."
echo ""

# Check each provider for tests
check_tests() {
    local provider=$1
    local test_file="sdk/packages/providers/$provider/src/__tests__/${provider}-provider.test.ts"
    
    if [ -f "$test_file" ]; then
        local lines=$(wc -l < "$test_file" 2>/dev/null || echo "0")
        echo "✅ $provider: Has tests ($lines lines)"
        return 0
    else
        echo "❌ $provider: NO TESTS"
        return 1
    fi
}

check_tests "bitcoin"
BITCOIN_TESTS=$?
check_tests "fhevm"
FHEVM_TESTS=$?
check_tests "light-protocol"
LIGHT_TESTS=$?

echo ""

# Determine what to test
if [ $BITCOIN_TESTS -ne 0 ]; then
    TARGET="bitcoin"
    PRIORITY="Bitcoin Silent Payments provider"
elif [ $FHEVM_TESTS -ne 0 ]; then
    TARGET="fhevm"
    PRIORITY="Zama fhEVM provider"
elif [ $LIGHT_TESTS -ne 0 ]; then
    TARGET="light-protocol"
    PRIORITY="Light Protocol provider"
else
    TARGET="integration"
    PRIORITY="Integration tests across all providers"
fi

echo "🎯 PRIORITY: Write tests for $PRIORITY"
echo ""

# Create continuation context
cat > memory/tester/current_task.md << EOF
# Test Writing Session
Started: $(date)
Target: $TARGET
Status: Writing comprehensive tests

## Context
- SDK has 5 providers: Aztec, Railgun, Bitcoin, FHEVM, Light Protocol
- Aztec and Railgun already have tests
- Need tests for: Bitcoin, FHEVM, Light Protocol

## Current Focus: $TARGET

## Provider Location
\`\`\`
sdk/packages/providers/$TARGET/src/
\`\`\`

## Existing Test Pattern (from Railgun)
\`\`\`
packages/providers/railgun/src/__tests__/railgun-provider.test.ts
\`\`\`

## Task
1. Study the provider implementation in sdk/packages/providers/$TARGET/src/
2. Look at existing test patterns in packages/providers/railgun/src/__tests__/
3. Write comprehensive tests covering:
   - Initialization
   - Transfer operations
   - Balance queries
   - Error handling
   - Edge cases
4. Aim for 90%+ coverage
5. Use Jest with ts-jest

## Requirements
- Test file: sdk/packages/providers/$TARGET/src/__tests__/${TARGET}-provider.test.ts
- Follow existing patterns
- Mock external dependencies
- Test both success and failure cases
EOF

echo "📝 Session context saved to memory/tester/current_task.md"
echo ""

# Create the prompt
PROMPT="I need to write comprehensive tests for the $TARGET provider.

CONTEXT FROM MEMORY:
$(cat memory/tester/current_task.md)

INSTRUCTIONS:
1. First, install Jest if not installed: cd sdk && npm install --save-dev jest @types/jest ts-jest
2. Create jest.config.js if missing
3. Study the provider at: sdk/packages/providers/$TARGET/src/
4. Look at existing test pattern: sdk/packages/providers/railgun/src/__tests__/railgun-provider.test.ts
5. Create comprehensive tests at: sdk/packages/providers/$TARGET/src/__tests__/${TARGET}-provider.test.ts
6. Run tests: cd sdk && npm test
7. Save summary to memory/tester/session_$(date +%Y%m%d_%H%M).md

Let's write high-quality tests!"

echo "Starting Goose test-writing session..."
echo ""

# Run Goose with the tester recipe
goose session start \
    --recipe .goose/recipes/main/recipe-tester.yaml \
    --prompt "$PROMPT"

echo ""
echo "✅ Test writing session complete!"
echo ""
echo "📊 Check results:"
echo "   - Tests: sdk/packages/providers/$TARGET/src/__tests__/"
echo "   - Session log: memory/tester/session_$(date +%Y%m%d)*.md"


