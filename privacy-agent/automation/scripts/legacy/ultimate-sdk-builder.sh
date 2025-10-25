#!/bin/bash

# ULTIMATE SDK BUILDER - Guarantees progress
# Always continues from where you left off

echo "🚀 ULTIMATE zkSDK BUILDER"
echo "========================"
echo ""

# Create progress tracking file
PROGRESS_FILE="memory/build_progress.json"
mkdir -p memory

# Initialize progress if doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
    echo '{"railgun": "pending", "zama": "pending", "light": "pending", "aztec": "pending", "bitcoin": "pending"}' > $PROGRESS_FILE
fi

# Function to update progress
update_progress() {
    local provider=$1
    local status=$2
    # Update JSON file (requires jq - install with: brew install jq)
    if command -v jq &> /dev/null; then
        jq ".${provider} = \"${status}\"" $PROGRESS_FILE > tmp.json && mv tmp.json $PROGRESS_FILE
    fi
}

# Function to check lines of code
check_completion() {
    local provider=$1
    local dir="sdk/packages/providers/$provider"
    
    if [ ! -d "$dir/src" ]; then
        echo "not_started"
        return
    fi
    
    local total_lines=$(find $dir/src -name "*.ts" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
    
    if [ -z "$total_lines" ] || [ "$total_lines" -eq 0 ]; then
        echo "not_started"
    elif [ "$total_lines" -lt 100 ]; then
        echo "started"
    elif [ "$total_lines" -lt 500 ]; then
        echo "partial"
    else
        echo "complete"
    fi
}

# Check all providers
echo "📊 Checking current progress..."
echo "--------------------------------"

RAILGUN_STATUS=$(check_completion "railgun")
echo "Railgun: $RAILGUN_STATUS"
update_progress "railgun" "$RAILGUN_STATUS"

ZAMA_STATUS=$(check_completion "fhevm")
echo "Zama fhEVM: $ZAMA_STATUS"
update_progress "zama" "$ZAMA_STATUS"

LIGHT_STATUS=$(check_completion "light-protocol")
echo "Privacy Cash: $LIGHT_STATUS"
update_progress "light" "$LIGHT_STATUS"

AZTEC_STATUS=$(check_completion "aztec")
echo "Aztec: $AZTEC_STATUS"
update_progress "aztec" "$AZTEC_STATUS"

BITCOIN_STATUS=$(check_completion "bitcoin-privacy")
echo "Bitcoin: $BITCOIN_STATUS"
update_progress "bitcoin" "$BITCOIN_STATUS"

echo ""

# Determine priority
TARGET=""
RECIPE=""

if [ "$RAILGUN_STATUS" != "complete" ]; then
    TARGET="railgun"
    RECIPE="recipe-railgun-specialist.yaml"
elif [ "$ZAMA_STATUS" != "complete" ]; then
    TARGET="fhevm"
    RECIPE="recipe-zama-fhe-specialist.yaml"
elif [ "$LIGHT_STATUS" != "complete" ]; then
    TARGET="light-protocol"
    RECIPE="recipe-light-protocol-specialist.yaml"
elif [ "$AZTEC_STATUS" != "complete" ]; then
    TARGET="aztec"
    RECIPE="recipe-aztec-specialist.yaml"
elif [ "$BITCOIN_STATUS" != "complete" ]; then
    TARGET="bitcoin"
    RECIPE="recipe-bitcoin-privacy-specialist.yaml"
else
    echo "✅ ALL PROVIDERS COMPLETE! Running tests..."
    TARGET="tests"
    RECIPE="recipe-developer.yaml"
fi

echo "🎯 WORKING ON: $TARGET"
echo ""

# Save session info
cat > memory/current_session.md << EOF
# Current Session: $(date)
Target: $TARGET
Previous Status: $(eval echo \$${TARGET^^}_STATUS)

## What to build:
1. Check sdk/packages/providers/$TARGET/src/
2. Continue implementation
3. Add tests
4. Create examples

## Files that exist:
$(find sdk/packages/providers/$TARGET -name "*.ts" 2>/dev/null || echo "None yet")
EOF

# Run for 1 hour with auto-restart
echo "⏰ Running for 1 HOUR (will auto-restart if needed)"
echo ""

END_TIME=$(($(date +%s) + 3600))
SESSION_NUM=1

while [ $(date +%s) -lt $END_TIME ]; do
    REMAINING=$((($END_TIME - $(date +%s)) / 60))
    
    if [ $REMAINING -gt 0 ]; then
        echo "⏱️  Session #$SESSION_NUM | $REMAINING minutes left | Working on: $TARGET"
        
        # Run agent with high turn count
        goose run --recipe recipes/$RECIPE \
            --name "${TARGET}_s${SESSION_NUM}" \
            --max-turns 1000 > logs/${TARGET}_session.log 2>&1
        
        echo "Session ended. Checking if time remains..."
        SESSION_NUM=$((SESSION_NUM + 1))
        
        if [ $(date +%s) -lt $END_TIME ]; then
            echo "Restarting in 3 seconds..."
            sleep 3
        fi
    fi
done

echo ""
echo "✅ 1-HOUR SESSION COMPLETE!"
echo ""

# Final progress check
echo "📊 FINAL PROGRESS:"
echo "-----------------"
check_completion "railgun" && echo "Railgun: $(check_completion railgun)"
check_completion "fhevm" && echo "Zama: $(check_completion fhevm)"
check_completion "light-protocol" && echo "Light: $(check_completion light-protocol)"
check_completion "aztec" && echo "Aztec: $(check_completion aztec)"
check_completion "bitcoin-privacy" && echo "Bitcoin: $(check_completion bitcoin-privacy)"

echo ""
echo "📁 Check your work:"
echo "  ls -la sdk/packages/providers/*/src/"
echo ""
echo "📝 Progress saved to: $PROGRESS_FILE"
echo "📋 Session details: memory/current_session.md"