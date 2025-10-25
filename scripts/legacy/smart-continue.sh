#!/bin/bash

# SMART CONTINUATION SCRIPT
# Checks what's done and continues from there

echo "🧠 SMART SDK BUILDER"
echo "===================="
echo ""

# Function to check if provider is implemented
check_provider() {
    local provider=$1
    if [ -f "sdk/packages/providers/$provider/src/index.ts" ]; then
        local lines=$(wc -l < "sdk/packages/providers/$provider/src/index.ts" 2>/dev/null || echo "0")
        if [ "$lines" -gt "50" ]; then
            echo "✅ $provider: IMPLEMENTED ($lines lines)"
            return 0
        else
            echo "⚠️  $provider: STARTED (only $lines lines)"
            return 1
        fi
    else
        echo "❌ $provider: NOT STARTED"
        return 2
    fi
}

# Check each provider
echo "Checking existing progress..."
check_provider "railgun"
RAILGUN_STATUS=$?
check_provider "fhevm"
ZAMA_STATUS=$?
check_provider "light-protocol"
LIGHT_STATUS=$?
check_provider "aztec"
AZTEC_STATUS=$?

echo ""

# Decide what to work on
if [ $RAILGUN_STATUS -ne 0 ]; then
    echo "🎯 PRIORITY: Complete Railgun provider"
    TARGET="railgun"
    RECIPE="recipe-railgun-specialist.yaml"
elif [ $ZAMA_STATUS -ne 0 ]; then
    echo "🎯 PRIORITY: Complete Zama fhEVM provider"
    TARGET="zama"
    RECIPE="recipe-zama-fhe-specialist.yaml"
elif [ $LIGHT_STATUS -ne 0 ]; then
    echo "🎯 PRIORITY: Complete Privacy Cash provider"
    TARGET="light"
    RECIPE="recipe-light-protocol-specialist.yaml"
else
    echo "🎯 All providers done! Working on tests"
    TARGET="tests"
    RECIPE="recipe-developer.yaml"
fi

# Create continuation prompt
CONTINUE_PROMPT="Continue from current state. Check sdk/packages/providers/$TARGET for existing work. Don't start over - build on what's there."

# Save state
cat > memory/current_focus.md << EOF
# Current Focus: $TARGET
Started: $(date)
Status: Continuing existing work

## Files to check:
$(find sdk/packages/providers/$TARGET -name "*.ts" 2>/dev/null)

## Next steps:
1. Check existing implementation
2. Continue from where previous session stopped
3. Complete the provider
4. Add tests
EOF

echo ""
echo "Starting focused 1-hour session on: $TARGET"
echo ""

# Run the focused agent
nohup goose run --recipe recipes/$RECIPE \
    --name "${TARGET}_continue_$(date +%H%M)" \
    --max-turns 60 > logs/${TARGET}_continue.log 2>&1 &

echo "✅ Agent launched (PID: $!)"
echo ""
echo "📊 Monitor: tail -f logs/${TARGET}_continue.log"
echo "📁 Check: ls -la sdk/packages/providers/$TARGET/src/"