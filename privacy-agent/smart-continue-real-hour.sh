#!/bin/bash
# SMART SDK BUILDER - REAL 1 HOUR WITH PROPER SESSION MANAGEMENT

set -euo pipefail

echo "⏰ SMART SDK BUILDER - REAL 1 HOUR"
echo "==================================="
echo ""

# Function to count real lines in a provider
count_provider_lines() {
    local provider=$1
    local dir="sdk/packages/providers/$provider"
    if [[ -d "$dir/src" ]]; then
        find "$dir/src" -name "*.ts" -exec cat {} \; 2>/dev/null | wc -l | tr -d ' '
    else
        echo "0"
    fi
}

# Check actual implementation status
check_real_status() {
    echo "Checking existing progress..."
    
    local railgun_lines=$(count_provider_lines "railgun")
    local fhevm_lines=$(count_provider_lines "fhevm")
    local light_lines=$(count_provider_lines "light-protocol")
    local aztec_lines=$(count_provider_lines "aztec")
    
    # Display status
    if [[ $fhevm_lines -gt 500 ]]; then
        echo "✅ fhevm: IMPLEMENTED ($fhevm_lines lines)"
    elif [[ $fhevm_lines -gt 0 ]]; then
        echo "⚠️  fhevm: STARTED (only $fhevm_lines lines)"
    else
        echo "❌ fhevm: NOT STARTED"
    fi
    
    if [[ $railgun_lines -gt 500 ]]; then
        echo "✅ railgun: IMPLEMENTED ($railgun_lines lines)"
    elif [[ $railgun_lines -gt 0 ]]; then
        echo "⚠️  railgun: STARTED (only $railgun_lines lines)"
    else
        echo "❌ railgun: NOT STARTED"
    fi
    
    if [[ $light_lines -gt 100 ]]; then
        echo "✅ light-protocol: IMPLEMENTED ($light_lines lines)"
    elif [[ $light_lines -gt 0 ]]; then
        echo "⚠️  light-protocol: STARTED (only $light_lines lines)"
    else
        echo "❌ light-protocol: NOT STARTED"
    fi
    
    if [[ $aztec_lines -gt 100 ]]; then
        echo "✅ aztec: IMPLEMENTED ($aztec_lines lines)"
    elif [[ $aztec_lines -gt 0 ]]; then
        echo "⚠️  aztec: STARTED (only $aztec_lines lines)"
    else
        echo "❌ aztec: NOT STARTED"
    fi
    
    echo ""
}

# Update memory with current status
update_memory() {
    local focus=$1
    local session_time=$(date +%s)
    
    cat > memory/current_session.md << EOF
# CURRENT SESSION - $(date)
## FOCUS: $focus provider

## IMPLEMENTATION STATUS
$(check_real_status)

## SESSION GOAL
Complete the $focus provider implementation with:
- Full provider class with all methods
- Type definitions
- Tests
- Documentation

## DO NOT:
- Start over from scratch
- Check basic things like pwd, ls, README
- Work on other providers

## FILES TO CREATE/UPDATE:
- sdk/packages/providers/$focus/src/provider.ts
- sdk/packages/providers/$focus/src/types.ts
- sdk/packages/providers/$focus/src/index.ts
- sdk/packages/providers/$focus/src/__tests__/*.test.ts
EOF
}

# Determine what to work on
determine_priority() {
    local railgun_lines=$(count_provider_lines "railgun")
    local fhevm_lines=$(count_provider_lines "fhevm")
    local light_lines=$(count_provider_lines "light-protocol")
    local aztec_lines=$(count_provider_lines "aztec")
    
    # Priority order: incomplete work first
    if [[ $railgun_lines -gt 0 && $railgun_lines -lt 500 ]]; then
        echo "railgun"
    elif [[ $fhevm_lines -gt 0 && $fhevm_lines -lt 500 ]]; then
        echo "fhevm"
    elif [[ $light_lines -eq 0 ]]; then
        echo "light-protocol"
    elif [[ $aztec_lines -eq 0 ]]; then
        echo "aztec"
    else
        echo "railgun"  # Default
    fi
}

# Main execution
check_real_status

PRIORITY=$(determine_priority)
echo "🎯 PRIORITY: Complete $PRIORITY provider"
echo ""

# Update memory
update_memory "$PRIORITY"

# Set up the appropriate recipe
case $PRIORITY in
    "railgun")
        RECIPE="recipes/recipe-railgun-specialist.yaml"
        AGENT="railgun_specialist"
        ;;
    "fhevm")
        RECIPE="recipes/recipe-zama-fhe-specialist.yaml"
        AGENT="zama_fhe"
        ;;
    "light-protocol")
        RECIPE="recipes/recipe-light-protocol-specialist.yaml"
        AGENT="light_protocol"
        ;;
    "aztec")
        RECIPE="recipes/recipe-aztec-specialist.yaml"
        AGENT="aztec_l2"
        ;;
esac

echo "Starting 1-HOUR continuous session on: $PRIORITY"
echo "Will restart if agent stops before 1 hour"
echo ""

# Run for 1 hour with automatic restarts
END_TIME=$(($(date +%s) + 3600))
SESSION_NUM=1

while [[ $(date +%s) -lt $END_TIME ]]; do
    REMAINING=$((($END_TIME - $(date +%s)) / 60))
    echo "⏱️  Session #$SESSION_NUM - $REMAINING minutes remaining"
    echo "Starting agent..."
    
    # Use session manager for persistence
    ./session-manager.sh "$RECIPE" "$AGENT" 500 || true
    
    # Check if we made progress
    NEW_LINES=$(count_provider_lines "$PRIORITY")
    echo "Progress: $NEW_LINES lines in $PRIORITY"
    
    if [[ $(date +%s) -lt $END_TIME ]]; then
        echo "Agent stopped. Restarting in 5 seconds..."
        sleep 5
    fi
    
    SESSION_NUM=$((SESSION_NUM + 1))
done

echo ""
echo "✅ 1-hour session complete!"
echo "Final status:"
check_real_status