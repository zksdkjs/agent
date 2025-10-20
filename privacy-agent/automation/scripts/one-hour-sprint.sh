#!/bin/bash

# zkSDK 1-HOUR FOCUSED SPRINT
# Builds ONE thing completely in 1 hour

echo "⚡ zkSDK 1-HOUR SPRINT"
echo "====================="
echo ""

# Kill old processes
pkill -f goose

# Create checkpoint file to track progress
CHECKPOINT_FILE="memory/sprint_checkpoint.md"
mkdir -p memory

# Check what's already done
echo "Checking existing progress..."
if [ -d "sdk/packages/providers/railgun/src" ]; then
    echo "✅ Railgun directory exists"
fi
if [ -d "sdk/packages/providers/fhevm/src" ]; then
    echo "✅ Zama fhEVM directory exists"
fi
if [ -d "sdk/packages/providers/light-protocol/src" ]; then
    echo "✅ Light Protocol directory exists"
fi

# Write checkpoint
cat > $CHECKPOINT_FILE << EOF
# Sprint Checkpoint - $(date)

## Already Completed:
$(ls -la sdk/packages/providers/*/src/ 2>/dev/null | grep -E "index.ts|provider.ts")

## This Sprint Focus:
1. Complete Railgun provider with REAL implementation
2. Add working tests
3. Create one working example

## Next Sprint:
- Zama fhEVM provider
- Light Protocol provider
EOF

echo ""
echo "🎯 SPRINT GOAL: Complete Railgun provider in 1 hour"
echo ""

# Run ONLY the most important agents for 1 hour
echo "Launching focused agents..."

# Railgun specialist - MAIN FOCUS
nohup goose run --recipe recipes/recipe-railgun-specialist.yaml \
    --name "railgun_sprint_$(date +%H%M)" \
    --max-turns 60 > logs/railgun_sprint.log 2>&1 &
RAILGUN_PID=$!

# Developer to help with integration
nohup goose run --recipe recipes/recipe-developer.yaml \
    --name "dev_sprint_$(date +%H%M)" \
    --max-turns 60 > logs/dev_sprint.log 2>&1 &
DEV_PID=$!

echo "✅ Sprint started with 2 focused agents:"
echo "   - Railgun specialist (PID: $RAILGUN_PID)"
echo "   - Developer helper (PID: $DEV_PID)"
echo ""
echo "⏱️  They will work for ~1 hour (60 turns each)"
echo ""
echo "📊 Monitor progress:"
echo "   tail -f logs/*_sprint.log"
echo ""
echo "🔍 Check what they build:"
echo "   watch -n 10 'find sdk/packages/providers/railgun -name \"*.ts\" | xargs wc -l'"
echo ""
echo "📝 Sprint checkpoint saved to: $CHECKPOINT_FILE"