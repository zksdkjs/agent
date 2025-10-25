#!/bin/bash

echo "🚀 REAL CONTINUOUS SDK BUILDER"
echo "=============================="
echo ""

# Check real status first
echo "Current implementation status:"
echo "------------------------------"
find sdk/packages/providers -name "*.ts" -exec wc -l {} \; 2>/dev/null | grep -v "^[[:space:]]*0" | sort -rn | head -10
echo ""

# Work priorities
echo "🎯 Work Priority:"
echo "1. Complete Railgun (currently 196 lines)"
echo "2. Implement Privacy Cash (not started)"
echo "3. Implement Aztec (not started)"
echo ""

# Launch agent for 1 hour with high turns
echo "⏰ Starting 1-hour session..."
echo ""

END_TIME=$(($(date +%s) + 3600))
SESSION=1

while [ $(date +%s) -lt $END_TIME ]; do
    REMAINING=$((($END_TIME - $(date +%s)) / 60))
    
    echo "Session #$SESSION - $REMAINING minutes remaining"
    
    # Run with very high turn count so it doesn't stop
    goose run --recipe recipes/recipe-developer.yaml \
        --name "sdk_builder_${SESSION}" \
        --max-turns 500
    
    # Check if time is up
    if [ $(date +%s) -lt $END_TIME ]; then
        echo "Restarting in 5 seconds..."
        sleep 5
        SESSION=$((SESSION + 1))
    fi
done

echo ""
echo "✅ 1-hour session complete!"
echo ""
echo "Final status:"
find sdk/packages/providers -name "*.ts" -exec wc -l {} \; 2>/dev/null | sort -rn | head -10